import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Uses the real AuthContext logout — clears momcare_user from localStorage and resets context
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard",   path: "/admin/dashboard",        icon: "📊" },
    { name: "Products",    path: "/admin/products",          icon: "📦" },
    { name: "Orders",      path: "/admin/orders",            icon: "🧾" },
    { name: "Users",       path: "/admin/users",             icon: "👥" },
    { name: "Subscribers", path: "/admin/adminsubscribers",  icon: "🧑‍🤝‍🧑" },
    { name: "Contacts",    path: "/admin/admincontacts",     icon: "📧" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50
          w-64 bg-white shadow-lg
          h-full
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-5 border-b">
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3
                p-3 rounded-lg transition duration-200 font-medium
                ${isActive ? "bg-blue-500 text-white shadow" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-2xl"
            >
              ☰
            </button>

            <h2 className="font-semibold text-lg">Admin Dashboard</h2>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700">{user?.name || "Admin"}</p>
              </div>
              <div className="w-9 h-9 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                A
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>

          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;
