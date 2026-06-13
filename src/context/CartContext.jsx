import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  
  const fetchCart = async () => {
    if (!user) return;

    try {
      const res = await api.get("/cart");

      const products = res.data?.data?.products || [];
      setCart(products);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  
  const addToCart = async (productId, quantity = 1, size = "") => {
    try {
      const res = await api.post("/cart", {
        productId,
        quantity,
        size,
      });
      
      const products = res.data?.data?.products || [];
      setCart(products);

      toast.success("Added to cart");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId, size = "") => {
    try {
      await api.delete(`/cart/${productId}`, {
        data: { size },
      });

      fetchCart();
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, quantity, size = "") => {
    try {
      
      await api.put(`/cart/${productId}`, {

        
        quantity,
        size,
      });
      

      fetchCart();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");

      setCart([]);
      toast.success("Cart cleared");
    } catch (err) {
      console.log(err);
      toast.error("Failed to clear cart");
    }
  };

  
  const getCartTotal = () => {
    return cart.reduce((sum, item) => {
      return sum + (item.productDetails?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);