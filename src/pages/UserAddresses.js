import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, Plus, Edit2, Trash2, CheckCircle, X, Home, 
  Building, Navigation, Phone, User, Mail, ChevronLeft,
  AlertCircle, Loader2, Search, Star, StarOff, Globe,
  Clock, Shield, Truck, CreditCard, Heart
} from "lucide-react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const COFFEE = "#C9A96E";

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
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
    
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    @media (max-width: 640px) {
      button, .cursor-pointer {
        -webkit-tap-highlight-color: transparent;
      }
    }
  `}</style>
);


// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE ADDRESSES DATA
// ─────────────────────────────────────────────────────────────────────────────
const SAMPLE_ADDRESSES = [
  {
    id: "1",
    type: "Home",
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    address: "123 Main Street, Apt 4B",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
    landmark: "Near Central Park",
    isDefault: true
  },
  {
    id: "2",
    type: "Office",
    name: "Priya Sharma",
    phone: "+91 98765 43211",
    address: "456 Business Park, Floor 12",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    landmark: "Near Hitech City Metro",
    isDefault: false
  },
  {
    id: "3",
    type: "Other",
    name: "Priya Sharma",
    phone: "+91 98765 43212",
    address: "789 Family Complex",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    landmark: "Near Dadar Station",
    isDefault: false
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// ADDRESS CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const AddressCard = ({ 
  address, 
  onEdit, 
  onDelete, 
  onSetDefault,
  isSelected,
  onSelect 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setIsDeleting(true);
      await onDelete(address.id);
      setIsDeleting(false);
    }
  };
  
  const typeIcons = {
    Home: Home,
    Office: Building,
    Other: Navigation
  };
  
  const Icon = typeIcons[address.type];
  
  return (
    <div 
      className={`relative bg-gray-900/40 rounded-xl border transition-all duration-300 ${
        isSelected 
          ? "border-coffee shadow-lg shadow-coffee/10" 
          : "border-gray-800 hover:border-gray-700"
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <CheckCircle size={18} className="text-coffee" />
        </div>
      )}
      
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            address.type === "Home" ? "bg-coffee/15" : 
            address.type === "Office" ? "bg-blue-500/15" : "bg-purple-500/15"
          }`}>
            <Icon size={18} className={
              address.type === "Home" ? "text-coffee" : 
              address.type === "Office" ? "text-blue-400" : "text-purple-400"
            } />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-white fs text-base">{address.type}</h3>
              {address.isDefault && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-coffee/20 text-coffee">
                  Default
                </span>
              )}
            </div>
            
            <p className="text-sm font-medium text-white fs">{address.name}</p>
            <p className="text-xs text-gray-400 fs mt-0.5">{address.phone}</p>
            
            <div className="mt-2 space-y-0.5">
              <p className="text-sm text-gray-300 fs">{address.address}</p>
              <p className="text-sm text-gray-300 fs">
                {address.city}, {address.state} - {address.pincode}
              </p>
              {address.landmark && (
                <p className="text-xs text-gray-500 fs mt-1">
                  📍 Landmark: {address.landmark}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-800">
          {!address.isDefault && (
            <button
              onClick={() => onSetDefault(address.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coffee/10 text-coffee text-xs font-medium fs hover:bg-coffee/20 transition-colors"
            >
              <Star size={12} />
              Set as Default
            </button>
          )}
          <button
            onClick={() => onEdit(address)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6F4E37] text-white text-xs font-medium fs hover:bg-gray-700 transition-colors"
          >
            <Edit2 size={12} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium fs hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            Delete
          </button>
        </div>
      </div>
      
      {/* Selection overlay for checkout mode */}
      {onSelect && (
        <div 
          onClick={() => onSelect(address.id)}
          className="absolute inset-0 cursor-pointer rounded-xl"
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ADD/EDIT ADDRESS MODAL
// ─────────────────────────────────────────────────────────────────────────────
const AddressModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingAddress 
}) => {
  const [formData, setFormData] = useState({
    type: "Home",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    isDefault: false
  });
  
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        type: editingAddress.type,
        name: editingAddress.name,
        phone: editingAddress.phone,
        address: editingAddress.address,
        city: editingAddress.city,
        state: editingAddress.state,
        pincode: editingAddress.pincode,
        landmark: editingAddress.landmark || "",
        isDefault: editingAddress.isDefault
      });
    } else {
      setFormData({
        type: "Home",
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        isDefault: false
      });
    }
    setErrors({});
  }, [editingAddress, isOpen]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{6,12}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{5,6}$/.test(formData.pincode)) {
      newErrors.pincode = "Invalid pincode";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-xl sm:rounded-2xl bg-gray-900 border border-gray-700 animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-4 sm:p-5 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white fd">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>
            <p className="text-xs text-gray-400 fs mt-0.5">
              {editingAddress ? "Update your address details" : "Enter your delivery address"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        
        <div className="p-4 sm:p-5 space-y-4">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-white fs mb-2">Address Type</label>
            <div className="flex gap-2">
              {["Home", "Office", "Other"].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium fs transition-all ${
                    formData.type === type
                      ? "bg-coffee text-white shadow-lg shadow-coffee/20"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {type === "Home" && <Home size={14} />}
                  {type === "Office" && <Building size={14} />}
                  {type === "Other" && <Navigation size={14} />}
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 fs mb-1.5">
              Full Name <span className="text-coffee">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-800 border rounded-lg text-white fs text-sm focus:border-coffee transition-colors ${
                  errors.name ? "border-red-500" : "border-gray-700"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 fs mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.name}
              </p>
            )}
          </div>
          
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 fs mb-1.5">
              Phone Number <span className="text-coffee">*</span>
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-800 border rounded-lg text-white fs text-sm focus:border-coffee transition-colors ${
                  errors.phone ? "border-red-500" : "border-gray-700"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 fs mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.phone}
              </p>
            )}
          </div>
          
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 fs mb-1.5">
              Address <span className="text-coffee">*</span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address, apartment, suite, etc."
              rows={2}
              className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white fs text-sm focus:border-coffee transition-colors resize-none ${
                errors.address ? "border-red-500" : "border-gray-700"
              }`}
            />
            {errors.address && (
              <p className="text-xs text-red-500 fs mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.address}
              </p>
            )}
          </div>
          
          {/* City, State, Pincode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 fs mb-1.5">
                City <span className="text-coffee">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white fs text-sm focus:border-coffee transition-colors ${
                  errors.city ? "border-red-500" : "border-gray-700"
                }`}
              />
              {errors.city && (
                <p className="text-xs text-red-500 fs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 fs mb-1.5">
                State <span className="text-coffee">*</span>
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white fs text-sm focus:border-coffee transition-colors ${
                  errors.state ? "border-red-500" : "border-gray-700"
                }`}
              />
              {errors.state && (
                <p className="text-xs text-red-500 fs mt-1">{errors.state}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 fs mb-1.5">
              Pincode <span className="text-coffee">*</span>
            </label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              placeholder="Pincode"
              className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white fs text-sm focus:border-coffee transition-colors ${
                errors.pincode ? "border-red-500" : "border-gray-700"
              }`}
            />
            {errors.pincode && (
              <p className="text-xs text-red-500 fs mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.pincode}
              </p>
            )}
          </div>
          
          {/* Landmark */}
          <div>
            <label className="block text-sm font-medium text-gray-300 fs mb-1.5">
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              placeholder="Near any landmark"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white fs text-sm focus:border-coffee transition-colors"
            />
          </div>
          
          {/* Default Address Toggle */}
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-800/30 rounded-lg">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-10 h-5 rounded-full transition-all duration-200 ${
                formData.isDefault ? "bg-coffee" : "bg-gray-700"
              }`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-200 transform ${
                  formData.isDefault ? "translate-x-5" : "translate-x-0.5"
                } mt-0.5 ml-0.5`} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-white fs">Set as default address</p>
              <p className="text-xs text-gray-500 fs">This address will be selected by default during checkout</p>
            </div>
          </label>
        </div>
        
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4 sm:p-5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 font-medium fs text-sm hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-lg bg-coffee text-white font-semibold fs text-sm hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {saving ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRMATION MODAL
// ─────────────────────────────────────────────────────────────────────────────
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, addressName }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-xl bg-gray-900 border border-gray-700 animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="p-5 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-white fd mb-2">Delete Address</h3>
          <p className="text-sm text-gray-400 fs">
            Are you sure you want to delete "{addressName}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 font-medium fs text-sm hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white font-semibold fs text-sm hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATION
// ─────────────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
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
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-gray-900/40 rounded-xl p-3 sm:p-4 border border-gray-800">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon size={14} className="sm:w-[18px] sm:h-[18px]" style={{ color }} />
      </div>
      <div>
        <p className="text-[10px] sm:text-xs text-gray-500 fs uppercase tracking-wide">{label}</p>
        <p className="text-base sm:text-xl font-bold text-white fd">{value}</p>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function UserAddresses() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Load addresses
  useEffect(() => {
    const loadAddresses = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setAddresses(SAMPLE_ADDRESSES);
      setFilteredAddresses(SAMPLE_ADDRESSES);
      setLoading(false);
    };
    loadAddresses();
  }, []);
  
  // Filter addresses based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAddresses(addresses);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = addresses.filter(addr => 
        addr.name.toLowerCase().includes(query) ||
        addr.address.toLowerCase().includes(query) ||
        addr.city.toLowerCase().includes(query) ||
        addr.state.toLowerCase().includes(query) ||
        addr.pincode.includes(query) ||
        addr.type.toLowerCase().includes(query)
      );
      setFilteredAddresses(filtered);
    }
  }, [searchQuery, addresses]);
  
  // Add new address
  const addAddress = async (addressData) => {
    const newAddress = {
      ...addressData,
      id: Date.now().toString()
    };
    
    let updatedAddresses = [...addresses, newAddress];
    
    // If new address is default, remove default from others
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    }
    
    setAddresses(updatedAddresses);
    setToast({ message: "Address added successfully!", type: "success" });
  };
  
  // Update address
  const updateAddress = async (addressData) => {
    if (!editingAddress) return;
    
    let updatedAddresses = addresses.map(addr =>
      addr.id === editingAddress.id
        ? { ...addressData, id: addr.id }
        : addr
    );
    
    // If updated address is default, remove default from others
    if (addressData.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === editingAddress.id
      }));
    }
    
    setAddresses(updatedAddresses);
    setToast({ message: "Address updated successfully!", type: "success" });
    setEditingAddress(null);
  };
  
  // Delete address
  const deleteAddress = async (id) => {
    const addressToDelete = addresses.find(addr => addr.id === id);
    if (addressToDelete?.isDefault) {
      setToast({ message: "Cannot delete default address. Set another address as default first.", type: "error" });
      return;
    }
    
    setAddresses(addresses.filter(addr => addr.id !== id));
    setToast({ message: "Address deleted successfully!", type: "success" });
  };
  
  // Set default address
  const setDefaultAddress = (id) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updatedAddresses);
    setToast({ message: "Default address updated successfully!", type: "success" });
  };
  
  // Handle save from modal
  const handleSave = async (addressData) => {
    if (editingAddress) {
      await updateAddress(addressData);
    } else {
      await addAddress(addressData);
    }
  };
  
  const stats = {
    total: addresses.length,
    default: addresses.filter(a => a.isDefault).length,
    home: addresses.filter(a => a.type === "Home").length,
    office: addresses.filter(a => a.type === "Office").length
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center px-4">
            <Loader2 size={32} className="sm:w-10 sm:h-10 animate-spin mx-auto mb-4" style={{ color: COFFEE }} />
            <p className="text-gray-400 fs text-sm sm:text-base">Loading your addresses...</p>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white">
        <Styles />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden pb-6 sm:pb-8" style={{ background: "linear-gradient(160deg, #0C0C0C 0%, #1a1812 60%, #0C0C0C 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 65% 45% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 65%)" }} />
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }} />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 sm:gap-2 text-gray-400 hover:text-white transition-colors mb-4 sm:mb-6 fs text-xs sm:text-sm group"
            >
              <ChevronLeft size={14} className="sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="fd font-black text-white text-2xl sm:text-3xl md:text-4xl">My Addresses</h1>
                <p className="text-gray-400 fs text-xs sm:text-sm mt-1">Manage your delivery addresses</p>
              </div>
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#6F4E37] text-white font-semibold fs text-xs sm:text-sm transition-all hover:opacity-90 active:scale-95"
              >
                <Plus size={14} />
                Add New Address
              </button>
            </div>
          </div>
          
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.35), transparent)" }} />
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
            <StatCard icon={MapPin} label="Total Addresses" value={stats.total} color={COFFEE} />
            <StatCard icon={Star} label="Default Address" value={stats.default} color="#f39c12" />
            <StatCard icon={Home} label="Home" value={stats.home} color={COFFEE} />
            <StatCard icon={Building} label="Office" value={stats.office} color="#3b82f6" />
          </div>
          
          {/* Search Bar */}
          <div className="mb-5 sm:mb-6">
            <div className="relative max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search addresses by name, city, or pincode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white fs text-xs sm:text-sm placeholder:text-gray-500 focus:border-coffee transition-colors"
              />
            </div>
          </div>
          
          {/* Addresses List */}
          {filteredAddresses.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-gray-900/30 rounded-2xl border border-gray-800">
              <MapPin size={36} className="sm:w-12 sm:h-12 mx-auto text-gray-600 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-white fd mb-1 sm:mb-2">No addresses found</h3>
              <p className="text-gray-400 fs text-xs sm:text-sm mb-4 sm:mb-6 px-4">
                {searchQuery ? "Try a different search term" : "You haven't added any addresses yet"}
              </p>
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setIsModalOpen(true);
                }}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[#6F4E37] text-white font-semibold fs text-xs sm:text-sm transition-all hover:opacity-90 active:scale-95"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {filteredAddresses.map(address => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={(addr) => {
                    setEditingAddress(addr);
                    setIsModalOpen(true);
                  }}
                  onDelete={(id) => {
                    const addr = addresses.find(a => a.id === id);
                    if (addr) setDeletingAddress(addr);
                  }}
                  onSetDefault={setDefaultAddress}
                />
              ))}
            </div>
          )}
          
          {/* Address Count Info */}
          {filteredAddresses.length > 0 && (
            <p className="text-center text-xs text-gray-500 fs mt-6">
              Showing {filteredAddresses.length} of {addresses.length} addresses
            </p>
          )}
        </div>
        
        {/* Add/Edit Modal */}
        <AddressModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAddress(null);
          }}
          onSave={handleSave}
          editingAddress={editingAddress}
        />
        
        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={!!deletingAddress}
          onClose={() => setDeletingAddress(null)}
          onConfirm={() => {
            if (deletingAddress) {
              deleteAddress(deletingAddress.id);
              setDeletingAddress(null);
            }
          }}
          addressName={deletingAddress?.type || ""}
        />
        
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