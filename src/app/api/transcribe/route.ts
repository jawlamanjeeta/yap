import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { scorePronunciationTranscript } from "@/utils/cefr";
import { getAuthenticatedUserId } from "@/lib/auth-user";
import { launchLanguages } from "@/lib/languages";

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const openai = getOpenAIClient();
    const formData = await req.formData();
    const audioFile = formData.get("file") as File;
    const language = formData.get("language")?.toString();

    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json(
        { error: "No audio file provided" }, 
        { status: 400 }
      );
    }

    if (!audioFile.type.startsWith("audio/") || audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Audio must be a supported file under 10 MB." },
        { status: 400 },
      );
    }

    if (
      language &&
      !launchLanguages.some((launchLanguage) => launchLanguage.whisperCode === language)
    ) {
      return NextResponse.json({ error: "Unsupported language." }, { status: 400 });
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
