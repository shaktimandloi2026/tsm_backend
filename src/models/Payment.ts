import mongoose, { Schema, Document, Types } from 'mongoose';
import { PaymentStatus } from '../types';

export interface IPayment extends Document {
  paymentNumber: string;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  customerId: Types.ObjectId;
  bookingId?: Types.ObjectId;
  tripIds?: Types.ObjectId[];
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  referenceNumber?: string;
  status: PaymentStatus;
  isAdvance: boolean;
  notes?: string;
  createdBy: Types.ObjectId;
}

const paymentSchema = new Schema<IPayment>(
  {
    paymentNumber: { type: String, required: true, unique: true, uppercase: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    tripIds: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    referenceNumber: String,
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PAID },
    isAdvance: { type: Boolean, default: false },
    notes: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
