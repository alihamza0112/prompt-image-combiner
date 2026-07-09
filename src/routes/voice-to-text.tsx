import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Mic, MicOff, Copy, Trash2, AlertCircle, Download, Languages } from "lucide-react";
import { translateText, baseLang } from "@/lib/translate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/voice-to-text")({
  component: VoiceToTextPage,
  head: () => ({
    meta: [
      { title: "AI Voice to Text — Free Browser Speech Recognition | AIXO" },
      {
        name: "description",
        content:
          "Real-time voice-to-text in your browser. Record, transcribe, and copy — private, free, and multilingual. Part of the AIXO micro SaaS toolkit.",
      },
      { property: "og:title", content: "AI Voice to Text — AIXO" },
      {
        property: "og:description",
        content: "Free real-time speech-to-text with multi-language recognition. 100% browser-based.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/voice-to-text" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Voice to Text — AIXO" },
      { name: "twitter:description", content: "Real-time browser-based speech-to-text, free and private." },
    ],
    links: [{ rel: "canonical", href: "/voice-to-text" }],
  }),
});

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
  { code: "ur-PK", label: "Urdu" },
  { code: "bn-IN", label: "Bengali" },
  { code: "vi-VN", label: "Vietnamese" },
  { code: "th-TH", label: "Thai" },
];

function VoiceToTextPage() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [lang, setLang] = useState("en-US");
  const [outputLang, setOutputLang] = useState("en-US");
  const [translated, setTranslated] = useState("");
  const [translating, setTranslating] = useState(false);
  const [translationAvailable, setTranslationAvailable] = useState(true);
  const [permissionBlocked, setPermissionBlocked] = useState(false);
  const [inIframe, setInIframe] = useState(false);

  const recognitionRef = useRef<any>(null);
  const finalRef = useRef<string>("");
  const translateTimer = useRef<number | null>(null);

  const sameLang = baseLang(lang) === baseLang(outputLang);

  // Debounced translation whenever the transcript or target language changes.
  useEffect(() => {
    if (translateTimer.current) window.clearTimeout(translateTimer.current);
    if (!transcript.trim() || sameLang) {
      setTranslated("");
      setTranslating(false);
      return;
    }
    setTranslating(true);
    translateTimer.current = window.setTimeout(async () => {
      try {
        const res = await translateText(transcript, lang, outputLang);
        setTranslated(res.text);
        setTranslationAvailable(res.translated);
      } finally {
        setTranslating(false);
      }
    }, 400);
    return () => {
      if (translateTimer.current) window.clearTimeout(translateTimer.current);
    };
  }, [transcript, lang, outputLang, sameLang]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(Boolean(SR));
    try {
      setInIframe(window.self !== window.top);
    } catch {
      setInIframe(true); // cross-origin access to top → definitely iframed
    }
  }, []);

  const ensureMicPermission = async (): Promise<boolean> => {
    // Pre-flight the mic via getUserMedia so we get a precise error (NotAllowed,
    // Dismissed, iframe permissions-policy block) BEFORE SpeechRecognition
    // starts. In a sandboxed iframe without `allow="microphone"` this fails
    // deterministically, letting us tell the user to open the app in a new tab.
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return true; // let SpeechRecognition try; onerror will handle it
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately release — SpeechRecognition opens its own stream.
      stream.getTracks().forEach((t) => t.stop());
      setPermissionBlocked(false);
      return true;
    } catch (err: any) {
      const name = err?.name || "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setPermissionBlocked(true);
        toast.error(
          inIframe
            ? "Microphone is blocked inside the preview. Open the site in a new tab to use it."
            : "Microphone permission was denied. Allow mic access in your browser's site settings.",
        );
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        toast.error("No microphone was found on this device.");
      } else if (name === "NotReadableError") {
        toast.error("Your microphone is being used by another app.");
      } else {
        toast.error(`Microphone error: ${name || "unknown"}`);
      }
      return false;
    }
  };

  const startListening = async () => {
    if (typeof window === "undefined") return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    const allowed = await ensureMicPermission();
    if (!allowed) return;

    const rec = new SR();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;

    finalRef.current = transcript ? transcript + (transcript.endsWith(" ") ? "" : " ") : "";

    rec.onresult = (event: any) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0]?.transcript ?? "";
        if (res.isFinal) finalRef.current += text + " ";
        else interimText += text;
      }
      setTranscript(finalRef.current);
      setInterim(interimText);
    };

    rec.onerror = (e: any) => {
      if (e?.error === "not-allowed" || e?.error === "service-not-allowed") {
        setPermissionBlocked(true);
        toast.error(
          inIframe
            ? "Microphone is blocked in the preview iframe. Open in a new tab."
            : "Microphone permission was denied.",
        );
      } else if (e?.error !== "no-speech" && e?.error !== "aborted") {
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
    try { recognitionRef.current?.stop(); } catch {}
    setListening(false);
  };


  const handleCopy = async () => {
    const text = transcript.trim();
    if (!text) return toast.error("Nothing to copy yet.");
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

  const wordCount = useMemo(
    () => transcript.trim().split(/\s+/).filter(Boolean).length,
    [transcript],
  );

  return (
    <div className="relative min-h-screen bg-background pb-[60px] text-foreground antialiased md:pb-0">
      <Toaster position="top-center" richColors theme="dark" />

      <SiteHeader />

      {/* Top banner ad */}
      <div className="border-b border-white/5 bg-white/[0.02] py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdPlaceholder size="leaderboard" slotId="vt-top-banner" label="Adstera Ad Placement — Top Banner" />
        </div>
      </div>

      {/* Compact hero */}
      <section className="relative overflow-hidden pt-14 pb-8 sm:pt-20">
        <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[380px] w-[380px] rounded-full bg-[oklch(0.7_0.2_265)] opacity-25 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute right-[-10%] top-20 h-[420px] w-[420px] rounded-full bg-[oklch(0.72_0.2_305)] opacity-25 blur-3xl animate-float-slower" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Mic className="h-3.5 w-3.5 text-[color:var(--brand)]" />
            Real-time speech recognition · Browser-only
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="text-gradient-brand">AI Voice to Text</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Speak, and watch your words appear instantly. Free, private, and multilingual.
          </p>
        </motion.div>
      </section>

      {/* Tool */}
      <section className="mx-auto max-w-3xl px-4 pb-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-card backdrop-blur sm:p-8"
        >
          {/* Language selector */}
          <div>
            <Label htmlFor="lang" className="text-xs uppercase tracking-wider text-muted-foreground">
              Recognition language
            </Label>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger id="lang" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mic button */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <motion.button
              type="button"
              onClick={listening ? stopListening : startListening}
              disabled={supported === false}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
              aria-label={listening ? "Stop recording" : "Start recording"}
              className={`relative grid h-24 w-24 place-items-center rounded-full shadow-glow transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                listening
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gradient-brand text-white hover:opacity-95"
              }`}
            >
              {listening ? <MicOff className="h-9 w-9" /> : <Mic className="h-9 w-9" />}
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
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                Your browser does not support the Web Speech API. Please try a Chromium-based browser (Chrome, Edge, Brave, or Opera) on desktop or Android.
              </div>
            </div>
          )}

          {/* Iframe / permission-blocked notice */}
          {supported !== false && (permissionBlocked || inIframe) && (
            <div className="mt-6 flex flex-col gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200 sm:flex-row sm:items-start">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-amber-100">
                  {permissionBlocked ? "Microphone access is blocked." : "Preview iframe may block the microphone."}
                </p>
                <p className="mt-1 text-amber-200/90">
                  {inIframe
                    ? "This page is running inside a preview frame that doesn't grant microphone access. Open the site in a new tab, then allow the mic when your browser asks."
                    : "Click the lock icon in your address bar, allow microphone for this site, then reload."}
                </p>
              </div>
              {inIframe && (
                <a
                  href={typeof window !== "undefined" ? window.location.href : "/voice-to-text"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-md bg-amber-400/20 px-3 py-1.5 text-xs font-medium text-amber-100 ring-1 ring-inset ring-amber-400/40 transition-colors hover:bg-amber-400/30"
                >
                  Open in new tab
                </a>
              )}
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
              className="mt-1.5 w-full resize-y rounded-lg border border-white/10 bg-background/50 px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
              {listening && (
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Live
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="active:scale-[0.97]">
              <Copy className="mr-1.5 h-4 w-4" /> Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="text-destructive hover:text-destructive active:scale-[0.97]"
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Clear
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Above-footer ad */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="vt-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />

      <StickyMobileAd />
    </div>
  );
}
