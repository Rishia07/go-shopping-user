import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import useFetchData from "../hooks/useFetchData";
import StarRating from "react-native-star-rating-widget";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Ionicons from "react-native-vector-icons/Ionicons";
import Loader from "../components/Loader";
import useFetchCurrentUserData from "../hooks/useCurrentUser";
import { createOrder, updateOrder } from "../api/ordersApi";

export default function ViewProductScreen({ route, navigation }) {
  const { id } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [token, setToken] = useState(null);
  const { data: userData, loading: userLoading } = useFetchCurrentUserData();
  const { data, loading: productLoading } = useFetchData(
    `https://go-shopping-api-mauve.vercel.app/api/products/${id}`
  );

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fetchedToken = await SecureStore.getItemAsync("token");
        setToken(fetchedToken);
      } catch (error) {
        console.error("Error fetching Data:", error);
      }
    };

    fetchToken();
  }, []);

  if (productLoading || userLoading) return <Loader />;

  const handleQuantityChange = (value) => {
    if (value === "") {
      setQuantity(1);
    } else if (/^\d+$/.test(value)) {
      const newQuantity = parseInt(value);
      if (newQuantity > data.quantity) {
        setQuantity(data.quantity);
      } else {
        setQuantity(newQuantity);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!userData.validIdPic)
      return alert("Please attach your valid id first!");

    const token = await SecureStore.getItemAsync("token");
    const userId = await SecureStore.getItemAsync("userId");

    Alert.alert(
      "Add to cart",
      `Are you sure you want to add this ${quantity}x ${data.title
      } to your cart with a total price ₱ ${(data.price * quantity).toFixed(
        2
      )}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Buy Now",
          onPress: async () => {
            try {
              await axios.post(
                `https://go-shopping-api-mauve.vercel.app/api/users/cart`,
                {
                  quantity: quantity,
                  price: (data.price * quantity).toFixed(2),
                  product: id,
                  user: userId,
                  proofOfDelivery: ""
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              setQuantity(1);

              alert("You have successfully added to your cart!");
            } catch (error) {
              alert(error);
              console.error("Error fetching Data:", error);
            }
          },
        },
      ]
    );
  };

  const handleBuyNow = async () => {
    if (!userData.validIdPic)
      return alert("Please attach your valid id first!");
    if (!userData.address) return alert("Please add your address first");

    const totalPrice = (data.price * quantity).toFixed(2);



    const token = await SecureStore.getItemAsync("token");
    const userId = await SecureStore.getItemAsync("userId");


    Alert.alert(
      "Confirm Purchase",
      `Are you sure you want to buy this ${quantity}x ${data.title} with a total price of ₱${(data.price * quantity + 65).toFixed(2)} (including ₱65 delivery fee)?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Buy Now",
          onPress: async () => {
            try {
              await axios.put(
                `https://go-shopping-api-mauve.vercel.app/api/products/${id}`,
                {
                  quantity: data.quantity - quantity
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              console.log("create")
              await createOrder({
                quantity: quantity,
                price: totalPrice,
                product: id,
                user: userId,
                proofOfDelivery: "s"
              });
              console.log("done")
              setQuantity(1);

              alert("You have successfully ordered this product!");
            } catch (error) {
              alert(error);
              console.error("Error fetching Data:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <ScrollView style={styles.contentContainer}>
        <Image source={{ uri: data?.photoURL[0] }} style={styles.image} />

        <View style={{ padding: 16 }}>
          <Text style={styles.price}>₱ {data?.price}</Text>
          <Text style={styles.title}>{data?.title}</Text>
          <Text style={styles.price}>
            💵 <Text style={{ fontWeight: "bold" }}>COD Payment</Text>
          </Text>
          <Text>Product Description</Text>
          <Text style={styles.description}>{data.description}</Text>
          <View style={styles.recipeStats}>
            <Text>
              <Text style={styles.sectionTitle}>Reviews</Text> (
              {data.totalReviews})
            </Text>
            <StarRating
              disabled={true}
              maxStars={5}
              rating={data.totalRating}
              starSize={28}
            />
          </View>
          {data.reviews.length === 0 ? (
            <Text>No reviews yet</Text>
          ) : (
            <View>
              {data.reviews.slice(0, 10).map((data, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.profileContainer}>
                    <Image
                      source={{
                        uri:
                          (data && data.profilePic) ||
                          "https://i.stack.imgur.com/l60Hf.png",
                      }}
                      style={styles.userProfile}
                    />
                    <Text style={styles.name}>
                      {data.user.firstName} {data.user.lastName}
                    </Text>
                  </View>
                  <Text style={styles.review}>{data.review}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      {token && (
        <View style={styles.bottomContainer}>
          {data.quantity === 0 ? (
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          ) : (
            <>
              <View style={styles.calculationContainer}>
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <TextInput
                    style={styles.quantityInput}
                    value={quantity.toString()}
                    onChangeText={handleQuantityChange}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.priceContainer}>
                  {/* Subtotal */}
                  <View style={styles.row}>
                    <Text style={styles.priceLabel}>Subtotal:</Text>
                    <Text style={styles.priceValue}>
                      ₱ {(data.price * quantity).toFixed(2)}
                    </Text>
                  </View>

                  {/* Total Price */}
                  <View style={styles.row}>
                    <Text style={styles.totalPriceLabel}>Total Price:</Text>
                    <Text style={styles.totalPrice}>
                      ₱ {(data.price * quantity + 65).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={handleAddToCart}
                >
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buyNowButton}
                  onPress={handleBuyNow}
                  disabled={data.quantity === 0}
                >
                  <Text style={styles.buttonText}>Buy Now</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  backBtn: {
    backgroundColor: "#191919",
    position: "absolute",
    borderRadius: 100,
    padding: 6,
    top: 40,
    left: 10,
    zIndex: 1,
  },
  recipeStats: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
  },
  description: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  carouselItem: {
    width: "100%",
    height: 300,
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  listContainer: {
    backgroundColor: "#d9d9d9",
    borderRadius: 8,
    padding: 12,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  profileContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },
  userProfile: {
    width: 30,
    height: 30,
    borderRadius: 300,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  review: {
    backgroundColor: "#d9d9d9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  calculationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityInput: {
    width: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  totalPriceLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  row: {
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  addToCartButton: {
    width: "48%",
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buyNowButton: {
    width: "48%",
    backgroundColor: "#5cb85c",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  outOfStockText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
