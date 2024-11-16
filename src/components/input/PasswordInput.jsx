import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function PasswordInput({ value, onChangeText, placeholder }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fafafa",
        borderColor: "#5cb85c",
        borderWidth: 1,
        marginTop: 15,
        borderRadius: 8,
        padding: 12,
      }}
    >
      <TextInput
        style={{ flex: 1 }}
        value={value}
        secureTextEntry={!passwordVisible}
        placeholder={
          placeholder ? placeholder : "Enter your password"
        }
        onChangeText={onChangeText}
        required
      />
      <TouchableOpacity onPress={togglePasswordVisibility}>
        <Ionicons
          name={passwordVisible ? "eye-off" : "eye"}
          size={20}
          color="#5cb85c"
        />
      </TouchableOpacity>
    </View>
  );
}
