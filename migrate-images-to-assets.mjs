/**
 * Migrate images from public/ to src/assets/ for Astro Image optimization
 * This allows Astro to resize and convert images to WebP/AVIF
 * Usage: node migrate-images-to-assets.mjs
 */
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');
const ASSETS_DIR = path.join(__dirname, 'src/assets');
const PRODUCTS_DIR = path.join(__dirname, 'src/content/products');

// Old path prefixes in JSON files
const PATH_MAPPINGS = [
  {
    old: '/g3tech/external/cdn_hstatic_net',
    new: '../../assets/g3tech/external/cdn_hstatic_net',
    publicSubdir: 'g3tech/external/cdn_hstatic_net'
  },
  {
    old: '/g3tech/products',
    new: '../../assets/g3tech/products',
    publicSubdir: 'g3tech/products'
  },
  {
    old: '/g3tech/home',
    new: '../../assets/g3tech/home',
    publicSubdir: 'g3tech/home'
  }
];

async function copyImages() {
  console.log('📋 Copying images from public/ to src/assets/...\n');
  
  let totalFileCount = 0;
  
  for (const mapping of PATH_MAPPINGS) {
    const sourceDir = path.join(PUBLIC_DIR, mapping.publicSubdir);
    const destDir = path.join(ASSETS_DIR, mapping.publicSubdir);
    
    console.log(`📁 ${mapping.publicSubdir}/`);
    
    // Check if source exists
    try {
      await fsPromises.access(sourceDir);
    } catch {
      console.log(`   ⚠️  Not found, skipping\n`);
      continue;
    }
    
    // Copy all files
    let fileCount = 0;
    async function copyDir(src, dest) {
      await fsPromises.mkdir(dest, { recursive: true });
      const entries = await fsPromises.readdir(src, { withFileTypes: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fsPromises.copyFile(srcPath, destPath);
          fileCount++;
          totalFileCount++;
        }
      }
    }
    
    await copyDir(sourceDir, destDir);
    console.log(`   ✓ Copied ${fileCount} files\n`);
  }
  
  console.log(`✅ Total: ${totalFileCount} files copied\n`);
}

async function updateJsonFiles() {
  console.log('📝 Updating product JSON files...\n');
  
  const files = await fsPromises.readdir(PRODUCTS_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  let updatedCount = 0;
  
  for (const file of jsonFiles) {
    const filePath = path.join(PRODUCTS_DIR, file);
    const content = await fsPromises.readFile(filePath, 'utf8');
    const product = JSON.parse(content);
    
    let updated = false;
    
    // Helper function to update URL
    function updateUrl(url) {
      for (const mapping of PATH_MAPPINGS) {
        if (url && url.startsWith(mapping.old)) {
          return url.replace(mapping.old, mapping.new);
        }
      }
      return url;
    }
    
    // Update image_url
    if (product.image_url) {
      const oldPath = product.image_url;
      const newPath = updateUrl(product.image_url);
      if (newPath !== oldPath) {
        product.image_url = newPath;
        console.log(`  ${file}:`);
        console.log(`    OLD: ${oldPath}`);
        console.log(`    NEW: ${product.image_url}`);
        updated = true;
      }
    }
    
    // Update gallery_array
    if (Array.isArray(product.gallery_array)) {
      const oldGallery = [...product.gallery_array];
      product.gallery_array = product.gallery_array.map(updateUrl);
      
      if (JSON.stringify(oldGallery) !== JSON.stringify(product.gallery_array)) {
        if (!updated) console.log(`  ${file}:`);
        console.log(`    Updated gallery_array (${product.gallery_array.length} images)`);
        updated = true;
      }
    }
    
    // Save updated JSON
    if (updated) {
      await fsPromises.writeFile(filePath, JSON.stringify(product, null, 2) + '\n', 'utf8');
      updatedCount++;
      console.log(`    ↻ Updated: ${file}\n`);
    }
  }
  
  console.log(`✅ Updated ${updatedCount} product file(s)\n`);
}

async function main() {
  console.log('🚀 Migrating images from public/ to src/assets/ for Astro Image optimization\n');
  console.log('=' .repeat(70) + '\n');
  
  try {
    await copyImages();
    await updateJsonFiles();
    
    console.log('=' .repeat(70));
    console.log('\n✅ Migration complete!');
    console.log('\n📌 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Check that images load correctly');
    console.log('   3. Run: npm run build');
    console.log('   4. Verify optimized images in dist/ folder\n');
    console.log('💡 Astro will now optimize all images (resize, WebP/AVIF conversion)\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
