import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgPath = resolve(root, 'public/favicon.svg');
const svgBuf = readFileSync(svgPath);

const sizes = [
  { file: 'public/favicon-16x16.png',   size: 16,  bg: '#050505' },
  { file: 'public/favicon-32x32.png',   size: 32,  bg: '#050505' },
  { file: 'public/apple-touch-icon.png', size: 180, bg: '#050505' },
  { file: 'public/android-chrome-192x192.png', size: 192, bg: '#050505' },
  { file: 'public/android-chrome-512x512.png', size: 512, bg: '#050505' },
];

for (const { file, size, bg } of sizes) {
  const out = await sharp(svgBuf)
    .resize(size, size, { fit: 'contain', background: bg })
    .flatten({ background: bg })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  writeFileSync(resolve(root, file), out);
  console.log(`✓ ${file}  (${size}x${size}, ${out.length} bytes)`);
}

// favicon.ico: bundle 16 + 32 as ICO using pure JS buffer
console.log('Building favicon.ico (16+32)...');
const i16 = await sharp(svgBuf).resize(16, 16, { fit: 'contain', background: '#050505' }).flatten({ background: '#050505' }).png().toBuffer();
const i32 = await sharp(svgBuf).resize(32, 32, { fit: 'contain', background: '#050505' }).flatten({ background: '#050505' }).png().toBuffer();

function pngToIcoEntry(png, w, h) {
  // Extract DIB info from PNG IHDR for the AND mask calc
  // ICO format: each entry = 16-byte ICONDIRENTRY + BMP/PNG data bytes
  // We'll store the PNG directly (modern ICO supports PNG inside)
  return { w, h, data: png, isPng: true };
}

const entries = [pngToIcoEntry(i16, 16, 16), pngToIcoEntry(i32, 32, 32)];
const ICONDIR_SIZE = 6;
const ICONDIRENTRY_SIZE = 16;
const totalSize = ICONDIR_SIZE + entries.length * ICONDIRENTRY_SIZE + entries.reduce((s, e) => s + e.data.length, 0);
const buf = Buffer.alloc(totalSize);
let off = 0;
// ICONDIR: idReserved(2) + idType(2=1) + idCount(2)
buf.writeUInt16LE(0, off); off += 2;
buf.writeUInt16LE(1, off); off += 2;
buf.writeUInt16LE(entries.length, off); off += 2;
// ICONDIRENTRY + data
let dataOff = ICONDIR_SIZE + entries.length * ICONDIRENTRY_SIZE;
for (const e of entries) {
  buf.writeUInt8(e.w === 256 ? 0 : e.w, off); off += 1;
  buf.writeUInt8(e.h === 256 ? 0 : e.h, off); off += 1;
  buf.writeUInt8(0, off); off += 1; // color count
  buf.writeUInt8(0, off); off += 1; // reserved
  buf.writeUInt16LE(1, off); off += 2; // color planes
  buf.writeUInt16LE(32, off); off += 2; // bits per pixel
  buf.writeUInt32LE(e.data.length, off); off += 4; // bytes in res
  buf.writeUInt32LE(dataOff, off); off += 4;
  e.data.copy(buf, dataOff);
  dataOff += e.data.length;
}
writeFileSync(resolve(root, 'public/favicon.ico'), buf);
console.log(`✓ public/favicon.ico  (${buf.length} bytes, PNG-packed)`);
console.log('All favicons generated.');
