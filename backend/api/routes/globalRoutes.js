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
    const { items, activePresetName } = req.body ?? {};

    if (!isValidItemsArray(items)) {
      return res.status(400).json({
        message:
          'items must be an array (possibly empty) of { id, name, needed, bought }',
      });
    }

    if (
      typeof activePresetName !== 'undefined' &&
      typeof activePresetName !== 'string'
    ) {
      return res.status(400).json({
        message: 'activePresetName must be a string (or omitted)',
      });
    }

    const normalizedActivePresetName =
      typeof activePresetName === 'string' ? activePresetName.trim() : undefined;

    const updated = await GlobalState.findByIdAndUpdate(
      'global',
      {
        $set: {
          items,
          ...(typeof normalizedActivePresetName === 'string'
            ? { activePresetName: normalizedActivePresetName }
            : {}),
        },
      },
      { upsert: true, new: true },
    ).lean();

    res.json({
      items: updated.items ?? [],
      activePresetName: updated.activePresetName ?? '',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update global state' });
  }
});

export default router;
