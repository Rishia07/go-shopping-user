import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeLayout from "./src/layout/HomeLayout";
import ViewProductScreen from "./src/screens/ViewProductScreen";
import ChangePersonalInfoScreen from "./src/screens/ChangePersonalInfoScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import AddAddressScreen from "./src/screens/AddAddressScreen";
import ReviewScreen from "./src/screens/ReviewScreen";
import AddValidIdScreen from "./src/screens/AddValidIdScreen";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import Loader from "./src/components/Loader";

const Stack = createStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  if (!fontsLoaded) return <Loader />;
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              options={{ headerShown: false }}
              name="Home"
              component={HomeLayout}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              options={{ title: "Create an account" }}
              name="Register"
              component={RegisterScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="ViewProduct"
              component={ViewProductScreen}
            />
            <Stack.Screen
              options={{ title: "Write Review" }}
              name="Review"
              component={ReviewScreen}
            />
            <Stack.Screen
              options={{ title: "Address" }}
              name="AddAddress"
              component={AddAddressScreen}
            />
            <Stack.Screen
              options={{ title: "Attach valid id" }}
              name="AddValidId"
              component={AddValidIdScreen}
            />
            <Stack.Screen
              options={{ title: "Change Personal Information" }}
              name="ChangeInfo"
              component={ChangePersonalInfoScreen}
            />
            <Stack.Screen
              options={{ title: "Change Password" }}
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
