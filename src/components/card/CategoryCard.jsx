import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CategoryCard({ item, selectedCategory, onPress }) {
  const isSelected = selectedCategory === item;
  return (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        { backgroundColor: isSelected ? "#5cb85c" : "#fff" },
        { borderColor: isSelected ? "#fff" : "#5cb85c" },
      ]}
      onPress={() => onPress(item)}
    >
      <Text
        style={[styles.categoryText, { color: isSelected ? "#fff" : "#000" }]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#5cb85c",
    marginRight: 10,
  },
  categoryText: {
    fontSize: 12,
  },
});
