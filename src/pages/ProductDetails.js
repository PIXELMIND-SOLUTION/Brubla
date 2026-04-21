import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Heart, ChevronLeft, Star, Truck, ShieldCheck,
    RotateCcw, Share2, ShoppingBag, Eye,
    MessageCircle, MapPin, Calendar, CheckCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import SizeGuideModal from "../views/SizeGuide";
import Header from "../components/Header";

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
        description: "Stylish oversized denim jacket perfect for casual wear. Made from high-quality cotton denim with a relaxed fit. Features include button-front closure, chest pockets, and adjustable cuffs.",
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
            "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800",
            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800",
            "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800"
        ],
        designer: {
            name: "Elena Martinez",
            brand: "Urban Chic",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            bio: "Award-winning fashion designer with 10+ years of experience in sustainable fashion.",
            location: "New York, USA",
            email: "elena@urbanchic.com",
            followers: "45.2K",
            products: 28,
            rating: 4.9,
            joined: "2018",
            verified: true
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
        description: "Elegant leather backpack perfect for daily use. Genuine leather with multiple compartments for laptop, tablet, and daily essentials. Adjustable straps and durable hardware.",
        sizes: ["One Size"],
        images: [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
            "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"
        ],
        designer: {
            name: "Marcus Chen",
            brand: "LeatherCraft",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg",
            bio: "Artisan leather crafter specializing in minimalist designs using sustainable materials.",
            location: "Portland, Oregon",
            email: "marcus@leathercraft.com",
            followers: "28.7K",
            products: 15,
            rating: 4.8,
            joined: "2019",
            verified: true
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
        description: "Luxurious cashmere wool sweater for ultimate comfort and warmth. Premium quality material sourced from Mongolia. Features ribbed cuffs and hem for a perfect fit.",
        sizes: ["S", "M", "L", "XL"],
        images: [
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
            "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800",
            "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=800"
        ],
        designer: {
            name: "Sarah Johnson",
            brand: "Luxe Knits",
            avatar: "https://randomuser.me/api/portraits/women/32.jpg",
            bio: "Luxury knitwear designer creating timeless pieces from the finest materials.",
            location: "London, UK",
            email: "sarah@luxeknits.com",
            followers: "67.3K",
            products: 42,
            rating: 4.9,
            joined: "2016",
            verified: true
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
        description: "Classic white sneakers that go with everything. Comfortable and durable design with memory foam insole and breathable mesh lining. Perfect for daily wear.",
        sizes: ["6", "7", "8", "9", "10", "11"],
        images: [
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800"
        ],
        designer: {
            name: "Alex Rivera",
            brand: "Urban Stride",
            avatar: "https://randomuser.me/api/portraits/men/92.jpg",
            bio: "Footwear designer focused on comfort and streetwear aesthetics.",
            location: "Los Angeles, CA",
            email: "alex@urbanstride.com",
            followers: "34.1K",
            products: 23,
            rating: 4.7,
            joined: "2020",
            verified: false
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
        description: "Elegant sterling silver necklace with beautiful pendant design. Hypoallergenic and tarnish-resistant. Comes in a luxury gift box. Perfect for special occasions.",
        sizes: ["One Size"],
        images: [
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
            "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800"
        ],
        designer: {
            name: "Isabella Rossi",
            brand: "Rossi Jewels",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "Master jeweler creating handmade pieces inspired by nature and architecture.",
            location: "Florence, Italy",
            email: "isabella@rossijewels.com",
            followers: "89.5K",
            products: 56,
            rating: 4.9,
            joined: "2015",
            verified: true
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
        description: "Modern ceramic table lamp for ambient lighting. Perfect for living room or bedroom. Features a soft glow and elegant design that complements any decor.",
        sizes: ["One Size"],
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6b057fbbf33?w=800",
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800",
            "https://images.unsplash.com/photo-1533093818119-ac1fa47a6d59?w=800"
        ],
        designer: {
            name: "Emma Watson",
            brand: "Ceramic Dreams",
            avatar: "https://randomuser.me/api/portraits/women/28.jpg",
            bio: "Pottery artist creating unique ceramic pieces for modern homes.",
            location: "Copenhagen, Denmark",
            email: "emma@ceramicdreams.com",
            followers: "23.4K",
            products: 34,
            rating: 4.6,
            joined: "2021",
            verified: false
        }
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
        description: "Deeply hydrating face serum with hyaluronic acid. Reduces fine lines and improves skin texture. Suitable for all skin types. Dermatologist tested.",
        sizes: ["50ml"],
        images: [
            "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800"
        ],
        designer: {
            name: "Dr. Jennifer Lee",
            brand: "PureSkin Labs",
            avatar: "https://randomuser.me/api/portraits/women/56.jpg",
            bio: "Dermatologist and skincare formulator with PhD in cosmetic chemistry.",
            location: "Seoul, South Korea",
            email: "jennifer@pureskin.com",
            followers: "156K",
            products: 18,
            rating: 4.9,
            joined: "2017",
            verified: true
        }
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
        description: "Premium wireless headphones with active noise cancellation. 30-hour battery life and superior sound quality. Comfortable ear cushions for extended wear.",
        sizes: ["One Size"],
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800"
        ],
        designer: {
            name: "Thomas Anderson",
            brand: "AudioTech",
            avatar: "https://randomuser.me/api/portraits/men/15.jpg",
            bio: "Audio engineer and product designer with 15 years of experience.",
            location: "Berlin, Germany",
            email: "thomas@audiotech.com",
            followers: "78.9K",
            products: 12,
            rating: 4.8,
            joined: "2018",
            verified: true
        }
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
        description: "Eco-friendly premium yoga mat with excellent grip. Perfect for all types of yoga practice. Non-slip surface and extra cushioning for joint protection.",
        sizes: ["One Size"],
        images: [
            "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800",
            "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
            "https://images.unsplash.com/photo-1571736777860-dacc4a7ab6c8?w=800"
        ],
        designer: {
            name: "Michael Chang",
            brand: "ZenActive",
            avatar: "https://randomuser.me/api/portraits/men/62.jpg",
            bio: "Fitness enthusiast and product designer creating eco-friendly workout gear.",
            location: "San Francisco, CA",
            email: "michael@zenactive.com",
            followers: "42.1K",
            products: 9,
            rating: 4.7,
            joined: "2019",
            verified: false
        }
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
        description: "Educational wooden building blocks set for creative play. Safe non-toxic materials. Includes 100 pieces in various shapes and colors. Develops motor skills.",
        sizes: ["100 pieces"],
        images: [
            "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800",
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800",
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
        ],
        designer: {
            name: "Lisa Wong",
            brand: "Little Genius",
            avatar: "https://randomuser.me/api/portraits/women/89.jpg",
            bio: "Child development expert creating educational toys for young minds.",
            location: "Toronto, Canada",
            email: "lisa@littlegenius.com",
            followers: "56.8K",
            products: 31,
            rating: 4.9,
            joined: "2017",
            verified: true
        }
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
        description: "Beautiful coffee table book featuring stunning photography from around the world. Perfect for art and design enthusiasts. 200+ pages of high-quality images.",
        sizes: ["One Size"],
        images: [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800",
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800"
        ],
        designer: {
            name: "David Miller",
            brand: "ArtHouse Publishing",
            avatar: "https://randomuser.me/api/portraits/men/33.jpg",
            bio: "Publisher and curator specializing in art and photography books.",
            location: "London, UK",
            email: "david@arthouse.com",
            followers: "34.2K",
            products: 47,
            rating: 4.7,
            joined: "2014",
            verified: true
        }
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
        description: "Warm ribbed knit beanie for cold weather. Soft acrylic blend material. One size fits most with stretchable design.",
        sizes: ["One Size"],
        images: [
            "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800",
            "https://images.unsplash.com/photo-1584277261846-c6a1672ed73c?w=800",
            "https://images.unsplash.com/photo-1584277261846-c6a1672ed73c?w=800"
        ],
        designer: {
            name: "Nina Patel",
            brand: "Cozy Knits",
            avatar: "https://randomuser.me/api/portraits/women/23.jpg",
            bio: "Accessory designer creating stylish and functional winter wear.",
            location: "Chicago, IL",
            email: "nina@cozyknits.com",
            followers: "18.9K",
            products: 19,
            rating: 4.6,
            joined: "2021",
            verified: false
        }
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
        description: "Elegant automatic dress watch with sapphire crystal. Japanese movement and genuine leather strap. Water-resistant up to 50m.",
        sizes: ["One Size"],
        images: [
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
            "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800"
        ],
        designer: {
            name: "Hans Schmidt",
            brand: "Precision Timepieces",
            avatar: "https://randomuser.me/api/portraits/men/77.jpg",
            bio: "Master watchmaker with 20+ years of experience in luxury timepieces.",
            location: "Zurich, Switzerland",
            email: "hans@precisiontime.com",
            followers: "112K",
            products: 8,
            rating: 4.9,
            joined: "2012",
            verified: true
        }
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
        description: "Spacious leather tote bag perfect for work or travel. Durable construction with reinforced handles. Multiple interior pockets for organization.",
        sizes: ["One Size"],
        images: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
            "https://images.unsplash.com/photo-1591561954555-6074281d6f8c?w=800",
            "https://images.unsplash.com/photo-1591561954555-6074281d6f8c?w=800"
        ],
        designer: {
            name: "Olivia Bennett",
            brand: "Urban Leather Co.",
            avatar: "https://randomuser.me/api/portraits/women/47.jpg",
            bio: "Bag designer focusing on functional yet stylish everyday accessories.",
            location: "Melbourne, Australia",
            email: "olivia@urbanleather.com",
            followers: "51.3K",
            products: 26,
            rating: 4.8,
            joined: "2018",
            verified: true
        }
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
        description: "RGB mechanical gaming keyboard with customizable switches. Anti-ghosting and durable keycaps. Programmable macros and software support.",
        sizes: ["One Size"],
        images: [
            "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800",
            "https://images.unsplash.com/photo-1618384887929-16ec33d652e6?w=800",
            "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800"
        ],
        designer: {
            name: "Ryan Chen",
            brand: "GameMaster",
            avatar: "https://randomuser.me/api/portraits/men/52.jpg",
            bio: "Gaming peripheral designer and professional esports player.",
            location: "Seoul, South Korea",
            email: "ryan@gamemaster.com",
            followers: "234K",
            products: 14,
            rating: 4.8,
            joined: "2019",
            verified: true
        }
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
        description: "Stylish mid-century modern accent chair. Solid wood frame with comfortable upholstery. Perfect for living room or reading nook.",
        sizes: ["One Size"],
        images: [
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
            "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800",
            "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800"
        ],
        designer: {
            name: "Robert Taylor",
            brand: "Modern Heritage",
            avatar: "https://randomuser.me/api/portraits/men/28.jpg",
            bio: "Furniture designer blending mid-century aesthetics with modern comfort.",
            location: "Copenhagen, Denmark",
            email: "robert@modernheritage.com",
            followers: "67.8K",
            products: 21,
            rating: 4.7,
            joined: "2016",
            verified: true
        }
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
        description: "Premium cast iron Dutch oven for perfect cooking. Even heat distribution and durable enamel coating. Oven-safe up to 500°F.",
        sizes: ["5.5 Qt"],
        images: [
            "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800",
            "https://images.unsplash.com/photo-1584981691326-82ab5a86a4b3?w=800",
            "https://images.unsplash.com/photo-1584981691326-82ab5a86a4b3?w=800"
        ],
        designer: {
            name: "Maria Garcia",
            brand: "Chef's Collection",
            avatar: "https://randomuser.me/api/portraits/women/61.jpg",
            bio: "Professional chef and cookware designer with Michelin star experience.",
            location: "Barcelona, Spain",
            email: "maria@chefscollection.com",
            followers: "189K",
            products: 33,
            rating: 4.9,
            joined: "2015",
            verified: true
        }
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

const DesignerCard = ({ designer }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800">
            {/* Designer Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={designer.avatar}
                            alt={designer.name}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-700"
                        />
                        {designer.verified && (
                            <CheckCircle
                                size={20}
                                className="absolute -bottom-1 -right-1 text-blue-500 bg-black rounded-full"
                            />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{designer.name}</h3>
                            {designer.verified && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                    Verified
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400">{designer.brand}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={designer.rating} size="small" />
                            <span className="text-xs text-gray-400">({designer.rating})</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${isFollowing
                        ? "bg-gray-800 text-white border border-gray-700"
                        : "bg-white text-black hover:bg-gray-200"
                        }`}
                >
                    {isFollowing ? "Following" : "Follow"}
                </button>
            </div>

            {/* Designer Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-800">
                <div className="text-center">
                    <p className="text-xl font-bold">{designer.followers}</p>
                    <p className="text-xs text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold">{designer.products}</p>
                    <p className="text-xs text-gray-400">Products</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold">Since {designer.joined}</p>
                    <p className="text-xs text-gray-400">Member</p>
                </div>
            </div>

            {/* Designer Bio */}
            <div className="mb-4">
                <p className="text-sm text-gray-300 leading-relaxed">{designer.bio}</p>
            </div>

            {/* Designer Info */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={14} />
                    <span>{designer.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar size={14} />
                    <span>Joined {designer.joined}</span>
                </div>
            </div>

            {/* Contact Button */}
            <button className="w-full py-2 rounded-lg border border-gray-700 text-sm hover:border-gray-500 transition-all flex items-center justify-center gap-2">
                <MessageCircle size={16} />
                Contact Designer
            </button>
        </div>
    );
};

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
    }, [product]);

    if (!product) {
        return (
            <>
                <Header />
                <div className="bg-black text-white min-h-screen flex items-center justify-center px-4">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Product Not Found</h1>
                        <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-2 rounded-lg transition-all hover:opacity-90"
                            style={{ backgroundColor: COFFEE }}
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
        console.log("Added to cart:", { ...product, selectedSize, selectedColor, quantity });
        alert(`Added ${quantity} ${product.name} to cart!`);
    };

    const handleBuyNow = () => {
        console.log("Buy now:", { ...product, selectedSize, selectedColor, quantity });
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

    return (
        <>
            <Header />

            <div className="bg-black text-white min-h-screen">
                {/* MAIN CONTAINER */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Back and Share Buttons */}
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft size={20} />
                            <span className="text-sm">Back</span>
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors"
                            >
                                <Heart
                                    size={20}
                                    className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
                                />
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors"
                            >
                                <Share2 size={20} className="text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* LEFT: IMAGES */}
                        <div>
                            <div className="relative group">
                                <img
                                    src={selectedImage || product.image}
                                    alt={product.name}
                                    className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-2xl"
                                />
                                {!product.inStock && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl">
                                        <span className="text-white font-bold text-xl px-4 py-2 bg-red-600 rounded-lg">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                                    {product.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`${product.name} view ${i + 1}`}
                                            onClick={() => setSelectedImage(img)}
                                            className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg cursor-pointer transition-all ${selectedImage === img
                                                ? "border-2 border-white ring-2 ring-white"
                                                : "border border-gray-700 hover:border-gray-500"
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: DETAILS */}
                        <div className="flex flex-col gap-6">
                            {/* Title & Rating */}
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <StarRating rating={product.rating} />
                                    <span className="text-sm text-gray-400">
                                        {product.reviewCount} reviews
                                    </span>
                                    <span className="text-gray-600">•</span>
                                    <span className="text-sm text-green-500">{product.category}</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-2xl sm:text-3xl font-bold">
                                    ${product.price}
                                </span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-gray-500 line-through text-lg">
                                            ${product.originalPrice}
                                        </span>
                                        <span className="text-green-500 text-sm font-semibold bg-green-500/10 px-2 py-1 rounded">
                                            Save ${(product.originalPrice - product.price).toFixed(2)}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3">Color</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 rounded-lg border transition-all ${selectedColor === color
                                                    ? "border-white bg-white text-black"
                                                    : "border-gray-600 text-white hover:border-gray-400"
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
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold">Size</h3>
                                        <button onClick={() => setIsSizeOpen(true)} className="text-sm text-gray-400 hover:text-white">
                                            Size Guide
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-lg border transition-all ${selectedSize === size
                                                    ? "border-white bg-white text-black"
                                                    : "border-gray-600 text-white hover:border-gray-400"
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
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span className="text-sm text-green-500">In Stock</span>
                                        <span className="text-xs text-gray-500">
                                            • {Math.floor(Math.random() * 50) + 10} units available
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm text-red-500">Out of Stock</span>
                                    </>
                                )}
                            </div>

                            {/* Quantity */}
                            {product.inStock && (
                                <div>
                                    <h3 className="font-semibold mb-3">Quantity</h3>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg border border-gray-600 hover:border-gray-400 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg font-semibold min-w-[40px] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 rounded-lg border border-gray-600 hover:border-gray-400 transition-colors"
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
                                    className="flex-1 py-3 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                                    style={{ backgroundColor: COFFEE }}
                                    disabled={!product.inStock}
                                >
                                    <ShoppingBag size={18} />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 py-3 rounded-xl font-semibold border border-white hover:bg-white hover:text-black transition-all"
                                    disabled={!product.inStock}
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Delivery Info */}
                            <div className="bg-gradient-to-r from-gray-900 to-black p-4 rounded-xl space-y-3 border border-gray-800">
                                <div className="flex items-center gap-3">
                                    <Truck size={20} className="text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">Free Delivery</p>
                                        <p className="text-xs text-gray-400">
                                            Enter your pincode for delivery date
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RotateCcw size={20} className="text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">30 Days Return</p>
                                        <p className="text-xs text-gray-400">
                                            Easy returns and exchanges
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={20} className="text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">1 Year Warranty</p>
                                        <p className="text-xs text-gray-400">
                                            Genuine product warranty
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABS SECTION */}
                    <div className="mt-12">
                        <div className="flex gap-6 border-b border-gray-800 mb-6 overflow-x-auto">
                            {["designer", "details", "reviews"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 px-1 text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab
                                        ? "text-white border-b-2 border-white"
                                        : "text-gray-400 hover:text-gray-300"
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
                                        <h3 className="font-semibold mb-3 text-lg">Description</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            {showFullDescription
                                                ? product.description
                                                : `${product.description.substring(0, 200)}...`}
                                        </p>
                                        {product.description.length > 200 && (
                                            <button
                                                onClick={() => setShowFullDescription(!showFullDescription)}
                                                className="text-sm text-gray-400 hover:text-white mt-2"
                                            >
                                                {showFullDescription ? "Show Less" : "Read More"}
                                            </button>
                                        )}
                                    </div>

                                    {product.tags && product.tags.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {product.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="font-semibold mb-3">Product Specifications</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-gray-900/50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-400">Category</p>
                                                <p className="text-sm font-medium">{product.category}</p>
                                            </div>
                                            <div className="bg-gray-900/50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-400">Subcategory</p>
                                                <p className="text-sm font-medium">{product.subcategory}</p>
                                            </div>
                                            <div className="bg-gray-900/50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-400">Material</p>
                                                <p className="text-sm font-medium">Premium Quality</p>
                                            </div>
                                            <div className="bg-gray-900/50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-400">Care Instructions</p>
                                                <p className="text-sm font-medium">Machine Washable</p>
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
                                                <span className="text-3xl font-bold">{product.rating}</span>
                                                <StarRating rating={product.rating} />
                                            </div>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Based on {product.reviewCount} reviews
                                            </p>
                                        </div>
                                        <button className="px-4 py-2 rounded-lg border border-gray-700 text-sm hover:border-gray-500">
                                            Write a Review
                                        </button>
                                    </div>

                                    {/* Sample Reviews */}
                                    {[1, 2, 3].map((review) => (
                                        <div key={review} className="border-t border-gray-800 pt-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <img
                                                    src={`https://randomuser.me/api/portraits/${review % 2 === 0 ? "women" : "men"}/${review + 20}.jpg`}
                                                    className="w-10 h-10 rounded-full"
                                                    alt="Reviewer"
                                                />
                                                <div>
                                                    <p className="font-medium text-sm">User {review}</p>
                                                    <StarRating rating={4 + (review % 1)} size="small" />
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-300">
                                                Great product! Exactly as described. The quality is amazing and delivery was fast.
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">2 days ago</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RELATED PRODUCTS */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-xl sm:text-2xl font-bold mb-6">
                                You May Also Like
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <div
                                        key={relatedProduct.id}
                                        onClick={() => navigate(`/product/${encodeURIComponent(relatedProduct.name)}`)}
                                        className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-3 cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
                                    >
                                        <img
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            className="w-full h-40 sm:h-48 object-cover rounded-lg"
                                        />
                                        <div className="mt-3">
                                            <p className="text-sm font-semibold line-clamp-2">
                                                {relatedProduct.name}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {relatedProduct.category}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm font-bold">${relatedProduct.price}</p>
                                                {relatedProduct.originalPrice && (
                                                    <p className="text-xs text-gray-500 line-through">
                                                        ${relatedProduct.originalPrice}
                                                    </p>
                                                )}
                                            </div>
                                            <StarRating rating={relatedProduct.rating} size="small" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <SizeGuideModal
                isOpen={isSizeOpen}
                onClose={() => setIsSizeOpen(false)}
            />
        </>
    );
}