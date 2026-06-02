import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fmt } from "@/lib/utils";
import { Briefcase, PiggyBank, IndianRupee } from "lucide-react";

interface StepIncomeProps {
  salary: string;
  otherIncome: string;
  onSalaryChange: (val: string) => void;
  onOtherIncomeChange: (val: string) => void;
}

export default function StepIncome({
  salary,
  otherIncome,
  onSalaryChange,
  onOtherIncomeChange,
}: StepIncomeProps) {
  const totalIncome = (Number(salary) || 0) + (Number(otherIncome) || 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
          <Briefcase size={24} className="text-green-700" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Your Monthly Income
        </h2>
        <p className="text-sm text-gray-500">
          Enter your take-home salary (after tax & PF deductions).
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-5">
        <div>
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Monthly Take-Home Salary (₹)
          </Label>
          <div className="relative mt-1">
            <IndianRupee
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              type="number"
              placeholder="e.g. 65000"
              value={salary}
              onChange={(e) => onSalaryChange(e.target.value)}
              className="bg-[#f0f9f0] border-gray-200 pl-9"
            />
          </div>
          {Number(salary) > 0 && (
            <p className="text-xs text-green-700 font-medium mt-1">
              Annual: {fmt(Number(salary) * 12)} / year
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Other Monthly Income (optional)
          </Label>
          <div className="relative mt-1">
            <PiggyBank
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              type="number"
              placeholder="Freelance, rent income, etc."
              value={otherIncome}
              onChange={(e) => onOtherIncomeChange(e.target.value)}
              className="bg-[#f0f9f0] border-gray-200 pl-9"
            />
          </div>
        </div>

        {/* Total income box */}
        {totalIncome > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
              <IndianRupee size={18} className="text-green-700" />
            </div>
            <div>
              <span className="text-green-800 font-bold text-lg">
                Total: {fmt(totalIncome)}/month
              </span>
              <p className="text-green-600 text-xs">
                {fmt(totalIncome * 12)}/year
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
