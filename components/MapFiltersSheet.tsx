// components/MapFiltersSheet.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MapFiltersSheetProps {
  visible: boolean;
  onClose: () => void;
}

const fishTypes = ["Trucha", "Lubina", "Salmón", "Lucio", "Carpa", "Otros"];
const fishingStyles = ["Embarcación", "Costa", "Kayak"];
const services = ["Estacionamiento", "Tienda", "Muelle", "Camping"];

const MapFiltersSheet: React.FC<MapFiltersSheetProps> = ({
  visible,
  onClose,
}) => {
  const [selectedFish, setSelectedFish] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleInArray = (
    value: string,
    current: string[],
    setter: (v: string[]) => void
  ) => {
    if (current.includes(value)) {
      setter(current.filter((x) => x !== value));
    } else {
      setter([...current, value]);
    }
  };

  const handleClear = () => {
    setSelectedFish(null);
    setSelectedStyles([]);
    setSelectedServices([]);
  };

  const handleApply = () => {
    // Más adelante conectamos estos filtros con el mapa real
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handleWrapper}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Filtrar Zonas de Pesca</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Tipo de pez */}
            <Text style={styles.sectionTitle}>Tipo de pez</Text>
            <View style={styles.fishGrid}>
              {fishTypes.map((fish) => {
                const active = selectedFish === fish;
                return (
                  <TouchableOpacity
                    key={fish}
                    onPress={() =>
                      setSelectedFish(active ? null : fish)
                    }
                    style={[
                      styles.fishCard,
                      active && styles.fishCardActive,
                    ]}
                  >
                    <View style={styles.fishIconCircle}>
                      <Ionicons
                        name="fish"
                        size={20}
                        color={active ? "#FFFFFF" : "#8AB6D4"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.fishName,
                        active && styles.fishNameActive,
                      ]}
                    >
                      {fish}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Tipo de pesca */}
            <Text style={styles.sectionTitle}>Tipo de pesca</Text>
            <View style={styles.chipsRow}>
              {fishingStyles.map((style) => {
                const active = selectedStyles.includes(style);
                return (
                  <TouchableOpacity
                    key={style}
                    onPress={() =>
                      toggleInArray(style, selectedStyles, setSelectedStyles)
                    }
                    style={[
                      styles.chip,
                      active && styles.chipActive,
                    ]}
                  >
                    <Ionicons
                      name={
                        style === "Embarcación"
                          ? "boat-outline"
                          : style === "Costa"
                          ? "walk-outline"
                          : "fitness-outline"
                      }
                      size={16}
                      color={active ? "#FFFFFF" : "#8AB6D4"}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}
                    >
                      {style}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Servicios cercanos */}
            <Text style={styles.sectionTitle}>Servicios cercanos</Text>
            <View style={styles.chipsRow}>
              {services.map((service) => {
                const active = selectedServices.includes(service);
                return (
                  <TouchableOpacity
                    key={service}
                    onPress={() =>
                      toggleInArray(
                        service,
                        selectedServices,
                        setSelectedServices
                      )
                    }
                    style={[
                      styles.serviceChip,
                      active && styles.serviceChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.serviceChipText,
                        active && styles.serviceChipTextActive,
                      ]}
                    >
                      {service}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Botones inferiores */}
          <View style={styles.bottomButtonsRow}>
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleApply}
              style={styles.applyButton}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#02131B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    maxHeight: "80%",
  },
  handleWrapper: {
    alignItems: "center",
    marginBottom: 8,
  },
  handle: {
    width: 64,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 6,
  },
  fishGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fishCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "#071E2A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  fishCardActive: {
    backgroundColor: "#0B69D9",
  },
  fishIconCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  fishName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8AB6D4",
  },
  fishNameActive: {
    color: "#FFFFFF",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  } as any, // RN aún no soporta "gap" tipado, pero funciona en runtime
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#123244",
    backgroundColor: "#071E2A",
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: "#0B69D9",
    borderColor: "#0B69D9",
  },
  chipText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#8AB6D4",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  serviceChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#123244",
    backgroundColor: "#071E2A",
    marginRight: 8,
    marginBottom: 8,
  },
  serviceChipActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  serviceChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8AB6D4",
  },
  serviceChipTextActive: {
    color: "#02131B",
  },
  bottomButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  } as any,
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#143447",
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "#0B69D9",
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default MapFiltersSheet;
