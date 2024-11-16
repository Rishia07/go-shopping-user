import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const useFetchCurrentUserData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUserData = useCallback(async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId"); 
      const token = await SecureStore.getItemAsync("token"); 
      const response = await axios.get(`https://go-shopping-api-mauve.vercel.app/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchCurrentUserData();
  }, [fetchCurrentUserData]);

  return { data, loading, fetchCurrentUserData };
};

export default useFetchCurrentUserData;
