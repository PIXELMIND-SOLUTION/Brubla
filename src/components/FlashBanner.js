import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────
   BANNER DATA
───────────────────────────── */

const BANNERS = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=300&fit=crop&q=85&auto=format",
    eyebrow: "LIMITED TIME",
    title: "SOS SALE",
    subtitle: "BUY 1 GET 1 FREE on all styles",
    cta: "Shop Now",
    ctaColor: "#6F4E37",
    overlay: "rgba(12,12,12,0.55)",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=300&fit=crop&q=85&auto=format",
    eyebrow: "NEW ARRIVALS",
    title: "SUMMER 2025",
    subtitle: "Fresh styles · Kurtas · Dresses",
    cta: "Explore",
    ctaColor: "#6F4E37",
    overlay: "rgba(12,12,12,0.5)",
  },
];

/* ─────────────────────────────
   HOOK
───────────────────────────── */

const useCarousel = (count, autoMs) => {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const next = useCallback(() => {
    setCur((c) => (c + 1) % count);
  }, [count]);

  useEffect(() => {
    if (!paused) timer.current = setInterval(next, autoMs);
    return () => clearInterval(timer.current);
  }, [paused, next, autoMs]);

  return {
    cur,
    next,
    prev: () => setCur((c) => (c - 1 + count) % count),
    goTo: setCur,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
  };
};

/* ─────────────────────────────
   RESPONSIVE BANNER STRIP
───────────────────────────── */

const BannerStrip = ({ banner }) => (
  <div className="relative w-full h-full">

    {/* IMAGE */}
    <img
      src={banner.img}
      alt={banner.title}
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* OVERLAY */}
    <div className="absolute inset-0" style={{ background: banner.overlay }} />

    {/* CONTENT */}
    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">

      {/* EYEBROW */}
      <span
        className="text-[9px] sm:text-xs font-bold tracking-[0.2em] mb-1"
        style={{ color: "#000000" }}
      >
        {banner.eyebrow}
      </span>

      {/* TITLE */}
      <h2 className="
        text-white 
        text-lg sm:text-xl md:text-2xl lg:text-3xl
        font-bold 
        mb-1 sm:mb-2
      ">
        {banner.title}
      </h2>

      {/* SUBTITLE */}
      <p className="
        text-white/70 
        text-[10px] sm:text-xs md:text-sm
        mb-2 sm:mb-3
        max-w-xs md:max-w-md
      ">
        {banner.subtitle}
      </p>

      {/* CTA */}
      <button
        className="
          text-[10px] sm:text-xs md:text-sm
          px-4 py-1.5 sm:px-5 sm:py-2
          font-semibold
          transition-all
          hover:scale-105
        "
        style={{
          background: banner.ctaColor,
          color: "#fff",
        }}
      >
        {banner.cta}
      </button>
    </div>
  </div>
);

/* ─────────────────────────────
   MAIN COMPONENT
───────────────────────────── */

export default function FlashBanner() {
  const { cur, next, prev, goTo, pause, resume } = useCarousel(
    BANNERS.length,
    4000
  );

  const accent = BANNERS[cur].ctaColor;

  return (
    <div
      className="
        w-full relative overflow-hidden
        h-[300px] sm:h-[300px] md:h-[300px]
      "
      style={{ background: "#0C0C0C" }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* SLIDES */}
      {BANNERS.map((b, i) => (
        <div
          key={b.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === cur ? 1 : 0 }}
        >
          <BannerStrip banner={b} />
        </div>
      ))}

      {/* ARROWS */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
      >
        ›
      </button>

      {/* DOTS */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="h-1 transition-all"
            style={{
              width: i === cur ? 20 : 6,
              background: i === cur ? accent : "#999",
            }}
          />
        ))}
      </div>
    </div>
  );
}