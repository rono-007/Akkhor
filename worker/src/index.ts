import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import { fontsRouter } from './routes/fonts';
import { downloadRouter } from './routes/download';

const app = new Hono<{ Bindings: Env }>();

// 1. Security Headers middleware
app.use('*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('X-XSS-Protection', '1; mode=block');
});

// 2. CORS middleware — allow the frontend origin
app.use('/api/*', async (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || ['*'];
  const origin = c.req.header('Origin') || '';
  const isAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(origin);

  return cors({
    origin: isAllowed ? origin : allowedOrigins[0],
    allowMethods: ['GET', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-License-Token'],
    maxAge: 86400,
  })(c, next);
});

// 3. Health check
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'akshar-api',
    environment: c.env.ENVIRONMENT || 'production',
    timestamp: new Date().toISOString()
  });
});

// 4. Mount font routes
app.route('/api', fontsRouter);
app.route('/api', downloadRouter);

// 5. 404 fallback for API routes
app.notFound((c) => {
  return c.json({ error: 'Endpoint not found', path: c.req.path }, 404);
});

// 6. Global error handler (prevents leaking stack traces or internal details)
app.onError((err, c) => {
  console.error(`[akshar-api] Unhandled error at ${c.req.path}:`, err?.message);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
