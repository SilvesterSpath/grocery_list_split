import express from 'express';
import GlobalState from '../models/GlobalState.js';

const router = express.Router();

function isValidItem(obj) {
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

function isValidItemsArray(value) {
  return Array.isArray(value) && value.every(isValidItem);
}

router.put('/global', async (req, res) => {
  try {
    const { items } = req.body ?? {};

    if (!isValidItemsArray(items)) {
      return res.status(400).json({
        message:
          'items must be an array (possibly empty) of { id, name, needed, bought }',
      });
    }

    const updated = await GlobalState.findByIdAndUpdate(
      'global',
      { $set: { items } },
      { upsert: true, new: true },
    ).lean();

    res.json({ items: updated.items ?? [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update global state' });
  }
});

export default router;
