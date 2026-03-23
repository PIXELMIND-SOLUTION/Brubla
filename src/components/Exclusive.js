import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";

// ─────────────────────────────────────────────────────────────────────────────
// PLAY STORE ICON (official brand SVG)
// ─────────────────────────────────────────────────────────────────────────────
const PlayStoreIcon = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ps1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00C6FF" />
                <stop offset="100%" stopColor="#0072FF" />
            </linearGradient>
            <linearGradient id="ps2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD200" />
                <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
            <linearGradient id="ps3" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF4B2B" />
                <stop offset="100%" stopColor="#FF416C" />
            </linearGradient>
            <linearGradient id="ps4" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00B09B" />
                <stop offset="100%" stopColor="#96C93D" />
            </linearGradient>
        </defs>
        <path fill="url(#ps1)"
            d="M48 432c0 22.1 17.9 40 40 40l216-216L88 40C65.9 40 48 57.9 48 80v352z" />
        <path fill="url(#ps2)"
            d="M416 216l-72-40-72 80 72 80 73-41c20-11 20-68-1-79z" />
        <path fill="url(#ps3)"
            d="M88 472l216-216-72-72L88 40C65.9 40 48 57.9 48 80v352c0 22.1 17.9 40 40 40z"
            opacity="0" />
        <path fill="url(#ps3)"
            d="M304 256L88 472c6.7 4.5 14.8 7.1 23.5 7L344 336l-40-80z" />
        <path fill="url(#ps4)"
            d="M304 256L111 49C102.3 49 94.2 51.7 87.5 56.3L304 256z" />
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// APP STORE ICON (official Apple style)
// ─────────────────────────────────────────────────────────────────────────────
const AppStoreIcon = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="apg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2AABEE" />
                <stop offset="100%" stopColor="#0076FF" />
            </linearGradient>
        </defs>
        <rect width="512" height="512" rx="115" fill="url(#apg)" />
        <path fill="#fff"
            d="M256 108c-8.8 0-16 7.2-16 16v16h-24c-8.8 0-16 7.2-16 16s7.2 16 16 16h24v16c0 8.8 7.2 16 16 16s16-7.2 16-16v-16h24c8.8 0 16-7.2 16-16s-7.2-16-16-16h-24v-16c0-8.8-7.2-16-16-16z" />
        <path fill="#fff"
            d="M347.5 270.2l-68.1-118c-9.5-16.5-33.3-16.5-42.8 0l-68.1 118c-9.5 16.5 2.4 37.1 21.4 37.1H326c19.1 0 31-20.6 21.5-37.1zM256 362c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24zM176 362c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24zM336 362c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z" />
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// GEM ICON (exclusive emblem)
// ─────────────────────────────────────────────────────────────────────────────
const GemIcon = ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 13L2 9z" />
        <path d="M2 9h20M6 3l4 6m4 0l4-6m-8 0v6" />
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE DATA
// ─────────────────────────────────────────────────────────────────────────────
const FEATURES = [
    {
        icon: "◈",
        title: "Members-Only Drops",
        desc: "First access to exclusive collections before anyone else",
    },
    {
        icon: "✦",
        title: "Curated Style Feed",
        desc: "AI-personalised looks based on your taste profile",
    },
    {
        icon: "◉",
        title: "Private Sale Events",
        desc: "Up to 70% off — app members only, 24 hours only",
    },
    {
        icon: "◆",
        title: "Express Checkout",
        desc: "Saved addresses, 1-tap reorder, instant confirmation",
    },
    {
        icon: "⬡",
        title: "Live Stylist Chat",
        desc: "Real-time advice from our in-house style experts",
    },
    {
        icon: "◎",
        title: "Loyalty Rewards",
        desc: "Earn NM Gold on every purchase, redeem anytime",
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────
const STATS = [
    { value: "4.9★", label: "App Rating" },
    { value: "2M+", label: "Downloads" },
    { value: "500+", label: "Exclusive Styles" },
    { value: "70%", label: "Members-Only Offers" },
];

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW PRODUCT IMAGES (small floating cards)
// ─────────────────────────────────────────────────────────────────────────────
const PREVIEW_IMGS = [
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=180&h=240&fit=crop&q=80&auto=format",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=180&h=240&fit=crop&q=80&auto=format",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=180&h=240&fit=crop&q=80&auto=format",
];

// ─────────────────────────────────────────────────────────────────────────────
// STORE BADGE BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const StoreBadge = ({ store, href, delay = 0 }) => {
    const [hov, setHov] = useState(false);
    const [vis, setVis] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setVis(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    const isAndroid = store === "android";
    const label = isAndroid ? "GET IT ON" : "DOWNLOAD ON THE";
    const storeName = isAndroid ? "Google Play" : "App Store";

    return (
        <a
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            className="flex items-center gap-3 rounded-2xl transition-all duration-300 active:scale-95 select-none"
            style={{
                padding: "14px 22px",
                minWidth: "190px",
                background: hov
                    ? "linear-gradient(135deg,#C9A96E,#a8843f)"
                    : "linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))",
                border: `1.5px solid ${hov ? "transparent" : "rgba(201,169,110,0.30)"}`,
                boxShadow: hov
                    ? "0 12px 36px rgba(201,169,110,0.40), 0 4px 14px rgba(12,12,12,0.25)"
                    : "0 4px 18px rgba(12,12,12,0.25)",
                backdropFilter: "blur(12px)",
                transform: `${hov ? "translateY(-3px)" : "translateY(0)"} ${vis ? "scale(1)" : "scale(0.9)"}`,
                opacity: vis ? 1 : 0,
                transition: `opacity 0.5s ease ${delay}ms, transform 0.4s ease, background 0.3s ease, box-shadow 0.3s ease, border 0.3s ease`,
            }}
            aria-label={`Download on ${storeName}`}
        >
            {/* Store icon */}
            <div className="flex-shrink-0">
                {isAndroid ? <PlayStoreIcon size={28} /> : <AppStoreIcon size={28} />}
            </div>

            {/* Text */}
            <div className="flex flex-col leading-tight">
                <span
                    className="font-semibold uppercase tracking-[0.14em]"
                    style={{ fontSize: "9px", color: hov ? "rgba(12,12,12,0.7)" : "rgba(255,255,255,0.55)" }}
                >
                    {label}
                </span>
                <span
                    className="font-black"
                    style={{
                        fontSize: "16px", color: hov ? "#0C0C0C" : "#F5F0E8",
                        fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.01em"
                    }}
                >
                    {storeName}
                </span>
            </div>
        </a>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// QR CODE (SVG placeholder that looks real)
// ─────────────────────────────────────────────────────────────────────────────
const QRCode = () => (
    <div className="relative p-3 rounded-2xl"
        style={{
            background: "#FEFCF8", border: "2px solid rgba(201,169,110,0.25)",
            boxShadow: "0 8px 28px rgba(12,12,12,0.35)"
        }}>
        <svg width="88" height="88" viewBox="0 0 88 88">
            {/* QR border squares */}
            <rect x="4" y="4" width="24" height="24" fill="none" stroke="#0C0C0C" strokeWidth="3" />
            <rect x="8" y="8" width="16" height="16" fill="#0C0C0C" />
            <rect x="60" y="4" width="24" height="24" fill="none" stroke="#0C0C0C" strokeWidth="3" />
            <rect x="64" y="8" width="16" height="16" fill="#0C0C0C" />
            <rect x="4" y="60" width="24" height="24" fill="none" stroke="#0C0C0C" strokeWidth="3" />
            <rect x="8" y="64" width="16" height="16" fill="#0C0C0C" />
            {/* Data dots */}
            {[
                [34, 4], [38, 4], [42, 4], [34, 8], [42, 8], [34, 12], [38, 12], [42, 12], [38, 16], [42, 20],
                [34, 20], [38, 20], [34, 24], [42, 24], [4, 34], [8, 34], [12, 34], [20, 34], [24, 34],
                [4, 38], [12, 38], [20, 38], [4, 42], [8, 42], [16, 42], [24, 42], [8, 46], [12, 46], [20, 46],
                [4, 50], [16, 50], [24, 50], [4, 54], [8, 54], [12, 54], [20, 54], [34, 34], [42, 34], [50, 34],
                [54, 34], [58, 34], [34, 38], [46, 38], [54, 38], [38, 42], [46, 42], [34, 46], [38, 46], [50, 46],
                [58, 46], [34, 50], [42, 50], [54, 50], [38, 54], [50, 54], [58, 54], [64, 34], [68, 34], [76, 34],
                [80, 34], [64, 38], [72, 38], [80, 38], [68, 42], [76, 42], [64, 46], [68, 46], [76, 46], [80, 46],
                [64, 50], [72, 50], [64, 54], [68, 54], [76, 54], [80, 54], [34, 60], [42, 60], [50, 60], [58, 60],
                [38, 64], [46, 64], [54, 64], [34, 68], [38, 68], [50, 68], [58, 68], [42, 72], [46, 72], [34, 76],
                [38, 76], [46, 76], [54, 76], [58, 76], [64, 60], [72, 60], [80, 60], [68, 64], [76, 64], [64, 68],
                [72, 68], [80, 68], [64, 72], [68, 72], [76, 72], [64, 76], [68, 76], [72, 76], [80, 76], [80, 80]
            ].map(([x, y], i) => (
                <rect key={i} x={x} y={y} width="4" height="4" fill="#0C0C0C" />
            ))}
            {/* Gold centre mark */}
            <rect x="40" y="40" width="8" height="8" rx="2" fill="#C9A96E" />
        </svg>
        <p className="text-[9px] font-black text-center mt-1.5 tracking-[0.08em]"
            style={{ color: "#8A8070" }}>
            SCAN TO DOWNLOAD
        </p>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING PHONE MOCKUP
// ─────────────────────────────────────────────────────────────────────────────
const PhoneMockup = () => {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % PREVIEW_IMGS.length), 2800);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="relative flex-shrink-0 select-none" style={{ width: "200px" }}>
            {/* Glow behind phone */}
            <div className="absolute inset-0 rounded-[40px] blur-2xl opacity-35 pointer-events-none"
                style={{ background: "radial-gradient(circle,#C9A96E 0%,transparent 70%)", transform: "scale(1.2)" }} />

            {/* Phone shell */}
            <div className="relative rounded-[36px] overflow-hidden shadow-2xl"
                style={{
                    width: "200px", height: "400px",
                    background: "#1a1812",
                    border: "2px solid rgba(201,169,110,0.35)",
                    boxShadow: "0 30px 80px rgba(12,12,12,0.6), 0 0 0 1px rgba(201,169,110,0.15)",
                }}>

                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ background: "#0C0C0C", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#333" }} />
                    <div className="w-8 h-1.5 rounded-full" style={{ background: "#222" }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#333" }} />
                </div>

                {/* Screen background */}
                <div className="absolute inset-0"
                    style={{ background: "linear-gradient(160deg,#1a1812 0%,#0C0C0C 100%)" }} />

                {/* Preview images carousel */}
                {PREVIEW_IMGS.map((img, i) => (
                    <img key={i} src={img} alt="App preview"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            opacity: i === idx ? 0.55 : 0,
                            transition: "opacity 0.8s ease",
                        }}
                        loading="eager" draggable={false} />
                ))}

                {/* Screen UI overlay */}
                <div className="absolute inset-0 flex flex-col"
                    style={{ background: "linear-gradient(180deg,transparent 30%,rgba(12,12,12,0.85) 100%)" }}>
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-5 pt-10 pb-2">
                        <span className="text-[9px] font-bold text-white/50">9:41</span>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-1.5 rounded-sm" style={{ background: "rgba(255,255,255,0.4)" }} />
                            <div className="w-3 h-1.5 rounded-sm" style={{ background: "rgba(255,255,255,0.4)" }} />
                            <div className="w-4 h-2 rounded-sm border border-white/30 relative">
                                <div className="absolute inset-y-0.5 left-0.5 w-2/3 rounded-sm"
                                    style={{ background: "#6fcf97" }} />
                            </div>
                        </div>
                    </div>

                    {/* App header */}
                    <div className="px-4 pt-1">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em]"
                            style={{ color: "#C9A96E" }}>NEWME</p>
                        <p className="text-xs font-black text-white leading-tight"
                            style={{ fontFamily: "Georgia,serif" }}>Exclusive</p>
                    </div>

                    {/* Mini cards */}
                    <div className="flex gap-2 px-3 mt-3">
                        {[0, 1].map(i => (
                            <div key={i} className="flex-1 rounded-xl overflow-hidden"
                                style={{ height: "80px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,169,110,0.15)" }}>
                                <img src={PREVIEW_IMGS[i]} alt="" className="w-full h-full object-cover opacity-70" />
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="absolute bottom-6 left-4 right-4">
                        <div className="rounded-xl px-3 py-2 flex items-center justify-between"
                            style={{ background: "linear-gradient(135deg,#C9A96E,#a8843f)" }}>
                            <span className="text-[9px] font-black" style={{ color: "#0C0C0C" }}>Members Only</span>
                            <span className="text-[9px] font-black" style={{ color: "#0C0C0C" }}>500+ Styles →</span>
                        </div>
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full"
                        style={{ background: "rgba(255,255,255,0.25)" }} />
                </div>
            </div>

            {/* Side button details */}
            <div className="absolute top-20 -right-1 w-1 h-10 rounded-r-sm"
                style={{ background: "#2a2218" }} />
            <div className="absolute top-14 -left-1 w-1 h-6 rounded-l-sm"
                style={{ background: "#2a2218" }} />
            <div className="absolute top-22 -left-1 w-1 h-6 rounded-l-sm"
                style={{ background: "#2a2218" }} />
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE CARD
// ─────────────────────────────────────────────────────────────────────────────
const FeatureCard = ({ feat, index }) => {
    const [vis, setVis] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className="flex items-start gap-3.5 p-4 rounded-2xl transition-all duration-300 group cursor-default"
            style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,169,110,0.12)",
                opacity: vis ? 1 : 0,
                transform: vis ? "translateY(0)" : "translateY(14px)",
                transition: `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s, background 0.25s ease`,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,110,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
        >
            <span className="text-xl flex-shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-xl"
                style={{ background: "rgba(201,169,110,0.12)", color: "#C9A96E", fontSize: "16px" }}>
                {feat.icon}
            </span>
            <div>
                <h4 className="font-black text-sm mb-0.5" style={{ color: "#F5F0E8" }}>{feat.title}</h4>
                <p className="text-[11px] font-medium leading-relaxed" style={{ color: "rgba(245,240,232,0.5)" }}>
                    {feat.desc}
                </p>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT ITEM
// ─────────────────────────────────────────────────────────────────────────────
const StatItem = ({ stat, index }) => {
    const [vis, setVis] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const t = setTimeout(() => setVis(true), 300 + index * 120);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            ref={ref}
            className="flex flex-col items-center text-center px-4 py-3 rounded-2xl"
            style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,169,110,0.12)",
                opacity: vis ? 1 : 0,
                transform: vis ? "scale(1)" : "scale(0.85)",
                transition: `opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1)`,
            }}
        >
            <span className="font-black leading-none"
                style={{
                    fontSize: "clamp(20px,3.5vw,28px)", color: "#C9A96E",
                    fontFamily: "Georgia,'Times New Roman',serif"
                }}>
                {stat.value}
            </span>
            <span className="text-[10px] font-semibold mt-1 uppercase tracking-[0.1em]"
                style={{ color: "rgba(245,240,232,0.45)" }}>
                {stat.label}
            </span>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXCLUSIVE PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ExclusivePage() {
    const [heroVis, setHeroVis] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setHeroVis(true), 80);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
        <Navbar/>
            <div
                className="relative w-full min-h-screen overflow-x-hidden mb-[70px]"
                style={{ background: "linear-gradient(160deg,#0C0C0C 0%,#1a1812 50%,#0C0C0C 100%)" }}
            >
                {/* ── CSS ANIMATIONS ── */}
                <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.08);opacity:0.3} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

                {/* ── DECORATIVE BACKGROUND ── */}
                {/* Radial gold glow top-right */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
                    style={{ background: "radial-gradient(circle at 80% 20%,rgba(201,169,110,0.12) 0%,transparent 60%)" }} />
                {/* Radial gold glow bottom-left */}
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
                    style={{ background: "radial-gradient(circle at 20% 80%,rgba(201,169,110,0.08) 0%,transparent 60%)" }} />

                {/* Rotating decorative ring */}
                <div className="absolute top-24 right-8 w-64 h-64 pointer-events-none hidden lg:block"
                    style={{ animation: "rotate 40s linear infinite", opacity: 0.08 }}>
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#C9A96E" strokeWidth="0.5" strokeDasharray="6 10" />
                        <circle cx="100" cy="100" r="70" fill="none" stroke="#E8C97A" strokeWidth="0.5" strokeDasharray="4 8" />
                        <circle cx="100" cy="100" r="50" fill="none" stroke="#C9A96E" strokeWidth="0.5" strokeDasharray="2 6" />
                    </svg>
                </div>

                {/* ── HERO SECTION ── */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-10 xl:px-14 pt-16 md:pt-24 pb-16">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                        {/* LEFT: Text content */}
                        <div className="flex-1 text-center lg:text-left order-2 lg:order-1">

                            {/* Gem badge */}
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                                style={{
                                    background: "linear-gradient(135deg,rgba(201,169,110,0.15),rgba(201,169,110,0.05))",
                                    border: "1px solid rgba(201,169,110,0.3)",
                                    opacity: heroVis ? 1 : 0,
                                    animation: heroVis ? "fadeUp 0.6s ease 0.1s both" : "none",
                                }}
                            >
                                <span style={{ color: "#C9A96E" }}><GemIcon size={16} /></span>
                                <span className="text-[10px] font-black tracking-[0.2em] uppercase"
                                    style={{ color: "#C9A96E" }}>
                                    Members Exclusive
                                </span>
                            </div>

                            {/* Headline */}
                            <h1
                                className="font-black leading-none mb-4"
                                style={{
                                    fontSize: "clamp(36px,6vw,72px)",
                                    color: "#F5F0E8",
                                    fontFamily: "Georgia,'Times New Roman',serif",
                                    letterSpacing: "-0.03em",
                                    opacity: heroVis ? 1 : 0,
                                    animation: heroVis ? "fadeUp 0.65s ease 0.2s both" : "none",
                                }}
                            >
                                The App
                                <br />
                                <span style={{
                                    background: "linear-gradient(90deg,#C9A96E,#E8C97A,#C9A96E)",
                                    backgroundSize: "200% auto",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    animation: "shimmer 4s linear infinite",
                                }}>
                                    Unlocks More.
                                </span>
                            </h1>

                            {/* Subline */}
                            <p
                                className="font-medium leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
                                style={{
                                    fontSize: "clamp(13px,1.5vw,16px)",
                                    color: "rgba(245,240,232,0.55)",
                                    opacity: heroVis ? 1 : 0,
                                    animation: heroVis ? "fadeUp 0.65s ease 0.35s both" : "none",
                                }}
                            >
                                Download the NewMe app to access member-exclusive drops, personalised style feeds,
                                private sale events, and 500+ styles you won't find anywhere else.
                            </p>

                            {/* Store buttons */}
                            <div
                                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
                                style={{
                                    opacity: heroVis ? 1 : 0,
                                    animation: heroVis ? "fadeUp 0.65s ease 0.45s both" : "none",
                                }}
                            >
                                <StoreBadge
                                    store="android"
                                    href="https://play.google.com/store"
                                    delay={500}
                                />
                                <StoreBadge
                                    store="ios"
                                    href="https://apps.apple.com"
                                    delay={640}
                                />
                            </div>

                            {/* QR + note row */}
                            <div
                                className="hidden md:flex items-center gap-5"
                                style={{
                                    opacity: heroVis ? 1 : 0,
                                    animation: heroVis ? "fadeUp 0.65s ease 0.65s both" : "none",
                                }}
                            >
                                <QRCode />
                                <div>
                                    <p className="text-xs font-black mb-0.5" style={{ color: "#F5F0E8" }}>
                                        Scan to download instantly
                                    </p>
                                    <p className="text-[11px] font-medium" style={{ color: "rgba(245,240,232,0.4)" }}>
                                        Point your camera at the QR code
                                    </p>
                                    <p className="text-[11px] font-medium mt-0.5" style={{ color: "rgba(245,240,232,0.4)" }}>
                                        Works on Android & iOS
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Phone + floating elements */}
                        <div
                            className="relative flex-shrink-0 order-1 lg:order-2"
                            style={{
                                opacity: heroVis ? 1 : 0,
                                animation: heroVis ? "fadeUp 0.7s ease 0.15s both" : "none",
                            }}
                        >
                            {/* Pulsing ring behind phone */}
                            <div className="absolute inset-0 -m-8 rounded-full pointer-events-none"
                                style={{ border: "1px solid rgba(201,169,110,0.18)", animation: "pulseRing 3s ease-in-out infinite" }} />
                            <div className="absolute inset-0 -m-16 rounded-full pointer-events-none"
                                style={{ border: "1px solid rgba(201,169,110,0.08)", animation: "pulseRing 3s ease-in-out infinite 0.5s" }} />

                            {/* Phone with float animation */}
                            <div style={{ animation: "floatA 5s ease-in-out infinite" }}>
                                <PhoneMockup />
                            </div>

                            {/* Floating badge: Members */}
                            <div className="absolute -left-12 top-20 px-3 py-2 rounded-xl hidden lg:block"
                                style={{
                                    background: "rgba(12,12,12,0.75)",
                                    backdropFilter: "blur(12px)",
                                    border: "1px solid rgba(201,169,110,0.2)",
                                    boxShadow: "0 8px 24px rgba(12,12,12,0.4)",
                                    animation: "floatB 4s ease-in-out infinite 1s",
                                }}>
                                <p className="text-[9px] font-black uppercase tracking-[0.12em]" style={{ color: "#C9A96E" }}>
                                    Active Members
                                </p>
                                <p className="text-lg font-black leading-tight" style={{
                                    color: "#F5F0E8",
                                    fontFamily: "Georgia,serif"
                                }}>2M+</p>
                            </div>

                            {/* Floating badge: rating */}
                            <div className="absolute -right-10 bottom-28 px-3 py-2 rounded-xl hidden lg:block"
                                style={{
                                    background: "linear-gradient(135deg,#C9A96E,#a8843f)",
                                    boxShadow: "0 8px 24px rgba(201,169,110,0.4)",
                                    animation: "floatB 4.5s ease-in-out infinite 0.5s",
                                }}>
                                <p className="text-[9px] font-black uppercase tracking-[0.12em]"
                                    style={{ color: "rgba(12,12,12,0.65)" }}>App Rating</p>
                                <p className="text-lg font-black leading-tight" style={{
                                    color: "#0C0C0C",
                                    fontFamily: "Georgia,serif"
                                }}>4.9 ★</p>
                            </div>
                        </div>
                    </div>

                    {/* ── STATS ROW ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14 md:mt-16">
                        {STATS.map((s, i) => <StatItem key={i} stat={s} index={i} />)}
                    </div>
                </section>

                {/* ── GOLD DIVIDER ── */}
                <div className="w-full h-px" style={{ background: "linear-gradient(90deg,transparent,#C9A96E,transparent)" }} />

                {/* ── FEATURES GRID ── */}
                <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-10 xl:px-14 py-16 md:py-20">
                    <div className="text-center mb-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] mb-2" style={{ color: "#C9A96E" }}>
                            Why the App
                        </p>
                        <h2 className="font-black leading-none"
                            style={{
                                fontSize: "clamp(24px,4vw,40px)", color: "#F5F0E8",
                                fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.02em"
                            }}>
                            Everything Extra.
                            <br />
                            <span style={{ color: "#C9A96E" }}>Only Inside.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {FEATURES.map((f, i) => <FeatureCard key={i} feat={f} index={i} />)}
                    </div>

                    {/* Bottom CTA row */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                        <StoreBadge store="android" href="https://play.google.com/store" delay={0} />
                        <StoreBadge store="ios" href="https://apps.apple.com" delay={120} />
                    </div>

                    <p className="text-center text-[11px] font-medium mt-5"
                        style={{ color: "rgba(245,240,232,0.3)" }}>
                        Free to download · Available on Android 8.0+ and iOS 14+
                    </p>
                </section>

                {/* ── GOLD DIVIDER ── */}
                <div className="w-full h-px" style={{ background: "linear-gradient(90deg,transparent,#C9A96E,transparent)" }} />
            </div>
        </>
    );
}