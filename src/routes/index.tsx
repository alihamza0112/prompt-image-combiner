import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/components/LandingPage";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ToolNex — Free Micro SaaS AI Toolkit" },
      {
        name: "description",
        content:
          "A lightweight micro SaaS toolkit: AI Prompt Generator, Image Combiner, and AI Voice to Text. Fast, private, and free — no account required.",
      },
      { property: "og:title", content: "ToolNex — Free Micro SaaS AI Toolkit" },
      {
        property: "og:description",
        content:
          "AI Prompt Generator, Image Combiner, and AI Voice to Text — a fast, private toolkit for creators.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ToolNex — Free Micro SaaS AI Toolkit" },
      {
        name: "twitter:description",
        content:
          "Free micro SaaS AI toolkit: prompt generator, image combiner, and voice-to-text.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "ToolNex",
          applicationCategory: "ProductivityApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description:
            "Micro SaaS toolkit with AI Prompt Generator, Image Combiner, and AI Voice to Text.",
        }),
      },
    ],
  }),
});

function Index() {
  return <LandingPage />;
}
