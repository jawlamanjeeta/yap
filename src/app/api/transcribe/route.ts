import { NextResponse } from "next/server";
import { geminiFlashModel, getGeminiClient } from "@/lib/gemini";
import { scorePronunciationTranscript } from "@/utils/cefr";
import { getAuthenticatedUserId } from "@/lib/auth-user";
import { launchLanguages } from "@/lib/languages";
import { geminiErrorResponse } from "@/lib/gemini-error";

export async function POST(req: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const gemini = getGeminiClient();
    const formData = await req.formData();
    const audioFile = formData.get("file") as File;
    const language = formData.get("language")?.toString();

    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json(
        { error: "No audio file provided" }, 
        { status: 400 }
      );
    }

    if (
      audioFile.size === 0 ||
      !audioFile.type.startsWith("audio/") ||
      audioFile.size > 10 * 1024 * 1024
    ) {
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

    const audioData = Buffer.from(await audioFile.arrayBuffer()).toString("base64");
    const response = await gemini.models.generateContent({
      model: geminiFlashModel,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: audioFile.type,
                data: audioData,
              },
            },
            {
              text: `Transcribe the spoken ${language ?? "target language"} audio exactly. Return only the transcript with no timestamps, labels, translation, or commentary.`,
            },
          ],
        },
      ],
    });

    const text = response.text?.trim();
    if (!text) {
      return NextResponse.json({ error: "No speech was detected in the recording." }, { status: 422 });
    }

    return NextResponse.json({
      text,
      pronunciation: scorePronunciationTranscript(text),
    });
  } catch (error) {
    console.error("Gemini transcription error:", error);
    return geminiErrorResponse(error, "transcription");
  }
}
