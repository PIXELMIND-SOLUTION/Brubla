import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// BANNER DATA — each is a full-width wide strip (like the reference image)
// Wide landscape images, text centered, CTA button
// ─────────────────────────────────────────────────────────────────────────────
const BANNERS = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=200&fit=crop&q=85&auto=format",
    eyebrow: "LIMITED TIME",
    title: "SOS SALE",
    subtitle: "BUY 1 GET 1 FREE on all styles",
    cta: "Shop Now",
    ctaColor: "#C9A96E",
    overlay: "rgba(12,12,12,0.52)",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=200&fit=crop&q=85&auto=format",
    eyebrow: "NEW ARRIVALS",
    title: "SUMMER 2025",
    subtitle: "Fresh styles · Kurtas · Co-ords · Dresses",
    cta: "Explore",
    ctaColor: "#6fcf97",
    overlay: "rgba(12,12,12,0.48)",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=200&fit=crop&q=85&auto=format",
    eyebrow: "MEMBERS ONLY",
    title: "PREMIUM EDIT",
    subtitle: "Curated luxury · Hand-picked exclusives",
    cta: "View Edit",
    ctaColor: "#E8C97A",
    overlay: "rgba(10,8,4,0.58)",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1600&h=200&fit=crop&q=85&auto=format",
    eyebrow: "EXPRESS",
    title: "3–4 DAY DELIVERY",
    subtitle: "Order today · Track live · Free above ₹499",
    cta: "Shop Fast",
    ctaColor: "#C9A96E",
    overlay: "rgba(8,14,10,0.55)",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=200&fit=crop&q=85&auto=format",
    eyebrow: "FLASH DEAL",
    title: "UNDER ₹499",
    subtitle: "200+ styles · Ends tonight · All sizes",
    cta: "Grab Deals",
    ctaColor: "#e85d4a",
    overlay: "rgba(12,4,4,0.52)",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CAROUSEL HOOK
// ─────────────────────────────────────────────────────────────────────────────
const useCarousel = (count, autoMs) => {
  const [cur,    setCur]    = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const goTo = useCallback((i) => setCur(((i % count) + count) % count), [count]);
  const next  = useCallback(() => goTo(cur + 1), [goTo, cur]);
  const prev  = useCallback(() => goTo(cur - 1), [goTo, cur]);

  useEffect(() => {
    clearInterval(timer.current);
    if (!paused) timer.current = setInterval(next, autoMs);
    return () => clearInterval(timer.current);
  }, [paused, next, autoMs]);

  return { cur, goTo, next, prev,
           pause: () => setPaused(true),
           resume: () => setPaused(false) };
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS DOTS
// ─────────────────────────────────────────────────────────────────────────────
const Dots = ({ total, cur, onSelect, accent }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        aria-label={`Banner ${i + 1}`}
        style={{
          width:      i === cur ? "20px" : "5px",
          height:     "5px",
          borderRadius: "99px",
          background: i === cur ? accent : "rgba(255,255,255,0.35)",
          border:     "none",
          padding:    0,
          cursor:     "pointer",
          transition: "width 0.35s ease, background 0.35s ease",
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ARROW BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const Arr = ({ dir, onClick, accent }) => (
  <button
    onClick={onClick}
    aria-label={dir === "l" ? "Previous" : "Next"}
    className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
    style={{
      width: "30px", height: "30px",
      background: "rgba(12,12,12,0.45)",
      backdropFilter: "blur(6px)",
      border: "1px solid rgba(255,255,255,0.18)",
      flexShrink: 0,
    }}
  >
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
         stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      {dir === "l" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE BANNER STRIP
// ─────────────────────────────────────────────────────────────────────────────
const BannerStrip = ({ banner }) => (
  <div className="relative w-full h-full overflow-hidden flex-shrink-0">
    {/* Background image */}
    <img
      src={banner.img}
      alt={banner.title}
      className="absolute inset-0 w-full h-full object-cover object-center"
      loading="lazy"
      draggable={false}
    />
    {/* Dark overlay */}
    <div className="absolute inset-0" style={{ background: banner.overlay }} />

    {/* Gold shimmer top + bottom lines */}
    <div className="absolute top-0 left-0 right-0 h-px"
         style={{ background: `linear-gradient(90deg,transparent,${banner.ctaColor}80,transparent)` }} />
    <div className="absolute bottom-0 left-0 right-0 h-px"
         style={{ background: `linear-gradient(90deg,transparent,${banner.ctaColor}50,transparent)` }} />

    {/* Content — centered horizontally */}
    <div className="relative z-10 h-full flex items-center justify-center px-4">
      <div className="flex items-center gap-4 md:gap-8">

        {/* Eyebrow + Title stack */}
        <div className="flex flex-col items-center text-center">
          <span
            className="font-black uppercase tracking-[0.22em] leading-none hidden sm:block"
            style={{ fontSize: "9px", color: banner.ctaColor, letterSpacing: "0.22em" }}
          >
            {banner.eyebrow}
          </span>
          <h2
            className="font-black uppercase leading-none tracking-tight"
            style={{
              fontSize: "clamp(18px, 3.5vw, 36px)",
              color: "#FFFFFF",
              fontFamily: "Georgia,'Times New Roman',serif",
              letterSpacing: "-0.01em",
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            }}
          >
            {banner.title}
          </h2>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px self-stretch my-3"
             style={{ background: `rgba(255,255,255,0.2)` }} />

        {/* Subtitle */}
        <p
          className="hidden md:block text-white/70 font-medium leading-snug"
          style={{ fontSize: "clamp(10px, 1.2vw, 13px)", letterSpacing: "0.04em",
                   maxWidth: "220px", textAlign: "center" }}
        >
          {banner.subtitle}
        </p>

        {/* Divider */}
        <div className="hidden lg:block w-px self-stretch my-3"
             style={{ background: "rgba(255,255,255,0.2)" }} />

        {/* CTA button */}
        <button
          className="flex-shrink-0 font-black uppercase rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            fontSize: "clamp(9px, 1vw, 11px)",
            letterSpacing: "0.12em",
            padding: "clamp(6px,1vw,9px) clamp(12px,2vw,20px)",
            background: banner.ctaColor,
            color: "#0C0C0C",
            boxShadow: `0 4px 16px ${banner.ctaColor}50`,
          }}
        >
          {banner.cta}
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FLASH BANNER — MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function FlashBanner() {
  const { cur, goTo, next, prev, pause, resume } = useCarousel(BANNERS.length, 4000);
  const accent = BANNERS[cur].ctaColor;

  // progress bar key resets animation on each slide change
  const [pbKey, setPbKey] = useState(0);
  useEffect(() => setPbKey(k => k + 1), [cur]);

  return (
    <>
      <style>{`
        @keyframes pbFill { from { width:0% } to { width:100% } }
      `}</style>

      <div
        className="w-full relative overflow-hidden"
        style={{
          height: "clamp(128px, 10vw, 100px)",
          background: "#0C0C0C",
          borderTop:    "1px solid rgba(201,169,110,0.18)",
          borderBottom: "1px solid rgba(201,169,110,0.18)",
        }}
        onMouseEnter={pause}
        onMouseLeave={resume}
        aria-label="Promotional banner"
      >
        {/* ── SLIDE TRACK (fade transition) ── */}
        {BANNERS.map((b, i) => (
          <div
            key={b.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === cur ? 1 : 0, pointerEvents: i === cur ? "auto" : "none" }}
            aria-hidden={i !== cur}
          >
            <BannerStrip banner={b} />
          </div>
        ))}

        {/* ── LEFT ARROW ── */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
          <Arr dir="l" onClick={prev} accent={accent} />
        </div>

        {/* ── RIGHT ARROW ── */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
          <Arr dir="r" onClick={next} accent={accent} />
        </div>

        {/* ── DOTS bottom-center ── */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20">
          <Dots total={BANNERS.length} cur={cur} onSelect={goTo} accent={accent} />
        </div>

        {/* ── PROGRESS LINE — bottom ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] z-20"
             style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            key={pbKey}
            style={{
              height: "100%",
              background: accent,
              animation: "pbFill 4000ms linear forwards",
              opacity: 0.7,
            }}
          />
        </div>
      </div>
    </>
  );
}