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

import { BADGES } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function BadgeItem({
  badge,
  earned,
  totalPoints,
}: {
  badge: (typeof BADGES)[0];
  earned: boolean;
  totalPoints: number;
}) {
  const colors = useColors();
  const progress = Math.min(totalPoints / badge.pointsRequired, 1);
  return (
    <View
      style={[
        styles.badgeCard,
        {
          backgroundColor: earned ? colors.card : colors.muted,
          borderColor: earned ? badge.color : colors.border,
          opacity: earned ? 1 : 0.6,
        },
      ]}
    >
      <View
        style={[
          styles.badgeIcon,
          {
            backgroundColor: earned ? badge.color + "22" : colors.border + "44",
          },
        ]}
      >
        <Feather
          name={badge.icon as keyof typeof Feather.glyphMap}
          size={26}
          color={earned ? badge.color : colors.mutedForeground}
        />
      </View>
      <Text
        style={[
          styles.badgeTitle,
          { color: earned ? colors.foreground : colors.mutedForeground },
        ]}
        numberOfLines={1}
      >
        {badge.titleAr}
      </Text>
      {earned ? (
        <View
          style={[
            styles.earnedBadge,
            { backgroundColor: badge.color + "22" },
          ]}
        >
          <Feather name="check" size={10} color={badge.color} />
        </View>
      ) : (
        <Text
          style={[styles.badgePoints, { color: colors.mutedForeground }]}
        >
          {badge.pointsRequired} نقطة
        </Text>
      )}
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { totalPoints, streak, completedChallenges, savedTips } = useApp();

  const earnedBadges = BADGES.filter(
    (b) => b.pointsRequired <= totalPoints
  );
  const nextBadge = BADGES.find((b) => b.pointsRequired > totalPoints);

  const today = new Date().toISOString().split("T")[0];
  const completedToday = Object.values(completedChallenges).filter(
    (d) => d === today
  ).length;

  const co2Saved = Math.round(totalPoints * 0.12 * 10) / 10;
  const waterSaved = Math.round(totalPoints * 2.5);
  const treesEquiv = Math.round(totalPoints * 0.005 * 10) / 10;

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
      <View
        style={[
          styles.heroCard,
          { backgroundColor: colors.primary },
        ]}
      >
        <View
          style={[
            styles.avatarCircle,
            { backgroundColor: "rgba(255,255,255,0.25)" },
          ]}
        >
          <Feather name="user" size={36} color="#fff" />
        </View>
        <Text style={[styles.heroName, { color: "#fff" }]}>
          راشد سعد
        </Text>
        <Text style={[styles.heroGrade, { color: "rgba(255,255,255,0.9)" }]}>
          الصف الأول الإعدادي — الفصل 6
        </Text>
        <Text style={[styles.heroPoints, { color: "rgba(255,255,255,0.85)" }]}>
          {totalPoints} نقطة بيئية
        </Text>
        {nextBadge && (
          <View style={styles.nextBadgeRow}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      (totalPoints / nextBadge.pointsRequired) * 100,
                      100
                    )}%` as any,
                    backgroundColor: "#fff",
                  },
                ]}
              />
            </View>
            <Text
              style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 6, fontFamily: "Inter_400Regular" }}
            >
              {nextBadge.pointsRequired - totalPoints} نقطة للشارة التالية: {nextBadge.titleAr}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.statsGrid}>
        {[
          { label: "تسلسل الأيام", value: `${streak}`, icon: "zap", color: colors.accent },
          { label: "مهام اليوم", value: `${completedToday}`, icon: "check-circle", color: colors.primary },
          { label: "نصائح محفوظة", value: `${savedTips.length}`, icon: "bookmark", color: "#1E88E5" },
          { label: "مهام كاملة", value: `${Object.keys(completedChallenges).length}`, icon: "award", color: colors.gold },
        ].map((stat) => (
          <View
            key={stat.label}
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather
              name={stat.icon as keyof typeof Feather.glyphMap}
              size={22}
              color={stat.color}
            />
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        تأثيرك على البيئة
      </Text>
      <View
        style={[
          styles.impactCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {[
          { label: "CO₂ موفر", value: `${co2Saved} كغ`, icon: "wind", color: "#66BB6A" },
          { label: "ماء موفر", value: `${waterSaved} لتر`, icon: "droplet", color: "#1E88E5" },
          { label: "ما يعادل زراعة", value: `${treesEquiv} شجرة`, icon: "sun", color: "#2D7D46" },
        ].map((item, idx, arr) => (
          <View
            key={item.label}
            style={[
              styles.impactRow,
              idx < arr.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.impactIcon,
                { backgroundColor: item.color + "22" },
              ]}
            >
              <Feather
                name={item.icon as keyof typeof Feather.glyphMap}
                size={18}
                color={item.color}
              />
            </View>
            <Text style={[styles.impactLabel, { color: colors.mutedForeground }]}>
              {item.label}
            </Text>
            <Text style={[styles.impactValue, { color: colors.foreground }]}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        الشارات ({earnedBadges.length}/{BADGES.length})
      </Text>
      <View style={styles.badgesGrid}>
        {BADGES.map((b) => (
          <BadgeItem
            key={b.id}
            badge={b}
            earned={b.pointsRequired <= totalPoints}
            totalPoints={totalPoints}
          />
        ))}
      </View>
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
  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    gap: 6,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heroName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  heroGrade: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  heroPoints: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  nextBadgeRow: {
    width: "100%",
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: "47%",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  impactCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 24,
    overflow: "hidden",
  },
  impactRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  impactIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  impactLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  impactValue: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  badgeCard: {
    width: "30%",
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTitle: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  earnedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgePoints: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
});
