import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AppState {
  totalPoints: number;
  streak: number;
  lastActiveDate: string | null;
  completedChallenges: Record<string, string>;
  savedTips: string[];
}

interface AppContextValue extends AppState {
  completeChallenge: (challengeId: string, points: number) => Promise<void>;
  uncompleteChallenge: (challengeId: string, points: number) => Promise<void>;
  isChallengeCompleted: (challengeId: string) => boolean;
  toggleSavedTip: (tipId: string) => Promise<void>;
  isTipSaved: (tipId: string) => boolean;
}

const STORAGE_KEY = "@ecolife_state";

const defaultState: AppState = {
  totalPoints: 0,
  streak: 0,
  lastActiveDate: null,
  completedChallenges: {},
  savedTips: [],
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: AppState = JSON.parse(raw);
          const today = getTodayKey();
          const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .split("T")[0];
          let streak = parsed.streak;
          if (
            parsed.lastActiveDate &&
            parsed.lastActiveDate !== today &&
            parsed.lastActiveDate !== yesterday
          ) {
            streak = 0;
          }
          setState({ ...parsed, streak });
        }
      } catch (_) {}
      setLoaded(true);
    })();
  }, []);

  const saveState = useCallback(async (next: AppState) => {
    setState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (_) {}
  }, []);

  const completeChallenge = useCallback(
    async (challengeId: string, points: number) => {
      const today = getTodayKey();
      const key = `${challengeId}_${today}`;
      if (state.completedChallenges[key]) return;

      const wasActiveToday = state.lastActiveDate === today;
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];

      let newStreak = state.streak;
      if (!wasActiveToday) {
        newStreak =
          state.lastActiveDate === yesterday ? state.streak + 1 : 1;
      }

      const next: AppState = {
        ...state,
        totalPoints: state.totalPoints + points,
        streak: newStreak,
        lastActiveDate: today,
        completedChallenges: {
          ...state.completedChallenges,
          [key]: today,
        },
      };
      await saveState(next);
    },
    [state, saveState]
  );

  const uncompleteChallenge = useCallback(
    async (challengeId: string, points: number) => {
      const today = getTodayKey();
      const key = `${challengeId}_${today}`;
      if (!state.completedChallenges[key]) return;
      const updated = { ...state.completedChallenges };
      delete updated[key];
      const next: AppState = {
        ...state,
        totalPoints: Math.max(0, state.totalPoints - points),
        completedChallenges: updated,
      };
      await saveState(next);
    },
    [state, saveState]
  );

  const isChallengeCompleted = useCallback(
    (challengeId: string) => {
      const today = getTodayKey();
      const key = `${challengeId}_${today}`;
      return !!state.completedChallenges[key];
    },
    [state.completedChallenges]
  );

  const toggleSavedTip = useCallback(
    async (tipId: string) => {
      const saved = state.savedTips.includes(tipId)
        ? state.savedTips.filter((id) => id !== tipId)
        : [...state.savedTips, tipId];
      await saveState({ ...state, savedTips: saved });
    },
    [state, saveState]
  );

  const isTipSaved = useCallback(
    (tipId: string) => state.savedTips.includes(tipId),
    [state.savedTips]
  );

  if (!loaded) return null;

  return (
    <AppContext.Provider
      value={{
        ...state,
        completeChallenge,
        uncompleteChallenge,
        isChallengeCompleted,
        toggleSavedTip,
        isTipSaved,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
