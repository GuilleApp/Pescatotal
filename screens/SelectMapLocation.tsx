// screens/SelectMapLocation.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SelectMapLocation() {
  const navigation = useNavigation<any>();

  const handleUseExampleCoords = () => {
    const exampleCoords = { lat: -34.9011, lng: -56.1645 }; // Montevideo
    navigation.navigate("AddSpot", { selectedCoords: exampleCoords });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elegir ubicación</Text>
      <Text style={styles.subtitle}>
        Más adelante acá mostraremos un mapa interactivo. Por ahora, usaremos
        una ubicación de ejemplo para probar el flujo.
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={handleUseExampleCoords}
      >
        <Text style={styles.primaryText}>Usar ubicación de ejemplo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleCancel}
      >
        <Text style={styles.secondaryText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020B10",
    padding: 16,
    justifyContent: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#9FB3C3",
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: "#00C2FF",
  },
  primaryText: {
    color: "#00141C",
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#3A4B57",
  },
  secondaryText: {
    color: "#E5F4FF",
    fontSize: 15,
    fontWeight: "500",
  },
});
