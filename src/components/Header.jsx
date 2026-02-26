import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import '../styles/Header.css';

/**
 * Header Component
 * Main navigation header with cart, user authentication, and mobile menu
 * Handles admin login and displays cart dropdown
 */
const Header = ({ 
  cart, 
  getCartTotal, 
  getCartCount, 
  removeFromCart, 
  updateQuantity, 
  user, 
  onLogin, 
  onLogout 
}) => {
  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Login Form State
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // Demo admin credentials (should be moved to env in production)
  const ADMIN_CREDENTIALS = {
    email: 'admin@karibbean.com',
    password: 'admin123'
  };

  /**
   * Handle login form submission
   * Validates credentials against demo admin account
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { email, password } = loginForm;
      const isValidAdmin = email === ADMIN_CREDENTIALS.email && 
                          password === ADMIN_CREDENTIALS.password;

      if (isValidAdmin) {
        onLogin({
          email,
          role: 'admin',
          name: 'Admin User'
        });
        resetLoginModal();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  /**
   * Handle logout action
   */
  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  /**
   * Reset login modal state
   */
  const resetLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginForm({ email: '', password: '' });
    setError('');
  };

  /**
   * Close all open panels
   */
  const closeAllPanels = () => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
  };

  // Navigation links configuration
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'All Products' },
    { to: '/contact', label: 'Contact Us' }
  ];

  return (
    <header className="header" role="banner">
      <nav className="navbar" aria-label="Main navigation">
        {/* Mobile Menu Toggle */}
        <MenuToggle 
          isOpen={isMenuOpen} 
          onToggle={() => setIsMenuOpen(!isMenuOpen)} 
        />

        {/* Logo */}
        <Logo />

        {/* Navigation Links */}
        <NavLinks 
          links={navLinks}
          isOpen={isMenuOpen}
          onLinkClick={closeAllPanels}
        />

        <div className="header-actions">
          {/* Cart Button */}
          <CartButton 
            cartCount={getCartCount()}
            cartTotal={getCartTotal()}
            onClick={() => setIsCartOpen(!isCartOpen)}
          />

          {/* User Section */}
          <UserSection 
            user={user}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onLogout={handleLogout}
          />

          {/* Admin Link */}
          {user?.role === 'admin' && (
            <AdminLink onClose={closeAllPanels} />
          )}

          {/* Cart Dropdown */}
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

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal 
          formData={loginForm}
          error={error}
          onFormChange={setLoginForm}
          onSubmit={handleLogin}
          onClose={resetLoginModal}
        />
      )}
    </header>
  );
};

/**
 * Mobile Menu Toggle Button
 */
const MenuToggle = ({ isOpen, onToggle }) => (
  <button 
    className="menu-toggle"
    onClick={onToggle}
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isOpen}
  >
    ☰
  </button>
);

/**
 * Logo Component
 */
const Logo = () => (
  <div className="logo">
    <Link to="/" aria-label="Home page">
      🛍️ Karibbean Dealz
    </Link>
  </div>
);

/**
 * Navigation Links Component
 */
const NavLinks = ({ links, isOpen, onLinkClick }) => (
  <div className={`nav-links ${isOpen ? 'active' : ''}`}>
    {links.map(({ to, label }) => (
      <Link 
        key={to} 
        to={to} 
        onClick={onLinkClick}
      >
        {label}
      </Link>
    ))}
  </div>
);

/**
 * Cart Button Component
 */
const CartButton = ({ cartCount, cartTotal, onClick }) => (
  <button 
    className="cart-btn"
    onClick={onClick}
    aria-label="Open cart"
    aria-expanded="false"
  >
    <span className="cart-icon" aria-hidden="true">🛒</span>
    {cartCount > 0 && (
      <span className="cart-count" aria-label={`${cartCount} items in cart`}>
        {cartCount}
      </span>
    )}
    <span className="cart-total-mini">${cartTotal.toFixed(2)}</span>
  </button>
);

/**
 * User Section Component
 */
const UserSection = ({ user, onLoginClick, onLogout }) => (
  <div className="user-section">
    {user ? (
      <UserMenu user={user} onLogout={onLogout} />
    ) : (
      <LoginButton onClick={onLoginClick} />
    )}
  </div>
);

/**
 * User Menu (Logged In State)
 */
const UserMenu = ({ user, onLogout }) => (
  <div className="user-menu">
    <span className="user-greeting">Hi, {user.name}</span>
    <button onClick={onLogout} className="logout-btn">
      Logout
    </button>
  </div>
);

/**
 * Login Button (Logged Out State)
 */
const LoginButton = ({ onClick }) => (
  <button className="login-btn" onClick={onClick}>
    <span className="login-icon" aria-hidden="true">👤</span>
    <span className="login-text">Admin Login</span>
  </button>
);

/**
 * Admin Dashboard Link
 */
const AdminLink = ({ onClose }) => (
  <div className="admin-link-container">
    <Link 
      to="/admin" 
      onClick={onClose} 
      className="admin-link"
    >
      Admin Dashboard
    </Link>
  </div>
);

/**
 * Login Modal Component
 */
const LoginModal = ({ formData, error, onFormChange, onSubmit, onClose }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    onFormChange(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close login modal">×</button>
        
        <h2>Admin Login</h2>
        <p className="modal-subtitle">Access your admin dashboard</p>
        
        <form onSubmit={onSubmit} className="login-form">
          <FormField
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@karibbean.com"
            required
          />

          <FormField
            id="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          {error && <ErrorMessage message={error} />}

          <DemoCredentials />
          
          <button type="submit" className="login-submit-btn">
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * Form Field Component
 */
const FormField = ({ id, type, label, value, onChange, placeholder, required }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      autoComplete={type === 'password' ? 'current-password' : 'email'}
    />
  </div>
);

/**
 * Error Message Component
 */
const ErrorMessage = ({ message }) => (
  <div className="error-message" role="alert">
    {message}
  </div>
);

/**
 * Demo Credentials Display
 */
const DemoCredentials = () => (
  <div className="demo-credentials">
    <p><strong>Demo Credentials:</strong></p>
    <p>Email: admin@karibbean.com</p>
    <p>Password: admin123</p>
  </div>
);

export default Header;