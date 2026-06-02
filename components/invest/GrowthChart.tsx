"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fmtL, compoundGrowth } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface GrowthChartProps {
  investAmount: number;
  years: number;
  selectedInvestment: {
    label: string;
    rate: number;
    color: string;
  };
}

export default function GrowthChart({
  investAmount,
  years,
  selectedInvestment,
}: GrowthChartProps) {
  // Build chart data year by year
  const data = Array.from({ length: years + 1 }, (_, i) => ({
    year: `Y${i}`,
    [selectedInvestment.label]: Math.round(
      compoundGrowth(investAmount, selectedInvestment.rate, i),
    ),
    "Without Investing": Math.round(investAmount * 12 * i),
    FD: Math.round(compoundGrowth(investAmount, 7.0, i)),
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
          <TrendingUp size={16} className="text-green-700" />
        </div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
          Wealth Growth Over Time
        </h3>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={selectedInvestment.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={selectedInvestment.color}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              stroke="#f1f5f9"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              stroke="#f1f5f9"
              tickFormatter={(v) => fmtL(v)}
            />
            <Tooltip
              formatter={(v, n) => [fmtL(Number(v)), n]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #f0f0f0",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area
              type="monotone"
              dataKey={selectedInvestment.label}
              stroke={selectedInvestment.color}
              fill="url(#grad1)"
              strokeWidth={2.5}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="Without Investing"
              stroke="#94a3b8"
              fill="url(#grad2)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="FD"
              stroke="#4ecdc4"
              fill="none"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
