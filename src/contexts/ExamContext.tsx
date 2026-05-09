import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ExamSet, buildExamSet } from "../lib/examEngine";
import { FinalScore } from "../lib/scoring";
import {
  getScoreHistory, saveScore,
  getActiveSetIndex, saveActiveSetIndex, clearAllExamProgress,
} from "../lib/storage";

interface ExamContextValue {
  currentSet: ExamSet | null;
  currentSetIndex: number;
  pressureMode: boolean;
  setPressureMode: (v: boolean) => void;
  startExam: (setIndex: number) => void;
  clearExam: () => void;
  scoreHistory: FinalScore[];
  saveResult: (score: FinalScore) => void;
  timerEnabled: boolean;
  setTimerEnabled: (v: boolean) => void;
}

const ExamContext = createContext<ExamContextValue>({} as ExamContextValue);

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<ExamSet | null>(() => {
    // Restore active exam on mount (survives page reload / app switch)
    const saved = getActiveSetIndex();
    if (saved !== null) {
      try { return buildExamSet(saved); } catch { return null; }
    }
    return null;
  });
  const [pressureMode, setPressureMode] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [scoreHistory, setScoreHistory] = useState<FinalScore[]>(() => getScoreHistory());

  // Keep currentSetIndex in sync with restored set
  useEffect(() => {
    if (currentSet) setCurrentSetIndex(currentSet.setIndex);
  }, []);

  const startExam = useCallback((setIndex: number) => {
    const set = buildExamSet(setIndex);
    setCurrentSet(set);
    setCurrentSetIndex(setIndex);
    saveActiveSetIndex(setIndex);
  }, []);

  const clearExam = useCallback(() => {
    setCurrentSet(null);
    clearAllExamProgress();
  }, []);

  const saveResult = useCallback((score: FinalScore) => {
    saveScore(score);
    setScoreHistory(getScoreHistory());
    // Clear persisted progress once result is saved
    clearAllExamProgress();
  }, []);

  return (
    <ExamContext.Provider
      value={{
        currentSet,
        currentSetIndex,
        pressureMode,
        setPressureMode,
        startExam,
        clearExam,
        scoreHistory,
        saveResult,
        timerEnabled,
        setTimerEnabled,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export const useExam = () => useContext(ExamContext);
