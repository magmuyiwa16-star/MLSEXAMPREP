import { useLocation } from "wouter";
import { useExam } from "../contexts/ExamContext";
import { getWeakestSubjects } from "../lib/scoring";
import { getExamDate, saveExamDate, clearExamDate, getStudyStreak } from "../lib/storage";
import { BookOpen, Mic, Beaker, Trophy, Target, Flame, Calendar, TrendingUp, TrendingDown, Zap, Edit3, X, Dumbbell, Flame as StreakIcon } from "lucide-react";
import { EXAM_SET_COUNT } from "../lib/examEngine";
import { useState, useEffect, useCallback } from "react";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getCountdown(dateStr: string): Countdown {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  const total = target - now;
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total };
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  return { days, hours, minutes, seconds, total };
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { scoreHistory, pressureMode, setPressureMode, timerEnabled, setTimerEnabled, startExam } = useExam();

  const [examDateStr, setExamDateStr] = useState<string | null>(() => getExamDate());
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDate, setTempDate] = useState("");
  const [streak] = useState(() => getStudyStreak());

  // Live countdown tick
  useEffect(() => {
    if (!examDateStr) { setCountdown(null); return; }
    const tick = () => setCountdown(getCountdown(examDateStr));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [examDateStr]);

  const handleSaveDate = useCallback(() => {
    if (!tempDate) return;
    saveExamDate(tempDate);
    setExamDateStr(tempDate);
    setShowDateModal(false);
  }, [tempDate]);

  const handleClearDate = useCallback(() => {
    clearExamDate();
    setExamDateStr(null);
    setCountdown(null);
    setShowDateModal(false);
  }, []);

  const recentScores = scoreHistory.slice(0, 5);
  const avgPct = recentScores.length
    ? Math.round(recentScores.reduce((a, s) => a + s.finalPercentage, 0) / recentScores.length)
    : null;

  const weakSubjects = getWeakestSubjects(scoreHistory);
  const strongSubjects = [...weakSubjects].reverse();

  const examReadiness = scoreHistory.length
    ? Math.min(100, Math.round(scoreHistory[0].finalPercentage + scoreHistory.length * 2))
    : 0;

  const focusSuggestion =
    weakSubjects.length > 0
      ? `Focus on ${weakSubjects[0]?.subject} — your accuracy is only ${weakSubjects[0]?.accuracy}%.`
      : "Great start! Keep practising all subjects consistently.";

  const handleStartExam = (path: string) => {
    const setIndex = Math.floor(Math.random() * EXAM_SET_COUNT);
    startExam(setIndex);
    navigate(path);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Welcome Back</h1>
        <p className="text-muted-foreground">MLS 400-Level Exam Simulator — UCH / OOUTH Standard</p>
      </div>

      {/* Countdown Banner */}
      {countdown && countdown.total > 0 ? (
        <div className="countdown-banner rounded-2xl p-5 mb-6 relative overflow-hidden">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-75 mb-1">Exam Countdown</p>
              <div className="flex items-end gap-3">
                <CountUnit value={countdown.days} label="days" />
                <span className="text-2xl font-black opacity-60 mb-2">:</span>
                <CountUnit value={countdown.hours} label="hrs" />
                <span className="text-2xl font-black opacity-60 mb-2">:</span>
                <CountUnit value={countdown.minutes} label="min" />
                <span className="text-2xl font-black opacity-60 mb-2">:</span>
                <CountUnit value={countdown.seconds} label="sec" />
              </div>
            </div>
            <button onClick={() => { setTempDate(examDateStr ?? ""); setShowDateModal(true); }} className="opacity-70 hover:opacity-100">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : countdown && countdown.total <= 0 ? (
        <div className="countdown-banner rounded-2xl p-5 mb-6 text-center">
          <p className="text-2xl font-black mb-1">🎓 Exam Day!</p>
          <p className="text-sm opacity-80">You've put in the work. Go show what you know.</p>
        </div>
      ) : (
        <button
          onClick={() => { setTempDate(""); setShowDateModal(true); }}
          className="w-full rounded-2xl p-4 mb-6 border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Set your exam date for a live countdown
        </button>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Trophy />} label="Avg Score" value={avgPct !== null ? `${avgPct}%` : "—"} />
        <StatCard icon={<Target />} label="Sessions" value={String(scoreHistory.length)} />
        <StatCard icon={<Flame />} label="Readiness" value={`${examReadiness}%`} />
        <StatCard icon={<StreakIcon className="w-4 h-4" />} label="Study Streak" value={streak > 0 ? `${streak}d 🔥` : "0d"} highlight={streak >= 3} />
      </div>

      {/* Exam Launchers */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <ExamCard icon={<BookOpen className="w-8 h-8" />} title="CBT Exam" subtitle="100 MCQs · 120 min · /100" colorClass="card-cbt" onClick={() => handleStartExam("/cbt")} />
        <ExamCard icon={<Mic className="w-8 h-8" />} title="Viva Voce" subtitle="10 Questions · 30 min · /40" colorClass="card-viva" onClick={() => handleStartExam("/viva")} />
        <ExamCard icon={<Beaker className="w-8 h-8" />} title="Practical" subtitle="6 Cases · 90 min · /60" colorClass="card-practical" onClick={() => handleStartExam("/practical")} />
      </div>

      {/* Subject Drill quick-launch */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/drill")}
          className="w-full rounded-2xl p-4 border-2 border-border hover:border-primary/60 hover:bg-primary/5 transition-all flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold">Subject Drill Mode</p>
            <p className="text-sm text-muted-foreground">Practice one subject at a time · no timer · unlimited questions</p>
          </div>
          <TrendingUp className="w-4 h-4 ml-auto text-muted-foreground" />
        </button>
      </div>

      {/* Settings */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <SettingsCard
          icon={<Zap className="w-5 h-5" />}
          title="Pressure Mode"
          description={pressureMode ? "Active — difficulty adapts to your score." : "Off — fixed difficulty."}
          value={pressureMode}
          onChange={setPressureMode}
        />
        <SettingsCard
          icon={<Calendar className="w-5 h-5" />}
          title="Timer"
          description={timerEnabled ? "Active — CBT: 120 min, Viva: 30 min, Practical: 90 min." : "Off — untimed."}
          value={timerEnabled}
          onChange={setTimerEnabled}
        />
      </div>

      {/* Focus Suggestion */}
      <div className="focus-card rounded-2xl p-5 mb-8 flex items-start gap-3">
        <Target className="w-5 h-5 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold mb-1">Today's Focus</p>
          <p className="text-sm">{focusSuggestion}</p>
        </div>
      </div>

      {/* Performance */}
      {scoreHistory.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="perf-card rounded-2xl p-5">
            <div className="flex items-center gap-2 font-semibold mb-4 text-red-400"><TrendingDown className="w-4 h-4" />Weakest Areas</div>
            {weakSubjects.slice(0, 3).map((s) => <ProgressRow key={s.subject} subject={s.subject} pct={s.accuracy} low />)}
          </div>
          <div className="perf-card rounded-2xl p-5">
            <div className="flex items-center gap-2 font-semibold mb-4 text-green-500"><TrendingUp className="w-4 h-4" />Strongest Areas</div>
            {strongSubjects.slice(0, 3).map((s) => <ProgressRow key={s.subject} subject={s.subject} pct={s.accuracy} />)}
          </div>
        </div>
      )}

      {/* History */}
      {recentScores.length > 0 && (
        <div className="perf-card rounded-2xl p-5">
          <p className="font-semibold mb-4">Recent Sessions</p>
          <div className="space-y-2">
            {recentScores.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{new Date(s.date).toLocaleDateString()} · Set {s.setIndex + 1}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span>CBT {s.cbt.correct}/100</span>
                  <span>Viva {s.viva.score}/40</span>
                  <span className="font-bold text-sm">{s.grade} ({s.finalPercentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam Date Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="settings-card rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Set Exam Date</h3>
              <button onClick={() => setShowDateModal(false)} className="opacity-60 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your professional exam date to see a live countdown on the dashboard.
            </p>
            <input
              type="date"
              className="input-area w-full rounded-xl px-4 py-3 mb-4 text-sm"
              value={tempDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setTempDate(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                className="btn-primary flex-1"
                onClick={handleSaveDate}
                disabled={!tempDate}
              >
                Save Date
              </button>
              {examDateStr && (
                <button className="btn-outline" onClick={handleClearDate}>Clear</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-black tabular-nums">{String(value).padStart(2, "0")}</span>
      <span className="text-xs font-medium opacity-70">{label}</span>
    </div>
  );
}

function StatCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`stat-card rounded-2xl p-4 ${highlight ? "stat-card-alert" : ""}`}>
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">{icon}{label}</div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ExamCard({ icon, title, subtitle, colorClass, onClick }: { icon: React.ReactNode; title: string; subtitle: string; colorClass: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`exam-card-btn ${colorClass} rounded-2xl p-6 flex flex-col items-start gap-3 text-left w-full`}>
      <div className="opacity-90">{icon}</div>
      <div><p className="text-lg font-bold">{title}</p><p className="text-sm opacity-80">{subtitle}</p></div>
    </button>
  );
}

function SettingsCard({ icon, title, description, value, onChange }: { icon: React.ReactNode; title: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="settings-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-semibold">{icon}{title}</div>
        <button onClick={() => onChange(!value)} className={`relative w-11 h-6 rounded-full transition-all ${value ? "bg-primary" : "bg-muted"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : ""}`} />
        </button>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ProgressRow({ subject, pct, low }: { subject: string; pct: number; low?: boolean }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{subject}</span>
        <span className={`font-bold ${low ? "text-red-400" : "text-green-500"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-2 rounded-full ${low ? "bg-red-400" : "bg-green-500"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

import React from "react";
