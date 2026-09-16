import express from 'express';
import cors from 'cors';
import path from 'path';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import workOrderRoutes from './routes/workOrders';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve OpenAPI Docs
const openApiDocument = YAML.load(path.join(__dirname, '../../docs/openapi.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// App Routes
app.use('/api/auth', authRoutes);
app.use('/api/work-orders', workOrderRoutes);

// Error Handler
app.use(errorHandler);

export default app;