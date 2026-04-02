import { Circle } from '../Circle';

describe('Circle interface', () => {
  it('can create a valid Circle object', () => {
    const circle: Circle = {
      id: 'circle-test',
      name: 'Test Circle',
      color: '#FF0000',
      isDefault: false,
    };
    expect(circle.id).toBe('circle-test');
    expect(circle.name).toBe('Test Circle');
    expect(circle.color).toBe('#FF0000');
    expect(circle.isDefault).toBe(false);
  });

  it('can represent a default circle', () => {
    const circle: Circle = {
      id: 'circle-family',
      name: 'Family',
      color: '#E74C3C',
      isDefault: true,
    };
    expect(circle.isDefault).toBe(true);
  });

  it('can represent a custom circle', () => {
    const circle: Circle = {
      id: 'circle-custom-1',
      name: 'Gym Buddies',
      color: '#00FF00',
      isDefault: false,
    };
    expect(circle.isDefault).toBe(false);
    expect(circle.name).toBe('Gym Buddies');
  });
});
