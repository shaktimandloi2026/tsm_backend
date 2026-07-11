import mongoose, { Schema, Document, Types } from 'mongoose';
import { ExpenseCategory } from '../types';

export interface IExpense extends Document {
  expenseNumber: string;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  category: ExpenseCategory;
  amount: number;
  date: Date;
  description: string;
  vehicleId?: Types.ObjectId;
  driverId?: Types.ObjectId;
  tripId?: Types.ObjectId;
  paymentMethod?: string;
  referenceNumber?: string;
  receiptUrl?: string;
  createdBy: Types.ObjectId;
}

const expenseSchema = new Schema<IExpense>(
  {
    expenseNumber: { type: String, required: true, unique: true, uppercase: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    category: { type: String, enum: Object.values(ExpenseCategory), required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
    paymentMethod: String,
    referenceNumber: String,
    receiptUrl: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
