import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import {
  Tldraw,
  useEditor,
  DefaultColorStyle,
  DefaultSizeStyle,
  useValue,
} from "tldraw";
import "tldraw/tldraw.css";
import { db, type Notebook as NotebookType, type Page } from "../db/db";
import {
  ChevronLeft,
  Plus,
  FileText,
  Share2,
  MousePointer2,
  Trash2,
  Pencil,
  Eraser,
  Undo,
  Redo,
} from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

import { useAIGesture } from "../hooks/useAIGesture";

type TldrawColor =
  | "black"
  | "grey"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "red"
  | "violet";
type TldrawSize = "s" | "m" | "l" | "xl";

function AIGestureEngine() {
  useAIGesture();
  return null; // listener
}

function ColorPicker() {
  const editor = useEditor();

  const currentToolId = useValue(
    "current tool id",
    () => editor.getCurrentToolId(),
    [editor],
  );
  const isPenSelected = currentToolId === "draw";

  const tldrawColors: { id: TldrawColor; hex: string }[] = [
    { id: "black", hex: "#1d1d1d" },
    { id: "grey", hex: "#9ca3af" },
    { id: "blue", hex: "#3b82f6" },
    { id: "green", hex: "#22c55e" },
    { id: "yellow", hex: "#eab308" },
    { id: "orange", hex: "#f97316" },
    { id: "red", hex: "#ef4444" },
    { id: "violet", hex: "#8b5cf6" },
  ];

  const tldrawSizes: { id: TldrawSize; label: string; dotClass: string }[] = [
    { id: "s", label: "S", dotClass: "w-1.5 h-1.5" },
    { id: "m", label: "M", dotClass: "w-2.5 h-2.5" },
    { id: "l", label: "L", dotClass: "w-4 h-4" },
    { id: "xl", label: "XL", dotClass: "w-6 h-6" },
  ];

  return (
    <div
      className={twMerge(
        "absolute top-4 left-4 z-50 flex flex-col gap-3 p-3 bg-white/90 dark:bg-[#2b2d31]/90 backdrop-blur-md border border-zinc-200 dark:border-[#1e1f22] rounded-xl shadow-md pointer-events-auto",
        "transition-all duration-300 ease-out",
        isPenSelected
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-4 scale-95 pointer-events-none",
      )}
    >
      {/* colors */}
      <div className="flex gap-2">
        {tldrawColors.map((color) => (
          <button
            key={color.id}
            onClick={() => {
              editor.setStyleForNextShapes(DefaultColorStyle, color.id);
              editor.setStyleForSelectedShapes(DefaultColorStyle, color.id);
            }}
            className="w-6 h-6 rounded-full shadow-sm hover:scale-110 transition-transform border border-black/10 dark:border-white/10"
            style={{ backgroundColor: color.hex }}
            title={color.id}
          />
        ))}
      </div>

      <div className="w-full h-px bg-zinc-200 dark:bg-[#1e1f22]" />

      {/* stroke size */}
      <div className="flex gap-2 items-center justify-around">
        {tldrawSizes.map((size) => (
          <button
            key={size.id}
            onClick={() => {
              editor.setStyleForNextShapes(DefaultSizeStyle, size.id);
              editor.setStyleForSelectedShapes(DefaultSizeStyle, size.id);
            }}
            className="flex flex-col items-center justify-center w-8 h-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#1e1f22] text-zinc-600 dark:text-zinc-300 transition-colors gap-1"
            title={`Size: ${size.label}`}
          >
            <div className={`bg-current rounded-full ${size.dotClass}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function EdgeToolbar({ onNewPage }: { onNewPage: () => void }) {
  const editor = useEditor();
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  // toolbar
  return (
    <>
      <div
        className="absolute right-0 top-1/4 bottom-1/4 w-8 z-40 pointer-events-auto"
        onMouseEnter={() => setIsToolbarVisible(true)}
      />

      <div
        onMouseEnter={() => setIsToolbarVisible(true)}
        onMouseLeave={() => setIsToolbarVisible(false)}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 p-3 bg-white/90 dark:bg-[#2b2d31]/90 backdrop-blur-md border border-zinc-200 dark:border-[#1e1f22] shadow-2xl rounded-2xl transition-all duration-300 ease-out pointer-events-auto ${
          isToolbarVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-12 opacity-0 pointer-events-none"
        }`}
      >
        {/* tldraw tools */}
        <button
          onClick={() => editor.setCurrentTool("select")}
          className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1e1f22] hover:text-[#5865F2] rounded-xl transition-colors"
          title="Select"
        >
          <MousePointer2 size={22} />
        </button>
        <button
          onClick={() => editor.setCurrentTool("draw")}
          className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1e1f22] hover:text-[#5865F2] rounded-xl transition-colors"
          title="Draw"
        >
          <Pencil size={22} />
        </button>
        <button
          onClick={() => editor.setCurrentTool("eraser")}
          className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1e1f22] hover:text-[#5865F2] rounded-xl transition-colors"
          title="Eraser"
        >
          <Eraser size={22} />
        </button>

        <div className="w-full h-px bg-zinc-200 dark:bg-[#1e1f22] my-1" />

        {/* history control */}
        <button
          onClick={() => editor.undo()}
          className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1e1f22] hover:text-[#5865F2] rounded-xl transition-colors"
          title="Undo"
        >
          <Undo size={22} />
        </button>
        <button
          onClick={() => editor.redo()}
          className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1e1f22] hover:text-[#5865F2] rounded-xl transition-colors"
          title="Redo"
        >
          <Redo size={22} />
        </button>

        <div className="w-full h-px bg-zinc-200 dark:bg-[#1e1f22] my-1" />

        {/* Noted controls */}
        <button
          onClick={onNewPage}
          className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1e1f22] hover:text-[#5865F2] rounded-xl transition-colors"
          title="New Page"
        >
          <Plus size={22} />
        </button>
        <button
          className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1e1f22] hover:text-[#5865F2] rounded-xl transition-colors"
          title="Share Notebook"
        >
          <Share2 size={22} />
        </button>
      </div>
    </>
  );
}

export default function Notebook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notebook, setNotebook] = useState<NotebookType | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      const nbId = parseInt(id);

      const nb = await db.notebooks.get(nbId);
      if (nb) setNotebook(nb);

      const nbPages = await db.pages.where("notebookId").equals(nbId).toArray();
      setPages(nbPages);

      setActivePageId((currentId) => {
        if (!currentId && nbPages.length > 0) return nbPages[0].id!;
        return currentId;
      });
    };
    loadData();
  }, [id]);

  const handleCreatePage = async () => {
    if (!notebook) return;
    const newPage = {
      id: crypto.randomUUID(),
      notebookId: notebook.id!,
      title: `Page ${pages.length + 1}`,
      canvasData: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.pages.add(newPage);
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
  };

  const handleDeletePage = async () => {
    if (!pageToDelete) return;

    await db.pages.delete(pageToDelete);
    localStorage.removeItem(`tldraw_noted-page-${pageToDelete}`);

    const remainingPages = pages.filter((p) => p.id !== pageToDelete);
    setPages(remainingPages);

    if (activePageId === pageToDelete) {
      setActivePageId(remainingPages.length > 0 ? remainingPages[0].id! : null);
    }
    setPageToDelete(null);
  };

  if (!notebook)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="flex h-screen w-full bg-[#fafaf9] dark:bg-[#313338] relative overflow-hidden">
      {/* sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-[#1e1f22] bg-white dark:bg-[#2b2d31] flex flex-col z-10">
        <div className="h-16 flex items-center px-4 border-b border-zinc-200 dark:border-[#1e1f22]">
          <button
            onClick={() => navigate("/backpack")}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-bold"
          >
            <ChevronLeft size={20} /> Backpack
          </button>
        </div>

        <div className="p-4 border-b border-zinc-200 dark:border-[#1e1f22]">
          <h2 className="font-black text-xl truncate">{notebook.title}</h2>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {pages.map((page) => (
            <div key={page.id} className="relative group flex items-center">
              <button
                onClick={() => setActivePageId(page.id!)}
                className={`flex items-center gap-3 w-full p-3 pr-10 rounded-xl font-bold transition-all ${
                  activePageId === page.id
                    ? "bg-[#5865F2] text-white shadow-md"
                    : "hover:bg-zinc-100 dark:hover:bg-[#313338] text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <FileText size={18} />
                <span className="truncate">{page.title}</span>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPageToDelete(page.id!);
                }}
                className={`absolute right-2 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10 ${
                  activePageId === page.id
                    ? "text-white/70 hover:text-white hover:bg-white/20"
                    : "text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-[#1e1f22]">
          <button
            onClick={handleCreatePage}
            className="flex items-center justify-center gap-2 w-full p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-[#313338] dark:hover:bg-[#1e1f22] rounded-xl font-bold transition-colors"
          >
            <Plus size={20} /> New Page
          </button>
        </div>
      </aside>

      {/* canvas */}
      <main className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          {activePageId ? (
            <Tldraw
              persistenceKey={`noted-production-${activePageId}`}
              components={{
                PageMenu: null,
                Toolbar: null,
                MainMenu: null,
                QuickActions: null,
                StylePanel: null,
                HelpMenu: null,
                NavigationPanel: null,
                ActionsMenu: null,
                ContextMenu: null,
                ZoomMenu: null,
                SharePanel: null,
              }}
            >
              <EdgeToolbar onNewPage={handleCreatePage} />
              <ColorPicker />
              <AIGestureEngine />
            </Tldraw>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">
              Create a new page to start drawing.
            </div>
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={pageToDelete !== null}
        title="Delete Page"
        message="Are you sure you want to delete this page? Your canvas strokes cannot be recovered."
        onCancel={() => setPageToDelete(null)}
        onConfirm={handleDeletePage}
      />
    </div>
  );
}
