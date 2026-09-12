import { NoteEntity } from '../types';

const STORAGE_KEY = 'notebook_app_notes';

export const NOTE_COLORS = [
  { id: 'yellow', name: 'أصفر كلاسيكي', bg: 'bg-amber-100/90 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800/60', badge: '#f59e0b' },
  { id: 'emerald', name: 'أخضر هادئ', bg: 'bg-emerald-100/90 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800/60', badge: '#10b981' },
  { id: 'blue', name: 'أزرق سماوي', bg: 'bg-sky-100/90 dark:bg-sky-950/40', border: 'border-sky-200 dark:border-sky-800/60', badge: '#0ea5e9' },
  { id: 'purple', name: 'بنفسجي ملكي', bg: 'bg-purple-100/90 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800/60', badge: '#a855f7' },
  { id: 'rose', name: 'وردي لطيف', bg: 'bg-rose-100/90 dark:bg-rose-950/40', border: 'border-rose-200 dark:border-rose-800/60', badge: '#f43f5e' },
  { id: 'stone', name: 'رمادي طبيعي', bg: 'bg-stone-100/90 dark:bg-stone-800/50', border: 'border-stone-200 dark:border-stone-700/60', badge: '#78716c' },
];

const INITIAL_NOTES: NoteEntity[] = [
  {
    id: 1,
    title: 'مرحباً بك في دفتر الملاحظات 📝',
    content: 'تم بناء هذا التطبيق ليوفر تجربة تدوين سلسة وسريعة مع إمكانية البحث الفوري، الحفظ التلقائي، والتنسيق الأنيق المريح للعين.\n\nيمكنك الضغط على زر + في الأسفل لإضافة فكرة أو ملاحظة جديدة، أو النقر على أي بطاقة لتعديلها.',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    color: 'yellow',
    pinned: true,
  },
  {
    id: 2,
    title: 'قائمة مهام الأسبوع 🎯',
    content: '• مراجعة تقرير المشروعات المنجزة\n• تجهيز مسودة العرض التقديمي\n• ممارسة رياضة المشي لمدة 30 دقيقة\n• قراءة فصلين من كتاب التطوير التقني',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    color: 'emerald',
    pinned: false,
  },
  {
    id: 3,
    title: 'أفكار لمشروع مستقبلي 💡',
    content: 'تطوير واجهة مستخدم تعتمد على تصميم Material 3 مع لوحة ألوان دافئة ونظام تخزين دائم يعمل حتى في حالة انقطاع الاتصال بالإنترنت.',
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now() - 3600000 * 4,
    color: 'purple',
    pinned: false,
  }
];

export class NoteRepository {
  static getAllNotes(): NoteEntity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
        return INITIAL_NOTES;
      }
      const parsed: NoteEntity[] = JSON.parse(data);
      return parsed.sort((a, b) => {
        // Pinned notes first, then latest updatedAt
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.updatedAt - a.updatedAt;
      });
    } catch {
      return INITIAL_NOTES;
    }
  }

  static getNoteById(id: number): NoteEntity | null {
    const notes = this.getAllNotes();
    return notes.find((n) => n.id === id) || null;
  }

  static insertNote(title: string, content: string, color: string = 'yellow', pinned: boolean = false): NoteEntity {
    const notes = this.getAllNotes();
    const newNote: NoteEntity = {
      id: Date.now(),
      title,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      color,
      pinned,
    };
    const updatedNotes = [newNote, ...notes];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    return newNote;
  }

  static updateNote(note: NoteEntity): void {
    const notes = this.getAllNotes();
    const index = notes.findIndex((n) => n.id === note.id);
    if (index !== -1) {
      notes[index] = {
        ...note,
        updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }

  static deleteNote(note: NoteEntity): void {
    this.deleteNoteById(note.id);
  }

  static deleteNoteById(id: number): void {
    const notes = this.getAllNotes();
    const filtered = notes.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  static togglePin(id: number): void {
    const notes = this.getAllNotes();
    const note = notes.find((n) => n.id === id);
    if (note) {
      note.pinned = !note.pinned;
      note.updatedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }

  static exportNotesJson(): string {
    const notes = this.getAllNotes();
    return JSON.stringify(notes, null, 2);
  }

  static importNotes(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export function formatDate(timestamp: number): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;

    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'تاريخ غير معروف';
  }
}
