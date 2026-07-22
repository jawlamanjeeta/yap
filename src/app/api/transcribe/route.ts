import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { scorePronunciationTranscript } from "@/utils/cefr";

export async function POST(req: Request) {
  try {
    const openai = getOpenAIClient();
    const formData = await req.formData();
    const audioFile = formData.get("file") as File;
    const language = formData.get("language")?.toString();

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" }, 
        { status: 400 }
      );
    }

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language,
    });

    return NextResponse.json({
      text: response.text,
      pronunciation: scorePronunciationTranscript(response.text),
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" }, 
      { status: 500 }
    );
  }
}
