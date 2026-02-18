// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Cart from './Cart';
// import '../styles/Header.css';

// const Header = ({ cart, getCartTotal, getCartCount, removeFromCart, updateQuantity }) => {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <header className="header">
//       <nav className="navbar">
//         <button 
//           className="menu-toggle"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           aria-label="Toggle menu"
//         >
//           ☰
//         </button>

//         <div className="logo">
//           <Link to="/">🛍️ Karibbean Dealz</Link>
//         </div>

//         <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
//           <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
//           <Link to="/products" onClick={() => setIsMenuOpen(false)}>All Products</Link>
//           <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
//         </div>

//         <div className="header-actions">
//           <button 
//             className="cart-btn"
//             onClick={() => setIsCartOpen(!isCartOpen)}
//             aria-label="Open cart"
//           >
//             <span className="cart-icon">🛒</span>
//             {getCartCount() > 0 && (
//               <span className="cart-count">{getCartCount()}</span>
//             )}
//             <span className="cart-total-mini">${getCartTotal().toFixed(2)}</span>
//           </button>

//           {isCartOpen && (
//             <Cart 
//               cart={cart}
//               getCartTotal={getCartTotal}
//               removeFromCart={removeFromCart}
//               updateQuantity={updateQuantity}
//               onClose={() => setIsCartOpen(false)}
//             />
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;






// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Cart from './Cart';
// import '../styles/Header.css';

// const Header = ({ cart, getCartTotal, getCartCount, removeFromCart, updateQuantity, user, onLogin, onLogout }) => {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [loginForm, setLoginForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     try {
//       // For demo purposes, hardcoded admin credentials
//       // In production, this should be replaced with actual authentication
//       if (loginForm.email === 'admin@karibbean.com' && loginForm.password === 'admin123') {
//         onLogin({
//           email: loginForm.email,
//           role: 'admin',
//           name: 'Admin User'
//         });
//         setIsLoginModalOpen(false);
//         setLoginForm({ email: '', password: '' });
//       } else {
//         setError('Invalid credentials');
//       }
//     } catch (err) {
//       setError('Login failed. Please try again.');
//     }
//   };

//   const handleLogout = () => {
//     onLogout();
//     setIsMenuOpen(false);
//   };

//   return (
//     <header className="header">
//       <nav className="navbar">
//         <button 
//           className="menu-toggle"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           aria-label="Toggle menu"
//         >
//           ☰
//         </button>

//         <div className="logo">
//           <Link to="/">🛍️ Karibbean Dealz</Link>
//         </div>

//         <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
//           <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
//           <Link to="/products" onClick={() => setIsMenuOpen(false)}>All Products</Link>
//           <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
          
//           {/* Admin link - only visible to logged in admin users */}
//           {user?.role === 'admin' && (
//             <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="admin-link">
//               Admin Dashboard
//             </Link>
//           )}
//         </div>

//         <div className="header-actions">
//           {/* Login/User Section */}
//           <div className="user-section">
//             {user ? (
//               <div className="user-menu">
//                 <span className="user-greeting">Hi, {user.name}</span>
//                 <button onClick={handleLogout} className="logout-btn">
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <button 
//                 className="login-btn"
//                 onClick={() => setIsLoginModalOpen(true)}
//               >
//                 <span className="login-icon">👤</span>
//                 <span className="login-text">Admin Login</span>
//               </button>
//             )}
//           </div>

//           {/* Cart Button */}
//           <button 
//             className="cart-btn"
//             onClick={() => setIsCartOpen(!isCartOpen)}
//             aria-label="Open cart"
//           >
//             <span className="cart-icon">🛒</span>
//             {getCartCount() > 0 && (
//               <span className="cart-count">{getCartCount()}</span>
//             )}
//             <span className="cart-total-mini">${getCartTotal().toFixed(2)}</span>
//           </button>

//           {/* Cart Dropdown */}
//           {isCartOpen && (
//             <Cart 
//               cart={cart}
//               getCartTotal={getCartTotal}
//               removeFromCart={removeFromCart}
//               updateQuantity={updateQuantity}
//               onClose={() => setIsCartOpen(false)}
//             />
//           )}
//         </div>
//       </nav>

//       {/* Login Modal */}
//       {isLoginModalOpen && (
//         <div className="modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
//           <div className="login-modal" onClick={(e) => e.stopPropagation()}>
//             <button className="modal-close" onClick={() => setIsLoginModalOpen(false)}>×</button>
//             <h2>Admin Login</h2>
//             <p className="modal-subtitle">Access your admin dashboard</p>
            
//             <form onSubmit={handleLogin} className="login-form">
//               <div className="form-group">
//                 <label htmlFor="email">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={loginForm.email}
//                   onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
//                   required
//                   placeholder="admin@karibbean.com"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password">Password</label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={loginForm.password}
//                   onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
//                   required
//                   placeholder="••••••••"
//                 />
//               </div>

//               {error && <div className="error-message">{error}</div>}

//               <div className="demo-credentials">
//                 <p><strong>Demo Credentials:</strong></p>
//                 <p>Email: admin@karibbean.com</p>
//                 <p>Password: admin123</p>
//               </div>

//               <button type="submit" className="login-submit-btn">
//                 Login as Admin
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;






import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import '../styles/Header.css';

const Header = ({ cart, getCartTotal, getCartCount, removeFromCart, updateQuantity, user, onLogin, onLogout }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // For demo purposes, hardcoded admin credentials
      // In production, this should be replaced with actual authentication
      if (loginForm.email === 'admin@karibbean.com' && loginForm.password === 'admin123') {
        onLogin({
          email: loginForm.email,
          role: 'admin',
          name: 'Admin User'
        });
        setIsLoginModalOpen(false);
        setLoginForm({ email: '', password: '' });
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };

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
          {/* Cart Button - Now comes first */}
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

          {/* Login/User Section - Now comes after cart */}
          <div className="user-section">
            {user ? (
              <div className="user-menu">
                <span className="user-greeting">Hi, {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <button 
                className="login-btn"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <span className="login-icon">👤</span>
                <span className="login-text">Admin Login</span>
              </button>
            )}
          </div>

          {/* Admin link - Now appears last in the mobile menu */}
          {user?.role === 'admin' && (
            <div className="admin-link-container">
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="admin-link">
                Admin Dashboard
              </Link>
            </div>
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
        <div className="modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsLoginModalOpen(false)}>×</button>
            <h2>Admin Login</h2>
            <p className="modal-subtitle">Access your admin dashboard</p>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                  placeholder="admin@karibbean.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  placeholder="••••••••"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="demo-credentials">
                <p><strong>Demo Credentials:</strong></p>
                <p>Email: admin@karibbean.com</p>
                <p>Password: admin123</p>
              </div>

              <button type="submit" className="login-submit-btn">
                Login as Admin
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;