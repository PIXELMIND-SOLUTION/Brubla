import { CheckCircle, Clock, CreditCard, Download, FileText, MapPin, MessageCircle, Package, Truck, XCircle } from "lucide-react";
import { useState } from "react";

const SingleOrderModal = ({ order, onClose }) => {
  const [activeTab, setActiveTab] = useState("items");
  
  if (!order) return null;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  };
  
  const formatPrice = (price) => `₹${price.toLocaleString()}`;
  
  const trackingSteps = [
    { label: "Order Placed", completed: true, date: order.date },
    { label: "Confirmed", completed: order.status !== "processing", date: order.date },
    { label: "Shipped", completed: order.status === "shipped" || order.status === "delivered", date: order.estimatedDelivery },
    { label: "Delivered", completed: order.status === "delivered", date: order.deliveredDate }
  ];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl bg-gray-900 border border-gray-700 animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-3 sm:p-4 md:p-5 flex justify-between items-center">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white fd">Order Details</h2>
            <p className="text-xs text-gray-400 fs font-mono mt-0.5">{order.orderNumber}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
            <XCircle size={20} className="text-gray-400" />
          </button>
        </div>
        
        <div className="flex border-b border-gray-800 px-3 sm:px-4 md:px-5 overflow-x-auto hide-scrollbar">
          {[
            { id: "items", label: "Items", icon: Package },
            { id: "tracking", label: "Tracking", icon: Truck },
            { id: "details", label: "Details", icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium fs transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? "text-coffee" : "text-gray-400 hover:text-white"
              }`}
            >
              <tab.icon size={14} className="sm:w-3.5 sm:h-3.5" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-coffee" />
              )}
            </button>
          ))}
        </div>
        
        <div className="p-3 sm:p-4 md:p-5">
          {activeTab === "items" && (
            <div className="space-y-3 sm:space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-3 sm:gap-4 p-2.5 sm:p-3 bg-gray-800/30 rounded-xl">
                  <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white fs text-sm sm:text-base">{item.name}</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-1">
                      {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                      {item.color && <p className="text-xs text-gray-400">Color: {item.color}</p>}
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-white fd mt-1.5">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
              
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-white">{formatPrice(Math.round(order.total * 0.1))}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-gray-800">
                    <span className="text-white fd">Total</span>
                    <span className="text-coffee fd">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "tracking" && (
            <div className="space-y-5 sm:space-y-6">
              <div className="relative">
                <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-0.5 bg-gray-700" />
                <div className="space-y-5 sm:space-y-6 relative">
                  {trackingSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 sm:gap-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        step.completed ? "bg-coffee/20" : "bg-gray-800"
                      }`}>
                        {step.completed ? (
                          <CheckCircle size={14} className="sm:w-[18px] sm:h-[18px] text-coffee" />
                        ) : (
                          <Clock size={12} className="sm:w-4 sm:h-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold fs text-sm ${step.completed ? "text-white" : "text-gray-500"}`}>
                          {step.label}
                        </p>
                        {step.date && (
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(step.date)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {order.trackingNumber && (
                <div className="p-3 sm:p-4 bg-gray-800/30 rounded-xl">
                  <p className="text-xs text-gray-400 fs">Tracking Number</p>
                  <p className="text-sm font-mono text-white mt-0.5 break-all">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "details" && (
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white fs flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <MapPin size={14} className="text-coffee" />
                  Shipping Address
                </h3>
                <div className="p-3 sm:p-4 bg-gray-800/30 rounded-xl">
                  <p className="font-medium text-white fs text-base">{order.shippingAddress.name}</p>
                  <p className="text-sm text-gray-400 mt-1 break-words">{order.shippingAddress.address}</p>
                  <p className="text-sm text-gray-400">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="text-sm text-gray-400 mt-2 break-words">{order.shippingAddress.phone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white fs flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <CreditCard size={14} className="text-coffee" />
                  Payment Information
                </h3>
                <div className="p-3 sm:p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Method</span>
                    <span className="text-white">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-500">Paid</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button className="flex-1 py-2.5 rounded-lg bg-coffee/10 text-coffee font-semibold text-sm fs flex items-center justify-center gap-2 hover:bg-coffee/20 transition-colors">
                  <Download size={14} />
                  Download Invoice
                </button>
                <button className="flex-1 py-2.5 rounded-lg bg-gray-800 text-white font-semibold text-sm fs flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors">
                  <MessageCircle size={14} />
                  Need Help?
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleOrderModal;