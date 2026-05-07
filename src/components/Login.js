import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const letters = ["B", "R", "U", "B", "L", "A"];

function AnimatedLetter({ char, index, phase }) {
  const [hovered, setHovered] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [deviceSize, setDeviceSize] = useState("desktop");
  const glitchTimer = useRef(null);
  const floatDelays = [0, 0.4, 0.8, 1.2, 1.6, 2.0];
  const entryDelays = [0, 0.12, 0.24, 0.36, 0.48, 0.6];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setDeviceSize("mobile");
      else if (width < 768) setDeviceSize("tablet");
      else if (width < 1024) setDeviceSize("laptop");
      else setDeviceSize("desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getFontSize = () => {
    switch (deviceSize) {
      case "mobile":
        return "clamp(1.8rem, 8vw, 2.2rem)";
      case "tablet":
        return "clamp(2.5rem, 7vw, 3.2rem)";
      case "laptop":
        return "clamp(3rem, 5vw, 4rem)";
      default:
        return "clamp(3.5rem, 4.5vw, 5rem)";
    }
  };

  const getPadding = () => {
    switch (deviceSize) {
      case "mobile":
        return "0 1px";
      case "tablet":
        return "0 2px";
      default:
        return "0 3px";
    }
  };

  const triggerGlitch = () => {
    setGlitching(true);
    clearTimeout(glitchTimer.current);
    glitchTimer.current = setTimeout(() => setGlitching(false), 550);
  };

  return (
    <span
      onMouseEnter={() => { setHovered(true); triggerGlitch(); }}
      onMouseLeave={() => setHovered(false)}
      className={`relative inline-block font-['Inter,_Helvetica_Neue,_Arial,_sans-serif'] font-black cursor-default rounded-sm transition-all duration-300 z-[1] hover:z-20 ${hovered ? "text-black bg-white" : "text-white bg-transparent"
        }`}
      style={{
        fontSize: getFontSize(),
        letterSpacing: index === letters.length - 1 ? "0" : "-0.02em",
        opacity: phase === "landing" ? 0 : 1,
        transform:
          phase === "landing"
            ? "translateY(-80px) scale(1.3)"
            : hovered
              ? "translateY(-10px) scale(1.18) rotate(-3deg)"
              : "translateY(0px) scale(1)",
        transition: `opacity 0.7s ease ${entryDelays[index]}s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.1s, background 0.1s`,
        animation:
          phase === "idle" && !hovered && !glitching
            ? `floatLetter 3s ease-in-out ${floatDelays[index]}s infinite`
            : "none",
        textShadow: hovered
          ? "3px 3px 0 #555, -2px -2px 0 #999"
          : deviceSize === "mobile"
            ? "0 0 20px rgba(255,255,255,0.1)"
            : "0 0 40px rgba(255,255,255,0.12)",
        padding: getPadding(),
      }}
    >
      {/* Glitch layer Red */}
      {glitching && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            color: hovered ? "#333" : "#fff",
            fontFamily: "inherit",
            fontWeight: "inherit",
            fontSize: "inherit",
            animation: "glitchR 0.55s steps(1) forwards",
          }}
        >
          {char}
        </span>
      )}
      {/* Glitch layer Blue */}
      {glitching && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            color: "#888",
            fontFamily: "inherit",
            fontWeight: "inherit",
            fontSize: "inherit",
            animation: "glitchL 0.55s steps(1) forwards",
          }}
        >
          {char}
        </span>
      )}
      {char}
    </span>
  );
}

function FormView({ type, onBack, onSubmit }) {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fields = type === "login"
    ? [
      { key: "email", label: "Email", type: "email" },
      { key: "password", label: "Password", type: "password" }
    ]
    : [
      { key: "name", label: "Full Name", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "password", label: "Password", type: "password" },
      { key: "confirm", label: "Confirm Password", type: "password" }
    ];

  if (submitted) {
    return (
      <div className="text-center py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 text-lg sm:text-xl md:text-2xl animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
          ✓
        </div>
        <p className="text-white text-xs sm:text-sm md:text-base tracking-wide font-['Inter',sans-serif]">
          {type === "login" ? "Welcome back." : "Account created."}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-[slideUp_0.45s_cubic-bezier(0.34,1.2,0.64,1)_forwards]">
      <button
        onClick={onBack}
        className="bg-transparent border-none text-gray-500 hover:text-gray-300 text-[10px] sm:text-[11px] md:text-xs tracking-[0.2em] uppercase cursor-pointer p-0 pb-4 sm:pb-5 md:pb-6 flex items-center gap-1.5 sm:gap-2 font-['Inter',sans-serif] transition-colors"
      >
        ← Back
      </button>
      <h2 className="font-['Inter',_Helvetica_Neue,_sans-serif] text-white text-xl sm:text-2xl md:text-3xl font-bold mb-1 tracking-tight">
        {type === "login" ? "Welcome back" : "Join Brubla"}
      </h2>
      <p className="text-gray-500 text-[10px] sm:text-[11px] md:text-xs mb-5 sm:mb-6 md:mb-8 tracking-wide font-['Inter',sans-serif]">
        {type === "login" ? "Sign in to continue" : "Create your account"}
      </p>
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 mb-5 sm:mb-6 md:mb-8">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.2em] uppercase block mb-1 font-['Inter',sans-serif]">
              {f.label}
            </label>
            <input
              type={f.type}
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              onFocus={() => setFocused(f.key)}
              onBlur={() => setFocused(null)}
              className="bg-transparent border-none border-b border-b-gray-800 focus:border-b-white text-white text-sm sm:text-base py-1.5 sm:py-2 w-full outline-none transition-colors font-['Inter',sans-serif]"
              style={{ borderBottomColor: focused === f.key ? "#fff" : "#2e2e2e" }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => { setSubmitted(true); setTimeout(() => onSubmit(), 1300); }}
        className="w-full bg-white text-black border-none py-2.5 sm:py-3 md:py-4 text-[10px] sm:text-[11px] md:text-xs tracking-[0.3em] uppercase font-bold cursor-pointer rounded-sm transition-all duration-200 hover:bg-gray-200 hover:-translate-y-px font-['Inter',sans-serif]"
      >
        {type === "login" ? "Sign In" : "Create Account"}
      </button>
    </div>
  );
}

export default function BrublaLogin() {
  const [phase, setPhase] = useState("landing");
  const [formType, setFormType] = useState(null);
  const [done, setDone] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setPhase("idle"), 120);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = () => {
    setDone(true);
    navigate('/home');
    sessionStorage.setItem("token", "b_r_u_l_a");
    setTimeout(() => { setDone(false); setFormType(null); }, 2200);
  };

  return (
    <>
      <style>{`
        @keyframes floatLetter {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(26px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes glitchR {
          0%   { clip-path: inset(15% 0 70% 0); transform: translate(7px, 1px);  opacity: 0.85; }
          15%  { clip-path: inset(65% 0 15% 0); transform: translate(-5px,-2px); opacity: 0.7;  }
          30%  { clip-path: inset(35% 0 45% 0); transform: translate(9px, 3px);  opacity: 0.9;  }
          45%  { clip-path: inset(80% 0 5%  0); transform: translate(-7px,0px);  opacity: 0.6;  }
          60%  { clip-path: inset(5%  0 75% 0); transform: translate(4px, -3px); opacity: 0.75; }
          75%  { clip-path: inset(50% 0 35% 0); transform: translate(-3px, 4px); opacity: 0.5;  }
          90%  { clip-path: inset(25% 0 60% 0); transform: translate(6px, -1px); opacity: 0.3;  }
          100% { clip-path: inset(0 0 0 0);     transform: translate(0, 0);      opacity: 0;    }
        }
        @keyframes glitchL {
          0%   { clip-path: inset(55% 0 25% 0); transform: translate(-8px, 2px); opacity: 0.8;  }
          15%  { clip-path: inset(10% 0 65% 0); transform: translate(6px, -3px); opacity: 0.65; }
          30%  { clip-path: inset(75% 0 10% 0); transform: translate(-9px, 1px); opacity: 0.9;  }
          45%  { clip-path: inset(30% 0 50% 0); transform: translate(5px, -2px); opacity: 0.5;  }
          60%  { clip-path: inset(85% 0 5%  0); transform: translate(-4px, 4px); opacity: 0.7;  }
          75%  { clip-path: inset(20% 0 60% 0); transform: translate(7px, 0px);  opacity: 0.4;  }
          90%  { clip-path: inset(60% 0 30% 0); transform: translate(-3px,-2px); opacity: 0.2;  }
          100% { clip-path: inset(0 0 0 0);     transform: translate(0, 0);      opacity: 0;    }
        }
        @keyframes videoFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:-webkit-autofill { 
          -webkit-box-shadow: 0 0 0 1000px #0c0c0c inset !important; 
          -webkit-text-fill-color: #fff !important; 
        }
      `}</style>

      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden p-3 sm:p-4 font-['Inter',_Helvetica_Neue,_Arial,_sans-serif]">

        {/* YouTube video background */}
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            title="bg-video"
            src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&loop=1&playlist=jfKfPfyJRdk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3"
            allow="autoplay; fullscreen"
            frameBorder="0"
            onLoad={() => setVideoReady(true)}
            className={`
              absolute
              top-1/2
              left-1/2
              -translate-x-1/2
              -translate-y-1/2
              pointer-events-none
              transition-opacity
              duration-1000

              w-[300vw]
              h-[170vw]

              sm:w-[220vw]
              sm:h-[125vw]

              md:w-[180vw]
              md:h-[101vw]

              lg:w-[140vw]
              lg:h-[78vw]

              xl:w-[120vw]
              xl:h-[67.5vw]

              min-w-full
              min-h-full
            `}
            style={{
              opacity: videoReady ? 1 : 0,
            }}
          />
          {/* B&W desaturate + darken overlay */}
          <div className="absolute inset-0 backdrop-grayscale backdrop-brightness-[0.45] backdrop-contrast-110" />
          {/* Extra dimming vignette */}
          <div className="absolute inset-0 bg-gradient-radial from-black/30 via-transparent to-black/75" />
        </div>

        {/* Corner marks - responsive */}
        {[
          { top: "clamp(0.6rem, 3vw, 28px)", left: "clamp(0.6rem, 3vw, 28px)", borderTop: true, borderLeft: true },
          { top: "clamp(0.6rem, 3vw, 28px)", right: "clamp(0.6rem, 3vw, 28px)", borderTop: true, borderRight: true },
          { bottom: "clamp(0.6rem, 3vw, 28px)", left: "clamp(0.6rem, 3vw, 28px)", borderBottom: true, borderLeft: true },
          { bottom: "clamp(0.6rem, 3vw, 28px)", right: "clamp(0.6rem, 3vw, 28px)", borderBottom: true, borderRight: true }
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-[clamp(12px,4vw,22px)] h-[clamp(12px,4vw,22px)] border-[#3a3a3a] z-[5]"
            style={{
              ...pos,
              borderTopWidth: pos.borderTop ? "1px" : "0",
              borderBottomWidth: pos.borderBottom ? "1px" : "0",
              borderLeftWidth: pos.borderLeft ? "1px" : "0",
              borderRightWidth: pos.borderRight ? "1px" : "0",
            }}
          />
        ))}

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 p-3 sm:p-4 md:p-6 lg:p-8 w-[min(92vw,500px)]">

          {/* Animated letters - responsive layout */}
          <div className="flex gap-0 sm:gap-0.5 md:gap-1 user-select-none flex-wrap justify-center px-1 sm:px-2 md:px-4">
            {letters.map((char, i) => (
              <AnimatedLetter key={i} char={char} index={i} phase={phase} />
            ))}
          </div>

          {/* Tagline - responsive */}
          <p
            className="text-gray-500 text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-center px-2 font-['Inter',sans-serif] transition-all duration-700 ease-out"
            style={{
              opacity: phase === "idle" ? 1 : 0,
              transitionDelay: "0.9s",
              marginTop: "-0.25rem",
            }}
          >
            Where it begins
          </p>

          {/* CTA or Form - responsive */}
          {formType ? (
            <div className="w-full bg-black/90 border border-[#1c1c1c] rounded-sm p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-md">
              {done ? (
                <div className="text-center py-4 sm:py-6 md:py-8 lg:py-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-white flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 text-lg sm:text-xl md:text-2xl animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
                    ✓
                  </div>
                  <p className="text-white text-xs sm:text-sm md:text-base tracking-wide font-['Inter',sans-serif]">
                    {formType === "login" ? "Welcome back." : "Account created."}
                  </p>
                </div>
              ) : (
                <FormView type={formType} onBack={() => setFormType(null)} onSubmit={handleSubmit} />
              )}
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-3 sm:gap-4 transition-all duration-600 ease-out w-full"
              style={{
                opacity: phase === "idle" ? 1 : 0,
                transform: phase === "idle" ? "none" : "translateY(20px)",
                transitionDelay: "1.05s",
              }}
            >
              <button
                onClick={() => setFormType("login")}
                className="bg-white text-black border-none py-2.5 px-6 sm:py-3 sm:px-8 md:py-3.5 md:px-10 lg:py-4 lg:px-12 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs tracking-[0.3em] sm:tracking-[0.35em] uppercase font-bold cursor-pointer rounded-sm transition-all duration-200 hover:bg-gray-200 hover:-translate-y-0.5 w-full max-w-[260px] sm:max-w-[280px] font-['Inter',sans-serif]"
              >
                Sign In
              </button>
              <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs tracking-wide font-['Inter',sans-serif]">
                New here?{" "}
                <span
                  onClick={() => setFormType("register")}
                  className="text-gray-400 cursor-pointer underline transition-colors hover:text-gray-300"
                >
                  Create an account
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer - responsive */}
        <p className="absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 text-gray-800 text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] z-10 font-['Inter',sans-serif]">
          © 2026 BRUBLA
        </p>
      </div>
    </>
  );
}