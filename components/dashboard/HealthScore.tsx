import { scoreLabel } from "@/lib/utils";
import { Activity } from "lucide-react";

interface HealthScoreProps {
  score: number;
}

export default function HealthScore({ score }: HealthScoreProps) {
  const { label, color } = scoreLabel(score);
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
          <Activity size={16} className="text-green-700" />
        </div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
          Financial Health Score
        </h3>
      </div>

      {/* Circle */}
      <div className="flex flex-col items-center">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="10"
            />
            {/* Score circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (score / 100) * circumference}
              className="transition-all duration-700"
            />
          </svg>
          {/* Score number in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-gray-900">{score}</span>
            <span className="text-xs text-gray-400 font-medium">
              out of 100
            </span>
          </div>
        </div>

        {/* Label badge */}
        <div
          className="mt-4 px-4 py-1.5 rounded-full text-sm font-bold"
          style={{ background: `${color}20`, color }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
