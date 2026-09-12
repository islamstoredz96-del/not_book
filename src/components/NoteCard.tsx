import React from 'react';
import { Trash2, Pin, Copy, Check } from 'lucide-react';
import { NoteEntity } from '../types';
import { formatDate, NOTE_COLORS } from '../data/repository';

interface NoteCardProps {
  note: NoteEntity;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onTogglePin?: (e: React.MouseEvent) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  onDelete,
  onTogglePin,
}) => {
  const [copied, setCopied] = React.useState(false);

  const colorConfig = NOTE_COLORS.find((c) => c.id === note.color) || NOTE_COLORS[0];

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${note.title}\n\n${note.content}`.trim();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      id={`note-card-${note.id}`}
      onClick={onClick}
      className={`group relative rounded-2xl p-5 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 ${colorConfig.bg} ${colorConfig.border} flex flex-col justify-between`}
    >
      <div>
        {/* Header Row: Title & Actions */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 line-clamp-1 flex-1 leading-snug">
            {note.title.trim() ? note.title : 'بدون عنوان'}
          </h2>

          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            {/* Pin Toggle */}
            {onTogglePin && (
              <button
                type="button"
                onClick={onTogglePin}
                title={note.pinned ? 'إلغاء التثبيت' : 'تثبيت الملاحظة'}
                className={`p-1.5 rounded-lg transition-colors ${
                  note.pinned
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-400/20'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Pin className={`w-4 h-4 ${note.pinned ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              title="نسخ الملاحظة"
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={onDelete}
              title="حذف الملاحظة"
              aria-label="حذف"
              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content with 3-line max clamp */}
        <p className="mt-2.5 text-sm sm:text-base text-stone-700 dark:text-stone-300 line-clamp-3 leading-relaxed whitespace-pre-line">
          {note.content.trim() ? note.content : 'لا يوجد محتوى'}
        </p>
      </div>

      {/* Footer Info: Date & Word count */}
      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span className="flex items-center gap-1">
          <time dateTime={new Date(note.updatedAt).toISOString()}>
            {formatDate(note.updatedAt)}
          </time>
        </span>

        {note.pinned && (
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
            مثبتة
          </span>
        )}
      </div>
    </article>
  );
};
