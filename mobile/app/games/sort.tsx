import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const ITEMS = [
  { name: "زجاجة بلاستيك", emoji: "🧴", bin: "plastic" },
  { name: "كيس بلاستيك", emoji: "🛍️", bin: "plastic" },
  { name: "قنينة ماء", emoji: "💧", bin: "plastic" },
  { name: "صحيفة", emoji: "📰", bin: "paper" },
  { name: "كرتون", emoji: "📦", bin: "paper" },
  { name: "كتاب قديم", emoji: "📚", bin: "paper" },
  { name: "زجاجة زجاج", emoji: "🍾", bin: "glass" },
  { name: "مرطبان زجاج", emoji: "🫙", bin: "glass" },
  { name: "علبة معلبات", emoji: "🥫", bin: "metal" },
  { name: "علبة ألمنيوم", emoji: "🥤", bin: "metal" },
  { name: "قشر فاكهة", emoji: "🍌", bin: "organic" },
  { name: "بقايا طعام", emoji: "🍕", bin: "organic" },
  { name: "ورق مبلل", emoji: "🧻", bin: "general" },
  { name: "بطارية قديمة", emoji: "🔋", bin: "hazard" },
  { name: "قفازات طبية", emoji: "🧤", bin: "general" },
  { name: "علبة حليب", emoji: "🥛", bin: "paper" },
  { name: "غطاء بلاستيك", emoji: "🔵", bin: "plastic" },
  { name: "فاكهة فاسدة", emoji: "🍎", bin: "organic" },
];

const BINS = [
  { id: "plastic", label: "بلاستيك", color: "#1E88E5", icon: "droplet" },
  { id: "paper", label: "ورق", color: "#43A047", icon: "file-text" },
  { id: "glass", label: "زجاج", color: "#FB8C00", icon: "circle" },
  { id: "metal", label: "معدن", color: "#757575", icon: "layers" },
  { id: "organic", label: "عضوي", color: "#795548", icon: "coffee" },
  { id: "general", label: "عام", color: "#546E7A", icon: "trash-2" },
  { id: "hazard", label: "خطر", color: "#E53935", icon: "alert-triangle" },
];

type GamePhase = "playing" | "correct" | "wrong" | "ended";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SortGame() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeChallenge } = useApp();

  const [items] = useState(() => shuffle(ITEMS).slice(0, 12));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("playing");
  const [feedback, setFeedback] = useState("");
  const [pointsEarned, setPointsEarned] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;

  const currentItem = items[currentIndex];
  const isFinished = currentIndex >= items.length;

  function shakeCard() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }

  function popCard() {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.12, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }

  function showFeedback(msg: string) {
    setFeedback(msg);
    feedbackOpacity.setValue(1);
    Animated.timing(feedbackOpacity, { toValue: 0, duration: 1200, delay: 600, useNativeDriver: true }).start();
  }

  const handleBinPress = useCallback(async (binId: string) => {
    if (phase !== "playing") return;
    const isCorrect = binId === currentItem.bin;
    if (isCorrect) {
      setScore((s) => s + 10);
      setPhase("correct");
      popCard();
      showFeedback("✅ صح!");
      if (Platform.OS !== "web") await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setPhase("playing");
      }, 600);
    } else {
      setPhase("wrong");
      shakeCard();
      const correctBin = BINS.find((b) => b.id === currentItem.bin);
      showFeedback(`❌ هذا يذهب إلى: ${correctBin?.label ?? ""}`);
      if (Platform.OS !== "web") await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setPhase("playing");
      }, 1200);
    }
  }, [phase, currentItem]);

  useEffect(() => {
    if (isFinished && !pointsEarned) {
      setPhase("ended");
      setPointsEarned(true);
      if (score > 0) {
        completeChallenge("sort_game_" + Date.now(), score);
      }
    }
  }, [isFinished]);

  if (isFinished || phase === "ended") {
    const percentage = Math.round((score / (items.length * 10)) * 100);
    return (
      <View style={[styles.endScreen, { backgroundColor: colors.background }]}>
        <View style={[styles.endCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.endEmoji}>{percentage >= 70 ? "🏆" : percentage >= 40 ? "⭐" : "💪"}</Text>
          <Text style={[styles.endTitle, { color: colors.foreground }]}>انتهت اللعبة!</Text>
          <Text style={[styles.endScore, { color: colors.primary }]}>{score} نقطة</Text>
          <Text style={[styles.endPercent, { color: colors.mutedForeground }]}>
            {score / 10} من {items.length} صحيحة ({percentage}%)
          </Text>
          <Text style={[styles.endReward, { color: colors.primary }]}>
            +{score} نقطة بيئية مضافة!
          </Text>
          <View style={styles.endButtons}>
            <Pressable
              onPress={() => router.replace("/games/sort" as any)}
              style={[styles.endBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.endBtnText}>العب مجدداً</Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={[styles.endBtn, { backgroundColor: colors.secondary, borderColor: colors.border, borderWidth: 1.5 }]}
            >
              <Text style={[styles.endBtnText, { color: colors.foreground }]}>العودة</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: Platform.OS === "web" ? insets.top + 20 : insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.foreground }]}>فرز النفايات</Text>
        <View style={[styles.scoreBadge, { backgroundColor: colors.primary }]}>
          <Feather name="star" size={12} color="#fff" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${((currentIndex) / items.length) * 100}%` as any,
            },
          ]}
        />
      </View>
      <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
        {currentIndex + 1} / {items.length}
      </Text>

      <View style={styles.gameArea}>
        <Animated.View
          style={[
            styles.itemCard,
            {
              backgroundColor: colors.card,
              borderColor: phase === "correct" ? colors.primary : phase === "wrong" ? "#E53935" : colors.border,
              transform: [{ translateX: shakeAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.itemEmoji}>{currentItem.emoji}</Text>
          <Text style={[styles.itemName, { color: colors.foreground }]}>{currentItem.name}</Text>
          <Text style={[styles.itemHint, { color: colors.mutedForeground }]}>في أي حاوية؟</Text>
        </Animated.View>

        <Animated.Text style={[styles.feedbackText, { opacity: feedbackOpacity, color: phase === "correct" ? colors.primary : "#E53935" }]}>
          {feedback}
        </Animated.Text>
      </View>

      <View style={styles.binsGrid}>
        {BINS.map((bin) => (
          <Pressable
            key={bin.id}
            onPress={() => handleBinPress(bin.id)}
            disabled={phase !== "playing"}
            style={({ pressed }) => [
              styles.binBtn,
              {
                backgroundColor: bin.color + (pressed ? "EE" : "22"),
                borderColor: bin.color,
                transform: [{ scale: pressed ? 0.94 : 1 }],
              },
            ]}
          >
            <Feather name={bin.icon as keyof typeof Feather.glyphMap} size={18} color={bin.color} />
            <Text style={[styles.binLabel, { color: bin.color }]}>{bin.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { flex: 1, fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#fff" },
  progressBar: {
    height: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 16,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: 4, borderRadius: 2 },
  progressText: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 4 },
  gameArea: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, gap: 16 },
  itemCard: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 30,
    alignItems: "center",
    gap: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itemEmoji: { fontSize: 72 },
  itemName: { fontSize: 22, fontFamily: "Inter_700Bold" },
  itemHint: { fontSize: 13, fontFamily: "Inter_400Regular" },
  feedbackText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  binsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
    justifyContent: "center",
  },
  binBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  binLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  endScreen: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  endCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 28,
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  endEmoji: { fontSize: 60 },
  endTitle: { fontSize: 24, fontFamily: "Inter_700Bold" },
  endScore: { fontSize: 42, fontFamily: "Inter_700Bold" },
  endPercent: { fontSize: 14, fontFamily: "Inter_400Regular" },
  endReward: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginTop: 4 },
  endButtons: { flexDirection: "row", gap: 10, marginTop: 10 },
  endBtn: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
  },
  endBtnText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#fff" },
});
