import express from 'express';
import GlobalState from '../models/GlobalState.js';
import Preset from '../models/Preset.js';

const router = express.Router();

function isValidItemShape(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    obj.id.trim() !== '' &&
    typeof obj.name === 'string' &&
    obj.name.trim() !== '' &&
    typeof obj.needed === 'boolean' &&
    typeof obj.bought === 'boolean'
  );
}

function itemsFromLegacyNames(itemsNames) {
  if (!Array.isArray(itemsNames)) return [];
  return itemsNames
    .filter((n) => typeof n === 'string' && n.trim() !== '')
    .map((name, i) => ({
      id: `legacy_${i}`,
      name,
      needed: true,
      bought: false,
    }));
}

function resolveItems(globalDoc) {
  const raw = globalDoc?.items;
  if (Array.isArray(raw) && raw.every(isValidItemShape)) return raw;
  return itemsFromLegacyNames(globalDoc?.itemsNames);
}

router.get('/state', async (req, res) => {
  try {
    const globalDoc = await GlobalState.findById('global').lean();
    const items = resolveItems(globalDoc);

    const presetDocs = await Preset.find({}).sort({ name: 1 }).lean();
    const presets = {};
    for (const p of presetDocs) {
      presets[p.name] = p.itemsNames ?? [];
    }

    res.json({ items, presets });
  } catch (error) {
    console.error('GET /api/state failed:', error);
    res.status(500).json({ message: 'Failed to fetch state' });
  }
});

export default router;
