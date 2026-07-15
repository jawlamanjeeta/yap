"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  
  const { isRecording, startRecording, stopRecording, error } = useAudioRecorder();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message smoothly
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedResponse]);

  const handleToggleRecord = async () => {
    if (isRecording) {
      setIsProcessing(true);
      const audioBlob = await stopRecording();
      if (audioBlob) {
        await processAudio(audioBlob);
      } else {
        setIsProcessing(false); // Fallback if blob failed
      }
    } else {
      await startRecording();
    }
  };

  const processAudio = async (blob: Blob) => {
    try {
      // 1. Send Audio to Whisper for Transcription
      const formData = new FormData();
      formData.append("file", blob, "speech.webm");
      // Hardcoded to Spanish for this prototype, but could be dynamic
      formData.append("language", "es"); 

      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeRes.ok) throw new Error("Transcription failed");
      const { text } = await transcribeRes.json();
      
      if (!text) throw new Error("No voice detected.");

      // Append user's transcribed message
      const newMessages: Message[] = [...messages, { role: "user", content: text }];
      setMessages(newMessages);

      // 2. Fetch GPT-4o SSE Stream
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, language: "Spanish" }),
      });

      if (!chatRes.body) throw new Error("No stream returned from GPT-4o");

      const reader = chatRes.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let currentStreamText = "";

      setIsProcessing(false); // Stop the loading spinner, start showing text

      // 3. Decode the chunked stream token-by-token
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        currentStreamText += chunkValue;
        setStreamedResponse(currentStreamText);
      }

      // 4. Commit the fully streamed response to state
      setMessages((prev) => [...prev, { role: "assistant", content: currentStreamText }]);
      setStreamedResponse("");

    } catch (err) {
      console.error("Conversation Error:", err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-2xl border border-neutral-800 bg-black">
      {/* Chat History Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-neutral-500 text-sm">
            Tap the microphone to start practicing.
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] text-sm ${msg.role === "user" ? "text-white" : "text-neutral-400"}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Live Streaming Assistant Message */}
        {streamedResponse && (
          <div className="flex w-full justify-start">
            <div className="max-w-[80%] text-sm text-neutral-400">
              {streamedResponse}
              <motion.span 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block ml-1 h-3 w-1 bg-neutral-500 rounded-full"
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Control Deck */}
      <div className="border-t border-neutral-800 p-6 flex flex-col items-center justify-center">
        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
        
        <button
          onClick={handleToggleRecord}
          disabled={isProcessing && !isRecording}
          className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ${
            isRecording 
              ? "bg-red-500/10 text-red-500" 
              : "bg-white text-black hover:bg-neutral-200"
          } disabled:opacity-50`}
        >
          {/* Animated pulsing ring when recording */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-red-500"
              />
            )}
          </AnimatePresence>

          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isRecording ? (
            <Square className="h-6 w-6 fill-current" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </button>
        
        <p className="mt-3 text-xs text-neutral-500 font-medium tracking-wide uppercase">
          {isProcessing ? "Processing..." : isRecording ? "Listening..." : "Tap to Speak"}
        </p>
      </div>
    </div>
  );
}