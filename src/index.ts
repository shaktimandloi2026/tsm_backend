import app from './app';
import { connectDatabase } from './config/database';

void connectDatabase().catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
});

export default app;
