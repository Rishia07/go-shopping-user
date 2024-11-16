import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetchData from "../hooks/useFetchData";
import * as SecureStore from "expo-secure-store";
import Loader from "../components/Loader";
import CartCard from "../components/card/CartCard";
import axios from "axios";
import useFetchCurrentUserData from "../hooks/useCurrentUser";

export default function CartScreen() {
  const [userId, setUserId] = useState(null);
  const { data: userData, loading: userLoading } = useFetchCurrentUserData();
  const { data, loading } = useFetchData(
    `https://go-shopping-api-mauve.vercel.app/api/users/carts`
  );
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0.00");

  useEffect(() => {
    async function fetchUserId() {
      const id = await SecureStore.getItemAsync("userId");
      setUserId(id);
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    let totalPrice = 0;
    selectedItems.forEach((item) => {
      totalPrice += parseFloat(item.price);
    });
    setTotalPrice(totalPrice.toFixed(2));
  }, [selectedItems]);

  const handleToggleCheckbox = (item) => {
    const index = selectedItems.findIndex(
      (selectedItem) => selectedItem._id === item._id
    );
    if (index > -1) {
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleBuyNow = async () => {
    if (!userData.validIdPic)
      return alert("Please attach your valid id first!");
    if (!userData.address) return alert("Please add your address first");

    if (parseFloat(totalPrice) < 100) {
      return Alert.alert(
        "Minimum Order Requirement",
        "The total price must be at least ₱100 to proceed with the purchase."
      );
    }

    const token = await SecureStore.getItemAsync("token");

    Alert.alert(
      "Confirm Purchase",
      `Are you sure you want to buy these items with a total price ₱${totalPrice}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Buy All",
          onPress: async () => {
            try {
              for (const item of selectedItems) {
                const totalPrice = (item.product.price * item.quantity).toFixed(
                  2
                );
                await axios.put(
                  `https://go-shopping-api-mauve.vercel.app/api/products/${item.product._id}`,
                  {
                    quantity: item.quantity - 1,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                await axios.post(
                  `https://go-shopping-api-mauve.vercel.app/api/orders`,
                  {
                    quantity: item.quantity,
                    price: totalPrice,
                    product: item.product._id,
                    user: userId,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                await axios.delete(
                  `https://go-shopping-api-mauve.vercel.app/api/users/cart/${item._id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
              }

              setSelectedItems([]);
              alert("Items purchased successfully!");
            } catch (error) {
              alert(error);
              console.error("Error purchasing items:", error);
            }
          },
        },
      ]
    );
  };

  const handleDelete = async () => {
    const token = await SecureStore.getItemAsync("token");

    Alert.alert(
      "Remove from Cart",
      `Are you sure you want to remove ${selectedItems.length} item(s) from your cart?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: async () => {
            try {
              for (const item of selectedItems) {
                await axios.delete(
                  `https://go-shopping-api-mauve.vercel.app/api/users/cart/${item._id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
              }

              setSelectedItems([]);

              alert("Items removed from cart successfully!");
            } catch (error) {
              alert(error);
              console.error("Error removing items from cart:", error);
            }
          },
        },
      ]
    );
  };

  if (loading || userLoading) return <Loader />;

  if (!data || !userId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>My Cart</Text>
        <Text>You are not logged in yet.</Text>
      </SafeAreaView>
    );
  }

  if (!data.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>My Cart</Text>
        <Text>Your cart is empty.</Text>
      </SafeAreaView>
    );
  }

  const userCarts = data.filter((order) => order.user._id === userId);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Cart</Text>
      <FlatList
        data={userCarts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CartCard
            item={item}
            onToggleCheckbox={handleToggleCheckbox}
            selectedItems={selectedItems}
          />
        )}
      />
      <View style={styles.footer}>
        <Text>Total Price: ₱{totalPrice}</Text>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={handleBuyNow}
          disabled={selectedItems.length === 0}
        >
          <Text style={styles.buyButtonText}>Buy All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={selectedItems.length === 0}
        >
          <Text style={styles.deleteButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  buyButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
