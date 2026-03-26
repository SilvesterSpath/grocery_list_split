import { makeItem } from '../utils/groceryHelpers.js';

function persistedEntryToName(entry) {
  if (typeof entry === 'string') return entry;
  if (entry && typeof entry === 'object' && typeof entry.name === 'string') {
    return entry.name;
  }
  return null;
}

/**
 * Persisted shape (for now): names-only arrays.
 * Future switch: support persisting { name, needed, bought, order } without changing UI code.
 */
export function frontendItemsToPersistedNames(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => (item && typeof item === 'object' ? item.name : null))
    .filter((name) => typeof name === 'string' && name.trim() !== '');
}

export function persistedNamesToFrontendItems(itemsNames, options) {
  const neededDefault = options?.neededDefault ?? true;
  const boughtDefault = options?.boughtDefault ?? false;

  if (!Array.isArray(itemsNames)) return [];

  return itemsNames
    .map((entry) => persistedEntryToName(entry))
    .filter((name) => typeof name === 'string' && name.trim() !== '')
    .map((name) => {
      const item = makeItem(name);
      return { ...item, needed: neededDefault, bought: boughtDefault };
    });
}

export function frontendStateToPersisted({ items, presets }) {
  return {
    itemsNames: frontendItemsToPersistedNames(items),
    presets: frontendPresetsToPersistedPresets(presets),
  };
}

export function persistedStateToFrontend({ itemsNames, presets }) {
  return {
    items: persistedNamesToFrontendItems(itemsNames, {
      neededDefault: true,
      boughtDefault: false,
    }),
    presets: persistedPresetsToNameArrays(presets),
  };
}

export function frontendPresetsToPersistedPresets(presets) {
  if (!presets || typeof presets !== 'object') return {};
  const next = {};

  for (const [presetName, itemEntries] of Object.entries(presets)) {
    if (!Array.isArray(itemEntries)) continue;
    next[presetName] = itemEntries
      .map((entry) => persistedEntryToName(entry))
      .filter((name) => typeof name === 'string' && name.trim() !== '');
  }

  return next;
}

function persistedPresetsToNameArrays(presets) {
  if (!presets || typeof presets !== 'object') return {};
  const next = {};

  for (const [presetName, itemEntries] of Object.entries(presets)) {
    if (!Array.isArray(itemEntries)) continue;
    next[presetName] = itemEntries
      .map((entry) => persistedEntryToName(entry))
      .filter((name) => typeof name === 'string' && name.trim() !== '');
  }

  return next;
}

