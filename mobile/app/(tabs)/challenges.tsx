import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChallengeCard } from "@/components/ChallengeCard";
import { CATEGORY_COLORS, CATEGORY_LABELS, CHALLENGES } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

type Category = "all" | "water" | "energy" | "transport" | "food" | "waste";

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "all", label: "الكل", icon: "grid" },
  { id: "water", label: "الماء", icon: "droplets" },
  { id: "energy", label: "الطاقة", icon: "zap" },
  { id: "transport", label: "التنقل", icon: "bike" },
  { id: "food", label: "الطعام", icon: "leaf" },
  { id: "waste", label: "النفايات", icon: "trash-2" },
];

export default function ChallengesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered = CHALLENGES.filter(
    (c) => activeCategory === "all" || c.category === activeCategory
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.headerArea,
          {
            paddingTop:
              Platform.OS === "web" ? insets.top + 67 : insets.top + 16,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>
          التحديات البيئية
        </Text>
        <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
          {filtered.length} تحدٍّ متاح
        </Text>

        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = activeCategory === item.id;
            const catColor =
              item.id === "all"
                ? colors.primary
                : CATEGORY_COLORS[item.id] ?? colors.primary;
            return (
              <Pressable
                onPress={() => setActiveCategory(item.id)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? catColor : colors.card,
                    borderColor: isActive ? catColor : colors.border,
                  },
                ]}
              >
                <Feather
                  name={item.icon as keyof typeof Feather.glyphMap}
                  size={14}
                  color={isActive ? "#fff" : catColor}
                />
                <Text
                  style={[
                    styles.filterLabel,
                    { color: isActive ? "#fff" : colors.foreground },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 + 84 : 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ChallengeCard challenge={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              لا توجد تحديات في هذه الفئة
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  screenTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  screenSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 14,
  },
  filterList: {
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
