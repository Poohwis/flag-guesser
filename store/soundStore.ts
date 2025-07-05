import { create } from "zustand";

interface SoundState {
    soundEnabled : boolean
    setSoundEnabled : (enabled : boolean)=>void
}


export const useSoundStore = create<SoundState>((set) => ({
    soundEnabled : false,
    setSoundEnabled : (enabled : boolean) => set({ soundEnabled: enabled })
}));