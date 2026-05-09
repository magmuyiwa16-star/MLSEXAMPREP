import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useExam } from "../contexts/ExamContext";
import Timer from "../components/Timer";
import { calculateVivaScore } from "../lib/scoring";
import { saveVivaProgress, clearVivaProgress, getVivaProgress } from "../lib/storage";
import { Mic, MicOff, Send, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { VivaQuestion } from "../data/viva";

const VIVA_DURATION = 30 * 60;
const MAX_SCORE_PER_Q = 4;

interface FollowUpState {
  level: 0 | 1 | 2 | 3;
  answers: string[];
}

export default function Viva() {
  const [, navigate] = useLocation();
  const { currentSet, timerEnabled } = useExam();

  // Restore in-progress state if same exam set
  const saved = getVivaProgress();
  const sameSet = saved?.setIndex === currentSet?.setIndex;

  const [currentIdx, setCurrentIdx] = useState(sameSet && saved ? saved.currentIdx : 0);
  const [ratings, setRatings] = useState<Record<string, number>>(sameSet && saved ? saved.ratings : {});
  const [answer, setAnswer] = useState("");
  const [timerRunning, setTimerRunning] = useState(true);
  const [followUp, setFollowUp] = useState<FollowUpState>({ level: 0, answers: [] });
  const [showFeedback, setShowFeedback] = useState(false);
  const [examDone, setExamDone] = useState(false);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const finalTextRef = useRef("");

  const questions = currentSet?.viva ?? [];
  const q = questions[currentIdx];

  // Persist ratings + position whenever they change
  useEffect(() => {
    if (!currentSet || examDone) return;
    saveVivaProgress({ ratings, currentIdx, setIndex: currentSet.setIndex });
  }, [ratings, currentIdx, currentSet, examDone]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimText("");
  }, []);

  const resetVoice = useCallback(() => {
    stopListening();
    finalTextRef.current = "";
    setInterimText("");
  }, [stopListening]);

  const handleSubmit = useCallback(() => {
    const text = answer.trim();
    if (!text || !q) return;
    stopListening();
    setShowFeedback(true);
    const keyPoints = q.keyPoints.map((k) => k.toLowerCase());
    const lower = text.toLowerCase();
    const hits = keyPoints.filter((k) => k.split(" ").some((w) => w.length > 4 && lower.includes(w))).length;
    const autoRating = Math.min(MAX_SCORE_PER_Q, Math.round((hits / keyPoints.length) * MAX_SCORE_PER_Q));
    setRatings((prev) => ({ ...prev, [q.id]: autoRating }));
    setFollowUp({ level: 1, answers: [text] });
  }, [answer, q, stopListening]);

  const handleNextQuestion = useCallback(() => {
    resetVoice();
    setAnswer("");
    setShowFeedback(false);
    setFollowUp({ level: 0, answers: [] });
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      const vivaScore = calculateVivaScore(ratings);
      sessionStorage.setItem("proexam1_viva_result", JSON.stringify(vivaScore));
      clearVivaProgress();
      setExamDone(true);
      setTimerRunning(false);
    }
  }, [currentIdx, questions.length, ratings, resetVoice]);

  const handleTimerExpire = useCallback(() => {
    stopListening();
    const vivaScore = calculateVivaScore(ratings);
    sessionStorage.setItem("proexam1_viva_result", JSON.stringify(vivaScore));
    clearVivaProgress();
    setTimerRunning(false);
    navigate("/results");
  }, [ratings, navigate, stopListening]);

  const toggleVoice = useCallback(() => {
    setMicError(null);
    if (isListening) { stopListening(); return; }
    const hasSR = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    if (!hasSR) { setMicError("Voice input is not supported in this browser. Please use Chrome or Edge."); return; }
    finalTextRef.current = answer;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec: any = new SR();
    rec.lang = "en-GB";
    rec.continuous = true;
    rec.interimResults = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const segment = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTextRef.current = (finalTextRef.current + " " + segment).trim();
        } else { interim += segment; }
      }
      setInterimText(interim);
      setAnswer((finalTextRef.current + (interim ? " " + interim : "")).trim());
    };
    rec.onerror = (e: Event) => {
      const err = (e as any).error as string;
      setIsListening(false); setInterimText("");
      if (err === "not-allowed" || err === "permission-denied") setMicError("Microphone access was denied. Allow microphone access in your browser settings.");
      else if (err === "no-speech") setMicError("No speech detected. Speak clearly and try again.");
      else if (err === "network") setMicError("Network error during voice recognition. Check your internet connection.");
      else setMicError(`Voice recognition error: ${err}. Try typing your answer instead.`);
    };
    rec.onend = () => { setAnswer((prev) => prev.trim()); setIsListening(false); setInterimText(""); };
    try { rec.start(); recognitionRef.current = rec; setIsListening(true); }
    catch { setMicError("Could not start voice recognition. Please try again or type your answer."); }
  }, [isListening, answer, stopListening]);

  useEffect(() => () => { recognitionRef.current?.stop(); }, []);

  // ── Guards ──────────────────────────────────────────────────────────────────
  if (!currentSet || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-400" />
        <h2 className="text-xl font-bold mb-2">No Exam Set Loaded</h2>
        <p className="text-muted-foreground mb-6">Start a new exam from the Dashboard first.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>Go to Dashboard</button>
      </div>
    );
  }
  if (examDone) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle2 className="w-14 h-14 mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold mb-2">Viva Voce Complete!</h2>
        <p className="text-muted-foreground mb-6">All {questions.length} questions answered.</p>
        <button className="btn-primary" onClick={() => navigate("/results")}>View Results</button>
      </div>
    );
  }

  const totalScore = Object.values(ratings).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Resume banner */}
      {sameSet && saved && saved.currentIdx > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-sm text-primary font-medium mb-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Viva progress restored — you left off at question {saved.currentIdx + 1}.
        </div>
      )}

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Viva Voce</h2>
          <p className="text-sm text-muted-foreground">Q{currentIdx + 1}/{questions.length} · {q?.subject}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium">{totalScore}/40</span>
          {timerEnabled && <Timer durationSeconds={VIVA_DURATION} onExpire={handleTimerExpire} running={timerRunning} />}
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-muted mb-6 overflow-hidden">
        <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="viva-card rounded-2xl p-6 mb-4">
        <span className="tag mb-3 inline-block">{q.subject}</span>
        <h3 className="text-lg font-bold leading-relaxed">{q.question}</h3>
      </div>

      {!showFeedback ? (
        <div className="space-y-3">
          {micError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><span>{micError}</span>
            </div>
          )}
          <div className="relative">
            <textarea
              className="input-area w-full rounded-xl p-4 min-h-40 resize-y text-sm"
              placeholder="Type your answer here, or use the microphone button to speak…"
              value={answer}
              onChange={(e) => { finalTextRef.current = e.target.value; setAnswer(e.target.value); }}
            />
            {isListening && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full inline-block" />REC
              </div>
            )}
            {isListening && interimText && (
              <p className="absolute bottom-3 left-4 right-4 text-xs text-muted-foreground italic truncate pointer-events-none">
                Hearing: {interimText}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={toggleVoice}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
                isListening ? "bg-red-50 border-red-400 text-red-600 animate-pulse" : "bg-muted border-border hover:border-primary/50"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? "Stop Recording" : "Voice Input"}
            </button>
            <button className="btn-primary flex items-center gap-2 ml-auto" onClick={handleSubmit} disabled={!answer.trim()}>
              <Send className="w-4 h-4" />Submit Answer
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {isListening ? "Speak clearly. Click 'Stop Recording' when done, then submit." : "Type, use voice, or combine both. Submit when ready."}
          </p>
        </div>
      ) : (
        <VivaFeedback
          question={q}
          rating={ratings[q.id] ?? 0}
          maxRating={MAX_SCORE_PER_Q}
          followUpLevel={followUp.level}
          onFollowUp={(ans, lvl) =>
            setFollowUp((p) => ({ level: lvl < 3 ? ((lvl + 1) as 0 | 1 | 2 | 3) : 3, answers: [...p.answers, ans] }))
          }
          onNext={handleNextQuestion}
          isLastQuestion={currentIdx === questions.length - 1}
        />
      )}
    </div>
  );
}

function VivaFeedback({ question, rating, maxRating, followUpLevel, onFollowUp, onNext, isLastQuestion }: {
  question: VivaQuestion; rating: number; maxRating: number; followUpLevel: number;
  onFollowUp: (a: string, level: 1 | 2 | 3) => void; onNext: () => void; isLastQuestion: boolean;
}) {
  const [followAnswer, setFollowAnswer] = useState("");
  const [followAnswered, setFollowAnswered] = useState(false);
  const [fuListening, setFuListening] = useState(false);
  const [fuMicError, setFuMicError] = useState<string | null>(null);
  const fuFinalRef = useRef("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fuRecRef = useRef<any>(null);

  const stopFu = useCallback(() => { fuRecRef.current?.stop(); fuRecRef.current = null; setFuListening(false); }, []);
  useEffect(() => () => fuRecRef.current?.stop(), []);

  const toggleFuVoice = useCallback(() => {
    setFuMicError(null);
    if (fuListening) { stopFu(); return; }
    const hasSR = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    if (!hasSR) { setFuMicError("Voice input not supported. Please use Chrome or Edge."); return; }
    fuFinalRef.current = followAnswer;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec: any = new SR();
    rec.lang = "en-GB"; rec.continuous = true; rec.interimResults = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) fuFinalRef.current = (fuFinalRef.current + " " + e.results[i][0].transcript).trim();
      }
      setFollowAnswer(fuFinalRef.current);
    };
    rec.onerror = (e: Event) => { setFuListening(false); setFuMicError(`Error: ${(e as any).error}`); };
    rec.onend = () => setFuListening(false);
    try { rec.start(); fuRecRef.current = rec; setFuListening(true); } catch { setFuMicError("Could not start voice recognition."); }
  }, [fuListening, followAnswer, stopFu]);

  const pct = (rating / maxRating) * 100;
  const colour = pct >= 75 ? "text-green-600" : pct >= 50 ? "text-amber-500" : "text-red-500";
  const currentFollowUp = followUpLevel >= 1 && followUpLevel <= 3 ? question.followUps[followUpLevel - 1] : null;

  return (
    <div className="space-y-4">
      <div className="viva-feedback rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold">Your Score</p>
          <span className={`text-xl font-bold ${colour}`}>{rating}/{maxRating}</span>
        </div>
        <div className="h-2 rounded-full bg-muted mb-4 overflow-hidden">
          <div className={`h-2 rounded-full transition-all ${pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sm font-semibold mb-1">Ideal Answer</p>
        <p className="text-sm leading-relaxed text-muted-foreground mb-3">{question.idealAnswer}</p>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Points</p>
        <ul className="space-y-1">
          {question.keyPoints.map((kp, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-primary" />{kp}
            </li>
          ))}
        </ul>
      </div>

      {currentFollowUp && !followAnswered && (
        <div className="viva-followup rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Follow-up {followUpLevel}</p>
          <p className="font-semibold mb-3">{currentFollowUp.question}</p>
          {fuMicError && <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-2">{fuMicError}</div>}
          <div className="relative mb-3">
            <textarea
              className="input-area w-full rounded-xl p-3 min-h-24 resize-y text-sm"
              placeholder="Your answer… (type or use mic)"
              value={followAnswer}
              onChange={(e) => { fuFinalRef.current = e.target.value; setFollowAnswer(e.target.value); }}
            />
            {fuListening && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />REC
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={toggleFuVoice} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${fuListening ? "bg-red-50 border-red-400 text-red-600 animate-pulse" : "border-border bg-muted"}`}>
              {fuListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              {fuListening ? "Stop" : "Mic"}
            </button>
            <button className="btn-outline text-sm" onClick={() => setFollowAnswered(true)}>Show Answer</button>
            <button className="btn-primary text-sm flex items-center gap-1.5 ml-auto" onClick={() => { stopFu(); onFollowUp(followAnswer, followUpLevel as 1 | 2 | 3); setFollowAnswered(true); }} disabled={!followAnswer.trim()}>
              <Send className="w-3 h-3" />Submit
            </button>
          </div>
        </div>
      )}

      {followAnswered && currentFollowUp && (
        <div className="explanation-box rounded-xl p-4">
          <p className="text-xs font-semibold mb-1">Ideal Answer</p>
          <p className="text-sm leading-relaxed">{currentFollowUp.idealAnswer}</p>
        </div>
      )}

      <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={onNext}>
        {isLastQuestion ? "Finish Viva" : "Next Question"}<ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
