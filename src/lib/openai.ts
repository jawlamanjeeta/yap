import OpenAI from 'openai';

// Ensure the API key exists before initializing
if (!process.env.OPENAI_API_KEY) {
  console.warn("Missing OPENAI_API_KEY environment variable");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});