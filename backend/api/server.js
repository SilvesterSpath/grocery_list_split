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

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);
app.use(express.json({ limit: '200kb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true });
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

