import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Mail,
  MessageCircle,
  Github,
  MapPin,
  User,
  Send,
  Sparkles,
  Briefcase,
  LifeBuoy,
  Lightbulb,
  Bug,
} from "lucide-react";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { AdPlaceholder, StickyMobileAd } from "@/components/AdPlaceholder";
import {
  CardGrid,
  CtaSection,
  FaqSection,
  LongForm,
  SectionHeading,
  type Card,
} from "@/components/PageSections";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact AIXO — AI Tools Support, Feature Requests & Bug Reports" },
      {
        name: "description",
        content:
          "Contact AIXO for AI tools support, feature requests, bug reports, and business inquiries. Built by Ali Hamza — replies within 24 hours.",
      },
      { property: "og:title", content: "Contact — AIXO" },
      {
        property: "og:description",
        content: "Reach out to the AIXO team via email, WhatsApp, or GitHub.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://prompt-sparkle-ai-37.lovable.app/contact" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Contact — AIXO" },
    ],
    links: [{ rel: "canonical", href: "https://prompt-sparkle-ai-37.lovable.app/contact" }],
  }),
});

const INFO = [
  { icon: User, label: "Name", value: "Ali Hamza" },
  {
    icon: Mail,
    label: "Email",
    value: "contentbyali5@gmail.com",
    href: "mailto:contentbyali5@gmail.com",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "03142925435",
    href: "https://wa.me/923142925435",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "alihamza0112",
    href: "https://github.com/alihamza0112",
  },
  { icon: MapPin, label: "Location", value: "Burewala, Pakistan" },
];

const WHY_CONTACT: Card[] = [
  {
    icon: Briefcase,
    title: "Business",
    text: "Partnerships, sponsorships, ad placements, or collaborations — let's talk about working together.",
  },
  {
    icon: LifeBuoy,
    title: "Support",
    text: "Stuck with a tool or seeing unexpected behaviour? Send the details and we'll help you out.",
  },
  {
    icon: Lightbulb,
    title: "Feature Requests",
    text: "Have an idea for a new AI tool or an improvement? Your suggestions shape the AIXO roadmap.",
  },
  {
    icon: Bug,
    title: "Bug Reports",
    text: "Found something broken? Report it with a quick description and we'll ship a fix fast.",
  },
];

const FAQS = [
  {
    q: "How quickly does AIXO reply?",
    a: "Most emails and messages get a reply within 24 hours, usually much faster on weekdays.",
  },
  {
    q: "Is AIXO free to use?",
    a: "Yes. Every tool on AIXO — the Image Combiner and the AI Prompt Generator — is 100% free with no signup.",
  },
  {
    q: "Can I request a new tool or feature?",
    a: "Absolutely. Feature requests directly influence what we build next. Send an email or open an issue on GitHub.",
  },
  {
    q: "How do I report a bug?",
    a: "Use the contact form or email us with a short description, the tool you were using, and a screenshot if possible.",
  },
  {
    q: "Do you offer partnerships or ad placements?",
    a: "Yes. Reach out via email with a short overview of your brand and we'll get back to you with placement options.",
  },
  {
    q: "Where is AIXO based?",
    a: "AIXO is built and maintained from Burewala, Pakistan, and serves users worldwide.",
  },
];

function ContactPage() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      toast.error("Please fill in name, email, and message.");
      return;
    }
    setSending(true);
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    const subj = encodeURIComponent(subject || `New message from ${name}`);
    window.location.href = `mailto:contentbyali5@gmail.com?subject=${subj}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      toast.success("Opening your email client…");
      form.reset();
    }, 400);
  };

  return (
    <div className="relative min-h-screen bg-background pb-[60px] text-foreground antialiased md:pb-0">
      <Toaster position="top-center" richColors theme="dark" />
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-8 sm:pt-24">
        <div className="pointer-events-none absolute left-[-15%] top-[-10%] h-[460px] w-[460px] rounded-full bg-[oklch(0.7_0.2_265)] opacity-30 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute right-[-15%] top-10 h-[500px] w-[500px] rounded-full bg-[oklch(0.72_0.2_305)] opacity-30 blur-3xl animate-float-slower" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Let's talk
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl"
          >
            Get in <span className="text-gradient-brand">touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Have a question, an idea, or just want to say hi? Replies usually go out within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* Ad — below hero */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="contact-below-hero" label="Adstera Ad Placement — Below Hero" />
      </div>

      {/* Contact cards */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {INFO.map((item, i) => {
            const Card = (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="group h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-4 shadow-card backdrop-blur transition-shadow hover:shadow-glow"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand shadow-glow transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <item.icon className="h-4 w-4 text-white" />
                </span>
                <div className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </div>
                <div className="mt-1 truncate text-sm font-medium text-foreground">
                  {item.value}
                </div>
              </motion.div>
            );
            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="block"
              >
                {Card}
              </a>
            ) : (
              <div key={item.label}>{Card}</div>
            );
          })}
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-3xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-6 shadow-card backdrop-blur-xl sm:p-8"
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Send a <span className="text-gradient-brand">message</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill in the form and it'll open your email client, prefilled.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" placeholder="Your name" required />
              <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
              <div className="sm:col-span-2">
                <Field label="Subject" name="subject" placeholder="What's this about?" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="Write your message…"
                  className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-white/20 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={sending}
                size="lg"
                className="h-12 px-6 bg-gradient-brand text-white shadow-glow transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.97]"
              >
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Sending…" : "Send Message"}
              </Button>
            </div>
          </div>
        </motion.form>
      </section>

      {/* Why contact */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why contact"
          title="Why reach out to AIXO"
          subtitle="Whether it's a partnership, a bug, or a big idea — we want to hear it."
        />
        <div className="mt-10">
          <CardGrid cards={WHY_CONTACT} cols={4} />
        </div>
      </section>


      {/* Ad — above FAQ */}
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="banner" slotId="contact-pre-faq" label="Adstera Ad Placement — Above FAQ" />
      </div>

      <FaqSection faqs={FAQS} />

      <CtaSection
        title="Try the AIXO toolkit"
        subtitle="Fast, free, and private AI tools you can use right now."
        primary={{ label: "Open Image Combiner", to: "/image-combiner" }}
        secondary={{ label: "Try Prompt Generator", to: "/prompt-generator" }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <AdPlaceholder size="leaderboard" slotId="contact-above-footer" label="Adstera Ad Placement — Above Footer" />
      </div>

      <SiteFooter />
      <StickyMobileAd />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-white/20 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
