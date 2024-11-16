import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";

export default function StartupScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.textHeader}>Welcome to your Door to Door Convenience Store</Text>
        <Image
          source={require("../../assets/login.png")}
          style={styles.image}
        />
        <Text style={styles.textLocation}>We are located at ABCDE Street, Dagupan City</Text>
        <TouchableOpacity
          style={styles.btnRegister}
          onPress={() => navigation.push("Register")}
        >
          <Text style={styles.btnText}>Sign-up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnLogin}
          onPress={() => navigation.push("Login")}
        >
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
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
  textHeader: {
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "gray"
  },
  textLocation: {
    fontSize: 16,
    textAlign: 'center',
    color: "gray"
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
  btnRegister: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#78D178",
    borderRadius: 12,
  },
  btnLogin: {
    marginTop: 12,
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
