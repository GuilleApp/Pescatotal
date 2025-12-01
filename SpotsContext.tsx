// SpotsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Spot = {
  id: string;
  name: string;
  location: string;
  fishingType: string;
  species: string;
  notes: string;
  coords: { lat: number; lng: number } | null;
  imageUrl?: string;
  guideId?: string | null;
};

type SpotsContextType = {
  spots: Spot[];
  addSpot: (spot: Omit<Spot, "id">) => void;
  getSpotById: (id: string) => Spot | undefined;
};

const SpotsContext = createContext<SpotsContextType | undefined>(undefined);

const STORAGE_KEY = "URUPESCA_SPOTS_V1";

// Pesqueros iniciales de Uruguay
const initialSpots: Spot[] = [
  {
    id: "seed-1",
    name: "Playa Ramírez",
    location: "Montevideo, Rambla Sur",
    fishingType: "Costa",
    species: "Corvina, Pescadilla, Burriqueta, Pejerrey",
    notes:
      "Clásico punto de pesca en Montevideo. Rinde bien al atardecer y noche, especialmente con marea en creciente. Ideal para empezar, con fácil acceso y buena iluminación.",
    coords: { lat: -34.9168, lng: -56.1648 },
    imageUrl: "https://picsum.photos/seed/urupesca1/800/600",
    guideId: null,
  },
  {
    id: "seed-2",
    name: "Playa del Buceo",
    location: "Montevideo, Puerto del Buceo",
    fishingType: "Costa",
    species: "Corvina, Mero, Róbalo, Pejerrey",
    notes:
      "Zona muy pescadora cerca del puerto. Suele rendir bien con carnada de camarón, pulpito y lombriz de mar. Cuidado con las piedras y los enganches.",
    coords: { lat: -34.9061, lng: -56.1361 },
    imageUrl: "https://picsum.photos/seed/urupesca2/800/600",
    guideId: null,
  },
  {
    id: "seed-3",
    name: "Playa Pocitos (espigón)",
    location: "Montevideo, Playa Pocitos lado Kibon",
    fishingType: "Costa",
    species: "Pejerrey, Corvina, Pescadilla",
    notes:
      "Cuando el agua está clara se dan muy buenos pejerreyes con línea de boya. En verano de noche suelen aparecer corvinas cerca del espigón.",
    coords: { lat: -34.9162, lng: -56.1454 },
    imageUrl: "https://picsum.photos/seed/urupesca3/800/600",
    guideId: null,
  },
  {
    id: "seed-4",
    name: "Playa Malvín (Parador del Buceo)",
    location: "Montevideo, Playa Malvín",
    fishingType: "Costa",
    species: "Corvina, Brótola, Pescadilla",
    notes:
      "Buen lugar para pesca de corvina con plomo corredizo. Rinde mejor con mar algo movido y viento del sureste. Mucho espacio en la arena para pescar cómodo.",
    coords: { lat: -34.9018, lng: -56.1125 },
    imageUrl: "https://picsum.photos/seed/urupesca4/800/600",
    guideId: null,
  },
  {
    id: "seed-5",
    name: "Atlántida - Muelle",
    location: "Canelones, Atlántida",
    fishingType: "Costa / Muelle",
    species: "Corvina, Burriqueta, Brótola",
    notes:
      "El muelle de Atlántida es muy concurrido pero rendidor. Ideal para ir en familia. De noche mejora la actividad, especialmente en verano y otoño.",
    coords: { lat: -34.7712, lng: -55.7578 },
    imageUrl: "https://picsum.photos/seed/urupesca5/800/600",
    guideId: null,
  },
  {
    id: "seed-6",
    name: "Piriápolis - Escollera Grande",
    location: "Maldonado, Piriápolis",
    fishingType: "Costa / Escollera",
    species: "Corvina, Sargo, Róbalo, Pescadilla",
    notes:
      "Escollera muy pescadora, con buena profundidad cerca. Tener cuidado con el oleaje en días de viento fuerte. Ideal para corvina con anchoa o camarón.",
    coords: { lat: -34.8633, lng: -55.2719 },
    imageUrl: "https://picsum.photos/seed/urupesca6/800/600",
    guideId: null,
  },
  {
    id: "seed-7",
    name: "Punta del Este - Escollera Mansa",
    location: "Maldonado, Punta del Este",
    fishingType: "Costa / Escollera",
    species: "Pejerrey, Corvina, Sargo",
    notes:
      "Zona cómoda y con linda vista. Buenos pejerreyes en invierno-primavera con línea de boya. En verano de noche suelen salir corvinas y alguna pescadilla.",
    coords: { lat: -34.9637, lng: -54.9516 },
    imageUrl: "https://picsum.photos/seed/urupesca7/800/600",
    guideId: null,
  },
  {
    id: "seed-8",
    name: "La Paloma - Playa La Aguada",
    location: "Rocha, La Paloma",
    fishingType: "Costa",
    species: "Corvina, Brótola, Chucho",
    notes:
      "Muy buena playa para buscar corvinas grandes con lanzas largas. Rinde muy bien al atardecer y primeras horas de la noche, sobre todo en temporada de verano.",
    coords: { lat: -34.6606, lng: -54.168 },
    imageUrl: "https://picsum.photos/seed/urupesca8/800/600",
    guideId: null,
  },
  {
    id: "seed-9",
    name: "Río Santa Lucía - Paso Pache",
    location: "Canelones / Florida, Paso Pache",
    fishingType: "Río",
    species: "Tararira, Bagre, Carpa",
    notes:
      "Clásico punto de pesca de tarariras con señuelos y carnada. En verano, con el río algo bajo, se dan muy lindas jornadas al amanecer y al atardecer.",
    coords: { lat: -34.4625, lng: -56.3273 },
    imageUrl: "https://picsum.photos/seed/urupesca9/800/600",
    guideId: null,
  },
  {
    id: "seed-10",
    name: "Río Uruguay - Paysandú (zona del puerto)",
    location: "Paysandú, costa del Río Uruguay",
    fishingType: "Río / Costa",
    species: "Dorado, Boga, Bagre, Patí",
    notes:
      "Muy buen sector para variada de río y dorados en temporada. Rinde tanto con carnada como con señuelos. Siempre atento a la correntada y nivel del río.",
    coords: { lat: -32.3134, lng: -58.0781 },
    imageUrl: "https://picsum.photos/seed/urupesca10/800/600",
    guideId: null,
  },
];

export const SpotsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [spots, setSpots] = useState<Spot[]>(initialSpots);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  // Cargar desde AsyncStorage al iniciar
  useEffect(() => {
    const loadSpots = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const parsed: Spot[] = JSON.parse(json);
          setSpots(parsed);
        }
      } catch (e) {
        console.warn("Error cargando spots desde storage", e);
      } finally {
        setLoadedFromStorage(true);
      }
    };

    loadSpots();
  }, []);

  // Guardar cada vez que cambian los spots (y ya cargamos desde storage)
  useEffect(() => {
    const saveSpots = async () => {
      try {
        const json = JSON.stringify(spots);
        await AsyncStorage.setItem(STORAGE_KEY, json);
      } catch (e) {
        console.warn("Error guardando spots en storage", e);
      }
    };

    if (loadedFromStorage) {
      saveSpots();
    }
  }, [spots, loadedFromStorage]);

  const addSpot = (spotWithoutId: Omit<Spot, "id">) => {
    const newSpot: Spot = {
      id: Date.now().toString(),
      ...spotWithoutId,
    };
    setSpots((prev) => [...prev, newSpot]);
  };

  const getSpotById = (id: string) => {
    return spots.find((s) => s.id === id);
  };

  return (
    <SpotsContext.Provider value={{ spots, addSpot, getSpotById }}>
      {children}
    </SpotsContext.Provider>
  );
};

export const useSpots = () => {
  const ctx = useContext(SpotsContext);
  if (!ctx) {
    throw new Error("useSpots debe usarse dentro de SpotsProvider");
  }
  return ctx;
};
