export interface ScheduledEvent {
  id: string;
  title: string;
  withPerson?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location?: string;
  notes?: string;
  reminderMinutesBefore: number; // e.g. 30 for "remind 30 min before"
  confirmedAt: string; // ISO
  createdAt: string;
}

export interface Person {
  id: string;
  name: string;
  relationship: string;
  notes?: string;
  happyMoments: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agent: 'people' | 'wellness';
  createdAt: string;
}

export interface ExtractedEvent {
  title: string;
  withPerson?: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
}
