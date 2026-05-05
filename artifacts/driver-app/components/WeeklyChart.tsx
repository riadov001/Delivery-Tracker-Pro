import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface EarningEntry {
  day: string;
  amount: number;
  deliveries: number;
}

interface WeeklyChartProps {
  data: EarningEntry[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const colors = useColors();
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const today = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  ];

  return (
    <View style={styles.container}>
      {data.map((entry) => {
        const isToday = entry.day === today;
        const heightPct = (entry.amount / maxAmount) * 100;
        return (
          <View key={entry.day} style={styles.barWrapper}>
            <Text style={[styles.amount, { color: colors.mutedForeground }]}>
              £{Math.round(entry.amount)}
            </Text>
            <View style={[styles.barTrack, { backgroundColor: colors.muted }]}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: `${Math.max(heightPct, 4)}%`,
                    backgroundColor: isToday ? colors.primary : colors.secondary,
                    borderWidth: isToday ? 0 : 0,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.dayLabel,
                {
                  color: isToday ? colors.primary : colors.mutedForeground,
                  fontFamily: isToday ? "Inter_700Bold" : "Inter_400Regular",
                },
              ]}
            >
              {entry.day}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 140,
    paddingBottom: 24,
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  amount: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
  },
  barTrack: {
    width: 22,
    height: 80,
    borderRadius: 6,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 11,
    textAlign: "center",
  },
});
