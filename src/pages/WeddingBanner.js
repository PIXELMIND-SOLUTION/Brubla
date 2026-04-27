import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   DECORATIVE SVG BACKGROUND (ENHANCED)
───────────────────────────────────────────── */
const PatternBg = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 900 500"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path
          d="M 60 0 L 0 0 0 60"
          fill="none"
          stroke="white"
          strokeWidth="0.2"
          opacity="0.1"
        />
      </pattern>
    </defs>

    <rect width="900" height="500" fill="url(#grid)" />

    {/* Softer glow circles */}
    <circle cx="750" cy="80" r="160" stroke="white" strokeWidth="0.3" fill="none" opacity="0.08" />
    <circle cx="150" cy="420" r="120" stroke="white" strokeWidth="0.3" fill="none" opacity="0.06" />
    <circle cx="450" cy="250" r="160" stroke="white" strokeWidth="0.3" fill="none" opacity="0.05" />
  </svg>
);

/* ─────────────────────────────────────────────
   BANNER SECTION (PREMIUM UI)
───────────────────────────────────────────── */
export const BannerSection = ({ onEnter }) => {
  const navigate = useNavigate();

  return (
    <section className="bg-black flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-16 md:py-24 lg:py-32">

      <PatternBg />

      {/* Premium Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center mb-6 sm:mb-10 md:mb-14">
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.2rem,4vw,4rem)",
          }}
          className="text-white leading-tight tracking-tight"
        >
          Dress Your
        </h1>

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.2rem,4vw,4rem)",
            fontStyle: "italic",
          }}
          className="text-white/20 leading-tight tracking-tight"
        >
          Perfect Day
        </h1>
      </div>

      <div
  onClick={onEnter}
  className="
    relative w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl
    cursor-pointer group overflow-hidden rounded-xl
    transition-all duration-500
    hover:scale-[1.01]
  "
  style={{ aspectRatio: "21/10" }}
>

  {/* 🔥 Background Glow UNDER card */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute -top-10 left-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
    <div className="absolute bottom-[-30px] right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
  </div>

  {/* 💎 Glass Base */}
  <div className="
    absolute inset-0
    bg-white/[0.05]
    backdrop-blur-xl
    border border-white/10
    shadow-[0_10px_50px_rgba(0,0,0,0.6)]
  " />

  {/* ✨ Glass Reflection */}
  <div className="
    absolute inset-0
    bg-gradient-to-br
    from-white/10 via-transparent to-transparent
    opacity-40
  " />

  {/* 🎯 Inner Glow */}
  <div className="
    absolute inset-0
    rounded-xl
    shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]
  " />

  {/* 📏 Vertical Lines */}
  {Array.from({ length: 12 }).map((_, i) => (
    <div
      key={i}
      className="absolute inset-y-0 opacity-[0.04]"
      style={{
        left: `${(i + 1) * 7}%`,
        width: "1px",
        background: "white",
      }}
    />
  ))}

  {/* 🪟 Soft Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

  {/* 🧩 Decorative Elements UNDER content */}
  <div className="absolute inset-0 pointer-events-none">
    {/* Floating dots */}
    <div className="absolute top-6 left-10 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
    <div className="absolute bottom-8 right-12 w-2 h-2 bg-white/20 rounded-full animate-pulse" />

    {/* Thin lines */}
    <div className="absolute top-10 right-10 w-20 h-px bg-white/20" />
    <div className="absolute bottom-10 left-10 w-16 h-px bg-white/20" />
  </div>

  {/* 🔲 Corner Borders */}
  {[
    "top-2 left-2 border-t border-l",
    "top-2 right-2 border-t border-r",
    "bottom-2 left-2 border-b border-l",
    "bottom-2 right-2 border-b border-r",
  ].map((cls) => (
    <div
      key={cls}
      className={`absolute w-4 h-4 sm:w-6 sm:h-6 ${cls} border-white/40 group-hover:border-white/70 transition`}
    />
  ))}

  {/* 📝 Content */}
  <div
    onClick={() => navigate("/wedding")}
    className="absolute inset-0 flex flex-col items-center justify-center px-3 sm:px-6 text-center"
  >
    <p className="text-white/40 text-[9px] sm:text-xs uppercase mb-1 sm:mb-2 tracking-[0.2em]">
      Wedding Fashion Planner
    </p>

    <h2 className="text-white text-sm sm:text-lg md:text-2xl lg:text-3xl font-serif mb-1 sm:mb-2 transition duration-500 group-hover:scale-[1.05]">
      Plan Every Look. For Every Moment.
    </h2>

    <p className="text-white/40 text-[9px] sm:text-xs uppercase tracking-wider">
      Bridal · Groom · Events · Budget
    </p>

    {/* CTA */}
    <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-4 text-white">
      <div className="h-px w-6 sm:w-10 bg-white/30 group-hover:w-16 transition-all duration-500" />
      <span className="text-[9px] sm:text-xs uppercase tracking-[0.3em]">
        Begin
      </span>
      <div className="h-px w-6 sm:w-10 bg-white/30 group-hover:w-16 transition-all duration-500" />
    </div>
  </div>

  {/* 🔥 Bottom Hover Line */}
  <div className="absolute bottom-0 left-0 h-px bg-white w-0 group-hover:w-full transition-all duration-700" />
</div>

      {/* Footer */}
      <p className="text-white/10 text-[9px] sm:text-xs md:text-sm uppercase mt-5 sm:mt-8 md:mt-10 text-center tracking-[0.4em]">
        ------------------
      </p>
    </section>
  );
};