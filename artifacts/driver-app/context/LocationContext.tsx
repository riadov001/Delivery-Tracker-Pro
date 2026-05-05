import * as Location from "expo-location";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";

interface Coords {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: Coords | null;
  hasPermission: boolean;
  requestPermission: () => Promise<void>;
}

const DEFAULT_LOCATION: Coords = { latitude: 51.5074, longitude: -0.1278 };

const LocationContext = createContext<LocationContextType>({
  location: DEFAULT_LOCATION,
  hasPermission: false,
  requestPermission: async () => {},
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Coords | null>(DEFAULT_LOCATION);
  const [hasPermission, setHasPermission] = useState(false);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const startWatching = useCallback(async () => {
    if (Platform.OS === "web") {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        });
      }
      return;
    }
    if (watchRef.current) return;
    try {
      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        }
      );
    } catch {}
  }, []);

  const requestPermission = useCallback(async () => {
    if (Platform.OS === "web") {
      setHasPermission(true);
      await startWatching();
      return;
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      setHasPermission(true);
      await startWatching();
    }
  }, [startWatching]);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "web") {
        setHasPermission(true);
        return;
      }
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
        await startWatching();
      }
    })();
    return () => {
      watchRef.current?.remove();
    };
  }, [startWatching]);

  return (
    <LocationContext.Provider value={{ location, hasPermission, requestPermission }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
