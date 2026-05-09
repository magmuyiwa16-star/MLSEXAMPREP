import { useState, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { mcqBank, MCQ, Subject } from "../data/mcqs";
import MCQCard from "../components/MCQCard";
import { upsertNote } from "../lib/storage";
import { CheckCircle, RotateCcw, ChevronRight, Target, Zap, BookMarked } from "lucide-react";

const SUBJECTS: Subject[] = [
  "Haematology",
  "Chemical Pathology",
  "Blood Group Serology",
  "Medical Microbiology",
  "Histopathology",
  "Parasitology",
  "Immunology",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type DrillState = "select" | "running" | "done";

interface DrillResult {
  question: MCQ;
  selected: string | null;
  correct: boolean;
}

export default function Drill() {
  const [, navigate] = useLocation();
  const [state, setState] = useState<DrillState>("select");
  const [subject, setSubject] = useState<Subject | null>(null);
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answeredThisQ, setAnsweredThisQ] = useState(false);
  const [results, setResults] = useState<DrillResult[]>([]);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStart = useCallback(() => {
    if (!subject) return;
    let pool = mcqBank.filter((q) => q.subject === subject);
    if (difficulty !== "all") pool = pool.filter((q) => q.difficulty === difficulty);
    if (pool.length === 0) { alert("No questions found for this filter."); return; }
    const shuffled = shuffle(pool).slice(0, Math.min(pool.length, 30));
    setQuestions(shuffled);
    setCurrentIdx(0);
    setAnswers({});
    setResults([]);
    setAnsweredThisQ(false);
    setState("running");
  }, [subject, difficulty]);

  const handleAnswer = useCallback((option: string) => {
    if (answeredThisQ) return;
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
    setAnsweredThisQ(true);
    const correct = option === q.answer;
    const result: DrillResult = { question: q, selected: option, correct };
    setResults((prev) => [...prev, result]);

    // Auto-save to Notes immediately
    upsertNote({
      subject: q.subject,
      source: "drill",
      outcome: correct ? "correct" : "missed",
      questionId: q.id,
      questionText: q.question,
      options: q.options as Record<string, string>,
      correctAnswer: q.answer,
      userAnswer: option,
      explanation: q.explanation,
      timestamp: Date.now(),
    });

    autoRef.current = setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((i) => i + 1);
        setAnsweredThisQ(false);
      } else {
        setState("done");
      }
    }, 1600);
  }, [answeredThisQ, questions, currentIdx]);

  const handleSkip = useCallback(() => {
    const q = questions[currentIdx];
    if (!q) return;
    if (autoRef.current) clearTimeout(autoRef.current);
    setResults((prev) => [...prev, { question: q, selected: null, correct: false }]);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setAnsweredThisQ(false);
    } else {
      setState("done");
    }
  }, [questions, currentIdx]);

  const handleRestart = useCallback(() => {
    setState("select");
    setSubject(null);
    setDifficulty("all");
  }, []);

  const handleRetryWrong = useCallback(() => {
    const wrong = results.filter((r) => !r.correct).map((r) => r.question);
    if (wrong.length === 0) return;
    setQuestions(shuffle(wrong));
    setCurrentIdx(0);
    setAnswers({});
    setResults([]);
    setAnsweredThisQ(false);
    setState("running");
  }, [results]);

  if (state === "select") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">Subject Drill</h1>
        <p className="text-muted-foreground mb-8">Practice one subject at a time — no pressure, no timer.</p>

        <div className="perf-card rounded-2xl p-6 mb-6">
          <p className="font-semibold mb-3">Choose a Subject</p>
          <div className="grid grid-cols-1 gap-2">
            {SUBJECTS.map((s) => {
              const count = mcqBank.filter((q) => q.subject === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 text-left transition-all ${
                    subject === s
                      ? "border-primary bg-primary/10 font-semibold"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span>{s}</span>
                  <span className="text-xs text-muted-foreground">{count} questions</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="perf-card rounded-2xl p-6 mb-6">
          <p className="font-semibold mb-3">Difficulty</p>
          <div className="flex gap-2 flex-wrap">
            {(["all", "easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                  difficulty === d
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {d === "all" ? "All Levels" : d}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={handleStart}
          disabled={!subject}
        >
          <Zap className="w-4 h-4" />
          Start Drill
        </button>
      </div>
    );
  }

  if (state === "done") {
    const correctCount = results.filter((r) => r.correct).length;
    const pct = Math.round((correctCount / results.length) * 100);
    const wrongQuestions = results.filter((r) => !r.correct);

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="results-hero rounded-2xl p-8 text-center mb-8">
          <CheckCircle className="w-12 h-12 mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-1">Drill Complete!</h2>
          <p className="text-muted-foreground mb-4">{subject}</p>
          <div className="text-5xl font-black mb-1">{pct}%</div>
          <p className="text-sm opacity-80">{correctCount} / {results.length} correct</p>
        </div>

        {/* Saved to notes banner */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-medium mb-6">
          <BookMarked className="w-4 h-4 shrink-0" />
          All answered questions have been saved to your Notes, organised by department.
          <button className="ml-auto underline underline-offset-2 whitespace-nowrap" onClick={() => navigate("/notes")}>
            View Notes →
          </button>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          <button onClick={handleStart} className="btn-primary flex items-center gap-2 flex-1">
            <RotateCcw className="w-4 h-4" />Retry Same Subject
          </button>
          {wrongQuestions.length > 0 && (
            <button onClick={handleRetryWrong} className="btn-outline flex items-center gap-2 flex-1">
              <Target className="w-4 h-4" />Retry {wrongQuestions.length} Wrong
            </button>
          )}
          <button onClick={handleRestart} className="btn-outline flex-1">New Subject</button>
        </div>

        {/* Review wrong answers */}
        {wrongQuestions.length > 0 && (
          <div className="space-y-4">
            <p className="font-semibold text-lg">Review Missed Questions</p>
            {wrongQuestions.map((r, i) => (
              <div key={i} className="perf-card rounded-2xl p-5">
                <p className="font-semibold mb-3">{i + 1}. {r.question.question}</p>
                <div className="space-y-2 text-sm mb-3">
                  {(["A","B","C","D"] as const).map((opt) => (
                    <div
                      key={opt}
                      className={`flex gap-2 px-3 py-2 rounded-lg ${
                        opt === r.question.answer
                          ? "bg-green-100 text-green-800 font-semibold"
                          : opt === r.selected
                          ? "bg-red-100 text-red-700"
                          : ""
                      }`}
                    >
                      <span className="font-bold">{opt}.</span>
                      <span>{r.question.options[opt]}</span>
                    </div>
                  ))}
                </div>
                <div className="explanation-box rounded-xl p-3 text-sm">
                  <p className="font-semibold mb-1">Explanation</p>
                  <p>{r.question.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const q = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const correctSoFar = results.filter((r) => r.correct).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">{subject} Drill</h2>
          <p className="text-sm text-muted-foreground">{difficulty === "all" ? "All levels" : difficulty} · no timer</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium">
            ✓ {correctSoFar}/{results.length}
          </span>
          <button onClick={handleSkip} className="btn-outline text-sm py-1.5">
            Skip
          </button>
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

      <div className="flex justify-between items-center mt-4">
        <button
          className="btn-outline text-sm"
          onClick={() => { if (autoRef.current) clearTimeout(autoRef.current); setState("select"); }}
        >
          Exit Drill
        </button>
        <span className="text-sm text-muted-foreground">{currentIdx + 1} / {questions.length}</span>
      </div>
    </div>
  );
}
