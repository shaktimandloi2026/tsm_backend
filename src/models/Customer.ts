import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  code: string;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  email?: string;
  phone: string;
  alternatePhone?: string;
  billingAddress?: string;
  shippingAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  panNumber?: string;
  creditLimit?: number;
  outstandingBalance: number;
  advanceBalance: number;
  isActive: boolean;
  notes?: string;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    email: { type: String, lowercase: true },
    phone: { type: String, required: true },
    alternatePhone: String,
    billingAddress: String,
    shippingAddress: String,
    city: String,
    state: String,
    pincode: String,
    gstNumber: String,
    panNumber: String,
    creditLimit: { type: Number, default: 0 },
    outstandingBalance: { type: Number, default: 0 },
    advanceBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    notes: String,
  },
  { timestamps: true }
);

customerSchema.index({ companyId: 1, code: 1 }, { unique: true });

export const Customer = mongoose.model<ICustomer>('Customer', customerSchema);
