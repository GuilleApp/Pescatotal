// screens/SpotsMap.tsx
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useFishingSpots } from "../hooks/useFishingSpots";

const DEFAULT_REGION: Region = {
  latitude: -32.8,      // centro aproximado de Uruguay
  longitude: -56.0,
  latitudeDelta: 5.5,
  longitudeDelta: 5.5,
};

const SpotsMap: React.FC = () => {
  const { spots, loading, error } = useFishingSpots();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Cargando pesqueros...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Text style={{ textAlign: "center", marginBottom: 8 }}>
          Ocurrió un error al cargar los pesqueros.
        </Text>
        <Text style={{ fontSize: 12, color: "#888", textAlign: "center" }}>
          {String(error)}
        </Text>
      </View>
    );
  }

  if (!spots || spots.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Text style={{ textAlign: "center" }}>
          No hay pesqueros cargados todavía.
        </Text>
      </View>
    );
  }

  return (
    <MapView style={{ flex: 1 }} initialRegion={DEFAULT_REGION}>
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          coordinate={{
            latitude: spot.latitude,
            longitude: spot.longitude,
          }}
          title={spot.name}
          description={`${spot.department || ""} ${spot.region || ""}`.trim()}
        />
      ))}
    </MapView>
  );
};

export default SpotsMap;
