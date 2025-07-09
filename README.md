# G-3.vn - Astro E-commerce

Website bán hàng được xây dựng bằng Astro với Supabase backend.

## 🚀 Tính năng

- ✅ Hiển thị danh sách sản phẩm từ Supabase
- ✅ Bộ lọc theo danh mục, thương hiệu, giá
- ✅ Responsive design với Tailwind CSS
- ✅ SEO tối ưu
- ✅ TypeScript support
- ✅ Static site generation

## 🛠️ Tech Stack

- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Language**: TypeScript
- **UI Components**: React islands

## 📦 Cài đặt

1. **Cài đặt dependencies**:
```bash
npm install
```

2. **Cấu hình biến môi trường**:
Tạo file `.env` với nội dung:
```
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PUBLIC_SITE_URL=https://g-3.vn
```

3. **Cấu hình Supabase Database**:
Tạo các bảng sau trong Supabase:

```sql
-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brands table
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  image_url TEXT,
  gallery_urls TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  brand_id UUID REFERENCES brands(id),
  sectors TEXT[],
  features TEXT[],
  specifications JSONB,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at);
```

4. **Thêm dữ liệu mẫu**:
```sql
-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Điện tử', 'dien-tu', 'Thiết bị điện tử'),
('Thời trang', 'thoi-trang', 'Quần áo và phụ kiện'),
('Gia dụng', 'gia-dung', 'Đồ dùng gia đình');

-- Insert sample brands
INSERT INTO brands (name, slug, description) VALUES
('Samsung', 'samsung', 'Thương hiệu điện tử Hàn Quốc'),
('Apple', 'apple', 'Thương hiệu công nghệ Mỹ'),
('Nike', 'nike', 'Thương hiệu thể thao');

-- Insert sample products
INSERT INTO products (name, slug, description, price, image_url, stock_quantity, category_id, brand_id) VALUES
('iPhone 15 Pro', 'iphone-15-pro', 'Smartphone cao cấp từ Apple', 29990000, 'https://example.com/iphone15pro.jpg', 50, 
  (SELECT id FROM categories WHERE slug = 'dien-tu'),
  (SELECT id FROM brands WHERE slug = 'apple')),
('Samsung Galaxy S24', 'samsung-galaxy-s24', 'Smartphone flagship từ Samsung', 24990000, 'https://example.com/galaxys24.jpg', 30,
  (SELECT id FROM categories WHERE slug = 'dien-tu'),
  (SELECT id FROM brands WHERE slug = 'samsung'));
```

## 🚀 Khởi chạy

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Cấu trúc dự án

```
g-3.vn/
├── src/
│   ├── components/         # Astro & React components
│   ├── layouts/           # Layout components
│   ├── pages/             # Pages (routes)
│   │   └── san-pham/      # Product pages
│   ├── lib/               # Utility functions
│   │   └── supabase.ts    # Supabase client
│   └── types/             # TypeScript types
├── public/                # Static assets
├── astro.config.mjs       # Astro configuration
└── package.json           # Dependencies
```

## 🔧 Cấu hình

### Astro Configuration (astro.config.mjs)
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  site: 'https://g-3.vn'
});
```

### Supabase Client (src/lib/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## 🎯 Trang sản phẩm

Trang sản phẩm chính tại `/san-pham` bao gồm:

- **Danh sách sản phẩm**: Hiển thị từ Supabase
- **Bộ lọc**: Theo danh mục, thương hiệu, giá
- **Sắp xếp**: Theo giá, tên, ngày tạo
- **Responsive**: Tối ưu cho mobile và desktop
- **SEO**: Meta tags và structured data

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy to Vercel
```

### Netlify
```bash
npm run build
# Deploy to Netlify
```

## 📝 Ghi chú

- Đảm bảo cấu hình đúng Supabase URL và API keys
- Thêm RLS (Row Level Security) policies cho bảng products nếu cần
- Cấu hình CORS trong Supabase nếu gặp lỗi
- Sử dụng environment variables cho production

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.
