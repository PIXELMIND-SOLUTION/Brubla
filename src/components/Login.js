import { useState, useEffect, useRef, use } from "react";
import { useNavigate } from "react-router-dom";

const letters = ["B", "R", "U", "B", "L", "A"];

const BASE = "http://31.97.228.17:4077/api/users";
const LOGIN_INIT = "http://31.97.228.17:4077/api/users/login";

async function apiPost(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

// ─── Animated Letter ────────────────────────────────────────────────
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
      case "mobile": return "clamp(1.8rem, 8vw, 2.2rem)";
      case "tablet": return "clamp(2.5rem, 7vw, 3.2rem)";
      case "laptop": return "clamp(3rem, 5vw, 4rem)";
      default: return "clamp(3.5rem, 4.5vw, 5rem)";
    }
  };

  const getPadding = () => {
    switch (deviceSize) {
      case "mobile": return "0 1px";
      case "tablet": return "0 2px";
      default: return "0 3px";
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
      className={`relative inline-block font-black cursor-default rounded-sm transition-all duration-300 z-[1] hover:z-20 ${
        hovered ? "text-black bg-white" : "text-white bg-transparent"
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
          : "0 0 40px rgba(255,255,255,0.12)",
        padding: getPadding(),
      }}
    >
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
        >{char}</span>
      )}
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
        >{char}</span>
      )}
      {char}
    </span>
  );
}

// ─── OTP Step ────────────────────────────────────────────────────────
function OtpStep({ mobile, token, type, onSuccess, onBack }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const verifyEndpoint =
    type === "login"
      ? `${BASE}/login/verify-otp`
      : `${BASE}/register/verify-otp`;

  const handleVerify = async () => {
    if (otp.length < 4) { setError("Enter the OTP"); return; }
    setLoading(true);
    setError("");
    try {
      const data = await apiPost(verifyEndpoint, { mobile, token, otp });
      // Store auth token/user from response
      if (data.token) sessionStorage.setItem("authToken", data.token);
      if (data.user) sessionStorage.setItem("user", JSON.stringify(data.user));
      onSuccess(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg("");
    setError("");
    try {
      await apiPost(`${BASE}/resend-otp`, { mobile });
      setResendMsg("OTP resent successfully.");
      setCountdown(30);
    } catch (e) {
      setError(e.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="animate-[slideUp_0.45s_cubic-bezier(0.34,1.2,0.64,1)_forwards]">
      <button
        onClick={onBack}
        className="bg-transparent border-none text-gray-500 hover:text-gray-300 text-[10px] tracking-[0.2em] uppercase cursor-pointer p-0 pb-5 flex items-center gap-2 font-['Inter',sans-serif] transition-colors"
      >
        ← Back
      </button>
      <h2 className="text-white text-xl sm:text-2xl font-bold mb-1 tracking-tight font-['Inter',sans-serif]">
        Verify OTP
      </h2>
      <p className="text-gray-500 text-[10px] mb-6 tracking-wide font-['Inter',sans-serif]">
        Sent to <span className="text-gray-300">+91 {mobile}</span>
      </p>

      <div className="mb-6">
        <label className="text-gray-500 text-[9px] tracking-[0.2em] uppercase block mb-1 font-['Inter',sans-serif]">
          One-Time Password
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={otp}
          onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
          className="bg-transparent border-none text-white text-xl tracking-[0.5em] py-2 w-full outline-none font-['Inter',sans-serif]"
          style={{ borderBottom: "1px solid #2e2e2e" }}
          placeholder="——"
          autoFocus
        />
      </div>

      {error && (
        <p className="text-red-400 text-[10px] tracking-wide mb-4 font-['Inter',sans-serif]">{error}</p>
      )}
      {resendMsg && (
        <p className="text-green-400 text-[10px] tracking-wide mb-4 font-['Inter',sans-serif]">{resendMsg}</p>
      )}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-white text-black border-none py-3 text-[10px] tracking-[0.3em] uppercase font-bold cursor-pointer rounded-sm transition-all duration-200 hover:bg-gray-200 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed font-['Inter',sans-serif] mb-4"
      >
        {loading ? "Verifying…" : "Verify"}
      </button>

      <p className="text-center text-gray-600 text-[9px] tracking-wide font-['Inter',sans-serif]">
        {countdown > 0 ? (
          <>Resend in <span className="text-gray-400">{countdown}s</span></>
        ) : (
          <span
            onClick={!resending ? handleResend : undefined}
            className={`text-gray-400 underline cursor-pointer hover:text-gray-300 transition-colors ${resending ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {resending ? "Resending…" : "Resend OTP"}
          </span>
        )}
      </p>
    </div>
  );
}

// ─── Form View ───────────────────────────────────────────────────────
function FormView({ type, onBack, onOtpRequired }) {
  const [values, setValues] = useState({ name: "", mobile: "", email: "", role: "Tailor", password: "" });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginFields = [
    { key: "mobile", label: "Mobile Number", type: "tel", placeholder: "9XXXXXXXXX" },
  ];

  const registerFields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Priya Sharma" },
    { key: "mobile", label: "Mobile Number", type: "tel", placeholder: "9XXXXXXXXX" },
    { key: "email", label: "Email", type: "email", placeholder: "you@email.com" },
    {
      key: "role", label: "Role", type: "select",
      options: ["Tailor", "User", "Admin", "Manager"],
    },
  ];

  const fields = type === "login" ? loginFields : registerFields;

  const handleSubmit = async () => {
    setError("");
    if (!values.mobile || values.mobile.length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    if (type === "register" && !values.name.trim()) {
      setError("Name is required");
      return;
    }
    if (type === "register" && !values.email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      let data;
      if (type === "login") {
        data = await apiPost(LOGIN_INIT, { mobile: values.mobile });
      } else {
        data = await apiPost(`${BASE}/register`, {
          name: values.name,
          mobile: values.mobile,
          email: values.email,
          role: values.role,
        });
      }
      // Expect { token, ... } back
      const otpToken = data.token || data.data?.token;
      if (!otpToken) throw new Error("No token received from server");
      onOtpRequired({ mobile: values.mobile, token: otpToken });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-[slideUp_0.45s_cubic-bezier(0.34,1.2,0.64,1)_forwards]">
      <button
        onClick={onBack}
        className="bg-transparent border-none text-gray-500 hover:text-gray-300 text-[10px] tracking-[0.2em] uppercase cursor-pointer p-0 pb-5 flex items-center gap-2 font-['Inter',sans-serif] transition-colors"
      >
        ← Back
      </button>
      <h2 className="text-white text-xl sm:text-2xl font-bold mb-1 tracking-tight font-['Inter',sans-serif]">
        {type === "login" ? "Welcome back" : "Join Brubla"}
      </h2>
      <p className="text-gray-500 text-[10px] mb-6 tracking-wide font-['Inter',sans-serif]">
        {type === "login" ? "Enter your mobile to receive OTP" : "Create your account"}
      </p>

      <div className="flex flex-col gap-4 mb-6">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-gray-500 text-[9px] tracking-[0.2em] uppercase block mb-1 font-['Inter',sans-serif]">
              {f.label}
            </label>
            {f.type === "select" ? (
              <select
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                className="bg-[#0c0c0c] border-none text-white text-sm py-2 w-full outline-none font-['Inter',sans-serif] cursor-pointer"
                style={{ borderBottom: `1px solid ${focused === f.key ? "#fff" : "#2e2e2e"}` }}
                onFocus={() => setFocused(f.key)}
                onBlur={() => setFocused(null)}
              >
                {f.options.map((o) => (
                  <option key={o} value={o} className="bg-[#0c0c0c]">{o}</option>
                ))}
              </select>
            ) : (
              <input
                type={f.type}
                value={values[f.key]}
                maxLength={10}
                placeholder={f.placeholder}
                onChange={(e) => { setValues((v) => ({ ...v, [f.key]: e.target.value })); setError(""); }}
                onFocus={() => setFocused(f.key)}
                onBlur={() => setFocused(null)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="bg-transparent border-none text-white text-sm py-2 w-full outline-none transition-colors font-['Inter',sans-serif] placeholder-gray-700"
                style={{ borderBottom: `1px solid ${focused === f.key ? "#fff" : "#2e2e2e"}` }}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-[10px] tracking-wide mb-4 font-['Inter',sans-serif]">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-white text-black border-none py-3 text-[10px] tracking-[0.3em] uppercase font-bold cursor-pointer rounded-sm transition-all duration-200 hover:bg-gray-200 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed font-['Inter',sans-serif]"
      >
        {loading ? "Please wait…" : type === "login" ? "Send OTP" : "Register & Send OTP"}
      </button>
    </div>
  );
}

// ─── Success Screen ──────────────────────────────────────────────────
// Removed - now navigates directly to /home

// ─── Main Component ──────────────────────────────────────────────────
export default function BrublaLogin() {
  const [phase, setPhase] = useState("landing");
  // view: null | "login" | "register" | "otp" | "success"
  const [view, setView] = useState(null);
  const [formType, setFormType] = useState(null); // "login" | "register"
  const [otpData, setOtpData] = useState(null);   // { mobile, token }
  const [videoReady, setVideoReady] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setPhase("idle"), 120);
    return () => clearTimeout(t);
  }, []);

  const handleOtpRequired = (data) => {
    setOtpData(data);
    setView("otp");
  };

  const handleSuccess = (responseData) => {
    console.log("Auth success", responseData);
    setIsNavigating(true);
    sessionStorage.setItem("authToken", responseData.jwtToken);
    sessionStorage.setItem("user", JSON.stringify(responseData.user));
    // Navigate to home page after a short delay for visual feedback
    setTimeout(() => {
      navigate('/home');
    }, 300);
  };

  const openForm = (type) => {
    setFormType(type);
    setView("form");
    setOtpData(null);
  };

  const goBack = () => {
    if (view === "otp") { setView("form"); }
    else { setView(null); setFormType(null); }
  };

  const showPanel = view !== null;

  // Loading state while navigating
  if (isNavigating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <iframe
            title="bg-video"
            src="https://www.youtube.com/embed/yycVNcishrE?autoplay=1&mute=1&loop=1&playlist=yycVNcishrE&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3"
            allow="autoplay; fullscreen"
            frameBorder="0"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[300vw] h-[170vw] sm:w-[220vw] sm:h-[125vw] md:w-[180vw] md:h-[101vw] lg:w-[140vw] lg:h-[78vw] xl:w-[120vw] xl:h-[67.5vw] min-w-full min-h-full"
          />
          <div className="absolute inset-0 backdrop-grayscale backdrop-brightness-[0.45] backdrop-contrast-110" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.75) 100%)" }} />
        </div>
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mx-auto mb-4 text-xl animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
            ✓
          </div>
          <p className="text-white text-sm tracking-wide font-['Inter',sans-serif]">
            {formType === "login" ? "Welcome back." : "Account created."}
          </p>
          <p className="text-gray-600 text-[10px] tracking-widest mt-2 font-['Inter',sans-serif]">
            Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #0c0c0c inset !important;
          -webkit-text-fill-color: #fff !important;
        }
        select option { background: #0c0c0c; color: #fff; }
      `}</style>

      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden p-3 sm:p-4 font-['Inter',_Helvetica_Neue,_Arial,_sans-serif]">

        {/* Video background */}
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            title="bg-video"
            src="https://www.youtube.com/embed/yycVNcishrE?autoplay=1&mute=1&loop=1&playlist=yycVNcishrE&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3"
            allow="autoplay; fullscreen"
            frameBorder="0"
            onLoad={() => setVideoReady(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[300vw] h-[170vw] sm:w-[220vw] sm:h-[125vw] md:w-[180vw] md:h-[101vw] lg:w-[140vw] lg:h-[78vw] xl:w-[120vw] xl:h-[67.5vw] min-w-full min-h-full"
            style={{ opacity: videoReady ? 1 : 0, transition: "opacity 1s" }}
          />
          <div className="absolute inset-0 backdrop-grayscale backdrop-brightness-[0.45] backdrop-contrast-110" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.75) 100%)" }} />
        </div>

        {/* Corner marks */}
        {[
          { top: "clamp(0.6rem,3vw,28px)", left: "clamp(0.6rem,3vw,28px)", borderTop: true, borderLeft: true },
          { top: "clamp(0.6rem,3vw,28px)", right: "clamp(0.6rem,3vw,28px)", borderTop: true, borderRight: true },
          { bottom: "clamp(0.6rem,3vw,28px)", left: "clamp(0.6rem,3vw,28px)", borderBottom: true, borderLeft: true },
          { bottom: "clamp(0.6rem,3vw,28px)", right: "clamp(0.6rem,3vw,28px)", borderBottom: true, borderRight: true },
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
        <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-6 lg:p-8 w-[min(92vw,500px)]">

          {/* Letters */}
          <div className="flex gap-0 sm:gap-0.5 md:gap-1 flex-wrap justify-center px-1 sm:px-2">
            {letters.map((char, i) => (
              <AnimatedLetter key={i} char={char} index={i} phase={phase} />
            ))}
          </div>

          {/* Tagline */}
          <p
            className="text-gray-300 text-[8px] sm:text-[9px] md:text-[11px] tracking-[0.3em] uppercase text-center px-2 font-['Inter',sans-serif] transition-all duration-700 ease-out"
            style={{ opacity: phase === "idle" ? 1 : 0, transitionDelay: "0.9s", marginTop: "-0.25rem" }}
          >
            Where it begins
          </p>

          {/* Panel */}
          {showPanel ? (
            <div className="w-full bg-black/90 border border-[#1c1c1c] rounded-sm p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-md">
              {view === "form" && (
                <FormView
                  type={formType}
                  onBack={goBack}
                  onOtpRequired={handleOtpRequired}
                />
              )}
              {view === "otp" && (
                <OtpStep
                  mobile={otpData.mobile}
                  token={otpData.token}
                  type={formType}
                  onSuccess={handleSuccess}
                  onBack={goBack}
                />
              )}
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-3 sm:gap-4 w-full transition-all duration-600 ease-out"
              style={{
                opacity: phase === "idle" ? 1 : 0,
                transform: phase === "idle" ? "none" : "translateY(20px)",
                transitionDelay: "1.05s",
              }}
            >
              <button
                onClick={() => openForm("login")}
                className="bg-white text-black border-none py-2.5 px-6 sm:py-3 sm:px-8 md:py-3.5 md:px-10 text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold cursor-pointer rounded-sm transition-all duration-200 hover:bg-gray-200 hover:-translate-y-0.5 w-full max-w-[280px] font-['Inter',sans-serif]"
              >
                Sign In
              </button>
              <p className="text-gray-300 text-[9px] sm:text-[10px] tracking-wide font-['Inter',sans-serif]">
                New here?{" "}
                <span
                  onClick={() => openForm("register")}
                  className="text-gray-300 cursor-pointer underline hover:text-blue-300 transition-colors"
                >
                  Create an account
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="absolute bottom-3 sm:bottom-4 md:bottom-6 text-gray-800 text-[8px] sm:text-[9px] md:text-[11px] tracking-[0.15em] z-10 font-['Inter',sans-serif]">
          © 2026 BRUBLA
        </p>
      </div>
    </>
  );
}