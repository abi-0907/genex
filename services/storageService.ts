import { IntakeNote } from '@/types';

let intakeNotes: IntakeNote[] = [];

export function saveIntakeNote(note: IntakeNote): void {
  intakeNotes.push(note);
}

export function getIntakeNotes(): IntakeNote[] {
  return intakeNotes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function getIntakeNoteById(id: string): IntakeNote | undefined {
  return intakeNotes.find(note => note.id === id);
}

export function updateIntakeNote(id: string, updates: Partial<IntakeNote>): void {
  const index = intakeNotes.findIndex(note => note.id === id);
  if (index !== -1) {
    intakeNotes[index] = { ...intakeNotes[index], ...updates };
  }
}

export function deleteIntakeNote(id: string): void {
  intakeNotes = intakeNotes.filter(note => note.id !== id);
}
