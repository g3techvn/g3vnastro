/**
 * Helper functions for image path manipulation
 */

/**
 * Convert optimized image path to thumbnail version
 * @param imagePath - Original optimized image path (e.g., "/g3tech-otm/products/chair.avif")
 * @returns Thumbnail path (e.g., "/g3tech-otm/products/chair_thumb.avif")
 */
export function getThumbPath(imagePath: string): string {
  if (!imagePath) return imagePath;
  
  // Check if it's already a thumb image
  if (imagePath.includes('_thumb.')) {
    return imagePath;
  }
  
  // For optimized images in g3tech-otm folder
  if (imagePath.includes('/g3tech-otm/') && imagePath.endsWith('.avif')) {
    return imagePath.replace('.avif', '_thumb.avif');
  }
  
  // For original images in g3tech folder - convert to optimized thumb
  if (imagePath.includes('/g3tech/') && /\.(jpg|jpeg|png|webp)$/i.test(imagePath)) {
    const optimizedPath = imagePath
      .replace(/^\/g3tech\//, '/g3tech-otm/')
      .replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
    return optimizedPath.replace('.avif', '_thumb.avif');
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