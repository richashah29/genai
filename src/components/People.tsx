'use client';

import { useState, useEffect } from 'react';
import type { Person } from '@/lib/types';

export function People() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notes, setNotes] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchPeople = async () => {
    const res = await fetch('/api/people');
    const data = await res.json();
    setPeople(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchPeople().finally(() => setLoading(false));
  }, []);

  const addPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relationship.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), relationship: relationship.trim(), notes: notes.trim() || undefined }),
      });
      if (!res.ok) throw new Error('Failed');
      const created = await res.json();
      setPeople((prev) => [...prev, created]);
      setName('');
      setRelationship('');
      setNotes('');
    } finally {
      setAdding(false);
    }
  };

  const addHappyMoment = async (id: string, moment: string) => {
    if (!moment.trim()) return;
    const res = await fetch(`/api/people/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        happyMoments: [...(people.find((p) => p.id === id)?.happyMoments ?? []), moment.trim()],
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPeople((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="mb-2 text-lg font-semibold text-calm-800">People in your life</h2>
        <p className="mb-4 text-sm text-calm-600">
          Add names and relationships so you can ask &quot;Who is Sarah?&quot; in Chat and get a friendly reminder.
        </p>
        <form onSubmit={addPerson} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <label className="block text-sm font-medium text-calm-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah"
              className="w-full rounded-lg border border-calm-300 px-3 py-2 text-calm-800 placeholder:text-calm-400"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="block text-sm font-medium text-calm-700">Relationship</label>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. My daughter"
              className="w-full rounded-lg border border-calm-300 px-3 py-2 text-calm-800 placeholder:text-calm-400"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="block text-sm font-medium text-calm-700">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Visits on Sundays"
              className="w-full rounded-lg border border-calm-300 px-3 py-2 text-calm-800 placeholder:text-calm-400"
            />
          </div>
          <button type="submit" disabled={adding} className="btn-primary">
            {adding ? 'Adding…' : 'Add'}
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-calm-600">Loading…</p>
      ) : people.length === 0 ? (
        <div className="card p-8 text-center text-calm-600">
          No people added yet. Add someone above, then ask &quot;Who is [name]?&quot; in Chat.
        </div>
      ) : (
        <ul className="space-y-3">
          {people.map((p) => (
            <li key={p.id} className="card p-4">
              <p className="font-medium text-calm-800">{p.name}</p>
              <p className="text-sm text-calm-600">{p.relationship}</p>
              {p.notes && <p className="text-sm text-calm-700">{p.notes}</p>}
              {p.happyMoments && p.happyMoments.length > 0 && (
                <p className="mt-2 text-xs text-calm-500">
                  Happy moments: {p.happyMoments.join(', ')}
                </p>
              )}
              <AddMomentForm personId={p.id} onAdd={(m) => addHappyMoment(p.id, m)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AddMomentForm({ personId, onAdd }: { personId: string; onAdd: (m: string) => void }) {
  const [moment, setMoment] = useState('');
  return (
    <form
      className="mt-2 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(moment);
        setMoment('');
      }}
    >
      <input
        type="text"
        value={moment}
        onChange={(e) => setMoment(e.target.value)}
        placeholder="Add a happy moment…"
        className="flex-1 rounded-lg border border-calm-200 px-2 py-1 text-sm"
      />
      <button type="submit" className="btn-secondary text-sm py-1">Add</button>
    </form>
  );
}
