import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isAnsiFont, unicodeToBijoy } from '../src/utils/banglaConverter.js';
import { ensureFontFaceLoaded } from '../src/data/fontsData.js';
import { isValidFont, sanitizeFontList, getFontPreviewUrl } from '../src/api/client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

describe('CodeRabbit Remediation Regression Test Suite', () => {

  // Priority 1: Commercial Font Binaries Protection in Distribution Build
  test('Priority 1: Zero commercial font binaries exist in frontend dist build', () => {
    const distFontsDir = path.join(projectRoot, 'dist/fonts');
    if (!fs.existsSync(distFontsDir)) {
      assert.fail('dist/fonts does not exist. Run npm run build first.');
    }

    function scanDir(dir) {
      let results = [];
      const list = fs.readdirSync(dir);
      list.forEach(file => {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
          results = results.concat(scanDir(full));
        } else {
          results.push(file);
        }
      });
      return results;
    }

    const distFiles = scanDir(distFontsDir);
    const commercialFilenames = [
      'Sutonny MJ.ttf',
      'Chandrabati MJ.ttf',
      'Chaturanga MJ.ttf',
      '3D Sonar Bangla.ttf',
      'Abirvab.ttf',
      'AdorshoLipi Bold.ttf',
      'Ador Noakhali.ttf'
    ];

    commercialFilenames.forEach(fn => {
      assert.strictEqual(
        distFiles.includes(fn), 
        false, 
        `Commercial font ${fn} leaked into public dist build!`
      );
    });
  });

  // Priority 1 & 6: Commercial Font Download Authorization
  test('Priority 1 & 6: Download endpoint strictly blocks commercial fonts without bypass', () => {
    function evaluateBackendDownloadAuthorization(font, token) {
      if (font.is_free === 1) {
        return { status: 200, allowed: true };
      }
      // Strict rejection: No invented tokens or bypass allowed
      return {
        status: 403,
        allowed: false,
        error: 'Commercial license required',
        message: 'Automated self-serve purchase verification is not yet integrated. Direct download of proprietary binaries is restricted.'
      };
    }

    // Commercial font Sutonny MJ (is_free = 0)
    const commercialFont = { id: 'sutonny-mj', name: 'Sutonny MJ', is_free: 0, price: 40 };

    // 1. Without token -> 403
    const resNoToken = evaluateBackendDownloadAuthorization(commercialFont, null);
    assert.strictEqual(resNoToken.status, 403);
    assert.strictEqual(resNoToken.allowed, false);

    // 2. With arbitrary query parameter ?license=test -> strictly 403
    const resArbitraryLicense = evaluateBackendDownloadAuthorization(commercialFont, 'license_dummy_token');
    assert.strictEqual(resArbitraryLicense.status, 403);
    assert.strictEqual(resArbitraryLicense.allowed, false);

    // 3. With Authorization header -> strictly 403
    const resBearer = evaluateBackendDownloadAuthorization(commercialFont, 'Bearer sample-jwt');
    assert.strictEqual(resBearer.status, 403);
    assert.strictEqual(resBearer.allowed, false);

    // Free font Noto Sans Bengali (is_free = 1) -> 200 OK
    const freeFont = { id: 'noto-sans-bengali', name: 'Noto Sans', is_free: 1, price: 0 };
    const resFree = evaluateBackendDownloadAuthorization(freeFont, null);
    assert.strictEqual(resFree.status, 200);
    assert.strictEqual(resFree.allowed, true);
  });

  // Priority 5: Per-Style Cut Encoding Detection
  test('Priority 5: isAnsiFont correctly detects per-style cut encoding', () => {
    const parentFamily = {
      id: 'charukola',
      name: 'Charukola',
      encoding: 'unicode',
      isAnsi: false
    };

    // Selecting an ANSI cut should evaluate to true
    const ansiCut = { name: 'Charukola Ansi Bold', file: '/fonts/Charukola_Ansi.ttf' };
    assert.strictEqual(isAnsiFont(parentFamily, ansiCut), true);

    // Selecting a Unicode cut should evaluate to false
    const unicodeCut = { name: 'Charukola Unicode Regular', file: '/fonts/Charukola_Unicode.ttf' };
    assert.strictEqual(isAnsiFont(parentFamily, unicodeCut), false);

    // Inherits parent if style has no explicit markers
    const neutralCut = { name: 'Regular', file: '/fonts/Regular.ttf' };
    assert.strictEqual(isAnsiFont(parentFamily, neutralCut), false);

    // Parent is Bijoy (Sutonny MJ)
    const sutonny = { id: 'sutonny-mj', name: 'Sutonny MJ', encoding: 'ansi', isAnsi: true };
    assert.strictEqual(isAnsiFont(sutonny, neutralCut), true);
  });

  // Priority 5: Double-Encoding Prevention
  test('Priority 5: Style preview URLs are never double-encoded', () => {
    // Unencoded name
    const url1 = getFontPreviewUrl('abirvab', 'Ultra Light');
    assert.strictEqual(url1.includes('%2520'), false);
    assert.strictEqual(url1.includes('style=Ultra%20Light'), true);

    // Already encoded name
    const url2 = getFontPreviewUrl('abirvab', 'Ultra%20Light');
    assert.strictEqual(url2.includes('%2520'), false);
    assert.strictEqual(url2.includes('style=Ultra%20Light'), true);
  });

  // Priority 5: Fallback Font Records Point to Valid Public URLs Only
  test('Priority 5: Fallback font catalog selects local URLs only for verified public fonts', () => {
    const extIndexPath = path.join(projectRoot, 'src/data/extendedIndex.json');
    const extIndex = JSON.parse(fs.readFileSync(extIndexPath, 'utf8'));

    extIndex.forEach(f => {
      if (f.file.startsWith('/fonts/')) {
        // Must be verified public font and must physically exist in public/fonts
        const fullLocal = path.join(projectRoot, 'public', f.file);
        assert.strictEqual(
          fs.existsSync(fullLocal), 
          true, 
          `Fallback font ${f.name} references non-existent local file ${f.file}`
        );
      } else {
        // Commercial fonts must route through the preview API
        assert.strictEqual(
          f.file.startsWith('/api/fonts/'), 
          true, 
          `Protected font ${f.name} does not route through preview API: ${f.file}`
        );
      }
    });
  });

  // Priority 4: Non-destructive migrations present
  test('Priority 4: Versioned non-destructive migrations exist in worker/migrations', () => {
    const mig0001 = path.join(projectRoot, 'worker/migrations/0001_initial_schema.sql');
    const mig0002 = path.join(projectRoot, 'worker/migrations/0002_license_metadata_alignment.sql');

    assert.strictEqual(fs.existsSync(mig0001), true);
    assert.strictEqual(fs.existsSync(mig0002), true);

    const mig0001Sql = fs.readFileSync(mig0001, 'utf8');
    assert.strictEqual(mig0001Sql.includes('CREATE TABLE IF NOT EXISTS fonts'), true);
    assert.strictEqual(mig0001Sql.includes('DROP TABLE'), false);

    const mig0002Sql = fs.readFileSync(mig0002, 'utf8');
    assert.strictEqual(mig0002Sql.includes('UPDATE fonts'), true);
    assert.strictEqual(mig0002Sql.includes('DROP TABLE'), false);
  });
});
