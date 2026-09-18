import { itemStoreZones } from '../data/itemStoreZones.js';
import { DEFAULT_STORE_ZONE, normalizeStoreZone } from '../utils/storeZones.js';

/** Longest phrase first; lexicographic tie-break (deterministic, not object order). */
const DICT_KEYS_BY_LENGTH_DESC = Object.keys(itemStoreZones).sort(
  (a, b) => b.length - a.length || a.localeCompare(b),
);

/**
 * @param {string} s
 * @returns {string}
 */
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * @param {string} normalizedInput
 * @param {string} dictKey
 * @returns {boolean}
 */
function dictKeyMatchesPhrase(normalizedInput, dictKey) {
  const escaped = escapeRegExp(dictKey);
  const re = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`);
  return re.test(normalizedInput);
}

/**
 * @param {unknown} name
 * @returns {string}
 */
export function normalizeItemName(name) {
  if (typeof name !== 'string') return '';

  const trimmed = name.trim();
  if (trimmed === '') return '';

  const folded = trimmed
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();

  return folded.replace(/\s+/g, ' ');
}

/**
 * @param {unknown} itemName
 * @returns {string}
 */
export function getStoreZone(itemName) {
  const key = normalizeItemName(itemName);
  if (key === '') return DEFAULT_STORE_ZONE;

  const exact = itemStoreZones[key];
  if (exact !== undefined) return normalizeStoreZone(exact);

  for (const dictKey of DICT_KEYS_BY_LENGTH_DESC) {
    if (dictKeyMatchesPhrase(key, dictKey)) {
      return normalizeStoreZone(itemStoreZones[dictKey]);
    }
  }

  return DEFAULT_STORE_ZONE;
}
