import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const useFetchData = (api) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await axios.get(api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.error("Error fetching Data:", error);      
    } finally {
      setLoading(false);
    }
  }, [data, api]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading };
};

export default useFetchData;
