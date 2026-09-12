import React from 'react';
import { Moon, Sun, Download, Upload, NotebookPen } from 'lucide-react';

interface TopAppBarProps {
  totalNotes: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onExport: () => void;
  onImportClick: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  totalNotes,
  isDark,
  onToggleTheme,
  onExport,
  onImportClick,
}) => {
  return (
    <header
      id="top-app-bar"
      className="sticky top-0 z-30 w-full bg-amber-400 dark:bg-stone-900 border-b border-amber-500/30 dark:border-stone-800 shadow-sm transition-colors duration-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 dark:bg-amber-400/10 flex items-center justify-center text-stone-900 dark:text-amber-400 border border-amber-600/20">
            <NotebookPen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>📝 دفتر الملاحظات</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 dark:bg-amber-400/15 text-stone-900 dark:text-amber-300">
                {totalNotes} {totalNotes === 1 ? 'ملاحظة' : 'ملاحظات'}
              </span>
            </h1>
            <p className="text-xs text-stone-700/80 dark:text-stone-400 hidden sm:block">
              تدوين الأفكار والملاحظات بكل بساطة وسرعة
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Export button */}
          <button
            id="export-notes-btn"
            onClick={onExport}
            title="تصدير نسخة احتياطية"
            aria-label="تصدير الملاحظات"
            className="p-2 rounded-xl text-stone-800 dark:text-stone-300 hover:bg-amber-500/20 dark:hover:bg-stone-800 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Import button */}
          <button
            id="import-notes-btn"
            onClick={onImportClick}
            title="استيراد ملاحظات"
            aria-label="استيراد الملاحظات"
            className="p-2 rounded-xl text-stone-800 dark:text-stone-300 hover:bg-amber-500/20 dark:hover:bg-stone-800 transition-colors"
          >
            <Upload className="w-5 h-5" />
          </button>

          {/* Dark mode toggle */}
          <button
            id="toggle-theme-btn"
            onClick={onToggleTheme}
            title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
            aria-label="تبديل المظهر"
            className="p-2 rounded-xl text-stone-800 dark:text-amber-400 hover:bg-amber-500/20 dark:hover:bg-stone-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
