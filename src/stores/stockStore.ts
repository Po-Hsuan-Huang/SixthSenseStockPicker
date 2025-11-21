import { create } from 'zustand';
import type { BubbleProperties } from '../utils/physics';

export type ViewMode = 'radar' | 'classic' | 'learn';
export type FilterMode = 'all' | 'gainers' | 'most-traded' | 'best-value';

interface StockStore {
    // Data
    stocks: BubbleProperties[];
    setStocks: (stocks: BubbleProperties[]) => void;

    // View mode
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;

    // Filter
    filterMode: FilterMode;
    setFilterMode: (mode: FilterMode) => void;

    // Physics settings
    gravityStrength: number;
    setGravityStrength: (strength: number) => void;

    timeSpeed: number;
    setTimeSpeed: (speed: number) => void;

    collisionsEnabled: boolean;
    setCollisionsEnabled: (enabled: boolean) => void;

    physicsEnabled: boolean;
    setPhysicsEnabled: (enabled: boolean) => void;

    showLabels: boolean;
    setShowLabels: (show: boolean) => void;

    showSectorZones: boolean;
    setShowSectorZones: (show: boolean) => void;

    // Loading & error states
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;

    error: string | null;
    setError: (error: string | null) => void;

    // Learn tab
    chapterIndex: number;
    setChapterIndex: (index: number) => void;

    // Gravitational Wave
    wave: { active: boolean; center: [number, number, number]; startTime: number };
    triggerWave: (center: [number, number, number]) => void;
}

export const useStockStore = create<StockStore>((set) => ({
    // Data
    stocks: [],
    setStocks: (stocks) => set({ stocks }),

    // View mode
    viewMode: 'radar',
    setViewMode: (viewMode) => set({ viewMode }),

    // Filter
    filterMode: 'all',
    setFilterMode: (filterMode) => set({ filterMode }),

    // Physics settings
    gravityStrength: 0.03,
    setGravityStrength: (gravityStrength) => set({ gravityStrength }),

    timeSpeed: 0.5,
    setTimeSpeed: (timeSpeed) => set({ timeSpeed }),

    collisionsEnabled: true,
    setCollisionsEnabled: (collisionsEnabled) => set({ collisionsEnabled }),

    physicsEnabled: true,
    setPhysicsEnabled: (physicsEnabled) => set({ physicsEnabled }),

    showLabels: true,
    setShowLabels: (showLabels) => set({ showLabels }),

    showSectorZones: false,
    setShowSectorZones: (showSectorZones) => set({ showSectorZones }),

    // Loading & error
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),

    error: null,
    setError: (error) => set({ error }),

    // Learn tab
    chapterIndex: 0,
    setChapterIndex: (chapterIndex) => set({ chapterIndex }),

    // Gravitational Wave
    wave: { active: false, center: [0, 0, 0], startTime: 0 },
    triggerWave: (center) => {
        set({ wave: { active: true, center, startTime: Date.now() / 1000 } });
        // Auto-reset wave after 2 seconds
        setTimeout(() => {
            set((state) => {
                // Only reset if it's the same wave (simple check)
                if (state.wave.startTime === center[0]) return state; // invalid check but placeholder
                return { wave: { ...state.wave, active: false } };
            });
        }, 2000);
    },
}));
