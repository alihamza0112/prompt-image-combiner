/**
 * AdPlaceholder
 * -------------
 * Reusable placeholder for future Adstera ad units.
 * Replace the inner marker block with the Adstera <script> / <ins> snippet
 * for the corresponding slot when integrating live ads.
 *
 * Slot sizing guidance (Adstera standard units):
 *   - "leaderboard"  → 728x90 desktop, responsive on mobile   (top banner, above footer)
 *   - "banner"       → 468x60 / responsive                     (between sections)
 *   - "rectangle"    → 300x250                                 (inline, between FAQ items)
 *   - "skyscraper"   → 160x600 desktop                         (sidebar)
 *   - "mobile"       → 320x50 sticky                           (mobile bottom bar)
 */

type AdSize = "leaderboard" | "banner" | "rectangle" | "skyscraper" | "mobile";

const SIZE_CLASS: Record<AdSize, string> = {
  leaderboard: "h-[90px] w-full max-w-[728px]",
  banner: "h-[90px] w-full max-w-[728px] sm:h-[100px]",
  rectangle: "h-[250px] w-full max-w-[300px]",
  skyscraper: "h-[600px] w-[160px]",
  mobile: "h-[50px] w-full max-w-[320px]",
};

export function AdPlaceholder({
  size = "banner",
  label = "Adstera Ad Placement",
  className = "",
  slotId,
}: {
  size?: AdSize;
  label?: string;
  className?: string;
  /** Optional Adstera slot identifier — surfaced as a data attribute for later wiring. */
  slotId?: string;
}) {
  return (
    <div
      role="complementary"
      aria-label={label}
      data-ad-slot={slotId}
      data-ad-size={size}
      className={`mx-auto flex items-center justify-center ${className}`}
    >
      {/*
        ┌────────────────────────────────────────────────────────┐
        │  ADSTERA AD SLOT — replace this block with the Adstera │
        │  <script> / <ins> markup for slot id: {slotId ?? "—"}   │
        └────────────────────────────────────────────────────────┘
      */}
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/40 text-[11px] font-medium uppercase tracking-wider text-muted-foreground ${SIZE_CLASS[size]}`}
      >
        <span className="px-3 text-center leading-tight">
          {label}
          <span className="ml-1 hidden opacity-60 sm:inline">· {size}</span>
        </span>
      </div>
    </div>
  );
}

/**
 * Sticky bottom banner shown on mobile only.
 * Positioned above device chrome via safe-area padding.
 */
export function StickyMobileAd({ label = "Adstera Ad Placement — Sticky Mobile" }: { label?: string }) {
  return (
    <div
      role="complementary"
      aria-label={label}
      data-ad-slot="sticky-mobile"
      data-ad-size="mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl md:hidden"
    >
      {/* ADSTERA MOBILE STICKY — replace inner marker with Adstera snippet */}
      <div className="mx-auto flex h-[50px] w-full max-w-[320px] items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/40 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
