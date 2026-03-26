import mongoose from 'mongoose';

const GlobalStateSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: 'global',
    },
    itemsNames: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model('GlobalState', GlobalStateSchema);

