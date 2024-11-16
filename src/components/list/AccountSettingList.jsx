import { Text, View, FlatList, Pressable, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function AccountSettings({ AccountSettingsList, navigation }) {
  const renderItem = ({ item }) => (
    <Pressable style={styles.accountSettingsBtn} onPress={() => navigation.push(item.path)}>
      <View style={styles.accountSettingsBtnLabel}>
        <Ionicons name={item.icon} size={18} />
        <Text>{item.label}</Text>
      </View>
      <Ionicons name="arrow-forward-outline" size={25} color="#191919" />
    </Pressable>
  );

  const keyExtractor = (item, index) => index.toString();

  return (
    <View style={styles.accountContainer}>
      <Text style={styles.title}>Account Settings</Text>
      <View style={styles.accountSettings}>
        <FlatList
          data={AccountSettingsList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accountContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 20,
    padding: 20,
    alignSelf: "stretch",
  },
  accountSettings: {
    alignSelf: "stretch",
    padding: 8,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "gray",
    backgroundColor: "#fafafa",
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  accountSettingsBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 20,
  },
  accountSettingsBtnLabel: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
