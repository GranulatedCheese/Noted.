"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db, type Notebook } from "@/lib/db";
import {
  Menu,
  Settings,
  Folder,
  Plus,
  X,
  Trash2,
  BookOpen,
} from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import SettingsModal from "@/components/SettingsModal";

export default function BackpackPage() {
  const router = useRouter();
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState("");
  const [notebookToDelete, setNotebookToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadNotebooks = async () => {
      const allNotebooks = await db.notebooks.toArray();
      setNotebooks(allNotebooks);
    };
    loadNotebooks();
  }, []);

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotebookTitle.trim()) return;

    const newNotebook = {
      title: newNotebookTitle.trim(),
      createdAt: new Date(),
    };
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
    setNewNotebookTitle("");
    setIsCreateModalOpen(false);
  };

  const handleDeleteNotebook = async () => {
    if (notebookToDelete === null) return;
    await db.notebooks.delete(notebookToDelete);
    await db.pages.where("notebookId").equals(notebookToDelete).delete();

    setNotebooks(notebooks.filter((nb) => nb.id !== notebookToDelete));
    setNotebookToDelete(null);
  };

  return (
    <div className="flex h-screen w-full bg-[#fafaf9] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden selection:bg-[#5865F2]/30 relative">
      {/* bg glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#5865F2]/10 via-[#5865F2]/0 to-transparent blur-[100px] pointer-events-none z-0" />

      {/* sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } relative z-20 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-[#121214]/50 backdrop-blur-xl flex flex-col`}
      >
        <div className="h-20 flex items-center justify-between px-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div
            className={`flex items-center gap-2 transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isSidebarOpen
                ? "w-32 opacity-100 translate-x-0"
                : "w-0 opacity-0 -translate-x-8"
            }`}
          >
            <span className="font-black text-xl tracking-tighter">noted.</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 shrink-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-xl transition-all duration-300 ${
              isSidebarOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-white dark:bg-zinc-800/80 shadow-sm border border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-white font-bold transition-all overflow-hidden group">
            <div className="p-1.5 rounded-lg bg-[#5865F2]/10 text-[#5865F2] shrink-0 group-hover:scale-110 transition-transform">
              <Folder size={18} />
            </div>
            <span
              className={`transition-all duration-300 whitespace-nowrap ${
                isSidebarOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 w-0"
              }`}
            >
              My Backpack
            </span>
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors overflow-hidden group text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <Settings
              size={20}
              className="shrink-0 group-hover:rotate-90 transition-transform duration-500"
            />
            <span
              className={`font-semibold transition-all duration-300 whitespace-nowrap ${
                isSidebarOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 w-0"
              }`}
            >
              Settings
            </span>
          </button>
        </div>
      </aside>

      {/* main cont */}
      <main className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
        <header className="px-10 py-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white mb-2">
              Backpack
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              {notebooks.length}{" "}
              {notebooks.length === 1 ? "notebook" : "notebooks"} stored.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group flex items-center gap-2 px-5 py-3 bg-transparent hover:bg-zinc-200/70 dark:hover:bg-white/10 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-xl font-bold transition-colors"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            New Notebook
          </button>
        </header>

        <div className="px-10 pb-10 flex-1 overflow-y-auto">
          {notebooks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 space-y-4">
              <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-4">
                <BookOpen
                  size={40}
                  className="text-zinc-300 dark:text-zinc-600"
                />
              </div>
              <p className="text-lg font-medium text-balance text-center">
                Your backpack is empty.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-[#5865F2] font-bold hover:underline underline-offset-4"
              >
                Create your first notebook
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start pb-20">
              {notebooks.map((nb) => (
                <div key={nb.id} className="relative group">
                  <Link
                    href={`/notebook/${nb.id}`}
                    className="w-full flex flex-col items-start p-6 h-48 rounded-[2rem] border border-zinc-200/80 dark:border-zinc-800 bg-white/40 dark:bg-[#121214]/60 backdrop-blur-md hover:bg-white dark:hover:bg-[#18181b] hover:border-[#5865F2]/50 dark:hover:border-[#5865F2]/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden"
                  >
                    {/* Subtle inner hover glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#5865F2]/5 blur-3xl rounded-full transition-opacity opacity-0 group-hover:opacity-100" />

                    <div className="w-14 h-14 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/50 flex items-center justify-center mb-auto border border-zinc-200/50 dark:border-zinc-700/30 group-hover:scale-105 transition-transform duration-300">
                      <Folder size={26} className="text-[#5865F2]" />
                    </div>

                    <div className="w-full relative z-10">
                      <h3 className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white truncate w-full mb-1">
                        {nb.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        Created {nb.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotebookToDelete(nb.id!);
                    }}
                    className="absolute top-5 right-5 p-2.5 text-zinc-400 hover:text-red-500 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md hover:bg-red-50 dark:hover:bg-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm border border-transparent hover:border-red-200 dark:hover:border-red-500/30 z-20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* delete confirmation modal */}
      <ConfirmModal
        isOpen={notebookToDelete !== null}
        title="Delete Notebook"
        message="Are you sure you want to delete this notebook? All pages inside it will be permanently lost."
        onCancel={() => setNotebookToDelete(null)}
        onConfirm={handleDeleteNotebook}
      />

      {/* create notebook modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateNotebook}
            className="w-full max-w-md bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200"
          >
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center">
              <h2 className="text-xl font-black tracking-tight">
                New Notebook
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                Notebook Title
              </label>
              <input
                type="text"
                autoFocus
                value={newNotebookTitle}
                onChange={(e) => setNewNotebookTitle(e.target.value)}
                placeholder="e.g. Quantum Mechanics 101"
                className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 focus:border-[#5865F2] transition-all font-medium placeholder:text-zinc-400"
              />
            </div>
            <div className="p-4 bg-zinc-50/50 dark:bg-[#09090b]/50 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-5 py-2.5 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newNotebookTitle.trim()}
                className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-md"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* settings modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
