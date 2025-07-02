import { create } from "zustand";

interface WindowSizeState {
    windowWidth : number
    setWindowWidth : (width : number)=> void
}


export const useWindowSizeStore = create<WindowSizeState>((set) => ({
    windowWidth: 0, // or false, depending on your default
    setWindowWidth: (width: number) => set({ windowWidth: width })
}));