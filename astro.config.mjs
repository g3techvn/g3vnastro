// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import path from 'path';


// https://astro.build/config
export default defineConfig({
  site: 'https://g-3.vn',

  // Disable Dev Toolbar for cleaner development experience
  devToolbar: {
    enabled: false,
  },

  integrations: [
    react(),
    tailwind(),
    sitemap({
      // Cấu hình sitemap hoàn chỉnh cho e-commerce
      filter: (page) => {
        // Loại bỏ trang API
        if (page.includes('/api/')) return false;

        // Loại bỏ trang checkout, admin, private pages
        if (page.includes('/checkout/') || page.includes('/admin/') || page.includes('/dashboard/')) return false;

        // Loại bỏ các trang có query parameters hoặc fragments
        if (page.includes('?') || page.includes('#')) return false;

        // Bao gồm tất cả các trang hợp lệ khác
        return true;
      },

      // Cấu hình entry limit để tránh tạo nhiều file sitemap
      entryLimit: 45000,

      // Serialize function để tối ưu SEO cho từng loại trang
      serialize: (item) => {
        // Trang chủ - Ưu tiên cao nhất
        if (item.url === 'https://g-3.vn/') {
          item.priority = 1.0;
        }

        // Trang sản phẩm chi tiết - Ưu tiên rất cao (tiềm năng chuyển đổi cao)
        else if (item.url.includes('/san-pham/') && !item.url.endsWith('/san-pham/')) {
          item.priority = 0.9;
        }

        // Trang danh sách sản phẩm, danh mục, thương hiệu - Ưu tiên cao
        else if (item.url.endsWith('/san-pham/') || item.url.endsWith('/categories/') || item.url.endsWith('/brands/')) {
          item.priority = 0.8;
        }

        // Trang danh mục chi tiết
        else if (item.url.includes('/categories/')) {
          item.priority = 0.8;
        }

        // Trang thương hiệu chi tiết  
        else if (item.url.includes('/brands/')) {
          item.priority = 0.8;
        }

        // Trang về công ty, doanh nghiệp
        else if (item.url.includes('/about') || item.url.includes('/doanh-nghiep')) {
          item.priority = 0.6;
        }

        // Trang chính sách, điều khoản
        else if (item.url.includes('/chinh-sach') || item.url.includes('/noi-dung/')) {
          item.priority = 0.5;
        }

        // Trang liên hệ, hướng dẫn
        else if (item.url.includes('/lien-he') || item.url.includes('/huong-dan')) {
          item.priority = 0.6;
        }

        // Trang video, voucher
        else if (item.url.includes('/video') || item.url.includes('/voucher')) {
          item.priority = 0.7;
        }

        // Các trang khác
        else {
          item.priority = 0.5;
        }

        return item;
      },
    }),
  ],

  output: 'static',

  build: {
    assets: 'assets'
  },

  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    },
    server: {
      allowedHosts: ['www.g-3.vn', 'g-3.vn']
    }
  },

});