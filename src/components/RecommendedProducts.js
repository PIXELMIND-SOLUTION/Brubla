import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DATA
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "Linen Kurta",
    brand: "NewMe Originals",
    price: 899,
    originalPrice: 1799,
    discount: 50,
    rating: 4.8,
    reviews: 1240,
    badge: "BESTSELLER",
    badgeColor: "#C9A96E",
    isNew: false,
    wishlist: false,
    img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#C9A96E", "#8A8070", "#1a1812"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Silk Blend Saree",
    brand: "Heritage Weaves",
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    rating: 4.9,
    reviews: 863,
    badge: "EXCLUSIVE",
    badgeColor: "#E8C97A",
    isNew: false,
    wishlist: false,
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#c0392b", "#1a1812", "#C9A96E"],
    sizes: ["Free Size"],
  },
  {
    id: 3,
    name: "Casual Co-ord Set",
    brand: "Studio NM",
    price: 1199,
    originalPrice: 2199,
    discount: 45,
    rating: 4.7,
    reviews: 528,
    badge: "NEW",
    badgeColor: "#6fcf97",
    isNew: true,
    wishlist: false,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#F5F0E8", "#0C0C0C", "#6fcf97"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 4,
    name: "Oxford Sneakers",
    brand: "StepOut",
    price: 1599,
    originalPrice: 2999,
    discount: 47,
    rating: 4.6,
    reviews: 2103,
    badge: "FLASH",
    badgeColor: "#e85d4a",
    isNew: false,
    wishlist: false,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#1a1812", "#F5F0E8", "#c0392b"],
    sizes: ["6", "7", "8", "9", "10"],
  },
  {
    id: 5,
    name: "Premium Blazer",
    brand: "NewMe Atelier",
    price: 3299,
    originalPrice: 5999,
    discount: 45,
    rating: 4.9,
    reviews: 412,
    badge: "PREMIUM",
    badgeColor: "#C9A96E",
    isNew: false,
    wishlist: false,
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#1a1812", "#3a3530", "#C9A96E"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 6,
    name: "Floral Maxi Dress",
    brand: "Bloom Studio",
    price: 1399,
    originalPrice: 2499,
    discount: 44,
    rating: 4.7,
    reviews: 776,
    badge: "TRENDING",
    badgeColor: "#C9A96E",
    isNew: true,
    wishlist: false,
    img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#e85d4a", "#F5F0E8", "#6fcf97"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 7,
    name: "Ethnic Jacket",
    brand: "Craft House",
    price: 2199,
    originalPrice: 3999,
    discount: 45,
    rating: 4.8,
    reviews: 334,
    badge: "HANDCRAFTED",
    badgeColor: "#E8C97A",
    isNew: false,
    wishlist: false,
    img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#C9A96E", "#8A8070", "#0C0C0C"],
    sizes: ["S", "M", "L"],
  },
  {
    id: 8,
    name: "Skincare Ritual Kit",
    brand: "Glow Lab",
    price: 999,
    originalPrice: 1799,
    discount: 44,
    rating: 4.9,
    reviews: 1891,
    badge: "LOVED",
    badgeColor: "#6fcf97",
    isNew: false,
    wishlist: false,
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#F5F0E8", "#6fcf97"],
    sizes: ["One Size"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z" />
  </svg>
);

const StarIcon = ({ filled = true, size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CartAddIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
    <line x1="12" y1="13" x2="12" y2="19" />
    <line x1="9" y1="16" x2="15" y2="16" />
  </svg>
);

const ChevronIcon = ({ dir = "right", size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    {dir === "right" ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
  </svg>
);

const EyeIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const empty = 5 - Math.ceil(rating);
  return (
    <div className="flex items-center gap-0.5" style={{ color: "#C9A96E" }}>
      {Array.from({ length: full }).map((_, i) => <StarIcon key={`f${i}`} filled />)}
      {rating % 1 !== 0 && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <defs>
            <linearGradient id={`hg${full}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill={`url(#hg${full})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => <StarIcon key={`e${i}`} filled={false} />)}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
const ProductCard = ({ product, index }) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWish] = useState(product.wishlist);
  const [addedCart, setCart] = useState(false);
  const [selColor, setColor] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleCart = (e) => {
    e.preventDefault();
    setCart(true);
    setTimeout(() => setCart(false), 1800);
  };

  return (
    <div
      ref={ref}
      className="flex-shrink-0 group cursor-pointer"
      style={{
        width: "clamp(180px,38vw,230px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── IMAGE BLOCK ── */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "3/4",
          boxShadow: hovered
            ? "0 20px 50px rgba(12,12,12,0.18), 0 6px 20px rgba(12,12,12,0.10)"
            : "0 4px 18px rgba(12,12,12,0.08)",
          transition: "box-shadow 0.4s ease",
        }}
      >
        {/* Main image */}
        <img
          src={product.img}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            transition: "opacity 0.45s ease, transform 0.6s ease",
            opacity: hovered ? 0 : 1,
            transform: hovered ? "scale(1.06)" : "scale(1.0)",
          }}
          loading="lazy"
          draggable={false}
        />
        {/* Hover image */}
        <img
          src={product.hoverImg}
          alt={`${product.name} alt`}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            transition: "opacity 0.45s ease, transform 0.6s ease",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1.0)" : "scale(1.06)",
          }}
          loading="lazy"
          draggable={false}
        />

        {/* Subtle bottom vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg,transparent 55%,rgba(12,12,12,0.22) 100%)" }} />

        {/* ── BADGE ── */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[9px] font-black tracking-[0.14em] uppercase px-2 py-1"
            style={{ background: "#6F4E37", color: "#fff", letterSpacing: "0.1em" }}
          >
            {product.badge}
          </span>
        </div>

        {/* ── DISCOUNT CHIP ── */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="text-[9px] font-black px-1.5 py-0.5"
            style={{
              background: "#6F4E37", color: "#fff",
              backdropFilter: "blur(4px)"
            }}
          >
            -{product.discount}%
          </span>
        </div>

        {/* ── WISHLIST BUTTON ── */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWish((w) => !w);
          }}
          className="
    absolute z-20 flex items-center justify-center
    transition-all duration-300
    rounded-full
  "
          style={{
            top: hovered ? "46px" : "44px",
            right: "10px",

            width: "30px",
            height: "30px",

            background: wishlisted
              ? "#e85d4a"
              : "rgba(255,255,255,0.92)",

            color: wishlisted ? "#fff" : "#0C0C0C",

            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",

            transform: hovered ? "scale(1)" : "scale(0.9)",
            opacity: hovered ? 1 : 0.85,
          }}
          aria-label="Wishlist"
        >
          <HeartIcon filled={wishlisted} size={14} />
        </button>

        {/* ── QUICK VIEW ── slides up on hover ── */}
        <button
          className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            height: "40px",
            background: "rgba(12,12,12,0.82)",
            backdropFilter: "blur(6px)",
            color: "#F5F0E8",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            borderRadius: "0 0 0px 0px",
          }}
          onClick={(e) => e.preventDefault()}
        >
          <EyeIcon size={13} />
          QUICK VIEW
        </button>

        {/* ── COLOR DOTS ── appear on hover ── */}
        <div
          className="absolute left-3 bottom-12 z-10 flex items-center gap-1.5 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(4px)" }}
        >
          {product.colors.map((col, ci) => (
            <button
              key={ci}
              onClick={(e) => { e.preventDefault(); setColor(ci); }}
              className="transition-all duration-200"
              style={{
                width: selColor === ci ? "14px" : "10px",
                height: selColor === ci ? "14px" : "10px",
                background: "#6F4E37",
                border: selColor === ci ? "2px solid #FEFCF8" : "1.5px solid rgba(255,255,255,0.4)",
                boxShadow: selColor === ci ? `0 0 0 2px ${col}` : "none",
              }}
              aria-label={`Color ${ci + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── INFO BLOCK ── */}
      <div className="mt-3 px-0.5">
        {/* Brand */}
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5"
          style={{ color: "#8A8070" }}>
          {product.brand}
        </p>

        {/* Product name */}
        <h3
          className="font-black leading-tight mb-1.5 truncate"
          style={{
            fontSize: "clamp(13px,2vw,15px)",
            color: "#0C0C0C",
            fontFamily: "Georgia,'Times New Roman',serif",
            letterSpacing: "-0.01em",
          }}
        >
          {product.name}
        </h3>

        {/* Rating row */}
        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={product.rating} />
          <span className="text-[10px] font-semibold" style={{ color: "#6F4E37" }}>
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Sizes row */}
        <div className="flex items-center gap-1 mb-2.5 flex-wrap">
          {product.sizes.slice(0, 4).map(sz => (
            <span key={sz}
              className="text-[9px] font-bold px-1.5 py-0.5"
              style={{ background: "#F5F0E8", color: "#3a3530", border: "1px solid #EDE7D9" }}>
              {sz}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span className="text-[9px] font-bold" style={{ color: "#8A8070" }}>
              +{product.sizes.length - 4}
            </span>
          )}
        </div>

        {/* Price row + Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-black" style={{ fontSize: "clamp(15px,2.5vw,18px)", color: "#0C0C0C" }}>
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-[11px] line-through font-medium" style={{ color: "#8A8070" }}>
                ₹{product.originalPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-black" style={{ color: "#6F4E37" }}>
              Save ₹{(product.originalPrice - product.price).toLocaleString()}
            </span>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleCart}
            className="flex items-center justify-center transition-all duration-300 active:scale-95"
            style={{
              width: "38px",
              height: "38px",
              background: addedCart
                ? "#6fcf97"
                : "#6F4E37",
              color: addedCart ? "#fff" : "#fff",
              boxShadow: addedCart
                ? "0 4px 14px rgba(111,207,151,0.4)"
                : "0 4px 14px rgba(12,12,12,0.25)",
              border: "1.5px solid rgba(201,169,110,0.2)",
              transform: addedCart ? "scale(1.12)" : "scale(1)",
            }}
            aria-label="Add to cart"
          >
            {addedCart
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
              : <CartAddIcon size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FILTER TABS
// ─────────────────────────────────────────────────────────────────────────────
const FILTERS = ["All", "Trending", "New Arrivals", "Under ₹999", "Premium", "Sale"];

const FilterTabs = ({ active, onChange }) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
    {FILTERS.map(f => (
      <button
        key={f}
        onClick={() => onChange(f)}
        className="flex-shrink-0 text-[11px] font-bold px-3.5 py-1.5 transition-all duration-200 whitespace-nowrap"
        style={
          active === f
            ? {
              background: "#6F4E37", color: "#fff",
              border: "1.5px solid rgba(201,169,110,0.3)",
              boxShadow: "0 4px 14px rgba(12,12,12,0.2)"
            }
            : {
              background: "#F5F0E8", color: "#3a3530",
              border: "1.5px solid #EDE7D9"
            }
        }
      >
        {f}
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL ARROW BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const ScrollBtn = ({ dir, onClick, show }) => (
  <button
    onClick={onClick}
    aria-label={dir}
    className="flex-shrink-0 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
    style={{
      width: "36px", height: "36px",
      background: "#6F4E37",
      color: "#fff",
      border: "1.5px solid rgba(201,169,110,0.25)",
      boxShadow: "0 4px 14px rgba(12,12,12,0.2)",
      opacity: show ? 1 : 0.25,
      pointerEvents: show ? "auto" : "none",
    }}
  >
    <ChevronIcon dir={dir === "left" ? "left" : "right"} size={13} />
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function RecommendedProducts() {
  const [filter, setFilter] = useState("All");
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [headerVis, setHdrVis] = useState(false);
  const trackRef = useRef(null);
  const headerRef = useRef(null);

  // header entrance animation
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHdrVis(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // scroll edge detection
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
    trackRef.current?.scrollBy({ left: dir === "right" ? 500 : -500, behavior: "smooth" });
  };

  return (
    <section
      className="w-full py-12 md:py-16 overflow-hidden"
      style={{ background: "#fff" }}
      aria-label="Recommended Products"
    >
      {/* Injected styles */}
      <style>{`
        .prod-track::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* ── SECTION HEADER ── */}
        <div
          ref={headerRef}
          className="px-4 md:px-6 lg:px-10 xl:px-14 mb-6 md:mb-8"
          style={{
            opacity: headerVis ? 1 : 0,
            transform: headerVis ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.55s ease, transform 0.55s ease",
          }}
        >
          {/* Top row: title + arrows */}
          <div className="flex items-start justify-between mb-4 md:mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] mb-1"
                style={{ color: "#6F4E37" }}>
                Curated for you
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
                Recommended
              </h2>
              {/* Underline */}
              <div className="flex items-center gap-2 mt-2">
                <div className="h-[3px] w-10"
                  style={{ background: "linear-gradient(90deg,#6F4E37,#6F4E37)" }} />
                <div className="h-[3px] w-4"
                  style={{ background: "#6F4E37" }} />
                <div className="h-[3px] w-2"
                  style={{ background: "#6F4E37" }} />
              </div>
            </div>

            {/* Right: arrows + view all */}
            <div className="flex items-center gap-2 mt-1">
              <ScrollBtn dir="left" onClick={() => scrollBy("left")} show={canLeft} />
              <ScrollBtn dir="right" onClick={() => scrollBy("right")} show={canRight} />
              <button
                className="hidden sm:flex items-center gap-1.5 ml-1 text-xs font-black tracking-wide
                           transition-all duration-200 group"
                style={{ color: "#000" }}
              >
                View All
                <span className="flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{ width: "26px", height: "26px", background: "#6F4E37", color: "#fff" }}>
                  <ChevronIcon dir="right" size={11} />
                </span>
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <FilterTabs active={filter} onChange={setFilter} />
        </div>

        {/* ── PRODUCT SCROLL TRACK ── */}
        <div
          ref={trackRef}
          className="prod-track flex gap-4 overflow-x-auto"
          style={{
            paddingLeft: "clamp(16px,4vw,56px)",
            paddingRight: "clamp(16px,4vw,56px)",
            paddingBottom: "16px",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {PRODUCTS.map((p, i) => (
            <div key={p.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
          <div style={{ minWidth: "4px", flexShrink: 0 }} />
        </div>

        {/* ── MOBILE: View All button ── */}
        <div className="sm:hidden flex justify-center mt-5 px-4">
          <button
            className="w-full max-w-sm flex items-center justify-center gap-2 py-3.5
                       font-black text-sm tracking-wide transition-all active:scale-98"
            style={{
              background: "#6F4E37",
              color: "#fff",
              border: "1.5px solid rgba(201,169,110,0.2)",
              boxShadow: "0 6px 20px rgba(12,12,12,0.18)",
            }}
          >
            View All Products
            <ChevronIcon dir="right" size={13} />
          </button>
        </div>

      </div>
    </section>
  );
}