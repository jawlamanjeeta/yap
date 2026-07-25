export type StarterDeck = {
  language: string;
  languageCode: string;
  title: string;
  description: string;
  cards: ReadonlyArray<{
    frontText: string;
    backText: string;
  }>;
};

export const starterDecks: ReadonlyArray<StarterDeck> = [
  {
    language: "English",
    languageCode: "en",
    title: "Everyday English",
    description: "Essential English phrases for greetings, questions, and everyday needs.",
    cards: [
      { frontText: "Hello", backText: "A friendly greeting" },
      { frontText: "Please", backText: "Used to make a request polite" },
      { frontText: "Thank you", backText: "An expression of gratitude" },
      { frontText: "Goodbye", backText: "A phrase used when leaving" },
      { frontText: "Excuse me", backText: "Used to get attention or apologize politely" },
      { frontText: "How are you?", backText: "A friendly question about someone's wellbeing" },
      { frontText: "I don't understand.", backText: "Say this when something is unclear" },
      { frontText: "Could you repeat that?", backText: "Ask someone to say something again" },
      { frontText: "Where is the station?", backText: "Ask for the location of the station" },
      { frontText: "I would like some water.", backText: "A polite way to request water" },
    ],
  },
  {
    language: "French",
    languageCode: "fr",
    title: "French First Steps",
    description: "Ten practical French phrases for your first real conversation.",
    cards: [
      { frontText: "Bonjour", backText: "Hello" },
      { frontText: "S'il vous plaît", backText: "Please" },
      { frontText: "Merci", backText: "Thank you" },
      { frontText: "Au revoir", backText: "Goodbye" },
      { frontText: "Excusez-moi", backText: "Excuse me" },
      { frontText: "Comment allez-vous ?", backText: "How are you?" },
      { frontText: "Je ne comprends pas.", backText: "I don't understand." },
      { frontText: "Pouvez-vous répéter ?", backText: "Could you repeat that?" },
      { frontText: "Où est la gare ?", backText: "Where is the station?" },
      { frontText: "Je voudrais de l'eau.", backText: "I would like some water." },
    ],
  },
  {
    language: "Spanish",
    languageCode: "es",
    title: "Spanish First Steps",
    description: "Ten practical Spanish phrases for your first real conversation.",
    cards: [
      { frontText: "Hola", backText: "Hello" },
      { frontText: "Por favor", backText: "Please" },
      { frontText: "Gracias", backText: "Thank you" },
      { frontText: "Adiós", backText: "Goodbye" },
      { frontText: "Perdón", backText: "Excuse me" },
      { frontText: "¿Cómo estás?", backText: "How are you?" },
      { frontText: "No entiendo.", backText: "I don't understand." },
      { frontText: "¿Puedes repetirlo?", backText: "Could you repeat that?" },
      { frontText: "¿Dónde está la estación?", backText: "Where is the station?" },
      { frontText: "Quisiera un poco de agua.", backText: "I would like some water." },
    ],
  },
  {
    language: "German",
    languageCode: "de",
    title: "German First Steps",
    description: "Ten practical German phrases for your first real conversation.",
    cards: [
      { frontText: "Hallo", backText: "Hello" },
      { frontText: "Bitte", backText: "Please" },
      { frontText: "Danke", backText: "Thank you" },
      { frontText: "Auf Wiedersehen", backText: "Goodbye" },
      { frontText: "Entschuldigung", backText: "Excuse me" },
      { frontText: "Wie geht es Ihnen?", backText: "How are you?" },
      { frontText: "Ich verstehe nicht.", backText: "I don't understand." },
      { frontText: "Können Sie das wiederholen?", backText: "Could you repeat that?" },
      { frontText: "Wo ist der Bahnhof?", backText: "Where is the station?" },
      { frontText: "Ich hätte gern etwas Wasser.", backText: "I would like some water." },
    ],
  },
  {
    language: "Japanese",
    languageCode: "ja",
    title: "Japanese First Steps",
    description: "Ten practical Japanese phrases for your first real conversation.",
    cards: [
      { frontText: "こんにちは", backText: "Hello (konnichiwa)" },
      { frontText: "お願いします", backText: "Please (onegaishimasu)" },
      { frontText: "ありがとうございます", backText: "Thank you (arigatou gozaimasu)" },
      { frontText: "さようなら", backText: "Goodbye (sayounara)" },
      { frontText: "すみません", backText: "Excuse me (sumimasen)" },
      { frontText: "お元気ですか？", backText: "How are you? (ogenki desu ka?)" },
      { frontText: "わかりません。", backText: "I don't understand. (wakarimasen)" },
      { frontText: "もう一度お願いします。", backText: "Could you repeat that? (mou ichido onegaishimasu)" },
      { frontText: "駅はどこですか？", backText: "Where is the station? (eki wa doko desu ka?)" },
      { frontText: "お水をお願いします。", backText: "I would like some water. (omizu o onegaishimasu)" },
    ],
  },
];
