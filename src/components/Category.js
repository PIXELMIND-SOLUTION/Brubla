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
    accent: "#6F4E37",
  },
  {
    id: 2,
    label: "Women",
    sublabel: "860 styles",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
  },
  {
    id: 3,
    label: "Kids",
    sublabel: "210 styles",
    img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
  },
  {
    id: 4,
    label: "Home & Living",
    sublabel: "380 items",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
  },
  {
    id: 5,
    label: "Beauty",
    sublabel: "190 products",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
  },
  {
    id: 6,
    label: "Accessories",
    sublabel: "145 pieces",
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
  },
  {
    id: 7,
    label: "Footwear",
    sublabel: "260 pairs",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
  },
  {
    id: 8,
    label: "Sale",
    sublabel: "BUY 1 GET 1",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=520&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARROW ICON
// ─────────────────────────────────────────────────────────────────────────────
const ChevRight = ({ color = "#6F4E37", size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const ChevLeft = ({ color = "#6F4E37", size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE CARD
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
      className="relative flex-shrink-0 overflow-hidden cursor-pointer"
      style={{
        // responsive card width: fills on mobile, fixed on desktop
        width: "clamp(140px, 40vw, 200px)",
        aspectRatio: "3 / 4",
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
        transition: `opacity 0.5s ease ${index * 0.06}s, transform 0.5s ease ${index * 0.06}s,
                     box-shadow 0.3s ease`,
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
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{
          transition: "transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)",
          transform:  hovered ? "scale(1.09)" : "scale(1.0)",
        }}
        loading="lazy"
        draggable={false}
      />

      {/* OVERLAY — rest */}
      <div className="absolute inset-0"
           style={{
             background: "linear-gradient(180deg,rgba(12,12,12,0) 40%,rgba(12,12,12,0.78) 100%)",
             opacity: hovered ? 0 : 1,
             transition: "opacity 0.4s ease",
           }} />

      {/* OVERLAY — hover */}
      <div className="absolute inset-0"
           style={{
             background: "linear-gradient(180deg,rgba(12,12,12,0.08) 0%,rgba(12,12,12,0.88) 100%)",
             opacity: hovered ? 1 : 0,
             transition: "opacity 0.4s ease",
           }} />

      {/* SALE badge */}
      {isSale && (
        <div className="absolute top-3 right-3 z-10 text-[9px] font-black tracking-[0.12em] uppercase px-2 py-0.5"
             style={{ background: cat.accent, color: "#0C0C0C" }}>
          HOT
        </div>
      )}

      {/* TOP ACCENT LINE on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-10"
           style={{
             background: `linear-gradient(90deg,transparent,${cat.accent},transparent)`,
             opacity: hovered ? 1 : 0,
             transition: "opacity 0.35s ease",
           }} />

      {/* TEXT BLOCK */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-3.5 pb-3.5 pt-2"
           style={{
             transform:  hovered ? "translateY(0)" : "translateY(3px)",
             transition: "transform 0.4s ease",
           }}>
        <h3 className="font-black text-white leading-tight"
            style={{
              fontSize: "clamp(14px,3.5vw,18px)",
              fontFamily: "Georgia,'Times New Roman',serif",
              letterSpacing: "-0.01em",
            }}>
          {cat.label}
        </h3>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-[10px] font-semibold tracking-wide"
             style={{
               color: "#c9b7b7",
               opacity: hovered ? 1 : 0.75,
               transition: "opacity 0.3s ease",
               letterSpacing: "0.05em",
             }}>
            {cat.sublabel}
          </p>
          {/* Arrow chip */}
          <div className="flex items-center justify-center"
               style={{
                 width: "26px", height: "26px",
                 background: cat.accent,
                 opacity:    hovered ? 1 : 0,
                 transform:  hovered ? "scale(1) translateX(0)" : "scale(0.5) translateX(8px)",
                 transition: "opacity 0.28s ease, transform 0.32s cubic-bezier(0.34,1.56,0.64,1)",
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
               hover:scale-110 active:scale-95"
    style={{
      width: "38px", height: "38px",
      background: "#6F4E37",
      border: "1.5px solid rgba(201,169,110,0.3)",
      opacity:   visible ? 1 : 0.25,
      cursor:    visible ? "pointer" : "not-allowed",
      boxShadow: "0 4px 14px rgba(12, 12, 12, 0)",
      pointerEvents: visible ? "auto" : "none",
    }}
  >
    {dir === "left"
      ? <ChevLeft color="#fff" size={13} />
      : <ChevRight color="#fff" size={13} />}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function CategorySection() {
  const trackRef  = useRef(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [headerVis, setHeaderVis] = useState(false);
  const headerRef = useRef(null);

  const navigate = useNavigate();
  // header entrance
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

  // track scroll state for button visibility
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
    el.scrollBy({ left: dir === "right" ? 360 : -360, behavior: "smooth" });
  };

  return (
    <section
      className="w-full py-10 md:py-14"
      style={{ background: "#fff" }}
      aria-label="Shop by Category"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div
          ref={headerRef}
          className="flex items-end justify-between px-4 md:px-6 lg:px-10 xl:px-14 mb-6 md:mb-8"
          style={{
            opacity:    headerVis ? 1 : 0,
            transform:  headerVis ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Left: title */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-1"
               style={{ color: "#6F4E37" }}>
              Shop by
            </p>
            <h2 className="font-black leading-none"
                style={{
                  fontSize: "clamp(24px,4vw,40px)",
                  color: "#0C0C0C",
                  fontFamily: "Georgia,'Times New Roman',serif",
                  letterSpacing: "-0.02em",
                }}>
              Categories
            </h2>
            <div className="mt-2 h-[3px] w-10"
                 style={{ background: "linear-gradient(90deg,#6F4E37,#6F4E37)" }} />
          </div>

          {/* Right: scroll arrows + view all */}
          <div className="flex items-center gap-2">
            <ScrollBtn dir="left"  onClick={() => scrollBy("left")}  visible={canLeft} />
            <ScrollBtn dir="right" onClick={() => scrollBy("right")} visible={canRight} />
            <button
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold ml-2 transition-all duration-200 group"
              style={{ color: "#000" }}
              onClick={()=>navigate('/category')}
            >
              View All
              <span className="flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                    style={{ width: "26px", height: "26px", background: "#6F4E37" }}>
                <ChevRight color="#fff" size={11} />
              </span>
            </button>
          </div>
        </div>

        {/* ── HORIZONTAL SCROLL TRACK ── */}
        <div
          ref={trackRef}
          className="flex gap-3 md:gap-4 overflow-x-auto"
          style={{
            paddingLeft:  "clamp(16px,4vw,56px)",
            paddingRight: "clamp(16px,4vw,56px)",
            paddingBottom: "12px",
            scrollbarWidth: "none",      // Firefox
            msOverflowStyle: "none",     // IE
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {/* hide scrollbar in webkit */}
          <style>{`
            .cat-track::-webkit-scrollbar { display: none; }
          `}</style>

          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              style={{ scrollSnapAlign: "start", flexShrink: 0 }}
            >
              <CategoryCard cat={cat} index={i} />
            </div>
          ))}

          {/* trailing spacer so last card doesn't hug edge */}
          <div style={{ minWidth: "4px", flexShrink: 0 }} />
        </div>

        {/* ── MOBILE "View All" below track ── */}
        <div className="flex justify-center mt-5 sm:hidden">
          <button
            className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 transition-all active:scale-95"
            style={{
              background: "#6F4E37",
              color: "#fff",
              border: "1.5px solid rgba(201,169,110,0.2)",
            }}
          >
            View All Categories
            <ChevRight color="#fff" size={11} />
          </button>
        </div>

      </div>
    </section>
  );
}