'use client';

import { useState, useRef } from 'react';
import type { ExtractedEvent } from '@/lib/types';

export function VoiceUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [events, setEvents] = useState<ExtractedEvent[]>([]);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const setFileAndClear = (f: File | null) => {
    setFile(f);
    setTranscript('');
    setEvents([]);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileAndClear(f ?? null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('audio/')) setFileAndClear(f);
    else if (f) setError('Please choose an audio file (e.g. .mp3, .wav, .webm, .m4a)');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('audio', file);
      const res = await fetch('/api/upload-voice', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setTranscript(data.transcript || '');
      setEvents(data.events || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const confirmEvent = async (e: ExtractedEvent) => {
    setConfirming(JSON.stringify(e));
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...e, reminderMinutesBefore: 30 }),
      });
      if (!res.ok) throw new Error('Failed to add');
      setEvents((prev) => prev.filter((x) => x !== e));
    } catch {
      setError('Could not add event');
    } finally {
      setConfirming(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="mb-2 text-lg font-semibold text-calm-800">Upload a voice note</h2>
        <p className="mb-4 text-sm text-calm-600">
          Record or upload a note about your day. We&apos;ll find any events (e.g. &quot;lunch with Sarah Tuesday at noon&quot;) and add them to your schedule after you confirm.
        </p>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`mb-4 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            dragActive ? 'border-calm-500 bg-calm-50' : 'border-calm-200 bg-calm-50/50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.webm,.m4a,.ogg"
            onChange={handleFileChange}
            className="hidden"
            id="voice-file-input"
          />
          <label
            htmlFor="voice-file-input"
            className="cursor-pointer text-calm-700 hover:text-calm-800"
          >
            <span className="font-medium text-calm-600">Click to choose a file</span>
            <span className="text-calm-500"> or drag and drop an audio file here</span>
          </label>
          {file && (
            <p className="mt-2 text-sm font-medium text-calm-800">
              Selected: {file.name}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn-secondary"
          >
            Choose file
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Processing…' : 'Transcribe & find events'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {transcript && (
        <div className="card p-6">
          <h3 className="mb-2 font-medium text-calm-800">What we heard</h3>
          <p className="text-sm text-calm-700 whitespace-pre-wrap">{transcript}</p>
        </div>
      )}

      {events.length > 0 && (
        <div className="card p-6">
          <h3 className="mb-3 font-medium text-calm-800">Confirm events to add to your schedule</h3>
          <ul className="space-y-3">
            {events.map((evt, i) => (
              <li
                key={i}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-calm-200 bg-calm-50/50 p-3"
              >
                <span className="text-sm text-calm-800">
                  <strong>{evt.title}</strong>
                  {evt.withPerson && ` with ${evt.withPerson}`} — {evt.date} at {evt.time}
                  {evt.location && ` (${evt.location})`}
                </span>
                <button
                  onClick={() => confirmEvent(evt)}
                  disabled={confirming === JSON.stringify(evt)}
                  className="btn-primary text-sm"
                >
                  {confirming === JSON.stringify(evt) ? 'Adding…' : 'Add to schedule'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
