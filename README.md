<div align="center">

# 🗣️ yap.
### *The intelligent, voice-first AI language tutor that listens, speaks, and adapts.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-yap--alpha--jet.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://yap-alpha-jet.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

[Explore the Live App](https://yap-alpha-jet.vercel.app) · [Report Bug](https://github.com/jawlamanjeeta/yap/issues) · [Request Feature](https://github.com/jawlamanjeeta/yap/issues)

</div>

---

## ⚡ Overview

**yap.** bridges the gap between passive flashcard memorization and spontaneous conversational fluency. Combining the power of **Google Gemini**, the **SuperMemo SM-2 spaced repetition algorithm**, and interactive speech interfaces, yap provides an immersive, gamified language learning experience.

Whether practicing spoken Spanish, refining German grammar, or mastering Japanese vocabulary, yap listens in real-time, corrects syntax gently, and measures fluency progress against CEFR standards.

---

## ✨ Key Features

### 🎙️ Voice-First Conversational AI Tutor
* **Interactive Dialogue**: Engage in turn-by-turn conversations in 5 launch languages (English, Spanish, French, German, Japanese).
* **Instant Speech Feedback**: Dual audio pipeline utilizing the Web Speech API and Google Gemini for real-time transcription, audio analysis, and pronunciation clarity scoring.
* **Smart Grammar Corrections**: Real-time, contextual sentence restructuring without breaking conversational flow.
* **CEFR Fluency Tracking**: Dynamic CEFR score (A1 to C2) calculated dynamically based on vocabulary range and grammatical complexity.

### 🧠 Intelligent Spaced Repetition (SM-2)
* **Algorithm-Driven Retention**: Uses the proven SuperMemo SM-2 algorithm to optimize review intervals and ease factors based on recall quality.
* **Starter Decks Included**: Instant access to curated beginner-to-intermediate decks across all supported languages.
* **Due Date Tracking**: Automated scheduling preventing cramming and maximizing long-term memory retention.

### 🎮 Gamified Learning Experience
* **XP & Streak Mechanics**: Earn experience points for active review sessions and conversational turns.
* **Daily Activity Matrix**: Tracks study consistency, message volume, and cards reviewed per calendar day.
* **3D Animated Mascots**: Immersive visual feedback driven by React Three Fiber (`@react-three/fiber`), Three.js, and GSAP.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS, Lucide Icons |
| **Animation & 3D** | Three.js, React Three Fiber, Drei, GSAP, Framer Motion |
| **Backend & APIs** | Next.js Server Actions, Route Handlers, Node.js v22 |
| **AI & Voice** | Google Gemini API (`@google/genai`), Web Speech API, MediaRecorder API |
| **Database & ORM** | Neon Serverless PostgreSQL (with PgBouncer pooling), Prisma ORM v6 |
| **Authentication** | Auth.js (NextAuth v5 beta), JWT Sessions, bcryptjs |
| **Deployment** | Vercel (Edge & Serverless compute) |

---

## 🚀 Live Demo Credentials

Experience the platform immediately without creating a new account:

* **URL**: [https://yap-alpha-jet.vercel.app/login](https://yap-alpha-jet.vercel.app/login)
* **Email**: `recruiter@faang.com`
* **Password**: `DemoPassword123!`

*(Includes pre-seeded review schedules, enrolled languages, and activity history).*

---

## 💻 Getting Started Locally

### Prerequisites
* **Node.js** (v20+ recommended)
* **PostgreSQL** (local instance or cloud database like [Neon](https://neon.tech))
* **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/jawlamanjeeta/yap.git
cd yap
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database (PostgreSQL / Neon)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# AI Integration
GEMINI_API_KEY="your-gemini-api-key"

# Authentication (Generate with: npx auth secret)
AUTH_SECRET="your-generated-auth-secret"
```

### 4. Database Setup & Seeding
Push the schema to your database and populate starter decks and demo accounts:

```bash
# Push schema tables
npx prisma db push

# Seed starter decks, cards, and demo user
npm run db:seed
```

### 5. Launch the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📁 Project Structure

```text
yap/
├── prisma/
│   ├── schema.prisma       # Database schema & relations
│   ├── seed.ts             # Starter decks & mock user seeding
│   └── starter-decks.ts    # Curated language decks (ES, FR, DE, JA, EN)
├── src/
│   ├── actions/            # Server actions (Auth, Flashcard reviews)
│   ├── app/                # Next.js App Router (pages & API routes)
│   │   ├── (auth)/         # Login & Signup flows
│   │   ├── api/chat/       # Gemini conversation & grammar endpoint
│   │   ├── api/transcribe/ # Speech transcription & pronunciation analysis
│   │   ├── chat/           # Live voice/text conversational UI
│   │   └── study/[id]/     # Flashcard review interface with SM-2 controls
│   ├── components/         # Reusable React components (3D Mascot, Chat, Cards)
│   ├── hooks/              # Custom hooks (AudioRecorder, SpeechRecognition, TTS)
│   ├── lib/                # Prisma client, Gemini SDK client, Auth helpers
│   └── utils/              # SM-2 algorithm & CEFR scoring utilities
├── neon.ts                 # Neon cloud architecture configuration
└── tailwind.config.ts      # Styling design system
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
