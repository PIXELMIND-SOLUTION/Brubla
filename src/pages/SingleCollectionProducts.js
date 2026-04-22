import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";

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
    
    .product-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
    }
    
    @media (min-width: 480px) {
      .product-grid {
        gap: 1.25rem;
      }
    }
    
    @media (min-width: 640px) {
      .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
    }
    
    @media (min-width: 1024px) {
      .product-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (min-width: 1280px) {
      .product-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    @media (max-width: 640px) {
      button, .cursor-pointer {
        -webkit-tap-highlight-color: transparent;
      }
    }
  `}</style>
);

// Product Data for Each Collection
const COLLECTION_PRODUCTS = {
  1: {
    id: 1,
    title: "Global Collections",
    subtitle: "WORLD-CLASS CRAFTMANSHIP",
    description: "Discover world-class craftsmanship inspired by fashion capitals — Paris, Milan, Tokyo, and New York. Each piece tells a story of global elegance.",
    bgImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
    products: [
      {
        id: 1,
        name: "Italian Leather Jacket",
        brand: "Brubla Global",
        price: 12999,
        originalPrice: 24999,
        discount: 48,
        rating: 4.9,
        reviews: 234,
        badge: "LIMITED",
        isNew: true,
        img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1548624313-0396c75e4a63?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1a1a", "#8B4513", "#2F4F4F"],
        sizes: ["XS", "S", "M", "L", "XL"],
      },
      {
        id: 2,
        name: "Parisian Linen Blazer",
        brand: "Brubla Global",
        price: 8999,
        originalPrice: 15999,
        discount: 44,
        rating: 4.8,
        reviews: 189,
        badge: "BESTSELLER",
        isNew: false,
        img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#F5F0E8", "#1a1812", "#C9A96E"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 3,
        name: "Tokyo Streetwear Hoodie",
        brand: "Brubla Global",
        price: 3499,
        originalPrice: 6999,
        discount: 50,
        rating: 4.7,
        reviews: 567,
        badge: "TRENDING",
        isNew: true,
        img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1578768079046-ec1c1fb79c84?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#2d2d2d", "#8B0000", "#2E8B57"],
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
      {
        id: 4,
        name: "New York Tailored Trousers",
        brand: "Brubla Global",
        price: 4999,
        originalPrice: 8999,
        discount: 44,
        rating: 4.8,
        reviews: 312,
        badge: "PREMIUM",
        isNew: false,
        img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1812", "#2F4F4F", "#8B4513"],
        sizes: ["28", "30", "32", "34", "36"],
      },
      {
        id: 5,
        name: "London Checkered Coat",
        brand: "Brubla Global",
        price: 11999,
        originalPrice: 19999,
        discount: 40,
        rating: 4.9,
        reviews: 178,
        badge: "EXCLUSIVE",
        isNew: true,
        img: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1548624313-0396c75e4a63?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#696969", "#1a1812", "#8B4513"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 6,
        name: "Milan Silk Scarf",
        brand: "Brubla Global",
        price: 2499,
        originalPrice: 4499,
        discount: 44,
        rating: 4.8,
        reviews: 892,
        badge: "LOVED",
        isNew: false,
        img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#8B0000", "#2E8B57"],
        sizes: ["One Size"],
      },
      {
        id: 7,
        name: "Berlin Minimalist Bag",
        brand: "Brubla Global",
        price: 6999,
        originalPrice: 12999,
        discount: 46,
        rating: 4.7,
        reviews: 234,
        badge: "NEW",
        isNew: true,
        img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1812", "#C9A96E"],
        sizes: ["One Size"],
      },
      {
        id: 8,
        name: "Barcelona Linen Shirt",
        brand: "Brubla Global",
        price: 3999,
        originalPrice: 7999,
        discount: 50,
        rating: 4.9,
        reviews: 456,
        badge: "SUMMER",
        isNew: false,
        img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#F5F0E8", "#C9A96E", "#1a1812"],
        sizes: ["S", "M", "L", "XL"],
      },
    ],
  },
  2: {
    id: 2,
    title: "Luxury Collections",
    subtitle: "BESPOKE ELEGANCE",
    description: "Experience the pinnacle of couture with hand-embroidered gowns, cashmere coats, and diamond-embellished accessories.",
    bgImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&q=80",
    products: [
      {
        id: 1,
        name: "Hand-Embroidered Gown",
        brand: "Brubla Atelier",
        price: 45999,
        originalPrice: 89999,
        discount: 49,
        rating: 5.0,
        reviews: 89,
        badge: "COUTURE",
        isNew: true,
        img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1812", "#C9A96E", "#8B0000"],
        sizes: ["XS", "S", "M", "L"],
      },
      {
        id: 2,
        name: "Cashmere Wrap Coat",
        brand: "Brubla Atelier",
        price: 32999,
        originalPrice: 59999,
        discount: 45,
        rating: 4.9,
        reviews: 67,
        badge: "LIMITED",
        isNew: false,
        img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#F5F0E8", "#1a1812", "#8B4513"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 3,
        name: "Diamond-Embellished Clutch",
        brand: "Brubla Atelier",
        price: 18999,
        originalPrice: 34999,
        discount: 46,
        rating: 4.9,
        reviews: 123,
        badge: "BESPOKE",
        isNew: true,
        img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#1a1812"],
        sizes: ["One Size"],
      },
      {
        id: 4,
        name: "Silk Evening Gown",
        brand: "Brubla Atelier",
        price: 39999,
        originalPrice: 74999,
        discount: 47,
        rating: 5.0,
        reviews: 56,
        badge: "RUNWAY",
        isNew: true,
        img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1812", "#8B0000", "#2E8B57"],
        sizes: ["XS", "S", "M", "L"],
      },
      {
        id: 5,
        name: "Pearl Necklace Set",
        brand: "Brubla Atelier",
        price: 24999,
        originalPrice: 45999,
        discount: 46,
        rating: 4.9,
        reviews: 234,
        badge: "HEIRLOOM",
        isNew: false,
        img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#F5F0E8"],
        sizes: ["One Size"],
      },
      {
        id: 6,
        name: "Velvet Tuxedo Blazer",
        brand: "Brubla Atelier",
        price: 27999,
        originalPrice: 49999,
        discount: 44,
        rating: 4.8,
        reviews: 89,
        badge: "PREMIUM",
        isNew: false,
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1812", "#8B0000", "#2F4F4F"],
        sizes: ["S", "M", "L", "XL"],
      },
    ],
  },
  3: {
    id: 3,
    title: "Originals by Brubla",
    subtitle: "SIGNATURE STYLE",
    description: "Our signature collection that embodies the essence of modern luxury. Timeless pieces crafted for the discerning individual.",
    bgImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80",
    products: [
      {
        id: 1,
        name: "Signature Kurta Set",
        brand: "Originals by Brubla",
        price: 4999,
        originalPrice: 9999,
        discount: 50,
        rating: 4.9,
        reviews: 1234,
        badge: "ICONIC",
        isNew: false,
        img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#1a1812", "#F5F0E8"],
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
      {
        id: 2,
        name: "Handblock Print Saree",
        brand: "Originals by Brubla",
        price: 8999,
        originalPrice: 16999,
        discount: 47,
        rating: 4.8,
        reviews: 892,
        badge: "ARTISAN",
        isNew: true,
        img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#8B0000", "#C9A96E", "#1a1812"],
        sizes: ["Free Size"],
      },
      {
        id: 3,
        name: "Brubla Classic Shirt",
        brand: "Originals by Brubla",
        price: 2499,
        originalPrice: 4999,
        discount: 50,
        rating: 4.7,
        reviews: 2156,
        badge: "BESTSELLER",
        isNew: false,
        img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#F5F0E8", "#1a1812", "#2F4F4F"],
        sizes: ["XS", "S", "M", "L", "XL"],
      },
      {
        id: 4,
        name: "Embroidered Waistcoat",
        brand: "Originals by Brubla",
        price: 5999,
        originalPrice: 10999,
        discount: 45,
        rating: 4.9,
        reviews: 445,
        badge: "HERITAGE",
        isNew: true,
        img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#1a1812", "#8B4513"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 5,
        name: "Dupatta Set",
        brand: "Originals by Brubla",
        price: 3499,
        originalPrice: 6999,
        discount: 50,
        rating: 4.8,
        reviews: 678,
        badge: "TRENDING",
        isNew: false,
        img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1583391733956-3750e0b4e1cf?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#8B0000", "#2E8B57"],
        sizes: ["Free Size"],
      },
      {
        id: 6,
        name: "Brubla Bomber Jacket",
        brand: "Originals by Brubla",
        price: 4499,
        originalPrice: 8499,
        discount: 47,
        rating: 4.8,
        reviews: 1234,
        badge: "LIMITED",
        isNew: true,
        img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1578768079046-ec1c1fb79c84?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1812", "#2F4F4F", "#8B4513"],
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },
  4: {
    id: 4,
    title: "Indian Roots",
    subtitle: "TIMELESS TRADITIONS",
    description: "Celebrate timeless traditions with our curated ethnic wear. From Banarasi silk to handwoven khadi, embrace your heritage in style.",
    bgImage: "https://images.unsplash.com/photo-1535043883686-1eade1b1a0f8?w=1600&q=80",
    products: [
      {
        id: 1,
        name: "Banarasi Silk Saree",
        brand: "Indian Roots",
        price: 15999,
        originalPrice: 29999,
        discount: 47,
        rating: 4.9,
        reviews: 2341,
        badge: "HERITAGE",
        isNew: false,
        img: "https://images.unsplash.com/photo-1583391733956-3750e0b4e1cf?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#8B0000", "#1a1812"],
        sizes: ["Free Size"],
      },
      {
        id: 2,
        name: "Handwoven Khadi Kurta",
        brand: "Indian Roots",
        price: 3499,
        originalPrice: 6999,
        discount: 50,
        rating: 4.8,
        reviews: 1876,
        badge: "KHADI",
        isNew: false,
        img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#F5F0E8", "#1a1812", "#C9A96E"],
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
      {
        id: 3,
        name: "Phulkari Dupatta",
        brand: "Indian Roots",
        price: 2499,
        originalPrice: 4999,
        discount: 50,
        rating: 4.9,
        reviews: 3456,
        badge: "HANDCRAFTED",
        isNew: true,
        img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1583391733956-3750e0b4e1cf?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#8B0000", "#2E8B57"],
        sizes: ["One Size"],
      },
      {
        id: 4,
        name: "Bandhani Lehenga",
        brand: "Indian Roots",
        price: 12999,
        originalPrice: 24999,
        discount: 48,
        rating: 4.9,
        reviews: 1234,
        badge: "TRADITIONAL",
        isNew: true,
        img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#8B0000", "#C9A96E", "#1a1812"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 5,
        name: "Pashmina Shawl",
        brand: "Indian Roots",
        price: 8999,
        originalPrice: 16999,
        discount: 47,
        rating: 4.9,
        reviews: 2345,
        badge: "CASHMERE",
        isNew: false,
        img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#F5F0E8", "#1a1812"],
        sizes: ["One Size"],
      },
      {
        id: 6,
        name: "Jutti Footwear",
        brand: "Indian Roots",
        price: 1999,
        originalPrice: 3999,
        discount: 50,
        rating: 4.8,
        reviews: 4567,
        badge: "ARTISAN",
        isNew: false,
        img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#8B0000", "#1a1812"],
        sizes: ["5", "6", "7", "8", "9"],
      },
    ],
  },
  5: {
    id: 5,
    title: "Weddings & Celebrations",
    subtitle: "YOUR SPECIAL DAY",
    description: "Make your special day unforgettable with our exquisite wedding collection. From bridal lehengas to groom sherwanis.",
    bgImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
    products: [
      {
        id: 1,
        name: "Bridal Lehenga Set",
        brand: "Brubla Weddings",
        price: 45999,
        originalPrice: 89999,
        discount: 49,
        rating: 5.0,
        reviews: 456,
        badge: "BRIDAL",
        isNew: true,
        img: "https://images.unsplash.com/photo-1583391733956-3750e0b4e1cf?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#8B0000", "#C9A96E", "#1a1812"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 2,
        name: "Groom Sherwani",
        brand: "Brubla Weddings",
        price: 34999,
        originalPrice: 64999,
        discount: 46,
        rating: 4.9,
        reviews: 234,
        badge: "GROOM",
        isNew: false,
        img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#1a1812", "#8B4513"],
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
      {
        id: 3,
        name: "Bridesmaid Saree",
        brand: "Brubla Weddings",
        price: 12999,
        originalPrice: 24999,
        discount: 48,
        rating: 4.8,
        reviews: 567,
        badge: "WEDDING",
        isNew: true,
        img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#8B0000", "#2E8B57"],
        sizes: ["Free Size"],
      },
      {
        id: 4,
        name: "Celebration Gown",
        brand: "Brubla Weddings",
        price: 19999,
        originalPrice: 38999,
        discount: 49,
        rating: 4.9,
        reviews: 345,
        badge: "PARTY",
        isNew: true,
        img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1812", "#C9A96E", "#8B0000"],
        sizes: ["XS", "S", "M", "L"],
      },
      {
        id: 5,
        name: "Wedding Accessory Set",
        brand: "Brubla Weddings",
        price: 5999,
        originalPrice: 11999,
        discount: 50,
        rating: 4.8,
        reviews: 1234,
        badge: "ACCESSORIES",
        isNew: false,
        img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E", "#F5F0E8"],
        sizes: ["One Size"],
      },
      {
        id: 6,
        name: "Reception Blazer",
        brand: "Brubla Weddings",
        price: 15999,
        originalPrice: 29999,
        discount: 47,
        rating: 4.9,
        reviews: 234,
        badge: "RECEPTION",
        isNew: false,
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1812", "#2F4F4F", "#8B4513"],
        sizes: ["S", "M", "L", "XL"],
      },
    ],
  },
  6: {
    id: 6,
    title: "Street Style Edit",
    subtitle: "URBAN ESSENTIALS",
    description: "Elevate your everyday look with our curated streetwear collection. Casual, cool, and effortlessly stylish.",
    bgImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80",
    products: [
      {
        id: 1,
        name: "Oversized Graphic Tee",
        brand: "Street Edit",
        price: 1899,
        originalPrice: 3999,
        discount: 52,
        rating: 4.7,
        reviews: 2345,
        badge: "TRENDING",
        isNew: true,
        img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1812", "#F5F0E8", "#8B0000"],
        sizes: ["S", "M", "L", "XL", "XXL"],
      },
      {
        id: 2,
        name: "Cargo Pants",
        brand: "Street Edit",
        price: 2999,
        originalPrice: 5999,
        discount: 50,
        rating: 4.8,
        reviews: 1876,
        badge: "BESTSELLER",
        isNew: false,
        img: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#2F4F4F", "#1a1812", "#8B4513"],
        sizes: ["28", "30", "32", "34", "36"],
      },
      {
        id: 3,
        name: "Denim Jacket",
        brand: "Street Edit",
        price: 4499,
        originalPrice: 8999,
        discount: 50,
        rating: 4.9,
        reviews: 3456,
        badge: "ICONIC",
        isNew: false,
        img: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1812", "#2F4F4F"],
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 4,
        name: "Sneakers",
        brand: "Street Edit",
        price: 5999,
        originalPrice: 11999,
        discount: 50,
        rating: 4.8,
        reviews: 4567,
        badge: "LIMITED",
        isNew: true,
        img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#F5F0E8", "#1a1812"],
        sizes: ["6", "7", "8", "9", "10"],
      },
    ],
  },
  7: {
    id: 7,
    title: "Sustainable Fashion",
    subtitle: "ECO-CONSCIOUS",
    description: "Fashion that cares for the planet. Ethically sourced, sustainably produced, beautifully crafted.",
    bgImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&q=80",
    products: [
      {
        id: 1,
        name: "Organic Cotton Dress",
        brand: "Sustainable",
        price: 3999,
        originalPrice: 7999,
        discount: 50,
        rating: 4.9,
        reviews: 1234,
        badge: "ECO",
        isNew: true,
        img: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#F5F0E8", "#2E8B57", "#C9A96E"],
        sizes: ["XS", "S", "M", "L"],
      },
      {
        id: 2,
        name: "Hemp Tote Bag",
        brand: "Sustainable",
        price: 1499,
        originalPrice: 2999,
        discount: 50,
        rating: 4.8,
        reviews: 2345,
        badge: "ZERO WASTE",
        isNew: false,
        img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#8B4513", "#F5F0E8"],
        sizes: ["One Size"],
      },
    ],
  },
  8: {
    id: 8,
    title: "Accessories Edit",
    subtitle: "PERFECT FINISHING",
    description: "Complete your look with our curated accessories. Bags, jewelry, scarves, and more.",
    bgImage: "https://images.unsplash.com/photo-1602173574767-37d01966c6a3?w=1600&q=80",
    products: [
      {
        id: 1,
        name: "Leather Handbag",
        brand: "Accessories Edit",
        price: 7999,
        originalPrice: 15999,
        discount: 50,
        rating: 4.9,
        reviews: 3456,
        badge: "LUXURY",
        isNew: true,
        img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#1a1812", "#C9A96E", "#8B4513"],
        sizes: ["One Size"],
      },
      {
        id: 2,
        name: "Gold Plated Necklace",
        brand: "Accessories Edit",
        price: 2999,
        originalPrice: 5999,
        discount: 50,
        rating: 4.8,
        reviews: 4567,
        badge: "TRENDING",
        isNew: false,
        img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop&q=80&auto=format",
        hoverImg: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop&q=80&auto=format",
        colors: ["#C9A96E"],
        sizes: ["One Size"],
      },
    ],
  },
};

// Star Rating Component
const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const empty = 5 - Math.ceil(rating);
  
  return (
    <div className="flex items-center gap-0.5" style={{ color: COFFEE }}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {hasHalf && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <defs>
            <linearGradient id="halfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGrad)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ onClick, product, index }) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWish] = useState(false);
  const [addedCart, setCart] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  const navigate = useNavigate();

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

  const handleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCart(true);
    setTimeout(() => setCart(false), 1800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWish(!wishlisted);
  };

  return (
    <div
      ref={ref}
      className="group cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={product.img}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-500"
            style={{
              opacity: hovered ? 0 : 1,
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
            loading="lazy"
          />
          <img
            src={product.hoverImg}
            alt={`${product.name} hover`}
            className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-500"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(1.05)",
            }}
            loading="lazy"
          />

          {/* Badge */}
          <div className="absolute top-2 left-2 z-10">
            <span
              className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 sm:px-2 sm:py-1 bg-black text-white rounded"
            >
              {product.badge}
            </span>
          </div>

          {/* Discount */}
          <div className="absolute top-2 right-2 z-10">
            <span
              className="text-[8px] sm:text-[9px] font-black px-1 py-0.5 sm:px-1.5 sm:py-0.5 bg-coffee text-white rounded"
              style={{ backgroundColor: COFFEE }}
            >
              {product.discount}% OFF
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute z-20 flex items-center justify-center transition-all duration-300 rounded-full bg-white shadow-md"
            style={{
              top: hovered ? "8px" : "6px",
              right: "6px",
              width: "28px",
              height: "28px",
              color: wishlisted ? "#e85d4a" : "#0C0C0C",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
              <path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z" />
            </svg>
          </button>

          {/* Quick View */}
          <button
            className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-1.5 transition-all duration-300 bg-black/85 text-white"
            style={{
              height: "34px",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              transform: hovered ? "translateY(0)" : "translateY(100%)",
            }}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            QUICK VIEW
          </button>
        </div>

        {/* Product Info */}
        <div className="p-2.5 sm:p-3">
          <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider mb-0.5 text-gray-500">
            {product.brand}
          </p>
          <h3 className="font-bold text-gray-800 text-xs sm:text-sm mb-1 line-clamp-1">{product.name}</h3>
          
          <div className="flex items-center justify-between mt-1.5 sm:mt-2">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <StarRating rating={product.rating} />
              <span className="text-[8px] sm:text-[9px] font-semibold text-gray-500">({product.reviews})</span>
            </div>
            <button
              onClick={handleCart}
              className="flex items-center justify-center transition-all duration-300 active:scale-95 rounded-lg"
              style={{
                width: "28px",
                height: "28px",
                background: addedCart ? "#6fcf97" : "#000",
                color: "#fff",
              }}
            >
              {addedCart ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
            <span className="font-black text-gray-900 text-sm sm:text-base">₹{product.price.toLocaleString()}</span>
            <span className="text-[9px] sm:text-[10px] line-through text-gray-400">₹{product.originalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Sidebar Component (Mobile Drawer)
const MobileFilterDrawer = ({ filters, onFilterChange, onClose, isOpen }) => {
  const [priceRange, setPriceRange] = useState([filters.priceRange[0], filters.priceRange[1]]);
  const [selectedSizes, setSelectedSizes] = useState(filters.sizes);
  const [sortBy, setSortBy] = useState(filters.sortBy);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "One Size", "Free Size"];
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
    { value: "newest", label: "Newest First" },
  ];

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const applyFilters = () => {
    onFilterChange({ priceRange, sizes: selectedSizes, sortBy });
    onClose();
  };

  const resetFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedSizes([]);
    setSortBy("featured");
    onFilterChange({ priceRange: [0, 50000], sizes: [], sortBy: "featured" });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}
      
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transition-transform duration-300 lg:hidden
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        <div className="p-4 sm:p-5 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sort By */}
          <div className="mb-5">
            <h4 className="font-semibold text-gray-800 text-sm mb-2.5">Sort By</h4>
            <div className="space-y-1.5">
              {sortOptions.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sortBy === option.value}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-3.5 h-3.5"
                    style={{ accentColor: COFFEE }}
                  />
                  <span className="text-sm text-gray-600">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-5">
            <h4 className="font-semibold text-gray-800 text-sm mb-2.5">Price Range</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-coffee"
                placeholder="Min"
                style={{ borderColor: priceRange[0] ? COFFEE : undefined }}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-coffee"
                placeholder="Max"
                style={{ borderColor: priceRange[1] < 50000 ? COFFEE : undefined }}
              />
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-5">
            <h4 className="font-semibold text-gray-800 text-sm mb-2.5">Size</h4>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`px-2 py-1 text-[11px] rounded-md transition-all ${
                    selectedSizes.includes(size)
                      ? "text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={selectedSizes.includes(size) ? { backgroundColor: COFFEE } : {}}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="flex-1 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 py-2 text-sm font-medium text-white rounded-lg transition-colors bg-black hover:bg-gray-800"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Desktop Filter Sidebar Component
const DesktopFilterSidebar = ({ filters, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([filters.priceRange[0], filters.priceRange[1]]);
  const [selectedSizes, setSelectedSizes] = useState(filters.sizes);
  const [sortBy, setSortBy] = useState(filters.sortBy);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "One Size", "Free Size"];
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
    { value: "newest", label: "Newest First" },
  ];

  const handleSizeToggle = (size) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizes);
    onFilterChange({ priceRange, sizes: newSizes, sortBy });
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    onFilterChange({ priceRange: newRange, sizes: selectedSizes, sortBy });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    onFilterChange({ priceRange, sizes: selectedSizes, sortBy: newSort });
  };

  const resetFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedSizes([]);
    setSortBy("featured");
    onFilterChange({ priceRange: [0, 50000], sizes: [], sortBy: "featured" });
  };

  return (
    <div className="w-64 flex-shrink-0">
      <div className="sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-base">Filters</h3>
          <button
            onClick={resetFilters}
            className="text-xs text-gray-500 hover:text-coffee transition-colors"
            style={{ color: COFFEE }}
          >
            Reset all
          </button>
        </div>

        {/* Sort By */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-700 text-sm mb-3">Sort By</h4>
          <div className="space-y-2">
            {sortOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sort-desktop"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-3.5 h-3.5"
                  style={{ accentColor: COFFEE }}
                />
                <span className="text-sm text-gray-600">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-700 text-sm mb-3">Price Range</h4>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange([Number(e.target.value), priceRange[1]])}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-coffee"
              placeholder="Min"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange([priceRange[0], Number(e.target.value)])}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-coffee"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 text-sm mb-3">Size</h4>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-2 py-1 text-[11px] rounded-md transition-all ${
                  selectedSizes.includes(size)
                    ? "text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={selectedSizes.includes(size) ? { backgroundColor: COFFEE } : {}}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function SingleCollectionProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    sizes: [],
    sortBy: "featured"
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCollection = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const collectionData = COLLECTION_PRODUCTS[id];
      if (collectionData) {
        setCollection(collectionData);
        setFilteredProducts(collectionData.products);
      } else {
        navigate("/collections");
      }
      setLoading(false);
    };
    loadCollection();
  }, [id, navigate]);

  // Apply filters and search
  useEffect(() => {
    if (!collection) return;

    let products = [...collection.products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      );
    }

    // Price filter
    products = products.filter(p =>
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Size filter
    if (filters.sizes.length > 0) {
      products = products.filter(p =>
        p.sizes.some(size => filters.sizes.includes(size))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        products.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(products);
  }, [collection, searchQuery, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({ priceRange: [0, 50000], sizes: [], sortBy: "featured" });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-10 h-10 rounded-full border-2 border-coffee border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: `${COFFEE} transparent ${COFFEE} transparent` }} />
            <p className="text-gray-500 fs text-sm">Loading products...</p>
          </div>
        </div>
      </>
    );
  }

  if (!collection) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <Styles />

        {/* Hero Section with Background Image */}
        <div 
          className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(${collection.bgImage})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <button
              onClick={() => navigate("/collections")}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors mb-5 sm:mb-6 text-xs sm:text-sm group"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back to Collections
            </button>

            <div className="text-center">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-coffee mb-2" style={{ color: COFFEE }}>
                {collection.subtitle}
              </p>
              <h1 
                className="fd font-black text-white px-2"
                style={{ fontSize: "clamp(28px, 8vw, 52px)" }}
              >
                {collection.title}
              </h1>
              <p className="text-white/90 fs text-xs sm:text-sm max-w-2xl mx-auto mt-3 px-4">
                {collection.description}
              </p>
              <div className="flex justify-center gap-6 mt-5 sm:mt-6">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-coffee" style={{ color: COFFEE }}>{collection.products.length}</p>
                  <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wide text-white/70">Products</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-coffee/30 to-transparent" />
        </div>

        {/* Products Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative w-full sm:w-72 md:w-80">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:border-coffee focus:outline-none transition-colors"
                style={{ borderColor: searchQuery ? COFFEE : undefined }}
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:border-coffee transition-colors lg:hidden flex-1 sm:flex-none"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 4h16v2.172a2 2 0 01-.586 1.414L15 12v7l-6 2v-9L4.586 7.586A2 2 0 014 6.172V4z" />
                </svg>
                Filters
                {(filters.sizes.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full text-white" style={{ backgroundColor: COFFEE }}>
                    {filters.sizes.length + (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000 ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Desktop Sidebar */}
            <DesktopFilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 sm:py-16 bg-white rounded-2xl">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" className="sm:w-8 sm:h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1">No products found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your filters or search term</p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-5 py-2 text-sm font-medium rounded-lg transition-colors border border-coffee text-coffee hover:bg-coffee/10"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs sm:text-sm text-gray-500">Showing {filteredProducts.length} products</p>
                    {(searchQuery || filters.sizes.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-coffee hover:underline"
                        style={{ color: COFFEE }}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="product-grid">
                    {filteredProducts.map((product, idx) => (
                      <ProductCard key={product.id} onClick={()=>navigate(`/product/${product.id}`)} product={product} index={idx} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer - Only visible on mobile */}
        <MobileFilterDrawer
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setIsFilterOpen(false)}
          isOpen={isFilterOpen}
        />
      </div>
    </>
  );
}