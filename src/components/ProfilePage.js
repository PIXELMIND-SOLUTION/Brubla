import { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import SingleOrderModal from "../pages/SingleOrderModal";

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
    @keyframes float {
      0%,100%{transform:translateY(0px)}
      50%{transform:translateY(-8px)}
    }

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
    
    /* Responsive touch improvements */
    @media (max-width: 640px) {
      button, .menu-item, .cursor-pointer { 
        -webkit-tap-highlight-color: transparent; 
      }
    }
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
const MapPin = ({ c }) => <Ic c={c || "w-5 h-5"} ch={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" /><circle cx="12" cy="10" r="3" /></>} />;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const USER = {
  name: "Vijay Nimmakayala",
  handle: "@vijay.nimmakeyala",
  email: "vijay.nimmakeyala@email.com",
  phone: "+91 6303092897",
  avatar: "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png",
  tier: "Gold Member",
  points: 4820,
  joined: "Member since Jan 2023",
  size: "M",
  address: "Banjara Hills, Hyderabad",
};

const ORDERS = [
  {
    id: "1",
    orderNumber: "NM-2089",
    date: "2025-01-12",
    status: "delivered",
    statusColor: "#6fcf97",
    total: 12999,
    items: [
      {
        id: 1,
        name: "Silk Organza Lehenga",
        price: 12999,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=120&h=150&fit=crop&q=80",
        size: "M",
        color: "Maroon"
      }
    ],
    shippingAddress: {
      name: "Priya Sharma",
      address: "123 Main Street, Apt 4B",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
      phone: "+91 98765 43210"
    },
    paymentMethod: "Credit Card",
    deliveredDate: "2025-01-12",
    estimatedDelivery: null,
    trackingNumber: "IND123456789"
  },
  {
    id: "2",
    orderNumber: "NM-2071",
    date: "2025-01-08",
    status: "shipped",
    statusColor: "#C9A96E",
    total: 9299,
    items: [
      {
        id: 2,
        name: "Zardozi Anarkali",
        price: 9299,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=120&h=150&fit=crop&q=80",
        size: "L",
        color: "Gold"
      }
    ],
    shippingAddress: {
      name: "Priya Sharma",
      address: "123 Main Street, Apt 4B",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
      phone: "+91 98765 43210"
    },
    paymentMethod: "UPI",
    deliveredDate: null,
    estimatedDelivery: "2025-01-22",
    trackingNumber: "IND123456790"
  },
  {
    id: "3",
    orderNumber: "NM-2044",
    date: "2024-12-28",
    status: "delivered",
    statusColor: "#6fcf97",
    total: 3799,
    items: [
      {
        id: 3,
        name: "Linen Co-ord Set",
        price: 3799,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=150&fit=crop&q=80",
        size: "S",
        color: "Beige"
      }
    ],
    shippingAddress: {
      name: "Priya Sharma",
      address: "123 Main Street, Apt 4B",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
      phone: "+91 98765 43210"
    },
    paymentMethod: "Net Banking",
    deliveredDate: "2024-12-28",
    estimatedDelivery: null,
    trackingNumber: "IND123456791"
  },
  {
    id: "4",
    orderNumber: "NM-2030",
    date: "2024-12-15",
    status: "delivered",
    statusColor: "#6fcf97",
    total: 8499,
    items: [
      {
        id: 4,
        name: "Banarasi Saree",
        price: 8499,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=150&fit=crop&q=80",
        size: "XL",
        color: "Red"
      }
    ],
    shippingAddress: {
      name: "Priya Sharma",
      address: "123 Main Street, Apt 4B",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034",
      phone: "+91 98765 43210"
    },
    paymentMethod: "Cash on Delivery",
    deliveredDate: "2024-12-15",
    estimatedDelivery: null,
    trackingNumber: "IND123456792"
  }
];

const MENU_GROUPS = [
  {
    label: "Account",
    items: [
      { icon: User, label: "Personal Details", sub: "Name, email, phone", link: "/profile/personal-details" },
      { icon: Location, label: "Saved Addresses", sub: "2 addresses saved", link: "/profile/saved-addresses" },
      { icon: Order, label: "My Orders", sub: "28 orders placed", link: "/profile/my-orders" },
      { icon: Bell, label: "Notifications", sub: "", link: "/profile/notifications" },
    ],
  },
  {
    label: "Support",
    items: [
      { icon: Shield, label: "Privacy Policy", sub: "" },
      { icon: Shield, label: "Terms of Service", sub: "" },
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
  const navigate = useNavigate();
  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#0C0C0C 0%,#1a1812 60%,#0C0C0C 100%)" }}>
      {/* Gold radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 65% 45% at 50% 0%,rgba(201,169,110,0.12) 0%,transparent 65%)" }} />

      {/* Rotating ring decoration - hidden on mobile */}
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 pointer-events-none hidden md:block"
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

      <div className="px-4 sm:px-6 md:px-8 lg:px-14 pt-8 sm:pt-10 pb-6 sm:pb-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-6">

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
              style={{ width: "clamp(72px, 15vw, 96px)", height: "clamp(72px, 15vw, 96px)", border: "3px solid #0C0C0C" }} />
            {/* Camera edit button */}
            <button onClick={() => navigate('/profile/personal-details')} className="absolute bottom-0 right-0 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
              style={{
                width: "clamp(24px, 5vw, 28px)", height: "clamp(24px, 5vw, 28px)",
                background: "linear-gradient(135deg,#C9A96E,#a8843f)",
                border: "2px solid #0C0C0C"
              }}>
              <Camera c="w-3 h-3 text-[#0C0C0C]" />
            </button>
          </div>

          {/* Name + info */}
          <div className="flex-1 text-center sm:text-left"
            style={{ opacity: vis ? 1 : 0, animation: vis ? "fadeUp 0.6s ease 0.18s both" : "none" }}>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full fs"
                style={{ background: "linear-gradient(135deg,#C9A96E,#a8843f)", color: "#0C0C0C" }}>
                {USER.tier}
              </span>
              <span className="text-[9px] sm:text-[10px] fs" style={{ color: "rgba(245,240,232,0.35)" }}>{USER.joined}</span>
            </div>
            <h1 className="fd font-black leading-tight text-white mb-0.5"
              style={{ fontSize: "clamp(20px, 5vw, 34px)", letterSpacing: "-0.02em" }}>
              {USER.name}
            </h1>
            <p className="text-[11px] sm:text-xs fs" style={{ color: "#C9A96E" }}>{USER.handle}</p>
            <p className="text-[10px] sm:text-[11px] mt-0.5 fs break-words px-2 sm:px-0" style={{ color: "rgba(245,240,232,0.40)" }}>
              {USER.email} · {USER.address}
            </p>
          </div>

          {/* Edit profile button */}
          <button className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-xs fs
                             transition-all hover:scale-105 active:scale-95 flex-shrink-0 w-full sm:w-auto"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(245,240,232,0.80)",
              border: "1px solid rgba(255,255,255,0.12)",
              opacity: vis ? 1 : 0,
              animation: vis ? "fadeUp 0.6s ease 0.30s both" : "none",
            }}
            onClick={() => navigate('/profile/personal-details')}
          >
            <Edit c="w-3.5 h-3.5" />
            Edit Profile
          </button>
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
const OrderCard = ({ o, onClick }) => {
  const item = o.items?.[0]; // first product

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2.5 sm:gap-3.5 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 group"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(201,169,110,0.10)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(201,169,110,0.06)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
      }
    >
      {/* Product image */}
      <div
        className="rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0"
        style={{ width: "48px", height: "60px" }}
      >
        <img
          src={item?.image}
          alt={item?.name}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] sm:text-xs font-bold text-white truncate">
          {item?.name}
        </p>

        <p
          className="text-[9px] sm:text-[10px] mt-0.5"
          style={{ color: "rgba(245,240,232,0.38)" }}
        >
          {o.orderNumber} · {o.date}
        </p>

        <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: o.statusColor }}
          />
          <span
            className="text-[9px] sm:text-[10px] font-bold"
            style={{ color: o.statusColor }}
          >
            {o.status}
          </span>
        </div>
      </div>

      {/* Price + arrow */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="font-black text-sm sm:text-base text-white">
          ₹{o.total.toLocaleString()}
        </span>

        <ChevRight
          c="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:translate-x-1"
          style={{ color: "rgba(245,240,232,0.30)" }}
        />
      </div>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────
// WISHLIST PREVIEW
// ─────────────────────────────────────────────────────────────────────────────
const WishCard = ({ item }) => {
  const [w, setW] = useState(true);
  return (
    <div className="relative flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group"
      style={{ width: "clamp(110px, 28vw, 130px)" }}>
      <div className="relative" style={{ aspectRatio: "4/5" }}>
        <img src={item.img} alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-107"
          loading="lazy" draggable={false} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(180deg,transparent 55%,rgba(12,12,12,0.78) 100%)" }} />
        <button onClick={() => setW(ww => !ww)}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full transition-all"
          style={{
            background: "rgba(12,12,12,0.55)", backdropFilter: "blur(6px)",
            color: w ? "#e85d4a" : "rgba(245,240,232,0.6)"
          }}>
          <Heart c="w-3 h-3" f={w} />
        </button>
      </div>
      <div className="px-2 py-1.5 sm:py-2" style={{ background: "#141410" }}>
        <p className="text-[9px] sm:text-[10px] font-bold text-white fd truncate">{item.name}</p>
        <p className="text-[10px] sm:text-[11px] font-black fs" style={{ color: "#C9A96E" }}>{item.price}</p>
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
    <div ref={ref} className="rounded-xl sm:rounded-2xl overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg,#1a1812 0%,#0C0C0C 100%)",
        border: "1px solid rgba(201,169,110,0.25)",
        opacity: vis ? 1 : 0,
        animation: vis ? "scaleIn 0.55s ease both" : "none",
      }}>
      {/* Decorative rings */}
      <div className="absolute -right-6 -top-6 w-28 sm:w-32 h-28 sm:h-32 rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(201,169,110,0.08)" }} />
      <div className="absolute -right-2 -top-2 w-16 sm:w-20 h-16 sm:h-20 rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(201,169,110,0.12)" }} />

      {/* <div className="p-4 sm:p-5 relative z-10">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div>
            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.22em] mb-1 fs" style={{ color: "#C9A96E" }}>
              NM Loyalty
            </p>
            <h3 className="fd font-black text-white text-lg sm:text-xl leading-tight">Gold Member</h3>
          </div>
          <div className="p-2 rounded-lg sm:rounded-xl" style={{ background: "rgba(201,169,110,0.12)" }}>
            <Gem c="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A96E]" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
          <span className="fd font-black gold-shimmer" style={{ fontSize: "clamp(28px, 6vw, 36px)" }}>4,820</span>
          <span className="text-[10px] sm:text-xs fs" style={{ color: "rgba(245,240,232,0.45)" }}>points</span>
        </div>


        <div className="mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] sm:text-[10px] fs" style={{ color: "rgba(245,240,232,0.40)" }}>
              1,180 pts to Platinum
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold fs" style={{ color: "#C9A96E" }}>80%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full"
              style={{ width: "80%", background: "linear-gradient(90deg,#C9A96E,#E8C97A)" }} />
          </div>
        </div>

        <p className="text-[9px] sm:text-[10px] fs" style={{ color: "rgba(245,240,232,0.35)" }}>
          ≈ ₹482 redeemable value
        </p>

     
        <button className="w-full mt-3 sm:mt-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs fs tracking-wide
                           transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg,#C9A96E,#a8843f)", color: "#0C0C0C",
            boxShadow: "0 4px 18px rgba(201,169,110,0.35)"
          }}>
          Redeem Points
        </button>
      </div> */}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MENU GROUP
// ─────────────────────────────────────────────────────────────────────────────
const MenuGroup = ({ group, delay }) => {
  const [ref, vis] = useVis(delay);
  const navigate = useNavigate();
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, animation: vis ? `slideIn 0.5s ease both` : "none" }}>
      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.22em] mb-2 px-1 fs"
        style={{ color: "rgba(245,240,232,0.30)" }}>
        {group.label}
      </p>
      <div className="rounded-xl sm:rounded-2xl overflow-hidden divide-y"
        style={{
          border: "1px solid rgba(201,169,110,0.10)",
          divideColor: "rgba(255,255,255,0.05)"
        }}
      >
        {group.items.map((item, i) => (
          <button key={i}
            className="menu-item w-full flex items-center gap-3 sm:gap-3.5 px-3 sm:px-4 py-3 sm:py-3.5 text-left transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.025)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,110,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
            onClick={() => navigate(item.link)}>
            {/* Icon bubble */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl flex-shrink-0 transition-all duration-200"
              style={{ background: "rgba(201,169,110,0.08)", color: "#C9A96E" }}>
              <item.icon c="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white fs">{item.label}</p>
              <p className="text-[9px] sm:text-[10px] fs truncate" style={{ color: "rgba(245,240,232,0.38)" }}>{item.sub}</p>
            </div>
            {/* Badge */}
            {item.badge && (
              <span className="text-[7px] sm:text-[8px] font-black px-1.5 sm:px-2 py-0.5 rounded-full fs flex-shrink-0"
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
              <ChevRight c="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
const SectionHead = ({ eyebrow, title, cta, onCta }) => {

  const navigate = useNavigate();
  return (
    <div className="flex items-end justify-between mb-3 sm:mb-4">
      <div>
        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 fs" style={{ color: "#C9A96E" }}>
          {eyebrow}
        </p>
        <h2 className="fd font-black leading-none text-white" style={{ fontSize: "clamp(16px, 4vw, 24px)", letterSpacing: "-0.02em" }}>
          {title}
        </h2>
      </div>
      {cta && (
        <button onClick={() => navigate(onCta)} className="text-[10px] sm:text-xs font-bold fs transition-colors flex items-center gap-1"
          style={{ color: "#C9A96E" }}
          onMouseEnter={e => e.currentTarget.style.color = "#E8C97A"}
          onMouseLeave={e => e.currentTarget.style.color = "#C9A96E"}>
          {cta} <ChevRight c="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// QUICK LINKS (style profile + tailor + express)
// ─────────────────────────────────────────────────────────────────────────────
const QuickLinks = () => {
  const [ref, vis] = useVis(50);
  const items = [
    { Icon: User, label: "My Profile", sub: "Complete your DNA", col: "#E8C97A", link: "/profile/personal-details" },
    { Icon: MapPin, label: "Addresses", sub: "1 active", col: "#acff9c", link: "/profile/saved-addresses" },
    { Icon: Truck, label: "My Orders", sub: "", col: "#6fcf97", link: "/profile/my-orders" },
  ];
  return (
    <div ref={ref} className="grid grid-cols-3 gap-2 sm:gap-3"
      style={{ opacity: vis ? 1 : 0, animation: vis ? "fadeUp 0.55s ease both" : "none" }}>
      {items.map(({ Icon, label, sub, col, link }, i) => (
        <a key={i} href={link} className="flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-1 sm:px-2 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer active:scale-95"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,169,110,0.10)" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,110,0.07)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
            style={{
              background: `rgba(${col === "#E8C97A" ? "232,201,122" : col === "#6fcf97" ? "111,207,151" : "201,169,110"},0.12)`,
              color: col
            }}>
            <Icon c="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-center">
            <p className="text-[10px] sm:text-[11px] font-bold text-white fs leading-tight">{label}</p>
            <p className="text-[8px] sm:text-[9px] fs mt-0.5" style={{ color: "rgba(245,240,232,0.35)" }}>{sub}</p>
          </div>
        </a>
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

  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen fs pb-20 sm:pb-24 lg:pb-12" style={{ background: "#0C0C0C", color: "#F5F0E8" }}>
        <Styles />

        {/* ── HERO ── */}
        <ProfileHero />

        {/* ── BODY ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-14 pt-6 sm:pt-8">

          {/* Two-column layout on lg+ */}
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 lg:gap-8">

            {/* ── LEFT COLUMN ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-5 sm:gap-6">

              {/* Quick links */}
              <div>
                <SectionHead eyebrow="Quick Access" title="Shortcuts" />
                <QuickLinks />
              </div>

              {/* Recent orders */}
              <div ref={ordersRef}
                style={{ opacity: ordersVis ? 1 : 0, animation: ordersVis ? "fadeUp 0.55s ease both" : "none" }}>
                <SectionHead onCta="/profile/my-orders" eyebrow="Shopping History" title="Recent Orders" cta="View All" />
                <div className="flex flex-col gap-2 sm:gap-2.5">
                  {ORDERS.map(o => <OrderCard key={o.id} o={o} onClick={() => setSelectedOrder(o)} />)}
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="lg:w-80 flex flex-col gap-5 sm:gap-6 flex-shrink-0">

              {/* Points card */}
              <PointsCard />

              {/* Menu groups */}
              {MENU_GROUPS.map((g, i) => (
                <MenuGroup key={i} group={g} delay={i * 60} />
              ))}

              {/* Logout */}
              <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl sm:rounded-2xl
                               font-bold text-xs sm:text-sm fs transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: "rgba(232,93,74,0.08)", color: "rgba(232,93,74,0.75)",
                  border: "1px solid rgba(232,93,74,0.15)"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(232,93,74,0.14)"; e.currentTarget.style.color = "#e85d4a"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(232,93,74,0.08)"; e.currentTarget.style.color = "rgba(232,93,74,0.75)"; }}>
                <Logout c="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Sign Out
              </button>

              {/* App version */}
              <p className="text-center text-[8px] sm:text-[10px] fs pb-2" style={{ color: "rgba(245,240,232,0.18)" }}>
                Brubla · Terms · Privacy
              </p>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        <SingleOrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      </div>
    </>
  );
}