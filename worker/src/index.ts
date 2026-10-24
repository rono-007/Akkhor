import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { cache } from 'hono/cache';
import type { Env } from './types';
import { fontsRouter } from './routes/fonts';
import { downloadRouter } from './routes/download';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware — allow the frontend origin
app.use('/api/*', async (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || ['*'];
  const origin = c.req.header('Origin') || '';
  const isAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(origin);

  return cors({
    origin: isAllowed ? origin : allowedOrigins[0],
    allowMethods: ['GET', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 86400,
  })(c, next);
});

// Health check
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'akshar-api',
    environment: c.env.ENVIRONMENT,
    timestamp: new Date().toISOString()
  });
});

// Mount font routes
app.route('/api', fontsRouter);
app.route('/api', downloadRouter);

// 404 fallback for API routes
app.notFound((c) => {
  return c.json({ error: 'Not found', path: c.req.path }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(`[akshar-api] Error: ${err.message}`, err.stack);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
