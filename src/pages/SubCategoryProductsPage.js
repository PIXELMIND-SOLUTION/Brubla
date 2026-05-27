import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Heart, ShoppingBag, Star, SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Header from "../components/Header";

const COFFEE = "#000";

// ─── Sort Options ─────────────────────────────────────────────────────────────
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const filterOptions = {
  price: [
    { label: "Under $50", min: 0, max: 50 },
    { label: "$50 – $100", min: 50, max: 100 },
    { label: "$100 – $200", min: 100, max: 200 },
    { label: "Over $200", min: 200, max: Infinity },
  ],
  rating: [
    { label: "4★ & above", value: 4 },
    { label: "3★ & above", value: 3 },
    { label: "2★ & above", value: 2 },
  ],
};

// ─── Helper Functions ─────────────────────────────────────────────────────────
const getProductImage = (product) => {
  // Find the first variant with a mainImage
  const variantWithImage = product.variants?.find(v => v.mainImage && v.mainImage.trim() !== "");
  
  if (variantWithImage && variantWithImage.mainImage) {
    let imgUrl = variantWithImage.mainImage;
    // Replace localhost with actual API host
    if (imgUrl.includes("localhost:4077")) {
      imgUrl = imgUrl.replace("http://localhost:4077", "http://31.97.228.17:4077");
    }
    return imgUrl;
  }
  
  // Fallback: try to get any image from any variant
  for (const variant of product.variants || []) {
    if (variant.images && variant.images.length > 0) {
      let imgUrl = variant.images[0];
      if (imgUrl.includes("localhost:4077")) {
        imgUrl = imgUrl.replace("http://localhost:4077", "http://31.97.228.17:4077");
      }
      return imgUrl;
    }
  }
  
  // Default fallback image
  return "https://placehold.co/600x800/e5e7eb/64748b?text=No+Image";
};

const getProductRating = (product) => {
  return product.averageRating || 4.0;
};

const getProductTags = (product) => {
  if (product.tags && product.tags.length > 0) {
    return product.tags.slice(0, 2);
  }
  return ["popular"];
};

const getDiscountPercentage = (product) => {
  if (product.displayActualPrice && product.displayPrice) {
    return Math.round(((product.displayActualPrice - product.displayPrice) / product.displayActualPrice) * 100);
  }
  return null;
};

// ─── Tag Badge Component ─────────────────────────────────────────────────────
const TAG_STYLES = {
  cotton: "bg-amber-100 text-amber-700",
  premium: "bg-emerald-100 text-emerald-700",
  summer: "bg-sky-100 text-sky-700",
  casual: "bg-purple-100 text-purple-700",
  "t-shirt": "bg-rose-100 text-rose-700",
  popular: "bg-gray-100 text-gray-600",
  trending: "bg-amber-100 text-amber-700",
  bestseller: "bg-emerald-100 text-emerald-700",
  new: "bg-sky-100 text-sky-700",
  default: "bg-gray-100 text-gray-600",
};

function Tag({ label }) {
  const cls = TAG_STYLES[label?.toLowerCase()] ?? TAG_STYLES.default;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

// ─── Chip Component ──────────────────────────────────────────────────────────
function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-full text-[11px] text-gray-700">
      {label}
      <button onClick={onRemove} className="hover:text-gray-900 transition-colors ml-0.5">
        <X size={10} />
      </button>
    </span>
  );
}

// ─── Empty State Component ───────────────────────────────────────────────────
function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
        <ShoppingBag size={24} className="text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1.5">No products found</h3>
      <p className="text-sm text-gray-500 max-w-xs">Try adjusting your filters to find what you're looking for.</p>
      <button
        onClick={onClear}
        className="mt-6 px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80"
        style={{ backgroundColor: COFFEE }}
      >
        Clear filters
      </button>
    </div>
  );
}

// ─── Product Card (Grid View) ────────────────────────────────────────────────
function ProductCard({ product, isWishlisted, onWishlistToggle }) {
  const navigate = useNavigate();
  const discount = getDiscountPercentage(product);
  const productImage = getProductImage(product);
  const tags = getProductTags(product);
  const rating = getProductRating(product);

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div onClick={() => navigate(`/product/${product.id}`)} className="relative overflow-hidden bg-gray-50 cursor-pointer" style={{ aspectRatio: "3/4" }}>
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{ backgroundColor: COFFEE }}>
              -{discount}%
            </span>
          )}
          {tags.slice(0, 1).map(tag => <Tag key={tag} label={tag} />)}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlistToggle(product.id); }}
          className={`absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 ${
            isWishlisted ? "bg-rose-50" : "bg-white/80 hover:bg-white shadow-sm"
          }`}
        >
          <Heart
            size={13}
            className={isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-500"}
          />
        </button>

        {/* Out of stock overlay */}
        {product.totalStock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-[11px] font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-0.5">
            {product.subcategoryName}
          </p>
          <h3 className="text-gray-800 text-xs font-medium leading-snug line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-[10px] text-gray-500">{rating.toFixed(1)}</span>
          <span className="text-[10px] text-gray-400">({product.reviews?.length || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-900 font-semibold text-sm">${product.displayPrice}</span>
            {product.displayActualPrice && (
              <span className="text-gray-400 text-[10px] line-through">${product.displayActualPrice}</span>
            )}
          </div>
          <button
            disabled={product.totalStock === 0}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
              product.totalStock > 0
                ? "text-white hover:opacity-80 active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            style={product.totalStock > 0 ? { backgroundColor: COFFEE } : {}}
          >
            <ShoppingBag size={10} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product List Item (List View) ───────────────────────────────────────────
function ProductListItem({ product, isWishlisted, onWishlistToggle }) {
  const discount = getDiscountPercentage(product);
  const productImage = getProductImage(product);
  const tags = getProductTags(product);
  const rating = getProductRating(product);

  return (
    <div className="flex gap-3 sm:gap-4 bg-white rounded-xl p-3 sm:p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 group">
      {/* Image */}
      <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
        <img src={productImage} alt={product.name} className="w-full h-full object-cover" />
        {product.totalStock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-[8px] font-semibold text-gray-500">Sold Out</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-medium mb-0.5">
                {product.subcategoryName}
              </p>
              <h3 className="text-gray-800 text-sm font-medium leading-snug line-clamp-1">
                {product.name}
              </h3>
            </div>
            <button
              onClick={() => onWishlistToggle(product.id)}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <Heart
                size={14}
                className={isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-gray-600"}
              />
            </button>
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] text-gray-500">{rating.toFixed(1)}</span>
            <span className="text-[10px] text-gray-400">({product.reviews?.length || 0})</span>
            <span className="text-gray-300 text-[10px]">·</span>
            {tags.slice(0, 1).map(tag => <Tag key={tag} label={tag} />)}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-semibold text-sm">${product.displayPrice}</span>
            {product.displayActualPrice && (
              <>
                <span className="text-gray-400 text-xs line-through">${product.displayActualPrice}</span>
                {discount && (
                  <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: COFFEE }}>
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>
          <Link to={`/product/${product.id}`} className="text-gray-500 hover:text-amber-600 transition-colors">
            <FaEye size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Drawer Component ─────────────────────────────────────────────────
function FilterDrawer({ selectedFilters, setSelectedFilters, onClose }) {
  const [priceRange, setPriceRange] = useState(selectedFilters.priceRange);
  const [minRating, setMinRating] = useState(selectedFilters.minRating);
  const [inStockOnly, setInStockOnly] = useState(selectedFilters.inStockOnly);

  const applyFilters = () => {
    setSelectedFilters({ priceRange, minRating, inStockOnly });
    onClose();
  };

  const reset = () => {
    setPriceRange(null);
    setMinRating(null);
    setInStockOnly(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white border-l border-gray-100 z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-gray-800 font-semibold text-base">Filters</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">
          {/* Price */}
          <section>
            <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Price Range</h3>
            <div className="space-y-2">
              {[...filterOptions.price, { label: "Any price", min: null, max: null }].map((range, idx) => {
                const isSelected = range.label === "Any price"
                  ? priceRange === null
                  : priceRange?.label === range.label;
                return (
                  <label key={range.label} className="flex items-center gap-3 cursor-pointer group/radio">
                    <span
                      onClick={() => setPriceRange(range.label === "Any price" ? null : filterOptions.price[idx])}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "border-coffee bg-coffee"
                          : "border-gray-300 group-hover/radio:border-gray-400"
                      }`}
                      style={isSelected ? { borderColor: COFFEE, backgroundColor: COFFEE } : {}}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="text-sm text-gray-600 group-hover/radio:text-gray-900 transition-colors">{range.label}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Rating */}
          <section>
            <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Rating</h3>
            <div className="space-y-2">
              {[...filterOptions.rating, { label: "Any rating", value: null }].map((r) => (
                <label key={r.label} className="flex items-center gap-3 cursor-pointer group/radio">
                  <span
                    onClick={() => setMinRating(r.value)}
                    className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                      minRating === r.value
                        ? "border-coffee bg-coffee"
                        : "border-gray-300 group-hover/radio:border-gray-400"
                    }`}
                    style={minRating === r.value ? { borderColor: COFFEE, backgroundColor: COFFEE } : {}}
                  >
                    {minRating === r.value && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-sm text-gray-600 group-hover/radio:text-gray-900 transition-colors">{r.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Availability */}
          <section>
            <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Availability</h3>
            <label className="flex items-center gap-3 cursor-pointer group/check">
              <span
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                  inStockOnly ? "border-coffee bg-coffee" : "border-gray-300 group-hover/check:border-gray-400"
                }`}
                style={inStockOnly ? { borderColor: COFFEE, backgroundColor: COFFEE } : {}}
              >
                {inStockOnly && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-gray-600 group-hover/check:text-gray-900 transition-colors">In Stock Only</span>
            </label>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={reset}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: COFFEE }}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SubCategoryProductsPage() {
  const { subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ priceRange: null, minRating: null, inStockOnly: false });
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (!subcategoryId) {
        setError("No subcategory ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://31.97.228.17:4077/api/admin/subcategories/${subcategoryId}/products`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.products) {
          // Set subcategory and category info from first product if available
          if (data.products.length > 0) {
            const firstProduct = data.products[0];
            setSubcategoryName(firstProduct.subcategoryName || "");
            if (firstProduct.categoryId && firstProduct.categoryId.name) {
              setCategoryName(firstProduct.categoryId.name);
            }
          }
          
          // Filter only active products
          const activeProducts = data.products.filter(p => p.isActive === true);
          setProducts(activeProducts);
        } else {
          setProducts([]);
          console.warn("No products found for this subcategory");
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategoryId]);

  const toggleWishlist = (id) =>
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const filteredProducts = useMemo(() => {
    let list = [...products];
    
    // Apply price filter
    if (selectedFilters.priceRange) {
      list = list.filter((p) => 
        p.displayPrice >= selectedFilters.priceRange.min && 
        p.displayPrice <= selectedFilters.priceRange.max
      );
    }
    
    // Apply rating filter
    if (selectedFilters.minRating) {
      list = list.filter((p) => (p.averageRating || 0) >= selectedFilters.minRating);
    }
    
    // Apply stock filter
    if (selectedFilters.inStockOnly) {
      list = list.filter((p) => p.totalStock > 0);
    }
    
    // Apply sorting
    switch (sortBy) {
      case "price_asc": 
        list.sort((a, b) => a.displayPrice - b.displayPrice); 
        break;
      case "price_desc": 
        list.sort((a, b) => b.displayPrice - a.displayPrice); 
        break;
      case "rating": 
        list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)); 
        break;
      case "newest": 
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
        break;
      default: 
        list.sort((a, b) => b.id - a.id);
    }
    
    return list;
  }, [products, sortBy, selectedFilters]);

  const clearFilters = () => setSelectedFilters({ priceRange: null, minRating: null, inStockOnly: false });
  const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length;

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-coffee rounded-full animate-spin" style={{ borderTopColor: COFFEE }} />
            <p className="text-gray-500 text-xs tracking-wide">Loading products…</p>
          </div>
        </div>
      </>
    );
  }

  if (error && products.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Products</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 text-white rounded-md transition-opacity hover:opacity-80"
              style={{ backgroundColor: COFFEE }}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 sm:py-16">
          <div className="max-w-screen-xl mx-auto px-3 sm:px-5 lg:px-8">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full transition-colors mb-6"
            >
              ← Back
            </button>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
              {subcategoryName || "Products"}
            </h1>
            {categoryName && (
              <p className="text-white/70 text-sm sm:text-base max-w-2xl">
                Explore our collection of {subcategoryName?.toLowerCase()} in the {categoryName} category
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
              <span>{filteredProducts.length} products</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>Handpicked for you</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-screen-xl mx-auto px-3 sm:px-5 lg:px-8 py-5 sm:py-7">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5 sm:mb-6 pb-4 border-b border-gray-200">

            {/* Left: filter + chips */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-full text-xs text-gray-600 hover:text-gray-900 transition-colors shadow-sm"
              >
                <SlidersHorizontal size={12} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: COFFEE }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedFilters.priceRange && (
                    <Chip label={selectedFilters.priceRange.label} onRemove={() => setSelectedFilters({ ...selectedFilters, priceRange: null })} />
                  )}
                  {selectedFilters.minRating && (
                    <Chip label={`${selectedFilters.minRating}★+`} onRemove={() => setSelectedFilters({ ...selectedFilters, minRating: null })} />
                  )}
                  {selectedFilters.inStockOnly && (
                    <Chip label="In Stock" onRemove={() => setSelectedFilters({ ...selectedFilters, inStockOnly: false })} />
                  )}
                  <button onClick={clearFilters} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2">
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Right: view toggle + sort */}
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-full transition-colors ${viewMode === "grid" ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-700"}`}
                  style={viewMode === "grid" ? { backgroundColor: COFFEE } : {}}
                >
                  <LayoutGrid size={13} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-full transition-colors ${viewMode === "list" ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-700"}`}
                  style={viewMode === "list" ? { backgroundColor: COFFEE } : {}}
                >
                  <List size={13} />
                </button>
              </div>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-full text-xs text-gray-600 hover:text-gray-900 transition-colors shadow-sm"
                >
                  <span className="hidden sm:inline text-gray-400">Sort:</span>
                  <span>{sortOptions.find((o) => o.value === sortBy)?.label}</span>
                  <ChevronDown size={11} className={`text-gray-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
                </button>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-200 rounded-xl overflow-hidden z-20 shadow-lg">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                            sortBy === opt.value ? "text-white bg-coffee" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                          style={sortBy === opt.value ? { backgroundColor: COFFEE } : {}}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : viewMode === "grid" ? (
            <div
              className="grid gap-3 sm:gap-4"
              style={{
                gridTemplateColumns:
                  window.innerWidth >= 1024
                    ? "repeat(auto-fill, minmax(200px, 1fr))"
                    : "repeat(auto-fill, minmax(140px, 1fr))",
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onWishlistToggle={toggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {filteredProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onWishlistToggle={toggleWishlist}
                />
              ))}
            </div>
          )}
        </div>

        {/* Filter Drawer */}
        {isFilterOpen && (
          <FilterDrawer
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
      </div>
    </>
  );
}