
```
yap
├─ .eslintrc.json
├─ .prettierrc
├─ components.json
├─ jest.config.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ schema.prisma
│  └─ seed.ts
├─ public
│  ├─ favicon.ico
│  ├─ icons
│  └─ sounds
│     ├─ correct.mp3
│     └─ level-up.mp3
├─ README.md
├─ src
│  ├─ actions
│  │  ├─ auth.actions.ts
│  │  ├─ flashcard.actions.ts
│  │  └─ user.actions.ts
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  └─ register
│  │  │     └─ page.tsx
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  ├─ chat
│  │  │  │  └─ route.ts
│  │  │  └─ transcribe
│  │  │     └─ route.ts
│  │  ├─ chat
│  │  │  └─ page.tsx
│  │  ├─ error.tsx
│  │  ├─ flashcards
│  │  │  ├─ page.tsx
│  │  │  └─ [deckId]
│  │  │     └─ page.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ loading.tsx
│  │  ├─ not-found.tsx
│  │  └─ page.tsx
│  ├─ components
│  │  ├─ chat
│  │  │  ├─ AudioControls.tsx
│  │  │  ├─ ChatBubble.tsx
│  │  │  ├─ ChatInterface.tsx
│  │  │  └─ Visualizer.tsx
│  │  ├─ flashcards
│  │  │  ├─ DeckList.tsx
│  │  │  ├─ Flashcard.tsx
│  │  │  ├─ FlashcardDeck.tsx
│  │  │  └─ GradingControls.tsx
│  │  ├─ layout
│  │  │  ├─ Navbar.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  └─ ThemeProvider.tsx
│  │  ├─ shared
│  │  │  ├─ StreakFlame.tsx
│  │  │  └─ XpBar.tsx
│  │  └─ ui
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ progress.tsx
│  │     └─ toast.tsx
│  ├─ hooks
│  │  ├─ useAudioRecorder.ts
│  │  ├─ useKeyboard.ts
│  │  ├─ useSpeechRecognition.ts
│  │  └─ useTTS.ts
│  ├─ lib
│  │  ├─ auth.ts
│  │  ├─ db.ts
│  │  ├─ openai.ts
│  │  └─ utils.ts
│  ├─ store
│  │  ├─ useSessionStore.ts
│  │  └─ useUserStore.ts
│  ├─ types
│  │  ├─ database.types.ts
│  │  ├─ index.ts
│  │  └─ next-auth.d.ts
│  ├─ utils
│  │  ├─ cefr.ts
│  │  ├─ formatters.ts
│  │  └─ sm2.ts
│  └─ __tests__
│     ├─ components
│     │  └─ Flashcard.test.tsx
│     ├─ setup.ts
│     └─ utils
│        └─ sm2.test.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ yap-app
   ├─ AGENTS.md
   ├─ app
   │  ├─ favicon.ico
   │  ├─ globals.css
   │  ├─ layout.tsx
   │  └─ page.tsx
   ├─ CLAUDE.md
   ├─ eslint.config.mjs
   ├─ next-env.d.ts
   ├─ next.config.ts
   ├─ package-lock.json
   ├─ package.json
   ├─ postcss.config.mjs
   ├─ public
   │  ├─ file.svg
   │  ├─ globe.svg
   │  ├─ next.svg
   │  ├─ vercel.svg
   │  └─ window.svg
   ├─ README.md
   └─ tsconfig.json

```