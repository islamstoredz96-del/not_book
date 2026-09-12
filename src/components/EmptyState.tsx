import React from 'react';
import { SearchX, FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  hasSearchQuery: boolean;
  onClearSearch?: () => void;
  onCreateNew?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearchQuery,
  onClearSearch,
  onCreateNew,
}) => {
  if (hasSearchQuery) {
    return (
      <div
        id="empty-state-search"
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          لم يتم العثور على أي ملاحظات
        </h3>
        <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400 max-w-sm">
          لم نتمكن من إيجاد ملاحظة تتطابق مع كلمات البحث. جرب كلمات أخرى أو قم بمسح البحث.
        </p>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="mt-5 px-5 py-2 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-xs transition-colors"
          >
            مسح كلمات البحث
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      id="empty-state-no-notes"
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 shadow-xs">
        <FileText className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
        دفتر الملاحظات فارغ حالياً
      </h3>
      <p className="mt-2 text-sm sm:text-base text-stone-500 dark:text-stone-400 max-w-md leading-relaxed">
        ابدأ بكتابة أول فكرة أو ملاحظة أو قائمة مهام لك، وسيتم حفظها وترتيبها تلقائياً.
      </p>
      {onCreateNew && (
        <button
          onClick={onCreateNew}
          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-2xl text-base font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة ملاحظة جديدة</span>
        </button>
      )}
    </div>
  );
};
