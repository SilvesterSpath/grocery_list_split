import GlobalState from './models/GlobalState.js';
import Preset from './models/Preset.js';
import { defaultLists } from './defaultLists.js';

export default async function seedDefaultsIfEmpty() {
  // Global list starts empty by default; we only seed presets.
  await GlobalState.updateOne(
    { _id: 'global' },
    { $setOnInsert: { itemsNames: [] } },
    { upsert: true },
  );

  // Seed presets only if they don't exist yet, without overwriting any user changes.
  const entries = Object.entries(defaultLists);
  for (const [presetName, itemNames] of entries) {
    await Preset.updateOne(
      { name: presetName },
      {
        $setOnInsert: {
          name: presetName,
          itemsNames: Array.isArray(itemNames) ? itemNames : [],
        },
      },
      { upsert: true },
    );
  }
}
