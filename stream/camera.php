<?php
require_once __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Android Camera Broadcaster | The Act of Prayers & Deliverance Ministries</title>
  <link rel="icon" type="image/png" href="../logo.png">
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0C0C0D;
      --card: #17171A;
      --card-border: rgba(255, 255, 255, 0.12);
      --accent: #E8C25A;
      --danger: #EF4444;
      --success: #10B981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Instrument Sans', sans-serif; }
    body { background: var(--bg); color: #fff; min-height: 100vh; padding: 1rem; display: flex; flex-direction: column; align-items: center; }
    .container { max-width: 600px; width: 100%; }
    
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.8rem; border-bottom: 1px solid var(--card-border); }
    .header h2 { font-size: 1.15rem; }
    
    .video-box { width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 14px; overflow: hidden; position: relative; border: 2px solid var(--card-border); margin-bottom: 1.2rem; }
    .video-box video { width: 100%; height: 100%; object-fit: cover; }
    
    .on-air-banner { position: absolute; top: 12px; left: 12px; background: var(--danger); color: #fff; font-weight: 700; font-size: 0.85rem; padding: 0.35rem 0.8rem; border-radius: 6px; display: none; animation: pulse 1s infinite; z-index: 10; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    
    .card { background: var(--card); border: 1px solid var(--card-border); border-radius: 14px; padding: 1.2rem; margin-bottom: 1rem; }
    .fld { width: 100%; padding: 0.75rem 0.9rem; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid var(--card-border); color: #fff; font-size: 0.92rem; outline: none; margin-bottom: 0.8rem; }
    
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.95rem; border-radius: 10px; font-weight: 700; font-size: 1.05rem; cursor: pointer; border: none; }
    .btn-gold { background: linear-gradient(135deg, #F59E0B, #E8C25A); color: #0C0C0D; }
    .btn-stop { background: var(--danger); color: #fff; }
    
    .stats { display: flex; justify-content: space-between; font-size: 0.82rem; color: #9E9E99; margin-top: 0.6rem; }
  </style>
</head>
<body>

<div class="container">
  <div class="header">
    <div style="display: flex; align-items: center; gap: 0.6rem;">
      <img src="../logo.png" alt="Logo" style="width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--accent);">
      <div>
        <h2>Android Camera Broadcaster</h2>
        <span style="font-size: 0.75rem; color: var(--accent);">The Act of Prayers & Deliverance</span>
      </div>
    </div>
    <span id="connStatus" style="font-size: 0.8rem; color: #9E9E99;">Ready</span>
  </div>

  <!-- Video Viewfinder -->
  <div class="video-box">
    <span id="onAirBadge" class="on-air-banner">● YOU ARE ON AIR</span>
    <video id="webcamVideo" autoplay playsinline muted></video>
    <canvas id="frameCanvas" style="display: none;"></canvas>
  </div>

  <!-- Camera Controls Card -->
  <div class="card">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 0.8rem;">
      <div>
        <label style="font-size: 0.8rem; color: #9E9E99; display: block; margin-bottom: 0.2rem;">Select Camera Slot</label>
        <select id="deviceSlotSelect" class="fld">
          <option value="cam-1">Camera 1 (Main Altar)</option>
          <option value="cam-2">Camera 2 (Audience / Side)</option>
          <option value="cam-3">Camera 3 (Choir / Wide)</option>
        </select>
      </div>

      <div>
        <label style="font-size: 0.8rem; color: #9E9E99; display: block; margin-bottom: 0.2rem;">Lens Direction</label>
        <select id="facingModeSelect" class="fld">
          <option value="environment">Back Camera (Main)</option>
          <option value="user">Front Camera (Selfie)</option>
        </select>
      </div>
    </div>

    <button id="startBtn" class="btn btn-gold" onclick="toggleBroadcast()">
      📹 START CAMERA BROADCAST
    </button>

    <div class="stats">
      <span>FPS: <b id="fpsCount" style="color: #fff;">0</b></span>
      <span>Battery: <b id="batteryCount" style="color: var(--accent);">--</b></span>
      <span>Resolution: <b id="resText" style="color: #fff;">1080p</b></span>
    </div>
  </div>
</div>

<script>
  let isBroadcasting = false;
  let mediaStream = null;
  let broadcastInterval = null;
  let heartbeatInterval = null;
  let framesSent = 0;
  let lastFpsTime = Date.now();

  const videoElem = document.getElementById('webcamVideo');
  const canvasElem = document.getElementById('frameCanvas');
  const ctx = canvasElem.getContext('2d');
  const startBtn = document.getElementById('startBtn');
  const onAirBadge = document.getElementById('onAirBadge');
  const connStatus = document.getElementById('connStatus');

  // Monitor Battery
  if (navigator.getBattery) {
    navigator.getBattery().then(bat => {
      document.getElementById('batteryCount').textContent = Math.round(bat.level * 100) + '%';
      bat.addEventListener('levelchange', () => {
        document.getElementById('batteryCount').textContent = Math.round(bat.level * 100) + '%';
      });
    });
  }

  async function toggleBroadcast() {
    if (isBroadcasting) {
      stopBroadcast();
    } else {
      await startBroadcast();
    }
  }

  async function startBroadcast() {
    const facingMode = document.getElementById('facingModeSelect').value;
    const deviceId = document.getElementById('deviceSlotSelect').value;

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 24 }
        },
        audio: true
      });

      videoElem.srcObject = mediaStream;
      isBroadcasting = true;

      startBtn.className = 'btn btn-stop';
      startBtn.textContent = '⏹ STOP BROADCASTING';
      connStatus.textContent = '● Streaming Live';
      connStatus.style.color = 'var(--success)';

      canvasElem.width = 640;
      canvasElem.height = 360;

      // Register device
      await fetch('api.php?action=device_register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceId,
          device_name: document.getElementById('deviceSlotSelect').options[document.getElementById('deviceSlotSelect').selectedIndex].text,
          status: 'streaming',
          resolution: '720p HD'
        })
      });

      // Frame push loop (15-20 FPS)
      broadcastInterval = setInterval(sendFrame, 70);

      // Heartbeat loop
      heartbeatInterval = setInterval(sendHeartbeat, 3000);

    } catch (err) {
      alert('Camera permission denied or camera not accessible: ' + err.message);
    }
  }

  function stopBroadcast() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
    }
    clearInterval(broadcastInterval);
    clearInterval(heartbeatInterval);
    isBroadcasting = false;

    startBtn.className = 'btn btn-gold';
    startBtn.textContent = '📹 START CAMERA BROADCAST';
    connStatus.textContent = 'Stopped';
    connStatus.style.color = '#9E9E99';
    onAirBadge.style.display = 'none';

    // Set device offline
    const deviceId = document.getElementById('deviceSlotSelect').value;
    fetch('api.php?action=device_heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device_id: deviceId, status: 'offline' })
    });
  }

  function sendFrame() {
    if (!isBroadcasting || videoElem.videoWidth === 0) return;

    ctx.drawImage(videoElem, 0, 0, canvasElem.width, canvasElem.height);
    const jpegBase64 = canvasElem.toDataURL('image/jpeg', 0.65);
    const deviceId = document.getElementById('deviceSlotSelect').value;

    fetch('api.php?action=device_frame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: deviceId,
        frame: jpegBase64
      })
    }).then(res => res.json()).then(data => {
      if (data.is_active_camera && data.is_live) {
        onAirBadge.style.display = 'block';
      } else {
        onAirBadge.style.display = 'none';
      }
    }).catch(() => {});

    framesSent++;
    const now = Date.now();
    if (now - lastFpsTime >= 1000) {
      document.getElementById('fpsCount').textContent = framesSent;
      framesSent = 0;
      lastFpsTime = now;
    }
  }

  function sendHeartbeat() {
    const deviceId = document.getElementById('deviceSlotSelect').value;
    const battery = document.getElementById('batteryCount').textContent;
    fetch('api.php?action=device_heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: deviceId,
        status: isBroadcasting ? 'streaming' : 'online',
        battery: battery
      })
    });
  }
</script>

</body>
</html>
