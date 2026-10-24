const fs = require('fs');
const path = require('path');

const extIndex = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/extendedIndex.json'), 'utf8'));

let extFree = 0;
let extPaid = 0;
extIndex.forEach(f => {
  if (f.isFree) extFree++;
  else extPaid++;
});
console.log(`extendedIndex -> Total: ${extIndex.length}, Free: ${extFree}, Paid: ${extPaid}`);

// Read FEATURED_FONTS from fontsData.js
const fontsDataRaw = fs.readFileSync(path.join(__dirname, '../src/data/fontsData.js'), 'utf8');
const featuredMatch = fontsDataRaw.match(/export const FEATURED_FONTS = (\[[\s\S]*?\]);/);
const featured = eval(featuredMatch[1]);

console.log(`\nFEATURED_FONTS -> Total: ${featured.length}`);

console.log('\n--- Comparing FEATURED_FONTS with extendedIndex ---');
let conflicts = [];
let matches = [];
let notInExt = [];

featured.forEach(feat => {
  const match = extIndex.find(e => 
    e.name.toLowerCase() === feat.name.toLowerCase() || 
    e.id === feat.id ||
    (feat.styles && feat.styles[0] && e.fileName && feat.styles[0].file.endsWith(e.fileName))
  );

  if (match) {
    const isConflict = feat.isFree !== match.isFree;
    const item = {
      name: feat.name,
      featuredId: feat.id,
      extId: match.id,
      featuredIsFree: feat.isFree,
      featuredLicense: feat.license,
      featuredPrice: feat.price,
      extIsFree: match.isFree,
      extPrice: match.price,
      fileName: match.fileName
    };
    if (isConflict) {
      conflicts.push(item);
    } else {
      matches.push(item);
    }
  } else {
    notInExt.push({
      name: feat.name,
      id: feat.id,
      isFree: feat.isFree,
      license: feat.license,
      styles: feat.styles
    });
  }
});

console.log(`Found ${conflicts.length} direct conflicts between FEATURED_FONTS and extendedIndex:`);
conflicts.forEach(c => {
  console.log(`- CONFLICT: "${c.name}" -> FEATURED has isFree=${c.featuredIsFree} ($${c.featuredPrice}, License: "${c.featuredLicense}"), but extendedIndex has isFree=${c.extIsFree} ($${c.extPrice}) [File: ${c.fileName}]`);
});

console.log(`\nFound ${matches.length} matches between FEATURED_FONTS and extendedIndex:`);
matches.forEach(m => {
  console.log(`- MATCH: "${m.name}" -> both say isFree=${m.featuredIsFree} (License: "${m.featuredLicense}")`);
});

console.log(`\nFound ${notInExt.length} FEATURED_FONTS not directly in extendedIndex:`);
notInExt.forEach(n => {
  console.log(`- NOT IN EXT: "${n.name}" (${n.id}) isFree=${n.isFree} (License: "${n.license}")`);
});

// Also check files in public/fonts
function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(path.relative(path.join(__dirname, '../public'), fullPath).replace(/\\/g, '/'));
    }
  });
  return results;
}

const allPublic = getFiles(path.join(__dirname, '../public/fonts'));
console.log(`\nTotal public font files in public/fonts/: ${allPublic.length}`);

// Check which public files belong to paid fonts in extendedIndex
let publicPaidFiles = [];
let publicFreeFiles = [];

allPublic.forEach(relPath => {
  const fileName = path.basename(relPath);
  const extItem = extIndex.find(e => e.fileName === fileName || e.file === '/' + relPath || e.file === '/fonts/' + fileName);
  if (extItem) {
    if (extItem.isFree) {
      publicFreeFiles.push({ file: relPath, font: extItem.name, price: extItem.price });
    } else {
      publicPaidFiles.push({ file: relPath, font: extItem.name, price: extItem.price });
    }
  }
});

console.log(`Public files mapped to extendedIndex: Free=${publicFreeFiles.length}, Paid=${publicPaidFiles.length}`);
console.log(`Sample paid files in public/ (first 10):`);
publicPaidFiles.slice(0, 10).forEach(p => console.log(`  - ${p.file} (${p.font}, $${p.price})`));

// Check duplicates in seed.sql
const seedPath = path.join(__dirname, '../worker/src/db/seed.sql');
if (fs.existsSync(seedPath)) {
  const seed = fs.readFileSync(seedPath, 'utf8');
  // Match INSERT INTO fonts
  const regex = /INSERT INTO fonts \([^)]+\) VALUES \(\s*([^;]+)\);/g;
  let match;
  const d1Fonts = [];
  while ((match = regex.exec(seed)) !== null) {
    const rawVals = match[1];
    // Simple CSV parser respecting quotes
    const tokens = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < rawVals.length; i++) {
      const c = rawVals[i];
      if (c === "'") {
        if (inQuote && rawVals[i + 1] === "'") {
          cur += "'";
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (c === ',' && !inQuote) {
        tokens.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    tokens.push(cur.trim());
    d1Fonts.push({
      id: tokens[0].replace(/^'|'$/g, ''),
      name: tokens[1].replace(/^'|'$/g, ''),
      fileName: tokens[2].replace(/^'|'$/g, ''),
      r2Key: tokens[3].replace(/^'|'$/g, ''),
      isFree: tokens[6],
      price: tokens[7]
    });
  }
  console.log(`\nTotal font inserts in seed.sql: ${d1Fonts.length}`);
  
  // Find duplicate file names or normalized names
  const byFile = new Map();
  const d1Duplicates = [];
  d1Fonts.forEach(f => {
    const key = f.fileName.toLowerCase();
    if (byFile.has(key)) {
      d1Duplicates.push({ original: byFile.get(key), duplicate: f });
    } else {
      byFile.set(key, f);
    }
  });

  console.log(`Duplicates in D1 seed: ${d1Duplicates.length}`);
  d1Duplicates.forEach(d => {
    const conflict = d.original.isFree !== d.duplicate.isFree;
    console.log(`- ${conflict ? 'CONFLICT' : 'MATCH'}: [${d.original.id}] "${d.original.name}" (isFree=${d.original.isFree}, price=$${d.original.price}) vs [${d.duplicate.id}] "${d.duplicate.name}" (isFree=${d.duplicate.isFree}, price=$${d.duplicate.price}) [file: ${d.original.fileName}]`);
  });
}
