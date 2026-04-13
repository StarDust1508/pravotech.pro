import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { testConnection } from './db.js';

import speakersRouter from './routes/speakers.js';
import streamsRouter from './routes/streams.js';
import sponsorsRouter from './routes/sponsors.js';
import participantsRouter from './routes/participants.js';
import leadsRouter from './routes/leads.js';
import settingsRouter from './routes/settings.js';
import mediaRouter from './routes/media.js';
import academyRouter from './routes/academy.js';
import authRouter from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = parseInt(process.env.API_PORT || '3001');

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8084', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/speakers', speakersRouter);
app.use('/api/streams', streamsRouter);
app.use('/api/sponsors', sponsorsRouter);
app.use('/api/participants', participantsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/academy', academyRouter);
app.use('/api/auth', authRouter);

app.get('/api/health', async (_req, res) => {
  const dbOk = await testConnection();
  res.json({
    status: dbOk ? 'ok' : 'degraded',
    database: dbOk ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}`);
  console.log(`� Files stored in PostgreSQL`);
});
