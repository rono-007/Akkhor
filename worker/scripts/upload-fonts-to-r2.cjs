/**
 * AKSHAR — R2 Font Upload Script
 * 
 * Uploads all font files from public/fonts/ to Cloudflare R2 bucket.
 * Preserves the directory structure as R2 keys.
 * 
 * Usage: node worker/scripts/upload-fonts-to-r2.cjs
 * 
 * Prerequisites:
 *   1. Install wrangler: npm install -g wrangler
 *   2. Login: wrangler login
 *   3. Create bucket: wrangler r2 bucket create akshar-fonts
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '../../public/fonts');
const BUCKET_NAME = 'akshar-fonts';
const BATCH_SIZE = 20; // Concurrent uploads per batch

function getAllFontFiles(dir, baseDir = dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFontFiles(fullPath, baseDir));
    } else if (/\.(ttf|otf|woff|woff2)$/i.test(entry.name)) {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push({
        localPath: fullPath,
        r2Key: `fonts/${relativePath}`,
        fileName: entry.name,
        sizeKb: Math.round(fs.statSync(fullPath).size / 1024),
      });
    }
  }
  return results;
}

async function uploadBatch(files) {
  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    console.log(`\nUploading batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(files.length / BATCH_SIZE)}...`);

    for (const file of batch) {
      try {
        const cmd = `wrangler r2 object put "${BUCKET_NAME}/${file.r2Key}" --file="${file.localPath}" --content-type="${file.fileName.endsWith('.otf') ? 'font/otf' : 'font/ttf'}"`;
        execSync(cmd, { stdio: 'pipe', timeout: 30000 });
        uploaded++;
        process.stdout.write(`  ✓ ${file.r2Key} (${file.sizeKb}KB)\n`);
      } catch (err) {
        failed++;
        console.error(`  ✗ FAILED: ${file.r2Key} - ${err.message}`);
      }
    }
  }

  return { uploaded, failed };
}

async function main() {
  console.log('AKSHAR — R2 Font Upload');
  console.log('=======================\n');

  const files = getAllFontFiles(FONTS_DIR);
  console.log(`Found ${files.length} font files in ${FONTS_DIR}`);

  const totalSizeMb = files.reduce((acc, f) => acc + f.sizeKb, 0) / 1024;
  console.log(`Total size: ${totalSizeMb.toFixed(1)} MB`);
  console.log(`R2 bucket: ${BUCKET_NAME}`);
  console.log('');

  const { uploaded, failed } = await uploadBatch(files);

  console.log('\n=======================');
  console.log(`Upload complete: ${uploaded} succeeded, ${failed} failed`);
  console.log(`R2 storage used: ~${totalSizeMb.toFixed(1)} MB of 10 GB free tier`);
}

main().catch(console.error);
