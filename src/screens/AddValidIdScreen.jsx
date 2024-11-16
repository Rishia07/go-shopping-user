import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { storage } from "../../firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateUser } from "../api/authApi";
import useFetchCurrentUserData from "../hooks/useCurrentUser";
import Loader from "../components/Loader";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

export default function AddValidIdScreen() {
  const { data, loading: userDataLoading } = useFetchCurrentUserData();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  if (userDataLoading) return <Loader />;



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
        "Attach Valid Id",
        "Do you want to attach this image as your valid id",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {

              setLoading(true);
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

              const imageRef = storageRef(storage, "user/validIdPic");
              const snapshot = uploadBytes(imageRef, blob);
              snapshot
                .then(() => {
                  setLoading(false);
                })
                .catch((error) => {
                  setLoading(false);
                  console.log(error);
                  return;
                });

              snapshot.then(async () => {
                const url = await getDownloadURL(imageRef);
                const userId = await SecureStore.getItemAsync("userId");
                const token = await SecureStore.getItemAsync("token");
                await axios.put(
                  `https://go-shopping-api-mauve.vercel.app/api/users/${userId}`, 
                  {
                    validIdPic: url,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                await updateUser({
                  validIdPic: url,
                });

                setImage(url);
              });
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {data ? (
          <Image
            source={{
              uri:
                image ||
                (data && data.validIdPic) ||
                "https://i.stack.imgur.com/l60Hf.png",
            }}
            style={styles.image}
          />
        ) : (
          <ActivityIndicator size="large" color="#191919" />
        )}
        <TouchableOpacity style={styles.btn} onPress={uploadImage}>
          {loading ? (
            <ActivityIndicator
              size={30}
              color="#fff"
              style={{ marginVertical: 2 }}
            />
          ) : (
            <Text style={styles.btnText}>Attach your valid id</Text>
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
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
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
