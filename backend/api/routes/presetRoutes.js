import express from 'express';
import Preset from '../models/Preset.js';
import { isValidStoreZone } from '../storeZones.js';

const router = express.Router();

function isValidPresetEntry(entry) {
  if (typeof entry === 'string') {
    return entry.trim() !== '';
  }
  if (entry && typeof entry === 'object' && typeof entry.name === 'string') {
    return entry.name.trim() !== '' && isValidStoreZone(entry.storeZone);
  }
  return false;
}

function isValidPresetEntriesArray(value) {
  return Array.isArray(value) && value.every(isValidPresetEntry);
}

router.post('/presets', async (req, res) => {
  try {
    const { name, itemsNames } = req.body ?? {};

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'name must be a non-empty string' });
    }
    if (!isValidPresetEntriesArray(itemsNames)) {
      return res.status(400).json({
        message:
          'itemsNames must be an array of non-empty strings or { name, storeZone? } objects',
      });
    }

    const normalizedName = name.trim();

    const existing = await Preset.findOne({ name: normalizedName }).lean();
    if (existing) {
      return res.status(409).json({ message: 'Preset already exists' });
    }

    const created = await Preset.create({
      name: normalizedName,
      itemsNames,
    });

    res.status(201).json({ name: created.name, itemsNames: created.itemsNames });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Preset already exists' });
    }
    res.status(500).json({ message: 'Failed to create preset' });
  }
});

router.put('/presets/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { itemsNames } = req.body ?? {};

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Invalid preset name' });
    }
    if (!isValidPresetEntriesArray(itemsNames)) {
      return res.status(400).json({
        message:
          'itemsNames must be an array of non-empty strings or { name, storeZone? } objects',
      });
    }

    const normalizedName = name.trim();
    const updated = await Preset.findOneAndUpdate(
      { name: normalizedName },
      { $set: { itemsNames } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();

    res.json({ name: updated.name, itemsNames: updated.itemsNames ?? [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to overwrite preset' });
  }
});

router.delete('/presets/:name', async (req, res) => {
  try {
    const { name } = req.params;
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Invalid preset name' });
    }

    const normalizedName = name.trim();

    const result = await Preset.deleteOne({ name: normalizedName });
    res.json({ deleted: result.deletedCount > 0, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete preset' });
  }
});

export default router;
