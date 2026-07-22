"use client";

import { useCallback, useMemo, useRef, useState } from "react";

type BrowserSpeechRecognitionResult = {
  0?: {
    transcript?: string;
  };
};

type BrowserSpeechRecognitionEvent = {
  results: {
    length: number;
    [index: number]: BrowserSpeechRecognitionResult;
  };
};

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

type SpeechRecognitionWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

export function useSpeechRecognition(language = "es-ES") {
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  const Recognition = useMemo(() => {
    if (typeof window === "undefined") return undefined;

    const speechWindow = window as SpeechRecognitionWindow;
    return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
  }, []);

  const isSupported = Boolean(Recognition);

  const startListening = useCallback(() => {
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const parts: string[] = [];

      for (let index = 0; index < event.results.length; index += 1) {
        parts.push(event.results[index]?.[0]?.transcript ?? "");
      }

      const text = parts.join(" ").trim();

      setTranscript(text);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setTranscript("");
    setIsListening(true);
  }, [Recognition, language]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
  };
}
