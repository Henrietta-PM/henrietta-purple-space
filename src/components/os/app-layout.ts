export interface LayoutApp {
  id: string;
  name: string;
  category: string;
}

export interface AppTile {
  id: string;
  apps: string[];
  name?: string;
  position?: { x: number; y: number };
}

export type AppLayout = Record<string, AppTile[]>;

export function folderName(ids: string[], catalog: LayoutApp[]): string {
  const categories = ids.map((id) => catalog.find((app) => app.id === id)?.category ?? "Apps");
  return categories.every((category) => category === categories[0]) ? categories[0] ?? "Apps" : "Apps";
}

export function moveTile(layout: AppLayout, sourceId: string, zone: string, targetId?: string, group = false, catalog: LayoutApp[] = []): AppLayout {
  const sourceZone = Object.keys(layout).find((key) => layout[key].some((tile) => tile.id === sourceId));
  const source = sourceZone ? layout[sourceZone].find((tile) => tile.id === sourceId) : undefined;
  if (!source || !layout[zone] || sourceId === targetId) return layout;
  const next = Object.fromEntries(Object.entries(layout).map(([key, tiles]) => [key, tiles.filter((tile) => tile.id !== sourceId)]));
  const targetIndex = next[zone].findIndex((tile) => tile.id === targetId);
  if (group && targetIndex >= 0) {
    const target = next[zone][targetIndex];
    const apps = [...target.apps, ...source.apps];
    next[zone][targetIndex] = { ...target, apps, name: target.apps.length > 1 ? target.name : folderName(apps, catalog) };
  } else {
    const moved = { ...source, position: sourceZone === zone ? source.position : undefined };
    next[zone].splice(targetIndex < 0 ? next[zone].length : targetIndex, 0, moved);
  }
  return next;
}

export function extractApp(layout: AppLayout, folderId: string, appId: string): AppLayout {
  return Object.fromEntries(Object.entries(layout).map(([zone, tiles]) => [zone, tiles.flatMap((tile) => {
    if (tile.id !== folderId || !tile.apps.includes(appId) || tile.apps.length < 2) return [tile];
    const remaining = tile.apps.filter((id) => id !== appId);
    const extractedId = `extracted:${appId}`;
    return [{ ...tile, id: tile.id === extractedId ? `folder:${remaining.join("|")}` : tile.id, apps: remaining, name: remaining.length > 1 ? tile.name : undefined }, { id: extractedId, apps: [appId] }];
  })]));
}

export function restoreLayout(value: unknown, defaults: AppLayout): AppLayout {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaults;
  const validApps = Object.values(defaults).flatMap((tiles) => tiles.flatMap((tile) => tile.apps));
  const seen = new Set<string>();
  const tileIds = new Set<string>();
  const restored: AppLayout = {};
  for (const zone of Object.keys(defaults)) {
    const tiles = (value as Record<string, unknown>)[zone];
    if (!Array.isArray(tiles)) return defaults;
    restored[zone] = [];
    for (const raw of tiles) {
      if (!raw || typeof raw !== "object" || typeof raw.id !== "string" || tileIds.has(raw.id) || !Array.isArray(raw.apps) || !raw.apps.length) return defaults;
      if (raw.apps.some((id: unknown) => typeof id !== "string" || !validApps.includes(id) || seen.has(id as string))) return defaults;
      for (const id of raw.apps as string[]) { if (seen.has(id)) return defaults; seen.add(id); }
      tileIds.add(raw.id);
      const position = raw.position && Number.isFinite(raw.position.x) && Number.isFinite(raw.position.y)
        ? { x: Math.max(0, Math.min(1, raw.position.x)), y: Math.max(0, Math.min(1, raw.position.y)) } : undefined;
      restored[zone].push({ id: raw.id, apps: raw.apps, name: typeof raw.name === "string" ? raw.name.slice(0, 32) : undefined, position });
    }
  }
  return seen.size === validApps.length ? restored : defaults;
}