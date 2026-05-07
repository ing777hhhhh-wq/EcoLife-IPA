import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type CellState = "empty" | "seed" | "sprout" | "tree" | "polluted" | "dead";

const GRID_SIZE = 4;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const GAME_DURATION = 90;
const WATER_MAX = 100;
const WATER_COST = 15;
const POLLUTION_INTERVAL = 5000;
const WATER_REGEN = 8;
const REGEN_INTERVAL = 2000;
const GROW_INTERVAL = 4000;

function initialGrid(): CellState[] {
  return Array(TOTAL_CELLS).fill("empty");
}

const CELL_EMOJIS: Record<CellState, string> = {
  empty: "",
  seed: "🌱",
  sprout: "🌿",
  tree: "🌳",
  polluted: "☁️",
  dead: "🥀",
};

export default function PlantGame() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeChallenge } = useApp();

  const [grid, setGrid] = useState<CellState[]>(initialGrid);
  const [water, setWater] = useState(WATER_MAX);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [phase, setPhase] = useState<"playing" | "ended">("playing");
  const [pointsEarned, setPointsEarned] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const gridRef = useRef(grid);
  gridRef.current = grid;
  const waterRef = useRef(water);
  waterRef.current = water;

  function showMsg(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1500);
  }

  useEffect(() => {
    if (phase !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const regenTimer = setInterval(() => {
      setWater((w) => Math.min(WATER_MAX, w + WATER_REGEN));
    }, REGEN_INTERVAL);

    const growTimer = setInterval(() => {
      setGrid((g) => {
        const next = [...g];
        for (let i = 0; i < TOTAL_CELLS; i++) {
          if (next[i] === "seed") next[i] = "sprout";
          else if (next[i] === "sprout") next[i] = "tree";
        }
        return next;
      });
    }, GROW_INTERVAL);

    const pollutionTimer = setInterval(() => {
      setGrid((g) => {
        const plantedCells = g.reduce((acc: number[], s, i) => {
          if (s === "seed" || s === "sprout" || s === "tree") acc.push(i);
          return acc;
        }, []);
        if (plantedCells.length === 0) return g;
        const target = plantedCells[Math.floor(Math.random() * plantedCells.length)];
        const next = [...g];
        next[target] = "polluted";
        return next;
      });
    }, POLLUTION_INTERVAL);

    const killTimer = setInterval(() => {
      setGrid((g) => {
        const next = [...g];
        let changed = false;
        for (let i = 0; i < TOTAL_CELLS; i++) {
          if (next[i] === "polluted") {
            next[i] = "dead";
            changed = true;
          }
        }
        return changed ? next : g;
      });
    }, POLLUTION_INTERVAL + 3000);

    return () => {
      clearInterval(timer);
      clearInterval(regenTimer);
      clearInterval(growTimer);
      clearInterval(pollutionTimer);
      clearInterval(killTimer);
    };
  }, [phase]);

  function endGame() {
    setPhase("ended");
    const g = gridRef.current;
    const trees = g.filter((s) => s === "tree").length;
    const sprouts = g.filter((s) => s === "sprout").length;
    const seeds = g.filter((s) => s === "seed").length;
    const finalScore = trees * 15 + sprouts * 8 + seeds * 3;
    setScore(finalScore);
    if (!pointsEarned && finalScore > 0) {
      setPointsEarned(true);
      completeChallenge("plant_game_" + Date.now(), finalScore);
    }
  }

  const handleCellPress = useCallback(async (idx: number) => {
    if (phase !== "playing") return;
    const cell = gridRef.current[idx];
    if (cell === "polluted") {
      setGrid((g) => {
        const next = [...g];
        next[idx] = next[idx] === "polluted" ? "tree" : next[idx];
        return next;
      });
      if (Platform.OS !== "web") await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showMsg("🌬️ أزلت التلوث!");
      return;
    }
    if (cell === "empty") {
      if (waterRef.current < WATER_COST) {
        showMsg("💧 لا يوجد ماء كافٍ!");
        return;
      }
      setGrid((g) => {
        const next = [...g];
        next[idx] = "seed";
        return next;
      });
      setWater((w) => Math.max(0, w - WATER_COST));
      if (Platform.OS !== "web") await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      showMsg("🌱 زرعت بذرة!");
    }
  }, [phase]);

  const trees = grid.filter((s) => s === "tree").length;
  const sprouts = grid.filter((s) => s === "sprout").length;
  const seeds = grid.filter((s) => s === "seed").length;
  const polluted = grid.filter((s) => s === "polluted").length;

  if (phase === "ended") {
    return (
      <View style={[styles.endScreen, { backgroundColor: colors.background }]}>
        <View style={[styles.endCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.endEmoji}>{score >= 60 ? "🌲🌲🌲" : score >= 30 ? "🌳🌿" : "🌱"}</Text>
          <Text style={[styles.endTitle, { color: colors.foreground }]}>انتهت اللعبة!</Text>
          <View style={styles.endStats}>
            {[
              { label: "أشجار ناضجة", val: trees, emoji: "🌳" },
              { label: "نباتات ناشئة", val: sprouts, emoji: "🌿" },
              { label: "بذور", val: seeds, emoji: "🌱" },
            ].map((stat) => (
              <View key={stat.label} style={[styles.endStatRow, { borderColor: colors.border }]}>
                <Text style={styles.endStatEmoji}>{stat.emoji}</Text>
                <Text style={[styles.endStatLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
                <Text style={[styles.endStatVal, { color: colors.foreground }]}>{stat.val}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.endScore, { color: colors.primary }]}>{score} نقطة بيئية!</Text>
          <View style={styles.endButtons}>
            <Pressable onPress={() => router.replace("/games/plant" as any)} style={[styles.endBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.endBtnTxt}>العب مجدداً</Text>
            </Pressable>
            <Pressable onPress={() => router.back()} style={[styles.endBtn, { backgroundColor: colors.secondary, borderColor: colors.border, borderWidth: 1.5 }]}>
              <Text style={[styles.endBtnTxt, { color: colors.foreground }]}>العودة</Text>
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
        <Text style={[styles.topTitle, { color: colors.foreground }]}>ازرع غابتك 🌳</Text>
        <View style={[styles.timerBadge, { backgroundColor: timeLeft <= 10 ? "#E53935" : colors.primary }]}>
          <Feather name="clock" size={12} color="#fff" />
          <Text style={styles.timerTxt}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        {[
          { label: "ماء", val: `${water}%`, icon: "droplet", color: "#1E88E5" },
          { label: "أشجار", val: `${trees}`, icon: "sun", color: colors.primary },
          { label: "تلوث", val: `${polluted}`, icon: "alert-triangle", color: "#E53935" },
        ].map((s) => (
          <View key={s.label} style={[styles.statChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name={s.icon as keyof typeof Feather.glyphMap} size={14} color={s.color} />
            <Text style={[styles.statVal, { color: colors.foreground }]}>{s.val}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.waterBar, { backgroundColor: colors.border }]}>
        <View style={[styles.waterFill, { width: `${water}%` as any, backgroundColor: "#1E88E5" }]} />
      </View>

      {message ? (
        <Text style={[styles.message, { color: colors.primary }]}>{message}</Text>
      ) : (
        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          {polluted > 0 ? "⚠️ اضغط على ☁️ لإزالة التلوث!" : "اضغط على أرض فارغة لزراعة بذرة"}
        </Text>
      )}

      <View style={styles.grid}>
        {grid.map((cell, idx) => (
          <Pressable
            key={idx}
            onPress={() => handleCellPress(idx)}
            style={({ pressed }) => [
              styles.cell,
              {
                backgroundColor:
                  cell === "empty"
                    ? colors.secondary
                    : cell === "polluted"
                    ? "#FFF3E0"
                    : cell === "dead"
                    ? "#FFEBEE"
                    : colors.successLight,
                borderColor:
                  cell === "polluted"
                    ? "#FF8C42"
                    : cell === "dead"
                    ? "#FFCDD2"
                    : cell === "empty"
                    ? colors.border
                    : colors.primary,
                transform: [{ scale: pressed ? 0.92 : 1 }],
              },
            ]}
          >
            <Text style={styles.cellEmoji}>{CELL_EMOJIS[cell]}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.legend, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          { emoji: "🌱", label: "بذرة" },
          { emoji: "🌿", label: "ناشئة" },
          { emoji: "🌳", label: "شجرة" },
          { emoji: "☁️", label: "اضغط!" },
        ].map((l) => (
          <View key={l.label} style={styles.legendItem}>
            <Text style={styles.legendEmoji}>{l.emoji}</Text>
            <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>{l.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 10, gap: 10 },
  backBtn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  topTitle: { flex: 1, fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  timerBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  timerTxt: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#fff" },
  statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  statChip: { flex: 1, flexDirection: "row", alignItems: "center", gap: 4, padding: 8, borderRadius: 12, borderWidth: 1.5 },
  statVal: { fontSize: 13, fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 10, fontFamily: "Inter_400Regular" },
  waterBar: { height: 5, marginHorizontal: 16, borderRadius: 3, overflow: "hidden", marginBottom: 8 },
  waterFill: { height: 5, borderRadius: 3 },
  hint: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", marginBottom: 12, paddingHorizontal: 16 },
  message: { fontSize: 15, fontFamily: "Inter_700Bold", textAlign: "center", marginBottom: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 10, justifyContent: "center", flex: 1, alignContent: "center" },
  cell: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  cellEmoji: { fontSize: 32 },
  legend: { flexDirection: "row", justifyContent: "space-around", padding: 12, margin: 16, borderRadius: 14, borderWidth: 1.5 },
  legendItem: { alignItems: "center", gap: 2 },
  legendEmoji: { fontSize: 20 },
  legendLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  endScreen: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  endCard: { borderRadius: 24, borderWidth: 1.5, padding: 28, alignItems: "center", gap: 12, width: "100%" },
  endEmoji: { fontSize: 52 },
  endTitle: { fontSize: 24, fontFamily: "Inter_700Bold" },
  endStats: { width: "100%", gap: 4 },
  endStatRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: 1 },
  endStatEmoji: { fontSize: 20, width: 28 },
  endStatLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  endStatVal: { fontSize: 18, fontFamily: "Inter_700Bold" },
  endScore: { fontSize: 28, fontFamily: "Inter_700Bold" },
  endButtons: { flexDirection: "row", gap: 10, marginTop: 4 },
  endBtn: { paddingHorizontal: 22, paddingVertical: 13, borderRadius: 14 },
  endBtnTxt: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#fff" },
});
