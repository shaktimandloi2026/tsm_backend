import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Payment, Trip } from '../models';
import { createCrudController } from './base.controller';
import { AuthRequest } from '../types/express';
import { sendSuccess, generateCode } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import { PaymentStatus } from '../types';

const unpaidTripPaymentFilter = {
  $or: [
    { paymentStatus: PaymentStatus.PENDING },
    { paymentStatus: PaymentStatus.PARTIAL },
    { paymentStatus: { $exists: false } },
    { paymentStatus: null },
  ],
};

const crud = createCrudController(Payment, {
  searchFields: ['paymentNumber', 'referenceNumber'],
  populate: ['customerId', 'bookingId', 'tripIds'],
  filterFields: ['customerId'],
});

export const paymentController = {
  ...crud,

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        customerId,
        tripIds = [],
        amount,
        paymentDate,
        paymentMethod,
        referenceNumber,
        notes,
        status = PaymentStatus.PAID,
      } = req.body;

      if (!customerId) {
        throw new AppError('Customer is required', 400);
      }
      if (!Array.isArray(tripIds) || tripIds.length === 0) {
        throw new AppError('Select at least one unpaid trip', 400);
      }
      if (!paymentMethod) {
        throw new AppError('Payment method is required', 400);
      }

      const normalizedTripIds = [...new Set(tripIds.map((id: string) => String(id)))];

      const tripFilter: Record<string, unknown> = {
        _id: { $in: normalizedTripIds.map((id) => new mongoose.Types.ObjectId(id)) },
        customerId: new mongoose.Types.ObjectId(customerId),
        ...unpaidTripPaymentFilter,
      };
      if (req.user?.companyId) {
        tripFilter.companyId = req.user.companyId;
      }

      const trips = await Trip.find(tripFilter);
      if (trips.length !== normalizedTripIds.length) {
        throw new AppError('One or more selected trips are invalid or already paid', 400);
      }

      const tripTotal = trips.reduce((sum, trip) => sum + (trip.totalAmount || 0), 0);
      const paymentAmount = amount !== undefined ? Number(amount) : tripTotal;

      if (!paymentAmount || paymentAmount <= 0) {
        throw new AppError('Payment amount must be greater than zero', 400);
      }

      const count = await Payment.countDocuments();
      const payment = await Payment.create({
        paymentNumber: generateCode('PY', count),
        companyId: req.user?.companyId,
        branchId: req.user?.branchId,
        customerId,
        tripIds: normalizedTripIds,
        amount: paymentAmount,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        paymentMethod,
        referenceNumber,
        notes,
        status,
        isAdvance: false,
        createdBy: req.user?.id,
      });

      await Trip.updateMany(
        { _id: { $in: normalizedTripIds } },
        { paymentStatus: PaymentStatus.PAID }
      );

      const populated = await Payment.findById(payment._id).populate([
        'customerId',
        'tripIds',
      ]);

      sendSuccess(res, populated, 'Payment recorded and trips marked as paid', 201);
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) {
        throw new AppError('Payment not found', 404);
      }

      if (req.user?.companyId && String(payment.companyId) !== String(req.user.companyId)) {
        throw new AppError('Payment not found', 404);
      }

      if (payment.tripIds && payment.tripIds.length > 0) {
        await Trip.updateMany(
          { _id: { $in: payment.tripIds } },
          { paymentStatus: PaymentStatus.PENDING }
        );
      }

      await Payment.findByIdAndDelete(req.params.id);
      sendSuccess(res, null, 'Payment deleted and linked trips marked as unpaid');
    } catch (error) {
      next(error);
    }
  },
};
