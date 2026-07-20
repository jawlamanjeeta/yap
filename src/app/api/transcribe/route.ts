import { NextResponse } from "next/server";
import OpenAI from "openai";

// Automatically uses process.env.OPENAI_API_KEY
const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("file") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" }, 
        { status: 400 }
      );
    }

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" }, 
      { status: 500 }
    );
  }
}