/**
 * Analytics configuration for the application
 */

// Google Analytics Measurement ID (G-XXXXXXXXXX format for GA4)
export const GA_MEASUREMENT_ID = import.meta.env.PUBLIC_GA_ID || 'G-JJ9JL2VK5H';

// Function to track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
      send_page_view: true,
    });
  }
};

// Function to track events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Enhanced tracking functions
export const trackPurchase = (transactionData: {
  transaction_id: string;
  value: number;
  currency?: string;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionData.transaction_id,
      value: transactionData.value,
      currency: transactionData.currency || 'VND',
      items: transactionData.items,
    });
  }
};

export const trackAddToCart = (itemData: {
  currency?: string;
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: itemData.currency || 'VND',
      value: itemData.value,
      items: itemData.items,
    });
  }
};

export const trackViewProduct = (productData: {
  currency?: string;
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    price: number;
  }>;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: productData.currency || 'VND',
      value: productData.value,
      items: productData.items,
    });
  }
};

export const trackSearchEvent = (searchTerm: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  }
};

// Type definition for window.gtag with enhanced e-commerce support
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js', 
      targetId: string | Date, 
      config?: Record<string, any>
    ) => void;
    dataLayer: Array<Record<string, any>>;
  }
} 