// Layout.tsx
// Layout.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// Screens
import FeedScreen from "./screens/Feed";
import MapScreen from "./screens/Map";
import GuidesScreen from "./screens/Guides";
import ProfileScreen from "./screens/Profile";
import GuideDetail from "./screens/GuideDetail";
import NewCatchScreen from "./screens/NewCatch";
import PostDetail from "./screens/PostDetail";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#6b7280",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Inicio") iconName = "home-outline";
          else if (route.name === "Mapa") iconName = "map-outline";
          else if (route.name === "Guías") iconName = "book-outline";
          else if (route.name === "Perfil") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
      })}
    >
      <Tab.Screen name="Inicio" component={FeedScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Guías" component={GuidesScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Layout() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GuideDetail"
          component={GuideDetail}
          options={{ title: "Detalle de guía" }}
        />
        <Stack.Screen
          name="NewCatch"
          component={NewCatchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostDetail"
          component={PostDetail}
          options={{ title: "Publicación" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

