'use client';
import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  image_url?: string;
}

interface SimilarProductsProps {
  products: Product[];
  loading: boolean;
}

// Format currency helper
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function SimilarProducts({ products, loading }: SimilarProductsProps) {
  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement cart functionality
    console.log('Add to cart:', product);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Sản phẩm tương tự</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg aspect-square mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4 z-10"
    >
      <h2 className="text-2xl font-bold text-gray-900">Sản phẩm tương tự</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className="group relative"
          >
            <a href={`/san-pham/${product.slug}`} className="block">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
                <div className="aspect-square w-full">
                  <img
                    src={product.image_url || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex-1 flex flex-col px-2 pt-2 pb-1">
                  <div className="h-10 font-medium text-sm text-gray-900 line-clamp-2 mb-1">{product.name}</div>
                  <div className="flex items-end gap-2 mb-1 mt-auto">
                    <span className="text-red-600 font-bold text-base">{formatCurrency(product.price)}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-xs text-gray-400 line-through">{formatCurrency(product.original_price)}</span>
                    )}
                  </div>
                  {/* Đánh giá, đã bán và nút thêm giỏ hàng */}
                  <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><polygon points="9.9,1.1 7.6,6.6 1.6,7.3 6.1,11.2 4.8,17.1 9.9,14.1 15,17.1 13.7,11.2 18.2,7.3 12.2,6.6 "/></svg>
                        {((product as any).rating || 4.9).toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>Đã bán {(product as any).sold_count || 0}</span>
                    </div>
                    <motion.button
                      className="p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-colors duration-200"
                      aria-label="Thêm vào giỏ hàng"
                      onClick={(e) => handleAddToCart(e, product)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 