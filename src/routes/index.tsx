import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import LandingPage from "@/components/LandingPage";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "PromptCraft AI — Generate Better AI Prompts in Seconds" },
      {
        name: "description",
        content:
          "Free AI prompt generator for ChatGPT, Claude, Gemini, Midjourney, Sora, Veo, Flux and more. Craft high-quality prompts in seconds — no account required.",
      },
      { property: "og:title", content: "PromptCraft AI — Generate Better AI Prompts in Seconds" },
      {
        property: "og:description",
        content:
          "Free AI prompt generator with expert templates for ChatGPT, Claude, Gemini, Midjourney, Sora and more.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PromptCraft AI — Generate Better AI Prompts in Seconds" },
      {
        name: "twitter:description",
        content:
          "Free AI prompt generator with expert templates for ChatGPT, Claude, Gemini, Midjourney and more.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "PromptCraft AI",
          applicationCategory: "ProductivityApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description:
            "Free AI prompt generator for ChatGPT, Claude, Gemini, Midjourney, Sora, Veo, Flux and more.",
        }),
      },
    ],
  }),
});

function Index() {
  const [dark, setDark] = useState(false);

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

  return <LandingPage dark={dark} setDark={setDark} />;
}
