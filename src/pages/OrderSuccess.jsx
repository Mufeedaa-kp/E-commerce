import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
  
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value));

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 text-center">
      
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-20 h-20" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-6">
          Thank you, <span className="font-semibold text-gray-700">{order.customer?.name}</span>! Your order has been placed successfully.
        </p>

       
        <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order ID</span>
            <span className="font-semibold text-gray-700">#{order._id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold text-gray-700">
              {order.createdAt
  ? new Date(order.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  : "N/A"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {order.status}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping to</span>
            <span className="font-semibold text-gray-700 text-right max-w-[55%]">
             {[
    order.shippingAddress?.street,
    order.shippingAddress?.city,
    order.shippingAddress?.state,
    order.shippingAddress?.pincode,
    order.shippingAddress?.country,
  ]
    .filter(Boolean)
    .join(", ")}
            </span>
          </div>
        </div>

        
        <div className="text-left mb-6">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Items Ordered
          </h2>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm border-b pb-2 last:border-b-0"
              >
                <span className="text-gray-700">
                  {item.name}{" "}
                  <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span className="font-medium text-gray-800">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

       
        <div className="bg-primary-50 rounded-xl p-4 text-left space-y-1 mb-8">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t">
            <span>Total</span>
            <span className="text-primary-600">{formatPrice(order.total)}</span>
          </div>
        </div>

      
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/products")}
            className="flex-1 border border-primary-600 text-primary-600 py-3 rounded-lg hover:bg-primary-50 transition font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
