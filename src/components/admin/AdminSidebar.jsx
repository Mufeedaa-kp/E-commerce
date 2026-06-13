import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {

  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Contacts", path: "/admin/admincontacts" },       // ✅ ADD THIS
    { name: "Subscribers", path: "/admin/adminsubscribers" }, // ✅ ADD THIS
  ];

  return (

    <div className="w-64 bg-white shadow-md min-h-screen p-4">

      <h2 className="text-xl font-bold mb-6">
        Admin Panel
      </h2>

      <nav className="space-y-2">

        {menu.map(item => (

          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-primary-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>

        ))}

      </nav>

    </div>

  );
}

export default AdminSidebar;