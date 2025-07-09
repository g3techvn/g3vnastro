import React from 'react';
import { CartProvider } from '../../context/CartContext';
import Header from './Header';

const HeaderWithCartProvider: React.FC = () => (
  <CartProvider>
    <Header />
  </CartProvider>
);

export default HeaderWithCartProvider;
