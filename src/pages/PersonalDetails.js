import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, MapPin, Calendar, Save, X, Edit2, 
  CheckCircle, AlertCircle, Camera, Globe, Lock, Shield,
  ChevronRight, Home, Briefcase, MessageCircle, Heart,
  Loader2, Smartphone, Award, Gift
} from "lucide-react";
import Navbar from "../components/Navbar";

const COFFEE = "#C9A96E";

// ─────────────────────────────────────────────────────────────────────────────
// STYLES - Tailwind only with keyframes
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
    @keyframes pulseGold {
      0%, 100% { box-shadow: 0 0 0 0 rgba(201,169,110,0.4); }
      50% { box-shadow: 0 0 0 6px rgba(201,169,110,0); }
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
    .pulse-gold {
      animation: pulseGold 2s ease-in-out infinite;
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE USER DATA
// ─────────────────────────────────────────────────────────────────────────────
const SAMPLE_USER_DATA = {
  firstName: "Vijay",
  lastName: "Nimmakeyala",
  email: "vijay.nimmakeyala@email.com",
  phone: "+91 6303092897",
  alternatePhone: "+91 6303092897",
  dateOfBirth: "1995-06-15",
  gender: "male",
  nationality: "Indian",
  preferredLanguage: "English",
  newsletterEnabled: true,
  smsUpdates: true,
  profilePicture: "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"
};

// ─────────────────────────────────────────────────────────────────────────────
// STATS CARDS
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all duration-300">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-500 fs">{label}</p>
        <p className="text-lg font-bold text-white fd">{value}</p>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// INFO FIELD (View Mode)
// ─────────────────────────────────────────────────────────────────────────────
const InfoField = ({ icon: Icon, label, value, verified }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-800/50 last:border-0">
    <div className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center flex-shrink-0">
      <Icon size={16} className="text-gray-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 fs uppercase tracking-wide">{label}</p>
      <p className="text-sm sm:text-base font-medium text-white fs mt-0.5 break-words">{value || "Not provided"}</p>
    </div>
    {verified && (
      <div className="flex-shrink-0">
        <CheckCircle size={14} className="text-green-500" />
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// EDIT FIELD (Edit Mode)
// ─────────────────────────────────────────────────────────────────────────────
const EditField = ({ 
  icon: Icon, label, name, value, type = "text", 
  placeholder, required, options, onChange, error 
}) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 fs">
      <Icon size={14} className="text-gray-500" />
      {label}
      {required && <span className="text-xs" style={{ color: COFFEE }}>*</span>}
    </label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white fs text-sm focus:border-coffee transition-all"
        style={{ borderColor: error ? '#ef4444' : undefined }}
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    ) : type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white fs text-sm focus:border-coffee transition-all resize-none"
        style={{ borderColor: error ? '#ef4444' : undefined }}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white fs text-sm focus:border-coffee transition-all"
        style={{ borderColor: error ? '#ef4444' : undefined }}
      />
    )}
    {error && (
      <p className="text-xs text-red-500 fs flex items-center gap-1 mt-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATION
// ─────────────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slideInRight">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl ${
        type === "success" ? "bg-green-500/90" : "bg-red-500/90"
      } backdrop-blur-sm`}>
        {type === "success" ? <CheckCircle size={18} className="text-white" /> : <AlertCircle size={18} className="text-white" />}
        <p className="text-white fs text-sm font-medium">{message}</p>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function PersonalDetails() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(SAMPLE_USER_DATA);
  const [originalData, setOriginalData] = useState(SAMPLE_USER_DATA);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setFormData(SAMPLE_USER_DATA);
      setOriginalData(SAMPLE_USER_DATA);
    } catch (error) {
      setToast({ message: "Failed to load user data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const checked = (e.target).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{6,12}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (formData.alternatePhone && !/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{6,12}$/.test(formData.alternatePhone)) {
      newErrors.alternatePhone = "Invalid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save changes
  const handleSave = async () => {
    if (!validateForm()) {
      setToast({ message: "Please fix the errors before saving", type: "error" });
      return;
    }
    
    setSaving(true);
    try {
      // Simulate API update
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOriginalData(formData);
      setIsEditing(false);
      setToast({ message: "Personal details updated successfully!", type: "success" });
    } catch (error) {
      setToast({ message: "Failed to update. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setErrors({});
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "Not provided";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(formData.dateOfBirth);
  const fullName = `${formData.firstName} ${formData.lastName}`;

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{ color: COFFEE }} />
            <p className="text-gray-400 fs">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <Styles />

        {/* Hero Section */}
        <div className="relative overflow-hidden pb-8" style={{ background: "linear-gradient(160deg, #0C0C0C 0%, #1a1812 60%, #0C0C0C 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 65% 45% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 65%)" }} />
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {/* Back button */}
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 fs text-sm"
            >
              <ChevronRight size={16} className="rotate-180" />
              Back
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full pulse-gold" style={{ margin: "-3px" }} />
                <div className="absolute inset-0 rounded-full" style={{ margin: "-1.5px", background: "conic-gradient(#C9A96E 0deg, #E8C97A 120deg, #C9A96E 240deg, #E8C97A 360deg)", borderRadius: "50%", padding: "1.5px" }} />
                <img 
                  src={formData.profilePicture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=90&auto=format"} 
                  alt={fullName}
                  className="relative rounded-full object-cover"
                  style={{ width: "clamp(80px, 15vw, 100px)", height: "clamp(80px, 15vw, 100px)", border: "3px solid #0C0C0C" }}
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #C9A96E, #a8843f)", border: "2px solid #0C0C0C" }}>
                    <Camera size={12} className="text-black" />
                  </button>
                )}
              </div>

              {/* Name and title */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="fd font-black text-white text-2xl sm:text-3xl lg:text-4xl mb-1">{fullName}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full" style={{ background: `${COFFEE}20`, color: COFFEE }}>
                    Gold Member
                  </span>
                  <span className="text-xs text-gray-500 fs">Member since Jan 2023</span>
                </div>
              </div>

              {/* Edit/Save buttons */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm fs transition-all hover:scale-105 active:scale-95"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(245,240,232,0.9)" }}
                >
                  <Edit2 size={14} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm fs transition-all hover:bg-gray-800"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    <X size={14} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm fs transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${COFFEE}, #a8843f)`, color: "#0C0C0C" }}
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.35), transparent)" }} />
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                <button
                  onClick={() => setActiveSection("personal")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all fs text-sm ${
                    activeSection === "personal" 
                      ? "bg-coffee/10 text-coffee border border-coffee/30" 
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  }`}
                  style={{ borderColor: activeSection === "personal" ? COFFEE : undefined, color: activeSection === "personal" ? COFFEE : undefined }}
                >
                  <User size={16} />
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveSection("contact")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all fs text-sm ${
                    activeSection === "contact" 
                      ? "bg-coffee/10 text-coffee border border-coffee/30" 
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  <Phone size={16} />
                  Contact Details
                </button>
                <button
                  onClick={() => setActiveSection("preferences")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all fs text-sm ${
                    activeSection === "preferences" 
                      ? "bg-coffee/10 text-coffee border border-coffee/30" 
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  <Heart size={16} />
                  Preferences
                </button>
                <button
                  onClick={() => setActiveSection("security")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all fs text-sm ${
                    activeSection === "security" 
                      ? "bg-coffee/10 text-coffee border border-coffee/30" 
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  <Shield size={16} />
                  Security
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Personal Information Section */}
              {activeSection === "personal" && (
                <div className="bg-gray-900/30 rounded-2xl border border-gray-800 p-5 sm:p-6 animate-scaleIn">
                  <h2 className="text-lg font-bold text-white fd mb-5 flex items-center gap-2">
                    <User size={18} style={{ color: COFFEE }} />
                    Personal Information
                  </h2>
                  
                  {!isEditing ? (
                    <div className="space-y-1">
                      <InfoField icon={User} label="Full Name" value={fullName} verified />
                      <InfoField icon={Calendar} label="Date of Birth" value={formatDate(formData.dateOfBirth)} />
                      {age && <InfoField icon={Award} label="Age" value={`${age} years`} />}
                      <InfoField icon={Globe} label="Nationality" value={formData.nationality} />
                      <InfoField icon={Heart} label="Gender" value={formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : "Not specified"} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <EditField
                          icon={User} label="First Name" name="firstName" value={formData.firstName}
                          onChange={handleChange} required error={errors.firstName}
                        />
                        <EditField
                          icon={User} label="Last Name" name="lastName" value={formData.lastName}
                          onChange={handleChange} required error={errors.lastName}
                        />
                      </div>
                      <EditField
                        icon={Calendar} label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth}
                        type="date" onChange={handleChange}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <EditField
                          icon={Globe} label="Nationality" name="nationality" value={formData.nationality}
                          onChange={handleChange} options={[
                            { value: "Indian", label: "Indian" },
                            { value: "American", label: "American" },
                            { value: "British", label: "British" },
                            { value: "Other", label: "Other" }
                          ]}
                        />
                        <EditField
                          icon={Heart} label="Gender" name="gender" value={formData.gender}
                          onChange={handleChange} options={[
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                            { value: "other", label: "Other" }
                          ]}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Details Section */}
              {activeSection === "contact" && (
                <div className="bg-gray-900/30 rounded-2xl border border-gray-800 p-5 sm:p-6 animate-scaleIn">
                  <h2 className="text-lg font-bold text-white fd mb-5 flex items-center gap-2">
                    <Phone size={18} style={{ color: COFFEE }} />
                    Contact Details
                  </h2>
                  
                  {!isEditing ? (
                    <div className="space-y-1">
                      <InfoField icon={Mail} label="Email Address" value={formData.email} verified />
                      <InfoField icon={Phone} label="Phone Number" value={formData.phone} verified />
                      {formData.alternatePhone && <InfoField icon={Smartphone} label="Alternate Phone" value={formData.alternatePhone} />}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <EditField
                        icon={Mail} label="Email Address" name="email" value={formData.email}
                        type="email" onChange={handleChange} required error={errors.email}
                      />
                      <EditField
                        icon={Phone} label="Phone Number" name="phone" value={formData.phone}
                        type="tel" onChange={handleChange} required error={errors.phone}
                      />
                      <EditField
                        icon={Smartphone} label="Alternate Phone" name="alternatePhone" value={formData.alternatePhone}
                        type="tel" onChange={handleChange} error={errors.alternatePhone}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Section */}
              {activeSection === "preferences" && (
                <div className="bg-gray-900/30 rounded-2xl border border-gray-800 p-5 sm:p-6 animate-scaleIn">
                  <h2 className="text-lg font-bold text-white fd mb-5 flex items-center gap-2">
                    <Heart size={18} style={{ color: COFFEE }} />
                    Preferences & Notifications
                  </h2>
                  
                  {!isEditing ? (
                    <div className="space-y-1">
                      <InfoField icon={Globe} label="Preferred Language" value={formData.preferredLanguage} />
                      <div className="flex items-center gap-3 py-3 border-b border-gray-800/50 last:border-0">
                        <div className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 fs">Email Newsletter</p>
                          <p className="text-sm text-white fs">{formData.newsletterEnabled ? "Subscribed" : "Not subscribed"}</p>
                        </div>
                        {formData.newsletterEnabled && <CheckCircle size={14} className="text-green-500" />}
                      </div>
                      <div className="flex items-center gap-3 py-3 border-b border-gray-800/50 last:border-0">
                        <div className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center">
                          <Smartphone size={16} className="text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 fs">SMS Updates</p>
                          <p className="text-sm text-white fs">{formData.smsUpdates ? "Enabled" : "Disabled"}</p>
                        </div>
                        {formData.smsUpdates && <CheckCircle size={14} className="text-green-500" />}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <EditField
                        icon={Globe} label="Preferred Language" name="preferredLanguage" value={formData.preferredLanguage}
                        onChange={handleChange} options={[
                          { value: "English", label: "English" },
                          { value: "Hindi", label: "Hindi" },
                          { value: "Spanish", label: "Spanish" },
                          { value: "French", label: "French" }
                        ]}
                      />
                      
                      <div className="space-y-3 pt-2">
                        <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-800/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Mail size={16} className="text-gray-400" />
                            <span className="text-sm text-white fs">Email Newsletter</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, newsletterEnabled: !prev.newsletterEnabled }))}
                            className={`w-11 h-6 rounded-full transition-all duration-200 ${formData.newsletterEnabled ? "bg-coffee" : "bg-gray-700"}`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white transition-all duration-200 transform ${formData.newsletterEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                          </button>
                        </label>
                        
                        <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-800/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Smartphone size={16} className="text-gray-400" />
                            <span className="text-sm text-white fs">SMS Updates</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, smsUpdates: !prev.smsUpdates }))}
                            className={`w-11 h-6 rounded-full transition-all duration-200 ${formData.smsUpdates ? "bg-coffee" : "bg-gray-700"}`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white transition-all duration-200 transform ${formData.smsUpdates ? "translate-x-5" : "translate-x-0.5"}`} />
                          </button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Security Section */}
              {activeSection === "security" && (
                <div className="bg-gray-900/30 rounded-2xl border border-gray-800 p-5 sm:p-6 animate-scaleIn">
                  <h2 className="text-lg font-bold text-white fd mb-5 flex items-center gap-2">
                    <Shield size={18} style={{ color: COFFEE }} />
                    Security Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all group">
                      <div className="flex items-center gap-3">
                        <Lock size={16} className="text-gray-400 group-hover:text-coffee transition-colors" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-white fs">Change Password</p>
                          <p className="text-xs text-gray-500 fs">Update your password regularly</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-500 group-hover:text-coffee transition-colors" />
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all group">
                      <div className="flex items-center gap-3">
                        <Shield size={16} className="text-gray-400 group-hover:text-coffee transition-colors" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-white fs">Two-Factor Authentication</p>
                          <p className="text-xs text-gray-500 fs">Add an extra layer of security</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-500 group-hover:text-coffee transition-colors" />
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all group">
                      <div className="flex items-center gap-3">
                        <Smartphone size={16} className="text-gray-400 group-hover:text-coffee transition-colors" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-white fs">Active Sessions</p>
                          <p className="text-xs text-gray-500 fs">Manage devices where you're logged in</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-500 group-hover:text-coffee transition-colors" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </div>
    </>
  );
}