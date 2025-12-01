// screens/Profile.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Capture = {
  id: string;
  title: string;
  image: string;
};

const mockCaptures: Capture[] = [
  {
    id: "1",
    title: "Trucha en el río",
    image: "https://picsum.photos/seed/capture1/600/800",
  },
  {
    id: "2",
    title: "Lubina al amanecer",
    image: "https://picsum.photos/seed/capture2/600/800",
  },
  {
    id: "3",
    title: "Captura de lucio",
    image: "https://picsum.photos/seed/capture3/600/800",
  },
  {
    id: "4",
    title: "Carpa junto al lago",
    image: "https://picsum.photos/seed/capture4/600/800",
  },
  {
    id: "5",
    title: "Pesca de salmón",
    image: "https://picsum.photos/seed/capture5/600/800",
  },
  {
    id: "6",
    title: "Perca en día soleado",
    image: "https://picsum.photos/seed/capture6/600/800",
  },
];

type TabKey = "captures" | "guides" | "stats";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("captures");

  const handleEditProfile = () => {
    Alert.alert(
      "Editar perfil",
      "En una próxima versión vas a poder editar tu nombre, foto y descripción desde aquí."
    );
  };

  const handleSettings = () => {
    Alert.alert(
      "Configuración",
      "Pantalla de configuración pendiente de implementar."
    );
  };

  const handleCapturePress = (capture: Capture) => {
    Alert.alert("Captura", `Abrir detalle de: "${capture.title}"`);
  };

  const renderTabContent = () => {
    if (activeTab === "captures") {
      return (
        <View style={styles.grid}>
          {mockCaptures.map((cap) => (
            <TouchableOpacity
              key={cap.id}
              style={styles.captureCard}
              onPress={() => handleCapturePress(cap)}
            >
              <Image
                source={{ uri: cap.image }}
                style={styles.captureImage}
                resizeMode="cover"
              />
              <View style={styles.captureOverlay} />
              <Text style={styles.captureTitle} numberOfLines={2}>
                {cap.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (activeTab === "guides") {
      return (
        <View style={styles.placeholderBox}>
          <Ionicons name="book-outline" size={32} color="#00C2FF" />
          <Text style={styles.placeholderTitle}>Mis guías</Text>
          <Text style={styles.placeholderText}>
            En el futuro vas a ver acá las guías que publicaste o seguiste.
          </Text>
        </View>
      );
    }

    // stats
    return (
      <View style={styles.placeholderBox}>
        <Ionicons name="stats-chart-outline" size={32} color="#00C2FF" />
        <Text style={styles.placeholderTitle}>Estadísticas</Text>
        <Text style={styles.placeholderText}>
          Próximamente: horas pescadas, especies capturadas, mejores pesqueros y
          rachas.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER SUPERIOR */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Perfil</Text>
        <TouchableOpacity onPress={handleSettings}>
          <Ionicons name="settings-outline" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* AVATAR + NOMBRE */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://picsum.photos/seed/urupesca-avatar/400/400",
              }}
              style={styles.avatarImage}
            />
          </View>

          <Text style={styles.name}>Alex Roldán</Text>
          <Text style={styles.subtitle}>
            Pescador aficionado | Montevideo, Uruguay
          </Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* ESTADÍSTICAS RESUMEN */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>25</Text>
            <Text style={styles.statLabel}>Capturas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Especies</Text>
          </View>
          <View style={[styles.statCard, { flexBasis: "100%" }]}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Sitios</Text>
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabsContainer}>
          <TabButton
            icon="image-outline"
            label="Mis Capturas"
            active={activeTab === "captures"}
            onPress={() => setActiveTab("captures")}
          />
          <TabButton
            icon="document-text-outline"
            label="Mis Guías"
            active={activeTab === "guides"}
            onPress={() => setActiveTab("guides")}
          />
          <TabButton
            icon="stats-chart-outline"
            label="Estadísticas"
            active={activeTab === "stats"}
            onPress={() => setActiveTab("stats")}
          />
        </View>

        {/* CONTENIDO DE CADA TAB */}
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

type TabButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
};

function TabButton({ icon, label, active, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? "#00C2FF" : "#9FB3C3"}
      />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020B10",
  },
  topBar: {
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#02151F",
    borderBottomWidth: 1,
    borderBottomColor: "#071823",
  },
  topBarTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#00C2FF",
    padding: 4,
    marginBottom: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  name: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    color: "#9FB3C3",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 14,
  },
  editButton: {
    backgroundColor: "#00C2FF",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 4,
  },
  editButtonText: {
    color: "#00141C",
    fontSize: 14,
    fontWeight: "600",
  },

  statsRow: {
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 10,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  statCard: {
    flexBasis: "48%",
    backgroundColor: "#031D29",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    color: "#9FB3C3",
    fontSize: 13,
    marginTop: 2,
  },

  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#071823",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#00C2FF",
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 12,
    color: "#9FB3C3",
  },
  tabLabelActive: {
    color: "#00C2FF",
    fontWeight: "600",
  },

  grid: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  captureCard: {
    width: "48%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#031D29",
  },
  captureImage: {
    width: "100%",
    height: 140,
  },
  captureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  captureTitle: {
    position: "absolute",
    left: 10,
    bottom: 8,
    right: 10,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  placeholderBox: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#031D29",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 6,
  },
  placeholderText: {
    color: "#9FB3C3",
    fontSize: 13,
    textAlign: "center",
  },
});
