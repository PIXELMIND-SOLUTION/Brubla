// AllCollections.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const COFFEE = "#C9A96E";

// Styles
const Styles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
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

// Collection Data
const COLLECTIONS = [
    {
        id: 1,
        title: "Global Collections",
        subtitle: "WORLD-CLASS CRAFTMANSHIP",
        description: "Discover world-class craftsmanship inspired by fashion capitals — Paris, Milan, Tokyo, and New York.",
        image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=1200&fit=crop&q=80&auto=format",
        productCount: 48,
        icon: "🌍",
        bgColor: "#fff"
    },
    {
        id: 2,
        title: "Luxury Collections",
        subtitle: "BESPOKE ELEGANCE",
        description: "Experience the pinnacle of couture with hand-embroidered gowns, cashmere coats, and diamond-embellished accessories.",
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1000&fit=crop&q=80&auto=format",
        productCount: 36,
        icon: "✨",
        bgColor: "#FEFCF8"
    },
    {
        id: 3,
        title: "Originals by Brubla",
        subtitle: "SIGNATURE STYLE",
        description: "Our signature collection that embodies the essence of modern luxury. Timeless pieces crafted for the discerning individual.",
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1300&fit=crop&q=80&auto=format",
        productCount: 52,
        icon: "👑",
        bgColor: "#fff"
    },
    {
        id: 4,
        title: "Indian Roots",
        subtitle: "TIMELESS TRADITIONS",
        description: "Celebrate timeless traditions with our curated ethnic wear. From Banarasi silk to handwoven khadi.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1400&fit=crop&q=80&auto=format",
        productCount: 44,
        icon: "🇮🇳",
        bgColor: "#FEFCF8"
    },
    {
        id: 5,
        title: "Weddings & Celebrations",
        subtitle: "YOUR SPECIAL DAY",
        description: "Make your special day unforgettable with our exquisite wedding collection. From bridal lehengas to groom sherwanis.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1400&fit=crop&q=80&auto=format",
        productCount: 38,
        icon: "💍",
        bgColor: "#fff"
    },
    {
        id: 6,
        title: "Street Style Edit",
        subtitle: "URBAN ESSENTIALS",
        description: "Elevate your everyday look with our curated streetwear collection. Casual, cool, and effortlessly stylish.",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1200&fit=crop&q=80&auto=format",
        productCount: 42,
        icon: "🔥",
        bgColor: "#FEFCF8"
    },
    {
        id: 7,
        title: "Sustainable Fashion",
        subtitle: "ECO-CONSCIOUS",
        description: "Fashion that cares for the planet. Ethically sourced, sustainably produced, beautifully crafted.",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=1150&fit=crop&q=80&auto=format",
        productCount: 28,
        icon: "🌱",
        bgColor: "#fff"
    },
    {
        id: 8,
        title: "Accessories Edit",
        subtitle: "PERFECT FINISHING",
        description: "Complete your look with our curated accessories. Bags, jewelry, scarves, and more.",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=1000&fit=crop&q=80&auto=format",
        productCount: 56,
        icon: "👜",
        bgColor: "#FEFCF8"
    }
];

// Collection Card Component
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
            <div className="relative rounded-2xl overflow-hidden max-w-5xl mx-auto shadow-lg hover:shadow-2xl transition-all duration-500">
                {/* Image */}
                <div className="relative overflow-hidden">
                    <img
                        src={collection.image}
                        alt={collection.title}
                        className="w-full object-cover transition-transform duration-700 ease-out"
                        style={{
                            transform: hovered ? "scale(1.08)" : "scale(1)",
                            aspectRatio: "auto",
                            minHeight: "300px",
                        }}
                        loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{
                            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.85) 100%)",
                            opacity: hovered ? 1 : 0.8,
                        }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                        {/* Icon */}
                        <div
                            className="text-3xl mb-2 transition-transform duration-300"
                            style={{ transform: hovered ? "scale(1.1)" : "scale(1)" }}
                        >
                            {collection.icon}
                        </div>

                        {/* Subtitle */}
                        <p
                            className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-1"
                            style={{ color: COFFEE }}
                        >
                            {collection.subtitle}
                        </p>

                        {/* Title */}
                        <h3
                            className="font-black text-white leading-tight mb-2"
                            style={{
                                fontSize: "clamp(18px, 4vw, 24px)",
                                fontFamily: "Playfair Display, Georgia, serif",
                                textShadow: "0 1px 8px rgba(0,0,0,0.3)"
                            }}
                        >
                            {collection.title}
                        </h3>

                        {/* Description - shown on hover */}
                        <p
                            className="text-gray-200 text-xs fs mb-3 line-clamp-2 transition-all duration-300"
                            style={{
                                opacity: hovered ? 1 : 0,
                                transform: hovered ? "translateY(0)" : "translateY(10px)",
                                maxHeight: hovered ? "60px" : "0",
                            }}
                        >
                            {collection.description}
                        </p>

                        {/* Stats and Button */}
                        <div
                            className="flex items-center justify-between transition-all duration-300"
                            style={{
                                opacity: hovered ? 1 : 0.8,
                                transform: hovered ? "translateY(0)" : "translateY(5px)",
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-white/70 uppercase tracking-wide">Products</span>
                                <span className="text-sm font-black text-white">{collection.productCount}+</span>
                            </div>

                            <button
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[10px] tracking-wide transition-all duration-300"
                                style={{
                                    background: "#6F4E37",
                                    color: "#fff",
                                    transform: hovered ? "translateX(0)" : "translateX(5px)",
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
    );
};

// Main All Collections Page
export default function AllCollections() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [heroVisible, setHeroVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        setHeroVisible(true);
        return () => clearTimeout(timer);
    }, []);

    const handleCollectionClick = (collection) => {
        navigate(`/collections/${collection.id}`, { state: { collection } });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center px-4">
                        <div className="w-10 h-10 rounded-full border-2 border-coffee border-t-transparent animate-spin mx-auto mb-3" />
                        <p className="text-gray-500 fs text-sm">Loading collections...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black">
                <Styles />

                {/* Hero Section */}
                <div className="relative overflow-hidden" style={{ background: "black" }}>
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-coffee/10 blur-3xl" />
                        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-coffee/10 blur-3xl" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-coffee transition-colors mb-5 sm:mb-6 text-xs sm:text-sm group"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            Back to home
                        </button>
                        <div
                            className="text-center"
                            style={{
                                opacity: heroVisible ? 1 : 0,
                                transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                                transition: "opacity 0.6s ease, transform 0.6s ease"
                            }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6F4E37] mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-coffee animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Curated For You</span>
                            </div>

                            <h1
                                className="fd font-black text-white mb-3"
                                style={{ fontSize: "clamp(28px, 7vw, 52px)", letterSpacing: "-0.02em" }}
                            >
                                Our Collections
                            </h1>

                            <p className="text-gray-300 fs text-sm sm:text-base max-w-lg mx-auto">
                                Discover carefully curated collections, each telling a unique story of craftsmanship and elegance.
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-coffee/50 to-transparent" />
                </div>

                {/* Pinterest Masonry Grid */}
                <div className="max-w-7xl mx-auto bg-black px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
                </div>
            </div>
        </>
    );
}