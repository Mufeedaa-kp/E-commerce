import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-hot-toast";
import ProductCard from "../components/ProductCard";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/products");
        console.log("Products response:", res.data);


        const products = res.data.data;

if (!products || products.length === 0) {
  setFeaturedProducts([]);
  return;
}

const sorted = [...products]
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .slice(0, 8);

setFeaturedProducts(sorted);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
        toast.error("Failed to load products");
      }
    };

    fetchFeatured();
  }, []);

  const visibleCount = 4;

  const nextSlide = () => {
    if (currentIndex + visibleCount < featuredProducts.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubscribe = async (e) => {
  e.preventDefault();

  const email = e.target.email.value;

  try {
    const res = await fetch(
      "http://localhost:5000/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok)
      throw new Error(data.message);

    toast.success(
      "Subscribed successfully 🎉"
    );

    setEmail("");
  } catch (error) {
    toast.error(
      error.message || "Failed to subscribe"
    );
  }
};

  return (
    <div className="space-y-20">
      
      <section
        className="relative h-[585px] flex items-center justify-center text-center text-white bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1676049342411-c118fe1570b2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Everything Your Little One Needs
          </h1>

          <p className="mb-6 text-lg">
            Organic, Safe & Gentle Products for Your Baby
          </p>

          <button
            onClick={() => navigate("/products")}
            className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg text-white font-medium transition"
          >
            Shop Now
          </button>
        </div>
      </section>

   
      <section className="max-w-7xl mx-auto px-4 relative">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Featured Products
        </h2>

        {featuredProducts.length === 0 ? (
          <p className="text-center text-gray-500">
            No featured products available.
          </p>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={prevSlide}
              className="text-2xl px-3 py-2 hover:bg-gray-100 rounded-full"
            >
              ⬅️
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-4">
              {featuredProducts
                .slice(currentIndex, currentIndex + visibleCount)
                .map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
            </div>

            <button
              onClick={nextSlide}
              className="text-2xl px-3 py-2 hover:bg-gray-100 rounded-full"
            >
              ➡️
            </button>
          </div>
        )}
      </section>

      
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">🚚</div>
            <p className="font-medium">Free Shipping</p>
          </div>

          <div>
            <div className="text-3xl mb-2">🎧</div>
            <p className="font-medium">24/7 Support</p>
          </div>

          <div>
            <div className="text-3xl mb-2">🔄</div>
            <p className="font-medium">Easy Returns</p>
          </div>

          <div>
            <div className="text-3xl mb-2">🌿</div>
            <p className="font-medium">Organic Certified</p>
          </div>
        </div>
      </section>

    
      <section className="bg-pink-50 py-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-semibold mb-4">
            Subscribe to Our Channel
          </h2>

          <p className="mb-6 text-gray-700">
            Get the latest updates, tips, and baby care guides straight to your
            inbox!
          </p>

          <form
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="px-4 py-2 rounded-lg border border-gray-300 w-full sm:w-auto flex-1 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;