import { Router } from 'express';
import { webhookCallback } from 'grammy';
import { getBot } from '../bot/index.js';

const router = Router();

// POST /api/bot/webhook — grammY webhook handler for production
router.post('/webhook', (req, res) => {
  const bot = getBot();
  if (!bot) {
    res.status(503).json({ error: 'Bot not initialized' });
    return;
  }
  // Use grammY's built-in webhook adapter for Express
  const handler = webhookCallback(bot, 'express');
  handler(req, res);
});

export default router;
