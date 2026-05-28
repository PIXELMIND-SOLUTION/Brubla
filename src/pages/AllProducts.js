import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const COFFEE = "#000";
const API_BASE = "http://31.97.228.17:4077";

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Normalise image URLs: replace localhost:4077 with the real host.
 */
const normaliseUrl = (url) => {
    if (!url) return null;
    return url.replace(/https?:\/\/localhost:4077/g, API_BASE);
};

/**
 * Return the best available product image.
 * Priority: variants[].mainImage → variants[].images[0] → placeholder
 */
const getProductImage = (product) => {
    if (product.variants && product.variants.length > 0) {
        // 1) mainImage on variant
        for (const variant of product.variants) {
            if (variant.mainImage && variant.mainImage.trim() !== "") {
                return normaliseUrl(variant.mainImage);
            }
        }
        // 2) first image in variant.images[]
        for (const variant of product.variants) {
            if (variant.images && variant.images.length > 0) {
                return normaliseUrl(variant.images[0]);
            }
        }
    }
    // 3) top-level mainImages[]
    if (product.mainImages && product.mainImages.length > 0) {
        return normaliseUrl(product.mainImages[0]);
    }
    return "https://placehold.co/600x800/e5e7eb/64748b?text=No+Image";
};

const getUniqueSizesFromProducts = (products) => {
    const sizesSet = new Set();
    products.forEach((product) => {
        if (product.availableSizes && product.availableSizes.length > 0) {
            product.availableSizes.forEach((size) => sizesSet.add(size));
        }
    });
    return Array.from(sizesSet).sort();
};

const toINR = (usd) => {
    if (!usd) return "0";
    return (usd * 83).toLocaleString("en-IN", { maximumFractionDigits: 0 });
};

// ─── Constants ────────────────────────────────────────────────────────────────
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const COLOR_GROUPS = [
    { label: "Blues", colors: ["#3b82f6", "#1d4ed8", "#93c5fd"] },
    { label: "Browns", colors: ["#92400e", "#b45309", "#d97706"] },
    { label: "Greens", colors: ["#16a34a", "#4ade80", "#166534"] },
    { label: "Neutrals", colors: ["#374151", "#9ca3af", "#f3f4f6"] },
    { label: "Purples", colors: ["#7c3aed", "#a855f7", "#c4b5fd"] },
    { label: "Reds", colors: ["#dc2626", "#f87171", "#991b1b"] },
];

// ─── URL helpers ──────────────────────────────────────────────────────────────
function parseFiltersFromParams(searchParams) {
    return {
        sizes: searchParams.getAll("size"),
        types: searchParams.getAll("type"),
        colors: searchParams.getAll("color"),
        availability: searchParams.get("availability") || "all",
    };
}

function updateUrlParams(searchParams, filters, setSearchParams) {
    const newParams = new URLSearchParams();
    filters.sizes.forEach((s) => newParams.append("size", s));
    filters.types.forEach((t) => newParams.append("type", t));
    filters.colors.forEach((c) => newParams.append("color", c));
    if (filters.availability !== "all")
        newParams.set("availability", filters.availability);
    setSearchParams(newParams, { replace: true });
}

// ─── HeartIcon ─────────────────────────────────────────────────────────────
function HeartIcon({ saved, onToggle }) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
            className="
                absolute top-3 right-3 z-10
                w-8 h-8 flex items-center justify-center
                rounded-full transition-all duration-200
                hover:scale-110
            "
            style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(4px)"
            }}
            aria-label="Wishlist"
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={saved ? "#ef4444" : "none"}
                stroke={saved ? "#ef4444" : COFFEE}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-200"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        </button>
    );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ onClick, product }) {
    const [saved, setSaved] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Get images priority:
    // 1. mainImages
    // 2. variant mainImage
    // 3. variant images

    let productImages = [];

    if (product.mainImages?.length > 0) {

        productImages = product.mainImages;

    } else if (product.variants?.length > 0) {

        // variant mainImage
        const variantMainImages = product.variants
            .map((v) => v.mainImage)
            .filter(Boolean);

        if (variantMainImages.length > 0) {

            productImages = variantMainImages;

        } else {

            // fallback variant images
            productImages = product.variants.flatMap(
                (v) => v.images || []
            );
        }
    }

    // normalize URLs
    productImages = productImages.map((img) =>
        normaliseUrl(img)
    );

    // fallback image
    if (productImages.length === 0) {

        productImages = [
            "https://placehold.co/600x800/e5e7eb/64748b?text=No+Image",
        ];
    }

    // auto slide
    useEffect(() => {

        if (productImages.length <= 1) return;

        const interval = setInterval(() => {

            setCurrentImageIndex((prev) =>
                (prev + 1) % productImages.length
            );

        }, 2000);

        return () => clearInterval(interval);

    }, [productImages.length]);

    const productImage =
        productImages[currentImageIndex];

    const discount =
        product.maxDiscount ||
        (product.displayActualPrice > product.displayPrice
            ? Math.round(
                ((product.displayActualPrice - product.displayPrice) /
                    product.displayActualPrice) *
                100
            )
            : null);

    const inStock = product.totalStock > 0;

    return (
        <div
            onClick={onClick}
            className="group relative cursor-pointer"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            {/* ── Image container ── */}
            <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-100">
                <img
                    src={productImage}
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

                <HeartIcon saved={saved} onToggle={() => setSaved((s) => !s)} />

                {/* Sold-out overlay */}
                {!inStock && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 border border-gray-400 px-3 py-1 rounded-full">
                            Sold Out
                        </span>
                    </div>
                )}

                {/* Slider indicators */}
                {productImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {productImages.map((_, idx) => (
                            <span
                                key={idx}
                                className={`
                    transition-all duration-300 rounded-full
                    ${idx === currentImageIndex
                                        ? "w-5 h-1.5 bg-white"
                                        : "w-1.5 h-1.5 bg-white/60"
                                    }
                `}
                            />
                        ))}
                    </div>
                )}

                {/* Discount badge */}
                {discount && inStock && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{discount}%
                        </span>
                    </div>
                )}

                {/* Hover add-to-cart strip */}
                {inStock && (
                    <div className="absolute z-20 bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                alert(`Added "${product.name}" to cart!`);
                            }}
                            className="w-full py-3 text-xs font-semibold tracking-widest uppercase text-white transition-colors"
                            style={{ backgroundColor: COFFEE }}
                        >
                            Add to Cart
                        </button>
                    </div>
                )}
            </div>

            {/* ── Info row ── */}
            <div className="mt-3 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                        {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-sm font-bold text-gray-900">
                            ₹{toINR(product.displayPrice)}
                        </span>
                        {product.displayActualPrice > product.displayPrice && (
                            <span className="text-xs text-gray-400 line-through">
                                ₹{toINR(product.displayActualPrice)}
                            </span>
                        )}
                        {discount && (
                            <span className="text-xs text-green-600 font-medium">
                                -{discount}%
                            </span>
                        )}
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

                    {product.subcategoryName && (
                        <p className="text-xs text-gray-400 mt-1 capitalize">
                            {product.subcategoryName}
                        </p>
                    )}
                </div>

                {/* Quick-add button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        alert(`Added "${product.name}" to cart!`);
                    }}
                    className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-200 text-gray-700"
                    style={{ fontSize: 18, lineHeight: 1 }}
                >
                    +
                </button>
            </div>
        </div>
    );
}

// ─── FilterSection (accordion row) ───────────────────────────────────────────
function FilterSection({ title, children }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="border-b border-gray-100 py-5">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between text-left"
            >
                <span className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
                    {title}
                </span>
                <span className="text-gray-400 text-lg leading-none">
                    {open ? "−" : "+"}
                </span>
            </button>
            {open && <div className="mt-4">{children}</div>}
        </div>
    );
}

// ─── FilterDrawer ─────────────────────────────────────────────────────────────
function FilterDrawer({ open, onClose, filters, setFilters, onApply, availableSizes }) {
    const totalActive =
        filters.sizes.length +
        filters.types.length +
        filters.colors.length +
        (filters.availability !== "all" ? 1 : 0);

    function toggleArr(key, val) {
        setFilters((f) => ({
            ...f,
            [key]: f[key].includes(val)
                ? f[key].filter((x) => x !== val)
                : [...f[key], val],
        }));
    }

    function clearAll() {
        setFilters({ sizes: [], types: [], colors: [], availability: "all" });
    }

    function handleApply() {
        onApply(filters);
        onClose();
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                style={{ background: "rgba(0,0,0,0.25)" }}
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
                    }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
                            Filter
                        </p>
                        <p className="text-sm text-gray-500">
                            {totalActive > 0
                                ? `${totalActive} active filter${totalActive > 1 ? "s" : ""}`
                                : "All products"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg
                            width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6">
                    {/* Size */}
                    <FilterSection title="Size">
                        <div className="flex flex-wrap gap-2">
                            {availableSizes.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => toggleArr("sizes", s)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${filters.sizes.includes(s)
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Availability */}
                    <FilterSection title="Availability">
                        <div className="flex gap-2 flex-wrap">
                            {["all", "inStock", "outOfStock"].map((v) => (
                                <button
                                    key={v}
                                    onClick={() =>
                                        setFilters((f) => ({ ...f, availability: v }))
                                    }
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${filters.availability === v
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                        }`}
                                >
                                    {v === "all"
                                        ? "All"
                                        : v === "inStock"
                                            ? "In stock"
                                            : "Out of stock"}
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Colors */}
                    <FilterSection title="Color">
                        <div className="grid grid-cols-2 gap-3">
                            {COLOR_GROUPS.map((g) => (
                                <button
                                    key={g.label}
                                    onClick={() => toggleArr("colors", g.label)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-150 ${filters.colors.includes(g.label)
                                        ? "border-black bg-gray-50"
                                        : "border-gray-200 hover:border-gray-400"
                                        }`}
                                >
                                    <div className="flex -space-x-1">
                                        {g.colors.map((c, i) => (
                                            <div
                                                key={i}
                                                className="w-4 h-4 rounded-full border-2 border-white"
                                                style={{ background: c }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">
                                        {g.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </FilterSection>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-5 border-t border-gray-100">
                    <button
                        onClick={clearAll}
                        className="flex-1 py-3 rounded-full border border-gray-300 text-xs font-semibold tracking-widest uppercase text-gray-700 hover:border-gray-500 transition-colors"
                    >
                        Remove All
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 py-3 rounded-full text-white text-xs font-semibold tracking-widest uppercase transition-colors"
                        style={{ backgroundColor: COFFEE }}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl aspect-[3/4]" />
                    <div className="mt-3 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Empty / Error states ─────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Failed to Load Products
                </h2>
                <p className="text-gray-500 mb-6 text-sm">{message}</p>
                <button
                    onClick={onRetry}
                    className="px-6 py-2.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: COFFEE }}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}

function EmptyState({ onReset }) {
    return (
        <div className="py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-semibold text-gray-700 mb-2">No products found</p>
            <p className="text-sm text-gray-400">
                Try adjusting your category or filters
            </p>
            <button
                onClick={onReset}
                className="mt-5 px-6 py-2.5 rounded-full text-white text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-80"
                style={{ backgroundColor: COFFEE }}
            >
                Reset
            </button>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AllProducts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // ── Data state ──
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryKey, setRetryKey] = useState(0); // bump to re-fetch

    // ── UI state ──
    const [activeCategory, setActiveCategory] = useState("View all");
    const [categories, setCategories] = useState(["View all"]);
    const [availableSizes, setAvailableSizes] = useState(ALL_SIZES);

    const [filterOpen, setFilterOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        sizes: [], types: [], colors: [], availability: "all",
    });
    const [filters, setFilters] = useState(() => parseFiltersFromParams(searchParams));

    const navRef = useRef(null);

    // ── Fetch products ────────────────────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15_000);

                const response = await fetch(`${API_BASE}/api/admin/products`, {
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(
                        `Server error ${response.status}: ${response.statusText}`
                    );
                }

                const data = await response.json();

                if (cancelled) return;

                // Validate shape
                if (!data || typeof data !== "object") {
                    throw new Error("Invalid response format from server.");
                }
                if (data.success === false) {
                    throw new Error(data.message || "API returned success: false.");
                }

                const rawProducts = Array.isArray(data.products) ? data.products : [];
                const activeProducts = rawProducts.filter((p) => p.isActive === true);

                setProducts(activeProducts);

                // Derive categories
                const catSet = new Set(["View all"]);
                activeProducts.forEach((p) => {
                    if (p.subcategoryName) catSet.add(p.subcategoryName);
                    if (p.categoryId?.name) catSet.add(p.categoryId.name);
                });
                setCategories(Array.from(catSet));

                // Derive sizes
                const sizes = getUniqueSizesFromProducts(activeProducts);
                setAvailableSizes(sizes.length > 0 ? sizes : ALL_SIZES);
            } catch (err) {
                if (cancelled) return;
                const isAbort = err.name === "AbortError";
                setError(
                    isAbort
                        ? "Request timed out. Please check your connection and try again."
                        : err.message || "An unexpected error occurred."
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            cancelled = true;
        };
    }, [retryKey]);

    // ── Sync URL → filter state ───────────────────────────────────────────────
    useEffect(() => {
        setFilters(parseFiltersFromParams(searchParams));
    }, [searchParams]);

    // ── Sync URL → active category ────────────────────────────────────────────
    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat && categories.includes(cat)) {
            setActiveCategory(cat);
        } else if (!cat) {
            setActiveCategory("View all");
        }
    }, [searchParams, categories]);

    // ── Mouse-drag scroll on category bar ────────────────────────────────────
    useEffect(() => {
        const el = navRef.current;
        if (!el) return;
        let isDown = false, startX, scrollLeft;
        const onDown = (e) => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
        const onUp = () => { isDown = false; };
        const onLeave = () => { isDown = false; };
        const onMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            el.scrollLeft = scrollLeft - (x - startX);
        };
        el.addEventListener("mousedown", onDown);
        el.addEventListener("mouseup", onUp);
        el.addEventListener("mouseleave", onLeave);
        el.addEventListener("mousemove", onMove);
        return () => {
            el.removeEventListener("mousedown", onDown);
            el.removeEventListener("mouseup", onUp);
            el.removeEventListener("mouseleave", onLeave);
            el.removeEventListener("mousemove", onMove);
        };
    }, []);

    // ── Filtered products ─────────────────────────────────────────────────────
    const filtered = products.filter((p) => {
        // Category
        if (activeCategory !== "View all") {
            const productCat = p.subcategoryName || p.categoryId?.name;
            if (productCat !== activeCategory) return false;
        }

        // Availability
        const inStock = p.totalStock > 0;
        if (filters.availability === "inStock" && !inStock) return false;
        if (filters.availability === "outOfStock" && inStock) return false;

        // Size
        if (filters.sizes.length > 0) {
            const productSizes = p.availableSizes || [];
            if (!filters.sizes.some((s) => productSizes.includes(s))) return false;
        }

        // Color — match against availableColors[]
        if (filters.colors.length > 0) {
            const productColors = (p.availableColors || []).map((c) => c.toLowerCase());
            const hasColor = filters.colors.some((colorGroup) =>
                productColors.some((c) => c.includes(colorGroup.toLowerCase()))
            );
            // Only filter out if the product has declared colours but none match
            if (!hasColor && productColors.length > 0) return false;
        }

        return true;
    });

    const activeFilterCount =
        filters.sizes.length +
        filters.types.length +
        filters.colors.length +
        (filters.availability !== "all" ? 1 : 0);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleCategoryClick = (cat) => {
        setActiveCategory(cat);
        const newParams = new URLSearchParams(searchParams);
        if (cat === "View all") {
            newParams.delete("category");
        } else {
            newParams.set("category", cat);
        }
        setSearchParams(newParams, { replace: true });
    };

    const handleApplyFilters = (newFilters) => {
        updateUrlParams(searchParams, newFilters, setSearchParams);
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        const empty = { sizes: [], types: [], colors: [], availability: "all" };
        updateUrlParams(searchParams, empty, setSearchParams);
        setFilters(empty);
    };

    const handleResetAll = () => {
        handleClearFilters();
        setActiveCategory("View all");
        setSearchParams(new URLSearchParams(), { replace: true });
    };

    const openFilterDrawer = () => {
        setTempFilters(filters);
        setFilterOpen(true);
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            <Header />
            <div
                className="min-h-screen bg-white"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                {/* Google Font + global resets */}
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
                    * { box-sizing: border-box; }
                    ::-webkit-scrollbar { height: 4px; width: 4px; }
                    ::-webkit-scrollbar-track { background: transparent; }
                    ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    .line-clamp-2 {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                `}</style>

                {/* ── Sticky top bar (categories + filter button) ── */}
                <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 py-3">
                            {/* Scrollable category pills */}
                            <div
                                ref={navRef}
                                className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar select-none"
                            >
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 whitespace-nowrap ${activeCategory === cat
                                            ? "text-white border-transparent"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                            }`}
                                        style={
                                            activeCategory === cat
                                                ? { backgroundColor: COFFEE }
                                                : {}
                                        }
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Advanced filters button */}
                            <div className="flex-shrink-0">
                                <button
                                    onClick={openFilterDrawer}
                                    className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold tracking-wide text-gray-700 hover:border-gray-400 transition-all duration-200 whitespace-nowrap"
                                >
                                    <svg
                                        width="14" height="14" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                    </svg>
                                    <span className="hidden sm:inline">Advance Filters</span>
                                    <span className="sm:hidden">Filters</span>
                                    {activeFilterCount > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                                            style={{ backgroundColor: COFFEE }}
                                        >
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main content area ── */}
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {loading ? (
                        <LoadingSkeleton />
                    ) : error && products.length === 0 ? (
                        <ErrorState
                            message={error}
                            onRetry={() => setRetryKey((k) => k + 1)}
                        />
                    ) : (
                        <>
                            {/* Results row */}
                            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                                <p className="text-xs text-gray-400 uppercase tracking-widest">
                                    {filtered.length}{" "}
                                    <span className="text-gray-600">
                                        Product{filtered.length !== 1 ? "s" : ""}
                                    </span>
                                </p>
                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-xs text-gray-400 hover:text-gray-700 underline transition-colors"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>

                            {/* Grid or empty */}
                            {filtered.length === 0 ? (
                                <EmptyState onReset={handleResetAll} />
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10">
                                    {filtered.map((product) => (
                                        <ProductCard
                                            key={product._id || product.id}
                                            product={product}
                                            onClick={() =>
                                                navigate(
                                                    `/product/${product._id || product.id}`
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ── Filter drawer ── */}
                <FilterDrawer
                    open={filterOpen}
                    onClose={() => setFilterOpen(false)}
                    filters={tempFilters}
                    setFilters={setTempFilters}
                    onApply={handleApplyFilters}
                    availableSizes={availableSizes}
                />
            </div>
        </>
    );
}