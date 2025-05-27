import { create } from 'zustand';

export type Session = {
  id: string;
  name: string;
  time: string;
  exercises: any[];
};

type SessionState = {
  sessions: Session[] | null;
  setSessions: (sessions: Session[]) => void;
  clearSessions: () => void;
  addExerciseToSession: (sessionId: string, exercise: any) => void;
  addSetToExercise: (sessionId: string, exerciseId: string, set: any) => void;
  deleteSession: (sessionId: string) => void;
  deleteExerciseFromSession: (sessionId: string, exerciseId: string) => void;
  deleteSetFromExercise: (sessionId: string, exerciseId: string, setId: string) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  sessions: null,
  setSessions: (sessions) => set({ sessions }),
  clearSessions: () => set({ sessions: null }),
  addExerciseToSession: (sessionId, exercise) =>
    set((state) => ({
      sessions: state.sessions?.map((session) =>
        session.id === sessionId
          ? { ...session, exercises: [...session.exercises, exercise] }
          : session
      ) || null,
    })),
  addSetToExercise: (sessionId, exerciseId, newSet) =>
    set((state) => ({
      sessions: state.sessions?.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: session.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, sets: [...(exercise.sets || []), newSet] }
                  : exercise
              ),
            }
          : session
      ) || null,
    })),
  deleteSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions?.filter((session) => session.id !== sessionId) || null,
    })),
  deleteExerciseFromSession: (sessionId, exerciseId) =>
    set((state) => ({
      sessions: state.sessions?.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: session.exercises.filter((exercise) => exercise.id !== exerciseId),
            }
          : session
      ) || null,
    })),
  deleteSetFromExercise: (sessionId, exerciseId, setId) =>
    set((state) => ({
      sessions: state.sessions?.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: session.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      sets: (exercise.sets || []).filter((set: any) => set.id !== setId),
                    }
                  : exercise
              ),
            }
          : session
      ) || null,
    })),
}));