import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRoute extends Document {
  name: string;
  code: string;
  companyId: Types.ObjectId;
  branchId?: Types.ObjectId;
  origin: string;
  destination: string;
  pickupLocations: string[];
  deliveryLocations: string[];
  distance: number;
  distanceUnit: string;
  estimatedTime: number;
  estimatedTimeUnit: string;
  tollCharges?: number;
  isActive: boolean;
  notes?: string;
}

const routeSchema = new Schema<IRoute>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    pickupLocations: [String],
    deliveryLocations: [String],
    distance: { type: Number, required: true },
    distanceUnit: { type: String, default: 'km' },
    estimatedTime: { type: Number, required: true },
    estimatedTimeUnit: { type: String, default: 'hours' },
    tollCharges: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    notes: String,
  },
  { timestamps: true }
);

routeSchema.index({ companyId: 1, code: 1 }, { unique: true });

export const Route = mongoose.model<IRoute>('Route', routeSchema);
