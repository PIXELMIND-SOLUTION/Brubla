import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Header from "./Header";

// ─────────────────────────────────────────────────────────────────────────────
// CSS ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────────
const Styles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

    @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes pulseGold { 0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,0.4)} 50%{box-shadow:0 0 0 10px rgba(201,169,110,0)} }
    @keyframes scaleIn  { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
    @keyframes slideR   { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }

    .font-display { font-family: 'Playfair Display', Georgia, serif; }
    .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

    .gold-shimmer {
      background: linear-gradient(90deg, #C9A96E, #E8C97A, #C9A96E);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3.5s linear infinite;
    }

    .card-track::-webkit-scrollbar { display: none; }
    .filter-track::-webkit-scrollbar { display: none; }

    .product-card:hover .card-img { transform: scale(1.07); }
    .product-card:hover .quick-add { transform: translateY(0); opacity: 1; }
    .product-card:hover .hover-overlay { opacity: 1; }
    .product-card:hover .card-shadow { box-shadow: 0 28px 60px rgba(12,12,12,0.35), 0 8px 24px rgba(12,12,12,0.18); }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Ic = ({ d, className = "w-5 h-5", fill = "none", sw = 2, children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={fill}
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        {d ? <path d={d} /> : children}
    </svg>
);

const HeartIcon = ({ c, filled }) => <Ic className={c || "w-5 h-5"} fill={filled ? "currentColor" : "none"} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z" />;
const StarFull = ({ c }) => <Ic className={c || "w-3.5 h-3.5"} fill="currentColor" sw={0} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const CartIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></Ic>;
const GemIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M2 9h20M6 3l4 6m4 0l4-6m-8 0v6" /></Ic>;
const EyeIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Ic>;
const FilterIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="18" x2="12" y2="18" sw={3} /></Ic>;
const ChevRight = ({ c }) => <Ic className={c || "w-4 h-4"} d="M9 18l6-6-6-6" />;
const ChevLeft = ({ c }) => <Ic className={c || "w-4 h-4"} d="M15 18l-6-6 6-6" />;
const GridIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Ic>;
const ListIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" sw={3} /><line x1="3" y1="12" x2="3.01" y2="12" sw={3} /><line x1="3" y1="18" x2="3.01" y2="18" sw={3} /></Ic>;
const CheckIcon = ({ c }) => <Ic className={c || "w-3.5 h-3.5"} d="M5 13l4 4L19 7" sw={2.5} />;
const ShareIcon = ({ c }) => <Ic className={c || "w-4 h-4"} d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />;

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DATA
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCTS = [
    { id: 1, name: "Silk Organza Lehenga", brand: "NewMe Atelier", price: 12999, orig: 22999, disc: 43, rating: 4.9, reviews: 412, badge: "SIGNATURE", badgeCol: "#E8C97A", accent: "#E8C97A", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#1a1812", "#c0392b", "#C9A96E"], sizes: ["XS", "S", "M", "L", "XL"], tag: "BESTSELLER" },
    { id: 2, name: "Handwoven Banarasi Saree", brand: "Heritage Weaves", price: 8499, orig: 14999, disc: 43, rating: 5.0, reviews: 289, badge: "HERITAGE", badgeCol: "#C9A96E", accent: "#C9A96E", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#8B0000", "#C9A96E", "#1a1812"], sizes: ["Free Size"], tag: "LIMITED" },
    { id: 3, name: "Velvet Blazer Dress", brand: "Studio Noir", price: 5999, orig: 10499, disc: 43, rating: 4.8, reviews: 631, badge: "EXCLUSIVE", badgeCol: "#C9A96E", accent: "#C9A96E", img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#1a1812", "#3a3530", "#8B0000"], sizes: ["XS", "S", "M", "L"], tag: "NEW" },
    { id: 4, name: "Zardozi Anarkali Suit", brand: "Craft House", price: 9299, orig: 16999, disc: 45, rating: 4.9, reviews: 178, badge: "HANDCRAFTED", badgeCol: "#E8C97A", accent: "#E8C97A", img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#C9A96E", "#1a1812", "#8A8070"], sizes: ["S", "M", "L", "XL"], tag: "TRENDING" },
    { id: 5, name: "Premium Linen Co-ord Set", brand: "NewMe Originals", price: 3799, orig: 6999, disc: 46, rating: 4.7, reviews: 924, badge: "MEMBERS", badgeCol: "#6fcf97", accent: "#6fcf97", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#F5F0E8", "#8A8070", "#1a1812"], sizes: ["XS", "S", "M", "L", "XL"], tag: "POPULAR" },
    { id: 6, name: "Embroidered Kurta Set", brand: "Rangrez Studio", price: 4499, orig: 7999, disc: 44, rating: 4.8, reviews: 543, badge: "ARTISAN", badgeCol: "#C9A96E", accent: "#C9A96E", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#C9A96E", "#c0392b", "#1a1812"], sizes: ["S", "M", "L", "XL", "XXL"], tag: "LIMITED" },
    { id: 7, name: "Cashmere Shawl Wrap", brand: "Himalayan Luxe", price: 6999, orig: 12999, disc: 46, rating: 5.0, reviews: 97, badge: "RARE", badgeCol: "#E8C97A", accent: "#E8C97A", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#F5F0E8", "#C9A96E", "#8A8070"], sizes: ["One Size"], tag: "BESTSELLER" },
    { id: 8, name: "Mirror Work Lehenga", brand: "Jaipur Collective", price: 7499, orig: 13499, disc: 44, rating: 4.9, reviews: 362, badge: "SIGNATURE", badgeCol: "#E8C97A", accent: "#E8C97A", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#c0392b", "#E8C97A", "#1a1812"], sizes: ["XS", "S", "M", "L"], tag: "NEW" },
    { id: 9, name: "Chanderi Tissue Saree", brand: "Heritage Weaves", price: 5299, orig: 9499, disc: 44, rating: 4.8, reviews: 215, badge: "WOVEN", badgeCol: "#C9A96E", accent: "#C9A96E", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#F5F0E8", "#C9A96E", "#8A8070"], sizes: ["Free Size"], tag: "TRENDING" },
    { id: 10, name: "Resham Embroidered Gown", brand: "NewMe Atelier", price: 15999, orig: 28999, disc: 45, rating: 5.0, reviews: 89, badge: "BRIDAL", badgeCol: "#e85d4a", accent: "#e85d4a", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#F5F0E8", "#E8C97A", "#c0392b"], sizes: ["XS", "S", "M", "L", "XL"], tag: "LIMITED" },
    { id: 11, name: "Kantha Stitch Jacket", brand: "Artisan Republic", price: 4299, orig: 7799, disc: 45, rating: 4.7, reviews: 487, badge: "ETHICAL", badgeCol: "#6fcf97", accent: "#6fcf97", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#1a1812", "#C9A96E", "#3a3530"], sizes: ["S", "M", "L", "XL"], tag: "POPULAR" },
    { id: 12, name: "Raw Silk Palazzo Set", brand: "Studio Noir", price: 3499, orig: 5999, disc: 42, rating: 4.6, reviews: 718, badge: "EXCLUSIVE", badgeCol: "#C9A96E", accent: "#C9A96E", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=480&h=600&fit=crop&q=85&auto=format", himg: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=480&h=600&fit=crop&q=85&auto=format", colors: ["#8A8070", "#F5F0E8", "#1a1812"], sizes: ["XS", "S", "M", "L", "XL", "XXL"], tag: "NEW" },
];

const FILTERS = ["All", "Lehengas", "Sarees", "Co-ords", "Blazers", "Gowns", "Accessories"];
const SORT_OPTIONS = ["Featured", "Newest First", "Price: Low–High", "Price: High–Low", "Top Rated"];

// ─────────────────────────────────────────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────────────────────────────────────────
const Stars = ({ rating, accent }) => (
    <div className="flex items-center gap-0.5" style={{ color: accent }}>
        {Array.from({ length: 5 }).map((_, i) => (
            <StarFull key={i} c={`w-2.5 h-2.5 ${i < Math.floor(rating) ? "" : "opacity-25"}`} />
        ))}
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
const ProductCard = ({ p, index, isListView }) => {
    const [wish, setWish] = useState(false);
    const [added, setAdded] = useState(false);
    const [selColor, setSel] = useState(0);
    const [visible, setVis] = useState(false);
    const ref = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
            { threshold: 0.08 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const handleCart = () => {
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    if (isListView) {
        return (
            <div ref={ref} className="product-card flex gap-5 p-4 rounded-2xl cursor-pointer transition-all duration-300 group"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(201,169,110,0.12)",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(-16px)",
                    transition: `opacity 0.5s ease ${index * 0.04}s, transform 0.5s ease ${index * 0.04}s, background 0.2s`,
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,110,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl flex-shrink-0" style={{ width: "110px", height: "140px" }}>
                    <img src={p.img} alt={p.name} className="card-img w-full h-full object-cover transition-transform duration-700" loading="lazy" draggable={false} />
                    <div className="absolute top-2 left-2">
                        <span className="text-[8px] font-black tracking-wide uppercase px-1.5 py-0.5 rounded-md"
                            style={{ background: p.badgeCol, color: "#0C0C0C" }}>{p.badge}</span>
                    </div>
                </div>
                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] mb-0.5" style={{ color: "#8A8070" }}>{p.brand}</p>
                        <h3 className="font-bold text-white text-sm leading-snug mb-1 font-display">{p.name}</h3>
                        <Stars rating={p.rating} accent={p.accent} />
                        <p className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,232,0.4)" }}>{p.reviews.toLocaleString()} reviews</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-black text-white text-base">₹{p.price.toLocaleString()}</span>
                                <span className="text-xs line-through" style={{ color: "rgba(245,240,232,0.35)" }}>₹{p.orig.toLocaleString()}</span>
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md" style={{ background: "rgba(201,169,110,0.15)", color: p.accent }}>{p.disc}% off</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setWish(w => !w)} className="p-1.5 rounded-full transition-all"
                                style={{ background: "rgba(255,255,255,0.07)", color: wish ? "#e85d4a" : "rgba(245,240,232,0.5)" }}>
                                <HeartIcon c="w-3.5 h-3.5" filled={wish} />
                            </button>
                            <button onClick={handleCart} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[11px] transition-all"
                                style={{ background: added ? "#6fcf97" : p.accent, color: "#0C0C0C" }}>
                                {added ? <CheckIcon c="w-3 h-3" /> : <CartIcon c="w-3 h-3" />}
                                {added ? "Added" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={ref} className="product-card card-shadow cursor-pointer rounded-2xl overflow-hidden transition-all duration-300"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.52s ease ${index * 0.06}s, transform 0.52s ease ${index * 0.06}s`,
                background: "#141410",
                border: "1px solid rgba(201,169,110,0.10)",
            }}>

            {/* ── IMAGE ── */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                {/* Main img */}
                <img src={p.img} alt={p.name}
                    className="card-img absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out"
                    loading="lazy" draggable={false} />
                {/* Hover img */}
                <img src={p.himg} alt=""
                    className="hover-overlay absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-opacity duration-500"
                    loading="lazy" draggable={false} />

                {/* Dark vignette */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(180deg,transparent 50%,rgba(12,12,12,0.55) 100%)" }} />

                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="text-[8px] font-black tracking-[0.12em] uppercase px-2 py-1 rounded-lg"
                        style={{ background: p.badgeCol, color: "#0C0C0C", letterSpacing: "0.1em" }}>
                        {p.badge}
                    </span>
                </div>

                {/* Discount */}
                <div className="absolute top-3 right-3 z-10">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-lg"
                        style={{ background: "rgba(12,12,12,0.72)", color: p.accent, backdropFilter: "blur(6px)" }}>
                        -{p.disc}%
                    </span>
                </div>

                {/* Wishlist */}
                <button onClick={() => setWish(w => !w)}
                    className="absolute right-3 top-12 z-20 flex items-center justify-center rounded-full transition-all duration-300"
                    style={{
                        width: "32px", height: "32px",
                        background: wish ? "#e85d4a" : "rgba(255,255,255,0.88)",
                        color: wish ? "#fff" : "#0C0C0C",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
                    }}>
                    <HeartIcon c="w-3.5 h-3.5" filled={wish} />
                </button>

                {/* Color dots */}
                <div className="absolute left-3 bottom-14 z-10 flex items-center gap-1.5">
                    {p.colors.map((col, ci) => (
                        <button key={ci} onClick={() => setSel(ci)}
                            className="rounded-full transition-all duration-200"
                            style={{
                                width: selColor === ci ? "13px" : "9px",
                                height: selColor === ci ? "13px" : "9px",
                                background: col,
                                border: selColor === ci ? "2px solid #F5F0E8" : "1.5px solid rgba(255,255,255,0.3)",
                                boxShadow: selColor === ci ? `0 0 0 2px ${col}` : "none",
                            }} />
                    ))}
                </div>

                {/* Quick Add slides up */}
                <div className="quick-add absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2.5
                        translate-y-full opacity-0 transition-all duration-350"
                    style={{ background: "rgba(12,12,12,0.82)", backdropFilter: "blur(8px)" }}>
                    <div className="flex items-center gap-1.5">
                        {p.sizes.slice(0, 3).map(sz => (
                            <span key={sz} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(245,240,232,0.75)" }}>
                                {sz}
                            </span>
                        ))}
                        {p.sizes.length > 3 && <span className="text-[9px]" style={{ color: "rgba(245,240,232,0.4)" }}>+{p.sizes.length - 3}</span>}
                    </div>
                    <button onClick={handleCart}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] transition-all active:scale-95"
                        style={{
                            background: added ? "#6fcf97" : p.accent,
                            color: "#0C0C0C",
                            boxShadow: `0 3px 12px ${p.accent}50`,
                        }}>
                        {added ? <CheckIcon c="w-3 h-3" /> : <CartIcon c="w-3 h-3" />}
                        {added ? "Added!" : "Quick Add"}
                    </button>
                </div>
            </div>

            {/* ── INFO ── */}
            <div className="px-3.5 pt-3 pb-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] mb-0.5" style={{ color: "#6a6055" }}>{p.brand}</p>
                <h3 className="font-bold text-white text-sm leading-snug mb-1.5 font-display"
                    style={{ letterSpacing: "-0.01em" }}>{p.name}</h3>

                <div className="flex items-center gap-1.5 mb-2.5">
                    <Stars rating={p.rating} accent={p.accent} />
                    <span className="text-[9px] font-semibold" style={{ color: "rgba(245,240,232,0.4)" }}>
                        ({p.reviews.toLocaleString()})
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-black text-white" style={{ fontSize: "16px" }}>₹{p.price.toLocaleString()}</span>
                            <span className="text-[10px] line-through" style={{ color: "rgba(245,240,232,0.3)" }}>₹{p.orig.toLocaleString()}</span>
                        </div>
                        <span className="text-[9px] font-black" style={{ color: p.accent }}>
                            Save ₹{(p.orig - p.price).toLocaleString()}
                        </span>
                    </div>
                    <button onClick={() => navigate(`/exclusiveproducts/${p.sku}`)} className="p-2 rounded-xl transition-all hover:scale-105"
                        style={{ background: "rgba(201,169,110,0.08)", color: "rgba(245,240,232,0.4)" }}>
                        <EyeIcon c="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// HERO HEADER
// ─────────────────────────────────────────────────────────────────────────────
const PageHero = () => {
    const [vis, setVis] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);

    return (
        <div className="relative overflow-hidden py-16 md:py-24 px-4 md:px-6 lg:px-10 xl:px-14 text-center">
            {/* Background radial glow */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 55% at 50% 20%,rgba(201,169,110,0.09) 0%,transparent 70%)" }} />

            {/* Rotating ring */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-72 h-72 pointer-events-none opacity-6"
                style={{ animation: "rotateSlow 60s linear infinite" }}>
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    {[90, 75, 60].map((r, i) => (
                        <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="#C9A96E" strokeWidth="0.4"
                            strokeDasharray={`${4 + i} ${8 + i * 2}`} />
                    ))}
                </svg>
            </div>

            <div style={{ opacity: vis ? 1 : 0, animation: vis ? "fadeUp 0.7s ease 0.1s both" : "none" }}>
                {/* Members pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{ background: "rgba(201,169,110,0.10)", border: "1px solid rgba(201,169,110,0.25)" }}>
                    <GemIcon c="w-3.5 h-3.5 text-[#C9A96E]" />
                    <span className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: "#C9A96E" }}>
                        Members Exclusive
                    </span>
                </div>
            </div>

            {/* Headline */}
            <div style={{ opacity: vis ? 1 : 0, animation: vis ? "fadeUp 0.7s ease 0.22s both" : "none" }}>
                <h1 className="font-black leading-none mb-2 font-display"
                    style={{ fontSize: "clamp(38px,7vw,80px)", color: "#F5F0E8", letterSpacing: "-0.03em" }}>
                    Exclusive
                </h1>
                <h1 className="font-black leading-none font-display gold-shimmer"
                    style={{ fontSize: "clamp(38px,7vw,80px)", letterSpacing: "-0.03em" }}>
                    Collection
                </h1>
            </div>

            {/* Sub */}
            <p className="mt-5 font-body text-base font-medium max-w-xl mx-auto leading-relaxed"
                style={{
                    color: "rgba(245,240,232,0.50)",
                    opacity: vis ? 1 : 0,
                    animation: vis ? "fadeUp 0.6s ease 0.42s both" : "none",
                }}>
                Handpicked luxury. Members-only drops. Styles you won't find anywhere else.
            </p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 md:gap-12 mt-8 flex-wrap"
                style={{ opacity: vis ? 1 : 0, animation: vis ? "fadeUp 0.6s ease 0.58s both" : "none" }}>
                {[["500+", "Exclusive Styles"], ["Members", "Only Access"], ["Free", "Shipping"]].map(([v, l], i) => (
                    <div key={i} className="flex flex-col items-center">
                        <span className="font-black text-lg font-display" style={{ color: "#C9A96E" }}>{v}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] mt-0.5"
                            style={{ color: "rgba(245,240,232,0.35)" }}>{l}</span>
                    </div>
                ))}
            </div>

            {/* Gold rule */}
            <div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg,transparent,#C9A96E50,transparent)" }} />
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// TOOLBAR  (filters + sort + view toggle)
// ─────────────────────────────────────────────────────────────────────────────
const Toolbar = ({ activeFilter, setFilter, sort, setSort, viewMode, setView, count }) => {
    const [sortOpen, setSortOpen] = useState(false);
    const sortRef = useRef(null);

    useEffect(() => {
        const fn = e => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    return (
        <div className="sticky top-0 z-20 py-3 px-4 md:px-6 lg:px-10 xl:px-14"
            style={{
                background: "rgba(12,12,12,0.92)", backdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(201,169,110,0.10)"
            }}>

            {/* Filter pills row */}
            <div className="filter-track flex items-center gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: "none" }}>
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className="flex-shrink-0 text-[11px] font-bold px-4 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap font-body"
                        style={activeFilter === f
                            ? { background: "linear-gradient(135deg,#C9A96E,#a8843f)", color: "#0C0C0C", boxShadow: "0 4px 14px rgba(201,169,110,0.35)" }
                            : { background: "rgba(255,255,255,0.05)", color: "rgba(245,240,232,0.60)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Bottom row: count + sort + view */}
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold font-body" style={{ color: "rgba(245,240,232,0.35)" }}>
                    <span style={{ color: "#C9A96E", fontWeight: 700 }}>{count}</span> exclusive pieces
                </p>
                <div className="flex items-center gap-2">
                    {/* Sort */}
                    <div className="relative" ref={sortRef}>
                        <button onClick={() => setSortOpen(o => !o)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all font-body"
                            style={{
                                background: "rgba(255,255,255,0.05)", color: "rgba(245,240,232,0.65)",
                                border: "1px solid rgba(255,255,255,0.08)"
                            }}>
                            <FilterIcon c="w-3 h-3" />
                            {sort}
                            <ChevRight c={`w-3 h-3 transition-transform ${sortOpen ? "rotate-90" : ""}`} />
                        </button>
                        {sortOpen && (
                            <div className="absolute right-0 top-full mt-1.5 rounded-xl overflow-hidden z-50 min-w-[180px]"
                                style={{
                                    background: "#1a1812", border: "1px solid rgba(201,169,110,0.18)",
                                    boxShadow: "0 16px 40px rgba(0,0,0,0.5)"
                                }}>
                                {SORT_OPTIONS.map(opt => (
                                    <button key={opt} onClick={() => { setSort(opt); setSortOpen(false); }}
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-semibold
                                     text-left transition-colors font-body"
                                        style={{ color: sort === opt ? "#C9A96E" : "rgba(245,240,232,0.65)" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(201,169,110,0.08)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        {opt}
                                        {sort === opt && <CheckIcon c="w-3 h-3" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* View mode */}
                    <div className="flex items-center rounded-xl overflow-hidden"
                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                        {[{ id: "grid", Icon: GridIcon }, { id: "list", Icon: ListIcon }].map(({ id, Icon }) => (
                            <button key={id} onClick={() => setView(id)}
                                className="p-1.5 transition-colors"
                                style={{
                                    background: viewMode === id ? "rgba(201,169,110,0.18)" : "transparent",
                                    color: viewMode === id ? "#C9A96E" : "rgba(245,240,232,0.35)",
                                }}>
                                <Icon c="w-3.5 h-3.5" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED SPOTLIGHT  (first product full-width banner)
// ─────────────────────────────────────────────────────────────────────────────
const FeaturedSpotlight = () => {
    const [vis, setVis] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const p = PRODUCTS[0];
    return (
        <div ref={ref} className="mx-4 md:mx-6 lg:mx-10 xl:mx-14 rounded-3xl overflow-hidden mb-8"
            style={{
                opacity: vis ? 1 : 0, transition: "opacity 0.7s ease, transform 0.7s ease",
                transform: vis ? "scale(1)" : "scale(0.97)",
                border: "1px solid rgba(201,169,110,0.15)",
                background: "#141410",
            }}>
            <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative overflow-hidden md:w-2/5" style={{ minHeight: "320px" }}>
                    <img src={p.img} alt={p.name}
                        className="w-full h-full object-cover object-top"
                        style={{ minHeight: "320px", transition: "transform 0.8s ease" }}
                        loading="eager" draggable={false} />
                    <div className="absolute inset-0"
                        style={{ background: "linear-gradient(135deg,rgba(12,12,12,0.4) 0%,transparent 60%)" }} />
                    <div className="absolute top-5 left-5">
                        <span className="text-[10px] font-black tracking-[0.14em] uppercase px-3 py-1.5 rounded-full"
                            style={{ background: p.badgeCol, color: "#0C0C0C" }}>SPOTLIGHT</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center px-7 py-8 md:px-10 md:py-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] mb-2" style={{ color: "#C9A96E" }}>
                        Editor's Pick
                    </p>
                    <h2 className="font-black leading-tight mb-3 font-display"
                        style={{ fontSize: "clamp(24px,3.5vw,40px)", color: "#F5F0E8", letterSpacing: "-0.02em" }}>
                        {p.name}
                    </h2>
                    <p className="text-sm mb-5 font-body" style={{ color: "rgba(245,240,232,0.5)", lineHeight: 1.7 }}>
                        Crafted with the finest silk organza, this piece embodies the pinnacle of Indian bridal fashion.
                        Intricate hand-embroidery meets contemporary silhouette.
                    </p>
                    <div className="flex items-center gap-3 mb-6">
                        <Stars rating={p.rating} accent={p.accent} />
                        <span className="text-xs font-semibold font-body" style={{ color: "rgba(245,240,232,0.4)" }}>
                            {p.reviews} verified reviews
                        </span>
                    </div>
                    <div className="flex items-center gap-5 mb-7">
                        <div>
                            <span className="font-black text-white font-display" style={{ fontSize: "28px" }}>
                                ₹{p.price.toLocaleString()}
                            </span>
                            <span className="text-sm line-through ml-2 font-body" style={{ color: "rgba(245,240,232,0.3)" }}>
                                ₹{p.orig.toLocaleString()}
                            </span>
                        </div>
                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full font-body"
                            style={{ background: "rgba(232,201,122,0.12)", color: "#E8C97A" }}>
                            Save ₹{(p.orig - p.price).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl
                               font-black text-sm tracking-wide transition-all hover:scale-105 active:scale-95 font-body"
                            style={{
                                background: "linear-gradient(135deg,#C9A96E,#a8843f)", color: "#0C0C0C",
                                boxShadow: "0 6px 24px rgba(201,169,110,0.40)"
                            }}>
                            <CartIcon c="w-4 h-4" />
                            Add to Cart
                        </button>
                        <button className="p-3.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                            style={{
                                background: "rgba(255,255,255,0.06)", color: "rgba(245,240,232,0.6)",
                                border: "1px solid rgba(255,255,255,0.08)"
                            }}>
                            <HeartIcon c="w-4 h-4" />
                        </button>
                        <button className="p-3.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                            style={{
                                background: "rgba(255,255,255,0.06)", color: "rgba(245,240,232,0.6)",
                                border: "1px solid rgba(255,255,255,0.08)"
                            }}>
                            <ShareIcon c="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ExclusiveProductsPage() {
    const [activeFilter, setFilter] = useState("All");
    const [sort, setSort] = useState("Featured");
    const [viewMode, setView] = useState("grid");

    const filtered = PRODUCTS; // add real filter logic when wired to backend

    return (
        <>
            <Header />
            <div className="min-h-screen font-body" style={{ background: "#0C0C0C" }}>
                <Styles />

                {/* ── PAGE HERO ── */}
                <PageHero />

                {/* ── FEATURED SPOTLIGHT ── */}
                <FeaturedSpotlight />

                {/* ── TOOLBAR ── */}
                <Toolbar
                    activeFilter={activeFilter} setFilter={setFilter}
                    sort={sort} setSort={setSort}
                    viewMode={viewMode} setView={setView}
                    count={filtered.length}
                />

                {/* ── PRODUCT GRID / LIST ── */}
                <div className="px-4 md:px-6 lg:px-10 xl:px-14 py-8">
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                            {filtered.map((p, i) => (
                                <ProductCard key={p.id} p={p} index={i} isListView={false} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {filtered.map((p, i) => (
                                <ProductCard key={p.id} p={p} index={i} isListView />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── LOAD MORE ── */}
                <div className="flex justify-center pb-20 px-4">
                    <button
                        className="flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-sm tracking-wide
                     transition-all duration-300 hover:scale-105 active:scale-95 font-body"
                        style={{
                            background: "linear-gradient(135deg,rgba(201,169,110,0.12),rgba(201,169,110,0.05))",
                            color: "#C9A96E",
                            border: "1.5px solid rgba(201,169,110,0.25)",
                            boxShadow: "0 4px 20px rgba(12,12,12,0.3)",
                        }}
                    >
                        Discover More Exclusives
                        <ChevRight c="w-4 h-4" />
                    </button>
                </div>

                {/* ── FOOTER STRIP ── */}
                <div className="w-full h-px" style={{ background: "linear-gradient(90deg,transparent,#C9A96E40,transparent)" }} />
                <div className="py-6 text-center px-4">
                    <p className="text-[11px] font-semibold font-body" style={{ color: "rgba(245,240,232,0.25)" }}>
                        All exclusive pieces are authenticated · Members-only pricing · Free delivery above ₹999
                    </p>
                </div>
            </div>
        </>
    );
}