import { FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../components/Loader";
import OrderCard from "../components/card/OrderCard";
import { useQuery } from "@tanstack/react-query";
import { fetchUserOrders } from "../api/authApi";

export default function OrderScreen() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["userOrders"],
    queryFn: () => fetchUserOrders(),
  });

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>My Orders</Text>
        <Text>Error fetching orders: {error.message}</Text>
      </SafeAreaView>
    );
  }
  const filteredOrders = data?.filter((order) => order.status !== "Received");

  if (!data.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>My Orders</Text>
        <Text>You have no orders.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <OrderCard order={item} />}
      />
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
});
