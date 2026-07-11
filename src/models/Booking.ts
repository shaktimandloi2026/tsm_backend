import mongoose, { Schema, Document, Types } from 'mongoose';
import { BookingStatus, BillingType } from '../types';

export interface IBooking extends Document {
  bookingNumber: string;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  customerId: Types.ObjectId;
  routeId?: Types.ObjectId;
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: Date;
  deliveryDate?: Date;
  billingType: BillingType;
  rate: number;
  quantity?: number;
  weight?: number;
  distance?: number;
  totalAmount: number;
  advanceAmount: number;
  status: BookingStatus;
  vehicleId?: Types.ObjectId;
  driverId?: Types.ObjectId;
  goodsDescription?: string;
  notes?: string;
  createdBy: Types.ObjectId;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingNumber: { type: String, required: true, unique: true, uppercase: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    routeId: { type: Schema.Types.ObjectId, ref: 'Route' },
    pickupLocation: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    deliveryDate: Date,
    billingType: { type: String, enum: Object.values(BillingType), required: true },
    rate: { type: Number, required: true },
    quantity: Number,
    weight: Number,
    distance: Number,
    totalAmount: { type: Number, required: true },
    advanceAmount: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    goodsDescription: String,
    notes: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
