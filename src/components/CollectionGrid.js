import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";



// ─────────────────────────────────────────────────────────────────────────────
// COLLECTION DATA
// ─────────────────────────────────────────────────────────────────────────────
const COLLECTIONS = [
  {
    id: 1,
    title: "Global",
    subtitle: "Collection",
    tag: "WORLDWIDE",
    desc: "International styles, global trends, locally delivered",
    cta: "Explore World",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop&q=85&auto=format",
    accent: "#6F4E37",
    overlay: "linear-gradient(170deg,rgba(12,12,12,0.12) 0%,rgba(12,12,12,0.30) 40%,rgba(12,12,12,0.82) 100%)",
    gridArea: "global",
    count: "240+ Styles",
  },
  {
    id: 2,
    title: "Luxury",
    subtitle: "Edit",
    tag: "PREMIUM",
    desc: "Hand-picked opulence, crafted for the discerning few",
    cta: "Shop Luxury",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=600&fit=crop&q=85&auto=format",
    accent: "#6F4E37",
    overlay: "linear-gradient(170deg,rgba(10,8,4,0.08) 0%,rgba(10,8,4,0.25) 45%,rgba(10,8,4,0.88) 100%)",
    gridArea: "luxury",
    count: "85+ Pieces",
  },
  {
    id: 3,
    title: "Originals",
    subtitle: "by Brubla",
    tag: "EXCLUSIVE",
    desc: "Designed in-house. Worn everywhere.",
    cta: "View Originals",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop&q=85&auto=format",
    accent: "#6F4E37",
    overlay: "linear-gradient(170deg,rgba(12,12,12,0.05) 0%,rgba(12,12,12,0.20) 45%,rgba(12,12,12,0.85) 100%)",
    gridArea: "originals",
    count: "320+ Designs",
  },
  {
    id: 4,
    title: "Indian",
    subtitle: "Roots",
    tag: "HERITAGE",
    desc: "Celebrating the timeless craft of Indian artisans",
    cta: "Discover Heritage",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop&q=85&auto=format",
    accent: "#6F4E37",
    overlay: "linear-gradient(170deg,rgba(12,4,0,0.10) 0%,rgba(12,4,0,0.28) 40%,rgba(12,4,0,0.88) 100%)",
    gridArea: "indian",
    count: "180+ Styles",
  },
  {
    id: 5,
    title: "Weddings",
    subtitle: "& Celebrations",
    tag: "BRIDAL",
    desc: "Every thread tells a love story. Dress the moment.",
    cta: "Plan Your Look",
    img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1600&h=500&fit=crop&q=85&auto=format",
    accent: "#6F4E37",
    overlay: "linear-gradient(170deg,rgba(12,4,0,0.05) 0%,rgba(12,4,0,0.22) 50%,rgba(12,4,0,0.84) 100%)",
    gridArea: "wedding",
    count: "500+ Looks",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARROW ICON
// ─────────────────────────────────────────────────────────────────────────────
const ArrowIcon = ({ size = 13, color = "#0C0C0C" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTION CARD
// ─────────────────────────────────────────────────────────────────────────────
const CollectionCard = ({ col, index, style = {} }) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  const navigate = useNavigate();

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

  return (
    <div
      ref={ref}
      className="relative overflow-hidden cursor-pointer group"
      style={{
        ...style,
        borderRadius: "0px",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.97) translateY(18px)",
        transition: `opacity 0.58s ease ${index * 0.1}s, transform 0.58s ease ${index * 0.1}s,
                     box-shadow 0.35s ease`,
        boxShadow: hovered
          ? "0 28px 60px rgba(12,12,12,0.28), 0 8px 24px rgba(12,12,12,0.14)"
          : "0 6px 28px rgba(12,12,12,0.12)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={()=>navigate(`/collections/${col.id}`)}
    >
      {/* ── IMAGE ── */}
      <img
        src={col.img}
        alt={col.title}
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{
          transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
          transform: hovered ? "scale(1.07)" : "scale(1.0)",
        }}
        loading="lazy"
        draggable={false}
      />

      {/* ── GRADIENT OVERLAY ── rest state */}
      <div className="absolute inset-0"
        style={{ background: col.overlay, transition: "opacity 0.4s ease", opacity: hovered ? 0 : 1 }} />

      {/* ── GRADIENT OVERLAY ── hover state (deeper) */}
      <div className="absolute inset-0"
        style={{
          background: col.overlay.replace(/0\.\d+\)/g, (m) => {
            const n = parseFloat(m);
            return `${Math.min(n + 0.18, 0.97)})`;
          }),
          transition: "opacity 0.4s ease",
          opacity: hovered ? 1 : 0,
        }} />

      {/* ── TOP ACCENT LINE on hover ── */}
      <div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${col.accent}, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }} />

      {/* ── COUNT CHIP top-right ── */}
      <div
        className="absolute top-4 right-4 z-10 text-[9px] font-black tracking-[0.12em] uppercase px-2.5 py-1"
        style={{
          background: "rgba(12,12,12,0.55)",
          color: "#fff",
          backdropFilter: "blur(6px)",
          border: `1px solid ${col.accent}30`,
          opacity: hovered ? 1 : 0.75,
          transition: "opacity 0.3s ease",
        }}
      >
        {col.count}
      </div>

      {/* ── TAG top-left ── */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className="text-[9px] font-black tracking-[0.16em] uppercase px-2 py-1"
          style={{
            background: col.accent,
            color: "#fff",
            opacity: hovered ? 1 : 0.9,
            transition: "opacity 0.3s ease",
          }}
        >
          {col.tag}
        </span>
      </div>

      {/* ── CONTENT BLOCK bottom ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5 pt-4"
        style={{
          transform: hovered ? "translateY(0)" : "translateY(4px)",
          transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        <div className="flex flex-col leading-none mb-1.5">
          <span
            className="font-black text-white"
            style={{
              fontSize: "clamp(22px,3.5vw,32px)",
              fontFamily: "Georgia,'Times New Roman',serif",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            {col.title}
          </span>
          <span
            className="font-black"
            style={{
              fontSize: "clamp(22px,3.5vw,32px)",
              color: "#fff",
              fontFamily: "Georgia,'Times New Roman',serif",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            {col.subtitle}
          </span>
        </div>

        <p
          className="text-white/65 font-medium leading-snug mb-3"
          style={{
            fontSize: "11px",
            letterSpacing: "0.02em",
            maxWidth: "240px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s",
          }}
        >
          {col.desc}
        </p>

        <div
          className="flex items-center gap-0"
          style={{ opacity: hovered ? 1 : 0.85, transition: "opacity 0.3s ease" }}
        >
          <button
            className="flex items-center gap-2 font-black text-[11px] tracking-wide
                       transition-all duration-200 hover:gap-3 active:scale-95"
            style={{
              background: col.accent,
              color: "#fff",
              padding: "8px 16px",
              letterSpacing: "0.08em",
              boxShadow: `0 4px 18px ${col.accent}50`,
            }}
          >
            {col.cta}
            <ArrowIcon size={11} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────────────────────
const SectionHeader = () => {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-end justify-between mb-7 md:mb-10"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] mb-1"
          style={{ color: "#6F4E37" }}>
          Our Universe
        </p>
        <h2
          className="font-black leading-none"
          style={{
            fontSize: "clamp(26px,4.5vw,44px)",
            color: "#fff",
            fontFamily: "Georgia,'Times New Roman',serif",
            letterSpacing: "-0.02em",
          }}
        >
          Collections
        </h2>
        <div className="flex items-center gap-2 mt-2.5">
          <div className="h-[3px] w-10"
            style={{ background: "linear-gradient(90deg,#C9A96E,#E8C97A)" }} />
          <div className="h-[3px] w-4" style={{ background: "rgba(111, 78, 55, 0.3)" }} />
          <div className="h-[3px] w-2" style={{ background: "rgba(111, 78, 55, 0.14)" }} />
        </div>
      </div>

      {/* Desktop only — hidden on mobile */}
      <button
        className="hidden sm:flex items-center gap-1.5 text-xs font-black tracking-wide group transition-all"
        style={{ color: "#d1c2c2" }}
        onClick={() => navigate('/collections')}
      >
        All Collections
        <span
          className="flex items-center justify-center transition-all duration-200 group-hover:scale-110"
          style={{ width: "26px", height: "26px", background: "#6F4E37", color: "#fff" }}
        >
          <ArrowIcon size={11} color="#fff" />
        </span>
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE VIEW ALL BUTTON  (only visible below sm / 640px)
// ─────────────────────────────────────────────────────────────────────────────
const MobileViewAllButton = () => {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex sm:hidden mt-5"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.45s ease 0.2s, transform 0.45s ease 0.2s",
      }}
    >
      <button
        className="w-full flex items-center justify-between font-black text-[11px]
                   tracking-[0.1em] uppercase active:scale-[0.98] transition-transform duration-150"
        style={{
          background: "transparent",
          border: "1px solid rgba(111,78,55,0.55)",
          color: "#d1c2c2",
          padding: "13px 18px",
        }}
        onClick={() => navigate('/collections')}
      >
        <span>View All Collections</span>
        <span
          className="flex items-center justify-center"
          style={{ width: 28, height: 28, background: "#6F4E37" }}
        >
          <ArrowIcon size={12} color="#fff" />
        </span>
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function CollectionGrid() {
  return (
    <section
      className="w-full py-12 md:py-16"
      style={{ background: "#000" }}
      aria-label="Collections"
    >
      <style>{`
        @media (min-width: 1024px) {
          .collection-grid {
            display: grid;
            grid-template-columns: 1.1fr 1fr 1fr;
            grid-template-rows: 280px 280px 220px;
            gap: 14px;
          }
          .col-global   { grid-column: 1; grid-row: 1 / 3; }
          .col-luxury   { grid-column: 2; grid-row: 1; }
          .col-originals{ grid-column: 2; grid-row: 2; }
          .col-indian   { grid-column: 3; grid-row: 1 / 3; }
          .col-wedding  { grid-column: 1 / 4; grid-row: 3; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .collection-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 320px 260px 260px 180px;
            gap: 12px;
          }
          .col-global   { grid-column: 1; grid-row: 1; }
          .col-indian   { grid-column: 2; grid-row: 1; }
          .col-luxury   { grid-column: 1; grid-row: 2; }
          .col-originals{ grid-column: 2; grid-row: 2; }
          .col-wedding  { grid-column: 1 / 3; grid-row: 3; }
        }
        @media (max-width: 639px) {
          .collection-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .col-global,
          .col-indian   { height: 320px; }
          .col-luxury,
          .col-originals { height: 240px; }
          .col-wedding  { height: 200px; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 xl:px-14">
        <SectionHeader />

        <div className="collection-grid">
          <div className="col-global">
            <CollectionCard col={COLLECTIONS[0]} index={0} style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="col-luxury">
            <CollectionCard col={COLLECTIONS[1]} index={1} style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="col-originals">
            <CollectionCard col={COLLECTIONS[2]} index={2} style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="col-indian">
            <CollectionCard col={COLLECTIONS[3]} index={3} style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="col-wedding">
            <CollectionCard col={COLLECTIONS[4]} index={4} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>

        {/* Mobile-only "View All Collections" — below the grid, hidden on sm+ */}
        <MobileViewAllButton />
      </div>
    </section>
  );
}