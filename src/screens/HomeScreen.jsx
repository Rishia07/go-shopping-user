import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import useFetchData from "../hooks/useFetchData";
import ProductCard from "../components/card/ProductCard";
import Loader from "../components/Loader";
import CategoryCard from "../components/card/CategoryCard";
import { categoryList } from "../data/CategoryList";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: productData, loading } = useFetchData(
    `https://go-shopping-api-mauve.vercel.app/api/products`
  );

  if (loading) return <Loader />;

  const filteredProductData = productData.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "" || product.category === selectedCategory)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.searchInput}>
          <Ionicons name="search-outline" size={25} color="gray" />
          <TextInput
            style={{ width: "90%" }}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            placeholder="Search products"
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryContainer}>
            {categoryList.map((item) => (
              <CategoryCard
                key={item}
                item={item}
                selectedCategory={selectedCategory}
                onPress={(selectedItem) =>
                  setSelectedCategory(
                    selectedItem === selectedCategory ? "" : selectedItem
                  )
                }
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <ScrollView>
        <View style={{ padding: 12 }}>
          <Text style={styles.sectionTitle}>Latest products</Text>
          {filteredProductData.length === 0 ? (
            <Text>
              We couldn't find anything for {searchQuery || selectedCategory}
            </Text>
          ) : (
            <View style={styles.productGrid}>
              {filteredProductData.map((item) => (
                <View key={item._id} style={styles.productItem}>
                  <ProductCard item={item} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#5cb85c",
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    padding: 12,
  },
  searchInput: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  carouselItem: {
    width: Dimensions.get("window").width - 30,
    height: 200,
    overflow: "hidden",
    borderRadius: 10,
    marginRight: 10, // Added margin to space between items
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
  categoryContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productItem: {
    width: "48%",
    marginBottom: 12,
  },
  carouselContentContainer: {
    paddingHorizontal: 15,
    alignItems: "center",
  },
});
