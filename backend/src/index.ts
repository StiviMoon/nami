import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import authRouter from './modules/auth/router';
import restaurantRouter from './modules/restaurants/router';
import menuRouter from './modules/menu/router';
import dashboardRouter from './modules/dashboard/router';
import adminRouter from './modules/admin/router';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// --- Security ---
// Permitir que el front en otro dominio (p. ej. Vercel / ñami.app) lea respuestas fetch();
// el valor por defecto de Helmet es same-origin y rompe llamadas cross-origin aunque CORS esté bien.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins && allowedOrigins.length > 0
    ? allowedOrigins
    : isProd
      ? false  // Block all cross-origin in prod if not configured
      : 'http://localhost:3001',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// --- Rate limiting ---
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiados intentos. Espera un minuto.' },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiadas subidas. Intenta de nuevo en un minuto.' },
});

app.use(globalLimiter);

// Health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: isProd ? 'production' : 'development' });
});

// Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/menu', menuRouter);
app.use('/api/dashboard/upload-url', uploadLimiter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/admin', adminRouter);

// Error handler
app.use(errorHandler);

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`✅ ÑAMI API running → http://0.0.0.0:${PORT} [${isProd ? 'production' : 'development'}]`);
});

export default app;
