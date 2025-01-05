import { create } from "zustand";

interface CourseModals {
  newSectionModal: boolean;
  toggleNewSectionModal: (bool: boolean) => void;
}

export const useCourseModals = create<CourseModals>((set) => ({
  newSectionModal: false,
  registerModal: false,
  toggleNewSectionModal: (bool: boolean) => set(() => ({ newSectionModal: bool })),
}));
