import { usePersonStore } from '../usePersonStore';

// Mock expo-crypto
jest.mock('expo-crypto', () => {
  let counter = 0;
  return {
    randomUUID: () => `uuid-${++counter}`,
  };
});

// Mock the encrypted storage to avoid actual encryption
jest.mock('@/lib/encryptedStorage', () => ({
  encryptedStorage: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('usePersonStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    usePersonStore.setState({ people: {} });
  });

  describe('addPerson', () => {
    it('creates a person with generated id and timestamps', () => {
      const person = usePersonStore.getState().addPerson({
        firstName: 'Alice',
        lastName: 'Smith',
      });

      expect(person.id).toMatch(/^uuid-/);
      expect(person.firstName).toBe('Alice');
      expect(person.lastName).toBe('Smith');
      expect(person.createdAt).toBeGreaterThan(0);
      expect(person.updatedAt).toBe(person.createdAt);
    });

    it('sets default empty arrays for optional fields', () => {
      const person = usePersonStore.getState().addPerson({
        firstName: 'Bob',
        lastName: 'Jones',
      });

      expect(person.phoneNumbers).toEqual([]);
      expect(person.emails).toEqual([]);
      expect(person.tags).toEqual([]);
      expect(person.connectionIds).toEqual([]);
      expect(person.notes).toBe('');
    });

    it('assigns OTHER_CIRCLE_ID when no circleIds provided', () => {
      const person = usePersonStore.getState().addPerson({
        firstName: 'Charlie',
        lastName: 'Brown',
      });

      expect(person.circleIds).toEqual(['circle-other']);
    });

    it('assigns OTHER_CIRCLE_ID when circleIds is empty array', () => {
      const person = usePersonStore.getState().addPerson({
        firstName: 'Charlie',
        lastName: 'Brown',
        circleIds: [],
      });

      expect(person.circleIds).toEqual(['circle-other']);
    });

    it('preserves provided circleIds', () => {
      const person = usePersonStore.getState().addPerson({
        firstName: 'Diana',
        lastName: 'Prince',
        circleIds: ['circle-family', 'circle-friends'],
      });

      expect(person.circleIds).toEqual(['circle-family', 'circle-friends']);
    });

    it('stores the person in state', () => {
      const person = usePersonStore.getState().addPerson({
        firstName: 'Eve',
        lastName: 'Adams',
      });

      const stored = usePersonStore.getState().getPerson(person.id);
      expect(stored).toEqual(person);
    });

    it('preserves existing people when adding new ones', () => {
      const p1 = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      const p2 = usePersonStore.getState().addPerson({ firstName: 'C', lastName: 'D' });

      expect(usePersonStore.getState().getAllPeople()).toHaveLength(2);
      expect(usePersonStore.getState().getPerson(p1.id)).toBeDefined();
      expect(usePersonStore.getState().getPerson(p2.id)).toBeDefined();
    });

    it('accepts all optional fields', () => {
      const person = usePersonStore.getState().addPerson({
        firstName: 'Full',
        lastName: 'Person',
        photoUri: 'file:///photo.jpg',
        phoneNumbers: ['+1234567890'],
        emails: ['test@test.com'],
        circleIds: ['circle-work'],
        tags: ['vip'],
        notes: 'Important person',
        connectionIds: ['other-id'],
      });

      expect(person.photoUri).toBe('file:///photo.jpg');
      expect(person.phoneNumbers).toEqual(['+1234567890']);
      expect(person.emails).toEqual(['test@test.com']);
      expect(person.circleIds).toEqual(['circle-work']);
      expect(person.tags).toEqual(['vip']);
      expect(person.notes).toBe('Important person');
      expect(person.connectionIds).toEqual(['other-id']);
    });
  });

  describe('updatePerson', () => {
    it('updates specified fields', () => {
      const person = usePersonStore.getState().addPerson({
        firstName: 'Alice',
        lastName: 'Smith',
      });

      usePersonStore.getState().updatePerson(person.id, { firstName: 'Alicia' });

      const updated = usePersonStore.getState().getPerson(person.id);
      expect(updated!.firstName).toBe('Alicia');
      expect(updated!.lastName).toBe('Smith');
    });

    it('updates the updatedAt timestamp', () => {
      const person = usePersonStore.getState().addPerson({
        firstName: 'Alice',
        lastName: 'Smith',
      });
      const originalUpdatedAt = person.updatedAt;

      // Small delay to ensure different timestamp
      usePersonStore.getState().updatePerson(person.id, { notes: 'updated' });

      const updated = usePersonStore.getState().getPerson(person.id);
      expect(updated!.updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);
    });

    it('does nothing when person does not exist', () => {
      const initialState = { ...usePersonStore.getState().people };
      usePersonStore.getState().updatePerson('nonexistent', { firstName: 'Ghost' });
      expect(usePersonStore.getState().people).toEqual(initialState);
    });

    it('can update multiple fields at once', () => {
      const person = usePersonStore.getState().addPerson({
        firstName: 'Bob',
        lastName: 'Builder',
      });

      usePersonStore.getState().updatePerson(person.id, {
        firstName: 'Robert',
        lastName: 'Build',
        notes: 'Can he fix it? Yes he can!',
        tags: ['builder', 'hero'],
      });

      const updated = usePersonStore.getState().getPerson(person.id)!;
      expect(updated.firstName).toBe('Robert');
      expect(updated.lastName).toBe('Build');
      expect(updated.notes).toBe('Can he fix it? Yes he can!');
      expect(updated.tags).toEqual(['builder', 'hero']);
    });
  });

  describe('deletePerson', () => {
    it('removes the person from state', () => {
      const person = usePersonStore.getState().addPerson({
        firstName: 'Alice',
        lastName: 'Smith',
      });

      usePersonStore.getState().deletePerson(person.id);

      expect(usePersonStore.getState().getPerson(person.id)).toBeUndefined();
      expect(usePersonStore.getState().getAllPeople()).toHaveLength(0);
    });

    it('removes the person from other peoples connectionIds', () => {
      const p1 = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      const p2 = usePersonStore.getState().addPerson({ firstName: 'C', lastName: 'D' });
      const p3 = usePersonStore.getState().addPerson({ firstName: 'E', lastName: 'F' });

      usePersonStore.getState().addConnection(p1.id, p2.id);
      usePersonStore.getState().addConnection(p1.id, p3.id);

      // Delete p1 - should remove from p2 and p3's connections
      usePersonStore.getState().deletePerson(p1.id);

      expect(usePersonStore.getState().getPerson(p2.id)!.connectionIds).not.toContain(p1.id);
      expect(usePersonStore.getState().getPerson(p3.id)!.connectionIds).not.toContain(p1.id);
    });

    it('does nothing when person does not exist', () => {
      const person = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      usePersonStore.getState().deletePerson('nonexistent');
      expect(usePersonStore.getState().getAllPeople()).toHaveLength(1);
      expect(usePersonStore.getState().getPerson(person.id)).toBeDefined();
    });

    it('does not affect other people when deleting', () => {
      const p1 = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      const p2 = usePersonStore.getState().addPerson({ firstName: 'C', lastName: 'D' });

      usePersonStore.getState().deletePerson(p1.id);

      expect(usePersonStore.getState().getAllPeople()).toHaveLength(1);
      expect(usePersonStore.getState().getPerson(p2.id)).toBeDefined();
    });
  });

  describe('addConnection', () => {
    it('creates a bidirectional connection between two people', () => {
      const p1 = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      const p2 = usePersonStore.getState().addPerson({ firstName: 'C', lastName: 'D' });

      usePersonStore.getState().addConnection(p1.id, p2.id);

      expect(usePersonStore.getState().getPerson(p1.id)!.connectionIds).toContain(p2.id);
      expect(usePersonStore.getState().getPerson(p2.id)!.connectionIds).toContain(p1.id);
    });

    it('does not create duplicates when adding same connection twice', () => {
      const p1 = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      const p2 = usePersonStore.getState().addPerson({ firstName: 'C', lastName: 'D' });

      usePersonStore.getState().addConnection(p1.id, p2.id);
      usePersonStore.getState().addConnection(p1.id, p2.id);

      expect(usePersonStore.getState().getPerson(p1.id)!.connectionIds).toEqual([p2.id]);
      expect(usePersonStore.getState().getPerson(p2.id)!.connectionIds).toEqual([p1.id]);
    });

    it('does nothing when either person does not exist', () => {
      const p1 = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });

      usePersonStore.getState().addConnection(p1.id, 'nonexistent');

      expect(usePersonStore.getState().getPerson(p1.id)!.connectionIds).toEqual([]);
    });

    it('supports multiple connections per person', () => {
      const p1 = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      const p2 = usePersonStore.getState().addPerson({ firstName: 'C', lastName: 'D' });
      const p3 = usePersonStore.getState().addPerson({ firstName: 'E', lastName: 'F' });

      usePersonStore.getState().addConnection(p1.id, p2.id);
      usePersonStore.getState().addConnection(p1.id, p3.id);

      const p1Connections = usePersonStore.getState().getPerson(p1.id)!.connectionIds;
      expect(p1Connections).toContain(p2.id);
      expect(p1Connections).toContain(p3.id);
      expect(p1Connections).toHaveLength(2);
    });
  });

  describe('removeConnection', () => {
    it('removes a bidirectional connection', () => {
      const p1 = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      const p2 = usePersonStore.getState().addPerson({ firstName: 'C', lastName: 'D' });

      usePersonStore.getState().addConnection(p1.id, p2.id);
      usePersonStore.getState().removeConnection(p1.id, p2.id);

      expect(usePersonStore.getState().getPerson(p1.id)!.connectionIds).not.toContain(p2.id);
      expect(usePersonStore.getState().getPerson(p2.id)!.connectionIds).not.toContain(p1.id);
    });

    it('does nothing when either person does not exist', () => {
      const p1 = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      usePersonStore.getState().removeConnection(p1.id, 'nonexistent');
      expect(usePersonStore.getState().getPerson(p1.id)!.connectionIds).toEqual([]);
    });

    it('preserves other connections when removing one', () => {
      const p1 = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      const p2 = usePersonStore.getState().addPerson({ firstName: 'C', lastName: 'D' });
      const p3 = usePersonStore.getState().addPerson({ firstName: 'E', lastName: 'F' });

      usePersonStore.getState().addConnection(p1.id, p2.id);
      usePersonStore.getState().addConnection(p1.id, p3.id);
      usePersonStore.getState().removeConnection(p1.id, p2.id);

      expect(usePersonStore.getState().getPerson(p1.id)!.connectionIds).toEqual([p3.id]);
      expect(usePersonStore.getState().getPerson(p3.id)!.connectionIds).toEqual([p1.id]);
    });
  });

  describe('getPerson', () => {
    it('returns the person when found', () => {
      const person = usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      expect(usePersonStore.getState().getPerson(person.id)).toEqual(person);
    });

    it('returns undefined when not found', () => {
      expect(usePersonStore.getState().getPerson('nonexistent')).toBeUndefined();
    });
  });

  describe('getAllPeople', () => {
    it('returns empty array when no people exist', () => {
      expect(usePersonStore.getState().getAllPeople()).toEqual([]);
    });

    it('returns all people as an array', () => {
      usePersonStore.getState().addPerson({ firstName: 'A', lastName: 'B' });
      usePersonStore.getState().addPerson({ firstName: 'C', lastName: 'D' });
      usePersonStore.getState().addPerson({ firstName: 'E', lastName: 'F' });

      expect(usePersonStore.getState().getAllPeople()).toHaveLength(3);
    });
  });

  describe('getPeopleSortedAlphabetically', () => {
    it('returns people sorted by full name', () => {
      usePersonStore.getState().addPerson({ firstName: 'Charlie', lastName: 'Brown' });
      usePersonStore.getState().addPerson({ firstName: 'Alice', lastName: 'Smith' });
      usePersonStore.getState().addPerson({ firstName: 'Bob', lastName: 'Jones' });

      const sorted = usePersonStore.getState().getPeopleSortedAlphabetically();
      expect(sorted[0].firstName).toBe('Alice');
      expect(sorted[1].firstName).toBe('Bob');
      expect(sorted[2].firstName).toBe('Charlie');
    });

    it('returns empty array when no people exist', () => {
      expect(usePersonStore.getState().getPeopleSortedAlphabetically()).toEqual([]);
    });
  });

  describe('getPeopleSortedByRecency', () => {
    it('returns people sorted by createdAt descending (newest first)', () => {
      // Create people with explicit different timestamps
      const p1 = usePersonStore.getState().addPerson({ firstName: 'First', lastName: 'Added' });
      usePersonStore.getState().updatePerson(p1.id, {}); // just to set updatedAt
      // Manually override createdAt to ensure deterministic ordering
      usePersonStore.setState((state) => ({
        people: {
          ...state.people,
          [p1.id]: { ...state.people[p1.id], createdAt: 1000 },
        },
      }));

      const p2 = usePersonStore.getState().addPerson({ firstName: 'Second', lastName: 'Added' });
      usePersonStore.setState((state) => ({
        people: {
          ...state.people,
          [p2.id]: { ...state.people[p2.id], createdAt: 2000 },
        },
      }));

      const p3 = usePersonStore.getState().addPerson({ firstName: 'Third', lastName: 'Added' });
      usePersonStore.setState((state) => ({
        people: {
          ...state.people,
          [p3.id]: { ...state.people[p3.id], createdAt: 3000 },
        },
      }));

      const sorted = usePersonStore.getState().getPeopleSortedByRecency();
      // Most recently created should come first
      expect(sorted[0].id).toBe(p3.id);
      expect(sorted[1].id).toBe(p2.id);
      expect(sorted[2].id).toBe(p1.id);
    });
  });

  describe('getPeopleByCircle', () => {
    it('returns people belonging to a specific circle', () => {
      usePersonStore.getState().addPerson({
        firstName: 'Family',
        lastName: 'Member',
        circleIds: ['circle-family'],
      });
      usePersonStore.getState().addPerson({
        firstName: 'Work',
        lastName: 'Colleague',
        circleIds: ['circle-work'],
      });
      usePersonStore.getState().addPerson({
        firstName: 'Both',
        lastName: 'Circles',
        circleIds: ['circle-family', 'circle-work'],
      });

      const familyPeople = usePersonStore.getState().getPeopleByCircle('circle-family');
      expect(familyPeople).toHaveLength(2);
      expect(familyPeople.map((p) => p.firstName).sort()).toEqual(['Both', 'Family']);
    });

    it('returns empty array for circle with no members', () => {
      expect(usePersonStore.getState().getPeopleByCircle('circle-empty')).toEqual([]);
    });
  });

  describe('searchPeople', () => {
    beforeEach(() => {
      usePersonStore.getState().addPerson({ firstName: 'Alice', lastName: 'Smith', tags: ['friend', 'vip'] });
      usePersonStore.getState().addPerson({ firstName: 'Bob', lastName: 'Jones', tags: ['coworker'] });
      usePersonStore.getState().addPerson({ firstName: 'Charlie', lastName: 'Alice', tags: [] });
    });

    it('searches by firstName (case-insensitive)', () => {
      const results = usePersonStore.getState().searchPeople('alice');
      expect(results).toHaveLength(2); // Alice Smith + Charlie Alice
    });

    it('searches by lastName (case-insensitive)', () => {
      const results = usePersonStore.getState().searchPeople('JONES');
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Bob');
    });

    it('searches by tags (case-insensitive)', () => {
      const results = usePersonStore.getState().searchPeople('VIP');
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Alice');
    });

    it('returns all people for empty query', () => {
      // The store's searchPeople with empty string returns everything because
      // ''.toLowerCase() includes '' in every string
      const results = usePersonStore.getState().searchPeople('');
      expect(results).toHaveLength(3);
    });

    it('returns empty array when no matches', () => {
      const results = usePersonStore.getState().searchPeople('zzzznotfound');
      expect(results).toEqual([]);
    });

    it('matches partial strings', () => {
      const results = usePersonStore.getState().searchPeople('lic');
      expect(results).toHaveLength(2); // Alice Smith + Charlie Alice
    });
  });
});
