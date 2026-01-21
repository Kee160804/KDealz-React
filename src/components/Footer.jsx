import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🛍️ Karibbean Dealz</h3>
          <p>Your one-stop shop for fashion, electronics, beauty, and more. Premium quality with seamless shopping experience.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Pinterest">📌</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Shop Categories</h4>
          <ul>
            <li><Link to="/category/mens-clothing">Men's Clothing</Link></li>
            <li><Link to="/category/womens-clothing">Women's Clothing</Link></li>
            <li><Link to="/category/electronics">Electronics</Link></li>
            <li><Link to="/category/beauty">Beauty & Fragrance</Link></li>
            <li><Link to="/category/footwear">Footwear</Link></li>
            <li><Link to="/category/accessories">Accessories</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/shipping">Shipping Policy</Link></li>
            <li><Link to="/returns">Returns & Exchanges</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/size-guide">Size Guide</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul>
            <li>📧 Email</li>
            <li>📱 +1-555-STYLE-88</li>
            <li>📍 Mckay Boulevard</li>
            <li>🕒 Mon-Fri: 9AM-8PM</li>
            <li>🕒 Sat-Sun: 10AM-6PM</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} KaribbeanDealz. All rights reserved.</p>
        <p>Website for viewing and placing orders. Payment handled externally via WhatsApp.</p>
      </div>
    </footer>
  );
};

export default Footer;