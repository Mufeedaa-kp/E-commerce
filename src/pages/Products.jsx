import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import SortDropdown from "../components/SortDropdown";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await api.get("/products?limit=100");

        setAllProducts(res.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let updated = [...allProducts];

    if (searchQuery) {
      updated = updated.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      updated = updated.filter(
        (product) => product.category === selectedCategory
      );
    }

    switch (sortBy) {
      case "recommended":
      case "rating_desc":
        updated.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;

      case "price_asc":
        updated.sort((a, b) => a.price - b.price);
        break;

      case "price_desc":
        updated.sort((a, b) => b.price - a.price);
        break;

      case "name_asc":
        updated.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "newest":
        updated.sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );
        break;

      default:
        break;
    }

    return updated;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const indexOfLastProduct =
    currentPage * productsPerPage;

  const indexOfFirstProduct =
    indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <SearchBar onSearch={setSearchQuery} />

        <SortDropdown
          currentSort={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      <CategoryFilter
        categories={[
          "Clothing",
          "Diapering",
          "Teethers",
          "Blankets",
          "Furniture",
          "Skincare",
        ]}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <p className="text-sm text-gray-500">
        Showing {currentProducts.length} of{" "}
        {filteredProducts.length} products
      </p>

      {currentProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              className="cursor-pointer"
              onClick={() =>
                navigate(`/product/${product._id}`)
              }
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() =>
              handlePageChange(currentPage - 1)
            }
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          >
            ← Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() =>
                handlePageChange(index + 1)
              }
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === index + 1
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              handlePageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;