import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import { generateWithGemini } from "@/features/santa-generator/providers/gemini";
import { generateWithOpenAI } from "@/features/santa-generator/providers/openai";

const PROMPT =
  "Add the exact Santa hat from the reference image onto the character. If the character already has headwear, replace the headwear with the Santa hat. Do not stylize, redraw, reshape, or reinterpret the hat—keep its exact silhouette, colors, texture, and proportions from the reference. Do not change anything but the headwear.";
const SANTA_HAT_PATH = "/assets/puppets-santa-hat.webp";

export const Route = createFileRoute("/api/santa-generator")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let formData: FormData;
        try {
          formData = await request.formData();
        } catch {
          return Response.json(
            { error: "Expected a multipart image upload." },
            { status: 400 },
          );
        }
        const puppet = formData.get("puppet");

        if (!(puppet instanceof File)) {
          return Response.json(
            { error: "Missing puppet image upload." },
            { status: 400 },
          );
        }

        if (!puppet.type.startsWith("image/")) {
          return Response.json(
            { error: "Upload must be an image file." },
            { status: 400 },
          );
        }

        const hatResponse = await fetch(new URL(SANTA_HAT_PATH, request.url));
        if (!hatResponse.ok) {
          return Response.json(
            { error: "Failed to load the Santa hat reference image." },
            { status: 500 },
          );
        }

        const hatBlob = await hatResponse.blob();
        const hatFile = new File([hatBlob], "puppets-santa-hat.webp", {
          type: hatBlob.type || "image/webp",
        });

        try {
          const provider = env.IMAGE_PROVIDER?.toLowerCase().trim();
          const result =
            provider === "openai"
              ? await generateWithOpenAI(
                  { puppet, santaHat: hatFile, prompt: PROMPT },
                  env.OPENAI_API_KEY,
                )
              : await generateWithGemini(
                  { puppet, santaHat: hatFile, prompt: PROMPT },
                  env.GEMINI_API_KEY,
                );

          return Response.json(result);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Image generation failed.";
          return Response.json({ error: message }, { status: 502 });
        }
      },
    },
  },
});
