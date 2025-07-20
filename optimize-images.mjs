// Script tối ưu ảnh trong public/g3tech, lưu file .avif vào public/g3tech-otm, giữ nguyên ảnh gốc
// Bỏ qua ảnh đã tối ưu (nếu file .avif đã tồn tại)
// Tạo thêm ảnh thumb 80x80px cho gallery thumbnails
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

function getOtmPath(originalPath, isThumb = false, format = 'avif') {
  // Lấy path tương đối từ G3TECH_DIR
  const relPath = path.relative(G3TECH_DIR, originalPath);
  // Đổi đuôi sang format và thêm suffix _thumb nếu cần
  const baseName = path.basename(relPath, path.extname(relPath));
  const dirName = path.dirname(relPath);
  const extension = format === 'jpeg' ? 'jpg' : format;
  const fileName = isThumb ? `${baseName}_thumb.${extension}` : `${baseName}.${extension}`;
  return path.join(G3TECH_OTM_DIR, dirName, fileName);
}

async function convertToAvifAndSave(filePath) {
  try {
    const avifPath = getOtmPath(filePath, false, 'avif');
    const thumbPath = getOtmPath(filePath, true, 'avif');
    const jpegPath = getOtmPath(filePath, false, 'jpeg');
    
    // Tạo thư mục nếu chưa tồn tại
    fs.mkdirSync(path.dirname(avifPath), { recursive: true });
    
    // Tạo ảnh AVIF chính nếu chưa tồn tại
    if (!fs.existsSync(avifPath)) {
      await sharp(filePath).avif({ quality: 50 }).toFile(avifPath);
      console.log('Optimized AVIF:', filePath, '->', avifPath);
    } else {
      console.log('Skip AVIF main (already optimized):', avifPath);
    }
    
    // Tạo ảnh JPEG chính nếu chưa tồn tại (cho product feed)
    if (!fs.existsSync(jpegPath)) {
      await sharp(filePath)
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(jpegPath);
      console.log('Optimized JPEG:', filePath, '->', jpegPath);
    } else {
      console.log('Skip JPEG main (already optimized):', jpegPath);
    }
    
    // Tạo ảnh thumb AVIF 80x80px nếu chưa tồn tại
    if (!fs.existsSync(thumbPath)) {
      await sharp(filePath)
        .resize(80, 80, { 
          fit: 'cover',
          position: 'center'
        })
        .avif({ quality: 60 })
        .toFile(thumbPath);
      console.log('Created AVIF thumb:', filePath, '->', thumbPath);
    } else {
      console.log('Skip AVIF thumb (already exists):', thumbPath);
    }
    
  } catch (err) {
    console.error('Error converting', filePath, err);
  }
}

async function main() {
  const files = getAllImageFiles(G3TECH_DIR);
  console.log(`Found ${files.length} image files to process...`);
  
  for (const file of files) {
    await convertToAvifAndSave(file);
  }
  
  console.log('All images in public/g3tech have been optimized to AVIF (main + thumb) and JPEG (main) versions in public/g3tech-otm!');
}

main();
