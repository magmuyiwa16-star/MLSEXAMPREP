import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { useExam } from "../contexts/ExamContext";
import Timer from "../components/Timer";
import { calculatePracticalScore } from "../lib/scoring";
import { savePracticalProgress, clearPracticalProgress, getPracticalProgress } from "../lib/storage";
import { Beaker, ChevronRight, AlertTriangle, CheckCircle2, BookOpen } from "lucide-react";

const PRACTICAL_DURATION = 90 * 60;

const STRUCTURED_FIELDS = [
  { key: "title", label: "Title / Investigation Name", placeholder: "e.g. Blood Glucose Estimation by Glucose Oxidase Method" },
  { key: "aim", label: "Aim", placeholder: "What does this investigation seek to measure or determine?" },
  { key: "materials", label: "Materials / Reagents", placeholder: "List all materials, reagents, and equipment needed..." },
  { key: "principle", label: "Principle", placeholder: "Describe the chemical/biological basis of the test..." },
  { key: "method", label: "Method / Procedure", placeholder: "Step-by-step procedure..." },
  { key: "referenceRange", label: "Reference Range", placeholder: "Normal values for this test..." },
  { key: "result", label: "Result / Interpretation", placeholder: "State the result and what it means in context of this case..." },
  { key: "clinicalSignificance", label: "Clinical Significance", placeholder: "Why does this result matter for patient management?" },
];

type StructuredAnswer = Record<string, string>;

export default function Practical() {
  const [, navigate] = useLocation();
  const { currentSet, timerEnabled } = useExam();

  // Restore in-progress state if same exam set
  const saved = getPracticalProgress();
  const sameSet = saved?.setIndex === currentSet?.setIndex;

  const [currentCaseIdx, setCurrentCaseIdx] = useState(sameSet && saved ? saved.currentCaseIdx : 0);
  const [currentQIdx, setCurrentQIdx] = useState(sameSet && saved ? saved.currentQIdx : 0);
  const [caseRatings, setCaseRatings] = useState<Record<string, number>>(sameSet && saved ? saved.caseRatings : {});
  const [structuredAnswers, setStructuredAnswers] = useState<StructuredAnswer>({});
  const [freeAnswers, setFreeAnswers] = useState<Record<string, string>>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [timerRunning, setTimerRunning] = useState(true);
  const [mode, setMode] = useState<"free" | "structured">("free");

  const cases = currentSet?.practical ?? [];
  const currentCase = cases[currentCaseIdx];

  // Persist position + ratings on every change
  useEffect(() => {
    if (!currentSet) return;
    savePracticalProgress({ caseRatings, currentCaseIdx, currentQIdx, setIndex: currentSet.setIndex });
  }, [caseRatings, currentCaseIdx, currentQIdx, currentSet]);

  const handleTimerExpire = useCallback(() => {
    const score = calculatePracticalScore(caseRatings);
    sessionStorage.setItem("proexam1_practical_result", JSON.stringify(score));
    clearPracticalProgress();
    setTimerRunning(false);
    navigate("/results");
  }, [caseRatings, navigate]);

  const handleRateAndNext = useCallback(
    (rating: number) => {
      if (!currentCase) return;
      const newRatings = { ...caseRatings, [currentCase.id + "_q" + currentQIdx]: rating };
      setCaseRatings(newRatings);

      const q = currentCase.questions[currentQIdx];
      const qMarks = q?.marks ?? 0;
      const ratingsByCase: Record<string, number> = {};
      for (const [k, v] of Object.entries(newRatings)) {
        const caseId = k.split("_q")[0];
        ratingsByCase[caseId] = (ratingsByCase[caseId] ?? 0) + v;
      }

      if (currentQIdx < currentCase.questions.length - 1) {
        setCurrentQIdx((i) => i + 1);
        setStructuredAnswers({});
        setFreeAnswers({});
        setShowAnswer(false);
      } else if (currentCaseIdx < cases.length - 1) {
        setCurrentCaseIdx((i) => i + 1);
        setCurrentQIdx(0);
        setStructuredAnswers({});
        setFreeAnswers({});
        setShowAnswer(false);
      } else {
        const perCase: Record<string, number> = {};
        for (const c of cases) {
          const caseTotal = Object.entries(newRatings)
            .filter(([k]) => k.startsWith(c.id))
            .reduce((sum, [, v]) => sum + v, 0);
          const keyCount = Object.keys(newRatings).filter((k) => k.startsWith(c.id)).length;
          const maxPerCase = c.questions.reduce((s, qItem) => s + qItem.marks, 0);
          perCase[c.id] = Math.min(10, Math.round((caseTotal / (keyCount * 4)) * maxPerCase));
        }
        const score = calculatePracticalScore(perCase);
        sessionStorage.setItem("proexam1_practical_result", JSON.stringify(score));
        clearPracticalProgress();
        setTimerRunning(false);
        navigate("/results");
      }
    },
    [caseRatings, currentCase, currentCaseIdx, currentQIdx, cases, navigate]
  );

  if (!currentSet || cases.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-400" />
        <h2 className="text-xl font-bold mb-2">No Exam Set Loaded</h2>
        <button className="btn-primary" onClick={() => navigate("/")}>Go to Dashboard</button>
      </div>
    );
  }

  if (!currentCase) return null;
  const q = currentCase.questions[currentQIdx];
  const totalProgress = (currentCaseIdx * currentCase.questions.length + currentQIdx + 1) /
    cases.reduce((s, c) => s + c.questions.length, 0);
  const totalScore = Object.values(caseRatings).reduce((a, b) => a + b, 0);
  const maxPossible = cases.reduce((s, c) => s + c.questions.length * 4, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Resume banner */}
      {sameSet && saved && (saved.currentCaseIdx > 0 || saved.currentQIdx > 0) && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-medium mb-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Practical progress restored — Case {saved.currentCaseIdx + 1}, Q{saved.currentQIdx + 1}.
        </div>
      )}

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Practical Examination</h2>
          <p className="text-sm text-muted-foreground">
            Case {currentCaseIdx + 1}/{cases.length} · {currentCase.subject} · Q{currentQIdx + 1}/{currentCase.questions.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium">{totalScore}/{maxPossible} pts</span>
          {timerEnabled && <Timer durationSeconds={PRACTICAL_DURATION} onExpire={handleTimerExpire} running={timerRunning} />}
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-muted mb-6 overflow-hidden">
        <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${totalProgress * 100}%` }} />
      </div>

      <div className="practical-case-card rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Beaker className="w-5 h-5" />
          <span className="tag">{currentCase.subject}</span>
          <span className="font-bold">{currentCase.title}</span>
        </div>
        <p className="text-sm leading-relaxed mb-4">{currentCase.scenario}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-semibold">Test</th>
                <th className="text-left py-2 pr-4 font-semibold">Result</th>
                <th className="text-left py-2 font-semibold">Reference Range</th>
              </tr>
            </thead>
            <tbody>
              {currentCase.labResults.map((lr, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 pr-4">{lr.test}</td>
                  <td className={`py-2 pr-4 font-semibold ${lr.flag === "H" ? "text-red-500" : lr.flag === "L" ? "text-blue-500" : ""}`}>
                    {lr.value}{lr.flag && lr.flag !== "N" && <span className="ml-1 text-xs">{lr.flag}</span>}
                  </td>
                  <td className="py-2 text-muted-foreground">{lr.referenceRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="practical-question rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold">Question {currentQIdx + 1} ({q.marks} marks)</p>
          <div className="flex gap-2">
            <button onClick={() => setMode("free")} className={`px-3 py-1 rounded-lg text-xs font-medium border ${mode === "free" ? "bg-primary text-primary-foreground border-transparent" : "border-border"}`}>Free Write</button>
            <button onClick={() => setMode("structured")} className={`px-3 py-1 rounded-lg text-xs font-medium border ${mode === "structured" ? "bg-primary text-primary-foreground border-transparent" : "border-border"}`}>Structured</button>
          </div>
        </div>
        <p className="font-medium mb-4">{q.question}</p>
        {mode === "free" ? (
          <textarea
            className="input-area w-full rounded-xl p-4 min-h-40 resize-y text-sm"
            placeholder="Write your answer here..."
            value={freeAnswers[currentQIdx] ?? ""}
            onChange={(e) => setFreeAnswers((p) => ({ ...p, [currentQIdx]: e.target.value }))}
          />
        ) : (
          <div className="space-y-4">
            {STRUCTURED_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 block">{field.label}</label>
                <textarea
                  className="input-area w-full rounded-xl p-3 min-h-16 resize-y text-sm"
                  placeholder={field.placeholder}
                  value={structuredAnswers[field.key] ?? ""}
                  onChange={(e) => setStructuredAnswers((p) => ({ ...p, [field.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {!showAnswer ? (
        <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={() => setShowAnswer(true)}>
          <BookOpen className="w-4 h-4" />Check Model Answer & Mark
        </button>
      ) : (
        <div className="space-y-4">
          <div className="explanation-box rounded-2xl p-5">
            <p className="font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" />Model Answer</p>
            <p className="text-sm leading-relaxed">{q.modelAnswer}</p>
          </div>
          <div className="perf-card rounded-2xl p-5">
            <p className="font-semibold mb-3">Self-Assessment ({q.marks} marks)</p>
            <p className="text-sm text-muted-foreground mb-3">Rate how well your answer covered the model answer:</p>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((v) => {
                const labels = ["None", "Poor", "Fair", "Good", "Excellent"];
                return (
                  <button key={v} onClick={() => handleRateAndNext(v)} className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all hover:border-primary ${v <= 1 ? "hover:bg-red-50" : v <= 2 ? "hover:bg-amber-50" : "hover:bg-green-50"}`}>
                    <span className="text-lg font-bold">{v}</span>
                    <span className="text-xs text-muted-foreground">{labels[v]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
