import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, type Notebook } from "../db/db";
import { Menu, Settings, Folder, Plus, X, Key, Trash2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

export default function Backpack() {
  const navigate = useNavigate();
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notebookToDelete, setNotebookToDelete] = useState<number | null>(null);
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("noted_api_key") || "",
  );

  useEffect(() => {
    const loadNotebooks = async () => {
      const allNotebooks = await db.notebooks.toArray();
      setNotebooks(allNotebooks);
    };
    loadNotebooks();
  }, []);

  const handleCreateNotebook = async () => {
    const title = prompt("Enter notebook name:");
    if (!title) return;

    const newNotebook = { title, createdAt: new Date() };
    const id = await db.notebooks.add(newNotebook);

    await db.pages.add({
      id: crypto.randomUUID(),
      notebookId: id as number,
      title: "Page 1",
      canvasData: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setNotebooks([...notebooks, { ...newNotebook, id }]);
  };

  const handleDeleteNotebook = async () => {
    if (notebookToDelete === null) return;
    await db.notebooks.delete(notebookToDelete);
    await db.pages.where("notebookId").equals(notebookToDelete).delete();

    setNotebooks(notebooks.filter((nb) => nb.id !== notebookToDelete));
    setNotebookToDelete(null);
  };

  const handleSaveApiKey = () => {
    localStorage.setItem("noted_api_key", apiKey);
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex h-screen w-full">
      {/* sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300 ease-in-out border-r border-zinc-200 dark:border-[#1e1f22] bg-white dark:bg-[#2b2d31] flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-[#1e1f22]">
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isSidebarOpen ? "w-32 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-8"}`}
          >
            <span className="font-black text-xl tracking-tight">noted.</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 flex-shrink-0 hover:bg-zinc-100 dark:hover:bg-[#313338] rounded-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? "rotate-180" : "rotate-0"}`}
          >
            <Menu size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-zinc-100 dark:bg-[#313338] text-zinc-900 dark:text-gray-100 font-bold transition-colors overflow-hidden">
            <Folder size={20} className="text-[#5865F2] flex-shrink-0" />
            <span
              className={`transition-all duration-300 ease-in-out whitespace-nowrap ${isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0"}`}
            >
              My Backpack
            </span>
          </button>
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-[#1e1f22] overflow-hidden">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-[#313338] transition-colors overflow-hidden"
          >
            <Settings
              size={20}
              className="text-zinc-500 dark:text-zinc-400 flex-shrink-0"
            />
            <span
              className={`font-semibold text-zinc-600 dark:text-zinc-300 transition-all duration-300 ease-in-out whitespace-nowrap ${isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0"}`}
            >
              Settings
            </span>
          </button>
        </div>
      </aside>

      {/* main content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="p-8 pb-4 flex justify-between items-end">
          <h1 className="text-4xl font-black tracking-tight">Notebooks</h1>
          <button
            onClick={handleCreateNotebook}
            className="flex items-center gap-2 px-5 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold shadow-md transition-all"
          >
            <Plus size={20} /> New Notebook
          </button>
        </header>

        <div className="p-8 pt-4 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 content-start">
          {notebooks.length === 0 ? (
            <div className="col-span-full text-center py-20 text-zinc-500 dark:text-zinc-400">
              Your backpack is empty. Create a notebook to start taking notes.
            </div>
          ) : (
            notebooks.map((nb) => (
              <div key={nb.id} className="relative group">
                <button
                  onClick={() => navigate(`/notebook/${nb.id}`)}
                  className="w-full flex flex-col items-start p-6 h-40 rounded-2xl border-2 border-zinc-200 dark:border-[#1e1f22] bg-white dark:bg-[#2b2d31] hover:border-[#5865F2] dark:hover:border-[#5865F2] transition-colors text-left"
                >
                  <Folder
                    size={32}
                    className="text-[#5865F2] mb-auto group-hover:scale-110 transition-transform duration-200"
                  />
                  <h3 className="font-bold text-lg truncate w-full">
                    {nb.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Created {nb.createdAt.toLocaleDateString()}
                  </p>
                </button>
                {/* Delete Notebook Button - Appears on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents navigating to the notebook
                    setNotebookToDelete(nb.id!);
                  }}
                  className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 bg-white dark:bg-[#2b2d31] hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* delete confirmation */}
      <ConfirmModal
        isOpen={notebookToDelete !== null}
        title="Delete Notebook"
        message="Are you sure you want to delete this notebook? All pages inside it will be permanently lost."
        onCancel={() => setNotebookToDelete(null)}
        onConfirm={handleDeleteNotebook}
      />

      {/* settings modal for API key rn */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#2b2d31] border border-zinc-200 dark:border-[#1e1f22] rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all">
            <div className="p-6 border-b border-zinc-200 dark:border-[#1e1f22] flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings size={20} className="text-zinc-500" /> Preferences
              </h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-[#1e1f22] rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex-1 space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                  <Key size={16} /> API Key (Gemini only)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full p-3 rounded-xl border border-zinc-300 dark:border-[#1e1f22] bg-zinc-50 dark:bg-[#1e1f22] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition-shadow font-mono text-sm"
                />
                <p className="text-xs text-zinc-500 mt-2">
                  Your key is stored locally in your browser and never sent to
                  our servers.
                </p>
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-[#1e1f22] border-t border-zinc-200 dark:border-[#313338] flex justify-end">
              <button
                onClick={handleSaveApiKey}
                className="px-6 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-bold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
