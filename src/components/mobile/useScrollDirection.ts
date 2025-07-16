import { useState, useEffect, useRef } from 'react';

interface ScrollState {
  isHeaderVisible: boolean;
  isBottomNavVisible: boolean;
  scrollDirection: 'up' | 'down' | null;
}

export const useScrollDirection = () => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isHeaderVisible: true,
    isBottomNavVisible: true,
    scrollDirection: null,
  });
  
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDirection = scrollY > lastScrollY.current ? 'down' : 'up';
      
      // Chỉ update khi scroll nhiều hơn 5px để tránh jitter
      if (Math.abs(scrollY - lastScrollY.current) < 5) {
        ticking.current = false;
        return;
      }

      // Ở đầu trang (top < 100px) thì luôn hiển thị header
      const isAtTop = scrollY < 100;
      
      setScrollState(prev => ({
        ...prev,
        scrollDirection,
        // Header: hiện khi scroll up hoặc ở đầu trang, ẩn khi scroll down
        isHeaderVisible: scrollDirection === 'up' || isAtTop,
        // Bottom nav: hiện khi scroll down hoặc ở đầu trang, ẩn khi scroll up  
        isBottomNavVisible: scrollDirection === 'down' || isAtTop,
      }));

      lastScrollY.current = scrollY > 0 ? scrollY : 0;
      ticking.current = false;
    };

    const requestTick = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    const handleScroll = () => requestTick();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollState;
}; 