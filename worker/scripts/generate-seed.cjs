/**
 * AKSHAR — D1 Seed Generator
 * 
 * Reads extendedIndex.json (719 extended fonts) and fontsData.js (FEATURED_FONTS)
 * and generates a seed.sql file for Cloudflare D1.
 * 
 * Run with: node worker/scripts/generate-seed.cjs
 */

const fs = require('fs');
const path = require('path');

// Read extended index
const extendedPath = path.join(__dirname, '../../src/data/extendedIndex.json');
const extendedFonts = JSON.parse(fs.readFileSync(extendedPath, 'utf8'));

// Parse FEATURED_FONTS from fontsData.js (extract the array manually since it's ESM)
const fontsDataPath = path.join(__dirname, '../../src/data/fontsData.js');
const fontsDataContent = fs.readFileSync(fontsDataPath, 'utf8');

// Extract FEATURED_FONTS array using regex
const featuredMatch = fontsDataContent.match(/export const FEATURED_FONTS\s*=\s*\[/);
let featuredFonts = [];

if (featuredMatch) {
  // Find the array boundaries
  const startIdx = featuredMatch.index + 'export const FEATURED_FONTS = '.length;
  let bracketCount = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < fontsDataContent.length; i++) {
    if (fontsDataContent[i] === '[') bracketCount++;
    if (fontsDataContent[i] === ']') bracketCount--;
    if (bracketCount === 0) {
      endIdx = i + 1;
      break;
    }
  }
  const arrayStr = fontsDataContent.substring(startIdx, endIdx);
  try {
    // Use Function constructor to evaluate the JS array (safe since it's our own data)
    featuredFonts = new Function(`return ${arrayStr}`)();
  } catch (e) {
    console.error('Failed to parse FEATURED_FONTS:', e.message);
    console.log('Continuing with extended fonts only...');
  }
}

console.log(`Found ${extendedFonts.length} extended fonts`);
console.log(`Found ${featuredFonts.length} featured fonts`);

// Build a map of featured fonts by matching name
const featuredMap = new Map();
featuredFonts.forEach(f => {
  featuredMap.set(f.name.toLowerCase(), f);
  // Also map by id
  featuredMap.set(f.id, f);
});

// SQL escaping
function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? '1' : '0';
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Convert a file path like "/fonts/Akshar.ttf" to an R2 key like "fonts/Akshar.ttf"
function toR2Key(filePath) {
  return filePath.replace(/^\//, '');
}

// Generate SQL
const lines = [];
lines.push('-- AKSHAR D1 Seed Data');
lines.push('-- Auto-generated from extendedIndex.json + fontsData.js');
lines.push(`-- Generated at: ${new Date().toISOString()}`);
lines.push('-- Total fonts: ' + extendedFonts.length);
lines.push('');
lines.push('BEGIN TRANSACTION;');
lines.push('');

// Track IDs we've already inserted (to avoid duplicates between extended and featured)
const insertedIds = new Set();

// First, insert FEATURED_FONTS (they have richer metadata)
featuredFonts.forEach(f => {
  // Generate a stable ID matching the extended index if possible
  const matchingExtended = extendedFonts.find(e =>
    e.name.toLowerCase() === f.name.toLowerCase() ||
    e.id === f.id
  );

  const id = f.id;
  const fileName = f.styles?.[0]?.file?.split('/').pop() || `${f.name}.ttf`;
  const filePath = f.styles?.[0]?.file || f.file || `/fonts/${fileName}`;
  const r2Key = toR2Key(filePath);
  const sizeKb = matchingExtended?.sizeKb || 0;
  const encoding = matchingExtended?.encoding || 'unicode';
  const isAnsi = matchingExtended?.isAnsi || encoding === 'ansi' ? 1 : 0;

  lines.push(`INSERT INTO fonts (id, name, file_name, r2_key, category, size_kb, is_free, price, encoding, is_ansi, designer, foundry, year, license, description, script, rating, downloads, glyph_count, contrast, width, x_height, tags, sample_headline, sample_paragraph, suggested_pairing) VALUES (`);
  lines.push(`  ${esc(id)}, ${esc(f.name)}, ${esc(fileName)}, ${esc(r2Key)}, ${esc(f.category)}, ${sizeKb}, ${f.isFree ? 1 : 0}, ${f.price || 0}, ${esc(encoding)}, ${isAnsi},`);
  lines.push(`  ${esc(f.designer || null)}, ${esc(f.foundry || null)}, ${f.year || 'NULL'}, ${esc(f.license || null)}, ${esc(f.description || null)}, ${esc(f.script || 'Bengali')},`);
  lines.push(`  ${f.rating || 'NULL'}, ${f.downloads || 0}, ${f.glyphCount || 'NULL'}, ${esc(f.contrast || null)}, ${esc(f.width || null)}, ${esc(f.xHeight || null)},`);
  lines.push(`  ${esc(f.tags ? JSON.stringify(f.tags) : null)}, ${esc(f.sampleHeadline || null)}, ${esc(f.sampleParagraph || null)}, ${esc(f.suggestedPairing || null)}`);
  lines.push(`);`);
  lines.push('');

  insertedIds.add(id);

  // Insert styles for featured fonts
  if (f.styles && f.styles.length > 0) {
    f.styles.forEach(s => {
      const styleFileName = s.file?.split('/').pop() || '';
      const styleR2Key = toR2Key(s.file || '');
      lines.push(`INSERT INTO font_styles (font_id, name, weight, style, file_name, r2_key, size_kb) VALUES (`);
      lines.push(`  ${esc(id)}, ${esc(s.name)}, ${esc(s.weight || '400')}, ${esc(s.style || 'normal')}, ${esc(styleFileName)}, ${esc(styleR2Key)}, 0`);
      lines.push(`);`);
    });
    lines.push('');
  }
});

// Then insert extended fonts that aren't already covered by featured
extendedFonts.forEach(ef => {
  if (insertedIds.has(ef.id)) return;

  const fileName = ef.fileName || ef.file?.split('/').pop() || '';
  const filePath = ef.file || `/fonts/${fileName}`;
  const r2Key = toR2Key(filePath);

  lines.push(`INSERT INTO fonts (id, name, file_name, r2_key, category, size_kb, is_free, price, encoding, is_ansi) VALUES (`);
  lines.push(`  ${esc(ef.id)}, ${esc(ef.name)}, ${esc(fileName)}, ${esc(r2Key)}, ${esc(ef.category || 'Bengali')}, ${ef.sizeKb || 0}, ${ef.isFree ? 1 : 0}, ${ef.price || 0}, ${esc(ef.encoding || 'unicode')}, ${ef.isAnsi ? 1 : 0}`);
  lines.push(`);`);

  insertedIds.add(ef.id);
});

lines.push('');
lines.push('COMMIT;');

// Write seed.sql
const outputPath = path.join(__dirname, '../src/db/seed.sql');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');

console.log(`\nGenerated seed.sql with ${insertedIds.size} font records`);
console.log(`Output: ${outputPath}`);
