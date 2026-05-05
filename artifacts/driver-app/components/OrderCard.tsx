import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Order } from "@/context/DriverContext";

interface OrderCardProps {
  order: Order;
  onAccept?: () => void;
  onDecline?: () => void;
  isHistory?: boolean;
}

export function OrderCard({
  order,
  onAccept,
  onDecline,
  isHistory = false,
}: OrderCardProps) {
  const colors = useColors();

  const handleAccept = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAccept?.();
  };

  const handleDecline = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecline?.();
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.restaurantBadge, { backgroundColor: colors.secondary }]}>
          <Feather name="shopping-bag" size={14} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.restaurantName, { color: colors.foreground }]}>
            {order.restaurantName}
          </Text>
          <Text style={[styles.address, { color: colors.mutedForeground }]} numberOfLines={1}>
            {order.restaurantAddress}
          </Text>
        </View>
        <View style={styles.payoutContainer}>
          <Text style={[styles.payout, { color: colors.primary }]}>
            £{(order.payout + order.tip).toFixed(2)}
          </Text>
          {order.tip > 0 && (
            <Text style={[styles.tipBadge, { color: colors.accent }]}>
              +£{order.tip.toFixed(2)} tip
            </Text>
          )}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.routeRow}>
        <View style={styles.routeDots}>
          <View style={[styles.dotFilled, { backgroundColor: colors.primary }]} />
          <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
          <View style={[styles.dotOutline, { borderColor: colors.foreground }]} />
        </View>
        <View style={styles.routeAddresses}>
          <Text style={[styles.routeLabel, { color: colors.mutedForeground }]}>Pick up</Text>
          <Text style={[styles.routeText, { color: colors.foreground }]} numberOfLines={1}>
            {order.restaurantAddress}
          </Text>
          <Text style={[styles.routeLabel, { color: colors.mutedForeground }]}>Deliver to</Text>
          <Text style={[styles.routeText, { color: colors.foreground }]} numberOfLines={1}>
            {order.customerAddress}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Feather name="map-pin" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {order.distance} km
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="clock" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            ~{order.estimatedMinutes} min
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="package" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {isHistory ? (
        <View style={[styles.historyBadge, { backgroundColor: colors.secondary }]}>
          <Feather name="check-circle" size={12} color={colors.primary} />
          <Text style={[styles.historyBadgeText, { color: colors.primary }]}>
            Delivered · £{(order.payout + order.tip).toFixed(2)} earned
          </Text>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.declineBtn, { borderColor: colors.border }]}
            onPress={handleDecline}
          >
            <Text style={[styles.declineBtnText, { color: colors.mutedForeground }]}>Decline</Text>
          </Pressable>
          <TouchableOpacity
            style={[styles.acceptBtn, { backgroundColor: colors.primary }]}
            onPress={handleAccept}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptBtnText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  restaurantBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  payoutContainer: {
    alignItems: "flex-end",
  },
  payout: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  tipBadge: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  routeDots: {
    alignItems: "center",
    marginRight: 10,
    paddingTop: 14,
  },
  dotFilled: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeLine: {
    width: 1,
    height: 28,
    marginVertical: 3,
  },
  dotOutline: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  routeAddresses: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  routeText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  declineBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  declineBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  acceptBtn: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  historyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  historyBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
});
