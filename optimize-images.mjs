// Script tối ưu ảnh trong public/g3tech, lưu file .avif vào public/g3tech-otm, giữ nguyên ảnh gốc
// Bỏ qua ảnh đã tối ưu (nếu file .avif đã tồn tại)
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const G3TECH_DIR = path.join(__dirname, 'public', 'g3tech');
const G3TECH_OTM_DIR = path.join(__dirname, 'public', 'g3tech-otm');

function getAllImageFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllImageFiles(filePath));
    } else if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
      results.push(filePath);
    }
  });
  return results;
}

function getOtmPath(originalPath) {
  // Lấy path tương đối từ G3TECH_DIR
  const relPath = path.relative(G3TECH_DIR, originalPath);
  // Đổi đuôi sang .avif
  const avifRelPath = relPath.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
  return path.join(G3TECH_OTM_DIR, avifRelPath);
}

async function convertToAvifAndSave(filePath) {
  try {
    const avifPath = getOtmPath(filePath);
    if (fs.existsSync(avifPath)) {
      console.log('Skip (already optimized):', avifPath);
      return;
    }
    fs.mkdirSync(path.dirname(avifPath), { recursive: true });
    await sharp(filePath).avif({ quality: 50 }).toFile(avifPath);
    console.log('Optimized', filePath, '->', avifPath);
  } catch (err) {
    console.error('Error converting', filePath, err);
  }
}

async function main() {
  const files = getAllImageFiles(G3TECH_DIR);
  for (const file of files) {
    await convertToAvifAndSave(file);
  }
  console.log('All images in public/g3tech have been optimized to AVIF in public/g3tech-otm!');
}

main();
