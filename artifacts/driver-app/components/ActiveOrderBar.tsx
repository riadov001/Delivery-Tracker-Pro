import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import type { Order } from "@/context/DriverContext";

interface ActiveOrderBarProps {
  order: Order;
}

const STEP_LABELS: Record<string, string> = {
  accepted: "Head to restaurant",
  picked_up: "Deliver to customer",
};

const STEP_ICONS: Record<string, string> = {
  accepted: "shopping-bag",
  picked_up: "navigation",
};

export function ActiveOrderBar({ order }: ActiveOrderBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/order/${order.id}`);
  };

  const stepLabel = STEP_LABELS[order.status] ?? "View order";
  const stepIcon = (STEP_ICONS[order.status] ?? "package") as keyof typeof Feather.glyphMap;

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: colors.dark,
          bottom: insets.bottom + 90,
          marginHorizontal: 16,
          borderRadius: 18,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}>
        <Feather name={stepIcon} size={16} color="#fff" />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.orderName} numberOfLines={1}>
          {order.restaurantName}
        </Text>
        <Text style={styles.stepLabel}>{stepLabel}</Text>
      </View>
      <TouchableOpacity
        style={[styles.viewBtn, { backgroundColor: colors.primary }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.viewBtnText}>View</Text>
        <Feather name="chevron-right" size={14} color="#fff" />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  textCol: {
    flex: 1,
  },
  orderName: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  stepLabel: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 1,
  },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
});
