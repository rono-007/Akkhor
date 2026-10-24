const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const extIndexPath = path.join(projectRoot, 'src/data/extendedIndex.json');
const extIndex = JSON.parse(fs.readFileSync(extIndexPath, 'utf8'));

const publicFontsDir = path.join(projectRoot, 'public/fonts');
const protectedStorageDir = path.join(projectRoot, 'storage/commercial_fonts');

fs.mkdirSync(protectedStorageDir, { recursive: true });

// Verified Public Open Source criteria
const verifiedPublicPatterns = [
  /^noto/i,
  /^atma/i,
  /^baloo/i,
  /^nikosh/i,
  /^mukti/i,
  /^ekushey/i,
  /^hind/i
];

function isVerifiedPublic(font) {
  const name = font.name || '';
  const file = font.file || font.fileName || '';
  return verifiedPublicPatterns.some(p => p.test(name) || p.test(file));
}

// Conflict overrides table
const conflictOverrides = {
  // Verified Open Source
  'Noto Sans Bengali': { isFree: true, price: 0, license: 'SIL Open Font License' },
  'font-479': { isFree: true, price: 0, license: 'SIL Open Font License' },
  'Hind Siliguri': { isFree: true, price: 0, license: 'SIL Open Font License' },
  'font-298': { isFree: true, price: 0, license: 'SIL Open Font License' },
  
  // Commercial / Proprietary Bijoy & Studio Typefaces
  'Sutonny MJ': { isFree: false, price: 40, license: 'Commercial Bijoy License' },
  'font-660': { isFree: false, price: 40, license: 'Commercial Bijoy License' },
  'Chandrabati MJ': { isFree: false, price: 32, license: 'Commercial License' },
  'font-123': { isFree: false, price: 32, license: 'Commercial License' },
  'Chaturanga MJ': { isFree: false, price: 27, license: 'Commercial License' },
  'font-180': { isFree: false, price: 27, license: 'Commercial License' },
  '3D Sonar Bangla': { isFree: false, price: 26, license: 'Commercial License' },
  'font-0': { isFree: false, price: 26, license: 'Commercial License' },
  'Boshonto Light': { isFree: false, price: 30, license: 'Commercial License' },
  'font-111': { isFree: false, price: 30, license: 'Commercial License' },
  'Niladri Nobanno': { isFree: false, price: 34, license: 'Commercial License' },
  'font-459': { isFree: false, price: 34, license: 'Commercial License' },
  'Abirvab': { isFree: false, price: 35, license: 'Commercial License' },
  'font-6': { isFree: false, price: 35, license: 'Commercial License' },
  'Ador Noakhali': { isFree: false, price: 20, license: 'Commercial License' },
  'font-18': { isFree: false, price: 20, license: 'Commercial License' }
};

// 1. Update extendedIndex.json
let updatedCount = 0;
extIndex.forEach(item => {
  // Apply conflict override if present
  if (conflictOverrides[item.name]) {
    Object.assign(item, conflictOverrides[item.name]);
    updatedCount++;
  } else if (conflictOverrides[item.id]) {
    Object.assign(item, conflictOverrides[item.id]);
    updatedCount++;
  }

  const isPublic = isVerifiedPublic(item);
  if (!isPublic) {
    // Priority 5 Item 4: Fallback font records select valid local URLs only for assets allowed to be public
    // Commercial fonts route through the backend preview API
    item.file = `/api/fonts/${item.id}/preview`;
  }
});

fs.writeFileSync(extIndexPath, JSON.stringify(extIndex, null, 2), 'utf8');
console.log(`Updated extendedIndex.json with ${updatedCount} conflict overrides and safe fallback URLs.`);

// 2. Identify files in public/fonts and move commercial ones to storage/commercial_fonts
function scanDir(dir, baseRel = '') {
  let files = [];
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const full = path.join(dir, item);
    const rel = baseRel ? `${baseRel}/${item}` : item;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files = files.concat(scanDir(full, rel));
    } else {
      files.push({ full, rel, name: item });
    }
  });
  return files;
}

const allPublicFiles = scanDir(publicFontsDir);
console.log(`Found ${allPublicFiles.length} files in public/fonts/`);

let preservedPublic = 0;
let movedCommercial = 0;

allPublicFiles.forEach(fileInfo => {
  const isPublic = verifiedPublicPatterns.some(p => p.test(fileInfo.name) || p.test(fileInfo.rel));
  if (isPublic) {
    preservedPublic++;
  } else {
    // Move to protected storage
    const targetPath = path.join(protectedStorageDir, fileInfo.rel);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.renameSync(fileInfo.full, targetPath);
    movedCommercial++;
  }
});

console.log(`Preserved ${preservedPublic} legitimate public font files in public/fonts/`);
console.log(`Moved ${movedCommercial} commercial font files to protected storage/commercial_fonts/`);

// Remove empty directories in public/fonts
function cleanEmptyDirs(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      cleanEmptyDirs(full);
      if (fs.readdirSync(full).length === 0) {
        fs.rmdirSync(full);
      }
    }
  });
}
cleanEmptyDirs(publicFontsDir);
console.log('Cleaned empty directories in public/fonts/');
