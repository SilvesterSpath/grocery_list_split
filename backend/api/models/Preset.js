import mongoose from 'mongoose';

const PresetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    itemsNames: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model('Preset', PresetSchema);

