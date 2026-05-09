import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  durationSeconds: number;
  onExpire: () => void;
  running?: boolean;
}

export default function Timer({ durationSeconds, onExpire, running = true }: TimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    setRemaining(durationSeconds);
    expiredRef.current = false;
  }, [durationSeconds]);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, running, onExpire]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = (remaining / durationSeconds) * 100;

  const colour =
    pct > 50 ? "text-green-600" : pct > 20 ? "text-amber-500" : "text-red-500";

  const bg =
    pct > 50 ? "bg-green-100 border-green-300" : pct > 20 ? "bg-amber-50 border-amber-300" : "bg-red-50 border-red-300";

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-lg ${bg} ${colour}`}>
      <Clock className="w-5 h-5" />
      <span>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}
