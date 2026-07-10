import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles, Copy, RefreshCw, Trash2, Wand2, Check, ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";


/**
 * Multilingual AI Prompt Generator
 * ------------------------------------------------------------------
 * The generator below is fully client-side and produces structured,
 * high-quality example prompts. It is architected so that a real
 * AI backend (OpenAI, Gemini, Claude, etc.) can be plugged in later
 * by swapping the `generatePromptLocal` call inside `handleGenerate`
 * with an API call — the UI, state, and options remain unchanged.
 */

// ---------- Language registry (easy to extend) ----------
export type Language = { code: string; name: string; native: string };

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", native: "English" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
  { code: "th", name: "Thai", native: "ไทย" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

const RTL = new Set(["ar", "ur"]);

const PLATFORMS = [
  "ChatGPT", "Gemini", "Claude", "Grok", "Perplexity", "Microsoft Copilot",
  "Midjourney", "Veo", "Sora", "Flux", "Stable Diffusion",
  "Leonardo AI", "Ideogram", "Other",
];

const STYLES = [
  "Professional", "Creative", "Expert", "Beginner Friendly",
  "Marketing", "Academic", "Technical", "Storytelling",
];

const QUALITIES = ["Standard", "Advanced", "Expert", "Ultra Detailed"] as const;
type Quality = (typeof QUALITIES)[number];

const TITLE_SUGGESTIONS = [
  "YouTube Documentary", "Facebook Ad", "SEO Blog", "Instagram Caption",
  "Product Description", "Email Marketing", "Resume",
];

// ---------- Localized section labels (fallback to English) ----------
type SectionLabels = {
  role: string;
  objective: string;
  context: string;
  instructions: string;
  output: string;
  notes: string;
};

const LABELS: Record<string, SectionLabels> = {
  en: { role: "Role", objective: "Objective", context: "Context", instructions: "Clear Instructions", output: "Output Format", notes: "Important Notes" },
  es: { role: "Rol", objective: "Objetivo", context: "Contexto", instructions: "Instrucciones", output: "Formato de salida", notes: "Notas importantes" },
  fr: { role: "Rôle", objective: "Objectif", context: "Contexte", instructions: "Instructions", output: "Format de sortie", notes: "Notes importantes" },
  de: { role: "Rolle", objective: "Ziel", context: "Kontext", instructions: "Anweisungen", output: "Ausgabeformat", notes: "Wichtige Hinweise" },
  pt: { role: "Papel", objective: "Objetivo", context: "Contexto", instructions: "Instruções", output: "Formato de saída", notes: "Notas importantes" },
  it: { role: "Ruolo", objective: "Obiettivo", context: "Contesto", instructions: "Istruzioni", output: "Formato di output", notes: "Note importanti" },
  tr: { role: "Rol", objective: "Amaç", context: "Bağlam", instructions: "Talimatlar", output: "Çıktı formatı", notes: "Önemli notlar" },
  ru: { role: "Роль", objective: "Цель", context: "Контекст", instructions: "Инструкции", output: "Формат вывода", notes: "Важные замечания" },
  id: { role: "Peran", objective: "Tujuan", context: "Konteks", instructions: "Instruksi", output: "Format keluaran", notes: "Catatan penting" },
  vi: { role: "Vai trò", objective: "Mục tiêu", context: "Bối cảnh", instructions: "Hướng dẫn", output: "Định dạng đầu ra", notes: "Ghi chú quan trọng" },
  th: { role: "บทบาท", objective: "เป้าหมาย", context: "บริบท", instructions: "คำแนะนำ", output: "รูปแบบผลลัพธ์", notes: "หมายเหตุสำคัญ" },
  ur: { role: "کردار", objective: "مقصد", context: "پس منظر", instructions: "ہدایات", output: "آؤٹ پٹ فارمیٹ", notes: "اہم نکات" },
  ar: { role: "الدور", objective: "الهدف", context: "السياق", instructions: "التعليمات", output: "تنسيق المخرجات", notes: "ملاحظات مهمة" },
  hi: { role: "भूमिका", objective: "उद्देश्य", context: "संदर्भ", instructions: "स्पष्ट निर्देश", output: "आउटपुट प्रारूप", notes: "महत्वपूर्ण नोट्स" },
  bn: { role: "ভূমিকা", objective: "উদ্দেশ্য", context: "প্রেক্ষাপট", instructions: "নির্দেশনা", output: "আউটপুট ফরম্যাট", notes: "গুরুত্বপূর্ণ নোট" },
  pa: { role: "ਭੂਮਿਕਾ", objective: "ਮਕਸਦ", context: "ਪ੍ਰਸੰਗ", instructions: "ਹਦਾਇਤਾਂ", output: "ਆਉਟਪੁੱਟ ਫਾਰਮੈਟ", notes: "ਜ਼ਰੂਰੀ ਨੋਟ" },
  ja: { role: "役割", objective: "目的", context: "背景", instructions: "指示", output: "出力形式", notes: "重要な注意事項" },
  ko: { role: "역할", objective: "목표", context: "배경", instructions: "지시사항", output: "출력 형식", notes: "중요 참고사항" },
  "zh-CN": { role: "角色", objective: "目标", context: "背景", instructions: "明确指令", output: "输出格式", notes: "重要说明" },
  "zh-TW": { role: "角色", objective: "目標", context: "背景", instructions: "明確指令", output: "輸出格式", notes: "重要說明" },
};

function getLabels(code: string): SectionLabels {
  return LABELS[code] ?? LABELS.en;
}

// ---------- Category detection ----------
type Category =
  | "image" | "video" | "seo" | "blog" | "social" | "ad" | "email"
  | "code" | "resume" | "business" | "education" | "writing" | "product" | "general";

function detectCategory(title: string, platform: string, goal: string): Category {
  const t = `${title} ${goal}`.toLowerCase();
  const p = platform.toLowerCase();
  const has = (re: RegExp) => re.test(t);
  if (/midjourney|flux|stable diffusion|leonardo|ideogram|dall/.test(p) || has(/\b(image|photo|poster|thumbnail|logo|illustration|artwork|banner|wallpaper)\b/)) return "image";
  if (/sora|veo|runway/.test(p) || has(/\b(video|reel|short|tiktok|youtube|documentary|film|trailer|scene|storyboard|animation|cinematic)\b/)) return "video";
  if (has(/\b(seo|keyword|meta description|meta title|serp|backlink|search intent)\b/)) return "seo";
  if (has(/\b(blog|article|long[- ]form|guide|how[- ]to)\b/)) return "blog";
  if (has(/\b(instagram|facebook post|linkedin|twitter|x post|thread|caption|social media|reels caption)\b/)) return "social";
  if (has(/\b(ad|advert|facebook ad|google ad|copy|landing page|sales page|headline|cta|funnel|campaign)\b/)) return "ad";
  if (has(/\b(email|newsletter|cold outreach|drip|sequence|subject line)\b/)) return "email";
  if (has(/\b(code|function|refactor|bug|api|sql|regex|component|python|javascript|typescript|react|debug|algorithm)\b/)) return "code";
  if (has(/\b(resume|cv|cover letter|linkedin summary|bio)\b/)) return "resume";
  if (has(/\b(business plan|pitch|proposal|strategy|swot|market analysis|financial)\b/)) return "business";
  if (has(/\b(lesson|lecture|course|quiz|explain|tutor|study|homework|curriculum|flashcard)\b/)) return "education";
  if (has(/\b(product description|amazon listing|shopify|ecommerce|feature list)\b/)) return "product";
  if (has(/\b(story|novel|poem|script|screenplay|character|chapter|dialogue)\b/)) return "writing";
  return "general";
}

// ---------- Deterministic pseudo-random variation (per input) ----------
function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length];
}

// ---------- Category profiles ----------
type Profile = {
  roles: string[];
  audienceHint: string;
  instructions: (title: string, style: string) => string[];
  output: string[];
  notes: string[];
};

const PROFILES: Record<Category, Profile> = {
  image: {
    roles: [
      "an award-winning visual art director and prompt engineer specialised in text-to-image models",
      "a senior concept artist who writes production-grade prompts for generative image tools",
    ],
    audienceHint: "creators who will paste this prompt directly into a text-to-image model",
    instructions: (title) => [
      `Describe the exact subject of "${title}" — who or what appears, their pose, expression, clothing, and key props.`,
      "Set the scene: location, time of day, weather, background elements and depth layers (foreground, midground, background).",
      "Specify the visual style: art movement, medium, reference artists (only if broadly known), and mood keywords.",
      "Define camera and lens: shot type (close-up, wide, aerial), focal length, angle, depth of field, and composition rule.",
      "Lock lighting: main light direction, quality (soft/hard), colour temperature, rim/back light, and shadow behaviour.",
      "List colour palette in concrete hex or named tones, plus texture and material details.",
      "Add quality boosters (resolution, detail level) and a negative-prompt line for anything that must not appear.",
    ],
    output: [
      "One single paragraph optimised for the target model, followed by a separate line beginning with `Negative prompt:` listing exclusions.",
    ],
    notes: [
      "Avoid copyrighted characters or living-artist mimicry unless the user explicitly requested it.",
      "Keep the paragraph under 90 words for Midjourney/Flux; expand for Stable Diffusion where token limits are higher.",
    ],
  },
  video: {
    roles: [
      "a professional film director and AI video prompt engineer",
      "a senior cinematographer writing shot-by-shot prompts for generative video models",
    ],
    audienceHint: "video creators using Sora, Veo, Runway or similar generative video tools",
    instructions: (title) => [
      `State the core idea of "${title}" in one sentence, including subject, action, and setting.`,
      "Break the clip into 2–4 sequential beats with duration in seconds for each.",
      "For each beat, describe camera motion (dolly, pan, orbit, static), framing, and subject action.",
      "Define lighting, colour grade, weather and atmosphere consistently across beats.",
      "Specify audio direction only if the model supports it (ambient sound, dialogue tone, music mood).",
      "Add style anchors: film reference era, lens (e.g. anamorphic 35mm), grain, aspect ratio.",
      "Finish with continuity rules so subject, wardrobe and location stay consistent across beats.",
    ],
    output: [
      "Numbered beats, each formatted as `Beat N (Xs): <camera> — <action> — <lighting/mood>`, followed by a final `Global style:` line covering grade, lens and aspect ratio.",
    ],
    notes: [
      "Keep total runtime under the model's max (usually 8–20s).",
      "Avoid text overlays inside the prompt — most video models render them poorly.",
    ],
  },
  seo: {
    roles: ["a senior SEO strategist with a track record of ranking pages on competitive queries"],
    audienceHint: "a content team publishing on a real website",
    instructions: (title) => [
      `Identify the primary search intent behind "${title}" (informational, commercial, navigational, or transactional) and state it in one sentence.`,
      "Propose one primary keyword and 5–8 semantically related secondary keywords with brief intent notes.",
      "Draft a meta title (≤60 characters) and meta description (≤155 characters) that include the primary keyword naturally.",
      "Outline the article with H1, H2s and H3s that mirror the user's questions on the SERP.",
      "Recommend internal-link anchor ideas and 2–3 external authority sources to cite.",
      "Suggest a featured-snippet-ready answer block (40–55 words) placed near the top.",
      "List schema.org types worth adding (Article, FAQPage, HowTo, etc.).",
    ],
    output: [
      "Sections in this exact order: `Search intent`, `Keyword map`, `Meta title & description`, `Outline`, `Snippet block`, `Internal & external links`, `Schema recommendations`.",
    ],
    notes: [
      "Never invent statistics — mark any figure the writer must verify with `[verify]`.",
      "Keep keyword density natural; do not stuff.",
    ],
  },
  blog: {
    roles: ["an experienced long-form content writer and editor"],
    audienceHint: "readers arriving from search or newsletters",
    instructions: (title) => [
      `Open with a hook of 2–3 sentences that names the reader's problem behind "${title}" and promises a clear payoff.`,
      "Structure the article with a scannable outline (intro, 4–6 H2 sections, conclusion).",
      "In each section give one concrete example, mini-case, or numbered list — no filler paragraphs.",
      "Vary sentence length; keep paragraphs to 2–4 sentences for readability.",
      "Insert a short takeaway box at the end of each major section.",
      "Close with a summary and one clear next action for the reader.",
    ],
    output: [
      "Full article in Markdown with a title, meta description on the second line, then the body. Target length noted at the top.",
    ],
    notes: [
      "Cite sources inline as `[source: publisher, year]`; leave the URL blank if unknown so the writer can fill it in.",
    ],
  },
  social: {
    roles: ["a social media copywriter who studies platform-native voice daily"],
    audienceHint: "the specific platform's audience and algorithm",
    instructions: (title) => [
      `Write the post in the native voice of the target platform for "${title}" — no cross-platform copy-paste.`,
      "Lead with a scroll-stopping first line (question, contrarian claim, or bold number).",
      "Keep the body tight; break lines for mobile reading.",
      "End with a specific CTA (comment prompt, save, share, or link).",
      "Suggest 5–10 hashtags grouped as broad, niche, and branded.",
      "Add one alt-text line for any implied image.",
    ],
    output: [
      "Sections: `Hook`, `Body`, `CTA`, `Hashtags`, `Alt text`. Provide 2 alternate hooks at the end.",
    ],
    notes: ["Respect character limits: X ≤ 280, LinkedIn preview ≤ 210, Instagram caption ≤ 2200."],
  },
  ad: {
    roles: ["a direct-response copywriter trained on high-converting ad accounts"],
    audienceHint: "cold traffic clicking through a paid ad",
    instructions: (title) => [
      `Identify the single most painful problem the reader has that "${title}" solves.`,
      "Write 3 headline variants using different angles: pain, curiosity, and outcome.",
      "For each headline, write matching primary text (≤125 words) using PAS or AIDA.",
      "Add one testimonial-style social proof line per variant (mark with `[verify]` if fictionalised).",
      "End every variant with a specific CTA button label (2–4 words).",
      "Note the funnel stage each variant is best for.",
    ],
    output: [
      "A table with columns: `Variant`, `Angle`, `Headline`, `Primary text`, `CTA`, `Best for`.",
    ],
    notes: ["Avoid unverifiable claims and superlatives banned by Meta/Google ad policies."],
  },
  email: {
    roles: ["an email marketer who has shipped six-figure campaigns"],
    audienceHint: "subscribers reading on mobile in under 8 seconds",
    instructions: (title) => [
      `Write a subject line under 45 characters that matches the promise of "${title}", plus 2 alternates.`,
      "Write a preview text line (≤90 characters) that extends, not repeats, the subject.",
      "Open the email with a one-line personal hook, then get to value in the next two sentences.",
      "Use short paragraphs and one clear CTA button; secondary link only in the P.S.",
      "Sign off in the sender's voice; keep signature block minimal.",
    ],
    output: [
      "Sections: `Subject line + 2 alternates`, `Preview text`, `Body (Markdown)`, `CTA button label`, `P.S.`.",
    ],
    notes: ["Skip spam-trigger words (FREE!!!, guarantee, act now). Personalise with `{{first_name}}` merge tags."],
  },
  code: {
    roles: ["a senior software engineer and code reviewer"],
    audienceHint: "a developer who will paste the code into a real project",
    instructions: (title) => [
      `Restate the coding task from "${title}" as a one-sentence problem statement, then list explicit inputs and outputs with types.`,
      "State the language, framework, and version to target.",
      "Enumerate edge cases the solution must handle.",
      "Describe the preferred algorithmic approach and its time/space complexity.",
      "Require the solution to include inline comments only where non-obvious, and to be idiomatic to the target language.",
      "Ask for a small test block (3–5 cases) that demonstrates correctness.",
    ],
    output: [
      "A single fenced code block in the target language, followed by a `Tests` fenced block, then a short `Notes` section explaining trade-offs.",
    ],
    notes: ["No pseudo-code, no `TODO` placeholders, no imports of non-existent packages."],
  },
  resume: {
    roles: ["a career coach and technical recruiter"],
    audienceHint: "hiring managers screening in under 30 seconds",
    instructions: (title) => [
      `Anchor the document around the target role implied by "${title}".`,
      "Write a 3-sentence professional summary that names the role, years of experience, and one measurable win.",
      "Rewrite each experience bullet in the pattern: strong verb + task + tool + measurable result.",
      "Cap bullets at 2 lines and 6 bullets per role; drop weak bullets rather than pad.",
      "Add a skills section grouped as `Core`, `Tools`, `Soft`.",
      "Optimise for ATS: standard section names, no tables, no graphics.",
    ],
    output: [
      "Full resume in Markdown, then a separate `Change log` bullet list explaining what was strengthened and why.",
    ],
    notes: ["Never fabricate employment or metrics — mark unknowns with `[user to confirm]`."],
  },
  business: {
    roles: ["a management consultant with startup and enterprise experience"],
    audienceHint: "founders or executives making a decision",
    instructions: (title) => [
      `Frame the business question from "${title}" in one crisp sentence.`,
      "List the key assumptions and unknowns that would change the answer.",
      "Present the analysis in a MECE structure (mutually exclusive, collectively exhaustive).",
      "Quantify where possible; where data is missing, state a reasonable range and its basis.",
      "End with a recommendation, the top 3 risks, and the first 30-day action plan.",
    ],
    output: [
      "Sections: `Question`, `Assumptions`, `Analysis`, `Recommendation`, `Risks`, `30-day plan`. Use bullets and tables where they improve clarity.",
    ],
    notes: ["Distinguish clearly between facts, estimates, and opinions."],
  },
  education: {
    roles: ["an expert teacher who explains complex ideas simply"],
    audienceHint: "a learner encountering the topic for the first time",
    instructions: (title) => [
      `Define the learning outcome for "${title}" in one sentence starting with "By the end, the learner will…".`,
      "Explain the concept using a real-world analogy the learner already knows.",
      "Break the topic into 3–5 building blocks; teach each with a short definition and one worked example.",
      "Include one common misconception and how to correct it.",
      "End with a 5-question self-check quiz (mix of MCQ and short answer) plus an answer key.",
    ],
    output: [
      "Sections: `Learning outcome`, `Analogy`, `Building blocks`, `Common mistake`, `Quiz`, `Answer key`.",
    ],
    notes: ["Match vocabulary to the learner's stated level; define every jargon word on first use."],
  },
  product: {
    roles: ["an ecommerce copywriter who has written thousands of listings"],
    audienceHint: "shoppers comparing options on mobile",
    instructions: (title) => [
      `Lead with a benefit-driven title based on "${title}" that includes the primary keyword.`,
      "Write 5 bullet features formatted as `Benefit — feature that delivers it`.",
      "Write a 90–140 word product description with sensory and use-case language.",
      "Add a specifications table (dimensions, materials, care, warranty).",
      "Suggest 3 lifestyle-image alt-text lines.",
      "Provide 5 back-end search keywords, comma-separated, no repeats.",
    ],
    output: [
      "Sections: `Title`, `Bullets`, `Description`, `Specifications`, `Alt text`, `Search keywords`.",
    ],
    notes: ["Never invent certifications or medical claims."],
  },
  writing: {
    roles: ["a published author and story editor"],
    audienceHint: "readers of the intended genre",
    instructions: (title) => [
      `Establish the premise of "${title}" in one sentence including protagonist, desire, and obstacle.`,
      "Set point of view, tense, and narrative voice up front and keep them consistent.",
      "Show, don't tell: reveal character through action, dialogue, and specific sensory detail.",
      "Vary sentence rhythm; avoid adverb-heavy prose.",
      "End the scene on a decision, reversal, or unanswered question that pulls the reader forward.",
    ],
    output: [
      "Prose only, no headings inside the story. After the story, add a short `Craft notes` section explaining choices.",
    ],
    notes: ["Avoid clichéd openings (weather reports, waking up, mirror descriptions)."],
  },
  general: {
    roles: ["a domain expert and skilled prompt engineer"],
    audienceHint: "the end user of the AI tool",
    instructions: (title) => [
      `Restate the task from "${title}" in one precise sentence so the model cannot misinterpret it.`,
      "List the inputs the model has and any it should ask for if missing.",
      "Break the work into 4–6 concrete steps in the order the model should perform them.",
      "For each step, state the acceptable form of the answer.",
      "Require the model to self-check the final answer against the original request.",
    ],
    output: [
      "A single well-structured response with clear headings for each part of the answer.",
    ],
    notes: ["If information is missing, ask a targeted clarifying question instead of guessing."],
  },
};

// ---------- Prompt builder ----------
type BuildArgs = {
  title: string;
  goal: string;
  platform: string;
  style: string;
  quality: Quality;
  inputLang: Language;
  outputLang: Language;
};

function qualityDepth(q: Quality): { extraSteps: string[]; extraOutput: string[] } {
  switch (q) {
    case "Standard":
      return { extraSteps: [], extraOutput: [] };
    case "Advanced":
      return {
        extraSteps: ["Before finalising, list any assumptions you made so the user can correct them."],
        extraOutput: ["End with a short `Assumptions` list."],
      };
    case "Expert":
      return {
        extraSteps: [
          "Produce two distinct variations tuned for different sub-audiences.",
          "Explain the trade-offs between the variations in 2–3 sentences.",
        ],
        extraOutput: ["Deliver primary output first, then `Variation B`, then `Trade-offs`."],
      };
    case "Ultra Detailed":
      return {
        extraSteps: [
          "Produce three variations targeting different sub-audiences or goals.",
          "Score each variation 1–5 on clarity, originality, and fit; explain each score in one line.",
          "Recommend which variation to ship and why.",
          "Suggest 3 follow-up prompts the user could send next to iterate.",
        ],
        extraOutput: [
          "Deliver: (1) primary output, (2) two alternates, (3) scoring table, (4) recommendation, (5) follow-up prompts.",
        ],
      };
  }
}

function buildStructuredPrompt(args: BuildArgs): string {
  const L = getLabels(args.outputLang.code);
  const cat = detectCategory(args.title, args.platform, args.goal);
  const profile = PROFILES[cat];
  const title = args.title.trim();
  const goal = args.goal.trim();
  const style = args.style;
  const platform = args.platform;
  const seed = hashSeed(`${title}|${goal}|${platform}|${style}|${args.quality}|${args.outputLang.code}`);

  const role = pick(profile.roles, seed, 1);
  const { extraSteps, extraOutput } = qualityDepth(args.quality);
  const steps = [...profile.instructions(title, style), ...extraSteps];
  const outputSpec = [...profile.output, ...extraOutput];
  const notes = profile.notes;

  const objective = `Deliver a ${style.toLowerCase()} "${title}" that fulfils the following user brief:\n> ${goal}`;
  const context = [
    `- Target AI tool: ${platform}.`,
    `- Response language: ${args.outputLang.name} (${args.outputLang.native}). Do not mix languages.`,
    `- Audience: ${profile.audienceHint}.`,
    `- Quality level: ${args.quality}.`,
  ].join("\n");

  const numbered = steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  const outBlock = outputSpec.map((o) => `- ${o}`).join("\n");
  const noteBlock = notes.map((n) => `- ${n}`).join("\n");

  const sections = [
    `# ${L.role}`,
    `You are ${role}.`,
    "",
    `# ${L.objective}`,
    objective,
    "",
    `# ${L.context}`,
    context,
    "",
    `# ${L.instructions}`,
    numbered,
    "",
    `# ${L.output}`,
    outBlock,
  ];
  if (noteBlock) {
    sections.push("", `# ${L.notes}`, noteBlock);
  }
  return sections.join("\n");
}

/**
 * Placeholder for a future AI backend. Today this simply builds the
 * structured prompt locally with a small artificial delay so the UI
 * shows the loading state. Replace the body with a real API call
 * (e.g. Lovable AI Gateway) without changing any props or callers.
 */
async function generatePromptLocal(args: BuildArgs): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  return buildStructuredPrompt(args);
}

async function improvePromptLocal(current: string, args: BuildArgs): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  const L = getLabels(args.outputLang.code);
  const cat = detectCategory(args.title, args.platform, args.goal);
  const seed = hashSeed(`improve|${current.length}|${args.title}|${args.quality}`);
  const refinements: Record<Category, string[]> = {
    image: [
      "Add explicit lens (e.g. 35mm f/1.4) and shutter behaviour for motion blur or freeze.",
      "Specify a colour palette in hex and a texture pass (grain, film emulation).",
      "Extend the negative prompt with anatomy, text, and watermark exclusions.",
    ],
    video: [
      "Add per-beat camera speed in units (e.g. slow dolly-in at 0.2x).",
      "Lock a colour grade reference (e.g. teal-orange, muted pastel).",
      "Add a continuity checklist for wardrobe, props, and time-of-day.",
    ],
    seo: [
      "Add a `People Also Ask` block with 4 questions matched to H2s.",
      "Add an internal-linking map: 3 target pages with anchor text ideas.",
    ],
    blog: ["Add a byline, reading time, and 3 pull-quote candidates."],
    social: ["Add a carousel breakdown: slide-by-slide copy for 5 slides."],
    ad: ["Add UTM parameter suggestions and 3 landing-page headlines that match each ad variant."],
    email: ["Add a 3-email follow-up sequence outline with cadence in days."],
    code: ["Add a benchmark against a naive baseline and a note on where the solution would fail at scale."],
    resume: ["Add a tailored cover-letter outline (3 paragraphs) referencing the top 2 bullets."],
    business: ["Add a one-slide executive summary and a 90-day OKR set."],
    education: ["Add a spaced-repetition schedule and 5 flashcard prompts."],
    product: ["Add an A+ content section outline with 4 comparison points vs. the closest competitor."],
    writing: ["Add a next-scene setup and 3 dialogue options that raise stakes."],
    general: ["Add measurable success criteria and a self-evaluation rubric."],
  };
  const picks = refinements[cat];
  const chosen = [pick(picks, seed, 0), pick(picks, seed, 1)].filter((v, i, a) => a.indexOf(v) === i);
  const block = [
    "",
    "---",
    `# ${L.instructions} (refinements)`,
    ...chosen.map((c) => `- ${c}`),
    "- Before responding, restate the user brief in one sentence to confirm understanding.",
    "- After responding, list 3 improvements the user could request next.",
  ].join("\n");
  return current.trimEnd() + "\n" + block;
}

// ---------- Searchable language combobox ----------
function LanguageCombobox({
  value, onChange, label, id,
}: {
  value: Language;
  onChange: (l: Language) => void;
  label: string;
  id: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Label htmlFor={id} className="mb-2 block text-sm font-medium">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">{value.name}</span>
              <span className="truncate text-xs text-muted-foreground">{value.native}</span>
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search language…" />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {LANGUAGES.map((l) => (
                  <CommandItem
                    key={l.code}
                    value={`${l.name} ${l.native} ${l.code}`}
                    onSelect={() => { onChange(l); setOpen(false); }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${value.code === l.code ? "opacity-100" : "opacity-0"}`}
                    />
                    <span className="flex-1">{l.name}</span>
                    <span className="text-xs text-muted-foreground">{l.native}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ---------- Main component ----------
export default function PromptGenerator() {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [platform, setPlatform] = useState("ChatGPT");
  const [style, setStyle] = useState("Professional");
  const [quality, setQuality] = useState<Quality>("Advanced");
  const [inputLang, setInputLang] = useState<Language>(LANGUAGES[0]);
  const [outputLang, setOutputLang] = useState<Language>(LANGUAGES[0]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);

  const args = useMemo<BuildArgs>(() => ({
    title, goal, platform, style, quality, inputLang, outputLang,
  }), [title, goal, platform, style, quality, inputLang, outputLang]);

  const dir = RTL.has(outputLang.code) ? "rtl" : "ltr";

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Please add a prompt title.");
      return;
    }
    if (!goal.trim()) {
      toast.error("Describe your prompt goal.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const out = await generatePromptLocal(args);
      setResult(out);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!result) return;
    setImproving(true);
    try {
      const improved = await improvePromptLocal(result, args);
      setResult(improved);
      toast.success("Prompt improved");
    } finally {
      setImproving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed. Please try again.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safe = (title || "prompt").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    a.href = url;
    a.download = `${safe || "prompt"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setTitle("");
    setGoal("");
    setResult("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
    >
      {/* Languages */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <LanguageCombobox
          id="input-lang"
          value={inputLang}
          onChange={setInputLang}
          label="Your language"
        />
        <LanguageCombobox
          id="output-lang"
          value={outputLang}
          onChange={setOutputLang}
          label="Generate prompt in"
        />
      </div>

      {/* Title */}
      <div className="mt-5">
        <Label htmlFor="prompt-title" className="mb-2 block text-sm font-medium">
          Prompt title <span className="text-[color:var(--brand)]">*</span>
        </Label>
        <Input
          id="prompt-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. YouTube Documentary, SEO Blog, Facebook Ad"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TITLE_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTitle(s)}
              className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div className="mt-5">
        <Label htmlFor="prompt-goal" className="mb-2 block text-sm font-medium">
          Prompt goal <span className="text-[color:var(--brand)]">*</span>
        </Label>
        <Textarea
          id="prompt-goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Describe exactly what you want the AI to produce. Include audience, tone, length, and any must-have details."
          className="min-h-32 resize-none text-base"
          dir={RTL.has(inputLang.code) ? "rtl" : "ltr"}
        />
      </div>

      {/* Platform + Style */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label className="mb-2 block text-sm font-medium">AI platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 block text-sm font-medium">Prompt style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STYLES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quality */}
      <div className="mt-5">
        <Label className="mb-2 block text-sm font-medium">Prompt quality</Label>
        <div className="flex flex-wrap gap-2">
          {QUALITIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(q)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                quality === q
                  ? "border-transparent bg-gradient-brand text-white shadow-glow"
                  : "border-border hover:bg-accent"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-7 flex flex-wrap gap-2">
        <Button
          onClick={handleGenerate}
          disabled={loading}
          size="lg"
          className="bg-gradient-brand text-white shadow-glow hover:opacity-95"
        >
          {loading ? (
            <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating…</>
          ) : (
            <><Wand2 className="mr-2 h-4 w-4" /> Generate Prompt</>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleGenerate}
          disabled={loading || !result}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={handleClear}
          disabled={loading && !result}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </Button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-gradient-soft p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-[color:var(--brand)]" /> Your prompt
                </span>
                <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs text-muted-foreground">
                  {platform} · {style} · {quality} · {outputLang.name}
                </span>
              </div>
              <pre
                dir={dir}
                className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground"
              >
                {result}
              </pre>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" onClick={handleCopy} className="bg-gradient-brand text-white hover:opacity-95">
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={handleImprove} disabled={improving}>
                  {improving ? (
                    <><RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Improving…</>
                  ) : (
                    <><Wand className="mr-1.5 h-3.5 w-3.5" /> Improve Prompt</>
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={handleGenerate}>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Regenerate
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download TXT
                </Button>
                <Button size="sm" variant="ghost" onClick={handleClear}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tiny helper hint */}
      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Search className="h-3 w-3" />
        Write your goal in any language — the final prompt will be produced in your selected output language.
      </p>
    </motion.div>
  );
}
