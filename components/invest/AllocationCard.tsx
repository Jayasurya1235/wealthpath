import { fmt } from "@/lib/utils";
import { PieChart, Lightbulb } from "lucide-react";

interface Allocation {
  label: string;
  pct: number;
  color: string;
}

interface AllocationCardProps {
  riskProfile: string;
  investAmount: number;
}

const ALLOCATIONS: Record<string, Allocation[]> = {
  conservative: [
    { label: "Fixed Deposit", pct: 40, color: "#4ecdc4" },
    { label: "PPF", pct: 30, color: "#45b7d1" },
    { label: "Mutual Fund SIP", pct: 20, color: "#00d4aa" },
    { label: "NPS", pct: 10, color: "#a29bfe" },
  ],
  moderate: [
    { label: "Mutual Fund SIP", pct: 40, color: "#00d4aa" },
    { label: "Nifty 50 Index Fund", pct: 25, color: "#f5c842" },
    { label: "PPF", pct: 20, color: "#45b7d1" },
    { label: "Fixed Deposit", pct: 15, color: "#4ecdc4" },
  ],
  aggressive: [
    { label: "Direct Stocks", pct: 40, color: "#fd79a8" },
    { label: "Nifty 50 Index Fund", pct: 35, color: "#f5c842" },
    { label: "Mutual Fund SIP", pct: 15, color: "#00d4aa" },
    { label: "NPS", pct: 10, color: "#a29bfe" },
  ],
};

export default function AllocationCard({
  riskProfile,
  investAmount,
}: AllocationCardProps) {
  const allocation = ALLOCATIONS[riskProfile] || ALLOCATIONS.moderate;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
          <PieChart size={16} className="text-green-700" />
        </div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
          Suggested Portfolio —{" "}
          {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}
        </h3>
      </div>

      {/* Allocation bars */}
      <div className="flex flex-col gap-4">
        {allocation.map((a) => (
          <div key={a.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-semibold text-gray-700">{a.label}</span>
              <span className="font-bold" style={{ color: a.color }}>
                {a.pct}% · {fmt((investAmount * a.pct) / 100)}/mo
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${a.pct}%`, background: a.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="mt-5 flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3">
        <Lightbulb size={15} className="text-green-700 mt-0.5 shrink-0" />
        <p className="text-xs text-green-700 leading-relaxed">
          Diversification reduces risk. Never put all money in one instrument.
        </p>
      </div>
    </div>
  );
}
