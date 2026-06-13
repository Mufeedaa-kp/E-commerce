import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  Home as HomeIcon,
  Box,
  Info,
  Phone,
  Heart,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { clearWishlist } = useWishlist();

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = (cart || []).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();      
    clearWishlist();      
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { name: "Home", path: "/", icon: <HomeIcon size={16} /> },
    { name: "Products", path: "/products", icon: <Box size={16} /> },
    { name: "About", path: "/about", icon: <Info size={16} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={16} /> },
    { name: "Wishlist", path: "/wishlist", icon: <Heart size={16} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

       
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-primary-600">🍼</span>
          Babio
        </Link>

       
        <div className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1 hover:text-primary-600 ${
                isActive(item.path) ? "text-primary-600 font-bold" : ""
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </div>

        
        <div className="flex items-center gap-4">

         
          <Link to="/cart" className="relative">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          
          {!user ? (
            <Link
              to="/login"
              className="flex items-center gap-1 hover:text-primary-600 font-medium"
            >
              <User size={18} /> Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-sm"
              >
                <User size={18} />
                Hello, {user.name}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

     
      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1 ${
                isActive(item.path) ? "text-primary-600 font-bold" : ""
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}

          {!user && (
            <Link
              to="/login"
              className="flex items-center gap-1 hover:text-primary-600 font-medium"
            >
              <User size={18} /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;