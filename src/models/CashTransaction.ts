import mongoose, { Schema, Document, Types } from 'mongoose';
import { TransactionType } from '../types';

export interface ICashTransaction extends Document {
  transactionNumber: string;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  bankId?: Types.ObjectId;
  toBankId?: Types.ObjectId;
  referenceNumber?: string;
  createdBy: Types.ObjectId;
}

const cashTransactionSchema = new Schema<ICashTransaction>(
  {
    transactionNumber: { type: String, required: true, unique: true, uppercase: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    type: { type: String, enum: Object.values(TransactionType), required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    bankId: { type: Schema.Types.ObjectId, ref: 'Bank' },
    toBankId: { type: Schema.Types.ObjectId, ref: 'Bank' },
    referenceNumber: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const CashTransaction = mongoose.model<ICashTransaction>('CashTransaction', cashTransactionSchema);
