import { create } from 'zustand';

interface SelectedFiltersState {
  selectedStateId: number | null;
  selectedUniversityId: number | null;

  setSelectedStateId: (id: number) => void;
  setSelectedUniversityId: (id: number) => void;

  resetFilters: () => void;
}

export const useSelectedFiltersStore = create<SelectedFiltersState>((set) => ({
  selectedStateId: null,
  selectedUniversityId: null,

  setSelectedStateId: (id) => set({ selectedStateId: id }),
  setSelectedUniversityId: (id) => set({ selectedUniversityId: id }),

  resetFilters: () =>
    set({
      selectedStateId: null,
      selectedUniversityId: null,
    }),
}));
