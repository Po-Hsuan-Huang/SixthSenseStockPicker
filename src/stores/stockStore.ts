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
}));
