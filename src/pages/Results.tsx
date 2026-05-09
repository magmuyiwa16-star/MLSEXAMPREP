import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useExam } from "../contexts/ExamContext";
import { CBTScore, VivaScore, PracticalScore, calculateFinalScore, FinalScore } from "../lib/scoring";
import { Trophy, BookOpen, Mic, Beaker, RotateCcw, Home, TrendingUp } from "lucide-react";
import { EXAM_SET_COUNT } from "../lib/examEngine";

export default function Results() {
  const [, navigate] = useLocation();
  const { currentSet, scoreHistory, saveResult, startExam, pressureMode } = useExam();
  const [finalScore, setFinalScore] = useState<FinalScore | null>(null);

  useEffect(() => {
    const cbtRaw = sessionStorage.getItem("proexam1_cbt_result");
    const vivaRaw = sessionStorage.getItem("proexam1_viva_result");
    const practicalRaw = sessionStorage.getItem("proexam1_practical_result");

    const cbt: CBTScore = cbtRaw
      ? JSON.parse(cbtRaw)
      : { correct: 0, total: 100, percentage: 0, subjectBreakdown: {} };

    const viva: VivaScore = vivaRaw
      ? JSON.parse(vivaRaw)
      : { score: 0, maxScore: 40, percentage: 0 };

    const practical: PracticalScore = practicalRaw
      ? JSON.parse(practicalRaw)
      : { score: 0, maxScore: 60, percentage: 0, perCase: {} };

    const setIndex = currentSet?.setIndex ?? 0;
    const fs = calculateFinalScore(cbt, viva, practical, setIndex, pressureMode);

    // Only save if there's actual data
    if (cbtRaw || vivaRaw || practicalRaw) {
      // avoid saving duplicates if already saved
      const already = scoreHistory[0];
      if (!already || Math.abs(new Date(already.date).getTime() - new Date(fs.date).getTime()) > 5000) {
        saveResult(fs);
      }
    }
    setFinalScore(fs);
  }, []);

  const handleRetry = () => {
    sessionStorage.removeItem("proexam1_cbt_result");
    sessionStorage.removeItem("proexam1_viva_result");
    sessionStorage.removeItem("proexam1_practical_result");
    const setIndex = Math.floor(Math.random() * EXAM_SET_COUNT);
    startExam(setIndex);
    navigate("/cbt");
  };

  if (!finalScore) {
    return <div className="flex items-center justify-center h-64"><div className="spinner" /></div>;
  }

  const { cbt, viva, practical, total, maxTotal, finalPercentage, grade } = finalScore;
  const gradeColour =
    grade === "DISTINCTION" ? "text-green-500"
    : grade === "CREDIT" ? "text-blue-500"
    : grade === "PASS" ? "text-amber-500"
    : "text-red-500";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="results-hero rounded-2xl p-8 text-center mb-8">
        <Trophy className="w-14 h-14 mx-auto mb-3 text-amber-400" />
        <h1 className="text-3xl font-bold mb-1">Exam Complete</h1>
        <p className="text-muted-foreground mb-4">Set {(finalScore.setIndex ?? 0) + 1} · {new Date(finalScore.date).toLocaleDateString()}</p>
        <div className={`text-6xl font-black mb-2 ${gradeColour}`}>{finalPercentage}%</div>
        <div className={`text-xl font-bold ${gradeColour}`}>{grade}</div>
        <p className="text-sm text-muted-foreground mt-2">{total} / {maxTotal} total marks</p>
      </div>

      {/* Score breakdown */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <ScoreSection
          icon={<BookOpen className="w-5 h-5" />}
          title="CBT Exam"
          score={cbt.correct}
          max={100}
          label="Correct MCQs"
          colour="blue"
        />
        <ScoreSection
          icon={<Mic className="w-5 h-5" />}
          title="Viva Voce"
          score={viva.score}
          max={40}
          label="Viva marks"
          colour="purple"
        />
        <ScoreSection
          icon={<Beaker className="w-5 h-5" />}
          title="Practical"
          score={practical.score}
          max={60}
          label="Practical marks"
          colour="green"
        />
      </div>

      {/* CBT Subject Breakdown */}
      {Object.keys(cbt.subjectBreakdown).length > 0 && (
        <div className="perf-card rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 font-semibold mb-4">
            <TrendingUp className="w-4 h-4" />
            CBT Subject Breakdown
          </div>
          {Object.entries(cbt.subjectBreakdown).map(([subject, data]) => {
            const pct = Math.round((data.correct / data.total) * 100);
            return (
              <div key={subject} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{subject}</span>
                  <span className="font-semibold">{data.correct}/{data.total} ({pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Performance Message */}
      <div className="focus-card rounded-2xl p-5 mb-8">
        <p className="font-semibold mb-1">Examiner's Note</p>
        <p className="text-sm leading-relaxed">
          {finalPercentage >= 70
            ? "Excellent performance! You have demonstrated strong competency across all sections. Maintain this level of rigour for the actual examination."
            : finalPercentage >= 60
            ? "Good effort. You are on track but should review the subjects where you scored below 60%. Focus on clinical reasoning questions in your Viva preparation."
            : finalPercentage >= 50
            ? "You have passed the threshold but need consistent improvement. Revisit your weakest subject areas and practise structured practical answering. Consider daily CBT sessions."
            : "This session highlights areas requiring significant attention. Do not be discouraged — use the subject breakdown to create a targeted study plan. Return to fundamentals and focus on one subject at a time."}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className="btn-primary flex items-center justify-center gap-2 flex-1"
          onClick={handleRetry}
        >
          <RotateCcw className="w-4 h-4" />
          Retry New Exam Set
        </button>
        <button
          className="btn-outline flex items-center justify-center gap-2 flex-1"
          onClick={() => navigate("/")}
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

function ScoreSection({
  icon, title, score, max, label, colour
}: {
  icon: React.ReactNode;
  title: string;
  score: number;
  max: number;
  label: string;
  colour: "blue" | "purple" | "green";
}) {
  const pct = Math.round((score / max) * 100);
  const colourMap = {
    blue: { bar: "bg-blue-400", text: "text-blue-500", bg: "bg-blue-50" },
    purple: { bar: "bg-purple-400", text: "text-purple-500", bg: "bg-purple-50" },
    green: { bar: "bg-green-500", text: "text-green-600", bg: "bg-green-50" },
  };
  const cls = colourMap[colour];

  return (
    <div className={`${cls.bg} rounded-2xl p-5`}>
      <div className="flex items-center gap-2 mb-3 font-semibold">{icon}{title}</div>
      <div className={`text-3xl font-black mb-1 ${cls.text}`}>{score}<span className="text-base font-medium text-muted-foreground">/{max}</span></div>
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="h-2 rounded-full bg-white/60 overflow-hidden">
        <div className={`h-2 rounded-full ${cls.bar}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs mt-1 font-medium">{pct}%</p>
    </div>
  );
}


