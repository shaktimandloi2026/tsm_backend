import mongoose, { Schema, Document, Types } from 'mongoose';
import { VehicleStatus } from '../types';

export interface IVehicle extends Document {
  registrationNumber: string;
  vehicleType: string;
  make?: string;
  vehicleModel?: string;
  year?: number;
  capacity?: number;
  capacityUnit?: string;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  permitNumber?: string;
  permitExpiry?: Date;
  insuranceNumber?: string;
  insuranceExpiry?: Date;
  fitnessExpiry?: Date;
  pollutionExpiry?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  status: VehicleStatus;
  documents: { name: string; url: string; expiryDate?: Date }[];
  notes?: string;
  isActive: boolean;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    registrationNumber: { type: String, required: true, unique: true, uppercase: true },
    vehicleType: { type: String, required: true },
    make: String,
    vehicleModel: String,
    year: Number,
    capacity: Number,
    capacityUnit: { type: String, default: 'tons' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    permitNumber: String,
    permitExpiry: Date,
    insuranceNumber: String,
    insuranceExpiry: Date,
    fitnessExpiry: Date,
    pollutionExpiry: Date,
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    status: { type: String, enum: Object.values(VehicleStatus), default: VehicleStatus.AVAILABLE },
    documents: [{ name: String, url: String, expiryDate: Date }],
    notes: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
