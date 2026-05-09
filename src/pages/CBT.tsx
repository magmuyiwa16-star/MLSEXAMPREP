import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useExam } from "../contexts/ExamContext";
import MCQCard from "../components/MCQCard";
import Timer from "../components/Timer";
import { calculateCBTScore } from "../lib/scoring";
import { upsertManyNotes, saveCBTProgress, clearCBTProgress, getCBTProgress } from "../lib/storage";
import { CheckCircle, AlertTriangle } from "lucide-react";

const CBT_DURATION = 120 * 60;

export default function CBT() {
  const [, navigate] = useLocation();
  const { currentSet, timerEnabled } = useExam();

  // Restore in-progress state if same exam set
  const saved = getCBTProgress();
  const sameSet = saved?.setIndex === currentSet?.setIndex;

  const [answers, setAnswers] = useState<Record<string, string>>(
    sameSet && saved ? saved.answers : {}
  );
  const [currentIdx, setCurrentIdx] = useState(
    sameSet && saved ? saved.currentIdx : 0
  );
  const [answeredThisQ, setAnsweredThisQ] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(true);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const questions = currentSet?.mcqs ?? [];

  // Persist progress whenever answers or position change
  useEffect(() => {
    if (!currentSet || submitted) return;
    saveCBTProgress({ answers, currentIdx, setIndex: currentSet.setIndex });
  }, [answers, currentIdx, currentSet, submitted]);

  const handleAnswer = useCallback(
    (option: string) => {
      if (answeredThisQ || submitted) return;
      const q = questions[currentIdx];
      if (!q) return;
      const newAnswers = { ...answers, [q.id]: option };
      setAnswers(newAnswers);
      setAnsweredThisQ(true);

      autoAdvanceRef.current = setTimeout(() => {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx((i) => i + 1);
          setAnsweredThisQ(false);
        } else {
          handleSubmit(newAnswers);
        }
      }, 1500);
    },
    [answeredThisQ, submitted, questions, currentIdx, answers]
  );

  const handleSubmit = useCallback(
    (finalAnswers?: Record<string, string>) => {
      if (submitted) return;
      setSubmitted(true);
      setTimerRunning(false);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);

      const ans = finalAnswers ?? answers;
      const cbtScore = calculateCBTScore(
        ans,
        questions.map((q) => ({ id: q.id, subject: q.subject, answer: q.answer }))
      );
      sessionStorage.setItem("proexam1_cbt_result", JSON.stringify(cbtScore));
      clearCBTProgress();

      // Auto-save every answered question to Notes
      upsertManyNotes(
        questions
          .filter((q) => ans[q.id] !== undefined)
          .map((q) => ({
            subject: q.subject,
            source: "cbt" as const,
            outcome: ans[q.id] === q.answer ? ("correct" as const) : ("missed" as const),
            questionId: q.id,
            questionText: q.question,
            options: q.options as Record<string, string>,
            correctAnswer: q.answer,
            userAnswer: ans[q.id] ?? null,
            explanation: q.explanation,
            timestamp: Date.now(),
          }))
      );

      navigate("/results");
    },
    [submitted, answers, questions, navigate]
  );

  const handleTimerExpire = useCallback(() => handleSubmit(), [handleSubmit]);

  useEffect(() => () => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); }, []);

  if (!currentSet || questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-400" />
        <h2 className="text-xl font-bold mb-2">No Exam Set Loaded</h2>
        <p className="text-muted-foreground mb-6">Start a new exam from the Dashboard.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>Go to Dashboard</button>
      </div>
    );
  }

  const q = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const score = Object.entries(answers).filter(([id, ans]) => questions.find((q) => q.id === id)?.answer === ans).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Resume banner */}
      {sameSet && saved && Object.keys(saved.answers).length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-medium mb-4">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Exam progress restored — you can safely switch apps and come back.
        </div>
      )}

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">CBT Exam</h2>
          <p className="text-sm text-muted-foreground">Set {(currentSet.setIndex ?? 0) + 1} · {questions.length} MCQs</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm font-medium">
            <CheckCircle className="w-4 h-4 text-green-500" />
            {score} correct
          </div>
          {timerEnabled && (
            <Timer durationSeconds={CBT_DURATION} onExpire={handleTimerExpire} running={timerRunning} />
          )}
        </div>
      </div>

      <div className="h-2 rounded-full bg-muted mb-6 overflow-hidden">
        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      <MCQCard
        question={q}
        questionNumber={currentIdx + 1}
        totalQuestions={questions.length}
        selectedAnswer={answers[q.id] ?? null}
        onAnswer={handleAnswer}
        answered={answeredThisQ || q.id in answers}
      />

      <div className="flex items-center justify-between mt-6">
        <button
          className="btn-outline"
          onClick={() => { setCurrentIdx((i) => Math.max(0, i - 1)); setAnsweredThisQ(q.id in answers); }}
          disabled={currentIdx === 0}
        >
          Previous
        </button>
        <span className="text-sm text-muted-foreground">{currentIdx + 1} / {questions.length}</span>
        {currentIdx < questions.length - 1 ? (
          <button className="btn-primary" onClick={() => { setCurrentIdx((i) => i + 1); setAnsweredThisQ(false); }}>
            Next
          </button>
        ) : (
          <button className="btn-submit" onClick={() => handleSubmit()} disabled={submitted}>
            Submit Exam
          </button>
        )}
      </div>

      <div className="mt-8">
        <p className="text-sm text-muted-foreground font-medium mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((qItem, idx) => {
            const isAnswered = qItem.id in answers;
            const isCorrect = isAnswered && answers[qItem.id] === qItem.answer;
            const isCurrent = idx === currentIdx;
            let cls = "w-8 h-8 text-xs rounded-lg font-medium transition-all ";
            if (isCurrent) cls += "ring-2 ring-primary ";
            cls += isAnswered ? (isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600") : "bg-muted text-muted-foreground";
            return (
              <button key={qItem.id} className={cls} onClick={() => { setCurrentIdx(idx); setAnsweredThisQ(qItem.id in answers); }}>
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
