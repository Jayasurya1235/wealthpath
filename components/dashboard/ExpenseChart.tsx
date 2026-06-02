"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { UserData } from "@/lib/store";
import { fmt } from "@/lib/utils";
import { PieChart as PieChartIcon } from "lucide-react";

interface ExpenseChartProps {
  data: UserData;
}

const COLORS = [
  "#00d4aa",
  "#f5c842",
  "#ff9f43",
  "#ff5c5c",
  "#a29bfe",
  "#45b7d1",
  "#fd79a8",
  "#4ecdc4",
  "#6c5ce7",
  "#00b894",
  "#e17055",
  "#74b9ff",
];

export default function ExpenseChart({ data }: ExpenseChartProps) {
  const pieData = EXPENSE_CATEGORIES.filter(
    (cat) => Number(data.expenses[cat.id]) > 0,
  ).map((cat, i) => ({
    name: cat.label,
    value: Number(data.expenses[cat.id]),
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
          <PieChartIcon size={16} className="text-green-700" />
        </div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
          Expense Breakdown
        </h3>
      </div>

      {/* Chart */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => fmt(Number(value))}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #f0f0f0",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {pieData.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: entry.color }}
            />
            <span className="text-xs text-gray-500 truncate">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
