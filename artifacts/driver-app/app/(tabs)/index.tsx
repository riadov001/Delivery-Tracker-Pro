import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActiveOrderBar } from "@/components/ActiveOrderBar";
import { DriverMap } from "@/components/DriverMap";
import { useDriver } from "@/context/DriverContext";
import { useLocation } from "@/context/LocationContext";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isOnline, toggleOnline, currentOrder, availableOrders, todayEarnings, todayDeliveries } = useDriver();
  const { location, hasPermission, requestPermission } = useLocation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    toggleOnline();
    if (!hasPermission) requestPermission();
  };

  const lat = location?.latitude ?? 51.5074;
  const lng = location?.longitude ?? -0.1278;

  const paddingTop = Platform.OS === "web" ? 67 : insets.top + 12;
  const paddingBottom = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  return (
    <View style={styles.container}>
      <DriverMap
        latitude={lat}
        longitude={lng}
        isOnline={isOnline}
        hasPermission={hasPermission}
      />

      <View style={[styles.topBar, { paddingTop, paddingHorizontal: 16 }]}>
        <View style={[styles.statsChip, { backgroundColor: "rgba(255,255,255,0.95)" }]}>
          <Text style={[styles.statsText, { color: colors.foreground }]}>
            £{todayEarnings.toFixed(2)}
          </Text>
          <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
          <Text style={[styles.statsText, { color: colors.foreground }]}>
            {todayDeliveries} drops
          </Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.onlineToggle,
              {
                backgroundColor: isOnline ? colors.primary : "rgba(255,255,255,0.95)",
                borderColor: isOnline ? colors.primary : "rgba(255,255,255,0.6)",
                borderWidth: 1.5,
              },
            ]}
            onPress={handleToggle}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.onlineDot,
                { backgroundColor: isOnline ? "#fff" : colors.destructive },
              ]}
            />
            <Text
              style={[
                styles.onlineText,
                { color: isOnline ? "#fff" : colors.foreground },
              ]}
            >
              {isOnline ? "Online" : "Offline"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {!isOnline && (
        <View style={[styles.floatingBanner, { bottom: paddingBottom + 16 }]}>
          <View style={[styles.bannerInner, { backgroundColor: "rgba(27,27,47,0.9)" }]}>
            <Feather name="moon" size={14} color="rgba(255,255,255,0.6)" />
            <Text style={styles.bannerText}>Tap Online to start receiving orders</Text>
          </View>
        </View>
      )}

      {isOnline && availableOrders.length > 0 && !currentOrder && (
        <View style={[styles.floatingBanner, { bottom: paddingBottom + 16 }]}>
          <View style={[styles.bannerInner, { backgroundColor: colors.primary }]}>
            <Feather name="bell" size={14} color="#fff" />
            <Text style={[styles.bannerText, { color: "#fff" }]}>
              {availableOrders.length} new order{availableOrders.length > 1 ? "s" : ""} — check Orders
            </Text>
          </View>
        </View>
      )}

      {currentOrder && <ActiveOrderBar order={currentOrder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    gap: 10,
  },
  statsText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  statsDivider: {
    width: 1,
    height: 14,
  },
  onlineToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  onlineText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  floatingBanner: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
  },
  bannerInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  bannerText: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
});
