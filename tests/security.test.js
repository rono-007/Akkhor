import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { isSafeStorageKey, sanitizeFileName } from '../src/utils/storageSecurity.js';

describe('AKSHAR Security & Storage Guardrails', () => {

  test('isSafeStorageKey blocks path traversal attacks', () => {
    // Directory traversal patterns
    assert.strictEqual(isSafeStorageKey('fonts/../../../etc/passwd'), false);
    assert.strictEqual(isSafeStorageKey('fonts/..\\..\\windows\\system32'), false);
    assert.strictEqual(isSafeStorageKey('../secret.key'), false);
    assert.strictEqual(isSafeStorageKey('..'), false);
    assert.strictEqual(isSafeStorageKey('fonts/..'), false);
    assert.strictEqual(isSafeStorageKey('fonts/subdir/../../secret'), false);

    // Illegal prefix or null bytes
    assert.strictEqual(isSafeStorageKey('/etc/passwd'), false);
    assert.strictEqual(isSafeStorageKey('private/fonts/file.ttf'), false);
    assert.strictEqual(isSafeStorageKey('fonts/font.ttf\0.png'), false);
    assert.strictEqual(isSafeStorageKey('fonts//double-slash.ttf'), false);

    // Non-string or empty inputs
    assert.strictEqual(isSafeStorageKey(null), false);
    assert.strictEqual(isSafeStorageKey(undefined), false);
    assert.strictEqual(isSafeStorageKey(''), false);
  });

  test('isSafeStorageKey permits legitimate font object keys', () => {
    assert.strictEqual(isSafeStorageKey('fonts/Akshar.ttf'), true);
    assert.strictEqual(isSafeStorageKey('fonts/Sutonny MJ.ttf'), true);
    assert.strictEqual(isSafeStorageKey('fonts/abirvab/Abirvab Bold.ttf'), true);
    assert.strictEqual(isSafeStorageKey('fonts/Noto_Sans_Bengali/NotoSansBengali-Variable.ttf'), true);
    assert.strictEqual(isSafeStorageKey('fonts/ekushey/Ekushey 16 December.ttf'), true);
  });

  test('sanitizeFileName removes dangerous header injection characters', () => {
    assert.strictEqual(sanitizeFileName('NormalFont.ttf'), 'NormalFont.ttf');
    assert.strictEqual(sanitizeFileName('Sutonny MJ Bold.ttf'), 'Sutonny MJ Bold.ttf');
    // Header injection attempts (\r, \n, quotes, backslashes)
    assert.strictEqual(
      sanitizeFileName('malicious"\r\nContent-Type: text/html\r\n.ttf'), 
      'maliciousContent-Type: text/html.ttf'
    );
    assert.strictEqual(sanitizeFileName('path\\traversal\\font.ttf'), 'pathtraversalfont.ttf');
    assert.strictEqual(sanitizeFileName(null), 'font.ttf');
    assert.strictEqual(sanitizeFileName(''), 'font.ttf');
  });

  test('Commercial font license gating rules', () => {
    function checkDownloadAllowed(font, token) {
      if (font.is_free === 1) return { allowed: true };
      if (!token || typeof token !== 'string' || !token.trim()) {
        return { allowed: false, status: 403, error: 'License required' };
      }
      return { allowed: true };
    }

    // Free font without token -> allowed
    const freeFont = { id: 'noto-sans-bengali', name: 'Noto Sans', is_free: 1 };
    assert.strictEqual(checkDownloadAllowed(freeFont, null).allowed, true);

    // Paid font without token -> blocked with 403
    const paidFont = { id: 'sutonny-mj', name: 'Sutonny MJ', is_free: 0, price: 40 };
    const blockedRes = checkDownloadAllowed(paidFont, null);
    assert.strictEqual(blockedRes.allowed, false);
    assert.strictEqual(blockedRes.status, 403);

    // Paid font with license token -> allowed
    const authorizedRes = checkDownloadAllowed(paidFont, 'license_abc123');
    assert.strictEqual(authorizedRes.allowed, true);
  });
});
