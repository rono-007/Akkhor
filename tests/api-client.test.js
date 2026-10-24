import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { 
  isValidFont, 
  sanitizeFontList, 
  fetchAllFonts, 
  fetchFontById, 
  fetchCategories,
  getFontPreviewUrl,
  getFontDownloadUrl,
  checkApiHealth
} from '../src/api/client.js';

describe('AKSHAR API Client & Pagination Resilience', () => {

  test('isValidFont accepts complete font objects and rejects malformed ones', () => {
    assert.strictEqual(isValidFont({
      id: 'font-1',
      name: 'Test Font',
      file: '/api/fonts/font-1/preview',
      category: 'Serif'
    }), true);

    // Missing core fields
    assert.strictEqual(isValidFont(null), false);
    assert.strictEqual(isValidFont(undefined), false);
    assert.strictEqual(isValidFont({}), false);
    assert.strictEqual(isValidFont({ id: 'font-1' }), false); // missing name, file, category
    assert.strictEqual(isValidFont({ id: 'font-1', name: 'Test', file: '' }), false); // empty file
    assert.strictEqual(isValidFont({ id: '   ', name: 'Test', file: '/f', category: 'Serif' }), false); // whitespace ID
  });

  test('sanitizeFontList filters out corrupt or undefined items', () => {
    const mixedList = [
      { id: 'f1', name: 'Font 1', file: '/api/fonts/f1/preview', category: 'Bengali' },
      undefined,
      null,
      { broken: true },
      { id: 'f2', name: 'Font 2', file: '/api/fonts/f2/preview', category: 'Sans Serif' }
    ];

    const clean = sanitizeFontList(mixedList);
    assert.strictEqual(clean.length, 2);
    assert.strictEqual(clean[0].id, 'f1');
    assert.strictEqual(clean[1].id, 'f2');
  });

  test('fetchAllFonts handles single-page catalog response', async () => {
    const mockFetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        data: [
          { id: 'f1', name: 'Font 1', file: '/api/fonts/f1/preview', category: 'Bengali' }
        ],
        total: 1,
        page: 1,
        totalPages: 1
      })
    });

    const result = await fetchAllFonts(mockFetch);
    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].name, 'Font 1');
  });

  test('fetchAllFonts handles multi-page pagination successfully', async () => {
    const mockFetch = async (url) => {
      const page = url.includes('page=2') ? 2 : 1;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            { id: `f-p${page}`, name: `Font Page ${page}`, file: `/api/fonts/f-p${page}/preview`, category: 'Bengali' }
          ],
          total: 2,
          page,
          totalPages: 2
        })
      };
    };

    const result = await fetchAllFonts(mockFetch);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].id, 'f-p1');
    assert.strictEqual(result[1].id, 'f-p2');
  });

  test('REGRESSION: fetchAllFonts safely falls back (returns null) on HTTP 500 error on page 1', async () => {
    const mockFetch = async () => ({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' })
    });

    const result = await fetchAllFonts(mockFetch);
    // Returning null triggers the caller to use the bundled EXTENDED_FONTS catalog
    assert.strictEqual(result, null);
  });

  test('REGRESSION: fetchAllFonts safely falls back (returns null) if subsequent page returns HTTP 500', async () => {
    const mockFetch = async (url) => {
      if (url.includes('page=2')) {
        return {
          ok: false,
          status: 500,
          json: async () => ({ error: 'Database timeout on page 2' })
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: [{ id: 'f1', name: 'Font 1', file: '/f1', category: 'Bengali' }],
          total: 200,
          page: 1,
          totalPages: 2
        })
      };
    };

    const result = await fetchAllFonts(mockFetch);
    // Must return null instead of throwing or returning partial corrupt array with undefined items
    assert.strictEqual(result, null);
  });

  test('fetchAllFonts safely handles malformed JSON response', async () => {
    const mockFetch = async () => ({
      ok: true,
      status: 200,
      json: async () => { throw new SyntaxError('Unexpected token < in JSON at position 0'); }
    });

    const result = await fetchAllFonts(mockFetch);
    assert.strictEqual(result, null);
  });

  test('fetchAllFonts safely handles network drop / exception', async () => {
    const mockFetch = async () => {
      throw new Error('Failed to fetch: Connection reset by peer');
    };

    const result = await fetchAllFonts(mockFetch);
    assert.strictEqual(result, null);
  });

  test('getFontPreviewUrl and getFontDownloadUrl format safe URLs', () => {
    assert.strictEqual(getFontPreviewUrl('kalpurush'), '/api/fonts/kalpurush/preview');
    assert.strictEqual(
      getFontPreviewUrl('abirvab', 'Bold Italic'), 
      '/api/fonts/abirvab/preview?style=Bold%20Italic'
    );
    assert.strictEqual(
      getFontDownloadUrl('kalpurush', 'Bold', 'lic_123'), 
      '/api/fonts/kalpurush/download?style=Bold&license=lic_123'
    );
  });
});
