import { Hono } from 'hono';
import type { Env, FontRow, FontStyleRow, FontResponse, FontStyleResponse, PaginatedResponse, CategoryCount } from '../types';

export const fontsRouter = new Hono<{ Bindings: Env }>();

/**
 * Transform a DB row into the API response shape.
 * Keeps the same JSON keys the React frontend already expects.
 */
function toFontResponse(row: FontRow, styles?: FontStyleRow[]): FontResponse {
  const font: FontResponse = {
    id: row.id,
    name: row.name,
    fileName: row.file_name,
    file: `/api/fonts/${row.id}/preview`,
    category: row.category,
    sizeKb: row.size_kb,
    isFree: row.is_free === 1,
    price: row.price,
    encoding: row.encoding,
    isAnsi: row.is_ansi === 1,
  };

  // Optional extended metadata
  if (row.designer) font.designer = row.designer;
  if (row.foundry) font.foundry = row.foundry;
  if (row.year) font.year = row.year;
  if (row.license) font.license = row.license;
  if (row.description) font.description = row.description;
  if (row.script) font.script = row.script;
  if (row.rating) font.rating = row.rating;
  if (row.downloads != null) font.downloads = row.downloads;
  if (row.glyph_count) font.glyphCount = row.glyph_count;
  if (row.contrast) font.contrast = row.contrast;
  if (row.width) font.width = row.width;
  if (row.x_height) font.xHeight = row.x_height;
  if (row.tags) {
    try { font.tags = JSON.parse(row.tags); } catch { font.tags = []; }
  }
  if (row.sample_headline) font.sampleHeadline = row.sample_headline;
  if (row.sample_paragraph) font.sampleParagraph = row.sample_paragraph;
  if (row.suggested_pairing) font.suggestedPairing = row.suggested_pairing;

  // Attach styles if provided
  if (styles && styles.length > 0) {
    font.styles = styles.map(s => ({
      name: s.name,
      weight: s.weight,
      style: s.style,
      file: `/api/fonts/${row.id}/preview?style=${encodeURIComponent(s.name)}`,
    }));
  }

  return font;
}

/**
 * GET /api/fonts
 * 
 * Query params:
 *   page      (default 1)
 *   pageSize  (default 24, max 100)
 *   category  (filter by category, e.g. "Bengali", "Serif")
 *   encoding  (filter: "unicode" | "ansi" | "all")
 *   isFree    (filter: "true" | "false")
 *   search    (name search, case-insensitive)
 *   sort      (popularity | name | year | price)
 *   featured  (if "true", only return fonts with extended metadata)
 */
fontsRouter.get('/fonts', async (c) => {
  const db = c.env.DB;

  const page = Math.max(1, parseInt(c.req.query('page') || '1'));
  const pageSize = Math.min(100, Math.max(1, parseInt(c.req.query('pageSize') || '24')));
  const category = c.req.query('category');
  const encoding = c.req.query('encoding');
  const isFree = c.req.query('isFree');
  const search = c.req.query('search');
  const sort = c.req.query('sort') || 'popularity';
  const featured = c.req.query('featured');

  // Build WHERE clauses
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (category && category !== 'All') {
    conditions.push('f.category = ?');
    params.push(category);
  }

  if (encoding && encoding !== 'all') {
    conditions.push('f.encoding = ?');
    params.push(encoding);
  }

  if (isFree === 'true') {
    conditions.push('f.is_free = 1');
  } else if (isFree === 'false') {
    conditions.push('f.is_free = 0');
  }

  if (search) {
    conditions.push('f.name LIKE ?');
    params.push(`%${search}%`);
  }

  if (featured === 'true') {
    conditions.push('f.designer IS NOT NULL');
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Sort
  let orderClause: string;
  switch (sort) {
    case 'name': orderClause = 'ORDER BY f.name ASC'; break;
    case 'year': orderClause = 'ORDER BY f.year DESC NULLS LAST, f.name ASC'; break;
    case 'price': orderClause = 'ORDER BY f.price ASC, f.name ASC'; break;
    case 'popularity':
    default: orderClause = 'ORDER BY f.downloads DESC NULLS LAST, f.name ASC'; break;
  }

  // Count total
  const countQuery = `SELECT COUNT(*) as total FROM fonts f ${whereClause}`;
  const countResult = await db.prepare(countQuery).bind(...params).first<{ total: number }>();
  const total = countResult?.total || 0;

  // Fetch page
  const offset = (page - 1) * pageSize;
  const dataQuery = `SELECT f.* FROM fonts f ${whereClause} ${orderClause} LIMIT ? OFFSET ?`;
  const dataResult = await db.prepare(dataQuery).bind(...params, pageSize, offset).all<FontRow>();

  const fonts = (dataResult.results || []).map(row => toFontResponse(row));

  const response: PaginatedResponse<FontResponse> = {
    data: fonts,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };

  return c.json(response, 200, {
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  });
});

/**
 * GET /api/fonts/:id
 * Returns full font details with all styles.
 */
fontsRouter.get('/fonts/:id', async (c) => {
  const db = c.env.DB;
  const fontId = c.req.param('id');

  const font = await db.prepare('SELECT * FROM fonts WHERE id = ?').bind(fontId).first<FontRow>();
  if (!font) {
    return c.json({ error: 'Font not found' }, 404);
  }

  const stylesResult = await db.prepare(
    'SELECT * FROM font_styles WHERE font_id = ? ORDER BY weight ASC'
  ).bind(fontId).all<FontStyleRow>();

  const styles = stylesResult.results || [];
  const response = toFontResponse(font, styles);

  return c.json(response, 200, {
    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  });
});

/**
 * GET /api/categories
 * Returns category names with font counts.
 */
fontsRouter.get('/categories', async (c) => {
  const db = c.env.DB;

  const result = await db.prepare(
    'SELECT category, COUNT(*) as count FROM fonts GROUP BY category ORDER BY count DESC'
  ).all<CategoryCount>();

  return c.json(result.results || [], 200, {
    'Cache-Control': 'public, max-age=3600',
  });
});
