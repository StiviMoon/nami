import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import authRouter from './modules/auth/router';
import restaurantRouter from './modules/restaurants/router';
import menuRouter from './modules/menu/router';
import dashboardRouter from './modules/dashboard/router';
import adminRouter from './modules/admin/router';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    callback(null, origin || true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/menu', menuRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/admin', adminRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ ÑAMI API running → http://localhost:${PORT}`);
});

export default app;
