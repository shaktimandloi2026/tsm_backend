import mongoose, { Schema, Document, Types } from 'mongoose';
import { DriverStatus } from '../types';

export interface IDriver extends Document {
  name: string;
  code: string;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  email?: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  licenseNumber: string;
  licenseExpiry: Date;
  licenseType?: string;
  aadharNumber?: string;
  aadharImageUrl?: string;
  licenseImageUrl?: string;
  dateOfBirth?: Date;
  joiningDate?: Date;
  leaveDate?: Date;
  salary?: number;
  status: DriverStatus;
  assignedVehicleId?: Types.ObjectId;
  documents: { name: string; url: string; expiryDate?: Date }[];
  emergencyContact?: { name: string; phone: string; relation?: string };
  notes?: string;
  isActive: boolean;
}

const driverSchema = new Schema<IDriver>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    email: { type: String, lowercase: true },
    phone: { type: String, required: true },
    alternatePhone: String,
    address: String,
    licenseNumber: { type: String, required: true },
    licenseExpiry: { type: Date, required: true },
    licenseType: String,
    aadharNumber: String,
    aadharImageUrl: String,
    licenseImageUrl: String,
    dateOfBirth: Date,
    joiningDate: Date,
    leaveDate: Date,
    salary: Number,
    status: { type: String, enum: Object.values(DriverStatus), default: DriverStatus.ACTIVE },
    assignedVehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    documents: [{ name: String, url: String, expiryDate: Date }],
    emergencyContact: { name: String, phone: String, relation: String },
    notes: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

driverSchema.index({ companyId: 1, code: 1 }, { unique: true });

export const Driver = mongoose.model<IDriver>('Driver', driverSchema);
