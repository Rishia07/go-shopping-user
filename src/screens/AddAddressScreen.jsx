import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetchCurrentUserData from "../hooks/useCurrentUser";
import Loader from "../components/Loader";
import { updateUser } from "../api/authApi";

export default function AddAddressScreen() {
  const { data, loading: userDataLoading } = useFetchCurrentUserData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: {
      houseNumber: "",
      street: "",
      barangay: "",
      municipality: "",
      province: "",
      country: "",
    },
  });

  const handleAddressChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: {
        ...prevFormData.address,
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    // Only set formData if it is empty to avoid overwriting user's input
    if (data && data.address && Object.values(formData.address).every((val) => val === "")) {
      setFormData({
        address: {
          houseNumber: data.address.houseNumber || "",
          street: data.address.street || "",
          barangay: data.address.barangay || "",
          municipality: data.address.municipality || "",
          province: data.address.province || "",
          country: data.address.country || "",
        },
      });
    }
  }, [data]);

  const handleChangePersonalInfo = async () => {
    if (loading) return;

    setLoading(true);

    const { houseNumber, street, barangay, municipality, province, country } =
      formData.address;

    if (
      !houseNumber ||
      !street ||
      !barangay ||
      !municipality ||
      !province ||
      !country
    ) {
      setLoading(false);
      alert("All fields are required.");
      return;
    }

    try {
      await updateUser(formData);
      alert("You have successfully updated your address!");
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  if (userDataLoading) return <Loader />;

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>House Number:</Text>
        <TextInput
          style={styles.input}
          value={formData.address.houseNumber}
          placeholder="Enter your House Number"
          onChangeText={(text) => handleAddressChange("houseNumber", text)}
        />
        <Text style={styles.label}>Street:</Text>
        <TextInput
          style={styles.input}
          value={formData.address.street}
          placeholder="Enter your Street"
          onChangeText={(text) => handleAddressChange("street", text)}
        />
        <Text style={styles.label}>Barangay:</Text>
        <TextInput
          style={styles.input}
          value={formData.address.barangay}
          placeholder="Enter your Barangay"
          onChangeText={(text) => handleAddressChange("barangay", text)}
        />
        <Text style={styles.label}>Municipality:</Text>
        <TextInput
          style={styles.input}
          value={formData.address.municipality}
          placeholder="Enter your Municipality"
          onChangeText={(text) => handleAddressChange("municipality", text)}
        />
        <Text style={styles.label}>Province:</Text>
        <TextInput
          style={styles.input}
          value={formData.address.province}
          placeholder="Enter your Province"
          onChangeText={(text) => handleAddressChange("province", text)}
        />
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={formData.address.country}
          placeholder="Enter your Country"
          onChangeText={(text) => handleAddressChange("country", text)}
        />
        <TouchableOpacity style={styles.btn} onPress={handleChangePersonalInfo}>
          {loading ? (
            <ActivityIndicator
              size={30}
              color="#fff"
              style={{ marginVertical: 2 }}
            />
          ) : (
            <Text style={styles.btnText}>Save</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    marginTop: 5,
  },
  input: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    marginBottom: 12,
    borderColor: "gray",
    borderWidth: 1,
  },
  btn: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5cb85c",
    borderRadius: 12,
    paddingVertical: 10,
  },
  btnText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});