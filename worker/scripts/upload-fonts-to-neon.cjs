/**
 * AKSHAR — Neon S3 Font Batch Uploader
 * 
 * Uploads all font files from public/fonts/ to Neon Object Storage.
 * Keys match the exact r2_key column in Cloudflare D1.
 */

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

const ENDPOINT = process.env.AWS_ENDPOINT_URL_S3 || "https://br-small-cloud-b4ofouo5.storage.c-6.us-east-2.aws.neon.tech";
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "nak_live_3fe1575ecef44d0884d266f8aae28ff4";
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "nsk_live_8bf4236b3fc37eb8d2170f2908656d860ab141e1586b5c4fad930ea948ece0c0";
const REGION = process.env.AWS_REGION || "us-east-2";
const BUCKET = process.env.NEON_STORAGE_BUCKET || "akshar-fonts";

const FONTS_DIR = path.join(__dirname, '../../public/fonts');
const CONCURRENCY = 10;

const s3 = new S3Client({
  endpoint: ENDPOINT,
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

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
        key: `fonts/${relativePath}`,
        fileName: entry.name,
        sizeKb: Math.round(fs.statSync(fullPath).size / 1024),
      });
    }
  }
  return results;
}

async function uploadFile(file) {
  const ext = file.fileName.toLowerCase().split('.').pop();
  const contentType = ext === 'otf' ? 'font/otf' : (ext === 'woff2' ? 'font/woff2' : 'font/ttf');
  const buffer = fs.readFileSync(file.localPath);

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: file.key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

async function main() {
  console.log('AKSHAR — Neon Storage Font Batch Uploader');
  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Bucket:   ${BUCKET}`);
  console.log('===========================================\n');

  const files = getAllFontFiles(FONTS_DIR);
  console.log(`Found ${files.length} font files in ${FONTS_DIR}`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  const startTime = Date.now();

  // Run in chunks with concurrency
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const chunk = files.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (file) => {
        try {
          await uploadFile(file);
          uploaded++;
        } catch (err) {
          failed++;
          console.error(`Failed to upload ${file.key}:`, err.message);
        }
      })
    );

    const progress = Math.min(100, Math.round(((i + chunk.length) / files.length) * 100));
    process.stdout.write(`\rProgress: ${uploaded + failed}/${files.length} (${progress}%) - Uploaded: ${uploaded}, Failed: ${failed}`);
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\nCompleted in ${durationSec}s! Uploaded: ${uploaded}, Failed: ${failed}`);
}

main().catch(console.error);
