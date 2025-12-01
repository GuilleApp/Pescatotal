// screens/Equipment.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEquipment } from "../hooks/useEquipment";

// Categorías principales (tienen que coincidir con el campo "category" en Supabase)
const CATEGORY_OPTIONS = [
  { id: "todas", label: "Todos" },
  { id: "cana", label: "Cañas" },
  { id: "reel", label: "Reeles" },
  { id: "senuelos", label: "Señuelos" },
  { id: "boyas-curricas", label: "Boyas/Curricas" },
  { id: "linea", label: "Líneas" },
  { id: "anzuelo", label: "Anzuelos" },
];

const EquipmentScreen = () => {
  const navigation = useNavigation<any>();
  const { items, loading, error } = useEquipment();

  const [selectedCategory, setSelectedCategory] = useState("todas");

  // Lista filtrada por categoría
  const filteredList = useMemo(() => {
    if (selectedCategory === "todas") return items;
    return items.filter(
      (item: any) => item.category === selectedCategory
    );
  }, [items, selectedCategory]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando equipamiento...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* DEBUG: para confirmar versión y cantidad de items */}
      <Text style={styles.debugText}>
        EQUIP v3 · Items: {items.length}
      </Text>

      {/* -------- FILA DE CATEGORÍAS -------- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {CATEGORY_OPTIONS.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.categoryChip,
                active && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  active && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* -------- LISTA DE EQUIPAMIENTO -------- */}
      {filteredList.length === 0 ? (
        <View style={styles.centered}>
          <Text style={{ color: "#4b5563", textAlign: "center" }}>
            No hay ítems en esta categoría.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item: any) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("EquipmentDetail", { item })
              }
            >
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.image}
                />
              ) : null}

              <Text style={styles.title}>{item.name}</Text>

              {item.category && (
                <Text style={styles.label}>
                  Categoría:{" "}
                  <Text style={styles.value}>{item.category}</Text>
                </Text>
              )}

              {item.type && (
                <Text style={styles.label}>
                  Tipo: <Text style={styles.value}>{item.type}</Text>
                </Text>
              )}

              {item.description && (
                <Text style={styles.notes}>{item.description}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default EquipmentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  debugText: {
    paddingHorizontal: 12,
    paddingTop: 6,
    fontSize: 10,
    color: "#6b7280",
  },

  // CATEGORY CHIPS
  categoryRow: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#0284c7",
  },
  categoryText: {
    fontSize: 14,
    color: "#111",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  // CARDS
  card: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 140,
    marginBottom: 8,
    borderRadius: 10,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  label: { marginTop: 4, color: "#444", fontWeight: "600" },
  value: { fontWeight: "400" },
  notes: { marginTop: 6, color: "#555" },
});
