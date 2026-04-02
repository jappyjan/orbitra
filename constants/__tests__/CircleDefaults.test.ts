import { DEFAULT_CIRCLES, OTHER_CIRCLE_ID } from '../CircleDefaults';

describe('DEFAULT_CIRCLES', () => {
  it('contains exactly 5 circles', () => {
    expect(DEFAULT_CIRCLES).toHaveLength(5);
  });

  it('includes Family, Friends, Work, Community, and Other', () => {
    const names = DEFAULT_CIRCLES.map((c) => c.name);
    expect(names).toEqual(['Family', 'Friends', 'Work', 'Community', 'Other']);
  });

  it('all default circles have isDefault set to true', () => {
    for (const circle of DEFAULT_CIRCLES) {
      expect(circle.isDefault).toBe(true);
    }
  });

  it('all default circles have valid hex color codes', () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    for (const circle of DEFAULT_CIRCLES) {
      expect(circle.color).toMatch(hexPattern);
    }
  });

  it('all default circles have unique IDs', () => {
    const ids = DEFAULT_CIRCLES.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all default circles have non-empty names', () => {
    for (const circle of DEFAULT_CIRCLES) {
      expect(circle.name.length).toBeGreaterThan(0);
    }
  });

  it('has expected circle IDs', () => {
    const ids = DEFAULT_CIRCLES.map((c) => c.id);
    expect(ids).toContain('circle-family');
    expect(ids).toContain('circle-friends');
    expect(ids).toContain('circle-work');
    expect(ids).toContain('circle-community');
    expect(ids).toContain('circle-other');
  });
});

describe('OTHER_CIRCLE_ID', () => {
  it('equals circle-other', () => {
    expect(OTHER_CIRCLE_ID).toBe('circle-other');
  });

  it('matches the ID of the Other circle in DEFAULT_CIRCLES', () => {
    const otherCircle = DEFAULT_CIRCLES.find((c) => c.name === 'Other');
    expect(otherCircle).toBeDefined();
    expect(otherCircle!.id).toBe(OTHER_CIRCLE_ID);
  });
});
