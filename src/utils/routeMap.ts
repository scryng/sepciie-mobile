export type LatLng = { latitude: number; longitude: number };

export interface GraphHopperResponse {
  paths?: {
    points?: { coordinates?: any[] };
    distance?: number; // meters
    time?: number; // ms
  }[];
}

export const MAX_STOPS = 4; // 1 origin + up to 4 stops

export const getCoordinate = (address: {
  latitude: string | number;
  longitude: string | number;
}): LatLng => ({
  latitude: Number(address.latitude),
  longitude: Number(address.longitude),
});

export function parseGraphHopperResponse(response: GraphHopperResponse) {
  const path = response?.paths?.[0];
  if (!path)
    return {
      coords: [] as LatLng[],
      distanceKm: null as number | null,
      timeMin: null as number | null,
    };

  const pairs = path.points?.coordinates || [];
  const coords: LatLng[] = pairs
    .filter((p: any) => Array.isArray(p) && p.length >= 2)
    .map(([lng, lat]) => ({ latitude: Number(lat), longitude: Number(lng) }))
    .filter((c) => Number.isFinite(c.latitude) && Number.isFinite(c.longitude));

  const distanceKm = path.distance ? Number(path.distance) / 1000 : null;
  const timeMin = path.time ? Math.round(Number(path.time) / 60000) : null;

  return { coords, distanceKm, timeMin };
}

export function getBoundsFromCoords(coords: LatLng[]) {
  if (coords.length === 0) return null;
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latPadding = (maxLat - minLat) * 0.1;
  const lngPadding = (maxLng - minLng) * 0.1;
  return {
    ne: [maxLng + lngPadding, maxLat + latPadding] as [number, number],
    sw: [minLng - lngPadding, minLat - latPadding] as [number, number],
  };
}
