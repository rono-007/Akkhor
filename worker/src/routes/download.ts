import { Hono } from 'hono';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import type { Env, FontRow, FontStyleRow } from '../types';

export const downloadRouter = new Hono<{ Bindings: Env }>();

/**
 * Initialize S3 client for Neon Object Storage using Worker environment bindings.
 * All credentials remain securely on the Worker backend — never exposed to clients.
 */
function getS3Client(env: Env): S3Client {
  return new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION || 'us-east-2',
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });
}

/**
 * GET /api/fonts/:id/preview
 * 
 * Streams the font binary from Neon S3 storage for browser @font-face rendering.
 * Supports an optional ?style= parameter to load a specific weight/style variant.
 * 
 * Returns the raw font binary with proper CORS and caching headers so the
 * browser's FontFace API and canvas can load it without cross-origin blocks.
 */
downloadRouter.get('/fonts/:id/preview', async (c) => {
  const db = c.env.DB;
  const fontId = c.req.param('id');
  const styleName = c.req.query('style');

  // 1. Look up font metadata in D1
  const font = await db.prepare('SELECT * FROM fonts WHERE id = ?').bind(fontId).first<FontRow>();
  if (!font) {
    return c.json({ error: 'Font not found' }, 404);
  }

  let storageKey = font.r2_key;
  let fileName = font.file_name;

  // 2. If a specific style is requested, look up its style record
  if (styleName) {
    const style = await db.prepare(
      'SELECT * FROM font_styles WHERE font_id = ? AND name = ?'
    ).bind(fontId, styleName).first<FontStyleRow>();

    if (style) {
      storageKey = style.r2_key;
      fileName = style.file_name;
    }
  }

  // 3. Fetch binary from Neon S3
  try {
    const s3 = getS3Client(c.env);
    const s3Response = await s3.send(new GetObjectCommand({
      Bucket: c.env.S3_BUCKET || 'akshar-fonts',
      Key: storageKey,
    }));

    if (!s3Response.Body) {
      return c.json({ error: 'Font binary not found in storage' }, 404);
    }

    const ext = fileName.toLowerCase().split('.').pop();
    const contentType = ext === 'otf' ? 'font/otf' : 'font/ttf';
    const byteArray = await s3Response.Body.transformToByteArray();

    return new Response(byteArray, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': byteArray.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Timing-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error(`[preview-error] Failed to fetch ${storageKey}:`, err?.message);
    return c.json({ error: 'Storage fetch failed', message: err?.message }, 500);
  }
});

/**
 * GET /api/fonts/:id/download
 * 
 * Downloads the font file directly from Neon storage with a native
 * Content-Disposition attachment header matching the exact font name.
 */
downloadRouter.get('/fonts/:id/download', async (c) => {
  const db = c.env.DB;
  const fontId = c.req.param('id');
  const styleName = c.req.query('style');

  const font = await db.prepare('SELECT * FROM fonts WHERE id = ?').bind(fontId).first<FontRow>();
  if (!font) {
    return c.json({ error: 'Font not found' }, 404);
  }

  let storageKey = font.r2_key;
  let fileName = font.file_name;

  if (styleName) {
    const style = await db.prepare(
      'SELECT * FROM font_styles WHERE font_id = ? AND name = ?'
    ).bind(fontId, styleName).first<FontStyleRow>();

    if (style) {
      storageKey = style.r2_key;
      fileName = style.file_name;
    }
  }

  try {
    const s3 = getS3Client(c.env);
    const s3Response = await s3.send(new GetObjectCommand({
      Bucket: c.env.S3_BUCKET || 'akshar-fonts',
      Key: storageKey,
    }));

    if (!s3Response.Body) {
      return c.json({ error: 'Font binary not found in storage' }, 404);
    }

    const ext = fileName.toLowerCase().split('.').pop();
    const contentType = ext === 'otf' ? 'font/otf' : 'font/ttf';
    const byteArray = await s3Response.Body.transformToByteArray();

    return new Response(byteArray, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': byteArray.byteLength.toString(),
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error(`[download-error] Failed to download ${storageKey}:`, err?.message);
    return c.json({ error: 'Download failed', message: err?.message }, 500);
  }
});
