import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const GAMES = [
  {
    id: "sort",
    title: "فرز النفايات",
    description: "افرز الأغراض في الحاوية الصحيحة قبل انتهاء الوقت",
    emoji: "♻️",
    color: "#1E88E5",
    path: "/games/sort",
  },
  {
    id: "quiz",
    title: "اختبار البيئة",
    description: "اختبر معرفتك البيئية بـ 10 أسئلة متنوعة",
    emoji: "🧠",
    color: "#2D7D46",
    path: "/games/quiz",
  },
  {
    id: "plant",
    title: "ازرع غابتك",
    description: "ازرع الأشجار وحافظ عليها من التلوث",
    emoji: "🌳",
    color: "#FF8C42",
    path: "/games/plant",
  },
];

export default function GamesIndex() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Platform.OS === "web" ? insets.top + 20 : insets.top + 16,
          paddingBottom: 40,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.foreground }]}>الألعاب البيئية 🎮</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            العب وتعلم — بدون إنترنت
          </Text>
        </View>
      </View>

      <View style={styles.gamesGrid}>
        {GAMES.map((game) => (
          <Pressable
            key={game.id}
            onPress={() => router.push(game.path as any)}
            style={({ pressed }) => [
              styles.gameCard,
              {
                backgroundColor: game.color,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <Text style={styles.gameEmoji}>{game.emoji}</Text>
            <Text style={styles.gameTitle}>{game.title}</Text>
            <Text style={styles.gameDesc}>{game.description}</Text>
            <View style={styles.playRow}>
              <Text style={styles.playText}>العب الآن</Text>
              <Feather name="play" size={14} color="#fff" />
            </View>
          </Pressable>
        ))}
      </View>

      <View style={[styles.offlineBadge, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        <Feather name="wifi-off" size={14} color={colors.primary} />
        <Text style={[styles.offlineText, { color: colors.foreground }]}>
          جميع الألعاب تعمل بدون إنترنت
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 28 },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { gap: 2 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular" },
  gamesGrid: { gap: 16 },
  gameCard: {
    borderRadius: 24,
    padding: 24,
    gap: 8,
  },
  gameEmoji: { fontSize: 52, marginBottom: 4 },
  gameTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  gameDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 20,
  },
  playRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  playText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginTop: 20,
    justifyContent: "center",
  },
  offlineText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
