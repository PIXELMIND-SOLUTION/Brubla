import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Heart, ChevronLeft, Star, Truck, ShieldCheck,
    RotateCcw, Share2, ShoppingBag, Eye,
    MessageCircle, MapPin, Calendar, CheckCircle
} from "lucide-react";
import Header from "../components/Header";
import SizeGuideModal from "../views/SizeGuide";

// ─── Data ─────────────────────────────────────────────────────────────────────
const allProducts = [
    { id: 1, name: "Oversized Denim Jacket", price: 89.99, originalPrice: 129.99, rating: 4.5, reviewCount: 234, image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800", category: "Women's-Fashion", subcategory: "Jackets", tags: ["trending", "bestseller"], colors: ["blue", "black"], inStock: true, description: "Stylish oversized denim jacket perfect for casual wear. Made from high-quality cotton denim with a relaxed fit. Features include button-front closure, chest pockets, and adjustable cuffs. The perfect layer for any season — pairs beautifully with jeans, cargos, or a flowy dress.", sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"], images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800", "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800", "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800", "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800"], designer: { name: "Elena Martinez", brand: "Urban Chic", avatar: "https://randomuser.me/api/portraits/women/68.jpg", bio: "Award-winning fashion designer with 10+ years of experience in sustainable fashion.", location: "New York, USA", followers: "45.2K", products: 28, rating: 4.9, joined: "2018", verified: true } },
    { id: 2, name: "Minimalist Leather Backpack", price: 79.99, originalPrice: null, rating: 4.8, reviewCount: 567, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800", category: "Women's-Fashion", subcategory: "Bags", tags: ["new"], colors: ["brown", "black"], inStock: true, description: "Elegant leather backpack perfect for daily use. Genuine leather with multiple compartments for laptop, tablet, and daily essentials. Adjustable straps and durable hardware throughout.", sizes: ["One Size"], images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800", "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800", "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"], designer: { name: "Marcus Chen", brand: "LeatherCraft", avatar: "https://randomuser.me/api/portraits/men/45.jpg", bio: "Artisan leather crafter specializing in minimalist designs using sustainable materials.", location: "Portland, Oregon", followers: "28.7K", products: 15, rating: 4.8, joined: "2019", verified: true } },
    { id: 3, name: "Cashmere Wool Sweater", price: 129.99, originalPrice: 199.99, rating: 4.7, reviewCount: 189, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800", category: "Men's-Style", subcategory: "Sweaters", tags: ["bestseller"], colors: ["gray", "navy"], inStock: true, description: "Luxurious cashmere wool sweater for ultimate comfort and warmth. Premium quality material sourced from Mongolia. Features ribbed cuffs and hem for a perfect fit.", sizes: ["S", "M", "L", "XL"], images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800", "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800", "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=800"], designer: { name: "Sarah Johnson", brand: "Luxe Knits", avatar: "https://randomuser.me/api/portraits/women/32.jpg", bio: "Luxury knitwear designer creating timeless pieces from the finest materials.", location: "London, UK", followers: "67.3K", products: 42, rating: 4.9, joined: "2016", verified: true } },
    { id: 4, name: "Classic White Sneakers", price: 69.99, originalPrice: null, rating: 4.6, reviewCount: 892, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800", category: "Sneakers", subcategory: "Casual", tags: ["trending", "bestseller"], colors: ["white", "black"], inStock: true, description: "Classic white sneakers that go with everything. Comfortable and durable design with memory foam insole and breathable mesh lining. Perfect for daily wear.", sizes: ["6", "7", "8", "9", "10", "11"], images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800", "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800"], designer: { name: "Alex Rivera", brand: "Urban Stride", avatar: "https://randomuser.me/api/portraits/men/92.jpg", bio: "Footwear designer focused on comfort and streetwear aesthetics.", location: "Los Angeles, CA", followers: "34.1K", products: 23, rating: 4.7, joined: "2020", verified: false } },
    { id: 5, name: "Sterling Silver Necklace", price: 149.99, originalPrice: 199.99, rating: 4.9, reviewCount: 423, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800", category: "Jewelry", subcategory: "Necklaces", tags: ["luxury"], colors: ["silver"], inStock: true, description: "Elegant sterling silver necklace with beautiful pendant design. Hypoallergenic and tarnish-resistant. Comes in a luxury gift box. Perfect for special occasions.", sizes: ["One Size"], images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800", "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800"], designer: { name: "Isabella Rossi", brand: "Rossi Jewels", avatar: "https://randomuser.me/api/portraits/women/44.jpg", bio: "Master jeweler creating handmade pieces inspired by nature and architecture.", location: "Florence, Italy", followers: "89.5K", products: 56, rating: 4.9, joined: "2015", verified: true } },
    { id: 6, name: "Ceramic Table Lamp", price: 59.99, originalPrice: null, rating: 4.4, reviewCount: 178, image: "https://images.unsplash.com/photo-1507473885765-e6b057fbbf33?w=800", category: "Home-Decor", subcategory: "Lighting", tags: ["popular"], colors: ["white", "beige"], inStock: false, description: "Modern ceramic table lamp for ambient lighting. Perfect for living room or bedroom. Features a soft glow and elegant design that complements any decor.", sizes: ["One Size"], images: ["https://images.unsplash.com/photo-1507473885765-e6b057fbbf33?w=800", "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800", "https://images.unsplash.com/photo-1533093818119-ac1fa47a6d59?w=800"], designer: { name: "Emma Watson", brand: "Ceramic Dreams", avatar: "https://randomuser.me/api/portraits/women/28.jpg", bio: "Pottery artist creating unique ceramic pieces for modern homes.", location: "Copenhagen, Denmark", followers: "23.4K", products: 34, rating: 4.6, joined: "2021", verified: false } },
    { id: 7, name: "Hydrating Face Serum", price: 45.99, originalPrice: 64.99, rating: 4.7, reviewCount: 1123, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800", category: "Beauty", subcategory: "Skincare", tags: ["new"], colors: [], inStock: true, description: "Deeply hydrating face serum with hyaluronic acid. Reduces fine lines and improves skin texture. Suitable for all skin types. Dermatologist tested.", sizes: ["50ml"], images: ["https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800"], designer: { name: "Dr. Jennifer Lee", brand: "PureSkin Labs", avatar: "https://randomuser.me/api/portraits/women/56.jpg", bio: "Dermatologist and skincare formulator with PhD in cosmetic chemistry.", location: "Seoul, South Korea", followers: "156K", products: 18, rating: 4.9, joined: "2017", verified: true } },
    { id: 8, name: "Wireless Noise Cancelling Headphones", price: 199.99, originalPrice: 299.99, rating: 4.8, reviewCount: 2341, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", category: "Electronics", subcategory: "Audio", tags: ["tech", "bestseller"], colors: ["black", "white"], inStock: true, description: "Premium wireless headphones with active noise cancellation. 30-hour battery life and superior sound quality. Comfortable ear cushions for extended wear.", sizes: ["One Size"], images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800"], designer: { name: "Thomas Anderson", brand: "AudioTech", avatar: "https://randomuser.me/api/portraits/men/15.jpg", bio: "Audio engineer and product designer with 15 years of experience.", location: "Berlin, Germany", followers: "78.9K", products: 12, rating: 4.8, joined: "2018", verified: true } },
    { id: 9, name: "Yoga Mat Premium", price: 49.99, originalPrice: null, rating: 4.5, reviewCount: 756, image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800", category: "Sports-and-Fitness", subcategory: "Yoga", tags: ["active"], colors: ["purple", "green"], inStock: true, description: "Eco-friendly premium yoga mat with excellent grip. Perfect for all types of yoga practice. Non-slip surface and extra cushioning for joint protection.", sizes: ["One Size"], images: ["https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800", "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800", "https://images.unsplash.com/photo-1571736777860-dacc4a7ab6c8?w=800"], designer: { name: "Michael Chang", brand: "ZenActive", avatar: "https://randomuser.me/api/portraits/men/62.jpg", bio: "Fitness enthusiast and product designer creating eco-friendly workout gear.", location: "San Francisco, CA", followers: "42.1K", products: 9, rating: 4.7, joined: "2019", verified: false } },
    { id: 10, name: "Wooden Building Blocks Set", price: 34.99, originalPrice: 49.99, rating: 4.9, reviewCount: 445, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800", category: "Kids-and-Toys", subcategory: "Educational", tags: ["fun"], colors: [], inStock: true, description: "Educational wooden building blocks set for creative play. Safe non-toxic materials. Includes 100 pieces in various shapes and colors. Develops motor skills.", sizes: ["100 pieces"], images: ["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"], designer: { name: "Lisa Wong", brand: "Little Genius", avatar: "https://randomuser.me/api/portraits/women/89.jpg", bio: "Child development expert creating educational toys for young minds.", location: "Toronto, Canada", followers: "56.8K", products: 31, rating: 4.9, joined: "2017", verified: true } },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────
const StarRating = ({ rating, size = "small" }) => {
    const starSize = size === "small" ? 14 : 16;
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={starSize}
                    className={`${i < Math.floor(rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                        }`}
                />
            ))}
        </div>
    );
};

// ─── Designer Card (Light Theme) ─────────────────────────────────────────────
const DesignerCard = ({ designer }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            {/* Designer Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={designer.avatar}
                            alt={designer.name}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        {designer.verified && (
                            <CheckCircle
                                size={20}
                                className="absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full"
                            />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-lg">{designer.name}</h3>
                            {designer.verified && (
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                    Verified
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">{designer.brand}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={designer.rating} size="small" />
                            <span className="text-xs text-gray-400">({designer.rating})</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isFollowing
                        ? "bg-gray-100 text-gray-700 border border-gray-200"
                        : "bg-gray-900 text-white hover:bg-black"
                        }`}
                >
                    {isFollowing ? "Following" : "Follow"}
                </button>
            </div>

            {/* Designer Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{designer.followers}</p>
                    <p className="text-xs text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{designer.products}</p>
                    <p className="text-xs text-gray-400">Products</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">Since {designer.joined}</p>
                    <p className="text-xs text-gray-400">Member</p>
                </div>
            </div>

            {/* Designer Bio */}
            <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{designer.bio}</p>
            </div>

            {/* Designer Info */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span>{designer.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>Joined {designer.joined}</span>
                </div>
            </div>

            {/* Contact Button */}
            <button className="w-full py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                <MessageCircle size={16} />
                Contact Designer
            </button>
        </div>
    );
};

// ─── Main Component (Light Theme) ───────────────────────────────────────────
export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState("designer");
    const [isSizeOpen, setIsSizeOpen] = useState(false);

    // Find product by ID
    const product = allProducts.find((p) => p.id === parseInt(id));

    useEffect(() => {
        if (product && product.images && product.images.length > 0) {
            setSelectedImage(product.images[0]);
        }
        if (product && product.colors && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
        }
        if (product && product.sizes && product.sizes.length > 0) {
            setSelectedSize(product.sizes[0]);
        }
        window.scrollTo(0, 0);
    }, [product]);

    if (!product) {
        return (
            <>
                <Header />
                <div className="bg-gray-50 text-gray-900 min-h-screen flex items-center justify-center px-4">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Product Not Found</h1>
                        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-2 rounded-full bg-gray-900 text-white hover:bg-black transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // Get related products (same category, excluding current product)
    const relatedProducts = allProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const handleAddToCart = () => {
        alert(`Added ${quantity} ${product.name} to cart!`);
    };

    const handleBuyNow = () => {
        alert(`Proceeding to checkout with ${quantity} ${product.name}`);
    };

    const handleShare = () => {
        navigator.share?.({
            title: product.name,
            text: product.description,
            url: window.location.href,
        }).catch(() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        });
    };

    const toINR = (usd) => (usd * 83).toLocaleString("en-IN", { maximumFractionDigits: 0 });
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    return (
        <>
            <Header />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
                html { scroll-behavior: smooth; }
                * { box-sizing: border-box; }
                .font-display { font-family: 'Instrument Serif', Georgia, serif; }
                .font-body { font-family: 'DM Sans', system-ui, sans-serif; }
            `}</style>

            <div className="min-h-screen font-body" style={{ background: "#f0eeeb" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Back and Share Buttons */}
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span className="text-sm">Back</span>
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                                <Heart
                                    size={20}
                                    className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
                                />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                                <Share2 size={20} className="text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Product Grid - Three Column Layout */}
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* COL A: LEFT STICKY MAIN IMAGE */}
                        <div className="w-full lg:w-[38%] lg:sticky lg:top-24 flex-shrink-0">
                            <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm" style={{ aspectRatio: "3/4" }}>
                                <img
                                    src={selectedImage || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {!product.inStock && (
                                    <div className="absolute inset-0 bg-white/65 flex items-center justify-center">
                                        <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 border border-gray-400 px-4 py-2 rounded-full">Sold Out</span>
                                    </div>
                                )}
                                {product.tags?.[0] && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full capitalize">{product.tags[0]}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* COL B: RIGHT SCROLLABLE ADDITIONAL IMAGES */}
                        <div className="w-full lg:w-[28%] flex-shrink-0 lg:max-h-[calc(100vh-7rem)] overflow-y-auto flex flex-col gap-3">
                            {product.images.slice(1).map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative rounded-3xl overflow-hidden bg-white shadow-sm flex-shrink-0 cursor-pointer transition-all hover:shadow-md ${selectedImage === img ? "ring-2 ring-gray-400" : ""
                                        }`}
                                    style={{ aspectRatio: "4/5" }}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} — view ${i + 2}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* COL C: PRODUCT INFO PANEL */}
                        <div className="w-full lg:w-[34%] flex-shrink-0 lg:sticky lg:top-24">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
                                {/* Title & Rating */}
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900 leading-tight font-display">{product.name}</h1>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        <StarRating rating={product.rating} />
                                        <span className="text-sm text-gray-500">
                                            {product.reviewCount} reviews
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-sm text-gray-500">{product.category}</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-2xl font-bold text-gray-900">RS. {toINR(product.price)}</span>
                                    {product.originalPrice && (
                                        <>
                                            <span className="text-sm text-gray-400 line-through">RS. {toINR(product.originalPrice)}</span>
                                            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">-{discount}%</span>
                                        </>
                                    )}
                                </div>

                                {/* Colors */}
                                {product.colors && product.colors.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Colour</p>
                                        <div className="flex flex-wrap gap-2">
                                            {product.colors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedColor === color
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-500"
                                                        }`}
                                                >
                                                    {color.charAt(0).toUpperCase() + color.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sizes */}
                                {product.sizes && product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Size</p>
                                            <button
                                                onClick={() => setIsSizeOpen(true)}
                                                className="text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded-full hover:border-gray-400 transition-colors"
                                            >
                                                Size Guide
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {product.sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${selectedSize === size
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-500"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Stock Status */}
                                <div className="flex items-center gap-2">
                                    {product.inStock ? (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-xs text-green-600 font-medium">In Stock</span>
                                            <span className="text-xs text-gray-400">• {Math.floor(Math.random() * 50) + 10} units available</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-red-400" />
                                            <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                                        </>
                                    )}
                                </div>

                                {/* Quantity */}
                                {product.inStock && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quantity</p>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-400 transition-colors flex items-center justify-center"
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-semibold min-w-[40px] text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-400 transition-colors flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 py-3 rounded-full border border-gray-300 text-sm font-semibold text-gray-800 hover:border-gray-800 transition-all disabled:opacity-40 tracking-wide"
                                        disabled={!product.inStock}
                                    >
                                        ADD TO BAG
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        className="flex-1 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-all disabled:opacity-40 tracking-wide"
                                        disabled={!product.inStock}
                                    >
                                        BUY NOW
                                    </button>
                                </div>

                                {/* Delivery Info */}
                                <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <Truck size={18} className="text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Free Delivery</p>
                                            <p className="text-xs text-gray-400">On orders above RS. 999</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RotateCcw size={18} className="text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">30 Days Return</p>
                                            <p className="text-xs text-gray-400">Easy returns and exchanges</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={18} className="text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">Secure Payment</p>
                                            <p className="text-xs text-gray-400">100% safe checkout</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABS SECTION */}
                    <div className="mt-12">
                        <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
                            {["designer", "details", "reviews"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 px-1 text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab
                                        ? "text-gray-900 border-b-2 border-gray-900"
                                        : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {tab === "designer" && "Designer Info"}
                                    {tab === "details" && "Product Details"}
                                    {tab === "reviews" && `Reviews (${product.reviewCount})`}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[300px]">
                            {activeTab === "details" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-3 text-lg text-gray-900">Description</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {showFullDescription
                                                ? product.description
                                                : `${product.description.substring(0, 300)}...`}
                                        </p>
                                        {product.description.length > 300 && (
                                            <button
                                                onClick={() => setShowFullDescription(!showFullDescription)}
                                                className="text-sm text-gray-500 hover:text-gray-900 mt-2"
                                            >
                                                {showFullDescription ? "Show Less" : "Read More"}
                                            </button>
                                        )}
                                    </div>

                                    {product.tags && product.tags.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3 text-gray-900">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {product.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="font-semibold mb-3 text-gray-900">Product Specifications</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-3 rounded-xl">
                                                <p className="text-xs text-gray-500">Category</p>
                                                <p className="text-sm font-medium text-gray-800">{product.category}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-xl">
                                                <p className="text-xs text-gray-500">Subcategory</p>
                                                <p className="text-sm font-medium text-gray-800">{product.subcategory}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-xl">
                                                <p className="text-xs text-gray-500">Material</p>
                                                <p className="text-sm font-medium text-gray-800">Premium Quality</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-xl">
                                                <p className="text-xs text-gray-500">Care Instructions</p>
                                                <p className="text-sm font-medium text-gray-800">Machine Washable</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "designer" && product.designer && (
                                <DesignerCard designer={product.designer} />
                            )}

                            {activeTab === "reviews" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-bold text-gray-900">{product.rating}</span>
                                                <StarRating rating={product.rating} />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Based on {product.reviewCount} reviews
                                            </p>
                                        </div>
                                        <button className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:border-gray-500 transition-colors">
                                            Write a Review
                                        </button>
                                    </div>

                                    {/* Sample Reviews */}
                                    {[1, 2, 3].map((review) => (
                                        <div key={review} className="border-t border-gray-100 pt-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <img
                                                    src={`https://randomuser.me/api/portraits/${review % 2 === 0 ? "women" : "men"}/${review + 20}.jpg`}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                    alt="Reviewer"
                                                />
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">User {review}</p>
                                                    <StarRating rating={4 + (review % 1)} size="small" />
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Great product! Exactly as described. The quality is amazing and delivery was fast.
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RELATED PRODUCTS */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 font-display">You May Also Like</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {relatedProducts.map((relatedProduct) => (
                                    <div
                                        key={relatedProduct.id}
                                        onClick={() => navigate(`/product/${relatedProduct.id}`)}
                                        className="bg-white rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="overflow-hidden" style={{ aspectRatio: "3/4" }}>
                                            <img
                                                src={relatedProduct.image}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{relatedProduct.name}</p>
                                            <div className="flex items-baseline gap-1.5 mt-1">
                                                <p className="text-sm font-bold text-gray-900">RS. {toINR(relatedProduct.price)}</p>
                                                {relatedProduct.originalPrice && <p className="text-xs text-gray-400 line-through">RS. {toINR(relatedProduct.originalPrice)}</p>}
                                            </div>
                                            <div className="mt-1"><StarRating rating={relatedProduct.rating} size="small" /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <SizeGuideModal isOpen={isSizeOpen} onClose={() => setIsSizeOpen(false)} />
        </>
    );
}