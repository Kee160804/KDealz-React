// Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import '../styles/Header.css';
// NEW CODE: Import Supabase authentication functions
import { signInAdmin, isAuthorizedAdmin } from '../services/userService';

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
  // NEW CODE: Add loading state for async login
  const [isLoading, setIsLoading] = useState(false);

  /* OLD CODE (COMMENTED OUT): Using mock admin credentials
  const ADMIN_CREDENTIALS = {
    email: 'admin@karibbean.com',
    password: 'admin123'
  };
  */

  /**
   * NEW CODE: Handle login form submission with real Supabase authentication
   * Uses signInAdmin from userService for real credentials
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { email, password } = loginForm;
      
      // NEW CODE: Use Supabase authentication instead of mock credentials
      const result = await signInAdmin(email, password);

      if (result.success) {
        // Login successful - call parent onLogin with user data
        onLogin({
          email: result.user.email,
          id: result.user.id,
          role: result.user.role,
          name: result.user.email.split('@')[0] // Use email username as name
        });
        resetLoginModal();
      } else {
        // Login failed - show error from Supabase
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
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

          {/* Admin Link - Always visible on all devices */}
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
          /* NEW CODE: Pass loading state to disable inputs during login */
          isLoading={isLoading}
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
 * Admin Dashboard Link - Always visible on all devices
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
const LoginModal = ({ formData, error, onFormChange, onSubmit, onClose, isLoading }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    onFormChange(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close login modal" disabled={isLoading}>×</button>
        
        <h2>Admin Login</h2>
        <p className="modal-subtitle">Access your admin dashboard</p>
        
        <form onSubmit={onSubmit} className="login-form">
          <FormField
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            /* NEW CODE: Updated placeholder to use correct Supabase email with capital K */
            placeholder="johndoe@gmail.com"
            required
            disabled={isLoading}
          />

          <FormField
            id="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />

          {error && <ErrorMessage message={error} />}

          {/* COMMENTED OUT: Removed demo credentials display - using LIVE Supabase authentication only
          <DemoCredentials />
          */}
          
          <button 
            type="submit" 
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * Form Field Component
 */
const FormField = ({ id, type, label, value, onChange, placeholder, required, disabled }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      disabled={disabled}
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
 * COMMENTED OUT: DemoCredentials component removed
 * OLD CODE: Previously displayed mock credentials
 * NEW: Using LIVE Supabase authentication - no mock data displayed
 
const DemoCredentials = () => (
  <div className="demo-credentials">
    <p><strong>Admin Login:</strong></p>
    <p>Email: mclaughlinyan04@gmail.com</p>
    <p>Password: Your Supabase password</p>
  </div>
);
*/

export default Header;