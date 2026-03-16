import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white dark:bg-[#2b2d31] border border-zinc-200 dark:border-[#1e1f22] rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-200 dark:border-[#1e1f22] flex justify-between items-center bg-red-50/50 dark:bg-red-500/10">
          <h2 className="text-lg font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} /> {title}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors text-zinc-500"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 text-zinc-600 dark:text-zinc-300">
          <p>{message}</p>
        </div>
        <div className="p-4 bg-zinc-50 dark:bg-[#1e1f22] border-t border-zinc-200 dark:border-[#313338] flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#313338] rounded-lg font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
