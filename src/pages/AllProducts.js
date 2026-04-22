import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";

// ─── Data ────────────────────────────────────────────────────────────────────

const allProducts = [
    { id: 1, name: "Oversized Denim Jacket", price: 89.99, originalPrice: 129.99, rating: 4.5, reviewCount: 234, image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80", category: "Jackets", tags: ["trending", "bestseller"], colors: ["blue", "black"], sizes: ["XS", "S", "M", "L", "XL"], inStock: true },
    { id: 2, name: "Minimalist Leather Backpack", price: 79.99, originalPrice: null, rating: 4.8, reviewCount: 567, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", category: "Accessories", tags: ["new"], colors: ["brown", "black"], sizes: ["One Size"], inStock: true },
    { id: 3, name: "Cashmere Wool Sweater", price: 129.99, originalPrice: 199.99, rating: 4.7, reviewCount: 189, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", category: "Sweaters", tags: ["bestseller"], colors: ["gray", "navy"], sizes: ["S", "M", "L", "XL"], inStock: true },
    { id: 4, name: "Classic White Sneakers", price: 69.99, originalPrice: null, rating: 4.6, reviewCount: 892, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80", category: "Shoes", tags: ["trending", "bestseller"], colors: ["white", "black"], sizes: ["7", "8", "9", "10", "11"], inStock: true },
    { id: 5, name: "Sterling Silver Necklace", price: 149.99, originalPrice: 199.99, rating: 4.9, reviewCount: 423, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", category: "Accessories", tags: ["luxury"], colors: ["silver"], sizes: ["One Size"], inStock: true },
    { id: 6, name: "Ceramic Table Lamp", price: 59.99, originalPrice: null, rating: 4.4, reviewCount: 178, image: "https://images.unsplash.com/photo-1507473885765-e6b057fbbf33?w=600&q=80", category: "Home", tags: ["popular"], colors: ["white", "beige"], sizes: ["One Size"], inStock: false },
    { id: 7, name: "Hydrating Face Serum", price: 45.99, originalPrice: 64.99, rating: 4.7, reviewCount: 1123, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80", category: "Beauty", tags: ["new"], colors: [], sizes: ["50ml"], inStock: true },
    { id: 8, name: "Wireless Headphones", price: 199.99, originalPrice: 299.99, rating: 4.8, reviewCount: 2341, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", category: "Electronics", tags: ["bestseller"], colors: ["black", "white"], sizes: ["One Size"], inStock: true },
    { id: 9, name: "Premium Yoga Mat", price: 49.99, originalPrice: null, rating: 4.5, reviewCount: 756, image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&q=80", category: "Shirts", tags: ["active"], colors: ["purple", "green"], sizes: ["One Size"], inStock: true },
    { id: 10, name: "Wooden Building Blocks", price: 34.99, originalPrice: 49.99, rating: 4.9, reviewCount: 445, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80", category: "Toys", tags: ["popular"], colors: [], sizes: ["100 pieces"], inStock: true },
    { id: 11, name: "Graphic Tee - Owl Print", price: 39.99, originalPrice: 59.99, rating: 4.6, reviewCount: 312, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", category: "T-shirts", tags: ["trending"], colors: ["black", "gray"], sizes: ["XS", "S", "M", "L", "XL", "XXL"], inStock: true },
    { id: 12, name: "Ribbed Knit Beanie", price: 24.99, originalPrice: null, rating: 4.3, reviewCount: 189, image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80", category: "Accessories", tags: ["new"], colors: ["black", "gray", "navy"], sizes: ["One Size"], inStock: true },
    { id: 13, name: "Automatic Dress Watch", price: 349.99, originalPrice: 499.99, rating: 4.8, reviewCount: 210, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80", category: "Accessories", tags: ["luxury"], colors: ["silver", "gold"], sizes: ["One Size"], inStock: true },
    { id: 14, name: "Leather Tote Bag", price: 95.99, originalPrice: 129.99, rating: 4.6, reviewCount: 387, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", category: "Accessories", tags: ["trending"], colors: ["tan", "black"], sizes: ["One Size"], inStock: true },
    { id: 15, name: "Mechanical Keyboard RGB", price: 129.99, originalPrice: 179.99, rating: 4.7, reviewCount: 943, image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80", category: "Electronics", tags: ["trending"], colors: ["black", "white"], sizes: ["One Size"], inStock: true },
    { id: 16, name: "Cargo Utility Pants", price: 89.99, originalPrice: 119.99, rating: 4.5, reviewCount: 521, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", category: "Cargo", tags: ["popular"], colors: ["olive", "black", "khaki"], sizes: ["28", "30", "32", "34", "36"], inStock: true },
    { id: 17, name: "Hooded Sweatshirt", price: 64.99, originalPrice: 89.99, rating: 4.6, reviewCount: 678, image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", category: "Hoodies", tags: ["bestseller"], colors: ["gray", "black", "navy"], sizes: ["XS", "S", "M", "L", "XL", "XXL"], inStock: true },
    { id: 18, name: "Oxford Button-Down Shirt", price: 54.99, originalPrice: null, rating: 4.4, reviewCount: 334, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", category: "Shirts", tags: ["new"], colors: ["white", "blue", "pink"], sizes: ["S", "M", "L", "XL"], inStock: true },
    { id: 19, name: "Slim Fit Denim Jeans", price: 79.99, originalPrice: 109.99, rating: 4.5, reviewCount: 892, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", category: "Denims", tags: ["bestseller"], colors: ["blue", "black", "gray"], sizes: ["28", "30", "32", "34", "36", "38"], inStock: true },
    { id: 20, name: "Athletic Shorts", price: 34.99, originalPrice: 49.99, rating: 4.3, reviewCount: 445, image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=80", category: "Shorts", tags: ["active"], colors: ["black", "navy", "gray"], sizes: ["XS", "S", "M", "L", "XL"], inStock: true },
    { id: 21, name: "Polo Classic Fit", price: 44.99, originalPrice: null, rating: 4.5, reviewCount: 567, image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80", category: "Polo", tags: ["popular"], colors: ["white", "navy", "red"], sizes: ["S", "M", "L", "XL", "XXL"], inStock: true },
    { id: 22, name: "Sweatshirt Crewneck", price: 59.99, originalPrice: 79.99, rating: 4.4, reviewCount: 312, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", category: "Sweatshirt", tags: ["new", "trending"], colors: ["cream", "gray", "black"], sizes: ["XS", "S", "M", "L", "XL"], inStock: true },
];

const NAV_CATEGORIES = ["View all", "T-shirts", "Jackets", "Shirts", "Sweatshirt", "Hoodies", "Polo", "Cargo", "Denims", "Shorts", "Pants"];
const ALL_SIZES = ["XXXS", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "W26", "W28", "W30", "W32", "W34", "W36", "W38"];
const ALL_TYPES = ["Accessories", "Cargo", "Coats & Jackets", "Denim", "Hoodies", "Jogger", "Pants", "Shirt", "Shorts", "Sweater", "Sweatshirt", "T-shirt"];
const COLOR_GROUPS = [
    { label: "Blues", colors: ["#3b82f6", "#1d4ed8", "#93c5fd"] },
    { label: "Browns", colors: ["#92400e", "#b45309", "#d97706"] },
    { label: "Greens", colors: ["#16a34a", "#4ade80", "#166534"] },
    { label: "Neutrals", colors: ["#374151", "#9ca3af", "#f3f4f6"] },
    { label: "Purples", colors: ["#7c3aed", "#a855f7", "#c4b5fd"] },
    { label: "Reds", colors: ["#dc2626", "#f87171", "#991b1b"] },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function BookmarkIcon({ saved, onToggle }) {
    return (
        <button
            onClick={e => { e.stopPropagation(); onToggle(); }}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)" }}
            aria-label="Save"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "#111" : "none"} stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
        </button>
    );
}

function ProductCard({ product }) {
    const [saved, setSaved] = useState(false);
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    return (
        <div className="group relative cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {/* Image */}
            <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <BookmarkIcon saved={saved} onToggle={() => setSaved(s => !s)} />
                {!product.inStock && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 border border-gray-400 px-3 py-1 rounded-full">Sold Out</span>
                    </div>
                )}
                {/* Hover add-to-cart strip */}
                {product.inStock && (
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                            onClick={e => { e.stopPropagation(); alert(`Added ${product.name} to cart!`); }}
                            className="w-full py-3 text-xs font-semibold tracking-widest uppercase bg-black text-white hover:bg-gray-900 transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="mt-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-gray-900">RS. {(product.price * 83).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">RS. {(product.originalPrice * 83).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                        )}
                        {discount && <span className="text-xs text-green-600 font-medium">-{discount}%</span>}
                    </div>
                </div>
                <button
                    onClick={e => { e.stopPropagation(); alert(`Added ${product.name} to cart!`); }}
                    className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-200 text-gray-700"
                    style={{ fontSize: 18, lineHeight: 1 }}
                >
                    +
                </button>
            </div>
        </div>
    );
}

// ─── Filter Drawer ────────────────────────────────────────────────────────────

function FilterSection({ title, children }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="border-b border-gray-100 py-5">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between text-left"
            >
                <span className="text-sm font-semibold tracking-wide text-gray-900 uppercase">{title}</span>
                <span className="text-gray-400 text-lg leading-none">{open ? "−" : "+"}</span>
            </button>
            {open && <div className="mt-4">{children}</div>}
        </div>
    );
}

function FilterDrawer({ open, onClose, filters, setFilters }) {
    const totalActive =
        filters.sizes.length + filters.types.length + filters.colors.length +
        (filters.availability !== "all" ? 1 : 0);

    function toggleArr(key, val) {
        setFilters(f => ({
            ...f,
            [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
        }));
    }

    function clearAll() {
        setFilters({ sizes: [], types: [], colors: [], availability: "all" });
    }

    function apply() { onClose(); }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                style={{ background: "rgba(0,0,0,0.25)" }}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Filter</p>
                        <p className="text-sm text-gray-500">{totalActive > 0 ? `${totalActive} active filter${totalActive > 1 ? "s" : ""}` : "409 of 528 products"}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-6">
                    {/* Size */}
                    <FilterSection title="Size">
                        <div className="flex flex-wrap gap-2">
                            {ALL_SIZES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => toggleArr("sizes", s)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${filters.sizes.includes(s) ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Availability */}
                    <FilterSection title="Availability">
                        <div className="flex gap-2">
                            {["all", "inStock", "outOfStock"].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setFilters(f => ({ ...f, availability: v }))}
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${filters.availability === v ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
                                >
                                    {v === "all" ? "All" : v === "inStock" ? "In stock" : "Out of stock"}
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Type */}
                    <FilterSection title="Type">
                        <div className="flex flex-wrap gap-2">
                            {ALL_TYPES.map(t => (
                                <button
                                    key={t}
                                    onClick={() => toggleArr("types", t)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${filters.types.includes(t) ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Color */}
                    <FilterSection title="Color">
                        <div className="grid grid-cols-2 gap-3">
                            {COLOR_GROUPS.map(g => (
                                <button
                                    key={g.label}
                                    onClick={() => toggleArr("colors", g.label)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-150 ${filters.colors.includes(g.label) ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}
                                >
                                    <div className="flex -space-x-1">
                                        {g.colors.map((c, i) => (
                                            <div key={i} className="w-4 h-4 rounded-full border-2 border-white" style={{ background: c }} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">{g.label}</span>
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
                        onClick={apply}
                        className="flex-1 py-3 rounded-full bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AllProducts() {
    const [activeCategory, setActiveCategory] = useState("View all");
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({ sizes: [], types: [], colors: [], availability: "all" });
    const navRef = useRef(null);

    // Filtered products
    const filtered = allProducts.filter(p => {
        if (activeCategory !== "View all" && p.category !== activeCategory) return false;
        if (filters.availability === "inStock" && !p.inStock) return false;
        if (filters.availability === "outOfStock" && p.inStock) return false;
        if (filters.types.length > 0 && !filters.types.includes(p.category)) return false;
        if (filters.sizes.length > 0 && !p.sizes.some(s => filters.sizes.includes(s))) return false;
        return true;
    });

    const activeFilterCount =
        filters.sizes.length + filters.types.length + filters.colors.length +
        (filters.availability !== "all" ? 1 : 0);

    // Horizontal scroll with mouse drag on category bar
    useEffect(() => {
        const el = navRef.current;
        if (!el) return;
        let isDown = false, startX, scrollLeft;
        const onDown = e => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
        const onUp = () => { isDown = false; };
        const onMove = e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - el.offsetLeft; el.scrollLeft = scrollLeft - (x - startX); };
        el.addEventListener("mousedown", onDown);
        el.addEventListener("mouseleave", onUp);
        el.addEventListener("mouseup", onUp);
        el.addEventListener("mousemove", onMove);
        return () => { el.removeEventListener("mousedown", onDown); el.removeEventListener("mouseleave", onUp); el.removeEventListener("mouseup", onUp); el.removeEventListener("mousemove", onMove); };
    }, []);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {/* Google Font */}
                <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { height: 4px; width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 py-3">
                            {/* Category Pills — scrollable */}
                            <div
                                ref={navRef}
                                className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar select-none"
                            >
                                {NAV_CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 whitespace-nowrap ${activeCategory === cat ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Advance Filters Button */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {/* Sort icon (decorative) */}
                                <button className="hidden sm:flex items-center gap-1 p-2 hover:bg-gray-50 rounded-full transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round">
                                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="9" y2="18" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setFilterOpen(true)}
                                    className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold tracking-wide text-gray-700 hover:border-gray-400 transition-all duration-200 whitespace-nowrap"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                    </svg>
                                    <span className="hidden sm:inline">Advance Filters</span>
                                    <span className="sm:hidden">Filters</span>
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Products Grid ── */}
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Results count */}
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-xs text-gray-400 uppercase tracking-widest">
                            {filtered.length} <span className="text-gray-600">Products</span>
                        </p>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={() => setFilters({ sizes: [], types: [], colors: [], availability: "all" })}
                                className="text-xs text-gray-400 hover:text-gray-700 underline transition-colors"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="text-5xl mb-4">🔍</div>
                            <p className="text-lg font-semibold text-gray-700 mb-2">No products found</p>
                            <p className="text-sm text-gray-400">Try adjusting your category or filters</p>
                            <button
                                onClick={() => { setActiveCategory("View all"); setFilters({ sizes: [], types: [], colors: [], availability: "all" }); }}
                                className="mt-5 px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold tracking-widest uppercase"
                            >
                                Reset
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10">
                            {filtered.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Filter Drawer ── */}
                <FilterDrawer
                    open={filterOpen}
                    onClose={() => setFilterOpen(false)}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>
        </>
    );
}