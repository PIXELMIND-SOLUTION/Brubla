import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// BANNER DATA
// desktop → landscape (wide) images
// mobile  → portrait (tall) images
// ─────────────────────────────────────────────────────────────────────────────
const DESKTOP_BANNERS = [
  {
    id: 1,
    alt: "SOS Sale – fashion styles",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=600&fit=crop&q=80&auto=format",
  },
  {
    id: 2,
    alt: "Summer 2025 collection",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=600&fit=crop&q=80&auto=format",
  },
  {
    id: 3,
    alt: "Premium Edit – exclusive wear",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=600&fit=crop&q=80&auto=format",
  },
  {
    id: 4,
    alt: "Flash Sale – under ₹499",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=600&fit=crop&q=80&auto=format",
  },
  {
    id: 5,
    alt: "Express Delivery – 3–4 days",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1400&h=600&fit=crop&q=80&auto=format",
  },
];

const MOBILE_BANNERS = [
  {
    id: 1,
    alt: "SOS Sale – fashion styles",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=900&fit=crop&q=80&auto=format",
  },
  {
    id: 2,
    alt: "Summer 2025 collection",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=900&fit=crop&q=80&auto=format",
  },
  {
    id: 3,
    alt: "Premium Edit – exclusive wear",
    img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&h=900&fit=crop&q=80&auto=format",
  },
  {
    id: 4,
    alt: "Flash Sale – under ₹499",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=900&fit=crop&q=80&auto=format",
  },
  {
    id: 5,
    alt: "Express Delivery – 3–4 days",
    img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=900&fit=crop&q=80&auto=format",
  },
];

// accent colours per slide (for dots / arrows)
const ACCENTS = ["#C9A96E", "#C9A96E", "#E8C97A", "#e85d4a", "#6fcf97"];

// ─────────────────────────────────────────────────────────────────────────────
// ARROW BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const ArrowBtn = ({ dir, onClick, accent }) => (
  <button
    onClick={onClick}
    aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
    className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 select-none"
    style={{
      width: "38px", height: "38px",
      background: "rgba(12,12,12,0.35)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.20)",
    }}
  >
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      {dir === "prev"
        ? <path d="M15 18l-6-6 6-6" />
        : <path d="M9 18l6-6-6-6" />}
    </svg>
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// DOT INDICATOR
// ─────────────────────────────────────────────────────────────────────────────
const Dots = ({ total, current, onSelect, accent }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        aria-label={`Go to slide ${i + 1}`}
        className="rounded-full transition-all duration-300"
        style={{
          width:      i === current ? "22px" : "6px",
          height:     "6px",
          background: i === current ? accent : "rgba(255,255,255,0.35)",
          border:     "none",
          padding:    0,
          cursor:     "pointer",
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC CAROUSEL  (used for both mobile and desktop)
// banners      – array of { id, img, alt }
// aspectRatio  – CSS aspect-ratio string e.g. "16/6" or "9/16"
// autoMs       – milliseconds between auto-advance
// className    – extra tailwind classes (show/hide per breakpoint)
// ─────────────────────────────────────────────────────────────────────────────
const Carousel = ({ banners, aspectRatio, autoMs = 4500, className = "" }) => {
  const count = banners.length;
  const [cur,    setCur]    = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // stable next / prev
  const goTo = useCallback((i) => setCur(((i % count) + count) % count), [count]);
  const next  = useCallback(() => goTo(cur + 1), [goTo, cur]);
  const prev  = useCallback(() => goTo(cur - 1), [goTo, cur]);

  // auto-play
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!paused) {
      timerRef.current = setInterval(next, autoMs);
    }
    return () => clearInterval(timerRef.current);
  }, [paused, next, autoMs]);

  // touch / swipe
  const touchX = useRef(null);
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  };

  const accent = ACCENTS[cur] ?? "#C9A96E";

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── SLIDES ── */}
      {banners.map((b, i) => (
        <div
          key={b.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === cur ? 1 : 0, pointerEvents: i === cur ? "auto" : "none" }}
          aria-hidden={i !== cur}
        >
          <img
            src={b.img}
            alt={b.alt}
            className="w-full h-full object-cover object-center"
            loading={i === 0 ? "eager" : "lazy"}
            draggable={false}
          />
        </div>
      ))}

      {/* ── PREV ARROW ── */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
        <ArrowBtn dir="prev" onClick={prev} accent={accent} />
      </div>

      {/* ── NEXT ARROW ── */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
        <ArrowBtn dir="next" onClick={next} accent={accent} />
      </div>

      {/* ── DOTS ── */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center z-20">
        <Dots total={count} current={cur} onSelect={goTo} accent={accent} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HERO BANNER — exported component
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroBanner() {
  return (
    <section aria-label="Promotional hero banners" className="w-full bg-[#0C0C0C]">
      {/* Portrait carousel — mobile only (hidden md+) */}
      <Carousel
        banners={MOBILE_BANNERS}
        aspectRatio="9/14"
        autoMs={4500}
        className="block md:hidden"
      />

      {/* Landscape carousel — tablet + desktop (hidden below md) */}
      <Carousel
        banners={DESKTOP_BANNERS}
        aspectRatio="21/9"
        autoMs={5000}
        className="hidden md:block"
      />
    </section>
  );
}