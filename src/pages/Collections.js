import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const COFFEE = "#1B1816"; // Dark rich brown/coffee color

// Styles
const Styles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
    
    .fd { font-family: 'Playfair Display', Georgia, serif; }
    .fs { font-family: 'DM Sans', system-ui, sans-serif; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes slowSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .animate-fadeUp { animation: fadeUp 0.6s ease forwards; }
    .animate-scaleIn { animation: scaleIn 0.4s ease forwards; }
    
    .masonry-grid {
      column-count: 1;
      column-gap: 1.5rem;
    }
    
    @media (min-width: 640px) {
      .masonry-grid {
        column-count: 2;
      }
    }
    
    @media (min-width: 1024px) {
      .masonry-grid {
        column-count: 3;
      }
    }
    
    @media (min-width: 1280px) {
      .masonry-grid {
        column-count: 4;
      }
    }
    
    .masonry-item {
      break-inside: avoid;
      margin-bottom: 1.5rem;
    }
    
    @media (max-width: 640px) {
      button, .cursor-pointer {
        -webkit-tap-highlight-color: transparent;
      }
    }
  `}</style>
);

// Collection Data - Updated to match image style
const COLLECTIONS = [
    {
        id: 1,
        title: "Global Collections",
        subtitle: "WORLD-CLASS CRAFTSMANSHIP",
        description: "Discover world-class craftsmanship inspired by fashion capitals — Paris, Milan, Tokyo, and New York.",
        image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=1200&fit=crop&q=80&auto=format",
        productCount: 48,
        icon: "🌍",
        bgColor: "#FDFBF7",
        tagline: "Spring/Summer 2026"
    },
    {
        id: 2,
        title: "Luxury Collections",
        subtitle: "BESPOKE ELEGANCE",
        description: "Experience the pinnacle of couture with hand-embroidered gowns, cashmere coats, and diamond-embellished accessories.",
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1000&fit=crop&q=80&auto=format",
        productCount: 36,
        icon: "✨",
        bgColor: "#FDFBF7",
        tagline: "Limited Edition"
    },
    {
        id: 3,
        title: "Originals by Brubla",
        subtitle: "SIGNATURE STYLE",
        description: "Our signature collection that embodies the essence of modern luxury. Timeless pieces crafted for the discerning individual.",
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1300&fit=crop&q=80&auto=format",
        productCount: 52,
        icon: "👑",
        bgColor: "#FDFBF7",
        tagline: "SS26 Drop"
    },
    {
        id: 4,
        title: "Indian Roots",
        subtitle: "TIMELESS TRADITIONS",
        description: "Celebrate timeless traditions with our curated ethnic wear. From Banarasi silk to handwoven khadi.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1400&fit=crop&q=80&auto=format",
        productCount: 44,
        icon: "🇮🇳",
        bgColor: "#FDFBF7",
        tagline: "Festive Capsule"
    },
    {
        id: 5,
        title: "Weddings & Celebrations",
        subtitle: "YOUR SPECIAL DAY",
        description: "Make your special day unforgettable with our exquisite wedding collection. From bridal lehengas to groom sherwanis.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1400&fit=crop&q=80&auto=format",
        productCount: 38,
        icon: "💍",
        bgColor: "#FDFBF7",
        tagline: "Bridal Edit"
    },
    {
        id: 6,
        title: "Street Style Edit",
        subtitle: "URBAN ESSENTIALS",
        description: "Elevate your everyday look with our curated streetwear collection. Casual, cool, and effortlessly stylish.",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1200&fit=crop&q=80&auto=format",
        productCount: 42,
        icon: "🔥",
        bgColor: "#FDFBF7",
        tagline: "New Arrivals"
    },
    {
        id: 7,
        title: "Sustainable Fashion",
        subtitle: "ECO-CONSCIOUS",
        description: "Fashion that cares for the planet. Ethically sourced, sustainably produced, beautifully crafted.",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=1150&fit=crop&q=80&auto=format",
        productCount: 28,
        icon: "🌱",
        bgColor: "#FDFBF7",
        tagline: "Conscious Collection"
    },
    {
        id: 8,
        title: "Accessories Edit",
        subtitle: "PERFECT FINISHING",
        description: "Complete your look with our curated accessories. Bags, jewelry, scarves, and more.",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=1000&fit=crop&q=80&auto=format",
        productCount: 56,
        icon: "👜",
        bgColor: "#FDFBF7",
        tagline: "Final Touch"
    }
];

// Collection Card Component - Styled like the reference image
const CollectionCard = ({ collection, index, onClick }) => {
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className="masonry-item group cursor-pointer"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
            }}
            onClick={() => onClick(collection)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                {/* Image Container */}
                <div className="relative overflow-hidden bg-[#F5F2EB]">
                    <img
                        src={collection.image}
                        alt={collection.title}
                        className="w-full object-cover transition-transform duration-700 ease-out"
                        style={{
                            transform: hovered ? "scale(1.06)" : "scale(1)",
                            minHeight: "280px",
                            maxHeight: "500px"
                        }}
                        loading="lazy"
                    />

                    {/* Tag Overlay - Top */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                        <span className="inline-block px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-coffee shadow-sm"
                              style={{ color: COFFEE, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                            {collection.tagline}
                        </span>
                    </div>

                    {/* Gradient Overlay */}
                    <div
                        className="absolute inset-0 transition-all duration-500"
                        style={{
                            background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.65) 100%)",
                        }}
                    />

                    {/* Content Overlay - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <div
                            className="transition-all duration-300"
                            style={{
                                transform: hovered ? "translateY(-4px)" : "translateY(0)"
                            }}
                        >
                            {/* Title */}
                            <h3
                                className="font-bold text-white leading-tight mb-1 drop-shadow-md"
                                style={{
                                    fontSize: "clamp(18px, 4.5vw, 22px)",
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    letterSpacing: "-0.02em"
                                }}
                            >
                                {collection.title}
                            </h3>

                            {/* Subtitle */}
                            <p className="text-white/80 text-[10px] sm:text-[11px] font-medium tracking-wide mb-2 drop-shadow">
                                {collection.subtitle}
                            </p>

                            {/* Description - Reveal on Hover */}
                            <div
                                className="overflow-hidden transition-all duration-300"
                                style={{
                                    maxHeight: hovered ? "60px" : "0",
                                    opacity: hovered ? 1 : 0,
                                }}
                            >
                                <p className="text-white/85 text-[11px] sm:text-xs leading-relaxed mb-3 drop-shadow">
                                    {collection.description}
                                </p>
                            </div>

                            {/* Explore Button */}
                            <div
                                className="flex items-center justify-between transition-all duration-300"
                                style={{
                                    opacity: hovered ? 1 : 0.85,
                                }}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-semibold text-white/70 tracking-wide">Products</span>
                                    <span className="text-sm font-bold text-white">{collection.productCount}+</span>
                                </div>

                                <button
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[10px] tracking-wide transition-all duration-300 shadow-md hover:shadow-lg"
                                    style={{
                                        background: "#FFFFFF",
                                        color: COFFEE,
                                        transform: hovered ? "translateX(0)" : "translateX(4px)",
                                    }}
                                >
                                    EXPLORE
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main All Collections Page - Matching the image reference
export default function AllCollections() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [heroVisible, setHeroVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400);
        setHeroVisible(true);
        return () => clearTimeout(timer);
    }, []);

    const handleCollectionClick = (collection) => {
        navigate(`/collections/${collection.id}`, { state: { collection } });
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
                    <div className="text-center px-4">
                        <div className="w-10 h-10 rounded-full border-2 border-coffee border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: `${COFFEE} transparent ${COFFEE} transparent` }} />
                        <p className="text-gray-500 fs text-sm">Loading collections...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#F9F7F2]">
                <Styles />

                {/* Hero Section - Clean, Minimal like reference image */}
                <div className="relative bg-white border-b border-gray-100/80">
                    {/* Subtle background texture */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #1B1816 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
                        {/* Back button */}
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-coffee transition-colors mb-6 sm:mb-8 text-xs sm:text-sm group"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            Back to home
                        </button>

                        <div
                            className="text-left md:text-center"
                            style={{
                                opacity: heroVisible ? 1 : 0,
                                transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                                transition: "opacity 0.6s ease, transform 0.6s ease"
                            }}
                        >
                            {/* Collections Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F2EB] mb-4 md:mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-coffee" style={{ backgroundColor: COFFEE }} />
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-coffee/70">Spring Summer 2026</span>
                            </div>

                            {/* Title */}
                            <h1
                                className="fd font-black text-coffee mb-3"
                                style={{ fontSize: "clamp(32px, 8vw, 56px)", letterSpacing: "-0.02em", color: COFFEE }}
                            >
                                Collections
                            </h1>

                            {/* Separator */}
                            <div className="w-12 h-px bg-coffee/20 mx-0 md:mx-auto mb-4" />

                            {/* Description */}
                            <p className="text-gray-500 fs text-sm sm:text-base max-w-lg mx-0 md:mx-auto">
                                Discover carefully curated collections, each telling a unique story of craftsmanship and elegance.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pinterest Masonry Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                    <div className="masonry-grid">
                        {COLLECTIONS.map((collection, idx) => (
                            <CollectionCard
                                key={collection.id}
                                collection={collection}
                                index={idx}
                                onClick={handleCollectionClick}
                            />
                        ))}
                    </div>

                    {/* Load More Indicator - Subtle */}
                    <div className="flex justify-center mt-10 md:mt-14">
                        <div className="flex items-center gap-3 text-coffee/40 text-[10px] font-medium uppercase tracking-wider">
                            <span className="w-8 h-px bg-coffee/20"></span>
                            End of Collections
                            <span className="w-8 h-px bg-coffee/20"></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}