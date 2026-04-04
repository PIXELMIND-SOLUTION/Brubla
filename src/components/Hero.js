import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   BANNER DATA
───────────────────────────────────────────── */

const DESKTOP_BANNERS = [
  {
    id: 1,
    type: "image",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400",
    title: "Summer Collection 2025",
    description: "Discover the finest handcrafted styles made for you.",
  },
  {
    id: 2,
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Behind the Craft",
    description: "Watch how our artisans bring every piece to life.",
  },
  {
    id: 3,
    type: "youtube",
    src: "https://youtu.be/yycVNcishrE?si=aqzsRwLIaT7YjK6A",
    title: "The NewMe Story",
    description: "A journey of fashion, culture, and craftsmanship.",
  },
];

const MOBILE_BANNERS = DESKTOP_BANNERS;

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

/* ─────────────────────────────────────────────
   MODAL COMPONENT (FIXED)
───────────────────────────────────────────── */

const BannerModal = ({ banner, onClose }) => {
  const [showIframe, setShowIframe] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (banner) {
      document.body.style.overflow = "hidden";
      // Delay iframe loading to ensure modal is open
      setTimeout(() => setShowIframe(true), 100);
    }
    return () => {
      document.body.style.overflow = "";
      setShowIframe(false);
    };
  }, [banner]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && banner) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [banner, onClose]);

  if (!banner) return null;

  const renderContent = () => {
    switch (banner.type) {
      case "image":
        return (
          <img
            src={banner.src}
            alt={banner.title}
            className="w-full h-full object-contain"
          />
        );
      case "video":
        return (
          <video
            key={banner.src}
            src={banner.src}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        );
      case "youtube":
        return (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            {showIframe && (
              <iframe
                key={banner.src}
                src={getYouTubeEmbedUrl(banner.src, { autoplay: true, mute: false, controls: true })}
                className="w-full h-full"
                style={{
                  aspectRatio: "16/9",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={banner.title}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-auto max-h-[90vh] bg-black rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-2xl z-10 bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal title */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
          <h3 className="text-white text-lg md:text-xl font-bold">{banner.title}</h3>
          <p className="text-white/70 text-sm">{banner.description}</p>
        </div>

        {/* Media content */}
        <div className="w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   CAROUSEL COMPONENT
───────────────────────────────────────────── */

const Carousel = ({ banners, aspectRatio, className = "" }) => {
  const navigate = useNavigate();
  const [cur, setCur] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeYouTube, setActiveYouTube] = useState(null);

  const next = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCur((c) => (c + 1) % banners.length);
    setActiveYouTube(null);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [banners.length, isTransitioning]);

  const prev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCur((c) => (c - 1 + banners.length) % banners.length);
    setActiveYouTube(null);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [banners.length, isTransitioning]);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const getButtonText = (banner) => {
    switch (banner.type) {
      case "image":
        return "View Image";
      case "video":
        return "Play Video";
      case "youtube":
        return "Watch Video";
      default:
        return "View";
    }
  };

  const renderCarouselMedia = (banner, isActive) => {
    switch (banner.type) {
      case "image":
        return (
          <img
            src={banner.src}
            alt={banner.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        );
      case "video":
        return (
          <video
            src={banner.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        );
      case "youtube":
        return (
          <div className="relative w-full h-full overflow-hidden bg-black">
            {isActive && activeYouTube === banner.id ? (
              <iframe
                src={getYouTubeEmbedUrl(banner.src, { autoplay: true, mute: true, controls: false })}
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  minWidth: "100%",
                  minHeight: "100%",
                  width: "auto",
                  height: "auto",
                  transform: "scale(1.05)",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={banner.title}
              />
            ) : (
              <img
                src={`https://img.youtube.com/vi/${getYouTubeEmbedUrl(banner.src, {}).split("/embed/")[1]?.split("?")[0]}/maxresdefault.jpg`}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Load YouTube thumbnail and video on slide change
  useEffect(() => {
    const currentBanner = banners[cur];
    if (currentBanner?.type === "youtube") {
      setTimeout(() => {
        setActiveYouTube(currentBanner.id);
      }, 500);
    } else {
      setActiveYouTube(null);
    }
  }, [cur, banners]);

  return (
    <div
      className={`relative w-full overflow-hidden group ${className}`}
      style={{ aspectRatio }}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-all duration-700 ease-in-out"
          style={{
            opacity: index === cur ? 1 : 0,
            visibility: index === cur ? "visible" : "hidden",
            transform: `scale(${index === cur ? 1 : 1.05})`,
          }}
        >
          <div className="relative w-full h-full">
            {/* Media */}
            {renderCarouselMedia(banner, index === cur)}

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Overlay Text - Bottom Left */}
            <div className="absolute bottom-24 left-0 right-0 px-6 md:px-12 text-center md:text-left z-10">
              <h2 className="text-white text-xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
                {banner.title}
              </h2>
              <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto md:mx-0 drop-shadow-md">
                {banner.description}
              </p>
            </div>

            {/* Center Button */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button
                onClick={() => setSelectedBanner(banner)}
                style={{ backgroundColor: "#6F4E37"}}
                className="px-6 md:px-8 py-2.5 md:py-3 rounded-full text-white font-semibold text-sm md:text-base hover:scale-105 hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center gap-2 group/btn"
              >
                <span>{getButtonText(banner)}</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
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
        </div>
      ))}

      {/* Navigation Arrows - Visible on hover */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl z-20 bg-black/30 hover:bg-black/50 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Previous slide"
      >
        ◀
      </button>

      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl z-20 bg-black/30 hover:bg-black/50 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Next slide"
      >
        ▶
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
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
            className={`transition-all duration-300 ${
              index === cur
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            } h-2 rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Modal */}
      <BannerModal
        banner={selectedBanner}
        onClose={() => setSelectedBanner(null)}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN HERO BANNER COMPONENT
───────────────────────────────────────────── */

export default function HeroBanner() {
  return (
    <section className="w-full bg-black">
      {/* Mobile Carousel */}
      <Carousel
        banners={MOBILE_BANNERS}
        aspectRatio="9/16"
        className="block md:hidden"
      />
      
      {/* Desktop Carousel */}
      <Carousel
        banners={DESKTOP_BANNERS}
        aspectRatio="21/7"
        className="hidden md:block"
      />
    </section>
  );
}