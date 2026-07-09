import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Mail, MessageCircle, Github, MapPin, User, Send } from "lucide-react";
import SiteHeader, { SiteFooter } from "@/components/SiteHeader";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — AIXO" },
      {
        name: "description",
        content:
          "Get in touch with Ali Hamza, creator of AIXO — AI-powered micro SaaS tools for creators, students, freelancers, and professionals.",
      },
      { property: "og:title", content: "Contact — AIXO" },
      {
        property: "og:description",
        content: "Reach out to the AIXO team via email, WhatsApp, or GitHub.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Contact — AIXO" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
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
    const body = encodeURIComponent(
      `From: ${name} <${email}>\n\n${message}`
    );
    const subj = encodeURIComponent(subject || `New message from ${name}`);
    window.location.href = `mailto:contentbyali5@gmail.com?subject=${subj}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      toast.success("Opening your email client…");
      form.reset();
    }, 400);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      <Toaster position="top-center" richColors theme="dark" />
      <SiteHeader />

      <section className="relative overflow-hidden pt-16 pb-10 sm:pt-20">
        <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[380px] w-[380px] rounded-full bg-[oklch(0.7_0.2_265)] opacity-25 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute right-[-10%] top-16 h-[420px] w-[420px] rounded-full bg-[oklch(0.72_0.2_305)] opacity-25 blur-3xl animate-float-slower" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Get in <span className="text-gradient-brand">touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-muted-foreground"
          >
            I build simple AI-powered micro SaaS tools that help creators, students, freelancers, marketers, and professionals save time and work more efficiently.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-card backdrop-blur"
          >
            <h2 className="text-lg font-semibold tracking-tight">Contact details</h2>
            <ul className="mt-5 space-y-4">
              {INFO.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-brand shadow-glow">
                    <item.icon className="h-4 w-4 text-white" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="block truncate text-sm font-medium text-foreground hover:text-[color:var(--brand)]"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-sm font-medium text-foreground">{item.value}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">About:</span> I build simple AI-powered micro SaaS tools that help creators, students, freelancers, marketers, and professionals save time and work more efficiently.
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-3 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-card backdrop-blur"
          >
            <h2 className="text-lg font-semibold tracking-tight">Send a message</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end">
              <Button
                type="submit"
                disabled={sending}
                className="bg-gradient-brand text-white shadow-glow transition-all hover:opacity-95 active:scale-[0.97]"
              >
                <Send className="mr-1.5 h-4 w-4" />
                {sending ? "Sending…" : "Send message"}
              </Button>
            </div>
          </motion.form>
        </div>

        <div className="mt-10">
          <AdPlaceholder size="leaderboard" slotId="contact-bottom" label="Adstera Ad Placement — Contact" />
        </div>
      </section>

      <SiteFooter />
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
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
      />
    </div>
  );
}
