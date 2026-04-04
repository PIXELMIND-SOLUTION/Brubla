import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaDownload, FaQuestionCircle, FaAndroid, FaApple } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// ─────────────────────────────────────────────────────────────────────────────
// COLOR THEME
// ─────────────────────────────────────────────────────────────────────────────
// Primary brown:  #6F4E37
// White:          #fff
// Black:          #000
// Soft bg:        #f9f5f0
// Border:         rgba(111,78,55,0.15)
// Muted text:     #7a6a5a

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
const PinIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></Ic>;
const GpsIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></Ic>;
const ArrowLeftIcon = ({ c }) => <Ic className={c || "w-5 h-5"} d="M19 12H5M12 19l-7-7 7-7" />;
const TrendingIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></Ic>;
const ClockIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Ic>;
const MenuIcon = ({ c }) => <Ic className={c || "w-5 h-5"} d="M4 6h16M4 12h16M4 18h16" />;
const HomeIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></Ic>;
const HeartIcon = ({ c }) => (
    <Ic className={c || "w-5 h-5"}>
        <path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z" />
    </Ic>
);
const ScissorsIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" /></Ic>;
const BrushIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L3 14.67l.06.06a4 4 0 005.6 5.6l.06.06 10.06-10.06a5.5 5.5 0 000-7.78z" /><path d="M7.5 21a2.5 2.5 0 01-3-3" /></Ic>;
const GemIcon = ({ c }) => (
    <Ic className={c || "w-6 h-6"} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3h12l4 6-10 13L2 9z" />
        <path d="M2 9h20M6 3l4 6m4 0l4-6m-8 0v6" />
    </Ic>
);
const TagIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></Ic>;
const SparkleIcon = ({ c }) => <Ic className={c || "w-4 h-4"} fill="currentColor" sw={0} d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />;

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING JOIN US BUTTON — bottom-right, fixed
// ─────────────────────────────────────────────────────────────────────────────
const FloatingJoinBtn = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const [pulse, setPulse] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setPulse(false), 4000);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-2">
            {/* Tooltip label — shown on hover */}
            <div
                className="text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-all duration-200 whitespace-nowrap"
                style={{
                    background: "#000",
                    color: "#6F4E37",
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? "translateY(0) scale(1)" : "translateY(6px) scale(0.95)",
                    pointerEvents: "none",
                    letterSpacing: "0.06em",
                }}
            >
                ✦ Become a Partner
            </div>

            {/* Main button */}
            <button
                onClick={() => navigate("/joinUs")}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                aria-label="Join us"
                className="relative flex items-center gap-2 rounded-full font-bold text-sm shadow-2xl transition-all duration-300 active:scale-95"
                style={{
                    background: hovered
                        ? "linear-gradient(135deg, #000 0%, #1a1a1a 100%)"
                        : "linear-gradient(135deg, #6F4E37 0%, #8B6347 50%, #6F4E37 100%)",
                    color: hovered ? "#6F4E37" : "#fff",
                    padding: "12px 20px",
                    boxShadow: hovered
                        ? "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2)"
                        : "0 6px 24px rgba(111,78,55,0.45), 0 2px 8px rgba(0,0,0,0.12)",
                    letterSpacing: "0.06em",
                    minHeight: "48px",
                    justifyContent: "center",
                    border: hovered ? "1.5px solid rgba(111,78,55,0.4)" : "1.5px solid transparent",
                }}
            >
                {/* Pulse ring */}
                {pulse && (
                    <span
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{
                            background: "rgba(111,78,55,0.35)",
                            animationDuration: "1.4s",
                        }}
                    />
                )}

                <SparkleIcon c="w-3.5 h-3.5 flex-shrink-0" />

                <span className="whitespace-nowrap text-[13px] tracking-wide">
                    Join Us
                </span>

                <span
                    className="transition-all duration-300 overflow-hidden flex-shrink-0"
                    style={{
                        maxWidth: hovered ? "20px" : "0px",
                        opacity: hovered ? 1 : 0,
                    }}
                >
                    →
                </span>
            </button>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────────────────────────────────────
const BrublaLogo = () => (
    <div className="flex items-center gap-2 select-none">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ background: "linear-gradient(145deg,#1a1a1a 0%,#000 100%)", border: "1px solid rgba(111,78,55,0.25)", boxShadow: "0 2px 12px rgba(111,78,55,0.15)" }}>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-4 h-3 rounded-full rounded-b-none relative" style={{ background: "#6F4E37" }}>
                    <div className="absolute -right-1.5 top-0.5 w-1.5 h-2 rounded-full rotate-12" style={{ background: "#6F4E37" }} />
                </div>
                <div className="w-3 h-1.5 rounded-b-full" style={{ background: "#6F4E37" }} />
            </div>
        </div>
        <div className="flex flex-col leading-none">
            <span className="text-[13px] font-black tracking-[0.18em] uppercase" style={{ color: "#000" }}>BRU</span>
            <span className="text-[13px] font-black tracking-[0.18em] uppercase -mt-[2px]" style={{ color: "#6F4E37" }}>BLA</span>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION BANNER
// ─────────────────────────────────────────────────────────────────────────────
const NOTIFS = [
    "✦  BRUBLA SOS Sale is Live Now  ·  BUY 1 GET 1 on all styles",
    "✦  Free delivery on orders above ₹499  ·  Code: FREESHIP",
    "✦  Flash Deal: Extra 20% off on Kurtas  ·  Limited time",
    "✦  New Arrivals: Summer 2025 Collection — Shop Now",
];

const NotifBanner = ({ onClose }) => {
    const [idx, setIdx] = useState(0);
    const [fade, setFade] = useState(false);
    const [showDownload, setShowDownload] = useState(false);

    useEffect(() => {
        const t = setInterval(() => {
            setFade(true);
            setTimeout(() => {
                setIdx((i) => (i + 1) % NOTIFS.length);
                setFade(false);
            }, 280);
        }, 4000);
        return () => clearInterval(t);
    }, []);

    return (
        <>
            <div
                className="h-10 flex items-center justify-between px-3 md:px-6 relative overflow-hidden"
                style={{ background: "#000" }}
            >
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "#000" }} />
                <div className="flex-1 overflow-hidden">
                    <p className={`text-[11px] md:text-xs font-semibold tracking-[0.12em] whitespace-nowrap transition-all duration-300 ${fade ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"}`}
                        style={{ color: "#fff" }}>
                        {NOTIFS[idx]}
                    </p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 ml-2 md:ml-3">
                    <button onClick={() => setShowDownload(true)}
                        className="flex items-center justify-center gap-1 md:gap-2 text-[11px] md:text-xs font-medium hover:opacity-80"
                        style={{ color: "#fff" }}>
                        <FaDownload className="text-sm md:text-base" />
                        <span className="hidden md:inline">Download App</span>
                    </button>
                    <button className="flex items-center justify-center gap-1 md:gap-2 text-[11px] md:text-xs font-medium hover:opacity-80"
                        style={{ color: "#fff" }}>
                        <FaQuestionCircle className="text-sm md:text-base" />
                        <span className="hidden md:inline">Help</span>
                    </button>
                    <button onClick={onClose} className="opacity-40 hover:opacity-80 transition" style={{ color: "#fff" }}>
                        <IoClose className="w-4 h-4" />
                    </button>
                </div>
            </div>
            {showDownload && <DownloadModal onClose={() => setShowDownload(false)} />}
        </>
    );
};

const DownloadModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-center mb-5 text-gray-800">Download App</h2>
            <div className="space-y-4">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-100 hover:bg-green-200 transition">
                    <FaAndroid className="text-2xl text-green-700" />
                    <div className="text-left">
                        <p className="font-semibold text-gray-800">Android</p>
                        <p className="text-xs text-gray-500">Download APK</p>
                    </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
                    <FaApple className="text-2xl text-black" />
                    <div className="text-left">
                        <p className="font-semibold text-gray-800">iOS</p>
                        <p className="text-xs text-gray-500">App Store</p>
                    </div>
                </button>
            </div>
            <button onClick={onClose} className="mt-5 w-full py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH OVERLAY
// ─────────────────────────────────────────────────────────────────────────────
const TRENDING = ["Kurta Sets", "Oversized Tees", "Co-ord Sets", "Palazzo Pants", "Linen Shirts"];
const RECENT = ["Blue Denim Jacket", "Floral Midi Dress", "Men's Chinos"];
const SUGGESTIONS = [
    { label: "Women's Kurtas", tag: "2,340 styles" },
    { label: "Men's Shirts", tag: "1,890 styles" },
    { label: "Kids Ethnic Wear", tag: "640 styles" },
    { label: "Summer Dresses", tag: "980 styles" },
    { label: "Formal Trousers", tag: "760 styles" },
];

const SearchOverlay = ({ open, onClose }) => {
    const [q, setQ] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 80);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setQ("");
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        const fn = e => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", fn);
        return () => document.removeEventListener("keydown", fn);
    }, [onClose]);

    const filtered = q.length > 0
        ? SUGGESTIONS.filter(s => s.label.toLowerCase().includes(q.toLowerCase()))
        : [];

    return (
        <>
            <div onClick={onClose}
                className="fixed inset-0 z-[500] transition-all duration-300"
                style={{
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: open ? "blur(4px)" : "blur(0px)",
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                }} />

            <div className="fixed left-0 right-0 top-0 z-[600] transition-transform duration-300 ease-out"
                style={{
                    transform: open ? "translateY(0)" : "translateY(-100%)",
                    background: "#fff",
                    borderBottom: "1px solid rgba(111,78,55,0.15)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                }}>
                <div className="flex items-center gap-3 px-4 md:px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(111,78,55,0.12)" }}>
                    <button onClick={onClose}
                        className="flex-shrink-0 p-1.5 rounded-full transition-colors hover:bg-[#f9f5f0]"
                        style={{ color: "#333" }} aria-label="Close search">
                        <ArrowLeftIcon c="w-5 h-5" />
                    </button>
                    <div className="flex-1 flex items-center gap-2.5 rounded-full px-4 py-2.5"
                        style={{ background: "#f9f5f0", border: "1.5px solid #6F4E37", boxShadow: "0 0 0 3px rgba(111,78,55,0.08)" }}>
                        <SearchIcon c="w-4 h-4 flex-shrink-0 opacity-50" />
                        <input ref={inputRef} type="text"
                            placeholder="Search products, brands, categories…"
                            value={q} onChange={e => setQ(e.target.value)}
                            className="bg-transparent text-sm outline-none flex-1 min-w-0 placeholder:opacity-40"
                            style={{ color: "#000", caretColor: "#6F4E37" }} />
                        {q && (
                            <button onClick={() => setQ("")} className="flex-shrink-0 opacity-50 hover:opacity-90 transition-opacity">
                                <CloseIcon c="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="px-4 md:px-6 pb-6 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    {q.length > 0 && (
                        <div className="pt-4">
                            {filtered.length > 0 ? (
                                <>
                                    <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: "#7a6a5a" }}>Suggestions</p>
                                    {filtered.map(s => (
                                        <button key={s.label}
                                            className="w-full flex items-center justify-between py-2.5 px-1 rounded-xl transition-colors hover:bg-[#f9f5f0] group"
                                            onClick={onClose}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#f9f5f0" }}>
                                                    <SearchIcon c="w-3.5 h-3.5 opacity-50" />
                                                </div>
                                                <span className="text-sm font-medium" style={{ color: "#000" }}>{s.label}</span>
                                            </div>
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#f9f5f0", color: "#7a6a5a" }}>{s.tag}</span>
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <SearchIcon c="w-10 h-10 opacity-20" />
                                    <p className="text-sm font-medium" style={{ color: "#7a6a5a" }}>No results for "<span style={{ color: "#000" }}>{q}</span>"</p>
                                    <p className="text-xs" style={{ color: "#7a6a5a" }}>Try searching for something else</p>
                                </div>
                            )}
                        </div>
                    )}

                    {q.length === 0 && (
                        <>
                            {RECENT.length > 0 && (
                                <div className="pt-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#7a6a5a" }}>Recent</p>
                                        <button className="text-[10px] font-semibold" style={{ color: "#6F4E37" }}>Clear all</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {RECENT.map(r => (
                                            <button key={r}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:bg-[#f0ebe4]"
                                                style={{ background: "#f9f5f0", color: "#333", border: "1px solid rgba(111,78,55,0.15)" }}
                                                onClick={onClose}>
                                                <ClockIcon c="w-3 h-3 opacity-40" />
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-5">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <TrendingIcon c="w-3.5 h-3.5" />
                                    <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#7a6a5a" }}>Trending Now</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {TRENDING.map((t, i) => (
                                        <button key={t}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
                                            style={{
                                                background: i === 0 ? "linear-gradient(135deg,#000,#1a1a1a)" : "#f9f5f0",
                                                color: i === 0 ? "#6F4E37" : "#333",
                                                border: i === 0 ? "none" : "1px solid rgba(111,78,55,0.15)",
                                            }}
                                            onClick={onClose}>
                                            {i === 0 && <ZapIcon c="w-2.5 h-2.5" />}
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-5">
                                <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: "#7a6a5a" }}>Popular Categories</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {SUGGESTIONS.slice(0, 4).map(s => (
                                        <button key={s.label}
                                            className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors hover:bg-[#f0ebe4] text-left"
                                            style={{ background: "#f9f5f0", border: "1px solid rgba(111,78,55,0.12)" }}
                                            onClick={onClose}>
                                            <span className="text-xs font-semibold" style={{ color: "#000" }}>{s.label}</span>
                                            <span className="text-[9px] font-medium" style={{ color: "#7a6a5a" }}>{s.tag}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
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

const LocationSelector = () => {
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
            <button onClick={() => setOpen(o => !o)}
                className="relative p-2 rounded-full transition-colors hover:bg-[#f9f5f0]"
                style={{ color: open ? "#6F4E37" : "#000" }}
                aria-label="Change location">
                <PinIcon c="w-5 h-5" />
                <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#6F4E37" }} />
            </button>

            {open && (
                <div className="absolute top-full right-0 mt-2 w-60 rounded-2xl shadow-2xl z-[200] overflow-hidden"
                    style={{ background: "#fff", border: "1px solid rgba(111,78,55,0.15)" }}>
                    <div className="px-4 pt-3 pb-2 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(111,78,55,0.12)" }}>
                        <span style={{ color: "#6F4E37" }}><ZapIcon c="w-3 h-3" /></span>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#7a6a5a" }}>Delivering to</span>
                            <span className="text-xs font-bold" style={{ color: "#6F4E37" }}>
                                {sel === -1 ? (gpsLabel || "Current Location") : `${loc.city} — ${loc.pin}`}
                            </span>
                        </div>
                    </div>

                    <button onClick={handleGps}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#f9f5f0]"
                        style={{ borderBottom: "1px solid rgba(111,78,55,0.1)" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#6F4E37,#4a3520)" }}>
                            {gpsLoading
                                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : <GpsIcon c="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-bold" style={{ color: "#000" }}>Use Current Location</span>
                            <span className="text-[10px]" style={{ color: "#7a6a5a" }}>Detect via GPS</span>
                        </div>
                        {sel === -1 && <span className="ml-auto" style={{ color: "#6F4E37" }}><CheckIcon /></span>}
                    </button>

                    <div className="px-4 pt-2.5 pb-1">
                        <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#7a6a5a" }}>Select City</p>
                    </div>

                    {CITIES.map((l, i) => (
                        <button key={l.pin} onClick={() => { setSel(i); setOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors ${i === sel ? "" : "hover:bg-[#f9f5f0]"}`}
                            style={{ background: i === sel ? "#f9f5f0" : "transparent" }}>
                            <span style={{ color: "#6F4E37" }}><PinIcon c="w-3.5 h-3.5" /></span>
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-semibold" style={{ color: i === sel ? "#6F4E37" : "#000" }}>{l.city}</span>
                                <span className="text-[10px]" style={{ color: "#7a6a5a" }}>{l.pin}</span>
                            </div>
                            {i === sel && <span className="ml-auto" style={{ color: "#6F4E37" }}><CheckIcon /></span>}
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
const SearchBar = ({ className = "", placeholder = "Search products, brands…", onOpen }) => (
    <div className={`relative ${className}`}>
        <button onClick={onOpen}
            className="w-full flex items-center gap-2 rounded-full px-3.5 py-2 text-left transition-all duration-200"
            style={{ background: "#f9f5f0", border: "1.5px solid rgba(111,78,55,0.18)" }}>
            <SearchIcon c="w-4 h-4 flex-shrink-0 opacity-50" />
            <span className="text-xs flex-1 min-w-0 truncate" style={{ color: "#7a6a5a" }}>{placeholder}</span>
        </button>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// NAV DATA
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
    { label: "Men", emoji: "👔", sub: ["Shirts", "T-Shirts", "Jeans", "Trousers", "Jackets"] },
    { label: "Women", emoji: "👗", sub: ["Kurtas", "Tops", "Dresses", "Sarees", "Leggings"] },
    { label: "Kids", emoji: "🧒", sub: ["Boys", "Girls", "Infants", "School Wear"] },
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
                            color: link.red ? "#6F4E37" : hover === link.label ? "#fff" : "#333",
                            background: link.red ? "transparent" : hover === link.label ? "#000" : "transparent",
                        }}>
                        {link.label}
                        <ChevDown c={`w-3 h-3 transition-transform duration-200 ${hover === link.label ? "rotate-180" : ""}`} />
                    </button>
                    {hover === link.label && (
                        <div className="absolute top-full left-0 mt-1 rounded-2xl shadow-2xl z-[100] w-44 py-2 overflow-hidden"
                            style={{ background: "#fff", border: "1px solid rgba(111,78,55,0.15)" }}>
                            {link.sub.map(s => (
                                <button key={s} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-left transition-colors hover:bg-[#f9f5f0]"
                                    style={{ color: "#333" }}>
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
    <button className="relative p-2 rounded-full transition-colors hover:bg-[#f9f5f0]" style={{ color: "#333" }} aria-label="Cart">
        <CartIcon />
        {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm"
                style={{ background: "#000", color: "#fff" }}>
                {count}
            </span>
        )}
    </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const SIDEBAR_LINKS = [
    { id: "home", label: "Home", Icon: HomeIcon, link: "/" },
    { id: "tailor", label: "Tailor", Icon: ScissorsIcon, link: "/" },
    { id: "exclusive", label: "Exclusive", Icon: GemIcon, link: "/exclusiveproducts", special: true },
    { id: "stylist", label: "AI Stylist", Icon: BrushIcon, link: "/" },
    { id: "wishlist", label: "Wishlist", Icon: HeartIcon, link: "/" },
    { id: "profile", label: "Profile", Icon: ProfileIcon, link: "/profile" },
];

const Sidebar = ({ open, onClose, navigate }) => {
    const [activeId, setActiveId] = useState("home");
    const [expandedNav, setExpandedNav] = useState(null);

    useEffect(() => {
        const fn = e => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", fn);
        return () => document.removeEventListener("keydown", fn);
    }, [onClose]);

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const handleNav = (id, link) => {
        setActiveId(id);
        navigate(link);
        onClose();
    };

    const toggleExpand = (label) => {
        setExpandedNav(prev => prev === label ? null : label);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="lg:hidden fixed inset-0 z-[300] transition-all duration-300"
                style={{
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(3px)",
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                }}
            />

            {/* Sidebar panel */}
            <aside
                className="fixed top-0 left-0 h-full z-[400] flex flex-col transition-transform duration-300 ease-out"
                style={{
                    width: "288px",
                    transform: open ? "translateX(0)" : "translateX(-100%)",
                    background: "#fff",
                    borderRight: "1px solid rgba(111,78,55,0.15)",
                    boxShadow: open ? "8px 0 40px rgba(0,0,0,0.15)" : "none",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(111,78,55,0.12)" }}>
                    <div onClick={() => { navigate("/"); onClose(); }} className="cursor-pointer">
                        <img src="/logo2.png" className="h-10 w-10" alt="logo" onError={e => { e.target.style.display = "none"; }} />
                    </div>
                    <button onClick={onClose}
                        className="p-2 rounded-full transition-colors hover:bg-[#f9f5f0]"
                        style={{ color: "#333" }} aria-label="Close menu">
                        <CloseIcon c="w-5 h-5" />
                    </button>
                </div>

                {/* Nav quick links */}
                <div className="px-3 py-3" style={{ borderBottom: "1px solid rgba(111,78,55,0.1)" }}>
                    <p className="text-[9px] font-black uppercase tracking-widest px-2 mb-2" style={{ color: "#7a6a5a" }}>Categories</p>
                    {NAV_LINKS.map(link => (
                        <div key={link.label}>
                            <button
                                onClick={() => toggleExpand(link.label)}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors hover:bg-[#f9f5f0]"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-base">{link.emoji}</span>
                                    <span className="text-sm font-semibold" style={{ color: link.red ? "#6F4E37" : "#000" }}>{link.label}</span>
                                </div>
                                <ChevDown c={`w-3.5 h-3.5 transition-transform duration-200 ${expandedNav === link.label ? "rotate-180" : ""}`} />
                            </button>
                            {expandedNav === link.label && (
                                <div className="ml-9 mb-1">
                                    {link.sub.map(s => (
                                        <button key={s} onClick={onClose}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left rounded-lg transition-colors hover:bg-[#f9f5f0]"
                                            style={{ color: "#333" }}>
                                            <ChevRight c="w-3 h-3 opacity-30" />{s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Main nav items */}
                <div className="flex-1 overflow-y-auto px-3 py-3" style={{ scrollbarWidth: "none" }}>
                    <p className="text-[9px] font-black uppercase tracking-widest px-2 mb-2" style={{ color: "#7a6a5a" }}>Menu</p>
                    {SIDEBAR_LINKS.map(({ id, label, Icon, link, special }) => {
                        const isActive = activeId === id;
                        return (
                            <button key={id}
                                onClick={() => handleNav(id, link)}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 mb-0.5"
                                style={{
                                    background: isActive
                                        ? special ? "linear-gradient(135deg,#6F4E37,#4a3520)" : "#000"
                                        : "transparent",
                                    color: isActive ? "#fff" : "#333",
                                }}>
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                                    style={{
                                        background: isActive
                                            ? "rgba(255,255,255,0.12)"
                                            : special ? "rgba(111,78,55,0.1)" : "#f9f5f0",
                                    }}>
                                    <Icon c="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold">{label}</span>
                                {special && !isActive && (
                                    <span className="ml-auto text-[9px] font-black px-2 py-0.5 rounded-full"
                                        style={{ background: "linear-gradient(135deg,#6F4E37,#8B6347)", color: "#fff" }}>
                                        NEW
                                    </span>
                                )}
                                {isActive && <ChevRight c="w-4 h-4 ml-auto opacity-60" />}
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(111,78,55,0.12)" }}>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f9f5f0" }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#000,#1a1a1a)", border: "1px solid rgba(111,78,55,0.25)" }}>
                            <ProfileIcon c="w-4 h-4" style={{ color: "#6F4E37" }} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold truncate" style={{ color: "#000" }}>My Account</span>
                            <span className="text-[10px]" style={{ color: "#7a6a5a" }}>Sign in for best experience</span>
                        </div>
                        <ChevRight c="w-4 h-4 ml-auto flex-shrink-0 opacity-40" />
                    </div>
                </div>
            </aside>
        </>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar() {
    const [notifVisible, setNotifVisible] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const cartCount = 3;

    const navigate = useNavigate();

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 4);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const openSearch = useCallback(() => setSearchOpen(true), []);
    const closeSearch = useCallback(() => setSearchOpen(false), []);
    const openSidebar = useCallback(() => setSidebarOpen(true), []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    return (
        <>
            {/* ── SEARCH OVERLAY ─────────────────────────────────────────────────── */}
            <SearchOverlay open={searchOpen} onClose={closeSearch} />

            {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
            <Sidebar open={sidebarOpen} onClose={closeSidebar} navigate={navigate} />

            {/* ── FLOATING JOIN US BUTTON ────────────────────────────────────────── */}
            <FloatingJoinBtn />

            {/* ── STICKY TOP HEADER ──────────────────────────────────────────────── */}
            <header className="sticky top-0 z-30">

                {/* Notification scroller */}
                {notifVisible && <NotifBanner onClose={() => setNotifVisible(false)} />}

                {/* Main header bar */}
                <div className="transition-shadow duration-200"
                    style={{
                        background: "#fff",
                        borderBottom: scrolled ? "none" : "1px solid rgba(111,78,55,0.12)",
                        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.04)"
                    }}>

                    {/* ROW 1 — Hamburger · Logo · Nav · Search · Icons */}
                    <div className="flex items-center gap-2 md:gap-3 lg:gap-4 px-3 md:px-5 lg:px-8 h-14 md:h-16">

                        {/* Hamburger */}
                        <button
                            onClick={openSidebar}
                            className="lg:hidden p-2 rounded-full transition-colors hover:bg-[#f9f5f0] flex-shrink-0"
                            style={{ color: "#333" }}
                            aria-label="Open menu"
                        >
                            <MenuIcon c="w-5 h-5" />
                        </button>

                        {/* Logo */}
                        <div onClick={() => navigate('/')} className="cursor-pointer flex-shrink-0">
                            <img src="/logo2.png" className="h-12 w-12" alt="logo"
                                onError={e => { e.target.style.display = "none"; }} />
                        </div>

                        <div className="hidden lg:block h-8 w-px mx-1 flex-shrink-0" style={{ background: "rgba(111,78,55,0.15)" }} />

                        <DesktopNav />

                        {/* Search bar */}
                        <div className="hidden sm:block flex-1 min-w-0 mx-1 md:mx-2">
                            <SearchBar onOpen={openSearch} />
                        </div>

                        {/* Right icons */}
                        <div className="flex items-center gap-0.5 ml-auto sm:ml-0">
                            {/* Search icon — mobile only */}
                            <button
                                onClick={openSearch}
                                className="sm:hidden p-2 rounded-full transition-colors hover:bg-[#f9f5f0]"
                                style={{ color: "#333" }}
                                aria-label="Search"
                            >
                                <SearchIcon />
                            </button>

                            {/* Cart */}
                            <CartBtn count={cartCount} />

                            {/* Location */}
                            <LocationSelector />

                            {/* Profile — desktop only */}
                            <button onClick={() => navigate('/profile')}
                                className="hidden lg:flex p-2 rounded-full transition-colors hover:bg-[#f9f5f0]"
                                style={{ color: "#333" }} aria-label="Profile">
                                <ProfileIcon />
                            </button>
                        </div>
                    </div>

                    {/* ROW 2 — tablet scrollable nav pills */}
                    <div className="hidden md:flex lg:hidden items-center gap-1.5 px-5 pb-2.5 overflow-x-auto"
                        style={{ scrollbarWidth: "none" }}>
                        {NAV_LINKS.map(link => (
                            <button key={link.label}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
                                style={{
                                    border: `1.5px solid ${link.red ? "#6F4E37" : "rgba(111,78,55,0.18)"}`,
                                    background: link.red ? "#6F4E37" : "#f9f5f0",
                                    color: link.red ? "#fff" : "#000"
                                }}>
                                <span>{link.emoji}</span>{link.label}
                            </button>
                        ))}
                    </div>

                </div>
            </header>
        </>
    );
}