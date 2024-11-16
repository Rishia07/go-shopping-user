import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ProductCard({ item }) {
  const navigation = useNavigation();

  const truncatedTitle =
    item.title.length > 18 ? item.title.substring(0, 18) + "..." : item.title;

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.push("ViewProduct", { id: item._id })}
    >
      <Image
        source={{
          uri: item.photoURL[0] || "https://i.stack.imgur.com/l60Hf.png",
        }}
        style={styles.recipeItem}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{truncatedTitle}</Text>
        <Text style={styles.price}>₱ {item.price}</Text>
        <Text>
          <Ionicons name="star" size={20} color="#FFAE42" />{" "}
          {item.totalRating > 0 ? (
            <>
              <Text>({item.totalRating})</Text>
            </>
          ) : (
            "No ratings yet"
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  recipeItem: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "gray",
    justifyContent: "flex-end",
  },
  title: {
    flexWrap: "wrap",
    fontSize: 16,
    marginBottom: 6,
    color: "#000",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#000",
  },
});
