/**
 * AKSHAR — API Client
 * 
 * Provides functions to fetch font data from the Hono backend on Cloudflare Workers.
 * Falls back to local static data in development when the API is unavailable.
 */

// API base URL — in production this routes to the Worker,
// in development it proxies through Vite to the local Wrangler dev server
const API_BASE = '/api';

/**
 * Fetch all fonts (unpaginated — loads everything for client-side filtering).
 * The current UI does client-side search, sort, and filter across all 719 fonts,
 * so we fetch them all in one request and let the existing useMemo handle the rest.
 * 
 * This approach keeps the frontend logic unchanged while moving the data source
 * from bundled JSON to the D1 database.
 */
export async function fetchAllFonts() {
  try {
    const response = await fetch(`${API_BASE}/fonts?pageSize=100&page=1`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const firstPage = await response.json();
    const totalPages = firstPage.totalPages;
    
    // If all fonts fit in one page, return immediately
    if (totalPages <= 1) return firstPage.data;
    
    // Fetch remaining pages in parallel
    const pagePromises = [];
    for (let p = 2; p <= totalPages; p++) {
      pagePromises.push(
        fetch(`${API_BASE}/fonts?pageSize=100&page=${p}`)
          .then(r => r.json())
          .then(d => d.data)
      );
    }
    
    const remainingPages = await Promise.all(pagePromises);
    return [firstPage.data, ...remainingPages].flat();
  } catch (err) {
    console.warn('[akshar-api] Failed to fetch fonts from API, using local fallback:', err.message);
    return null; // Signal to use local fallback
  }
}

/**
 * Fetch a single font with all its styles.
 */
export async function fetchFontById(fontId) {
  try {
    const response = await fetch(`${API_BASE}/fonts/${fontId}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn(`[akshar-api] Failed to fetch font ${fontId}:`, err.message);
    return null;
  }
}

/**
 * Fetch category list with counts.
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('[akshar-api] Failed to fetch categories:', err.message);
    return null;
  }
}

/**
 * Get the preview URL for a font (for @font-face loading).
 * When running with the API, fonts are served via the Worker from R2.
 * When running locally in dev without the Worker, falls back to /fonts/ path.
 */
export function getFontPreviewUrl(fontId, styleName) {
  if (styleName) {
    return `${API_BASE}/fonts/${fontId}/preview?style=${encodeURIComponent(styleName)}`;
  }
  return `${API_BASE}/fonts/${fontId}/preview`;
}

/**
 * Get the download URL for a font.
 */
export function getFontDownloadUrl(fontId, styleName) {
  if (styleName) {
    return `${API_BASE}/fonts/${fontId}/download?style=${encodeURIComponent(styleName)}`;
  }
  return `${API_BASE}/fonts/${fontId}/download`;
}

/**
 * Health check — verifies the API is reachable.
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`, { 
      signal: AbortSignal.timeout(3000) 
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}
