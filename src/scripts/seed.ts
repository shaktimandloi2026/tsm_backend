import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { User, Role, Company, Branch } from '../models';
import { UserRole } from '../types';

const defaultRoles = [
  { name: UserRole.SUPER_ADMIN, displayName: 'Super Admin', permissions: ['*'] },
  { name: UserRole.ADMIN, displayName: 'Admin', permissions: ['manage_all'] },
  { name: UserRole.BRANCH_MANAGER, displayName: 'Branch Manager', permissions: ['manage_branch'] },
  { name: UserRole.ACCOUNTANT, displayName: 'Accountant', permissions: ['manage_finance'] },
  { name: UserRole.BOOKING_OPERATOR, displayName: 'Booking Operator', permissions: ['manage_bookings'] },
  { name: UserRole.DRIVER, displayName: 'Driver', permissions: ['view_trips'] },
];

const seed = async () => {
  await connectDatabase();

  for (const role of defaultRoles) {
    await Role.findOneAndUpdate({ name: role.name }, role, { upsert: true });
  }

  let company = await Company.findOne({ code: 'TSM001' });
  if (!company) {
    company = await Company.create({
      name: 'Transport Solutions Ltd',
      code: 'TSM001',
      email: 'info@tsm.com',
      phone: '+91-9876543210',
      address: '123 Transport Nagar, Mumbai',
      gstNumber: '27AAAAA0000A1Z5',
    });
  }

  let branch = await Branch.findOne({ code: 'BR001' });
  if (!branch) {
    branch = await Branch.create({
      name: 'Mumbai Head Office',
      code: 'BR001',
      companyId: company._id,
      city: 'Mumbai',
      state: 'Maharashtra',
    });
  }

  const adminEmail = 'admin@tsm.com';
  const adminPassword = '12345678';

  let admin = await User.findOne({ email: adminEmail });
  if (admin) {
    admin.name = 'Super Admin';
    admin.password = adminPassword;
    admin.role = UserRole.SUPER_ADMIN;
    admin.companyId = company._id;
    admin.branchId = branch._id;
    admin.isActive = true;
    await admin.save();
    console.log(`Demo admin updated: ${adminEmail} / ${adminPassword}`);
  } else {
    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      companyId: company._id,
      branchId: branch._id,
    });
    console.log(`Demo admin created: ${adminEmail} / ${adminPassword}`);
  }

  console.log('Seed completed successfully');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
