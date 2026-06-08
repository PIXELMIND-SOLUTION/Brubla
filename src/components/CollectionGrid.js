import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// API CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE_URL = "http://31.97.228.17:4077";
const COLLECTIONS_API_URL = `${API_BASE_URL}/api/users/homepage/collections`;

// ─────────────────────────────────────────────────────────────────────────────
// ARROW ICON
// ─────────────────────────────────────────────────────────────────────────────
const ArrowIcon = ({ size = 13, color = "#0C0C0C" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTION CARD
// ─────────────────────────────────────────────────────────────────────────────
const CollectionCard = ({ col, index, style = {} }) => {
  const [hovered, setHovered] = useState(false);
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

  // Generate subtitle from title or use default
  const subtitle = col.subtitle || (col.title.includes("Sale") ? "Special Edition" : "Collection");
  const tag = col.tag?.toUpperCase() || "NEW";
  const accent = "#000";

  return (
    <div
      ref={ref}
      className="relative overflow-hidden cursor-pointer group rounded-none"
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.97) translateY(18px)",
        transition: `opacity 0.58s ease ${index * 0.1}s, transform 0.58s ease ${index * 0.1}s,
                     box-shadow 0.35s ease`,
        boxShadow: hovered
          ? "0 28px 60px rgba(12,12,12,0.28), 0 8px 24px rgba(12,12,12,0.14)"
          : "0 6px 28px rgba(12,12,12,0.12)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/collections/${col.id}`)}
    >
      {/* IMAGE */}
      <img
        src={col.image}
        alt={col.title}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out"
        style={{
          transform: hovered ? "scale(1.07)" : "scale(1.0)",
        }}
        loading="lazy"
        draggable={false}
      />

      {/* GRADIENT OVERLAY - rest state */}
      <div 
        className="absolute inset-0 transition-opacity duration-400"
        style={{ 
          background: "linear-gradient(170deg,rgba(12,12,12,0.12) 0%,rgba(12,12,12,0.30) 40%,rgba(12,12,12,0.82) 100%)",
          opacity: hovered ? 0 : 1 
        }} 
      />

      {/* GRADIENT OVERLAY - hover state (deeper) */}
      <div 
        className="absolute inset-0 transition-opacity duration-400"
        style={{
          background: "linear-gradient(170deg,rgba(12,12,12,0.25) 0%,rgba(12,12,12,0.45) 40%,rgba(12,12,12,0.92) 100%)",
          opacity: hovered ? 1 : 0,
        }} 
      />

      {/* TOP ACCENT LINE on hover */}
      <div 
        className="absolute top-0 left-0 right-0 h-[3px] transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, transparent, #000, transparent)",
          opacity: hovered ? 1 : 0,
        }} 
      />

      {/* CONTENT BLOCK bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5 pt-4 transition-transform duration-400 ease-out"
        style={{
          transform: hovered ? "translateY(0)" : "translateY(4px)",
        }}
      >
        <div className="flex flex-col leading-none mb-1.5">
          <span
            className="font-black text-white"
            style={{
              fontSize: "clamp(20px,3.5vw,28px)",
              fontFamily: "Georgia,'Times New Roman',serif",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            {col.title}
          </span>
          <span
            className="font-black text-white"
            style={{
              fontSize: "clamp(20px,3.5vw,28px)",
              fontFamily: "Georgia,'Times New Roman',serif",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            {subtitle}
          </span>
        </div>

        <p
          className="text-white/65 font-medium leading-snug mb-3 max-w-[240px] transition-all duration-350 delay-50"
          style={{
            fontSize: "11px",
            letterSpacing: "0.02em",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
          }}
        >
          {col.description}
        </p>

        <div
          className="flex items-center gap-0 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0.85 }}
        >
          <button
            className="flex items-center gap-2 font-black text-[11px] tracking-wide
                       transition-all duration-200 hover:gap-3 active:scale-95"
            style={{
              background: "#000",
              color: "#fff",
              padding: "8px 16px",
              letterSpacing: "0.08em",
              boxShadow: "0 4px 18px rgba(0,0,0,0.5)",
            }}
          >
            Shop Now
            <ArrowIcon size={11} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────────────────────
const SectionHeader = () => {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-end justify-between mb-7 md:mb-10 transition-all duration-500"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(14px)",
      }}
    >
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] mb-1 text-white/60">
          Our Universe
        </p>
        <h2
          className="font-black leading-none text-white"
          style={{
            fontSize: "clamp(26px,4.5vw,44px)",
            fontFamily: "Georgia,'Times New Roman',serif",
            letterSpacing: "-0.02em",
          }}
        >
          Collections
        </h2>
        <div className="flex items-center gap-2 mt-2.5">
          <div className="h-[3px] w-10 bg-white" />
          <div className="h-[3px] w-4 bg-white/30" />
          <div className="h-[3px] w-2 bg-white/15" />
        </div>
      </div>

      {/* Desktop only — hidden on mobile */}
      <button
        className="hidden sm:flex items-center gap-1.5 text-xs font-black tracking-wide group transition-all text-white/50 hover:text-white/80"
        onClick={() => navigate('/collections')}
      >
        All Collections
        <span className="flex items-center justify-center w-[26px] h-[26px] bg-white/10 text-white transition-all duration-200 group-hover:scale-110 group-hover:bg-white/20">
          <ArrowIcon size={11} color="#fff" />
        </span>
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE VIEW ALL BUTTON
// ─────────────────────────────────────────────────────────────────────────────
const MobileViewAllButton = () => {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex sm:hidden mt-5 transition-all duration-450 delay-200"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <button
        className="w-full flex items-center justify-between font-black text-[11px]
                   tracking-[0.1em] uppercase active:scale-[0.98] transition-transform duration-150
                   bg-transparent border border-white/20 text-white/60 hover:text-white/80
                   py-[13px] px-[18px]"
        onClick={() => navigate('/collections')}
      >
        <span>View All Collections</span>
        <span className="flex items-center justify-center w-7 h-7 bg-white/10">
          <ArrowIcon size={12} color="#fff" />
        </span>
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SKELETON
// ─────────────────────────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <section className="w-full py-10 md:py-16 bg-black" aria-label="Collections">
    <div className="max-w-9xl mx-auto px-4 md:px-6 lg:px-10 xl:px-14">
      <div className="animate-pulse">
        <div className="flex items-end justify-between mb-7 md:mb-10">
          <div>
            <div className="h-3 w-24 bg-white/20 rounded mb-2"></div>
            <div className="h-10 w-48 bg-white/20 rounded"></div>
          </div>
          <div className="hidden sm:block h-6 w-32 bg-white/20 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white/10 rounded-2xl" style={{ height: "300px" }}></div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function CollectionGrid() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch collections from API
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await fetch(COLLECTIONS_API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          // Transform API data to match component structure
          const transformedData = result.data
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((item, idx) => ({
              id: item._id,
              title: item.title,
              tag: item.tag,
              description: item.description,
              image: item.image,
              order: item.order,
              products: item.products || [],
              subtitle: item.title.includes("Sale") ? "Special Edition" : 
                       item.title.includes("Collection") ? "Curated Edit" : "Collection",
            }));
          
          setCollections(transformedData);
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <section className="w-full py-10 md:py-16 bg-black" aria-label="Collections">
        <div className="max-w-9xl mx-auto px-4 md:px-6 lg:px-10 xl:px-14">
          <div className="text-center py-20">
            <p className="text-red-400 text-sm mb-4">Failed to load collections</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-white text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return (
      <section className="w-full py-10 md:py-16 bg-black" aria-label="Collections">
        <div className="max-w-9xl mx-auto px-4 md:px-6 lg:px-10 xl:px-14">
          <div className="text-center py-20">
            <p className="text-white/60 text-sm">No collections available</p>
          </div>
        </div>
      </section>
    );
  }

  // Map collections to grid positions
  const getCollectionAtPosition = (position) => {
    return collections[position] || collections[0];
  };

  return (
    <section
      className="w-full py-10 md:py-16 bg-black"
      aria-label="Collections"
    >
      <style>{`
        @media (min-width: 1024px) {
          .collection-grid {
            display: grid;
            grid-template-columns: 1.1fr 1fr 1fr;
            grid-template-rows: 280px 280px 220px;
            gap: 14px;
          }
          .col-global   { grid-column: 1; grid-row: 1 / 3; }
          .col-luxury   { grid-column: 2; grid-row: 1; }
          .col-originals{ grid-column: 2; grid-row: 2; }
          .col-indian   { grid-column: 3; grid-row: 1 / 3; }
          .col-wedding  { grid-column: 1 / 4; grid-row: 3; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .collection-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 320px 260px 260px 180px;
            gap: 12px;
          }
          .col-global   { grid-column: 1; grid-row: 1; }
          .col-indian   { grid-column: 2; grid-row: 1; }
          .col-luxury   { grid-column: 1; grid-row: 2; }
          .col-originals{ grid-column: 2; grid-row: 2; }
          .col-wedding  { grid-column: 1 / 3; grid-row: 3; }
        }
        @media (max-width: 639px) {
          .collection-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .col-global,
          .col-indian   { height: 320px; }
          .col-luxury,
          .col-originals { height: 240px; }
          .col-wedding  { height: 200px; }
        }
      `}</style>

      <div className="max-w-9xl mx-auto px-4 md:px-6 lg:px-10 xl:px-14">
        <SectionHeader />

        <div className="collection-grid">
          <div className="col-global">
            <CollectionCard 
              col={getCollectionAtPosition(0)} 
              index={0} 
              style={{ width: "100%", height: "100%" }} 
            />
          </div>
          <div className="col-luxury">
            <CollectionCard 
              col={getCollectionAtPosition(1)} 
              index={1} 
              style={{ width: "100%", height: "100%" }} 
            />
          </div>
          <div className="col-originals">
            <CollectionCard 
              col={getCollectionAtPosition(2)} 
              index={2} 
              style={{ width: "100%", height: "100%" }} 
            />
          </div>
          <div className="col-indian">
            <CollectionCard 
              col={getCollectionAtPosition(3)} 
              index={3} 
              style={{ width: "100%", height: "100%" }} 
            />
          </div>
          <div className="col-wedding">
            <CollectionCard 
              col={getCollectionAtPosition(4)} 
              index={4} 
              style={{ width: "100%", height: "100%" }} 
            />
          </div>
        </div>

        {/* Mobile-only "View All Collections" */}
        <MobileViewAllButton />
      </div>
    </section>
  );
}