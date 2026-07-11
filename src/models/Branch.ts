import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  code: string;
  companyId: Types.ObjectId;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  managerId?: Types.ObjectId;
  isActive: boolean;
}

const branchSchema = new Schema<IBranch>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    email: { type: String, lowercase: true },
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    managerId: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

branchSchema.index({ companyId: 1, code: 1 }, { unique: true });

export const Branch = mongoose.model<IBranch>('Branch', branchSchema);
