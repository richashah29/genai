'use client';

import { useState, useEffect } from 'react';
import type { ScheduledEvent } from '@/lib/types';

export function Schedule() {
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchEvents().finally(() => setLoading(false));
  }, []);

  const deleteEvent = async (id: string) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d === today.toISOString().slice(0, 10)) return 'Today';
    if (d === tomorrow.toISOString().slice(0, 10)) return 'Tomorrow';
    return date.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) return <p className="text-calm-600">Loading schedule…</p>;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="mb-2 text-lg font-semibold text-calm-800">Your schedule</h2>
        <p className="mb-4 text-sm text-calm-600">
          Events from your voice notes appear here. We&apos;ll remind you before each one (including time to get there).
        </p>
      </div>

      {events.length === 0 ? (
        <div className="card p-8 text-center text-calm-600">
          No events yet. Upload a voice note and confirm any events we find.
        </div>
      ) : (
        <ul className="space-y-3">
          {events.map((evt) => (
            <li key={evt.id} className="card flex items-start justify-between gap-4 p-4">
              <div>
                <p className="font-medium text-calm-800">{evt.title}</p>
                {evt.withPerson && <p className="text-sm text-calm-600">with {evt.withPerson}</p>}
                <p className="mt-1 text-sm text-calm-700">
                  {formatDate(evt.date)} at {evt.time}
                  {evt.location && ` · ${evt.location}`}
                </p>
                {evt.reminderMinutesBefore > 0 && (
                  <p className="mt-0.5 text-xs text-calm-500">
                    Reminder {evt.reminderMinutesBefore} min before
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteEvent(evt.id)}
                className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
