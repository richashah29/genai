'use client';

import { useState } from 'react';
import { VoiceUpload } from '@/components/VoiceUpload';
import { Schedule } from '@/components/Schedule';
import { People } from '@/components/People';
import { ChatPanel } from '@/components/ChatPanel';

type Tab = 'voice' | 'schedule' | 'people' | 'chat';

export default function Home() {
  const [tab, setTab] = useState<Tab>('voice');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'voice', label: 'Voice note', icon: '🎤' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'people', label: 'People', icon: '👤' },
    { id: 'chat', label: 'Chat', icon: '💬' },
  ];

  return (
    <div className="min-h-screen bg-calm-50">
      <header className="sticky top-0 z-10 border-b border-calm-200/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-semibold text-calm-800">SteadyMind</h1>
          <p className="text-sm text-calm-600">Care companion</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? 'bg-calm-500 text-white'
                  : 'text-calm-600 hover:bg-calm-100'
              }`}
            >
              <span className="mr-1.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {tab === 'voice' && <VoiceUpload />}
        {tab === 'schedule' && <Schedule />}
        {tab === 'people' && <People />}
        {tab === 'chat' && <ChatPanel />}
      </main>
    </div>
  );
}
