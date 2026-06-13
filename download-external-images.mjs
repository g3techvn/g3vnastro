/**
 * Download external images to local public directory
 * Run this script before build to ensure all images are local
 * Usage: npm run download-images
 */
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_DIR = path.join(__dirname, 'src/content/products');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Extract hostname and create local path from URL
function urlToLocalPath(url) {
  try {
    const urlObj = new URL(url);
    // Create path: /g3tech/external/{domain}/{pathname}
    const domain = urlObj.hostname.replace(/\./g, '_');
    const pathname = urlObj.pathname.replace(/^\/+/, '');
    const filename = path.basename(urlObj.pathname);
    
    return {
      localPath: `/g3tech/external/${domain}/${pathname}`,
      fullPath: path.join(PUBLIC_DIR, 'g3tech', 'external', domain, pathname),
      filename
    };
  } catch (error) {
    console.error('Invalid URL:', url);
    return null;
  }
}

// Download file from URL
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(dest);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

// Ensure directory exists
async function ensureDir(dirPath) {
  await fsPromises.mkdir(dirPath, { recursive: true });
}

// Process a single product JSON file
async function processProductFile(filePath) {
  const content = await fsPromises.readFile(filePath, 'utf8');
  const product = JSON.parse(content);
  
  let updated = false;
  const urlsToDownload = [];
  
  // Check image_url
  if (product.image_url && product.image_url.startsWith('http')) {
    const localInfo = urlToLocalPath(product.image_url);
    if (localInfo) {
      urlsToDownload.push({ url: product.image_url, ...localInfo });
      product.image_url = localInfo.localPath;
      updated = true;
    }
  }
  
  // Check gallery_array
  if (Array.isArray(product.gallery_array)) {
    product.gallery_array = product.gallery_array.map(url => {
      if (url.startsWith('http')) {
        const localInfo = urlToLocalPath(url);
        if (localInfo) {
          urlsToDownload.push({ url, ...localInfo });
          updated = true;
          return localInfo.localPath;
        }
      }
      return url;
    });
  }
  
  // Download all URLs
  if (urlsToDownload.length > 0) {
    console.log(`\nProcessing ${path.basename(filePath)}: ${urlsToDownload.length} images`);
    
    for (const { url, fullPath, localPath } of urlsToDownload) {
      try {
        await ensureDir(path.dirname(fullPath));
        
        // Check if file already exists
        try {
          await fsPromises.access(fullPath);
          console.log(`  ✓ Already exists: ${localPath}`);
        } catch {
          // File doesn't exist, download it
          console.log(`  ↓ Downloading: ${url}`);
          await downloadFile(url, fullPath);
          console.log(`  ✓ Downloaded: ${localPath}`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to download ${url}:`, error.message);
      }
    }
  }
  
  // Save updated JSON if changed
  if (updated) {
    await fsPromises.writeFile(filePath, JSON.stringify(product, null, 2) + '\n', 'utf8');
    console.log(`  ↻ Updated: ${path.basename(filePath)}`);
  }
  
  return updated;
}

// Main function
async function main() {
  console.log('🚀 Downloading external images to local...\n');
  
  try {
    const files = await fsPromises.readdir(PRODUCTS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    let updatedCount = 0;
    
    for (const file of jsonFiles) {
      const filePath = path.join(PRODUCTS_DIR, file);
      const updated = await processProductFile(filePath);
      if (updated) updatedCount++;
    }
    
    console.log(`\n✅ Complete! Updated ${updatedCount} product file(s)`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
