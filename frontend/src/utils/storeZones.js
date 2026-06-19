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

/** Insert a Megvenni item at the top of its zone block within its segment (active or kosár). */
export function insertItemAtZoneTop(items, newItem) {
  if (!newItem.needed) {
    const next = [...items, newItem];
    return next;
  }

  const zone = normalizeStoreZone(newItem.storeZone);
  const targetOrder = zoneOrder(zone);
  const inSegment = (i) => i.needed && !!i.bought === !!newItem.bought;

  const firstInZone = items.findIndex(
    (i) => inSegment(i) && normalizeStoreZone(i.storeZone) === zone,
  );
  if (firstInZone !== -1) {
    const next = [...items];
    next.splice(firstInZone, 0, newItem);
    return next;
  }

  let insertIdx = items.length;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!inSegment(item)) {
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

/** Megvenni items in front → middle → back blocks; within-zone order unchanged. */
export function sortNeededByZoneBlocks(neededItems) {
  const front = [];
  const middle = [];
  const back = [];
  for (const item of neededItems) {
    const zone = normalizeStoreZone(item.storeZone);
    if (zone === 'front') front.push(item);
    else if (zone === 'middle') middle.push(item);
    else back.push(item);
  }
  return [...front, ...middle, ...back];
}

function partitionListSegments(items) {
  const activeNeeded = [];
  const basketNeeded = [];
  const have = [];
  for (const item of items) {
    if (!item.needed) have.push(item);
    else if (item.bought) basketNeeded.push(item);
    else activeNeeded.push(item);
  }
  return { activeNeeded, basketNeeded, have };
}

/**
 * Canonical walk order in items[]:
 * 1. Megvenni active (needed, !bought) — front → middle → back
 * 2. Megvenni kosár (needed, bought) — front → middle → back
 * 3. Már megvan (!needed)
 */
export function ensureListWalkOrder(items) {
  if (!Array.isArray(items) || items.length === 0) return items;

  const { activeNeeded, basketNeeded, have } = partitionListSegments(items);
  const next = [
    ...sortNeededByZoneBlocks(activeNeeded),
    ...sortNeededByZoneBlocks(basketNeeded),
    ...have,
  ];

  if (next.length !== items.length) return items;
  const unchanged = next.every((item, i) => item.id === items[i]?.id);
  return unchanged ? items : next;
}

/** @deprecated alias — use ensureListWalkOrder */
export function ensureNeededZoneBlockOrder(items) {
  return ensureListWalkOrder(items);
}

/** Whether a drag-drop may reorder source onto target (Phase 5). */
export function canReorderByDrag(source, target) {
  if (!source || !target || source.id === target.id) return false;
  if (source.needed !== target.needed) return false;
  if (!source.needed) return true;
  if (!!source.bought !== !!target.bought) return false;
  return normalizeStoreZone(source.storeZone) === normalizeStoreZone(target.storeZone);
}

/** Move a needed item to the top of its target zone block; Már megvan updates zone in place. */
export function moveNeededItemToZoneTop(items, itemId, targetZone) {
  const zone = normalizeStoreZone(targetZone);
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx === -1) return items;

  const current = items[idx];
  if (normalizeStoreZone(current.storeZone) === zone) return items;

  const item = { ...current, storeZone: zone };
  if (!item.needed) {
    const next = [...items];
    next[idx] = item;
    return next;
  }

  const without = [...items.slice(0, idx), ...items.slice(idx + 1)];
  return insertItemAtZoneTop(without, item);
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
    .filter(
      (item) =>
        item && typeof item === 'object' && typeof item.name === 'string',
    )
    .map((item) => ({
      name: item.name.trim(),
      storeZone: normalizeStoreZone(item.storeZone),
    }))
    .filter((entry) => entry.name !== '');
}
