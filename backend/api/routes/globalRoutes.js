import express from 'express';
import GlobalState from '../models/GlobalState.js';

const router = express.Router();

function isStringArray(value) {
  return (
    Array.isArray(value) && value.every((v) => typeof v === 'string' && v.trim() !== '')
  );
}

router.put('/global', async (req, res) => {
  try {
    const { itemsNames } = req.body ?? {};

    if (!isStringArray(itemsNames)) {
      return res.status(400).json({ message: 'itemsNames must be a non-empty string[]' });
    }

    const updated = await GlobalState.findByIdAndUpdate(
      'global',
      { $set: { itemsNames } },
      { upsert: true, new: true },
    ).lean();

    res.json({ itemsNames: updated.itemsNames ?? [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update global state' });
  }
});

export default router;

