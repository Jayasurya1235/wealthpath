"use client";

import { useState, useEffect, useRef } from "react";
import { useWealthStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Send,
  Bot,
  User,
  Loader2,
  X,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CATEGORIES = [
  {
    id: "expenses",
    label: "Expenses",
    icon: TrendingDown,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    questions: [
      "How can I reduce my monthly expenses?",
      "Which expense category should I cut first?",
      "My rent is too high, what should I do?",
      "How do I stop overspending on entertainment?",
      "Give me a budget plan based on my income",
    ],
  },
  {
    id: "investments",
    label: "Investments",
    icon: TrendingUp,
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    questions: [
      "Should I invest in SIP or FD?",
      "Is Nifty 50 index fund good for me?",
      "How much should I invest every month?",
      "What is the best investment for my risk profile?",
      "Should I start NPS for retirement?",
    ],
  },
  {
    id: "savings",
    label: "Savings",
    icon: PiggyBank,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    questions: [
      "How can I increase my savings rate?",
      "How long to build my emergency fund?",
      "What is the 50/30/20 rule for my income?",
      "How much should I save for retirement?",
      "Can I reach my savings goal faster?",
    ],
  },
  {
    id: "goals",
    label: "Goals",
    icon: Target,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    questions: [
      "How do I save for buying a house?",
      "How many years to reach financial freedom?",
      "How do I plan for my child's education?",
      "What should I do to retire early?",
      "How do I build wealth from my salary?",
    ],
  },
];

interface AIAdvisorPanelProps {
  onClose: () => void;
}

export default function AIAdvisorPanel({ onClose }: AIAdvisorPanelProps) {
  const { userData } = useWealthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (userData) {
      const totalIncome = userData.salary + userData.otherIncome;
      const totalExp = Object.values(userData.expenses).reduce(
        (a, b) => a + (Number(b) || 0),
        0,
      );
      const canSave = totalIncome - totalExp;

      setMessages([
        {
          role: "assistant",
          content: `Hi ${userData.name}! I am your AI financial advisor.

Your snapshot:
- Income: ₹${totalIncome.toLocaleString()}/month
- Can Save: ₹${canSave.toLocaleString()}/month
- Goal: ${userData.goalLabel}
- Risk: ${userData.riskProfile}

Select a category below or type your question!`,
        },
      ]);
    }
  }, [userData]);

  async function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setOpenCategory(null);

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: messageText },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          userData,
        }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I could not get a response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-green-700 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900">
              AI Financial Advisor
            </p>
            <p className="text-xs text-green-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Powered by Gemini
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all"
        >
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center
              ${msg.role === "user" ? "bg-green-700" : "bg-gray-100"}`}
            >
              {msg.role === "user" ? (
                <User size={12} className="text-white" />
              ) : (
                <Bot size={12} className="text-green-700" />
              )}
            </div>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap
              ${
                msg.role === "user"
                  ? "bg-green-700 text-white rounded-tr-sm"
                  : "bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Bot size={12} className="text-green-700" />
            </div>
            <div className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl rounded-tl-sm">
              <Loader2 size={14} className="text-green-700 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Category accordion */}
      <div className="px-4 py-3 border-t border-gray-100 shrink-0">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
          Quick Questions
        </p>

        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isOpen = openCategory === cat.id;

            return (
              <div
                key={cat.id}
                className="rounded-xl overflow-hidden border border-gray-100"
              >
                {/* Category button */}
                <button
                  onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 transition-all
                    ${isOpen ? `${cat.bg} ${cat.border} border` : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={cat.color} />
                    <span
                      className={`text-xs font-bold ${isOpen ? cat.color : "text-gray-600"}`}
                    >
                      {cat.label}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={14} className={cat.color} />
                  ) : (
                    <ChevronDown size={14} className="text-gray-400" />
                  )}
                </button>

                {/* Questions dropdown */}
                {isOpen && (
                  <div className="flex flex-col">
                    {cat.questions.map((q, j) => (
                      <button
                        key={j}
                        onClick={() => sendMessage(q)}
                        className="text-left text-xs text-gray-600 px-4 py-2 hover:bg-green-50 hover:text-green-700 border-t border-gray-100 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="bg-gray-50 border-gray-200 text-sm h-9"
            disabled={loading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-green-700 hover:bg-green-800 text-white h-9 w-9 p-0 shrink-0"
          >
            <Send size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
