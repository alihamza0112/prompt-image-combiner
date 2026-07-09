import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Sparkles, Mic, MicOff, Copy, Trash2, Download, Moon, Sun, Menu, X, Images, Wand2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";

export const Route = createFileRoute("/voice-to-text")({
  component: VoiceToTextPage,
  head: () => ({
    meta: [
      { title: "AI Voice to Text — Free Browser Speech Recognition | ToolNex" },
      {
        name: "description",
        content:
          "Real-time voice-to-text in your browser. Record, transcribe, copy, and download — private, free, and multilingual. Part of the ToolNex micro SaaS toolkit.",
      },
      { property: "og:title", content: "AI Voice to Text — ToolNex" },
      {
        property: "og:description",
        content:
          "Free real-time speech-to-text with multi-language recognition. 100% browser-based.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/voice-to-text" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Voice to Text — ToolNex" },
      {
        name: "twitter:description",
        content: "Real-time browser-based speech-to-text, free and private.",
      },
    ],
    links: [{ rel: "canonical", href: "/voice-to-text" }],
  }),
});

const NAV_ITEMS = [
  { label: "Home", to: "/" as const, hash: undefined as string | undefined },
  { label: "AI Prompt Generator", to: "/" as const, hash: "generator" },
  { label: "Image Combiner", to: "/image-combiner" as const, hash: undefined },
  { label: "AI Voice to Text", to: "/voice-to-text" as const, hash: undefined },
];

const LANGUAGES: { code: string; label: string }[] = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es-ES", label: "Spanish (Spain)" },
  { code: "es-MX", label: "Spanish (Mexico)" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "it-IT", label: "Italian" },
  { code: "pt-BR", label: "Portuguese (Brazil)" },
  { code: "pt-PT", label: "Portuguese (Portugal)" },
  { code: "nl-NL", label: "Dutch" },
  { code: "ru-RU", label: "Russian" },
  { code: "pl-PL", label: "Polish" },
  { code: "tr-TR", label: "Turkish" },
  { code: "ar-SA", label: "Arabic" },
  { code: "hi-IN", label: "Hindi" },
  { code: "ja-JP", label: "Japanese" },
  { code: "ko-KR", label: "Korean" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "zh-TW", label: "Chinese (Traditional)" },
  { code: "id-ID", label: "Indonesian" },
];

function VoiceToTextPage() {
  const [dark, setDark] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("pc-theme") : null;
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setDark(stored ? stored === "dark" : !!prefersDark);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("pc-theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [inputLang, setInputLang] = useState("en-US");
  const [outputLang, setOutputLang] = useState("en-US");

  const recognitionRef = useRef<any>(null);
  const finalRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(Boolean(SR));
  }, []);

  const startListening = () => {
    if (typeof window === "undefined") return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    const rec = new SR();
    rec.lang = inputLang;
    rec.continuous = true;
    rec.interimResults = true;

    finalRef.current = transcript ? transcript + (transcript.endsWith(" ") ? "" : " ") : "";

    rec.onresult = (event: any) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0]?.transcript ?? "";
        if (res.isFinal) {
          finalRef.current += text + " ";
        } else {
          interimText += text;
        }
      }
      setTranscript(finalRef.current);
      setInterim(interimText);
    };

    rec.onerror = (e: any) => {
      if (e?.error === "not-allowed" || e?.error === "service-not-allowed") {
        toast.error("Microphone permission was denied.");
      } else if (e?.error === "no-speech") {
        // silent
      } else {
        toast.error(`Recognition error: ${e?.error ?? "unknown"}`);
      }
    };

    rec.onend = () => {
      setListening(false);
      setInterim("");
    };

    try {
      rec.start();
      recognitionRef.current = rec;
      setListening(true);
    } catch {
      toast.error("Could not start the microphone. Try again.");
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setListening(false);
  };

  const handleCopy = async () => {
    const text = transcript.trim();
    if (!text) {
      toast.error("Nothing to copy yet.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Transcript copied.");
    } catch {
      toast.error("Copy failed.");
    }
  };

  const handleClear = () => {
    stopListening();
    setTranscript("");
    setInterim("");
    finalRef.current = "";
  };

  const handleDownload = () => {
    const text = transcript.trim();
    if (!text) {
      toast.error("Nothing to download yet.");
      return;
    }
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `toolnex-transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = useMemo(
    () => transcript.trim().split(/\s+/).filter(Boolean).length,
    [transcript],
  );

  return (
    <div className="relative min-h-screen bg-background pb-[60px] text-foreground antialiased md:pb-0">
      <Toaster position="top-center" richColors theme={dark ? "dark" : "light"} />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">ToolNex</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                activeOptions={{ exact: true }}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:font-medium [&.active]:text-foreground"
                activeProps={{ className: "active" }}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/" hash="contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle dark mode"
              onClick={() => setDark(!dark)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:bg-accent"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              aria-label="Toggle menu"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:bg-accent md:hidden"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
            >
              <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.label.includes("Image") ? Images : item.label.includes("Voice") ? Mic : item.label.includes("Prompt") ? Wand2 : Sparkles;
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      hash={item.hash}
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" /> {item.label}
                    </Link>
                  );
                })}
                <Link
                  to="/"
                  hash="contact"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Contact
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Top banner ad */}
      <div className="border-b border-border/40 bg-muted/20 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdPlaceholder size="leaderboard" slotId="vt-top-banner" label="Adstera Ad Placement — Top Banner" />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-8 sm:pt-16">
        <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[380px] w-[380px] rounded-full bg-[oklch(0.7_0.2_265)] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute right-[-10%] top-20 h-[420px] w-[420px] rounded-full bg-[oklch(0.72_0.2_305)] opacity-40 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Mic className="h-3.5 w-3.5 text-[color:var(--brand)]" />
            Real-time speech recognition · Browser-only
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="text-gradient-brand">AI Voice to Text</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Speak, and watch your words appear instantly. Free, private, and multilingual.
          </p>
        </div>
      </section>

      {/* Tool */}
      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          {/* Language selectors */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="input-lang" className="text-xs uppercase tracking-wider text-muted-foreground">
                Recognition language
              </Label>
              <Select value={inputLang} onValueChange={setInputLang}>
                <SelectTrigger id="input-lang" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="output-lang" className="text-xs uppercase tracking-wider text-muted-foreground">
                Output language <span className="normal-case text-muted-foreground/70">(translation coming soon)</span>
              </Label>
              <Select value={outputLang} onValueChange={setOutputLang}>
                <SelectTrigger id="output-lang" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mic button */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <motion.button
              type="button"
              onClick={listening ? stopListening : startListening}
              disabled={supported === false}
              whileTap={{ scale: 0.95 }}
              aria-label={listening ? "Stop recording" : "Start recording"}
              className={`relative grid h-20 w-20 place-items-center rounded-full shadow-glow transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                listening
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gradient-brand text-white hover:opacity-95"
              }`}
            >
              {listening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              {listening && (
                <span className="absolute inset-0 animate-ping rounded-full bg-red-400/50" />
              )}
            </motion.button>
            <p className="text-xs text-muted-foreground">
              {listening ? "Listening… tap to stop" : "Tap the mic to start"}
            </p>
          </div>

          {/* Unsupported notice */}
          {supported === false && (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                Your browser does not support the Web Speech API. Please try a Chromium-based browser (Chrome, Edge, Brave, or Opera) on desktop or Android.
              </div>
            </div>
          )}

          {/* Transcript */}
          <div className="mt-6">
            <Label htmlFor="transcript" className="text-xs uppercase tracking-wider text-muted-foreground">
              Transcript
            </Label>
            <textarea
              id="transcript"
              value={transcript + (interim ? (transcript && !transcript.endsWith(" ") ? " " : "") + interim : "")}
              onChange={(e) => {
                setTranscript(e.target.value);
                finalRef.current = e.target.value;
              }}
              placeholder="Your transcribed text will appear here…"
              rows={10}
              className="mt-1.5 w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
              {listening && <span className="flex items-center gap-1.5"><span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Live</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="mr-1.5 h-4 w-4" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-1.5 h-4 w-4" /> Download TXT
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive">
              <Trash2 className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>
        </div>
      </section>

      {/* Above-footer ad */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="vt-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      {/* Footer */}
      <footer className="mt-4 border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-brand">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">ToolNex</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/image-combiner" className="hover:text-foreground">Image Combiner</Link>
            <Link to="/voice-to-text" className="hover:text-foreground">Voice to Text</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ToolNex</p>
        </div>
      </footer>

      <StickyMobileAd />
    </div>
  );
}
