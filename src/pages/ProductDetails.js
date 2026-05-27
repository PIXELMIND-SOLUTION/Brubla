import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Heart, ChevronLeft, Star, Truck, ShieldCheck,
    RotateCcw, Share2, ShoppingBag,
    MapPin, Calendar, CheckCircle, Minus, Plus, ChevronRight
} from "lucide-react";
import Header from "../components/Header";
import SizeGuideModal from "../views/SizeGuide";

const COFFEE = "#000";
const API_BASE = "http://31.97.228.17:4077";

// ─── Helper: normalise image URLs ─────────────────────────────────────────────
const normaliseUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    return url.replace(/https?:\/\/localhost:4077/g, API_BASE);
};

// ─── Collect all unique images from product ───────────────────────────────────
// Variant shape from API:
//   { color, price, discountPrice, sizes:[{size,stock}], images:[], mainImage? }
const getProductImages = (product) => {
    const seen = new Set();
    const images = [];

    const push = (raw) => {
        const url = normaliseUrl(raw);
        if (url && !seen.has(url)) { seen.add(url); images.push(url); }
    };

    // top-level mainImages[]
    if (Array.isArray(product.mainImages)) product.mainImages.forEach(push);

    if (Array.isArray(product.variants)) {
        product.variants.forEach((v) => {
            if (v.mainImage) push(v.mainImage);
            if (Array.isArray(v.images)) v.images.forEach(push);
        });
    }

    return images;
};

// ─── Unique colours from variants ────────────────────────────────────────────
const getUniqueColors = (variants = []) =>
    [...new Set(variants.map((v) => v.color).filter(Boolean))];

// ─── Unique sizes across ALL variants ────────────────────────────────────────
// Each variant has: sizes: [{size, stock, _id}]
const getUniqueSizes = (variants = []) => {
    const set = new Set();
    variants.forEach((v) => {
        if (Array.isArray(v.sizes)) v.sizes.forEach((s) => set.add(s.size));
    });
    return Array.from(set);
};

// ─── Stock for (color, size) pair ────────────────────────────────────────────
const getStockForColorSize = (variants = [], color, size) => {
    const variant = variants.find((v) => v.color === color);
    if (!variant || !Array.isArray(variant.sizes)) return 0;
    const sizeObj = variant.sizes.find((s) => s.size === size);
    return sizeObj ? sizeObj.stock : 0;
};

// ─── Price info for a given color ────────────────────────────────────────────
// (price is per variant/colour in this API, not per size)
const getPriceForColor = (variants = [], color) => {
    const variant = variants.find((v) => v.color === color);
    if (!variant) return null;
    const actual   = variant.price         || 0;
    const discount = variant.discountPrice || actual;
    const pct      = actual > discount
        ? Math.round(((actual - discount) / actual) * 100)
        : 0;
    return { price: discount, actualPrice: actual, discount: pct };
};

const toINR = (usd) => {
    if (!usd) return "0";
    return (usd * 83).toLocaleString("en-IN", { maximumFractionDigits: 0 });
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
const StarRating = ({ rating, size = "small" }) => {
    const px = size === "small" ? 14 : 16;
    const n  = Number(rating) || 0;
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={px}
                    className={
                        i < Math.floor(n)
                            ? "text-amber-400 fill-amber-400"
                            : i < n
                            ? "text-amber-400 fill-amber-400 opacity-50"
                            : "text-gray-200 fill-gray-200"
                    }
                />
            ))}
        </div>
    );
};

// ─── Image Gallery ────────────────────────────────────────────────────────────
const ImageGallery = ({
    images, productName, currentStock, tags, discount,
    selectedImage, setSelectedImage,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullscreen, setFullscreen]     = useState(false);

    useEffect(() => {
        const idx = images.findIndex((img) => img === selectedImage);
        if (idx !== -1) setCurrentIndex(idx);
    }, [selectedImage, images]);

    const go = (next) => {
        setCurrentIndex(next);
        setSelectedImage(images[next]);
    };
    const prev = () => go((currentIndex - 1 + images.length) % images.length);
    const next = () => go((currentIndex + 1) % images.length);

    const mainSrc =
        images[currentIndex] ||
        "https://placehold.co/800x800/e5e7eb/64748b?text=No+Image";

    return (
        <>
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm">
                <div
                    className="relative cursor-pointer"
                    style={{ aspectRatio: "1/1" }}
                    onClick={() => setFullscreen(true)}
                >
                    <img
                        src={mainSrc}
                        alt={`${productName} – view ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://placehold.co/800x800/e5e7eb/64748b?text=No+Image";
                        }}
                    />

                    {currentStock === 0 && (
                        <div className="absolute inset-0 bg-white/65 flex items-center justify-center">
                            <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 border border-gray-400 px-4 py-2 rounded-full">
                                Sold Out
                            </span>
                        </div>
                    )}
                    {tags && tags.length > 0 && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full capitalize">
                                {tags[0]}
                            </span>
                        </div>
                    )}
                    {discount > 0 && (
                        <div className="absolute top-3 right-3">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                -{discount}%
                            </span>
                        </div>
                    )}
                </div>

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => go(idx)}
                            className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                                currentIndex === idx ? "ring-2 ring-gray-900" : "opacity-70"
                            }`}
                            style={{ width: 70, height: 70 }}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = "https://placehold.co/70x70/e5e7eb/64748b?text=?";
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen */}
            {fullscreen && (
                <div
                    className="fixed inset-0 bg-black z-50 flex flex-col"
                    onClick={() => setFullscreen(false)}
                >
                    <div className="relative flex-1 flex items-center justify-center">
                        <button
                            onClick={() => setFullscreen(false)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
                        >
                            ✕
                        </button>
                        <img
                            src={images[currentIndex]}
                            alt={productName}
                            className="max-w-full max-h-full object-contain"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prev(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); next(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

// ─── Designer Card ────────────────────────────────────────────────────────────
const DesignerCard = ({ product }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    // categoryId is a raw string ID in the single-product endpoint
    const categoryName =
        typeof product.categoryId === "object"
            ? product.categoryId?.name
            : null;

    const designer =
        product.createdBy === "admin"
            ? {
                  name:      "Brubla Premium",
                  brand:     "Brubla Official",
                  avatar:    "https://api.dicebear.com/7.x/notionists/svg?seed=brubla",
                  verified:  true,
                  rating:    4.9,
                  followers: "25K",
                  products:  120,
                  joined:    "2024",
                  bio:       "Brubla Premium offers high-quality fashion essentials with premium craftsmanship and modern style.",
                  location:  "Worldwide Shipping",
              }
            : {
                  name:      product.creatorDetails?.name      || product.createdBy    || "Brand Studio",
                  brand:     product.creatorDetails?.brandName || categoryName          || "Premium Brand",
                  avatar:    product.creatorDetails?.profileImage || "https://api.dicebear.com/7.x/adventurer/svg?seed=designer",
                  verified:  true,
                  rating:    product.creatorDetails?.rating    || 4.8,
                  followers: product.creatorDetails?.followers || "12.5K",
                  products:  product.creatorDetails?.products  || 20,
                  joined:    product.creatorDetails?.joined    || new Date(product.createdAt).getFullYear().toString(),
                  bio:       product.creatorDetails?.bio       || product.description || "Premium quality products crafted with care.",
                  location:  product.creatorDetails?.location  || "Global Shipping",
              };

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={designer.avatar}
                            alt={designer.name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        {designer.verified && (
                            <CheckCircle
                                size={18}
                                className="absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full"
                            />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900">{designer.name}</h3>
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                Verified
                            </span>
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
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        isFollowing
                            ? "bg-gray-100 text-gray-700 border border-gray-200"
                            : "bg-gray-900 text-white hover:bg-black"
                    }`}
                >
                    {isFollowing ? "Following" : "Follow"}
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5 pb-5 border-b border-gray-100">
                <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{designer.followers}</p>
                    <p className="text-xs text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{designer.products}</p>
                    <p className="text-xs text-gray-400">Products</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">Since {designer.joined}</p>
                    <p className="text-xs text-gray-400">Member</p>
                </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">{designer.bio}</p>

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

            <button className="w-full py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:border-gray-400 transition-all flex items-center justify-center gap-2">
                Message Designer
            </button>
        </div>
    );
};

// ─── Loading Spinner ──────────────────────────────────────────────────────────
function LoadingState() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="w-10 h-10 border-2 border-gray-200 rounded-full animate-spin"
                        style={{ borderTopColor: COFFEE }}
                    />
                    <p className="text-gray-500 text-sm">Loading product details…</p>
                </div>
            </div>
        </>
    );
}

// ─── Error / Not Found ────────────────────────────────────────────────────────
function ErrorState({ message, onBack, onRetry }) {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <ShoppingBag size={32} className="text-gray-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
                    <p className="text-gray-500 mb-6 text-sm">
                        {message || "The product you're looking for doesn't exist or has been removed."}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onBack}
                            className="px-5 py-2 rounded-full border border-gray-300 text-sm text-gray-700 hover:border-gray-500 transition-colors"
                        >
                            Go Back
                        </button>
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="px-5 py-2 rounded-full text-white text-sm transition-opacity hover:opacity-80"
                                style={{ backgroundColor: COFFEE }}
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Product Info Panel ───────────────────────────────────────────────────────
function ProductInfoPanel({
    product,
    colors,
    sizes,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    currentStock,
    displayPrice,
    displayActualPrice,
    discount,
    quantity,
    setQuantity,
    handleAddToCart,
    handleBuyNow,
    setIsSizeOpen,
    isMobile = false,
}) {
    return (
        <div
            className={`bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 ${
                !isMobile ? "sticky top-24" : ""
            }`}
        >
            {/* Title & Rating */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight font-display">
                    {product.name}
                </h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <StarRating rating={product.averageRating || 0} />
                    <span className="text-xs sm:text-sm text-gray-500">
                        {product.reviews?.length || 0} reviews
                    </span>
                    {product.subcategoryName && (
                        <>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs sm:text-sm text-gray-500">
                                {product.subcategoryName}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ₹{toINR(displayPrice)}
                </span>
                {displayActualPrice > displayPrice && (
                    <>
                        <span className="text-sm text-gray-400 line-through">
                            ₹{toINR(displayActualPrice)}
                        </span>
                        {discount > 0 && (
                            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                                -{discount}%
                            </span>
                        )}
                    </>
                )}
            </div>

            {/* Colours */}
            {colors.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Colour
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                    selectedColor === color
                                        ? "bg-gray-900 text-white border-gray-900"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-500"
                                }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Select Size
                        </p>
                        <button
                            onClick={() => setIsSizeOpen(true)}
                            className="text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded-full hover:border-gray-400 transition-colors"
                        >
                            Size Guide
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            // show stock hint per size for selected colour
                            const sizeStock = getStockForColorSize(
                                product.variants,
                                selectedColor,
                                size
                            );
                            return (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    disabled={sizeStock === 0}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 ${
                                        selectedSize === size
                                            ? "bg-gray-900 text-white border-gray-900"
                                            : sizeStock === 0
                                            ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-500"
                                    }`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Stock status */}
            <div className="flex items-center gap-2">
                {currentStock > 0 ? (
                    <>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs text-green-600 font-medium">In Stock</span>
                        <span className="text-xs text-gray-400">· {currentStock} units available</span>
                    </>
                ) : (
                    <>
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                    </>
                )}
            </div>

            {/* Quantity */}
            {currentStock > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Quantity
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 hover:border-gray-400 transition-colors flex items-center justify-center"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="text-base sm:text-lg font-semibold min-w-[40px] text-center">
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 hover:border-gray-400 transition-colors flex items-center justify-center"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={currentStock === 0}
                    className="flex-1 py-2.5 sm:py-3 rounded-full border border-gray-300 text-xs sm:text-sm font-semibold text-gray-800 hover:border-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
                >
                    ADD TO BAG
                </button>
                <button
                    onClick={handleBuyNow}
                    disabled={currentStock === 0}
                    className="flex-1 py-2.5 sm:py-3 rounded-full text-white text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
                    style={{ backgroundColor: COFFEE }}
                >
                    BUY NOW
                </button>
            </div>

            {/* Delivery info */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-xl space-y-3 border border-gray-100">
                {[
                    { Icon: Truck,       title: "Free Delivery",    sub: "On orders above ₹999" },
                    { Icon: RotateCcw,   title: "30 Days Return",   sub: "Easy returns and exchanges" },
                    { Icon: ShieldCheck, title: "Secure Payment",   sub: "100% safe checkout" },
                ].map(({ Icon, title, sub }) => (
                    <div key={title} className="flex items-center gap-3">
                        <Icon size={16} className="text-gray-500 flex-shrink-0" />
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-800">{title}</p>
                            <p className="text-[10px] sm:text-xs text-gray-400">{sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetails() {
    const { id }   = useParams();
    const navigate = useNavigate();

    // ── Data state ──
    const [product,  setProduct]  = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);
    const [retryKey, setRetryKey] = useState(0);

    // ── UI state ──
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize,  setSelectedSize]  = useState(null);
    const [quantity,      setQuantity]      = useState(1);
    const [showFullDesc,  setShowFullDesc]  = useState(false);
    const [isWishlisted,  setIsWishlisted]  = useState(false);
    const [activeTab,     setActiveTab]     = useState("details");
    const [isSizeOpen,    setIsSizeOpen]    = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // ── Fetch product ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!id) { setError("No product ID provided"); setLoading(false); return; }

        let cancelled = false;

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const controller = new AbortController();
                const tid = setTimeout(() => controller.abort(), 15_000);

                const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
                    signal: controller.signal,
                });
                clearTimeout(tid);

                if (!res.ok) {
                    throw new Error(`Server error ${res.status}: ${res.statusText}`);
                }

                const data = await res.json();
                if (cancelled) return;

                if (!data || typeof data !== "object") {
                    throw new Error("Invalid response format.");
                }
                if (data.success === false) {
                    throw new Error(data.message || "API returned success: false.");
                }
                if (!data.product) {
                    throw new Error("Product not found.");
                }

                const p      = data.product;
                const colors = getUniqueColors(p.variants);
                const sizes  = getUniqueSizes(p.variants);
                const images = getProductImages(p);

                setProduct(p);
                if (colors.length > 0) setSelectedColor(colors[0]);
                if (sizes.length  > 0) setSelectedSize(sizes[0]);
                if (images.length > 0) setSelectedImage(images[0]);
            } catch (err) {
                if (cancelled) return;
                setError(
                    err.name === "AbortError"
                        ? "Request timed out. Please check your connection."
                        : err.message || "Failed to load product."
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchProduct();
        return () => { cancelled = true; };
    }, [id, retryKey]);

    // ── Fetch related products (uses list endpoint filtered by category) ──────
    useEffect(() => {
        if (!product) return;
        let cancelled = false;

        const fetchRelated = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/admin/products`);
                if (!res.ok) return;
                const data = await res.json();
                if (cancelled) return;

                const productId = product._id || product.id;

                if (data.success && Array.isArray(data.products)) {
                    const related = data.products
                        .filter((p) => p.isActive && (p._id || p.id) !== productId)
                        .slice(0, 4);
                    setRelatedProducts(related);
                }
            } catch {
                // related products are non-critical — fail silently
            }
        };

        fetchRelated();
        return () => { cancelled = true; };
    }, [product]);

    // ── Reset quantity when size/colour changes ───────────────────────────────
    useEffect(() => { setQuantity(1); }, [selectedColor, selectedSize]);

    // ── Derived values ────────────────────────────────────────────────────────
    const productImages = product ? getProductImages(product) : [];
    const colors        = product ? getUniqueColors(product.variants) : [];
    const sizes         = product ? getUniqueSizes(product.variants)  : [];

    // Price from selected colour's variant
    const variantPrice = product && selectedColor
        ? getPriceForColor(product.variants, selectedColor)
        : null;

    const displayPrice       = variantPrice?.price       ?? product?.displayPrice       ?? 0;
    const displayActualPrice = variantPrice?.actualPrice ?? product?.displayActualPrice ?? 0;
    const discount           = variantPrice?.discount    ?? product?.maxDiscount        ?? 0;

    // Stock for selected colour + size
    const currentStock =
        product && selectedColor && selectedSize
            ? getStockForColorSize(product.variants, selectedColor, selectedSize)
            : 0;

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: product?.name, url: window.location.href }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const handleAddToCart = () => {
        alert(`Added ${quantity}× ${product?.name} (${selectedColor}, ${selectedSize}) to cart!`);
    };

    const handleBuyNow = () => {
        alert(`Proceeding to checkout with ${quantity}× ${product?.name}`);
    };

    // ── Guards ────────────────────────────────────────────────────────────────
    if (loading) return <LoadingState />;

    if (error || !product) {
        return (
            <ErrorState
                message={error}
                onBack={() => navigate(-1)}
                onRetry={error ? () => setRetryKey((k) => k + 1) : null}
            />
        );
    }

    // ── Shared panel props ────────────────────────────────────────────────────
    const panelProps = {
        product, colors, sizes,
        selectedColor, setSelectedColor,
        selectedSize,  setSelectedSize,
        currentStock,
        displayPrice, displayActualPrice, discount,
        quantity, setQuantity,
        handleAddToCart, handleBuyNow,
        setIsSizeOpen,
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            <Header />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
                html { scroll-behavior: smooth; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                .font-display { font-family: 'Instrument Serif', Georgia, serif; }
                .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>

            <div className="min-h-screen font-body bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

                    {/* ── Top nav row ── */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span className="text-sm hidden sm:inline">Back</span>
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsWishlisted((w) => !w)}
                                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                                aria-label="Wishlist"
                            >
                                <Heart
                                    size={20}
                                    className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
                                />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                                aria-label="Share"
                            >
                                <Share2 size={20} className="text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* ── Mobile: gallery → panel ── */}
                    <div className="block lg:hidden mb-6">
                        <ImageGallery
                            images={productImages}
                            productName={product.name}
                            currentStock={currentStock}
                            tags={product.tags}
                            discount={discount}
                            selectedImage={selectedImage}
                            setSelectedImage={setSelectedImage}
                        />
                    </div>
                    <div className="block lg:hidden">
                        <ProductInfoPanel {...panelProps} isMobile />
                    </div>

                    {/* ── Desktop: 3-column layout ── */}
                    <div className="hidden lg:flex flex-row gap-6 items-start">
                        {/* Main image */}
                        <div className="w-[38%] sticky top-24">
                            <div
                                className="relative rounded-3xl overflow-hidden bg-white shadow-sm"
                                style={{ aspectRatio: "3/4" }}
                            >
                                <img
                                    src={
                                        selectedImage ||
                                        productImages[0] ||
                                        "https://placehold.co/800x1067/e5e7eb/64748b?text=No+Image"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://placehold.co/800x1067/e5e7eb/64748b?text=No+Image";
                                    }}
                                />
                                {currentStock === 0 && (
                                    <div className="absolute inset-0 bg-white/65 flex items-center justify-center">
                                        <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 border border-gray-400 px-4 py-2 rounded-full">
                                            Sold Out
                                        </span>
                                    </div>
                                )}
                                {product.tags && product.tags.length > 0 && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full capitalize">
                                            {product.tags[0]}
                                        </span>
                                    </div>
                                )}
                                {discount > 0 && (
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            -{discount}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail column */}
                        <div className="w-[28%] max-h-[calc(100vh-7rem)] overflow-y-auto flex flex-col gap-3 scrollbar-hide">
                            {productImages.slice(0, 8).map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative rounded-3xl overflow-hidden bg-white shadow-sm flex-shrink-0 cursor-pointer transition-all hover:shadow-md ${
                                        selectedImage === img ? "ring-2 ring-gray-900" : ""
                                    }`}
                                    style={{ aspectRatio: "4/5" }}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} – view ${i + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://placehold.co/400x500/e5e7eb/64748b?text=?";
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Info panel */}
                        <div className="w-[34%]">
                            <ProductInfoPanel {...panelProps} />
                        </div>
                    </div>

                    {/* ── Tabs ── */}
                    <div className="mt-12">
                        <div className="flex gap-4 sm:gap-6 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
                            {["details", "designer", "reviews"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 px-1 text-sm font-medium transition-all whitespace-nowrap ${
                                        activeTab === tab
                                            ? "text-gray-900 border-b-2 border-gray-900"
                                            : "text-gray-400 hover:text-gray-600"
                                    }`}
                                >
                                    {tab === "details"  && "Product Details"}
                                    {tab === "designer" && "Designer Info"}
                                    {tab === "reviews"  && `Reviews (${product.reviews?.length || 0})`}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[300px]">
                            {/* ── Details tab ── */}
                            {activeTab === "details" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-3 text-lg text-gray-900">Description</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                            {showFullDesc
                                                ? product.description
                                                : `${product.description?.substring(0, 300) ?? "No description available"}${
                                                      (product.description?.length ?? 0) > 300 ? "…" : ""
                                                  }`}
                                        </p>
                                        {(product.description?.length ?? 0) > 300 && (
                                            <button
                                                onClick={() => setShowFullDesc(!showFullDesc)}
                                                className="text-sm text-gray-500 hover:text-gray-900 mt-2 underline"
                                            >
                                                {showFullDesc ? "Show Less" : "Read More"}
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
                                                        className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 capitalize"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="font-semibold mb-3 text-gray-900">Specifications</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            {[
                                                {
                                                    label: "Category",
                                                    value:
                                                        typeof product.categoryId === "object"
                                                            ? product.categoryId?.name
                                                            : "Fashion",
                                                },
                                                { label: "Subcategory",        value: product.subcategoryName || "Apparel" },
                                                { label: "Total Stock",         value: `${product.totalStock ?? 0} units` },
                                                { label: "Available Colours",   value: (product.availableColors || []).join(", ") || "Standard" },
                                                { label: "Available Sizes",     value: (product.availableSizes  || []).join(", ") || "One Size" },
                                                {
                                                    label: "Delivery Locations",
                                                    value: product.deliveryAddresses?.length
                                                        ? `${product.deliveryAddresses.length} cities`
                                                        : "Multiple cities",
                                                },
                                            ].map(({ label, value }) => (
                                                <div key={label} className="bg-white p-3 rounded-xl border border-gray-100">
                                                    <p className="text-xs text-gray-500">{label}</p>
                                                    <p className="text-sm font-medium text-gray-800">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Delivery addresses */}
                                    {product.deliveryAddresses && product.deliveryAddresses.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3 text-gray-900">Ships To</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {product.deliveryAddresses.map((addr) => (
                                                    <span
                                                        key={addr}
                                                        className="flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-600"
                                                    >
                                                        <MapPin size={10} className="text-gray-400" />
                                                        {addr}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Designer tab ── */}
                            {activeTab === "designer" && <DesignerCard product={product} />}

                            {/* ── Reviews tab ── */}
                            {activeTab === "reviews" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-bold text-gray-900">
                                                    {(product.averageRating || 0).toFixed(1)}
                                                </span>
                                                <StarRating rating={product.averageRating || 0} />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Based on {product.reviews?.length || 0} reviews
                                            </p>
                                        </div>
                                        <button className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:border-gray-500 transition-colors">
                                            Write a Review
                                        </button>
                                    </div>

                                    {product.reviews && product.reviews.length > 0 ? (
                                        product.reviews.map((review, idx) => (
                                            <div key={idx} className="border-t border-gray-100 pt-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <img
                                                        src={`https://randomuser.me/api/portraits/${idx % 2 === 0 ? "women" : "men"}/${idx + 20}.jpg`}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        alt="Reviewer"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-900">
                                                            User {idx + 1}
                                                        </p>
                                                        <StarRating rating={review.rating || 4} size="small" />
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {review.comment || "Great product! Exactly as described."}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {review.createdAt
                                                        ? new Date(review.createdAt).toLocaleDateString()
                                                        : new Date(Date.now() - idx * 86400000).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-gray-400 text-sm">
                                                No reviews yet. Be the first to review this product!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Related Products ── */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 font-display">
                                You May Also Like
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                {relatedProducts.map((rp) => {
                                    const rpImg = getProductImages(rp)[0] ||
                                        "https://placehold.co/600x600/e5e7eb/64748b?text=No+Image";
                                    return (
                                        <div
                                            key={rp._id || rp.id}
                                            onClick={() => navigate(`/product/${rp._id || rp.id}`)}
                                            className="bg-white rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all"
                                        >
                                            <div
                                                className="overflow-hidden"
                                                style={{ aspectRatio: "1/1" }}
                                            >
                                                <img
                                                    src={rpImg}
                                                    alt={rp.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src = "https://placehold.co/600x600/e5e7eb/64748b?text=No+Image";
                                                    }}
                                                />
                                            </div>
                                            <div className="p-3">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                                                    {rp.name}
                                                </p>
                                                <div className="flex items-baseline gap-1.5 mt-1">
                                                    <p className="text-sm font-bold text-gray-900">
                                                        ₹{toINR(rp.displayPrice)}
                                                    </p>
                                                    {rp.displayActualPrice > rp.displayPrice && (
                                                        <p className="text-xs text-gray-400 line-through">
                                                            ₹{toINR(rp.displayActualPrice)}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mt-1">
                                                    <StarRating
                                                        rating={rp.averageRating || 0}
                                                        size="small"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <SizeGuideModal isOpen={isSizeOpen} onClose={() => setIsSizeOpen(false)} />
        </>
    );
}