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

interface Question {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

const ALL_QUESTIONS: Question[] = [
  {
    q: "كم مرة يمكن إعادة تدوير الألمنيوم؟",
    options: ["مرة واحدة", "5 مرات", "10 مرات", "بشكل لانهائي"],
    answer: 3,
    explanation: "الألمنيوم يمكن تدويره بشكل لانهائي دون فقدان جودته",
  },
  {
    q: "كم سنة يستغرق تحلل الكيس البلاستيكي؟",
    options: ["10 سنوات", "50 سنة", "100-1000 سنة", "لا يتحلل أبداً"],
    answer: 2,
    explanation: "الكيس البلاستيكي يستغرق من 100 إلى 1000 سنة للتحلل",
  },
  {
    q: "ما هي أكبر مصادر ثاني أكسيد الكربون؟",
    options: ["النقل والسيارات", "إنتاج الطاقة", "الزراعة", "قطع الأشجار"],
    answer: 1,
    explanation: "إنتاج الطاقة من الوقود الأحفوري هو المصدر الأكبر لـ CO2",
  },
  {
    q: "كم لتراً من الماء تُوفر بإيقاف الصنبور أثناء تنظيف الأسنان لمدة دقيقتين؟",
    options: ["2 لتر", "8 لتر", "16 لتر", "30 لتر"],
    answer: 2,
    explanation: "الصنبور يصرف 8 لترات في الدقيقة، فدقيقتان = 16 لتر",
  },
  {
    q: "ما لون حاوية إعادة تدوير الورق في معظم الدول؟",
    options: ["أزرق", "أخضر", "أصفر", "أحمر"],
    answer: 1,
    explanation: "الحاوية الخضراء مخصصة للورق والكرتون في أغلب الأنظمة",
  },
  {
    q: "كم شجرة تُنتج الأكسجين الكافي لشخص واحد في السنة؟",
    options: ["1 شجرة", "7 أشجار", "22 شجرة", "100 شجرة"],
    answer: 1,
    explanation: "7-8 أشجار كافية لإنتاج الأكسجين الذي يحتاجه شخص في السنة",
  },
  {
    q: "ماذا يحدث عند حرق النفايات بشكل عشوائي؟",
    options: [
      "يختفي التلوث",
      "ينتج غازات سامة وجسيمات ضارة",
      "يصبح سماداً",
      "لا يحدث شيء",
    ],
    answer: 1,
    explanation: "حرق النفايات يطلق ثاني أكسيد الكربون والديوكسين والمواد السامة",
  },
  {
    q: "ما هي المادة الأكثر انتشاراً في ملوثات المحيطات؟",
    options: ["الزجاج", "المعادن", "البلاستيك", "الورق"],
    answer: 2,
    explanation: "8 ملايين طن من البلاستيك تصل للمحيطات سنوياً",
  },
  {
    q: "كم من الطاقة يوفر إطفاء المصباح عند الخروج من الغرفة لـ 8 ساعات يومياً؟",
    options: ["لا شيء يذكر", "10% من فاتورة الكهرباء", "25% من الفاتورة", "50% من الفاتورة"],
    answer: 1,
    explanation: "إطفاء الأضواء غير المستخدمة يمكن أن يوفر 10-15% من فاتورة الكهرباء",
  },
  {
    q: "ما هي أفضل طريقة للتخلص من بطاريات الهاتف القديمة؟",
    options: [
      "رميها في القمامة العامة",
      "إحراقها",
      "التسليم لمراكز إعادة التدوير المتخصصة",
      "دفنها في التربة",
    ],
    answer: 2,
    explanation: "البطاريات تحتوي على مواد سامة، يجب تسليمها لمراكز متخصصة",
  },
  {
    q: "كم طن من الغذاء يُهدر عالمياً كل سنة؟",
    options: ["100 مليون طن", "500 مليون طن", "1.3 مليار طن", "5 مليار طن"],
    answer: 2,
    explanation: "ثلث إنتاج الغذاء العالمي يُهدر = 1.3 مليار طن سنوياً",
  },
  {
    q: "ما فائدة زراعة الأشجار في المدن؟",
    options: [
      "تقليل حرارة المدينة فقط",
      "امتصاص CO2 وتلطيف الجو وتحسين جودة الهواء",
      "جذب الأمطار فقط",
      "لا تأثير يُذكر",
    ],
    answer: 1,
    explanation: "الأشجار تمتص CO2، تنتج أكسجيناً، تلطف الجو وتقلل تأثير الحرارة",
  },
  {
    q: "ما هي أفضل وسيلة نقل للبيئة؟",
    options: ["السيارة", "الطائرة", "الدراجة أو المشي", "الباص"],
    answer: 2,
    explanation: "الدراجة والمشي صفر انبعاثات ومفيدة للصحة أيضاً",
  },
  {
    q: "متى تبدأ تأثيرات التغير المناخي في الظهور بشكل واضح؟",
    options: [
      "بعد 1000 سنة",
      "بعد 500 سنة",
      "بدأت فعلاً منذ عقود",
      "لم تبدأ بعد",
    ],
    answer: 2,
    explanation: "التغير المناخي يحدث الآن: ذوبان الجليد، ارتفاع الحرارة، الفيضانات",
  },
  {
    q: "ما هي الحاوية المناسبة للزجاج؟",
    options: ["الزرقاء", "الخضراء", "الصفراء أو البرتقالية", "الحمراء"],
    answer: 2,
    explanation: "في معظم أنظمة الفرز، الزجاج يذهب للحاوية الصفراء أو البرتقالية",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL = 10;
const TIMER = 15;

export default function QuizGame() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeChallenge } = useApp();

  const [questions] = useState(() => shuffle(ALL_QUESTIONS).slice(0, TOTAL));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER);
  const [phase, setPhase] = useState<"answering" | "revealed" | "ended">("answering");
  const [pointsEarned, setPointsEarned] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerAnim = useRef(new Animated.Value(1)).current;

  const question = questions[current];

  function startTimer() {
    timerRef.current && clearInterval(timerRef.current);
    timerAnim.setValue(1);
    setTimeLeft(TIMER);
    Animated.timing(timerAnim, { toValue: 0, duration: TIMER * 1000, useNativeDriver: false }).start();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("revealed");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    if (phase === "answering") startTimer();
    return () => { timerRef.current && clearInterval(timerRef.current); };
  }, [current, phase]);

  const handleAnswer = useCallback(async (idx: number) => {
    if (phase !== "answering") return;
    timerRef.current && clearInterval(timerRef.current);
    setSelected(idx);
    setPhase("revealed");
    if (idx === question.answer) {
      setScore((s) => s + 10);
      if (Platform.OS !== "web") await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      if (Platform.OS !== "web") await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [phase, question]);

  function handleNext() {
    setSelected(null);
    if (current + 1 >= TOTAL) {
      setPhase("ended");
      if (!pointsEarned) {
        setPointsEarned(true);
        if (score + (selected === question.answer ? 10 : 0) > 0) {
          completeChallenge("quiz_game_" + Date.now(), score + (selected === question.answer ? 10 : 0));
        }
      }
    } else {
      setCurrent((c) => c + 1);
      setPhase("answering");
    }
  }

  if (phase === "ended") {
    const finalScore = score;
    const pct = Math.round((finalScore / (TOTAL * 10)) * 100);
    return (
      <View style={[styles.endScreen, { backgroundColor: colors.background }]}>
        <View style={[styles.endCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.endEmoji}>{pct >= 80 ? "🏆" : pct >= 50 ? "🌟" : "📚"}</Text>
          <Text style={[styles.endTitle, { color: colors.foreground }]}>انتهى الاختبار!</Text>
          <Text style={[styles.endScore, { color: colors.primary }]}>{finalScore} / {TOTAL * 10}</Text>
          <Text style={[styles.endPercent, { color: colors.mutedForeground }]}>{pct}% إجابات صحيحة</Text>
          <Text style={[styles.endMsg, { color: colors.primary }]}>
            {pct >= 80 ? "ممتاز! أنت خبير بيئي! 🌿" : pct >= 50 ? "جيد! استمر في التعلم 📗" : "واصل الدراسة ستتحسن! 💪"}
          </Text>
          <View style={styles.endButtons}>
            <Pressable onPress={() => router.replace("/games/quiz" as any)} style={[styles.endBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.endBtnTxt}>إعادة الاختبار</Text>
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
        <View style={styles.topCenter}>
          <Text style={[styles.topTitle, { color: colors.foreground }]}>اختبار البيئة</Text>
          <Text style={[styles.topSub, { color: colors.mutedForeground }]}>{current + 1} / {TOTAL}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: colors.primary }]}>
          <Feather name="star" size={12} color="#fff" />
          <Text style={styles.scoreTxt}>{score}</Text>
        </View>
      </View>

      <View style={styles.timerRow}>
        <View style={[styles.timerTrack, { backgroundColor: colors.border }]}>
          <Animated.View
            style={[
              styles.timerFill,
              {
                backgroundColor: timeLeft > 8 ? colors.primary : timeLeft > 4 ? "#FF8C42" : "#E53935",
                width: timerAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
              },
            ]}
          />
        </View>
        <Text style={[styles.timerNum, { color: timeLeft <= 4 ? "#E53935" : colors.mutedForeground }]}>{timeLeft}</Text>
      </View>

      <View style={styles.questionArea}>
        <View style={[styles.qCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.qNumBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.qNumTxt}>س{current + 1}</Text>
          </View>
          <Text style={[styles.qText, { color: colors.foreground }]}>{question.q}</Text>
        </View>

        <View style={styles.options}>
          {question.options.map((opt, idx) => {
            let bg = colors.card;
            let border = colors.border;
            let textColor = colors.foreground;
            if (phase === "revealed") {
              if (idx === question.answer) {
                bg = "#E8F5E9";
                border = "#2D7D46";
                textColor = "#1B5E20";
              } else if (idx === selected && selected !== question.answer) {
                bg = "#FEE2E2";
                border = "#E53935";
                textColor = "#B71C1C";
              }
            }
            return (
              <Pressable
                key={idx}
                onPress={() => handleAnswer(idx)}
                disabled={phase !== "answering"}
                style={({ pressed }) => [
                  styles.optBtn,
                  { backgroundColor: bg, borderColor: border, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <View style={[styles.optLetter, { backgroundColor: border + "33" }]}>
                  <Text style={[styles.optLetterTxt, { color: border }]}>
                    {["أ", "ب", "ج", "د"][idx]}
                  </Text>
                </View>
                <Text style={[styles.optText, { color: textColor }]}>{opt}</Text>
                {phase === "revealed" && idx === question.answer && (
                  <Feather name="check-circle" size={16} color="#2D7D46" />
                )}
                {phase === "revealed" && idx === selected && selected !== question.answer && (
                  <Feather name="x-circle" size={16} color="#E53935" />
                )}
              </Pressable>
            );
          })}
        </View>

        {phase === "revealed" && (
          <View style={[styles.explanation, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Feather name="info" size={14} color={colors.primary} />
            <Text style={[styles.explanationText, { color: colors.foreground }]}>{question.explanation}</Text>
          </View>
        )}
      </View>

      {phase === "revealed" && (
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.nextBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, margin: 16 },
          ]}
        >
          <Text style={styles.nextBtnTxt}>
            {current + 1 >= TOTAL ? "عرض النتيجة" : "السؤال التالي"}
          </Text>
          <Feather name="arrow-left" size={18} color="#fff" style={{ transform: [{ rotate: "180deg" }] }} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 10, gap: 10 },
  backBtn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  topCenter: { flex: 1, alignItems: "center" },
  topTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  topSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  scoreBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  scoreTxt: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#fff" },
  timerRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, marginBottom: 12 },
  timerTrack: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  timerFill: { height: 6, borderRadius: 3 },
  timerNum: { fontSize: 13, fontFamily: "Inter_700Bold", width: 24, textAlign: "center" },
  questionArea: { flex: 1, paddingHorizontal: 16, gap: 10 },
  qCard: { borderRadius: 18, borderWidth: 1.5, padding: 20, gap: 12 },
  qNumBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  qNumTxt: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#fff" },
  qText: { fontSize: 16, fontFamily: "Inter_600SemiBold", lineHeight: 24 },
  options: { gap: 8 },
  optBtn: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1.5 },
  optLetter: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  optLetterTxt: { fontSize: 13, fontFamily: "Inter_700Bold" },
  optText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  explanation: { flexDirection: "row", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, alignItems: "flex-start" },
  explanationText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  nextBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, borderRadius: 16 },
  nextBtnTxt: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },
  endScreen: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  endCard: { borderRadius: 24, borderWidth: 1.5, padding: 28, alignItems: "center", gap: 10, width: "100%" },
  endEmoji: { fontSize: 60 },
  endTitle: { fontSize: 24, fontFamily: "Inter_700Bold" },
  endScore: { fontSize: 42, fontFamily: "Inter_700Bold" },
  endPercent: { fontSize: 14, fontFamily: "Inter_400Regular" },
  endMsg: { fontSize: 15, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  endButtons: { flexDirection: "row", gap: 10, marginTop: 10 },
  endBtn: { paddingHorizontal: 22, paddingVertical: 13, borderRadius: 14 },
  endBtnTxt: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#fff" },
});
