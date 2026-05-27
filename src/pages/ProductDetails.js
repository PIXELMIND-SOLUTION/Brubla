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

// ─── Helper Functions ─────────────────────────────────────────────────────────
const getProductImages = (product) => {
    const images = [];

    if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
            if (variant.mainImage && variant.mainImage.trim() !== "") {
                let imgUrl = variant.mainImage;
                if (imgUrl.includes("localhost:4077")) {
                    imgUrl = imgUrl.replace("http://localhost:4077", "http://31.97.228.17:4077");
                }
                images.push(imgUrl);
            }
            if (variant.images && variant.images.length > 0) {
                variant.images.forEach(img => {
                    if (img && img.trim() !== "") {
                        let imgUrl = img;
                        if (imgUrl.includes("localhost:4077")) {
                            imgUrl = imgUrl.replace("http://localhost:4077", "http://31.97.228.17:4077");
                        }
                        if (!images.includes(imgUrl)) {
                            images.push(imgUrl);
                        }
                    }
                });
            }
        });
    }

    return [...new Set(images)];
};

const getUniqueColors = (variants) => {
    if (!variants) return [];
    return [...new Set(variants.map(v => v.color).filter(c => c && c.trim() !== ""))];
};

const getUniqueSizes = (variants) => {
    if (!variants) return [];
    return [...new Set(variants.map(v => v.size).filter(s => s && s.trim() !== ""))];
};

const getStockForVariant = (variants, color, size) => {
    const variant = variants.find(v => v.color === color && v.size === size);
    return variant ? variant.stock : 0;
};

const getPriceForVariant = (variants, color, size) => {
    const variant = variants.find(v => v.color === color && v.size === size);
    return variant ? {
        price: variant.discountPrice || variant.actualPrice,
        actualPrice: variant.actualPrice,
        discount: variant.discountPrice ? Math.round(((variant.actualPrice - variant.discountPrice) / variant.actualPrice) * 100) : null
    } : null;
};

const toINR = (usd) => {
    if (!usd) return "0";
    return (usd * 83).toLocaleString("en-IN", { maximumFractionDigits: 0 });
};

// ─── Star Rating Component ────────────────────────────────────────────────────
const StarRating = ({ rating, size = "small" }) => {
    const starSize = size === "small" ? 14 : 16;
    const numRating = Number(rating) || 0;
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={starSize}
                    className={`${i < Math.floor(numRating)
                        ? "text-amber-400 fill-amber-400"
                        : i < numRating
                            ? "text-amber-400 fill-amber-400 opacity-50"
                            : "text-gray-200 fill-gray-200"
                        }`}
                />
            ))}
        </div>
    );
};

// ─── Image Gallery Component (Mobile Optimized) ───────────────────────────────
const ImageGallery = ({ images, productName, currentStock, tags, discount, selectedImage, setSelectedImage }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFullscreen, setShowFullscreen] = useState(false);

    useEffect(() => {
        const index = images.findIndex(img => img === selectedImage);
        if (index !== -1) setCurrentIndex(index);
    }, [selectedImage, images]);

    const nextImage = () => {
        const next = (currentIndex + 1) % images.length;
        setCurrentIndex(next);
        setSelectedImage(images[next]);
    };

    const prevImage = () => {
        const prev = (currentIndex - 1 + images.length) % images.length;
        setCurrentIndex(prev);
        setSelectedImage(images[prev]);
    };

    return (
        <>
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm">
                {/* Main Image */}
                <div
                    className="relative cursor-pointer"
                    style={{ aspectRatio: "1/1" }}
                    onClick={() => setShowFullscreen(true)}
                >
                    <img
                        src={images[currentIndex] || "https://placehold.co/800x800/e5e7eb/64748b?text=No+Image"}
                        alt={`${productName} - view ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                    />

                    {/* Badges */}
                    {currentStock === 0 && (
                        <div className="absolute inset-0 bg-white/65 flex items-center justify-center">
                            <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 border border-gray-400 px-4 py-2 rounded-full">Sold Out</span>
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

                {/* Navigation Arrows (Mobile) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip (Horizontal Scroll) */}
            {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setCurrentIndex(idx);
                                setSelectedImage(img);
                            }}
                            className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${currentIndex === idx ? "ring-2 ring-gray-900" : "opacity-70"
                                }`}
                            style={{ width: "70px", height: "70px" }}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            {showFullscreen && (
                <div
                    className="fixed inset-0 bg-black z-50 flex flex-col"
                    onClick={() => setShowFullscreen(false)}
                >
                    <div className="relative flex-1 flex items-center justify-center">
                        <button
                            onClick={() => setShowFullscreen(false)}
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
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
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

// ─── Designer Card Component ─────────────────────────────────────────────────
const DesignerCard = ({ product }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const designer =
        product.createdBy === "admin"
            ? {
                name: "Brubla Premium",
                brand: "Brubla Official",
                avatar:
                    "https://api.dicebear.com/7.x/notionists/svg?seed=brubla",
                verified: true,
                rating: 4.9,
                followers: "25K",
                products: 120,
                joined: "2024",
                bio:
                    "Brubla Premium offers high-quality fashion essentials with premium craftsmanship and modern style.",
                location: "Worldwide Shipping",
            }
            : {
                name:
                    product.creatorDetails?.name ||
                    product.createdBy ||
                    "Brand Studio",

                brand:
                    product.creatorDetails?.brandName ||
                    product.categoryId?.name ||
                    "Premium Brand",

                avatar:
                    product.creatorDetails?.profileImage ||
                    "https://api.dicebear.com/7.x/adventurer/svg?seed=designer",

                verified: true,

                rating:
                    product.creatorDetails?.rating || 4.8,

                followers:
                    product.creatorDetails?.followers || "12.5K",

                products:
                    product.creatorDetails?.products ||
                    Math.floor(Math.random() * 50) + 10,

                joined:
                    product.creatorDetails?.joined ||
                    new Date(product.createdAt)
                        .getFullYear()
                        .toString(),

                bio:
                    product.creatorDetails?.bio ||
                    product.description ||
                    "Premium quality products crafted with attention to detail and customer satisfaction.",

                location:
                    product.creatorDetails?.location ||
                    "Global Shipping",
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
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${isFollowing
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

            <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">{designer.bio}</p>
            </div>

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

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedImage, setSelectedImage] = useState("");
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState("details");
    const [isSizeOpen, setIsSizeOpen] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Fetch product from API
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setError("No product ID provided");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://31.97.228.17:4077/api/admin/products/${id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success && data.product) {
                    setProduct(data.product);

                    const colors = getUniqueColors(data.product.variants);
                    const sizes = getUniqueSizes(data.product.variants);

                    if (colors.length > 0) setSelectedColor(colors[0]);
                    if (sizes.length > 0) setSelectedSize(sizes[0]);

                    const images = getProductImages(data.product);
                    if (images.length > 0) setSelectedImage(images[0]);
                } else {
                    setError("Product not found");
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError(err instanceof Error ? err.message : "Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Fetch related products
    useEffect(() => {
        if (product && product.categoryId) {
            const fetchRelated = async () => {
                try {
                    const response = await fetch(`http://31.97.228.17:4077/api/admin/categories/${product.categoryId}/products?limit=4`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.products) {
                            const filtered = data.products.filter(p => p._id !== product._id).slice(0, 4);
                            setRelatedProducts(filtered);
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch related products:", err);
                }
            };
            fetchRelated();
        }
    }, [product]);

    const productImages = product ? getProductImages(product) : [];
    const colors = product ? getUniqueColors(product.variants) : [];
    const sizes = product ? getUniqueSizes(product.variants) : [];

    const currentVariantPrice = product && selectedColor && selectedSize
        ? getPriceForVariant(product.variants, selectedColor, selectedSize)
        : null;

    const currentStock = product && selectedColor && selectedSize
        ? getStockForVariant(product.variants, selectedColor, selectedSize)
        : 0;

    const discount = currentVariantPrice?.discount || (product?.maxDiscount || 0);
    const displayPrice = currentVariantPrice?.price || product?.displayPrice || 0;
    const displayActualPrice = currentVariantPrice?.actualPrice || product?.displayActualPrice || 0;

    const handleAddToCart = () => {
        alert(`Added ${quantity} ${product?.name} (${selectedColor}, ${selectedSize}) to cart!`);
    };

    const handleBuyNow = () => {
        alert(`Proceeding to checkout with ${quantity} ${product?.name}`);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product?.name,
                text: product?.description,
                url: window.location.href,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-2 border-gray-200 border-t-coffee rounded-full animate-spin" style={{ borderTopColor: COFFEE }} />
                        <p className="text-gray-500 text-sm">Loading product details...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <ShoppingBag size={32} className="text-gray-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
                        <p className="text-gray-500 mb-6">
                            {error || "The product you're looking for doesn't exist or has been removed."}
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 rounded-full text-white transition-all hover:opacity-80"
                            style={{ backgroundColor: COFFEE }}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
                html { scroll-behavior: smooth; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                .font-display { font-family: 'Instrument Serif', Georgia, serif; }
                .font-body { font-family: 'DM Sans', system-ui, sans-serif; }
            `}</style>

            <div className="min-h-screen font-body bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    {/* Back and Share Buttons */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span className="text-sm hidden sm:inline">Back</span>
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

                    {/* Mobile: Image Gallery First */}
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

                    {/* Desktop: Two Column Layout */}
                    <div className="hidden lg:flex flex-row gap-6 items-start">
                        {/* Left: Main Image */}
                        <div className="w-[38%] sticky top-24">
                            <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm" style={{ aspectRatio: "3/4" }}>
                                <img
                                    src={selectedImage || productImages[0] || "https://placehold.co/800x1067/e5e7eb/64748b?text=No+Image"}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {currentStock === 0 && (
                                    <div className="absolute inset-0 bg-white/65 flex items-center justify-center">
                                        <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 border border-gray-400 px-4 py-2 rounded-full">Sold Out</span>
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

                        {/* Middle: Thumbnails */}
                        <div className="w-[28%] max-h-[calc(100vh-7rem)] overflow-y-auto flex flex-col gap-3">
                            {productImages.slice(0, 8).map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative rounded-3xl overflow-hidden bg-white shadow-sm flex-shrink-0 cursor-pointer transition-all hover:shadow-md ${selectedImage === img ? "ring-2 ring-gray-900" : ""
                                        }`}
                                    style={{ aspectRatio: "4/5" }}
                                >
                                    <img
                                        src={img}
                                        alt={`${product.name} - view ${i + 2}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Right: Product Info */}
                        <div className="w-[34%] sticky top-24">
                            {/* Product Info Panel - Same as mobile below */}
                            <ProductInfoPanel
                                product={product}
                                colors={colors}
                                sizes={sizes}
                                selectedColor={selectedColor}
                                setSelectedColor={setSelectedColor}
                                selectedSize={selectedSize}
                                setSelectedSize={setSelectedSize}
                                currentStock={currentStock}
                                displayPrice={displayPrice}
                                displayActualPrice={displayActualPrice}
                                discount={discount}
                                quantity={quantity}
                                setQuantity={setQuantity}
                                handleAddToCart={handleAddToCart}
                                handleBuyNow={handleBuyNow}
                                setIsSizeOpen={setIsSizeOpen}
                                toINR={toINR}
                            />
                        </div>
                    </div>

                    {/* Mobile: Product Info After Images */}
                    <div className="block lg:hidden">
                        <ProductInfoPanel
                            product={product}
                            colors={colors}
                            sizes={sizes}
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                            selectedSize={selectedSize}
                            setSelectedSize={setSelectedSize}
                            currentStock={currentStock}
                            displayPrice={displayPrice}
                            displayActualPrice={displayActualPrice}
                            discount={discount}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            handleAddToCart={handleAddToCart}
                            handleBuyNow={handleBuyNow}
                            setIsSizeOpen={setIsSizeOpen}
                            toINR={toINR}
                            isMobile={true}
                        />
                    </div>

                    {/* TABS SECTION */}
                    <div className="mt-12">
                        <div className="flex gap-4 sm:gap-6 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
                            {["details", "designer", "reviews"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 px-1 text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab
                                            ? "text-gray-900 border-b-2 border-gray-900"
                                            : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {tab === "details" && "Product Details"}
                                    {tab === "designer" && "Designer Info"}
                                    {tab === "reviews" && `Reviews (${product.reviews?.length || 0})`}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[300px]">
                            {activeTab === "details" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-3 text-lg text-gray-900">Description</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                            {showFullDescription
                                                ? product.description
                                                : `${product.description?.substring(0, 300) || "No description available"}${product.description?.length > 300 ? "..." : ""}`}
                                        </p>
                                        {product.description?.length > 300 && (
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
                                                        className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 capitalize"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="font-semibold mb-3 text-gray-900">Product Specifications</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs text-gray-500">Category</p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {product.categoryId?.name || "Fashion"}
                                                </p>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs text-gray-500">Subcategory</p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {product.subcategoryName || "Apparel"}
                                                </p>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs text-gray-500">Total Stock</p>
                                                <p className="text-sm font-medium text-gray-800">{product.totalStock || 0} units</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs text-gray-500">Available Colors</p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {colors.join(", ") || "Standard"}
                                                </p>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs text-gray-500">Available Sizes</p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {sizes.join(", ") || "One Size"}
                                                </p>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs text-gray-500">Delivery Locations</p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {product.deliveryAddresses?.length || 5}+ cities
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "designer" && (
                                <DesignerCard product={product} />
                            )}

                            {activeTab === "reviews" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-bold text-gray-900">
                                                    {product.averageRating?.toFixed(1) || "4.5"}
                                                </span>
                                                <StarRating rating={product.averageRating || 4.5} />
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
                                                        <p className="font-medium text-sm text-gray-900">User {idx + 1}</p>
                                                        <StarRating rating={4 + (idx % 1)} size="small" />
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Great product! Exactly as described. Quality is amazing.
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {new Date(Date.now() - idx * 86400000).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RELATED PRODUCTS */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 font-display">You May Also Like</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                {relatedProducts.map((relatedProduct) => (
                                    <div
                                        key={relatedProduct._id}
                                        onClick={() => navigate(`/product/${relatedProduct._id}`)}
                                        className="bg-white rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="overflow-hidden" style={{ aspectRatio: "1/1" }}>
                                            <img
                                                src={relatedProduct.variants?.[0]?.mainImage || "https://placehold.co/600x600/e5e7eb/64748b?text=No+Image"}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/600x600/e5e7eb/64748b?text=No+Image";
                                                }}
                                            />
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{relatedProduct.name}</p>
                                            <div className="flex items-baseline gap-1.5 mt-1">
                                                <p className="text-sm font-bold text-gray-900">RS. {toINR(relatedProduct.displayPrice)}</p>
                                                {relatedProduct.displayActualPrice > relatedProduct.displayPrice && (
                                                    <p className="text-xs text-gray-400 line-through">RS. {toINR(relatedProduct.displayActualPrice)}</p>
                                                )}
                                            </div>
                                            <div className="mt-1">
                                                <StarRating rating={relatedProduct.averageRating || 4} size="small" />
                                            </div>
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

// ─── Product Info Panel Component (Reusable) ─────────────────────────────────
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
    toINR,
    isMobile = false
}) {
    return (
        <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 ${!isMobile ? 'sticky top-24' : ''}`}>
            {/* Title & Rating */}
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight font-display">
                    {product.name}
                </h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <StarRating rating={product.averageRating || 4.5} />
                    <span className="text-xs sm:text-sm text-gray-500">
                        {product.reviews?.length || 0} reviews
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs sm:text-sm text-gray-500">{product.subcategoryName || "Product"}</span>
                </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">RS. {toINR(displayPrice)}</span>
                {displayActualPrice > displayPrice && (
                    <>
                        <span className="text-sm text-gray-400 line-through">RS. {toINR(displayActualPrice)}</span>
                        <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                            -{discount}%
                        </span>
                    </>
                )}
            </div>

            {/* Colors */}
            {colors.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Colour</p>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedColor === color
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
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Size</p>
                        <button
                            onClick={() => setIsSizeOpen(true)}
                            className="text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded-full hover:border-gray-400 transition-colors"
                        >
                            Size Guide
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 ${selectedSize === size
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
                {currentStock > 0 ? (
                    <>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs text-green-600 font-medium">In Stock</span>
                        <span className="text-xs text-gray-400">• {currentStock} units available</span>
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
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quantity</p>
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
                    className="flex-1 py-2.5 sm:py-3 rounded-full border border-gray-300 text-xs sm:text-sm font-semibold text-gray-800 hover:border-gray-800 transition-all disabled:opacity-40 tracking-wide"
                    disabled={currentStock === 0}
                >
                    ADD TO BAG
                </button>
                <button
                    onClick={handleBuyNow}
                    className="flex-1 py-2.5 sm:py-3 rounded-full text-white text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 tracking-wide"
                    style={{ backgroundColor: currentStock > 0 ? COFFEE : "#9ca3af", cursor: currentStock > 0 ? "pointer" : "not-allowed" }}
                    disabled={currentStock === 0}
                >
                    BUY NOW
                </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-xl space-y-3 border border-gray-100">
                <div className="flex items-center gap-3">
                    <Truck size={16} className="text-gray-500" />
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-800">Free Delivery</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">On orders above RS. 999</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <RotateCcw size={16} className="text-gray-500" />
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-800">30 Days Return</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">Easy returns and exchanges</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-gray-500" />
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-800">Secure Payment</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">100% safe checkout</p>
                    </div>
                </div>
            </div>
        </div>
    );
}