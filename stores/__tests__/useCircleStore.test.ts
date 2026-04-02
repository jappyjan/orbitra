import { useCircleStore } from '../useCircleStore';
import { DEFAULT_CIRCLES } from '@/constants/CircleDefaults';
import { Circle } from '@/models/Circle';

describe('useCircleStore', () => {
  beforeEach(() => {
    // Reset to default circles
    const defaultCirclesRecord: Record<string, Circle> = {};
    for (const circle of DEFAULT_CIRCLES) {
      defaultCirclesRecord[circle.id] = circle;
    }
    useCircleStore.setState({ circles: defaultCirclesRecord });
  });

  describe('initial state', () => {
    it('contains all default circles', () => {
      const circles = useCircleStore.getState().getAllCircles();
      expect(circles).toHaveLength(DEFAULT_CIRCLES.length);
    });

    it('includes Family circle', () => {
      const family = useCircleStore.getState().getCircle('circle-family');
      expect(family).toBeDefined();
      expect(family!.name).toBe('Family');
    });

    it('includes Friends circle', () => {
      const friends = useCircleStore.getState().getCircle('circle-friends');
      expect(friends).toBeDefined();
      expect(friends!.name).toBe('Friends');
    });
  });

  describe('addCircle', () => {
    it('adds a new circle', () => {
      const newCircle: Circle = {
        id: 'circle-custom',
        name: 'Gym Buddies',
        color: '#00FF00',
        isDefault: false,
      };

      useCircleStore.getState().addCircle(newCircle);

      const retrieved = useCircleStore.getState().getCircle('circle-custom');
      expect(retrieved).toEqual(newCircle);
    });

    it('overwrites existing circle with same id', () => {
      const replacement: Circle = {
        id: 'circle-family',
        name: 'Extended Family',
        color: '#FF0000',
        isDefault: true,
      };

      useCircleStore.getState().addCircle(replacement);

      const retrieved = useCircleStore.getState().getCircle('circle-family');
      expect(retrieved!.name).toBe('Extended Family');
    });

    it('preserves other circles when adding', () => {
      const initialCount = useCircleStore.getState().getAllCircles().length;

      useCircleStore.getState().addCircle({
        id: 'circle-new',
        name: 'New',
        color: '#000',
        isDefault: false,
      });

      expect(useCircleStore.getState().getAllCircles()).toHaveLength(initialCount + 1);
    });
  });

  describe('updateCircle', () => {
    it('updates specified fields', () => {
      useCircleStore.getState().updateCircle('circle-family', { name: 'Close Family' });

      const updated = useCircleStore.getState().getCircle('circle-family');
      expect(updated!.name).toBe('Close Family');
      expect(updated!.color).toBe('#E74C3C'); // unchanged
    });

    it('can update color', () => {
      useCircleStore.getState().updateCircle('circle-friends', { color: '#0000FF' });

      const updated = useCircleStore.getState().getCircle('circle-friends');
      expect(updated!.color).toBe('#0000FF');
    });

    it('does nothing when circle does not exist', () => {
      const before = useCircleStore.getState().getAllCircles().length;
      useCircleStore.getState().updateCircle('nonexistent', { name: 'Ghost' });
      expect(useCircleStore.getState().getAllCircles()).toHaveLength(before);
    });

    it('can update multiple fields at once', () => {
      useCircleStore.getState().updateCircle('circle-work', {
        name: 'Career',
        color: '#123456',
      });

      const updated = useCircleStore.getState().getCircle('circle-work');
      expect(updated!.name).toBe('Career');
      expect(updated!.color).toBe('#123456');
    });
  });

  describe('deleteCircle', () => {
    it('removes a circle', () => {
      useCircleStore.getState().deleteCircle('circle-other');

      expect(useCircleStore.getState().getCircle('circle-other')).toBeUndefined();
    });

    it('does not affect other circles', () => {
      useCircleStore.getState().deleteCircle('circle-other');

      expect(useCircleStore.getState().getCircle('circle-family')).toBeDefined();
      expect(useCircleStore.getState().getCircle('circle-friends')).toBeDefined();
    });

    it('handles deleting nonexistent circle gracefully', () => {
      const before = useCircleStore.getState().getAllCircles().length;
      useCircleStore.getState().deleteCircle('nonexistent');
      // Deleting nonexistent circle creates a new state without it (no-op effectively)
      expect(useCircleStore.getState().getAllCircles().length).toBeLessThanOrEqual(before);
    });
  });

  describe('getCircle', () => {
    it('returns circle when found', () => {
      const circle = useCircleStore.getState().getCircle('circle-family');
      expect(circle).toBeDefined();
      expect(circle!.id).toBe('circle-family');
    });

    it('returns undefined when not found', () => {
      expect(useCircleStore.getState().getCircle('nonexistent')).toBeUndefined();
    });
  });

  describe('getAllCircles', () => {
    it('returns all circles as an array', () => {
      const circles = useCircleStore.getState().getAllCircles();
      expect(Array.isArray(circles)).toBe(true);
      expect(circles.length).toBeGreaterThan(0);
    });

    it('returns empty array when all circles are deleted', () => {
      const circles = useCircleStore.getState().getAllCircles();
      for (const circle of circles) {
        useCircleStore.getState().deleteCircle(circle.id);
      }
      expect(useCircleStore.getState().getAllCircles()).toEqual([]);
    });
  });
});
