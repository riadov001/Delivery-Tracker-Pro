import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Circle } from "react-native-maps";

interface DriverMapProps {
  latitude: number;
  longitude: number;
  isOnline: boolean;
  hasPermission: boolean;
}

export function DriverMap({ latitude, longitude, isOnline, hasPermission }: DriverMapProps) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      region={{
        latitude,
        longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      }}
      showsUserLocation={hasPermission}
      showsMyLocationButton={false}
      customMapStyle={mapStyleDark}
    >
      {isOnline && (
        <Circle
          center={{ latitude, longitude }}
          radius={600}
          fillColor="rgba(0,204,188,0.12)"
          strokeColor="rgba(0,204,188,0.3)"
          strokeWidth={1}
        />
      )}
    </MapView>
  );
}

const mapStyleDark = [
  { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#255763" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c6675" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
];
