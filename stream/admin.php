<?php
require_once __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Streaming Director Admin | The Act of Prayers & Deliverance Ministries</title>
  <link rel="icon" type="image/png" href="../logo.png">
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0C0C0D;
      --card: #17171A;
      --card-border: rgba(255, 255, 255, 0.1);
      --accent: #E8C25A;
      --accent-dark: #B8935A;
      --text: #EDEDEA;
      --text-muted: #9E9E99;
      --danger: #EF4444;
      --success: #10B981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Instrument Sans', sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; padding: 1.5rem; display: flex; flex-direction: column; }
    .container { max-width: 1200px; margin: 0 auto; width: 100%; }
    
    /* Login Box */
    .login-wrap { max-width: 420px; margin: 10vh auto 0; background: var(--card); border: 1px solid var(--card-border); border-radius: 16px; padding: 2.2rem; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
    .login-wrap h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #fff; }
    .login-wrap p { color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.5rem; }
    
    /* Inputs & Buttons */
    .fld { width: 100%; padding: 0.85rem 1rem; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid var(--card-border); color: #fff; font-size: 1rem; outline: none; margin-bottom: 1rem; }
    .fld:focus { border-color: var(--accent); }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.85rem 1.4rem; border-radius: 10px; font-weight: 600; font-size: 0.95rem; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-gold { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); color: #0C0C0D; }
    .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(232, 194, 90, 0.4); }
    .btn-danger { background: var(--danger); color: #fff; }
    .btn-success { background: var(--success); color: #fff; }
    .btn-outline { background: transparent; border: 1px solid var(--card-border); color: #fff; }
    .btn-outline:hover { background: rgba(255,255,255,0.08); }
    
    /* Header */
    .top-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--card-border); margin-bottom: 2rem; }
    .logo-area { display: flex; align-items: center; gap: 0.8rem; }
    .logo-area img { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--accent); }
    
    /* Main Grid */
    .director-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.8rem; }
    @media (max-width: 900px) { .director-grid { grid-template-columns: 1fr; } }
    
    .card { background: var(--card); border: 1px solid var(--card-border); border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .card-title { font-size: 1.15rem; font-weight: 600; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; }
    
    /* Camera Grid */
    .cam-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .cam-card { background: rgba(255,255,255,0.04); border: 1.5px solid var(--card-border); border-radius: 12px; overflow: hidden; position: relative; transition: all 0.25s; }
    .cam-card.on-air { border-color: var(--danger); box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); }
    .cam-preview { aspect-ratio: 16/9; background: #000; position: relative; display: flex; align-items: center; justify-content: center; }
    .cam-preview img { width: 100%; height: 100%; object-fit: cover; }
    .cam-info { padding: 0.9rem; }
    .cam-name { font-weight: 600; font-size: 0.92rem; margin-bottom: 0.3rem; }
    .cam-meta { font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between; }
    .badge-on-air { position: absolute; top: 8px; left: 8px; background: var(--danger); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase; animation: pulse 1.5s infinite; }
    
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
  </style>
</head>
<body>

<div class="container">
  <!-- LOGIN VIEW -->
  <div id="loginSection" class="login-wrap">
    <img src="../logo.png" alt="Logo" style="width: 70px; height: 70px; border-radius: 50%; border: 2px solid var(--accent); margin-bottom: 1rem;">
    <h1>Director Streaming Admin</h1>
    <p>The Act of Prayers & Deliverance Ministries</p>
    <form id="loginForm">
      <input type="password" id="adminPassInput" class="fld" placeholder="Enter Admin Password (12343)" required>
      <button type="submit" class="btn btn-gold" style="width: 100%;">Unlock Director Controls</button>
    </form>
    <div id="loginErr" style="color: var(--danger); font-size: 0.88rem; margin-top: 0.8rem; display: none;">Invalid password. Please enter 12343.</div>
  </div>

  <!-- DASHBOARD VIEW -->
  <div id="dashboardSection" style="display: none;">
    <!-- Top Bar -->
    <header class="top-bar">
      <div class="logo-area">
        <img src="../logo.png" alt="Logo">
        <div>
          <h2 style="font-size: 1.25rem;">Live Broadcast Director</h2>
          <span style="font-size: 0.84rem; color: var(--accent);">Pastor Israel Revelation Ministry</span>
        </div>
      </div>

      <div style="display: flex; gap: 0.8rem; align-items: center;">
        <button id="masterLiveBtn" class="btn btn-danger" onclick="toggleMasterLive()">
          <span id="liveDot" style="width: 10px; height: 10px; border-radius: 50%; background: #fff;"></span>
          <span id="liveBtnText">OFFLINE (Click to GO LIVE)</span>
        </button>
        <button class="btn btn-outline" onclick="logoutAdmin()">Logout</button>
      </div>
    </header>

    <div class="director-grid">
      <!-- Left Column: Camera Feeds & Director Switcher -->
      <div>
        <!-- Multi-Camera Switcher -->
        <div class="card">
          <div class="card-title">
            <span>📹 Multi-Camera Live Switcher (Director)</span>
            <span id="activeCamBadge" style="font-size: 0.85rem; color: var(--accent);">Active: Camera 1</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1rem;">
            Click <b>"SWITCH TO ON-AIR"</b> on any connected camera to change what live viewers see in real-time.
          </p>

          <div id="camerasGrid" class="cam-grid">
            <!-- Dynamically populated -->
          </div>
        </div>

        <!-- Add New Camera Device -->
        <div class="card">
          <div class="card-title">
            <span>➕ Add Camera / Android Webcam Device</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.86rem; margin-bottom: 0.9rem;">
            Register a new phone or camera angle into your director control desk.
          </p>
          <form id="addDeviceForm" style="display: grid; grid-template-columns: 1fr 1.2fr 1fr auto; gap: 0.8rem; align-items: end;">
            <div>
              <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Device ID</label>
              <input type="text" id="newDevId" class="fld" placeholder="e.g. cam-4" style="margin-bottom: 0;" required>
            </div>
            <div>
              <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Device Label / Name</label>
              <input type="text" id="newDevName" class="fld" placeholder="e.g. Camera 4 (Pulpit Zoom)" style="margin-bottom: 0;" required>
            </div>
            <div>
              <label style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Device Type</label>
              <select id="newDevType" class="fld" style="margin-bottom: 0;">
                <option value="android_webcam">Android Webcam</option>
                <option value="browser_cam">Browser Camera</option>
                <option value="ip_camera">IP Camera</option>
              </select>
            </div>
            <button type="submit" class="btn btn-gold" style="white-space: nowrap; height: 46px;">Add Camera</button>
          </form>
        </div>

        <!-- Android Camera Stream Link Helper -->
        <div class="card" style="background: rgba(232, 194, 90, 0.08); border-color: rgba(232, 194, 90, 0.3);">
          <h3 style="color: var(--accent); font-size: 1.05rem; margin-bottom: 0.5rem;">📱 Connect Android Phone Webcams</h3>
          <p style="font-size: 0.9rem; color: #d4d4d0; margin-bottom: 1rem;">
            Open the Camera Broadcaster page on your Android phone (or any webcam) to stream video & audio directly to this director panel:
          </p>
          <a href="camera.php" target="_blank" class="btn btn-gold" style="font-size: 0.88rem; padding: 0.65rem 1.2rem;">
            Open Android Camera Broadcaster (camera.php) ↗
          </a>
        </div>
      </div>

      <!-- Right Column: Broadcast Info & Connected Devices -->
      <div>
        <!-- Live Sermon Details -->
        <div class="card">
          <div class="card-title">
            <span>Broadcast Information</span>
          </div>
          <form id="broadcastInfoForm">
            <label style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Sermon / Service Title</label>
            <input type="text" id="streamTitle" class="fld" value="Sunday Worship and Deliverance Service">

            <label style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Subject / Theme</label>
            <input type="text" id="streamSubject" class="fld" value="The Mystery of Answered Prayers & Deliverance">

            <label style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Preacher / Speaker</label>
            <input type="text" id="streamSpeaker" class="fld" value="Pastor Israel Revelation">

            <label style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Banner Notice Text</label>
            <textarea id="streamNotice" class="fld" rows="2">Welcome to our live deliverance broadcast. Expect your miracle!</textarea>

            <button type="submit" class="btn btn-gold" style="width: 100%; padding: 0.75rem;">Save Broadcast Info</button>
          </form>
        </div>

        <!-- System & Database Status -->
        <div class="card">
          <div class="card-title">
            <span>System Status</span>
          </div>
          <div style="font-size: 0.88rem; color: var(--text-muted); display: grid; gap: 0.6rem;">
            <div>Database Mode: <b id="dbMode" style="color: #fff;">MySQL / JSON Fallback</b></div>
            <div>Active Viewers: <b id="viewersCount" style="color: var(--accent);">0 live</b></div>
            <div>Signaling Server: <b style="color: var(--success);">Operational</b></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  let adminToken = localStorage.getItem('stream_admin_token') || '';
  let streamState = { is_live: false, active_camera_id: 'cam-1', devices: [] };

  const loginSection = document.getElementById('loginSection');
  const dashboardSection = document.getElementById('dashboardSection');
  const loginForm = document.getElementById('loginForm');
  const loginErr = document.getElementById('loginErr');

  // Auto-login if token saved
  if (adminToken) {
    showDashboard();
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pass = document.getElementById('adminPassInput').value;
    try {
      const res = await fetch('api.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass })
      });
      const data = await res.json();
      if (data.success) {
        adminToken = data.token;
        localStorage.setItem('stream_admin_token', adminToken);
        showDashboard();
      } else {
        loginErr.style.display = 'block';
      }
    } catch (err) {
      if (pass === '12343') {
        adminToken = 'local_session_' + Date.now();
        localStorage.setItem('stream_admin_token', adminToken);
        showDashboard();
      } else {
        loginErr.style.display = 'block';
      }
    }
  });

  function showDashboard() {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    fetchStatus();
    setInterval(fetchStatus, 2500);
  }

  function logoutAdmin() {
    localStorage.removeItem('stream_admin_token');
    location.reload();
  }

  async function fetchStatus() {
    try {
      const res = await fetch('api.php?action=status&t=' + Date.now());
      const data = await res.json();
      if (data.success) {
        streamState = data;
        updateUI();
      }
    } catch (e) {}
  }

  function updateUI() {
    // Update master live button
    const btn = document.getElementById('masterLiveBtn');
    const txt = document.getElementById('liveBtnText');
    if (streamState.is_live) {
      btn.className = 'btn btn-success';
      txt.textContent = '● ON AIR (Click to END LIVE)';
    } else {
      btn.className = 'btn btn-danger';
      txt.textContent = 'OFFLINE (Click to GO LIVE)';
    }

    document.getElementById('activeCamBadge').textContent = 'Active: ' + (streamState.active_camera_id || 'cam-1');
    document.getElementById('viewersCount').textContent = (streamState.viewers_count || 0) + ' live';
    document.getElementById('dbMode').textContent = streamState.storage_mode === 'mysql' ? 'MySQL Database' : 'Direct Fast Storage';

    // Render cameras grid
    const grid = document.getElementById('camerasGrid');
    const devices = streamState.devices && streamState.devices.length ? streamState.devices : [
      { id: 'cam-1', name: 'Camera 1 (Main Altar)', status: 'online', resolution: '1080p' },
      { id: 'cam-2', name: 'Camera 2 (Side View)', status: 'offline', resolution: '1080p' }
    ];

    grid.innerHTML = devices.map(dev => {
      const isOnAir = (dev.id === streamState.active_camera_id);
      return `
        <div class="cam-card ${isOnAir ? 'on-air' : ''}">
          <div class="cam-preview">
            ${isOnAir ? '<span class="badge-on-air">● ON AIR</span>' : ''}
            <img src="api.php?action=get_active_feed&cam=${dev.id}&t=${Date.now()}" onerror="this.src='../images/i1.jpg'" alt="${dev.name}">
          </div>
          <div class="cam-info">
            <div class="cam-name">${dev.name}</div>
            <div class="cam-meta">
              <span>Status: <b style="color: ${dev.status === 'streaming' ? 'var(--success)' : dev.status === 'online' ? 'var(--accent)' : 'var(--text-muted)'}">${dev.status}</b></span>
              <span>${dev.resolution || '1080p'}</span>
            </div>
            <div style="margin-top: 0.8rem; display: flex; gap: 0.4rem;">
              <button class="btn ${isOnAir ? 'btn-danger' : 'btn-gold'}" style="flex: 1; padding: 0.5rem; font-size: 0.82rem;" onclick="switchCamera('${dev.id}')">
                ${isOnAir ? '● Currently on Air' : 'Switch to On-Air'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  async function toggleMasterLive() {
    const newLiveState = !streamState.is_live;
    await sendControlCommand({ is_live: newLiveState ? 1 : 0 });
    fetchStatus();
  }

  async function switchCamera(camId) {
    await sendControlCommand({ active_camera_id: camId });
    fetchStatus();
  }

  async function sendControlCommand(payload) {
    try {
      await fetch('api.php?action=admin_control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, password: '12343', token: adminToken })
      });
    } catch (e) {}
  }

  document.getElementById('broadcastInfoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await sendControlCommand({
      title: document.getElementById('streamTitle').value,
      subject: document.getElementById('streamSubject').value,
      speaker: document.getElementById('streamSpeaker').value,
      notice_text: document.getElementById('streamNotice').value
    });
    alert('Broadcast information updated successfully!');
    fetchStatus();
  });

  const addDeviceForm = document.getElementById('addDeviceForm');
  if (addDeviceForm) {
    addDeviceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const devId = document.getElementById('newDevId').value.trim();
      const devName = document.getElementById('newDevName').value.trim();
      const devType = document.getElementById('newDevType').value;
      if (!devId || !devName) return;

      await sendControlCommand({
        device_action: 'add',
        target_device_id: devId,
        device_name: devName,
        device_type: devType
      });
      document.getElementById('newDevId').value = '';
      document.getElementById('newDevName').value = '';
      alert('Camera device "' + devName + '" added successfully to Director Console!');
      fetchStatus();
    });
  }
</script>

</body>
</html>
