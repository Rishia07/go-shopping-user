import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Checkbox } from "expo-checkbox";

export default function CartCard({ item, onToggleCheckbox, selectedItems }) {

  return (
    <TouchableOpacity
      onPress={() => onToggleCheckbox(item)}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              item.product?.photoURL[0] || "https://i.stack.imgur.com/l60Hf.png",
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.product?.title}</Text>
        <Text>Price: ₱{item.price}</Text>
        <Text>Quantity: {item.quantity}</Text>
      </View>
      <Checkbox
        value={selectedItems.some(
          (selectedItem) => selectedItem._id === item._id
        )}
        onValueChange={() => onToggleCheckbox(item)}
        style={styles.checkbox}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  checkbox: {
    alignSelf: "center",
  },
});
