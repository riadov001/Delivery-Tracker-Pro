import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDriver } from "@/context/DriverContext";
import { useColors } from "@/hooks/useColors";

const STEPS = [
  { key: "accepted", label: "Head to restaurant", sub: "Make your way to the pick-up location", icon: "navigation" as const },
  { key: "picked_up", label: "Pick up order", sub: "Confirm the order has been collected", icon: "shopping-bag" as const },
  { key: "delivered", label: "Deliver to customer", sub: "Hand over the order and complete", icon: "home" as const },
];

function StepIndicator({ currentStatus }: { currentStatus: string }) {
  const colors = useColors();
  const stepIndex = STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <View style={styles.stepsContainer}>
      {STEPS.map((step, i) => {
        const isDone = i < stepIndex;
        const isCurrent = i === stepIndex;
        const isPending = i > stepIndex;
        return (
          <View key={step.key} style={styles.stepRow}>
            <View style={styles.stepLeft}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: isDone
                      ? colors.primary
                      : isCurrent
                      ? colors.dark
                      : colors.muted,
                    borderColor: isCurrent ? colors.dark : "transparent",
                    borderWidth: isCurrent ? 2 : 0,
                  },
                ]}
              >
                {isDone ? (
                  <Feather name="check" size={14} color="#fff" />
                ) : (
                  <Feather
                    name={step.icon}
                    size={14}
                    color={isCurrent ? "#fff" : colors.mutedForeground}
                  />
                )}
              </View>
              {i < STEPS.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    { backgroundColor: isDone ? colors.primary : colors.border },
                  ]}
                />
              )}
            </View>
            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: isPending ? colors.mutedForeground : colors.foreground,
                    fontFamily: isCurrent ? "Inter_700Bold" : "Inter_400Regular",
                  },
                ]}
              >
                {step.label}
              </Text>
              {isCurrent && (
                <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
                  {step.sub}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function OrderDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentOrder, advanceOrderStatus } = useDriver();

  const order = currentOrder?.id === id ? currentOrder : null;

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.notFound, { paddingTop: insets.top + 20 }]}>
          <Feather name="package" size={40} color={colors.mutedForeground} />
          <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>
            Order not found or already completed
          </Text>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isAccepted = order.status === "accepted";
  const isPickedUp = order.status === "picked_up";

  const actionLabel = isAccepted ? "Confirm arrived at restaurant" : "Confirm delivered";
  const actionIcon: keyof typeof Feather.glyphMap = isAccepted ? "shopping-bag" : "check-circle";
  const targetAddress = isAccepted ? order.restaurantAddress : order.customerAddress;
  const targetName = isAccepted ? order.restaurantName : order.customerName;

  const handleAction = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (isPickedUp) {
      Alert.alert(
        "Confirm delivery",
        `Confirm order delivered to ${order.customerName}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: () => {
              advanceOrderStatus(order.id);
              setTimeout(() => router.back(), 400);
            },
          },
        ]
      );
    } else {
      advanceOrderStatus(order.id);
    }
  };

  const paddingBottom = Platform.OS === "web" ? 34 + 24 : insets.bottom + 24;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 10 }]}>
        <TouchableOpacity
          style={[styles.backIconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.back()}
        >
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>Active delivery</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.restaurantIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="shopping-bag" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.restaurantName, { color: colors.foreground }]}>
                  {order.restaurantName}
                </Text>
                <Text style={[styles.restaurantAddress, { color: colors.mutedForeground }]}>
                  {order.restaurantAddress}
                </Text>
              </View>
              <View style={[styles.payBadge, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.payAmount, { color: colors.primary }]}>
                  £{(order.payout + order.tip).toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={[styles.itemsTitle, { color: colors.mutedForeground }]}>Order items</Text>
            {order.items.map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <View style={[styles.itemQtyBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.itemQtyText}>{item.quantity}</Text>
                </View>
                <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Delivery progress</Text>
            <StepIndicator currentStatus={order.status} />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {isAccepted ? "Pick up from" : "Deliver to"}
            </Text>
            <View style={styles.destinationRow}>
              <View style={[styles.destIcon, { backgroundColor: colors.muted }]}>
                <Feather name={isAccepted ? "map-pin" : "home"} size={16} color={colors.foreground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.destName, { color: colors.foreground }]}>{targetName}</Text>
                <Text style={[styles.destAddress, { color: colors.mutedForeground }]}>
                  {targetAddress}
                </Text>
              </View>
              <View style={styles.destMeta}>
                <Text style={[styles.destDistance, { color: colors.mutedForeground }]}>
                  {order.distance} km
                </Text>
                <Text style={[styles.destTime, { color: colors.mutedForeground }]}>
                  ~{order.estimatedMinutes} min
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: colors.dark }]}
              activeOpacity={0.8}
            >
              <Feather name="navigation" size={14} color="#fff" />
              <Text style={styles.navBtnText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>

          {order.tip > 0 && (
            <View style={[styles.tipCard, { backgroundColor: "#FFF8EC", borderColor: "#F5A62333" }]}>
              <Feather name="heart" size={16} color="#F5A623" />
              <Text style={[styles.tipText, { color: "#B5791A" }]}>
                Customer left a £{order.tip.toFixed(2)} tip
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.actionArea, { paddingBottom, paddingHorizontal: 16, paddingTop: 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={handleAction}
          activeOpacity={0.85}
        >
          <Feather name={actionIcon} size={18} color="#fff" />
          <Text style={styles.actionBtnText}>{actionLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 0,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  restaurantIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  restaurantName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    marginBottom: 2,
  },
  restaurantAddress: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  payBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  payAmount: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  itemsTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  itemQtyBadge: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  itemQtyText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 11,
  },
  itemName: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    marginBottom: 16,
  },
  stepsContainer: {
    gap: 0,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    minHeight: 52,
  },
  stepLeft: {
    alignItems: "center",
    width: 32,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLine: {
    flex: 1,
    width: 2,
    marginVertical: 3,
    borderRadius: 1,
  },
  stepContent: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 16,
  },
  stepLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  stepSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  destinationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  destIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  destName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    marginBottom: 2,
  },
  destAddress: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  destMeta: {
    alignItems: "flex-end",
  },
  destDistance: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    marginBottom: 2,
  },
  destTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  navBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  actionArea: {
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    borderRadius: 14,
  },
  actionBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  notFoundText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    textAlign: "center",
  },
  backBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
});
