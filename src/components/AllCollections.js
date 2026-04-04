import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DATA FOR EACH COLLECTION
// ─────────────────────────────────────────────────────────────────────────────

// Global Collections - International inspired fashion
const GLOBAL_COLLECTION = [
  {
    id: 1,
    name: "Italian Leather Jacket",
    brand: "Brubla Global",
    price: 12999,
    originalPrice: 24999,
    discount: 48,
    rating: 4.9,
    reviews: 234,
    badge: "LIMITED EDITION",
    badgeColor: "#C9A96E",
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#6fcf97",
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#E8C97A",
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
    badgeColor: "#6fcf97",
    isNew: false,
    img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#C9A96E", "#8B0000", "#2E8B57"],
    sizes: ["One Size"],
  },
];

// Luxury Collections - Premium high-end pieces
const LUXURY_COLLECTION = [
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#E8C97A",
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#E8C97A",
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#E8C97A",
    isNew: false,
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#1a1812", "#8B0000", "#2F4F4F"],
    sizes: ["S", "M", "L", "XL"],
  },
];

// Originals by Brubla - Signature brand collection
const ORIGINALS_COLLECTION = [
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#E8C97A",
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
    badgeColor: "#6fcf97",
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#6fcf97",
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
    badgeColor: "#E8C97A",
    isNew: true,
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1578768079046-ec1c1fb79c84?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#1a1812", "#2F4F4F", "#8B4513"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
];

// Indian Roots - Traditional & ethnic wear
const INDIAN_ROOTS = [
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#6fcf97",
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#E8C97A",
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#6fcf97",
    isNew: false,
    img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#C9A96E", "#8B0000", "#1a1812"],
    sizes: ["5", "6", "7", "8", "9"],
  },
];

// Weddings & Celebrations - Special occasion wear
const WEDDING_COLLECTION = [
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#E8C97A",
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
    badgeColor: "#6fcf97",
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
    badgeColor: "#C9A96E",
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
    badgeColor: "#E8C97A",
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
    badgeColor: "#C9A96E",
    isNew: false,
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop&q=80&auto=format",
    hoverImg: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop&q=80&auto=format",
    colors: ["#1a1812", "#2F4F4F", "#8B4513"],
    sizes: ["S", "M", "L", "XL"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ICONS (Reused from original)
// ─────────────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364 4.318 12.682a4.5 4.5 0 010-6.364z" />
  </svg>
);

const StarIcon = ({ filled = true, size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CartAddIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
    <line x1="12" y1="13" x2="12" y2="19" />
    <line x1="9" y1="16" x2="15" y2="16" />
  </svg>
);

const ChevronIcon = ({ dir = "right", size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    {dir === "right" ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
  </svg>
);

const EyeIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const empty = 5 - Math.ceil(rating);
  return (
    <div className="flex items-center gap-0.5" style={{ color: "#C9A96E" }}>
      {Array.from({ length: full }).map((_, i) => <StarIcon key={`f${i}`} filled />)}
      {rating % 1 !== 0 && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <defs>
            <linearGradient id={`hg${full}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill={`url(#hg${full})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => <StarIcon key={`e${i}`} filled={false} />)}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD (Reusable component)
// ─────────────────────────────────────────────────────────────────────────────
const ProductCard = ({ product, index }) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWish] = useState(false);
  const [addedCart, setCart] = useState(false);
  const [selColor, setColor] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleCart = (e) => {
    e.preventDefault();
    setCart(true);
    setTimeout(() => setCart(false), 1800);
  };

  return (
    <div
      ref={ref}
      className="flex-shrink-0 group cursor-pointer"
      style={{
        width: "clamp(180px,38vw,230px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── IMAGE BLOCK ── */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "3/4",
          boxShadow: hovered
            ? "0 20px 50px rgba(12,12,12,0.18), 0 6px 20px rgba(12,12,12,0.10)"
            : "0 4px 18px rgba(12,12,12,0.08)",
          transition: "box-shadow 0.4s ease",
        }}
      >
        <img
          src={product.img}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            transition: "opacity 0.45s ease, transform 0.6s ease",
            opacity: hovered ? 0 : 1,
            transform: hovered ? "scale(1.06)" : "scale(1.0)",
          }}
          loading="lazy"
          draggable={false}
        />
        <img
          src={product.hoverImg}
          alt={`${product.name} alt`}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            transition: "opacity 0.45s ease, transform 0.6s ease",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1.0)" : "scale(1.06)",
          }}
          loading="lazy"
          draggable={false}
        />

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg,transparent 55%,rgba(12,12,12,0.22) 100%)" }} />

        {/* Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[9px] font-black tracking-[0.14em] uppercase px-2 py-1"
            style={{ background: "#6F4E37", color: "#fff", letterSpacing: "0.1em" }}
          >
            {product.badge}
          </span>
        </div>

        {/* Discount chip */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="text-[9px] font-black px-1.5 py-0.5"
            style={{
              background: "#6F4E37", color: "#fff",
              backdropFilter: "blur(4px)"
            }}
          >
            {product.discount}% off
          </span>
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWish((w) => !w);
          }}
          className="absolute z-20 flex items-center justify-center transition-all duration-300 rounded-full"
          style={{
            top: hovered ? "46px" : "44px",
            right: "10px",
            width: "30px",
            height: "30px",
            background: wishlisted ? "#e85d4a" : "rgba(255,255,255,0.92)",
            color: wishlisted ? "#fff" : "#0C0C0C",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            transform: hovered ? "scale(1)" : "scale(0.9)",
            opacity: hovered ? 1 : 0.85,
          }}
          aria-label="Wishlist"
        >
          <HeartIcon filled={wishlisted} size={14} />
        </button>

        {/* Quick view */}
        <button
          className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            height: "40px",
            background: "rgba(12,12,12,0.82)",
            backdropFilter: "blur(6px)",
            color: "#F5F0E8",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            borderRadius: "0 0 0px 0px",
          }}
          onClick={(e) => e.preventDefault()}
        >
          <EyeIcon size={13} />
          QUICK VIEW
        </button>

        {/* Color dots */}
        <div
          className="absolute left-3 bottom-12 z-10 flex items-center gap-1.5 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(4px)" }}
        >
          {product.colors.map((col, ci) => (
            <button
              key={ci}
              onClick={(e) => { e.preventDefault(); setColor(ci); }}
              className="transition-all duration-200"
              style={{
                width: selColor === ci ? "14px" : "10px",
                height: selColor === ci ? "14px" : "10px",
                background: "#6F4E37",
                border: selColor === ci ? "2px solid #FEFCF8" : "1.5px solid rgba(255,255,255,0.4)",
                boxShadow: selColor === ci ? `0 0 0 2px ${col}` : "none",
              }}
              aria-label={`Color ${ci + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Info block */}
      <div className="mt-3 px-0.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5" style={{ color: "#8A8070" }}>
          {product.brand}
        </p>
        <h3
          className="font-black leading-tight mb-1.5 truncate"
          style={{
            fontSize: "clamp(13px,2vw,15px)",
            color: "#0C0C0C",
            fontFamily: "Georgia,'Times New Roman',serif",
            letterSpacing: "-0.01em",
          }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={product.rating} />
          <span className="text-[10px] font-semibold" style={{ color: "#6F4E37" }}>
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>
        <div className="flex items-center gap-1 mb-2.5 flex-wrap">
          {product.sizes.slice(0, 4).map(sz => (
            <span key={sz}
              className="text-[9px] font-bold px-1.5 py-0.5"
              style={{ background: "#F5F0E8", color: "#3a3530", border: "1px solid #EDE7D9" }}>
              {sz}
            </span>
          ))}
          {product.sizes.length > 4 && (
            <span className="text-[9px] font-bold" style={{ color: "#8A8070" }}>
              +{product.sizes.length - 4}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-black" style={{ fontSize: "clamp(15px,2.5vw,18px)", color: "#0C0C0C" }}>
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-[11px] line-through font-medium" style={{ color: "#8A8070" }}>
                ₹{product.originalPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-black" style={{ color: "#6F4E37" }}>
              Save ₹{(product.originalPrice - product.price).toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleCart}
            className="flex items-center justify-center transition-all duration-300 active:scale-95"
            style={{
              width: "38px",
              height: "38px",
              background: addedCart ? "#6fcf97" : "#6F4E37",
              color: addedCart ? "#fff" : "#fff",
              boxShadow: addedCart ? "0 4px 14px rgba(111,207,151,0.4)" : "0 4px 14px rgba(12,12,12,0.25)",
              border: "1.5px solid rgba(201,169,110,0.2)",
              transform: addedCart ? "scale(1.12)" : "scale(1)",
            }}
            aria-label="Add to cart"
          >
            {addedCart
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
              : <CartAddIcon size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL ARROW BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const ScrollBtn = ({ dir, onClick, show }) => (
  <button
    onClick={onClick}
    aria-label={dir}
    className="flex-shrink-0 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
    style={{
      width: "36px", height: "36px",
      background: "#6F4E37",
      color: "#fff",
      border: "1.5px solid rgba(201,169,110,0.25)",
      boxShadow: "0 4px 14px rgba(12,12,12,0.2)",
      opacity: show ? 1 : 0.25,
      pointerEvents: show ? "auto" : "none",
    }}
  >
    <ChevronIcon dir={dir === "left" ? "left" : "right"} size={13} />
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTION SECTION COMPONENT (Reusable)
// ─────────────────────────────────────────────────────────────────────────────
const CollectionSection = ({ title, subtitle, products, bgColor = "#fff" }) => {
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [headerVis, setHdrVis] = useState(false);
  const trackRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHdrVis(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const updateScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => el.removeEventListener("scroll", updateScroll);
  }, [updateScroll]);

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir === "right" ? 500 : -500, behavior: "smooth" });
  };

  return (
    <section
      className="w-full py-12 md:py-16 overflow-hidden"
      style={{ background: bgColor }}
      aria-label={title}
    >
      <style>{`.prod-track-${title.replace(/\s/g, '')}::-webkit-scrollbar { display: none; }`}</style>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="px-4 md:px-6 lg:px-10 xl:px-14 mb-6 md:mb-8"
          style={{
            opacity: headerVis ? 1 : 0,
            transform: headerVis ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.55s ease, transform 0.55s ease",
          }}
        >
          <div className="flex items-start justify-between mb-4 md:mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] mb-1" style={{ color: "#6F4E37" }}>
                {subtitle}
              </p>
              <h2
                className="font-black leading-none"
                style={{
                  fontSize: "clamp(24px,4vw,42px)",
                  color: "#0C0C0C",
                  fontFamily: "Georgia,'Times New Roman',serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-[3px] w-10" style={{ background: "linear-gradient(90deg,#6F4E37,#6F4E37)" }} />
                <div className="h-[3px] w-4" style={{ background: "#6F4E37" }} />
                <div className="h-[3px] w-2" style={{ background: "#6F4E37" }} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <ScrollBtn dir="left" onClick={() => scrollBy("left")} show={canLeft} />
              <ScrollBtn dir="right" onClick={() => scrollBy("right")} show={canRight} />
              <button
                className="hidden sm:flex items-center gap-1.5 ml-1 text-xs font-black tracking-wide transition-all duration-200 group"
                style={{ color: "#000" }}
              >
                View All
                <span className="flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{ width: "26px", height: "26px", background: "#6F4E37", color: "#fff" }}>
                  <ChevronIcon dir="right" size={11} />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Scroll Track */}
        <div
          ref={trackRef}
          className={`prod-track-${title.replace(/\s/g, '')} flex gap-4 overflow-x-auto`}
          style={{
            paddingLeft: "clamp(16px,4vw,56px)",
            paddingRight: "clamp(16px,4vw,56px)",
            paddingBottom: "16px",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {products.map((p, i) => (
            <div key={p.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
              <ProductCard product={p} index={i} />
            </div>
          ))}
          <div style={{ minWidth: "4px", flexShrink: 0 }} />
        </div>

        {/* Mobile View All button */}
        <div className="sm:hidden flex justify-center mt-5 px-4">
          <button
            className="w-full max-w-sm flex items-center justify-center gap-2 py-3.5 font-black text-sm tracking-wide transition-all active:scale-98"
            style={{
              background: "#6F4E37",
              color: "#fff",
              border: "1.5px solid rgba(201,169,110,0.2)",
              boxShadow: "0 6px 20px rgba(12,12,12,0.18)",
            }}
          >
            View All Products
            <ChevronIcon dir="right" size={13} />
          </button>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT - All Collections
// ─────────────────────────────────────────────────────────────────────────────
export default function AllCollections() {
  return (
    <div className="w-full">
      <CollectionSection
        title="Global Collections"
        subtitle="WORLD-CLASS CRAFTMANSHIP"
        products={GLOBAL_COLLECTION}
        bgColor="#fff"
      />
      <CollectionSection
        title="Luxury Collections"
        subtitle="BESPOKE ELEGANCE"
        products={LUXURY_COLLECTION}
        bgColor="#FEFCF8"
      />
      <CollectionSection
        title="Originals by Brubla"
        subtitle="SIGNATURE STYLE"
        products={ORIGINALS_COLLECTION}
        bgColor="#fff"
      />
      <CollectionSection
        title="Indian Roots"
        subtitle="TIMELESS TRADITIONS"
        products={INDIAN_ROOTS}
        bgColor="#FEFCF8"
      />
      <CollectionSection
        title="Weddings & Celebrations"
        subtitle="YOUR SPECIAL DAY"
        products={WEDDING_COLLECTION}
        bgColor="#fff"
      />
    </div>
  );
}