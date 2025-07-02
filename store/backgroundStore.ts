import { create } from "zustand";

interface BackgroundState {
    backgroundEnabled : boolean
    backgroundIndex : number
    setBackgroundEnabled : (enabled : boolean)=>void
    setBackgroundIndex : (index : number)=>void
}


export const useBackgroundStore = create<BackgroundState>((set) => ({
    backgroundEnabled: true, // or false, depending on your default
    backgroundIndex:  0,
    setBackgroundEnabled: (enabled: boolean) => set({ backgroundEnabled: enabled }),
    setBackgroundIndex: (index: number) => set({ backgroundIndex: index }),
}));