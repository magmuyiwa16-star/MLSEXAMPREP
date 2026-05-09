import { useState, useCallback, useEffect } from "react";
import {
  getNotes,
  updateNotePersonalText,
  deleteNote,
  addManualNote,
  StudyNote,
} from "../lib/storage";
import {
  BookMarked, Trash2, Plus, Save, CheckCircle2, XCircle, StickyNote,
  ChevronDown, ChevronUp, Search, X,
} from "lucide-react";

const SUBJECTS = [
  "All",
  "Haematology",
  "Chemical Pathology",
  "Blood Group Serology",
  "Medical Microbiology",
  "Histopathology",
  "Parasitology",
  "Immunology",
];

const SOURCE_LABEL: Record<string, string> = {
  cbt: "CBT",
  drill: "Drill",
  manual: "Manual",
};

export default function Notes() {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [activeSubject, setActiveSubject] = useState("All");
  const [outcomeFilter, setOutcomeFilter] = useState<"all" | "missed" | "correct" | "manual">("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState(SUBJECTS[1]);
  const [newText, setNewText] = useState("");
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const reload = useCallback(() => setNotes(getNotes()), []);

  useEffect(() => { reload(); }, [reload]);

  const handlePersonalSave = useCallback((id: string, text: string) => {
    updateNotePersonalText(id, text);
    setSaved((p) => ({ ...p, [id]: true }));
    setTimeout(() => setSaved((p) => ({ ...p, [id]: false })), 1800);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (!confirm("Delete this note?")) return;
    deleteNote(id);
    reload();
  }, [reload]);

  const handleAddManual = useCallback(() => {
    if (!newText.trim()) return;
    addManualNote(newSubject, newText.trim());
    setNewText("");
    setShowAddModal(false);
    reload();
  }, [newSubject, newText, reload]);

  // Filter
  const filtered = notes.filter((n) => {
    const subjectMatch = activeSubject === "All" || n.subject === activeSubject;
    const outcomeMatch = outcomeFilter === "all" || n.outcome === outcomeFilter;
    const searchMatch =
      !search ||
      (n.questionText?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      n.personalNote.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase());
    return subjectMatch && outcomeMatch && searchMatch;
  });

  // Group by subject for "All" view, or just show flat list when subject selected
  const grouped: Record<string, StudyNote[]> =
    activeSubject === "All"
      ? filtered.reduce<Record<string, StudyNote[]>>((acc, n) => {
          if (!acc[n.subject]) acc[n.subject] = [];
          acc[n.subject].push(n);
          return acc;
        }, {})
      : { [activeSubject]: filtered };

  const totalNotes = notes.length;
  const missedCount = notes.filter((n) => n.outcome === "missed").length;
  const correctCount = notes.filter((n) => n.outcome === "correct").length;
  const manualCount = notes.filter((n) => n.outcome === "manual").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-primary" />
            Study Notes
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Auto-saved from CBT &amp; Drill · organised by department
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: totalNotes, colour: "text-foreground" },
          { label: "Missed", value: missedCount, colour: "text-red-500" },
          { label: "Correct", value: correctCount, colour: "text-green-600" },
          { label: "Manual", value: manualCount, colour: "text-primary" },
        ].map(({ label, value, colour }) => (
          <div key={label} className="perf-card rounded-xl p-3 text-center">
            <div className={`text-2xl font-black ${colour}`}>{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          className="input-area w-full rounded-xl pl-9 pr-9 py-2.5 text-sm"
          placeholder="Search notes, questions, keywords…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearch("")}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subject tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSubject(s)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium border-2 transition-all ${
              activeSubject === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Outcome filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "missed", "correct", "manual"] as const).map((o) => (
          <button
            key={o}
            onClick={() => setOutcomeFilter(o)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize border transition-all ${
              outcomeFilter === o
                ? outcomeColourActive(o)
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {o === "all" ? "All Types" : o}
          </button>
        ))}
      </div>

      {/* Notes list */}
      {Object.keys(grouped).length === 0 ? (
        <EmptyState subject={activeSubject} onAdd={() => setShowAddModal(true)} />
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([subject, subjectNotes]) => (
            <SubjectSection
              key={subject}
              subject={subject}
              notes={subjectNotes}
              saved={saved}
              onSave={handlePersonalSave}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add Manual Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-background rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Add Manual Note</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <label className="block text-sm font-semibold mb-1">Department</label>
            <select
              className="input-area w-full rounded-xl px-3 py-2.5 text-sm mb-3"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            >
              {SUBJECTS.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="block text-sm font-semibold mb-1">Note</label>
            <textarea
              className="input-area w-full rounded-xl p-3 min-h-32 resize-y text-sm mb-4"
              placeholder="Write anything you want to remember…"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3">
              <button className="btn-outline flex-1" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary flex-1" onClick={handleAddManual} disabled={!newText.trim()}>
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Subject section ─────────────────────────────────────────
function SubjectSection({
  subject, notes, saved, onSave, onDelete,
}: {
  subject: string;
  notes: StudyNote[];
  saved: Record<string, boolean>;
  onSave: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  const missed = notes.filter((n) => n.outcome === "missed");
  const correct = notes.filter((n) => n.outcome === "correct");
  const manual = notes.filter((n) => n.outcome === "manual");

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-6 rounded-full bg-primary inline-block" />
        {subject}
        <span className="text-sm font-normal text-muted-foreground">({notes.length})</span>
      </h2>

      {missed.length > 0 && (
        <NoteGroup title="Missed Questions" colour="red" notes={missed} saved={saved} onSave={onSave} onDelete={onDelete} />
      )}
      {correct.length > 0 && (
        <NoteGroup title="Correct Questions" colour="green" notes={correct} saved={saved} onSave={onSave} onDelete={onDelete} />
      )}
      {manual.length > 0 && (
        <NoteGroup title="Manual Notes" colour="blue" notes={manual} saved={saved} onSave={onSave} onDelete={onDelete} />
      )}
    </div>
  );
}

// ── Collapsible group ───────────────────────────────────────
function NoteGroup({
  title, colour, notes, saved, onSave, onDelete,
}: {
  title: string;
  colour: "red" | "green" | "blue";
  notes: StudyNote[];
  saved: Record<string, boolean>;
  onSave: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);

  const headerColour = {
    red: "text-red-600 bg-red-50 border-red-200",
    green: "text-green-700 bg-green-50 border-green-200",
    blue: "text-primary bg-primary/5 border-primary/20",
  }[colour];

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border font-semibold text-sm mb-2 ${headerColour}`}
      >
        <span className="flex items-center gap-2">
          {colour === "red" && <XCircle className="w-4 h-4" />}
          {colour === "green" && <CheckCircle2 className="w-4 h-4" />}
          {colour === "blue" && <StickyNote className="w-4 h-4" />}
          {title} ({notes.length})
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="space-y-3 pl-1">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} isSaved={saved[note.id] ?? false} onSave={onSave} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Individual note card ────────────────────────────────────
function NoteCard({
  note, isSaved, onSave, onDelete,
}: {
  note: StudyNote;
  isSaved: boolean;
  onSave: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  const [localText, setLocalText] = useState(note.personalNote);
  const [expanded, setExpanded] = useState(false);

  const outcomeColour =
    note.outcome === "missed"
      ? "bg-red-50 border-red-200"
      : note.outcome === "correct"
      ? "bg-green-50 border-green-200"
      : "bg-muted border-border";

  return (
    <div className={`rounded-2xl border p-4 ${outcomeColour}`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            note.outcome === "missed" ? "bg-red-100 text-red-700"
            : note.outcome === "correct" ? "bg-green-100 text-green-700"
            : "bg-primary/10 text-primary"
          }`}>
            {note.outcome === "missed" ? "✗ Missed" : note.outcome === "correct" ? "✓ Correct" : "📝 Manual"}
          </span>
          <span className="text-xs text-muted-foreground">{SOURCE_LABEL[note.source]}</span>
          <span className="text-xs text-muted-foreground">{new Date(note.timestamp).toLocaleDateString()}</span>
        </div>
        <button onClick={() => onDelete(note.id)} className="text-muted-foreground hover:text-red-500 shrink-0 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Question text (if any) */}
      {note.questionText && (
        <p className="text-sm font-semibold mb-2 leading-snug">{note.questionText}</p>
      )}

      {/* Options (expandable) */}
      {note.options && note.outcome !== "manual" && (
        <div className="mb-2">
          <button
            className="text-xs text-primary font-medium flex items-center gap-1 mb-1"
            onClick={() => setExpanded((p) => !p)}
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? "Hide options" : "Show options"}
          </button>
          {expanded && (
            <div className="space-y-1">
              {(["A", "B", "C", "D"] as const).map((opt) => {
                const text = note.options?.[opt];
                if (!text) return null;
                const isCorrect = opt === note.correctAnswer;
                const isSelected = opt === note.userAnswer;
                return (
                  <div
                    key={opt}
                    className={`flex gap-2 px-3 py-1.5 rounded-lg text-xs ${
                      isCorrect ? "bg-green-100 text-green-800 font-semibold"
                      : isSelected && !isCorrect ? "bg-red-100 text-red-700"
                      : "bg-background/60"
                    }`}
                  >
                    <span className="font-bold">{opt}.</span>
                    <span>{text}</span>
                    {isCorrect && <span className="ml-auto">✓</span>}
                    {isSelected && !isCorrect && <span className="ml-auto">✗</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {note.explanation && (
        <div className="text-xs bg-background/70 rounded-lg px-3 py-2 mb-3 border border-border/50">
          <span className="font-semibold">Explanation: </span>
          {note.explanation}
        </div>
      )}

      {/* Personal notes textarea */}
      <textarea
        className="input-area w-full rounded-xl p-2.5 text-xs resize-y min-h-16 mb-2"
        placeholder="Add your own notes here…"
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Personal notes</span>
        <button
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            isSaved ? "bg-green-100 text-green-700" : "btn-primary text-xs py-1.5"
          }`}
          onClick={() => onSave(note.id, localText)}
          disabled={isSaved}
        >
          {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {isSaved ? "Saved!" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ── Empty state ─────────────────────────────────────────────
function EmptyState({ subject, onAdd }: { subject: string; onAdd: () => void }) {
  return (
    <div className="text-center py-20">
      <BookMarked className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
      <p className="font-semibold text-lg mb-1">No notes yet{subject !== "All" ? ` for ${subject}` : ""}</p>
      <p className="text-sm text-muted-foreground mb-6">
        Notes are auto-saved as you answer questions in CBT and Drill. You can also add manual notes.
      </p>
      <button className="btn-primary flex items-center gap-2 mx-auto" onClick={onAdd}>
        <Plus className="w-4 h-4" /> Add Manual Note
      </button>
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────
function outcomeColourActive(o: string) {
  if (o === "missed") return "border-red-400 bg-red-50 text-red-700";
  if (o === "correct") return "border-green-400 bg-green-50 text-green-700";
  if (o === "manual") return "border-primary bg-primary/10 text-primary";
  return "border-primary bg-primary/10 text-primary";
}
