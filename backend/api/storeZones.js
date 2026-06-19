export const VALID_STORE_ZONES = ['front', 'middle', 'back', 'na'];

export function normalizeStoreZone(value) {
  return VALID_STORE_ZONES.includes(value) ? value : 'front';
}

export function isValidStoreZone(value) {
  return value === undefined || VALID_STORE_ZONES.includes(value);
}
