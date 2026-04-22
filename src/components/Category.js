import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY DATA
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 1,
    label: "Men",
    sublabel: "432 styles",
    img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#000",
  },
  {
    id: 2,
    label: "Women",
    sublabel: "860 styles",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#000",
  },
  {
    id: 3,
    label: "Kids",
    sublabel: "210 styles",
    img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#000",
  },
  {
    id: 4,
    label: "Home & Living",
    sublabel: "380 items",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#000",
  },
  {
    id: 5,
    label: "Beauty",
    sublabel: "190 products",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#000",
  },
  {
    id: 6,
    label: "Accessories",
    sublabel: "145 pieces",
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#000",
  },
  {
    id: 7,
    label: "Footwear",
    sublabel: "260 pairs",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#000",
  },
  {
    id: 8,
    label: "Sale",
    sublabel: "BUY 1 GET 1",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#000",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARROW ICONS
// ─────────────────────────────────────────────────────────────────────────────
const ChevRight = ({ color = "#000", size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const ChevLeft = ({ color = "#000", size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CategoryCard = ({ cat, index }) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isSale = cat.label === "Sale";

  return (
    <div
      ref={ref}
      className="relative flex-shrink-0 overflow-hidden cursor-pointer rounded-xl transition-all duration-300"
      style={{
        width: "200px",
        aspectRatio: "3 / 4",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
        transition: `opacity 0.5s ease ${index * 0.06}s, transform 0.5s ease ${index * 0.06}s`,
        boxShadow: hovered
          ? "0 18px 44px rgba(12,12,12,0.22), 0 4px 14px rgba(12,12,12,0.1)"
          : "0 3px 14px rgba(12,12,12,0.09)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE */}
      <img
        src={cat.img}
        alt={cat.label}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700"
        style={{
          transform: hovered ? "scale(1.09)" : "scale(1.0)",
        }}
        loading="lazy"
        draggable={false}
      />

      {/* OVERLAY — default */}
      <div 
        className="absolute inset-0 transition-opacity duration-400"
        style={{
          background: "linear-gradient(180deg,rgba(12,12,12,0) 40%,rgba(12,12,12,0.78) 100%)",
          opacity: hovered ? 0 : 1,
        }}
      />

      {/* OVERLAY — hover */}
      <div 
        className="absolute inset-0 transition-opacity duration-400"
        style={{
          background: "linear-gradient(180deg,rgba(12,12,12,0.08) 0%,rgba(12,12,12,0.88) 100%)",
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* SALE badge */}
      {isSale && (
        <div className="absolute top-3 right-3 z-10 text-[9px] font-black tracking-[0.12em] uppercase px-2 py-0.5 rounded-sm"
          style={{ background: cat.accent, color: "#0C0C0C" }}>
          HOT
        </div>
      )}

      {/* TOP ACCENT LINE on hover */}
      <div 
        className="absolute top-0 left-0 right-0 h-[3px] z-10 transition-opacity duration-350"
        style={{
          background: `linear-gradient(90deg,transparent,${cat.accent},transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* TEXT BLOCK */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-3 pt-2 transition-transform duration-400"
        style={{
          transform: hovered ? "translateY(0)" : "translateY(3px)",
        }}
      >
        <h3 className="font-black text-white leading-tight text-base md:text-lg tracking-tight"
          style={{ fontFamily: "Georgia,'Times New Roman',serif" }}>
          {cat.label}
        </h3>
        <div className="flex items-center justify-between mt-0.5">
          <p 
            className="text-[10px] font-semibold tracking-wide transition-opacity duration-300"
            style={{
              color: "#c9b7b7",
              opacity: hovered ? 1 : 0.75,
              letterSpacing: "0.05em",
            }}>
            {cat.sublabel}
          </p>
          {/* Arrow chip */}
          <div 
            className="flex items-center justify-center transition-all duration-300 rounded-full"
            style={{
              width: "26px",
              height: "26px",
              background: cat.accent,
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1) translateX(0)" : "scale(0.5) translateX(8px)",
            }}>
            <ChevRight color="#fff" size={11} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL ARROW BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const ScrollBtn = ({ dir, onClick, visible }) => (
  <button
    onClick={onClick}
    aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
    className="flex-shrink-0 flex items-center justify-center transition-all duration-200
               hover:scale-110 active:scale-95 rounded-full"
    style={{
      width: "38px",
      height: "38px",
      background: "#000",
      border: "1.5px solid rgba(201,169,110,0.3)",
      opacity: visible ? 1 : 0.25,
      cursor: visible ? "pointer" : "not-allowed",
      pointerEvents: visible ? "auto" : "none",
    }}
  >
    {dir === "left"
      ? <ChevLeft color="#fff" size={13} />
      : <ChevRight color="#fff" size={13} />}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT - Category Section
// Shows 4 cards on md/lg devices, 2 cards on mobile with horizontal scroll
// ─────────────────────────────────────────────────────────────────────────────
export default function CategorySection() {
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [headerVis, setHeaderVis] = useState(false);
  const headerRef = useRef(null);

  const navigate = useNavigate();

  // Header entrance animation
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVis(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Track scroll state for button visibility
  const updateScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => el.removeEventListener("scroll", updateScroll);
  }, []);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    // Scroll 2 cards at a time for better UX
    const scrollAmount = 340;
    el.scrollBy({ left: dir === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="w-full py-10 md:py-14 bg-white" aria-label="Shop by Category">
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div
          ref={headerRef}
          className="flex items-end justify-between px-4 md:px-6 lg:px-10 xl:px-14 mb-6 md:mb-8 transition-all duration-500"
          style={{
            opacity: headerVis ? 1 : 0,
            transform: headerVis ? "translateY(0)" : "translateY(14px)",
          }}
        >
          {/* Left: title */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-1 text-[#0C0C0C]">
              Shop by
            </p>
            <h2 
              className="font-black leading-none text-2xl md:text-3xl lg:text-4xl text-[#000] tracking-tight"
              style={{ fontFamily: "Georgia,'Times New Roman',serif" }}
            >
              Categories
            </h2>
            <div className="mt-2 h-[3px] w-10 bg-gradient-to-r from-[#000] to-[#000]" />
          </div>

          {/* Right: scroll arrows + view all */}
          <div className="flex items-center gap-2">
            <ScrollBtn dir="left" onClick={() => scrollBy("left")} visible={canLeft} />
            <ScrollBtn dir="right" onClick={() => scrollBy("right")} visible={canRight} />
            <button
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold ml-2 transition-all duration-200 group text-black"
              onClick={() => navigate('/category')}
            >
              View All
              <span className="flex items-center justify-center transition-all duration-200 group-hover:scale-110 w-[26px] h-[26px] bg-[#000] rounded-full">
                <ChevRight color="#fff" size={11} />
              </span>
            </button>
          </div>
        </div>

        {/* ── HORIZONTAL SCROLL TRACK ── */}
        {/* Shows 2 cards on mobile (sm), 4 cards on medium and up (md) */}
        <div
          ref={trackRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth"
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingBottom: "12px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {/* Hide scrollbar in webkit */}
          <style>{`
            .category-track::-webkit-scrollbar { display: none; }
          `}</style>

          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              style={{ scrollSnapAlign: "start", flexShrink: 0 }}
              className="cursor-pointer"
              onClick={() => navigate(`/category/${cat.id}`)}
            >
              <CategoryCard cat={cat} index={i} />
            </div>
          ))}

          {/* Trailing spacer for better edge scrolling */}
          <div className="min-w-[4px] flex-shrink-0" />
        </div>

        {/* ── VISUAL HINT: Show how many cards are visible ── */}
        <div className="hidden md:block text-center mt-4 text-[10px] text-gray-400">
          ← Scroll to see 4 categories at a time →
        </div>
        <div className="block md:hidden text-center mt-4 text-[10px] text-gray-400">
          ← Swipe to see 2 categories at a time →
        </div>

        {/* ── MOBILE "View All" button below track ── */}
        <div className="flex justify-center mt-4 sm:hidden">
          <button
            className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 transition-all active:scale-95 rounded-full"
            style={{
              background: "#000",
              color: "#fff",
            }}
            onClick={() => navigate('/category')}
          >
            View All Categories
            <ChevRight color="#fff" size={11} />
          </button>
        </div>

      </div>
    </section>
  );
}