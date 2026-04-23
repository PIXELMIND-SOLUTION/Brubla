import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────
   ADS DATA
───────────────────────────── */

const ADS = [
  {
    id: 1,
    title: "Download Our App",
    subtitle: "Get faster experience & exclusive offers",
    img: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop&q=80",
    cta: "Install Now",
    link: "/download",
    external: false,
    badge: "Sponsored",
  },
  {
    id: 2,
    title: "Flat 70% OFF",
    subtitle: "Limited time deal on all categories",
    img: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop&q=80",
    cta: "Shop Now",
    link: "/sale",
    external: false,
    badge: "Ad",
  },
  {
    id: 3,
    title: "Join Premium Membership",
    subtitle: "Unlock exclusive benefits & rewards",
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=400&fit=crop&q=80",
    cta: "Join Now",
    link: "https://example.com",
    external: true,
    badge: "Sponsored",
  },
];

/* ─────────────────────────────
   HOOK
───────────────────────────── */

const useCarousel = (count, autoMs) => {
  const [cur, setCur] = useState(0);
  const timer = useRef(null);

  const next = useCallback(() => {
    setCur((c) => (c + 1) % count);
  }, [count]);

  useEffect(() => {
    timer.current = setInterval(next, autoMs);
    return () => clearInterval(timer.current);
  }, [next, autoMs]);

  return {
    cur,
    next,
    prev: () => setCur((c) => (c - 1 + count) % count),
    goTo: setCur,
  };
};

/* ─────────────────────────────
   AD CARD
───────────────────────────── */

const AdCard = ({ ad, onClick }) => (
  <div className="relative w-full h-full">

    {/* IMAGE */}
    <img
      src={ad.img}
      alt={ad.title}
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* OVERLAY */}
    <div className="absolute inset-0 bg-black/50" />

    {/* BADGE */}
    {ad.badge && (
      <span className="absolute top-2 left-2 text-[10px] bg-white/20 backdrop-blur px-2 py-0.5 rounded text-white">
        {ad.badge}
      </span>
    )}

    {/* CONTENT */}
    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">

      <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1">
        {ad.title}
      </h2>

      <p className="text-white/70 text-xs sm:text-sm mb-2 max-w-md">
        {ad.subtitle}
      </p>

      <button
        onClick={onClick}
        style={{
          "background": "#000"
        }}
        className="
          px-4 py-1.5 sm:px-5 sm:py-2
          rounded-full
          text-xs sm:text-sm font-semibold
          text-white
          hover:scale-105 transition
        "
      >
        {ad.cta}
      </button>
    </div>
  </div>
);

/* ─────────────────────────────
   MAIN COMPONENT
───────────────────────────── */

export default function AdBanner() {
  const navigate = useNavigate();
  const { cur, next, prev, goTo } = useCarousel(ADS.length, 4000);

  const handleClick = (ad) => {
    if (ad.external) {
      window.open(ad.link, "_blank");
    } else {
      navigate(ad.link);
    }
  };

  return (
    <div className="w-full relative overflow-hidden h-[120px] sm:h-[160px] md:h-[200px] bg-black">

      {/* SLIDES */}
      {ADS.map((ad, i) => (
        <div
          key={ad.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === cur ? 1 : 0 }}
        >
          <AdCard ad={ad} onClick={() => handleClick(ad)} />
        </div>
      ))}

      {/* ARROWS */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-lg"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-lg"
      >
        ›
      </button>

      {/* DOTS */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {ADS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="h-1 rounded-full transition-all"
            style={{
              width: i === cur ? 20 : 6,
              background: i === cur ? "#000" : "#aaa",
            }}
          />
        ))}
      </div>
    </div>
  );
}