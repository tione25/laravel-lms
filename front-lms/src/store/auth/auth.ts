import { create } from "zustand";

interface AuthModals {
  user: Object;
}

export const useAuthModalsStore = create<AuthModals>((set) => ({
  user: false,
}));
