import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = name.trim().length >= 2 && email.includes("@") && email.includes(".");

  async function handleEmailLogin() {
    if (!isValid) {
      setError("يرجى إدخال اسم صحيح وبريد إلكتروني صالح");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login({ name: name.trim(), email: email.trim().toLowerCase(), provider: "email" });
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.replace("/");
    } catch (_) {
      setError("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    setError("تسجيل الدخول بـ Google يتطلب تثبيت التطبيق الكامل. استخدم البريد الإلكتروني الآن.");
  }

  function handleAppleLogin() {
    setError("تسجيل الدخول بـ Apple يتطلب تثبيت التطبيق على iPhone. استخدم البريد الإلكتروني الآن.");
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <Text style={[styles.appName, { color: colors.foreground }]}>EcoLife</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            احفظ نقاطك وتابع إنجازاتك
          </Text>
        </View>

        <View style={styles.socialRow}>
          <Pressable
            onPress={handleGoogleLogin}
            style={({ pressed }) => [
              styles.socialBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
                flex: 1,
              },
            ]}
          >
            <Text style={styles.socialIcon}>G</Text>
            <Text style={[styles.socialLabel, { color: colors.foreground }]}>Google</Text>
          </Pressable>

          <Pressable
            onPress={handleAppleLogin}
            style={({ pressed }) => [
              styles.socialBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
                flex: 1,
              },
            ]}
          >
            <Feather name="smartphone" size={16} color={colors.foreground} />
            <Text style={[styles.socialLabel, { color: colors.foreground }]}>Apple</Text>
          </Pressable>
        </View>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>أو بالبريد الإلكتروني</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.foreground }]}>الاسم</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="user" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="راشد سعد"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.foreground }]}>البريد الإلكتروني</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="mail" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="example@email.com"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleEmailLogin}
              />
            </View>
          </View>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: "#FEE2E2", borderColor: "#FECACA" }]}>
              <Feather name="alert-circle" size={14} color="#DC2626" />
              <Text style={[styles.errorText, { color: "#DC2626" }]}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleEmailLogin}
            disabled={loading}
            style={({ pressed }) => [
              styles.loginBtn,
              {
                backgroundColor: isValid ? colors.primary : colors.muted,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.loginBtnText, { color: isValid ? "#fff" : colors.mutedForeground }]}>
              {loading ? "جارٍ التسجيل..." : "ابدأ رحلتك البيئية 🌱"}
            </Text>
          </Pressable>

          <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
            نقاطك ستُحفظ محلياً على هاتفك مرتبطة بهذا البريد
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24 },
  hero: { alignItems: "center", marginBottom: 32, gap: 8 },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoEmoji: { fontSize: 44 },
  appName: { fontSize: 32, fontFamily: "Inter_700Bold" },
  tagline: { fontSize: 14, fontFamily: "Inter_400Regular" },
  socialRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  socialIcon: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#EA4335" },
  socialLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  form: { gap: 14 },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  loginBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 4,
  },
  loginBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  disclaimer: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 16,
  },
});
