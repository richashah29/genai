'use client';

import { useState, useRef, useEffect } from 'react';

type Agent = 'people' | 'wellness';

export function ChatPanel() {
  const [agent, setAgent] = useState<Agent>('people');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadHistory = async () => {
    const res = await fetch(`/api/chat/history?agent=${agent}`);
    const data = await res.json();
    setMessages(
      (Array.isArray(data) ? data : []).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))
    );
  };

  useEffect(() => {
    loadHistory();
  }, [agent]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = message.trim();
    if (!text || loading) return;
    setMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, agent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Send failed');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h2 className="mb-2 text-lg font-semibold text-calm-800">Chat</h2>
        <p className="mb-4 text-sm text-calm-600">
          Ask who someone is (we use your People list), or switch to Wellness for a gentle check-in.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setAgent('people')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              agent === 'people' ? 'bg-calm-500 text-white' : 'bg-calm-100 text-calm-700'
            }`}
          >
            Who is this?
          </button>
          <button
            onClick={() => setAgent('wellness')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              agent === 'wellness' ? 'bg-calm-500 text-white' : 'bg-calm-100 text-calm-700'
            }`}
          >
            Wellness
          </button>
        </div>
      </div>

      <div className="card flex min-h-[320px] flex-col p-4">
        <div className="flex-1 space-y-3 overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-sm text-calm-500">
              {agent === 'people'
                ? 'Try: "Who is Sarah?" or "Who\'s my daughter?"'
                : 'Try: "I\'m feeling a bit low" or "How do I feel today?"'}
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-xl px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'ml-6 bg-calm-500 text-white'
                  : 'mr-6 bg-calm-100 text-calm-800'
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="mr-6 rounded-xl bg-calm-100 px-3 py-2 text-sm text-calm-600">
              Thinking…
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mt-3 flex gap-2"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={agent === 'people' ? 'Ask who someone is…' : 'Share how you feel…'}
            className="flex-1 rounded-xl border border-calm-300 px-4 py-2.5 text-calm-800 placeholder:text-calm-400"
          />
          <button type="submit" disabled={loading} className="btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
