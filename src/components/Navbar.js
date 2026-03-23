import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS  — Black & Cream luxury theme
// ─────────────────────────────────────────────────────────────────────────────
// --ink:      #0C0C0C   deep black
// --cream:    #F5F0E8   warm cream
// --cream2:   #EDE7D9   deeper cream
// --gold:     #C9A96E   muted luxury gold
// --gold-hi:  #E8C97A   lighter gold highlight
// --muted:    #8A8070   warm grey-brown

// ─────────────────────────────────────────────────────────────────────────────
// ICON PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const Ic = ({ d, className = "w-5 h-5", fill = "none", sw = 2, children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={fill}
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}
        strokeLinecap="round" strokeLinejoin="round">
        {d ? <path d={d} /> : children}
    </svg>
);

const SearchIcon = ({ c }) => <Ic className={c || "w-5 h-5"} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />;
const CartIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></Ic>;
const ProfileIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></Ic>;
const CloseIcon = ({ c }) => <Ic className={c || "w-4 h-4"} d="M6 18L18 6M6 6l12 12" />;
const ChevDown = ({ c }) => <Ic className={c || "w-3.5 h-3.5"} d="M19 9l-7 7-7-7" sw={2.5} />;
const ChevRight = ({ c }) => <Ic className={c || "w-4 h-4"} d="M9 5l7 7-7 7" />;
const CheckIcon = ({ c }) => <Ic className={c || "w-3.5 h-3.5"} d="M5 13l4 4L19 7" sw={2.5} />;
const ZapIcon = ({ c }) => <Ic className={c || "w-3 h-3"} fill="currentColor" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" sw={0} />;
const TagIcon = ({ c }) => <Ic className={c || "w-4 h-4"} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />;
const PinIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></Ic>;
const GpsIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></Ic>;

// Bottom-bar icons
const HomeIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></Ic>;
const HeartIcon = ({ c }) => (
    <Ic className={c || "w-5 h-5"}>
        <path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z" />
    </Ic>
);
// const ProfileIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /><path d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></Ic>;
const TruckIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></Ic>;
const ScissorsIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" /></Ic>;
const BrushIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L3 14.67l.06.06a4 4 0 005.6 5.6l.06.06 10.06-10.06a5.5 5.5 0 000-7.78z" /><path d="M7.5 21a2.5 2.5 0 01-3-3" /></Ic>;

// Exclusive — diamond / gem icon
const GemIcon = ({ c }) => (
    <Ic className={c || "w-6 h-6"}>
        <path d="M6 3h12l4 6-10 13L2 9z" />
        <path d="M2 9h20M6 3l4 6m4 0l4-6m-8 0v6" />
    </Ic>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────────────────────────────────────
const NewMeLogo = () => (
    <div className="flex items-center gap-2 select-none">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ background: "linear-gradient(145deg,#1a1812 0%,#0C0C0C 100%)", border: "1px solid rgba(201,169,110,0.25)", boxShadow: "0 2px 12px rgba(201,169,110,0.15)" }}>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-4 h-3 rounded-full rounded-b-none relative" style={{ background: "#C9A96E" }}>
                    <div className="absolute -right-1.5 top-0.5 w-1.5 h-2 rounded-full rotate-12" style={{ background: "#C9A96E" }} />
                </div>
                <div className="w-3 h-1.5 rounded-b-full" style={{ background: "#C9A96E" }} />
            </div>
        </div>
        <div className="flex flex-col leading-none">
            <span className="text-[11px] font-black tracking-[0.22em] uppercase" style={{ color: "#0C0C0C" }}>NEW</span>
            <span className="text-[11px] font-black tracking-[0.22em] uppercase -mt-[1px]" style={{ color: "#C9A96E" }}>ME</span>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION BANNER
// ─────────────────────────────────────────────────────────────────────────────
const NOTIFS = [
    "✦  NEWME SOS Sale is Live Now  ·  BUY 1 GET 1 on all styles",
    "✦  Free delivery on orders above ₹499  ·  Code: FREESHIP",
    "✦  Flash Deal: Extra 20% off on Kurtas  ·  Limited time",
    "✦  New Arrivals: Summer 2025 Collection — Shop Now",
];

const NotifBanner = ({ onClose }) => {
    const [idx, setIdx] = useState(0);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const t = setInterval(() => {
            setFade(true);
            setTimeout(() => { setIdx(i => (i + 1) % NOTIFS.length); setFade(false); }, 280);
        }, 4000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="h-8 flex items-center justify-between px-3 md:px-6 relative overflow-hidden"
            style={{ background: "linear-gradient(90deg,#0C0C0C 0%,#1a1812 50%,#0C0C0C 100%)" }}>
            {/* cream shimmer line bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg,transparent 0%,#C9A96E 50%,transparent 100%)" }} />
            <div className="flex-1 flex justify-center overflow-hidden">
                <p className={`text-[11px] md:text-xs font-semibold tracking-[0.12em] text-center whitespace-nowrap transition-all duration-300 ${fade ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"}`}
                    style={{ color: "#E8C97A", letterSpacing: "0.1em" }}>
                    {NOTIFS[idx]}
                </p>
            </div>
            <button onClick={onClose} className="ml-3 flex-shrink-0 opacity-40 hover:opacity-80 transition-opacity" style={{ color: "#C9A96E" }}>
                <CloseIcon c="w-3.5 h-3.5" />
            </button>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOCATION SELECTOR
// ─────────────────────────────────────────────────────────────────────────────
const CITIES = [
    { pin: "500004", city: "Hyderabad" },
    { pin: "400001", city: "Mumbai" },
    { pin: "110001", city: "Delhi" },
    { pin: "560001", city: "Bengaluru" },
    { pin: "600001", city: "Chennai" },
];

const LocationSelector = ({ compact = false }) => {
    const [open, setOpen] = useState(false);
    const [sel, setSel] = useState(0);
    const [gpsLoading, setGps] = useState(false);
    const [gpsLabel, setGpsLbl] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    const handleGps = useCallback(() => {
        if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
        setGps(true);
        navigator.geolocation.getCurrentPosition(
            pos => {
                const mock = `${pos.coords.latitude.toFixed(3)}°N, ${pos.coords.longitude.toFixed(3)}°E`;
                setGpsLbl(mock); setSel(-1); setGps(false); setOpen(false);
            },
            () => { setGps(false); alert("Please allow location access."); }
        );
    }, []);

    const loc = sel === -1 ? { pin: "GPS", city: gpsLabel || "Current" } : CITIES[sel];

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 group" aria-label="Change location">
                <span style={{ color: "#C9A96E" }}><PinIcon c="w-3.5 h-3.5" /></span>
                {compact ? (
                    <span className="text-xs font-semibold max-w-[80px] truncate" style={{ color: "#0C0C0C" }}>{loc.city}</span>
                ) : (
                    <div className="flex flex-col items-start leading-none gap-[2px]">
                        <span className="text-[9px] font-medium" style={{ color: "#8A8070" }}>Delivery in</span>
                        <div className="flex items-center gap-0.5">
                            <span style={{ color: "#C9A96E" }}><ZapIcon c="w-3 h-3" /></span>
                            <span className="text-[11px] font-bold" style={{ color: "#C9A96E" }}>3–4 days</span>
                        </div>
                        <span className="text-[10px] max-w-[130px] truncate" style={{ color: "#8A8070" }}>
                            {sel === -1 ? (gpsLabel || "Current Location") : `${loc.pin}, ${loc.city}`}
                        </span>
                    </div>
                )}
                <ChevDown c={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-2 w-60 rounded-2xl shadow-2xl z-[200] overflow-hidden"
                    style={{ background: "#FEFCF8", border: "1px solid #EDE7D9" }}>
                    {/* GPS row */}
                    <button onClick={handleGps}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#F5F0E8]"
                        style={{ borderBottom: "1px solid #EDE7D9" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#C9A96E,#a8843f)" }}>
                            {gpsLoading
                                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : <GpsIcon c="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-bold" style={{ color: "#0C0C0C" }}>Use Current Location</span>
                            <span className="text-[10px]" style={{ color: "#8A8070" }}>Detect via GPS</span>
                        </div>
                        {sel === -1 && <span className="ml-auto" style={{ color: "#C9A96E" }}><CheckIcon /></span>}
                    </button>

                    {/* City header */}
                    <div className="px-4 pt-2.5 pb-1">
                        <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#8A8070" }}>Select City</p>
                    </div>

                    {CITIES.map((l, i) => (
                        <button key={l.pin} onClick={() => { setSel(i); setOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors ${i === sel ? "" : "hover:bg-[#F5F0E8]"}`}
                            style={{ background: i === sel ? "#F5F0E8" : "transparent" }}>
                            <span style={{ color: "#C9A96E" }}><PinIcon c="w-3.5 h-3.5" /></span>
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-semibold" style={{ color: i === sel ? "#C9A96E" : "#0C0C0C" }}>{l.city}</span>
                                <span className="text-[10px]" style={{ color: "#8A8070" }}>{l.pin}</span>
                            </div>
                            {i === sel && <span className="ml-auto" style={{ color: "#C9A96E" }}><CheckIcon /></span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH BAR
// ─────────────────────────────────────────────────────────────────────────────
const SearchBar = ({ className = "", placeholder = "Search products, brands…" }) => {
    const [focused, setFocused] = useState(false);
    const [q, setQ] = useState("");
    return (
        <div className={`relative ${className}`}>
            <div className={`flex items-center gap-2 rounded-full px-3.5 py-2 transition-all duration-200`}
                style={{
                    background: focused ? "#FFFFFF" : "#F5F0E8",
                    border: `1.5px solid ${focused ? "#C9A96E" : "#EDE7D9"}`,
                    boxShadow: focused ? "0 0 0 3px rgba(201,169,110,0.12)" : "none"
                }}>
                <SearchIcon c="w-4 h-4 flex-shrink-0" />
                <input type="text" placeholder={placeholder} value={q}
                    onChange={e => setQ(e.target.value)}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    className="bg-transparent text-xs outline-none flex-1 min-w-0 placeholder:opacity-50"
                    style={{ color: "#0C0C0C", caretColor: "#C9A96E" }} />
                {q && <button onClick={() => setQ("")} className="flex-shrink-0 transition-opacity opacity-50 hover:opacity-90"><CloseIcon c="w-3.5 h-3.5" /></button>}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// NAV DATA
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
    { label: "Men", emoji: "👔", sub: ["Shirts", "T-Shirts", "Jeans", "Trousers", "Jackets"] },
    { label: "Women", emoji: "👗", sub: ["Kurtas", "Tops", "Dresses", "Sarees", "Leggings"] },
    { label: "Kids", emoji: "🧒", sub: ["Boys", "Girls", "Infants", "School Wear"] },
    { label: "Home & Living", emoji: "🏠", sub: ["Bedding", "Cushions", "Kitchen", "Decor"] },
    { label: "Beauty", emoji: "✨", sub: ["Skincare", "Haircare", "Makeup", "Fragrances"] },
    { label: "Sale", emoji: "🏷️", sub: ["Under ₹299", "Under ₹499", "Clearance", "Buy 1 Get 1"], red: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP NAV
// ─────────────────────────────────────────────────────────────────────────────
const DesktopNav = () => {
    const [hover, setHover] = useState(null);
    return (
        <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(link => (
                <div key={link.label} className="relative"
                    onMouseEnter={() => setHover(link.label)}
                    onMouseLeave={() => setHover(null)}>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
                        style={{
                            color: link.red ? "#c0392b" : hover === link.label ? "#F5F0E8" : "#3a3530",
                            background: link.red ? "transparent" : hover === link.label ? "#0C0C0C" : "transparent",
                        }}>
                        {link.label}
                        <ChevDown c={`w-3 h-3 transition-transform duration-200 ${hover === link.label ? "rotate-180" : ""}`} />
                    </button>
                    {hover === link.label && (
                        <div className="absolute top-full left-0 mt-1 rounded-2xl shadow-2xl z-[100] w-44 py-2 overflow-hidden"
                            style={{ background: "#FEFCF8", border: "1px solid #EDE7D9" }}>
                            {link.sub.map(s => (
                                <button key={s} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-left transition-colors hover:bg-[#F5F0E8]"
                                    style={{ color: "#3a3530" }}>
                                    <ChevRight c="w-3 h-3 opacity-30" />{s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// CART BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const CartBtn = ({ count }) => (
    <button className="relative p-2 rounded-full transition-colors hover:bg-[#F5F0E8]" style={{ color: "#3a3530" }} aria-label="Cart">
        <CartIcon />
        {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm"
                style={{ background: "#0C0C0C", color: "#E8C97A" }}>
                {count}
            </span>
        )}
    </button>
);



// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM NAV BAR  — curved with floating Exclusive centre
// ─────────────────────────────────────────────────────────────────────────────
/*
  Layout:  [Home]  [Express]  [★ EXCLUSIVE ★]  [Tailor]  [Stylist]
  The centre slot is a raised floating button that punches through the
  curved top edge of the nav bar.
*/

const SIDE_TABS = [
    { id: "home", label: "Home", Icon: HomeIcon, badge: null, link: "/" },
    // { id: "favourites", label: "favourites", Icon: HeartIcon, sublabel: "Delivery", link: "/" },
    { id: "tailor", label: "Tailor", Icon: ScissorsIcon, badge: null, link: "/" },
    // centre slot = Exclusive (rendered separately)
    { id: "stylist", label: "Stylist", Icon: BrushIcon, badge: null, link: "/" },
    { id: "profile", label: "Profile", Icon: ProfileIcon, badge: null, link: "/profile" },
    
];

const BottomNavBar = ({ onExclusiveOpen, catOpen }) => {
    const [active, setActive] = useState("home");

    const navigate = useNavigate();

    const handlePress = (id, link) => {
        setActive(id);
        if (id === "exclusive") {
            navigate("/exclusiveproducts");
        } else {
            navigate(link);
        }
    };

    const isExclusiveActive = active === "exclusive" && catOpen;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">

            {/* SVG Background */}
            <svg
                className="absolute bottom-0 left-0 right-0 w-full"
                style={{ height: "70px" }}
                viewBox="0 0 390 70"
                preserveAspectRatio="none"
            >
                <defs>
                    <filter id="nav-shadow" x="-5%" y="-40%" width="110%" height="200%">
                        <feDropShadow dx="0" dy="-3" stdDeviation="6" floodColor="#0C0C0C" floodOpacity="0.12" />
                    </filter>
                    <linearGradient id="nav-bg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FEFCF8" />
                        <stop offset="100%" stopColor="#F5F0E8" />
                    </linearGradient>
                </defs>

                <path
                    d="M0,16 Q0,0 16,0 L140,0 Q165,0 175,22 Q185,40 195,40 Q205,40 215,22 Q225,0 250,0 L374,0 Q390,0 390,16 L390,70 L0,70 Z"
                    fill="url(#nav-bg)"
                    filter="url(#nav-shadow)"
                />
            </svg>

            {/* NAV ITEMS */}
            <div className="relative flex items-end justify-around px-2 h-[70px]">

                {/* LEFT TABS */}
                {SIDE_TABS.slice(0, 2).map(({ id, label, Icon, link }) => {
                    const isActive = active === id;
                    return (
                        <button
                            key={id}
                            onClick={() => handlePress(id, link)}
                            className="flex flex-col items-center justify-end flex-1 pb-2 text-xs"
                        >
                            <Icon
                                className="w-5 h-5"
                                style={{ color: isActive ? "#C9A96E" : "#8A8070" }}
                            />
                            <span
                                style={{ color: isActive ? "#C9A96E" : "#8A8070" }}
                            >
                                {label}
                            </span>
                        </button>
                    );
                })}

                {/* 🔥 CENTER EXCLUSIVE BUTTON */}
                <div className="relative flex flex-col items-center -mt-8">

                    <button
                        onClick={() => handlePress("exclusive", "/exclusive")}
                        className="flex items-center justify-center transition-all duration-300 active:scale-95"
                        style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%", // ✅ PERFECT CIRCLE
                            background: isExclusiveActive
                                ? "linear-gradient(145deg,#1a1812 0%,#0C0C0C 100%)"
                                : "linear-gradient(145deg,#C9A96E 0%,#a8843f 100%)",
                            boxShadow: isExclusiveActive
                                ? "0 6px 25px rgba(12,12,12,0.6), 0 0 0 2px #C9A96E"
                                : "0 10px 30px rgba(201,169,110,0.7), 0 0 0 4px rgba(201,169,110,0.15)",
                            border: "2px solid rgba(255,255,255,0.4)",
                        }}
                    >
                        <GemIcon
                            className="w-6 h-6"
                            style={{ color: isExclusiveActive ? "#C9A96E" : "#fff" }}
                        />
                    </button>

                    <span
                        className="text-[10px] font-bold mt-1"
                        style={{ color: isExclusiveActive ? "#C9A96E" : "#0C0C0C" }}
                    >
                        EXCL.
                    </span>
                </div>

                {/* RIGHT TABS */}
                {SIDE_TABS.slice(2).map(({ id, label, Icon, link }) => {
                    const isActive = active === id;
                    return (
                        <button
                            key={id}
                            onClick={() => handlePress(id, link)}
                            className="flex flex-col items-center justify-end flex-1 pb-2 text-xs"
                        >
                            <Icon
                                className="w-5 h-5"
                                style={{ color: isActive ? "#C9A96E" : "#8A8070" }}
                            />
                            <span
                                style={{ color: isActive ? "#C9A96E" : "#8A8070" }}
                            >
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar() {
    const [notifVisible, setNotifVisible] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const cartCount = 3;

    const navigate = useNavigate();

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 4);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <>
            {/* ── STICKY TOP HEADER ──────────────────────────────────────────────── */}
            <header className="sticky top-0 z-30">

                {/* Notification scroller */}
                {notifVisible && <NotifBanner onClose={() => setNotifVisible(false)} />}

                {/* Main header bar */}
                <div className="transition-shadow duration-200"
                    style={{
                        background: "#FFFFFF",
                        borderBottom: scrolled ? "none" : "1px solid #EDE7D9",
                        boxShadow: scrolled ? "0 4px 24px rgba(12,12,12,0.09)" : "0 1px 4px rgba(12,12,12,0.04)"
                    }}>

                    {/* ROW 1 — Logo · Location · Nav · Search · Icons */}
                    <div className="flex items-center gap-2 md:gap-3 lg:gap-4 px-3 md:px-5 lg:px-8 h-14 md:h-16">


                        <div onClick={() => navigate('/')}>
                            <img src="/logo2.png" className="h-12 w-12" />
                        </div>

                        <div className="md:hidden px-3 pb-2.5 flex items-center gap-2">
                            <div className="flex-shrink-0"><LocationSelector compact /></div>
                        </div>

                        {/* Location md+ */}
                        <div className="hidden md:flex items-center justify-center flex-shrink-0 pl-3 ml-1"
                            style={{ borderLeft: "1px solid #EDE7D9" }}>
                            <LocationSelector />
                        </div>

                        <div className="hidden lg:block h-8 w-px mx-1 flex-shrink-0" style={{ background: "#EDE7D9" }} />

                        <DesktopNav />

                        {/* Search sm+ */}
                        <div className="hidden sm:block flex-1 min-w-0 mx-1 md:mx-2">
                            <SearchBar />
                        </div>

                        {/* Right icons */}
                        <div className="flex items-center gap-0.5 ml-auto sm:ml-0">
                            <button className="sm:hidden p-2 rounded-full transition-colors hover:bg-[#F5F0E8]"
                                style={{ color: "#3a3530" }} aria-label="Search">
                                <SearchIcon />
                            </button>
                            <CartBtn count={cartCount} />
                            <button onClick={()=>navigate('/profile')} className="hidden lg:flex p-2 rounded-full transition-colors hover:bg-[#F5F0E8]"
                                style={{ color: "#3a3530" }} aria-label="Profile">
                                <ProfileIcon />
                            </button>
                        </div>
                    </div>

                    {/* ROW 2 tablet md–lg — scrollable nav pills */}
                    <div className="hidden md:flex lg:hidden items-center gap-1.5 px-5 pb-2.5 overflow-x-auto"
                        style={{ scrollbarWidth: "none" }}>
                        {NAV_LINKS.map(link => (
                            <button key={link.label}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
                                style={{
                                    border: `1.5px solid ${link.red ? "#fca5a5" : "#EDE7D9"}`,
                                    background: link.red ? "#fff5f5" : "#F5F0E8",
                                    color: link.red ? "#c0392b" : "#3a3530"
                                }}>
                                <span>{link.emoji}</span>{link.label}
                            </button>
                        ))}
                    </div>

                </div>
            </header>


            {/* ── BOTTOM NAV BAR ─────────────────────────────────────────────────── */}
            <BottomNavBar
                catOpen={catOpen}
                onExclusiveOpen={() => setCatOpen(o => !o)}
            />

            {/*
        USAGE NOTE:
        Wrap your page body with:
          <main className="pb-20 lg:pb-0"> ... </main>
        so content isn't hidden behind the bottom bar on mobile/tablet.
      */}
        </>
    );
}