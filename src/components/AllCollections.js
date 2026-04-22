import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DATA FOR EACH COLLECTION
// ─────────────────────────────────────────────────────────────────────────────

const GLOBAL_COLLECTION = [
  {
    id: 1,
    name: "Italian Leather Jacket",
    brand: "Brubla Global",
    price: 12999,
    originalPrice: 24999,
    imgs: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1548624313-0396c75e4a63?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 2,
    name: "Parisian Linen Blazer",
    brand: "Brubla Global",
    price: 8999,
    originalPrice: 15999,
    imgs: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 3,
    name: "Tokyo Streetwear Hoodie",
    brand: "Brubla Global",
    price: 3499,
    originalPrice: 6999,
    imgs: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1578768079046-ec1c1fb79c84?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 4,
    name: "New York Tailored Trousers",
    brand: "Brubla Global",
    price: 4999,
    originalPrice: 8999,
    imgs: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 5,
    name: "London Checkered Coat",
    brand: "Brubla Global",
    price: 11999,
    originalPrice: 19999,
    imgs: [
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1548624313-0396c75e4a63?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 6,
    name: "Milan Silk Scarf",
    brand: "Brubla Global",
    price: 2499,
    originalPrice: 4499,
    imgs: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
];

const LUXURY_COLLECTION = [
  {
    id: 1,
    name: "Hand-Embroidered Gown",
    brand: "Brubla Atelier",
    price: 45999,
    originalPrice: 89999,
    imgs: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 2,
    name: "Cashmere Wrap Coat",
    brand: "Brubla Atelier",
    price: 32999,
    originalPrice: 59999,
    imgs: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 3,
    name: "Diamond-Embellished Clutch",
    brand: "Brubla Atelier",
    price: 18999,
    originalPrice: 34999,
    imgs: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 4,
    name: "Silk Evening Gown",
    brand: "Brubla Atelier",
    price: 39999,
    originalPrice: 74999,
    imgs: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 5,
    name: "Pearl Necklace Set",
    brand: "Brubla Atelier",
    price: 24999,
    originalPrice: 45999,
    imgs: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 6,
    name: "Velvet Tuxedo Blazer",
    brand: "Brubla Atelier",
    price: 27999,
    originalPrice: 49999,
    imgs: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
];

const ORIGINALS_COLLECTION = [
  {
    id: 1,
    name: "Signature Kurta Set",
    brand: "Originals by Brubla",
    price: 4999,
    originalPrice: 9999,
    imgs: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 2,
    name: "Handblock Print Saree",
    brand: "Originals by Brubla",
    price: 8999,
    originalPrice: 16999,
    imgs: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 3,
    name: "Brubla Classic Shirt",
    brand: "Originals by Brubla",
    price: 2499,
    originalPrice: 4999,
    imgs: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 4,
    name: "Embroidered Waistcoat",
    brand: "Originals by Brubla",
    price: 5999,
    originalPrice: 10999,
    imgs: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 5,
    name: "Dupatta Set",
    brand: "Originals by Brubla",
    price: 3499,
    originalPrice: 6999,
    imgs: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1583391733956-3750e0b4e1cf?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 6,
    name: "Brubla Bomber Jacket",
    brand: "Originals by Brubla",
    price: 4499,
    originalPrice: 8499,
    imgs: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1578768079046-ec1c1fb79c84?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
];

const INDIAN_ROOTS = [
  {
    id: 1,
    name: "Banarasi Silk Saree",
    brand: "Indian Roots",
    price: 15999,
    originalPrice: 29999,
    imgs: [
      "https://images.unsplash.com/photo-1583391733956-3750e0b4e1cf?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 2,
    name: "Handwoven Khadi Kurta",
    brand: "Indian Roots",
    price: 3499,
    originalPrice: 6999,
    imgs: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 3,
    name: "Phulkari Dupatta",
    brand: "Indian Roots",
    price: 2499,
    originalPrice: 4999,
    imgs: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1583391733956-3750e0b4e1cf?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 4,
    name: "Bandhani Lehenga",
    brand: "Indian Roots",
    price: 12999,
    originalPrice: 24999,
    imgs: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 5,
    name: "Pashmina Shawl",
    brand: "Indian Roots",
    price: 8999,
    originalPrice: 16999,
    imgs: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 6,
    name: "Jutti Footwear",
    brand: "Indian Roots",
    price: 1999,
    originalPrice: 3999,
    imgs: [
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
];

const WEDDING_COLLECTION = [
  {
    id: 1,
    name: "Bridal Lehenga Set",
    brand: "Brubla Weddings",
    price: 45999,
    originalPrice: 89999,
    imgs: [
      "https://images.unsplash.com/photo-1583391733956-3750e0b4e1cf?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 2,
    name: "Groom Sherwani",
    brand: "Brubla Weddings",
    price: 34999,
    originalPrice: 64999,
    imgs: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 3,
    name: "Bridesmaid Saree",
    brand: "Brubla Weddings",
    price: 12999,
    originalPrice: 24999,
    imgs: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 4,
    name: "Celebration Gown",
    brand: "Brubla Weddings",
    price: 19999,
    originalPrice: 38999,
    imgs: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 5,
    name: "Wedding Accessory Set",
    brand: "Brubla Weddings",
    price: 5999,
    originalPrice: 11999,
    imgs: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
  {
    id: 6,
    name: "Reception Blazer",
    brand: "Brubla Weddings",
    price: 15999,
    originalPrice: 29999,
    imgs: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=600&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&q=80&auto=format",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const BookmarkIcon = ({ filled, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

const PlusIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CheckIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const ChevronIcon = ({ dir = "right", size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {dir === "right" ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD — editorial minimal style matching the reference
// ─────────────────────────────────────────────────────────────────────────────
const ProductCard = ({ product, index }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWish] = useState(false);
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

        {/* Images */}
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

        {/* Invisible hover zones — split horizontally for image switching */}
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
// COLLECTION SECTION (reusable)
// ─────────────────────────────────────────────────────────────────────────────
const CollectionSection = ({ id, title, subtitle, products, bgColor = "#fff" }) => {
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [headerVis, setHdrVis] = useState(false);
  const trackRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  // Stable class name for webkit scrollbar hiding
  const trackClass = `track-${id}`;

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
    <section
      className="w-full py-8 md:py-12 overflow-hidden"
      style={{ background: bgColor }}
      aria-label={title}
    >
      <style>{`.${trackClass}::-webkit-scrollbar { display: none; }`}</style>

      <div className="max-w-[1600px] mx-auto">

        {/* ── SECTION HEADER ── */}
        <div
          ref={headerRef}
          className={[
            "px-4 md:px-6 lg:px-8 mb-4 md:mb-5",
            "flex items-center justify-between",
            "transition-[opacity,transform] duration-500 ease-out",
            headerVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          <div className="flex flex-col">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#aaa] mb-0.5">
              {subtitle}
            </p>
            <h2 className="text-[15px] font-medium text-[#1a1a1a] tracking-wide leading-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <ScrollBtn dir="left" onClick={() => scrollBy("left")} show={canLeft} />
            <ScrollBtn dir="right" onClick={() => scrollBy("right")} show={canRight} />
            <button
              onClick={() => navigate(`/collections/${id}`)}
              className="hidden sm:flex items-center gap-0.5 text-[12px] text-[#999] hover:text-[#1a1a1a] transition-colors duration-200 ml-2"
            >
              View all
              <ChevronIcon dir="right" size={11} />
            </button>
          </div>
        </div>

        {/* ── PRODUCT SCROLL TRACK ── */}
        <div
          ref={trackRef}
          className={`${trackClass} flex gap-3 overflow-x-auto pb-2`}
          style={{
            paddingLeft: "clamp(16px,2vw,32px)",
            paddingRight: "clamp(16px,2vw,32px)",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {products.map((p, i) => (
            <div key={p.id} className="flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
          <div className="min-w-2 flex-shrink-0" />
        </div>

        {/* ── MOBILE VIEW ALL ── */}
        <div className="sm:hidden flex justify-center mt-4 px-4">
          <button
            onClick={() => navigate(`/collections/${id}`)}
            className="text-[13px] text-[#999] underline underline-offset-4 hover:text-[#1a1a1a] transition-colors"
          >
            View all {title}
          </button>
        </div>

      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIVIDER between sections
// ─────────────────────────────────────────────────────────────────────────────
const Divider = () => (
  <div className="w-full px-4 md:px-8">
    <div className="h-px bg-[#efefed]" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT — All Collections
// ─────────────────────────────────────────────────────────────────────────────
export default function AllCollections() {
  return (
    <div className="w-full bg-white">
      <CollectionSection
        id="1"
        title="Global Collections"
        subtitle="WORLD-CLASS CRAFTSMANSHIP"
        products={GLOBAL_COLLECTION}
        bgColor="#fff"
      />
      <Divider />
      <CollectionSection
        id="2"
        title="Luxury Collections"
        subtitle="BESPOKE ELEGANCE"
        products={LUXURY_COLLECTION}
        bgColor="#fafaf9"
      />
      <Divider />
      <CollectionSection
        id="3"
        title="Originals by Brubla"
        subtitle="SIGNATURE STYLE"
        products={ORIGINALS_COLLECTION}
        bgColor="#fff"
      />
      <Divider />
      <CollectionSection
        id="4"
        title="Indian Roots"
        subtitle="TIMELESS TRADITIONS"
        products={INDIAN_ROOTS}
        bgColor="#fafaf9"
      />
      <Divider />
      <CollectionSection
        id="5"
        title="Weddings & Celebrations"
        subtitle="YOUR SPECIAL DAY"
        products={WEDDING_COLLECTION}
        bgColor="#fff"
      />
    </div>
  );
}