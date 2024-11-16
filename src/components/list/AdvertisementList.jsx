import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchAdvertisements } from "../../api/advertisementApi";

export default function AdvertisementList() {
  // Fetch advertisements using TanStack Query
  const { data, error, isLoading } = useQuery({
    queryKey: ["advertisements"],
    queryFn: fetchAdvertisements,
  });

  // Show loader while the data is loading
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle error case
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load advertisements.</Text>
      </View>
    );
  }

  // Render each advertisement item
  const renderAdvertisementItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.image }} style={styles.carouselImage} />
      <View style={styles.carouselTextContainer}>
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderAdvertisementItem}
      keyExtractor={(item) => item._id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContentContainer}
    />
  );
}

const styles = StyleSheet.create({
  carouselItem: {
    width: Dimensions.get("window").width - 30,
    height: 200,
    overflow: "hidden",
    borderRadius: 10,
    marginRight: 10,
    position: "relative",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  carouselTextContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  carouselTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  carouselDescription: {
    color: "#fff",
    fontSize: 14,
  },
  carouselContentContainer: {
    paddingHorizontal: 15,
    alignItems: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});
