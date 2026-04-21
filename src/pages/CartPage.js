import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Trash2, Plus, Minus, Heart, ShoppingBag, 
  MapPin, CreditCard, Truck, Clock, Shield,
  ChevronRight, CheckCircle, X, Edit2,
  PlusCircle, Home, Building, Navigation
} from "lucide-react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const COFFEE = "#6F4E37";

// Sample cart data
const initialCartItems = [
  {
    id: 1,
    name: "Oversized Denim Jacket",
    price: 89.99,
    originalPrice: 129.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
    color: "Blue",
    size: "M",
    inStock: true,
    seller: "Urban Chic",
    deliveryDate: "Dec 25, 2024"
  },
  {
    id: 2,
    name: "Classic White Sneakers",
    price: 69.99,
    originalPrice: null,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
    color: "White",
    size: "8",
    inStock: true,
    seller: "Urban Stride",
    deliveryDate: "Dec 24, 2024"
  },
  {
    id: 3,
    name: "Wireless Noise Cancelling Headphones",
    price: 199.99,
    originalPrice: 299.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    color: "Black",
    size: "One Size",
    inStock: true,
    seller: "AudioTech",
    deliveryDate: "Dec 26, 2024"
  }
];

// Sample addresses
const savedAddresses = [
  {
    id: 1,
    type: "Home",
    name: "John Doe",
    phone: "+1 234 567 8900",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    pincode: "10001",
    landmark: "Near Central Park",
    isDefault: true
  },
  {
    id: 2,
    type: "Office",
    name: "John Doe",
    phone: "+1 234 567 8901",
    address: "456 Business Park, Floor 12",
    city: "New York",
    state: "NY",
    pincode: "10018",
    landmark: "Times Square",
    isDefault: false
  }
];

// Payment methods
const paymentMethods = [
  { id: "cod", name: "Cash on Delivery", icon: "💰", available: true },
  { id: "card", name: "Credit/Debit Card", icon: "💳", available: true },
  { id: "upi", name: "UPI", icon: "📱", available: true },
  { id: "netbanking", name: "Net Banking", icon: "🏦", available: true }
];

const CartItem = ({ item, onUpdateQuantity, onRemove, onSaveForLater }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    setIsUpdating(true);
    await onUpdateQuantity(item.id, newQuantity);
    setIsUpdating(false);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-4 sm:p-6 border border-gray-800 hover:border-gray-700 transition-all">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 md:w-40 h-48 sm:h-32 md:h-40 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
          />
          {!item.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
              <span className="text-white text-xs font-semibold bg-red-600 px-2 py-1 rounded">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-base sm:text-lg mb-1">{item.name}</h3>
              <p className="text-xs text-gray-400 mb-2">Sold by: {item.seller}</p>
              
              {/* Variants */}
              <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                {item.color && <span>Color: {item.color}</span>}
                {item.size && <span>Size: {item.size}</span>}
              </div>

              {/* Delivery Info */}
              <div className="flex items-center gap-2 text-xs text-green-500">
                <Truck size={12} />
                <span>Delivery by {item.deliveryDate}</span>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2">
              <div className="text-right">
                <div className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                {item.originalPrice && (
                  <div className="text-xs text-gray-500 line-through">
                    ${(item.originalPrice * item.quantity).toFixed(2)}
                  </div>
                )}
                {item.originalPrice && (
                  <div className="text-xs text-green-500">
                    Save ${((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSaveForLater(item.id)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Save for later"
                >
                  <Heart size={18} />
                </button>
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Quantity:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  className="w-8 h-8 rounded-lg border border-gray-700 flex items-center justify-center hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating || item.quantity >= 10}
                  className="w-8 h-8 rounded-lg border border-gray-700 flex items-center justify-center hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {item.inStock ? "In Stock" : "Out of Stock"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddressCard = ({ address, isSelected, onSelect, onEdit, onDelete }) => {
  return (
    <div
      onClick={() => onSelect(address.id)}
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected 
          ? "border-coffee bg-coffee/10" 
          : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
      }`}
      style={{ borderColor: isSelected ? COFFEE : undefined }}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <CheckCircle size={20} style={{ color: COFFEE }} />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-800 rounded-lg flex-shrink-0">
          {address.type === "Home" ? <Home size={18} /> : <Building size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-semibold">{address.type}</h4>
            {address.isDefault && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
          </div>
          <p className="text-sm text-gray-300 break-words">{address.name}</p>
          <p className="text-sm text-gray-400">{address.phone}</p>
          <p className="text-sm text-gray-400 mt-1 break-words">
            {address.address}, {address.city}, {address.state} - {address.pincode}
          </p>
          {address.landmark && (
            <p className="text-xs text-gray-500 mt-1">Landmark: {address.landmark}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col xs:flex-row gap-2 mt-3 pt-3 border-t border-gray-800">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(address); }}
          className="flex-1 px-3 py-1.5 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
        >
          <Edit2 size={14} />
          Edit
        </button>
        {!address.isDefault && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(address.id); }}
            className="flex-1 px-3 py-1.5 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

const AddAddressModal = ({ isOpen, onClose, onSave, editingAddress }) => {
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

  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
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
  }, [editingAddress]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address Type</label>
            <div className="flex flex-wrap gap-2">
              {["Home", "Office", "Other"].map(type => (
                <button
                  key={type}
                  onClick={() => setFormData({...formData, type})}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    formData.type === type 
                      ? "bg-coffee text-white" 
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                  style={{ backgroundColor: formData.type === type ? COFFEE : undefined }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-coffee"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-coffee"
              placeholder="+1 234 567 8900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows="2"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-coffee"
              placeholder="Street address, apartment, etc."
            />
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-coffee"
                placeholder="New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-coffee"
                placeholder="NY"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pincode</label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => setFormData({...formData, pincode: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-coffee"
              placeholder="10001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Landmark (Optional)</label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => setFormData({...formData, landmark: e.target.value})}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-coffee"
              placeholder="Near Central Park"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
              className="rounded border-gray-600"
            />
            <span className="text-sm">Set as default address</span>
          </label>
        </div>

        <div className="sticky bottom-0 bg-gray-900 p-4 border-t border-gray-800 flex flex-col xs:flex-row gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-4 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: COFFEE }}
          >
            {editingAddress ? "Update" : "Save"} Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [selectedItems, setSelectedItems] = useState([]);
  const [addresses, setAddresses] = useState(savedAddresses);
  const [selectedAddress, setSelectedAddress] = useState(
    savedAddresses.find(addr => addr.isDefault)?.id || null
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [step, setStep] = useState(1); // 1: Cart, 2: Address, 3: Payment, 4: Confirmation
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Select/Deselect all items
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  const toggleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    setSelectedItems(selectedItems.filter(id => id !== itemId));
  };

  // Save for later
  const saveForLater = (itemId) => {
    alert("Item saved for later!");
    removeItem(itemId);
  };

  // Calculate totals
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = selectedCartItems.reduce((sum, item) => 
    sum + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0), 0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal - discount + shipping + tax;

  // Apply promo code
  const applyPromo = () => {
    if (promoCode === "SAVE20") {
      setAppliedPromo({ code: "SAVE20", discount: total * 0.2 });
    } else if (promoCode === "FREESHIP") {
      setAppliedPromo({ code: "FREESHIP", discount: shipping });
    } else {
      alert("Invalid promo code");
      return;
    }
    setPromoCode("");
  };

  const finalTotal = total - (appliedPromo?.discount || 0);

  // Handle address operations
  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: Date.now(),
      isDefault: address.isDefault || addresses.length === 0
    };
    
    let updatedAddresses = [...addresses, newAddress];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    }
    
    setAddresses(updatedAddresses);
    if (newAddress.isDefault) setSelectedAddress(newAddress.id);
    setShowAddAddressModal(false);
  };

  const editAddress = (address) => {
    setEditingAddress(address);
    setShowAddAddressModal(true);
  };

  const updateAddress = (updatedAddress) => {
    let updatedAddresses = addresses.map(addr =>
      addr.id === updatedAddress.id ? updatedAddress : addr
    );
    
    if (updatedAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === updatedAddress.id
      }));
    }
    
    setAddresses(updatedAddresses);
    if (updatedAddress.isDefault) setSelectedAddress(updatedAddress.id);
    setShowAddAddressModal(false);
    setEditingAddress(null);
  };

  const deleteAddress = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    if (selectedAddress === addressId) {
      const newDefault = addresses.find(addr => addr.id !== addressId);
      setSelectedAddress(newDefault?.id || null);
    }
  };

  // Place order
  const placeOrder = () => {
    if (selectedItems.length === 0) {
      alert("Please select items to checkout");
      return;
    }
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    setOrderPlaced(true);
    setStep(4);
    
    // Simulate order placement
    setTimeout(() => {
      setCartItems(cartItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }, 2000);
  };

  // Order confirmation component
  if (orderPlaced && step === 4) {
    return (
      <>
        <Header />
        <div className="bg-black text-white min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl p-6 sm:p-8 border border-gray-800">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-400 text-sm sm:text-base mb-6">
                Thank you for your order. You will receive a confirmation email shortly.
              </p>
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-xs sm:text-sm text-gray-400">Order Number</p>
                <p className="font-mono text-sm sm:text-lg break-all">#ORD-{Date.now()}</p>
              </div>
              <div className="flex flex-col xs:flex-row gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-sm sm:text-base"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate("/orders")}
                  className="flex-1 px-4 py-2 rounded-lg text-white font-semibold text-sm sm:text-base"
                  style={{ backgroundColor: COFFEE }}
                >
                  View Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="bg-black text-white min-h-screen">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {/* Progress Steps - Horizontal Scroll on Mobile */}
          <div className="mb-6 sm:mb-8 overflow-x-auto pb-2">
            <div className="flex items-center justify-between min-w-[320px] sm:min-w-0 max-w-md mx-auto">
              {[
                { step: 1, label: "Cart", icon: ShoppingBag },
                { step: 2, label: "Address", icon: MapPin },
                { step: 3, label: "Payment", icon: CreditCard },
                { step: 4, label: "Confirm", icon: CheckCircle }
              ].map((s, idx) => (
                <div key={s.step} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                        step >= s.step
                          ? "bg-coffee text-white"
                          : "bg-gray-800 text-gray-500"
                      }`}
                      style={{ backgroundColor: step >= s.step ? COFFEE : undefined }}
                    >
                      <s.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <span className="text-[10px] sm:text-xs mt-1 sm:mt-2">{s.label}</span>
                  </div>
                  {idx < 3 && (
                    <div
                      className={`absolute top-4 sm:top-5 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                        step > s.step ? "bg-coffee" : "bg-gray-800"
                      }`}
                      style={{ backgroundColor: step > s.step ? COFFEE : undefined }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          {step === 1 && (
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-gray-900 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600"
                      />
                      <span className="text-xs sm:text-sm">
                        Select All ({cartItems.length} items)
                      </span>
                    </div>
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-12 bg-gray-900 rounded-xl">
                    <ShoppingBag size={40} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-gray-400 text-sm sm:text-base mb-4">Looks like you haven't added anything yet</p>
                    <button
                      onClick={() => navigate("/products")}
                      className="px-6 py-2 rounded-lg text-white"
                      style={{ backgroundColor: COFFEE }}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {cartItems.map(item => (
                      <div key={item.id} className="relative">
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleSelectItem(item.id)}
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600"
                          />
                        </div>
                        <CartItem
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeItem}
                          onSaveForLater={saveForLater}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Order Summary */}
              {cartItems.length > 0 && (
                <div className="lg:sticky lg:top-24 h-fit">
                  <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-4 sm:p-6 border border-gray-800">
                    <h2 className="text-base sm:text-lg font-bold mb-4">Order Summary</h2>
                    
                    <div className="space-y-2 sm:space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-500">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Shipping</span>
                        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Tax (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      
                      {appliedPromo && (
                        <div className="flex justify-between text-sm text-green-500">
                          <span>Promo ({appliedPromo.code})</span>
                          <span>-${appliedPromo.discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-800 pt-3 mt-3">
                        <div className="flex justify-between font-bold text-base sm:text-lg">
                          <span>Total</span>
                          <span>${finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div className="mb-4">
                      <div className="flex flex-col xs:flex-row gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Promo code"
                          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-coffee text-sm"
                        />
                        <button
                          onClick={applyPromo}
                          className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-sm"
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                        Try "SAVE20" or "FREESHIP"
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (selectedItems.length === 0) {
                          alert("Please select items to checkout");
                        } else {
                          setStep(2);
                        }
                      }}
                      disabled={selectedItems.length === 0}
                      className="w-full py-2.5 sm:py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                      style={{ backgroundColor: COFFEE }}
                    >
                      Proceed to Checkout
                      <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Address Selection Step */}
          {step === 2 && (
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
                  <h2 className="text-base sm:text-lg font-bold">Select Delivery Address</h2>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setShowAddAddressModal(true);
                    }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-coffee rounded-lg text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
                    style={{ backgroundColor: COFFEE }}
                  >
                    <PlusCircle size={14} className="sm:w-4 sm:h-4" />
                    Add New Address
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12 bg-gray-900 rounded-xl">
                    <MapPin size={40} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No saved addresses</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map(address => (
                      <AddressCard
                        key={address.id}
                        address={address}
                        isSelected={selectedAddress === address.id}
                        onSelect={setSelectedAddress}
                        onEdit={editAddress}
                        onDelete={deleteAddress}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-4 sm:p-6 border border-gray-800">
                  <h2 className="text-base sm:text-lg font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Items</span>
                      <span>{selectedCartItems.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Amount</span>
                      <span className="font-bold">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!selectedAddress) {
                        alert("Please select a delivery address");
                      } else {
                        setStep(3);
                      }
                    }}
                    className="w-full py-2.5 sm:py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                    style={{ backgroundColor: COFFEE }}
                  >
                    Continue to Payment
                    <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {step === 3 && (
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-base sm:text-lg font-bold">Select Payment Method</h2>
                
                <div className="space-y-3">
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      onClick={() => method.available && setSelectedPaymentMethod(method.id)}
                      className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPaymentMethod === method.id
                          ? "border-coffee bg-coffee/10"
                          : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
                      } ${!method.available && "opacity-50 cursor-not-allowed"}`}
                      style={{ borderColor: selectedPaymentMethod === method.id ? COFFEE : undefined }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl sm:text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm sm:text-base">{method.name}</h3>
                          {!method.available && (
                            <p className="text-xs text-gray-500">Coming soon</p>
                          )}
                        </div>
                        {selectedPaymentMethod === method.id && (
                          <CheckCircle size={18} className="sm:w-5 sm:h-5" style={{ color: COFFEE }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div className="bg-gray-900 rounded-xl p-3 sm:p-4 mt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Truck size={16} className="sm:w-[18px] sm:h-[18px]" />
                    Delivery Information
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between flex-wrap gap-1">
                      <span className="text-gray-400">Estimated Delivery</span>
                      <span>Dec 24-26, 2024</span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-1">
                      <span className="text-gray-400">Shipping Method</span>
                      <span>Express Shipping</span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-1">
                      <span className="text-gray-400">Return Policy</span>
                      <span>30 Days Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-4 sm:p-6 border border-gray-800">
                  <h2 className="text-base sm:text-lg font-bold mb-4">Payment Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Order Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Payment Method</span>
                      <span className="text-right">{paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}</span>
                    </div>
                  </div>

                  <button
                    onClick={placeOrder}
                    className="w-full py-2.5 sm:py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                    style={{ backgroundColor: COFFEE }}
                  >
                    Place Order
                    <Shield size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  
                  <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3">
                    By placing order, you agree to our Terms & Conditions
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      <AddAddressModal
        isOpen={showAddAddressModal}
        onClose={() => {
          setShowAddAddressModal(false);
          setEditingAddress(null);
        }}
        onSave={(address) => {
          if (editingAddress) {
            updateAddress({ ...address, id: editingAddress.id });
          } else {
            addAddress(address);
          }
        }}
        editingAddress={editingAddress}
      />
    </>
  );
}