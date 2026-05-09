import { useState } from "react";
import { syllabus, practicalExamGuide, SyllabusSubject } from "../data/syllabus";
import { ChevronDown, ChevronRight, BookOpen, FlaskConical, Lightbulb, Star, Beaker, CheckCircle2, GraduationCap, ClipboardList } from "lucide-react";

const COLOUR_MAP: Record<string, string> = {
  red:    "bg-red-50 border-red-200 text-red-700",
  amber:  "bg-amber-50 border-amber-200 text-amber-700",
  rose:   "bg-rose-50 border-rose-200 text-rose-700",
  green:  "bg-green-50 border-green-200 text-green-700",
  purple: "bg-purple-50 border-purple-200 text-purple-700",
  lime:   "bg-lime-50 border-lime-200 text-lime-700",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
};

const BADGE_MAP: Record<string, string> = {
  red:    "bg-red-100 text-red-700",
  amber:  "bg-amber-100 text-amber-700",
  rose:   "bg-rose-100 text-rose-700",
  green:  "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
  lime:   "bg-lime-100 text-lime-700",
  indigo: "bg-indigo-100 text-indigo-700",
};

type View = "subjects" | "practical" | string;

export default function Syllabus() {
  const [view, setView] = useState<View>("subjects");
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const selectedSubject = syllabus.find((s) => s.id === view) ?? null;

  const toggleTopic = (key: string) =>
    setExpandedTopics((p) => ({ ...p, [key]: !p[key] }));

  const toggleSection = (key: string) =>
    setExpandedSections((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <GraduationCap className="w-6 h-6" /> Study Outline
        </h1>
        <p className="text-muted-foreground text-sm">
          Comprehensive MLS 300–400 level curriculum — topics, methods, must-know facts and practical guides.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setView("subjects")}
          className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
            view === "subjects" ? "border-primary bg-primary/10" : "border-border"
          }`}
        >
          All Subjects
        </button>
        {syllabus.map((s) => (
          <button
            key={s.id}
            onClick={() => setView(s.id)}
            className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all flex items-center gap-1.5 ${
              view === s.id ? "border-primary bg-primary/10" : "border-border"
            }`}
          >
            <span>{s.icon}</span>
            <span className="hidden sm:inline">{s.name.split(" ")[0]}</span>
          </button>
        ))}
        <button
          onClick={() => setView("practical")}
          className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all flex items-center gap-1.5 ${
            view === "practical" ? "border-primary bg-primary/10" : "border-border"
          }`}
        >
          <Beaker className="w-4 h-4" />
          <span className="hidden sm:inline">Practical Guide</span>
          <span className="sm:hidden">Practical</span>
        </button>
      </div>

      {/* All Subjects Overview */}
      {view === "subjects" && (
        <div className="grid md:grid-cols-2 gap-4">
          {syllabus.map((s) => (
            <button
              key={s.id}
              onClick={() => setView(s.id)}
              className={`text-left rounded-2xl p-5 border-2 transition-all hover:shadow-md ${COLOUR_MAP[s.colour]}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-bold text-base">{s.name}</p>
                  <p className="text-xs opacity-75">{s.topics.length} topic areas</p>
                </div>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">{s.overview}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium">
                <span>Explore syllabus</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Practical Exam Guide */}
      {view === "practical" && (
        <div className="space-y-4">
          <div className="focus-card rounded-2xl p-5 mb-4">
            <p className="font-semibold mb-1 flex items-center gap-2"><ClipboardList className="w-4 h-4" />Practical Examination Format</p>
            <p className="text-sm">{practicalExamGuide.overview}</p>
          </div>
          {practicalExamGuide.departments.map((dept, i) => (
            <div key={i} className="perf-card rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => toggleSection(String(i))}
              >
                <p className="font-bold">{dept.name}</p>
                {expandedSections[String(i)] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSections[String(i)] && (
                <div className="px-5 pb-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Expected Tasks</p>
                  <ul className="space-y-2 mb-4">
                    {dept.tasks.map((task, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {task}
                      </li>
                    ))}
                  </ul>
                  {dept.structuredAnswerExpected && (
                    <div className="explanation-box rounded-xl p-3 text-sm">
                      <p className="font-semibold mb-1">Expected Answer Format</p>
                      <p className="text-muted-foreground">{dept.structuredAnswerExpected}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Individual Subject View */}
      {selectedSubject && (
        <SubjectView
          subject={selectedSubject}
          expandedTopics={expandedTopics}
          onToggleTopic={toggleTopic}
          badgeClass={BADGE_MAP[selectedSubject.colour]}
          colourClass={COLOUR_MAP[selectedSubject.colour]}
        />
      )}
    </div>
  );
}

function SubjectView({
  subject,
  expandedTopics,
  onToggleTopic,
  badgeClass,
  colourClass,
}: {
  subject: SyllabusSubject;
  expandedTopics: Record<string, boolean>;
  onToggleTopic: (k: string) => void;
  badgeClass: string;
  colourClass: string;
}) {
  return (
    <div>
      {/* Header */}
      <div className={`rounded-2xl p-6 border-2 mb-6 ${colourClass}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{subject.icon}</span>
          <div>
            <h2 className="text-xl font-bold">{subject.name}</h2>
            <p className="text-sm opacity-80">{subject.topics.length} topic areas</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed opacity-85">{subject.overview}</p>
      </div>

      {/* Topics */}
      <div className="space-y-3 mb-6">
        <p className="font-bold text-lg flex items-center gap-2"><BookOpen className="w-5 h-5" />Topics to Study</p>
        {subject.topics.map((topic, ti) => {
          const key = `${subject.id}-${ti}`;
          const open = expandedTopics[key];
          return (
            <div key={ti} className="perf-card rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => onToggleTopic(key)}
              >
                <div className="flex items-center gap-2">
                  <span className={`${badgeClass} text-xs font-bold px-2 py-0.5 rounded-full`}>{ti + 1}</span>
                  <span className="font-semibold">{topic.name}</span>
                </div>
                {open ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
              </button>
              {open && (
                <div className="px-5 pb-5">
                  {/* Subtopics */}
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Key Topics</p>
                  <ul className="space-y-1.5 mb-4">
                    {topic.subtopics.map((st, si) => (
                      <li key={si} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="w-3 h-3 mt-1 shrink-0 text-primary" />
                        {st}
                      </li>
                    ))}
                  </ul>
                  {/* Exam Tips */}
                  {topic.examTips && (
                    <div className="explanation-box rounded-xl p-3 mb-3 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-1">Exam Tip</p>
                        <p className="text-sm">{topic.examTips}</p>
                      </div>
                    </div>
                  )}
                  {/* Key Methods */}
                  {topic.keyMethods && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Key Laboratory Methods</p>
                      <div className="flex flex-wrap gap-1.5">
                        {topic.keyMethods.map((m, mi) => (
                          <span key={mi} className={`${badgeClass} text-xs px-2.5 py-1 rounded-full font-medium`}>{m}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Practical Skills */}
      {subject.practicalSkills && (
        <div className="perf-card rounded-2xl p-5 mb-4">
          <p className="font-bold mb-3 flex items-center gap-2"><FlaskConical className="w-4 h-4" />Practical Skills Required</p>
          <ul className="space-y-2">
            {subject.practicalSkills.map((skill, si) => (
              <li key={si} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clinical Correlations */}
      {subject.clinicalCorrelations && (
        <div className="viva-followup rounded-2xl p-5 mb-4">
          <p className="font-bold mb-3">Clinical Correlations</p>
          <ul className="space-y-2">
            {subject.clinicalCorrelations.map((c, ci) => (
              <li key={ci} className="text-sm border-l-2 border-primary pl-3">{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Must-Know Facts */}
      {subject.mustKnowFacts && (
        <div className="focus-card rounded-2xl p-5">
          <p className="font-bold mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" />Must-Know Facts</p>
          <ul className="space-y-2">
            {subject.mustKnowFacts.map((fact, fi) => (
              <li key={fi} className="flex items-start gap-2 text-sm">
                <span className="text-amber-500 font-bold shrink-0">★</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
