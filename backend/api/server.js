import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import seedDefaultsIfEmpty from './seed.js';

import stateRoutes from './routes/stateRoutes.js';
import globalRoutes from './routes/globalRoutes.js';
import presetRoutes from './routes/presetRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

/** Vercel production + preview URLs (PR deploys use *.vercel.app). */
function isAllowedBrowserOrigin(origin) {
  if (allowedOrigins.includes(origin)) return true;
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol !== 'https:' && protocol !== 'http:') return false;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    if (hostname.endsWith('.vercel.app')) return true;
  } catch {
    return false;
  }
  return false;
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser requests (no Origin header) should still work.
      if (!origin) return callback(null, true);

      // If no CORS_ORIGIN is configured, keep current permissive behavior.
      if (allowedOrigins.length === 0) return callback(null, true);

      if (isAllowedBrowserOrigin(origin)) return callback(null, origin);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);
app.use(express.json({ limit: '200kb' }));

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    apiVersion: 3,
    presetFormat: 'string-or-storeZone-object',
  });
});

app.use('/api', stateRoutes);
app.use('/api', globalRoutes);
app.use('/api', presetRoutes);

const start = async () => {
  await connectDB();
  await seedDefaultsIfEmpty();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Grocery backend listening on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

