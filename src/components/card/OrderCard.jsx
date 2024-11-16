import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { updateOrder } from "../../api/ordersApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";

export default function OrderCard({ order }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(["userOrders"]);
    },
    onError: (error) => {
      console.error("Error updating order:", error);
    },
  });

  const handleReceived = async () => {
    Alert.alert(
      "Confirm Receipt",
      "Are you sure you want to mark this order as received?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await updateMutation.mutate({ id: order._id, status: "Received" });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            order.product.photoURL[0] || "https://i.stack.imgur.com/l60Hf.png",
        }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text>{order.status}</Text>
        <Text style={styles.title}>{order.product.title}</Text>
        <View style={styles.priceQuantityContainer}>
          <Text>{order.quantity} items</Text>
          <Text style={styles.price}>₱ {order.price}</Text>
        </View>
        {order.status === "Delivered" && order.rider && (
          <TouchableOpacity style={styles.rateBtn} onPress={handleReceived}>
            <Text style={styles.rateText}>Received Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  priceQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontWeight: "bold",
  },
  rateBtn: {
    backgroundColor: "#5cb85c",
    paddingVertical: 12,
    marginTop: 6,
    borderRadius: 5,
    alignItems: "center",
  },
  rateText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
