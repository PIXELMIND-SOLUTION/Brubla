import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, Truck, CheckCircle, Clock, XCircle, Search, 
  Filter, ChevronDown, ChevronRight, Eye, Download, 
  Star, MessageCircle, RefreshCw, Calendar, MapPin,
  CreditCard, Receipt, FileText, ShoppingBag, Heart,
  Loader2, AlertCircle, TrendingUp, Award, Gift,
  Home, Phone, Mail, User, ChevronLeft, ChevronsLeft,
  ChevronsRight, MoreHorizontal
} from "lucide-react";
import Navbar from "../components/Navbar";
import SingleOrderModal from "./SingleOrderModal";
import Header from "../components/Header";

const COFFEE = "#C9A96E";

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    .fd { font-family: 'Playfair Display', Georgia, serif; }
    .fs { font-family: 'DM Sans', system-ui, sans-serif; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    
    .animate-fadeUp { animation: fadeUp 0.5s ease forwards; }
    .animate-slideInRight { animation: slideInRight 0.5s ease forwards; }
    .animate-scaleIn { animation: scaleIn 0.4s ease forwards; }
    
    .gold-shimmer {
      background: linear-gradient(90deg, #C9A96E, #E8C97A, #C9A96E);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }
    
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    /* Ensure text visibility on all devices */
    .text-visible {
      color: #ffffff !important;
    }
    
    @media (max-width: 640px) {
      button, .cursor-pointer {
        -webkit-tap-highlight-color: transparent;
      }
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE ORDERS DATA (50 orders for pagination demo)
// ─────────────────────────────────────────────────────────────────────────────
const generateSampleOrders = () => {
  const statuses = ["delivered", "shipped", "processing", "delivered", "delivered", "shipped", "processing", "delivered", "cancelled", "delivered"];
  const products = [
    { name: "Silk Organza Lehenga", price: 12999, img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=120&h=150&fit=crop&q=80" },
    { name: "Zardozi Anarkali", price: 9299, img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=120&h=150&fit=crop&q=80" },
    { name: "Linen Co-ord Set", price: 3799, img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=150&fit=crop&q=80" },
    { name: "Banarasi Saree", price: 8499, img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=150&fit=crop&q=80" },
    { name: "Designer Bridal Lehenga", price: 15999, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=150&fit=crop&q=80" },
    { name: "Velvet Blazer Dress", price: 5999, img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=120&h=150&fit=crop&q=80" },
    { name: "Mirror Work Lehenga", price: 7499, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=150&fit=crop&q=80" },
    { name: "Premium Edit Gown", price: 15999, img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=120&h=150&fit=crop&q=80" }
  ];
  
  const orders = [];
  for (let i = 1; i <= 50; i++) {
    const product = products[i % products.length];
    const status = statuses[i % statuses.length];
    const statusColors = {
      delivered: "#6fcf97",
      shipped: "#C9A96E",
      processing: "#f39c12",
      cancelled: "#e85d4a"
    };
    const date = new Date(2024, 11, 25 - i);
    
    orders.push({
      id: i.toString(),
      orderNumber: `NM-${String(2089 - i).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      status: status,
      statusColor: statusColors[status],
      total: product.price,
      items: [
        {
          id: i,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.img,
          size: ["S", "M", "L", "XL"][i % 4],
          color: ["Maroon", "Gold", "Beige", "Red", "Pink"][i % 5]
        }
      ],
      shippingAddress: {
        name: "Priya Sharma",
        address: "123 Main Street, Apt 4B",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500034",
        phone: "+91 98765 43210"
      },
      paymentMethod: ["Credit Card", "UPI", "Net Banking", "Cash on Delivery"][i % 4],
      deliveredDate: status === "delivered" ? date.toISOString().split('T')[0] : null,
      estimatedDelivery: status === "shipped" ? new Date(date.getTime() + 14 * 86400000).toISOString().split('T')[0] : null,
      trackingNumber: status !== "cancelled" ? `IND${String(123456789 + i).slice(0, 9)}` : null
    });
  }
  return orders;
};

const SAMPLE_ORDERS = generateSampleOrders();

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE - Fixed visibility
// ─────────────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status, statusColor }) => {
  const config = {
    delivered: { icon: CheckCircle, label: "Delivered", bgColor: "#6fcf97" },
    shipped: { icon: Truck, label: "Shipped", bgColor: "#C9A96E" },
    processing: { icon: Clock, label: "Processing", bgColor: "#f39c12" },
    cancelled: { icon: XCircle, label: "Cancelled", bgColor: "#e85d4a" },
    returned: { icon: RefreshCw, label: "Returned", bgColor: "#e85d4a" }
  };
  
  const { icon: Icon, label, bgColor } = config[status] || config.processing;
  
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: `${bgColor}20` }}>
      <Icon size={12} className="flex-shrink-0" style={{ color: bgColor }} />
      <span className="text-xs font-semibold fs" style={{ color: bgColor }}>{label}</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ORDER CARD (Card View - Mobile/Tablet)
// ─────────────────────────────────────────────────────────────────────────────
const OrderCard = ({ order, onClick }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div 
      onClick={onClick}
      className="bg-gray-900/40 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer group overflow-hidden active:scale-[0.99] sm:active:scale-100"
    >
      <div className="p-3 sm:p-4 border-b border-gray-800/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm font-mono text-white fs">{order.orderNumber}</span>
            <div className="w-px h-3 bg-gray-700 hidden xs:block" />
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-gray-500 flex-shrink-0" />
              <span className="text-xs text-gray-400 fs">{formatDate(order.date)}</span>
            </div>
          </div>
          <StatusBadge status={order.status} statusColor={order.statusColor} />
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <div className="flex gap-3">
          <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
            <img src={order.items[0].image} alt={order.items[0].name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white fs truncate">{order.items[0].name}</p>
            <p className="text-xs text-gray-500 fs mt-0.5">{order.items.length} item(s)</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-base font-bold text-white fd">₹{order.total.toLocaleString()}</p>
              <ChevronRight size={16} className="text-gray-600 group-hover:text-coffee transition-colors flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ORDER ROW (Table View - Desktop)
// ─────────────────────────────────────────────────────────────────────────────
const OrderRow = ({ order, onClick }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div 
      onClick={onClick}
      className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-900/40 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer group"
    >
      <div className="col-span-3 flex items-center gap-3 min-w-0">
        <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
          <img src={order.items[0].image} alt={order.items[0].name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white fs truncate">{order.items[0].name}</p>
          <p className="text-xs text-gray-500 fs">{order.items.length} item(s)</p>
        </div>
      </div>
      <div className="col-span-2">
        <p className="text-sm font-mono text-white fs">{order.orderNumber}</p>
        <p className="text-xs text-gray-500 fs">{formatDate(order.date)}</p>
      </div>
      <div className="col-span-2">
        <StatusBadge status={order.status} statusColor={order.statusColor} />
      </div>
      <div className="col-span-2">
        <p className="text-base font-bold text-white fd">₹{order.total.toLocaleString()}</p>
      </div>
      <div className="col-span-3 flex justify-end">
        <ChevronRight size={16} className="text-gray-600 group-hover:text-coffee transition-colors flex-shrink-0" />
      </div>
    </div>
  );
};



// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION COMPONENT with Ellipsis - Fixed visibility
// ─────────────────────────────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const ellipsis = { type: "ellipsis", value: "..." };
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ type: "page", value: i });
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push({ type: "page", value: i });
        }
        pages.push(ellipsis);
        pages.push({ type: "page", value: totalPages });
      } else if (currentPage >= totalPages - 2) {
        pages.push({ type: "page", value: 1 });
        pages.push(ellipsis);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push({ type: "page", value: i });
        }
      } else {
        pages.push({ type: "page", value: 1 });
        pages.push(ellipsis);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push({ type: "page", value: i });
        }
        pages.push(ellipsis);
        pages.push({ type: "page", value: totalPages });
      }
    }
    
    return pages;
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center mt-6 sm:mt-8">
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-800/50 text-gray-400 flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsLeft size={14} className="sm:w-4 sm:h-4" />
        </button>
        
        {getPageNumbers().map((item, idx) => (
          item.type === "ellipsis" ? (
            <div key={`ellipsis-${idx}`} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
              <MoreHorizontal size={14} className="text-gray-500" />
            </div>
          ) : (
            <button
              key={item.value}
              onClick={() => onPageChange(item.value)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-medium fs text-sm transition-all ${
                currentPage === item.value
                  ? "bg-white text-black font-bold"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {item.value}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-800/50 text-gray-400 flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsRight size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-gray-900/40 rounded-xl p-3 sm:p-4 border border-gray-800 hover:border-gray-700 transition-all duration-300">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon size={14} className="sm:w-[18px] sm:h-[18px]" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs text-gray-500 fs uppercase tracking-wide">{label}</p>
        <p className="text-base sm:text-xl font-bold text-white fd">{value}</p>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FILTER BUTTON - Fixed visibility
// ─────────────────────────────────────────────────────────────────────────────
const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium fs transition-all whitespace-nowrap active:scale-95 ${
      active 
        ? "bg-white text-black font-semibold" 
        : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
    }`}
  >
    {label}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// VIEW TOGGLE BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const ViewToggle = ({ view, setView }) => (
  <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-0.5">
    <button
      onClick={() => setView("card")}
      className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium fs transition-all ${
        view === "card" ? "bg-white text-black" : "text-gray-400 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-1">
        <Package size={12} />
        <span className="hidden xs:inline">Cards</span>
      </div>
    </button>
    <button
      onClick={() => setView("table")}
      className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium fs transition-all ${
        view === "table" ? "bg-white text-black" : "text-gray-400 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-1">
        <FileText size={12} />
        <span className="hidden xs:inline">Table</span>
      </div>
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function MyOrders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("card");
  const itemsPerPage = 8;
  
  const filters = [
    { id: "all", label: "All Orders" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" }
  ];
  
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setOrders(SAMPLE_ORDERS);
      setFilteredOrders(SAMPLE_ORDERS);
      setLoading(false);
    };
    loadOrders();
  }, []);
  
  useEffect(() => {
    let result = [...orders];
    
    if (activeFilter !== "all") {
      result = result.filter(order => order.status === activeFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    setFilteredOrders(result);
    setCurrentPage(1);
  }, [activeFilter, searchQuery, orders]);
  
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  
  const stats = {
    totalOrders: orders.length,
    delivered: orders.filter(o => o.status === "delivered").length,
    inTransit: orders.filter(o => o.status === "shipped").length,
    totalSpent: orders.reduce((sum, o) => sum + o.total, 0)
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center px-4">
            <Loader2 size={32} className="sm:w-10 sm:h-10 animate-spin mx-auto mb-4" style={{ color: COFFEE }} />
            <p className="text-gray-400 fs text-sm sm:text-base">Loading your orders...</p>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white">
        <Styles />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden pb-6 sm:pb-8" style={{ background: "linear-gradient(160deg, #0C0C0C 0%, #1a1812 60%, #0C0C0C 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 65% 45% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 65%)" }} />
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 sm:gap-2 text-gray-400 hover:text-white transition-colors mb-4 sm:mb-6 fs text-xs sm:text-sm group"
            >
              <ChevronLeft size={14} className="sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="fd font-black text-white text-2xl sm:text-3xl md:text-4xl">My Orders</h1>
                <p className="text-gray-400 fs text-xs sm:text-sm mt-1">Track and manage all your purchases</p>
              </div>
              <button className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors fs text-xs sm:text-sm text-white">
                <RefreshCw size={12} className="sm:w-3.5 sm:h-3.5" />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.35), transparent)" }} />
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
            <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color={COFFEE} />
            <StatCard icon={CheckCircle} label="Delivered" value={stats.delivered} color="#6fcf97" />
            <StatCard icon={Truck} label="In Transit" value={stats.inTransit} color="#f39c12" />
            <StatCard icon={TrendingUp} label="Total Spent" value={`₹${stats.totalSpent.toLocaleString()}`} color="#e85d4a" />
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search by order number or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white fs text-xs sm:text-sm placeholder:text-gray-500 focus:border-coffee transition-colors"
              />
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {filters.map(filter => (
                  <FilterButton
                    key={filter.id}
                    label={filter.label}
                    active={activeFilter === filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                  />
                ))}
              </div>
              <ViewToggle view={view} setView={setView} />
            </div>
          </div>
          
          {/* Orders List */}
          {paginatedOrders.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-900/30 rounded-2xl border border-gray-800">
              <Package size={36} className="sm:w-12 sm:h-12 mx-auto text-gray-600 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-white fd mb-1 sm:mb-2">No orders found</h3>
              <p className="text-gray-400 fs text-xs sm:text-sm mb-4 sm:mb-6 px-4">
                {searchQuery ? "Try a different search term" : "You haven't placed any orders yet"}
              </p>
              <button
                onClick={() => navigate("/products")}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-black font-semibold fs text-xs sm:text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${COFFEE}, #a8843f)` }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {view === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {paginatedOrders.map(order => (
                    <OrderCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
                  ))}
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block space-y-2">
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-gray-500 fs border-b border-gray-800">
                      <div className="col-span-3">Product</div>
                      <div className="col-span-2">Order ID / Date</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Total</div>
                      <div className="col-span-3"></div>
                    </div>
                    {paginatedOrders.map(order => (
                      <OrderRow key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
                    ))}
                  </div>
                  
                  {/* Mobile/Tablet Card View for Table mode */}
                  <div className="lg:hidden">
                    <div className="grid grid-cols-1 gap-3">
                      {paginatedOrders.map(order => (
                        <OrderCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              
              {/* Order count info */}
              <p className="text-center text-xs text-gray-500 fs mt-4">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </p>
            </>
          )}
        </div>
        
        {/* Order Details Modal */}
        <SingleOrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      </div>
    </>
  );
}