"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Loader2,
  Mic,
  Send,
  Square,
  Volume2,
  Wand2,
} from "lucide-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTTS } from "@/hooks/useTTS";
import type { CefrEstimate } from "@/utils/cefr";

type Message = {
  role: "user" | "assistant";
  content: string;
  correction?: string;
  grammarNotes?: string[];
  suggestedReply?: string;
};

type PronunciationFeedback = {
  score: number;
  label: string;
  tip: string;
};

type TutorApiResponse = {
  reply: string;
  correction: string;
  grammarNotes: string[];
  suggestedReply: string;
  cefr: CefrEstimate;
};

type TranscribeApiResponse = {
  text: string;
  pronunciation: PronunciationFeedback;
};

const languageOptions = [
  { label: "Spanish", value: "Spanish", speechCode: "es-ES", whisperCode: "es" },
  { label: "French", value: "French", speechCode: "fr-FR", whisperCode: "fr" },
  { label: "German", value: "German", speechCode: "de-DE", whisperCode: "de" },
  { label: "Japanese", value: "Japanese", speechCode: "ja-JP", whisperCode: "ja" },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hola. Que hiciste hoy?",
      suggestedReply: "Hoy estudie vocabulario y practique hablar.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastCefr, setLastCefr] = useState<CefrEstimate | null>(null);
  const [lastPronunciation, setLastPronunciation] = useState<PronunciationFeedback | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isRecording, startRecording, stopRecording, error } = useAudioRecorder();
  const speechRecognition = useSpeechRecognition(selectedLanguage.speechCode);
  const { isSpeaking, speak } = useTTS(selectedLanguage.speechCode);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submitUtterance = async (text: string, pronunciation?: PronunciationFeedback) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setDraft("");
    setLastPronunciation(pronunciation ?? null);
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selectedLanguage.value,
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        throw new Error("The tutor could not answer that turn.");
      }

      const data = (await response.json()) as TutorApiResponse;
      setLastCefr(data.cefr);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply,
          correction: data.correction,
          grammarNotes: data.grammarNotes,
          suggestedReply: data.suggestedReply,
        },
      ]);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not reach the AI tutor. Check your OpenAI key and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleRecord = async () => {
    if (isRecording) {
      setIsProcessing(true);
      speechRecognition.stopListening();

      const audioBlob = await stopRecording();
      if (!audioBlob) {
        setIsProcessing(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", audioBlob, "speech.webm");
        formData.append("language", selectedLanguage.whisperCode);

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Transcription failed.");
        }

        const data = (await response.json()) as TranscribeApiResponse;
        await submitUtterance(data.text, data.pronunciation);
      } catch (error) {
        console.error(error);
        setErrorMessage("Could not transcribe the recording.");
      } finally {
        setIsProcessing(false);
      }

      return;
    }

    await startRecording();
    if (speechRecognition.isSupported) {
      speechRecognition.startListening();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitUtterance(draft);
  };

  const latestAssistant = [...messages].reverse().find((message) => message.role === "assistant");

  return (
    <div className="grid w-full gap-4 lg:grid-cols-[1fr_18rem]">
      <section className="flex min-h-[72vh] flex-col rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-600 dark:text-amber-300">
              AI conversation
            </p>
            <h1 className="mt-1 text-xl font-black tracking-tight">Speaking practice</h1>
          </div>
          <select
            value={selectedLanguage.value}
            onChange={(event) => {
              const option = languageOptions.find((language) => language.value === event.target.value);
              if (option) setSelectedLanguage(option);
            }}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold outline-none transition focus:border-amber-500 dark:border-neutral-700 dark:bg-neutral-950"
            aria-label="Target language"
          >
            {languageOptions.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[86%] rounded-lg px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                    : "border border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                }`}
              >
                <p>{message.content}</p>

                {message.role === "assistant" && (message.correction || message.suggestedReply) && (
                  <div className="mt-3 space-y-2 border-t border-neutral-200 pt-3 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
                    {message.correction && <p>Correction: {message.correction}</p>}
                    {message.grammarNotes?.map((note) => (
                      <p key={note}>Note: {note}</p>
                    ))}
                    {message.suggestedReply && (
                      <button
                        type="button"
                        onClick={() => setDraft(message.suggestedReply ?? "")}
                        className="inline-flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-2 font-bold text-amber-900 transition hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-100"
                      >
                        <Wand2 className="h-3.5 w-3.5" />
                        Use suggested reply
                      </button>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {(speechRecognition.transcript || errorMessage || error) && (
          <div className="border-t border-neutral-200 px-4 py-3 text-sm dark:border-neutral-800">
            {speechRecognition.transcript && (
              <p className="text-neutral-500 dark:text-neutral-400">
                Browser transcript: {speechRecognition.transcript}
              </p>
            )}
            {(errorMessage || error) && (
              <p className="mt-1 font-semibold text-red-600 dark:text-red-300">
                {errorMessage || error}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-neutral-200 p-4 dark:border-neutral-800">
          <button
            type="button"
            onClick={handleToggleRecord}
            disabled={isProcessing && !isRecording}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-bold transition ${
              isRecording
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            } disabled:opacity-60`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <Square className="h-5 w-5 fill-current" /> : <Mic className="h-5 w-5" />}
          </button>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Type in ${selectedLanguage.value} or record your voice`}
            className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-amber-500 dark:border-neutral-700 dark:bg-neutral-950"
          />
          <button
            type="submit"
            disabled={isProcessing || !draft.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-neutral-950 transition hover:bg-amber-400 disabled:opacity-50"
            aria-label="Send message"
            title="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </section>

      <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Panel title="Fluency">
          {lastCefr ? (
            <div>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-black tracking-tight">{lastCefr.level}</p>
                <p className="pb-1 text-sm font-bold text-neutral-500 dark:text-neutral-400">
                  {lastCefr.score}/100
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{lastCefr.signal}</p>
            </div>
          ) : (
            <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              Your CEFR estimate appears after your first learner turn.
            </p>
          )}
        </Panel>

        <Panel title="Pronunciation">
          {lastPronunciation ? (
            <div>
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${lastPronunciation.score}%` }}
                />
              </div>
              <p className="font-black">{lastPronunciation.label}</p>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {lastPronunciation.tip}
              </p>
            </div>
          ) : (
            <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              Record a response to get Whisper-based clarity feedback.
            </p>
          )}
        </Panel>

        <Panel title="Listen">
          <button
            type="button"
            onClick={() => latestAssistant && speak(latestAssistant.content)}
            disabled={!latestAssistant}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-sm font-bold transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            {isSpeaking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
            Play tutor reply
          </button>
        </Panel>
      </aside>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="mb-4 text-sm font-black uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
        {title}
      </h2>
      {children}
    </section>
  );
}
