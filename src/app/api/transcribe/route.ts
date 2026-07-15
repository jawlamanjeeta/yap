import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const language = formData.get("language") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided in the request." },
        { status: 400 }
      );
    }

   
    const transcriptionOptions: Parameters<typeof openai.audio.transcriptions.create>[0] = {
      file: file,
      model: "whisper-1",
      
      prompt: "This is a language learning application. The user is practicing pronunciation.",
    };

    
    if (language) {
      transcriptionOptions.language = language;
    }

    
    const response = await openai.audio.transcriptions.create(transcriptionOptions);

   
    return NextResponse.json({ text: response.text });

  } catch (error) {
    console.error("Whisper API Error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio. Please try again." },
      { status: 500 }
    );
  }
}