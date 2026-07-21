import type { SantaHatInput, SantaHatResult } from "./types";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

const toBase64 = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString("base64");
};

export async function generateWithGemini(
  input: SantaHatInput,
  apiKey?: string,
): Promise<SantaHatResult> {
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY. Add it to your environment.");
  }

  const [puppetBase64, hatBase64] = await Promise.all([
    toBase64(input.puppet),
    toBase64(input.santaHat),
  ]);

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            inline_data: {
              mime_type: input.puppet.type || "image/png",
              data: puppetBase64,
            },
          },
          {
            inline_data: {
              mime_type: input.santaHat.type || "image/png",
              data: hatBase64,
            },
          },
          { text: input.prompt },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  };

  const geminiResponse = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  let geminiPayload: unknown;
  try {
    geminiPayload = await geminiResponse.json();
  } catch {
    throw new Error("Gemini returned a non-JSON response.");
  }

  if (!geminiResponse.ok) {
    let message = "Gemini rejected the request.";
    if (geminiPayload && typeof geminiPayload === "object") {
      const payloadError = (geminiPayload as { error?: { message?: unknown } })
        .error;
      if (payloadError?.message) {
        message = String(payloadError.message);
      }
    }
    throw new Error(message);
  }

  const candidates = (geminiPayload as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates) || !candidates[0]) {
    throw new Error("Gemini response missing candidates.");
  }

  const parts = (
    candidates[0] as {
      content?: { parts?: Array<Record<string, unknown>> };
    }
  ).content?.parts;

  if (!Array.isArray(parts)) {
    throw new Error("Gemini response missing parts.");
  }

  for (const part of parts) {
    const inlineData =
      (part as { inlineData?: { data?: unknown } }).inlineData ??
      (part as { inline_data?: { data?: unknown } }).inline_data;
    if (inlineData && typeof inlineData.data === "string") {
      return { imageBase64: inlineData.data };
    }
  }

  throw new Error("Gemini response did not include image data.");
}
