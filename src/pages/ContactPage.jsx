import React, { useState, useEffect } from 'react';
import '../styles/ContactPage.css';

// Reusable Contact Method Component with hover effects
const ContactMethod = ({ title, hours, details, icon, linkText, link, color }) => (
  <div className={`contact-method ${color || ''}`}>
    <div className="method-icon-wrapper">
      <div className="method-icon">{icon}</div>
      <div className="icon-pulse"></div>
    </div>
    <div className="method-content">
      <h4>{title}</h4>
      {hours && <p className="method-hours">{hours}</p>}
      {details.map((detail, index) => (
        <p key={index} className="method-detail">{detail}</p>
      ))}
      {link && linkText && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="method-link"
        >
          {linkText}
          <span className="link-arrow">→</span>
        </a>
      )}
    </div>
  </div>
);

// Reusable Form Input Component with floating labels
const FormInput = ({ label, type = "text", name, value, onChange, required }) => (
  <div className="form-group floating">
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="form-input"
      placeholder=" "
    />
    <label htmlFor={name} className="floating-label">{label}</label>
    <div className="input-underline"></div>
  </div>
);

// Animated FAQ Item Component
const FAQItem = ({ item, isActive, onClick, index }) => (
  <div className={`faq-item ${isActive ? 'active' : ''}`} style={{'--delay': index * 0.1 + 's'}}>
    <div className="faq-question" onClick={onClick}>
      <div className="faq-question-content">
        <span className="faq-number">0{item.id}</span>
        <span className="faq-text">{item.question}</span>
      </div>
      <div className="faq-icon">
        <div className={`faq-plus ${isActive ? 'active' : ''}`}>
          <span className="vertical"></span>
          <span className="horizontal"></span>
        </div>
      </div>
    </div>
    <div className={`faq-answer ${isActive ? 'expanded' : ''}`}>
      <div className="answer-content">
        <p>{item.answer}</p>
      </div>
    </div>
  </div>
);

// Social Links Component
const SocialLinks = () => (
  <div className="social-links">
    <h4>Follow Us</h4>
    <div className="social-icons">
      {[
        { icon: '📱', name: 'Instagram', link: '#' },
        { icon: '📘', name: 'Facebook', link: '#' },
        { icon: '🐦', name: 'Twitter', link: '#' },
        { icon: '📹', name: 'TikTok', link: '#' },
      ].map((social, index) => (
        <a 
          key={index}
          href={social.link}
          className="social-icon"
          aria-label={social.name}
          style={{'--i': index}}
        >
          <span className="social-emoji">{social.icon}</span>
          <span className="social-tooltip">{social.name}</span>
        </a>
      ))}
    </div>
  </div>
);

// Contact Info Card Component
const ContactInfoCard = () => (
  <div className="contact-info-wrapper">
    <section className="contact-section card">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon">💬</span>
          Contact Information
        </h2>
      </div>

      {/* Contact Methods with Color Coding */}
      <div className="contact-methods-grid">
        <ContactMethod 
          title="Call Us Directly"
          hours="Mon-Sat: 8am-9pm"
          details={["614-1502", "611-1904"]}
          icon="📞"
          color="call"
        />

        <ContactMethod 
          title="WhatsApp Chat"
          hours="24/7 Chat Support"
          details={["+1 (800) 123-4567"]}
          icon="💬"
          linkText="Start Chat"
          link="https://wa.me/18001234567"
          color="whatsapp"
        />

        <ContactMethod 
          title="Email Support"
          hours="Response within 24 hours"
          details={["mclaughlinkyan04@gmail.com"]}
          icon="📧"
          linkText="Send Email"
          link="mailto:mclaughlinkyan04@gmail.com"
          color="email"
        />
      </div>

      {/* Business Hours in Card */}
      <div className="business-hours card">
        <div className="hours-header">
          <h3>Business Hours</h3>
          <div className="live-indicator">
            <span className="live-dot"></span>
            Open Now
          </div>
        </div>
        <div className="hours-grid">
          {[
            { day: "Monday - Friday", time: "8:00 AM - 9:00 PM" },
            { day: "Saturday", time: "9:00 AM - 6:00 PM" },
            { day: "Sunday", time: "10:00 AM - 4:00 PM" }
          ].map((schedule, index) => (
            <div key={index} className="hours-row">
              <div className="hours-day">
                <span className="day-dot"></span>
                {schedule.day}
              </div>
              <div className="hours-time">{schedule.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <SocialLinks />
    </section>
  </div>
);

// Main ContactPage Component
const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [activeFAQ, setActiveFAQ] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Add some visual effects on mount
    document.body.classList.add('contact-page-loaded');
    return () => {
      document.body.classList.remove('contact-page-loaded');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Contact form submitted:', formData);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitSuccess(false);
    }, 3000);
  };

  const faqItems = [
    {
      id: 1,
      question: "What are your shipping options and delivery times?",
      answer: "We offer standard shipping (5-7 business days), express shipping (2-3 business days), and same-day delivery for Belize City metro area (orders placed before 2pm)."
    },
    {
      id: 2,
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of purchase. Items must be unopened and in original packaging. Refunds are processed within 5-7 business days after we receive the returned items."
    },
    {
      id: 3,
      question: "Do you offer international shipping?",
      answer: "Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days depending on the destination."
    },
    {
      id: 4,
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account on our website."
    },
    {
      id: 5,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. We also offer installment plans through select providers."
    },
    {
      id: 6,
      question: "Do you offer wholesale pricing?",
      answer: "Yes! We offer special wholesale pricing for businesses and retailers. Contact our sales team for more information and to set up a wholesale account."
    }
  ];

  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  return (
    <div className="contact-page">
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>

      <main className="contact-main">
        {/* Hero Section with Animation */}
        <section className="contact-hero">
          <div className="hero-content">
            <div className="hero-text-wrapper">
              <h1 className="hero-title">
                <span className="title-line">Get in Touch</span>
                <span className="title-line highlight">With KaribbeanDealz</span>
              </h1>
              <p className="hero-subtitle">
                Your questions, feedback, and inquiries are important to us. 
                Let's connect and create something beautiful together!
              </p>
            </div>
            <div className="hero-decoration">
              <div className="decoration-dot dot-1"></div>
              <div className="decoration-dot dot-2"></div>
              <div className="decoration-dot dot-3"></div>
            </div>
          </div>
        </section>

        <div className="contact-content">
          {/* Left Column - Contact Info */}
          <div className="contact-info-section">
            <ContactInfoCard />
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact-form-section">
            <div className="contact-form-wrapper">
              <section className="form-section card" id="contact-form">
                <div className="form-header">
                  <h3 className="form-title">
                    Send Your Message
                    <span className="form-subtitle">We'll respond within 24 hours</span>
                  </h3>
                  <div className="form-steps">
                    <div className="step active">1. Fill Form</div>
                    <div className="step">2. Review</div>
                    <div className="step">3. Send</div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <FormInput
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <FormInput
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <FormInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <div className="form-group select-group">
                    <label htmlFor="subject">Subject *</label>
                    <div className="select-wrapper">
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="form-select"
                      >
                        <option value="">Select a subject</option>
                        <option value="order">Order Inquiry</option>
                        <option value="shipping">Shipping Questions</option>
                        <option value="returns">Returns & Refunds</option>
                        <option value="product">Product Information</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="select-arrow"></div>
                    </div>
                  </div>

                  <div className="form-group textarea-group">
                    <label htmlFor="message">Your Message *</label>
                    <div className="textarea-wrapper">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        className="form-textarea"
                      />
                      <div className="textarea-counter">
                        {formData.message.length}/500
                      </div>
                    </div>
                  </div>

                  <div className="form-footer">
                    <button 
                      type="submit" 
                      className={`submit-btn ${isSubmitting ? 'submitting' : ''} ${submitSuccess ? 'success' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner"></span>
                          Sending...
                        </>
                      ) : submitSuccess ? (
                        <>
                          <span className="success-icon">✓</span>
                          Message Sent!
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                    
                    <div className="form-features">
                      <div className="feature-item">
                        <span className="feature-icon">🔒</span>
                        <span className="feature-text">Secure & Encrypted</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">⚡</span>
                        <span className="feature-text">Fast Response</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">👥</span>
                        <span className="feature-text">24/7 Support</span>
                      </div>
                    </div>
                    
                    <p className="form-note">
                      By submitting, you agree to our Privacy Policy. 
                      We promise not to spam you!
                    </p>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
{/* Map Section */}
<section className="map-section card">
  <div className="map-container">
    <div className="map-header">
      <h2>Our Location</h2>
      <p className="map-subtitle">Visit us at Mckay Boulevard, Belize City</p>
    </div>
    
    <div className="map-content">
      {/* Google Maps Embed */}
      <div className="google-map">
        <iframe
          title="KaribbeanDealz Location"
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3443.4229028221234!2d-88.2060930753705!3d17.50244449948148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDMwJzE1LjgiTiA4OMKwMTInMjkuOCJX!5e1!3m2!1sen!2sbz!4v1769018436225!5m2!1sen!2sbz"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      
      <div className="map-info">
        <div className="map-address">
          <h3>Address Details</h3>
          <div className="address-details">
            <div className="address-item">
              <span className="address-icon">⏰</span>
              <div className="address-text">
                <strong>Store Hours</strong>
                <p>Mon-Sat: 8:00 AM - 9:00 PM<br/>Sun: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="map-actions">
          <a 
            href="https://maps.app.goo.gl/NXMLY7G3h9Xjhsg1A"
            target="_blank"
            rel="noopener noreferrer"
            className="map-action-btn primary"
          >
            <span className="action-icon">🗺️</span>
            <span className="action-text">Open in Google Maps</span>
            <span className="action-arrow">→</span>
          </a>
          <a 
            href="https://maps.app.goo.gl/NXMLY7G3h9Xjhsg1A?dirflg=d"
            target="_blank"
            rel="noopener noreferrer"
            className="map-action-btn secondary"
          >
            <span className="action-icon">🚗</span>
            <span className="action-text">Get Directions</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
        {/* Horizontal FAQ Section */}
        <section className="faq-section-horizontal card">
          <div className="faq-horizontal-header">
            <h2>Frequently Asked Questions</h2>
            <p className="faq-horizontal-subtitle">Quick answers to common questions about KaribbeanDealz</p>
          </div>
          
          <div className="faq-horizontal-grid">
            {faqItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`faq-horizontal-item ${activeFAQ === item.id ? 'active' : ''}`}
                style={{'--delay': index * 0.1 + 's'}}
              >
                <div 
                  className="faq-horizontal-question" 
                  onClick={() => toggleFAQ(item.id)}
                >
                  <div className="faq-horizontal-number">0{item.id}</div>
                  <div className="faq-horizontal-content">
                    <h4>{item.question}</h4>
                    <div className="faq-horizontal-icon">
                      <div className={`faq-horizontal-plus ${activeFAQ === item.id ? 'active' : ''}`}>
                        <span className="faq-horizontal-line"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`faq-horizontal-answer ${activeFAQ === item.id ? 'expanded' : ''}`}>
                  <div className="faq-horizontal-answer-content">
                    <p>{item.answer}</p>
                    {item.id === 6 && (
                      <a href="#contact-form" className="faq-contact-cta">
                        Contact Sales Team →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="faq-footer">
            <p>Still have questions?</p>
            <a href="#contact-form" className="faq-contact-link">
              Send us a message directly →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;