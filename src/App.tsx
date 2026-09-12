import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { NoteEntity } from './types';
import { NoteRepository } from './data/repository';
import { TopAppBar } from './components/TopAppBar';
import { SearchBar } from './components/SearchBar';
import { NoteCard } from './components/NoteCard';
import { EmptyState } from './components/EmptyState';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import { NoteEditor } from './components/NoteEditor';
import { ImportDialog } from './components/ImportDialog';

export default function App() {
  // State matching HomeViewModel / Jetpack Compose
  const [notes, setNotes] = useState<NoteEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<NoteEntity | null>(null);

  // Navigation State: null means on HomeScreen, number means editing note, "new" means creating note
  const [activeEditorNoteId, setActiveEditorNoteId] = useState<number | 'new' | null>(null);

  // Import Dialog State
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Dark Theme
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('notebook_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('notebook_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('notebook_theme', 'light');
    }
  }, [isDark]);

  // Load notes initially (matching init { loadNotes() })
  useEffect(() => {
    const loadedNotes = NoteRepository.getAllNotes();
    setNotes(loadedNotes);
    setIsLoading(false);
  }, []);

  // Filter notes based on search query and optional color filter
  const filteredNotes = useMemo(() => {
    let result = notes;

    if (selectedColorFilter) {
      result = result.filter((n) => (n.color || 'yellow') === selectedColorFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query)
      );
    }

    return result;
  }, [notes, searchQuery, selectedColorFilter]);

  // Handlers matching Compose HomeViewModel
  const handleOpenEditor = (noteId: number | null) => {
    setActiveEditorNoteId(noteId ?? 'new');
  };

  const handleCloseEditor = () => {
    setActiveEditorNoteId(null);
  };

  const handleSaveNote = (title: string, content: string, color: string, pinned: boolean) => {
    if (activeEditorNoteId === 'new') {
      NoteRepository.insertNote(title, content, color, pinned);
    } else if (typeof activeEditorNoteId === 'number') {
      const existing = notes.find((n) => n.id === activeEditorNoteId);
      if (existing) {
        NoteRepository.updateNote({
          ...existing,
          title,
          content,
          color,
          pinned,
        });
      }
    }
    setNotes(NoteRepository.getAllNotes());
    setActiveEditorNoteId(null);
  };

  const handleDeleteClick = (note: NoteEntity) => {
    setNoteToDelete(note);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      NoteRepository.deleteNote(noteToDelete);
      setNotes(NoteRepository.getAllNotes());
      if (activeEditorNoteId === noteToDelete.id) {
        setActiveEditorNoteId(null);
      }
    }
    setShowDeleteDialog(false);
    setNoteToDelete(null);
  };

  const handleDismissDelete = () => {
    setShowDeleteDialog(false);
    setNoteToDelete(null);
  };

  const handleTogglePin = (e: React.MouseEvent, noteId: number) => {
    e.stopPropagation();
    NoteRepository.togglePin(noteId);
    setNotes(NoteRepository.getAllNotes());
  };

  // Export & Import
  const handleExport = () => {
    const dataStr = NoteRepository.exportNotesJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notebook-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (jsonStr: string): boolean => {
    const success = NoteRepository.importNotes(jsonStr);
    if (success) {
      setNotes(NoteRepository.getAllNotes());
    }
    return success;
  };

  // If editor is open, render NoteEditor view
  if (activeEditorNoteId !== null) {
    const currentNote =
      activeEditorNoteId === 'new'
        ? null
        : notes.find((n) => n.id === activeEditorNoteId) || null;

    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-['Cairo',sans-serif]">
        <NoteEditor
          note={currentNote}
          onSave={handleSaveNote}
          onDelete={handleDeleteClick}
          onBack={handleCloseEditor}
        />
        {showDeleteDialog && (
          <DeleteConfirmationDialog
            note={noteToDelete}
            onConfirm={handleConfirmDelete}
            onDismiss={handleDismissDelete}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/40 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-['Cairo',sans-serif] flex flex-col transition-colors duration-200">
      {/* TopAppBar matching Compose TopAppBar */}
      <TopAppBar
        totalNotes={notes.length}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onExport={handleExport}
        onImportClick={() => setShowImportDialog(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-28">
        {/* Search Bar matching Compose SearchBar */}
        <div className="mb-6">
          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            selectedColor={selectedColorFilter}
            onSelectColor={setSelectedColorFilter}
          />
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredNotes.length === 0 ? (
          /* Empty State */
          <EmptyState
            hasSearchQuery={searchQuery.trim().length > 0 || selectedColorFilter !== null}
            onClearSearch={() => {
              setSearchQuery('');
              setSelectedColorFilter(null);
            }}
            onCreateNew={() => handleOpenEditor(null)}
          />
        ) : (
          /* Responsive Notes Grid / List (LazyColumn counterpart) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => handleOpenEditor(note.id)}
                onDelete={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(note);
                }}
                onTogglePin={(e) => handleTogglePin(e, note.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) matching Compose FAB */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          id="fab-add-note"
          onClick={() => handleOpenEditor(null)}
          title="إضافة ملاحظة جديدة"
          aria-label="إضافة ملاحظة"
          className="group flex items-center gap-2.5 px-5 py-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
        >
          <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
          <span className="text-base font-bold">ملاحظة جديدة</span>
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <DeleteConfirmationDialog
          note={noteToDelete}
          onConfirm={handleConfirmDelete}
          onDismiss={handleDismissDelete}
        />
      )}

      {/* Import Dialog */}
      <ImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImport}
      />
    </div>
  );
}
