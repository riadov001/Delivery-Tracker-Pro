import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface DriverMapProps {
  latitude: number;
  longitude: number;
  isOnline: boolean;
  hasPermission: boolean;
}

export function DriverMap({ isOnline }: DriverMapProps) {
  const colors = useColors();
  return (
    <View style={[styles.container, { backgroundColor: "#1a2332" }]}>
      <View style={styles.gridOverlay}>
        {Array.from({ length: 16 }).map((_, i) => (
          <View key={i} style={styles.gridCell} />
        ))}
      </View>
      <View style={styles.streets}>
        <View style={[styles.streetH, { top: "30%", backgroundColor: "#2a3a50" }]} />
        <View style={[styles.streetH, { top: "55%", backgroundColor: "#2a3a50" }]} />
        <View style={[styles.streetH, { top: "75%", backgroundColor: "#223044" }]} />
        <View style={[styles.streetV, { left: "25%", backgroundColor: "#2a3a50" }]} />
        <View style={[styles.streetV, { left: "60%", backgroundColor: "#2a3a50" }]} />
        <View style={[styles.streetV, { left: "80%", backgroundColor: "#223044" }]} />
      </View>
      <View style={styles.center}>
        {isOnline && (
          <View style={[styles.pulseRingOuter, { borderColor: colors.primary + "20" }]} />
        )}
        {isOnline && (
          <View style={[styles.pulseRingMid, { borderColor: colors.primary + "40" }]} />
        )}
        <View style={[styles.locationDot, { backgroundColor: colors.primary }]}>
          <View style={styles.locationDotInner} />
        </View>
      </View>
      <Text style={styles.watermark}>London, UK</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridCell: {
    width: "25%",
    height: "25%",
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "rgba(255,255,255,0.03)",
  },
  streets: {
    ...StyleSheet.absoluteFillObject,
  },
  streetH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 8,
    opacity: 0.8,
  },
  streetV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 8,
    opacity: 0.8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRingOuter: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
  },
  pulseRingMid: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1.5,
  },
  locationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  locationDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  watermark: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
    color: "rgba(255,255,255,0.15)",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
});
