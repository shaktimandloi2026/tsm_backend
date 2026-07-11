import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types';

export interface IRole extends Document {
  name: UserRole;
  displayName: string;
  permissions: string[];
  description?: string;
  isActive: boolean;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, enum: Object.values(UserRole), required: true, unique: true },
    displayName: { type: String, required: true },
    permissions: [{ type: String }],
    description: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>('Role', roleSchema);
