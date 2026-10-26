type Point = { lat: number; lng: number };

export function haversineKm(a: Point, b: Point): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function friendlyDistance(km: number): string {
  return `${Math.round(km).toLocaleString("en-US")} km`;
}

/** Rough estimate: 800 km/h cruise plus 30 minutes for take-off and landing. */
export function flightHours(km: number): string {
  const minutes = Math.round((km / 800) * 60 + 30);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h === 0 ? `${m} min` : `${h} h ${m} min`;
}
