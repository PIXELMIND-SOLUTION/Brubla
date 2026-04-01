import { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const categories = [
    {
        id: 1,
        name: "Women's Fashion",
        itemCount: "2.4k items",
        span: "col-span-2 row-span-2",
        image:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
        accent: "from-rose-900/60 via-rose-800/40 to-transparent",
        tag: "Trending",
    },
    {
        id: 2,
        name: "Men's Style",
        itemCount: "1.8k items",
        span: "col-span-1 row-span-1",
        image:
            "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80",
        accent: "from-slate-900/70 via-slate-800/40 to-transparent",
        tag: "New",
    },
    {
        id: 3,
        name: "Sneakers",
        itemCount: "980 items",
        span: "col-span-1 row-span-1",
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
        accent: "from-orange-900/60 via-orange-800/40 to-transparent",
        tag: "Hot",
    },
    {
        id: 4,
        name: "Jewelry",
        itemCount: "1.2k items",
        span: "col-span-1 row-span-2",
        image:
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
        accent: "from-amber-900/60 via-amber-800/40 to-transparent",
        tag: "Luxury",
    },
    {
        id: 5,
        name: "Home Decor",
        itemCount: "3.1k items",
        span: "col-span-2 row-span-1",
        image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        accent: "from-teal-900/60 via-teal-800/40 to-transparent",
        tag: "Popular",
    },
    {
        id: 6,
        name: "Beauty",
        itemCount: "760 items",
        span: "col-span-1 row-span-1",
        image:
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
        accent: "from-pink-900/60 via-pink-800/40 to-transparent",
        tag: "New",
    },
    {
        id: 7,
        name: "Electronics",
        itemCount: "2.0k items",
        span: "col-span-1 row-span-1",
        image:
            "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80",
        accent: "from-blue-900/60 via-blue-800/40 to-transparent",
        tag: "Tech",
    },
    {
        id: 8,
        name: "Sports & Outdoor",
        itemCount: "1.5k items",
        span: "col-span-1 row-span-1",
        image:
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
        accent: "from-green-900/60 via-green-800/40 to-transparent",
        tag: "Active",
    },
    {
        id: 9,
        name: "Kids & Toys",
        itemCount: "890 items",
        span: "col-span-1 row-span-1",
        image:
            "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&q=80",
        accent: "from-purple-900/60 via-purple-800/40 to-transparent",
        tag: "Fun",
    },
    {
        id: 10,
        name: "Books & Art",
        itemCount: "4.3k items",
        span: "col-span-2 row-span-1",
        image:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
        accent: "from-stone-900/60 via-stone-800/40 to-transparent",
        tag: "Culture",
    },
];

const tagColors = {
    Trending: "bg-rose-500",
    New: "bg-emerald-500",
    Hot: "bg-orange-500",
    Luxury: "bg-amber-500",
    Popular: "bg-teal-500",
    Tech: "bg-blue-500",
    Active: "bg-green-500",
    Fun: "bg-purple-500",
    Culture: "bg-stone-500",
};

export default function CategoriesGrid() {
    const [hovered, setHovered] = useState(null);

    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div
                className="min-h-screen bg-[#0e0e0e] px-6 py-14"
                style={{ fontFamily: "'Georgia', serif" }}
            >
                {/* Header */}
                <div className="max-w-7xl mx-auto mb-10">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-2">
                        Browse by
                    </p>
                    <h1 className="text-5xl font-bold text-white leading-none tracking-tight">
                        Categories
                    </h1>
                    <div className="mt-4 h-px w-24 bg-gradient-to-r from-white to-transparent" />
                </div>

                {/* Pinterest Grid */}
                <div className="max-w-7xl mx-auto grid grid-cols-4 auto-rows-[200px] gap-3">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className={`${cat.span} relative overflow-hidden cursor-pointer group`}
                            onMouseEnter={() => setHovered(cat.id)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={()=>navigate(`/category/${cat.name}`)}
                        >
                            {/* Background Image */}
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${hovered === cat.id ? "scale-110" : "scale-100"
                                    }`}
                            />

                            {/* Gradient Overlay */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-t ${cat.accent} transition-opacity duration-300 ${hovered === cat.id ? "opacity-100" : "opacity-80"
                                    }`}
                            />

                            {/* Dark vignette bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            {/* Tag Badge */}
                            <div className="absolute top-4 left-4">
                                <span
                                    className={`${tagColors[cat.tag] || "bg-zinc-700"
                                        } text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1`}
                                >
                                    {cat.tag}
                                </span>
                            </div>

                            {/* Save Button */}
                            <div
                                className={`absolute top-4 right-4 transition-all duration-300 ${hovered === cat.id
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 -translate-y-2"
                                    }`}
                            >
                                <button className="bg-white text-black text-xs font-bold px-3 py-1.5 hover:bg-zinc-200 transition-colors">
                                    Save
                                </button>
                            </div>

                            {/* Text Content */}
                            <div
                                className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-300 ${hovered === cat.id ? "translate-y-0" : "translate-y-1"
                                    }`}
                            >
                                <h2 className="text-white font-bold text-xl leading-tight tracking-tight drop-shadow-lg">
                                    {cat.name}
                                </h2>
                                <div
                                    className={`flex items-center gap-2 mt-1.5 transition-all duration-300 ${hovered === cat.id
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-2"
                                        }`}
                                >
                                    <span className="text-zinc-300 text-xs">{cat.itemCount}</span>
                                    <span className="text-zinc-500 text-xs">·</span>
                                    <span className="text-zinc-300 text-xs underline underline-offset-2 hover:text-white transition-colors">
                                        Explore →
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="max-w-7xl mx-auto mt-10 flex justify-center">
                    <button className="group relative overflow-hidden border border-zinc-700 text-zinc-300 text-sm tracking-widest uppercase px-8 py-3.5 hover:border-white hover:text-white transition-all duration-300">
                        <span className="relative z-10">View All Categories</span>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>
            </div>
        </>
    );
}