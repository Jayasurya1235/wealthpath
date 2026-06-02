import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserData {
  name: string;
  age: number;
  salary: number;
  otherIncome: number;
  expenses: Record<string, string>;
  savingsGoal: number;
  goalLabel: string;
  riskProfile: string;
}

interface WealthStore {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  clearData: () => void;
}

export const useWealthStore = create<WealthStore>()(
  persist(
    (set) => ({
      userData: null,
      setUserData: (data) => set({ userData: data }),
      clearData: () => set({ userData: null }),
    }),
    { name: "wealthpath-storage" },
  ),
);
