import { ServiceItem } from '../types';

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function fmtTime(t: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const hour12 = ((h + 11) % 12 + 1);
  const min = String(m || 0).padStart(2, "0");
  const ampm = h < 12 ? "AM" : "PM";
  return `${hour12}:${min} ${ampm}`;
}

export function fmtDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return iso;
  }
}

export function fmtShort(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return iso;
  }
}

export function getNextService(list: ServiceItem[]): ServiceItem & { date: Date } {
  const now = new Date();
  let best: (ServiceItem & { date: Date }) | null = null;

  list.forEach(s => {
    const [h, m] = s.time.split(":").map(Number);
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    d.setDate(d.getDate() + ((s.day - now.getDay() + 7) % 7));
    if (d < now) {
      d.setDate(d.getDate() + 7);
    }
    if (!best || d < best.date) {
      best = { ...s, date: d };
    }
  });

  return best || { ...list[0], date: now };
}

export const TONES = [
  ["#4a4033", "#17171a"],
  ["#2b2d30", "#121214"],
  ["#5b4c36", "#17171a"],
  ["#3a3f4a", "#14151a"]
];
