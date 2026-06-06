import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, userData } = await req.json();

    console.log("Groq API Key exists:", !!process.env.GROQ_API_KEY);

    const totalIncome = userData.salary + userData.otherIncome;
    const totalExp = Object.values(userData.expenses).reduce(
      (a: number, b) => a + (Number(b) || 0),
      0,
    );
    const canSave = totalIncome - totalExp;

    const systemPrompt = `
      You are a helpful personal financial advisor for an Indian user.

      Here is their complete financial profile:
      - Name: ${userData.name}
      - Age: ${userData.age} years old
      - Monthly Salary: ₹${userData.salary}
      - Other Income: ₹${userData.otherIncome}
      - Total Monthly Income: ₹${totalIncome}
      - Total Monthly Expenses: ₹${totalExp}
      - Monthly Savings Possible: ₹${canSave}
      - Monthly Savings Goal: ₹${userData.savingsGoal}
      - Primary Financial Goal: ${userData.goalLabel}
      - Risk Profile: ${userData.riskProfile}

      Expense breakdown:
      ${Object.entries(userData.expenses)
        .filter(([, v]) => Number(v) > 0)
        .map(([k, v]) => `  - ${k}: ₹${v}`)
        .join("\n")}

      Rules you must follow:
      - Always give advice specific to their exact numbers
      - Use Indian financial context (SIP, PPF, FD, NPS, Nifty 50, ELSS)
      - Keep responses clear and easy to understand
      - Use bullet points when listing items
      - Use ₹ symbol for all amounts
      - Be encouraging and positive
      - Keep responses under 150 words
      - Never recommend specific individual stocks
    `;

    // Build message history for Groq
    const chatMessages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      })),
    ];

    console.log("Sending to Groq:", messages[messages.length - 1].content);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: chatMessages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "";

    console.log("Groq response:", reply);

    if (!reply) {
      return NextResponse.json({
        reply: "I could not generate a response. Please try again.",
      });
    }

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Groq error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { reply: `Something went wrong: ${message}` },
      { status: 500 },
    );
  }
}
