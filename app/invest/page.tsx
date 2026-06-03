"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWealthStore } from "@/lib/store";
import { fmt, fmtL, compoundGrowth } from "@/lib/utils";
import { INVESTMENT_OPTIONS } from "@/lib/constants";
import GrowthChart from "@/components/invest/GrowthChart";
import AllocationCard from "@/components/invest/AllocationCard";
import RetirementCard from "@/components/invest/RetirementCard";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ArrowLeft,
  IndianRupee,
  Wallet,
  BarChart2,
  Sparkles,
} from "lucide-react";

export default function InvestPage() {
  const router = useRouter();
  const { userData } = useWealthStore();

  const [selectedId, setSelectedId] = useState("mf");
  const [years, setYears] = useState(10);

  useEffect(() => {
    if (!userData) router.push("/onboarding");
  }, [userData, router]);

  if (!userData) return null;

  const { salary, otherIncome, expenses, savingsGoal, riskProfile, age } =
    userData;
  const totalIncome = salary + otherIncome;
  const totalExp = Object.values(expenses).reduce(
    (a, b) => a + (Number(b) || 0),
    0,
  );
  const canSave = totalIncome - totalExp;
  const investAmount = Math.min(savingsGoal, canSave);

  const selectedInv =
    INVESTMENT_OPTIONS.find((i) => i.id === selectedId) ||
    INVESTMENT_OPTIONS[2];
  const finalValue = compoundGrowth(investAmount, selectedInv.rate, years);
  const invested = investAmount * 12 * years;
  const gains = finalValue - invested;

  return (
    <div className="min-h-screen bg-[#f0f9f0]">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg">WealthPath</span>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">
            Investment Planner
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            See how your money grows over time
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={16} className="text-green-700" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Investing
              </span>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {fmt(investAmount)}
            </p>
            <p className="text-xs text-gray-400 mt-1">per month</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee size={16} className="text-blue-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Total Invested
              </span>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {fmtL(invested)}
            </p>
            <p className="text-xs text-gray-400 mt-1">over {years} years</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 size={16} className="text-purple-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Wealth Created
              </span>
            </div>
            <p
              className="text-2xl font-black"
              style={{ color: selectedInv.color }}
            >
              {fmtL(finalValue)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              at {selectedInv.rate}% CAGR
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Returns Earned
              </span>
            </div>
            <p className="text-2xl font-black text-green-700">{fmtL(gains)}</p>
            <p className="text-xs text-gray-400 mt-1">pure interest gains</p>
          </div>
        </div>

        {/* Investment option selector */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
            Choose Investment Type
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {INVESTMENT_OPTIONS.map((inv) => {
              const Icon = inv.icon;
              const isSelected = selectedId === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedId(inv.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${
                      isSelected
                        ? "border-green-700 bg-green-50"
                        : "border-gray-100 hover:border-green-200"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${inv.color}22` }}
                    >
                      <Icon size={14} style={{ color: inv.color }} />
                    </div>
                    <span
                      className={`text-sm font-bold ${isSelected ? "text-green-700" : "text-gray-700"}`}
                    >
                      {inv.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {inv.risk} risk
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: inv.color }}
                    >
                      {inv.rate}% CAGR
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{inv.horizon}</p>
                </div>
              );
            })}
          </div>

          {/* Year slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Investment Duration
              </label>
              <span className="text-sm font-black text-green-700">
                {years} Years
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-green-700"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1 yr</span>
              <span>30 yrs</span>
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GrowthChart
            investAmount={investAmount}
            years={years}
            selectedInvestment={selectedInv}
          />
          <AllocationCard
            riskProfile={riskProfile}
            investAmount={investAmount}
          />
        </div>

        {/* Retirement card */}
        <RetirementCard
          age={age}
          investAmount={investAmount}
          rate={selectedInv.rate}
        />
      </div>
    </div>
  );
}
