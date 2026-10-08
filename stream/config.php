<?php
/**
 * The Act of Prayers and Deliverance Ministries International
 * Streaming Server Configuration & Database Connection
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// -----------------------------------------------------------------------------
// Database Credentials
// Update these with your MySQL database details once created in cPanel
// -----------------------------------------------------------------------------
define('DB_HOST', getenv('STREAM_DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('STREAM_DB_NAME') ?: 'linexwar_stream');
define('DB_USER', getenv('STREAM_DB_USER') ?: 'linexwar_streamuser');
define('DB_PASS', getenv('STREAM_DB_PASS') ?: '');

// Admin Password requested by user: 12343
define('ADMIN_PASSWORD', '12343');

// File fallback path if MySQL connection is still pending setup
define('FALLBACK_STATE_FILE', __DIR__ . '/stream_state.json');

/**
 * Returns PDO database connection or null if not yet configured
 */
function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    if (!defined('DB_NAME') || empty(DB_NAME) || DB_NAME === 'linexwar_stream' && empty(DB_PASS)) {
        // Fallback to file storage if DB not yet configured
        return null;
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 3
        ]);
        return $pdo;
    } catch (Exception $e) {
        // Fallback gracefully to file mode if MySQL connection fails
        return null;
    }
}

/**
 * Helper to get stream state (from DB or fallback JSON file)
 */
function getStreamState() {
    $db = getDbConnection();
    if ($db) {
        try {
            $stmt = $db->query("SELECT * FROM stream_settings WHERE id = 1 LIMIT 1");
            $settings = $stmt->fetch();
            if ($settings) {
                // Fetch devices
                $devStmt = $db->query("SELECT id, name, device_type, status, resolution, battery_level, last_heartbeat FROM stream_devices");
                $devices = $devStmt->fetchAll();
                
                // Active camera frame or signal
                $activeCamId = $settings['active_camera_id'];
                $frameStmt = $db->prepare("SELECT last_frame, signal_data FROM stream_devices WHERE id = ? LIMIT 1");
                $frameStmt->execute([$activeCamId]);
                $camRow = $frameStmt->fetch();

                return [
                    'is_live' => (bool)$settings['is_live'],
                    'active_camera_id' => $settings['active_camera_id'],
                    'title' => $settings['title'],
                    'subject' => $settings['subject'],
                    'speaker' => $settings['speaker'],
                    'active_source_type' => $settings['active_source_type'],
                    'viewers_count' => (int)$settings['viewers_count'],
                    'notice_text' => $settings['notice_text'],
                    'devices' => $devices,
                    'active_frame' => $camRow ? $camRow['last_frame'] : null,
                    'active_signal' => $camRow ? $camRow['signal_data'] : null,
                    'storage_mode' => 'mysql'
                ];
            }
        } catch (Exception $e) {
            // Fallthrough to file mode
        }
    }

    // File-based state storage
    if (file_exists(FALLBACK_STATE_FILE)) {
        $data = json_decode(file_get_contents(FALLBACK_STATE_FILE), true);
        if ($data) {
            $data['storage_mode'] = 'file';
            return $data;
        }
    }

    // Default seed state
    return [
        'is_live' => false,
        'active_camera_id' => 'cam-1',
        'title' => 'Sunday Worship and Deliverance Service',
        'subject' => 'The Mystery of Answered Prayers & Deliverance',
        'speaker' => 'Pastor Israel Revelation',
        'active_source_type' => 'device_cam',
        'viewers_count' => 0,
        'notice_text' => 'Live broadcast will start shortly. Connect camera devices from admin.',
        'devices' => [
            ['id' => 'cam-1', 'name' => 'Camera 1 (Main Altar / Pulpit)', 'device_type' => 'android_webcam', 'status' => 'offline', 'resolution' => '1080p', 'battery_level' => '100%'],
            ['id' => 'cam-2', 'name' => 'Camera 2 (Audience / Side Angle)', 'device_type' => 'android_webcam', 'status' => 'offline', 'resolution' => '1080p', 'battery_level' => '100%'],
            ['id' => 'cam-3', 'name' => 'Camera 3 (Choir / Sanctuary Wide)', 'device_type' => 'browser_cam', 'status' => 'offline', 'resolution' => '720p', 'battery_level' => '100%']
        ],
        'active_frame' => null,
        'active_signal' => null,
        'storage_mode' => 'file'
    ];
}

/**
 * Helper to save stream state
 */
function saveStreamState($state) {
    $db = getDbConnection();
    if ($db) {
        try {
            $stmt = $db->prepare("UPDATE stream_settings SET is_live = ?, active_camera_id = ?, title = ?, subject = ?, speaker = ?, viewers_count = ?, notice_text = ? WHERE id = 1");
            $stmt->execute([
                $state['is_live'] ? 1 : 0,
                $state['active_camera_id'] ?? 'cam-1',
                $state['title'] ?? '',
                $state['subject'] ?? '',
                $state['speaker'] ?? '',
                $state['viewers_count'] ?? 0,
                $state['notice_text'] ?? ''
            ]);
            return true;
        } catch (Exception $e) {
            // Fallthrough to file mode
        }
    }

    // Save to file
    file_put_contents(FALLBACK_STATE_FILE, json_encode($state, JSON_PRETTY_PRINT));
    return true;
}
