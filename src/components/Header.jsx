import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import '../styles/Header.css';

const Header = ({ cart, getCartTotal, getCartCount, removeFromCart, updateQuantity }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <nav className="navbar">
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className="logo">
          <Link to="/">🛍️ Karibbean Dealz</Link>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)}>All Products</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
        </div>

        <div className="header-actions">
          <button 
            className="cart-btn"
            onClick={() => setIsCartOpen(!isCartOpen)}
            aria-label="Open cart"
          >
            <span className="cart-icon">🛒</span>
            {getCartCount() > 0 && (
              <span className="cart-count">{getCartCount()}</span>
            )}
            <span className="cart-total-mini">${getCartTotal().toFixed(2)}</span>
          </button>

          {isCartOpen && (
            <Cart 
              cart={cart}
              getCartTotal={getCartTotal}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              onClose={() => setIsCartOpen(false)}
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;