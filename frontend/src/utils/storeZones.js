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

function zoneOrder(storeZone) {
  const id = normalizeStoreZone(storeZone);
  return STORE_ZONES.find((z) => z.id === id)?.order ?? 0;
}

/** Insert a new Megvenni item at the top of its storeZone block. */
export function insertItemAtZoneTop(items, newItem) {
  const zone = normalizeStoreZone(newItem.storeZone);
  const targetOrder = zoneOrder(zone);

  const firstInZone = items.findIndex(
    (i) => i.needed && normalizeStoreZone(i.storeZone) === zone,
  );
  if (firstInZone !== -1) {
    const next = [...items];
    next.splice(firstInZone, 0, newItem);
    return next;
  }

  let insertIdx = items.length;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.needed) {
      insertIdx = i;
      break;
    }
    if (zoneOrder(item.storeZone) > targetOrder) {
      insertIdx = i;
      break;
    }
  }

  const next = [...items];
  next.splice(insertIdx, 0, newItem);
  return next;
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
