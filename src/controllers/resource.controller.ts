import { Customer, Vehicle, Driver, Route, Booking, Trip, Expense, Bank, CashTransaction, User } from '../models';
import { createCrudController } from './base.controller';

export const customerController = createCrudController(Customer, {
  searchFields: ['name', 'code', 'phone', 'email'],
  populate: 'branchId',
});

export const vehicleController = createCrudController(Vehicle, {
  searchFields: ['registrationNumber', 'vehicleType', 'make', 'vehicleModel'],
  populate: 'branchId',
});

export const driverController = createCrudController(Driver, {
  searchFields: ['name', 'code', 'phone', 'licenseNumber', 'aadharNumber'],
  populate: ['branchId', 'assignedVehicleId'],
});

export const routeController = createCrudController(Route, {
  searchFields: ['name', 'code', 'origin', 'destination'],
});

export const bookingController = createCrudController(Booking, {
  searchFields: ['bookingNumber', 'pickupLocation', 'deliveryLocation'],
  populate: ['customerId', 'vehicleId', 'driverId', 'routeId'],
});

export const tripController = createCrudController(Trip, {
  searchFields: ['tripNumber', 'pickupLocation', 'deliveryLocation'],
  populate: ['customerId', 'vehicleId', 'driverId', 'routeId'],
  filterFields: ['driverId', 'customerId', 'paymentStatus'],
  dateField: 'startDate',
});

export const expenseController = createCrudController(Expense, {
  searchFields: ['expenseNumber', 'description'],
  populate: ['vehicleId', 'driverId', 'tripId'],
  filterFields: ['tripId', 'driverId'],
  dateField: 'date',
});

export const bankController = createCrudController(Bank, {
  searchFields: ['name', 'accountNumber', 'ifscCode'],
});

export const cashTransactionController = createCrudController(CashTransaction, {
  searchFields: ['transactionNumber', 'description'],
  populate: ['bankId', 'toBankId'],
});

export const userController = createCrudController(User, {
  searchFields: ['name', 'email', 'phone'],
  populate: 'branchId',
});
