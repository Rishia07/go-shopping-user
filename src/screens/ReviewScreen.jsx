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
  Alert,
} from "react-native";
import useFetchData from "../hooks/useFetchData";
import StarRating from "react-native-star-rating-widget";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Ionicons from "react-native-vector-icons/Ionicons";
import Loader from "../components/Loader";

export default function ReviewScreen({ route }) {
  const { id } = route.params;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isRated, setIsRated] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const { data, loading: productLoading } = useFetchData(
    `https://go-shopping-api-mauve.vercel.app/api/products/${id}`
  );

  useEffect(() => {
    const checkUserRatingAndReview = async () => {
      const userId = await SecureStore.getItemAsync("userId");
      const userRating = data.ratings.find(
        (rating) => rating.user._id === userId
      );
      const userReview = data.reviews.find(
        (review) => review.user._id === userId
      );
      if (userRating) {
        setRating(userRating.rating);
        setIsRated(true);
      }
      if (userReview) {
        setReview(userReview.review);
        setIsReviewed(true);
      }
    };

    if (data) {
      checkUserRatingAndReview();
    }
  }, [data]);

  if (productLoading) return <Loader />;

  const handleRating = async (star) => {
    const token = await SecureStore.getItemAsync("token");
    const userId = await SecureStore.getItemAsync("userId");
    if (isRated) {
      return alert("You have already rated this product");
    }
    try {
      setRating(star);

      const response = await axios.post(
        `${BACKEND_API_KEY}/api/ratings`,
        {
          rating: star,
          user: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.put(
        `${BACKEND_API_KEY}/api/products/${id}`,
        {
          ratings: [...(data?.ratings || []), response.data._id],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("You have successfully rated this recipe");
      setIsRated(true);
    } catch (error) {
      console.error("Error fetching Data:", error);
    }
  };

  const handleReview = async () => {
    const token = await SecureStore.getItemAsync("token");
    const userId = await SecureStore.getItemAsync("userId");
    if (isReviewed) {
      return alert("You have already reviewed this recipe");
    }
    try {
      const response = await axios.post(
        `${BACKEND_API_KEY}/api/reviews/`,
        {
          review: review,
          user: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.put(
        `${BACKEND_API_KEY}/api/products/${id}`,
        {
          reviews: [...(data?.reviews || []), response.data._id],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("You have successfully reviewed this product!");
      setIsReviewed(true);
    } catch (error) {
      alert(error);
      console.error("Error fetching Data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.starContainer}>
          <Image
            source={{
              uri: data.photoURL[0] || "https://i.stack.imgur.com/l60Hf.png",
            }}
            style={styles.image}
          />
          <View>
            <Text style={styles.price}>₱ {data.price}</Text>
            <Text style={styles.title}>{data.title}</Text>
          </View>
        </View>

        <View style={styles.recipeStats}>
          <View style={styles.starContainer}>
            <Text>Rate this recipe!</Text>
            <StarRating
              disabled={isRated}
              maxStars={5}
              rating={rating}
              starSize={28}
              selectedStar={(rating) => handleRating(rating)}
            />
          </View>
        </View>
        <View style={styles.input}>
          <TextInput
            value={review}
            style={{ flex: 1 }}
            placeholder="Create a review"
            onChangeText={(text) => setReview(text)}
            multiline={true}
            editable={!isReviewed}
          />
          <TouchableOpacity
            onPress={() => handleReview()}
            disabled={isReviewed}
          >
            <Ionicons name="send" size={20} color="#191919" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recipeStats: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    flexDirection: "row",
    marginTop: 8,
    padding: 12,
    backgroundColor: "#fafafa",
    borderColor: "#191919",
    borderWidth: 1,
    borderRadius: 8,
  },
});
