// screens/Baits.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useBaits } from "../hooks/useBaits";

// Filtros por entorno
const FILTERS = [
  { id: "all", label: "Todo" },
  { id: "agua-dulce", label: "Agua Dulce" },
  { id: "agua-salada", label: "Agua Salada" },
  { id: "rio", label: "Río" },
  { id: "mar", label: "Mar" },
];

// Colores y textos para tipo de carnada
const TYPE_COLORS: Record<string, string> = {
  natural: "#22c55e",
  viva: "#f97316",
  artificial: "#3b82f6",
};

const TYPE_LABELS: Record<string, string> = {
  natural: "Natural",
  viva: "Viva",
  artificial: "Artificial",
};

const BaitsScreen: React.FC = () => {
  // Lo casteo a any para que TS no moleste aunque el tipo Bait no tenga todos los campos
  const { baits, loading, error } = useBaits() as any;

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [search, setSearch] = useState("");

// Filtro + búsqueda
const filtered = useMemo(() => {
  const list: any[] = Array.isArray(baits) ? baits : [];
  const selected = selectedFilter.toLowerCase();
  const query = search.toLowerCase();

  return list.filter((b) => {
    // environment puede venir como:
    // - array: ['agua-salada','mar']
    // - string: 'agua-salada'
    // - null / undefined / lo que sea
    const rawEnv = b.environment;
    let envs: string[] = [];

    if (Array.isArray(rawEnv)) {
      envs = rawEnv
        .filter((e: any) => typeof e === "string")
        .map((e: string) => e.toLowerCase());
    } else if (typeof rawEnv === "string") {
      envs = [rawEnv.toLowerCase()];
    }

    const name = (b.name || "").toLowerCase();
    const notes = (b.notes || "").toLowerCase();

    // ---- Filtro por entorno ----
    let matchFilter = true;
    if (selected !== "all") {
      matchFilter = envs.some((e) => e === selected);
    }

    // ---- Filtro por búsqueda ----
    const matchSearch =
      !query || name.includes(query) || notes.includes(query);

    return matchFilter && matchSearch;
  });
}, [baits, selectedFilter, search]);



  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Cargando carnadas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Error: {String(error)}</Text>
      </View>
    );
  }

  if (!filtered.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Guía de Carnadas</Text>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar un tipo de carnada"
            placeholderTextColor="#6b7280"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <Text style={{ color: "#9ca3af", textAlign: "center", marginTop: 40 }}>
          Todavía no hay carnadas cargadas o no coincide ninguna con el filtro.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Guía de Carnadas</Text>

      {/* Buscador */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar un tipo de carnada"
          placeholderTextColor="#6b7280"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = selectedFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              onPress={() => setSelectedFilter(f.id)}
              style={[styles.filter, active && styles.filterActive]}
            >
              <Text
                style={[styles.filterText, active && styles.filterTextActive]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
            
          );
          <TouchableOpacity
  style={styles.clearButton}
  onPress={() => {
    setSelectedFilter("all");
    setSearch("");
  }}
>
  <Text style={styles.clearButtonText}>Limpiar filtros</Text>
</TouchableOpacity>

        })}
      </View>

      {/* Grid de carnadas */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }: { item: any }) => {
          const typeKey = String(item.type || "").toLowerCase();
          const badgeColor = TYPE_COLORS[typeKey] ?? "#4b5563";
          const badgeLabel = TYPE_LABELS[typeKey] ?? "Carnada";

          return (
            <TouchableOpacity style={styles.card}>
              <View style={styles.imageWrapper}>
                {item.image_url ? (
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.image, styles.imagePlaceholder]}>
                    <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                      Sin imagen
                    </Text>
                  </View>
                )}

                <View style={[styles.typeBadge, { backgroundColor: badgeColor }]}>
                  <Text style={styles.typeText}>{badgeLabel}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>
                {item.notes || "Sin descripción."}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default BaitsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1c24",
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e4eef4ff",
  },
  clearButton: {
  alignSelf: "flex-start",
  marginLeft: 20,
  marginBottom: 8,
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 999,
  backgroundColor: "#1f2d36",
},
clearButtonText: {
  color: "#9ca3af",
  fontSize: 12,
},

  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 15,
  },
  searchBox: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#1f2d36",
    padding: 12,
    borderRadius: 12,
    color: "white",
    fontSize: 16,
  },
  filters: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filter: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#1f2d36",
    marginRight: 8,
  },
  filterActive: {
    backgroundColor: "#00c2ff",
  },
  filterText: {
    color: "#9ca3af",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#16252e",
    borderRadius: 14,
    paddingBottom: 12,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 130,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },
  typeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  cardTitle: {
    marginTop: 10,
    marginHorizontal: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardSubtitle: {
    marginHorizontal: 10,
    marginTop: 4,
    color: "#9ca3af",
    fontSize: 13,
  },
});
