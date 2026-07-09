import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles, Copy, RefreshCw, Trash2, Wand2, Download, Check,
  ChevronsUpDown, Search, Wand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
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
  role: string; goal: string; context: string; instructions: string;
  constraints: string; output: string; formatting: string;
  intro: (title: string, platform: string) => string;
};

const LABELS: Record<string, SectionLabels> = {
  en: {
    role: "Role", goal: "Goal", context: "Context", instructions: "Instructions",
    constraints: "Constraints", output: "Desired Output", formatting: "Formatting",
    intro: (t, p) => `You are helping produce a "${t}" prompt for ${p}.`,
  },
  es: {
    role: "Rol", goal: "Objetivo", context: "Contexto", instructions: "Instrucciones",
    constraints: "Restricciones", output: "Salida deseada", formatting: "Formato",
    intro: (t, p) => `Estás ayudando a crear un prompt de "${t}" para ${p}.`,
  },
  fr: {
    role: "Rôle", goal: "Objectif", context: "Contexte", instructions: "Instructions",
    constraints: "Contraintes", output: "Résultat souhaité", formatting: "Mise en forme",
    intro: (t, p) => `Vous aidez à produire un prompt "${t}" pour ${p}.`,
  },
  de: {
    role: "Rolle", goal: "Ziel", context: "Kontext", instructions: "Anweisungen",
    constraints: "Einschränkungen", output: "Gewünschte Ausgabe", formatting: "Formatierung",
    intro: (t, p) => `Sie erstellen einen "${t}"-Prompt für ${p}.`,
  },
  ur: {
    role: "کردار", goal: "مقصد", context: "پس منظر", instructions: "ہدایات",
    constraints: "پابندیاں", output: "مطلوبہ نتیجہ", formatting: "فارمیٹنگ",
    intro: (t, p) => `آپ ${p} کے لیے "${t}" پرامپٹ تیار کر رہے ہیں۔`,
  },
  ar: {
    role: "الدور", goal: "الهدف", context: "السياق", instructions: "التعليمات",
    constraints: "القيود", output: "المخرجات المطلوبة", formatting: "التنسيق",
    intro: (t, p) => `أنت تساعد في إنشاء موجه "${t}" لـ ${p}.`,
  },
  hi: {
    role: "भूमिका", goal: "लक्ष्य", context: "संदर्भ", instructions: "निर्देश",
    constraints: "सीमाएँ", output: "अपेक्षित परिणाम", formatting: "फ़ॉर्मेटिंग",
    intro: (t, p) => `आप ${p} के लिए "${t}" प्रॉम्प्ट तैयार कर रहे हैं।`,
  },
  "zh-CN": {
    role: "角色", goal: "目标", context: "背景", instructions: "指令",
    constraints: "约束", output: "期望输出", formatting: "格式",
    intro: (t, p) => `你正在为 ${p} 创建一个"${t}"提示词。`,
  },
  "zh-TW": {
    role: "角色", goal: "目標", context: "背景", instructions: "指令",
    constraints: "限制", output: "期望輸出", formatting: "格式",
    intro: (t, p) => `你正在為 ${p} 建立一個「${t}」提示詞。`,
  },
  ja: {
    role: "役割", goal: "目的", context: "背景", instructions: "指示",
    constraints: "制約", output: "期待される出力", formatting: "フォーマット",
    intro: (t, p) => `${p} 向けの「${t}」プロンプトを作成しています。`,
  },
  ko: {
    role: "역할", goal: "목표", context: "배경", instructions: "지시사항",
    constraints: "제약", output: "원하는 결과", formatting: "형식",
    intro: (t, p) => `${p}용 "${t}" 프롬프트를 작성하고 있습니다.`,
  },
  pt: {
    role: "Papel", goal: "Objetivo", context: "Contexto", instructions: "Instruções",
    constraints: "Restrições", output: "Saída desejada", formatting: "Formatação",
    intro: (t, p) => `Você está criando um prompt "${t}" para ${p}.`,
  },
  it: {
    role: "Ruolo", goal: "Obiettivo", context: "Contesto", instructions: "Istruzioni",
    constraints: "Vincoli", output: "Output desiderato", formatting: "Formattazione",
    intro: (t, p) => `Stai creando un prompt "${t}" per ${p}.`,
  },
  tr: {
    role: "Rol", goal: "Amaç", context: "Bağlam", instructions: "Talimatlar",
    constraints: "Kısıtlamalar", output: "İstenen çıktı", formatting: "Biçimlendirme",
    intro: (t, p) => `${p} için bir "${t}" promptu hazırlıyorsun.`,
  },
  ru: {
    role: "Роль", goal: "Цель", context: "Контекст", instructions: "Инструкции",
    constraints: "Ограничения", output: "Желаемый результат", formatting: "Формат",
    intro: (t, p) => `Вы создаёте промпт "${t}" для ${p}.`,
  },
  id: {
    role: "Peran", goal: "Tujuan", context: "Konteks", instructions: "Instruksi",
    constraints: "Batasan", output: "Hasil yang diinginkan", formatting: "Format",
    intro: (t, p) => `Anda membuat prompt "${t}" untuk ${p}.`,
  },
  vi: {
    role: "Vai trò", goal: "Mục tiêu", context: "Bối cảnh", instructions: "Hướng dẫn",
    constraints: "Ràng buộc", output: "Kết quả mong muốn", formatting: "Định dạng",
    intro: (t, p) => `Bạn đang tạo một prompt "${t}" cho ${p}.`,
  },
  th: {
    role: "บทบาท", goal: "เป้าหมาย", context: "บริบท", instructions: "คำแนะนำ",
    constraints: "ข้อจำกัด", output: "ผลลัพธ์ที่ต้องการ", formatting: "รูปแบบ",
    intro: (t, p) => `คุณกำลังสร้างพรอมต์ "${t}" สำหรับ ${p}`,
  },
  bn: {
    role: "ভূমিকা", goal: "লক্ষ্য", context: "প্রেক্ষাপট", instructions: "নির্দেশনা",
    constraints: "সীমাবদ্ধতা", output: "কাঙ্ক্ষিত আউটপুট", formatting: "ফরম্যাট",
    intro: (t, p) => `আপনি ${p}-এর জন্য একটি "${t}" প্রম্পট তৈরি করছেন।`,
  },
  pa: {
    role: "ਭੂਮਿਕਾ", goal: "ਟੀਚਾ", context: "ਪ੍ਰਸੰਗ", instructions: "ਹਦਾਇਤਾਂ",
    constraints: "ਪਾਬੰਦੀਆਂ", output: "ਲੋੜੀਂਦਾ ਨਤੀਜਾ", formatting: "ਫਾਰਮੈਟ",
    intro: (t, p) => `ਤੁਸੀਂ ${p} ਲਈ ਇੱਕ "${t}" ਪ੍ਰੌਂਪਟ ਬਣਾ ਰਹੇ ਹੋ।`,
  },
};

function getLabels(code: string): SectionLabels {
  return LABELS[code] ?? LABELS.en;
}

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

function qualityDepth(q: Quality): { steps: number; extras: string[] } {
  switch (q) {
    case "Standard":
      return { steps: 3, extras: [] };
    case "Advanced":
      return { steps: 5, extras: ["Include one concrete example."] };
    case "Expert":
      return {
        steps: 7,
        extras: [
          "Include two concrete, contrasting examples.",
          "Explicitly list edge cases and how to handle them.",
        ],
      };
    case "Ultra Detailed":
      return {
        steps: 9,
        extras: [
          "Include three worked examples with commentary.",
          "List edge cases, failure modes, and mitigations.",
          "Add an evaluation rubric the model can self-check against.",
        ],
      };
  }
}

function buildStructuredPrompt(args: BuildArgs): string {
  const L = getLabels(args.outputLang.code);
  const { steps, extras } = qualityDepth(args.quality);
  const platform = args.platform;
  const style = args.style;
  const title = args.title.trim();
  const goal = args.goal.trim();

  const stepList = Array.from({ length: steps }, (_, i) =>
    `${i + 1}. ${stepFor(i, title, style)}`,
  ).join("\n");

  const sections: string[] = [
    L.intro(title, platform),
    "",
    `# ${L.role}`,
    `A senior ${style.toLowerCase()} specialist with deep experience producing "${title}" deliverables for ${platform}.`,
    "",
    `# ${L.goal}`,
    goal || `Produce an outstanding "${title}" deliverable that fully satisfies the user's brief.`,
    "",
    `# ${L.context}`,
    `Target platform: ${platform}. Style: ${style}. Quality level: ${args.quality}.`,
    `User's working language: ${args.inputLang.name}. Final response language: ${args.outputLang.name} (${args.outputLang.native}).`,
    "",
    `# ${L.instructions}`,
    stepList,
    ...extras.map((e) => `- ${e}`),
    "",
    `# ${L.constraints}`,
    `- Respond entirely in ${args.outputLang.name}. Do not mix languages.`,
    `- Stay strictly on the topic of "${title}".`,
    `- Do not invent facts. If uncertain, say so briefly.`,
    `- Avoid filler, disclaimers, and meta commentary.`,
    "",
    `# ${L.output}`,
    outputExpectation(title, style, args.quality),
    "",
    `# ${L.formatting}`,
    `Use clear Markdown with short paragraphs, meaningful headings, and bullet lists where helpful. Keep the tone ${style.toLowerCase()}.`,
  ];

  return sections.join("\n");
}

function stepFor(i: number, title: string, style: string): string {
  const s = [
    `Restate the user's goal for "${title}" in one sentence.`,
    `Identify the audience and the single most important outcome.`,
    `Draft the core deliverable in a ${style.toLowerCase()} voice.`,
    `Sharpen the hook, opening, or headline for maximum attention.`,
    `Add specific, believable details (numbers, names, scenarios).`,
    `Tighten structure: remove redundancy, improve flow, add transitions.`,
    `Insert a clear call-to-action or next step for the reader.`,
    `Self-review against the constraints and rewrite any weak section.`,
    `Return the final version, followed by a short "why this works" note.`,
  ];
  return s[i] ?? s[s.length - 1];
}

function outputExpectation(title: string, style: string, q: Quality): string {
  const base = `A complete, ready-to-use "${title}" in a ${style.toLowerCase()} style.`;
  switch (q) {
    case "Standard":
      return `${base} Keep it concise and immediately usable.`;
    case "Advanced":
      return `${base} Include a short rationale after the main deliverable.`;
    case "Expert":
      return `${base} Include: (a) the deliverable, (b) 2 alternative variations, (c) a brief rationale.`;
    case "Ultra Detailed":
      return `${base} Include: (a) the deliverable, (b) 3 variations tuned for different audiences, (c) a rationale, (d) a self-check against the rubric, (e) suggested follow-up prompts.`;
  }
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
  const improvements = [
    ``,
    `---`,
    `# ${L.instructions} (refined)`,
    `- Add measurable success criteria before drafting.`,
    `- Include one strong example and one weak example, and explain the difference.`,
    `- End with 3 follow-up prompts the user can send next.`,
  ].join("\n");
  return current.trimEnd() + "\n" + improvements;
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
