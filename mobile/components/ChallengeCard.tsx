import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CATEGORY_COLORS, CATEGORY_LABELS, Challenge } from "@/constants/data";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

interface Props {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: Props) {
  const colors = useColors();
  const { isChallengeCompleted, completeChallenge, uncompleteChallenge } =
    useApp();
  const completed = isChallengeCompleted(challenge.id);
  const catColor = CATEGORY_COLORS[challenge.category] ?? colors.primary;

  async function handlePress() {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (completed) {
      await uncompleteChallenge(challenge.id, challenge.points);
    } else {
      await completeChallenge(challenge.id, challenge.points);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: completed ? colors.successLight : colors.card,
          borderColor: completed ? colors.primary : colors.border,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: completed ? colors.primary : catColor + "22" },
        ]}
      >
        <Feather
          name={challenge.icon as keyof typeof Feather.glyphMap}
          size={22}
          color={completed ? colors.primaryForeground : catColor}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {challenge.titleAr}
        </Text>
        <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={1}>
          {challenge.descriptionAr}
        </Text>
        <View style={styles.meta}>
          <View style={[styles.badge, { backgroundColor: catColor + "22" }]}>
            <Text style={[styles.badgeText, { color: catColor }]}>
              {CATEGORY_LABELS[challenge.category] ?? challenge.category}
            </Text>
          </View>
          <View style={styles.points}>
            <Feather name="star" size={12} color={colors.gold} />
            <Text style={[styles.pointsText, { color: colors.gold }]}>
              {challenge.points}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.checkCircle,
          {
            backgroundColor: completed ? colors.primary : "transparent",
            borderColor: completed ? colors.primary : colors.border,
          },
        ]}
      >
        {completed && (
          <Feather name="check" size={14} color={colors.primaryForeground} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  desc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
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
  points: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  pointsText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
