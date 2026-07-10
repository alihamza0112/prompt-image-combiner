import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const InputSchema = z.object({
  title: z.string().min(1),
  goal: z.string().min(1),
  outputLanguageName: z.string().min(1),
  outputLanguageNative: z.string().min(1),
  outputLanguageCode: z.string().min(1),
});

export const generatePromptFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    console.log("[generatePromptFn] key present:", !!key, "len:", key?.length);
    if (!key) throw new Error("Missing LOVABLE_API_KEY on server");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const langLabel = `${data.outputLanguageName} (${data.outputLanguageNative})`;

    const system = [
      "You are an elite prompt engineer.",
      "Your job: turn the user's rough idea into ONE polished, ready-to-use prompt for ChatGPT, Claude, Gemini, or Grok.",
      "",
      "STRICT OUTPUT RULES:",
      `1. Write the ENTIRE response in ${langLabel}. 100% of headings, labels, bullets, instructions, and explanations MUST be in ${langLabel}.`,
      "2. Never mix languages. Never leave English headings, English labels, or English filler when the target language is not English.",
      "3. The ONLY tokens allowed to remain in their original form are proper product/brand names such as ChatGPT, Claude, Gemini, Grok, Midjourney, DALL-E, Sora, GitHub, YouTube, Facebook, Instagram, LinkedIn — nothing else.",
      "4. Translate the section headings themselves (Role, Objective, Context, Instructions, Output Format, Important Notes) into natural, native-sounding equivalents in the target language. Do not keep them in English.",
      "5. Sound like a fluent native speaker of the target language — natural grammar, natural word order, no literal machine-translation phrasing.",
      "",
      "STRUCTURE the prompt with these six sections, in this order, each with a heading translated into the target language:",
      "- Role (who the AI should act as, specific and expert)",
      "- Objective (the concrete goal, one sharp sentence)",
      "- Context (audience, tone, constraints, target platform / model)",
      "- Instructions (5-8 numbered, concrete, non-generic steps tailored to the user's actual request)",
      "- Output Format (exact structure of the answer the AI should return)",
      "- Important Notes (2-4 bullets: pitfalls to avoid, quality bar, edge cases)",
      "",
      "QUALITY BAR:",
      "- Expand the user's request intelligently. Infer domain, audience, and success criteria; do not just repeat the input.",
      "- Be specific: numbers, formats, lengths, constraints. No filler like 'be creative' or 'make it engaging'.",
      "- No generic template feel. Every instruction must reflect the user's actual topic.",
      "- No preamble, no closing commentary, no markdown code fences around the whole prompt. Output ONLY the finished prompt.",
    ].join("\n");

    const user = [
      `Prompt title: ${data.title}`,
      `Prompt goal: ${data.goal}`,
      "",
      `Write the finished, structured prompt now, entirely in ${langLabel}.`,
    ].join("\n");

    try {
      const { text } = await generateText({
        model: gateway("openai/gpt-5.5"),
        system,
        prompt: user,
      });
      return { text: text.trim() };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const status = (err as { statusCode?: number; status?: number })?.statusCode
        ?? (err as { status?: number })?.status;
      if (status === 429) {
        throw new Error("Rate limit reached. Please wait a moment and try again.");
      }
      if (status === 402) {
        throw new Error("AI credits exhausted. Please add credits in your workspace billing.");
      }
      throw new Error(`Prompt generation failed: ${message}`);
    }
  });
