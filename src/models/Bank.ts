import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBank extends Document {
  name: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  accountType: string;
  balance: number;
  isActive: boolean;
}

const bankSchema = new Schema<IBank>(
  {
    name: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true, uppercase: true },
    branchName: String,
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    accountType: { type: String, default: 'current' },
    balance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Bank = mongoose.model<IBank>('Bank', bankSchema);
