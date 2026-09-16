import express from 'express';
import workOrderRoutes from './routes/workOrders';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
const app = express();

app.use(express.json());

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/work-orders', workOrderRoutes);

// Centralized Error Middleware (must be registered after routes)
app.use(errorHandler);

export default app;