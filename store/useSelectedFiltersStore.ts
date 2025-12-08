import { create } from 'zustand';

interface SelectedFiltersState {
  selectedStateId: number | null;
  selectedUniversityId: number | null;
  selectedCourseId: number | null;
  selectedSubjectId: number | null;

  setSelectedStateId: (id: number) => void;
  setSelectedUniversityId: (id: number) => void;
  setSelectedCourseId: (id: number) => void;
  setSelectedSubjectId: (id: number) => void;

  resetFilters: () => void;
}

export const useSelectedFiltersStore = create<SelectedFiltersState>((set) => ({
  selectedStateId: null,
  selectedUniversityId: null,
  selectedCourseId: null,
  selectedSubjectId: null,

  setSelectedStateId: (id) => set({ selectedStateId: id }),
  setSelectedUniversityId: (id) => set({ selectedUniversityId: id }),
  setSelectedCourseId: (id) => set({ selectedCourseId: id }),
  setSelectedSubjectId: (id) => set({ selectedSubjectId: id }),

  resetFilters: () =>
    set({
      selectedStateId: null,
      selectedUniversityId: null,
      selectedCourseId: null,
      selectedSubjectId: null,
    }),
}));
