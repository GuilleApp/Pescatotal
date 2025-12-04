// screens/Log.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type CatchItem = {
  id: string;
  species: string;
  location: string;
  dateLabel: string;
  method: string;
};

const demoCatches: CatchItem[] = [
  {
    id: "1",
    species: "Corvina Negra",
    location: "Playa Ramírez, Montevideo",
    dateLabel: "24 de Mayo, 2024 · 08:30",
    method: "Spinning",
  },
  {
    id: "2",
    species: "Pejerrey",
    location: "Punta del Este, Muelle",
    dateLabel: "10 de Junio, 2024 · 17:45",
    method: "Flote",
  },
];

const LogScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const goToNewCatch = () => {
    navigation.navigate("NewCatch");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Mis Capturas</Text>
        <TouchableOpacity style={styles.addButton} onPress={goToNewCatch}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {demoCatches.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name="fish" size={20} color="#2563eb" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardSpecies}>{item.species}</Text>
              <Text style={styles.cardLocation} numberOfLines={1}>
                {item.location}
              </Text>
              <View style={styles.cardMetaRow}>
                <Text style={styles.cardMeta}>{item.dateLabel}</Text>
                <Text style={styles.cardMetaDot}>•</Text>
                <Text style={styles.cardMeta}>{item.method}</Text>
              </View>
            </View>
          </View>
        ))}

        {demoCatches.length === 0 && (
          <Text style={styles.emptyText}>
            Todavía no registraste capturas. Toca el botón + para agregar la
            primera.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default LogScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scroll: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cardSpecies: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  cardLocation: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: "#9ca3af",
  },
  cardMetaDot: {
    fontSize: 12,
    color: "#9ca3af",
    marginHorizontal: 4,
  },
  emptyText: {
    marginTop: 24,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
