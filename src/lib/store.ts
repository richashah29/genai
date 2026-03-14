import type { ScheduledEvent, Person, ChatMessage } from './types';

// In-memory store for hackathon (replace with DB in production)
const events: ScheduledEvent[] = [];
const people: Person[] = [];
const chatHistory: ChatMessage[] = [];

export const eventStore = {
  getAll: () => [...events].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)),
  add: (e: Omit<ScheduledEvent, 'id' | 'createdAt' | 'confirmedAt'>) => {
    const event: ScheduledEvent = {
      ...e,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      confirmedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    events.push(event);
    return event;
  },
  delete: (id: string) => {
    const i = events.findIndex((e) => e.id === id);
    if (i >= 0) events.splice(i, 1);
    return i >= 0;
  },
};

export const peopleStore = {
  getAll: () => [...people],
  getByName: (name: string) => people.find((p) => p.name.toLowerCase() === name.toLowerCase()),
  add: (p: Omit<Person, 'id' | 'createdAt' | 'happyMoments'>) => {
    const person: Person = {
      ...p,
      id: `person-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      happyMoments: [],
      createdAt: new Date().toISOString(),
    };
    people.push(person);
    return person;
  },
  update: (id: string, updates: Partial<Pick<Person, 'relationship' | 'notes' | 'happyMoments'>>) => {
    const i = people.findIndex((p) => p.id === id);
    if (i < 0) return null;
    people[i] = { ...people[i], ...updates };
    return people[i];
  },
  addHappyMoment: (id: string, moment: string) => {
    const i = people.findIndex((p) => p.id === id);
    if (i < 0) return null;
    people[i].happyMoments = [...(people[i].happyMoments || []), moment];
    return people[i];
  },
};

export const chatStore = {
  getHistory: (agent?: 'people' | 'wellness') =>
    agent ? chatHistory.filter((m) => m.agent === agent) : [...chatHistory],
  add: (msg: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    const m: ChatMessage = {
      ...msg,
      id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    chatHistory.push(m);
    return m;
  },
};
