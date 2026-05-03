import { useState, useEffect } from "react";
import { Settings, X, Key, Moon, Sun, Palette } from "lucide-react";

type Provider = "gemini" | "openai" | "anthropic";

const PROVIDERS: { id: Provider; label: string; placeholder: string }[] = [
  { id: "gemini", label: "Gemini", placeholder: "AIza..." },
  { id: "openai", label: "ChatGPT", placeholder: "sk-..." },
  { id: "anthropic", label: "Claude", placeholder: "sk-ant-..." },
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider>("gemini");
  const [keys, setKeys] = useState({ gemini: "", openai: "", anthropic: "" });

  useEffect(() => {
    if (!isOpen) return;
    setIsDarkMode(document.documentElement.classList.contains("dark"));
    setSelectedProvider(
      (localStorage.getItem("noted_ai_provider") as Provider | null) ?? "gemini",
    );

    // migrate legacy key
    const legacy = localStorage.getItem("noted_api_key");
    const geminiKey = localStorage.getItem("noted_api_key_gemini") ?? (legacy || "");
    setKeys({
      gemini: geminiKey,
      openai: localStorage.getItem("noted_api_key_openai") ?? "",
      anthropic: localStorage.getItem("noted_api_key_anthropic") ?? "",
    });
  }, [isOpen]);

  const setTheme = (wantsDark: boolean) => {
    setIsDarkMode(wantsDark);
    if (wantsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSave = () => {
    localStorage.setItem("noted_ai_provider", selectedProvider);
    localStorage.setItem("noted_api_key_gemini", keys.gemini);
    localStorage.setItem("noted_api_key_openai", keys.openai);
    localStorage.setItem("noted_api_key_anthropic", keys.anthropic);
    onClose();
  };

  if (!isOpen) return null;

  const activeProvider = PROVIDERS.find((p) => p.id === selectedProvider)!;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200 text-zinc-900 dark:text-zinc-100 font-sans">
        {/* header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Settings size={20} className="text-[#5865F2]" /> Preferences
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* body */}
        <div className="p-6 flex-1 space-y-8">
          {/* theme toggle */}
          <div>
            <label className="flex text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 items-center gap-2">
              <Palette size={16} /> Appearance
            </label>
            <div className="flex bg-zinc-100 dark:bg-[#09090b] p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setTheme(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  !isDarkMode
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Sun size={16} /> Light
              </button>
              <button
                onClick={() => setTheme(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isDarkMode
                    ? "bg-[#2b2d31] text-white shadow-sm border border-zinc-700"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>

          {/* api key */}
          <div>
            <label className="flex text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 items-center gap-2">
              <Key size={16} /> AI Provider
            </label>

            {/* provider selector */}
            <div className="flex bg-zinc-100 dark:bg-[#09090b] p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-4">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProvider(p.id)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    selectedProvider === p.id
                      ? "bg-white dark:bg-[#2b2d31] text-zinc-900 dark:text-white shadow-sm dark:border dark:border-zinc-700"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* key input for selected provider */}
            <input
              type="password"
              value={keys[selectedProvider]}
              onChange={(e) =>
                setKeys((prev) => ({ ...prev, [selectedProvider]: e.target.value }))
              }
              placeholder={activeProvider.placeholder}
              className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 focus:border-[#5865F2] transition-all font-mono text-sm placeholder:text-zinc-500"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 font-medium leading-relaxed">
              Your key is stored locally in your browser's LocalStorage and is never sent to our
              servers.
            </p>
          </div>
        </div>

        {/* footer */}
        <div className="p-4 bg-zinc-50/50 dark:bg-[#09090b]/50 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
