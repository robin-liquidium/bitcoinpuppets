import type { SantaHatInput, SantaHatResult } from "./types";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/images/edits";
const OUTPUT_SIZE = "1024x1024";
const OUTPUT_QUALITY = "low";

export async function generateWithOpenAI(
  input: SantaHatInput,
  apiKey?: string,
): Promise<SantaHatResult> {
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY. Add it to your environment.");
  }

  const openaiForm = new FormData();
  openaiForm.append("model", "gpt-image-1.5");
  openaiForm.append("prompt", input.prompt);
  openaiForm.append("size", OUTPUT_SIZE);
  openaiForm.append("quality", OUTPUT_QUALITY);
  openaiForm.append("image[]", input.puppet, input.puppet.name || "puppet.png");
  openaiForm.append("image[]", input.santaHat, "puppets-santa-hat.webp");

  const openaiResponse = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: openaiForm,
  });

  let openaiPayload: unknown;
  try {
    openaiPayload = await openaiResponse.json();
  } catch {
    throw new Error("OpenAI returned a non-JSON response.");
  }

  if (!openaiResponse.ok) {
    let message = "OpenAI rejected the request.";
    if (openaiPayload && typeof openaiPayload === "object") {
      const payloadError = (openaiPayload as { error?: { message?: unknown } })
        .error;
      if (payloadError?.message) {
        message = String(payloadError.message);
      }
    }
    throw new Error(message);
  }

  let imageBase64: string | null = null;
  if (openaiPayload && typeof openaiPayload === "object") {
    const data = (openaiPayload as { data?: unknown }).data;
    if (Array.isArray(data) && data[0]) {
      const first = data[0] as { b64_json?: unknown };
      if (typeof first.b64_json === "string") {
        imageBase64 = first.b64_json;
      }
    }
  }

  if (!imageBase64) {
    throw new Error("Unexpected OpenAI response format.");
  }

  return { imageBase64 };
}
