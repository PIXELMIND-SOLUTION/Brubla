import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Heart, ShoppingBag, Star, SlidersHorizontal, X } from "lucide-react";

// Mock product data - in a real app, this would come from an API
const allProducts = [
  {
    id: 1,
    name: "Oversized Denim Jacket",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
    category: "Women's Fashion",
    subcategory: "Jackets",
    tags: ["trending", "bestseller"],
    colors: ["blue", "black"],
    inStock: true,
  },
  {
    id: 2,
    name: "Minimalist Leather Backpack",
    price: 79.99,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 567,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    category: "Women's Fashion",
    subcategory: "Bags",
    tags: ["new"],
    colors: ["brown", "black"],
    inStock: true,
  },
  {
    id: 3,
    name: "Cashmere Wool Sweater",
    price: 129.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    category: "Men's Style",
    subcategory: "Sweaters",
    tags: ["bestseller"],
    colors: ["gray", "navy"],
    inStock: true,
  },
  {
    id: 4,
    name: "Classic White Sneakers",
    price: 69.99,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 892,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    category: "Sneakers",
    subcategory: "Casual",
    tags: ["trending", "bestseller"],
    colors: ["white", "black"],
    inStock: true,
  },
  {
    id: 5,
    name: "Sterling Silver Necklace",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.9,
    reviewCount: 423,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    category: "Jewelry",
    subcategory: "Necklaces",
    tags: ["luxury"],
    colors: ["silver"],
    inStock: true,
  },
  {
    id: 6,
    name: "Ceramic Table Lamp",
    price: 59.99,
    originalPrice: null,
    rating: 4.4,
    reviewCount: 178,
    image: "https://images.unsplash.com/photo-1507473885765-e6b057fbbf33?w=600&q=80",
    category: "Home Decor",
    subcategory: "Lighting",
    tags: ["popular"],
    colors: ["white", "beige"],
    inStock: false,
  },
  {
    id: 7,
    name: "Hydrating Face Serum",
    price: 45.99,
    originalPrice: 64.99,
    rating: 4.7,
    reviewCount: 1123,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
    category: "Beauty",
    subcategory: "Skincare",
    tags: ["new"],
    colors: [],
    inStock: true,
  },
  {
    id: 8,
    name: "Wireless Noise Cancelling Headphones",
    price: 199.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviewCount: 2341,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    category: "Electronics",
    subcategory: "Audio",
    tags: ["tech", "bestseller"],
    colors: ["black", "white"],
    inStock: true,
  },
  {
    id: 9,
    name: "Yoga Mat Premium",
    price: 49.99,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 756,
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&q=80",
    category: "Sports & Outdoor",
    subcategory: "Yoga",
    tags: ["active"],
    colors: ["purple", "green"],
    inStock: true,
  },
  {
    id: 10,
    name: "Wooden Building Blocks Set",
    price: 34.99,
    originalPrice: 49.99,
    rating: 4.9,
    reviewCount: 445,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80",
    category: "Kids & Toys",
    subcategory: "Educational",
    tags: ["fun"],
    colors: [],
    inStock: true,
  },
  {
    id: 11,
    name: "Hardcover Coffee Table Book",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.6,
    reviewCount: 312,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
    category: "Books & Art",
    subcategory: "Books",
    tags: ["culture"],
    colors: [],
    inStock: true,
  },
  {
    id: 12,
    name: "Ribbed Knit Beanie",
    price: 24.99,
    originalPrice: null,
    rating: 4.3,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80",
    category: "Men's Style",
    subcategory: "Accessories",
    tags: ["new"],
    colors: ["black", "gray", "navy"],
    inStock: true,
  },
];

// Category configuration
const categoryConfig = {
  "Women's Fashion": {
    title: "Women's Fashion",
    description: "Discover the latest trends in women's clothing, accessories, and more",
    heroImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
    accentColor: "rose",
  },
  "Men's Style": {
    title: "Men's Style",
    description: "Elevate your wardrobe with premium menswear and accessories",
    heroImage: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&q=80",
    accentColor: "slate",
  },
  Sneakers: {
    title: "Sneakers",
    description: "Step up your style with the freshest kicks from top brands",
    heroImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80",
    accentColor: "orange",
  },
  Jewelry: {
    title: "Jewelry",
    description: "Timeless pieces that make every moment special",
    heroImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80",
    accentColor: "amber",
  },
  "Home Decor": {
    title: "Home Decor",
    description: "Create your dream space with our curated collection",
    heroImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80",
    accentColor: "teal",
  },
  Beauty: {
    title: "Beauty",
    description: "Glow up with premium skincare and beauty essentials",
    heroImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&q=80",
    accentColor: "pink",
  },
  Electronics: {
    title: "Electronics",
    description: "Cutting-edge tech for the modern lifestyle",
    heroImage: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1600&q=80",
    accentColor: "blue",
  },
  "Sports & Outdoor": {
    title: "Sports & Outdoor",
    description: "Gear up for adventure with performance-driven equipment",
    heroImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&q=80",
    accentColor: "green",
  },
  "Kids & Toys": {
    title: "Kids & Toys",
    description: "Spark imagination with fun and educational toys",
    heroImage: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1600&q=80",
    accentColor: "purple",
  },
  "Books & Art": {
    title: "Books & Art",
    description: "Feed your mind with inspiring reads and artistic finds",
    heroImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80",
    accentColor: "stone",
  },
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
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $200", min: 100, max: 200 },
    { label: "Over $200", min: 200, max: Infinity },
  ],
  rating: [
    { label: "4★ & above", value: 4 },
    { label: "3★ & above", value: 3 },
    { label: "2★ & above", value: 2 },
  ],
  availability: [{ label: "In Stock Only", value: "inStock" }],
};

export default function CategoryProductsPage({ category = "Women's Fashion" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: null,
    minRating: null,
    inStockOnly: false,
  });
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const config = categoryConfig[category] || categoryConfig["Women's Fashion"];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const filtered = allProducts.filter((p) => p.category === category);
      setProducts(filtered);
      setLoading(false);
    }, 500);
  }, [category]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply price filter
    if (selectedFilters.priceRange) {
      filtered = filtered.filter(
        (p) => p.price >= selectedFilters.priceRange.min && p.price <= selectedFilters.priceRange.max
      );
    }

    // Apply rating filter
    if (selectedFilters.minRating) {
      filtered = filtered.filter((p) => p.rating >= selectedFilters.minRating);
    }

    // Apply stock filter
    if (selectedFilters.inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        // In a real app, you'd have a date field
        break;
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [products, sortBy, selectedFilters]);

  const clearFilters = () => {
    setSelectedFilters({
      priceRange: null,
      minRating: null,
      inStockOnly: false,
    });
  };

  const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <div className="relative h-[280px] md:h-[360px] overflow-hidden">
        <img
          src={config.heroImage}
          alt={config.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-black/60 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-3">
            {config.title}
          </h1>
          <p className="text-zinc-200 text-base md:text-lg max-w-2xl">
            {config.description}
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-zinc-300">
            <span>{filteredProducts.length} products</span>
            <span>•</span>
            <span>Updated daily</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-sm text-zinc-300 transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2">
                {selectedFilters.priceRange && (
                  <span className="px-3 py-1.5 bg-zinc-900 rounded-full text-xs text-zinc-300 flex items-center gap-1">
                    {selectedFilters.priceRange.label}
                    <button onClick={() => setSelectedFilters({ ...selectedFilters, priceRange: null })}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedFilters.minRating && (
                  <span className="px-3 py-1.5 bg-zinc-900 rounded-full text-xs text-zinc-300 flex items-center gap-1">
                    {selectedFilters.minRating}★ & above
                    <button onClick={() => setSelectedFilters({ ...selectedFilters, minRating: null })}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedFilters.inStockOnly && (
                  <span className="px-3 py-1.5 bg-zinc-900 rounded-full text-xs text-zinc-300 flex items-center gap-1">
                    In Stock
                    <button onClick={() => setSelectedFilters({ ...selectedFilters, inStockOnly: false })}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-zinc-500 hover:text-white underline underline-offset-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Sort & View */}
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-zinc-900 rounded-full p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  viewMode === "grid" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  viewMode === "list" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                List
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-sm text-zinc-300 transition-colors"
              >
                Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label}
                <ChevronDown size={14} className={`transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
              </button>
              {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === option.value
                          ? "bg-white/10 text-white"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl text-white font-medium mb-2">No products found</h3>
            <p className="text-zinc-400">Try adjusting your filters to find what you're looking for.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm text-white transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="space-y-4">
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
  );
}

// Product Card Component
function ProductCard({ product, isWishlisted, onWishlistToggle }) {
  return (
    <div className="group relative bg-zinc-900 rounded-2xl overflow-hidden hover:bg-zinc-800 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Wishlist Button */}
        <button
          onClick={() => onWishlistToggle(product.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-white"} />
        </button>
        {/* Out of Stock Badge */}
        {!product.inStock && (
          <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-medium text-base mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-white text-xs">{product.rating}</span>
          </div>
          <span className="text-zinc-500 text-xs">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-zinc-500 text-sm line-through">${product.originalPrice}</span>
          )}
        </div>
        <button
          disabled={!product.inStock}
          className={`mt-4 w-full py-2 rounded-full text-sm font-medium transition-all ${
            product.inStock
              ? "bg-white text-black hover:bg-zinc-200"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          }`}
        >
          <ShoppingBag size={14} className="inline mr-2" />
          {product.inStock ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}

// Product List Item Component
function ProductListItem({ product, isWishlisted, onWishlistToggle }) {
  return (
    <div className="flex gap-4 bg-zinc-900 rounded-2xl p-4 hover:bg-zinc-800 transition-all duration-300">
      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-white font-medium text-base mb-1">{product.name}</h3>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-0.5">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-white text-xs">{product.rating}</span>
            </div>
            <span className="text-zinc-500 text-xs">({product.reviewCount})</span>
            {!product.inStock && <span className="text-red-400 text-xs">Out of Stock</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-zinc-500 text-sm line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onWishlistToggle(product.id)}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : "text-zinc-400"} />
          </button>
          <button
            disabled={!product.inStock}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              product.inStock
                ? "bg-white text-black hover:bg-zinc-200"
                : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
            }`}
          >
            <ShoppingBag size={14} className="inline mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// Filter Drawer Component
function FilterDrawer({ selectedFilters, setSelectedFilters, onClose }) {
  const [priceRange, setPriceRange] = useState(selectedFilters.priceRange);
  const [minRating, setMinRating] = useState(selectedFilters.minRating);
  const [inStockOnly, setInStockOnly] = useState(selectedFilters.inStockOnly);

  const applyFilters = () => {
    setSelectedFilters({
      priceRange,
      minRating,
      inStockOnly,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#111111] z-50 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-[#111111] border-b border-zinc-800 p-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Price Range */}
          <div>
            <h3 className="text-white font-medium mb-3">Price Range</h3>
            <div className="space-y-2">
              {filterOptions.price.map((range) => (
                <label key={range.label} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange?.label === range.label}
                    onChange={() => setPriceRange(range)}
                    className="w-4 h-4 accent-white"
                  />
                  <span className="text-zinc-300 text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-white font-medium mb-3">Rating</h3>
            <div className="space-y-2">
              {filterOptions.rating.map((rating) => (
                <label key={rating.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === rating.value}
                    onChange={() => setMinRating(rating.value)}
                    className="w-4 h-4 accent-white"
                  />
                  <span className="text-zinc-300 text-sm">{rating.label}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === null}
                  onChange={() => setMinRating(null)}
                  className="w-4 h-4 accent-white"
                />
                <span className="text-zinc-300 text-sm">Any rating</span>
              </label>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-white font-medium mb-3">Availability</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-white"
              />
              <span className="text-zinc-300 text-sm">In Stock Only</span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#111111] border-t border-zinc-800 p-4 flex gap-3">
          <button
            onClick={() => {
              setPriceRange(null);
              setMinRating(null);
              setInStockOnly(false);
            }}
            className="flex-1 py-3 rounded-full border border-zinc-700 text-zinc-300 hover:border-white hover:text-white transition-colors"
          >
            Reset
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}