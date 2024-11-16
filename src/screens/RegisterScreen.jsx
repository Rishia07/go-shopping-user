import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import PasswordInput from "../components/input/PasswordInput";
import { register } from "../api/authApi";

export default function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    if (loading) return;
    const { firstName, lastName, email, phoneNumber, password } = formData;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return alert("Please enter all fields!");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return alert("Invalid email format!");
    }

    const phoneNumberRegex = /^09\d{9}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      return alert(
        "Invalid phone number format! Phone number should start with 09 and be 11 digits long."
      );
    }

    if (password !== confirmPassword) {
      return alert("Password must match!");
    }

    setLoading(true);

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password: password.trim(),
      });

      navigation.replace("Login");
      alert("You have successfully created an account!");
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TextInput
          style={styles.input}
          value={formData.firstName}
          placeholder="Enter your first name"
          onChangeText={(text) => handleInputChange("firstName", text)}
        />
        <TextInput
          style={styles.input}
          value={formData.lastName}
          placeholder="Enter your last name"
          onChangeText={(text) => handleInputChange("lastName", text)}
        />
        <TextInput
          style={styles.input}
          value={formData.email}
          placeholder="Enter your email"
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={formData.phoneNumber}
          placeholder="Enter your phone number"
          onChangeText={(text) => handleInputChange("phoneNumber", text)}
          keyboardType="numeric"
        />
        <PasswordInput
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
        />
        <PasswordInput
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          placeholder="Confirm Password"
        />
        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          {loading ? (
            <ActivityIndicator
              size={30}
              color="#fff"
              style={{ marginVertical: 15 }}
            />
          ) : (
            <Text style={styles.btnText}>Register</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    marginBottom: 12,
    borderColor: "#5cb85c",
    borderWidth: 1,
  },
  btn: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5cb85c",
    borderRadius: 12,
  },
  btnText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 15,
  },
});
