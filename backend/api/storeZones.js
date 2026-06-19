export const DEFAULT_STORE_ZONE = 'na';
export const VALID_STORE_ZONES = ['na', 'front', 'middle', 'back'];

export function normalizeStoreZone(value) {
  return VALID_STORE_ZONES.includes(value) ? value : DEFAULT_STORE_ZONE;
}

export function isValidStoreZone(value) {
  return value === undefined || VALID_STORE_ZONES.includes(value);
}
