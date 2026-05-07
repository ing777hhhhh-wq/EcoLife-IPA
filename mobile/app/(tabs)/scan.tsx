import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

interface ScanResult {
  item: string;
  material: string;
  bin: string;
  binColor: string;
  instruction: string;
  recyclable: boolean;
}

const BIN_COLORS: Record<string, string> = {
  blue: "#1E88E5",
  green: "#2D7D46",
  yellow: "#FDD835",
  red: "#E53935",
  brown: "#795548",
  black: "#212121",
};

const BIN_ICONS: Record<string, string> = {
  blue: "droplet",
  green: "sun",
  yellow: "star",
  red: "alert-triangle",
  brown: "coffee",
  black: "trash-2",
};

function getApiBase(): string {
  if (Platform.OS === "web") {
    return "";
  }
  const domain = process.env.EXPO_PUBLIC_DOMAIN ?? "";
  return domain ? `https://${domain}` : "";
}

export default function ScanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeChallenge } = useApp();

  const [image, setImage] = useState<string | null>(null);
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewarded, setRewarded] = useState(false);

  async function pickImage(useCamera: boolean) {
    setResult(null);
    setError(null);
    setRewarded(false);

    let res: ImagePicker.ImagePickerResult;

    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        setError("يرجى السماح بالوصول إلى الكاميرا");
        return;
      }
      res = await ImagePicker.launchCameraAsync({
        base64: true,
        quality: 0.5,
        allowsEditing: true,
        aspect: [4, 3],
      });
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setError("يرجى السماح بالوصول إلى معرض الصور");
        return;
      }
      res = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        quality: 0.5,
        allowsEditing: true,
        aspect: [4, 3],
      });
    }

    if (res.canceled || !res.assets?.[0]) return;

    const asset = res.assets[0];
    setImage(asset.uri);
    setImageB64(asset.base64 ?? null);

    if (asset.base64) {
      await analyzeImage(asset.base64);
    }
  }

  async function analyzeImage(b64: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base = getApiBase();
      const response = await fetch(`${base}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: b64 }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as any).error ?? "فشل التحليل");
      }

      const data: ScanResult = await response.json();
      setResult(data);

      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (e: any) {
      setError(e.message ?? "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  async function handleRetry() {
    if (imageB64) {
      await analyzeImage(imageB64);
    }
  }

  async function handleReward() {
    if (rewarded) return;
    await completeChallenge("scan_reward_" + Date.now(), 20);
    setRewarded(true);
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  const binColor = result?.binColor
    ? BIN_COLORS[result.binColor] ?? colors.primary
    : colors.primary;
  const binIcon = result?.binColor
    ? BIN_ICONS[result.binColor] ?? "trash-2"
    : "trash-2";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop:
            Platform.OS === "web" ? insets.top + 67 : insets.top + 16,
          paddingBottom: Platform.OS === "web" ? 34 + 84 : 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.screenTitle, { color: colors.foreground }]}>
        مسح الغرض ♻️
      </Text>
      <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
        صوّر أي غرض واعرف في أي حاوية يذهب
      </Text>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={() => pickImage(true)}
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.85 : 1,
              flex: 1,
            },
          ]}
        >
          <Feather name="camera" size={22} color="#fff" />
          <Text style={styles.actionBtnText}>تصوير</Text>
        </Pressable>

        <Pressable
          onPress={() => pickImage(false)}
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: colors.card,
              borderWidth: 1.5,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
              flex: 1,
            },
          ]}
        >
          <Feather name="image" size={22} color={colors.primary} />
          <Text style={[styles.actionBtnText, { color: colors.foreground }]}>
            من المعرض
          </Text>
        </Pressable>
      </View>

      {image && (
        <View
          style={[
            styles.imageCard,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Image source={{ uri: image }} style={styles.previewImage} />
        </View>
      )}

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            جارٍ التحليل...
          </Text>
        </View>
      )}

      {error && (
        <View
          style={[
            styles.errorCard,
            { backgroundColor: "#FEE2E2", borderColor: "#FECACA" },
          ]}
        >
          <Feather name="alert-circle" size={20} color="#DC2626" />
          <Text style={[styles.errorText, { color: "#DC2626" }]}>{error}</Text>
          {imageB64 && (
            <Pressable onPress={handleRetry} style={styles.retryBtn}>
              <Text style={{ color: "#DC2626", fontFamily: "Inter_600SemiBold", fontSize: 13 }}>
                إعادة المحاولة
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {result && (
        <View style={styles.resultContainer}>
          <View
            style={[
              styles.binCard,
              { backgroundColor: binColor },
            ]}
          >
            <Feather
              name={binIcon as keyof typeof Feather.glyphMap}
              size={48}
              color="#fff"
            />
            <Text style={styles.binTitle}>{result.bin}</Text>
            <View style={styles.recycleBadge}>
              <Feather
                name={result.recyclable ? "check-circle" : "x-circle"}
                size={14}
                color="#fff"
              />
              <Text style={styles.recycleBadgeText}>
                {result.recyclable ? "قابل لإعادة التدوير" : "غير قابل للتدوير"}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIcon,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Feather name="package" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoText}>
                <Text
                  style={[styles.infoLabel, { color: colors.mutedForeground }]}
                >
                  الغرض
                </Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>
                  {result.item}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIcon,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Feather name="layers" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoText}>
                <Text
                  style={[styles.infoLabel, { color: colors.mutedForeground }]}
                >
                  المادة
                </Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>
                  {result.material}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIcon,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Feather name="info" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoText}>
                <Text
                  style={[styles.infoLabel, { color: colors.mutedForeground }]}
                >
                  تعليمات
                </Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>
                  {result.instruction}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={handleReward}
            style={({ pressed }) => [
              styles.rewardBtn,
              {
                backgroundColor: rewarded
                  ? colors.successLight
                  : colors.primary,
                borderColor: rewarded ? colors.primary : "transparent",
                borderWidth: rewarded ? 1.5 : 0,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather
              name={rewarded ? "check-circle" : "star"}
              size={18}
              color={rewarded ? colors.primary : "#fff"}
            />
            <Text
              style={[
                styles.rewardBtnText,
                { color: rewarded ? colors.primary : "#fff" },
              ]}
            >
              {rewarded ? "تم! +20 نقطة بيئية" : "سلّمته صح ✅ (+20 نقطة)"}
            </Text>
          </Pressable>
        </View>
      )}

      {!image && !loading && (
        <View
          style={[
            styles.placeholder,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Feather name="camera" size={48} color={colors.mutedForeground} />
          <Text style={[styles.placeholderTitle, { color: colors.foreground }]}>
            صوّر الغرض
          </Text>
          <Text
            style={[styles.placeholderText, { color: colors.mutedForeground }]}
          >
            التقط صورة لأي قطعة وسيخبرك الذكاء الاصطناعي بالحاوية المناسبة لها
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  screenTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  screenSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  actionBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  imageCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden",
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  loadingBox: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(220,38,38,0.1)",
  },
  resultContainer: {
    gap: 14,
  },
  binCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    gap: 10,
  },
  binTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    textAlign: "center",
  },
  recycleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recycleBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 12,
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  infoValue: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  rewardBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  rewardBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  placeholder: {
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 40,
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
  placeholderTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  placeholderText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
});
