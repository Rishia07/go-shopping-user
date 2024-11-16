import { AccountSettingsList } from "../data/AccountSettingsList";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/core";
import { BACKEND_API_KEY } from "@env";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  View,
  Alert,
  StyleSheet,
} from "react-native";
import { storage } from "../../firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import useFetchCurrentUserData from "../hooks/useCurrentUser";
import AccountSettings from "../components/list/AccountSettingList";
import { updateUser } from "../api/authApi";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";

export default function SettingScreen() {
  const navigation = useNavigation();
  const { data: userData, loading } = useFetchCurrentUserData();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.assets[0].uri) {
      console.log("No URI found for the selected image.");
      Alert.alert("Image Error", "Selected image is invalid. Please try again.");
      return; // Exit if no URI is found
    }

    if (result.canceled) {
      console.log("No image selected");
      Alert.alert("No Image", "You have not selected any image.");
      return; // Exit the function since no image was chosen
    } else {
      Alert.alert(
        "Change Profile Picture",
        "Do you want to change your profile picture?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              setUploading(true)
              const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                  resolve(xhr.response);
                };
                xhr.onerror = function () {
                  reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", result.assets[0].uri, true);
                xhr.send(null);
              });

              const imageRef = storageRef(storage, "user/profilePic");
              const snapshot = uploadBytes(imageRef, blob);
              console.log(snapshot)
              snapshot
                .then(() => {
                  setUploading(false);
                })
                .catch((error) => {
                  setUploading(false);
                  console.log(error);
                  return;
                });

              snapshot.then(async () => {
                const url = await getDownloadURL(imageRef);
                const userId = await SecureStore.getItemAsync("userId");
                const token = await SecureStore.getItemAsync("token");

                console.log("put")
                await axios.put(
                  `https://go-shopping-api-mauve.vercel.app/api/users/${userId}`,
                  {
                    profilePic: url,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                console.log("updateuser")
                await updateUser({
                  profilePic: url,
                });

                console.log("setImage")
                setImage(url);
              });
            },
          },
        ]
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await SecureStore.deleteItemAsync("role");
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("userId");
            navigation.replace("Home");
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#191919" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        {userData ? (
          <Image
            source={{
              uri:
                image ||
                (userData && userData.profilePic) ||
                "https://i.stack.imgur.com/l60Hf.png",
            }}
            style={styles.userProfile}
          />
        ) : (
          <ActivityIndicator size="large" color="#191919" />
        )}
        <TouchableOpacity onPress={uploadImage} style={styles.editProfile}>
          <Ionicons name="pencil-outline" size={20} />
        </TouchableOpacity>
        <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>
      <AccountSettings AccountSettingsList={AccountSettingsList} navigation={navigation} />
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: 'center'
  },
  profileContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: 'center'
  },
  editProfile: {
    width: 40,
    height: 40,
    marginRight: -50,
    marginTop: -50,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  userProfile: {
    width: 150,
    height: 150,
    borderRadius: 300,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: "600",
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  logoutBtn: {
    margin: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#FF3D3D",
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 15,
    marginLeft: 3,
  },
});
