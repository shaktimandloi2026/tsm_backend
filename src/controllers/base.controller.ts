import { Response, NextFunction } from 'express';
import { Model, SortOrder } from 'mongoose';
import { AuthRequest } from '../types/express';
import { sendSuccess, getPagination, buildSearchQuery, generateCode } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

interface CrudOptions {
  searchFields?: string[];
  populate?: string | string[];
  companyField?: string;
  filterFields?: string[];
  dateField?: string;
}

const autoNumberFields: Record<string, string> = {
  bookingNumber: 'BK',
  tripNumber: 'TR',
  expenseNumber: 'EX',
  paymentNumber: 'PY',
  transactionNumber: 'CT',
};

const buildCreatePayload = async (
  model: Model<any>,
  body: Record<string, unknown>,
  req: AuthRequest,
  companyField: string
) => {
  const payload = { ...body };

  if (req.user?.companyId) {
    payload[companyField] = payload[companyField] || req.user.companyId;
  }
  if (req.user?.branchId && !payload.branchId) {
    payload.branchId = req.user.branchId;
  }
  if (model.schema.path('createdBy') && req.user?.id && !payload.createdBy) {
    payload.createdBy = req.user.id;
  }

  for (const [field, prefix] of Object.entries(autoNumberFields)) {
    if (model.schema.path(field) && !payload[field]) {
      const count = await model.countDocuments();
      payload[field] = generateCode(prefix, count);
    }
  }

  return payload;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createCrudController = (model: Model<any>, options: CrudOptions = {}) => {
  const { searchFields = [], populate, companyField = 'companyId', filterFields = [], dateField } = options;

  return {
    getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const { page, limit, search, sortBy = 'createdAt', sortOrder = 'desc', startDate, endDate } = req.query;
        const { page: p, limit: l, skip } = getPagination(Number(page), Number(limit));

        const filter: Record<string, unknown> = {
          ...buildSearchQuery(search as string, searchFields),
        };

        if (req.user?.companyId && companyField) {
          filter[companyField] = req.user.companyId;
        }

        for (const field of filterFields) {
          const value = req.query[field];
          if (!value) continue;
          if (field === 'paymentStatus' && value === 'pending') {
            filter.$or = [
              { paymentStatus: 'pending' },
              { paymentStatus: { $exists: false } },
              { paymentStatus: null },
            ];
          } else {
            filter[field] = value;
          }
        }

        if (dateField && (startDate || endDate)) {
          const dateFilter: Record<string, Date> = {};
          if (startDate) dateFilter.$gte = new Date(startDate as string);
          if (endDate) {
            const end = new Date(endDate as string);
            end.setHours(23, 59, 59, 999);
            dateFilter.$lte = end;
          }
          filter[dateField] = dateFilter;
        }

        const sort: Record<string, SortOrder> = {
          [sortBy as string]: sortOrder === 'asc' ? 1 : -1,
        };
        const query = model.find(filter).sort(sort).skip(skip).limit(l);
        if (populate) query.populate(populate);

        const [data, total] = await Promise.all([
          query.exec(),
          model.countDocuments(filter),
        ]);

        sendSuccess(res, data, 'Fetched successfully', 200, {
          page: p,
          limit: l,
          total,
          totalPages: Math.ceil(total / l),
        });
      } catch (error) {
        next(error);
      }
    },

    getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const query = model.findById(req.params.id);
        if (populate) query.populate(populate);
        const doc = await query.exec();
        if (!doc) throw new AppError('Resource not found', 404);
        sendSuccess(res, doc);
      } catch (error) {
        next(error);
      }
    },

    create: async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const payload = await buildCreatePayload(model, req.body, req, companyField);
        if (model.modelName === 'Booking') {
          const rate = Number(payload.rate || 0);
          const weight = Number(payload.weight || 0);
          if (rate && weight) {
            payload.totalAmount = rate * weight;
          }
        }
        if (model.modelName === 'Trip') {
          const rate = Number(payload.rate || 0);
          const weight = Number(payload.weight || 0);
          if (rate && weight) {
            payload.totalAmount = rate * weight;
          }
          if (!payload.paymentStatus) {
            payload.paymentStatus = 'pending';
          }
        }
        const doc = await model.create(payload);
        sendSuccess(res, doc, 'Created successfully', 201);
      } catch (error) {
        next(error);
      }
    },

    update: async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const payload = { ...req.body };
        if (model.modelName === 'Booking') {
          const rate = Number(payload.rate || 0);
          const weight = Number(payload.weight || 0);
          if (rate && weight) {
            payload.totalAmount = rate * weight;
          }
        }
        if (model.modelName === 'Trip') {
          const rate = Number(payload.rate || 0);
          const weight = Number(payload.weight || 0);
          if (rate && weight) {
            payload.totalAmount = rate * weight;
          }
        }
        const doc = await model.findByIdAndUpdate(req.params.id, payload, {
          new: true,
          runValidators: true,
        });
        if (!doc) throw new AppError('Resource not found', 404);
        sendSuccess(res, doc, 'Updated successfully');
      } catch (error) {
        next(error);
      }
    },

    remove: async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const doc = await model.findByIdAndDelete(req.params.id);
        if (!doc) throw new AppError('Resource not found', 404);
        sendSuccess(res, null, 'Deleted successfully');
      } catch (error) {
        next(error);
      }
    },
  };
};
