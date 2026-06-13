/**
 * Helper functions for image path manipulation
 */

/**
 * Convert optimized image path to thumbnail version
 * @param imagePath - Original optimized image path (e.g., "/optimized/g3tech/products/chair.webp")
 * @returns Thumbnail path (e.g., "/optimized/g3tech/products/chair-200w.webp")
 */
export function getThumbPath(imagePath: string): string {
  if (!imagePath) return imagePath;
  
  // Check if it's already a thumb image
  if (imagePath.includes('_thumb.')) {
    return imagePath;
  }
  
  // For build-time optimized images - use 200w version as thumbnail
  if (imagePath.includes('/optimized/') && /\.(jpg|jpeg|png|webp)$/i.test(imagePath)) {
    // If already a sized version, return as-is or get smallest
    if (/-\d+w\.(jpg|jpeg|png|webp)$/i.test(imagePath)) {
      // Extract base path and convert to 200w
      return imagePath.replace(/-\d+w\.(jpg|jpeg|png|webp)$/i, '-200w.$1');
    }
    // If it's the original optimized, add -200w suffix
    return imagePath.replace(/\.(jpg|jpeg|png|webp)$/i, '-200w.$1');
  }
  
  // For optimized images in g3tech-otm folder (legacy)
  if (imagePath.includes('/g3tech-otm/') && imagePath.endsWith('.avif')) {
    return imagePath.replace('.avif', '_thumb.avif');
  }
  
  // For original images in g3tech folder - return as-is (will be loaded from CDN)
  if (imagePath.includes('/g3tech/') && /\.(jpg|jpeg|png|webp)$/i.test(imagePath)) {
    return imagePath;
  }
  
  // Return original path if it doesn't match expected patterns
  return imagePath;
}

/**
 * Convert original image path to optimized version
 * @param imagePath - Original image path (e.g., "/g3tech/products/chair.jpg")
 * @returns Optimized path (e.g., "/g3tech-otm/products/chair.avif")
 */
export function getOptimizedPath(imagePath: string): string {
  if (!imagePath) return imagePath;
  
  // Already optimized
  if (imagePath.includes('/g3tech-otm/') && imagePath.endsWith('.avif')) {
    return imagePath;
  }
  
  // Convert original to optimized
  if (imagePath.includes('/g3tech/') && /\.(jpg|jpeg|png|webp)$/i.test(imagePath)) {
    return imagePath
      .replace(/^\/g3tech\//, '/g3tech-otm/')
      .replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
  }
  
  // Return original path if it doesn't match expected patterns
  return imagePath;
} 