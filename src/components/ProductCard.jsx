import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-hot-toast";

function ProductCard({ product }) {
  const {
    _id,
    name,
    price,
    image,
    category,
    rating = 0,
    stock,
    sizes = []
  } = product;

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value));

  const { addToCart } = useCart();
  const { user, loading } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();

  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("");

  
  const isInWishlist = wishlist?.some(
    (item) => item._id === _id
  );

  
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      await toggleWishlist(_id);
    } catch (err) {
      console.log(err);
      toast.error("Wishlist update failed");
    }
  };

  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
        
      await addToCart(_id, 1);
      toast.success("Added to cart!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col">

      
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 p-2 rounded-full transition
        ${
          isInWishlist
            ? "bg-red-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-red-100"
        }`}
      >
        <FiHeart />
      </button>


      <Link to={`/product/${_id}`}>
        <img
          src={image}
          alt={name}
          className="h-40 w-full object-cover rounded-md mb-3"
        />
      </Link>

      
      <h3 className="font-semibold text-sm mb-1">{name}</h3>


      <p className="text-gray-500 text-xs mb-1">{category}</p>

    
      <div className="text-yellow-500 text-sm mb-2">
        {"★".repeat(Math.floor(rating))}
        {"☆".repeat(5 - Math.floor(rating))}
      </div>

     
      <p className="font-bold text-lg mb-3">
        {formatPrice(price)}
      </p>

    
      {sizes.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Size:</p>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`px-2 py-1 text-xs border rounded-md transition
                ${
                  selectedSize === size
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      
      <button
        onClick={handleAddToCart}
        disabled={stock === 0}
        className={`mt-auto py-2 rounded-lg transition flex items-center justify-center gap-2 text-white
        ${
          stock === 0
            ? "bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <FiShoppingCart />
        {stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>

    </div>
  );
}

export default ProductCard;