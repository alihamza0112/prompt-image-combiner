import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Upload, Trash2, Download, Copy, RotateCcw, GripVertical, Layers, Wand2, Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/CopyButton";

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

export default function ImageCombinerTool() {
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
    } catch {
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
        const rr = radius;
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.arcTo(x + cell, y, x + cell, y + cell, rr);
        ctx.arcTo(x + cell, y + cell, x, y + cell, rr);
        ctx.arcTo(x, y + cell, x, y, rr);
        ctx.arcTo(x, y, x + cell, y, rr);
        ctx.closePath();
        ctx.clip();

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

      const mime = "image/png";
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
    a.download = `aixo-merged.${type}`;
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
    <div>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left: uploader + gallery */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.005 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`group cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all
              ${dragOver
                ? "border-primary bg-gradient-soft animate-drag-pulse shadow-glow"
                : "border-white/10 bg-white/[0.02] hover:border-primary/50 hover:bg-white/[0.04] hover:shadow-glow"}`}
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
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
          </motion.div>

          {images.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  {images.length} image{images.length > 1 ? "s" : ""} · drag to reorder
                </h4>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <Trash2 className="mr-1 h-4 w-4" /> Clear all
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                <AnimatePresence>
                  {images.map((it, idx) => (
                    <motion.div
                      key={it.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -3 }}
                      draggable
                      onDragStart={() => setDragIndex(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (dragIndex !== null) reorder(dragIndex, idx);
                        setDragIndex(null);
                      }}
                      className="group relative overflow-hidden rounded-xl border border-white/10 bg-card shadow-card transition-shadow hover:shadow-glow"
                    >
                      <div className="aspect-square bg-muted">
                        <img src={it.url} alt={it.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-white shadow">
                        {idx + 1}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeImage(it.id); }}
                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-background/90 opacity-0 transition group-hover:opacity-100"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 rounded-md bg-background/85 px-2 py-1 text-[11px] backdrop-blur">
                        <GripVertical className="h-3 w-3 shrink-0 text-muted-foreground" />
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
        <aside className="h-max rounded-2xl border border-white/10 bg-card p-5 shadow-card lg:sticky lg:top-24">
          <h3 className="flex items-center gap-2 font-semibold">
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
              className="h-11 w-full bg-gradient-brand text-white shadow-glow transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
            >
              {merging ? (
                <><RotateCcw className="mr-2 h-4 w-4 animate-spin" /> Merging…</>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4" /> Merge Images</>
              )}
            </Button>
          </div>
        </aside>
      </div>

      {/* Result */}
      <div ref={resultRef} className="mt-12">
        <AnimatePresence>
          {resultUrl && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="rounded-2xl border border-white/10 bg-card p-5 shadow-card md:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Check className="h-4 w-4 text-primary" /> Merged image
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => exportAs("png")}>
                    <Download className="mr-1 h-4 w-4" /> PNG
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => exportAs("jpg")}>
                    <Download className="mr-1 h-4 w-4" /> JPG
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => exportAs("webp")}>
                    <Download className="mr-1 h-4 w-4" /> WEBP
                  </Button>
                  <CopyButton
                    size="sm"
                    variant="outline"
                    getText={() => ""}
                    onCopy={async () => {
                      if (!resultBlob) throw new Error("No image");
                      await navigator.clipboard.write([
                        new ClipboardItem({ [resultBlob.type]: resultBlob }),
                      ]);
                    }}
                    toastMessage="Image copied successfully!"
                  />

                  <Button size="sm" variant="ghost" onClick={clearAll}>
                    <RotateCcw className="mr-1 h-4 w-4" /> Start over
                  </Button>
                </div>
              </div>
              <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
                <img src={resultUrl} alt="Merged" className="block h-auto w-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
