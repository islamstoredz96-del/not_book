export interface NoteEntity {
  id: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  color?: string;
  pinned?: boolean;
}

export interface HomeUiState {
  notes: NoteEntity[];
  isLoading: boolean;
  searchQuery: string;
  showDeleteDialog: boolean;
  noteToDelete: NoteEntity | null;
  selectedColorFilter?: string | null;
}
