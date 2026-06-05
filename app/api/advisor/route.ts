import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { messages, userData } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const totalIncome = userData.salary + userData.otherIncome;
    const totalExp = Object.values(userData.expenses).reduce(
      (a: number, b) => a + (Number(b) || 0),
      0,
    );
    const canSave = totalIncome - totalExp;

    const systemContext = `
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
      - Use Indian financial context (SIP, PPF, FD, NPS, ELSS, Nifty 50)
      - Keep responses clear and easy to understand
      - Use ₹ symbol for all amounts
      - Format responses with bullet points when listing
      - Be encouraging and positive
      - Keep responses under 200 words
      - Never recommend specific individual stocks
    `;

    const history = messages
      .slice(0, -1)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemContext }],
        },
        {
          role: "model",
          parts: [
            {
              text: `Understood. I am ${userData.name}'s personal financial advisor. I have their complete profile and will give personalized advice based on their exact numbers.`,
            },
          ],
        },
        ...history,
      ],
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 },
    );
  }
}
