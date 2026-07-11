import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISettings extends Document {
  companyId: Types.ObjectId;
  key: string;
  value: unknown;
  category: string;
}

const settingsSchema = new Schema<ISettings>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    key: { type: String, required: true },
    value: Schema.Types.Mixed,
    category: { type: String, default: 'general' },
  },
  { timestamps: true }
);

settingsSchema.index({ companyId: 1, key: 1 }, { unique: true });

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
