import { fmtL, compoundGrowth } from "@/lib/utils";
import { Clock, TrendingUp, IndianRupee, AlertTriangle } from "lucide-react";

interface RetirementCardProps {
  age: number;
  investAmount: number;
  rate: number;
}

export default function RetirementCard({
  age,
  investAmount,
  rate,
}: RetirementCardProps) {
  const yearsToRetire = Math.max(0, 60 - age);
  const corpus = compoundGrowth(investAmount, rate, yearsToRetire);
  const monthlyPension = corpus * 0.004;
  const costOfWaiting =
    corpus - compoundGrowth(investAmount, rate, yearsToRetire - 5);

  const stats = [
    {
      icon: Clock,
      color: "#f5c842",
      label: "Years to retirement",
      value: `${yearsToRetire} yrs`,
    },
    {
      icon: TrendingUp,
      color: "#00d4aa",
      label: "Corpus if you start now",
      value: fmtL(corpus),
    },
    {
      icon: IndianRupee,
      color: "#a29bfe",
      label: "Monthly pension possible",
      value: `${fmtL(monthlyPension)}/mo`,
      sub: "at 4% safe withdrawal rate",
    },
    {
      icon: AlertTriangle,
      color: "#ff5c5c",
      label: "Cost of waiting 5 years",
      value: `-${fmtL(costOfWaiting)}`,
      sub: "Start today, not tomorrow",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-6">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <Clock size={16} className="text-amber-600" />
        </div>
        <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wide">
          Retirement Projection (Age 60)
        </h3>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color: s.color }} />
                <span className="text-xs text-gray-400 font-medium">
                  {s.label}
                </span>
              </div>
              <p className="text-xl font-black" style={{ color: s.color }}>
                {s.value}
              </p>
              {s.sub && <p className="text-xs text-gray-400 mt-1">{s.sub}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
