import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { CATEGORY_COLORS, CATEGORY_LABELS, Tip } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  tip: Tip;
}

const IMPACT_LABELS: Record<string, string> = {
  low: "تأثير منخفض",
  medium: "تأثير متوسط",
  high: "تأثير عالٍ",
};

const IMPACT_COLORS: Record<string, string> = {
  low: "#78909C",
  medium: "#FF8C42",
  high: "#2D7D46",
};

export function TipCard({ tip }: Props) {
  const colors = useColors();
  const { isTipSaved, toggleSavedTip } = useApp();
  const saved = isTipSaved(tip.id);
  const catColor = CATEGORY_COLORS[tip.category] ?? colors.primary;

  async function handleSave() {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await toggleSavedTip(tip.id);
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: catColor + "22" },
          ]}
        >
          <Feather
            name={tip.icon as keyof typeof Feather.glyphMap}
            size={20}
            color={catColor}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {tip.titleAr}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: catColor + "22" }]}>
              <Text style={[styles.badgeText, { color: catColor }]}>
                {CATEGORY_LABELS[tip.category] ?? tip.category}
              </Text>
            </View>
            <Text
              style={[
                styles.impact,
                { color: IMPACT_COLORS[tip.impact] ?? colors.mutedForeground },
              ]}
            >
              {IMPACT_LABELS[tip.impact]}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={handleSave}
          hitSlop={10}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Feather
            name={saved ? "bookmark" : "bookmark"}
            size={20}
            color={saved ? colors.primary : colors.mutedForeground}
          />
        </Pressable>
      </View>
      <Text style={[styles.content, { color: colors.mutedForeground }]}>
        {tip.contentAr}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 10,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  impact: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  content: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
});
