/**
 * Build-time image optimization script
 * Processes all product images: resize, convert to WebP, generate multiple sizes
 * Run before build: npm run optimize-images
 */
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');
const PRODUCTS_DIR = path.join(__dirname, 'src/content/products');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');

// Image size configurations
const SIZES = {
  thumbnail: { width: 200, height: 200, suffix: '-200w' },
  small: { width: 400, height: 400, suffix: '-400w' },
  medium: { width: 800, height: 800, suffix: '-800w' },
  large: { width: 1200, height: 1200, suffix: '-1200w' },
};

const QUALITY = 80;

/**
 * Get all image paths from product JSON files
 */
async function getProductImagePaths() {
  const files = await fsPromises.readdir(PRODUCTS_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  const imagePaths = new Set();
  
  for (const file of jsonFiles) {
    const filePath = path.join(PRODUCTS_DIR, file);
    const content = await fsPromises.readFile(filePath, 'utf8');
    const product = JSON.parse(content);
    
    // Collect image_url
    if (product.image_url) {
      imagePaths.add(product.image_url);
    }
    
    // Collect gallery_array
    if (Array.isArray(product.gallery_array)) {
      product.gallery_array.forEach(url => imagePaths.add(url));
    }
  }
  
  return Array.from(imagePaths);
}

/**
 * Convert public path to absolute file path
 */
function publicPathToAbsolutePath(publicPath) {
  if (publicPath.startsWith('http://') || publicPath.startsWith('https://')) {
    return null; // External URL, skip
  }
  
  // Remove leading slash
  const relativePath = publicPath.replace(/^\//, '');
  return path.join(PUBLIC_DIR, relativePath);
}

/**
 * Generate optimized versions of an image
 */
async function optimizeImage(inputPath, outputBaseName) {
  const results = [];
  
  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const originalWidth = metadata.width || 800;
    const originalHeight = metadata.height || 600;
    
    // Generate each size
    for (const [sizeName, config] of Object.entries(SIZES)) {
      // Skip if original is smaller than target size
      if (originalWidth <= config.width && originalHeight <= config.height) {
        continue;
      }
      
      const outputPath = `${outputBaseName}${config.suffix}.webp`;
      
      await sharp(inputPath)
        .resize(config.width, config.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .webp({ 
          quality: QUALITY,
          effort: 6, // Higher effort = better compression
        })
        .toFile(outputPath);
      
      const stats = await fsPromises.stat(outputPath);
      results.push({
        path: outputPath.replace(PUBLIC_DIR, ''),
        width: config.width,
        size: stats.size,
      });
    }
    
    // Also create a WebP version of original size
    const originalWebpPath = `${outputBaseName}.webp`;
    await sharp(inputPath)
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(originalWebpPath);
    
    const originalStats = await fsPromises.stat(originalWebpPath);
    results.unshift({
      path: originalWebpPath.replace(PUBLIC_DIR, ''),
      width: originalWidth,
      size: originalStats.size,
    });
    
    return results;
  } catch (error) {
    console.error(`  ✗ Failed to optimize ${inputPath}:`, error.message);
    return [];
  }
}

/**
 * Process a single image: optimize and return srcset
 */
async function processImage(imagePath) {
  const absPath = publicPathToAbsolutePath(imagePath);
  
  if (!absPath) {
    return { original: imagePath, optimized: [] };
  }
  
  // Check if file exists
  try {
    await fsPromises.access(absPath);
  } catch {
    console.warn(`  ⚠️ File not found: ${absPath}`);
    return { original: imagePath, optimized: [] };
  }
  
  // Generate output path
  const ext = path.extname(imagePath);
  const baseName = path.basename(imagePath, ext);
  const dirName = path.dirname(imagePath);
  const outputBaseName = path.join(OPTIMIZED_DIR, dirName, baseName);
  
  // Ensure output directory exists
  await fsPromises.mkdir(path.dirname(outputBaseName), { recursive: true });
  
  // Check if already optimized
  const originalWebpPath = `${outputBaseName}.webp`;
  try {
    await fsPromises.access(originalWebpPath);
    // Already optimized, get sizes
    const files = await fsPromises.readdir(path.dirname(outputBaseName));
    const optimizedFiles = files.filter(f => f.startsWith(baseName) && f.endsWith('.webp'));
    
    const optimized = await Promise.all(
      optimizedFiles.map(async (file) => {
        const fullPath = path.join(path.dirname(outputBaseName), file);
        const stats = await fsPromises.stat(fullPath);
        const widthMatch = file.match(/-(\d+)w/);
        return {
          path: fullPath.replace(PUBLIC_DIR, ''),
          width: widthMatch ? parseInt(widthMatch[1]) : 800,
          size: stats.size,
        };
      })
    );
    
    return {
      original: imagePath,
      optimized: optimized.sort((a, b) => a.width - b.width),
    };
  } catch {
    // Not optimized yet, process it
  }
  
  console.log(`  🔄 Optimizing: ${imagePath}`);
  const optimized = await optimizeImage(absPath, outputBaseName);
  
  return {
    original: imagePath,
    optimized: optimized.sort((a, b) => a.width - b.width),
  };
}

/**
 * Update product JSON file to use optimized images
 */
async function updateProductJson(imageMap) {
  const files = await fsPromises.readdir(PRODUCTS_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  let updatedCount = 0;
  
  for (const file of jsonFiles) {
    const filePath = path.join(PRODUCTS_DIR, file);
    const content = await fsPromises.readFile(filePath, 'utf8');
    const product = JSON.parse(content);
    
    let updated = false;
    
    // Update image_url
    if (product.image_url && imageMap[product.image_url]) {
      const optimized = imageMap[product.image_url];
      if (optimized.optimized.length > 0) {
        product._optimized_image = optimized.optimized;
        updated = true;
      }
    }
    
    // Update gallery_array
    if (Array.isArray(product.gallery_array)) {
      product._optimized_gallery = product.gallery_array
        .map(url => imageMap[url])
        .filter(opt => opt && opt.optimized.length > 0)
        .map(opt => opt.optimized);
      
      if (product._optimized_gallery.length > 0) {
        updated = true;
      }
    }
    
    // Save updated JSON
    if (updated) {
      await fsPromises.writeFile(filePath, JSON.stringify(product, null, 2) + '\n', 'utf8');
      updatedCount++;
      console.log(`  ✓ Updated: ${file}`);
    }
  }
  
  return updatedCount;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log('=' .repeat(70) + '\n');
  
  try {
    // Step 1: Collect all image paths
    console.log('📋 Step 1: Collecting image paths from products...');
    const imagePaths = await getProductImagePaths();
    console.log(`   Found ${imagePaths.length} unique images\n`);
    
    // Step 2: Optimize each image
    console.log('🔄 Step 2: Optimizing images...');
    const imageMap = {};
    let processedCount = 0;
    
    for (const imagePath of imagePaths) {
      const result = await processImage(imagePath);
      imageMap[imagePath] = result;
      processedCount++;
      
      if (result.optimized.length > 0) {
        const totalSaved = result.optimized.reduce((sum, img) => sum + img.size, 0);
        console.log(`   ✓ ${imagePath} → ${result.optimized.length} sizes (${(totalSaved / 1024).toFixed(1)}KB)\n`);
      }
    }
    
    console.log(`✅ Optimized ${processedCount} images\n`);
    
    // Step 3: Update product JSON files
    console.log('📝 Step 3: Updating product JSON files...');
    const updatedCount = await updateProductJson(imageMap);
    console.log(`   ✓ Updated ${updatedCount} product files\n`);
    
    // Summary
    console.log('=' .repeat(70));
    console.log('\n✅ Image optimization complete!\n');
    console.log('📊 Summary:');
    console.log(`   - Total images processed: ${processedCount}`);
    console.log(`   - Product files updated: ${updatedCount}`);
    console.log(`   - Optimized images saved to: /public/optimized/\n`);
    console.log('📌 Next steps:');
    console.log('   1. Run: npm run build');
    console.log('   2. Update components to use _optimized_image fields');
    console.log('   3. Verify optimized images in browser DevTools\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
