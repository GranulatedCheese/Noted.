import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PenTool,
  BoxSelect,
  Sparkles,
  Moon,
  Sun,
  ArrowRight,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // expanded content
  const extraInfo = {
    define:
      "Panned instantly to your gesture, these descriptions support physics constants, math definitions, and complex calculus concepts, ensuring you never miss a beat during lectures.",
    solve:
      "Noted breaks down expressions, equations, and complex word problems, mapping out the necessary algebraic steps, calculus rules, or geometric logic required to reach the solution.",
  };

  return (
    <div className="relative min-h-screen bg-[#fafaf9] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 font-sans selection:bg-[#5865F2]/30 overflow-x-hidden">
      {/* bg glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5865F2]/20 via-[#5865F2]/0 to-transparent blur-[100px] pointer-events-none -z-10" />

      {/* navbar */}
      <nav className="relative z-50 flex items-center justify-between p-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
          noted.
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {isDarkMode ? (
            <Sun size={18} className="text-zinc-400 hover:text-white" />
          ) : (
            <Moon size={18} className="text-zinc-600" />
          )}
        </button>
      </nav>

      <main className="relative z-10 flex flex-col items-center pt-20 pb-32 px-6 max-w-7xl mx-auto">
        {/* hero */}
        <div className="max-w-5xl text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 text-sm font-semibold rounded-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <Sparkles size={14} className="text-[#5865F2]" />
            <span className="bg-linear-to-r from-zinc-800 to-zinc-500 dark:from-zinc-200 dark:to-zinc-500 bg-clip-text text-transparent">
              Spatial AI Canvas
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.1] mb-8 text-balance">
            Note-taking at the <br className="hidden md:block" />
            <span className="bg-linear-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500 bg-clip-text text-transparent">
              speed of thought.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl text-balance font-medium">
            Keep up with the lecture. Use natural stylus gestures to trigger AI
            directly on your canvas. Underline to define. Box to solve.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate("/backpack")}
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(88,101,242,0.4)]"
            >
              Open Backpack
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* mockup canvas */}
        <div className="relative w-full max-w-6xl mt-24">
          <div className="absolute inset-0 bg-gradient-to-b from-[#5865F2]/20 to-transparent blur-3xl rounded-full -z-10" />
          <div className="relative w-full aspect-[16/10] md:aspect-[21/9] bg-white dark:bg-[#121214] rounded-t-3xl md:rounded-3xl border border-zinc-200 dark:border-zinc-800/80 shadow-2xl overflow-hidden flex flex-col">
            <div className="h-12 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center px-4 gap-2 bg-zinc-50/50 dark:bg-[#18181b]/50">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="flex-1 relative p-8 bg-[#fafaf9] dark:bg-[#0f0f11] overflow-hidden">
              <div className="absolute top-1/4 left-1/4 font-serif text-3xl dark:text-zinc-300 transform -rotate-2">
                f(x) = ∫ e^x dx
                <div className="absolute -inset-4 border-2 border-[#5865F2] rounded-lg opacity-80" />
              </div>
              <div className="absolute top-1/4 left-[45%] w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-2 text-[#5865F2] font-bold text-sm">
                  <Sparkles size={14} /> AI Solver
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 font-serif">
                  The integral of e^x is e^x + C.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* features boxes */}
        <div className="w-full max-w-6xl mt-12 md:mt-24">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* box 1: underline/define*/}
            <div className="md:flex-[3] group relative p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-500 ease-in-out hover:md:flex-[5] overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <PenTool size={120} className="text-[#5865F2] rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-700 shrink-0">
                  <PenTool className="text-[#5865F2]" size={24} />
                </div>
                <h3 className="text-2xl font-black mb-3 tracking-tight shrink-0">
                  Underline to Define
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-md font-medium leading-relaxed shrink-0">
                  Don't lose your place. Draw a line under complex terms and
                  context-aware definitions pin themselves to your canvas.
                </p>

                <div className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed transition-all duration-500 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-96 ease-in-out">
                  {extraInfo.define}
                </div>
              </div>
            </div>

            {/* box 2: solve */}
            <div className="md:flex-[2] group relative p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-500 ease-in-out hover:md:flex-[5] overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <BoxSelect size={120} className="text-[#5865F2] -rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-700 shrink-0">
                  <BoxSelect className="text-[#5865F2]" size={24} />
                </div>
                <h3 className="text-2xl font-black mb-3 tracking-tight shrink-0">
                  Box to Solve
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed shrink-0">
                  Enclose any equation. AI extracts the logic and maps out the
                  step-by-step solution instantly.
                </p>

                <div className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed transition-all duration-500 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-96 ease-in-out">
                  {extraInfo.solve}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
