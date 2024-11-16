import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import useFetchCurrentUserData from "../hooks/useCurrentUser";
import Loader from "../components/Loader";
import { updateUser } from "../api/authApi";

export default function ChangePersonalInfoScreen() {
  const { data, loading: userDataLoading } = useFetchCurrentUserData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: data.password ,
    address: {
      houseNumber: "",
      street: "",
      barangay: "",
      municipality: "",
      province: "",
      country: "",
    },
  });

  // Function to handle changes to the input fields
  const handleInputChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      address: {
        ...prevFormData.address,
        [name]: value, // Update specific address field if applicable
      },
    }));
  };

  // Use effect to set initial data from the fetched user data
  useEffect(() => {
    if (data && data.address && Object.values(formData.address).every((val) => val === "")) {
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        password: data.password, // You may want to handle password differently
        address: {
          houseNumber: data.address?.houseNumber || "",
          street: data.address?.street || "",
          barangay: data.address?.barangay || "",
          municipality: data.address?.municipality || "",
          province: data.address?.province || "",
          country: data.address?.country || "",
        },
      });
    }
  }, [data]);

  // Function to handle updating user info
  const handleChangePersonalInfo = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await updateUser(formData);
      alert("You have successfully changed your personal information!");
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred.");
      console.error("Error changing personal info:", error);
    } finally {
      setLoading(false);
    }
  };

  if (userDataLoading) return <Loader />;

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          value={formData.firstName}
          placeholder="Enter your first name"
          onChangeText={(text) => handleInputChange("firstName", text)}
        />
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={formData.lastName}
          placeholder="Enter your last name"
          onChangeText={(text) => handleInputChange("lastName", text)}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          placeholder="Enter your email"
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="email-address"
        />
        
        {/* Address Fields */}
        <Text style={styles.label}>House Number:</Text>
        <TextInput
          style={styles.input}
          value={formData.address.houseNumber}
          placeholder="Enter your House Number"
          onChangeText={(text) => handleInputChange("houseNumber", text)}
        />
        <Text style={styles.label}>Street:</Text>
        <TextInput
          style={styles.input}
          value={formData.address.street}
          placeholder="Enter your Street"
          onChangeText={(text) => handleInputChange("street", text)}
        />
        <Text style={styles.label}>Barangay:</Text>
        <TextInput
          style={styles.input}
          value={formData.address.barangay}
          placeholder="Enter your Barangay"
          onChangeText={(text) => handleInputChange("barangay", text)}
        />
        <Text style={styles.label}>Municipality:</Text>
        <TextInput
          style={styles.input}
          value={formData.address.municipality}
          placeholder="Enter your Municipality"
          onChangeText={(text) => handleInputChange("municipality", text)}
        />
        <Text style={styles.label}>Province:</Text>
        <TextInput
          style={styles.input}
          value={formData.address.province}
          placeholder="Enter your Province"
          onChangeText={(text) => handleInputChange("province", text)}
        />
        <Text style={styles.label}>Country:</Text>
        <TextInput
          style={styles.input}
          value={formData.address.country}
          placeholder="Enter your Country"
          onChangeText={(text) => handleInputChange("country", text)}
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