import React, { useState, useEffect } from 'react';
import MobileHomeTabs from './MobileHomeTabs';

interface Category {
  name: string;
  slug: string;
  productCount: number;
}

const MobileHomeTabsIsland: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.product_cats) {
          setCategories(data.product_cats.map((cat: any) => ({
            name: cat.title,
            slug: cat.slug,
            productCount: cat.product_count
          })));
        }
      });
  }, []);

  return <MobileHomeTabs categories={categories} />;
};

export default MobileHomeTabsIsland;
