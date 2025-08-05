import { create } from 'zustand';

interface ResumeStore {
  resume: File | null;
  jd: string;
  setResume: (resume: File | null) => void;
  setJD: (jd: string) => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: null,
  jd: '',
  setResume: (resume) => set({ resume }),
  setJD: (jd) => set({ jd }),
  reset: () => set({ resume: null, jd: '' }),
}));
