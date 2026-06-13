import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import api from "../api/api";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000";

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      if (!user) return;

      const res = await api.get("/orders");

      setOrders(res.data.data); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [user]);

  if (loading) return <Loader />;

  if (orders.length === 0)
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="mt-4 text-gray-500">No orders found.</p>
      </div>
    );
    // const { addToCart } = useCart();

// const handleReorder = (order) => {
//   order.items.forEach(item => {
//     addToCart({
//       productId: item.productId,
//       name: item.name,
//       price: item.price,
//       quantity: item.quantity
//     });
//   });

//   toast.success("Items added to cart");
// };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-lg p-4 mb-4 shadow"
        >
          <div className="flex justify-between mb-2">
            <span className="font-semibold">
              Order ID: {order._id}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between"
              >
                <span>
                  {item.product?.name} × {item.quantity}
                </span>
               <span>Total: ₹{order.totalAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-4">

  <Link
    to={`/orders/${order._id}`}
    className="text-blue-600 hover:underline"
  >
    View Details
  </Link>

  {/* <button
    onClick={() => handleReorder(order)}
    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
  >
    Reorder
  </button> */}

</div>

          <div className="mt-3 flex justify-between font-bold">
            <span>Status: {order.status}</span>
           <span>Total: ₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;