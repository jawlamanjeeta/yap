export const launchLanguages = [
  {
    label: "Spanish",
    speechCode: "es-ES",
    whisperCode: "es",
    greeting: "Hola. ¿Qué hiciste hoy?",
    suggestedReply: "Hoy estudié vocabulario y practiqué hablar.",
  },
  {
    label: "French",
    speechCode: "fr-FR",
    whisperCode: "fr",
    greeting: "Bonjour. Qu'est-ce que tu as fait aujourd'hui ?",
    suggestedReply: "Aujourd'hui, j'ai étudié du vocabulaire.",
  },
  {
    label: "German",
    speechCode: "de-DE",
    whisperCode: "de",
    greeting: "Hallo. Was hast du heute gemacht?",
    suggestedReply: "Heute habe ich neue Wörter gelernt.",
  },
  {
    label: "Japanese",
    speechCode: "ja-JP",
    whisperCode: "ja",
    greeting: "こんにちは。今日は何をしましたか？",
    suggestedReply: "今日は新しい言葉を勉強しました。",
  },
  {
    label: "English",
    speechCode: "en-US",
    whisperCode: "en",
    greeting: "Hi. What did you do today?",
    suggestedReply: "Today I learned new vocabulary and practiced speaking.",
  },
] as const;

export type LaunchLanguage = (typeof launchLanguages)[number]["label"];

export function isLaunchLanguage(value: string): value is LaunchLanguage {
  return launchLanguages.some((language) => language.label === value);
}

export function getLaunchLanguage(label: string) {
  return launchLanguages.find((language) => language.label === label) ?? launchLanguages[0];
}
