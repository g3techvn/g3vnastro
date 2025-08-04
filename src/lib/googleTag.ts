/**
 * Google Tag (Google Ads) tracking functions
 */

export const GOOGLE_TAG_ID = 'AW-17425925094';

// Function to track conversion events
export const trackConversion = (conversionLabel: string, value?: number, currency: string = 'VND') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_TAG_ID}/${conversionLabel}`,
      'value': value,
      'currency': currency
    });
  }
};

// Function to track purchase conversion
export const trackPurchaseConversion = (transactionData: {
  value: number;
  currency?: string;
  transaction_id?: string;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_TAG_ID}/purchase`, // Thay 'purchase' bằng conversion label thực tế
      'value': transactionData.value,
      'currency': transactionData.currency || 'VND',
      'transaction_id': transactionData.transaction_id
    });
  }
};

// Function to track form submission conversion
export const trackFormSubmissionConversion = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_TAG_ID}/form_submit` // Thay 'form_submit' bằng conversion label thực tế
    });
  }
};

// Function to track phone call conversion
export const trackPhoneCallConversion = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_TAG_ID}/phone_call` // Thay 'phone_call' bằng conversion label thực tế
    });
  }
};

// Enhanced tracking for e-commerce
export const trackAddToCartConversion = (itemData: {
  value: number;
  currency?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_TAG_ID}/add_to_cart`, // Thay 'add_to_cart' bằng conversion label thực tế
      'value': itemData.value,
      'currency': itemData.currency || 'VND',
      'items': itemData.items
    });
  }
};

// Type definition for window.gtag
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