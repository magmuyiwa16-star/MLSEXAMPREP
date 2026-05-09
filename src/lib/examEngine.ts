import { MCQ, generateMCQSet, shuffleArray } from "../data/mcqs";
import { VivaQuestion, generateVivaSet } from "../data/viva";
import { PracticalCase, generatePracticalSet } from "../data/practical";

export const EXAM_SET_COUNT = 11;

export interface ExamSet {
  setIndex: number;
  mcqs: MCQ[];
  viva: VivaQuestion[];
  practical: PracticalCase[];
}

export function buildExamSet(setIndex: number): ExamSet {
  return {
    setIndex,
    mcqs: generateMCQSet(setIndex),
    viva: generateVivaSet(setIndex),
    practical: generatePracticalSet(setIndex),
  };
}

export function shuffleMCQs(questions: MCQ[]): MCQ[] {
  return shuffleArray(questions);
}

export function getPressureModeAdjustedSet(
  set: ExamSet,
  recentScore: number
): ExamSet {
  if (recentScore >= 80) {
    // Harder: filter for hard difficulty first, fill with medium
    const hard = set.mcqs.filter((q) => q.difficulty === "hard");
    const medium = set.mcqs.filter((q) => q.difficulty === "medium");
    const easy = set.mcqs.filter((q) => q.difficulty === "easy");
    const adjusted = shuffleArray([...hard, ...medium, ...easy]).slice(0, 100);
    return { ...set, mcqs: adjusted };
  } else if (recentScore < 50) {
    // Easier: filter for easy difficulty first
    const easy = set.mcqs.filter((q) => q.difficulty === "easy");
    const medium = set.mcqs.filter((q) => q.difficulty === "medium");
    const hard = set.mcqs.filter((q) => q.difficulty === "hard");
    const adjusted = shuffleArray([...easy, ...medium, ...hard]).slice(0, 100);
    return { ...set, mcqs: adjusted };
  }
  return set;
}
