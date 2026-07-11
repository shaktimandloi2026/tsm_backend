# TSM Backend - Transport ERP API

REST API backend for the Transport ERP System built with Express.js, TypeScript, and MongoDB.

## Tech Stack

- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Role-Based Access Control (RBAC)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally or a connection string

### Installation

```bash
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### Seed Database

```bash
npm run seed
```

Default admin credentials: `admin@tsm.com` / `12345678`

### Development

```bash
npm run dev
```

API runs at `http://localhost:5000`

### Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Connect the `tsm_backend` repository to Vercel
2. Set **Root Directory** to `.` (repo root — not the parent `tsm` folder)
3. Add environment variables from `.env.example` in the Vercel dashboard:
   - `MONGODB_URI` — use [MongoDB Atlas](https://www.mongodb.com/atlas) for production
   - `JWT_SECRET`
   - `CORS_ORIGIN` — your frontend URL (e.g. `https://your-app.vercel.app`)
4. Redeploy

The API entry point is `src/index.ts`, which exports the Express app for Vercel serverless.

## API Endpoints

| Module | Base Path |
|--------|-----------|
| Auth | `/api/auth` |
| Dashboard | `/api/dashboard` |
| Customers | `/api/customers` |
| Vehicles | `/api/vehicles` |
| Drivers | `/api/drivers` |
| Routes | `/api/routes` |
| Bookings | `/api/bookings` |
| Trips | `/api/trips` |
| Expenses | `/api/expenses` |
| Payments | `/api/payments` |
| Banks | `/api/banks` |
| Cash Transactions | `/api/cash-transactions` |
| Invoices | `/api/invoices` |
| Users | `/api/users` |
| File Upload | `/api/upload` |

## User Roles

- Super Admin
- Admin
- Branch Manager
- Accountant
- Booking Operator
- Driver

## Features

- JWT Authentication
- RBAC middleware
- Request validation
- File upload support
- Pagination, filtering & search
- Global error handling
- Activity logging ready
- Multi-company & multi-branch support
