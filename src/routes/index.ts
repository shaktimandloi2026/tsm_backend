import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as authController from '../controllers/auth.controller';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { getTripReport } from '../controllers/reports.controller';
import {
  customerController, vehicleController, driverController, routeController,
  bookingController, tripController, expenseController,
  bankController, cashTransactionController, userController,
} from '../controllers/resource.controller';
import { paymentController } from '../controllers/payments.controller';
import { authorize, authorizeMinRole } from '../middleware/rbac';
import { UserRole } from '../types';
import { upload } from '../middleware/upload';
import { sendSuccess } from '../utils/response';

const router = Router();

// Auth
router.post('/auth/login', authController.loginValidation, validate, authController.login);
router.get('/auth/profile', authenticate, authController.getProfile);
router.put('/auth/profile', authenticate, authController.updateProfile);
router.put('/auth/change-password', authenticate, authController.changePassword);

// Dashboard
router.get('/dashboard/stats', authenticate, getDashboardStats);

// Reports
router.get('/reports/trips', authenticate, authorizeMinRole(UserRole.BOOKING_OPERATOR), getTripReport);

// File upload
router.post('/upload', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }
  sendSuccess(res, { filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

// Resource routes helper
const resourceRoutes = (
  path: string,
  controller: ReturnType<typeof import('../controllers/base.controller').createCrudController>,
  minRole: UserRole = UserRole.BOOKING_OPERATOR
) => {
  router.get(`/${path}`, authenticate, authorizeMinRole(minRole), controller.getAll);
  router.get(`/${path}/:id`, authenticate, authorizeMinRole(minRole), controller.getById);
  router.post(`/${path}`, authenticate, authorizeMinRole(minRole), controller.create);
  router.put(`/${path}/:id`, authenticate, authorizeMinRole(minRole), controller.update);
  router.delete(`/${path}/:id`, authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), controller.remove);
};

resourceRoutes('customers', customerController);
resourceRoutes('vehicles', vehicleController);
resourceRoutes('drivers', driverController);
resourceRoutes('routes', routeController);
resourceRoutes('bookings', bookingController);
resourceRoutes('trips', tripController);
resourceRoutes('expenses', expenseController, UserRole.ACCOUNTANT);

const paymentMinRole = UserRole.ACCOUNTANT;
router.get('/payments', authenticate, authorizeMinRole(paymentMinRole), paymentController.getAll);
router.get('/payments/:id', authenticate, authorizeMinRole(paymentMinRole), paymentController.getById);
router.post('/payments', authenticate, authorizeMinRole(paymentMinRole), paymentController.create);
router.put('/payments/:id', authenticate, authorizeMinRole(paymentMinRole), paymentController.update);
router.delete('/payments/:id', authenticate, authorizeMinRole(paymentMinRole), paymentController.remove);

resourceRoutes('banks', bankController, UserRole.ACCOUNTANT);
resourceRoutes('cash-transactions', cashTransactionController, UserRole.ACCOUNTANT);
resourceRoutes('users', userController, UserRole.ADMIN);

export default router;
