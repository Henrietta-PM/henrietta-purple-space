import { projectsData } from '@/data/projects';

export type TourPhase = 'grounds' | 'walking' | 'opening' | 'ready' | 'entering' | 'gallery';
export type Point = [number, number, number];

const names = ['Sally', 'Targett', 'ProxyMedicine', 'Bloomie AI', 'VibeStack', 'NYSC Attendance System', 'Syncu', 'CareerPASS'];

export const pavilions = names.flatMap((name, index) => {
  const project = projectsData.find((item) => item.name === name);
  if (!project) return [];
  const position: Point = index < 3 ? [(index - 1) * 13, 0, -5] : [(index - 5) * 11, 0, -21];
  return [{ id: index, project, position, width: index < 3 ? 10 : 8.4, depth: 8, door: [position[0], 0.15, position[2] + 4.5] as Point }];
});

export type Pavilion = (typeof pavilions)[number];

export function routeToDoor(from: Point, door: Point): Point[] {
  const aisle = door[2] < -10 ? -13 : 3;
  return [[from[0], 0.15, 3], [26, 0.15, 3], [26, 0.15, aisle], [door[0], 0.15, aisle], door];
}

export function advancePosition(from: Point, to: Point, distance: number): { position: Point; arrived: boolean } {
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  const remaining = Math.hypot(dx, dz);
  if (remaining <= distance) return { position: [...to], arrived: true };
  return { position: [from[0] + dx / remaining * distance, to[1], from[2] + dz / remaining * distance], arrived: false };
}