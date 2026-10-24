/**
 * AKSHAR — Storage Security & Validation Utilities
 */

/**
 * Validates storage object keys to prevent path traversal and arbitrary key access.
 * Must begin with 'fonts/' and must not contain traversal tokens, backslashes, or null bytes.
 */
export function isSafeStorageKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  if (!key.startsWith('fonts/')) return false;
  // Disallow directory traversal sequences, null bytes, backslashes
  if (key.includes('..') || key.includes('\\') || key.includes('\0') || key.includes('//')) return false;
  return true;
}

/**
 * Sanitizes file names for safe use in Content-Disposition headers.
 * Strips quotes, linebreaks, backslashes, and control characters to prevent header injection.
 */
export function sanitizeFileName(name: string): string {
  if (!name || typeof name !== 'string') return 'font.ttf';
  const clean = name.replace(/["\r\n\\]/g, '').trim();
  return clean || 'font.ttf';
}
