export interface CBTScore {
  correct: number;
  total: number;
  percentage: number;
  subjectBreakdown: Record<string, { correct: number; total: number }>;
}

export interface VivaScore {
  score: number;
  maxScore: number;
  percentage: number;
}

export interface PracticalScore {
  score: number;
  maxScore: number;
  percentage: number;
  perCase: Record<string, number>;
}

export interface FinalScore {
  cbt: CBTScore;
  viva: VivaScore;
  practical: PracticalScore;
  total: number;
  maxTotal: number;
  finalPercentage: number;
  grade: string;
  examReadiness: number;
  date: string;
  setIndex: number;
  pressureMode: boolean;
}

export function calculateCBTScore(
  answers: Record<string, string>,
  questions: { id: string; subject: string; answer: string }[]
): CBTScore {
  const breakdown: Record<string, { correct: number; total: number }> = {};
  let correct = 0;
  for (const q of questions) {
    if (!breakdown[q.subject]) breakdown[q.subject] = { correct: 0, total: 0 };
    breakdown[q.subject].total++;
    if (answers[q.id] === q.answer) {
      correct++;
      breakdown[q.subject].correct++;
    }
  }
  return {
    correct,
    total: questions.length,
    percentage: Math.round((correct / questions.length) * 100),
    subjectBreakdown: breakdown,
  };
}

export function calculateVivaScore(ratings: Record<string, number>): VivaScore {
  const values = Object.values(ratings);
  const score = values.reduce((a, b) => a + b, 0);
  const maxScore = 40;
  return {
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
  };
}

export function calculatePracticalScore(
  ratings: Record<string, number>
): PracticalScore {
  const perCase: Record<string, number> = { ...ratings };
  const score = Object.values(ratings).reduce((a, b) => a + b, 0);
  const maxScore = 60;
  return {
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    perCase,
  };
}

export function calculateFinalScore(
  cbt: CBTScore,
  viva: VivaScore,
  practical: PracticalScore,
  setIndex: number,
  pressureMode: boolean
): FinalScore {
  const total = cbt.correct + viva.score + practical.score;
  const maxTotal = 200;
  const finalPercentage = Math.round((total / maxTotal) * 100);
  const grade = getGrade(finalPercentage);
  const examReadiness = Math.min(100, Math.round(finalPercentage * 1.05));

  return {
    cbt,
    viva,
    practical,
    total,
    maxTotal,
    finalPercentage,
    grade,
    examReadiness,
    date: new Date().toISOString(),
    setIndex,
    pressureMode,
  };
}

function getGrade(percentage: number): string {
  if (percentage >= 70) return "DISTINCTION";
  if (percentage >= 60) return "CREDIT";
  if (percentage >= 50) return "PASS";
  if (percentage >= 45) return "MARGINAL FAIL";
  return "FAIL";
}

export function getWeakestSubjects(
  history: FinalScore[]
): Array<{ subject: string; accuracy: number }> {
  const subjectTotals: Record<string, { correct: number; total: number }> = {};

  for (const session of history) {
    for (const [subject, data] of Object.entries(session.cbt.subjectBreakdown)) {
      if (!subjectTotals[subject]) subjectTotals[subject] = { correct: 0, total: 0 };
      subjectTotals[subject].correct += data.correct;
      subjectTotals[subject].total += data.total;
    }
  }

  return Object.entries(subjectTotals)
    .map(([subject, data]) => ({
      subject,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}
