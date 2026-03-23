import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    .fd { font-family: 'Playfair Display', Georgia, serif; }
    .fs { font-family: 'DM Sans', system-ui, sans-serif; }

    @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes pulseGold{ 0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0.4)} 60%{box-shadow:0 0 0 8px rgba(201,169,110,0)} }
    @keyframes slideIn  { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
    @keyframes scaleIn  { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }

    .gold-shimmer {
      background: linear-gradient(90deg,#C9A96E,#E8C97A,#C9A96E);
      background-size: 200% auto;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }
    .menu-item:hover .menu-arrow { transform: translateX(4px); }
    .order-card::-webkit-scrollbar,
    .activity-track::-webkit-scrollbar { display: none; }
    input:focus { outline: none; }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Ic = ({ d, c = "w-5 h-5", fill = "none", sw = 2, ch }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={c} fill={fill}
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : ch}
  </svg>
);
const User = ({ c }) => <Ic c={c || "w-5 h-5"} ch={<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />;
const Edit = ({ c }) => <Ic c={c || "w-4 h-4"} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />;
const Order = ({ c }) => <Ic c={c || "w-5 h-5"} ch={<><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></>} />;
const Heart = ({ c, f }) => <Ic c={c || "w-5 h-5"} fill={f ? "currentColor" : "none"} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z" />;
const Location = ({ c }) => <Ic c={c || "w-5 h-5"} ch={<><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>} />;
const Bell = ({ c }) => <Ic c={c || "w-5 h-5"} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />;
const Shield = ({ c }) => <Ic c={c || "w-5 h-5"} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const Gift = ({ c }) => <Ic c={c || "w-5 h-5"} ch={<><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" /></>} />;
const Help = ({ c }) => <Ic c={c || "w-5 h-5"} ch={<><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" sw={3} /></>} />;
const Logout = ({ c }) => <Ic c={c || "w-5 h-5"} d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />;
const ChevRight = ({ c }) => <Ic c={c || "w-4 h-4"} d="M9 18l6-6-6-6" sw={2.5} />;
const Star = ({ c }) => <Ic c={c || "w-4 h-4"} fill="currentColor" sw={0} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const Camera = ({ c }) => <Ic c={c || "w-4 h-4"} ch={<><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></>} />;
const Gem = ({ c }) => <Ic c={c || "w-5 h-5"} ch={<><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M2 9h20M6 3l4 6m4 0l4-6m-8 0v6" /></>} />;
const Truck = ({ c }) => <Ic c={c || "w-4 h-4"} ch={<><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>} />;
const Check = ({ c }) => <Ic c={c || "w-4 h-4"} d="M5 13l4 4L19 7" sw={2.5} />;
const Scissors = ({ c }) => <Ic c={c || "w-5 h-5"} ch={<><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" /></>} />;
const Sparkles = ({ c }) => <Ic c={c || "w-5 h-5"} ch={<><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" /></>} />;
const Settings = ({ c }) => <Ic c={c || "w-5 h-5"} ch={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></>} />;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const USER = {
  name: "Priya Sharma",
  handle: "@priya.sharma",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=90&auto=format",
  tier: "Gold Member",
  points: 4820,
  joined: "Member since Jan 2023",
  size: "M",
  address: "Banjara Hills, Hyderabad",
};

const STATS = [
  { value: "28", label: "Orders", color: "#C9A96E" },
  { value: "₹3.2L", label: "Spent", color: "#E8C97A" },
  { value: "4820", label: "NM Points", color: "#6fcf97" },
  { value: "12", label: "Wishlisted", color: "#e85d4a" },
];

const ORDERS = [
  { id: "NM-2089", name: "Silk Organza Lehenga", status: "Delivered", statusCol: "#6fcf97", date: "12 Jan 2025", price: "₹12,999", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=120&h=150&fit=crop&q=80" },
  { id: "NM-2071", name: "Zardozi Anarkali", status: "Shipped", statusCol: "#C9A96E", date: "08 Jan 2025", price: "₹9,299", img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=120&h=150&fit=crop&q=80" },
  { id: "NM-2044", name: "Linen Co-ord Set", status: "Delivered", statusCol: "#6fcf97", date: "28 Dec 2024", price: "₹3,799", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=150&fit=crop&q=80" },
  { id: "NM-2030", name: "Banarasi Saree", status: "Delivered", statusCol: "#6fcf97", date: "15 Dec 2024", price: "₹8,499", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=150&fit=crop&q=80" },
];

const WISHLIST = [
  { name: "Mirror Work Lehenga", price: "₹7,499", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=160&h=200&fit=crop&q=80" },
  { name: "Velvet Blazer Dress", price: "₹5,999", img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=160&h=200&fit=crop&q=80" },
  { name: "Premium Edit Gown", price: "₹15,999", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=160&h=200&fit=crop&q=80" },
];

const MENU_GROUPS = [
  {
    label: "Account",
    items: [
      { icon: User, label: "Personal Details", sub: "Name, email, phone" },
      { icon: Location, label: "Saved Addresses", sub: "2 addresses saved" },
      { icon: Settings, label: "Preferences", sub: "Size, style, notifications" },
    ],
  },
  {
    label: "Shopping",
    items: [
      { icon: Order, label: "My Orders", sub: "28 orders placed" },
      { icon: Heart, label: "Wishlist", sub: "12 items saved" },
      { icon: Scissors, label: "Tailor Requests", sub: "1 active request" },
      { icon: Sparkles, label: "Style Profile", sub: "Complete your style DNA" },
    ],
  },
  {
    label: "Rewards",
    items: [
      { icon: Gift, label: "NM Points & Offers", sub: "4820 pts · ₹482 value", badge: "NEW" },
      { icon: Gem, label: "Gold Membership", sub: "Exclusive benefits active", badge: "GOLD" },
    ],
  },
  {
    label: "Support",
    items: [
      { icon: Bell, label: "Notifications", sub: "Manage alerts" },
      { icon: Shield, label: "Privacy & Security", sub: "Password, 2FA" },
      { icon: Help, label: "Help & Support", sub: "FAQs, chat with us" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ENTRANCE HOOK
// ─────────────────────────────────────────────────────────────────────────────
const useVis = (delay = 0) => {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, vis];
};

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR SECTION
// ─────────────────────────────────────────────────────────────────────────────
const ProfileHero = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#0C0C0C 0%,#1a1812 60%,#0C0C0C 100%)" }}>
      {/* Gold radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 65% 45% at 50% 0%,rgba(201,169,110,0.12) 0%,transparent 65%)" }} />

      {/* Rotating ring decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none hidden md:block"
        style={{ opacity: 0.06, animation: "shimmer 20s linear infinite", transform: "translate(30%,-30%)" }}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[85, 65, 45].map((r, i) => (
            <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="#C9A96E" strokeWidth="0.5"
              strokeDasharray={`${4 + i * 2} ${8 + i * 3}`} />
          ))}
        </svg>
      </div>

      {/* Gold top line */}
      <div className="h-px w-full"
        style={{ background: "linear-gradient(90deg,transparent,#C9A96E,transparent)" }} />

      <div className="px-4 md:px-8 lg:px-14 pt-10 pb-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">

          {/* Avatar with camera button */}
          <div className="relative flex-shrink-0"
            style={{ opacity: vis ? 1 : 0, animation: vis ? "scaleIn 0.6s ease 0.05s both" : "none" }}>
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full"
              style={{
                margin: "-4px", border: "1.5px solid rgba(201,169,110,0.35)",
                animation: "pulseGold 3s ease-in-out infinite", borderRadius: "50%"
              }} />
            {/* Gold ring */}
            <div className="absolute inset-0 rounded-full"
              style={{
                margin: "-2px", background: "conic-gradient(#C9A96E 0deg,#E8C97A 120deg,#C9A96E 240deg,#E8C97A 360deg)",
                borderRadius: "50%", padding: "2px"
              }} />
            <img src={USER.avatar} alt={USER.name}
              className="relative rounded-full object-cover"
              style={{ width: "96px", height: "96px", border: "3px solid #0C0C0C" }} />
            {/* Camera edit button */}
            <button className="absolute bottom-0 right-0 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
              style={{
                width: "28px", height: "28px",
                background: "linear-gradient(135deg,#C9A96E,#a8843f)",
                border: "2px solid #0C0C0C"
              }}>
              <Camera c="w-3 h-3 text-[#0C0C0C]" />
            </button>
          </div>

          {/* Name + info */}
          <div className="flex-1 text-center sm:text-left"
            style={{ opacity: vis ? 1 : 0, animation: vis ? "fadeUp 0.6s ease 0.18s both" : "none" }}>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full fs"
                style={{ background: "linear-gradient(135deg,#C9A96E,#a8843f)", color: "#0C0C0C" }}>
                {USER.tier}
              </span>
              <span className="text-[10px] fs" style={{ color: "rgba(245,240,232,0.35)" }}>{USER.joined}</span>
            </div>
            <h1 className="fd font-black leading-tight text-white mb-0.5"
              style={{ fontSize: "clamp(22px,4vw,34px)", letterSpacing: "-0.02em" }}>
              {USER.name}
            </h1>
            <p className="text-xs fs" style={{ color: "#C9A96E" }}>{USER.handle}</p>
            <p className="text-[11px] mt-0.5 fs" style={{ color: "rgba(245,240,232,0.40)" }}>
              {USER.email} · {USER.address}
            </p>
          </div>

          {/* Edit profile button */}
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs fs
                             transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(245,240,232,0.80)",
              border: "1px solid rgba(255,255,255,0.12)",
              opacity: vis ? 1 : 0,
              animation: vis ? "fadeUp 0.6s ease 0.30s both" : "none",
            }}>
            <Edit c="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mt-7"
          style={{ opacity: vis ? 1 : 0, animation: vis ? "fadeUp 0.6s ease 0.42s both" : "none" }}>
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col items-center py-3.5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.10)" }}>
              <span className="fd font-black leading-none" style={{ fontSize: "clamp(18px,3vw,24px)", color: s.color }}>
                {s.value}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.1em] mt-1 fs"
                style={{ color: "rgba(245,240,232,0.38)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Gold bottom line */}
      <div className="h-px w-full"
        style={{ background: "linear-gradient(90deg,transparent,rgba(201,169,110,0.35),transparent)" }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// RECENT ORDERS
// ─────────────────────────────────────────────────────────────────────────────
const OrderCard = ({ o }) => (
  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all duration-200 group"
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,169,110,0.10)" }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,110,0.06)"}
    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
    {/* Product image */}
    <div className="rounded-xl overflow-hidden flex-shrink-0" style={{ width: "52px", height: "64px" }}>
      <img src={o.img} alt={o.name} className="w-full h-full object-cover object-top" loading="lazy" draggable={false} />
    </div>
    {/* Info */}
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-white fs truncate">{o.name}</p>
      <p className="text-[10px] fs mt-0.5" style={{ color: "rgba(245,240,232,0.38)" }}>{o.id} · {o.date}</p>
      <div className="flex items-center gap-1.5 mt-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: o.statusCol }} />
        <span className="text-[10px] font-bold fs" style={{ color: o.statusCol }}>{o.status}</span>
      </div>
    </div>
    {/* Price + arrow */}
    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
      <span className="fd font-black text-sm text-white">{o.price}</span>
      <ChevRight c="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: "rgba(245,240,232,0.30)" }} />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// WISHLIST PREVIEW
// ─────────────────────────────────────────────────────────────────────────────
const WishCard = ({ item }) => {
  const [w, setW] = useState(true);
  return (
    <div className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
      style={{ width: "130px" }}>
      <div className="relative" style={{ aspectRatio: "4/5" }}>
        <img src={item.img} alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-107"
          loading="lazy" draggable={false} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(180deg,transparent 55%,rgba(12,12,12,0.78) 100%)" }} />
        <button onClick={() => setW(ww => !ww)}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all"
          style={{
            background: "rgba(12,12,12,0.55)", backdropFilter: "blur(6px)",
            color: w ? "#e85d4a" : "rgba(245,240,232,0.6)"
          }}>
          <Heart c="w-3.5 h-3.5" f={w} />
        </button>
      </div>
      <div className="px-2.5 py-2" style={{ background: "#141410" }}>
        <p className="text-[10px] font-bold text-white fd truncate">{item.name}</p>
        <p className="text-[11px] font-black fs" style={{ color: "#C9A96E" }}>{item.price}</p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// POINTS CARD
// ─────────────────────────────────────────────────────────────────────────────
const PointsCard = () => {
  const [ref, vis] = useVis(100);
  return (
    <div ref={ref} className="rounded-2xl overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg,#1a1812 0%,#0C0C0C 100%)",
        border: "1px solid rgba(201,169,110,0.25)",
        opacity: vis ? 1 : 0,
        animation: vis ? "scaleIn 0.55s ease both" : "none",
      }}>
      {/* Decorative rings */}
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(201,169,110,0.08)" }} />
      <div className="absolute -right-2 -top-2 w-20 h-20 rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(201,169,110,0.12)" }} />

      <div className="p-5 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.22em] mb-1 fs" style={{ color: "#C9A96E" }}>
              NM Loyalty
            </p>
            <h3 className="fd font-black text-white text-xl leading-tight">Gold Member</h3>
          </div>
          <div className="p-2.5 rounded-xl" style={{ background: "rgba(201,169,110,0.12)" }}>
            <Gem c="w-5 h-5 text-[#C9A96E]" />
          </div>
        </div>

        {/* Points */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="fd font-black gold-shimmer" style={{ fontSize: "36px" }}>4,820</span>
          <span className="text-xs fs" style={{ color: "rgba(245,240,232,0.45)" }}>points</span>
        </div>

        {/* Progress to next tier */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] fs" style={{ color: "rgba(245,240,232,0.40)" }}>
              1,180 pts to Platinum
            </span>
            <span className="text-[10px] font-bold fs" style={{ color: "#C9A96E" }}>80%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full"
              style={{ width: "80%", background: "linear-gradient(90deg,#C9A96E,#E8C97A)" }} />
          </div>
        </div>

        <p className="text-[10px] fs" style={{ color: "rgba(245,240,232,0.35)" }}>
          ≈ ₹482 redeemable value
        </p>

        {/* Redeem button */}
        <button className="w-full mt-4 py-2.5 rounded-xl font-black text-xs fs tracking-wide
                           transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg,#C9A96E,#a8843f)", color: "#0C0C0C",
            boxShadow: "0 4px 18px rgba(201,169,110,0.35)"
          }}>
          Redeem Points
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MENU GROUP
// ─────────────────────────────────────────────────────────────────────────────
const MenuGroup = ({ group, delay }) => {
  const [ref, vis] = useVis(delay);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, animation: vis ? `slideIn 0.5s ease both` : "none" }}>
      <p className="text-[9px] font-black uppercase tracking-[0.22em] mb-2 px-1 fs"
        style={{ color: "rgba(245,240,232,0.30)" }}>
        {group.label}
      </p>
      <div className="rounded-2xl overflow-hidden divide-y"
        style={{
          border: "1px solid rgba(201,169,110,0.10)",
          divideColor: "rgba(255,255,255,0.05)"
        }}>
        {group.items.map((item, i) => (
          <button key={i}
            className="menu-item w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.025)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,110,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}>
            {/* Icon bubble */}
            <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 transition-all duration-200"
              style={{ background: "rgba(201,169,110,0.08)", color: "#C9A96E" }}>
              <item.icon c="w-4 h-4" />
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white fs">{item.label}</p>
              <p className="text-[10px] fs truncate" style={{ color: "rgba(245,240,232,0.38)" }}>{item.sub}</p>
            </div>
            {/* Badge */}
            {item.badge && (
              <span className="text-[8px] font-black px-2 py-0.5 rounded-full fs flex-shrink-0"
                style={{
                  background: item.badge === "GOLD"
                    ? "linear-gradient(135deg,#C9A96E,#a8843f)"
                    : "rgba(111,207,151,0.15)",
                  color: item.badge === "GOLD" ? "#0C0C0C" : "#6fcf97",
                }}>
                {item.badge}
              </span>
            )}
            {/* Arrow */}
            <div className="menu-arrow transition-transform duration-200 flex-shrink-0"
              style={{ color: "rgba(245,240,232,0.22)" }}>
              <ChevRight c="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────────────────────
const SectionHead = ({ eyebrow, title, cta, onCta }) => (
  <div className="flex items-end justify-between mb-4">
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 fs" style={{ color: "#C9A96E" }}>
        {eyebrow}
      </p>
      <h2 className="fd font-black leading-none text-white" style={{ fontSize: "clamp(18px,3vw,24px)", letterSpacing: "-0.02em" }}>
        {title}
      </h2>
    </div>
    {cta && (
      <button onClick={onCta} className="text-xs font-bold fs transition-colors flex items-center gap-1"
        style={{ color: "#C9A96E" }}
        onMouseEnter={e => e.currentTarget.style.color = "#E8C97A"}
        onMouseLeave={e => e.currentTarget.style.color = "#C9A96E"}>
        {cta} <ChevRight c="w-3 h-3" />
      </button>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// QUICK LINKS (style profile + tailor + express)
// ─────────────────────────────────────────────────────────────────────────────
const QuickLinks = () => {
  const [ref, vis] = useVis(50);
  const items = [
    { Icon: Sparkles, label: "Style Profile", sub: "Complete your DNA", col: "#E8C97A" },
    { Icon: Scissors, label: "Tailor Request", sub: "1 active", col: "#C9A96E" },
    { Icon: Truck, label: "Track Orders", sub: "1 in transit", col: "#6fcf97" },
  ];
  return (
    <div ref={ref} className="grid grid-cols-3 gap-3"
      style={{ opacity: vis ? 1 : 0, animation: vis ? "fadeUp 0.55s ease both" : "none" }}>
      {items.map(({ Icon, label, sub, col }, i) => (
        <button key={i}
          className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,169,110,0.10)" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,110,0.07)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `rgba(${col === "#E8C97A" ? "232,201,122" : col === "#6fcf97" ? "111,207,151" : "201,169,110"},0.12)`,
              color: col
            }}>
            <Icon c="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-[11px] font-bold text-white fs leading-tight">{label}</p>
            <p className="text-[9px] fs mt-0.5" style={{ color: "rgba(245,240,232,0.35)" }}>{sub}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [ordersRef, ordersVis] = useVis(80);
  const [wishRef, wishVis] = useVis(100);

  return (
    <>
      <Navbar />
      <div className="min-h-screen fs pb-24 lg:pb-12" style={{ background: "#0C0C0C", color: "#F5F0E8" }}>
        <Styles />

        {/* ── HERO ── */}
        <ProfileHero />

        {/* ── BODY ── */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-14 pt-8">

          {/* Two-column layout on lg+ */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

            {/* ── LEFT COLUMN ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* Quick links */}
              <div>
                <SectionHead eyebrow="Quick Access" title="Shortcuts" />
                <QuickLinks />
              </div>

              {/* Recent orders */}
              <div ref={ordersRef}
                style={{ opacity: ordersVis ? 1 : 0, animation: ordersVis ? "fadeUp 0.55s ease both" : "none" }}>
                <SectionHead eyebrow="Shopping History" title="Recent Orders" cta="View All" />
                <div className="flex flex-col gap-2.5">
                  {ORDERS.map(o => <OrderCard key={o.id} o={o} />)}
                </div>
              </div>

              {/* Wishlist */}
              <div ref={wishRef}
                style={{ opacity: wishVis ? 1 : 0, animation: wishVis ? "fadeUp 0.55s ease both" : "none" }}>
                <SectionHead eyebrow="Saved Items" title="Wishlist" cta="View All" />
                <div className="flex gap-3 overflow-x-auto pb-2 activity-track" style={{ scrollbarWidth: "none" }}>
                  {WISHLIST.map((item, i) => <WishCard key={i} item={item} />)}
                  {/* View more card */}
                  <div className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                    style={{
                      width: "130px", aspectRatio: "4/5", background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(201,169,110,0.12)"
                    }}>
                    <span className="fd font-black text-2xl" style={{ color: "#C9A96E" }}>+9</span>
                    <span className="text-[10px] fs text-center" style={{ color: "rgba(245,240,232,0.35)" }}>
                      More items
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="lg:w-80 flex flex-col gap-6 flex-shrink-0">

              {/* Points card */}
              <PointsCard />

              {/* Menu groups */}
              {MENU_GROUPS.map((g, i) => (
                <MenuGroup key={i} group={g} delay={i * 60} />
              ))}

              {/* Logout */}
              <button className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl
                               font-bold text-sm fs transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: "rgba(232,93,74,0.08)", color: "rgba(232,93,74,0.75)",
                  border: "1px solid rgba(232,93,74,0.15)"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(232,93,74,0.14)"; e.currentTarget.style.color = "#e85d4a"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(232,93,74,0.08)"; e.currentTarget.style.color = "rgba(232,93,74,0.75)"; }}>
                <Logout c="w-4 h-4" />
                Sign Out
              </button>

              {/* App version */}
              <p className="text-center text-[10px] fs pb-2" style={{ color: "rgba(245,240,232,0.18)" }}>
                NewMe App v3.2.1 · Terms · Privacy
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}