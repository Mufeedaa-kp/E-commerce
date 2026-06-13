import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  const navigate = useNavigate();
  const location = useLocation();

const { login, user } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();

  const result = await login(email, password);

  if (!result) return;

  if (result.user?.role === "admin") {
    navigate("/admin/dashboard", { replace: true });
  } else {
    navigate("/", { replace: true });
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-right mt-2">
          <button className="text-sm text-pink-500 hover:underline">
            Forgot password?
          </button>
        </div>

        <div className="my-4 text-center text-gray-500">
          New customer?
        </div>

        <Link to="/register">
          <button className="w-full border border-pink-500 text-pink-500 py-2 rounded-lg hover:bg-pink-50 transition font-semibold">
            Create Account
          </button>
        </Link>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Demo: user@example.com / user123
        </p>
      </div>
    </div>
  );
};

export default Login;
