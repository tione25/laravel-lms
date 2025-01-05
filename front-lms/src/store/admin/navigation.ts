import { create } from 'zustand'

interface AdminNavigation {
    collapse: boolean,
    mobileSidebar: boolean,
    toggleCollapse: (bool: boolean) => void,
    toggleMobileSidebar: (bool: boolean) => void,
  }

export const useAdminNavigationStore = create<AdminNavigation>((set) => ({
  collapse: false,
  mobileSidebar: false,
  toggleCollapse: (bool: boolean) => set(() => ({ collapse: bool })),
  toggleMobileSidebar: (bool: boolean) =>  set(() => ({ mobileSidebar: bool })),
}))