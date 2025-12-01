// screens/AddSpot.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSpots } from "../SpotsContext";
import * as ImagePicker from "expo-image-picker";

type Coords = { lat: number; lng: number } | null;

export default function AddSpotScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addSpot } = useSpots();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [fishingType, setFishingType] = useState("");
  const [species, setSpecies] = useState("");
  const [notes, setNotes] = useState("");
  const [coords, setCoords] = useState<Coords>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const guideId = route.params?.guideId ?? null;

  // Si volvemos desde SelectMapLocation con coordenadas
  useEffect(() => {
    if (route.params?.selectedCoords) {
      setCoords(route.params.selectedCoords);
    }
  }, [route.params?.selectedCoords]);

  const handleSave = () => {
    const newSpot = {
      name,
      location,
      fishingType,
      species,
      notes,
      coords,
      imageUrl: imageUri || undefined, // 👈 usamos la foto elegida
      guideId,
    };

    addSpot(newSpot);

    // Vamos directo a la lista de pesqueros
    navigation.navigate("SpotsMap");
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleOpenMap = () => {
    navigation.navigate("SelectMapLocation");
  };

  const handlePickImage = async () => {
    // En móvil pide permiso, en web lo ignora sin problema
    await ImagePicker.requestMediaLibraryPermissionsAsync();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Agregar pesquero</Text>
        <Text style={styles.subtitle}>
          Completa la información del nuevo pesquero para compartirla con la
          comunidad.
        </Text>

        {/* Nombre */}
        <View style={styles.field}>
          <Text style={styles.label}>Nombre del pesquero</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Playa del Buceo"
            placeholderTextColor="#6B7A86"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Zona / ubicación textual */}
        <View style={styles.field}>
          <Text style={styles.label}>Zona / Ubicación (texto)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Montevideo, Costa, Km 20"
            placeholderTextColor="#6B7A86"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Tipo de pesca */}
        <View style={styles.field}>
          <Text style={styles.label}>Tipo de pesca</Text>
          <TextInput
            style={styles.input}
            placeholder="Costa, embarcado, spinning, mosca..."
            placeholderTextColor="#6B7A86"
            value={fishingType}
            onChangeText={setFishingType}
          />
        </View>

        {/* Especies */}
        <View style={styles.field}>
          <Text style={styles.label}>Especies objetivo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Corvina, Brótola, Pejerrey..."
            placeholderTextColor="#6B7A86"
            value={species}
            onChangeText={setSpecies}
          />
        </View>

        {/* Foto del pesquero */}
        <View style={styles.field}>
          <Text style={styles.label}>Foto del pesquero</Text>

          {imageUri ? (
            <>
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={[styles.photoButton, styles.photoButtonSecondary]}
                onPress={handlePickImage}
              >
                <Text style={styles.photoButtonSecondaryText}>
                  Cambiar foto
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.photoButton, styles.photoButtonPrimary]}
              onPress={handlePickImage}
            >
              <Text style={styles.photoButtonPrimaryText}>
                Seleccionar foto
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.helper}>
            Podés elegir una foto desde tu galería o archivos.
          </Text>
        </View>

        {/* Ubicación en el mapa */}
        <View style={styles.field}>
          <Text style={styles.label}>Ubicación en el mapa</Text>

          <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
            <Text style={styles.mapButtonText}>
              {coords ? "Cambiar ubicación" : "Elegir ubicación en el mapa"}
            </Text>
          </TouchableOpacity>

          {coords && (
            <Text style={styles.coordsText}>
              📍 Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
            </Text>
          )}
        </View>

        {/* Notas / consejos */}
        <View style={styles.field}>
          <Text style={styles.label}>Notas / Consejos</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
            placeholder="Profundidad, mareas, carnada ideal, horarios recomendados..."
            placeholderTextColor="#6B7A86"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Botones */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Guardar pesquero</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020B10",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#9FB3C3",
    fontSize: 13,
    marginBottom: 20,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: "#E5F4FF",
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#031721",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#ffffff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#052634",
  },
  helper: {
    color: "#6B7A86",
    fontSize: 11,
    marginTop: 4,
  },
  textArea: {
    minHeight: 100,
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },
  photoButton: {
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  photoButtonPrimary: {
    backgroundColor: "#00C2FF",
  },
  photoButtonPrimaryText: {
    color: "#00141C",
    fontSize: 14,
    fontWeight: "600",
  },
  photoButtonSecondary: {
    borderWidth: 1,
    borderColor: "#3A4B57",
  },
  photoButtonSecondaryText: {
    color: "#E5F4FF",
    fontSize: 14,
    fontWeight: "500",
  },
  mapButton: {
    backgroundColor: "#00C2FF",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 4,
  },
  mapButtonText: {
    color: "#00141C",
    fontSize: 14,
    fontWeight: "600",
  },
  coordsText: {
    color: "#9FB3C3",
    fontSize: 12,
    marginTop: 6,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#3A4B57",
    alignItems: "center",
  },
  cancelText: {
    color: "#E5F4FF",
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#00C2FF",
    alignItems: "center",
  },
  saveText: {
    color: "#00141C",
    fontSize: 14,
    fontWeight: "600",
  },
});
