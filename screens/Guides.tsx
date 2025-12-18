// screens/Guides.tsx
import React, { useMemo, useState } from "react";
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
import { useGuides, Guide } from "../hooks/useGuides";
import BaitsScreen from "./Baits";
import EquipmentScreen from "./Equipment";

// Filtros para estilos de guía
const STYLE_OPTIONS = [
  { id: "todos", label: "Todas" },
  { id: "costa", label: "Costa" },
  { id: "embarcado", label: "Embarcado" },
  { id: "kayak", label: "Kayak" },
  { id: "mosca", label: "Mosca" },
  { id: "spinning", label: "Spinning" },
  { id: "surfcasting", label: "Surfcasting" },
  { id: "trolling", label: "Trolling" },
];

// Filtros para entorno de guía
const ENV_OPTIONS = [
  { id: "todas", label: "Todos" },
  { id: "agua-dulce", label: "Agua dulce" },
  { id: "agua-salada", label: "Agua salada" },
];

type Section = "guides" | "baits" | "gear";

const GuidesScreen = () => {
  const navigation = useNavigation<any>();
  const { guides, loading, error } = useGuides();

  const [selectedStyle, setSelectedStyle] = useState("todos");
  const [selectedEnv, setSelectedEnv] = useState("todas");
  const [section, setSection] = useState<Section>("guides");

  const filteredGuides = useMemo(() => {
    return guides.filter((g: Guide) => {
      const matchStyle =
        selectedStyle === "todos" || g.style === selectedStyle;
      const matchEnv =
        selectedEnv === "todas" || g.environment === selectedEnv;
      return matchStyle && matchEnv;
    });
  }, [guides, selectedStyle, selectedEnv]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Cargando guías...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* --------- TABS SUPERIORES (GUÍAS / CARNADAS / EQUIPAMIENTO) --------- */}
      <View style={styles.sectionTabs}>
        <TouchableOpacity
          style={[
            styles.sectionTab,
            section === "guides" && styles.sectionTabActive,
          ]}
          onPress={() => setSection("guides")}
        >
          <Text
            style={[
              styles.sectionTabText,
              section === "guides" && styles.sectionTabTextActive,
            ]}
          >
            Lugares recomendados
                      </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sectionTab,
            section === "baits" && styles.sectionTabActive,
          ]}
          onPress={() => setSection("baits")}
        >
          <Text
            style={[
              styles.sectionTabText,
              section === "baits" && styles.sectionTabTextActive,
            ]}
          >
            Carnadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sectionTab,
            section === "gear" && styles.sectionTabActive,
          ]}
          onPress={() => setSection("gear")}
        >
          <Text
            style={[
              styles.sectionTabText,
              section === "gear" && styles.sectionTabTextActive,
            ]}
          >
            Equipamiento
          </Text>
        </TouchableOpacity>
      </View>

      {/* --------- CONTENIDO SEGÚN SECCIÓN --------- */}
      <View style={{ flex: 1 }}>
        {section === "guides" && (
          <>
            <Text style={styles.title}>Recomendados por la comunidad</Text>

            {/* FILTRO POR ESTILO */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {STYLE_OPTIONS.map((opt) => {
                const active = selectedStyle === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setSelectedStyle(opt.id)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* FILTRO POR ENTORNO */}
            <Text style={styles.subtitle}></Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {ENV_OPTIONS.map((opt) => {
                const active = selectedEnv === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setSelectedEnv(opt.id)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* LISTA DE GUÍAS */}
            <FlatList
              data={filteredGuides}
              keyExtractor={(item: Guide) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }: { item: Guide }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("GuideDetail", { guide: item })
                  }
                  style={styles.card}
                >
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.cardImage}
                    />
                  ) : null}

                  <Text style={styles.cardTitle}>{item.title}</Text>

                  <Text style={styles.cardSubtitle}>
                    {item.environment === "agua-dulce"
                      ? "Agua dulce"
                      : item.environment === "agua-salada"
                      ? "Agua salada"
                      : item.environment || "Entorno N/D"}{" "}
                    • {item.style || "Estilo N/D"}
                  </Text>

                  {item.location_summary ? (
                    <Text style={styles.cardLocation}>
                      {item.location_summary}
                    </Text>
                  ) : null}

                  {item.equipment && item.equipment.length > 0 && (
                    <Text style={styles.cardInfo}>
                      <Text style={styles.cardInfoLabel}>Equipo: </Text>
                      {item.equipment.join(", ")}
                    </Text>
                  )}

                  {item.baits && item.baits.length > 0 && (
                    <Text style={styles.cardInfo}>
                      <Text style={styles.cardInfoLabel}>Carnadas: </Text>
                      {item.baits.join(", ")}
                    </Text>
                  )}

                  {item.lures && item.lures.length > 0 && (
                    <Text style={styles.cardInfo}>
                      <Text style={styles.cardInfoLabel}>Señuelos: </Text>
                      {item.lures.join(", ")}
                    </Text>
                  )}

                  {item.species && item.species.length > 0 && (
                    <Text style={styles.cardInfo}>
                      <Text style={styles.cardInfoLabel}>Especies: </Text>
                      {item.species.join(", ")}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {section === "baits" && <BaitsScreen />}

        {section === "gear" && <EquipmentScreen />}
      </View>
    </View>
  );
};

export default GuidesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Tabs superiores de sección
  sectionTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: "#ffffff",
  },
  sectionTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    backgroundColor: "#e5e7eb",
  },
  sectionTabActive: {
    backgroundColor: "#0284c7",
  },
  sectionTabText: {
    fontSize: 13,
    color: "#111827",
  },
  sectionTabTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },

  title: {
    marginTop: 8,
    marginHorizontal: 16,
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    marginTop: 12,
    marginHorizontal: 16,
    fontSize: 14,
    color: "#4b5563",
  },
  chipRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chip: {
    minHeight: 32,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#9ca3af",
    backgroundColor: "#e5e7eb",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: "#0284c7",
    borderColor: "#0284c7",
  },
  chipText: {
    fontSize: 13,
    color: "#111827",
  },
  chipTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#4b5563",
  },
  cardLocation: {
    marginTop: 2,
    fontSize: 12,
    color: "#6b7280",
  },
  cardInfo: {
    marginTop: 2,
    fontSize: 12,
    color: "#374151",
  },
  cardInfoLabel: {
    fontWeight: "600",
  },
});
