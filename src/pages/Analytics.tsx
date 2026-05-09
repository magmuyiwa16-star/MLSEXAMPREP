import { useMemo } from "react";
import { useLocation } from "wouter";
import { useExam } from "../contexts/ExamContext";
import { getNotes, getScoreHistory } from "../lib/storage";
import { getWeakestSubjects } from "../lib/scoring";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { TrendingUp, AlertTriangle, BookMarked, Trophy, Target, BarChart3 } from "lucide-react";

const SUBJECT_SHORT: Record<string, string> = {
  "Haematology": "Haem",
  "Chemical Pathology": "Chem",
  "Blood Group Serology": "Blood",
  "Medical Microbiology": "Micro",
  "Histopathology": "Histo",
  "Parasitology": "Para",
  "Immunology": "Immuno",
};

export default function Analytics() {
  const [, navigate] = useLocation();
  const { scoreHistory } = useExam();

  const history = useMemo(() => getScoreHistory(), []);
  const notes = useMemo(() => getNotes(), []);

  // ── Score trend (last 10 sessions) ──────────────────────────────────────────
  const trendData = useMemo(() =>
    [...history].reverse().slice(-10).map((s, i) => ({
      session: `S${i + 1}`,
      CBT: s.cbt.correct,
      Viva: s.viva.score,
      Practical: s.practical.score,
      Total: s.total,
      date: new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    })),
  [history]);

  // ── Subject accuracy across all sessions ────────────────────────────────────
  const subjectData = useMemo(() => {
    const totals: Record<string, { correct: number; total: number }> = {};
    for (const s of history) {
      for (const [sub, d] of Object.entries(s.cbt.subjectBreakdown)) {
        if (!totals[sub]) totals[sub] = { correct: 0, total: 0 };
        totals[sub].correct += d.correct;
        totals[sub].total += d.total;
      }
    }
    return Object.entries(totals).map(([subject, d]) => ({
      subject,
      short: SUBJECT_SHORT[subject] ?? subject.slice(0, 6),
      accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
      correct: d.correct,
      total: d.total,
    })).sort((a, b) => a.accuracy - b.accuracy);
  }, [history]);

  // ── Radar chart data ─────────────────────────────────────────────────────────
  const radarData = useMemo(() =>
    subjectData.map((s) => ({ subject: s.short, Accuracy: s.accuracy })),
  [subjectData]);

  // ── Weakest subjects ─────────────────────────────────────────────────────────
  const weakest = useMemo(() => getWeakestSubjects(history).slice(0, 4), [history]);

  // ── Notes analysis by subject ────────────────────────────────────────────────
  const notesStats = useMemo(() => {
    const bySubject: Record<string, { missed: number; correct: number }> = {};
    for (const n of notes) {
      if (!bySubject[n.subject]) bySubject[n.subject] = { missed: 0, correct: 0 };
      if (n.outcome === "missed") bySubject[n.subject].missed++;
      if (n.outcome === "correct") bySubject[n.subject].correct++;
    }
    return Object.entries(bySubject)
      .map(([subject, d]) => ({
        subject,
        short: SUBJECT_SHORT[subject] ?? subject.slice(0, 6),
        missed: d.missed,
        correct: d.correct,
        total: d.missed + d.correct,
        errorRate: (d.missed + d.correct) > 0 ? Math.round((d.missed / (d.missed + d.correct)) * 100) : 0,
      }))
      .sort((a, b) => b.errorRate - a.errorRate);
  }, [notes]);

  // ── Overall stats ────────────────────────────────────────────────────────────
  const overallStats = useMemo(() => {
    if (history.length === 0) return null;
    const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    return {
      sessions: history.length,
      avgTotal: avg(history.map((s) => s.total)),
      avgCBT: avg(history.map((s) => s.cbt.correct)),
      avgViva: avg(history.map((s) => s.viva.score)),
      avgPractical: avg(history.map((s) => s.practical.score)),
      bestScore: Math.max(...history.map((s) => s.total)),
      passRate: Math.round((history.filter((s) => s.finalPercentage >= 50).length / history.length) * 100),
    };
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <BarChart3 className="w-14 h-14 mx-auto mb-4 text-muted-foreground/40" />
        <h2 className="text-xl font-bold mb-2">No Data Yet</h2>
        <p className="text-muted-foreground mb-6">Complete at least one exam session to see your performance analytics.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>Start an Exam</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Performance Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {history.length} session{history.length !== 1 ? "s" : ""} analysed · based on all CBT, Viva and Practical results
        </p>
      </div>

      {/* Overall stat cards */}
      {overallStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Sessions", value: overallStats.sessions, icon: <Trophy className="w-4 h-4" />, colour: "text-primary" },
            { label: "Avg Total", value: `${overallStats.avgTotal}/200`, icon: <BarChart3 className="w-4 h-4" />, colour: "text-foreground" },
            { label: "Best Score", value: `${overallStats.bestScore}/200`, icon: <Target className="w-4 h-4" />, colour: "text-green-600" },
            { label: "Pass Rate", value: `${overallStats.passRate}%`, icon: <TrendingUp className="w-4 h-4" />, colour: overallStats.passRate >= 60 ? "text-green-600" : "text-red-500" },
          ].map(({ label, value, icon, colour }) => (
            <div key={label} className="perf-card rounded-2xl p-4">
              <div className={`flex items-center gap-1.5 text-sm font-medium mb-1 ${colour}`}>{icon}{label}</div>
              <div className={`text-2xl font-black ${colour}`}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Score trend */}
      {trendData.length > 1 && (
        <div className="perf-card rounded-2xl p-5">
          <h2 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Score Trend (Last {trendData.length} Sessions)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 200]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid var(--border)" }}
                formatter={(value, name) => [`${value}`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Total" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="CBT" stroke="#60a5fa" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="Viva" stroke="#a78bfa" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="Practical" stroke="#34d399" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Subject accuracy + Radar side by side */}
      {subjectData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar chart */}
          <div className="perf-card rounded-2xl p-5">
            <h2 className="font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" />Accuracy by Subject</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={subjectData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="short" tick={{ fontSize: 11 }} width={52} />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Accuracy"]}
                  contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid var(--border)" }}
                />
                <Bar dataKey="accuracy" radius={[0, 6, 6, 0]}
                  fill="hsl(var(--primary))"
                  label={{ position: "right", fontSize: 11, formatter: (v: number) => `${v}%` }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar */}
          <div className="perf-card rounded-2xl p-5">
            <h2 className="font-bold mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-primary" />Competency Radar</h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <Radar name="Accuracy" dataKey="Accuracy" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
                <Tooltip formatter={(v) => [`${v}%`, "Accuracy"]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Weakest subjects deep-dive */}
      {weakest.length > 0 && (
        <div className="perf-card rounded-2xl p-5">
          <h2 className="font-bold mb-1 flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-4 h-4" />Weakest Areas — Priority Focus
          </h2>
          <p className="text-sm text-muted-foreground mb-4">These subjects have the lowest cumulative accuracy across all your CBT sessions.</p>
          <div className="space-y-3">
            {weakest.map((s, i) => {
              const colour = s.accuracy < 40 ? "bg-red-500" : s.accuracy < 60 ? "bg-amber-400" : "bg-yellow-300";
              const textColour = s.accuracy < 40 ? "text-red-600" : s.accuracy < 60 ? "text-amber-600" : "text-yellow-700";
              return (
                <div key={s.subject}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${s.accuracy < 40 ? "bg-red-500" : "bg-amber-400"}`}>{i + 1}</span>
                      {s.subject}
                    </span>
                    <span className={`font-bold text-base ${textColour}`}>{s.accuracy}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-2.5 rounded-full ${colour} transition-all`} style={{ width: `${s.accuracy}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {s.accuracy < 40 ? "⚠️ Critical — review fundamentals immediately"
                     : s.accuracy < 60 ? "📚 Needs work — targeted practice recommended"
                     : "📈 Approaching passing threshold — keep going"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notes-based error analysis */}
      {notesStats.length > 0 && (
        <div className="perf-card rounded-2xl p-5">
          <h2 className="font-bold mb-1 flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-primary" />Error Pattern — From Your Notes
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Ranked by error rate across all CBT and Drill questions you've answered.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {notesStats.map((s) => (
              <div key={s.subject} className={`rounded-xl border p-4 ${s.errorRate >= 60 ? "border-red-200 bg-red-50" : s.errorRate >= 40 ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{s.subject}</span>
                  <span className={`text-sm font-bold ${s.errorRate >= 60 ? "text-red-600" : s.errorRate >= 40 ? "text-amber-600" : "text-green-700"}`}>
                    {s.errorRate}% errors
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/70 overflow-hidden mb-2">
                  <div
                    className={`h-2 rounded-full ${s.errorRate >= 60 ? "bg-red-400" : s.errorRate >= 40 ? "bg-amber-400" : "bg-green-400"}`}
                    style={{ width: `${s.errorRate}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{s.missed} missed · {s.correct} correct · {s.total} total</p>
                {s.errorRate >= 60 && (
                  <button className="mt-2 text-xs font-semibold text-primary underline underline-offset-2" onClick={() => navigate("/notes")}>
                    Review notes →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-session history table */}
      <div className="perf-card rounded-2xl p-5">
        <h2 className="font-bold mb-4 flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" />Session History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 pr-4 font-semibold">#</th>
                <th className="text-left py-2 pr-4 font-semibold">Date</th>
                <th className="text-left py-2 pr-4 font-semibold">Set</th>
                <th className="text-right py-2 pr-4 font-semibold">CBT</th>
                <th className="text-right py-2 pr-4 font-semibold">Viva</th>
                <th className="text-right py-2 pr-4 font-semibold">Practical</th>
                <th className="text-right py-2 font-semibold">Total</th>
                <th className="text-right py-2 pl-4 font-semibold">Grade</th>
              </tr>
            </thead>
            <tbody>
              {history.map((s, i) => {
                const gradeColour = s.grade === "DISTINCTION" ? "text-green-600" : s.grade === "CREDIT" ? "text-blue-500" : s.grade === "PASS" ? "text-amber-500" : "text-red-500";
                return (
                  <tr key={i} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 pr-4 text-muted-foreground">{history.length - i}</td>
                    <td className="py-2.5 pr-4">{new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}</td>
                    <td className="py-2.5 pr-4">Set {(s.setIndex ?? 0) + 1}</td>
                    <td className="py-2.5 pr-4 text-right font-medium">{s.cbt.correct}/100</td>
                    <td className="py-2.5 pr-4 text-right font-medium">{s.viva.score}/40</td>
                    <td className="py-2.5 pr-4 text-right font-medium">{s.practical.score}/60</td>
                    <td className="py-2.5 text-right font-bold">{s.total}/200</td>
                    <td className={`py-2.5 pl-4 text-right font-bold text-xs ${gradeColour}`}>{s.grade}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
