import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItem from "../components/CartItem";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();
  console.log(cart)

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [user, authLoading, navigate]);

 
  const subtotal = getCartTotal();

  const shipping = subtotal > 1000 ? 0 : 100; 
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

     
      <h1 className="text-3xl font-bold mb-8">
        Your Cart ({cart.length} items)
      </h1>

     
      {cart.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-4">
            Your cart is empty
          </h2>

          <button
            onClick={() => navigate("/products")}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">

         
          <div className="lg:col-span-2 space-y-4">

            {cart.map((item) => (
              

              <CartItem
           
                key={`${item.product?._id}-${item.size || ""}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}

           
            <div className="flex justify-end mt-4">
              <button
                onClick={clearCart}
                className="text-red-500 hover:underline text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>

         
          <div className="bg-gray-50 p-6 rounded-xl shadow-md h-fit sticky top-24">

            <h2 className="text-xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-gray-700">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

           
            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;