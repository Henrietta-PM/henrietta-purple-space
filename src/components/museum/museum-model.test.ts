import { describe, expect, test } from 'bun:test';
import { advancePosition, pavilions, routeToDoor } from './museum-model';

describe('museum visitor flow', () => {
  test('Sally, Targett and ProxyMedicine occupy the three prominent pavilions', () => {
    expect(pavilions.slice(0, 3).map((item) => item.project.name)).toEqual(['Sally', 'Targett', 'ProxyMedicine']);
  });
  test('a selected building route ends at its door', () => {
    const pavilion = pavilions[0];
    if (!pavilion) throw new Error('Missing Sally pavilion');
    expect(routeToDoor([0, 0.15, 10], pavilion.door).at(-1)).toEqual(pavilion.door);
  });
  test('walking stops at the entrance without overshooting', () => {
    expect(advancePosition([0, 0, 0], [1, 0, 0], 2)).toEqual({ position: [1, 0, 0], arrived: true });
    expect(advancePosition([0, 0, 0], [4, 0, 0], 1)).toEqual({ position: [1, 0, 0], arrived: false });
  });
});