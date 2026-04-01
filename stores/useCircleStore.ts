import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Circle } from '@/models/Circle';
import { DEFAULT_CIRCLES } from '@/constants/CircleDefaults';

interface CircleState {
  circles: Record<string, Circle>;
  addCircle: (circle: Circle) => void;
  updateCircle: (id: string, updates: Partial<Omit<Circle, 'id'>>) => void;
  deleteCircle: (id: string) => void;
  getCircle: (id: string) => Circle | undefined;
  getAllCircles: () => Circle[];
}

const defaultCirclesRecord: Record<string, Circle> = {};
for (const circle of DEFAULT_CIRCLES) {
  defaultCirclesRecord[circle.id] = circle;
}

export const useCircleStore = create<CircleState>()(
  persist(
    (set, get) => ({
      circles: defaultCirclesRecord,

      addCircle: (circle) =>
        set((state) => ({
          circles: { ...state.circles, [circle.id]: circle },
        })),

      updateCircle: (id, updates) =>
        set((state) => {
          const existing = state.circles[id];
          if (!existing) return state;
          return {
            circles: { ...state.circles, [id]: { ...existing, ...updates } },
          };
        }),

      deleteCircle: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.circles;
          return { circles: rest };
        }),

      getCircle: (id) => get().circles[id],

      getAllCircles: () => Object.values(get().circles),
    }),
    {
      name: 'orbitra-circles',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
