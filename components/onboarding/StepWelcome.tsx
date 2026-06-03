import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Calendar } from "lucide-react";

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
      {/* Header — logo left, app name right */}
      <div className="flex items-center mb-3">
        {/* Logo */}
        <img
          src="/assets/logo1.png"
          alt="WealthPath"
          className="h-20 w-auto object-contain shrink-0 -ml-6"
        />

        {/* App name + welcome text */}
        <div>
          <h1 className="text-2xl font-black text-green-900 leading-tight">
            WealthPath
          </h1>
        </div>
      </div>
      

      {/* Description */}
      
      <p className="text-sm font-bold text-green-700 mb-6">Welcome</p>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        India's smartest financial planning platform. Tell us about yourself and
        we'll build your personalized wealth plan in 3 steps.
      </p>

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
              placeholder="Your Name"
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
