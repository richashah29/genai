# SteadyMind – Dementia care companion

Agentic AI app for the **Sun Life Best Health Care Hack Using Agentic AI** track at GenAI Genesis 2025.

## What it does

- **Voice notes → events:** Upload a voice note; we transcribe it (Gemini) and extract any mentioned events (e.g. "lunch with Sarah Tuesday at noon"). You confirm and we add them to your schedule with a reminder.
- **Schedule:** View and manage events; reminders account for time before (e.g. 30 min to get ready/commute).
- **People:** Add names and relationships. In Chat, ask "Who is Sarah?" and get a clear, kind answer (and optional happy moments).
- **Mental health:** Wellness chatbot for short check-ins and supportive conversation.

## Tech stack

- **Next.js 14** (App Router), TypeScript, Tailwind CSS
- **Google Gemini** (free tier): speech-to-text + event extraction from voice notes; People and Wellness chat agents

## Setup

1. Clone and install:
   ```bash
   npm install
   ```
2. Get a **free** API key from [Google AI Studio](https://aistudio.google.com/apikey), then copy `.env.local.example` to `.env.local`:
   ```
   GOOGLE_API_KEY=your-key-here
   ```
3. Run:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

## Hackathon notes

- **Agentic AI:** Event extraction agent, People (“Who is this?”) agent, Wellness agent.
- **Storage:** In-memory for the demo; replace with a DB (e.g. SQLite, Postgres) for production.
- **Reminders:** Logic is in place (e.g. “remind 30 min before”); for real reminders use a cron job, background worker, or push notifications.
