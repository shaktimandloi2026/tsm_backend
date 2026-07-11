import { Response, NextFunction } from 'express';
import { Trip } from '../models';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../types/express';

export const getTripReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { customerId, driverId, startDate, endDate } = req.query;

    const filter: Record<string, unknown> = {};

    if (req.user?.companyId) {
      filter.companyId = req.user.companyId;
    }
    if (customerId) {
      filter.customerId = customerId;
    }
    if (driverId) {
      filter.driverId = driverId;
    }
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) {
        (filter.startDate as Record<string, Date>).$gte = new Date(startDate as string);
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        (filter.startDate as Record<string, Date>).$lte = end;
      }
    }

    const trips = await Trip.find(filter)
      .populate('customerId', 'name code phone')
      .populate('driverId', 'name code phone')
      .populate('vehicleId', 'registrationNumber vehicleType')
      .sort({ startDate: -1 })
      .lean();

    const summary = trips.reduce(
      (acc, trip) => {
        acc.totalTrips += 1;
        acc.totalWeight += trip.weight || 0;
        acc.totalAmount += trip.totalAmount || 0;
        acc.completedTrips += trip.status === 'completed' ? 1 : 0;
        acc.inProgressTrips += trip.status === 'in_progress' ? 1 : 0;
        return acc;
      },
      {
        totalTrips: 0,
        totalWeight: 0,
        totalAmount: 0,
        completedTrips: 0,
        inProgressTrips: 0,
      }
    );

    sendSuccess(res, { trips, summary }, 'Trip report generated');
  } catch (error) {
    next(error);
  }
};
