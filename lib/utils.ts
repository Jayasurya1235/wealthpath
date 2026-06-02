import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const fmtL = (n: number) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
      ? `₹${(n / 1000).toFixed(0)}K`
      : `₹${n}`;

export const compoundGrowth = (
  monthly: number,
  rate: number,
  years: number,
) => {
  const r = rate / 100 / 12;
  return monthly * ((Math.pow(1 + r, years * 12) - 1) / r) * (1 + r);
};

export const calcScore = (
  salary: number,
  expenses: Record<string, string>,
  savingsGoal: number,
) => {
  if (!salary) return 0;
  const totalExp = Object.values(expenses).reduce(
    (a, b) => a + (Number(b) || 0),
    0,
  );
  const savingsRate = (salary - totalExp) / salary;
  const savingsGoalRate = savingsGoal / salary;

  let score = 0;
  if (savingsRate >= 0.3) score += 40;
  else if (savingsRate >= 0.2) score += 30;
  else if (savingsRate >= 0.1) score += 18;
  else if (savingsRate > 0) score += 8;

  const rentRatio = (Number(expenses.rent) || 0) / salary;
  if (rentRatio <= 0.25) score += 20;
  else if (rentRatio <= 0.3) score += 14;
  else if (rentRatio <= 0.4) score += 7;

  if (savingsGoalRate >= 0.2) score += 20;
  else if (savingsGoalRate >= 0.1) score += 12;
  else if (savingsGoalRate > 0) score += 6;

  const canBuildEmergency = (salary - totalExp) * 6 >= salary * 6 * 0.5;
  score += canBuildEmergency ? 20 : 8;

  return Math.min(100, Math.round(score));
};

export const scoreLabel = (s: number) => {
  if (s >= 80) return { label: "Excellent", color: "#00d4aa" };
  if (s >= 60) return { label: "Good", color: "#4ecdc4" };
  if (s >= 40) return { label: "Fair", color: "#ff9f43" };
  return { label: "Needs Work", color: "#ff5c5c" };
};
