import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export type Card = { icon: LucideIcon; title: string; text: string };
export type Step = { title: string; text: string };
export type TimelineItem = { year: string; title: string; text: string };

export function StepsSection({ steps }: { steps: Step[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((s, i) => (
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          whileHover={{ y: -4 }}
          className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 shadow-card backdrop-blur transition-shadow hover:shadow-glow"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-sm font-bold text-white shadow-glow">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function ChecklistGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: i * 0.04 }}
          whileHover={{ y: -3 }}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur transition-colors hover:bg-white/[0.06]"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-brand shadow-glow">
            <Check className="h-3.5 w-3.5 text-white" />
          </span>
          <span className="text-sm font-medium text-foreground">{item}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function TimelineSection({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
      <div className="space-y-5">
        {items.map((it, i) => (
          <motion.div
            key={it.year + it.title}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative pl-12"
          >
            <span className="absolute top-4 left-2 grid h-5 w-5 place-items-center rounded-full bg-gradient-brand shadow-glow">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 shadow-card backdrop-blur">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--brand)]">
                {it.year}
              </div>
              <h4 className="mt-1 text-base font-semibold">{it.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{it.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function CalloutBox({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.02] p-5 shadow-card backdrop-blur"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-glow">
        <Icon className="h-5 w-5 text-white" />
      </span>
      <div>
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground backdrop-blur">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

export function CardGrid({ cards, cols = 3 }: { cards: Card[]; cols?: 3 | 4 }) {
  const gridCls =
    cols === 4
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={gridCls}>
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: i * 0.05 }}
          whileHover={{ y: -4 }}
          className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 shadow-card backdrop-blur transition-shadow hover:shadow-glow"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand shadow-glow transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
            <c.icon className="h-5 w-5 text-white" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            {c.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {c.text}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export function LongForm({
  title,
  paragraphs,
  eyebrow,
}: {
  title: string;
  paragraphs: string[];
  eyebrow?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 shadow-card backdrop-blur sm:p-8"
      >
        <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          {paragraphs.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function FaqSection({
  faqs,
  id = "faq",
}: {
  faqs: { q: string; a: string }[];
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Everything you need to know — quick answers, no fluff."
      />
      <Accordion type="single" collapsible className="mt-8">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`f-${i}`} className="border-white/10">
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function CtaSection({
  title,
  subtitle,
  primary,
  secondary,
}: {
  title: string;
  subtitle: string;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-8 text-center shadow-card backdrop-blur-xl sm:p-12"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-brand opacity-25 blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {subtitle}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 px-6 bg-gradient-brand text-white shadow-glow transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.97]"
            >
              <Link to={primary.to}>
                {primary.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {secondary && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/15 bg-white/[0.03] px-6 hover:bg-white/[0.06]"
              >
                <Link to={secondary.to}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
