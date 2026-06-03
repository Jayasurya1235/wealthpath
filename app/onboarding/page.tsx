"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useWealthStore } from "@/lib/store";
import StepProgress from "@/components/onboarding/StepProgress";
import StepWelcome from "@/components/onboarding/StepWelcome";
import StepIncome from "@/components/onboarding/StepIncome";
import StepExpenses from "@/components/onboarding/StepExpenses";
import StepGoals from "@/components/onboarding/StepGoals";

const STEPS = ["Welcome", "Income", "Expenses", "Goals"];

export default function OnboardingPage() {
  const router = useRouter();
  const { setUserData } = useWealthStore();

  const [currentStep, setCurrentStep] = useState(0);

  // Step 0 — Welcome
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  // Step 1 — Income
  const [salary, setSalary] = useState("");
  const [otherIncome, setOtherIncome] = useState("");

  // Step 2 — Expenses
  const [expenses, setExpenses] = useState<Record<string, string>>({});

  // Step 3 — Goals
  const [savingsGoal, setSavingsGoal] = useState("");
  const [goalLabel, setGoalLabel] = useState("House");
  const [riskProfile, setRiskProfile] = useState("moderate");

  function handleExpenseChange(id: string, val: string) {
    setExpenses((prev) => ({ ...prev, [id]: val }));
  }

  // Check if current step has valid data
  const totalExp = Object.values(expenses).reduce(
    (a, b) => a + (Number(b) || 0),
    0,
  );
  const canSave = (Number(salary) || 0) - totalExp;

  const isStepValid = [
    name.trim().length > 0 && Number(age) >= 18,
    Number(salary) > 0,
    totalExp > 0,
    Number(savingsGoal) > 0,
  ];

  function handleNext() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  // Called when user finishes all steps
  function handleFinish() {
    setUserData({
      name,
      age: Number(age),
      salary: Number(salary),
      otherIncome: Number(otherIncome),
      expenses,
      savingsGoal: Number(savingsGoal),
      goalLabel,
      riskProfile,
    });
    router.push("/dashboard");
  }

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-[#e8f5e9] flex flex-col items-center justify-center p-4">
      {/* Progress bar */}
      <StepProgress currentStep={currentStep} steps={STEPS} />

      {/* Card */}
      <Card className="w-full max-w-md shadow-md">
        <CardContent className="p-8">
          {/* Active step */}
          {currentStep === 0 && (
            <StepWelcome
              name={name}
              age={age}
              onNameChange={setName}
              onAgeChange={setAge}
            />
          )}

          {currentStep === 1 && (
            <StepIncome
              salary={salary}
              otherIncome={otherIncome}
              onSalaryChange={setSalary}
              onOtherIncomeChange={setOtherIncome}
            />
          )}

          {currentStep === 2 && (
            <StepExpenses
              salary={salary}
              expenses={expenses}
              onExpenseChange={handleExpenseChange}
            />
          )}

          {currentStep === 3 && (
            <StepGoals
              salary={salary}
              expenses={expenses}
              savingsGoal={savingsGoal}
              goalLabel={goalLabel}
              riskProfile={riskProfile}
              onSavingsGoalChange={setSavingsGoal}
              onGoalLabelChange={setGoalLabel}
              onRiskProfileChange={setRiskProfile}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 gap-3">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back
              </Button>
            ) : (
              <div />
            )}

            {isLastStep ? (
              <Button
                onClick={handleFinish}
                disabled={!isStepValid[currentStep]}
                className="bg-[#1a4731] hover:bg-[#143a28] text-white flex items-center gap-2 ml-auto cursor-pointer"
              >
                <CheckCircle size={16} />
                Build My Plan
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid[currentStep]}
                className="bg-[#1a4731] hover:bg-[#143a28] text-white flex items-center gap-2 ml-auto cursor-pointer"
              >
                Continue
                <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
