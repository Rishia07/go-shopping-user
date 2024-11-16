import { useState, useEffect, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Animated, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import OrderScreen from "../screens/OrderScreen";
import SettingScreen from "../screens/SettingScreen";
import StartupScreen from "../screens/StartupScreen";
import * as SecureStore from "expo-secure-store";

const Tab = createBottomTabNavigator();

const BotNavbar = () => {
  const bounceValue = new Animated.Value(1);
  const [initialRoute, setInitialRoute] = useState("Login");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          setInitialRoute("Home");
        } else {
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };

    checkToken();
  }, [initialRoute]);

  const handlePress = (navigation, routeName) => {
    navigation.navigate(routeName);
    Animated.sequence([
      Animated.spring(bounceValue, {
        toValue: 0.8,
        useNativeDriver: true,
      }),
      Animated.spring(bounceValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "CartTab") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "OrderTab") {
            iconName = focused ? "wallet" : "wallet-outline";
          } else if (
            route.name === "SettingsTab" ||
            route.name === "StartupTab"
          ) {
            iconName = focused ? "settings-sharp" : "settings-outline";
          }

          return (
            <TouchableWithoutFeedback
              onPress={() => handlePress(navigation, route.name)}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  { transform: [{ scale: bounceValue }] },
                ]}
              >
                <Ionicons name={iconName} size={size} color={color} />
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        },
        tabBarActiveTintColor: "#5cb85c",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff", borderTopWidth: 0 },
        headerShown: false,
      })}
    >
      {initialRoute === "Login" ? (
        <>
          <Tab.Screen
            options={{ headerShown: false, tabBarLabel: "Home" }}
            name="HomeTab"
            component={HomeScreen}
          />
          <Tab.Screen
            options={{ headerShown: false, tabBarLabel: "Settings" }}
            name="StartupTab"
            component={StartupScreen}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            options={{ headerShown: false, tabBarLabel: "Home" }}
            name="HomeTab"
            component={HomeScreen}
          />
          <Tab.Screen
            options={{ headerShown: false, tabBarLabel: "Cart" }}
            name="CartTab"
            component={CartScreen}
          />
          <Tab.Screen
            options={{ headerShown: false, tabBarLabel: "Order" }}
            name="OrderTab"
            component={OrderScreen}
          />
          <Tab.Screen
            options={{ headerShown: false, tabBarLabel: "Settings" }}
            name="SettingsTab"
            component={SettingScreen}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: "#F5F7F8",
  },
});

export default BotNavbar;
