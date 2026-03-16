import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PenTool, BoxSelect, Sparkles, Moon, Sun } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    // (#fafaf9) in light mode, (#313338) in dark mode
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#313338] text-zinc-900 dark:text-gray-100 transition-colors duration-300 flex flex-col font-sans">
      {/* navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl w-full mx-auto">
        <div className="text-2xl font-black tracking-tight">noted.</div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-[#2b2d31] transition"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* hero sect */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto mt-12 mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium rounded-full bg-zinc-200 dark:bg-[#2b2d31] text-zinc-800 dark:text-zinc-300">
          <Sparkles size={14} className="text-[#5865F2]" />
          <span>AI-Powered Canvas Demo</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
          Note-taking at the <br className="hidden md:block" /> speed of
          thought.
        </h1>

        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl leading-relaxed">
          Keep up with the lecture. Use natural stylus gestures to trigger AI
          directly on your canvas. Underline to define. Box to solve. Your
          notes, instantly smarter.
        </p>

        {/* lets go demo button */}
        <button
          onClick={() => navigate("/backpack")}
          className="px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          Let's Go
        </button>

        {/* teaser */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24 text-left w-full">
          <div className="p-6 rounded-2xl border-2 border-zinc-200 dark:border-[#1e1f22] bg-white dark:bg-[#2b2d31]">
            <PenTool className="text-[#5865F2] mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Underline to Define</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Mark complex terms like "Chromatic Scale" and context-aware
              definitions will appear right alongside your handwriting.
            </p>
          </div>
          <div className="p-6 rounded-2xl border-2 border-zinc-200 dark:border-[#1e1f22] bg-white dark:bg-[#2b2d31]">
            <BoxSelect className="text-[#5865F2] mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Box to Solve</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Draw a box around an integral or polynomial. Noted generates
              step-by-step examples based on your exact equation.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
