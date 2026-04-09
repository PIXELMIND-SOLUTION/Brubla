import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search, Filter, X, Star, Heart, ShoppingBag,
    SlidersHorizontal, ChevronDown, ChevronUp,
    Zap, TrendingUp, Clock, Award, Truck,
    Grid3x3, LayoutList, Check, Menu
} from "lucide-react";
import Navbar from "../components/Navbar";

const COFFEE = "#6F4E37";

const allProducts = [
    {
        id: 1,
        name: "Oversized Denim Jacket",
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.5,
        reviewCount: 234,
        image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
        category: "Women's-Fashion",
        subcategory: "Jackets",
        tags: ["trending", "bestseller"],
        colors: ["blue", "black"],
        inStock: true,
        description: "Stylish oversized denim jacket perfect for casual wear.",
        sizes: ["XS", "S", "M", "L", "XL"],
        designer: {
            name: "Elena Martinez",
            brand: "Urban Chic",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            location: "New York, USA"
        }
    },
    {
        id: 2,
        name: "Minimalist Leather Backpack",
        price: 79.99,
        originalPrice: null,
        rating: 4.8,
        reviewCount: 567,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
        category: "Women's-Fashion",
        subcategory: "Bags",
        tags: ["new"],
        colors: ["brown", "black"],
        inStock: true,
        description: "Elegant leather backpack perfect for daily use.",
        sizes: ["One Size"],
        designer: {
            name: "Marcus Chen",
            brand: "LeatherCraft",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg",
            location: "Portland"
        }
    },
    {
        id: 3,
        name: "Cashmere Wool Sweater",
        price: 129.99,
        originalPrice: 199.99,
        rating: 4.7,
        reviewCount: 189,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
        category: "Men's-Style",
        subcategory: "Sweaters",
        tags: ["bestseller"],
        colors: ["gray", "navy"],
        inStock: true,
        description: "Luxurious cashmere wool sweater.",
        sizes: ["S", "M", "L", "XL"],
        designer: {
            name: "Sarah Johnson",
            brand: "Luxe Knits"
        }
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
        description: "Comfortable everyday sneakers.",
        sizes: ["6", "7", "8", "9", "10"],
        designer: {
            name: "Alex Rivera",
            brand: "Urban Stride"
        }
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
        description: "Elegant silver necklace.",
        sizes: ["One Size"],
        designer: {
            name: "Isabella Rossi",
            brand: "Rossi Jewels"
        }
    },
    {
        id: 6,
        name: "Ceramic Table Lamp",
        price: 59.99,
        originalPrice: null,
        rating: 4.4,
        reviewCount: 178,
        image: "https://images.unsplash.com/photo-1507473885765-e6b057fbbf33?w=600&q=80",
        category: "Home-Decor",
        subcategory: "Lighting",
        tags: ["popular"],
        colors: ["white", "beige"],
        inStock: false,
        description: "Modern table lamp.",
        sizes: ["One Size"]
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
        description: "Deeply hydrating face serum with hyaluronic acid.",
        sizes: ["50ml"]
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
        description: "Premium wireless headphones with active noise cancellation.",
        sizes: ["One Size"]
    },
    {
        id: 9,
        name: "Yoga Mat Premium",
        price: 49.99,
        originalPrice: null,
        rating: 4.5,
        reviewCount: 756,
        image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&q=80",
        category: "Sports-and-Fitness",
        subcategory: "Yoga",
        tags: ["active"],
        colors: ["purple", "green"],
        inStock: true,
        description: "Eco-friendly premium yoga mat with excellent grip.",
        sizes: ["One Size"]
    },
    {
        id: 10,
        name: "Wooden Building Blocks Set",
        price: 34.99,
        originalPrice: 49.99,
        rating: 4.9,
        reviewCount: 445,
        image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80",
        category: "Kids-and-Toys",
        subcategory: "Educational",
        tags: ["fun"],
        colors: [],
        inStock: true,
        description: "Educational wooden building blocks set for creative play.",
        sizes: ["100 pieces"]
    },
    {
        id: 11,
        name: "Hardcover Coffee Table Book",
        price: 39.99,
        originalPrice: 59.99,
        rating: 4.6,
        reviewCount: 312,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
        category: "Books-and-Art",
        subcategory: "Books",
        tags: ["culture"],
        colors: [],
        inStock: true,
        description: "Beautiful coffee table book featuring stunning photography.",
        sizes: ["One Size"]
    },
    {
        id: 12,
        name: "Ribbed Knit Beanie",
        price: 24.99,
        originalPrice: null,
        rating: 4.3,
        reviewCount: 189,
        image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80",
        category: "Men's-Style",
        subcategory: "Accessories",
        tags: ["new"],
        colors: ["black", "gray", "navy"],
        inStock: true,
        description: "Warm ribbed knit beanie for cold weather.",
        sizes: ["One Size"]
    },
    {
        id: 13,
        name: "Automatic Dress Watch",
        price: 349.99,
        originalPrice: 499.99,
        rating: 4.8,
        reviewCount: 210,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
        category: "Watches",
        subcategory: "Dress",
        tags: ["luxury"],
        colors: ["silver", "gold"],
        inStock: true,
        description: "Elegant automatic dress watch with sapphire crystal.",
        sizes: ["One Size"]
    },
    {
        id: 14,
        name: "Leather Tote Bag",
        price: 95.99,
        originalPrice: 129.99,
        rating: 4.6,
        reviewCount: 387,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
        category: "Bags-and-Accessories",
        subcategory: "Totes",
        tags: ["trending"],
        colors: ["tan", "black"],
        inStock: true,
        description: "Spacious leather tote bag perfect for work or travel.",
        sizes: ["One Size"]
    },
    {
        id: 15,
        name: "Gaming Mechanical Keyboard",
        price: 129.99,
        originalPrice: 179.99,
        rating: 4.7,
        reviewCount: 943,
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80",
        category: "Gaming",
        subcategory: "Peripherals",
        tags: ["hot"],
        colors: ["black", "white"],
        inStock: true,
        description: "RGB mechanical gaming keyboard with customizable switches.",
        sizes: ["One Size"]
    },
    {
        id: 16,
        name: "Mid-Century Accent Chair",
        price: 299.99,
        originalPrice: 399.99,
        rating: 4.5,
        reviewCount: 156,
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80",
        category: "Furniture",
        subcategory: "Chairs",
        tags: ["popular"],
        colors: ["walnut", "white"],
        inStock: true,
        description: "Stylish mid-century modern accent chair.",
        sizes: ["One Size"]
    },
    {
        id: 17,
        name: "Cast Iron Dutch Oven",
        price: 79.99,
        originalPrice: 119.99,
        rating: 4.9,
        reviewCount: 2108,
        image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600&q=80",
        category: "Kitchen",
        subcategory: "Cookware",
        tags: ["bestseller"],
        colors: ["red", "black", "cream"],
        inStock: true,
        description: "Premium cast iron Dutch oven for perfect cooking.",
        sizes: ["5.5 Qt"]
    }
];

const StarRating = ({ rating, size = "small" }) => {
    const starSize = size === "small" ? 14 : 16;
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={starSize}
                    className={`${i < Math.floor(rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                        }`}
                />
            ))}
        </div>
    );
};

const ProductCard = ({ product, onClick }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onClick={onClick}
            className="group bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-square">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-all z-10"
                >
                    <Heart
                        size={18}
                        className={isWishlisted ? "fill-red-500 text-red-500" : "text-white"}
                    />
                </button>

                {/* Tags */}
                <div className="absolute top-2 left-2 flex gap-1 flex-wrap max-w-[70%]">
                    {product.tags?.includes("bestseller") && (
                        <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold">
                            Bestseller
                        </span>
                    )}
                    {product.tags?.includes("new") && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            New
                        </span>
                    )}
                    {product.tags?.includes("trending") && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Trending
                        </span>
                    )}
                    {product.tags?.includes("luxury") && (
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Luxury
                        </span>
                    )}
                </div>

                {/* Out of Stock Badge */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 truncate">{product.category}</p>
                    </div>
                    <StarRating rating={product.rating} size="small" />
                </div>

                {/* Price */}
                <div className="flex items-baseline flex-wrap gap-2 mt-2">
                    <span className="text-lg sm:text-xl font-bold">${product.price}</span>
                    {product.originalPrice && (
                        <>
                            <span className="text-xs text-gray-500 line-through">
                                ${product.originalPrice}
                            </span>
                            <span className="text-xs text-green-500">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                            </span>
                        </>
                    )}
                </div>

                {/* Reviews */}
                <div className="flex items-center gap-1 mt-2">
                    <StarRating rating={product.rating} size="small" />
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>

                {/* Designer Info */}
                {product.designer && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
                        <img
                            src={product.designer.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                            className="w-5 h-5 rounded-full"
                            alt={product.designer.name}
                        />
                        <span className="text-xs text-gray-400 truncate">{product.designer.brand}</span>
                    </div>
                )}

                {/* Add to Cart Button */}
                {product.inStock && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            alert(`Added ${product.name} to cart!`);
                        }}
                        className="w-full mt-3 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ backgroundColor: COFFEE }}
                    >
                        <ShoppingBag size={16} />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Cart</span>
                    </button>
                )}
            </div>
        </div>
    );
};

const FilterSidebar = ({ filters, setFilters, categories, priceRange, setPriceRange, onClose }) => {
    const FilterSection = ({ title, children, defaultOpen = true }) => {
        const [open, setOpen] = useState(defaultOpen);
        return (
            <div className="border-b border-gray-800 pb-4">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center justify-between w-full py-2 text-left hover:text-gray-300 transition-colors"
                >
                    <span className="font-semibold text-sm">{title}</span>
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {open && <div className="mt-2 space-y-2">{children}</div>}
            </div>
        );
    };

    return (
        <div className="bg-black h-full overflow-y-auto">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800 sticky top-0 bg-black z-10">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal size={18} />
                        <h2 className="font-semibold">Filters</h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setFilters({ categories: [], inStock: null, rating: null, tags: [] });
                                setPriceRange([0, 500]);
                            }}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                            Clear All
                        </button>
                        {onClose && (
                            <button onClick={onClose} className="lg:hidden">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Categories */}
                <FilterSection title="Categories">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {categories.map((category) => (
                            <label key={category} className="flex items-center gap-2 text-sm cursor-pointer hover:text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(category)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFilters({ ...filters, categories: [...filters.categories, category] });
                                        } else {
                                            setFilters({ ...filters, categories: filters.categories.filter(c => c !== category) });
                                        }
                                    }}
                                    className="rounded border-gray-600 bg-transparent"
                                />
                                <span className="truncate">{category}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="Price Range">
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500">Min</label>
                                <input
                                    type="number"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                    className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm"
                                    placeholder="Min"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500">Max</label>
                                <input
                                    type="number"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm"
                                    placeholder="Max"
                                />
                            </div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="500"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            style={{ accentColor: COFFEE }}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>$0</span>
                            <span>$500+</span>
                        </div>
                    </div>
                </FilterSection>

                {/* Availability */}
                <FilterSection title="Availability">
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-gray-300">
                        <input
                            type="checkbox"
                            checked={filters.inStock === true}
                            onChange={(e) => setFilters({ ...filters, inStock: e.target.checked ? true : null })}
                            className="rounded border-gray-600 bg-transparent"
                        />
                        <span>In Stock Only</span>
                    </label>
                </FilterSection>

                {/* Rating */}
                <FilterSection title="Customer Rating">
                    {[4, 3, 2].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 text-sm cursor-pointer hover:text-gray-300">
                            <input
                                type="radio"
                                name="rating"
                                checked={filters.rating === rating}
                                onChange={() => setFilters({ ...filters, rating })}
                                className="rounded-full border-gray-600 bg-transparent"
                            />
                            <div className="flex items-center gap-1">
                                <StarRating rating={rating} size="small" />
                                <span>& Up</span>
                            </div>
                        </label>
                    ))}
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-gray-300">
                        <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === null}
                            onChange={() => setFilters({ ...filters, rating: null })}
                            className="rounded-full border-gray-600 bg-transparent"
                        />
                        <span>All Ratings</span>
                    </label>
                </FilterSection>

                {/* Tags */}
                <FilterSection title="Tags">
                    <div className="flex flex-wrap gap-2">
                        {["trending", "bestseller", "new", "luxury", "popular", "tech", "active", "fun", "culture"].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => {
                                    if (filters.tags.includes(tag)) {
                                        setFilters({ ...filters, tags: filters.tags.filter(t => t !== tag) });
                                    } else {
                                        setFilters({ ...filters, tags: [...filters.tags, tag] });
                                    }
                                }}
                                className={`px-2 py-1 rounded-full text-xs transition-all ${filters.tags.includes(tag)
                                    ? "bg-white text-black"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            </div>
        </div>
    );
};

export default function AllProducts() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        categories: [],
        inStock: null,
        rating: null,
        tags: []
    });
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [sortBy, setSortBy] = useState("featured");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const sortDropdownRef = useRef(null);

    // Handle scroll for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close sort dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get unique categories
    const categories = [...new Set(allProducts.map(p => p.category))];

    // Filter and sort products
    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const matchesStock = filters.inStock === null || product.inStock === filters.inStock;
        const matchesRating = filters.rating === null || product.rating >= filters.rating;
        const matchesTags = filters.tags.length === 0 ||
            (product.tags && product.tags.some(tag => filters.tags.includes(tag)));

        return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesRating && matchesTags;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return a.price - b.price;
            case "price-high":
                return b.price - a.price;
            case "rating":
                return b.rating - a.rating;
            case "newest":
                return b.id - a.id;
            default:
                return 0;
        }
    });

    const sortOptions = [
        { value: "featured", label: "Featured" },
        { value: "price-low", label: "Price: Low to High" },
        { value: "price-high", label: "Price: High to Low" },
        { value: "rating", label: "Best Rating" },
        { value: "newest", label: "Newest First" }
    ];

    const activeFiltersCount = filters.categories.length + filters.tags.length + (filters.inStock ? 1 : 0) + (filters.rating ? 1 : 0);

    return (
        <>
            <Navbar />

            <div className="bg-black text-white min-h-screen">
                {/* Hero Banner - Responsive */}
                <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
                        alt="Shop Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            <div className="max-w-xl md:max-w-2xl">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 animate-fade-in">
                                    Discover Amazing <br className="hidden sm:inline" />Products
                                </h1>
                                <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-6">
                                    Shop the latest trends with exclusive discounts and free shipping
                                </p>
                                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                                    <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full">
                                        <Truck size={14} className="sm:size-4 md:size-5" />
                                        <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">Free Shipping</span>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full">
                                        <Zap size={14} className="sm:size-4 md:size-5" />
                                        <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">Fast Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full">
                                        <Award size={14} className="sm:size-4 md:size-5" />
                                        <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">Premium Quality</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
                    {/* Sticky Search and Filter Bar */}
                    <div className={`sticky top-0 z-20 transition-all duration-300 ${isScrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-black'
                        } -mx-4 sm:mx-0 px-4 sm:px-0 py-3 sm:py-4 mb-4 sm:mb-6`}>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            {/* Search Input */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 transition-colors text-sm sm:text-base"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        <X size={16} className="text-gray-400 hover:text-white" />
                                    </button>
                                )}
                            </div>

                            {/* Filter and View Controls */}
                            <div className="flex gap-2 sm:gap-3">
                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="lg:hidden px-3 sm:px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg flex items-center gap-2 hover:border-gray-500 transition-colors relative"
                                >
                                    <Filter size={16} className="sm:size-18" />
                                    <span className="text-sm">Filters</span>
                                    {activeFiltersCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-coffee text-white text-xs w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: COFFEE }}>
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>

                                {/* Sort Dropdown */}
                                <div className="relative" ref={sortDropdownRef}>
                                    <button
                                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                                        className="px-3 sm:px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg flex items-center gap-2 hover:border-gray-500 transition-colors"
                                    >
                                        <span className="hidden xs:inline text-sm">Sort:</span>
                                        <span className="text-sm truncate max-w-[100px] sm:max-w-none">
                                            {sortOptions.find(opt => opt.value === sortBy)?.label}
                                        </span>
                                        <ChevronDown size={16} className="flex-shrink-0" />
                                    </button>
                                    {showSortDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10">
                                            {sortOptions.map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setShowSortDropdown(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-800 text-sm first:rounded-t-lg last:rounded-b-lg transition-colors"
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* View Mode Toggle - Hidden on mobile */}
                                <div className="hidden sm:flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 transition-colors ${viewMode === "grid" ? "bg-gray-700" : "hover:bg-gray-800"}`}
                                    >
                                        <Grid3x3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-2 transition-colors ${viewMode === "list" ? "bg-gray-700" : "hover:bg-gray-800"}`}
                                    >
                                        <LayoutList size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Chips */}
                        {activeFiltersCount > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {filters.categories.map(cat => (
                                    <span key={cat} className="bg-gray-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                        {cat}
                                        <X size={12} className="cursor-pointer hover:text-gray-300" onClick={() => setFilters({ ...filters, categories: filters.categories.filter(c => c !== cat) })} />
                                    </span>
                                ))}
                                {filters.tags.map(tag => (
                                    <span key={tag} className="bg-gray-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                        #{tag}
                                        <X size={12} className="cursor-pointer hover:text-gray-300" onClick={() => setFilters({ ...filters, tags: filters.tags.filter(t => t !== tag) })} />
                                    </span>
                                ))}
                                {filters.inStock && (
                                    <span className="bg-gray-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                        In Stock Only
                                        <X size={12} className="cursor-pointer hover:text-gray-300" onClick={() => setFilters({ ...filters, inStock: null })} />
                                    </span>
                                )}
                                {filters.rating && (
                                    <span className="bg-gray-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                        {filters.rating}+ Stars
                                        <X size={12} className="cursor-pointer hover:text-gray-300" onClick={() => setFilters({ ...filters, rating: null })} />
                                    </span>
                                )}
                                {(priceRange[0] > 0 || priceRange[1] < 500) && (
                                    <span className="bg-gray-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                        ${priceRange[0]} - ${priceRange[1]}
                                        <X size={12} className="cursor-pointer hover:text-gray-300" onClick={() => setPriceRange([0, 500])} />
                                    </span>
                                )}
                                <button
                                    onClick={() => {
                                        setFilters({ categories: [], inStock: null, rating: null, tags: [] });
                                        setPriceRange([0, 500]);
                                    }}
                                    className="text-xs text-gray-400 hover:text-white px-2 py-1"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Desktop Layout with Sidebar */}
                    <div className="flex gap-6 lg:gap-8">
                        {/* Desktop Filters Sidebar - Hidden on mobile */}
                        <div className="hidden lg:block w-64 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                            <FilterSidebar
                                filters={filters}
                                setFilters={setFilters}
                                categories={categories}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                            />
                        </div>

                        {/* Products Grid/List */}
                        <div className="flex-1 min-w-0">
                            {/* Results Info */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                                <p className="text-sm text-gray-400">
                                    Showing <span className="text-white font-semibold">{sortedProducts.length}</span> of{" "}
                                    <span className="text-white font-semibold">{allProducts.length}</span> products
                                </p>
                                {searchTerm && (
                                    <p className="text-sm text-gray-400">
                                        Searching for: "<span className="text-white">{searchTerm}</span>"
                                    </p>
                                )}
                            </div>

                            {/* Products Display */}
                            {sortedProducts.length === 0 ? (
                                <div className="text-center py-12 sm:py-20">
                                    <div className="text-5xl sm:text-6xl mb-4">🔍</div>
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2">No products found</h3>
                                    <p className="text-sm sm:text-base text-gray-400">Try adjusting your search or filters</p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setFilters({ categories: [], inStock: null, rating: null, tags: [] });
                                            setPriceRange([0, 500]);
                                        }}
                                        className="mt-4 px-4 py-2 rounded-lg text-white text-sm sm:text-base transition-all hover:opacity-90"
                                        style={{ backgroundColor: COFFEE }}
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            ) : viewMode === "grid" ? (
                                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                                    {sortedProducts.map(product => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3 sm:space-y-4">
                                    {sortedProducts.map(product => (
                                        <div
                                            key={product.id}
                                            onClick={() => navigate(`/product/${product.id}`)}
                                            className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-3 sm:p-4 cursor-pointer hover:scale-[1.01] transition-all flex gap-3 sm:gap-4"
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-lg"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-400 mt-1">{product.category}</p>
                                                <div className="flex items-baseline flex-wrap gap-2 mt-2">
                                                    <span className="text-base sm:text-lg md:text-xl font-bold">${product.price}</span>
                                                    {product.originalPrice && (
                                                        <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <StarRating rating={product.rating} size="small" />
                                                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alert(`Added ${product.name} to cart!`);
                                                    }}
                                                    className="mt-2 sm:mt-3 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all hover:opacity-90"
                                                    style={{ backgroundColor: COFFEE }}
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Filter Modal */}
                {isFilterOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
                        <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-black shadow-2xl animate-slide-in">
                            <FilterSidebar
                                filters={filters}
                                setFilters={setFilters}
                                categories={categories}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                onClose={() => setIsFilterOpen(false)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Add animation styles */}
            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        @media (max-width: 480px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
        </>
    );
}