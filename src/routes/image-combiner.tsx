import { createFileRoute, Link } from "@tanstack/react-router";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Sparkles, Upload, Trash2, Download, Copy, RotateCcw, Image as ImageIcon,
  Lock, Moon, Sun, GripVertical, Layers, Wand2, Check, ArrowRight,
  MessageSquare, BookOpen, GraduationCap, BookMarked, Newspaper, FileText,
  ShoppingBag, Share2, ChevronDown, Menu, X, Images,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/image-combiner")({
  component: ImageCombinerPage,
  head: () => ({
    meta: [
      { title: "AI Image Combiner — Merge Unlimited Images into One | PromptCraft AI" },
      {
        name: "description",
        content:
          "Free browser-based AI Image Combiner. Merge unlimited PNG, JPG, or WEBP images into one organized image for ChatGPT, research, and social media. 100% private.",
      },
      { property: "og:title", content: "AI Image Combiner — Merge Unlimited Images into One" },
      {
        property: "og:description",
        content: "Combine dozens of images into one smart image, right in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Image Combiner — PromptCraft AI" },
      {
        name: "twitter:description",
        content: "Merge unlimited images into one — private, fast, browser-only.",
      },
    ],
    links: [{ rel: "canonical", href: "/image-combiner" }],
  }),
});

type UploadedImage = {
  id: string;
  file: File;
  name: string;
  size: number;
  url: string;
  img: HTMLImageElement;
};

type GridChoice = "auto" | "2" | "3" | "4" | "5";
type Quality = "standard" | "high" | "ultra";
type Bg = "white" | "black" | "transparent";

const USE_CASES = [
  { icon: MessageSquare, title: "ChatGPT Image Upload", desc: "Send many references in one shot." },
  { icon: BookOpen, title: "AI Research", desc: "Bundle sources for faster analysis." },
  { icon: GraduationCap, title: "Study Notes", desc: "Merge notebook pages into one sheet." },
  { icon: BookMarked, title: "Manga Pages", desc: "Compile chapters into a single image." },
  { icon: Newspaper, title: "Comics", desc: "Stitch panels for easy sharing." },
  { icon: FileText, title: "Documents", desc: "Combine scanned pages neatly." },
  { icon: ShoppingBag, title: "Product Photos", desc: "Create catalog-style layouts." },
  { icon: Share2, title: "Social Media", desc: "Craft collages and carousels." },
];

const FAQS = [
  { q: "Is the AI Image Combiner really free?", a: "Yes. It's 100% free with no account, no watermark, and no upload limits." },
  { q: "Are my images uploaded to a server?", a: "Never. All merging happens locally in your browser using the Canvas API. Your files never leave your device." },
  { q: "How many images can I combine?", a: "There's no hard limit — you can combine dozens or even hundreds, depending on your device's memory." },
  { q: "Which formats are supported?", a: "You can upload PNG, JPG, JPEG, and WEBP images and export as PNG, JPG, or WEBP." },
  { q: "Can I control the grid layout?", a: "Yes. Choose Auto or fix 2, 3, 4, or 5 columns, adjust spacing, borders, and rounded corners." },
  { q: "Does it work on mobile?", a: "Absolutely. The tool is fully responsive and works on modern mobile browsers." },
  { q: "Can I add numbers to each image?", a: "Yes. Toggle number labels on to overlay a numbered badge on each image in the merged output." },
  { q: "What's the maximum output quality?", a: "Ultra quality preserves near-original resolution. Use High or Standard for smaller file sizes." },
];

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function loadImage(file: File): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      resolve({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        name: file.name,
        size: file.size,
        url,
        img,
      });
    img.onerror = () => reject(new Error(`Failed to load ${file.name}`));
    img.src = url;
  });
}

function ImageCombinerPage() {
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
    try { localStorage.setItem("pc-theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [grid, setGrid] = useState<GridChoice>("auto");
  const [spacing, setSpacing] = useState<number>(12);
  const [border, setBorder] = useState(false);
  const [rounded, setRounded] = useState(true);
  const [quality, setQuality] = useState<Quality>("high");
  const [bg, setBg] = useState<Bg>("white");
  const [numbers, setNumbers] = useState(true);

  const [merging, setMerging] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      images.forEach((i) => URL.revokeObjectURL(i.url));
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) =>
      /image\/(png|jpe?g|webp)/i.test(f.type) || /\.(png|jpe?g|webp)$/i.test(f.name),
    );
    if (arr.length === 0) {
      toast.error("Only PNG, JPG, or WEBP files are supported.");
      return;
    }
    try {
      const loaded = await Promise.all(arr.map(loadImage));
      setImages((prev) => [...prev, ...loaded]);
      toast.success(`${loaded.length} image${loaded.length > 1 ? "s" : ""} added`);
    } catch (e) {
      toast.error("Some images failed to load.");
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setImages([]);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultBlob(null);
  };

  const reorder = (from: number, to: number) => {
    if (from === to || to < 0 || to >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });
  };

  const columnsFor = (count: number): number => {
    if (grid !== "auto") return Math.min(parseInt(grid, 10), count);
    if (count <= 1) return 1;
    if (count <= 4) return 2;
    if (count <= 9) return 3;
    if (count <= 16) return 4;
    return Math.min(5, Math.ceil(Math.sqrt(count)));
  };

  const qualityScale = quality === "ultra" ? 1 : quality === "high" ? 0.75 : 0.5;
  const qualityMime = quality === "ultra" ? 0.98 : quality === "high" ? 0.9 : 0.8;

  const doMerge = async () => {
    if (images.length === 0) {
      toast.error("Add some images first.");
      return;
    }
    setMerging(true);
    await new Promise((r) => setTimeout(r, 60));
    try {
      const cols = columnsFor(images.length);
      const rows = Math.ceil(images.length / cols);

      // Base cell size derived from average image size
      const avgW = images.reduce((s, i) => s + i.img.naturalWidth, 0) / images.length;
      const avgH = images.reduce((s, i) => s + i.img.naturalHeight, 0) / images.length;
      const baseCell = Math.max(240, Math.min(720, Math.round(Math.max(avgW, avgH) * 0.6)));
      const cell = Math.round(baseCell * qualityScale);
      const gap = Math.round(spacing * qualityScale);
      const pad = gap;
      const radius = rounded ? Math.round(cell * 0.06) : 0;
      const borderW = border ? Math.max(1, Math.round(2 * qualityScale)) : 0;

      const W = pad * 2 + cols * cell + (cols - 1) * gap;
      const H = pad * 2 + rows * cell + (rows - 1) * gap;

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unsupported");

      if (bg !== "transparent") {
        ctx.fillStyle = bg === "white" ? "#ffffff" : "#0b0b12";
        ctx.fillRect(0, 0, W, H);
      }

      images.forEach((it, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const x = pad + c * (cell + gap);
        const y = pad + r * (cell + gap);

        ctx.save();
        // Rounded clip
        const rr = radius;
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.arcTo(x + cell, y, x + cell, y + cell, rr);
        ctx.arcTo(x + cell, y + cell, x, y + cell, rr);
        ctx.arcTo(x, y + cell, x, y, rr);
        ctx.arcTo(x, y, x + cell, y, rr);
        ctx.closePath();
        ctx.clip();

        // Cover fit
        const iw = it.img.naturalWidth;
        const ih = it.img.naturalHeight;
        const scale = Math.max(cell / iw, cell / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = x + (cell - dw) / 2;
        const dy = y + (cell - dh) / 2;
        ctx.drawImage(it.img, dx, dy, dw, dh);
        ctx.restore();

        if (borderW) {
          ctx.strokeStyle = bg === "black" ? "rgba(255,255,255,0.25)" : "rgba(15,15,25,0.18)";
          ctx.lineWidth = borderW;
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.arcTo(x + cell, y, x + cell, y + cell, radius);
          ctx.arcTo(x + cell, y + cell, x, y + cell, radius);
          ctx.arcTo(x, y + cell, x, y, radius);
          ctx.arcTo(x, y, x + cell, y, radius);
          ctx.closePath();
          ctx.stroke();
        }

        if (numbers) {
          const badge = Math.max(28, Math.round(cell * 0.11));
          const bx = x + Math.round(cell * 0.06);
          const by = y + Math.round(cell * 0.06);
          const grad = ctx.createLinearGradient(bx, by, bx + badge, by + badge);
          grad.addColorStop(0, "#6d5cff");
          grad.addColorStop(1, "#c07bff");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(bx + badge / 2, by + badge / 2, badge / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = `600 ${Math.round(badge * 0.5)}px Inter, system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(idx + 1), bx + badge / 2, by + badge / 2 + 1);
        }
      });

      const mime = bg === "transparent" ? "image/png" : "image/png";
      const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("Export failed"))), mime, qualityMime),
      );
      const url = URL.createObjectURL(blob);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultBlob(blob);
      setResultUrl(url);
      toast.success("Merged image ready");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    } catch (e) {
      console.error(e);
      toast.error("Failed to merge images.");
    } finally {
      setMerging(false);
    }
  };

  const exportAs = async (type: "png" | "jpg" | "webp") => {
    if (images.length === 0) return toast.error("Nothing to export.");
    // Re-render with target mime for lossy formats
    const src = resultUrl ? await fetch(resultUrl).then((r) => r.blob()) : null;
    if (!src) return toast.error("Merge first.");
    const img = new Image();
    const objUrl = URL.createObjectURL(src);
    img.src = objUrl;
    await new Promise((res) => (img.onload = () => res(null)));
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (type !== "png") {
      ctx.fillStyle = bg === "black" ? "#0b0b12" : "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    const mime = type === "png" ? "image/png" : type === "jpg" ? "image/jpeg" : "image/webp";
    const blob: Blob = await new Promise((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error("Export failed"))), mime, qualityMime),
    );
    URL.revokeObjectURL(objUrl);
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `promptcraft-merged.${type}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copyImage = async () => {
    if (!resultBlob) return toast.error("Merge first.");
    try {
      await navigator.clipboard.write([new ClipboardItem({ [resultBlob.type]: resultBlob })]);
      toast.success("Image copied to clipboard");
    } catch {
      toast.error("Your browser blocked image copy. Try downloading instead.");
    }
  };

  const gridCols = useMemo(() => {
    if (images.length === 0) return 1;
    return columnsFor(images.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, images.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />

      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">PromptCraft AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition">Home</Link>
            <Link to="/" hash="generator" className="text-muted-foreground hover:text-foreground transition">
              AI Prompt Generator
            </Link>
            <Link
              to="/image-combiner"
              aria-current="page"
              className="font-medium text-foreground transition"
            >
              Image Combiner
            </Link>
            <Link to="/" hash="features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition">FAQ</a>
            <Link to="/" hash="contact" className="text-muted-foreground hover:text-foreground transition">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost" size="icon" aria-label="Toggle theme"
              onClick={() => setDark((d) => !d)}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              className="hidden sm:inline-flex bg-gradient-brand text-white hover:opacity-90"
              onClick={() => toolRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Combining <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
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
                <Link
                  to="/"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/"
                  hash="generator"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  AI Prompt Generator
                </Link>
                <Link
                  to="/image-combiner"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground bg-accent/50"
                >
                  <Images className="h-4 w-4" /> Image Combiner
                </Link>
                <Link
                  to="/"
                  hash="features"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  Features
                </Link>
                <a
                  href="#faq"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  FAQ
                </a>
                <Link
                  to="/"
                  hash="contact"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
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
          <AdPlaceholder size="leaderboard" slotId="ic-top-banner" label="Adstera Ad Placement — Top Banner" />
        </div>
      </div>

      {/* Hero */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gradient-brand opacity-30 blur-3xl animate-float-slow" />
          <div className="absolute top-20 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-soft opacity-70 blur-3xl animate-float-slower" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Layers className="h-3.5 w-3.5" /> New tool · 100% browser-based
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Merge <span className="text-gradient-brand">Unlimited Images</span> into One Smart Image
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              Combine dozens or even hundreds of images into one organized image that can easily be shared
              with ChatGPT or other AI tools. Fast, private, and free.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg" className="bg-gradient-brand text-white hover:opacity-90 shadow-glow"
                onClick={() => toolRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                <Wand2 className="mr-2 h-4 w-4" /> Start Combining
              </Button>
              <Button size="lg" variant="outline" onClick={() => inputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload Images
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No signup</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No uploads to servers</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Unlimited images</span>
            </div>
          </motion.div>

          {/* Preview mock */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-14 rounded-2xl border border-border/60 bg-card shadow-card p-4 md:p-6"
          >
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl bg-gradient-soft border border-border/60 grid place-items-center overflow-hidden"
                >
                  <div className="absolute top-1.5 left-1.5 h-6 w-6 rounded-full bg-gradient-brand text-white text-[11px] font-semibold grid place-items-center shadow">
                    {i + 1}
                  </div>
                  <ImageIcon className="h-6 w-6 text-muted-foreground/60" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tool */}
      <section id="tool" ref={toolRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Left: uploader + gallery */}
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`group cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 text-center bg-card
                ${dragOver ? "border-primary bg-gradient-soft" : "border-border/70 hover:border-primary/60"}`}
            >
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center shadow-glow">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Drop images here or click to upload</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                PNG, JPG, JPEG, or WEBP · unlimited count · processed locally
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                hidden
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
            </div>

            {/* Gallery */}
            {images.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    {images.length} image{images.length > 1 ? "s" : ""} · drag to reorder
                  </h4>
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    <Trash2 className="h-4 w-4 mr-1" /> Clear all
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <AnimatePresence>
                    {images.map((it, idx) => (
                      <motion.div
                        key={it.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        draggable
                        onDragStart={() => setDragIndex(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (dragIndex !== null) reorder(dragIndex, idx);
                          setDragIndex(null);
                        }}
                        className="group relative rounded-xl overflow-hidden border border-border/60 bg-card shadow-card"
                      >
                        <div className="aspect-square bg-muted">
                          <img src={it.url} alt={it.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute top-2 left-2 h-7 w-7 rounded-full bg-gradient-brand text-white text-xs font-semibold grid place-items-center shadow">
                          {idx + 1}
                        </div>
                        <button
                          onClick={() => removeImage(it.id)}
                          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/90 border border-border grid place-items-center opacity-0 group-hover:opacity-100 transition"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 rounded-md bg-background/85 backdrop-blur px-2 py-1 text-[11px]">
                          <GripVertical className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="truncate">{it.name}</span>
                          <span className="ml-auto text-muted-foreground">{fmtBytes(it.size)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Right: settings */}
          <aside className="rounded-2xl border border-border/60 bg-card p-5 shadow-card h-max lg:sticky lg:top-24">
            <h3 className="font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" /> Merge settings
            </h3>

            <div className="mt-5 space-y-5">
              <div>
                <Label className="text-xs">Grid</Label>
                <Select value={grid} onValueChange={(v) => setGrid(v as GridChoice)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="2">2 Columns</SelectItem>
                    <SelectItem value="3">3 Columns</SelectItem>
                    <SelectItem value="4">4 Columns</SelectItem>
                    <SelectItem value="5">5 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Spacing</Label>
                  <span className="text-xs text-muted-foreground">{spacing}px</span>
                </div>
                <Slider
                  value={[spacing]} min={0} max={48} step={1}
                  onValueChange={(v) => setSpacing(v[0])}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Border</Label>
                <Switch checked={border} onCheckedChange={setBorder} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Rounded corners</Label>
                <Switch checked={rounded} onCheckedChange={setRounded} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Number labels</Label>
                <Switch checked={numbers} onCheckedChange={setNumbers} />
              </div>

              <div>
                <Label className="text-xs">Quality</Label>
                <Select value={quality} onValueChange={(v) => setQuality(v as Quality)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Background</Label>
                <Select value={bg} onValueChange={(v) => setBg(v as Bg)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="transparent">Transparent (PNG)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 text-xs text-muted-foreground">
                Layout: {gridCols} column{gridCols > 1 ? "s" : ""}
              </div>

              <Button
                onClick={doMerge}
                disabled={merging || images.length === 0}
                className="w-full bg-gradient-brand text-white hover:opacity-90 shadow-glow h-11"
              >
                {merging ? (
                  <><RotateCcw className="h-4 w-4 mr-2 animate-spin" /> Merging…</>
                ) : (
                  <><Wand2 className="h-4 w-4 mr-2" /> Merge Images</>
                )}
              </Button>
            </div>
          </aside>
        </div>

        {/* Result */}
        <div ref={resultRef} className="mt-14">
          <AnimatePresence>
            {resultUrl && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="rounded-2xl border border-border/60 bg-card p-5 md:p-6 shadow-card"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Merged image
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => exportAs("png")}>
                      <Download className="h-4 w-4 mr-1" /> PNG
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportAs("jpg")}>
                      <Download className="h-4 w-4 mr-1" /> JPG
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportAs("webp")}>
                      <Download className="h-4 w-4 mr-1" /> WEBP
                    </Button>
                    <Button size="sm" variant="outline" onClick={copyImage}>
                      <Copy className="h-4 w-4 mr-1" /> Copy
                    </Button>
                    <Button size="sm" variant="ghost" onClick={clearAll}>
                      <RotateCcw className="h-4 w-4 mr-1" /> Start over
                    </Button>
                  </div>
                </div>
                <div className="mt-5 rounded-xl overflow-hidden border border-border/60 bg-[conic-gradient(at_top_left,_var(--muted),_transparent_30%)]">
                  <img src={resultUrl} alt="Merged" className="w-full h-auto block" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Privacy */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl border border-border/60 bg-gradient-soft p-6 md:p-8 flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-background grid place-items-center border border-border/60">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">100% private by design</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              Your images never leave your device. Everything is processed locally in your browser using the
              Canvas API — no uploads, no tracking, no accounts.
            </p>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Built for every workflow</h2>
          <p className="mt-3 text-muted-foreground">
            One merged image, endless use cases. Perfect whenever many images need to travel as one.
          </p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map((u, i) => (
            <motion.div
              key={u.title}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.03 }}
              className="rounded-2xl border border-border/60 bg-card p-5 shadow-card hover:shadow-glow transition"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-soft grid place-items-center">
                <u.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{u.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{u.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Frequently asked questions</h2>
          <p className="mt-3 text-muted-foreground">Everything you need to know about the AI Image Combiner.</p>
        </div>
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-brand grid place-items-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PromptCraft AI — all tools 100% free.
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Prompt Generator</Link>
            <Link to="/image-combiner" className="hover:text-foreground">Image Combiner</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Unused import guard — keeps the ChevronDown available for Accordion styling in future.
void ChevronDown;
