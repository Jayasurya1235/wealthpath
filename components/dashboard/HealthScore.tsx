import { scoreLabel } from "@/lib/utils";
import { Activity } from "lucide-react";

interface HealthScoreProps {
  score: number;
  compact?: boolean;
}

export default function HealthScore({
  score,
  compact = false,
}: HealthScoreProps) {
  const { label, color } = scoreLabel(score);
  const circumference = 2 * Math.PI * (compact ? 40 : 54);
  const radius = compact ? 40 : 54;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 h-full">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
          <Activity size={14} className="text-green-700" />
        </div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Health Score
        </h3>
      </div>

      {/* Circle */}
      <div className="flex flex-col items-center">
        <div className={`relative ${compact ? "w-24 h-24" : "w-36 h-36"}`}>
          <svg
            className="w-full h-full -rotate-90"
            viewBox={`0 0 ${(radius + 10) * 2} ${(radius + 10) * 2}`}
          >
            <circle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            <circle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (score / 100) * circumference}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`font-black text-gray-900 ${compact ? "text-xl" : "text-3xl"}`}
            >
              {score}
            </span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
        </div>

        <div
          className="mt-3 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: `${color}20`, color }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
