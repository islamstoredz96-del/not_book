import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { NoteEntity } from '../types';

interface DeleteConfirmationDialogProps {
  note: NoteEntity | null;
  onConfirm: () => void;
  onDismiss: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  note,
  onConfirm,
  onDismiss,
}) => {
  if (!note) return null;

  return (
    <div
      id="delete-dialog-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onDismiss}
    >
      <div
        id="delete-dialog-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-6 text-stone-800 dark:text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onDismiss}
          aria-label="إغلاق"
          className="absolute top-4 left-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Title & Body */}
        <h3 id="dialog-title" className="text-lg font-bold text-stone-900 dark:text-stone-100">
          تأكيد حذف الملاحظة
        </h3>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          هل أنت متأكد من رغبتك في حذف{' '}
          <strong className="text-stone-800 dark:text-stone-200">
            "{note.title.trim() ? note.title : 'هذه الملاحظة'}"
          </strong>
          ؟ لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            id="cancel-delete-btn"
            type="button"
            onClick={onDismiss}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            إلغاء
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف الملاحظة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
