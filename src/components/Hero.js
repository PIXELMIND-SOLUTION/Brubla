import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   BANNER DATA
───────────────────────────────────────────── */

const DESKTOP_BANNERS = [
  {
    id: 1,
    title: "Mega Fashion Sale",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=600&fit=crop&q=80&auto=format",
    buttonText: "Shop Now",
    action: "/shop",
  },
  {
    id: 2,
    title: "Summer Collection 2025",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=600&fit=crop&q=80&auto=format",
    buttonText: "Explore",
    action: "/summer",
  },
  {
    id: 3,
    title: "Premium Exclusive Wear",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&h=600&fit=crop&q=80&auto=format",
    buttonText: "View Collection",
    action: "/premium",
  },
  {
    id: 4,
    title: "Flash Sale Under ₹499",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=600&fit=crop&q=80&auto=format",
    buttonText: "Grab Deals",
    action: "/sale",
  },
  {
    id: 5,
    title: "Fast Delivery in 3 Days",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1400&h=600&fit=crop&q=80&auto=format",
    buttonText: "Track Order",
    action: "/orders",
  },
];

const MOBILE_BANNERS = [
  {
    id: 1,
    title: "Mega Sale",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=900&fit=crop&q=80&auto=format",
    buttonText: "Shop",
    action: "/shop",
  },
  {
    id: 2,
    title: "Summer 2025",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=900&fit=crop&q=80&auto=format",
    buttonText: "Explore",
    action: "/summer",
  },
  {
    id: 3,
    title: "Premium Wear",
    img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&h=900&fit=crop&q=80&auto=format",
    buttonText: "View",
    action: "/premium",
  },
  {
    id: 4,
    title: "Flash Deals",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=900&fit=crop&q=80&auto=format",
    buttonText: "Deals",
    action: "/sale",
  },
  {
    id: 5,
    title: "Fast Delivery",
    img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=900&fit=crop&q=80&auto=format",
    buttonText: "Track",
    action: "/orders",
  },
];

const ACCENTS = ["#C9A96E", "#C9A96E", "#E8C97A", "#e85d4a", "#6fcf97"];

/* ─────────────────────────────────────────────
   ARROW BUTTON
───────────────────────────────────────────── */

const ArrowBtn = ({ dir, onClick, accent }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center rounded-full hover:scale-110 transition"
    style={{
      width: "38px",
      height: "38px",
      background: "rgba(122, 122, 122, 0)",
    }}
  >
    <svg width="15" height="15" stroke={accent} strokeWidth={2.5}>
      {dir === "prev" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  </button>
);

/* ─────────────────────────────────────────────
   DOTS
───────────────────────────────────────────── */

const Dots = ({ total, current, onSelect, accent }) => (
  <div className="flex gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        className="rounded-full transition-all"
        style={{
          width: i === current ? "20px" : "6px",
          height: "6px",
          background: i === current ? accent : "#ccc",
        }}
      />
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   CAROUSEL
───────────────────────────────────────────── */

const Carousel = ({ banners, aspectRatio, className = "" }) => {
  const navigate = useNavigate();

  const count = banners.length;
  const [cur, setCur] = useState(0);

  const next = useCallback(() => setCur((c) => (c + 1) % count), [count]);
  const prev = useCallback(() => setCur((c) => (c - 1 + count) % count), [count]);

  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next]);

  const accent = ACCENTS[cur];

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {banners.map((b, i) => (
        <div
          key={b.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === cur ? 1 : 0 }}
        >
          <div className="relative w-full h-full">
            {/* IMAGE */}
            <img src={b.img} alt={b.title} className="w-full h-full object-cover" />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/40" />

            {/* CENTER CONTENT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              
              {/* TITLE */}
              <h2 className="text-white text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 drop-shadow-lg">
                {b.title}
              </h2>

              {/* BUTTON */}
              <button
                onClick={() => navigate(b.action)}
                className="
                  px-5 py-2 md:px-6 md:py-3
                  rounded-full
                  text-xs md:text-sm font-semibold
                  bg-gradient-to-r from-[#6F4E37] to-[#6F4E37]
                  text-white
                  shadow-xl
                  hover:scale-105 active:scale-95
                  transition-all duration-300
                "
              >
                {b.buttonText}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* ARROWS */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <ArrowBtn dir="prev" onClick={prev} accent={accent} />
      </div>

      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <ArrowBtn dir="next" onClick={next} accent={accent} />
      </div>

      {/* DOTS */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <Dots total={count} current={cur} onSelect={setCur} accent={accent} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */

export default function HeroBanner() {
  return (
    <section className="w-full bg-black">
      {/* MOBILE */}
      <Carousel
        banners={MOBILE_BANNERS}
        aspectRatio="9/14"
        className="block md:hidden"
      />

      {/* DESKTOP */}
      <Carousel
        banners={DESKTOP_BANNERS}
        aspectRatio="21/7"
        className="hidden md:block"
      />
    </section>
  );
}