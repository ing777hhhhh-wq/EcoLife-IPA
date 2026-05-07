import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChallengeCard } from "@/components/ChallengeCard";
import { BADGES, CHALLENGES, ECO_FACTS } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 10,
  color,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference * Math.min(progress, 1);
  const empty = circumference - filled;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color + "33",
          position: "absolute",
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          position: "absolute",
          opacity: filled > 0 ? 1 : 0,
          transform: [{ rotate: "-90deg" }],
          borderTopColor: filled > circumference * 0.25 ? color : "transparent",
          borderRightColor:
            filled > circumference * 0.5 ? color : "transparent",
          borderBottomColor:
            filled > circumference * 0.75 ? color : "transparent",
          borderLeftColor: filled > 0 ? color : "transparent",
        }}
      />
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { totalPoints, streak, completedChallenges } = useApp();
  const { user } = useAuth();

  const todayChallenges = useMemo(
    () => CHALLENGES.filter((c) => c.frequency === "daily").slice(0, 3),
    []
  );

  const today = new Date().toISOString().split("T")[0];
  const completedToday = Object.values(completedChallenges).filter(
    (d) => d === today
  ).length;

  const todayTotal = todayChallenges.length;
  const progress = todayTotal > 0 ? completedToday / todayTotal : 0;

  const nextBadge = BADGES.find((b) => b.pointsRequired > totalPoints);

  const randomFact = useMemo(
    () => ECO_FACTS[Math.floor(Math.random() * ECO_FACTS.length)],
    []
  );

  const today2 = new Date();
  const dateStr = today2.toLocaleDateString("ar-SA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop:
            Platform.OS === "web"
              ? insets.top + 67
              : insets.top + 16,
          paddingBottom: Platform.OS === "web" ? 34 + 84 : 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            {dateStr}
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            مرحباً {user?.name?.split(" ")[0] ?? "بك"} 🌿
          </Text>
        </View>
        <View
          style={[
            styles.streakBadge,
            { backgroundColor: colors.accent + "22" },
          ]}
        >
          <Feather name="zap" size={16} color={colors.accent} />
          <Text style={[styles.streakText, { color: colors.accent }]}>
            {streak} يوم
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.scoreCard,
          { backgroundColor: colors.primary },
        ]}
      >
        <View style={styles.scoreLeft}>
          <Text style={[styles.scoreLabel, { color: colors.primaryForeground + "CC" }]}>
            نقاطي البيئية
          </Text>
          <Text style={[styles.scoreValue, { color: colors.primaryForeground }]}>
            {totalPoints}
          </Text>
          {nextBadge && (
            <Text style={[styles.nextBadge, { color: colors.primaryForeground + "AA" }]}>
              {nextBadge.pointsRequired - totalPoints} نقطة للوصول إلى "{nextBadge.titleAr}"
            </Text>
          )}
        </View>
        <View style={styles.scoreRight}>
          <View style={styles.ringWrapper}>
            <Text style={[styles.ringLabel, { color: colors.primaryForeground }]}>
              {completedToday}/{todayTotal}
            </Text>
            <Text style={[styles.ringSubLabel, { color: colors.primaryForeground + "AA" }]}>
              اليوم
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="zap" size={20} color={colors.accent} />
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {streak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            أيام متتالية
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="check-circle" size={20} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {Object.keys(completedChallenges).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            مهام مكتملة
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="star" size={20} color={colors.gold} />
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {BADGES.filter((b) => b.pointsRequired <= totalPoints).length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            شارات
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.factCard,
          { backgroundColor: colors.secondary, borderColor: colors.border },
        ]}
      >
        <Feather
          name={randomFact.icon as keyof typeof Feather.glyphMap}
          size={20}
          color={colors.primary}
        />
        <View style={styles.factContent}>
          <Text style={[styles.factLabel, { color: colors.primary }]}>
            هل تعلم؟
          </Text>
          <Text style={[styles.factText, { color: colors.foreground }]}>
            {randomFact.factAr}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => router.push("/games" as any)}
        style={({ pressed }) => [
          styles.gamesBanner,
          { opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}
      >
        <View style={styles.gamesBannerLeft}>
          <Text style={styles.gamesBannerEmoji}>🎮</Text>
          <View>
            <Text style={styles.gamesBannerTitle}>الألعاب البيئية</Text>
            <Text style={styles.gamesBannerSub}>فرز • اختبار • ازرع غابتك</Text>
          </View>
        </View>
        <View style={styles.gamesBannerRight}>
          <Text style={styles.gamesBannerBadge}>بدون نت</Text>
          <Feather name="chevron-left" size={18} color="#fff" style={{ transform: [{ rotate: "180deg" }] }} />
        </View>
      </Pressable>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        مهام اليوم
      </Text>

      {todayChallenges.map((c) => (
        <ChallengeCard key={c.id} challenge={c} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  scoreCard: {
    borderRadius: 20,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  scoreLeft: {
    flex: 1,
    gap: 4,
  },
  scoreLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  scoreValue: {
    fontSize: 44,
    fontFamily: "Inter_700Bold",
    lineHeight: 50,
  },
  nextBadge: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  scoreRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  ringLabel: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  ringSubLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  factCard: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 24,
  },
  factContent: {
    flex: 1,
    gap: 4,
  },
  factLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  factText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  gamesBanner: {
    backgroundColor: "#1B5E20",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gamesBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  gamesBannerEmoji: { fontSize: 32 },
  gamesBannerTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  gamesBannerSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  gamesBannerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gamesBannerBadge: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
