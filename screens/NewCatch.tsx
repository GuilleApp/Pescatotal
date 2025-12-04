// screens/NewCatch.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const NewCatchScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [species, setSpecies] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [lengthCm, setLengthCm] = useState("");
  const [locationName, setLocationName] = useState("");
  const [method, setMethod] = useState("");
  const [bait, setBait] = useState("");
  const [notes, setNotes] = useState("");
  const [captureDate] = useState<Date>(new Date()); // por ahora usamos la fecha actual

  const formattedDate = captureDate.toLocaleString("es-UY", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSave = () => {
    if (!species.trim()) {
      Alert.alert("Falta información", "Ingresá al menos la especie.");
      return;
    }

    const payload = {
      species: species.trim(),
      weightKg: weightKg ? Number(weightKg) : null,
      lengthCm: lengthCm ? Number(lengthCm) : null,
      locationName: locationName.trim() || null,
      method: method.trim() || null,
      bait: bait.trim() || null,
      notes: notes.trim() || null,
      captureAt: captureDate.toISOString(),
    };

    console.log("Nueva captura (demo):", payload);

    // 👉 Más adelante: acá hacemos el insert en Supabase.
    // Por ahora solo mostramos un mensaje y volvemos al log.
    Alert.alert("Captura guardada", "Tu captura se guardó (demo).", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleAddPhoto = () => {
    Alert.alert(
      "Próximamente",
      "En la siguiente versión vas a poder añadir fotos desde la cámara o galería 😉"
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header propio (ocultamos el header del stack para esta pantalla) */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.headerCancel}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear Nueva Captura</Text>
          <View style={{ width: 60 }} />{/* espacio para balancear el layout */}
        </View>

        {/* FOTOS */}
        <Text style={styles.sectionLabel}>Añade fotos de tu captura</Text>
        <View style={styles.photosRow}>
          <TouchableOpacity
            style={styles.addPhotoCard}
            onPress={handleAddPhoto}
            activeOpacity={0.7}
          >
            <Ionicons
              name="camera-outline"
              size={30}
              color="#9ca3af"
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.addPhotoText}>Añadir foto</Text>
          </TouchableOpacity>

          {/* Foto de ejemplo / preview estática por ahora */}
          <View style={styles.photoPreviewCard}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/2955703/pexels-photo-2955703.jpeg?auto=compress&cs=tinysrgb&w=800",
              }}
              style={styles.photoPreviewImg}
            />
          </View>
        </View>

        {/* FECHA Y HORA */}
        <Text style={styles.sectionLabel}>Fecha y Hora</Text>
        <View style={styles.inputRowWithIcon}>
          <Text style={styles.valueText}>{formattedDate}</Text>
          <Ionicons name="calendar-outline" size={20} color="#6b7280" />
        </View>

        {/* ESPECIE */}
        <Text style={styles.sectionLabel}>Especie</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: Corvina Negra"
            placeholderTextColor="#9ca3af"
            value={species}
            onChangeText={setSpecies}
          />
        </View>

        {/* PESO + LONGITUD */}
        <View style={styles.inlineRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.sectionLabel}>Peso (kg)</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor="#9ca3af"
                value={weightKg}
                onChangeText={setWeightKg}
              />
            </View>
          </View>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.sectionLabel}>Longitud (cm)</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor="#9ca3af"
                value={lengthCm}
                onChangeText={setLengthCm}
              />
            </View>
          </View>
        </View>

        {/* UBICACIÓN */}
        <Text style={styles.sectionLabel}>Ubicación</Text>
        <View style={styles.inputRowWithIcon}>
          <TextInput
            style={[styles.textInput, { flex: 1 }]}
            placeholder="Ej: Playa Ramírez, Montevideo"
            placeholderTextColor="#9ca3af"
            value={locationName}
            onChangeText={setLocationName}
          />
          <TouchableOpacity onPress={() => Alert.alert("Próximamente", "Usar tu ubicación actual.")}>
            <Ionicons name="navigate-outline" size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* MÉTODO DE PESCA */}
        <Text style={styles.sectionLabel}>Método de Pesca</Text>
        <View style={styles.inputRowWithIcon}>
          <TextInput
            style={[styles.textInput, { flex: 1 }]}
            placeholder="Ej: Spinning"
            placeholderTextColor="#9ca3af"
            value={method}
            onChangeText={setMethod}
          />
          <Ionicons name="chevron-down" size={18} color="#9ca3af" />
        </View>

        {/* CARNADA */}
        <Text style={styles.sectionLabel}>Carnada Utilizada</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: Camarón, lombriz, señuelo..."
            placeholderTextColor="#9ca3af"
            value={bait}
            onChangeText={setBait}
          />
        </View>

        {/* NOTAS */}
        <Text style={styles.sectionLabel}>Notas Adicionales</Text>
        <View style={styles.textAreaWrapper}>
          <TextInput
            style={styles.textArea}
            placeholder="Describe las condiciones, el equipo, etc."
            placeholderTextColor="#9ca3af"
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* BOTÓN GUARDAR */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar Captura</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NewCatchScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 8,
  },
  headerCancel: {
    color: "#2563eb",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
  },

  // Fotos
  photosRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addPhotoCard: {
    flex: 1.2,
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#f9fafb",
  },
  addPhotoText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  photoPreviewCard: {
    flex: 1,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
  },
  photoPreviewImg: {
    width: "100%",
    height: "100%",
  },

  inputRow: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inputRowWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  textInput: {
    fontSize: 14,
    color: "#111827",
  },
  valueText: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  inlineRow: {
    flexDirection: "row",
    marginTop: 4,
  },

  textAreaWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  textArea: {
    fontSize: 14,
    color: "#111827",
    minHeight: 90,
  },

  saveButton: {
    marginTop: 24,
    marginBottom: 12,
    backgroundColor: "#2563eb",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});
