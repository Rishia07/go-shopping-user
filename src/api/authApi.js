import axios from "../config/axiosConfig";
import * as SecureStore from "expo-secure-store";

const API_KEY = process.env.EXPO_PUBLIC_BACKEND_API_KEY;
const fetchUsersURL = `${API_KEY}/api/users`;

export const login = async (credentials) => {
  const response = await axios.post(`${fetchUsersURL}/login`, credentials);
  if (response.data.role !== "user") {
    return alert("Only User can access this website!");
  }
  await SecureStore.setItemAsync("token", response.data.token);
  await SecureStore.setItemAsync("userId", response.data.userId);
};

export const register = async (newUser) => {
  const { data } = await axios.post(`${fetchUsersURL}/register`, newUser);
  return data;
};

export const fetchUserOrders = async () => {
  const id = await SecureStore.getItemAsync("userId");
  if (!id) throw new Error("No user currently logged in!");
  const { data } = await axios.get(`${fetchUsersURL}/orders/${id}`);
  return data;
};

export const fetchCurrentUser = async () => {
  const id = await SecureStore.getItemAsync("userId");
  if (!id) throw new Error("No user currently logged in!");
  const { data } = await axios.get(`${fetchUsersURL}/${id}`);
  return data;
};

export const updateUser = async (updatedUser) => {
  const id = await SecureStore.getItemAsync("userId");
  if (!id) throw new Error("No user currently logged in!");
  const { data } = await axios.put(`${fetchUsersURL}/${id}`, updatedUser);
  return data;
};

export const changePassword = async (updatedPassword) => {
  const id = await SecureStore.getItemAsync("userId");
  if (!id) throw new Error("No user currently logged in!");
  const { data } = await axios.put(`${fetchUsersURL}/${id}`, updatedPassword);
  return data;
};
