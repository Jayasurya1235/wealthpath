import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GOAL_OPTIONS, RISK_OPTIONS } from "@/lib/constants";
import { fmt } from "@/lib/utils";
import { Target, Shield, TrendingUp, Rocket, IndianRupee } from "lucide-react";

interface StepGoalsProps {
  salary: string;
  expenses: Record<string, string>;
  savingsGoal: string;
  goalLabel: string;
  riskProfile: string;
  onSavingsGoalChange: (val: string) => void;
  onGoalLabelChange: (val: string) => void;
  onRiskProfileChange: (val: string) => void;
}

const RISK_ICONS = {
  conservative: Shield,
  moderate: TrendingUp,
  aggressive: Rocket,
};

export default function StepGoals({
  salary,
  expenses,
  savingsGoal,
  goalLabel,
  riskProfile,
  onSavingsGoalChange,
  onGoalLabelChange,
  onRiskProfileChange,
}: StepGoalsProps) {
  const totalExp = Object.values(expenses).reduce(
    (a, b) => a + (Number(b) || 0),
    0,
  );
  const totalIncome = Number(salary) || 0;
  const canSave = totalIncome - totalExp;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
          <Target size={24} className="text-green-700" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Goals & Risk Profile
        </h2>
        <p className="text-sm text-gray-500">
          How much do you want to save monthly, and how do you feel about risk?
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Savings target */}
        <div>
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Monthly Savings Target (₹)
          </Label>
          <div className="relative mt-1">
            <IndianRupee
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              type="number"
              placeholder={`Max possible: ₹${Math.max(0, canSave).toLocaleString()}`}
              value={savingsGoal}
              onChange={(e) => onSavingsGoalChange(e.target.value)}
              className="bg-[#f0f9f0] border-gray-200 pl-9"
            />
          </div>
          {Number(savingsGoal) > canSave && canSave > 0 && (
            <p className="text-xs text-amber-500 mt-1">
              Exceeds your available savings. Consider reducing expenses.
            </p>
          )}
          {Number(savingsGoal) > 0 && Number(savingsGoal) <= canSave && (
            <p className="text-xs text-green-700 font-medium mt-1">
              That's {Math.round((Number(savingsGoal) / totalIncome) * 100)}% of
              your income — great goal!
            </p>
          )}
        </div>

        {/* Goal pills */}
        <div>
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Primary Financial Goal
          </Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {GOAL_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => onGoalLabelChange(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${
                    goalLabel === g
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-gray-500 border-gray-200 hover:border-green-300"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Risk profile */}
        <div>
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Risk Appetite
          </Label>
          <div className="flex flex-col gap-2 mt-2">
            {RISK_OPTIONS.map((r) => {
              const Icon = RISK_ICONS[r.id as keyof typeof RISK_ICONS];
              return (
                <div
                  key={r.id}
                  onClick={() => onRiskProfileChange(r.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                    ${
                      riskProfile === r.id
                        ? "border-green-700 bg-green-50"
                        : "border-gray-100 bg-gray-50 hover:border-green-200"
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center
                    ${riskProfile === r.id ? "bg-green-700" : "bg-gray-200"}`}
                  >
                    <Icon
                      size={16}
                      className={
                        riskProfile === r.id ? "text-white" : "text-gray-500"
                      }
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold ${riskProfile === r.id ? "text-green-700" : "text-gray-700"}`}
                    >
                      {r.label}
                    </p>
                    <p className="text-xs text-gray-400">{r.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
