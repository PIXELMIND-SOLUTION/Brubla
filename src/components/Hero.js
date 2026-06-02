import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import banner from '../assets/banner.mp4';

/* ─────────────────────────────────────────────
   API CONFIGURATION
───────────────────────────────────────────── */

const API_BASE_URL = "http://31.97.228.17:4077";
const HERO_API_ENDPOINT = `${API_BASE_URL}/api/admin/homepage/hero`;

/* ─────────────────────────────────────────────
   YOUTUBE HELPER
───────────────────────────────────────────── */

const getYouTubeEmbedUrl = (url, { autoplay = false, mute = false, controls = true } = {}) => {
  try {
    let videoId = "";
    if (url.includes("youtu.be")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      videoId = new URL(url).searchParams.get("v");
    } else if (url.includes("youtube.com/embed")) {
      videoId = url.split("/embed/")[1]?.split("?")[0];
    }
    if (!videoId) return "";
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      mute: mute ? "1" : "0",
      controls: controls ? "1" : "0",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  } catch {
    return "";
  }
};

const getYouTubeThumbnail = (url) => {
  try {
    let videoId = "";
    if (url.includes("youtu.be")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      videoId = new URL(url).searchParams.get("v");
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "";
  } catch {
    return "";
  }
};

/* ─────────────────────────────────────────────
   MODAL COMPONENT
───────────────────────────────────────────── */

const BannerModal = ({ banner, onClose }) => {
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    if (banner) {
      document.body.style.overflow = "hidden";
      setTimeout(() => setShowIframe(true), 100);
    }
    return () => {
      document.body.style.overflow = "";
      setShowIframe(false);
    };
  }, [banner]);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape" && banner) onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [banner, onClose]);

  if (!banner) return null;

  const renderContent = () => {
    switch (banner.type) {
      case "image":
        return <img src={banner.url} alt={banner.title || "Hero image"} className="w-full h-full object-contain" />;
      case "video":
        return <video key={banner.url} src={banner.url} controls autoPlay className="w-full h-full object-contain" />;
      case "youtube":
        return (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            {showIframe && (
              <iframe
                key={banner.url}
                src={getYouTubeEmbedUrl(banner.url, { autoplay: true, mute: false, controls: true })}
                className="w-full h-full"
                style={{ aspectRatio: "16/9", maxWidth: "100%", maxHeight: "100%" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={banner.title || "YouTube video"}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl z-10 bg-black/60 rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/80 transition"
          aria-label="Close modal"
        >
          ✕
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
          <h3 className="text-white text-lg md:text-xl font-bold">{banner.title || "Hero Content"}</h3>
          <p className="text-white/70 text-sm">{banner.description || ""}</p>
        </div>
        <div className="w-full flex items-center justify-center" style={{ minHeight: "min(56vw, 70vh)" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   CAROUSEL COMPONENT — FULL SCREEN
───────────────────────────────────────────── */

const Carousel = ({ banners }) => {
  const [cur, setCur] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeYouTube, setActiveYouTube] = useState(null);

  const navigate = useNavigate();

  const next = useCallback(() => {
    if (isTransitioning || banners.length === 0) return;
    setIsTransitioning(true);
    setCur((c) => (c + 1) % banners.length);
    setActiveYouTube(null);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [banners.length, isTransitioning]);

  const prev = useCallback(() => {
    if (isTransitioning || banners.length === 0) return;
    setIsTransitioning(true);
    setCur((c) => (c - 1 + banners.length) % banners.length);
    setActiveYouTube(null);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [banners.length, isTransitioning]);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(next, 10000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  useEffect(() => {
    const currentBanner = banners[cur];
    if (currentBanner?.type === "youtube") {
      const t = setTimeout(() => setActiveYouTube(currentBanner._id), 500);
      return () => clearTimeout(t);
    } else {
      setActiveYouTube(null);
    }
  }, [cur, banners]);

  const getButtonText = (banner) => {
    switch (banner.type) {
      case "image": return "View Image";
      case "video": return "Play Video";
      case "youtube": return "Watch Video";
      default: return "View";
    }
  };

  const renderMedia = (banner, isActive) => {
    switch (banner.type) {
      case "image":
        return (
          <img
            src={banner.url}
            alt={banner.title || "Hero image"}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        );
      case "video":
        return (
          <video
            src={banner.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        );
      case "youtube":
        return (
          <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
            {isActive && activeYouTube === banner._id ? (
              <iframe
                src={getYouTubeEmbedUrl(banner.url, { autoplay: true, mute: true, controls: false })}
                className="absolute"
                style={{
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%) scale(1.08)",
                  width: "100vw",
                  height: "56.25vw",       /* 16:9 ratio */
                  minHeight: "100vh",
                  minWidth: "177.78vh",    /* inverse 16:9 ratio */
                  pointerEvents: "none",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={banner.title || "YouTube video"}
              />
            ) : (
              <img
                src={getYouTubeThumbnail(banner.url)}
                alt={banner.title || "YouTube thumbnail"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <p className="text-white">Loading hero content...</p>
      </div>
    );
  }

  return (
    /* Full viewport height, full width */
    <div className="relative w-full h-screen overflow-hidden group bg-black">
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{
            opacity: index === cur ? 1 : 0,
            visibility: index === cur ? "visible" : "hidden",
            transform: `scale(${index === cur ? 1 : 1.04})`,
          }}
        >
          {/* Media layer */}
          {renderMedia(banner, index === cur)}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 pointer-events-none" />

          {/* Text overlay — commented out, can be enabled if needed */}
          {/* <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-0 right-0 px-6 sm:px-10 md:px-16 lg:px-24 text-center sm:text-left z-10 pointer-events-none">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 md:mb-3 drop-shadow-lg leading-tight">
              {banner.title || "Hero Title"}
            </h2>
            <p className="text-white/85 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-xl mx-auto sm:mx-0 drop-shadow-md">
              {banner.description || ""}
            </p>
          </div> */}

          {/* CTA button — centered */}
          <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-0 right-0 flex justify-center sm:justify-center px-6 sm:px-10 md:px-16 lg:px-24 z-10">
            <button
              onClick={() => navigate('/products')}
              className="text-white text-sm sm:text-base font-medium underline underline-offset-4 hover:opacity-80 transition flex items-center gap-2 group"
            >
              <span>Shop Now</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {/* Prev arrow - only show if more than one banner */}
      {banners.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl z-20 bg-black/30 hover:bg-black/55 rounded-full w-9 h-9 md:w-11 md:h-11 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Previous slide"
        >
          ‹
        </button>
      )}

      {/* Next arrow - only show if more than one banner */}
      {banners.length > 1 && (
        <button
          onClick={next}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl z-20 bg-black/30 hover:bg-black/55 rounded-full w-9 h-9 md:w-11 md:h-11 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Next slide"
        >
          ›
        </button>
      )}

      {/* Dots - only show if more than one banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 flex justify-center gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCur(index);
                  setActiveYouTube(null);
                  setTimeout(() => setIsTransitioning(false), 700);
                }
              }}
              className={`transition-all duration-300 h-2 rounded-full ${index === cur ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <BannerModal banner={selectedBanner} onClose={() => setSelectedBanner(null)} />
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN EXPORT - FETCHES DATA FROM API
───────────────────────────────────────────── */

export default function HeroBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch(HERO_API_ENDPOINT);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          // Filter only active banners and sort by order
          const activeBanners = result.data
            .filter(banner => banner.isActive === true)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(banner => ({
              ...banner,
              // Ensure URL is absolute if needed
              url: banner.url.startsWith('http') 
                ? banner.url 
                : `${API_BASE_URL}${banner.url}`,
              // Add default title if not present
              title: banner.title || getDefaultTitle(banner.type),
              description: banner.description || getDefaultDescription(banner.type),
            }));
          
          setBanners(activeBanners);
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (err) {
        console.error('Error fetching hero banners:', err);
        setError(err.message);
        // Fallback to default banners if API fails
        setBanners(getDefaultBanners());
      } finally {
        setLoading(false);
      }
    };

    fetchHeroBanners();
  }, []);

  const getDefaultTitle = (type) => {
    switch (type) {
      case 'image': return 'Featured Collection';
      case 'video': return 'Behind the Craft';
      case 'youtube': return 'The NewMe Story';
      default: return 'New Collection';
    }
  };

  const getDefaultDescription = (type) => {
    switch (type) {
      case 'image': return 'Discover our latest handcrafted styles';
      case 'video': return 'Watch how our artisans bring every piece to life';
      case 'youtube': return 'A journey of fashion, culture, and craftsmanship';
      default: return 'Shop now';
    }
  };

  const getDefaultBanners = () => {
    return [
      {
        _id: 'default-1',
        type: 'image',
        url: 'https://i.pinimg.com/736x/e1/49/9b/e1499bd0a350285b6cfdc736ed047a07.jpg',
        title: 'Summer Collection 2025',
        description: 'Discover the finest handcrafted styles made for you.',
        order: 0,
        isActive: true,
      },
      {
        _id: 'default-2',
        type: 'video',
        url: banner,
        title: 'Behind the Craft',
        description: 'Watch how our artisans bring every piece to life.',
        order: 1,
        isActive: true,
      },
      {
        _id: 'default-3',
        type: 'youtube',
        url: 'https://youtu.be/yycVNcishrE?si=aqzsRwLIaT7YjK6A',
        title: 'The NewMe Story',
        description: 'A journey of fashion, culture, and craftsmanship.',
        order: 2,
        isActive: true,
      },
    ];
  };

  if (loading) {
    return (
      <section className="w-full">
        <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="inline-block w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <p>Loading hero content...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && banners.length === 0) {
    return (
      <section className="w-full">
        <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
          <div className="text-white text-center px-4">
            <p className="text-red-400 mb-2">Failed to load hero content</p>
            <p className="text-sm text-white/60">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <Carousel banners={banners} />
    </section>
  );
}