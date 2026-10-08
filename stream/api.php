<?php
/**
 * The Act of Prayers and Deliverance Ministries International
 * Core Streaming API Endpoint
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? $_POST['action'] ?? 'status';

// Read raw JSON input if sent
$rawInput = file_get_contents('php://input');
$jsonBody = json_decode($rawInput, true) ?: [];

// Merge GET, POST and JSON inputs
$request = array_merge($_GET, $_POST, $jsonBody);

switch ($action) {
    // -------------------------------------------------------------------------
    // 1. PUBLIC STREAM STATUS (Used by website & video player)
    // -------------------------------------------------------------------------
    case 'status':
        $state = getStreamState();
        echo json_encode([
            'success' => true,
            'is_live' => $state['is_live'],
            'active_camera_id' => $state['active_camera_id'],
            'title' => $state['title'],
            'subject' => $state['subject'],
            'speaker' => $state['speaker'],
            'active_source_type' => $state['active_source_type'],
            'viewers_count' => $state['viewers_count'],
            'notice_text' => $state['notice_text'],
            'devices' => $state['devices'],
            'storage_mode' => $state['storage_mode'] ?? 'file',
            'timestamp' => time()
        ]);
        break;

    // -------------------------------------------------------------------------
    // 2. ADMIN LOGIN (Password: 12343)
    // -------------------------------------------------------------------------
    case 'login':
        $password = $request['password'] ?? '';
        if ($password === ADMIN_PASSWORD) {
            $token = bin2hex(random_bytes(16));
            // Save admin session token in file/state
            $state = getStreamState();
            $state['admin_token'] = $token;
            $state['admin_token_expiry'] = time() + 86400; // 24 hours
            saveStreamState($state);

            echo json_encode([
                'success' => true,
                'message' => 'Admin authenticated successfully',
                'token' => $token
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid admin password'
            ]);
        }
        break;

    // -------------------------------------------------------------------------
    // 3. ADMIN DIRECTOR CONTROLS (Toggle live, switch camera, update info)
    // -------------------------------------------------------------------------
    case 'admin_control':
        $password = $request['password'] ?? '';
        $token = $request['token'] ?? '';
        $state = getStreamState();

        $authorized = ($password === ADMIN_PASSWORD) || 
                      (!empty($token) && isset($state['admin_token']) && $state['admin_token'] === $token);

        if (!$authorized) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        // Toggle Live status
        if (isset($request['is_live'])) {
            $state['is_live'] = (bool)$request['is_live'];
        }

        // Switch active camera (Camera Director switcher!)
        if (isset($request['active_camera_id']) && !empty($request['active_camera_id'])) {
            $state['active_camera_id'] = $request['active_camera_id'];
        }

        // Update sermon details
        if (isset($request['title'])) $state['title'] = $request['title'];
        if (isset($request['subject'])) $state['subject'] = $request['subject'];
        if (isset($request['speaker'])) $state['speaker'] = $request['speaker'];
        if (isset($request['notice_text'])) $state['notice_text'] = $request['notice_text'];

        // Camera device management
        if (isset($request['device_action']) && isset($request['target_device_id'])) {
            $devId = $request['target_device_id'];
            $devAction = $request['device_action']; // 'set_online', 'set_offline', 'add'
            
            $found = false;
            foreach ($state['devices'] as &$dev) {
                if ($dev['id'] === $devId) {
                    if ($devAction === 'set_online') $dev['status'] = 'online';
                    if ($devAction === 'set_offline') $dev['status'] = 'offline';
                    $found = true;
                    break;
                }
            }
            if (!$found && $devAction === 'add') {
                $state['devices'][] = [
                    'id' => $devId,
                    'name' => $request['device_name'] ?? "Camera " . (count($state['devices']) + 1),
                    'device_type' => $request['device_type'] ?? 'android_webcam',
                    'status' => 'online',
                    'resolution' => '1080p',
                    'battery_level' => '100%'
                ];
            }
        }

        saveStreamState($state);

        echo json_encode([
            'success' => true,
            'message' => 'Control command executed',
            'state' => [
                'is_live' => $state['is_live'],
                'active_camera_id' => $state['active_camera_id'],
                'title' => $state['title'],
                'speaker' => $state['speaker'],
                'devices' => $state['devices']
            ]
        ]);
        break;

    // -------------------------------------------------------------------------
    // 4. DEVICE REGISTRATION / HEARTBEAT (Android Webcams & Cameras)
    // -------------------------------------------------------------------------
    case 'device_register':
    case 'device_heartbeat':
        $deviceId = $request['device_id'] ?? 'cam-1';
        $deviceName = $request['device_name'] ?? 'Android Webcam';
        $status = $request['status'] ?? 'online';
        $battery = $request['battery'] ?? '100%';
        $resolution = $request['resolution'] ?? '1080p';

        $state = getStreamState();
        $deviceExists = false;

        foreach ($state['devices'] as &$dev) {
            if ($dev['id'] === $deviceId) {
                $dev['status'] = $status;
                $dev['battery_level'] = $battery;
                $dev['resolution'] = $resolution;
                $dev['last_heartbeat'] = time();
                $deviceExists = true;
                break;
            }
        }

        if (!$deviceExists) {
            $state['devices'][] = [
                'id' => $deviceId,
                'name' => $deviceName,
                'device_type' => $request['device_type'] ?? 'android_webcam',
                'status' => $status,
                'battery_level' => $battery,
                'resolution' => $resolution,
                'last_heartbeat' => time()
            ];
        }

        saveStreamState($state);

        echo json_encode([
            'success' => true,
            'is_live' => $state['is_live'],
            'is_active_camera' => ($state['active_camera_id'] === $deviceId),
            'active_camera_id' => $state['active_camera_id']
        ]);
        break;

    // -------------------------------------------------------------------------
    // 5. CAMERA FRAME PUSH (High-speed camera snapshot streaming)
    // -------------------------------------------------------------------------
    case 'device_frame':
        $deviceId = $request['device_id'] ?? 'cam-1';
        $frame = $request['frame'] ?? ''; // base64 JPEG image data

        if (!empty($frame)) {
            // Save frame in separate file per camera for high performance
            $frameFile = __DIR__ . '/frame_' . preg_replace('/[^a-zA-Z0-9_-]/', '', $deviceId) . '.jpg';
            
            // Clean base64 header if present
            if (strpos($frame, ',') !== false) {
                $frame = explode(',', $frame)[1];
            }
            $decoded = base64_decode($frame);
            if ($decoded) {
                file_put_contents($frameFile, $decoded);
            }

            // Also update device status to streaming
            $state = getStreamState();
            foreach ($state['devices'] as &$dev) {
                if ($dev['id'] === $deviceId) {
                    $dev['status'] = 'streaming';
                    $dev['last_heartbeat'] = time();
                    break;
                }
            }
            // Update active frame if this camera is the active on-air camera
            if ($state['active_camera_id'] === $deviceId) {
                $state['last_frame_time'] = time();
            }
            saveStreamState($state);

            echo json_encode([
                'success' => true,
                'is_active_camera' => ($state['active_camera_id'] === $deviceId),
                'is_live' => $state['is_live']
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Empty frame']);
        }
        break;

    // -------------------------------------------------------------------------
    // 6. GET ACTIVE FEED (For web viewer video players & director previews)
    // -------------------------------------------------------------------------
    case 'get_active_feed':
        $state = getStreamState();
        $targetCam = $_GET['cam'] ?? $request['cam'] ?? $state['active_camera_id'] ?? 'cam-1';
        $frameFile = __DIR__ . '/frame_' . preg_replace('/[^a-zA-Z0-9_-]/', '', $targetCam) . '.jpg';

        if (file_exists($frameFile) && (time() - filemtime($frameFile) < 30)) {
            header('Content-Type: image/jpeg');
            header('Cache-Control: no-cache, no-store, must-revalidate');
            header('Pragma: no-cache');
            header('Expires: 0');
            readfile($frameFile);
            exit;
        } else {
            // Return placeholder or 404
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'No active feed for ' . htmlspecialchars($targetCam)]);
            exit;
        }
        break;

    // -------------------------------------------------------------------------
    // 7. VIEWER PING / STATS
    // -------------------------------------------------------------------------
    case 'viewer_ping':
        $state = getStreamState();
        // Increment or calculate viewer count
        $state['viewers_count'] = max(1, ($state['viewers_count'] ?? 0) + 1);
        saveStreamState($state);

        echo json_encode([
            'success' => true,
            'viewers_count' => $state['viewers_count'],
            'is_live' => $state['is_live']
        ]);
        break;

    // -------------------------------------------------------------------------
    // DEFAULT
    // -------------------------------------------------------------------------
    default:
        echo json_encode([
            'success' => false,
            'message' => 'Unknown action: ' . htmlspecialchars($action)
        ]);
        break;
}
