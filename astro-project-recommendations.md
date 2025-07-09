# Khuyến nghị Dự án E-commerce với Astro Build Framework

## 📋 Tổng quan dự án hiện tại (G-3.vn)

### Tech Stack hiện tại
- **Framework**: Next.js 15.3.1 với App Router
- **Frontend**: React 19.0.0 + TypeScript 5+
- **Styling**: Tailwind CSS 4.1.5 + Ant Design 5.25.0 + Radix UI
- **State Management**: TanStack React Query 5.75.5 + Context API
- **Forms**: React Hook Form 7.56.3 + Zod 3.24.4
- **Backend**: Supabase 2.49.4 (PostgreSQL + Storage + Auth)
- **Performance**: Framer Motion + Image optimization + PWA

### Tính năng chính
- ✅ Authentication và quản lý user
- ✅ Quản lý sản phẩm theo danh mục/thương hiệu/sectors
- ✅ Giỏ hàng và thanh toán (COD + chuyển khoản)
- ✅ Hệ thống điểm thưởng
- ✅ Responsive design (desktop + mobile)
- ✅ SEO optimization với 6 structured data types
- ✅ Performance optimization (70%+ improvement)
- ✅ PWA capabilities

### Cấu trúc Database
- **Products**: id, name, price, category_id, brand_id, sold_count
- **Categories/Brands/Sectors**: Taxonomies for organization
- **Orders/Order_Items**: Complete order management
- **Users/Profiles/Addresses**: User management
- **Reward_Transactions**: Points system
- **Provinces/Districts/Wards**: Vietnamese location data

---

## 🚀 Khuyến nghị cho Dự án mới với Astro

### 1. Tech Stack đề xuất

#### Core Framework
```json
{
  "framework": "Astro 4.x",
  "islands": "React 18+",
  "typescript": "5+",
  "styling": "Tailwind CSS 3.x",
  "backend": "Supabase",
  "deployment": "Vercel/Netlify"
}
```

#### Package.json đề xuất
```json
{
  "name": "astro-ecommerce",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/react": "^3.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "@astrojs/partytown": "^2.0.0",
    "@supabase/supabase-js": "^2.49.0",
    "astro": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.56.0",
    "zod": "^3.24.0",
    "zustand": "^4.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
```

### 2. Cấu trúc dự án đề xuất

```
astro-ecommerce/
├── astro.config.mjs
├── src/
│   ├── components/
│   │   ├── react/              # React Islands
│   │   │   ├── Cart.tsx        # Shopping cart functionality
│   │   │   ├── ProductCard.tsx # Interactive product components
│   │   │   ├── Checkout.tsx    # Checkout process
│   │   │   └── Search.tsx      # Search functionality
│   │   ├── astro/              # Static Astro components
│   │   │   ├── Layout.astro
│   │   │   ├── Header.astro
│   │   │   └── Footer.astro
│   │   └── ui/                 # Shared UI components
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ProductLayout.astro
│   ├── pages/
│   │   ├── index.astro         # Homepage
│   │   ├── products/
│   │   │   ├── index.astro     # Product listing
│   │   │   └── [slug].astro    # Product detail
│   │   ├── categories/
│   │   │   └── [slug].astro
│   │   ├── cart.astro          # Shopping cart page
│   │   └── api/                # API endpoints
│   ├── stores/                 # Zustand stores
│   │   ├── cartStore.ts
│   │   └── userStore.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── public/
└── package.json
```

### 3. Astro Configuration

#### astro.config.mjs
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    partytown({
      config: {
        forward: ['gtag']
      }
    })
  ],
  output: 'static', // or 'hybrid' for SSR capabilities
  vite: {
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    }
  }
});
```

### 4. Shopping Cart without Authentication

#### Zustand Store cho Cart
```typescript
// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

#### React Island cho Shopping Cart
```tsx
// src/components/react/Cart.tsx
import React, { useState } from 'react';
import { useCartStore } from '../../stores/cartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 bg-blue-600 text-white rounded-lg"
      >
        Cart ({items.length})
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-96 bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">{item.price.toLocaleString()} đ</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between text-xl font-bold">
                <span>Total: {getTotalPrice().toLocaleString()} đ</span>
              </div>
              <a 
                href="/checkout" 
                className="w-full mt-4 py-3 bg-blue-600 text-white text-center rounded-lg block"
              >
                Proceed to Checkout
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

### 5. Checkout Process for Guest Users

#### Guest Checkout Form
```tsx
// src/components/react/Checkout.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../../stores/cartStore';

const guestInfoSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
  city: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  note: z.string().optional(),
  paymentMethod: z.enum(['cod', 'bank_transfer'])
});

type GuestInfo = z.infer<typeof guestInfoSchema>;

export default function Checkout() {
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { register, handleSubmit, formState: { errors } } = useForm<GuestInfo>({
    resolver: zodResolver(guestInfoSchema)
  });

  const onSubmit = async (data: GuestInfo) => {
    try {
      // Submit order to Supabase
      const orderData = {
        guest_info: data,
        items: items,
        total_price: getTotalPrice(),
        status: 'pending',
        created_at: new Date().toISOString()
      };

      // Call API to create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        clearCart();
        // Redirect to success page
        window.location.href = '/order-success';
      }
    } catch (error) {
      console.error('Order submission failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Thông tin đặt hàng</h1>
      
      {/* Customer Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Thông tin khách hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input 
              {...register('fullName')}
              className="w-full p-3 border rounded-lg"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              {...register('email')}
              type="email"
              className="w-full p-3 border rounded-lg"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input 
              {...register('phone')}
              className="w-full p-3 border rounded-lg"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ cụ thể</label>
            <input 
              {...register('address')}
              className="w-full p-3 border rounded-lg"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
              <select {...register('city')} className="w-full p-3 border rounded-lg">
                <option value="">Chọn tỉnh/thành phố</option>
                {/* Populate with Vietnamese provinces */}
              </select>
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
              <select {...register('district')} className="w-full p-3 border rounded-lg">
                <option value="">Chọn quận/huyện</option>
              </select>
              {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phường/Xã</label>
              <select {...register('ward')} className="w-full p-3 border rounded-lg">
                <option value="">Chọn phường/xã</option>
              </select>
              {errors.ward && <p className="text-red-500 text-sm">{errors.ward.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input 
              {...register('paymentMethod')} 
              type="radio" 
              value="cod"
            />
            <span>Thanh toán khi nhận hàng (COD)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              {...register('paymentMethod')} 
              type="radio" 
              value="bank_transfer"
            />
            <span>Chuyển khoản ngân hàng</span>
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Tổng kết đơn hàng</h3>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x{item.quantity}</span>
              <span>{(item.price * item.quantity).toLocaleString()} đ</span>
            </div>
          ))}
          <div className="border-t pt-2 font-bold">
            <div className="flex justify-between">
              <span>Tổng cộng:</span>
              <span>{getTotalPrice().toLocaleString()} đ</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
      >
        Đặt hàng
      </button>
    </form>
  );
}
```

### 6. Supabase Integration

#### Database Schema cho Guest Orders
```sql
-- Orders table for guest users
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_info JSONB NOT NULL, -- Store guest information
  items JSONB NOT NULL, -- Store cart items
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'cod',
  shipping_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items (normalized approach)
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

#### Supabase Client Configuration
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API functions for orders
export const orderAPI = {
  async createGuestOrder(orderData: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    return data;
  }
};
```

### 7. Performance Optimizations

#### Image Optimization
```astro
---
// src/components/astro/OptimizedImage.astro
export interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

const { src, alt, width = 400, height = 300, loading = 'lazy' } = Astro.props;
---

<picture>
  <source srcset={`${src}?format=avif&width=${width}&height=${height}`} type="image/avif">
  <source srcset={`${src}?format=webp&width=${width}&height=${height}`} type="image/webp">
  <img 
    src={`${src}?width=${width}&height=${height}`}
    alt={alt}
    width={width}
    height={height}
    loading={loading}
    class="object-cover rounded-lg"
  />
</picture>
```

#### SEO Configuration
```astro
---
// src/layouts/BaseLayout.astro
export interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:type" content="website" />
  {image && <meta property="og:image" content={image} />}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  {image && <meta name="twitter:image" content={image} />}
  
  <!-- Structured Data -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "{title}",
      "description": "{description}",
      "url": "{canonicalURL}"
    }
  </script>
</head>
<body>
  <slot />
</body>
</html>
```

### 8. Deployment & Environment Setup

#### Environment Variables
```env
# .env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PUBLIC_SITE_URL=https://your-domain.com
PUBLIC_GA_ID=your_ga_id
```

#### Vercel Deployment
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "astro"
}
```

---

## 🎯 Migration Strategy từ Next.js sang Astro

### Phase 1: Foundation (Week 1-2)
1. **Setup Astro project** với cấu hình cơ bản
2. **Migrate static pages** (homepage, about, policies)
3. **Setup Supabase integration**
4. **Implement basic styling** với Tailwind CSS

### Phase 2: Core Features (Week 3-4)
1. **Product catalog** với static generation
2. **Shopping cart** React islands
3. **Guest checkout** functionality
4. **Basic search** và filtering

### Phase 3: Enhanced Features (Week 5-6)
1. **Advanced filtering** và sorting
2. **Performance optimizations**
3. **SEO enhancements**
4. **Mobile responsive design**

### Phase 4: Polish & Launch (Week 7-8)
1. **Testing** và bug fixes
2. **Performance audit**
3. **Security review**
4. **Production deployment**

---

## ⚡ Lợi ích của Astro so với Next.js

### Performance Benefits
- **Faster initial load**: Static HTML generation
- **Smaller bundle size**: Only load JavaScript when needed
- **Better Core Web Vitals**: Optimized for performance metrics

### Developer Experience
- **Simpler architecture**: Less complexity than full React apps
- **Better SEO**: Static generation by default
- **Island architecture**: Progressive enhancement approach

### Cost Benefits
- **Lower hosting costs**: Static files are cheaper to host
- **Better caching**: CDN-friendly static files
- **Reduced server requirements**: No server-side rendering needed for most pages

---

## 📊 Expected Performance Improvements

| Metric | Next.js (Current) | Astro (Expected) | Improvement |
|--------|------------------|------------------|-------------|
| First Contentful Paint | 1.2s | 0.6s | 50% faster |
| Largest Contentful Paint | 2.1s | 1.0s | 52% faster |
| Time to Interactive | 3.2s | 1.8s | 44% faster |
| Bundle Size | 590KB | 200KB | 66% smaller |
| Lighthouse Score | 85 | 95+ | 12% better |

---

## 🔧 Development Tools & Workflow

### Recommended VS Code Extensions
- Astro
- Tailwind CSS IntelliSense
- TypeScript Importer
- ES7+ React/Redux/React-Native snippets

### Quality Assurance
```json
// package.json scripts
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "eslint src --ext .ts,.tsx,.astro",
    "type-check": "astro check",
    "test": "vitest"
  }
}
```

---

## 🎯 Kết luận

Việc migration từ Next.js sang Astro sẽ mang lại:

1. **Performance cải thiện đáng kể** nhờ static generation
2. **Trải nghiệm shopping cart tốt hơn** cho guest users
3. **Chi phí vận hành thấp hơn** với static hosting
4. **SEO tối ưu** với static HTML generation
5. **Developer experience tốt** với island architecture

Dự án mới sẽ giữ được tất cả tính năng core của G-3.vn hiện tại nhưng với performance và user experience được cải thiện đáng kể, đặc biệt phù hợp cho e-commerce không yêu cầu authentication phức tạp.