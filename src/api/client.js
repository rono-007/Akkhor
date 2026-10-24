/**
 * AKSHAR — API Client
 * 
 * Provides robust functions to fetch font data from the backend.
 * Validates schemas, handles pagination errors (HTTP 500, network errors),
 * and safely falls back to local static catalog on any failure.
 */

const API_BASE = '/api';

/**
 * Validates a single font record against expected schema.
 * Rejects records with missing core properties to prevent UI crashes.
 */
export function isValidFont(font) {
  if (!font || typeof font !== 'object') return false;
  if (typeof font.id !== 'string' || !font.id.trim()) return false;
  if (typeof font.name !== 'string' || !font.name.trim()) return false;
  if (typeof font.file !== 'string' || !font.file.trim()) return false;
  if (typeof font.category !== 'string' || !font.category.trim()) return false;
  return true;
}

/**
 * Validates and sanitizes an array of font records.
 */
export function sanitizeFontList(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(isValidFont);
}

/**
 * Fetch all fonts with robust pagination handling and schema validation.
 * 
 * Resilience features:
 * - Checks HTTP status codes for every single page request.
 * - Validates JSON structure and schema of every page response.
 * - Prevents undefined/malformed elements from polluting the catalogue.
 * - Catches HTTP 500 responses, network timeouts, and JSON parsing errors.
 * - Gracefully falls back to local static data if the API fails.
 */
export async function fetchAllFonts(fetchFn = fetch) {
  try {
    const response = await fetchFn(`${API_BASE}/fonts?pageSize=100&page=1`);
    if (!response || !response.ok) {
      throw new Error(`API error on page 1: HTTP ${response ? response.status : 'No response'}`);
    }

    const firstPage = await response.json();
    if (!firstPage || !Array.isArray(firstPage.data)) {
      throw new Error('Malformed API response on page 1: missing data array');
    }

    const validFirstPageFonts = sanitizeFontList(firstPage.data);
    const totalPages = Number(firstPage.totalPages);

    // If totalPages is invalid or 1, return the validated first page
    if (!Number.isInteger(totalPages) || totalPages <= 1) {
      return validFirstPageFonts.length > 0 ? validFirstPageFonts : null;
    }

    // Cap totalPages to prevent runaway loops (max 50 pages = 5000 fonts)
    const safeTotalPages = Math.min(totalPages, 50);

    // Fetch remaining pages in parallel with individual error inspection
    const pagePromises = [];
    for (let p = 2; p <= safeTotalPages; p++) {
      pagePromises.push(
        fetchFn(`${API_BASE}/fonts?pageSize=100&page=${p}`)
          .then(async (res) => {
            if (!res || !res.ok) {
              throw new Error(`Page ${p} failed with HTTP ${res ? res.status : 'No response'}`);
            }
            const json = await res.json();
            if (!json || !Array.isArray(json.data)) {
              throw new Error(`Page ${p} returned malformed data schema`);
            }
            return sanitizeFontList(json.data);
          })
      );
    }

    const remainingPages = await Promise.all(pagePromises);
    const allFonts = [validFirstPageFonts, ...remainingPages].flat().filter(isValidFont);

    if (allFonts.length === 0) {
      throw new Error('Catalogue contains 0 valid font records after sanitization');
    }

    return allFonts;
  } catch (err) {
    console.warn('[akshar-api] Failed to fetch fonts from API, using local fallback:', err.message);
    return null; // Signals caller to use local fallback (EXTENDED_FONTS)
  }
}

/**
 * Fetch a single font with all its styles.
 */
export async function fetchFontById(fontId, fetchFn = fetch) {
  if (!fontId || typeof fontId !== 'string') return null;
  try {
    const response = await fetchFn(`${API_BASE}/fonts/${encodeURIComponent(fontId)}`);
    if (!response || !response.ok) throw new Error(`API error: ${response ? response.status : 'No response'}`);
    const data = await response.json();
    return isValidFont(data) ? data : null;
  } catch (err) {
    console.warn(`[akshar-api] Failed to fetch font ${fontId}:`, err.message);
    return null;
  }
}

/**
 * Fetch category list with counts.
 */
export async function fetchCategories(fetchFn = fetch) {
  try {
    const response = await fetchFn(`${API_BASE}/categories`);
    if (!response || !response.ok) throw new Error(`API error: ${response ? response.status : 'No response'}`);
    const data = await response.json();
    if (!Array.isArray(data)) return null;
    return data.filter(c => c && typeof c.category === 'string' && typeof c.count === 'number');
  } catch (err) {
    console.warn('[akshar-api] Failed to fetch categories:', err.message);
    return null;
  }
}

/**
 * Get the preview URL for a font (for @font-face loading).
 */
export function getFontPreviewUrl(fontId, styleName) {
  if (!fontId || typeof fontId !== 'string') return '';
  const safeId = encodeURIComponent(fontId.trim());
  if (styleName && typeof styleName === 'string') {
    return `${API_BASE}/fonts/${safeId}/preview?style=${encodeURIComponent(styleName.trim())}`;
  }
  return `${API_BASE}/fonts/${safeId}/preview`;
}

/**
 * Get the download URL for a font.
 */
export function getFontDownloadUrl(fontId, styleName, licenseToken) {
  if (!fontId || typeof fontId !== 'string') return '';
  const safeId = encodeURIComponent(fontId.trim());
  const params = new URLSearchParams();
  if (styleName && typeof styleName === 'string') {
    params.set('style', styleName.trim());
  }
  if (licenseToken && typeof licenseToken === 'string') {
    params.set('license', licenseToken.trim());
  }
  const queryString = params.toString();
  return queryString ? `${API_BASE}/fonts/${safeId}/download?${queryString}` : `${API_BASE}/fonts/${safeId}/download`;
}

/**
 * Health check — verifies the API is reachable.
 */
export async function checkApiHealth(fetchFn = fetch) {
  try {
    const response = await fetchFn(`${API_BASE}/health`, { 
      signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined 
    });
    if (!response || !response.ok) return false;
    const data = await response.json();
    return data && data.status === 'ok';
  } catch {
    return false;
  }
}
