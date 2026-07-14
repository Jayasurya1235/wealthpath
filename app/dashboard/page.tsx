"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWealthStore } from "@/lib/store";
import { fmt, calcScore } from "@/lib/utils";
import HealthScore from "@/components/dashboard/HealthScore";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import AIAdvisorPanel from "@/components/dashboard/AIAdvisorPanel";
import {
  ArrowRight,
  IndianRupee,
  PiggyBank,
  AlertCircle,
  Target,
  Bot,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const { userData, clearData } = useWealthStore();
  const [showAdvisor, setShowAdvisor] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearData();
    router.push("/sign-in");
  };

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
      {/* Navbar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/sign-in"
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
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center shrink-0 hover:bg-gray-50 cursor-pointer text-gray-500"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Hello, {name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Here is your personal financial snapshot
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setShowAdvisor(!showAdvisor)}
              className={`flex items-center gap-2 flex-1 sm:flex-none cursor-pointer border transition-all
                ${
                  showAdvisor
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white hover:bg-gray-50 text-green-700 border-green-200"
                }`}
            >
              <Bot size={16} />
              {showAdvisor ? "Close Advisor" : "AI Advisor"}
            </Button>
            <Button
              onClick={() => router.push("/invest")}
              className="bg-green-700 hover:bg-green-800 text-white flex items-center gap-2 flex-1 sm:flex-none cursor-pointer"
            >
              Investment Plan
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
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

        {/* ── MAIN LAYOUT ── */}
        {showAdvisor ? (
          /* ── WITH ADVISOR OPEN ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col — charts and cards */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Expense chart — full width of left col */}
              <ExpenseChart data={userData} />

              {/* Bottom row — Health Score + Emergency Fund + Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Health Score — compact */}
                <HealthScore score={score} compact={true} />

                {/* Emergency Fund */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={15} className="text-amber-500" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Emergency Fund
                    </h3>
                  </div>
                  <p className="text-xl font-black text-gray-900">
                    {fmt(emergencyFund)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">6 months needed</p>
                  <div className="mt-3 h-1.5 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{
                        width: `${Math.min(100, (canSave / emergencyFund) * 100 * 6)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {monthsToEmergency > 0
                      ? `~${monthsToEmergency} months`
                      : "Fund ready!"}
                  </p>
                </div>

                {/* Smart Insights — compact */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowRight size={15} className="text-green-700" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Insights
                    </h3>
                  </div>
                  <InsightsPanel data={userData} compact={true} />
                </div>
              </div>
            </div>

            {/* Right col — AI Advisor big panel */}
            <div className="lg:col-span-1 h-[700px]">
              <AIAdvisorPanel onClose={() => setShowAdvisor(false)} />
            </div>
          </div>
        ) : (
          /* ── WITHOUT ADVISOR ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Expense chart */}
            <div className="lg:col-span-1">
              <ExpenseChart data={userData} />
            </div>

            {/* Health score + Emergency fund */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <HealthScore score={score} />
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
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

            {/* Smart Insights */}
            <div className="lg:col-span-1">
              <InsightsPanel data={userData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
