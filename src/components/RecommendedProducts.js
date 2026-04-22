import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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
    wishlist: false,
    imgs: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 2,
    name: "Silk Blend Saree",
    brand: "Heritage Weaves",
    price: 2499,
    originalPrice: 4999,
    wishlist: false,
    imgs: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 3,
    name: "Casual Co-ord Set",
    brand: "Studio NM",
    price: 1199,
    originalPrice: 2199,
    wishlist: false,
    imgs: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 4,
    name: "Oxford Sneakers",
    brand: "StepOut",
    price: 1599,
    originalPrice: 2999,
    wishlist: false,
    imgs: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 5,
    name: "Premium Blazer",
    brand: "NewMe Atelier",
    price: 3299,
    originalPrice: 5999,
    wishlist: false,
    imgs: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 6,
    name: "Floral Maxi Dress",
    brand: "Bloom Studio",
    price: 1399,
    originalPrice: 2499,
    wishlist: false,
    imgs: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 7,
    name: "Ethnic Jacket",
    brand: "Craft House",
    price: 2199,
    originalPrice: 3999,
    wishlist: false,
    imgs: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 8,
    name: "Skincare Ritual Kit",
    brand: "Glow Lab",
    price: 999,
    originalPrice: 1799,
    wishlist: false,
    imgs: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const BookmarkIcon = ({ filled, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CheckIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const ChevronIcon = ({ dir = "right", size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {dir === "right" ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
const ProductCard = ({ product, index }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWish] = useState(product.wishlist);
  const [addedCart, setCart] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleCart = (e) => {
    e.preventDefault();
    setCart(true);
    setTimeout(() => setCart(false), 1800);
  };

  const totalImgs = product.imgs.length;

  return (
    <div
      ref={ref}
      className={[
        "flex-shrink-0 cursor-pointer select-none",
        "w-[calc(25vw-12px)] min-w-[200px] max-w-[360px]",
        "transition-[opacity,transform] duration-500 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
      style={{ transitionDelay: `${index * 0.06}s` }}
    >
      {/* ── IMAGE CONTAINER ── */}
      <div className="relative overflow-hidden rounded-xl bg-[#efefed] aspect-[3/4]">

        {/* Images — switch on hover zone */}
        {product.imgs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={product.name}
            className={[
              "absolute inset-0 w-full h-full object-cover object-top",
              "transition-opacity duration-500 ease-in-out",
              activeImg === i ? "opacity-100" : "opacity-0",
            ].join(" ")}
            loading="lazy"
            draggable={false}
          />
        ))}

        {/* Invisible hover zones — split image horizontally for hover-switch */}
        {totalImgs > 1 && (
          <div className="absolute inset-0 z-[5] flex pointer-events-auto">
            {product.imgs.map((_, di) => (
              <div
                key={di}
                className="flex-1 h-full"
                onMouseEnter={() => setActiveImg(di)}
              />
            ))}
          </div>
        )}

        {/* ── BOOKMARK ── top right */}
        <button
          onClick={(e) => { e.preventDefault(); setWish(w => !w); }}
          className={[
            "absolute top-3 right-3 z-20",
            "w-8 h-8 flex items-center justify-center rounded-full",
            "transition-all duration-200",
            wishlisted
              ? "bg-black text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
              : "bg-white/75 backdrop-blur-sm text-[#1a1a1a] hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.10)]",
          ].join(" ")}
          aria-label="Save"
        >
          <BookmarkIcon filled={wishlisted} size={14} />
        </button>

        {/* ── DOT INDICATORS ── bottom center */}
        {totalImgs > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-1.5 pointer-events-none">
            {product.imgs.map((_, di) => (
              <div
                key={di}
                className={[
                  "rounded-full transition-all duration-300",
                  activeImg === di
                    ? "w-4 h-[5px] bg-white"
                    : "w-[5px] h-[5px] bg-white/50",
                ].join(" ")}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── INFO ROW ── */}
      <div className="mt-2.5 flex items-start justify-between gap-2 px-0.5">
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-[13px] font-normal text-[#1a1a1a] leading-snug truncate">
            {product.name}
          </p>
          <p className="text-[12px] text-[#888] mt-0.5 font-normal">
            RS. {product.price.toLocaleString()}
          </p>
        </div>

        {/* + / ✓ button */}
        <button
          onClick={handleCart}
          className={[
            "flex-shrink-0 w-8 h-8 flex items-center justify-center",
            "rounded-full border transition-all duration-300 active:scale-95 mt-0.5",
            addedCart
              ? "bg-black border-black text-white scale-[1.1]"
              : "bg-white border-[#ccc] text-[#1a1a1a] hover:border-[#1a1a1a]",
          ].join(" ")}
          aria-label="Add to cart"
        >
          {addedCart ? <CheckIcon size={13} /> : <PlusIcon size={14} />}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const ScrollBtn = ({ dir, onClick, show }) => (
  <button
    onClick={onClick}
    aria-label={dir}
    className={[
      "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full",
      "border border-[#ddd] bg-white text-[#1a1a1a]",
      "transition-all duration-200 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white",
      show ? "opacity-100 pointer-events-auto" : "opacity-25 pointer-events-none",
    ].join(" ")}
  >
    <ChevronIcon dir={dir === "left" ? "left" : "right"} size={12} />
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function RecommendedProducts() {
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [headerVis, setHdrVis] = useState(false);
  const trackRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

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
    trackRef.current?.scrollBy({ left: dir === "right" ? 600 : -600, behavior: "smooth" });
  };

  return (
    <section className="w-full py-8 md:py-12 bg-white overflow-hidden" aria-label="Recommended Products">
      <style>{`.prod-track::-webkit-scrollbar{display:none}`}</style>

      <div className="max-w-[1600px] mx-auto">

        {/* ── HEADER ── */}
        <div
          ref={headerRef}
          className={[
            "px-4 md:px-6 lg:px-8 mb-4 md:mb-5",
            "flex items-center justify-between",
            "transition-[opacity,transform] duration-500",
            headerVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          <h2 className="text-[14px] font-medium text-[#1a1a1a] tracking-wide">
            Recommended for you
          </h2>

          <div className="flex items-center gap-1.5">
            <ScrollBtn dir="left" onClick={() => scrollBy("left")} show={canLeft} />
            <ScrollBtn dir="right" onClick={() => scrollBy("right")} show={canRight} />
            <button
              onClick={() => navigate("/products")}
              className="hidden sm:flex items-center gap-0.5 text-[12px] text-[#999] hover:text-[#1a1a1a] transition-colors duration-200 ml-2"
            >
              View all
              <ChevronIcon dir="right" size={11} />
            </button>
          </div>
        </div>

        {/* ── PRODUCT TRACK ── */}
        <div
          ref={trackRef}
          className="prod-track flex gap-3 overflow-x-auto"
          style={{
            paddingLeft: "clamp(16px,2vw,32px)",
            paddingRight: "clamp(16px,2vw,32px)",
            paddingBottom: "8px",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {PRODUCTS.map((p, i) => (
            <div key={p.id} className="flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
          <div className="min-w-2 flex-shrink-0" />
        </div>

        {/* ── MOBILE VIEW ALL ── */}
        <div className="sm:hidden flex justify-center mt-5 px-4">
          <button
            onClick={() => navigate("/products")}
            className="text-[13px] text-[#999] underline underline-offset-4 hover:text-[#1a1a1a] transition-colors"
          >
            View all products
          </button>
        </div>

      </div>
    </section>
  );
}