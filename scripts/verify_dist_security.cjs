const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(file);
    }
  });
  return results;
}

const distFiles = getFiles(path.join(__dirname, '../dist/fonts'));
console.log(`Total files in dist/fonts/: ${distFiles.length}`);

const commercialCheck = [
  'Sutonny MJ.ttf',
  'Chandrabati MJ.ttf',
  'Chaturanga MJ.ttf',
  '3D Sonar Bangla.ttf',
  'Abirvab.ttf',
  'AdorshoLipi Bold.ttf',
  'Ador Noakhali.ttf'
];

let leakCount = 0;
commercialCheck.forEach(fn => {
  const found = distFiles.includes(fn);
  if (found) leakCount++;
  console.log(`Checking ${fn}: ${found ? 'LEAKED IN DIST!' : 'SECURED (not in dist)'}`);
});

console.log(`\nVerification result: ${leakCount === 0 ? 'ALL COMMERCIAL ASSETS SECURED!' : 'LEAKS DETECTED!'}`);
