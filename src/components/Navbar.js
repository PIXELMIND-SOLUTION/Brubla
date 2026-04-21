import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaDownload, FaQuestionCircle, FaAndroid, FaApple } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// ─────────────────────────────────────────────────────────────────────────────
// ICON PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const Ic = ({ children, className = "w-5 h-5", strokeWidth = 1.8 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={strokeWidth} className={className}
        strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

export const SearchIcon = ({ c }) => (
    <Ic className={c}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Ic>
);
export const CartIcon = ({ c }) => (
    <Ic className={c}><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /><path d="M3 3h2l2.4 12.5a2 2 0 002 1.5h7.6a2 2 0 002-1.5L21 7H6" /></Ic>
);
export const ProfileIcon = ({ c }) => (
    <Ic className={c}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></Ic>
);
export const CloseIcon = ({ c }) => (
    <Ic className={c}><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></Ic>
);
export const ChevDown = ({ c }) => (
    <Ic className={c}><polyline points="6 9 12 15 18 9" /></Ic>
);
export const ChevRight = ({ c }) => (
    <Ic className={c}><polyline points="9 6 15 12 9 18" /></Ic>
);
export const ArrowLeftIcon = ({ c }) => (
    <Ic className={c}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Ic>
);
export const CheckIcon = ({ c }) => (
    <Ic className={c}><polyline points="5 13 9 17 19 7" /></Ic>
);
export const TrendingIcon = ({ c }) => (
    <Ic className={c}><polyline points="3 17 9 11 13 15 21 7" /><polyline points="21 7 21 13 15 13" /></Ic>
);
export const ClockIcon = ({ c }) => (
    <Ic className={c}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 16 14" /></Ic>
);
export const MenuIcon = ({ c }) => (
    <Ic className={c}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></Ic>
);
export const HomeIcon = ({ c }) => (
    <Ic className={c}><path d="M3 10.5l9-7 9 7" /><path d="M5 10v10h5v-6h4v6h5V10" /></Ic>
);
export const HeartIcon = ({ c }) => (
    <Ic className={c}><path d="M20.8 7.6a5.5 5.5 0 00-7.8 0L12 8.6l-1-1a5.5 5.5 0 10-7.8 7.8L12 21l8.8-5.6a5.5 5.5 0 000-7.8z" /></Ic>
);
export const ScissorsIcon = ({ c }) => (
    <Ic className={c}><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><line x1="20" y1="4" x2="8.5" y2="15.5" /><line x1="14" y1="14" x2="20" y2="20" /></Ic>
);
export const BrushIcon = ({ c }) => (
    <Ic className={c}><path d="M20 4L4 20" /><path d="M14 6l4 4" /><path d="M7 21a3 3 0 01-3-3" /></Ic>
);
export const GemIcon = ({ c }) => (
    <Ic className={c}><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M2 9h20" /></Ic>
);
export const SparkleIcon = ({ c }) => (
    <Ic className={c}><path d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></Ic>
);
export const PinIcon = ({ c }) => (
    <Ic className={c}><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2" /></Ic>
);
export const GpsIcon = ({ c }) => (
    <Ic className={c}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="9" /></Ic>
);
export const ZapIcon = ({ c }) => (
    <Ic className={c}><path d="M13 2L3 14h7l-1 8 10-12h-7z" /></Ic>
);
export const TagIcon = ({ c }) => (
    <Ic className={c}><path d="M20 13l-7 7-10-10V3h7l10 10z" /><circle cx="7.5" cy="7.5" r="1.5" /></Ic>
);

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING JOIN US BUTTON
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
            <div className="text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-all duration-200 whitespace-nowrap"
                style={{ background: "#000", color: "#6F4E37", opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0) scale(1)" : "translateY(6px) scale(0.95)", pointerEvents: "none", letterSpacing: "0.06em" }}>
                ✦ Become a Partner
            </div>
            <button onClick={() => navigate("/joinUs")} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
                aria-label="Join us"
                className="relative flex items-center gap-2 rounded-full font-bold text-sm shadow-2xl transition-all duration-300 active:scale-95"
                style={{
                    background: hovered ? "linear-gradient(135deg,#000 0%,#1a1a1a 100%)" : "linear-gradient(135deg,#6F4E37 0%,#8B6347 50%,#6F4E37 100%)",
                    color: hovered ? "#6F4E37" : "#fff",
                    padding: "12px 20px",
                    boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.45)" : "0 6px 24px rgba(111,78,55,0.45)",
                    letterSpacing: "0.06em", minHeight: "48px", justifyContent: "center",
                    border: hovered ? "1.5px solid rgba(111,78,55,0.4)" : "1.5px solid transparent",
                }}>
                {pulse && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(111,78,55,0.35)", animationDuration: "1.4s" }} />}
                <SparkleIcon c="w-3.5 h-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap text-[13px] tracking-wide">Join Us</span>
                <span className="transition-all duration-300 overflow-hidden flex-shrink-0" style={{ maxWidth: hovered ? "20px" : "0px", opacity: hovered ? 1 : 0 }}>→</span>
            </button>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION BANNER — always black, no transparent variant
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
            setTimeout(() => { setIdx(i => (i + 1) % NOTIFS.length); setFade(false); }, 280);
        }, 4000);
        return () => clearInterval(t);
    }, []);

    return (
        <>
            {/* Always black — no transparent prop used here */}
            <div
                className="h-10 flex items-center justify-between px-3 md:px-6 relative overflow-hidden"
                style={{ background: "#000" }}
            >
                <div className="flex-1 overflow-hidden">
                    <p
                        className={`text-[11px] md:text-xs font-semibold tracking-[0.12em] whitespace-nowrap transition-all duration-300 ${fade ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"}`}
                        style={{ color: "#fff" }}
                    >
                        {NOTIFS[idx]}
                    </p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 ml-2 md:ml-3">
                    <button
                        onClick={() => setShowDownload(true)}
                        className="flex items-center gap-1 md:gap-2 text-[11px] md:text-xs font-medium hover:opacity-80"
                        style={{ color: "#fff" }}
                    >
                        <FaDownload className="text-sm" />
                        <span className="hidden md:inline">Download App</span>
                    </button>
                    <button
                        className="flex items-center gap-1 md:gap-2 text-[11px] md:text-xs font-medium hover:opacity-80"
                        style={{ color: "#fff" }}
                    >
                        <FaQuestionCircle className="text-sm" />
                        <span className="hidden md:inline">Help</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="opacity-40 hover:opacity-80 transition"
                        style={{ color: "#fff" }}
                    >
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
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-center mb-5 text-gray-800">Download App</h2>
            <div className="space-y-4">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-100 hover:bg-green-200 transition">
                    <FaAndroid className="text-2xl text-green-700" />
                    <div className="text-left"><p className="font-semibold text-gray-800">Android</p><p className="text-xs text-gray-500">Download APK</p></div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
                    <FaApple className="text-2xl text-black" />
                    <div className="text-left"><p className="font-semibold text-gray-800">iOS</p><p className="text-xs text-gray-500">App Store</p></div>
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
        if (open) { setTimeout(() => inputRef.current?.focus(), 80); document.body.style.overflow = "hidden"; }
        else { document.body.style.overflow = ""; setQ(""); }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        const fn = e => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", fn);
        return () => document.removeEventListener("keydown", fn);
    }, [onClose]);

    const filtered = q.length > 0 ? SUGGESTIONS.filter(s => s.label.toLowerCase().includes(q.toLowerCase())) : [];

    return (
        <>
            <div onClick={onClose} className="fixed inset-0 z-[500] transition-all duration-300"
                style={{ background: "rgba(0,0,0,0.55)", backdropFilter: open ? "blur(4px)" : "blur(0px)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }} />
            <div className="fixed left-0 right-0 top-0 z-[600] transition-transform duration-300 ease-out"
                style={{ transform: open ? "translateY(0)" : "translateY(-100%)", background: "#fff", borderBottom: "1px solid rgba(111,78,55,0.15)", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px" }}>
                <div className="flex items-center gap-3 px-4 md:px-6 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(111,78,55,0.12)" }}>
                    <button onClick={onClose} className="flex-shrink-0 p-1.5 rounded-full transition-colors hover:bg-[#f9f5f0]" style={{ color: "#333" }} aria-label="Close search">
                        <ArrowLeftIcon c="w-5 h-5" />
                    </button>
                    <div className="flex-1 flex items-center gap-2.5 rounded-full px-4 py-2.5"
                        style={{ background: "#f9f5f0", border: "1.5px solid #6F4E37", boxShadow: "0 0 0 3px rgba(111,78,55,0.08)" }}>
                        <SearchIcon c="w-4 h-4 flex-shrink-0 opacity-50" />
                        <input ref={inputRef} type="text" placeholder="Search products, brands, categories…"
                            value={q} onChange={e => setQ(e.target.value)}
                            className="bg-transparent text-sm outline-none flex-1 min-w-0 placeholder:opacity-40"
                            style={{ color: "#000", caretColor: "#6F4E37" }} />
                        {q && <button onClick={() => setQ("")} className="flex-shrink-0 opacity-50 hover:opacity-90 transition-opacity"><CloseIcon c="w-4 h-4" /></button>}
                    </div>
                </div>
                <div className="px-4 md:px-6 pb-6 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    {q.length > 0 && (
                        <div className="pt-4">
                            {filtered.length > 0 ? (
                                <>
                                    <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: "#7a6a5a" }}>Suggestions</p>
                                    {filtered.map(s => (
                                        <button key={s.label} className="w-full flex items-center justify-between py-2.5 px-1 rounded-xl transition-colors hover:bg-[#f9f5f0]" onClick={onClose}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#f9f5f0" }}><SearchIcon c="w-3.5 h-3.5 opacity-50" /></div>
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
                                            <button key={r} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:bg-[#f0ebe4]"
                                                style={{ background: "#f9f5f0", color: "#333", border: "1px solid rgba(111,78,55,0.15)" }} onClick={onClose}>
                                                <ClockIcon c="w-3 h-3 opacity-40" />{r}
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
                                        <button key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
                                            style={{ background: i === 0 ? "linear-gradient(135deg,#000,#1a1a1a)" : "#f9f5f0", color: i === 0 ? "#6F4E37" : "#333", border: i === 0 ? "none" : "1px solid rgba(111,78,55,0.15)" }}
                                            onClick={onClose}>
                                            {i === 0 && <ZapIcon c="w-2.5 h-2.5" />}{t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-5">
                                <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: "#7a6a5a" }}>Popular Categories</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {SUGGESTIONS.slice(0, 4).map(s => (
                                        <button key={s.label} className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors hover:bg-[#f0ebe4] text-left"
                                            style={{ background: "#f9f5f0", border: "1px solid rgba(111,78,55,0.12)" }} onClick={onClose}>
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

const LocationSelector = ({ transparent }) => {
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
            pos => { const mock = `${pos.coords.latitude.toFixed(3)}°N, ${pos.coords.longitude.toFixed(3)}°E`; setGpsLbl(mock); setSel(-1); setGps(false); setOpen(false); },
            () => { setGps(false); alert("Please allow location access."); }
        );
    }, []);

    const loc = sel === -1 ? { pin: "GPS", city: gpsLabel || "Current" } : CITIES[sel];
    const iconColor = transparent ? "#fff" : "#333";

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(o => !o)} className="relative p-2 rounded-full transition-colors hover:bg-white/10" style={{ color: iconColor }} aria-label="Change location">
                <PinIcon c="w-5 h-5" />
                <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#6F4E37" }} />
            </button>
            {open && (
                <div className="absolute top-full right-0 mt-2 w-60 rounded-2xl shadow-2xl z-[200] overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(111,78,55,0.15)" }}>
                    <div className="px-4 pt-3 pb-2 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(111,78,55,0.12)" }}>
                        <span style={{ color: "#6F4E37" }}><ZapIcon c="w-3 h-3" /></span>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#7a6a5a" }}>Delivering to</span>
                            <span className="text-xs font-bold" style={{ color: "#6F4E37" }}>{sel === -1 ? (gpsLabel || "Current Location") : `${loc.city} — ${loc.pin}`}</span>
                        </div>
                    </div>
                    <button onClick={handleGps} className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#f9f5f0]" style={{ borderBottom: "1px solid rgba(111,78,55,0.1)" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#6F4E37,#4a3520)" }}>
                            {gpsLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <GpsIcon c="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-bold" style={{ color: "#000" }}>Use Current Location</span>
                            <span className="text-[10px]" style={{ color: "#7a6a5a" }}>Detect via GPS</span>
                        </div>
                        {sel === -1 && <span className="ml-auto" style={{ color: "#010101" }}><CheckIcon /></span>}
                    </button>
                    <div className="px-4 pt-2.5 pb-1"><p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#7a6a5a" }}>Select City</p></div>
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
// COLLECTIONS HOVER PANEL
// ─────────────────────────────────────────────────────────────────────────────
const collectionItems = [
    { title: "Valentine Special", img: "/collection.png" },
    { title: "Caps", img: "/collection.png" },
    { title: "Winter Collection", img: "/collection.png" },
    { title: "Bluorng Racing Club", img: "/collection.png" },
    { title: "Bluorng Basics", img: "/collection.png" },
    { title: "Yacht Collection", img: "/collection.png" },
];

const CollectionsPanel = ({ show, onMouseEnter, onMouseLeave, navbarHeight }) => (
    <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="fixed left-0 w-full z-40 transition-all duration-300"
        style={{
            top: `${navbarHeight}px`,
            background: "#f9f5f0",
            borderBottom: "1px solid rgba(111,78,55,0.15)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            opacity: show ? 1 : 0,
            pointerEvents: show ? "auto" : "none",
            transform: show ? "translateY(0)" : "translateY(-8px)",
        }}
    >
        <div className="px-6 md:px-10 py-6">
            <p className="text-[9px] font-black uppercase tracking-widest mb-4" style={{ color: "#7a6a5a" }}>Collections</p>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {collectionItems.map((item, i) => (
                    <div key={i} className="min-w-[160px] cursor-pointer group flex-shrink-0">
                        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(111,78,55,0.15)" }}>
                            <img src={item.img} alt={item.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={e => { e.target.style.background = "#e8ddd5"; e.target.style.minHeight = "176px"; }} />
                        </div>
                        <p className="text-xs font-semibold mt-2 text-center" style={{ color: "#333" }}>{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MEGA MENU PANEL
// ─────────────────────────────────────────────────────────────────────────────
const MegaMenuPanel = ({ show, onClose, navbarHeight }) => (
    <div
        className="fixed left-0 w-full z-40 transition-all duration-300"
        style={{
            top: `${navbarHeight}px`,
            background: "#f9f5f0",
            borderBottom: "1px solid rgba(111,78,55,0.15)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            opacity: show ? 1 : 0,
            pointerEvents: show ? "auto" : "none",
            transform: show ? "translateY(0)" : "translateY(-8px)",
        }}
    >
        <div className="px-6 md:px-10 py-6 relative">
            <button onClick={onClose} className="absolute top-4 right-5 p-2 rounded-full transition-colors hover:bg-[#ece5de]" style={{ color: "#333" }}>
                <CloseIcon c="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: "#7a6a5a" }}>Featured</p>
                    {["New Arrivals", "Winter Collection 2025", "Basics", "Bluorng Racing Club", "Iconics"].map(item => (
                        <p key={item} className="text-sm font-semibold cursor-pointer transition-colors hover:text-[#6F4E37]" style={{ color: "#000" }}>{item}</p>
                    ))}
                </div>
                <div>
                    <h3 className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: "#7a6a5a" }}>Top</h3>
                    <div className="flex flex-wrap gap-2">
                        {["T-Shirts", "Polos", "Shirts", "Sweatshirts", "Hoodies", "Jackets"].map(i => (
                            <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors hover:bg-[#ece5de]"
                                style={{ background: "#fff", color: "#333", border: "1px solid rgba(111,78,55,0.15)" }}>{i}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: "#7a6a5a" }}>Bottom</h3>
                    <div className="flex flex-wrap gap-2">
                        {["Cargos", "Jeans", "Pants", "Shorts"].map(i => (
                            <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors hover:bg-[#ece5de]"
                                style={{ background: "#fff", color: "#333", border: "1px solid rgba(111,78,55,0.15)" }}>{i}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: "#7a6a5a" }}>Accessories</h3>
                    <div className="flex flex-wrap gap-2">
                        {["Bags", "Caps"].map(i => (
                            <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors hover:bg-[#ece5de]"
                                style={{ background: "#fff", color: "#333", border: "1px solid rgba(111,78,55,0.15)" }}>{i}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: "#7a6a5a" }}>Shop by color</h3>
                    <div className="flex flex-wrap gap-2">
                        {["Blues", "Browns", "Greens", "Neutrals", "Purples", "Reds"].map(i => (
                            <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors hover:bg-[#ece5de]"
                                style={{ background: "#fff", color: "#333", border: "1px solid rgba(111,78,55,0.15)" }}>{i}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
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

    const handleNav = (id, link) => { setActiveId(id); navigate(link); onClose(); };

    return (
        <>
            <div onClick={onClose} className="fixed inset-0 z-[300] transition-all duration-300"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }} />
            <aside className="fixed top-0 left-0 h-full z-[400] flex flex-col transition-transform duration-300 ease-out"
                style={{ width: "288px", transform: open ? "translateX(0)" : "translateX(-100%)", background: "#fff", borderRight: "1px solid rgba(111,78,55,0.15)", boxShadow: open ? "8px 0 40px rgba(0,0,0,0.15)" : "none" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(111,78,55,0.12)" }}>
                    <div onClick={() => { navigate("/"); onClose(); }} className="cursor-pointer flex items-center gap-2">
                        <img src="/logo2.png" className="h-10 w-10" alt="logo" onError={e => { e.target.style.display = "none"; }} />
                        <div className="flex flex-col leading-none">
                            <span className="text-[13px] font-black tracking-[0.18em] uppercase" style={{ color: "#000" }}>BRU</span>
                            <span className="text-[13px] font-black tracking-[0.18em] uppercase -mt-[2px]" style={{ color: "#6F4E37" }}>BLA</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full transition-colors hover:bg-[#f9f5f0]" style={{ color: "#333" }} aria-label="Close menu">
                        <CloseIcon c="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-3" style={{ scrollbarWidth: "none" }}>
                    <p className="text-[9px] font-black uppercase tracking-widest px-2 mb-2" style={{ color: "#7a6a5a" }}>Menu</p>
                    {SIDEBAR_LINKS.map(({ id, label, Icon, link, special }) => {
                        const isActive = activeId === id;
                        return (
                            <button key={id} onClick={() => handleNav(id, link)}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 mb-0.5"
                                style={{ background: isActive ? special ? "linear-gradient(135deg,#6F4E37,#4a3520)" : "#000" : "transparent", color: isActive ? "#fff" : "#333" }}>
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                                    style={{ background: isActive ? "rgba(255,255,255,0.12)" : special ? "rgba(111,78,55,0.1)" : "#f9f5f0" }}>
                                    <Icon c="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold">{label}</span>
                                {special && !isActive && <span className="ml-auto text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: "linear-gradient(135deg,#6F4E37,#8B6347)", color: "#fff" }}>NEW</span>}
                                {isActive && <ChevRight c="w-4 h-4 ml-auto opacity-60" />}
                            </button>
                        );
                    })}
                </div>
                <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(111,78,55,0.12)" }}>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#f9f5f0" }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#000,#1a1a1a)", border: "1px solid rgba(111,78,55,0.25)" }}>
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
// CART BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const CartBtn = ({ count, transparent }) => {
    const iconColor = transparent ? "#fff" : "#333";
    return (
        <Link to="/mycart" className="relative p-2 rounded-full transition-colors hover:bg-white/10" aria-label="View cart" style={{ color: iconColor }}>
            <CartIcon c="w-5 h-5" />
            {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm"
                    style={{ background: "#6F4E37", color: "#fff" }}>
                    {count}
                </span>
            )}
        </Link>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// BRUBLA CENTERED WORDMARK
// ─────────────────────────────────────────────────────────────────────────────
const BrublaWordmark = ({ transparent, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center leading-none select-none cursor-pointer group"
    >
        <span
            className="font-black uppercase tracking-[0.25em] transition-colors duration-300"
            style={{ fontSize: "22px", color: transparent ? "#fff" : "#000", lineHeight: 1 }}
        >
            BRUBLA
        </span>
    </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
const Navbar = () => {
    const [notifVisible, setNotifVisible] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [showCollections, setShowCollections] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const headerRef = useRef(null);
    const [navbarHeight, setNavbarHeight] = useState(100);
    const cartCount = 3;

    const navigate = useNavigate();

    // ── Transparent only when at top AND no overlay panels open
    const transparent = !scrolled && !sidebarOpen && !openMenu && !showCollections;

    // Icon / text colors flip based on transparent state
    const iconColor = transparent ? "#fff" : "#333";
    const textColor = transparent ? "#fff" : "#333";

    // ── Scroll listener
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 4);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    // ── Track actual header height for panel positioning
    useEffect(() => {
        const update = () => { if (headerRef.current) setNavbarHeight(headerRef.current.offsetHeight); };
        update();
        window.addEventListener("resize", update);
        const observer = new ResizeObserver(update);
        if (headerRef.current) observer.observe(headerRef.current);
        return () => { window.removeEventListener("resize", update); observer.disconnect(); };
    }, [notifVisible, scrolled]);

    const openSearch = useCallback(() => setSearchOpen(true), []);
    const closeSearch = useCallback(() => setSearchOpen(false), []);
    const openSidebar = useCallback(() => { setSidebarOpen(true); setShowCollections(false); setOpenMenu(false); }, []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    const location = useLocation();
    const hideRoutes = ["/login", "/register", "/mycart", "/product-details"];
    const shouldHide = hideRoutes.some(r => location.pathname.startsWith(r));

    return (
        <>
            <SearchOverlay open={searchOpen} onClose={closeSearch} />
            <Sidebar open={sidebarOpen} onClose={closeSidebar} navigate={navigate} />
            {!shouldHide && <FloatingJoinBtn />}

            {/* Collections panel */}
            <CollectionsPanel
                show={showCollections && !openMenu}
                onMouseEnter={() => setShowCollections(true)}
                onMouseLeave={() => setShowCollections(false)}
                navbarHeight={navbarHeight}
            />

            {/* Mega menu panel */}
            <MegaMenuPanel
                show={openMenu}
                onClose={() => setOpenMenu(false)}
                navbarHeight={navbarHeight}
            />

            {/* Overlay to close panels on outside click */}
            {(showCollections || openMenu) && (
                <div className="fixed inset-0 z-30"
                    onClick={() => { setShowCollections(false); setOpenMenu(false); }} />
            )}

            {/* ── STICKY HEADER ── */}
            <header ref={headerRef} className="fixed top-0 left-0 right-0 z-[500] transition-all duration-300">

                {/* Notification banner — always black regardless of scroll */}
                {notifVisible && <NotifBanner onClose={() => setNotifVisible(false)} />}

                {/* Main header bar — transparent at top, white on scroll */}
                <div
                    className="transition-all duration-300"
                    style={{
                        background: transparent ? "transparent" : "#fff",
                        borderBottom: transparent
                            ? "none"
                            : scrolled
                                ? "none"
                                : "1px solid rgba(111,78,55,0.12)",
                        boxShadow: transparent
                            ? "none"
                            : scrolled
                                ? "0 4px 24px rgba(0,0,0,0.09)"
                                : "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                >

                    {/* ── DESKTOP: 3-column balanced grid ── */}
                    <div className="hidden lg:grid items-center h-16 px-8" style={{ gridTemplateColumns: "1fr auto 1fr" }}>

                        {/* LEFT — logo image + New in + Collections */}
                        <div className="flex items-center gap-2">
                            {/* Logo image */}
                            <div onClick={() => navigate('/')} className="cursor-pointer flex-shrink-0">
                                <img src="/logo2.png" className="h-10 w-10" alt="logo"
                                    onError={e => { e.target.style.display = "none"; }} />
                            </div>

                            <div className="w-px h-5 mx-1 flex-shrink-0"
                                style={{ background: transparent ? "rgba(255,255,255,0.2)" : "rgba(111,78,55,0.2)" }} />

                            {/* New in */}
                            <button
                                className="flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
                                style={{ color: textColor }}
                                onMouseEnter={e => e.currentTarget.style.background = transparent ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                New in
                            </button>

                            {/* Collections */}
                            <button
                                onMouseEnter={() => { setShowCollections(true); setOpenMenu(false); }}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
                                style={{ color: showCollections ? (transparent ? "#fff" : "#6F4E37") : textColor }}
                                onMouseLeave={() => { /* panel closes itself */ }}
                            >
                                Collections
                                <ChevDown c={`w-3 h-3 transition-transform duration-200 ${showCollections ? "rotate-180" : ""}`} />
                            </button>
                        </div>

                        {/* CENTER — BRUBLA wordmark */}
                        <div className="flex items-center justify-center">
                            <BrublaWordmark transparent={transparent} onClick={() => navigate("/")} />
                        </div>

                        {/* RIGHT — search, cart, location, profile, menu */}
                        <div className="flex items-center justify-end gap-0.5">
                            {/* Search */}
                            <button onClick={openSearch} className="p-2 rounded-full transition-colors hover:bg-white/10" style={{ color: iconColor }} aria-label="Search">
                                <SearchIcon c="w-5 h-5" />
                            </button>

                            {/* Cart */}
                            <CartBtn count={cartCount} transparent={transparent} />

                            {/* Location */}
                            <LocationSelector transparent={transparent} />

                            {/* Profile */}
                            <button onClick={() => navigate('/profile')} className="p-2 rounded-full transition-colors hover:bg-white/10" style={{ color: iconColor }} aria-label="Profile">
                                <ProfileIcon c="w-5 h-5" />
                            </button>

                            {/* Menu */}
                            <button
                                onClick={() => { setOpenMenu(o => !o); setShowCollections(false); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ml-1"
                                style={{
                                    color: openMenu ? "#fff" : iconColor,
                                    background: openMenu ? "#000" : transparent ? "rgba(255,255,255,0.15)" : "#f9f5f0",
                                    border: transparent && !openMenu ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(111,78,55,0.15)",
                                }}>
                                <MenuIcon c="w-4 h-4" />
                                <span>Menu</span>
                            </button>
                        </div>
                    </div>

                    {/* ── MOBILE / TABLET ROW ── */}
                    <div className="lg:hidden flex items-center gap-2 px-3 md:px-5 h-14">

                        {/* Hamburger */}
                        <button onClick={openSidebar} className="p-2 rounded-full transition-colors hover:bg-white/10 flex-shrink-0" style={{ color: iconColor }} aria-label="Open menu">
                            <MenuIcon c="w-5 h-5" />
                        </button>

                        {/* Logo image on mobile */}
                        <div onClick={() => navigate('/')} className="cursor-pointer flex-shrink-0">
                            <img src="/logo2.png" className="h-10 w-10" alt="logo"
                                onError={e => { e.target.style.display = "none"; }} />
                        </div>

                        {/* Centered wordmark — mobile */}
                        <div className="flex-1 flex justify-center">
                            <BrublaWordmark transparent={transparent} onClick={() => navigate("/")} />
                        </div>

                        {/* Right icons — mobile */}
                        <div className="flex items-center gap-0">
                            <button onClick={openSearch} className="p-2 rounded-full transition-colors hover:bg-white/10" style={{ color: iconColor }} aria-label="Search">
                                <SearchIcon c="w-5 h-5" />
                            </button>
                            <CartBtn count={cartCount} transparent={transparent} />
                            <LocationSelector transparent={transparent} />
                        </div>
                    </div>

                    {/* ── TABLET: scrollable nav pills (only when scrolled / not transparent) ── */}
                    {!transparent && (
                        <div className="hidden md:flex lg:hidden items-center gap-1.5 px-5 pb-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                            {[
                                { label: "New in" },
                                { label: "Collections" },
                                { label: "Men" },
                                { label: "Women" },
                                { label: "Kids" },
                                { label: "Sale", red: true },
                            ].map(({ label, red }) => (
                                <button key={label}
                                    onMouseEnter={label === "Collections" ? () => { setShowCollections(true); setOpenMenu(false); } : undefined}
                                    className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
                                    style={{
                                        border: `1.5px solid ${red ? "#6F4E37" : "rgba(111,78,55,0.18)"}`,
                                        background: red ? "#6F4E37" : "#f9f5f0",
                                        color: red ? "#fff" : "#000",
                                    }}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* Spacer — only inject when navbar is NOT transparent so content isn't hidden */}
            {!transparent && (
                <div style={{ height: `${navbarHeight}px` }} />
            )}
        </>
    );
};

export default Navbar;