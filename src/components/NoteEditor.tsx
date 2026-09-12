import React, { useState, useEffect } from 'react';
import { ArrowRight, Save, Trash2, Pin, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { NoteEntity } from '../types';
import { NOTE_COLORS, formatDate } from '../data/repository';

interface NoteEditorProps {
  note: NoteEntity | null;
  onSave: (title: string, content: string, color: string, pinned: boolean) => void;
  onDelete?: (note: NoteEntity) => void;
  onBack: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onDelete,
  onBack,
}) => {
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const [color, setColor] = useState(note?.color || 'yellow');
  const [pinned, setPinned] = useState(note?.pinned || false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color || 'yellow');
      setPinned(note.pinned || false);
    } else {
      setTitle('');
      setContent('');
      setColor('yellow');
      setPinned(false);
    }
  }, [note]);

  const handleSave = () => {
    onSave(title, content, color, pinned);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopy = () => {
    const textToCopy = `${title}\n\n${content}`.trim();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const activeColor = NOTE_COLORS.find((c) => c.id === color) || NOTE_COLORS[0];

  return (
    <div
      id="note-editor"
      className="min-h-screen bg-stone-50/70 dark:bg-stone-950 flex flex-col transition-colors duration-200"
    >
      {/* Editor Header Bar */}
      <header className="sticky top-0 z-20 w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Back Button */}
          <div className="flex items-center gap-3">
            <button
              id="editor-back-btn"
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="الرجوع إلى القائمة"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="font-semibold text-sm hidden sm:inline">رجوع</span>
            </button>
            <div className="h-5 w-px bg-stone-300 dark:bg-stone-700" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {note ? 'تعديل الملاحظة' : 'ملاحظة جديدة'}
            </h2>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              title="نسخ النص"
              className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>

            {/* Pin Toggle */}
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              title={pinned ? 'ملاحظة مثبتة' : 'تثبيت الملاحظة في الأعلى'}
              className={`p-2 rounded-xl transition-colors ${
                pinned
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/50'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Pin className={`w-5 h-5 ${pinned ? 'fill-current' : ''}`} />
            </button>

            {/* Delete button (only if editing) */}
            {note && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(note)}
                title="حذف الملاحظة"
                className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            {/* Save Button */}
            <button
              id="save-note-btn"
              type="button"
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl font-bold text-sm sm:text-base shadow-xs transition-all ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-stone-950'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم الحفظ!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-4">
        {/* Style & Color Selector Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              لون البطاقة:
            </span>
            <div className="flex items-center gap-1.5">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  title={c.name}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === c.id
                      ? 'scale-125 ring-2 ring-stone-900 dark:ring-white ring-offset-2 dark:ring-offset-stone-900'
                      : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.badge }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
            {note && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                آخر تعديل: {formatDate(note.updatedAt)}
              </span>
            )}
            <span>{wordCount} كلمة</span>
            <span>{charCount} حرف</span>
          </div>
        </div>

        {/* Paper Writing Pad */}
        <div
          className={`flex-1 rounded-3xl p-6 sm:p-8 border shadow-xs transition-all ${activeColor.bg} ${activeColor.border} flex flex-col`}
        >
          {/* Title Input */}
          <input
            id="note-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="العنوان (مثال: فكرة، موعد، قائمة...)"
            className="w-full bg-transparent text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 pb-3 border-b border-black/10 dark:border-white/10 focus:outline-none focus:border-amber-500 mb-4"
          />

          {/* Content Textarea */}
          <textarea
            id="note-content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="اكتب تفاصيل ملاحظتك هنا بكل حرية..."
            rows={14}
            className="w-full flex-1 bg-transparent text-base sm:text-lg text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 resize-y focus:outline-none leading-relaxed font-normal"
          />
        </div>
      </main>
    </div>
  );
};
