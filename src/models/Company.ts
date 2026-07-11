import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  panNumber?: string;
  logo?: string;
  isActive: boolean;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    email: { type: String, lowercase: true },
    phone: String,
    address: String,
    gstNumber: String,
    panNumber: String,
    logo: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>('Company', companySchema);
