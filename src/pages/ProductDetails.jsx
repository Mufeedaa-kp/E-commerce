import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart,cart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isInCart = cart.some(
  (item) => item.product?._id === product?._id
);

  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        console.log(response)

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();
         console.log(data)
        setProduct(data.data);
        setSelectedImage(data.image);

        
        const relatedResponse = await fetch(
          `http://localhost:5000/api/products?category=${data.category}`
        );
        const relatedJson = await relatedResponse.json();

        const relatedData = relatedJson.data || []

        const filteredRelated = relatedData
          .filter((item) => item._id !== data._id)
          .slice(0, 4);

        setRelatedProducts(filteredRelated);

      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader fullScreen />;

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-4">
          Product not found
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const formattedPrice = `$${Number(product.price || 0).toFixed(2)}`;

  const handleQuantityChange = (type) => {
    if (type === "increment" && quantity < product.stock)
      setQuantity((prev) => prev + 1);

    if (type === "decrement" && quantity > 1)
      setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
  toast.error("Please select a size");
  return;
}
    if (!user) {
      navigate("/login");
      return;
    }

    addToCart(
  
    product._id,
    quantity,
    selectedSize || ""
  ,
  
);

    
  };
  


  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

     
      <div className="grid md:grid-cols-2 gap-10">

        
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />

         
          <div className="flex gap-3 mt-4">
            {[product.image, ...(product.gallery || [])]
              .slice(0, 4)
              .map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="thumbnail"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                    selectedImage === img
                      ? "border-blue-500"
                      : ""
                  }`}
                />
              ))}
          </div>
        </div>

        
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-500">
              {"★".repeat(Math.floor(product.rating)) +
                "☆".repeat(5 - Math.floor(product.rating))}
            </span>
            <span className="text-gray-500 text-sm">
              ({product.rating || 0} reviews)
            </span>
          </div>

          <div className="mb-4">
            <span className="text-xl font-bold text-green-600">
              {formattedPrice}
            </span>
          </div>

          <p className="text-gray-600 mb-4">
            {product.description}
          </p>

         
          <div className="flex gap-2 mb-4">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              {product.category}
            </span>

            {product.ageGroup && (
              <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
                {product.ageGroup}
              </span>
            )}
          </div>

         
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock: {product.stock} units
              </span>
            ) : (
              <span className="text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>
         
{product.sizes && product.sizes.length > 0 && (
  <div className="mt-4">
    <p className="font-medium mb-2">Select Size:</p>

    <div className="flex gap-2 flex-wrap">
      {product.sizes.map((size) => (
        <button
          key={size}
          onClick={() => setSelectedSize(size)}
          className={`px-4 py-2 border rounded-lg transition
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


         
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="px-3 py-1 border rounded"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => handleQuantityChange("increment")}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>

         
       <button
  onClick={handleAddToCart}
  disabled={product.stock === 0}
  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
>
  Add to Cart
</button>
        </div>
      </div>

      
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6">
            Related Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
