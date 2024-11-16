import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import PasswordInput from "../components/input/PasswordInput";
import { login } from "../api/authApi";

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    if (loading) return;

    const { email, password } = formData;

    if (!email || !password) {
      return alert("Please complete all field!");
    }

    setLoading(true);

    try {
      await login(formData);

      alert("You have successfully logged in!");
      navigation.replace("Home");
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          source={require("../../assets/login.png")}
          style={styles.image}
        />
        <TextInput
          style={styles.input}
          value={formData.email}
          placeholder="Enter your email"
          onChangeText={(text) => handleInputChange("email", text)}
        />
        <PasswordInput
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
        />
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator
              size={30}
              color="#fff"
              style={{ marginVertical: 15 }}
            />
          ) : (
            <Text style={styles.btnText}>Login</Text>
          )}
        </TouchableOpacity>
        <View style={styles.containerCenter}>
          <Text style={{ color: "#707070" }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.push("Register")}>
            <Text style={styles.signUpText}>Sign up now!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  image: {
    alignSelf: "center",
    width: 350,
    height: 350,
  },
  containerCenter: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#fafafa",
    borderColor: "#5cb85c",
    borderWidth: 1,
    borderRadius: 8,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#1469EB",
    fontWeight: "bold",
    marginTop: 5,
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
  signUpText: {
    marginLeft: 3,
    color: "#5cb85c",
    fontWeight: "bold",
  },
});
