import Colors from '../Colors';

describe('Colors', () => {
  it('has light and dark themes', () => {
    expect(Colors).toHaveProperty('light');
    expect(Colors).toHaveProperty('dark');
  });

  const requiredKeys = [
    'text',
    'textSecondary',
    'background',
    'backgroundSecondary',
    'tint',
    'tabIconDefault',
    'tabIconSelected',
    'card',
    'cardBorder',
    'separator',
    'placeholder',
    'danger',
  ] as const;

  describe('light theme', () => {
    it('contains all required color keys', () => {
      for (const key of requiredKeys) {
        expect(Colors.light).toHaveProperty(key);
        expect(typeof Colors.light[key]).toBe('string');
      }
    });

    it('has white background', () => {
      expect(Colors.light.background).toBe('#fff');
    });

    it('has dark text', () => {
      expect(Colors.light.text).toBe('#000');
    });

    it('has danger color set to red', () => {
      expect(Colors.light.danger).toBe('#E74C3C');
    });
  });

  describe('dark theme', () => {
    it('contains all required color keys', () => {
      for (const key of requiredKeys) {
        expect(Colors.dark).toHaveProperty(key);
        expect(typeof Colors.dark[key]).toBe('string');
      }
    });

    it('has black background', () => {
      expect(Colors.dark.background).toBe('#000');
    });

    it('has white text', () => {
      expect(Colors.dark.text).toBe('#fff');
    });

    it('uses same danger color as light theme', () => {
      expect(Colors.dark.danger).toBe(Colors.light.danger);
    });
  });

  it('light and dark themes have the same set of keys', () => {
    const lightKeys = Object.keys(Colors.light).sort();
    const darkKeys = Object.keys(Colors.dark).sort();
    expect(lightKeys).toEqual(darkKeys);
  });
});
