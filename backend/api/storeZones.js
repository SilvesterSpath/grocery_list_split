export const DEFAULT_STORE_ZONE = 'na';
export const VALID_STORE_ZONES = [
  'na',
  'front',
  'middle_front',
  'middle_back',
  'back',
];

export function normalizeStoreZone(value) {
  if (value === 'middle') return 'middle_front';
  return VALID_STORE_ZONES.includes(value) ? value : DEFAULT_STORE_ZONE;
}

export function isValidStoreZone(value) {
  if (value === undefined) return true;
  if (value === 'middle') return true;
  return VALID_STORE_ZONES.includes(value);
}
