import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OrderCard } from "@/components/OrderCard";
import { useDriver } from "@/context/DriverContext";
import { useColors } from "@/hooks/useColors";
import type { Order } from "@/context/DriverContext";

export default function OrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isOnline, availableOrders, orderHistory, currentOrder, acceptOrder, declineOrder } = useDriver();
  const [tab, setTab] = useState<"available" | "history">("available");

  const handleAccept = (order: Order) => {
    acceptOrder(order);
  };

  const handleDecline = (orderId: string) => {
    declineOrder(orderId);
  };

  const paddingBottom = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Orders</Text>
        <View style={[styles.tabRow, { backgroundColor: colors.muted }]}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === "available" && { backgroundColor: colors.card }]}
            onPress={() => setTab("available")}
          >
            <Text
              style={[
                styles.tabText,
                { color: tab === "available" ? colors.primary : colors.mutedForeground },
              ]}
            >
              Available
            </Text>
            {availableOrders.length > 0 && tab !== "available" && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{availableOrders.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === "history" && { backgroundColor: colors.card }]}
            onPress={() => setTab("history")}
          >
            <Text
              style={[
                styles.tabText,
                { color: tab === "history" ? colors.primary : colors.mutedForeground },
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {tab === "available" ? (
        <ScrollView
          contentContainerStyle={[styles.list, { paddingBottom }]}
          showsVerticalScrollIndicator={false}
        >
          {currentOrder && (
            <View style={[styles.activeOrderNote, { backgroundColor: colors.secondary, borderColor: colors.primary + "44" }]}>
              <Feather name="zap" size={14} color={colors.primary} />
              <Text style={[styles.activeOrderNoteText, { color: colors.secondaryForeground }]}>
                Active delivery in progress — complete it to receive new orders
              </Text>
            </View>
          )}
          {!isOnline && !currentOrder && (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
                <Feather name="wifi-off" size={28} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>You're offline</Text>
              <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
                Go online from the map to start receiving orders
              </Text>
            </View>
          )}
          {isOnline && availableOrders.length === 0 && !currentOrder && (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
                <Feather name="clock" size={28} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Waiting for orders</Text>
              <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
                New orders will appear here automatically
              </Text>
            </View>
          )}
          {availableOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={() => handleAccept(order)}
              onDecline={() => handleDecline(order.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <FlatList
          data={orderHistory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.muted }]}>
                <Feather name="package" size={28} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No deliveries yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
                Your completed deliveries will appear here
              </Text>
            </View>
          }
          renderItem={({ item }) => <OrderCard order={item} isHistory />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 14,
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  tabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
  list: {
    padding: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
  activeOrderNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  activeOrderNoteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 20,
  },
});
