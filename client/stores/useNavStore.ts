import { create } from 'zustand';

interface HomeNavState {
  selectedDate: Date | null;
  isOnHome: boolean;
  resetToToday: () => void;
}

type NavStore = {
  homeNav: HomeNavState;
  setHomeNavData: (data: Partial<HomeNavState>) => void;
  isOnHomeAndPastDate: () => boolean;
  resetToToday: () => void;
};

export const useNavStore = create<NavStore>((set, get) => ({
  homeNav: {
    selectedDate: new Date(),
    isOnHome: false,
    resetToToday: () => {}
  },
  
  setHomeNavData: (data) => set((state) => ({
    homeNav: { ...state.homeNav, ...data }
  })),
  
  isOnHomeAndPastDate: () => {
    const { homeNav } = get();
    if (!homeNav.isOnHome || !homeNav.selectedDate) return false;
    
    const today = new Date();
    const selectedDate = homeNav.selectedDate;
    
    return !(
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    );
  },
  
  resetToToday: () => {
    const { homeNav } = get();
    if (homeNav.resetToToday) {
      homeNav.resetToToday();
    }
  }
}));