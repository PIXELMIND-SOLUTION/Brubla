import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// ─────────────────────────────────────────────────────────────────────────────
// ICON PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const Ic = ({ d, className = "w-5 h-5", fill = "none", sw = 2, children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={fill}
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}
        strokeLinecap="round" strokeLinejoin="round">
        {d ? <path d={d} /> : children}
    </svg>
);

const ArrowLeft = ({ c }) => <Ic className={c || "w-5 h-5"} d="M19 12H5M12 19l-7-7 7-7" />;
const ChevRight = ({ c }) => <Ic className={c || "w-4 h-4"} d="M9 5l7 7-7 7" />;
const CheckCirc = ({ c }) => <Ic className={c || "w-6 h-6"}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Ic>;
const UploadIcon = ({ c }) => <Ic className={c || "w-5 h-5"} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const UserIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></Ic>;
const PhoneIcon = ({ c }) => <Ic className={c || "w-5 h-5"} d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />;
const MailIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Ic>;
const PinIcon = ({ c }) => <Ic className={c || "w-5 h-5"}><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></Ic>;
const StarIcon = ({ c }) => <Ic className={c || "w-4 h-4"} fill="currentColor" sw={0} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const ScissIcon = ({ c }) => <Ic className={c || "w-7 h-7"}><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" /></Ic>;
const BrushIcon = ({ c }) => <Ic className={c || "w-7 h-7"}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L3 14.67l.06.06a4 4 0 005.6 5.6l.06.06 10.06-10.06a5.5 5.5 0 000-7.78z" /><path d="M7.5 21a2.5 2.5 0 01-3-3" /></Ic>;
const PenIcon = ({ c }) => <Ic className={c || "w-7 h-7"}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></Ic>;
const SparkIcon = ({ c }) => <Ic className={c || "w-4 h-4"} fill="currentColor" sw={0} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const EyeIcon = ({ c }) => <Ic className={c || "w-4 h-4"}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Ic>;

// ─────────────────────────────────────────────────────────────────────────────
// COLOR THEME
// ─────────────────────────────────────────────────────────────────────────────
// Primary brown:  #6F4E37
// White:          #fff
// Black:          #000
// Soft bg:        #f9f5f0
// Border:         rgba(111,78,55,0.18)
// Muted text:     #7a6a5a

// ─────────────────────────────────────────────────────────────────────────────
// ROLE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const ROLES = [
    {
        id: "tailor",
        title: "Tailor",
        tagline: "Stitch the Future",
        desc: "Bring your craftsmanship to thousands of customers who value perfectly fitted, handcrafted garments.",
        Icon: ScissIcon,
        accent: "#6F4E37",
        accentSoft: "rgba(111,78,55,0.1)",
        accentBorder: "rgba(111,78,55,0.25)",
        perks: ["Set your own pricing", "Manage orders digitally", "Access to premium fabric network"],
        pattern: "scissors",
    },
    {
        id: "stylist",
        title: "Stylist",
        tagline: "Define the Aesthetic",
        desc: "Share your vision, build your clientele, and turn your passion for fashion into a thriving career.",
        Icon: BrushIcon,
        accent: "#6F4E37",
        accentSoft: "rgba(111,78,55,0.1)",
        accentBorder: "rgba(111,78,55,0.25)",
        perks: ["Personal portfolio page", "Client booking system", "Collaborate with top brands"],
        pattern: "brush",
    },
    {
        id: "designer",
        title: "Designer",
        tagline: "Create the Collection",
        desc: "Launch your label, showcase your designs, and connect directly with fashion-forward buyers across India.",
        Icon: PenIcon,
        accent: "#6F4E37",
        accentSoft: "rgba(111,78,55,0.1)",
        accentBorder: "rgba(111,78,55,0.25)",
        perks: ["Launch your brand page", "Direct sales channel", "Marketing & PR support"],
        pattern: "pen",
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// FORM FIELD CONFIG per role
// ─────────────────────────────────────────────────────────────────────────────
const FIELDS = {
    tailor: [
        { name: "fullName", label: "Full Name", type: "text", icon: UserIcon, placeholder: "Your full name" },
        { name: "phone", label: "Phone Number", type: "tel", icon: PhoneIcon, placeholder: "+91 98765 43210" },
        { name: "email", label: "Email Address", type: "email", icon: MailIcon, placeholder: "you@example.com" },
        { name: "city", label: "City / Location", type: "text", icon: PinIcon, placeholder: "Hyderabad, Mumbai…" },
        { name: "experience", label: "Years of Experience", type: "select", icon: StarIcon, options: ["Less than 1 year", "1–3 years", "3–7 years", "7+ years"] },
        { name: "speciality", label: "Speciality", type: "select", icon: ScissIcon, options: ["Men's Wear", "Women's Wear", "Bridal", "Kids Wear", "Alterations", "All Types"] },
        { name: "portfolio", label: "Portfolio / Work Samples", type: "file", icon: UploadIcon, placeholder: "Upload images of your work" },
    ],
    stylist: [
        { name: "fullName", label: "Full Name", type: "text", icon: UserIcon, placeholder: "Your full name" },
        { name: "phone", label: "Phone Number", type: "tel", icon: PhoneIcon, placeholder: "+91 98765 43210" },
        { name: "email", label: "Email Address", type: "email", icon: MailIcon, placeholder: "you@example.com" },
        { name: "city", label: "City / Location", type: "text", icon: PinIcon, placeholder: "Hyderabad, Mumbai…" },
        { name: "instagram", label: "Instagram Handle", type: "text", icon: EyeIcon, placeholder: "@yourstyle" },
        { name: "style", label: "Style Niche", type: "select", icon: BrushIcon, options: ["Ethnic & Traditional", "Contemporary", "Streetwear", "Bridal Styling", "Corporate", "Celebrity / Editorial"] },
        { name: "portfolio", label: "Portfolio / Lookbook", type: "file", icon: UploadIcon, placeholder: "Upload your lookbook or photos" },
    ],
    designer: [
        { name: "fullName", label: "Full Name / Brand", type: "text", icon: UserIcon, placeholder: "Brand or designer name" },
        { name: "phone", label: "Phone Number", type: "tel", icon: PhoneIcon, placeholder: "+91 98765 43210" },
        { name: "email", label: "Email Address", type: "email", icon: MailIcon, placeholder: "studio@yourbrand.com" },
        { name: "city", label: "Studio Location", type: "text", icon: PinIcon, placeholder: "City / State" },
        { name: "website", label: "Website / Portfolio", type: "text", icon: EyeIcon, placeholder: "https://yourbrand.com" },
        { name: "category", label: "Design Category", type: "select", icon: PenIcon, options: ["Women's RTW", "Men's RTW", "Bridal Couture", "Kids Wear", "Accessories", "Sustainable Fashion"] },
        { name: "portfolio", label: "Collection Samples", type: "file", icon: UploadIcon, placeholder: "Upload collection images or lookbook" },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// INPUT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const FormField = ({ field, value, onChange, accent }) => {
    const [focused, setFocused] = useState(false);
    const [fileName, setFileName] = useState("");
    const fileRef = useRef(null);
    const Icon = field.icon;

    const borderColor = focused ? accent : "rgba(111,78,55,0.18)";
    const shadow = focused ? `0 0 0 3px rgba(111,78,55,0.12)` : "none";

    if (field.type === "select") return (
        <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#7a6a5a" }}>
                {field.label}
            </label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: accent }}>
                    <Icon c="w-4 h-4" />
                </div>
                <select
                    value={value || ""}
                    onChange={e => onChange(field.name, e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none appearance-none transition-all duration-200"
                    style={{
                        background: "#fff",
                        border: `1.5px solid ${borderColor}`,
                        boxShadow: shadow,
                        color: value ? "#000" : "#7a6a5a",
                    }}
                >
                    <option value="" disabled>Select…</option>
                    {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <ChevRight c="w-3.5 h-3.5 rotate-90" />
                </div>
            </div>
        </div>
    );

    if (field.type === "file") return (
        <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#7a6a5a" }}>
                {field.label}
            </label>
            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 text-left"
                style={{
                    background: fileName ? `rgba(111,78,55,0.08)` : "#f9f5f0",
                    border: `1.5px dashed ${fileName ? accent : "rgba(111,78,55,0.2)"}`,
                    color: fileName ? "#000" : "#7a6a5a",
                }}
            >
                <Icon c="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
                <span className="truncate">{fileName || field.placeholder}</span>
                {fileName && <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: accent, color: "#fff" }}>✓</span>}
            </button>
            <input ref={fileRef} type="file" accept="image/*,.pdf"
                className="hidden"
                onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) { setFileName(f.name); onChange(field.name, f); }
                }} />
        </div>
    );

    return (
        <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#7a6a5a" }}>
                {field.label}
            </label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: accent }}>
                    <Icon c="w-4 h-4" />
                </div>
                <input
                    type={field.type}
                    value={value || ""}
                    onChange={e => onChange(field.name, e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={field.placeholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200 placeholder:font-normal"
                    style={{
                        background: "#fff",
                        border: `1.5px solid ${borderColor}`,
                        boxShadow: shadow,
                        color: "#000",
                        caretColor: accent,
                    }}
                />
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROLE CARD
// ─────────────────────────────────────────────────────────────────────────────
const RoleCard = ({ role, onSelect, index }) => {
    const [hovered, setHovered] = useState(false);
    const { Icon, accent, accentSoft, accentBorder } = role;

    return (
        <div
            onClick={() => onSelect(role)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-400 group"
            style={{
                background: hovered ? "#000" : "#fff",
                border: `1.5px solid ${hovered ? accent : "rgba(111,78,55,0.15)"}`,
                boxShadow: hovered
                    ? `0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(111,78,55,0.4)`
                    : "0 2px 16px rgba(0,0,0,0.06)",
                transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
                animationDelay: `${index * 120}ms`,
            }}
        >
            {/* Top accent bar */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

            <div className="p-7 flex flex-col gap-5">
                {/* Icon badge */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300"
                    style={{
                        background: hovered ? `rgba(111,78,55,0.2)` : accentSoft,
                        border: `1.5px solid ${hovered ? accent : accentBorder}`,
                        color: accent,
                        boxShadow: hovered ? `0 0 24px rgba(111,78,55,0.3)` : "none",
                    }}>
                    <Icon c="w-7 h-7" />
                </div>

                {/* Text */}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: accent }}>{role.tagline}</p>
                    <h3 className="text-2xl font-black mb-2 transition-colors duration-300"
                        style={{ color: hovered ? "#fff" : "#000", fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}>
                        {role.title}
                    </h3>
                    <p className="text-sm leading-relaxed transition-colors duration-300"
                        style={{ color: hovered ? "rgba(255,255,255,0.6)" : "#7a6a5a" }}>
                        {role.desc}
                    </p>
                </div>

                {/* Perks */}
                <ul className="flex flex-col gap-2">
                    {role.perks.map(p => (
                        <li key={p} className="flex items-center gap-2 text-xs font-medium transition-colors duration-300"
                            style={{ color: hovered ? "rgba(255,255,255,0.75)" : "#333" }}>
                            <span style={{ color: accent }}><SparkIcon c="w-2.5 h-2.5" /></span>
                            {p}
                        </li>
                    ))}
                </ul>

                {/* CTA row */}
                <div className="flex items-center justify-between pt-2"
                    style={{ borderTop: `1px solid ${hovered ? "rgba(255,255,255,0.08)" : "rgba(111,78,55,0.12)"}` }}>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>Apply Now</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                            background: accent,
                            color: "#fff",
                            transform: hovered ? "translateX(4px)" : "translateX(0)",
                        }}>
                        <ChevRight c="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRATION FORM PANEL
// ─────────────────────────────────────────────────────────────────────────────
const RegistrationForm = ({ role, onBack, onSuccess }) => {
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const fields = FIELDS[role.id];
    const { accent } = role;

    const handleChange = (name, val) => setFormData(p => ({ ...p, [name]: val }));

    const handleSubmit = () => {
        const required = fields.filter(f => f.type !== "file").map(f => f.name);
        const missing = required.filter(n => !formData[n]);
        if (missing.length) {
            alert("Please fill all required fields.");
            return;
        }
        setLoading(true);
        setTimeout(() => { setLoading(false); setSubmitted(true); }, 1800);
    };

    if (submitted) return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-6 gap-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-2"
                style={{ background: `rgba(111,78,55,0.1)`, border: `2px solid ${accent}` }}>
                <CheckCirc c="w-10 h-10" style={{ color: accent }} />
            </div>
            <div>
                <h3 className="text-3xl font-black mb-2" style={{ fontFamily: "Georgia, serif", color: "#000", letterSpacing: "-0.02em" }}>
                    Application Sent!
                </h3>
                <p className="text-sm" style={{ color: "#7a6a5a", maxWidth: "360px" }}>
                    Thank you for applying as a <strong style={{ color: accent }}>{role.title}</strong>. Our team will review your application and reach out within <strong>2–3 business days</strong>.
                </p>
            </div>
            <button onClick={onBack}
                className="mt-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105"
                style={{ background: accent, color: "#fff" }}>
                Back to Roles
            </button>
        </div>
    );

    return (
        <div className="w-full max-w-xl mx-auto px-4 py-8">
            {/* Back */}
            <button onClick={onBack}
                className="flex items-center gap-2 mb-8 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ color: "#333" }}>
                <ArrowLeft c="w-4 h-4" />
                Back to Roles
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `rgba(111,78,55,0.1)`, border: `1.5px solid rgba(111,78,55,0.3)`, color: accent }}>
                    <role.Icon c="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>Register As</p>
                    <h2 className="text-2xl font-black" style={{ fontFamily: "Georgia, serif", color: "#000", letterSpacing: "-0.02em" }}>
                        {role.title}
                    </h2>
                </div>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-5">
                {fields.map(field => (
                    <FormField
                        key={field.name}
                        field={field}
                        value={formData[field.name]}
                        onChange={handleChange}
                        accent={accent}
                    />
                ))}

                {/* Terms */}
                <p className="text-[11px] leading-relaxed" style={{ color: "#7a6a5a" }}>
                    By submitting, you agree to our{" "}
                    <span className="underline cursor-pointer" style={{ color: accent }}>Terms & Conditions</span>{" "}
                    and{" "}
                    <span className="underline cursor-pointer" style={{ color: accent }}>Partner Policy</span>.
                </p>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                    style={{
                        background: loading ? "#f0ebe4" : `linear-gradient(135deg, #6F4E37, #8B6347)`,
                        color: loading ? "#7a6a5a" : "#fff",
                        boxShadow: loading ? "none" : `0 8px 24px rgba(111,78,55,0.35)`,
                    }}
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-[#7a6a5a] border-t-transparent rounded-full animate-spin" />
                            Submitting…
                        </>
                    ) : (
                        <>
                            <SparkIcon c="w-3.5 h-3.5" />
                            Submit Application
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// DECORATIVE BG ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────
const BgDecor = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Top-left blob */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(111,78,55,0.07) 0%, transparent 70%)" }} />
        {/* Bottom-right blob */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(111,78,55,0.05) 0%, transparent 70%)" }} />
        {/* Center blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px]"
            style={{ background: "radial-gradient(ellipse, rgba(111,78,55,0.04) 0%, transparent 70%)" }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.015]"
            style={{
                backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                backgroundSize: "48px 48px",
            }} />
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function JoinUs() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 60);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <Navbar />
            <div className="min-h-screen relative" style={{ background: "#f9f5f0", fontFamily: "'DM Sans', sans-serif" }}>
                <BgDecor />

                <div className="relative z-10">

                    {/* ── TOP BAR ── */}
                    <div className="flex items-center justify-between px-5 md:px-10 pt-6 pb-4">
                        <button onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white/80"
                            style={{ color: "#333" }}>
                            <ArrowLeft c="w-4 h-4" />
                            <span className="hidden sm:inline">Go Back</span>
                        </button>

                        {/* Logo wordmark */}
                        <div className="flex flex-col leading-none select-none">
                            <span className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: "#000" }}>NEW</span>
                            <span className="text-[10px] font-black tracking-[0.22em] uppercase -mt-[1px]" style={{ color: "#6F4E37" }}>ME</span>
                        </div>
                    </div>

                    {/* ── HERO SECTION ── */}
                    {!selectedRole && (
                        <div
                            className="text-center px-5 pt-8 pb-14 transition-all duration-700"
                            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
                        >
                            {/* Pill badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                                style={{ background: "rgba(111,78,55,0.1)", border: "1px solid rgba(111,78,55,0.25)" }}>
                                <SparkIcon c="w-3 h-3" style={{ color: "#6F4E37" }} />
                                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#6F4E37" }}>
                                    Partner Programme
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4"
                                style={{
                                    fontFamily: "Georgia, 'Times New Roman', serif",
                                    color: "#000",
                                    letterSpacing: "-0.03em",
                                }}>
                                Become a Part<br />
                                <span style={{
                                    background: "linear-gradient(135deg, #6F4E37, #a0714f, #6F4E37)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}>
                                    of NewMe
                                </span>
                            </h1>

                            <p className="text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-4" style={{ color: "#7a6a5a" }}>
                                Join India's most curated fashion platform as a creator, craftsperson, or visionary. Choose your role and let's build something extraordinary together.
                            </p>

                            {/* Stats strip */}
                            <div className="flex items-center justify-center gap-8 mt-8">
                                {[["10K+", "Partners"], ["5M+", "Customers"], ["50+", "Cities"]].map(([n, l]) => (
                                    <div key={l} className="flex flex-col items-center">
                                        <span className="text-xl font-black" style={{ color: "#000", fontFamily: "Georgia, serif" }}>{n}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7a6a5a" }}>{l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── ROLE CARDS ── */}
                    {!selectedRole && (
                        <div
                            className="px-4 sm:px-8 md:px-12 lg:px-20 pb-20 transition-all duration-700"
                            style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? "translateY(0)" : "translateY(30px)",
                                transitionDelay: "150ms",
                            }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                                {ROLES.map((role, i) => (
                                    <RoleCard key={role.id} role={role} onSelect={setSelectedRole} index={i} />
                                ))}
                            </div>

                            
                        </div>
                    )}

                    {/* ── FORM PANEL ── */}
                    {selectedRole && (
                        <div
                            className="px-4 sm:px-8 pb-20 transition-all duration-500"
                            style={{ opacity: visible ? 1 : 0 }}
                        >
                            {/* Role switcher pills */}
                            <div className="flex justify-center gap-2 mb-2 flex-wrap">
                                {ROLES.map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => setSelectedRole(r)}
                                        className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
                                        style={{
                                            background: selectedRole.id === r.id ? "#6F4E37" : "#f0ebe4",
                                            color: selectedRole.id === r.id ? "#fff" : "#7a6a5a",
                                            border: `1.5px solid ${selectedRole.id === r.id ? "#6F4E37" : "transparent"}`,
                                        }}
                                    >
                                        {r.title}
                                    </button>
                                ))}
                            </div>

                            {/* Form card */}
                            <div className="max-w-xl mx-auto rounded-3xl overflow-hidden"
                                style={{
                                    background: "#fff",
                                    border: "1.5px solid rgba(111,78,55,0.15)",
                                    boxShadow: "0 8px 48px rgba(0,0,0,0.08)",
                                }}>
                                {/* Top stripe */}
                                <div className="h-1.5" style={{ background: `linear-gradient(90deg, #6F4E37, rgba(111,78,55,0.4))` }} />

                                <RegistrationForm
                                    role={selectedRole}
                                    onBack={() => setSelectedRole(null)}
                                    onSuccess={() => { }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}