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
import researchRouter from './routes/research.js';
import checklistsRouter from './routes/checklists.js';
import telegramRouter from './routes/telegram.js';
import authRouter from './routes/auth.js';
import userProfileRouter from './routes/user-profile.js';
import downloadsRouter from './routes/downloads.js';
import botWebhookRouter from './routes/bot-webhook.js';
import userAuthRouter from './routes/user-auth.js';
import lessonsRouter from './routes/lessons.js';
import videoRouter from './routes/video.js';
import purchasesRouter from './routes/purchases.js';
import paymentsRouter from './routes/payments.js';
import { createBot, startPolling } from './bot/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = parseInt(process.env.API_PORT || '3001');

// За reverse-proxy (nginx и т.п.) доверяем первому хопу, чтобы req.ip
// и rate-limit опирались на реальный клиентский IP, а не на адрес прокси.
app.set('trust proxy', 1);

const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:8080', 'http://localhost:8084', 'http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: CORS_ORIGINS,
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
app.use('/api/research', researchRouter);
app.use('/api/checklists', checklistsRouter);
app.use('/api/telegram', telegramRouter);
app.use('/api/auth', authRouter);
app.use('/api/user-profile', userProfileRouter);
app.use('/api/downloads', downloadsRouter);
app.use('/api/bot', botWebhookRouter);
app.use('/api/user-auth', userAuthRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/video', videoRouter);
app.use('/api/purchases', purchasesRouter);
app.use('/api/payments', paymentsRouter);

// Serve presentation files from /var/www/presentations (production) or local fallback
const PRESENTATIONS_DIR = process.env.PRESENTATIONS_DIR || path.resolve(__dirname, '../../presentations');
app.use('/api/presentations', express.static(PRESENTATIONS_DIR, {
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'public, max-age=86400');
  },
}));

app.get('/api/health', async (_req, res) => {
  const dbOk = await testConnection();
  res.json({
    status: dbOk ? 'ok' : 'degraded',
    database: dbOk ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}`);
  console.log(`📁 Files stored in PostgreSQL`);

  // Initialize Telegram bot (graceful degradation if token not set)
  const botInstance = createBot();
  if (botInstance) {
    const webhookUrl = process.env.BOT_WEBHOOK_URL;
    if (webhookUrl) {
      // Production: use webhook mode
      botInstance.api.setWebhook(webhookUrl).then(() => {
        console.log(`🤖 Telegram bot webhook set: ${webhookUrl}`);
      }).catch((err: Error) => {
        console.error('🤖 Failed to set webhook:', err.message);
        // Fallback to polling
        startPolling();
      });
    } else {
      // Development: use long polling
      startPolling();
    }
  }
});
