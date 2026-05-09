import { FinalScore } from "./scoring";

const KEYS = {
  SCORE_HISTORY: "proexam1_score_history",
  THEME: "proexam1_theme",
  PRESSURE_MODE: "proexam1_pressure_mode",
  LAST_SESSION: "proexam1_last_session",
  EXAM_DATE: "proexam1_exam_date",
  STUDY_STREAK: "proexam1_study_streak",
  LAST_STUDY_DATE: "proexam1_last_study_date",
  NOTES: "proexam1_notes",
  // ── Exam persistence ──────────────────────────────────────
  ACTIVE_SET_INDEX: "proexam1_active_set_index",
  CBT_PROGRESS: "proexam1_cbt_progress",
  VIVA_PROGRESS: "proexam1_viva_progress",
  PRACTICAL_PROGRESS: "proexam1_practical_progress",
};

// ── Score history ────────────────────────────────────────────────────────────
export function getScoreHistory(): FinalScore[] {
  try {
    const raw = localStorage.getItem(KEYS.SCORE_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveScore(score: FinalScore): void {
  const history = getScoreHistory();
  history.unshift(score);
  localStorage.setItem(KEYS.SCORE_HISTORY, JSON.stringify(history.slice(0, 50)));
  updateStudyStreak();
}

export function getTheme(): string {
  return localStorage.getItem(KEYS.THEME) || "brown";
}
export function setTheme(theme: string): void {
  localStorage.setItem(KEYS.THEME, theme);
}
export function getPressureMode(): boolean {
  return localStorage.getItem(KEYS.PRESSURE_MODE) === "true";
}
export function setPressureMode(value: boolean): void {
  localStorage.setItem(KEYS.PRESSURE_MODE, String(value));
}
export function clearHistory(): void {
  localStorage.removeItem(KEYS.SCORE_HISTORY);
}

// ── Exam Date ────────────────────────────────────────────────────────────────
export function getExamDate(): string | null {
  return localStorage.getItem(KEYS.EXAM_DATE);
}
export function saveExamDate(dateStr: string): void {
  localStorage.setItem(KEYS.EXAM_DATE, dateStr);
}
export function clearExamDate(): void {
  localStorage.removeItem(KEYS.EXAM_DATE);
}

// ── Study Streak ─────────────────────────────────────────────────────────────
export function getStudyStreak(): number {
  const raw = localStorage.getItem(KEYS.STUDY_STREAK);
  return raw ? parseInt(raw, 10) : 0;
}
export function updateStudyStreak(): void {
  const today = new Date().toDateString();
  const last = localStorage.getItem(KEYS.LAST_STUDY_DATE);
  const streak = getStudyStreak();
  if (last === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newStreak = last === yesterday ? streak + 1 : 1;
  localStorage.setItem(KEYS.STUDY_STREAK, String(newStreak));
  localStorage.setItem(KEYS.LAST_STUDY_DATE, today);
}
export function getLastStudyDate(): string | null {
  return localStorage.getItem(KEYS.LAST_STUDY_DATE);
}

// ── Study Notes ──────────────────────────────────────────────────────────────
export type NoteOutcome = "missed" | "correct" | "manual";
export type NoteSource = "cbt" | "drill" | "manual";

export interface StudyNote {
  id: string;
  subject: string;
  source: NoteSource;
  outcome: NoteOutcome;
  questionId?: string;
  questionText?: string;
  options?: Record<string, string>;
  correctAnswer?: string;
  userAnswer?: string | null;
  explanation?: string;
  personalNote: string;
  timestamp: number;
}

function readNotes(): StudyNote[] {
  try {
    const raw = localStorage.getItem(KEYS.NOTES);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function writeNotes(notes: StudyNote[]): void {
  localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
}
export function getNotes(): StudyNote[] { return readNotes(); }

export function upsertNote(note: Omit<StudyNote, "id" | "personalNote"> & { personalNote?: string }): void {
  const notes = readNotes();
  if (note.questionId && note.source !== "manual") {
    const idx = notes.findIndex((n) => n.questionId === note.questionId && n.source === note.source);
    if (idx !== -1) {
      notes[idx] = { ...notes[idx], ...note, id: notes[idx].id, personalNote: notes[idx].personalNote, timestamp: note.timestamp };
      writeNotes(notes);
      return;
    }
  }
  notes.unshift({ ...note, id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, personalNote: note.personalNote ?? "" });
  writeNotes(notes);
}

export function upsertManyNotes(notes: (Omit<StudyNote, "id" | "personalNote"> & { personalNote?: string })[]): void {
  notes.forEach(upsertNote);
}
export function updateNotePersonalText(id: string, text: string): void {
  const notes = readNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx !== -1) { notes[idx].personalNote = text; writeNotes(notes); }
}
export function deleteNote(id: string): void {
  writeNotes(readNotes().filter((n) => n.id !== id));
}
export function addManualNote(subject: string, text: string): void {
  const note: StudyNote = {
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    subject, source: "manual", outcome: "manual", personalNote: text, timestamp: Date.now(),
  };
  const notes = readNotes();
  notes.unshift(note);
  writeNotes(notes);
}

// ── Exam Persistence ─────────────────────────────────────────────────────────

/** Save the active exam set index so the exam survives page reloads / app switches. */
export function saveActiveSetIndex(index: number): void {
  localStorage.setItem(KEYS.ACTIVE_SET_INDEX, String(index));
}
export function getActiveSetIndex(): number | null {
  const raw = localStorage.getItem(KEYS.ACTIVE_SET_INDEX);
  return raw !== null ? parseInt(raw, 10) : null;
}
export function clearActiveSetIndex(): void {
  localStorage.removeItem(KEYS.ACTIVE_SET_INDEX);
}

// CBT in-progress answers + position
export interface CBTProgress {
  answers: Record<string, string>;
  currentIdx: number;
  setIndex: number;
}
export function saveCBTProgress(p: CBTProgress): void {
  localStorage.setItem(KEYS.CBT_PROGRESS, JSON.stringify(p));
}
export function getCBTProgress(): CBTProgress | null {
  try {
    const raw = localStorage.getItem(KEYS.CBT_PROGRESS);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
export function clearCBTProgress(): void {
  localStorage.removeItem(KEYS.CBT_PROGRESS);
}

// Viva in-progress ratings + position
export interface VivaProgress {
  ratings: Record<string, number>;
  currentIdx: number;
  setIndex: number;
}
export function saveVivaProgress(p: VivaProgress): void {
  localStorage.setItem(KEYS.VIVA_PROGRESS, JSON.stringify(p));
}
export function getVivaProgress(): VivaProgress | null {
  try {
    const raw = localStorage.getItem(KEYS.VIVA_PROGRESS);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
export function clearVivaProgress(): void {
  localStorage.removeItem(KEYS.VIVA_PROGRESS);
}

// Practical in-progress ratings + position
export interface PracticalProgress {
  caseRatings: Record<string, number>;
  currentCaseIdx: number;
  currentQIdx: number;
  setIndex: number;
}
export function savePracticalProgress(p: PracticalProgress): void {
  localStorage.setItem(KEYS.PRACTICAL_PROGRESS, JSON.stringify(p));
}
export function getPracticalProgress(): PracticalProgress | null {
  try {
    const raw = localStorage.getItem(KEYS.PRACTICAL_PROGRESS);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
export function clearPracticalProgress(): void {
  localStorage.removeItem(KEYS.PRACTICAL_PROGRESS);
}

/** Clear all in-progress exam data (call after full exam submission). */
export function clearAllExamProgress(): void {
  clearActiveSetIndex();
  clearCBTProgress();
  clearVivaProgress();
  clearPracticalProgress();
}
