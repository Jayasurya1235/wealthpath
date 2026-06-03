import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#e8f5e9] flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
        <TrendingUp size={32} className="text-green-700" />
      </div>

      <h1 className="text-4xl font-black text-gray-900 mb-2">404</h1>

      <p className="text-gray-500 mb-8">This page doesn't exist</p>

      <Link
        href="/sign-in"
        className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
      >
        ← Back to Sign In
      </Link>
    </div>
  );
}
