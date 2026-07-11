import { Response, NextFunction } from 'express';
import {
  Booking, Customer, Driver, Expense, Payment, Trip, Vehicle,
} from '../models';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../types/express';
import { PaymentStatus } from '../types';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const companyFilter = req.user?.companyId ? { companyId: req.user.companyId } : {};

    const [
      totalBookings,
      totalCustomers,
      totalVehicles,
      totalDrivers,
      totalTrips,
      totalPayments,
      revenueData,
      expenseData,
      pendingPayments,
    ] = await Promise.all([
      Booking.countDocuments(companyFilter),
      Customer.countDocuments(companyFilter),
      Vehicle.countDocuments(companyFilter),
      Driver.countDocuments(companyFilter),
      Trip.countDocuments(companyFilter),
      Payment.countDocuments(companyFilter),
      Payment.aggregate([
        { $match: { ...companyFilter, status: PaymentStatus.PAID } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: companyFilter },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.countDocuments({ ...companyFilter, status: PaymentStatus.PENDING }),
    ]);

    const revenue = revenueData[0]?.total || 0;
    const expenses = expenseData[0]?.total || 0;

    sendSuccess(res, {
      bookings: totalBookings,
      customers: totalCustomers,
      vehicles: totalVehicles,
      drivers: totalDrivers,
      trips: totalTrips,
      payments: totalPayments,
      revenue,
      expenses,
      profit: revenue - expenses,
      pendingPayments,
    });
  } catch (error) {
    next(error);
  }
};
