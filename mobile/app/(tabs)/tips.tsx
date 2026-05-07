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

import { TipCard } from "@/components/TipCard";
import { CATEGORY_COLORS, TIPS } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type TipFilter = "all" | "saved";

export default function TipsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { savedTips } = useApp();
  const [filter, setFilter] = useState<TipFilter>("all");

  const tips = filter === "saved"
    ? TIPS.filter((t) => savedTips.includes(t.id))
    : TIPS;

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
          نصائح بيئية
        </Text>
        <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
          تعلم كيف تحمي كوكبنا
        </Text>

        <View style={styles.filterRow}>
          {(["all", "saved"] as TipFilter[]).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterTab,
                {
                  backgroundColor:
                    filter === f ? colors.primary : colors.card,
                  borderColor:
                    filter === f ? colors.primary : colors.border,
                },
              ]}
            >
              <Feather
                name={f === "all" ? "list" : "bookmark"}
                size={14}
                color={filter === f ? "#fff" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.filterTabLabel,
                  {
                    color: filter === f ? "#fff" : colors.foreground,
                  },
                ]}
              >
                {f === "all" ? "جميع النصائح" : `المحفوظة (${savedTips.length})`}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={tips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: Platform.OS === "web" ? 34 + 84 : 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <TipCard tip={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bookmark" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {filter === "saved"
                ? "لم تحفظ أي نصائح بعد"
                : "لا توجد نصائح"}
            </Text>
            {filter === "saved" && (
              <Text
                style={[
                  styles.emptyHint,
                  { color: colors.mutedForeground },
                ]}
              >
                اضغط على أيقونة الحفظ في أي نصيحة
              </Text>
            )}
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
  filterRow: {
    flexDirection: "row",
    gap: 10,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterTabLabel: {
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
    gap: 10,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
