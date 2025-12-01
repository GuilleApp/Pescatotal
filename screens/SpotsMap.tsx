// screens/SpotsMap.tsx
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useFishingSpots } from "../hooks/useFishingSpots";

const SpotsMap: React.FC = () => {
  const { spots, loading, error } = useFishingSpots();
  const navigation = useNavigation<any>();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Cargando pesqueros...</Text>
      </View>
    );
  }

  if (error || spots.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text style={{ color: "red", textAlign: "center" }}>
          {error || "No hay pesqueros para mostrar."}
        </Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: -32.8,
    longitude: -56.0,
    latitudeDelta: 5,
    longitudeDelta: 5,
  };

  return (
    <MapView style={{ flex: 1 }} initialRegion={initialRegion}>
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          coordinate={{
            latitude: spot.latitude,
            longitude: spot.longitude,
          }}
          title={spot.name}
          description={`${spot.department || ""} ${spot.region || ""}`}
          // si más adelante creamos SpotDetail:
          // onPress={() => navigation.navigate("SpotDetail", { spotId: spot.id })}
        />
      ))}
    </MapView>
  );
};

export default SpotsMap;

