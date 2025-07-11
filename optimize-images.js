// Script tối ưu ảnh trong thư mục public bằng sharp
// Optimize images in public folder using sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Định nghĩa các định dạng ảnh sẽ xử lý
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Thư mục gốc chứa ảnh
const PUBLIC_DIR = path.join(__dirname, 'public');

// Hàm đệ quy lấy tất cả file ảnh trong thư mục
function getAllImageFiles(dir) {
  let results = [];
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

// Hàm tối ưu ảnh (nén, giữ nguyên định dạng, ghi đè file cũ)
async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  try {
    const buffer = fs.readFileSync(filePath);
    let pipeline = sharp(buffer).jpeg({ quality: 80 }).png({ quality: 80 }).webp({ quality: 80 });
    // Chỉ nén đúng định dạng gốc
    if (ext === '.jpg' || ext === '.jpeg') {
      await pipeline.jpeg({ quality: 80 }).toFile(filePath);
    } else if (ext === '.png') {
      await pipeline.png({ quality: 80 }).toFile(filePath);
    } else if (ext === '.webp') {
      await pipeline.webp({ quality: 80 }).toFile(filePath);
    }
    console.log('Optimized:', filePath);
  } catch (err) {
    console.error('Error optimizing', filePath, err);
  }
}

// Chạy tối ưu toàn bộ ảnh
async function main() {
  const files = getAllImageFiles(PUBLIC_DIR);
  for (const file of files) {
    await optimizeImage(file);
  }
  console.log('All images optimized!');
}

main();
