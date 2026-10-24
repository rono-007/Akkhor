const fs = require('fs');
const path = require('path');

const fontsDataPath = path.join(__dirname, '../src/data/fontsData.js');
let content = fs.readFileSync(fontsDataPath, 'utf8');

// Verified public font IDs that have files in public/fonts
const verifiedPublicIds = new Set([
  'noto-sans-bengali',
  'noto-serif-bengali',
  'hind-siliguri',
  'atma',
  'baloo-da',
  'nikosh',
  'mukti',
  'ekushey-aloucik'
]);

// Extract FEATURED_FONTS array
const startTag = 'export const FEATURED_FONTS = [';
const startIdx = content.indexOf(startTag);
if (startIdx === -1) {
  console.error('Could not find start of FEATURED_FONTS');
  process.exit(1);
}

// Find matching closing bracket
let bracketCount = 0;
let endIdx = -1;
for (let i = startIdx + 'export const FEATURED_FONTS = '.length; i < content.length; i++) {
  if (content[i] === '[') bracketCount++;
  if (content[i] === ']') {
    bracketCount--;
    if (bracketCount === 0) {
      endIdx = i + 1;
      break;
    }
  }
}

if (endIdx === -1) {
  console.error('Could not find end of FEATURED_FONTS');
  process.exit(1);
}

const arrayCode = content.substring(startIdx + 'export const FEATURED_FONTS = '.length, endIdx);
const featured = eval(arrayCode);

featured.forEach(f => {
  if (!verifiedPublicIds.has(f.id)) {
    // Commercial font: route fallback styles to Worker preview API
    if (f.styles && Array.isArray(f.styles)) {
      f.styles.forEach(s => {
        s.file = `/api/fonts/${f.id}/preview?style=${encodeURIComponent(s.name)}`;
      });
    }
    if (f.file) {
      f.file = `/api/fonts/${f.id}/preview`;
    }
  }
});

const newArrayCode = JSON.stringify(featured, null, 2);
const newContent = content.substring(0, startIdx + 'export const FEATURED_FONTS = '.length) + 
  newArrayCode + 
  content.substring(endIdx);

fs.writeFileSync(fontsDataPath, newContent, 'utf8');
console.log('Successfully updated FEATURED_FONTS fallback style URLs to route through API.');
