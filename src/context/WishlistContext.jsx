import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  
  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      const res = await API.get("/wishlist");
      setWishlist(Array.isArray(res.data) ? res.data : []); // backend populated products
    } catch (err) {
      console.log("Wishlist fetch error:", err);
    }
  };

  
  const toggleWishlist = async (productId) => {
    if (!user) return;

    try {
      await API.patch(`/wishlist/${productId}`);

      
      await fetchWishlist();
    } catch (err) {
      console.log("Toggle wishlist error:", err);
    }
  };

 const clearWishlist = () => {
  setWishlist([]);
};

 const removeFromWishlist = async (productId) => {
  try {
     
    
    await API.delete(`/wishlist/${productId}`); 
    
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
    await fetchWishlist();
    
  } catch (err) {
    console.log("Remove wishlist error:", err);
  }
};

  
  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        fetchWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);