import mongoose, { Schema, Document, Types } from 'mongoose';
import { TripStatus, PaymentStatus } from '../types';

export interface ITrip extends Document {
  tripNumber: string;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  customerId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  driverId: Types.ObjectId;
  routeId?: Types.ObjectId;
  pickupLocation: string;
  deliveryLocation: string;
  startDate: Date;
  endDate?: Date;
  weight?: number;
  rate?: number;
  totalAmount?: number;
  actualStartTime?: Date;
  actualEndTime?: Date;
  startOdometer?: number;
  endOdometer?: number;
  distance?: number;
  status: TripStatus;
  paymentStatus: PaymentStatus;
  fuelUsed?: number;
  tollCharges?: number;
  billImageUrl?: string;
  notes?: string;
  createdBy: Types.ObjectId;
}

const tripSchema = new Schema<ITrip>(
  {
    tripNumber: { type: String, required: true, unique: true, uppercase: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    routeId: { type: Schema.Types.ObjectId, ref: 'Route' },
    pickupLocation: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    weight: Number,
    rate: Number,
    totalAmount: Number,
    actualStartTime: Date,
    actualEndTime: Date,
    startOdometer: Number,
    endOdometer: Number,
    distance: Number,
    status: { type: String, enum: Object.values(TripStatus), default: TripStatus.SCHEDULED },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    fuelUsed: Number,
    tollCharges: Number,
    billImageUrl: String,
    notes: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Trip = mongoose.model<ITrip>('Trip', tripSchema);
