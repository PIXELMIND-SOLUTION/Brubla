import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Ic = ({ d, className = "w-5 h-5", fill = "none", sw = 2, children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={fill}
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

const ArrowRight = ({ c = "w-4 h-4" }) => <Ic className={c} d="M9 18l6-6-6-6" />;
const ArrowLeft = ({ c = "w-4 h-4" }) => <Ic className={c} d="M15 18l-6-6 6-6" />;
const BellIcon = ({ c = "w-4 h-4" }) => <Ic className={c} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />;
const HeartIcon = ({ c = "w-4 h-4", filled = false }) => (
  <Ic className={c} fill={filled ? "white" : "none"}
    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z" />
);
const ClockIcon = ({ c = "w-4 h-4" }) => <Ic className={c}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Ic>;
const SparkIcon = ({ c = "w-4 h-4" }) => <Ic className={c} fill="currentColor" d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" sw={0} />;
const FireIcon = ({ c = "w-4 h-4" }) => <Ic className={c} fill="currentColor" d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-1 .23-1.97.75-2.73 1.55-2.25 2.36-2.2 6.2.02 8.51.23.23.47.43.7.65-.19-.28-.21-.62-.12-.94.28-.9 1.32-1.31 2.05-1.9.4-.31.8-.66 1.05-1.1.04-.1.08-.2.1-.3.28.56.48 1.14.52 1.75.07.94-.15 1.83-.66 2.6-.38.56-.88 1.01-1.44 1.42-.66.47-1.36.92-1.87 1.55-.72.9-.97 2.01-.68 3.11.23.87.75 1.63 1.38 2.27-1.04-.46-2-1.16-2.7-2.1-1.55-2.04-1.55-4.93-.42-7.05.67-1.25 1.73-2.23 2.86-3.14.73-.58 1.5-1.08 2.17-1.7.85-.77 1.53-1.72 1.91-2.82.1.87.28 1.77.72 2.56.43.79.98 1.45 1.63 2.02.44.38.92.7 1.33 1.11.46.46.84 1.01 1.07 1.64.57 1.57.17 3.38-.93 4.6-.77.87-1.8 1.5-2.87 2.02.78-.5 1.41-1.17 1.74-2.04.27-.73.27-1.52.04-2.26z" sw={0} />;
const ShareIcon = ({ c = "w-4 h-4" }) => <Ic className={c} d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />;
const EyeIcon = ({ c = "w-4 h-4" }) => <Ic className={c}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Ic>;

// ─────────────────────────────────────────────────────────────────────────────
// COUNTDOWN HOOK
// ─────────────────────────────────────────────────────────────────────────────
const useCountdown = (targetMs) => {
  const calc = () => {
    const diff = Math.max(0, targetMs - Date.now());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [targetMs]);
  return time;
};

// ─────────────────────────────────────────────────────────────────────────────
// ENTRANCE HOOK
// ─────────────────────────────────────────────────────────────────────────────
const useVisible = (threshold = 0.1) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER (shared)
// ─────────────────────────────────────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title, subtitle, cta, onCta, visible }) => (
  <div
    className="flex items-end justify-between mb-6 md:mb-8"
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.55s ease, transform 0.55s ease",
    }}
  >
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.24em] mb-1"
        style={{ color: "#C9A96E" }}>
        {eyebrow}
      </p>
      <h2
        className="font-black leading-none"
        style={{
          fontSize: "clamp(24px,4vw,42px)",
          color: "#0C0C0C",
          fontFamily: "Georgia,'Times New Roman',serif",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs font-medium mt-1.5" style={{ color: "#8A8070" }}>{subtitle}</p>
      )}
      <div className="flex items-center gap-2 mt-2">
        <div className="h-[3px] w-10"
          style={{ background: "linear-gradient(90deg,#C9A96E,#E8C97A)" }} />
        <div className="h-[3px] w-4" style={{ background: "rgba(201,169,110,0.3)" }} />
        <div className="h-[3px] w-2" style={{ background: "rgba(201,169,110,0.14)" }} />
      </div>
    </div>
    {cta && (
      <button
        onClick={onCta}
        className="hidden sm:flex items-center gap-1.5 text-xs font-black tracking-wide group transition-all"
        style={{ color: "#0C0C0C" }}
      >
        {cta}
        <span className="flex items-center justify-center transition-all duration-200 group-hover:scale-110"
          style={{ width: "26px", height: "26px", background: "#0C0C0C", color: "#C9A96E" }}>
          <ArrowRight c="w-3 h-3" />
        </span>
      </button>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL ARROW
// ─────────────────────────────────────────────────────────────────────────────
const ScrollBtn = ({ dir, onClick, show }) => (
  <button onClick={onClick} aria-label={dir}
    className="flex-shrink-0 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
    style={{
      width: "34px", height: "34px",
      background: "#0C0C0C", color: "#C9A96E",
      border: "1.5px solid rgba(201,169,110,0.25)",
      boxShadow: "0 4px 14px rgba(12,12,12,0.18)",
      opacity: show ? 1 : 0.25, pointerEvents: show ? "auto" : "none",
    }}>
    {dir === "left" ? <ArrowLeft c="w-3 h-3" /> : <ArrowRight c="w-3 h-3" />}
  </button>
);

// ═════════════════════════════════════════════════════════════════════════════
// ██  UPCOMING SECTION
// ═════════════════════════════════════════════════════════════════════════════

const UPCOMING = [
  {
    id: 1,
    title: "Monsoon Edit",
    label: "LAUNCHING SOON",
    desc: "Earth tones, linen weaves, and the poetry of the first rains.",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=620&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
    launchIn: Date.now() + 2 * 24 * 3600000 + 4 * 3600000 + 23 * 60000,
    notify: false,
    interested: 2840,
  },
  {
    id: 2,
    title: "Festive Gold",
    label: "DROPPING FRIDAY",
    desc: "Zardozi, gota patti, and hand-embroidered masterpieces.",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=620&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
    launchIn: Date.now() + 4 * 24 * 3600000 + 12 * 3600000,
    notify: false,
    interested: 5210,
  },
  {
    id: 3,
    title: "Midnight Atelier",
    label: "COMING NEXT WEEK",
    desc: "Dark luxury, velvet textures, and after-dark glamour.",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=620&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
    launchIn: Date.now() + 7 * 24 * 3600000 + 6 * 3600000,
    notify: false,
    interested: 1930,
  },
  {
    id: 4,
    title: "Resort Escape",
    label: "EXCLUSIVE DROP",
    desc: "Breezy silhouettes for sun-drenched mornings and ocean drives.",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&h=620&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
    launchIn: Date.now() + 10 * 24 * 3600000 + 2 * 3600000,
    notify: false,
    interested: 3120,
  },
  {
    id: 5,
    title: "Bridal Edit 2025",
    label: "REGISTER INTEREST",
    desc: "Your forever look, curated with love and craftsmanship.",
    img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=500&h=620&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
    launchIn: Date.now() + 14 * 24 * 3600000,
    notify: false,
    interested: 7840,
  },
];

// Countdown unit pill
const CountUnit = ({ value, label, accent }) => (
  <div className="flex flex-col items-center">
    <span
      className="font-black leading-none tabular-nums"
      style={{
        fontSize: "clamp(18px,3vw,24px)", color: accent,
        fontFamily: "Georgia,serif"
      }}
    >
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[8px] font-bold uppercase tracking-[0.1em] mt-0.5"
      style={{ color: "rgba(255,255,255,0.45)" }}>
      {label}
    </span>
  </div>
);

const CountSep = ({ accent }) => (
  <span className="font-black text-lg mb-1" style={{ color: accent, opacity: 0.6 }}>:</span>
);

const UpcomingCard = ({ item, index }) => {
  const [notified, setNotified] = useState(item.notify);
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useVisible(0.08);
  const time = useCountdown(item.launchIn);

  return (
    <div
      ref={ref}
      className="flex-shrink-0 relative overflow-hidden cursor-pointer group"
      style={{
        width: "clamp(250px,42vw,260px)",
        aspectRatio: "4/5",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.52s ease ${index * 0.09}s, transform 0.52s ease ${index * 0.09}s,
                     box-shadow 0.35s ease`,
        boxShadow: hovered
          ? "0 24px 56px rgba(12,12,12,0.3), 0 8px 20px rgba(12,12,12,0.14)"
          : "0 6px 24px rgba(12,12,12,0.14)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img src={item.img} alt={item.title}
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{
          transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
          transform: hovered ? "scale(1.07)" : "scale(1.0)",
          filter: "brightness(0.88)",
        }}
        loading="lazy" draggable={false} />

      {/* Overlay */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(170deg,rgba(12,12,12,0.05) 0%,rgba(12,12,12,0.2) 35%,rgba(12,12,12,0.90) 100%)" }} />

      {/* Blur glass stripe */}
      <div className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg,transparent 50%,rgba(12,12,12,0.45) 100%)",
          backdropFilter: "blur(0px)"
        }} />

      {/* Top: label chip */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <span className="text-[9px] font-black tracking-[0.14em] uppercase px-2.5 py-1"
          style={{ background: item.accent, color: "#fff" }}>
          {item.label}
        </span>
        <span className="text-[10px] font-bold flex items-center gap-1">
          <HeartIcon c="w-3 h-3" style={{ color: "#fff" }} />
          {item.interested.toLocaleString()}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 pt-2">
        {/* Title */}
        <h3 className="font-black text-white leading-tight mb-1"
          style={{
            fontSize: "clamp(18px,3vw,22px)",
            fontFamily: "Georgia,'Times New Roman',serif",
            letterSpacing: "-0.01em"
          }}>
          {item.title}
        </h3>

        {/* Desc on hover */}
        <p className="text-white/55 text-[10px] font-medium leading-relaxed mb-3"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(5px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            maxHeight: "36px",
          }}>
          {item.desc}
        </p>

        {/* Countdown */}
        <div className="flex items-center gap-1.5 mb-3 px-3 py-2"
          style={{
            background: "rgba(12,12,12,0.55)", backdropFilter: "blur(10px)",
            border: `1px solid ${item.accent}25`
          }}>
          <ClockIcon class="w-3 h-3 flex-shrink-0" style={{ color: "#fff" }} />
          <div className="flex items-center gap-1 ml-1">
            <CountUnit value={time.d} label="D" accent="#fff" />
            <CountSep accent="#fff" />
            <CountUnit value={time.h} label="H" accent="#fff" />
            <CountSep accent="#fff" />
            <CountUnit value={time.m} label="M" accent="#fff" />
            <CountSep accent="#fff" />
            <CountUnit value={time.s} label="S" accent="#fff" />
          </div>
        </div>

        {/* Notify button */}
        <button
          onClick={() => setNotified(n => !n)}
          className="w-full flex items-center justify-center gap-2 py-2.5 font-black text-[11px]
                     tracking-wide transition-all duration-300 active:scale-95"
          style={{
            background: notified ? item.accent : "rgba(255,255,255,0.10)",
            color: notified ? "#fff" : "#fff",
            border: notified ? "none" : "1.5px solid rgba(255,255,255,0.20)",
            backdropFilter: notified ? "none" : "blur(6px)",
            boxShadow: notified ? `0 4px 18px ${item.accent}50` : "none",
          }}
        >
          <BellIcon c="w-3.5 h-3.5" />
          {notified ? "Notifying You ✓" : "Notify Me"}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
export function UpcomingSection() {
  const [headerRef, headerVis] = useVisible(0.2);
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => el.removeEventListener("scroll", updateScroll);
  }, [updateScroll]);

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir === "right" ? 540 : -540, behavior: "smooth" });
  };

  return (
    <section className="w-full py-12 md:py-16" style={{ background: "#fff" }} aria-label="Upcoming Collections">
      <style>{`.upcoming-track::-webkit-scrollbar{display:none}`}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="px-4 md:px-6 lg:px-10 xl:px-14 pt-10">
          <div
            className="flex items-end justify-between mb-6 md:mb-8"
            style={{
              opacity: headerVis ? 1 : 0,
              transform: headerVis ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.55s ease, transform 0.55s ease",
            }}
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] mb-1" style={{ color: "#6F4E37" }}>
                What's Next
              </p>
              <h2 className="font-black leading-none"
                style={{
                  fontSize: "clamp(24px,4vw,42px)", color: "#000",
                  fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.02em"
                }}>
                Upcoming
              </h2>
              <p className="text-xs font-medium mt-1.5" style={{ color: "#8A8070" }}>
                Set a reminder — be the first to shop
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <div className="h-[3px] w-10"
                  style={{ background: "linear-gradient(90deg,#6F4E37,#6F4E37)" }} />
                <div className="h-[3px] w-4" style={{ background: "#6F4E37" }} />
                <div className="h-[3px] w-2" style={{ background: "#8A8070" }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ScrollBtn dir="left" onClick={() => scrollBy("left")} show={canLeft} />
              <ScrollBtn dir="right" onClick={() => scrollBy("right")} show={canRight} />
            </div>
          </div>
        </div>

        {/* Cards track */}
        <div
          ref={trackRef}
          className="upcoming-track flex gap-4 overflow-x-auto"
          style={{
            paddingLeft: "clamp(16px,4vw,56px)",
            paddingRight: "clamp(16px,4vw,56px)",
            paddingBottom: "16px",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {UPCOMING.map((item, i) => (
            <div key={item.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
              <UpcomingCard item={item} index={i} />
            </div>
          ))}
          <div style={{ minWidth: "4px", flexShrink: 0 }} />
        </div>
      </div>

      {/* Gold shimmer bottom line */}
      <div className="w-full h-px mt-10"
        style={{ background: "linear-gradient(90deg,transparent,#C9A96E,transparent)" }} />
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ██  DESIGNS ON YOUR RADAR
// ═════════════════════════════════════════════════════════════════════════════

const RADAR_PRODUCTS = [
  {
    id: 1,
    name: "Ajrakh Block Print Kurta",
    brand: "Craft House",
    price: 1299,
    originalPrice: 2499,
    img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=380&h=460&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
    heat: 94,
    views: "12.4k",
    badge: "HOT",
  },
  {
    id: 2,
    name: "Silk Organza Lehenga",
    brand: "Bridal Studio",
    price: 8999,
    originalPrice: 15999,
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=380&h=460&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
    heat: 98,
    views: "28.1k",
    badge: "VIRAL",
  },
  {
    id: 3,
    name: "Indigo Linen Coord",
    brand: "Studio NM",
    price: 1599,
    originalPrice: 2799,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=380&h=460&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
    heat: 87,
    views: "9.2k",
    badge: "TRENDING",
  },
  {
    id: 4,
    name: "Heritage Bandhani Dupatta",
    brand: "Rangrez",
    price: 699,
    originalPrice: 1299,
    img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=380&h=460&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
    heat: 82,
    views: "7.8k",
    badge: "LOVED",
  },
  {
    id: 5,
    name: "Premium Blazer Dress",
    brand: "NewMe Atelier",
    price: 2999,
    originalPrice: 5499,
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=380&h=460&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
    heat: 91,
    views: "15.6k",
    badge: "RISING",
  },
  {
    id: 6,
    name: "Resort Kaftan Dress",
    brand: "Bloom Studio",
    price: 1199,
    originalPrice: 2199,
    img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=380&h=460&fit=crop&q=80&auto=format",
    accent: "#6F4E37",
    heat: 78,
    views: "6.3k",
    badge: "NEW",
  },
];

// Heat bar component
const HeatBar = ({ value, accent }) => (
  <div className="flex items-center gap-2">
    <FireIcon c="w-3 h-3" style={{ color: accent }} />
    <div className="flex-1 h-1.5 overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.12)" }}>
      <div className="h-full transition-all duration-700"
        style={{ width: `${value}%`, background: `linear-gradient(90deg,${accent},${accent}cc)` }} />
    </div>
    <span className="text-[10px] font-black" style={{ color: accent }}>{value}°</span>
  </div>
);

const RadarCard = ({ item, index }) => {
  const [wishlisted, setWish] = useState(false);
  const [hovered, setHov] = useState(false);
  const [ref, visible] = useVisible(0.08);

  return (
    <div
      ref={ref}
      className="flex-shrink-0 group cursor-pointer"
      style={{
        width: "clamp(170px,36vw,210px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden"
        style={{
          aspectRatio: "3/4",
          boxShadow: hovered
            ? "0 22px 52px rgba(12,12,12,0.22), 0 6px 18px rgba(12,12,12,0.10)"
            : "0 4px 18px rgba(12,12,12,0.08)",
          transition: "box-shadow 0.4s ease",
        }}>
        <img src={item.img} alt={item.name}
          className="w-full h-full object-cover object-top"
          style={{
            transition: "transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)",
            transform: hovered ? "scale(1.07)" : "scale(1.0)",
          }}
          loading="lazy" draggable={false} />

        {/* Dark scrim */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(180deg,rgba(12,12,12,0) 45%,rgba(12,12,12,0.65) 100%)" }} />

        {/* Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="text-[9px] font-black tracking-[0.1em] uppercase px-2 py-0.5"
            style={{ background: item.accent, color: "#fff" }}>
            {item.badge}
          </span>
        </div>

        {/* Views */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1"
          style={{ background: "rgba(12,12,12,0.55)", backdropFilter: "blur(6px)" }}>
          <EyeIcon c="w-2.5 h-2.5 text-white" />
          <span className="text-[9px] font-bold text-white/70">{item.views}</span>
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWish((w) => !w);
          }}
          className="
    absolute right-2.5 bottom-14 z-10
    flex items-center justify-center
    rounded-full
    transition-all duration-300
  "
          style={{
            width: "32px",
            height: "32px",

            background: wishlisted
              ? "#e85d4a"
              : "rgba(255,255,255,0.92)",

            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",

            opacity: hovered ? 1 : 0.85,
            transform: hovered ? "scale(1)" : "scale(0.92)",
          }}
        >
          <HeartIcon
            c="w-4 h-4"
            style={{
              color: wishlisted ? "#fff" : "#e85d4a", // ✅ FIXED
            }}
            filled={wishlisted}
          />
        </button>

        {/* Heat bar inside image */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <HeatBar value={item.heat} accent={item.accent} />
        </div>

        {/* Hover: share */}
        <button
          className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            height: "36px",
            background: "rgba(12,12,12,0.80)",
            backdropFilter: "blur(6px)",
            color: "#F5F0E8",
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            borderRadius: "0 0 16px 16px",
          }}
        >
          <ShareIcon c="w-3 h-3" />
          SHARE LOOK
        </button>
      </div>

      {/* Info block */}
      <div className="mt-3 px-0.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-0.5" style={{ color: "#8A8070" }}>
          {item.brand}
        </p>
        <h3 className="font-black leading-tight mb-2 line-clamp-2"
          style={{
            fontSize: "clamp(12px,2vw,14px)", color: "#0C0C0C",
            fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.01em"
          }}>
          {item.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-black" style={{ fontSize: "clamp(14px,2.5vw,17px)", color: "#0C0C0C" }}>
                ₹{item.price.toLocaleString()}
              </span>
              <span className="text-[10px] line-through font-medium" style={{ color: "#8A8070" }}>
                ₹{item.originalPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-black" style={{ color: "#6F4E37" }}>
              {Math.round((1 - item.price / item.originalPrice) * 100)}% off
            </span>
          </div>
          <button
            className="flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              width: "36px", height: "36px",
              background: "linear-gradient(145deg,#6F4E37,#6F4E37)",
              color: "#fff",
              border: "1.5px solid rgba(201,169,110,0.2)",
              boxShadow: "0 4px 12px rgba(12,12,12,0.2)",
            }}>
            <SparkIcon c="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
export function DesignsOnRadar() {
  const [headerRef, headerVis] = useVisible(0.2);
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => el.removeEventListener("scroll", updateScroll);
  }, [updateScroll]);

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir === "right" ? 480 : -480, behavior: "smooth" });
  };

  return (
    <section className="w-full py-12 md:py-16" style={{ background: "#FEFCF8" }} aria-label="Designs on Your Radar">
      <style>{`.radar-track::-webkit-scrollbar{display:none}`}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="px-4 md:px-6 lg:px-10 xl:px-14">
          <div
            className="flex items-end justify-between mb-6 md:mb-8"
            style={{
              opacity: headerVis ? 1 : 0,
              transform: headerVis ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.55s ease, transform 0.55s ease",
            }}
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] mb-1" style={{ color: "#6F4E37" }}>
                Trending Now
              </p>
              <h2 className="font-black leading-none"
                style={{
                  fontSize: "clamp(24px,4vw,42px)", color: "#0C0C0C",
                  fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.02em"
                }}>
                Designs on Your Radar
              </h2>
              <p className="text-xs font-medium mt-1.5" style={{ color: "#8A8070" }}>
                What everyone's looking at right now
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <div className="h-[3px] w-10"
                  style={{ background: "linear-gradient(90deg,#6F4E37,#6F4E37)" }} />
                <div className="h-[3px] w-4" style={{ background: "rgba(12,12,12,0.3)" }} />
                <div className="h-[3px] w-2" style={{ background: "rgba(12,12,12,0.14)" }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ScrollBtn dir="left" onClick={() => scrollBy("left")} show={canLeft} />
              <ScrollBtn dir="right" onClick={() => scrollBy("right")} show={canRight} />
              <button
                className="hidden sm:flex items-center gap-1.5 ml-1 text-xs font-black tracking-wide group transition-all"
                style={{ color: "#0C0C0C" }}
              >
                See All
                <span className="flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{ width: "26px", height: "26px", background: "#0C0C0C", color: "#C9A96E" }}>
                  <ArrowRight c="w-3 h-3" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={trackRef}
          className="radar-track flex gap-4 overflow-x-auto"
          style={{
            paddingLeft: "clamp(16px,4vw,56px)",
            paddingRight: "clamp(16px,4vw,56px)",
            paddingBottom: "16px",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {RADAR_PRODUCTS.map((p, i) => (
            <div key={p.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
              <RadarCard item={p} index={i} />
            </div>
          ))}
          <div style={{ minWidth: "4px", flexShrink: 0 }} />
        </div>

        {/* Mobile View All */}
        <div className="sm:hidden flex justify-center mt-5 px-4">
          <button
            className="w-full max-w-sm flex items-center justify-center gap-2 py-3.5 text-sm tracking-wide active:scale-98"
            style={{
              background: "#6F4E37", color: "#fff",
              border: "1.5px solid rgba(201,169,110,0.2)",
              boxShadow: "0 6px 20px rgba(12,12,12,0.18)",
            }}
          >
            See All Trending Designs
            <ArrowRight c="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}