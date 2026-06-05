"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWealthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Bot, User, Loader2 } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUESTION_CATEGORIES = [
  {
    category: "Expenses",
    icon: "💸",
    questions: [
      "How can I reduce my monthly expenses?",
      "Which expense category should I cut first?",
      "My rent is too high, what should I do?",
      "How do I stop overspending on entertainment?",
      "Give me a monthly budget plan based on my income",
    ],
  },
  {
    category: "Investments",
    icon: "📈",
    questions: [
      "Should I invest in SIP or FD?",
      "Is Nifty 50 index fund good for me?",
      "How much should I invest every month?",
      "What is the best investment for my risk profile?",
      "Should I start NPS for retirement?",
    ],
  },
  {
    category: "Savings",
    icon: "🏦",
    questions: [
      "How can I increase my savings rate?",
      "How long to build my emergency fund?",
      "What is the 50/30/20 rule for my income?",
      "How much should I save for retirement?",
      "Can I reach my savings goal faster?",
    ],
  },
  {
    category: "Goals",
    icon: "🎯",
    questions: [
      "How do I save for buying a house?",
      "How many years to reach financial freedom?",
      "How do I plan for my child's education?",
      "What should I do to retire early?",
      "How do I build wealth from my salary?",
    ],
  },
];

export default function AdvisorPage() {
  const router = useRouter();
  const { userData } = useWealthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userData) router.push("/onboarding");
  }, [userData, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (userData) {
      const totalIncome = userData.salary + userData.otherIncome;
      const totalExp = Object.values(userData.expenses).reduce(
        (a, b) => a + (Number(b) || 0),
        0,
      );
      const canSave = totalIncome - totalExp;
      const savingsRate = Math.round((canSave / totalIncome) * 100);

      setMessages([
        {
          role: "assistant",
          content: `Hi ${userData.name}! 👋 I am your personal AI financial advisor powered by Google Gemini.

Here is a quick summary of your finances:
- Monthly Income: ₹${totalIncome.toLocaleString()}
- Monthly Expenses: ₹${totalExp.toLocaleString()}
- You can save: ₹${canSave.toLocaleString()}/month (${savingsRate}% of income)
- Your Goal: ${userData.goalLabel}
- Risk Profile: ${userData.riskProfile}

I know your exact numbers so all my advice is personalized just for you. Choose a question below or type your own!`,
        },
      ]);
    }
  }, [userData]);

  if (!userData) return null;

  async function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

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
    <div className="min-h-screen bg-[#f0f9f0] flex flex-col">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 shrink-0">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img
              src="/assets/logo1.png"
              alt="WealthPath"
              className="h-8 w-auto object-contain"
            />
            <span className="font-black text-gray-900 text-base sm:text-lg">
              WealthPath
            </span>
          </Link>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Button>
        </div>
      </div>

      {/* Chat header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-700 flex items-center justify-center shrink-0">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-gray-900">AI Financial Advisor</h1>
            <p className="text-xs text-green-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Powered by Google Gemini · Free
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center
                ${msg.role === "user" ? "bg-green-700" : "bg-gray-100"}`}
              >
                {msg.role === "user" ? (
                  <User size={14} className="text-white" />
                ) : (
                  <Bot size={14} className="text-green-700" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "bg-green-700 text-white rounded-tr-sm"
                    : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading bubble */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-green-700" />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                <Loader2 size={16} className="text-green-700 animate-spin" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-4 shrink-0">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
              What would you like to know?
            </p>

            <div className="flex flex-col gap-4">
              {QUESTION_CATEGORIES.map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{cat.icon}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      {cat.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.questions.map((q, j) => (
                      <button
                        key={j}
                        onClick={() => sendMessage(q)}
                        className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-xl hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="bg-white border-t border-gray-100 px-4 py-4 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Input
            placeholder="Ask me anything about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="bg-[#f0f9f0] border-gray-200"
            disabled={loading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-green-700 hover:bg-green-800 text-white shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
