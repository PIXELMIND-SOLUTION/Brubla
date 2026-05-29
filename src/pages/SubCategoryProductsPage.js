import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  ChevronDown, Heart, ShoppingBag, Star,
  SlidersHorizontal, X, LayoutGrid, List, ArrowLeft
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

const COFFEE = "#000";
const API_BASE = "http://31.97.228.17:4077";

// ─── URL normaliser ────────────────────────────────────────────────────────────
const normaliseUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  return url.replace(/https?:\/\/localhost:4077/g, API_BASE);
};

// ─── Get product image ─────────────────────────────────────────────────────────
// This endpoint returns `mainImage` (string), `mainImages` (array), or `variants[].images[]`
const getProductImage = (product) => {
  // 1) Single mainImage field (this endpoint's shape)
  if (product.mainImage) return normaliseUrl(product.mainImage);
  // 2) mainImages array
  if (Array.isArray(product.mainImages) && product.mainImages.length > 0)
    return normaliseUrl(product.mainImages[0]);
  // 3) variant images
  for (const v of product.variants || []) {
    if (v.mainImage) return normaliseUrl(v.mainImage);
    if (Array.isArray(v.images) && v.images.length > 0) return normaliseUrl(v.images[0]);
  }
  return "https://placehold.co/600x800/e5e7eb/64748b?text=No+Image";
};

// ─── Discount % ───────────────────────────────────────────────────────────────
const getDiscount = (product) => {
  const actual = product.displayActualPrice;
  const sale = product.displayPrice;
  if (actual && sale && actual > sale)
    return Math.round(((actual - sale) / actual) * 100);
  return product.maxDiscount || null;
};

// ─── INR formatter ────────────────────────────────────────────────────────────
const toINR = (usd) => {
  if (!usd && usd !== 0) return "—";
  return "₹" + (usd * 83).toLocaleString("en-IN", { maximumFractionDigits: 0 });
};

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
];

// ─── Price filter buckets ─────────────────────────────────────────────────────
const PRICE_RANGES = [
  { label: "Under ₹2,000", min: 0, max: 2000 },
  { label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "Over ₹10,000", min: 10000, max: Infinity },
];

// ─── Tag colour map ────────────────────────────────────────────────────────────
const TAG_COLOURS = {
  winter: "bg-blue-50  text-blue-600",
  summer: "bg-sky-50   text-sky-600",
  jacket: "bg-amber-50 text-amber-600",
  premium: "bg-emerald-50 text-emerald-600",
  casual: "bg-purple-50  text-purple-600",
  warm: "bg-orange-50  text-orange-600",
  trending: "bg-rose-50    text-rose-600",
  bestseller: "bg-green-50   text-green-600",
  default: "bg-gray-100   text-gray-500",
};

function Tag({ label }) {
  const cls = TAG_COLOURS[label?.toLowerCase()] ?? TAG_COLOURS.default;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[11px] text-gray-600 shadow-sm">
      {label}
      <button onClick={onRemove} className="hover:text-gray-900 ml-0.5">
        <X size={9} />
      </button>
    </span>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="bg-gray-100" style={{ aspectRatio: "3/4" }} />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center col-span-full">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
        <ShoppingBag size={24} className="text-gray-300" />
      </div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1.5">No products found</h3>
      <p className="text-xs text-gray-400 max-w-xs">Try adjusting your filters to find what you're looking for.</p>
      <button onClick={onClear}
        className="mt-5 px-5 py-2 rounded-full text-sm font-medium text-white"
        style={{ backgroundColor: COFFEE }}>
        Clear filters
      </button>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
            <X size={24} className="text-red-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">Failed to Load</h3>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <button onClick={onRetry}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: COFFEE }}>
            Try Again
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Product Card (Grid) ──────────────────────────────────────────────────────
function ProductCard({ product, isWishlisted, onWishlistToggle }) {
  const navigate = useNavigate();
  const discount = getDiscount(product);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productImages = useMemo(() => {

    const images = [];

    // mainImage
    if (product.mainImage) {
      images.push(normaliseUrl(product.mainImage));
    }

    // mainImages[]
    if (Array.isArray(product.mainImages)) {
      product.mainImages.forEach((img) => {
        images.push(normaliseUrl(img));
      });
    }

    // variants
    for (const v of product.variants || []) {

      if (v.mainImage) {
        images.push(normaliseUrl(v.mainImage));
      }

      if (Array.isArray(v.images)) {
        v.images.forEach((img) => {
          images.push(normaliseUrl(img));
        });
      }
    }

    // remove duplicates + nulls
    const unique = [...new Set(images.filter(Boolean))];

    return unique.length > 0
      ? unique
      : ["https://placehold.co/600x800/e5e7eb/64748b?text=No+Image"];

  }, [product]);


  // Auto Slide
  useEffect(() => {

    if (productImages.length <= 1) return;

    const interval = setInterval(() => {

      setCurrentImageIndex((prev) =>
        (prev + 1) % productImages.length
      );

    }, 2000);

    return () => clearInterval(interval);

  }, [productImages]);


  const img = productImages[currentImageIndex]; const pid = product._id || product.id;
  const inStock = (product.totalStock ?? 1) > 0;

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/product/${pid}`)}>

      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-gray-50 flex-shrink-0" style={{ aspectRatio: "3/4" }}>
        <img
          key={img}
          src={img}
          alt={product.name}
          className="
    w-full h-full object-cover
    transition-all duration-700
    group-hover:scale-105
  "
          onError={(e) => {
            e.target.src =
              "https://placehold.co/600x800/e5e7eb/64748b?text=No+Image";
          }}
        />

        {productImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">

            {productImages.map((_, idx) => (

              <span
                key={idx}
                className={`
          rounded-full transition-all duration-300
          ${idx === currentImageIndex
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/60"
                  }
        `}
              />

            ))}

          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {discount && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: COFFEE }}>
              -{discount}%
            </span>
          )}
          {product.tags?.[0] && <Tag label={product.tags[0]} />}
        </div>

        {/* Wishlist */}
        <button onClick={(e) => { e.stopPropagation(); onWishlistToggle(pid); }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 shadow-sm ${isWishlisted ? "bg-rose-50" : "bg-white/85 hover:bg-white"}`}>
          <Heart size={12} className={isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-500"} />
        </button>

        {/* Out of stock */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="text-[10px] font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover CTA */}
        {inStock && (
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={(e) => { e.stopPropagation(); alert(`Added "${product.name}" to cart!`); }}
              className="w-full py-2.5 text-[11px] font-bold tracking-widest uppercase text-white"
              style={{ backgroundColor: COFFEE }}>
              Add to Bag
            </button>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-3 flex flex-col gap-1.5">
        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-medium truncate">
          {product.subcategoryName || "Fashion"}
        </p>
        <h3 className="text-gray-800 text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star size={10} className="fill-amber-400 text-amber-400 flex-shrink-0" />
          <span className="text-[10px] text-gray-500">{(product.averageRating || 0).toFixed(1)}</span>
          <span className="text-[10px] text-gray-400">
            ({product.reviews?.length || product.reviewCount || 0})
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-gray-900 font-bold text-sm">{toINR(product.displayPrice)}</span>
            {product.displayActualPrice > product.displayPrice && (
              <span className="text-gray-400 text-[10px] line-through">{toINR(product.displayActualPrice)}</span>
            )}
          </div>
          
        </div>

        {/* Sizes preview */}
          {product.availableSizes?.length > 0 && (
            <div className="flex gap-0.5">
              {product.availableSizes.slice(0, 3).map((s) => (
                <span key={s} className="text-[8px] text-gray-400 border border-gray-100 rounded px-1 py-0.5 bg-gray-50">{s}</span>
              ))}
              {product.availableSizes.length > 3 && (
                <span className="text-[8px] text-gray-400">+{product.availableSizes.length - 3}</span>
              )}
            </div>
          )}

        {/* Colour swatches */}
        {product.availableColors?.length > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            {product.availableColors.slice(0, 5).map((c) => {
              const lower = c.toLowerCase();
              const bg = lower === "white" ? "#f9fafb"
                : lower === "black" ? "#111"
                  : lower === "red" ? "#ef4444"
                    : lower === "blue" ? "#3b82f6"
                      : lower === "green" ? "#22c55e"
                        : lower === "yellow" ? "#eab308"
                          : lower === "pink" ? "#ec4899"
                            : lower === "gray" || lower === "grey" ? "#9ca3af"
                              : "#d1d5db";
              return (
                <span key={c} title={c}
                  className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: bg }} />
              );
            })}
            {product.availableColors.length > 5 && (
              <span className="text-[8px] text-gray-400">+{product.availableColors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Product List Item ────────────────────────────────────────────────────────
function ProductListItem({ product, isWishlisted, onWishlistToggle }) {
  const navigate = useNavigate();
  const discount = getDiscount(product);
  const img = getProductImage(product);
  const pid = product._id || product.id;
  const inStock = (product.totalStock ?? 1) > 0;

  return (
    <div className="flex gap-3 sm:gap-4 bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/product/${pid}`)}>

      {/* Image */}
      <div className="relative w-24 sm:w-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50"
        style={{ aspectRatio: "3/4" }}>
        <img src={img} alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://placehold.co/600x800/e5e7eb/64748b?text=No+Image"; }} />
        {!inStock && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="text-[8px] font-semibold text-gray-500 text-center leading-tight px-1">Sold Out</span>
          </div>
        )}
        {discount && (
          <div className="absolute top-1.5 left-1.5">
            <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white" style={{ backgroundColor: COFFEE }}>
              -{discount}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-medium mb-0.5">
                {product.subcategoryName || "Fashion"}
              </p>
              <h3 className="text-gray-800 text-sm font-semibold leading-snug line-clamp-2">
                {product.name}
              </h3>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onWishlistToggle(pid); }}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
              <Heart size={14} className={isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400"} />
            </button>
          </div>

          {/* Rating + tags */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] text-gray-500">{(product.averageRating || 0).toFixed(1)}</span>
            <span className="text-[10px] text-gray-400">({product.reviews?.length || 0})</span>
            {product.tags?.[0] && <Tag label={product.tags[0]} />}
          </div>

          {/* Sizes */}
          {product.availableSizes?.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wide mr-0.5">Sizes:</span>
              {product.availableSizes.slice(0, 5).map((s) => (
                <span key={s} className="text-[9px] text-gray-500 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50">{s}</span>
              ))}
            </div>
          )}

          {/* Colours */}
          {product.availableColors?.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wide mr-0.5">Colours:</span>
              {product.availableColors.slice(0, 5).map((c) => {
                const lower = c.toLowerCase();
                const bg = lower === "white" ? "#f3f4f6"
                  : lower === "black" ? "#111"
                    : lower === "red" ? "#ef4444"
                      : lower === "blue" ? "#3b82f6"
                        : lower === "green" ? "#22c55e"
                          : lower === "yellow" ? "#eab308"
                            : lower === "pink" ? "#ec4899"
                              : "#d1d5db";
                return (
                  <span key={c} title={c}
                    className="w-3.5 h-3.5 rounded-full border border-gray-200"
                    style={{ backgroundColor: bg }} />
                );
              })}
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-900 font-bold text-sm">{toINR(product.displayPrice)}</span>
            {product.displayActualPrice > product.displayPrice && (
              <span className="text-gray-400 text-xs line-through">{toINR(product.displayActualPrice)}</span>
            )}
          </div>
          <button
            disabled={!inStock}
            onClick={(e) => { e.stopPropagation(); alert(`Added "${product.name}" to cart!`); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${inStock ? "text-white hover:opacity-80" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            style={inStock ? { backgroundColor: COFFEE } : {}}>
            <ShoppingBag size={11} />
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Drawer ────────────────────────────────────────────────────────────
function FilterDrawer({ selectedFilters, setSelectedFilters, onClose }) {
  const [local, setLocal] = useState({ ...selectedFilters });

  const apply = () => { setSelectedFilters(local); onClose(); };
  const reset = () => setLocal({ priceRange: null, minRating: null, inStockOnly: false });

  const Radio = ({ checked, onClick }) => (
    <span onClick={onClick}
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${checked ? "border-black bg-black" : "border-gray-300 hover:border-gray-500"}`}>
      {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
    </span>
  );

  const Checkbox = ({ checked, onClick }) => (
    <span onClick={onClick}
      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${checked ? "border-black bg-black" : "border-gray-300 hover:border-gray-500"}`}>
      {checked && (
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white border-l border-gray-100 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-gray-800 font-semibold">Filters</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">
          {/* Price */}
          <section>
            <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-3">Price Range</h3>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer">
                <Radio checked={local.priceRange === null} onClick={() => setLocal({ ...local, priceRange: null })} />
                <span className="text-sm text-gray-600">Any price</span>
              </label>
              {PRICE_RANGES.map((r) => (
                <label key={r.label} className="flex items-center gap-3 cursor-pointer">
                  <Radio
                    checked={local.priceRange?.label === r.label}
                    onClick={() => setLocal({ ...local, priceRange: r })}
                  />
                  <span className="text-sm text-gray-600">{r.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Rating */}
          <section>
            <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-3">Rating</h3>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer">
                <Radio checked={local.minRating === null} onClick={() => setLocal({ ...local, minRating: null })} />
                <span className="text-sm text-gray-600">Any rating</span>
              </label>
              {[4, 3, 2].map((v) => (
                <label key={v} className="flex items-center gap-3 cursor-pointer">
                  <Radio checked={local.minRating === v} onClick={() => setLocal({ ...local, minRating: v })} />
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    {v}
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    &amp; above
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Availability */}
          <section>
            <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-3">Availability</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox checked={local.inStockOnly} onClick={() => setLocal({ ...local, inStockOnly: !local.inStockOnly })} />
              <span className="text-sm text-gray-600">In Stock Only</span>
            </label>
          </section>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={reset}
            className="flex-1 py-2.5 rounded-2xl border border-gray-300 text-sm text-gray-600 hover:border-gray-500 transition-colors">
            Reset
          </button>
          <button onClick={apply}
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: COFFEE }}>
            Apply
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Sort Dropdown ────────────────────────────────────────────────────────────
function SortDropdown({ sortBy, setSortBy }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-full text-xs text-gray-600 shadow-sm transition-colors whitespace-nowrap">
        <span className="hidden sm:inline text-gray-400">Sort:</span>
        <span className="font-medium text-gray-700">{SORT_OPTIONS.find((o) => o.value === sortBy)?.label}</span>
        <ChevronDown size={11} className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-100 rounded-2xl overflow-hidden z-30 shadow-xl">
          {SORT_OPTIONS.map((opt) => (
            <button key={opt.value}
              onClick={() => { setSortBy(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between ${sortBy === opt.value ? "text-white" : "text-gray-600 hover:bg-gray-50"}`}
              style={sortBy === opt.value ? { backgroundColor: COFFEE } : {}}>
              {opt.label}
              {sortBy === opt.value && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SubCategoryProductsPage() {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();

  // ── Data state ──
  const [products, setProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null); // { _id, name, image }
  const [category, setCategory] = useState(null); // { _id, name }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  // ── UI state ──
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ priceRange: null, minRating: null, inStockOnly: false });
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!subcategoryId) { setError("No subcategory ID."); setLoading(false); return; }
    let cancelled = false;

    const run = async () => {
      setLoading(true); setError(null);
      try {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 15_000);
        const res = await fetch(`${API_BASE}/api/admin/subcategories/${subcategoryId}/products`, { signal: ctrl.signal });
        clearTimeout(tid);

        if (!res.ok) throw new Error(`Server error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        if (cancelled) return;

        if (!data || data.success === false)
          throw new Error(data?.message || "Failed to load products.");

        // ── Extract category / subcategory from TOP-LEVEL response ──
        if (data.subcategory) setSubcategory(data.subcategory);
        if (data.category) setCategory(data.category);

        // ── Products ──
        const raw = Array.isArray(data.products) ? data.products : [];
        // Attach subcategoryName to each product for display
        const subName = data.subcategory?.name || "";
        const catName = data.category?.name || "";
        const enriched = raw
          .filter((p) => p.isActive !== false) // keep if field missing (list doesn't send isActive)
          .map((p) => ({ ...p, subcategoryName: p.subcategoryName || subName, categoryName: catName }));

        setProducts(enriched);
      } catch (err) {
        if (cancelled) return;
        setError(err.name === "AbortError"
          ? "Request timed out. Check your connection."
          : err.message || "Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [subcategoryId, retryKey]);

  // ── Derived: filtered + sorted ────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Price filter (using INR values since displayPrice is in USD × 83)
    if (selectedFilters.priceRange) {
      const { min, max } = selectedFilters.priceRange;
      list = list.filter((p) => {
        const inr = (p.displayPrice ?? 0) * 83;
        return inr >= min && inr <= max;
      });
    }

    // Rating filter
    if (selectedFilters.minRating !== null) {
      list = list.filter((p) => (p.averageRating || 0) >= selectedFilters.minRating);
    }

    // Stock filter
    if (selectedFilters.inStockOnly) {
      list = list.filter((p) => (p.totalStock ?? 1) > 0);
    }

    // Sort
    switch (sortBy) {
      case "price_asc": list.sort((a, b) => (a.displayPrice ?? 0) - (b.displayPrice ?? 0)); break;
      case "price_desc": list.sort((a, b) => (b.displayPrice ?? 0) - (a.displayPrice ?? 0)); break;
      case "rating": list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)); break;
      case "newest": list.sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0)); break;
      default: break; // featured = API order
    }

    return list;
  }, [products, sortBy, selectedFilters]);

  // Get userId from sessionStorage
  const getUserId = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      return user?.id || null;
    } catch {
      return null;
    }
  };

  const userId = getUserId();

  useEffect(() => {

    const fetchWishlist = async () => {

      try {

        const res = await axios.get(
          `http://31.97.228.17:4077/api/users/${userId}`
        );

        if (res.data.success) {

          setWishlist(
            res.data.user.wishlist || []
          );

        }

      } catch (err) {

        console.log("Wishlist fetch error", err);

      }
    };

    fetchWishlist();

  }, []);

  const toggleWishlist = useCallback(async (productId) => {

    try {

      // optimistic update
      setWishlist((prev) =>
        prev.includes(productId)
          ? prev.filter((x) => x !== productId)
          : [...prev, productId]
      );

      // const token = sessionStorage.getItem("authToken");

      await axios.post(
        `http://31.97.228.17:4077/api/users/wishlist/${userId}/toggle`,
        {
          productId,
        },
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

    } catch (err) {

      console.log("Wishlist update error", err);

    }

  }, [userId]);

  const clearFilters = () => setSelectedFilters({ priceRange: null, minRating: null, inStockOnly: false });
  const activeFilterCount = [
    selectedFilters.priceRange,
    selectedFilters.minRating,
    selectedFilters.inStockOnly || null,
  ].filter(Boolean).length;

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (error && products.length === 0)
    return <ErrorState message={error} onRetry={() => setRetryKey((k) => k + 1)} />;

  const pageTitle = subcategory?.name || "Products";
  const catTitle = category?.name || "";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Header />
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
                * { box-sizing: border-box; }
                body { font-family: 'DM Sans', system-ui, sans-serif; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
            `}</style>

      <div className="min-h-screen bg-gray-50">

        {/* ── Hero Banner ── */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-8 sm:pb-12">
            {/* Back */}
            <button onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 px-3 py-1.5 rounded-full transition-all mb-6">
              <ArrowLeft size={12} /> Back
            </button>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                {catTitle && (
                  <p className="text-[11px] text-white/50 uppercase tracking-widest font-medium mb-2">{catTitle}</p>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-none">
                  {pageTitle}
                </h1>
                <p className="mt-3 text-white/60 text-sm max-w-xl">
                  Explore our curated collection of {pageTitle.toLowerCase()} — quality craftsmanship at unbeatable prices.
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
                <div className="text-3xl sm:text-4xl font-bold text-white/20 tabular-nums">
                  {loading ? "—" : filteredProducts.length}
                </div>
                <p className="text-[11px] text-white/40 uppercase tracking-widest">Products</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-200">

            {/* Left: filter button + chips */}
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <button onClick={() => setIsFilterOpen(true)}
                className="relative flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-full text-xs text-gray-600 shadow-sm transition-colors flex-shrink-0">
                <SlidersHorizontal size={12} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ backgroundColor: COFFEE }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedFilters.priceRange && (
                    <Chip label={selectedFilters.priceRange.label}
                      onRemove={() => setSelectedFilters({ ...selectedFilters, priceRange: null })} />
                  )}
                  {selectedFilters.minRating && (
                    <Chip label={`${selectedFilters.minRating}★+`}
                      onRemove={() => setSelectedFilters({ ...selectedFilters, minRating: null })} />
                  )}
                  {selectedFilters.inStockOnly && (
                    <Chip label="In Stock"
                      onRemove={() => setSelectedFilters({ ...selectedFilters, inStockOnly: false })} />
                  )}
                  <button onClick={clearFilters}
                    className="text-[10px] text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors whitespace-nowrap">
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Right: view toggle + sort */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* View toggle */}
              <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                {[
                  { mode: "grid", Icon: LayoutGrid },
                  { mode: "list", Icon: List },
                ].map(({ mode, Icon }) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`p-1.5 rounded-full transition-all ${viewMode === mode ? "text-white" : "text-gray-400 hover:text-gray-600"}`}
                    style={viewMode === mode ? { backgroundColor: COFFEE } : {}}>
                    <Icon size={13} />
                  </button>
                ))}
              </div>

              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>

          {/* ── Products area ── */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product._id || product.id)}
                  onWishlistToggle={toggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredProducts.map((product) => (
                <ProductListItem
                  key={product._id || product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product._id || product.id)}
                  onWishlistToggle={toggleWishlist}
                />
              ))}
            </div>
          )}

          {/* Result count footer */}
          {!loading && filteredProducts.length > 0 && (
            <p className="text-center text-xs text-gray-400 mt-8">
              Showing {filteredProducts.length} of {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Filter drawer */}
      {isFilterOpen && (
        <FilterDrawer
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </>
  );
}