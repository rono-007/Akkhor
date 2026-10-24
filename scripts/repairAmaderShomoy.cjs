const fs = require('fs');
const path = require('path');

function calcTableChecksum(buffer, offset, length) {
  let sum = 0;
  const nlongs = Math.floor((length + 3) / 4);
  for (let i = 0; i < nlongs; i++) {
    const pos = offset + i * 4;
    let val = 0;
    if (pos + 4 <= buffer.length) {
      val = buffer.readUInt32BE(pos);
    } else {
      for (let b = 0; b < 4; b++) {
        val = (val << 8) | ((pos + b < buffer.length) ? buffer[pos + b] : 0);
      }
      val = val >>> 0;
    }
    sum = (sum + val) >>> 0;
  }
  return sum;
}

function repairFontFile(filePath) {
  const buf = fs.readFileSync(filePath);
  const numTables = buf.readUInt16BE(4);
  
  // 1. Read existing valid tables (filter out length === 0)
  const tables = [];
  let dirOffset = 12;
  for (let i = 0; i < numTables; i++) {
    const tag = buf.toString('utf8', dirOffset, dirOffset + 4);
    const toffset = buf.readUInt32BE(dirOffset + 8);
    const tlength = buf.readUInt32BE(dirOffset + 12);
    dirOffset += 16;
    
    if (tlength === 0) {
      console.log(`[${path.basename(filePath)}] Dropping 0-length table '${tag}'`);
      continue;
    }
    
    const tableData = Buffer.alloc(tlength);
    buf.copy(tableData, 0, toffset, toffset + tlength);
    tables.push({ tag, data: tableData, length: tlength });
  }
  
  // 2. Strict binary ASCII / uint32 tag sorting (mandatory in OpenType & OTS)
  tables.sort((a, b) => {
    if (a.tag < b.tag) return -1;
    if (a.tag > b.tag) return 1;
    return 0;
  });
  
  // 3. Calculate searchRange, entrySelector, rangeShift
  const count = tables.length;
  let maxPowerOf2 = 1;
  let log2 = 0;
  while ((maxPowerOf2 * 2) <= count) {
    maxPowerOf2 *= 2;
    log2++;
  }
  const searchRange = maxPowerOf2 * 16;
  const entrySelector = log2;
  const rangeShift = count * 16 - searchRange;
  
  // 4. Calculate table offsets with strict 4-byte alignment
  const headerSize = 12 + count * 16;
  let currentOffset = headerSize;
  
  for (const table of tables) {
    while (currentOffset % 4 !== 0) currentOffset++;
    table.offset = currentOffset;
    currentOffset += table.length;
  }
  while (currentOffset % 4 !== 0) currentOffset++;
  const totalFileSize = currentOffset;
  
  // 5. Build output buffer
  const out = Buffer.alloc(totalFileSize, 0);
  
  // Write sfnt header
  buf.copy(out, 0, 0, 4); // copy original sfnt version
  out.writeUInt16BE(count, 4);
  out.writeUInt16BE(searchRange, 6);
  out.writeUInt16BE(entrySelector, 8);
  out.writeUInt16BE(rangeShift, 10);
  
  // Copy table data into out buffer
  for (const table of tables) {
    table.data.copy(out, table.offset);
  }
  
  // If 'head' table exists, zero out checkSumAdjustment (at head.offset + 8) before computing checksums
  const headTable = tables.find(t => t.tag === 'head');
  if (headTable) {
    out.writeUInt32BE(0, headTable.offset + 8);
  }
  
  // Write directory entries and compute table checksums
  let entryPos = 12;
  for (const table of tables) {
    const checksum = calcTableChecksum(out, table.offset, table.length);
    out.write(table.tag, entryPos, 4, 'ascii');
    out.writeUInt32BE(checksum, entryPos + 4);
    out.writeUInt32BE(table.offset, entryPos + 8);
    out.writeUInt32BE(table.length, entryPos + 12);
    entryPos += 16;
  }
  
  // Finally, compute head.checkSumAdjustment
  if (headTable) {
    let fileSum = 0;
    const nlongs = Math.floor(totalFileSize / 4);
    for (let i = 0; i < nlongs; i++) {
      fileSum = (fileSum + out.readUInt32BE(i * 4)) >>> 0;
    }
    const checkSumAdjustment = (0xB1B0AFBA - fileSum) >>> 0;
    out.writeUInt32BE(checkSumAdjustment, headTable.offset + 8);
  }
  
  fs.writeFileSync(filePath, out);
  console.log(`Repaired ${path.basename(filePath)} -> ${count} tables, ${totalFileSize} bytes`);
}

const targetFiles = [
  'public/fonts/amader_shomoy/Amader Shomoy Bold Italic.ttf',
  'public/fonts/amader_shomoy/Amader Shomoy Bold.ttf',
  'public/fonts/amader_shomoy/Amader Shomoy Italic.ttf',
  'public/fonts/amader_shomoy/Amader Shomoy.ttf',
  'public/fonts/Akaash.ttf',
  'public/fonts/akaashnormal.ttf'
];

for (const f of targetFiles) {
  if (fs.existsSync(f)) {
    repairFontFile(path.resolve(f));
  }
}
