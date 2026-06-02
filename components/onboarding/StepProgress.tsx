interface StepProgressProps {
  currentStep: number;
  steps: string[];
}

export default function StepProgress({
  currentStep,
  steps,
}: StepProgressProps) {
  return (
    <div className="w-full max-w-md mb-8">
      {/* Step labels and circles */}
      <div className="flex justify-between mb-3">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${
                i < currentStep
                  ? "bg-green-700 text-white"
                  : i === currentStep
                    ? "bg-green-700 text-white ring-4 ring-green-200"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
              }`}
            >
              {i < currentStep ? "✓" : i + 1}
            </div>
            <span
              className={`text-[10px] font-medium ${i === currentStep ? "text-green-700" : "text-gray-400"}`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full">
        <div
          className="h-full bg-green-700 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
