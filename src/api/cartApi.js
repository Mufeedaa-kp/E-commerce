import api from "../api/api";

export const addToCart = (productId, quantity) => {
  return api.post("/cart", { productId, quantity });
};

export const getCart = () => {
  return api.get("/cart");
};

export const updateCart = (productId, quantity) => {
  return api.put(`/cart/${productId}`, { quantity });
};

export const removeFromCart = (productId) => {
  return api.delete(`/cart/${productId}`);
};