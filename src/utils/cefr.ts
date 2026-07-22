export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type CefrEstimate = {
  level: CefrLevel;
  score: number;
  signal: string;
};

const advancedConnectors = [
  "although",
  "however",
  "therefore",
  "because",
  "while",
  "unless",
  "aunque",
  "porque",
  "mientras",
  "sin embargo",
];

export function estimateCefr(input: string, correctionCount = 0): CefrEstimate {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return {
      level: "A1",
      score: 5,
      signal: "No sustained speech detected yet.",
    };
  }

  const words = normalized.split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(words.map((word) => word.replace(/[^a-z0-9'-]/gi, "")));
  const sentences = Math.max(1, normalized.split(/[.!?]+/).filter(Boolean).length);
  const avgWordsPerSentence = words.length / sentences;
  const lexicalVariety = uniqueWords.size / Math.max(1, words.length);
  const connectorBonus = advancedConnectors.some((term) => normalized.includes(term)) ? 12 : 0;
  const lengthScore = Math.min(30, words.length * 1.2);
  const sentenceScore = Math.min(25, avgWordsPerSentence * 2);
  const varietyScore = Math.min(25, lexicalVariety * 30);
  const correctionPenalty = Math.min(25, correctionCount * 7);
  const score = Math.max(
    0,
    Math.min(100, Math.round(lengthScore + sentenceScore + varietyScore + connectorBonus - correctionPenalty)),
  );

  if (score >= 78) {
    return { level: "C1", score, signal: "Complex, flexible language with strong control." };
  }

  if (score >= 62) {
    return { level: "B2", score, signal: "Clear connected speech with room for precision." };
  }

  if (score >= 45) {
    return { level: "B1", score, signal: "Independent phrasing with some simple patterns." };
  }

  if (score >= 25) {
    return { level: "A2", score, signal: "Basic phrases are forming into short exchanges." };
  }

  return { level: "A1", score, signal: "Short beginner-level responses." };
}

export function scorePronunciationTranscript(transcript: string) {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const fillerCount = words.filter((word) => /^(um+|uh+|erm+|ah+)$/i.test(word)).length;
  const base = Math.min(100, 45 + words.length * 5);
  const score = Math.max(20, Math.min(100, base - fillerCount * 8));

  return {
    score,
    label: score >= 80 ? "Clear" : score >= 60 ? "Understandable" : "Needs another try",
    tip:
      score >= 80
        ? "Your speech was easy to transcribe."
        : "Try a little slower and separate the key words.",
  };
}
