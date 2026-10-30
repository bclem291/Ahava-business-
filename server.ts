import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// --- PAYSTACK SERVER-SIDE ENDPOINTS ---

/**
 * Initialize a Paystack transaction
 */
app.post('/api/paystack/initialize', async (req: Request, res: Response) => {
  try {
    const { email, amount, metadata } = req.body;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!email || !amount) {
      return res.status(400).json({ error: 'Email and amount are required.' });
    }

    // Convert amount in Naira to Kobo (multiply by 100)
    const amountInKobo = Math.round(Number(amount) * 100);

    if (secretKey && secretKey.startsWith('sk_')) {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          amount: amountInKobo,
          metadata,
          channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
        })
      });

      const data = await response.json();
      return res.json(data);
    } else {
      // Sandbox mode when PAYSTACK_SECRET_KEY is not yet populated
      const mockRef = `AHV_TEST_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      return res.json({
        status: true,
        message: 'Sandbox transaction initialized',
        data: {
          authorization_url: '#sandbox_payment',
          access_code: 'mock_access_code',
          reference: mockRef
        },
        is_sandbox: true
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Initialization failed';
    return res.status(500).json({ error: message });
  }
});

/**
 * Verify a Paystack transaction by reference
 */
app.get('/api/paystack/verify/:reference', async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!reference) {
      return res.status(400).json({ error: 'Transaction reference is required.' });
    }

    if (secretKey && secretKey.startsWith('sk_')) {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`
        }
      });
      const data = await response.json();
      if (data.status && data.data && data.data.status === 'success') {
        return res.json({
          status: 'success',
          reference,
          amount: data.data.amount / 100,
          channel: data.data.channel,
          paid_at: data.data.paid_at,
          data: data.data
        });
      }
      return res.status(400).json({ status: 'failed', message: data.message || 'Verification failed' });
    } else {
      // Sandbox verify
      return res.json({
        status: 'success',
        reference,
        channel: 'test_card',
        paid_at: new Date().toISOString(),
        is_sandbox: true
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Verification failed';
    return res.status(500).json({ error: message });
  }
});

/**
 * Paystack Webhook Handler
 */
app.post('/api/paystack/webhook', (req: Request, res: Response) => {
  const event = req.body;
  res.status(200).send('Webhook received');
  console.log('Received Paystack Webhook event:', event?.event);
});

/**
 * Contact message API
 */
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  console.log(`New contact inquiry from ${name} (${email}, ${phone}): ${message}`);
  return res.json({ success: true, message: 'Message received successfully. Our team will contact you shortly.' });
});

// --- VITE MIDDLEWARE OR STATIC SERVING ---
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);

    // Fallback to transform and serve index.html for SPA routes like /admin
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          next();
        }
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`AHAVA DIGITAL HUB server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
