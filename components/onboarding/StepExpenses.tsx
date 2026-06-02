import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { fmt } from "@/lib/utils";
import { Wand2, AlertTriangle, IndianRupee } from "lucide-react";

interface StepExpensesProps {
  salary: string;
  expenses: Record<string, string>;
  onExpenseChange: (id: string, val: string) => void;
}

export default function StepExpenses({
  salary,
  expenses,
  onExpenseChange,
}: StepExpensesProps) {
  const totalExp = Object.values(expenses).reduce(
    (a, b) => a + (Number(b) || 0),
    0,
  );
  const totalIncome = Number(salary) || 0;
  const canSave = totalIncome - totalExp;

  function autofill() {
    EXPENSE_CATEGORIES.forEach((cat) => {
      const val = Math.round(totalIncome * cat.typical);
      onExpenseChange(cat.id, String(val));
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
            <IndianRupee size={24} className="text-green-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Monthly Expenses
          </h2>
          <p className="text-sm text-gray-500">
            Enter what you spend. Leave 0 if not applicable.
          </p>
        </div>

        {/* Autofill button */}
        <Button
          variant="outline"
          onClick={autofill}
          className="flex items-center gap-2 text-amber-600 border-amber-200 hover:bg-amber-50 text-xs mt-1"
        >
          <Wand2 size={14} />
          Auto-fill
        </Button>
      </div>

      {/* Expense list */}
      <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1 mb-5">
        {EXPENSE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const typical = Math.round(totalIncome * cat.typical);
          const val = Number(expenses[cat.id]) || 0;
          const isHigh = val > typical * 1.3 && typical > 0;

          return (
            <div
              key={cat.id}
              className={`rounded-xl p-3 border ${isHigh ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-gray-50"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                    <Icon size={14} className="text-green-700" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {cat.label}
                  </span>
                </div>
                {isHigh && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <AlertTriangle size={12} />
                    <span className="text-xs">High</span>
                  </div>
                )}
              </div>

              <div className="relative">
                <IndianRupee
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  type="number"
                  placeholder={
                    typical > 0 ? `Typical: ${typical.toLocaleString()}` : "0"
                  }
                  value={expenses[cat.id] || ""}
                  onChange={(e) => onExpenseChange(cat.id, e.target.value)}
                  min={0}
                  className="pl-8 bg-white border-gray-200 text-sm h-9"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Total Expenses</span>
          <span className="font-semibold text-gray-700">{fmt(totalExp)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Total Income</span>
          <span className="font-semibold text-gray-700">
            {fmt(totalIncome)}
          </span>
        </div>
        <div className="h-px bg-gray-200 my-1" />
        <div className="flex justify-between text-sm font-bold">
          <span>Can Save</span>
          <span className={canSave >= 0 ? "text-green-700" : "text-red-500"}>
            {fmt(canSave)}/mo
          </span>
        </div>
      </div>
    </div>
  );
}
