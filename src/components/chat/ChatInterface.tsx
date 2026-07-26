"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Gauge,
  Headphones,
  Loader2,
  MessageCircleMore,
  Mic,
  Send,
  Sparkles,
  Square,
  Volume2,
  Wand2,
} from "lucide-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTTS } from "@/hooks/useTTS";
import type { CefrEstimate } from "@/utils/cefr";
import { getLaunchLanguage, launchLanguages } from "@/lib/languages";

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
  conversationId: string;
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

async function getResponseError(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { error?: unknown };
    return typeof payload.error === "string" && payload.error.trim() ? payload.error : fallback;
  } catch {
    return fallback;
  }
}

function openingMessage(language: ReturnType<typeof getLaunchLanguage>): Message {
  return {
    role: "assistant",
    content: language.greeting,
    suggestedReply: language.suggestedReply,
  };
}

export default function ChatInterface({ initialLanguage }: { initialLanguage: string }) {
  const initialOption = getLaunchLanguage(initialLanguage);
  const [messages, setMessages] = useState<Message[]>([openingMessage(initialOption)]);
  const [draft, setDraft] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(initialOption);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastCefr, setLastCefr] = useState<CefrEstimate | null>(null);
  const [lastPronunciation, setLastPronunciation] = useState<PronunciationFeedback | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const { isRecording, startRecording, stopRecording, error } = useAudioRecorder();
  const speechRecognition = useSpeechRecognition(selectedLanguage.speechCode);
  const { isSpeaking, speak } = useTTS(selectedLanguage.speechCode);

  useEffect(() => {
    const messagePane = messagesRef.current;
    if (!messagePane) return;

    messagePane.scrollTo({
      top: messagePane.scrollHeight,
      behavior: "smooth",
    });
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
          language: selectedLanguage.label,
          conversationId,
          pronunciation,
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        throw new Error(await getResponseError(response, "The tutor could not answer that turn."));
      }

      const data = (await response.json()) as TutorApiResponse;
      setConversationId(data.conversationId);
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
      setErrorMessage(
        error instanceof Error ? error.message : "Could not reach the AI tutor. Try again.",
      );
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
          throw new Error(await getResponseError(response, "Transcription failed."));
        }

        const data = (await response.json()) as TranscribeApiResponse;
        await submitUtterance(data.text, data.pronunciation);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Could not transcribe the recording.",
        );
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
    <div className="chat-studio" data-language={selectedLanguage.whisperCode}>
      <section className="chat-window">
        <header className="chat-window-header">
          <div>
            <p>
              <MessageCircleMore aria-hidden="true" />
              AI conversation room
            </p>
            <h1>Say something real.</h1>
          </div>
          <label className="chat-language-select">
            <span>Practicing</span>
            <select
              value={selectedLanguage.label}
              onChange={(event) => {
                const option = getLaunchLanguage(event.target.value);
                setSelectedLanguage(option);
                setMessages([openingMessage(option)]);
                setConversationId(null);
                setLastCefr(null);
                setLastPronunciation(null);
                setDraft("");
              }}
              aria-label="Target language"
            >
              {launchLanguages.map((language) => (
                <option key={language.label} value={language.label}>
                  {language.label}
                </option>
              ))}
            </select>
          </label>
        </header>

        <div ref={messagesRef} className="chat-messages">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.article
                key={`${message.role}-${index}`}
                className={`chat-message chat-message-${message.role}`}
                initial={{ opacity: 0, y: 18, rotate: message.role === "user" ? 1 : -1 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 230, damping: 22 }}
              >
                <div className="chat-message-label">
                  {message.role === "user" ? "you" : "yap tutor"}
                </div>
                <div className="chat-message-paper">
                  <p>{message.content}</p>

                  {message.role === "assistant" && (message.correction || message.suggestedReply) && (
                    <div className="chat-correction">
                      {message.correction && (
                        <p><strong>Correction</strong>{message.correction}</p>
                      )}
                      {message.grammarNotes?.map((note) => (
                        <p key={note}><strong>Note</strong>{note}</p>
                      ))}
                      {message.suggestedReply && (
                        <button
                          type="button"
                          onClick={() => setDraft(message.suggestedReply ?? "")}
                        >
                          <Wand2 aria-hidden="true" />
                          Try this reply
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <div className="chat-thinking">
              <Loader2 aria-hidden="true" />
              Tutor is thinking
            </div>
          )}
        </div>

        {(speechRecognition.transcript || errorMessage || error) && (
          <div className="chat-live-status">
            {speechRecognition.transcript && (
              <p><strong>Live transcript</strong>{speechRecognition.transcript}</p>
            )}
            {(errorMessage || error) && (
              <p className="chat-error">{errorMessage || error}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="chat-composer">
          <button
            type="button"
            onClick={handleToggleRecord}
            disabled={isProcessing && !isRecording}
            className={`chat-record ${isRecording ? "is-recording" : ""}`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <Square aria-hidden="true" /> : <Mic aria-hidden="true" />}
          </button>
          <label>
            <span>{isRecording ? "Listening..." : `Your turn in ${selectedLanguage.label}`}</span>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a sentence or use the microphone"
            />
          </label>
          <button
            type="submit"
            disabled={isProcessing || !draft.trim()}
            className="chat-send"
            aria-label="Send message"
            title="Send message"
          >
            <Send aria-hidden="true" />
          </button>
        </form>
      </section>

      <aside className="chat-sidebar">
        <section className="chat-mascot-note">
          <div className="chat-note-pin" aria-hidden="true" />
          <div className="chat-mascot-crop">
            <Image
              src="/yap-hero-mascot-stickers.png"
              alt="Yap duck tutor"
              width={1393}
              height={1034}
              priority
            />
          </div>
          <div>
            <span>Your conversation pal</span>
            <strong>Messy sentences welcome.</strong>
          </div>
        </section>

        <Panel title="Fluency" icon={Gauge}>
          {lastCefr ? (
            <div className="chat-metric-result">
              <div>
                <strong>{lastCefr.level}</strong>
                <span>{lastCefr.score}/100</span>
              </div>
              <p>{lastCefr.signal}</p>
            </div>
          ) : (
            <p className="chat-panel-empty">
              Your CEFR estimate appears after your first learner turn.
            </p>
          )}
        </Panel>

        <Panel title="Pronunciation" icon={Sparkles}>
          {lastPronunciation ? (
            <div className="chat-pronunciation">
              <div className="chat-score-track">
                <div
                  className="chat-score-fill"
                  style={{ width: `${lastPronunciation.score}%` }}
                />
              </div>
              <strong>{lastPronunciation.label}</strong>
              <p>{lastPronunciation.tip}</p>
            </div>
          ) : (
            <p className="chat-panel-empty">
              Record a response to get Whisper-based clarity feedback.
            </p>
          )}
        </Panel>

        <Panel title="Listen" icon={Headphones}>
          <button
            type="button"
            onClick={() => latestAssistant && speak(latestAssistant.content)}
            disabled={!latestAssistant}
            className="chat-listen"
          >
            {isSpeaking ? <Loader2 aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
            Play tutor reply
          </button>
        </Panel>
      </aside>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Gauge;
  children: React.ReactNode;
}) {
  return (
    <section className="chat-panel">
      <h2>
        <Icon aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}
