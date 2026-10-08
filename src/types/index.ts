export interface SiteInfo {
  name: string;
  short: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  logoImage?: string;
}

export interface PastorInfo {
  name: string;
  title: string;
  photoUrl: string;
  bio: string[];
  coupleTitle: string;
  coupleNames: string;
  couplePhotoUrl: string;
  coupleBio: string[];
}

export interface ServiceItem {
  id: number;
  name: string;
  day: number; // 0 = Sunday, 1 = Monday, etc.
  time: string; // "09:00"
  venue: string;
}

export interface EventItem {
  id: number;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string;
  venue: string;
  info: string;
}

export interface SpecialVigil {
  id: number;
  title: string;
  subtitle?: string;
  schedule: string;
  time: string;
  venue: string;
  info: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface StreamDevice {
  id: string;
  name: string;
  device_type: string;
  status: 'online' | 'offline' | 'streaming';
  resolution?: string;
  battery_level?: string;
  last_heartbeat?: number;
}

export interface LiveStreamStatus {
  is_live: boolean;
  active_camera_id: string;
  title: string;
  subject: string;
  speaker: string;
  active_source_type: string;
  viewers_count: number;
  notice_text?: string;
  devices: StreamDevice[];
}

export interface VideoItem {
  id: number;
  title: string;
  subject: string;
  speaker: string;
  category: string;
  date: string;
  duration: string;
  youtubeId: string;
  thumbUrl: string;
  description: string;
}

export interface TestimonyItem {
  id: number;
  name: string;
  title: string;
  summary: string;
  date: string;
  youtubeId: string;
}

export interface BookItem {
  id: number;
  title: string;
  sub: string;
  color: string;
  link: string;
}

export interface GiveMethod {
  id: number;
  label: string;
  detail: string;
  url: string;
}

export interface LiveState {
  isLive: boolean;
  title: string;
  subject: string;
  speaker: string;
  youtubeId: string;
  viewers: number;
  description: string;
}

export interface ChatMessage {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  mine?: boolean;
}
