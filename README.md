# yap.

Duolingo-style language practice built with Next.js, PostgreSQL, Prisma, OpenAI Whisper, GPT-4o, and browser speech APIs.

## What is built

- App dashboard with due-card stats, deck list, XP, and speaking-practice entry point
- SM-2 flashcard scheduling stored in PostgreSQL through Prisma
- Voice recording with the MediaRecorder API
- Live browser transcript with the Web Speech API
- Whisper transcription endpoint with pronunciation clarity feedback
- GPT-4o tutor endpoint with grammar correction, suggested replies, and CEFR-style fluency estimates
- Auth.js credential accounts with hashed passwords and protected learning routes
- User-owned review history, conversations, language enrollments, activity, XP, and streak data

## Setup

Create `.env.local` from `.env.example` and provide:

```bash
DATABASE_URL=""
OPENAI_API_KEY=""
AUTH_SECRET=""
```

Then prepare the database and run the app:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Generate a strong `AUTH_SECRET` before running the app. The seeded demo account is:

```text
Email: recruiter@faang.com
Password: DemoPassword123!
```

The demo account and Spanish starter deck are enough to try the full review and speaking loop locally.
