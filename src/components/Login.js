import { useState, useEffect, useRef } from "react";

const letters = ["B", "R", "U", "B", "L", "A"];

function AnimatedLetter({ char, index, phase }) {
  const [hovered, setHovered] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const glitchTimer = useRef(null);
  const floatDelays = [0, 0.4, 0.8, 1.2, 1.6, 2.0];
  const entryDelays = [0, 0.12, 0.24, 0.36, 0.48, 0.6];

  const triggerGlitch = () => {
    setGlitching(true);
    clearTimeout(glitchTimer.current);
    glitchTimer.current = setTimeout(() => setGlitching(false), 550);
  };

  return (
    <span
      onMouseEnter={() => { setHovered(true); triggerGlitch(); }}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-block",
        position: "relative",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontWeight: 900,
        fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
        color: hovered ? "#000" : "#fff",
        background: hovered ? "#fff" : "transparent",
        letterSpacing: "-0.02em",
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
          : "0 0 40px rgba(255,255,255,0.12)",
        cursor: "default",
        padding: "0 3px",
        borderRadius: "2px",
        zIndex: hovered ? 20 : 1,
      }}
    >
      {/* Glitch layer Red */}
      {glitching && (
        <span aria-hidden="true" style={{
          position: "absolute", inset: 0,
          color: hovered ? "#333" : "#fff",
          fontFamily: "inherit", fontWeight: "inherit", fontSize: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "glitchR 0.55s steps(1) forwards",
          pointerEvents: "none",
        }}>{char}</span>
      )}
      {/* Glitch layer Blue */}
      {glitching && (
        <span aria-hidden="true" style={{
          position: "absolute", inset: 0,
          color: "#888",
          fontFamily: "inherit", fontWeight: "inherit", fontSize: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "glitchL 0.55s steps(1) forwards",
          pointerEvents: "none",
        }}>{char}</span>
      )}
      {char}
    </span>
  );
}

function Modal({ show, onSelect, onClose }) {
  if (!show) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(5px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#0c0c0c", border: "1px solid #222", borderRadius: "2px", padding: "3rem 2.5rem", width: "min(90vw, 380px)", textAlign: "center", animation: "slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards" }}>
        <p style={{ color: "#555", fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "2rem" }}>Continue as</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button onClick={() => onSelect("login")} style={{ background: "#fff", color: "#000", border: "none", padding: "1rem 2rem", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 800, cursor: "pointer", borderRadius: "1px", transition: "background 0.2s, transform 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ddd"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "none"; }}>
            Sign In
          </button>
          <button onClick={() => onSelect("register")} style={{ background: "transparent", color: "#fff", border: "1px solid #333", padding: "1rem 2rem", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", borderRadius: "1px", transition: "border-color 0.2s, transform 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#888"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.transform = "none"; }}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

function FormView({ type, onBack, onSubmit }) {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const fields = type === "login"
    ? [{ key: "email", label: "Email", type: "email" }, { key: "password", label: "Password", type: "password" }]
    : [{ key: "name", label: "Full Name", type: "text" }, { key: "email", label: "Email", type: "email" }, { key: "password", label: "Password", type: "password" }, { key: "confirm", label: "Confirm Password", type: "password" }];

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <div style={{ width: 54, height: 54, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "22px", animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>✓</div>
        <p style={{ color: "#fff", fontSize: "13px", letterSpacing: "0.15em" }}>{type === "login" ? "Welcome back." : "Account created."}</p>
      </div>
    );
  }

  return (
    <div style={{ animation: "slideUp 0.45s cubic-bezier(0.34,1.2,0.64,1) forwards" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#444", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer", padding: "0 0 1.75rem", display: "flex", alignItems: "center", gap: "8px" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}>← Back</button>
      <h2 style={{ fontFamily: "'Georgia', serif", color: "#fff", fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>
        {type === "login" ? "Welcome back" : "Join Brubla"}
      </h2>
      <p style={{ color: "#444", fontSize: "12px", marginBottom: "2.25rem", letterSpacing: "0.05em" }}>
        {type === "login" ? "Sign in to continue" : "Create your account"}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem", marginBottom: "2rem" }}>
        {fields.map((f) => (
          <div key={f.key}>
            <label style={{ color: "#555", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>{f.label}</label>
            <input type={f.type} value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              onFocus={() => setFocused(f.key)} onBlur={() => setFocused(null)}
              style={{ background: "transparent", border: "none", borderBottom: `1px solid ${focused === f.key ? "#fff" : "#2e2e2e"}`, color: "#fff", fontSize: "15px", padding: "8px 0", width: "100%", outline: "none", transition: "border-color 0.2s", fontFamily: "inherit" }} />
          </div>
        ))}
      </div>
      <button onClick={() => { setSubmitted(true); setTimeout(() => onSubmit(), 1300); }}
        style={{ width: "100%", background: "#fff", color: "#000", border: "none", padding: "1rem", fontSize: "10px", letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 800, cursor: "pointer", borderRadius: "1px", transition: "transform 0.15s, background 0.2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#ddd"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "none"; }}>
        {type === "login" ? "Sign In" : "Create Account"}
      </button>
    </div>
  );
}

export default function BrublaLogin() {
  const [phase, setPhase] = useState("landing");
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState(null);
  const [done, setDone] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase("idle"), 120);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (type) => { setShowModal(false); setFormType(type); };
  const handleSubmit = () => {
    setDone(true);
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
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #0c0c0c inset !important; -webkit-text-fill-color: #fff !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", position: "relative", overflow: "hidden" }}>

        {/* ── YouTube video background ── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
          <iframe
            title="bg-video"
            src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&loop=1&playlist=jfKfPfyJRdk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3"
            allow="autoplay; fullscreen"
            frameBorder="0"
            onLoad={() => setVideoReady(true)}
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: "177.78vh", height: "100vh",
              minWidth: "100vw", minHeight: "56.25vw",
              transform: "translate(-50%,-50%)",
              pointerEvents: "none",
              opacity: videoReady ? 1 : 0,
              transition: "opacity 2s ease",
            }}
          />
          {/* B&W desaturate + darken overlay */}
          <div style={{ position: "absolute", inset: 0, backdropFilter: "grayscale(100%) brightness(0.45) contrast(1.1)", WebkitBackdropFilter: "grayscale(100%) brightness(0.45) contrast(1.1)" }} />
          {/* Extra dimming vignette */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)" }} />
        </div>

        {/* Corner marks */}
        {[{ top: 28, left: 28 }, { top: 28, right: 28 }, { bottom: 28, left: 28 }, { bottom: 28, right: 28 }].map((pos, i) => (
          <div key={i} style={{ position: "absolute", ...pos, width: 22, height: 22, borderTop: i < 2 ? "1px solid #3a3a3a" : "none", borderBottom: i >= 2 ? "1px solid #3a3a3a" : "none", borderLeft: i % 2 === 0 ? "1px solid #3a3a3a" : "none", borderRight: i % 2 === 1 ? "1px solid #3a3a3a" : "none", zIndex: 5 }} />
        ))}

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem", padding: "2rem", width: "min(90vw, 500px)" }}>

          {/* Animated letters */}
          <div style={{ display: "flex", gap: "0.01em", userSelect: "none" }}>
            {letters.map((char, i) => (
              <AnimatedLetter key={i} char={char} index={i} phase={phase} />
            ))}
          </div>

          {/* Tagline */}
          <p style={{ color: "#444", fontSize: "10px", letterSpacing: "0.42em", textTransform: "uppercase", marginTop: "-1.5rem", opacity: phase === "idle" ? 1 : 0, transition: "opacity 0.7s ease 0.9s" }}>
            Where it begins
          </p>

          {/* CTA or Form */}
          {formType ? (
            <div style={{ width: "100%", background: "rgba(6,6,6,0.92)", border: "1px solid #1c1c1c", borderRadius: "2px", padding: "2.5rem", backdropFilter: "blur(10px)" }}>
              {done ? (
                <div style={{ textAlign: "center", padding: "3.5rem 0" }}>
                  <div style={{ width: 54, height: 54, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "22px", animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>✓</div>
                  <p style={{ color: "#fff", fontSize: "13px", letterSpacing: "0.15em" }}>{formType === "login" ? "Welcome back." : "Account created."}</p>
                </div>
              ) : (
                <FormView type={formType} onBack={() => setFormType(null)} onSubmit={handleSubmit} />
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", opacity: phase === "idle" ? 1 : 0, transform: phase === "idle" ? "none" : "translateY(20px)", transition: "opacity 0.6s ease 1.05s, transform 0.6s ease 1.05s" }}>
              <button onClick={() => setShowModal(true)}
                style={{ background: "#fff", color: "#000", border: "none", padding: "1rem 3.5rem", fontSize: "10px", letterSpacing: "0.42em", textTransform: "uppercase", fontWeight: 800, cursor: "pointer", borderRadius: "1px", transition: "transform 0.2s, background 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ddd"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "none"; }}>
                Sign In
              </button>
              <p style={{ color: "#3a3a3a", fontSize: "10px", letterSpacing: "0.15em" }}>
                New here?{" "}
                <span onClick={() => handleSelect("register")} style={{ color: "#666", cursor: "pointer", textDecoration: "underline" }}
                  onMouseEnter={(e) => (e.target.style.color = "#aaa")}
                  onMouseLeave={(e) => (e.target.style.color = "#666")}>
                  Create an account
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p style={{ position: "absolute", bottom: "1.5rem", color: "#252525", fontSize: "10px", letterSpacing: "0.2em", zIndex: 10 }}>© 2026 BRUBLA</p>
      </div>

      <Modal show={showModal} onSelect={handleSelect} onClose={() => setShowModal(false)} />
    </>
  );
}