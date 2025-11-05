'use client';

import { useState } from 'react';
import { useAddLeadNote, useLeadNotes } from '@/hooks/useLeads';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { InlineError } from '@/components/ui/ErrorMessage';
import type { LeadNote } from '@/types/leads';

interface NotesProps {
  leadId: number;
  onNoteSubmit?: (note: string) => void;
}

export default function Notes({ leadId, onNoteSubmit }: NotesProps) {
  const { data: notes, isLoading: notesLoading } = useLeadNotes(leadId);
  const [newNote, setNewNote] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  const addNote = useAddLeadNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newNote.trim() === '') {
      setApiError('Note cannot be empty');
      return;
    }

    if (newNote.trim().length < 3) {
      setApiError('Note must be at least 3 characters');
      return;
    }

    setApiError(null);

    try {
      await addNote.mutateAsync({
        leadId,
        content: newNote.trim(),
      });

      // Call optional callback
      if (onNoteSubmit) {
        onNoteSubmit(newNote.trim());
      }

      // Clear input
      setNewNote('');
    } catch (error: any) {
      setApiError(error.message || 'Failed to add note. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-sm text-gray-900 mb-3">Notes</h4>

        {/* Notes List Loading State */}
        {notesLoading ? (
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner size="sm" label="Loading notes..." />
          </div>
        ) : notes && notes.length > 0 ? (
          <div className="space-y-3 mb-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded"
              >
                <p className="text-sm text-gray-800">{note.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(note.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic mb-4">No notes yet</p>
        )}
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="new-note" className="sr-only">
            Add a note
          </label>
          <textarea
            id="new-note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            rows={3}
            placeholder="Add a note about this lead..."
            disabled={addNote.isPending}
          />
        </div>

        {apiError && <InlineError message={apiError} />}

        <button
          type="submit"
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={addNote.isPending || !newNote.trim()}
        >
          {addNote.isPending && <LoadingSpinner size="sm" />}
          {addNote.isPending ? 'Adding Note...' : 'Add Note'}
        </button>
      </form>
    </div>
  );
}
