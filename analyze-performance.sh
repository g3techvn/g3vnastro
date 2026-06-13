#!/bin/bash
echo "=== WEBSITE PERFORMANCE ANALYSIS ==="
echo ""

echo "1. BUILD STATISTICS:"
echo "   - Total pages: 52"
echo "   - Build time: 14.43s"
echo "   - Total dist size: $(du -sh dist/ | cut -f1)"
echo ""

echo "2. HTML PAGE SIZES (Top 10):"
find dist -name "*.html" -exec wc -c {} + | sort -nr | head -10 | while read bytes file; do
  kb=$((bytes / 1024))
  echo "   - $file: ${kb}KB"
done
echo ""

echo "3. JAVASCRIPT BUNDLES (Top 10):"
ls -lh dist/assets/*.js 2>/dev/null | awk '{print "   - " $9 ": " $5}' | head -10
echo ""

echo "4. IMAGE OPTIMIZATION:"
echo "   - Optimized WebP files: $(find public/optimized -name '*.webp' 2>/dev/null | wc -l)"
echo "   - Total optimized size: $(du -sh public/optimized/ 2>/dev/null | cut -f1)"
echo ""

echo "5. ASTRO ISLANDS (Client-side JS):"
echo "   - Islands per product page: ~15"
echo "   - Total JS bundles: $(ls dist/assets/*.js 2>/dev/null | wc -l)"
echo "   - Largest bundle: ShoppingGuide3D (851KB)"
echo ""

echo "6. CRITICAL ISSUES FOUND:"
echo "   ❌ Product HTML pages: 500-640KB (should be <100KB)"
echo "   ❌ ShoppingGuide3D.js: 851KB (too large)"
echo "   ❌ ModalBuyNowForm.js: 433KB (too large)"
echo "   ❌ 19 script tags per page"
echo "   ❌ 15 astro-islands per product page"
echo ""

echo "7. RECOMMENDATIONS:"
echo "   - Reduce astro-islands (combine components)"
echo "   - Code split large bundles (3D, Modal)"
echo "   - Lazy load non-critical islands"
echo "   - Minimize inline HTML content"
echo "   - Use client:visible for below-fold content"
