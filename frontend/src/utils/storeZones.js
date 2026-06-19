export const STORE_ZONES = [
  { id: 'front', label: 'Elöl', order: 0 },
  { id: 'middle', label: 'Középen', order: 1 },
  { id: 'back', label: 'Hátul', order: 2 },
];

export const DEFAULT_STORE_ZONE = 'front';

const VALID_STORE_ZONES = new Set(STORE_ZONES.map((z) => z.id));

let idCounter = Date.now();
export function newId() {
  return `item_${idCounter++}`;
}

export function normalizeStoreZone(value) {
  return VALID_STORE_ZONES.has(value) ? value : DEFAULT_STORE_ZONE;
}

export function normalizeItem(item) {
  if (!item || typeof item !== 'object') return item;
  return {
    ...item,
    storeZone: normalizeStoreZone(item.storeZone),
  };
}

export function normalizePresetEntry(entry) {
  if (typeof entry === 'string') {
    const name = entry.trim();
    if (!name) return null;
    return { name, storeZone: DEFAULT_STORE_ZONE };
  }
  if (entry && typeof entry === 'object' && typeof entry.name === 'string') {
    const name = entry.name.trim();
    if (!name) return null;
    return {
      name,
      storeZone: normalizeStoreZone(entry.storeZone),
    };
  }
  return null;
}

export function presetEntriesToFrontendItems(entries) {
  if (!Array.isArray(entries)) return [];

  return entries
    .map(normalizePresetEntry)
    .filter(Boolean)
    .map(({ name, storeZone }) => ({
      id: newId(),
      name,
      needed: true,
      bought: false,
      storeZone,
    }));
}

export function frontendItemsToPresetEntries(items) {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item && typeof item === 'object' && typeof item.name === 'string')
    .map((item) => ({
      name: item.name.trim(),
      storeZone: normalizeStoreZone(item.storeZone),
    }))
    .filter((entry) => entry.name !== '');
}
