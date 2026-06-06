import { UserData } from "@/lib/store";
import { fmt, fmtL, compoundGrowth } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Home,
  Tv,
  HeartPulse,
} from "lucide-react";

interface InsightsPanelProps {
  data: UserData;
  compact?: boolean;
}

type InsightType = "good" | "warn" | "danger" | "info";

interface Insight {
  type: InsightType;
  text: string;
}

const COLORS: Record<
  InsightType,
  { bg: string; text: string; icon: typeof CheckCircle }
> = {
  good: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle },
  warn: { bg: "bg-amber-50", text: "text-amber-600", icon: AlertTriangle },
  danger: { bg: "bg-red-50", text: "text-red-500", icon: AlertTriangle },
  info: { bg: "bg-blue-50", text: "text-blue-600", icon: Info },
};

export default function InsightsPanel({
  data,
  compact = false,
}: InsightsPanelProps) {
  const { salary, otherIncome, expenses, savingsGoal } = data;
  const totalIncome = salary + otherIncome;
  const totalExp = Object.values(expenses).reduce(
    (a, b) => a + (Number(b) || 0),
    0,
  );
  const canSave = totalIncome - totalExp;
  const savingsRate = canSave / totalIncome;
  const rentRatio = (Number(expenses.rent) || 0) / totalIncome;

  const insights: Insight[] = [];

  if (savingsRate < 0.1)
    insights.push({
      type: "danger",
      text: `Savings rate is below 10%. Try cutting non-essential expenses.`,
    });

  if (savingsRate >= 0.2)
    insights.push({
      type: "good",
      text: `You're saving ${Math.round(savingsRate * 100)}% of income — ahead of 80% of Indians.`,
    });

  if (rentRatio > 0.35)
    insights.push({
      type: "warn",
      text: `Rent is ${Math.round(rentRatio * 100)}% of income. Ideal is ≤30%.`,
    });

  if ((Number(expenses.entertainment) || 0) > totalIncome * 0.08)
    insights.push({
      type: "warn",
      text: `Entertainment spend is high. Trimming ₹1000/mo = ₹1.2L extra in 5 years.`,
    });

  if (!expenses.health || Number(expenses.health) < 500)
    insights.push({
      type: "info",
      text: `No health budget detected. Medical emergencies can wipe savings.`,
    });

  if (canSave > 0)
    insights.push({
      type: "good",
      text: `Investing ${fmt(canSave)}/mo in Nifty 50 = ${fmtL(compoundGrowth(canSave, 13.5, 10))} in 10 years.`,
    });

  return (
    <div
      className={
        compact ? "" : "bg-white rounded-2xl border border-gray-100 p-6"
      }
    >
      {/* Title */}
      {/* Title — hide when compact */}
      {!compact && (
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <TrendingUp size={16} className="text-green-700" />
          </div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
            Smart Insights
          </h3>
        </div>
      )}

      {/* Insight cards */}
      <div className="flex flex-col gap-3">
        {insights.map((insight, i) => {
          const { bg, text, icon: Icon } = COLORS[insight.type];
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl ${bg}`}
            >
              <Icon size={16} className={`mt-0.5 shrink-0 ${text}`} />
              <p className={`text-sm leading-relaxed ${text}`}>
                {insight.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
