# Navigation Speed Analysis

## Current Issues Found:

### 1. ViewTransitions Enabled
- `<ViewTransitions />` in Layout.astro
- Astro's View Transitions adds JS overhead
- Can cause delay on navigation

### 2. Large JS Bundles
- ShoppingGuide3D.js: 851KB (huge!)
- ModalBuyNowForm.js: 433KB
- MapDrawerWrapper.js: 344KB
- Total JS: ~3MB+

### 3. Too Many Astro Islands
Each island = separate JS bundle that must load

### 4. No Navigation Optimization
- No prefetching
- No loading states
- View Transitions may block

## Root Causes:

1. **ViewTransitions Overhead**
   - Astro View Transitions adds client-side router
   - Must download + parse transition JS before navigation
   - Adds 200-500ms delay

2. **Large Bundles Block Navigation**
   - ShoppingGuide3D (851KB) takes 2-4s to load on 3G
   - Blocks interactivity

3. **Islands Hydration**
   - Multiple islands hydrate simultaneously
   - Competes for main thread
   - Delays navigation response

## Solutions:

### Quick Wins (1-2 hours):
1. Disable ViewTransitions OR optimize
2. Code-split large bundles
3. Lazy load below-fold islands

### Medium (1 day):
4. Add navigation prefetch
5. Optimize island hydration strategy
6. Reduce bundle sizes

### Long-term:
7. Move to partial hydration
8. Implement skeleton screens
9. Add transition loading states
