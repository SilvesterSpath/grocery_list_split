import mongoose from 'mongoose';

const ListItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    needed: { type: Boolean, required: true },
    bought: { type: Boolean, required: true },
  },
  { _id: false },
);

const GlobalStateSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: 'global',
    },
    items: {
      type: [ListItemSchema],
      default: [],
    },
    itemsNames: {
      type: [String],
    },
  },
  { timestamps: true },
);

export default mongoose.model('GlobalState', GlobalStateSchema);
