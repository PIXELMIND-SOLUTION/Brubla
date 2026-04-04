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
  },
  {
    id: 2,
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 3,
    type: "youtube",
    src: "https://youtu.be/yycVNcishrE?si=aqzsRwLIaT7YjK6A",
  },
];

const MOBILE_BANNERS = [
  {
    id: 1,
    type: "image",
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600",
  },
  {
    id: 2,
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 3,
    type: "youtube",
    src: "https://youtu.be/yycVNcishrE?si=aqzsRwLIaT7YjK6A",
  },
];

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */

const BannerModal = ({ banner, onClose, getYouTubeEmbedUrl }) => {
  if (!banner) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Stop closing when clicking inside */}
      <div
        className="relative w-[90%] md:w-[70%] h-[60%] md:h-[70%] bg-black rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl z-10"
        >
          ✕
        </button>

        {/* MEDIA */}
        {banner.type === "image" && (
          <img
            key={banner.src}
            src={banner.src}
            className="w-full h-full object-contain"
          />
        )}

        {banner.type === "video" && (
          <video
            key={banner.src}
            src={banner.src}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        )}

        {banner.type === "youtube" && (
          <iframe
            key={banner.src}
            src={getYouTubeEmbedUrl(banner.src)}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   CAROUSEL
───────────────────────────────────────────── */

const Carousel = ({ banners, aspectRatio, className = "" }) => {
  const navigate = useNavigate();
  const [cur, setCur] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const next = useCallback(
    () => setCur((c) => (c + 1) % banners.length),
    [banners.length]
  );

  const prev = useCallback(
    () => setCur((c) => (c - 1 + banners.length) % banners.length),
    [banners.length]
  );

  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next]);

  /* ✅ YouTube converter */
  const getYouTubeEmbedUrl = (url) => {
    try {
      let videoId = "";

      if (url.includes("youtu.be")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      } else if (url.includes("youtube.com/watch")) {
        videoId = new URL(url).searchParams.get("v");
      } else if (url.includes("youtube.com/embed")) {
        videoId = url.split("/embed/")[1]?.split("?")[0];
      }

      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0`;
    } catch {
      return "";
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {banners.map((b, i) => (
        <div
          key={b.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === cur ? 1 : 0 }}
        >
          <div className="relative w-full h-full">

            {/* MEDIA */}
            {b.type === "image" && (
              <img src={b.src} className="w-full h-full object-cover" />
            )}

            {b.type === "video" && (
              <video
                src={b.src}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              />
            )}

            {b.type === "youtube" && (
              <iframe
                src={getYouTubeEmbedUrl(b.src)}
                className="w-full h-full object-cover pointer-events-none"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}

            {/* BUTTON */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setSelectedBanner(b)}
                className="px-6 py-3 rounded-full bg-white/90 text-black font-semibold hover:scale-105 transition"
              >
                {b.type === "image" ? "View" : "Play"}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* ARROWS */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <button onClick={prev} className="text-white text-xl">◀</button>
      </div>

      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <button onClick={next} className="text-white text-xl">▶</button>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCur(i)}
            className={`h-2 rounded-full ${
              i === cur ? "w-6 bg-white" : "w-2 bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* MODAL */}
      <BannerModal
        banner={selectedBanner}
        onClose={() => setSelectedBanner(null)}
        getYouTubeEmbedUrl={getYouTubeEmbedUrl}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */

export default function HeroBanner() {
  return (
    <section className="w-full bg-black">
      <Carousel
        banners={MOBILE_BANNERS}
        aspectRatio="9/14"
        className="block md:hidden"
      />
      <Carousel
        banners={DESKTOP_BANNERS}
        aspectRatio="21/7"
        className="hidden md:block"
      />
    </section>
  );
}