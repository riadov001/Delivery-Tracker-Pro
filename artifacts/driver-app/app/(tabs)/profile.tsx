import { Feather } from "@expo/vector-icons";
import React from "react";
import {
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

interface MenuRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  color?: string;
}

function MenuRow({ icon, label, value, color }: MenuRowProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.menuRow, { borderBottomColor: colors.border }]}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: colors.muted }]}>
        <Feather name={icon} size={16} color={color ?? colors.foreground} />
      </View>
      <Text style={[styles.menuLabel, { color: color ?? colors.foreground }]}>{label}</Text>
      <View style={styles.menuRight}>
        {value && (
          <Text style={[styles.menuValue, { color: colors.mutedForeground }]}>{value}</Text>
        )}
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { rating, totalDeliveries, weeklyEarnings } = useDriver();

  const paddingBottom = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;
  const weekTotal = weeklyEarnings.reduce((acc, e) => acc + e.amount, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatarRing, { borderColor: colors.primary }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
        </View>
        <Text style={[styles.driverName, { color: colors.foreground }]}>James Davidson</Text>
        <Text style={[styles.driverId, { color: colors.mutedForeground }]}>Driver ID: #48291</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Feather
              key={star}
              name="star"
              size={16}
              color={star <= Math.round(rating) ? colors.warning : colors.border}
            />
          ))}
          <Text style={[styles.ratingText, { color: colors.foreground }]}>{rating}</Text>
        </View>
        <View style={[styles.badgeRow]}>
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Feather name="award" size={12} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>Top Driver</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Feather name="zap" size={12} color={colors.secondaryForeground} />
            <Text style={[styles.badgeText, { color: colors.secondaryForeground }]}>Fast delivery</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statBoxValue, { color: colors.primary }]}>{totalDeliveries}</Text>
          <Text style={[styles.statBoxLabel, { color: colors.mutedForeground }]}>Total deliveries</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statBoxValue, { color: colors.primary }]}>£{weekTotal.toFixed(0)}</Text>
          <Text style={[styles.statBoxLabel, { color: colors.mutedForeground }]}>This week</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statBoxValue, { color: colors.primary }]}>98%</Text>
          <Text style={[styles.statBoxLabel, { color: colors.mutedForeground }]}>Completion</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Account</Text>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MenuRow icon="user" label="Personal details" />
          <MenuRow icon="truck" label="Vehicle info" value="Honda CB500F" />
          <MenuRow icon="credit-card" label="Payment details" />
          <MenuRow icon="shield" label="Insurance documents" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Preferences</Text>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MenuRow icon="bell" label="Notifications" />
          <MenuRow icon="map-pin" label="Default zone" value="Central London" />
          <MenuRow icon="moon" label="Availability schedule" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Support</Text>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MenuRow icon="help-circle" label="Help centre" />
          <MenuRow icon="message-square" label="Chat with support" />
          <MenuRow icon="file-text" label="Report an issue" />
        </View>
      </View>

      <View style={styles.section}>
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MenuRow icon="log-out" label="Sign out" color={colors.destructive} />
        </View>
      </View>

      <Text style={[styles.version, { color: colors.mutedForeground }]}>Version 2.4.1 · Delivr Driver</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  profileCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  driverName: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    marginBottom: 3,
  },
  driverId: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 12,
  },
  ratingText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    marginLeft: 4,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
  },
  statBoxValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginBottom: 3,
  },
  statBoxLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  version: {
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginBottom: 8,
  },
});
