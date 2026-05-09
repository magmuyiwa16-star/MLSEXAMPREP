import { MCQ } from "../data/mcqs";
import { CheckCircle, XCircle } from "lucide-react";

interface MCQCardProps {
  question: MCQ;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswer: (option: string) => void;
  answered: boolean;
}

const OPTIONS = ["A", "B", "C", "D"] as const;

export default function MCQCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  answered,
}: MCQCardProps) {
  return (
    <div className="mcq-card w-full max-w-3xl mx-auto p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <span className="tag">{question.subject}</span>
        <span className="text-sm text-muted-foreground font-medium">
          Q{questionNumber} / {totalQuestions}
        </span>
      </div>

      <p className="text-lg font-semibold leading-relaxed mb-6">{question.question}</p>

      <div className="space-y-3">
        {OPTIONS.map((opt) => {
          const value = question.options[opt];
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === question.answer;

          let optionClass = "option-btn";
          if (answered) {
            if (isCorrect) optionClass += " option-correct";
            else if (isSelected && !isCorrect) optionClass += " option-wrong";
            else optionClass += " option-neutral";
          } else if (isSelected) {
            optionClass += " option-selected";
          } else {
            optionClass += " option-default";
          }

          return (
            <button
              key={opt}
              className={optionClass}
              onClick={() => !answered && onAnswer(opt)}
              disabled={answered}
            >
              <span className="option-label">{opt}.</span>
              <span className="flex-1 text-left">{value}</span>
              {answered && isCorrect && (
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              )}
              {answered && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-5 p-4 rounded-xl explanation-box">
          <p className="text-sm font-semibold mb-1">Explanation</p>
          <p className="text-sm leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
