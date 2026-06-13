import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../api/api";

const API_URL = "http://localhost:5000";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");

    fetchOrdersCount();
  }, [user]);

  const fetchOrdersCount = async () => {
    try {
      const res = await api.get("/orders");
setOrdersCount(res.data.total || res.data.data.length);
    } catch {
      console.error("Error fetching orders");
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await api.patch(`/users/${user._id}`, {
  name,
  email,
  phone,
});

      setUser(res.data.data);

      toast.success("Profile updated successfully 🎉");
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          My Profile
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">

            <div className="w-24 h-24 mx-auto bg-primary-600 text-white flex items-center justify-center rounded-full text-3xl font-bold mb-4">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>

            <h2 className="text-xl font-semibold">
              {name || "User"}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {email}
            </p>

            <div className="mt-6 space-y-3 text-sm">

              <div className="flex justify-between">
                <span>Total Orders</span>

                <span className="font-semibold">
                  {ordersCount}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Account Status</span>

                <span className="text-green-600 font-semibold">
                  Active
                </span>
              </div>

            </div>

           
            <button
              onClick={() => navigate("/orders")}
              className="mt-6 w-full bg-pink-100 text-pink-600 py-2 rounded-lg hover:bg-pink-200 transition"
            >
              View Orders
            </button>

            
            <button
              onClick={() => navigate("/my-contact-replies")}
              className="mt-3 w-full bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition"
            >
              My Replies
            </button>

          </div>

          
          <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-8">

            <h2 className="text-xl font-semibold mb-6">
              Edit Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Full Name
                </label>

                <input
                  type="text"
                  className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-primary-400 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>

                <input
                  type="email"
                  className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-primary-400 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>

                <input
                  type="text"
                  className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-primary-400 outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="mt-8 bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;