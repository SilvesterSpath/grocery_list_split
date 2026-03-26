import express from 'express';
import GlobalState from '../models/GlobalState.js';
import Preset from '../models/Preset.js';

const router = express.Router();

router.get('/state', async (req, res) => {
  try {
    const globalDoc = await GlobalState.findById('global').lean();
    const itemsNames = globalDoc?.itemsNames ?? [];

    const presetDocs = await Preset.find({}).sort({ name: 1 }).lean();
    const presets = {};
    for (const p of presetDocs) {
      presets[p.name] = p.itemsNames ?? [];
    }

    res.json({ itemsNames, presets });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch state' });
  }
});

export default router;

