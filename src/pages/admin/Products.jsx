import { useEffect, useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";

const CATEGORIES = ["Clothing", "Diapering", "Teethers", "Blankets", "Furniture", "Skincare"];

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const emptyProduct = { name: "", price: "", image: "", category: "", description: "", rating: "", stock: "" };
  const [formData, setFormData] = useState(emptyProduct);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/admin/products");
      setProducts(res.data.data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.isActive !== false &&
      (selectedCategory === "All" || product.category === selectedCategory) &&
      (
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
      )
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddModal = () => {
    setEditing(null);
    setFormData(emptyProduct);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditing(product);
    setFormData({
      name: product.name || "",
      price: product.price || "",
      image: product.image || "",
      category: product.category || "",
      description: product.description || "",
      rating: product.rating || "",
      stock: product.stock || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      toast.error("Please fill required fields");
      return;
    }

    if (!editing) {
      const exists = products.find(
        (p) => p.name?.toLowerCase() === formData.name.toLowerCase()
      );
      if (exists) {
        toast.error("Product already exists");
        return;
      }
    }

    try {
      if (editing) {
        await api.patch(`/admin/products/${editing._id}`, {
          
          name: formData.name,
          price: Number(formData.price),
          image: formData.image,
          category: formData.category,
          description: formData.description,
          rating: formData.rating !== "" ? Number(formData.rating) : editing.rating,
          stock: formData.stock !== "" ? Number(formData.stock) : editing.stock,
        })
        toast.success("Product updated");
      } else {
        await api.post("/products", {
          ...formData,
          price: Number(formData.price),
          rating: formData.rating !== "" ? Number(formData.rating) : 0,
          stock: formData.stock !== "" ? Number(formData.stock) : 0,
          isActive: true,
        });
        toast.success("Product added");
      }
      setShowModal(false);
      fetchProducts();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Deactivate this product?")) return;
    try {
      await api.patch(`/admin/products/${productId}`, { isActive: false });
      toast.success("Product deactivated");
      fetchProducts();
    } catch {
      toast.error("Failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Products Management</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          + Add Product
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-64"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {filteredProducts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {products.length === 0 ? "No products found" : "No products match your search"}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-green-600 font-semibold">₹{product.price}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Product" : "Add Product"}
            </h2>
            <div className="space-y-3">
              <input
                name="name"
                placeholder="Product name *"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="price"
                type="number"
                placeholder="Price *"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="stock"
                type="number"
                placeholder="Stock quantity"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="rating"
                type="number"
                placeholder="Rating (0–5)"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border p-2 rounded"
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded"
                />
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;