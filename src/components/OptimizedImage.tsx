/**
 * OptimizedImage component for Astro
 * Automatically handles both local and external images
 * For local images: uses Astro's built-in optimization
 * For external images: adds lazy loading and proper attributes
 */

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  class?: string;
  sizes?: string;
  quality?: number;
}

export function isExternalUrl(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//');
}

export function getOptimizedSrc(src: string, width?: number): string {
  if (isExternalUrl(src)) {
    return src;
  }
  
  // For local images, Astro will handle optimization automatically
  // when using the <Image /> component from 'astro:assets'
  return src;
}
