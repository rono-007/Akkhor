import { Hono } from 'hono';
import type { Env, FontRow, FontStyleRow } from '../types';

export const downloadRouter = new Hono<{ Bindings: Env }>();

/**
 * GET /api/fonts/:id/preview
 * 
 * Streams the font binary from R2 for browser @font-face rendering.
 * Supports an optional ?style= parameter to load a specific weight/style variant.
 * 
 * Returns the raw font file with proper CORS and caching headers so the
 * browser's FontFace API can load it cross-origin.
 */
downloadRouter.get('/fonts/:id/preview', async (c) => {
  const db = c.env.DB;
  const bucket = c.env.FONTS_BUCKET;
  const fontId = c.req.param('id');
  const styleName = c.req.query('style');

  // Look up font metadata
  const font = await db.prepare('SELECT * FROM fonts WHERE id = ?').bind(fontId).first<FontRow>();
  if (!font) {
    return c.json({ error: 'Font not found' }, 404);
  }

  let r2Key = font.r2_key;
  let fileName = font.file_name;

  // If a specific style is requested, look it up
  if (styleName) {
    const style = await db.prepare(
      'SELECT * FROM font_styles WHERE font_id = ? AND name = ?'
    ).bind(fontId, styleName).first<FontStyleRow>();

    if (style) {
      r2Key = style.r2_key;
      fileName = style.file_name;
    }
  }

  // Fetch from storage
  if (!bucket) {
    return c.json({ error: 'Font binary storage not configured' }, 503);
  }

  const object = await bucket.get(r2Key);
  if (!object) {
    return c.json({ error: 'Font file not found in storage' }, 404);
  }

  // Determine content type
  const ext = fileName.toLowerCase().split('.').pop();
  const contentType = ext === 'otf' ? 'font/otf' : 'font/ttf';

  // Stream the font binary with caching
  return new Response(object.body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': object.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Timing-Allow-Origin': '*',
    },
  });
});

/**
 * GET /api/fonts/:id/download
 * 
 * Downloads the font file. For free fonts, serves directly.
 * For paid fonts, a license token would be required (future: Stripe integration).
 */
downloadRouter.get('/fonts/:id/download', async (c) => {
  const db = c.env.DB;
  const bucket = c.env.FONTS_BUCKET;
  const fontId = c.req.param('id');
  const styleName = c.req.query('style');

  const font = await db.prepare('SELECT * FROM fonts WHERE id = ?').bind(fontId).first<FontRow>();
  if (!font) {
    return c.json({ error: 'Font not found' }, 404);
  }

  // License check for paid fonts (placeholder for future Stripe integration)
  if (font.is_free !== 1) {
    // TODO: Validate license token from query param or header
    // For now, allow download but mark as unlicensed preview
  }

  let r2Key = font.r2_key;
  let fileName = font.file_name;

  if (styleName) {
    const style = await db.prepare(
      'SELECT * FROM font_styles WHERE font_id = ? AND name = ?'
    ).bind(fontId, styleName).first<FontStyleRow>();

    if (style) {
      r2Key = style.r2_key;
      fileName = style.file_name;
    }
  }

  if (!bucket) {
    return c.json({ error: 'Font binary storage not configured' }, 503);
  }

  const object = await bucket.get(r2Key);
  if (!object) {
    return c.json({ error: 'Font file not found in storage' }, 404);
  }

  const ext = fileName.toLowerCase().split('.').pop();
  const contentType = ext === 'otf' ? 'font/otf' : 'font/ttf';

  return new Response(object.body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': object.size.toString(),
      'Access-Control-Allow-Origin': '*',
    },
  });
});
