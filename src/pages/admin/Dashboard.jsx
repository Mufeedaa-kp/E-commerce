import { useEffect, useState } from "react";
import api from "../../api/api";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/admin/dashboard");

      const { products, orders, users, revenue } = res.data.data;
     

      setStats({
        products,
        orders:orders.length,
        users,
        revenue:Number((revenue || 0).toFixed(2)),
      });

      
      const statusCounts = orders.reduce((acc, order) => {
        const s = order.status || "Unknown";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});

      setOrderStatusData(
        Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
      );
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Active Products", value: stats.products,            icon: "📦", color: "bg-blue-500" },
    { title: "Total Orders",    value: stats.orders,              icon: "🧾", color: "bg-green-500" },
    { title: "Registered Users",value: stats.users,              icon: "👥", color: "bg-purple-500" },
    { title: "Total Revenue",   value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: "💰", color: "bg-orange-500" },
  ];

  const barData = [
    { name: "Products", value: stats.products },
    { name: "Orders",   value: stats.orders },
    { name: "Users",    value: stats.users },
  ];

  const PIE_COLORS = {
    Pending:   "#F59E0B",
    Shipped:   "#3B82F6",
    Delivered: "#10B981",
    Cancelled: "#EF4444",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome Admin</p>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
              </div>
              <div className={`${card.color} text-white p-3 rounded-lg text-xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

       
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Statistics Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

       
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
          {orderStatusData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No orders yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[entry.name] || "#8B5CF6"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
