import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Calendar } from "lucide-react";
import { TrendingUp } from "lucide-react";

interface StepWelcomeProps {
  name: string;
  age: string;
  onNameChange: (val: string) => void;
  onAgeChange: (val: string) => void;
}

export default function StepWelcome({
  name,
  age,
  onNameChange,
  onAgeChange,
}: StepWelcomeProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
          <TrendingUp size={24} className="text-green-700" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome to WealthPath
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          India's smartest financial planning platform. Tell us about yourself
          and we'll build your personalized wealth plan in 3 steps.
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-5">
        <div>
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Your Name
          </Label>
          <div className="relative mt-1">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="e.g. Arjun Sharma"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="bg-[#f0f9f0] border-gray-200 pl-9"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Your Age
          </Label>
          <div className="relative mt-1">
            <Calendar
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              type="number"
              placeholder="e.g. 24"
              value={age}
              onChange={(e) => onAgeChange(e.target.value)}
              min={18}
              max={65}
              className="bg-[#f0f9f0] border-gray-200 pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
