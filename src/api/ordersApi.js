import axios from "../config/axiosConfig";

const API_KEY = process.env.EXPO_PUBLIC_BACKEND_API_KEY;
const fetchOrdersURL = `${API_KEY}/api/orders`;

export const fetchOrders = async () => {
  const { data } = await axios.get(fetchOrdersURL);
  return data;
};

export const fetchOrder = async (id) => {
  const { data } = await axios.get(`${fetchOrdersURL}/${id}`);
  return data;
};

export const createOrder = async (newOrder) => {
  const { data } = await axios.post(fetchOrdersURL, newOrder);
  return data;
};

export const updateOrder = async ({ id, status }) => {
  const { data } = await axios.put(`${fetchOrdersURL}/${id}`, { status });
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await axios.delete(`${fetchOrdersURL}/${id}`);
  return data;
};
