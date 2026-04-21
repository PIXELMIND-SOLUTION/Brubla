import { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const categories = [
    {
        id: 1,
        name: "Women's-Fashion",
        itemCount: "2.4k items",
        mdSpan: "md:col-span-2 md:row-span-2",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
        accent: "from-rose-900/60 via-rose-800/40 to-transparent",
        tag: "Trending",
    },
    {
        id: 2,
        name: "Men's-Style",
        itemCount: "1.8k items",
        mdSpan: "",
        image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80",
        accent: "from-slate-900/70 via-slate-800/40 to-transparent",
        tag: "New",
    },
    {
        id: 3,
        name: "Sneakers",
        itemCount: "980 items",
        mdSpan: "",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
        accent: "from-orange-900/60 via-orange-800/40 to-transparent",
        tag: "Hot",
    },
    {
        id: 4,
        name: "Jewelry",
        itemCount: "1.2k items",
        mdSpan: "md:row-span-2",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
        accent: "from-amber-900/60 via-amber-800/40 to-transparent",
        tag: "Luxury",
    },
    {
        id: 5,
        name: "Home-Decor",
        itemCount: "3.1k items",
        mdSpan: "md:col-span-2",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        accent: "from-teal-900/60 via-teal-800/40 to-transparent",
        tag: "Popular",
    },
    {
        id: 6,
        name: "Beauty",
        itemCount: "760 items",
        mdSpan: "",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
        accent: "from-pink-900/60 via-pink-800/40 to-transparent",
        tag: "New",
    },
    {
        id: 7,
        name: "Electronics",
        itemCount: "2.0k items",
        mdSpan: "",
        image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80",
        accent: "from-blue-900/60 via-blue-800/40 to-transparent",
        tag: "Tech",
    },
    {
        id: 8,
        name: "Sports-and-Fitness",
        itemCount: "1.5k items",
        mdSpan: "",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
        accent: "from-green-900/60 via-green-800/40 to-transparent",
        tag: "Active",
    },
    {
        id: 9,
        name: "Kids-and-Toys",
        itemCount: "890 items",
        mdSpan: "",
        image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&q=80",
        accent: "from-purple-900/60 via-purple-800/40 to-transparent",
        tag: "Fun",
    },
    {
        id: 10,
        name: "Books-and-Art",
        itemCount: "4.3k items",
        mdSpan: "md:col-span-2",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
        accent: "from-stone-900/60 via-stone-800/40 to-transparent",
        tag: "Culture",
    },
    {
        id: 11,
        name: "Watches",
        itemCount: "650 items",
        mdSpan: "",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
        accent: "from-zinc-900/60 via-zinc-800/40 to-transparent",
        tag: "Luxury",
    },
    {
        id: 12,
        name: "Bags-and-Accessories",
        itemCount: "1.1k items",
        mdSpan: "",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
        accent: "from-rose-900/60 via-rose-800/40 to-transparent",
        tag: "Trending",
    },
    {
        id: 13,
        name: "Gaming",
        itemCount: "920 items",
        mdSpan: "",
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80",
        accent: "from-violet-900/60 via-violet-800/40 to-transparent",
        tag: "Hot",
    },
    {
        id: 14,
        name: "Furniture",
        itemCount: "2.6k items",
        mdSpan: "md:row-span-2",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80",
        accent: "from-amber-900/60 via-amber-800/40 to-transparent",
        tag: "Popular",
    },
    {
        id: 15,
        name: "Kitchen",
        itemCount: "1.7k items",
        mdSpan: "",
        image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600&q=80",
        accent: "from-orange-900/60 via-orange-800/40 to-transparent",
        tag: "Home",
    },
];

export default function CategoriesGrid() {
    const [hovered, setHovered] = useState(null);
    const navigate = useNavigate();

    return (
        <>
            <Header />

            <div className="min-h-screen bg-black px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="max-w-7xl mx-auto mb-8">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                        Browse by
                    </p>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                        Categories
                    </h1>
                    <div className="mt-3 h-[2px] w-20 bg-white" />
                </div>

                {/* Masonry Layout */}
                <div className="max-w-7xl mx-auto columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="relative break-inside-avoid overflow-hidden rounded-xl cursor-pointer group"
                            onMouseEnter={() => setHovered(cat.id)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => navigate(`/category/${cat.name}`)}
                        >
                            {/* Image */}
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                                loading="lazy"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition" />

                            {/* Tag */}
                            <div className="absolute top-3 left-3">
                                <span className="bg-white text-black text-[10px] px-2 py-1 font-semibold uppercase">
                                    {cat.tag}
                                </span>
                            </div>

                            {/* Save Button */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                                <button className="bg-[#6F4E37] text-white text-xs px-3 py-1 rounded-md">
                                    Save
                                </button>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 p-4 w-full">
                                <h2 className="text-white text-lg font-bold">
                                    {cat.name}
                                </h2>
                                <p className="text-gray-300 text-xs mt-1">
                                    {cat.itemCount}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}