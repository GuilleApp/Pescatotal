// screens/Weather.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const TIDE_API_KEY = process.env.EXPO_PUBLIC_WORLD_TIDES_API_KEY;

// Coordenadas por defecto (Montevideo - Rambla)
const DEFAULT_LAT = -34.9011;
const DEFAULT_LON = -56.1645;

interface CurrentWeather {
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
  windKmh: number;
  windDir: string;
  humidity: number;
}

interface BestHour {
  hour: string;
  label: string;
}

interface DayForecast {
  day: string;
  dateKey: string; // yyyy-mm-dd
  min: number;
  max: number;
  icon: string;
  note: string;
}

interface WindPoint {
  time: string;
  speed: number; // km/h
  direction: string;
}

interface TideEvent {
  time: string;
  type: "Pleamar" | "Bajamar";
  height: number; // metros
}

interface MoonPhaseInfo {
  label: string;
  emoji: string;
}

interface TideReference {
  high?: number; // pleamar más alta de HOY
  low?: number; // bajamar más baja de HOY
}

interface Coords {
  lat: number;
  lon: number;
}

const WeatherScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentSpot, setCurrentSpot] = useState("Montevideo - Rambla");

  const [coords, setCoords] = useState<Coords>({
    lat: DEFAULT_LAT,
    lon: DEFAULT_LON,
  });
  const [detectingLocation, setDetectingLocation] = useState(false);

  const [todayWeather, setTodayWeather] = useState<CurrentWeather | null>(null);
  const [displayWeather, setDisplayWeather] = useState<CurrentWeather | null>(
    null
  );
  const [bestHours, setBestHours] = useState<BestHour[]>([]);
  const [selectedHour, setSelectedHour] = useState<BestHour | null>(null);

  const [nextDays, setNextDays] = useState<DayForecast[]>([]);
  const [dailyMap, setDailyMap] = useState<{ [date: string]: any[] }>({});
  const [todayKey, setTodayKey] = useState<string | null>(null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const [windTimeline, setWindTimeline] = useState<WindPoint[]>([]);
  const [tides, setTides] = useState<TideEvent[]>([]);
  const [todayTideReference, setTodayTideReference] =
    useState<TideReference | null>(null);

  const [moonPhase, setMoonPhase] = useState<MoonPhaseInfo | null>(null);

  // --------- Carga completa de clima + pronóstico + mareas para unas coords ---------
  const loadWeather = async (lat: number, lon: number, spotLabel?: string) => {
    try {
      if (!WEATHER_API_KEY) {
        setError("Falta configurar la API key de OpenWeather.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setCoords({ lat, lon });
      if (spotLabel) setCurrentSpot(spotLabel);

      const now = new Date();
      const todayKeyComputed = now.toISOString().split("T")[0];
      setTodayKey(todayKeyComputed);
      setMoonPhase(getMoonPhaseInfo(todayKeyComputed));
      setSelectedDayKey(todayKeyComputed);

      // ---- Clima actual (HOY) ----
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=es`
      );
      const currentJson = await currentRes.json();

      if (currentJson.cod !== 200) {
        throw new Error(
          currentJson.message || "Error obteniendo clima actual"
        );
      }

      const currentData: CurrentWeather = {
        temp: Math.round(currentJson.main.temp),
        feelsLike: Math.round(currentJson.main.feels_like),
        condition: currentJson.weather[0]?.description || "Sin datos",
        icon: mapWeatherToIcon(currentJson.weather[0]?.main),
        windKmh: Math.round(currentJson.wind.speed * 3.6),
        windDir: degreesToDirection(currentJson.wind.deg),
        humidity: currentJson.main.humidity,
      };

      setTodayWeather(currentData);
      setDisplayWeather(currentData);

      // ---- Pronóstico 5 días / 3h ----
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=es`
      );
      const forecastJson = await forecastRes.json();

      if (forecastJson.cod !== "200") {
        throw new Error(
          forecastJson.message || "Error obteniendo pronóstico"
        );
      }

      // Mapear por día
      const map: { [date: string]: any[] } = {};
      forecastJson.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toISOString().split("T")[0];
        if (!map[dayKey]) map[dayKey] = [];
        map[dayKey].push(item);
      });
      setDailyMap(map);

      // Próximos días para tarjetas
      const days: DayForecast[] = Object.keys(map)
        .slice(0, 4)
        .map((dateStr, index) => {
          const items = map[dateStr];
          const temps = items.map((i) => i.main.temp);
          const min = Math.round(Math.min(...temps));
          const max = Math.round(Math.max(...temps));

          const midItem = items[Math.floor(items.length / 2)];
          const weatherMain = midItem.weather[0]?.main;
          const icon = mapWeatherToIcon(weatherMain);

          let note = "Condiciones normales";
          if (weatherMain === "Rain") note = "Probables lluvias";
          if (weatherMain === "Clear") note = "Día despejado, ideal";
          if (weatherMain === "Clouds") note = "Parcialmente nublado";

          const labelDay =
            index === 0
              ? "Hoy"
              : index === 1
              ? "Mañana"
              : dateToShortDay(dateStr);

          return {
            day: labelDay,
            dateKey: dateStr,
            min,
            max,
            icon,
            note,
          };
        });

      setNextDays(days);

      const todayList = map[todayKeyComputed] ?? forecastJson.list;

      const bestToday = buildBestHoursFromList(todayList);
      setBestHours(bestToday);
      setSelectedHour(bestToday[0] ?? null);

      setWindTimeline(buildWindTimelineFromList(todayList));

      // Mareas HOY
      try {
        const todayTides = await fetchTidesForDay(lat, lon, todayKeyComputed);
        setTides(todayTides);
        setTodayTideReference(buildTideReference(todayTides));
      } catch (e) {
        console.error("Error obteniendo mareas de hoy", e);
        setTides([]);
      }

      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error cargando el clima");
      setLoading(false);
    }
  };

  // --------- Carga inicial (Montevideo por defecto) ---------
  useEffect(() => {
    loadWeather(DEFAULT_LAT, DEFAULT_LON, "Montevideo - Rambla");
  }, []);

  // --------- Cambiar de día en "Próximos días" ---------
  const handleSelectDay = async (day: DayForecast) => {
    if (!dailyMap || !dailyMap[day.dateKey]) return;
    setSelectedDayKey(day.dateKey);
    setMoonPhase(getMoonPhaseInfo(day.dateKey));

    const items = dailyMap[day.dateKey];

    // Si es hoy y tenemos clima actual
    if (day.dateKey === todayKey && todayWeather) {
      setDisplayWeather(todayWeather);

      const best = buildBestHoursFromList(items);
      setBestHours(best);
      setSelectedHour(best[0] ?? null);

      setWindTimeline(buildWindTimelineFromList(items));
      try {
        const realTides = await fetchTidesForDay(
          coords.lat,
          coords.lon,
          day.dateKey
        );
        setTides(realTides);
      } catch (e) {
        console.error("Error obteniendo mareas", e);
        setTides([]);
      }
      return;
    }

    // Día futuro: punto representativo (aprox. mediodía)
    const midItem = items[Math.floor(items.length / 2)];
    const newWeather: CurrentWeather = {
      temp: Math.round(midItem.main.temp),
      feelsLike: Math.round(
        midItem.main.feels_like ?? midItem.main.temp
      ),
      condition: midItem.weather[0]?.description || "Sin datos",
      icon: mapWeatherToIcon(midItem.weather[0]?.main),
      windKmh: Math.round(midItem.wind.speed * 3.6),
      windDir: degreesToDirection(midItem.wind.deg),
      humidity: midItem.main.humidity,
    };

    setDisplayWeather(newWeather);

    const best = buildBestHoursFromList(items);
    setBestHours(best);
    setSelectedHour(best[0] ?? null);

    setWindTimeline(buildWindTimelineFromList(items));

    try {
      const realTides = await fetchTidesForDay(
        coords.lat,
        coords.lon,
        day.dateKey
      );
      setTides(realTides);
    } catch (e) {
      console.error("Error obteniendo mareas", e);
      setTides([]);
    }
  };

  // --------- Botón "usar mi ubicación" ---------
  const handleUseMyLocation = async () => {
    try {
      setDetectingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("No se otorgaron permisos para usar tu ubicación.");
        setDetectingLocation(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;

      await loadWeather(lat, lon, "Ubicación actual");
    } catch (err) {
      console.error(err);
      setError("No se pudo obtener tu ubicación.");
    } finally {
      setDetectingLocation(false);
    }
  };

  // --------- Render ---------
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.centerText}>Cargando clima…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !displayWeather) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Ionicons name="warning-outline" size={32} color={PALETTE.accent} />
          <Text style={styles.centerText}>
            {error || "No se pudo cargar el clima."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Detalle interactivo de la hora seleccionada
  const nearestWind = selectedHour
    ? getNearestWind(selectedHour.hour, windTimeline)
    : null;
  const nearestTide = selectedHour
    ? getNearestTide(selectedHour.hour, tides)
    : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Pesquero actual / ubicación */}
        <View style={styles.header}>
          <View>
            <Text style={styles.locationLabel}>Pesquero actual</Text>
            <Text style={styles.locationName}>{currentSpot}</Text>
          </View>
          <TouchableOpacity
            style={styles.headerIconWrapper}
            onPress={handleUseMyLocation}
            activeOpacity={0.7}
          >
            <Ionicons
              name={detectingLocation ? "locate-outline" : "location-outline"}
              size={22}
              color={PALETTE.accent}
            />
          </TouchableOpacity>
        </View>

        {/* Clima seleccionado */}
        <View style={styles.cardMain}>
          <View style={styles.badgeNow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={PALETTE.badgeText}
            />
            <Text style={styles.badgeText}>
              {selectedDayKey === todayKey ? "Ahora" : "Día seleccionado"}
            </Text>
          </View>
          <View style={styles.currentRow}>
            <View style={styles.currentLeft}>
              <Text style={styles.currentTemp}>{displayWeather.temp}°</Text>
              <Text style={styles.currentCondition}>
                {capitalizar(displayWeather.condition)}
              </Text>
              <Text style={styles.currentFeels}>
                Sensación {displayWeather.feelsLike}°
              </Text>
            </View>
            <View style={styles.currentRight}>
              <Ionicons
                name={displayWeather.icon as any}
                size={78}
                color={PALETTE.accentSoft}
              />
            </View>
          </View>

          <View style={styles.currentBottomRow}>
            <View style={styles.currentInfoRow}>
              <Ionicons
                name="leaf-outline"
                size={16}
                color={PALETTE.iconMuted}
              />
              <Text style={styles.smallText}>
                Viento: {displayWeather.windKmh} km/h ({displayWeather.windDir})
              </Text>
            </View>
            <View style={styles.currentInfoRow}>
              <Ionicons
                name="water-outline"
                size={16}
                color={PALETTE.iconMuted}
              />
              <Text style={styles.smallText}>
                Humedad: {displayWeather.humidity}%
              </Text>
            </View>
          </View>
        </View>

        {/* Mejores horas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mejores horas para pescar</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hoursRow}
          >
            {bestHours.map((slot, index) => {
              const isSelected =
                selectedHour && selectedHour.hour === slot.hour;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.hourChip,
                    isSelected && styles.hourChipSelected,
                  ]}
                  onPress={() => setSelectedHour(slot)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.hourTime,
                      isSelected && styles.hourTimeSelected,
                    ]}
                  >
                    {slot.hour}
                  </Text>
                  <Text
                    style={[
                      styles.hourLabel,
                      isSelected && styles.hourLabelSelected,
                    ]}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Detalle interactivo de la hora seleccionada */}
          {selectedHour && (
            <View style={styles.hourDetailCard}>
              <View style={styles.hourDetailHeader}>
                <Ionicons
                  name="fish-outline"
                  size={18}
                  color={PALETTE.accent}
                />
                <Text style={styles.hourDetailTitle}>
                  {selectedHour.hour} · {selectedHour.label}
                </Text>
              </View>

              {nearestWind && (
                <View style={styles.hourDetailRow}>
                  <Ionicons
                    name="leaf-outline"
                    size={16}
                    color={PALETTE.iconMuted}
                  />
                  <Text style={styles.hourDetailText}>
                    Viento aprox: {nearestWind.speed} km/h (
                    {nearestWind.direction})
                  </Text>
                </View>
              )}

              {nearestTide && (
                <View style={styles.hourDetailRow}>
                  <Ionicons
                    name="water-outline"
                    size={16}
                    color={PALETTE.iconMuted}
                  />
                  <Text style={styles.hourDetailText}>
                    Marea cercana: {nearestTide.type}{" "}
                    {nearestTide.height.toFixed(2)} m · {nearestTide.time} hs
                  </Text>
                </View>
              )}

              {!nearestWind && !nearestTide && (
                <Text style={styles.hourDetailTextMuted}>
                  Sin datos adicionales para este horario.
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Viento */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Viento (km/h)</Text>
            <View style={styles.sectionTag}>
              <Ionicons
                name="navigate-outline"
                size={13}
                color={PALETTE.badgeText}
              />
              <Text style={styles.sectionTagText}>Dirección y fuerza</Text>
            </View>
          </View>
          <View style={styles.windCard}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.windRow}
            >
              {windTimeline.map((w, index) => (
                <View key={index} style={styles.windPoint}>
                  <Text style={styles.windTime}>{w.time}</Text>
                  <View style={styles.windSpeedRow}>
                    <Ionicons
                      name="arrow-up-outline"
                      size={14}
                      style={styles.windArrow}
                    />
                    <Text style={styles.windSpeed}>{w.speed}</Text>
                  </View>
                  <Text style={styles.windDir}>{w.direction}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Mareas */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              Mareas{" "}
              {selectedDayKey ? `· ${formatDateNice(selectedDayKey)}` : ""}
            </Text>
            <View style={styles.sectionTag}>
              <Ionicons
                name="water-outline"
                size={13}
                color={PALETTE.badgeText}
              />
              <Text style={styles.sectionTagText}>Extremos diarios</Text>
            </View>
          </View>

          {/* Fase lunar */}
          {moonPhase && (
            <View style={styles.moonRow}>
              <Text style={styles.moonEmoji}>{moonPhase.emoji}</Text>
              <Text style={styles.moonText}>
                Fase lunar: {moonPhase.label}
              </Text>
            </View>
          )}

          <View style={styles.tidesCard}>
            {tides.length === 0 ? (
              <Text style={styles.tideNote}>
                No se encontraron datos de marea para este día o superaste el
                límite gratuito de la API.
              </Text>
            ) : (
              <>
                {tides.map((tide, index) => {
                  const ref =
                    todayTideReference &&
                    (tide.type === "Pleamar"
                      ? todayTideReference.high
                      : todayTideReference.low);

                  let diff: number | null = null;
                  if (ref != null) {
                    diff = tide.height - ref;
                  }

                  const hasDiff = diff !== null && Math.abs(diff) >= 0.01;

                  return (
                    <View key={index} style={styles.tideRow}>
                      <View style={styles.tideLeft}>
                        <Text style={styles.tideTime}>{tide.time}</Text>
                        <Text style={styles.tideType}>{tide.type}</Text>
                      </View>
                      <View style={styles.tideRight}>
                        <Text style={styles.tideHeight}>
                          {tide.height.toFixed(2)} m
                        </Text>
                        {hasDiff && (
                          <View style={styles.tideDiffRow}>
                            <Ionicons
                              name={
                                diff! > 0
                                  ? "arrow-up-outline"
                                  : "arrow-down-outline"
                              }
                              size={14}
                              color={diff! > 0 ? "#20A020" : "#C0392B"}
                            />
                            <Text
                              style={[
                                styles.tideDiffText,
                                diff! > 0
                                  ? styles.tideDiffUp
                                  : styles.tideDiffDown,
                              ]}
                            >
                              {diff! > 0 ? "+" : ""}
                              {(diff! * 100).toFixed(0)} cm vs hoy
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
                <Text style={styles.tideNote}>
                  Datos de marea provistos por WorldTides. Comparación vs HOY
                  para ver rápidamente si está más alta o más baja.
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Próximos días */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos días</Text>
          <View style={styles.daysContainer}>
            {nextDays.map((d) => {
              const isSelected = d.dateKey === selectedDayKey;
              return (
                <TouchableOpacity
                  key={d.dateKey}
                  style={[
                    styles.dayCard,
                    isSelected && styles.dayCardSelected,
                  ]}
                  onPress={() => handleSelectDay(d)}
                  activeOpacity={0.9}
                >
                  <View style={styles.dayHeader}>
                    <Text
                      style={[
                        styles.dayName,
                        isSelected && styles.dayNameSelected,
                      ]}
                    >
                      {d.day}
                    </Text>
                    <Ionicons
                      name={d.icon as any}
                      size={22}
                      color={isSelected ? "#ffffff" : PALETTE.accentSoft}
                    />
                  </View>
                  <Text
                    style={[
                      styles.dayTemps,
                      isSelected && styles.dayTempsSelected,
                    ]}
                  >
                    {d.min}° / {d.max}°
                  </Text>
                  <Text
                    style={[
                      styles.dayNote,
                      isSelected && styles.dayNoteSelected,
                    ]}
                  >
                    {d.note}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeatherScreen;

/* ---------- Helpers ---------- */

function degreesToDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const index = Math.round(deg / 45) % 8;
  return dirs[index];
}

function mapWeatherToIcon(main: string): string {
  switch (main) {
    case "Thunderstorm":
    case "Drizzle":
    case "Rain":
      return "rainy-outline";
    case "Snow":
      return "snow-outline";
    case "Clear":
      return "sunny-outline";
    case "Clouds":
      return "cloud-outline";
    default:
      return "partly-sunny-outline";
  }
}

function dateToShortDay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-UY", { weekday: "short" });
}

function formatDateNice(dateKey: string): string {
  const d = new Date(dateKey + "T00:00:00");
  return d.toLocaleDateString("es-UY", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function capitalizar(texto: string): string {
  if (!texto) return texto;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function buildBestHoursFromList(list: any[]): BestHour[] {
  return list.slice(0, 5).map((item: any) => {
    const date = new Date(item.dt * 1000);
    const hourString = date.toLocaleTimeString("es-UY", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const wind = Math.round(item.wind.speed * 3.6);
    const clouds = item.clouds.all;
    let label = "Condición estable";

    if (hourString >= "05:00" && hourString <= "08:30") {
      label = "Amanecer, posible buen pique";
    } else if (hourString >= "18:00" && hourString <= "21:00") {
      label = "Atardecer, ideal para costa";
    }

    if (wind > 30) {
      label = "Viento fuerte, pescar con cuidado";
    } else if (wind < 10 && clouds < 50) {
      label = "Condiciones muy buenas";
    }

    return {
      hour: hourString,
      label,
    };
  });
}

function buildWindTimelineFromList(list: any[]): WindPoint[] {
  return list.slice(0, 8).map((item: any) => {
    const date = new Date(item.dt * 1000);
    const time = date.toLocaleTimeString("es-UY", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const speed = Math.round(item.wind.speed * 3.6);
    const direction = degreesToDirection(item.wind.deg);
    return { time, speed, direction };
  });
}

/**
 * Mareas reales desde WorldTides para un día concreto.
 */
async function fetchTidesForDay(
  lat: number,
  lon: number,
  dateKey: string
): Promise<TideEvent[]> {
  if (!TIDE_API_KEY) {
    console.warn("No hay API key de WorldTides configurada");
    return [];
  }

  const url = `https://www.worldtides.info/api/v3?extremes&lat=${lat}&lon=${lon}&date=${dateKey}&days=1&localtime=1&key=${TIDE_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`WorldTides error HTTP ${res.status}`);
  }

  const json = await res.json();

  if (json.status && json.status !== 200) {
    throw new Error(json.error || "Error en respuesta de WorldTides");
  }

  const extremes = json.extremes || [];
  return extremes.map((t: any) => {
    const dateStr: string = t.date;
    const d = dateStr ? new Date(dateStr) : new Date((t.dt || 0) * 1000);

    const time = d.toLocaleTimeString("es-UY", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const type: "Pleamar" | "Bajamar" =
      t.type === "High" ? "Pleamar" : "Bajamar";

    const heightMeters = typeof t.height === "number" ? t.height : 0;

    return {
      time,
      type,
      height: heightMeters,
    };
  });
}

/**
 * Referencia de HOY: pleamar más alta y bajamar más baja.
 */
function buildTideReference(tides: TideEvent[]): TideReference {
  let high: number | undefined;
  let low: number | undefined;

  tides.forEach((t) => {
    if (t.type === "Pleamar") {
      high = high === undefined ? t.height : Math.max(high, t.height);
    } else {
      low = low === undefined ? t.height : Math.min(low, t.height);
    }
  });

  return { high, low };
}

// Helpers para detalle de hora
function parseTimeToMinutes(time: string): number {
  const parts = time.split(":");
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

function getNearestWind(
  time: string,
  timeline: WindPoint[]
): WindPoint | null {
  if (!timeline.length) return null;
  const target = parseTimeToMinutes(time);
  let best: WindPoint | null = null;
  let bestDiff = Infinity;
  for (const w of timeline) {
    const diff = Math.abs(parseTimeToMinutes(w.time) - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = w;
    }
  }
  return best;
}

function getNearestTide(
  time: string,
  tides: TideEvent[]
): TideEvent | null {
  if (!tides.length) return null;
  const target = parseTimeToMinutes(time);
  let best: TideEvent | null = null;
  let bestDiff = Infinity;
  for (const t of tides) {
    const diff = Math.abs(parseTimeToMinutes(t.time) - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = t;
    }
  }
  return best;
}

/**
 * Fase lunar aproximada para pesca, según la fecha.
 */
function getMoonPhaseInfo(dateKey: string): MoonPhaseInfo {
  const d = new Date(dateKey + "T12:00:00Z"); // mediodía UTC para evitar líos de zona
  const synodicMonth = 29.53058867; // días

  // Fecha base conocida de luna nueva aproximada: 2000-01-06
  const base = new Date("2000-01-06T18:14:00Z").getTime();
  const daysSinceBase = (d.getTime() - base) / (1000 * 60 * 60 * 24);

  const phase = daysSinceBase / synodicMonth;
  const frac = phase - Math.floor(phase); // 0..1

  if (frac < 0.03 || frac > 0.97) {
    return { label: "Luna nueva", emoji: "🌑" };
  } else if (frac < 0.22) {
    return { label: "Luna creciente", emoji: "🌒" };
  } else if (frac < 0.28) {
    return { label: "Cuarto creciente", emoji: "🌓" };
  } else if (frac < 0.47) {
    return { label: "Gibosa creciente", emoji: "🌔" };
  } else if (frac < 0.53) {
    return { label: "Luna llena", emoji: "🌕" };
  } else if (frac < 0.72) {
    return { label: "Gibosa menguante", emoji: "🌖" };
  } else if (frac < 0.78) {
    return { label: "Cuarto menguante", emoji: "🌗" };
  } else {
    return { label: "Luna menguante", emoji: "🌘" };
  }
}

/* ---------- Paleta & estilos ---------- */

const PALETTE = {
  background: "#E7F1FF",
  cardMain: "#FFFFFF",
  cardMainBorder: "#C6DCFF",
  accent: "#0B63CE",
  accentSoft: "#4C9BFF",
  badgeBg: "#E1ECFF",
  badgeText: "#1452A3",
  textPrimary: "#102A43",
  textSecondary: "#4A5568",
  textMuted: "#718096",
  chipBg: "#DDE9FF",
  chipText: "#12355B",
  chipSubText: "#54657F",
  dayCardBg: "#FFFFFF",
  dayCardBorder: "#D1E2FF",
  iconMuted: "#718096",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: PALETTE.background,
  },
  centerText: {
    marginTop: 8,
    fontSize: 14,
    color: PALETTE.textSecondary,
    textAlign: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  locationLabel: {
    fontSize: 12,
    color: PALETTE.textMuted,
  },
  locationName: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "600",
    color: PALETTE.textPrimary,
  },
  headerIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PALETTE.cardMainBorder,
    backgroundColor: "#ffffffaa",
    justifyContent: "center",
    alignItems: "center",
  },

  cardMain: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: PALETTE.cardMain,
    borderWidth: 1,
    borderColor: PALETTE.cardMainBorder,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  badgeNow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: PALETTE.badgeBg,
    marginBottom: 10,
  },
  badgeText: {
    marginLeft: 4,
    fontSize: 11,
    color: PALETTE.badgeText,
    fontWeight: "600",
  },
  currentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentLeft: {
    flex: 1.1,
    justifyContent: "center",
  },
  currentRight: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  currentTemp: {
    fontSize: 50,
    fontWeight: "700",
    color: PALETTE.textPrimary,
  },
  currentCondition: {
    fontSize: 16,
    marginTop: 4,
    color: PALETTE.textSecondary,
  },
  currentFeels: {
    fontSize: 13,
    marginTop: 4,
    color: PALETTE.textMuted,
  },
  currentBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  currentInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  smallText: {
    fontSize: 12,
    color: PALETTE.textSecondary,
  },

  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: PALETTE.textPrimary,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: PALETTE.badgeBg,
  },
  sectionTagText: {
    marginLeft: 4,
    fontSize: 11,
    color: PALETTE.badgeText,
  },

  hoursRow: {
    paddingRight: 8,
  },
  hourChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: PALETTE.chipBg,
    marginRight: 10,
    minWidth: 130,
    justifyContent: "center",
  },
  hourChipSelected: {
    backgroundColor: PALETTE.accent,
  },
  hourTime: {
    fontSize: 15,
    fontWeight: "600",
    color: PALETTE.chipText,
  },
  hourTimeSelected: {
    color: "#ffffff",
  },
  hourLabel: {
    fontSize: 12,
    color: PALETTE.chipSubText,
    marginTop: 2,
  },
  hourLabelSelected: {
    color: "#e6f0ff",
  },

  hourDetailCard: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "#f5f8ff",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  hourDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  hourDetailTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: PALETTE.textPrimary,
  },
  hourDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  hourDetailText: {
    fontSize: 12,
    color: PALETTE.textSecondary,
  },
  hourDetailTextMuted: {
    marginTop: 4,
    fontSize: 12,
    color: PALETTE.textMuted,
  },

  windCard: {
    borderRadius: 18,
    backgroundColor: "#f5f8ff",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  windRow: {
    paddingRight: 8,
  },
  windPoint: {
    width: 70,
    marginRight: 10,
    alignItems: "center",
  },
  windTime: {
    fontSize: 11,
    color: PALETTE.textMuted,
    marginBottom: 4,
  },
  windSpeedRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  windArrow: {
    transform: [{ rotate: "0deg" }],
    marginRight: 2,
    color: PALETTE.accentSoft,
  },
  windSpeed: {
    fontSize: 16,
    fontWeight: "600",
    color: PALETTE.textPrimary,
  },
  windDir: {
    marginTop: 2,
    fontSize: 11,
    color: PALETTE.textSecondary,
  },

  // Luna
  moonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  moonEmoji: {
    fontSize: 18,
  },
  moonText: {
    fontSize: 13,
    color: PALETTE.textSecondary,
  },

  tidesCard: {
    borderRadius: 18,
    backgroundColor: "#f8fbff",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tideRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e2edf9",
  },
  tideLeft: {
    flexDirection: "column",
  },
  tideRight: {
    alignItems: "flex-end",
  },
  tideTime: {
    fontSize: 13,
    color: PALETTE.textPrimary,
    fontWeight: "600",
  },
  tideType: {
    fontSize: 12,
    color: PALETTE.textSecondary,
  },
  tideHeight: {
    fontSize: 13,
    color: PALETTE.accent,
    fontWeight: "600",
  },
  tideDiffRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
  tideDiffText: {
    fontSize: 11,
  },
  tideDiffUp: {
    color: "#20A020",
  },
  tideDiffDown: {
    color: "#C0392B",
  },
  tideNote: {
    marginTop: 8,
    fontSize: 11,
    color: PALETTE.textMuted,
  },

  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  dayCard: {
    width: "48%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: PALETTE.dayCardBg,
    borderWidth: 1,
    borderColor: PALETTE.dayCardBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dayCardSelected: {
    backgroundColor: PALETTE.accent,
    borderColor: PALETTE.accent,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayName: {
    fontSize: 14,
    fontWeight: "600",
    color: PALETTE.textPrimary,
  },
  dayNameSelected: {
    color: "#ffffff",
  },
  dayTemps: {
    marginTop: 4,
    fontSize: 14,
    color: PALETTE.textSecondary,
  },
  dayTempsSelected: {
    color: "#ffffff",
  },
  dayNote: {
    marginTop: 4,
    fontSize: 12,
    color: PALETTE.textMuted,
  },
  dayNoteSelected: {
    color: "#f0f4ff",
  },
});
