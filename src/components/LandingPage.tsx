import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Sparkles, Copy, RefreshCw, Trash2, Zap, Bot, ClipboardCheck, Target,
  Smartphone, Lock, Moon, Sun, Youtube, PenLine, Search, Megaphone,
  FileText, Linkedin, Instagram, Mail, Code2, Palette, Briefcase,
  ChevronDown, ArrowRight, Wand2, Check, Star, History, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const CATEGORIES = [
  "ChatGPT", "Gemini", "Claude", "Midjourney", "Veo", "Sora", "Flux",
  "Stable Diffusion", "Blog Writing", "SEO", "YouTube", "Coding",
  "Marketing", "Resume", "Email", "Social Media",
];
const TONES = ["Professional", "Friendly", "Creative", "Formal", "Funny", "Expert"];

type Length = "Short" | "Medium" | "Long";

function buildPrompt(category: string, goal: string, tone: string, length: Length) {
  const g = goal.trim() || "the topic I provide";
  const detail =
    length === "Short"
      ? "Keep the response concise (roughly 120 words), skimmable, and focused on the single most important angle."
      : length === "Medium"
      ? "Provide a well-structured response of about 300–400 words with clear sections and practical detail."
      : "Deliver a comprehensive, in-depth response of 700+ words with sections, examples, edge cases and actionable steps.";

  const toneLine = `Write in a ${tone.toLowerCase()} tone, matching the voice of a seasoned ${category} specialist.`;

  const map: Record<string, string> = {
    ChatGPT: `Act as an expert consultant using ChatGPT. Task: ${g}. Break the problem down step-by-step, ask any clarifying questions up front, then deliver a structured answer with headings, bullet points, and a final "Next Actions" checklist.`,
    Gemini: `You are a research-oriented Gemini assistant. Objective: ${g}. Pull together facts, compare 2–3 perspectives, cite reasoning, and return the answer as: Summary → Key Insights → Recommended Approach → Risks.`,
    Claude: `Adopt the role of a thoughtful Claude analyst. Goal: ${g}. Reason carefully, expose your assumptions, and produce a nuanced answer formatted with a short executive summary followed by a detailed breakdown.`,
    Midjourney: `/imagine prompt: ${g}, cinematic composition, ultra-detailed, dramatic rim lighting, volumetric fog, shot on Hasselblad H6D, 85mm lens, shallow depth of field, hyper-realistic textures, color grade inspired by Deakins --ar 16:9 --style raw --v 6`,
    Sora: `Generate an 8-second cinematic video: ${g}. Camera: slow dolly-in, 35mm anamorphic. Lighting: golden-hour rim light with soft fill. Motion: subtle parallax, natural character movement. Mood: awe-inspiring, hopeful. Deliver in 1080p, 24fps.`,
    Veo: `Create a 10-second Veo cinematic clip about: ${g}. Style: photoreal, shallow depth of field, filmic color grade. Camera moves smoothly from wide to medium. Include ambient sound design cues and a single emotional beat.`,
    Flux: `Flux prompt: ${g}. Editorial photography, natural skin tones, soft window light, medium format aesthetic, sharp focus on subject, rich shadow detail, ultra-realistic, 4k.`,
    "Stable Diffusion": `masterpiece, best quality, ${g}, intricate detail, volumetric lighting, cinematic composition, sharp focus, 8k, trending on artstation. Negative: blurry, lowres, extra fingers, watermark, text.`,
    "Blog Writing": `Write a 1,200-word SEO blog post about: ${g}. Include a hook intro, 5 H2 sections with H3 subpoints, real examples, an FAQ block with 3 questions, and a concise conclusion with a clear CTA.`,
    SEO: `Act as a senior SEO strategist. Topic: ${g}. Return: (1) primary keyword + 10 semantically related keywords, (2) SERP intent analysis, (3) recommended title (≤60 chars) and meta description (≤155 chars), (4) H1–H3 outline, (5) internal linking suggestions.`,
    YouTube: `Write a high-retention YouTube script about: ${g}. Structure: 8-second hook, promise, 3 story-driven sections with pattern interrupts every 30s, mid-roll CTA, strong payoff, and 3 title + thumbnail concepts.`,
    Coding: `You are a senior engineer. Task: ${g}. Respond with: (1) clarifying assumptions, (2) a clean, production-ready code solution with comments, (3) time/space complexity, (4) 3 test cases including an edge case, (5) suggested refactors.`,
    Marketing: `Act as a growth marketer. Objective: ${g}. Deliver: audience persona, core message, 3 positioning angles, a 5-post launch sequence, and 3 headline variations optimized for click-through.`,
    Resume: `Craft an ATS-friendly resume bullet set for: ${g}. Use the XYZ formula ("Accomplished X, as measured by Y, by doing Z"). Provide 5 quantified bullets, a 3-sentence professional summary, and 8 relevant hard-skill keywords.`,
    Email: `Write a persuasive email about: ${g}. Include: subject line (≤50 chars) with 2 A/B variants, personalized opener, one clear value proposition, single CTA, and a friendly sign-off. Keep it under 150 words.`,
    "Social Media": `Create a 7-day social content plan for: ${g}. For each day give: platform, hook, caption (≤220 chars), hashtag set, and a visual direction. Include one carousel, one reel script, and one poll.`,
  };

  const base = map[category] ?? map.ChatGPT;
  return `${base}\n\n${toneLine} ${detail}`;
}

const TEMPLATES = [
  { icon: Youtube, title: "YouTube Script", desc: "High-retention video script with hook, story, and CTA.", category: "YouTube", goal: "a viral YouTube video about earning money online in 2026" },
  { icon: PenLine, title: "Blog Writing", desc: "Long-form SEO-optimized article outline and copy.", category: "Blog Writing", goal: "the best productivity habits for remote workers" },
  { icon: Search, title: "SEO Article", desc: "Keyword-first article with metadata and structure.", category: "SEO", goal: "how to rank a new website on Google in 2026" },
  { icon: Megaphone, title: "Facebook Ads", desc: "Scroll-stopping ad copy with hook, body, and CTA.", category: "Marketing", goal: "a Facebook ad for a $29 online course on AI prompts" },
  { icon: Target, title: "Google Ads", desc: "High-CTR responsive search ad headlines and descriptions.", category: "Marketing", goal: "Google Search ads for a SaaS invoicing tool" },
  { icon: FileText, title: "Resume", desc: "ATS-friendly quantified resume bullets and summary.", category: "Resume", goal: "a senior frontend engineer with 6 years of React experience" },
  { icon: Linkedin, title: "LinkedIn Post", desc: "Thought-leadership post with hook and story arc.", category: "Social Media", goal: "a LinkedIn post about lessons learned from launching a side project" },
  { icon: Instagram, title: "Instagram Caption", desc: "Engaging caption with hashtags and CTA.", category: "Social Media", goal: "an Instagram caption for a beach travel reel in Bali" },
  { icon: Mail, title: "Cold Email", desc: "Personalized outreach email that gets replies.", category: "Email", goal: "a cold email to a SaaS founder offering design services" },
  { icon: Code2, title: "Coding", desc: "Production-ready code with tests and complexity notes.", category: "Coding", goal: "a TypeScript function to debounce API calls with cancellation" },
  { icon: Palette, title: "UI Design", desc: "Design brief for a modern, polished interface.", category: "Midjourney", goal: "a minimalist SaaS dashboard UI with glassmorphism and soft gradients" },
  { icon: Briefcase, title: "Business Plan", desc: "Structured plan covering market, model, and metrics.", category: "ChatGPT", goal: "a lean business plan for a subscription meal-prep startup" },
];

const FEATURES = [
  { icon: Zap, title: "Lightning Fast", desc: "Generate polished prompts in under a second — no waiting, no queues." },
  { icon: Bot, title: "AI Ready", desc: "Optimized templates for ChatGPT, Claude, Gemini, Midjourney, Sora and more." },
  { icon: ClipboardCheck, title: "One Click Copy", desc: "Copy any prompt to your clipboard with a single tap and paste anywhere." },
  { icon: Target, title: "Better Results", desc: "Structured prompts engineered to get sharper, more usable AI output." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Fully responsive — craft prompts on desktop, tablet, or phone." },
  { icon: Lock, title: "Privacy First", desc: "Everything runs in your browser. No accounts, no tracking, no data stored." },
];

const STEPS = [
  { n: "01", title: "Choose a category", desc: "Pick the AI tool or use case you're writing for." },
  { n: "02", title: "Describe your goal", desc: "Tell PromptCraft what you want to accomplish." },
  { n: "03", title: "Generate your prompt", desc: "Get a structured, expert-level prompt instantly." },
  { n: "04", title: "Copy & use it", desc: "Paste it into ChatGPT, Claude, Midjourney or any AI." },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Content Creator", quote: "PromptCraft cut my scripting time in half. The YouTube prompts alone are worth it — my average watch time jumped 22%." },
  { name: "Marcus Alvarez", role: "Indie SaaS Founder", quote: "I use it every morning for marketing copy. The prompts feel like they were written by a strategist, not a template." },
  { name: "Priya Natarajan", role: "Product Designer", quote: "The Midjourney and UI design prompts are unreal. I get usable concepts on the first generation, every time." },
];

const FAQS = [
  { q: "Is PromptCraft AI free to use?", a: "Yes — every feature on this page is free. No sign-up, no credit card, no hidden limits. Generate as many prompts as you need." },
  { q: "Which AI tools do these prompts work with?", a: "The generator supports ChatGPT, Claude, Gemini, Midjourney, Sora, Veo, Flux, Stable Diffusion, and general use cases like SEO, blogging, coding, resumes, email and social media." },
  { q: "Do you store the prompts I generate?", a: "No. PromptCraft runs entirely in your browser. Nothing you type or generate is sent to a server, logged, or shared." },
  { q: "How is this different from writing my own prompt?", a: "PromptCraft applies proven prompt-engineering patterns — role framing, structured output, tone control, length control — so you get sharper, more usable AI responses without trial and error." },
  { q: "Can I edit the generated prompt before using it?", a: "Absolutely. Treat each generation as a strong starting point. Copy it, tweak the specifics, and paste it into your favorite AI tool." },
  { q: "Does it work on mobile?", a: "Yes. The entire experience is fully responsive and works great on phones, tablets and desktops." },
  { q: "Do I need an API key or account for any AI provider?", a: "No. PromptCraft only generates the prompt text — you then paste it into whichever AI tool you already use." },
  { q: "Can I use these prompts commercially?", a: "Yes. Generated prompts are yours to use however you like, including for client work, marketing campaigns and commercial content." },
];

function GradientBlob({ className }: { className?: string }) {
  return <div className={`pointer-events-none absolute rounded-full blur-3xl opacity-60 ${className}`} />;
}

type HistoryItem = {
  id: string;
  category: string;
  goal: string;
  tone: string;
  length: Length;
  prompt: string;
  createdAt: number;
};

const HISTORY_KEY = "pc-prompt-history";
const HISTORY_MAX = 20;

export default function LandingPage({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [category, setCategory] = useState("ChatGPT");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState<Length>("Medium");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  const persistHistory = (items: HistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch {}
  };

  const addToHistory = (item: Omit<HistoryItem, "id" | "createdAt">) => {
    const entry: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    const deduped = history.filter((h) => h.prompt !== entry.prompt);
    persistHistory([entry, ...deduped].slice(0, HISTORY_MAX));
  };

  const generate = () => {
    if (!goal.trim()) {
      toast.error("Describe your goal first", { description: "Tell us what you want the AI to do." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const prompt = buildPrompt(category, goal, tone, length);
      setResult(prompt);
      addToHistory({ category, goal, tone, length, prompt });
      setLoading(false);
      toast.success("Prompt generated");
    }, 700);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  const reuseHistoryItem = (h: HistoryItem) => {
    setCategory(h.category);
    setGoal(h.goal);
    setTone(h.tone);
    setLength(h.length);
    setResult(h.prompt);
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast.success("Loaded from history");
  };

  const deleteHistoryItem = (id: string) => {
    persistHistory(history.filter((h) => h.id !== id));
  };

  const clearHistory = () => {
    persistHistory([]);
    toast.success("History cleared");
  };

  const useTemplate = (t: (typeof TEMPLATES)[number]) => {
    setCategory(t.category);
    setGoal(t.goal);
    setTone("Professional");
    setLength("Medium");
    const prompt = buildPrompt(t.category, t.goal, "Professional", "Medium");
    setResult(prompt);
    addToHistory({ category: t.category, goal: t.goal, tone: "Professional", length: "Medium", prompt });
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast.success(`Loaded: ${t.title}`);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      <Toaster position="top-center" richColors theme={dark ? "dark" : "light"} />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">PromptCraft AI</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {[
              ["Generator", "generator"],
              ["Templates", "templates"],
              ["Features", "features"],
              ["How it works", "how"],
              ["FAQ", "faq"],
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle dark mode"
              onClick={() => setDark(!dark)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:bg-accent"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button asChild size="sm" className="bg-gradient-brand text-white shadow-glow hover:opacity-95">
              <a href="#generator">Try Free</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
        <GradientBlob className="left-[-10%] top-[-10%] h-[420px] w-[420px] bg-[oklch(0.7_0.2_265)] animate-float-slow" />
        <GradientBlob className="right-[-10%] top-20 h-[500px] w-[500px] bg-[oklch(0.72_0.2_305)] animate-float-slower" />
        <GradientBlob className="left-1/3 bottom-[-15%] h-[420px] w-[420px] bg-[oklch(0.75_0.18_240)] animate-float-slow opacity-40" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
              Free forever · No account needed
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Generate Better <span className="text-gradient-brand">AI Prompts</span> in Seconds
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Create powerful prompts for ChatGPT, Gemini, Claude, Midjourney, Veo, Sora, Flux and more — using one simple tool built on proven prompt-engineering patterns.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-gradient-brand text-white shadow-glow hover:opacity-95">
                <a href="#generator">
                  Generate Prompt <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#features">Explore Features</a>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[color:var(--brand)]" /> 16 AI categories</div>
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Runs 100% in browser</div>
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Zero tracking</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <HeroPreview />
          </motion.div>
        </div>
      </section>

      {/* Generator */}
      <section id="generator" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="AI Prompt Generator"
            title="Craft a prompt in under 10 seconds"
            subtitle="Pick a category, describe your goal, tune the tone and length. We handle the rest."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm font-medium">Prompt category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-5">
              <Label className="mb-2 block text-sm font-medium">Prompt goal</Label>
              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={`Example:\n"I want to create a YouTube video about earning money online."`}
                className="min-h-32 resize-none text-base"
              />
            </div>

            <div className="mt-5">
              <Label className="mb-2 block text-sm font-medium">Output length</Label>
              <RadioGroup
                value={length}
                onValueChange={(v) => setLength(v as Length)}
                className="flex flex-wrap gap-2"
              >
                {(["Short", "Medium", "Long"] as Length[]).map((l) => (
                  <label
                    key={l}
                    htmlFor={`len-${l}`}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      length === l
                        ? "border-transparent bg-gradient-brand text-white shadow-glow"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <RadioGroupItem id={`len-${l}`} value={l} className="sr-only" />
                    {l}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="mt-8">
              <Button
                onClick={generate}
                disabled={loading}
                size="lg"
                className="w-full bg-gradient-brand text-white shadow-glow transition-transform hover:opacity-95 active:scale-[0.99] sm:w-auto"
              >
                {loading ? (
                  <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating…</>
                ) : (
                  <><Wand2 className="mr-2 h-4 w-4" /> Generate Prompt</>
                )}
              </Button>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 16, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8 overflow-hidden"
                >
                  <div className="rounded-xl border border-border bg-gradient-soft p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Your prompt
                      </span>
                      <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs text-muted-foreground">
                        {category} · {tone} · {length}
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
                      {result}
                    </pre>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => copy(result)} className="bg-gradient-brand text-white hover:opacity-95">
                        <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy Prompt
                      </Button>
                      <Button size="sm" variant="outline" onClick={generate}>
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Regenerate
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setResult(""); setGoal(""); }}>
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* History */}
      <section id="history" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Prompt History"
            title="Your recent prompts"
            subtitle="Saved locally in your browser. Reuse or copy any prompt with one tap — nothing is sent to a server."
          />
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <History className="h-4 w-4" />
                <span>
                  {history.length} saved{history.length === 1 ? " prompt" : " prompts"}
                  {history.length >= HISTORY_MAX ? ` (max ${HISTORY_MAX})` : ""}
                </span>
              </div>
              {history.length > 0 && (
                <Button size="sm" variant="ghost" onClick={clearHistory}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear all
                </Button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-background/40 p-10 text-center">
                <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-soft">
                  <History className="h-5 w-5 text-[color:var(--brand)]" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No prompts yet. Generate one above and it'll appear here.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {history.map((h) => (
                    <motion.li
                      key={h.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl border border-border bg-background/50 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-full bg-gradient-brand px-2 py-0.5 font-medium text-white">
                            {h.category}
                          </span>
                          <span className="text-muted-foreground">{h.tone} · {h.length}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground">
                            {new Date(h.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 truncate text-sm font-medium text-foreground">{h.goal}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{h.prompt}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => reuseHistoryItem(h)}>
                          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reuse
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => copy(h.prompt)}>
                          <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteHistoryItem(h.id)}>
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="relative py-20 sm:py-28">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Prompt Templates"
            title="Ready-made prompts for every use case"
            subtitle="Tap any card to preload the generator with a battle-tested prompt."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-soft">
                  <t.icon className="h-5 w-5 text-[color:var(--brand)]" />
                </div>
                <h3 className="text-base font-semibold">{t.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
                <div className="mt-5 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => useTemplate(t)}>
                    Use template
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copy(buildPrompt(t.category, t.goal, "Professional", "Medium"))}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Features"
            title="Built for creators who ship"
            subtitle="Everything you need to get better output from any AI tool — nothing you don't."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand shadow-glow">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="How it works"
            title="Four simple steps"
            subtitle="From blank textarea to a production-grade prompt in under a minute."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <div className="text-gradient-brand text-3xl font-bold tabular-nums">{s.n}</div>
                <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead eyebrow="Loved by creators" title="What people are saying" />
          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex gap-0.5 text-[color:var(--brand)]">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
          <Accordion type="single" collapsible className="mt-10">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-brand p-10 text-center shadow-glow sm:p-16">
            <div className="absolute inset-0 opacity-30 mix-blend-overlay [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_40%)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Start writing prompts that actually work
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/85">
                Free forever. No account. Runs entirely in your browser.
              </p>
              <Button asChild size="lg" className="mt-8 bg-white text-[color:var(--brand)] hover:bg-white/90">
                <a href="#generator">
                  Try PromptCraft <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-brand">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">PromptCraft AI</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms &amp; Conditions</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} PromptCraft AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
        <Sparkles className="h-3 w-3 text-[color:var(--brand)]" /> {eyebrow}
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-3xl bg-gradient-brand opacity-20 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-glow">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 text-xs text-muted-foreground">promptcraft.ai / generator</span>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">YouTube Script</div>
              <div className="text-xs text-muted-foreground">Category · Professional tone</div>
            </div>
            <div className="ml-auto flex items-center gap-1 rounded-full bg-gradient-soft px-2 py-1 text-[10px] font-medium text-[color:var(--brand)]">
              <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)] animate-pulse" /> Live
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Generated Prompt
            </div>
            <TypingLines />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[["Copy", ClipboardCheck], ["Regen", RefreshCw], ["Clear", Trash2]].map(([label, Icon], i) => {
              const Ic = Icon as typeof ClipboardCheck;
              return (
                <div key={i} className="flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs">
                  <Ic className="h-3.5 w-3.5" /> {label as string}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gradient-soft px-3 py-2 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground"><Zap className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Generated in 0.8s</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TypingLines() {
  const lines = [
    "Write a high-retention YouTube script about earning",
    "money online in 2026. Structure: 8-second hook, promise,",
    "3 story-driven sections with pattern interrupts every 30s,",
    "mid-roll CTA, strong payoff, and 3 title + thumbnail concepts.",
  ];
  return (
    <div className="space-y-1.5 text-xs leading-relaxed text-foreground/90">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.25, duration: 0.4 }}
        >
          {l}
        </motion.div>
      ))}
    </div>
  );
}
