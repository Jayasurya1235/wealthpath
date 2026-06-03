"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWealthStore } from "@/lib/store";
import { fmt, calcScore } from "@/lib/utils";
import HealthScore from "@/components/dashboard/HealthScore";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import {
  ArrowRight,
  IndianRupee,
  PiggyBank,
  AlertCircle,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const { userData } = useWealthStore();

  useEffect(() => {
    if (!userData) router.push("/onboarding");
  }, [userData, router]);

  if (!userData) return null;

  const { name, age, salary, otherIncome, expenses, savingsGoal, riskProfile } =
    userData;
  const totalIncome = salary + otherIncome;
  const totalExp = Object.values(expenses).reduce(
    (a, b) => a + (Number(b) || 0),
    0,
  );
  const canSave = totalIncome - totalExp;
  const score = calcScore(totalIncome, expenses, savingsGoal);
  const emergencyFund = totalExp * 6;
  const monthsToEmergency =
    canSave > 0 ? Math.ceil(emergencyFund / canSave) : 0;

  return (
    <div className="min-h-screen bg-[#c3e7c3]">
      {/* Top navbar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo */}
          {/* Logo — click to go home */}
          <Link
            href="/onboarding"
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/assets/logo1.png"
              alt="WealthPath"
              className="h-8 w-auto object-contain"
            />
            <span className="font-black text-gray-900 text-base sm:text-lg">
              WealthPath
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{name}</p>
              <p className="text-xs text-gray-400">
                Age {age} ·{" "}
                {riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}{" "}
                investor
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Hello, {name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Here is your personal financial snapshot
            </p>
          </div>
          <Button
            onClick={() => router.push("/invest")}
            className="bg-green-700 hover:bg-green-800 text-white flex items-center gap-2 w-full sm:w-auto cursor-pointer"
          >
            Investment Plan
            <ArrowRight size={16} />
          </Button>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee size={16} className="text-green-700" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Monthly Income
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900">
              {fmt(totalIncome)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {fmt(totalIncome * 12)}/year
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-red-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Monthly Expenses
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900">
              {fmt(totalExp)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {Math.round((totalExp / totalIncome) * 100)}% of income
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <PiggyBank size={16} className="text-blue-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Can Save
              </span>
            </div>
            <p
              className={`text-xl sm:text-2xl font-black ${canSave >= 0 ? "text-green-700" : "text-red-500"}`}
            >
              {fmt(canSave)}
            </p>
            <p className="text-xs text-gray-400 mt-1">per month</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-amber-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Savings Goal
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900">
              {fmt(savingsGoal)}
            </p>
            <p className="text-xs text-gray-400 mt-1">monthly target</p>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Expense chart */}
          <div className="lg:col-span-1">
            <ExpenseChart data={userData} />
          </div>

          {/* Health score + Emergency fund */}
          <div className="lg:col-span-1">
            <HealthScore score={score} />

            <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-amber-500" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Emergency Fund
                </h3>
              </div>
              <p className="text-2xl font-black text-gray-900">
                {fmt(emergencyFund)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                6 months of expenses needed
              </p>
              <div className="mt-3 h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (canSave / emergencyFund) * 100 * 6)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {monthsToEmergency > 0
                  ? `~${monthsToEmergency} months to build this fund`
                  : "You can build this fund!"}
              </p>
            </div>
          </div>

          {/* Insights */}
          <div className="lg:col-span-1">
            <InsightsPanel data={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}
