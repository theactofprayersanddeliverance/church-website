export interface AlarmReminder {
  id: string;
  title: string;
  timeStr: string;
  targetTimestamp: number;
  createdTime: string;
  active: boolean;
}

const STORAGE_KEY = 'act_of_prayers_alarms';

export function getStoredAlarms(): AlarmReminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAlarm(alarm: AlarmReminder): void {
  const existing = getStoredAlarms();
  const updated = [...existing.filter((a) => a.id !== alarm.id), alarm];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Request notification permission if available
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  }
  return false;
}

// Play pleasant chime alarm audio
export function playAlarmChime(): void {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  } catch (e) {
    console.warn('AudioContext chime error', e);
  }
}

// Schedule browser timer / notification
export function scheduleAlarmTimer(
  title: string,
  delayMs: number
): AlarmReminder {
  const id = `alarm-${Date.now()}`;
  const targetTimestamp = Date.now() + Math.max(delayMs, 1000);
  const timeStr = new Date(targetTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const alarm: AlarmReminder = {
    id,
    title,
    timeStr,
    targetTimestamp,
    createdTime: new Date().toISOString(),
    active: true
  };

  saveAlarm(alarm);

  // Request notification permission in background
  requestNotificationPermission();

  // Set timeout
  setTimeout(() => {
    playAlarmChime();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 Act of Prayers Ministry Reminder', {
        body: title,
        icon: 'images/logo.png',
        badge: 'images/logo.png'
      });
    } else {
      alert(`🔔 REMINDER ALARM: ${title}`);
    }
  }, Math.max(delayMs, 1000));

  return alarm;
}

// Generate and download .ics calendar invite file for Android / iPhone Calendar
export function downloadCalendarInvite(title: string, dateStr: string, description: string): void {
  const nowStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Act of Prayers Ministry//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@actofprayers.org`,
    `DTSTAMP:${nowStr}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:The Act of Prayers and Deliverance Ministries International`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
