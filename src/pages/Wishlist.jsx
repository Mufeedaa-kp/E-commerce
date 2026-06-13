import { useWishlist } from "../context/WishlistContext";
import { Link, useNavigate } from "react-router-dom";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  

 
  if (!wishlist.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h2 className="text-2xl font-semibold mb-4">
          Your Wishlist is Empty ❤️
        </h2>

        <Link
          to="/products"
          className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        My Wishlist ❤️
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        {wishlist.map((product) => (
          <div
            key={product._id}   
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
          >

            
            <div
              className="cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}  
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">
                  {product.name}
                </h2>
              </div>
            </div>

            
            <div className="px-4 pb-4">
              <p className="text-primary font-bold mb-4">
                ₹{product.price}
              </p>

              <button
                onClick={() => removeFromWishlist(product._id)} // ✅ FIXED
                className="w-full flex items-center justify-center gap-2 
                bg-red-500 text-white py-2 rounded-lg 
                hover:bg-red-600 transition"
              >
                🗑 Remove
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Wishlist;