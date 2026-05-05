import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WeeklyChart } from "@/components/WeeklyChart";
import { useDriver } from "@/context/DriverContext";
import { useColors } from "@/hooks/useColors";

interface StatCardProps {
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  accent?: boolean;
}

function StatCard({ label, value, icon, accent }: StatCardProps) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: accent ? colors.primary : colors.card,
          borderColor: accent ? colors.primary : colors.border,
        },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: accent ? "rgba(255,255,255,0.2)" : colors.secondary }]}>
        <Feather name={icon} size={16} color={accent ? "#fff" : colors.primary} />
      </View>
      <Text style={[styles.statValue, { color: accent ? "#fff" : colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: accent ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

export default function EarningsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { weeklyEarnings, todayEarnings, todayDeliveries, orderHistory } = useDriver();

  const weekTotal = weeklyEarnings.reduce((acc, e) => acc + e.amount, 0);
  const weekDeliveries = weeklyEarnings.reduce((acc, e) => acc + e.deliveries, 0);
  const todayTips = orderHistory
    .filter((o) => o.completedAt && new Date(o.completedAt).toDateString() === new Date().toDateString())
    .reduce((acc, o) => acc + o.tip, 0);

  const paddingBottom = Platform.OS === "web" ? 34 + 84 : insets.bottom + 84;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Earnings</Text>
      </View>

      <View style={[styles.heroCard, { backgroundColor: colors.dark }]}>
        <Text style={styles.heroLabel}>Today's earnings</Text>
        <Text style={styles.heroAmount}>£{todayEarnings.toFixed(2)}</Text>
        <View style={styles.heroRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{todayDeliveries}</Text>
            <Text style={styles.heroStatLabel}>Deliveries</Text>
          </View>
          <View style={[styles.heroStatDivider, { backgroundColor: "rgba(255,255,255,0.1)" }]} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>£{todayTips.toFixed(2)}</Text>
            <Text style={styles.heroStatLabel}>Tips</Text>
          </View>
          <View style={[styles.heroStatDivider, { backgroundColor: "rgba(255,255,255,0.1)" }]} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>
              {todayDeliveries > 0 ? `£${(todayEarnings / todayDeliveries).toFixed(2)}` : "—"}
            </Text>
            <Text style={styles.heroStatLabel}>Per delivery</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>This week</Text>
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <WeeklyChart data={weeklyEarnings} />
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Week total" value={`£${weekTotal.toFixed(0)}`} icon="trending-up" accent />
          <StatCard label="Deliveries" value={`${weekDeliveries}`} icon="package" />
          <StatCard
            label="Avg/delivery"
            value={weekDeliveries > 0 ? `£${(weekTotal / weekDeliveries).toFixed(2)}` : "—"}
            icon="bar-chart-2"
          />
          <StatCard
            label="Best day"
            value={`£${Math.max(...weeklyEarnings.map((e) => e.amount)).toFixed(0)}`}
            icon="star"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Breakdown</Text>
        <View style={[styles.breakdownCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <BreakdownRow label="Base pay" value={`£${(weekTotal * 0.82).toFixed(2)}`} colors={colors} />
          <View style={[styles.breakdownDivider, { backgroundColor: colors.border }]} />
          <BreakdownRow label="Tips" value={`£${(weekTotal * 0.12).toFixed(2)}`} colors={colors} />
          <View style={[styles.breakdownDivider, { backgroundColor: colors.border }]} />
          <BreakdownRow label="Bonuses" value={`£${(weekTotal * 0.06).toFixed(2)}`} colors={colors} />
          <View style={[styles.breakdownDivider, { backgroundColor: colors.border }]} />
          <BreakdownRow label="Total" value={`£${weekTotal.toFixed(2)}`} colors={colors} bold />
        </View>
      </View>

      <View style={styles.section}>
        <View style={[styles.promoCard, { backgroundColor: colors.secondary, borderColor: colors.primary + "33" }]}>
          <Feather name="zap" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.promoTitle, { color: colors.foreground }]}>
              Weekend boost active
            </Text>
            <Text style={[styles.promoSubtitle, { color: colors.mutedForeground }]}>
              Earn 1.3x on all deliveries Fri-Sun, 6pm–11pm
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function BreakdownRow({
  label,
  value,
  bold,
  colors,
}: {
  label: string;
  value: string;
  bold?: boolean;
  colors: Record<string, string>;
}) {
  return (
    <View style={styles.breakdownRow}>
      <Text
        style={[
          styles.breakdownLabel,
          { color: bold ? colors.foreground : colors.mutedForeground },
          bold && { fontFamily: "Inter_600SemiBold" },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.breakdownValue,
          { color: bold ? colors.primary : colors.foreground },
          bold && { fontFamily: "Inter_700Bold", fontSize: 16 },
        ]}
      >
        {value}
      </Text>
    </View>
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
  heroCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.6)",
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginBottom: 6,
  },
  heroAmount: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 44,
    letterSpacing: -1,
    marginBottom: 20,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
  },
  heroStatValue: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    marginBottom: 2,
  },
  heroStatLabel: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  heroStatDivider: {
    width: 1,
    height: 32,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: "47%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  breakdownCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  breakdownDivider: {
    height: 1,
  },
  breakdownLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  breakdownValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  promoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  promoTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    marginBottom: 3,
  },
  promoSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
});
