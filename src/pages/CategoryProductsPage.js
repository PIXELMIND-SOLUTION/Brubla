import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Heart, ShoppingBag, Star, SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Header from "../components/Header";

// ─── Mock product data ─────────────────────────────────────────────────────────
const allProducts = [
  { id: 1, name: "Oversized Denim Jacket", price: 89.99, originalPrice: 129.99, rating: 4.5, reviewCount: 234, image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80", category: "Women's-Fashion", subcategory: "Jackets", tags: ["trending", "bestseller"], colors: ["blue", "black"], inStock: true },
  { id: 2, name: "Minimalist Leather Backpack", price: 79.99, originalPrice: null, rating: 4.8, reviewCount: 567, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", category: "Women's-Fashion", subcategory: "Bags", tags: ["new"], colors: ["brown", "black"], inStock: true },
  { id: 3, name: "Cashmere Wool Sweater", price: 129.99, originalPrice: 199.99, rating: 4.7, reviewCount: 189, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", category: "Men's-Style", subcategory: "Sweaters", tags: ["bestseller"], colors: ["gray", "navy"], inStock: true },
  { id: 4, name: "Classic White Sneakers", price: 69.99, originalPrice: null, rating: 4.6, reviewCount: 892, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80", category: "Sneakers", subcategory: "Casual", tags: ["trending", "bestseller"], colors: ["white", "black"], inStock: true },
  { id: 5, name: "Sterling Silver Necklace", price: 149.99, originalPrice: 199.99, rating: 4.9, reviewCount: 423, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", category: "Jewelry", subcategory: "Necklaces", tags: ["luxury"], colors: ["silver"], inStock: true },
  { id: 6, name: "Ceramic Table Lamp", price: 59.99, originalPrice: null, rating: 4.4, reviewCount: 178, image: "https://images.unsplash.com/photo-1507473885765-e6b057fbbf33?w=600&q=80", category: "Home-Decor", subcategory: "Lighting", tags: ["popular"], colors: ["white", "beige"], inStock: false },
  { id: 7, name: "Hydrating Face Serum", price: 45.99, originalPrice: 64.99, rating: 4.7, reviewCount: 1123, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80", category: "Beauty", subcategory: "Skincare", tags: ["new"], colors: [], inStock: true },
  { id: 8, name: "Wireless Noise Cancelling Headphones", price: 199.99, originalPrice: 299.99, rating: 4.8, reviewCount: 2341, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", category: "Electronics", subcategory: "Audio", tags: ["tech", "bestseller"], colors: ["black", "white"], inStock: true },
  { id: 9, name: "Yoga Mat Premium", price: 49.99, originalPrice: null, rating: 4.5, reviewCount: 756, image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&q=80", category: "Sports-and-Fitness", subcategory: "Yoga", tags: ["active"], colors: ["purple", "green"], inStock: true },
  { id: 10, name: "Wooden Building Blocks Set", price: 34.99, originalPrice: 49.99, rating: 4.9, reviewCount: 445, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80", category: "Kids-and-Toys", subcategory: "Educational", tags: ["fun"], colors: [], inStock: true },
  { id: 11, name: "Hardcover Coffee Table Book", price: 39.99, originalPrice: 59.99, rating: 4.6, reviewCount: 312, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80", category: "Books-and-Art", subcategory: "Books", tags: ["culture"], colors: [], inStock: true },
  { id: 12, name: "Ribbed Knit Beanie", price: 24.99, originalPrice: null, rating: 4.3, reviewCount: 189, image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80", category: "Men's-Style", subcategory: "Accessories", tags: ["new"], colors: ["black", "gray", "navy"], inStock: true },
  { id: 13, name: "Automatic Dress Watch", price: 349.99, originalPrice: 499.99, rating: 4.8, reviewCount: 210, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80", category: "Watches", subcategory: "Dress", tags: ["luxury"], colors: ["silver", "gold"], inStock: true },
  { id: 14, name: "Leather Tote Bag", price: 95.99, originalPrice: 129.99, rating: 4.6, reviewCount: 387, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", category: "Bags-and-Accessories", subcategory: "Totes", tags: ["trending"], colors: ["tan", "black"], inStock: true },
  { id: 15, name: "Gaming Mechanical Keyboard", price: 129.99, originalPrice: 179.99, rating: 4.7, reviewCount: 943, image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80", category: "Gaming", subcategory: "Peripherals", tags: ["hot"], colors: ["black", "white"], inStock: true },
  { id: 16, name: "Mid-Century Accent Chair", price: 299.99, originalPrice: 399.99, rating: 4.5, reviewCount: 156, image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80", category: "Furniture", subcategory: "Chairs", tags: ["popular"], colors: ["walnut", "white"], inStock: true },
  { id: 17, name: "Cast Iron Dutch Oven", price: 79.99, originalPrice: 119.99, rating: 4.9, reviewCount: 2108, image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600&q=80", category: "Kitchen", subcategory: "Cookware", tags: ["bestseller"], colors: ["red", "black", "cream"], inStock: true },
];

const categoryConfig = {
  "Women's-Fashion": { title: "Women's Fashion", description: "Discover the latest trends in women's clothing, accessories, and more", heroImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80" },
  "Men's-Style": { title: "Men's Style", description: "Elevate your wardrobe with premium menswear and accessories", heroImage: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&q=80" },
  Sneakers: { title: "Sneakers", description: "Step up your style with the freshest kicks from top brands", heroImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80" },
  Jewelry: { title: "Jewelry", description: "Timeless pieces that make every moment special", heroImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80" },
  "Home-Decor": { title: "Home Decor", description: "Create your dream space with our curated collection", heroImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80" },
  Beauty: { title: "Beauty", description: "Glow up with premium skincare and beauty essentials", heroImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&q=80" },
  Electronics: { title: "Electronics", description: "Cutting-edge tech for the modern lifestyle", heroImage: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&q=80" },
  "Sports-and-Fitness": { title: "Sports & Fitness", description: "Gear up for every challenge with performance-driven equipment", heroImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80" },
  "Kids-and-Toys": { title: "Kids & Toys", description: "Spark imagination with fun and educational toys", heroImage: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1600&q=80" },
  "Books-and-Art": { title: "Books & Art", description: "Feed your mind with inspiring reads and artistic finds", heroImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80" },
  Watches: { title: "Watches", description: "Precision craftsmanship for every wrist", heroImage: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1600&q=80" },
  "Bags-and-Accessories": { title: "Bags & Accessories", description: "Complete your look with the perfect carry", heroImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1600&q=80" },
  Gaming: { title: "Gaming", description: "Level up your setup with pro-grade gear", heroImage: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1600&q=80" },
  Furniture: { title: "Furniture", description: "Thoughtfully designed pieces for every room", heroImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80" },
  Kitchen: { title: "Kitchen", description: "Cook with confidence using premium kitchenware", heroImage: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1600&q=80" },
};

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

const COFFEE = "#000";

// ─── Tag badge (Light Theme) ───────────────────────────────────────────────────
const TAG_STYLES = {
  trending: "bg-amber-100 text-amber-700",
  bestseller: "bg-emerald-100 text-emerald-700",
  new: "bg-sky-100 text-sky-700",
  luxury: "bg-purple-100 text-purple-700",
  hot: "bg-rose-100 text-rose-700",
  default: "bg-gray-100 text-gray-600",
};

function Tag({ label }) {
  const cls = TAG_STYLES[label] ?? TAG_STYLES.default;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

// ─── Chip (Light Theme) ────────────────────────────────────────────────────────
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

// ─── Empty State (Light Theme) ─────────────────────────────────────────────────
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

// ─── Product Card (Grid) - Light Theme ─────────────────────────────────────────
function ProductCard({ product, isWishlisted, onWishlistToggle }) {

  const navigate = useNavigate();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div onClick={() => navigate(`/product/${product.id}`)} className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
        <img
          src={product.image}
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
          {product.tags.slice(0, 1).map(tag => <Tag key={tag} label={tag} />)}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => onWishlistToggle(product.id)}
          className={`absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 ${isWishlisted ? "bg-rose-50" : "bg-white/80 hover:bg-white shadow-sm"
            }`}
        >
          <Heart
            size={13}
            className={isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-500"}
          />
        </button>

        {/* Out of stock overlay */}
        {!product.inStock && (
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
            {product.subcategory}
          </p>
          <h3 className="text-gray-800 text-xs font-medium leading-snug line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-[10px] text-gray-500">{product.rating}</span>
          <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-900 font-semibold text-sm">${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-[10px] line-through">${product.originalPrice}</span>
            )}
          </div>
          {/* <Link to={`/product/${product.id}`} className="text-gray-500 hover:text-amber-600 transition-colors">
            <FaEye size={14} />
          </Link> */}
          <button
            disabled={!product.inStock}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${product.inStock
              ? "text-white hover:opacity-80 active:scale-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            style={product.inStock ? { backgroundColor: COFFEE } : {}}
          >
            <ShoppingBag size={10} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product List Item - Light Theme ───────────────────────────────────────────
function ProductListItem({ product, isWishlisted, onWishlistToggle }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="flex gap-3 sm:gap-4 bg-white rounded-xl p-3 sm:p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 group">
      {/* Image */}
      <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        {!product.inStock && (
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
                {product.subcategory}
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
            <span className="text-[10px] text-gray-500">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
            <span className="text-gray-300 text-[10px]">·</span>
            {product.tags.slice(0, 1).map(tag => <Tag key={tag} label={tag} />)}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-semibold text-sm">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-gray-400 text-xs line-through">${product.originalPrice}</span>
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
          {/* <button
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${product.inStock
              ? "text-white hover:opacity-80 active:scale-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            style={product.inStock ? { backgroundColor: COFFEE } : {}}
          >
            <ShoppingBag size={12} />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </button> */}
        </div>
      </div>
    </div>
  );
}

// ─── Filter Drawer (Light Theme) ───────────────────────────────────────────────
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
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected
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
                    className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${minRating === r.value
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
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${inStockOnly ? "border-coffee bg-coffee" : "border-gray-300 group-hover/check:border-gray-400"
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

// ─── Main Page - Light Theme ────────────────────────────────────────────────────
export default function CategoryProductsPage() {
  const category = window.location.pathname.split("/").pop() || "Women's-Fashion";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ priceRange: null, minRating: null, inStockOnly: false });
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  const navigate = useNavigate();

  const config = categoryConfig[category] ?? categoryConfig["Women's-Fashion"];

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setProducts(allProducts.filter((p) => p.category === category));
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [category]);

  const toggleWishlist = (id) =>
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedFilters.priceRange)
      list = list.filter((p) => p.price >= selectedFilters.priceRange.min && p.price <= selectedFilters.priceRange.max);
    if (selectedFilters.minRating)
      list = list.filter((p) => p.rating >= selectedFilters.minRating);
    if (selectedFilters.inStockOnly)
      list = list.filter((p) => p.inStock);
    switch (sortBy) {
      case "price_asc": list.sort((a, b) => a.price - b.price); break;
      case "price_desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => b.id - a.id);
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* ── Hero with Background Image ── */}
        <div className="relative overflow-hidden" style={{ height: "clamp(180px, 30vw, 340px)" }}>
          <img src={config.heroImage} alt={config.title} className="absolute inset-0 w-full h-full object-cover" />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-gray-50/90" /> */}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-end text-center h-full px-4 pb-8 sm:pb-10">
            {/* Back */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-black/30 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full transition-colors"
              >
                ← Back
              </button>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 drop-shadow-lg">
              {config.title}
            </h1>
            <p className="text-white/80 text-xs sm:text-sm max-w-lg leading-relaxed drop-shadow">
              {config.description}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[10px] sm:text-xs text-white/60">
              <span>{filteredProducts.length} products</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>Updated daily</span>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="max-w-screen-xl mx-auto px-3 sm:px-5 lg:px-8 py-5 sm:py-7">

          {/* ── Toolbar ── */}
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
                          className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${sortBy === opt.value ? "text-white bg-coffee" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

          {/* ── Products ── */}
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

        {/* ── Filter Drawer ── */}
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