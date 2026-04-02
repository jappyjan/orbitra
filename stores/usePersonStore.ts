import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as Crypto from 'expo-crypto';
import { Person, PersonCreate, getFullName } from '@/models/Person';
import { OTHER_CIRCLE_ID } from '@/constants/CircleDefaults';
import { encryptedStorage } from '@/lib/encryptedStorage';

interface PersonState {
  people: Record<string, Person>;
  addPerson: (data: PersonCreate) => Person;
  updatePerson: (id: string, updates: Partial<Omit<Person, 'id' | 'createdAt'>>) => void;
  deletePerson: (id: string) => void;
  addConnection: (personId: string, connectedPersonId: string) => void;
  removeConnection: (personId: string, connectedPersonId: string) => void;
  getPerson: (id: string) => Person | undefined;
  getAllPeople: () => Person[];
  getPeopleSortedAlphabetically: () => Person[];
  getPeopleSortedByRecency: () => Person[];
  getPeopleByCircle: (circleId: string) => Person[];
  searchPeople: (query: string) => Person[];
}

export const usePersonStore = create<PersonState>()(
  persist(
    (set, get) => ({
      people: {},

      addPerson: (data) => {
        const now = Date.now();
        const person: Person = {
          id: Crypto.randomUUID(),
          firstName: data.firstName,
          lastName: data.lastName,
          photoUri: data.photoUri,
          phoneNumbers: data.phoneNumbers ?? [],
          emails: data.emails ?? [],
          circleIds: data.circleIds?.length ? data.circleIds : [OTHER_CIRCLE_ID],
          tags: data.tags ?? [],
          notes: data.notes ?? '',
          connectionIds: data.connectionIds ?? [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          people: { ...state.people, [person.id]: person },
        }));
        return person;
      },

      updatePerson: (id, updates) =>
        set((state) => {
          const existing = state.people[id];
          if (!existing) return state;
          return {
            people: {
              ...state.people,
              [id]: { ...existing, ...updates, updatedAt: Date.now() },
            },
          };
        }),

      deletePerson: (id) =>
        set((state) => {
          const { [id]: deleted, ...rest } = state.people;
          if (!deleted) return state;
          // Remove this person from all connections
          const updated: Record<string, Person> = {};
          for (const [key, person] of Object.entries(rest)) {
            if (person.connectionIds.includes(id)) {
              updated[key] = {
                ...person,
                connectionIds: person.connectionIds.filter((cid) => cid !== id),
                updatedAt: Date.now(),
              };
            } else {
              updated[key] = person;
            }
          }
          return { people: updated };
        }),

      addConnection: (personId, connectedPersonId) =>
        set((state) => {
          const person = state.people[personId];
          const connected = state.people[connectedPersonId];
          if (!person || !connected) return state;
          const now = Date.now();
          return {
            people: {
              ...state.people,
              [personId]: {
                ...person,
                connectionIds: [...new Set([...person.connectionIds, connectedPersonId])],
                updatedAt: now,
              },
              [connectedPersonId]: {
                ...connected,
                connectionIds: [...new Set([...connected.connectionIds, personId])],
                updatedAt: now,
              },
            },
          };
        }),

      removeConnection: (personId, connectedPersonId) =>
        set((state) => {
          const person = state.people[personId];
          const connected = state.people[connectedPersonId];
          if (!person || !connected) return state;
          const now = Date.now();
          return {
            people: {
              ...state.people,
              [personId]: {
                ...person,
                connectionIds: person.connectionIds.filter((id) => id !== connectedPersonId),
                updatedAt: now,
              },
              [connectedPersonId]: {
                ...connected,
                connectionIds: connected.connectionIds.filter((id) => id !== personId),
                updatedAt: now,
              },
            },
          };
        }),

      getPerson: (id) => get().people[id],

      getAllPeople: () => Object.values(get().people),

      getPeopleSortedAlphabetically: () =>
        Object.values(get().people).sort((a, b) =>
          getFullName(a).localeCompare(getFullName(b))
        ),

      getPeopleSortedByRecency: () =>
        Object.values(get().people).sort((a, b) => b.createdAt - a.createdAt),

      getPeopleByCircle: (circleId) =>
        Object.values(get().people).filter((p) => p.circleIds.includes(circleId)),

      searchPeople: (query) => {
        const lower = query.toLowerCase();
        return Object.values(get().people).filter(
          (p) =>
            p.firstName.toLowerCase().includes(lower) ||
            p.lastName.toLowerCase().includes(lower) ||
            p.tags.some((t) => t.toLowerCase().includes(lower))
        );
      },
    }),
    {
      name: 'orbitra-people',
      storage: createJSONStorage(() => encryptedStorage),
      skipHydration: true,
    }
  )
);
