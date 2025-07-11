// Script tối ưu ảnh trong dist/g3tech, thay thế ảnh gốc bằng .avif sau khi build
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const G3TECH_DIST_DIR = path.join(__dirname, 'dist', 'g3tech');

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

async function convertToAvifAndReplace(filePath) {
  try {
    const avifPath = filePath.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
    await sharp(filePath).avif({ quality: 50 }).toFile(avifPath);
    fs.unlinkSync(filePath); // Xóa file gốc
    console.log('Replaced', filePath, 'with', avifPath);
  } catch (err) {
    console.error('Error converting', filePath, err);
  }
}

async function main() {
  const files = getAllImageFiles(G3TECH_DIST_DIR);
  for (const file of files) {
    await convertToAvifAndReplace(file);
  }
  console.log('All images in dist/g3tech have been replaced with AVIF!');
}

main();
