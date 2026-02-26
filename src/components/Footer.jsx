import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

/**
 * Footer Component
 * Displays site-wide footer with navigation links, contact info, and social media
 * Automatically updates copyright year
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <BrandSection />
        <CategoryLinks />
        <CustomerServiceLinks />
        <ContactInfo />
      </div>
      
      <FooterBottom currentYear={currentYear} />
    </footer>
  );
};

/**
 * Brand Section Subcomponent
 * Displays logo, description, and social media links
 */
const BrandSection = () => (
  <div className="footer-section">
    <h3>🛍️ Karibbean Dealz</h3>
    <p className="brand-description">
      Your one-stop shop for fashion, electronics, beauty, and more. 
      Premium quality with seamless shopping experience.
    </p>
    <SocialLinks />
  </div>
);

/**
 * Social Media Links Subcomponent
 * Array-based rendering for maintainability
 */
const SocialLinks = () => {
  const socialPlatforms = [
    { icon: '📘', label: 'Facebook', url: '#' },
    { icon: '📸', label: 'Instagram', url: '#' },
    { icon: '🐦', label: 'Twitter', url: '#' },
    { icon: '📌', label: 'Pinterest', url: '#' }
  ];

  return (
    <div className="social-links" aria-label="Social media links">
      {socialPlatforms.map(({ icon, label, url }) => (
        <a 
          key={label}
          href={url} 
          aria-label={label}
          rel="noopener noreferrer"
        >
          {icon}
        </a>
      ))}
    </div>
  );
};

/**
 * Category Links Subcomponent
 * Product category navigation
 */
const CategoryLinks = () => {
  const categories = [
    { name: 'mens-clothing', label: "Men's Clothing" },
    { name: 'womens-clothing', label: "Women's Clothing" },
    { name: 'electronics', label: 'Electronics' },
    { name: 'beauty', label: 'Beauty & Fragrance' },
    { name: 'footwear', label: 'Footwear' },
    { name: 'accessories', label: 'Accessories' }
  ];

  return (
    <div className="footer-section">
      <h4>Shop Categories</h4>
      <nav aria-label="Category navigation">
        <ul>
          {categories.map(({ name, label }) => (
            <li key={name}>
              <Link to={`/category/${name}`}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

/**
 * Customer Service Links Subcomponent
 * Help and policy pages navigation
 */
const CustomerServiceLinks = () => {
  const serviceLinks = [
    { to: '/contact', label: 'Contact Us' },
    { to: '/shipping', label: 'Shipping Policy' },
    { to: '/returns', label: 'Returns & Exchanges' },
    { to: '/faq', label: 'FAQ' },
    { to: '/size-guide', label: 'Size Guide' },
    { to: '/privacy', label: 'Privacy Policy' }
  ];

  return (
    <div className="footer-section">
      <h4>Customer Service</h4>
      <nav aria-label="Customer service navigation">
        <ul>
          {serviceLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

/**
 * Contact Information Subcomponent
 * Displays contact details and hours
 */
const ContactInfo = () => {
  const contactDetails = [
    { icon: '📧', text: 'Email' },
    { icon: '📱', text: '+1-555-STYLE-88' },
    { icon: '📍', text: 'Mckay Boulevard' },
    { icon: '🕒', text: 'Mon-Fri: 9AM-8PM' },
    { icon: '🕒', text: 'Sat-Sun: 10AM-6PM' }
  ];

  return (
    <div className="footer-section">
      <h4>Contact Info</h4>
      <address>
        <ul>
          {contactDetails.map(({ icon, text }, index) => (
            <li key={`contact-${index}`}>
              <span aria-hidden="true">{icon}</span> {text}
            </li>
          ))}
        </ul>
      </address>
    </div>
  );
};

/**
 * Footer Bottom Subcomponent
 * Copyright and legal information
 */
const FooterBottom = ({ currentYear }) => (
  <div className="footer-bottom">
    <p>&copy; {currentYear} KaribbeanDealz. All rights reserved.</p>
    <p className="disclaimer">
      Website for viewing and placing orders. Payment handled externally via WhatsApp.
    </p>
  </div>
);

export default Footer;