import { useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { Layers } from "lucide-react";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import ImageCombinerTool from "@/components/ImageCombinerTool";

export default function LandingPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="relative min-h-screen bg-background pb-[60px] text-foreground antialiased md:pb-0">
      <Toaster position="top-center" richColors theme="dark" />

      <SiteHeader />

      {/* Short hero */}
      <section className="relative overflow-hidden pt-12 pb-6 sm:pt-16">
        <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[380px] w-[380px] rounded-full bg-[oklch(0.7_0.2_265)] opacity-25 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute right-[-10%] top-16 h-[420px] w-[420px] rounded-full bg-[oklch(0.72_0.2_305)] opacity-25 blur-3xl animate-float-slower" />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Layers className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Free · 100% browser-based
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Merge images in seconds with <span className="text-gradient-brand">AIXO</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Drop your images, arrange them, and export one clean merged image — private, fast, no account.
          </p>
        </motion.div>
      </section>

      {/* Primary tool */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <ImageCombinerTool />
      </section>

      {/* Above-footer ad */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="home-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />

      <StickyMobileAd />
    </div>
  );
}
