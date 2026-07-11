export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  BRANCH_MANAGER = 'branch_manager',
  ACCOUNTANT = 'accountant',
  BOOKING_OPERATOR = 'booking_operator',
  DRIVER = 'driver',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ASSIGNED = 'assigned',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum BillingType {
  DISTANCE = 'distance',
  WEIGHT = 'weight',
  TRIPS = 'trips',
  CUSTOM = 'custom',
}

export enum TripStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum VehicleStatus {
  AVAILABLE = 'available',
  ON_TRIP = 'on_trip',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive',
}

export enum DriverStatus {
  ACTIVE = 'active',
  ON_TRIP = 'on_trip',
  ON_LEAVE = 'on_leave',
  INACTIVE = 'inactive',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

export enum ExpenseCategory {
  FUEL = 'fuel',
  MAINTENANCE = 'maintenance',
  TOLL = 'toll',
  SALARY = 'salary',
  REPAIR = 'repair',
  OTHER = 'other',
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  RECEIPT = 'receipt',
  PAYMENT = 'payment',
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
