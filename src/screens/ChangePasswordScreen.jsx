import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import PasswordInput from "../components/input/PasswordInput";
import { changePassword } from "../api/authApi";

export default function ChangePasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangePassword = async () => {
    if (loading) return;

    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return alert("All fields are required.");
    }

    if (newPassword !== confirmNewPassword) {
      return alert("New password and confirm password do not match.");
    }

    setLoading(true);

    try {
      await changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      alert("You have successfully changed your password");
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Current Password:</Text>
      <PasswordInput
        value={formData.currentPassword}
        onChangeText={(text) => handleInputChange("currentPassword", text)}
        placeholder="Enter your current password"
      />
      <Text style={styles.label}>New Password:</Text>
      <PasswordInput
        value={formData.newPassword}
        onChangeText={(text) => handleInputChange("newPassword", text)}
        placeholder="Enter your new password"
      />
      <Text style={styles.label}>Confirm New Password:</Text>
      <PasswordInput
        value={formData.confirmNewPassword}
        onChangeText={(text) => handleInputChange("confirmNewPassword", text)}
        placeholder="Confirm  your new password"
      />
      <TouchableOpacity style={styles.btn} onPress={handleChangePassword}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  label: {
    marginTop: 5,
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
