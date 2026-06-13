import api from "../api/api";


export const getAllOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};


export const getUserOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};


export const createOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};


export const updateOrderStatus = async (id, status) => {
  const res = await api.patch(`/orders/${id}`, { status });
  return res.data;
};