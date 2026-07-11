import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: ApiResponse['meta']
): void => {
  const response: ApiResponse<T> = { success: true, message, data };
  if (meta) response.meta = meta;
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400
): void => {
  res.status(statusCode).json({ success: false, message });
};

export const generateCode = (prefix: string, count: number): string => {
  return `${prefix}${String(count + 1).padStart(5, '0')}`;
};

export const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Math.max(1, Number(page));
  const parsedLimit = Math.min(100, Math.max(1, Number(limit)));
  const skip = (parsedPage - 1) * parsedLimit;
  return { page: parsedPage, limit: parsedLimit, skip };
};

export const buildSearchQuery = (search: string | undefined, fields: string[]) => {
  if (!search) return {};
  const regex = new RegExp(search, 'i');
  return { $or: fields.map((field) => ({ [field]: regex })) };
};
