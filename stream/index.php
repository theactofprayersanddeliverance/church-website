<?php
require_once __DIR__ . '/config.php';
$state = getStreamState();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Live Stream | The Act of Prayers & Deliverance Ministries International</title>
  <link rel="icon" type="image/png" href="../logo.png">
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0C0C0D;
      --card: #17171A;
      --card-border: rgba(255, 255, 255, 0.1);
      --accent: #E8C25A;
      --danger: #EF4444;
      --text: #EDEDEA;
      --text-muted: #9E9E99;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Instrument Sans', sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; padding: 1rem; display: flex; flex-direction: column; }
    .container { max-width: 1100px; margin: 0 auto; width: 100%; }
    
    header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid var(--card-border); margin-bottom: 1.2rem; flex-wrap: wrap; gap: 0.8rem; }
    .logo-box { display: flex; align-items: center; gap: 0.8rem; text-decoration: none; color: #fff; }
    .logo-box img { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--accent); }
    
    .btn-give { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.4rem; border-radius: 999px; background: linear-gradient(135deg, #F59E0B, var(--accent)); color: #0C0C0D; font-weight: 700; text-decoration: none; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4); font-size: 0.94rem; }
    
    .player-wrap { width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 14px; overflow: hidden; position: relative; border: 1px solid var(--card-border); box-shadow: 0 20px 50px rgba(0,0,0,0.6); margin-bottom: 1.2rem; }
    .player-wrap img { width: 100%; height: 100%; object-fit: cover; }
    
    .live-badge { position: absolute; top: 14px; left: 14px; background: var(--danger); color: #fff; font-weight: 700; font-size: 0.8rem; padding: 0.3rem 0.75rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.4rem; z-index: 10; }
    .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #fff; animation: blink 1s infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    
    .info-card { background: var(--card); border: 1px solid var(--card-border); border-radius: 14px; padding: 1.4rem; }
    .info-card h1 { font-size: clamp(1.3rem, 2.8vw, 1.8rem); margin-bottom: 0.4rem; color: #fff; font-family: 'Newsreader', serif; font-weight: 400; }
    .info-meta { font-size: 0.9rem; color: var(--accent); margin-bottom: 0.8rem; }
    .info-desc { font-size: 0.95rem; color: #d4d4d0; line-height: 1.6; }
    
    /* Drop-down Offering */
    .offering-dropdown { background: #fff; color: #0C0C0D; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; border: 2px solid var(--accent); box-shadow: 0 15px 40px rgba(0,0,0,0.4); display: none; }
  </style>
</head>
<body>

<div class="container">
  <header>
    <a href="../" class="logo-box">
      <img src="../logo.png" alt="Logo">
      <div>
        <h2 style="font-size: 1.1rem; line-height: 1.2;">The Act of Prayers & Deliverance</h2>
        <span style="font-size: 0.78rem; color: var(--accent);">International Live Stream</span>
      </div>
    </a>

    <button class="btn-give" onclick="toggleOffering()">
      🪙 Give Offering
    </button>
  </header>

  <!-- Drop-Down Offering Panel -->
  <div id="offeringPanel" class="offering-dropdown">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
      <h3 style="font-size: 1.3rem;">🪙 Live Service Offering</h3>
      <button onclick="toggleOffering()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">✕</button>
    </div>
    <p style="font-size: 0.9rem; color: #555; margin-bottom: 1rem;">
      Pay your offering into the account below, then click I have paid. God will bless you!
    </p>
    <div style="background: #F4F4F2; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between;"><span>Bank:</span> <b>First Bank of Nigeria</b></div>
      <div style="display: flex; justify-content: space-between; margin-top: 0.4rem;"><span>Account Name:</span> <b>The Act of Prayers & Deliverance</b></div>
      <div style="display: flex; justify-content: space-between; margin-top: 0.4rem; font-size: 1.2rem; color: #B8935A; font-weight: 700;">
        <span>Account No:</span> <span>2034981275</span>
      </div>
    </div>
    <button onclick="alert('God will bless you! Thanks for your offering.'); toggleOffering();" style="width: 100%; padding: 0.85rem; background: #0C0C0D; color: #fff; font-weight: 600; border-radius: 8px; border: none; cursor: pointer;">
      I Have Paid My Offering
    </button>
  </div>

  <!-- Live Video Player -->
  <div class="player-wrap">
    <div id="liveBadge" class="live-badge" style="display: <?php echo $state['is_live'] ? 'inline-flex' : 'none'; ?>;">
      <span class="live-dot"></span> LIVE BROADCAST
    </div>

    <!-- Active Camera Frame Stream -->
    <img id="liveFeedImg" src="api.php?action=get_active_feed" onerror="this.src='../images/i1.jpg'" alt="Live Stream View">
  </div>

  <!-- Broadcast Details -->
  <div class="info-card">
    <h1 id="streamTitle"><?php echo htmlspecialchars($state['title']); ?></h1>
    <div class="info-meta">
      <span id="streamSpeaker">Speaker: <?php echo htmlspecialchars($state['speaker']); ?></span> &bull; 
      <span id="streamSubject">Subject: <?php echo htmlspecialchars($state['subject']); ?></span>
    </div>
    <p class="info-desc" id="streamNotice">
      <?php echo htmlspecialchars($state['notice_text'] ?: 'Welcome to our live service.'); ?>
    </p>
  </div>
</div>

<script>
  function toggleOffering() {
    const p = document.getElementById('offeringPanel');
    p.style.display = p.style.display === 'block' ? 'none' : 'block';
  }

  // Refresh feed frame every 120ms for smooth live motion
  const imgElem = document.getElementById('liveFeedImg');
  setInterval(() => {
    imgElem.src = 'api.php?action=get_active_feed&t=' + Date.now();
  }, 120);

  // Poll status every 4s
  setInterval(async () => {
    try {
      const res = await fetch('api.php?action=status&t=' + Date.now());
      const data = await res.json();
      if (data.success) {
        document.getElementById('streamTitle').textContent = data.title;
        document.getElementById('streamSpeaker').textContent = 'Speaker: ' + data.speaker;
        document.getElementById('streamSubject').textContent = 'Subject: ' + data.subject;
        document.getElementById('liveBadge').style.display = data.is_live ? 'inline-flex' : 'none';
      }
    } catch (e) {}
  }, 4000);
</script>

</body>
</html>
