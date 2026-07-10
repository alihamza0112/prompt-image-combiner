import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Button>;

interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  getText: () => string | Promise<string>;
  onCopy?: () => void | Promise<void>;
  idleLabel?: string;
  copiedLabel?: string;
  toastMessage?: string;
  idleClassName?: string;
}

export function CopyButton({
  getText,
  onCopy,
  idleLabel = "Copy",
  copiedLabel = "Copied!",
  toastMessage = "Prompt copied successfully!",
  idleClassName,
  className,
  disabled,
  ...rest
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleClick = async () => {
    if (copied) return;
    try {
      const text = await getText();
      if (onCopy) {
        await onCopy();
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      toast.success(toastMessage);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed. Please try again.");
    }
  };

  return (
    <Button
      {...rest}
      onClick={handleClick}
      disabled={disabled || copied}
      aria-live="polite"
      className={cn(
        "relative overflow-hidden transition-colors duration-300",
        copied
          ? "bg-emerald-500 text-white hover:bg-emerald-500"
          : idleClassName,
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center"
          >
            <Check className="mr-1.5 h-3.5 w-3.5" strokeWidth={3} />
            {copiedLabel}
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center"
          >
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            {idleLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}

export default CopyButton;
