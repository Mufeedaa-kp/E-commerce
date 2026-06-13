import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import api from "../api/api";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchOrder();
}, [id]);

  if (!order) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">
        Order Details
      </h1>

      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>

      <div className="mt-6 space-y-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between border-b pb-2">
            <span>{item.product?.name} × {item.quantity}</span>
            <span>${(item.product?.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 font-bold text-lg">
        Total: ${order.totalAmount.toFixed(2)}
      </div>
    </div>
  );
};

export default OrderDetails;