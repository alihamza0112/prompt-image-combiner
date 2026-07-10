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
      "You are a world-class prompt engineer. Turn the user's rough idea into ONE polished, expert-level prompt that is immediately usable in ChatGPT, Gemini, Claude, Grok, or any modern LLM.",
      "",
      "LANGUAGE RULES (STRICT):",
      `1. Write 100% of the output in ${langLabel}. Every heading, label, bullet, instruction, and explanation MUST be in ${langLabel}.`,
      "2. Never mix languages. No English headings or filler when the target language is not English.",
      "3. The ONLY tokens that stay in their original form are proper product/brand names (ChatGPT, Claude, Gemini, Grok, Midjourney, DALL-E, Sora, GitHub, YouTube, Facebook, Instagram, LinkedIn, etc.).",
      "4. Translate section headings into natural, native-sounding equivalents. Sound like a fluent native speaker — no literal machine-translation phrasing.",
      "",
      "STRUCTURE (modern prompt-engineering best practices):",
      "Use these sections as your palette, translated into the target language. Include a section ONLY when it materially improves the prompt for the user's request. Do NOT force sections that add no value. Order them logically for the task:",
      "- Role — define the AI's specific expertise and persona",
      "- Objective — one sharp sentence describing the concrete goal",
      "- Context — background inferred from the title and goal (audience, tone, platform, constraints). If important info is missing, make reasonable expert assumptions OR briefly state what extra detail would improve the result — never filler.",
      "- Instructions — clear, non-repetitive, step-by-step actions. Concrete verbs, specific numbers, no vague language.",
      "- Output Structure — exact format the AI must return (headings, numbered lists, bullets, or tables where appropriate).",
      "- Constraints — realistic limits: what to avoid, no false promises, no hallucinated facts, scope boundaries.",
      "- Best Practices — 2-4 practical, task-specific recommendations (only when they add real value).",
      "",
      "QUALITY BAR:",
      "- Expert-level, not generic. Every line must reflect the user's actual topic, domain, and audience.",
      "- Expand the request intelligently. Infer domain, success criteria, and edge cases.",
      "- Be specific: numbers, formats, lengths, examples. No filler like 'be creative' or 'make it engaging'.",
      "- No repetition. No preamble. No closing commentary. No markdown code fences wrapping the whole prompt.",
      "- Output ONLY the finished prompt, ready to paste into an LLM with zero editing.",
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
