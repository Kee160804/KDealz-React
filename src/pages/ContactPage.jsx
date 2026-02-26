import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/ContactPage.css';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const CONTACT_CONFIG = {
  phoneNumbers: ['614-1502', '611-1904'],
  whatsappNumber: '+1 (800) 123-4567',
  email: 'mclaughlinkyan04@gmail.com',
  businessHours: [
    { day: "Monday - Friday", time: "8:00 AM - 9:00 PM" },
    { day: "Saturday", time: "9:00 AM - 6:00 PM" },
    { day: "Sunday", time: "10:00 AM - 4:00 PM" }
  ],
  socialLinks: [
    { icon: '📱', name: 'Instagram', link: '#' },
    { icon: '📘', name: 'Facebook', link: '#' },
    { icon: '🐦', name: 'Twitter', link: '#' },
    { icon: '📹', name: 'TikTok', link: '#' }
  ],
  mapConfig: {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3443.4229028221234!2d-88.2060930753705!3d17.50244449948148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDMwJzE1LjgiTiA4OMKwMTInMjkuOCJX!5e1!3m2!1sen!2sbz!4v1769018436225!5m2!1sen!2sbz",
    directionsUrl: "https://maps.app.goo.gl/NXMLY7G3h9Xjhsg1A",
    address: "Mckay Boulevard, Belize City"
  }
};

// ============================================================================
// MAIN CONTACT PAGE COMPONENT
// ============================================================================

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

  // Add visual effects on mount
  useEffect(() => {
    document.body.classList.add('contact-page-loaded');
    return () => document.body.classList.remove('contact-page-loaded');
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
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
  }, [formData]);

  const toggleFAQ = useCallback((id) => {
    setActiveFAQ(prev => prev === id ? null : id);
  }, []);

  // Memoized FAQ items
  const faqItems = useMemo(() => [
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
  ], []);

  return (
    <div className="contact-page">
      <BackgroundElements />
      
      <main className="contact-main">
        <HeroSection />
        
        <div className="contact-content">
          {/* Left Column - Contact Info */}
          <ContactInfoSection />
          
          {/* Right Column - Contact Form */}
          <ContactFormSection 
            formData={formData}
            isSubmitting={isSubmitting}
            submitSuccess={submitSuccess}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>

        <MapSection />
        <FAQSection 
          faqItems={faqItems}
          activeFAQ={activeFAQ}
          onToggleFAQ={toggleFAQ}
        />
      </main>
    </div>
  );
};

// ============================================================================
// BACKGROUND ELEMENTS
// ============================================================================

const BackgroundElements = () => (
  <div className="background-elements">
    <div className="bg-circle circle-1"></div>
    <div className="bg-circle circle-2"></div>
    <div className="bg-circle circle-3"></div>
  </div>
);

// ============================================================================
// HERO SECTION
// ============================================================================

const HeroSection = () => (
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
      <HeroDecoration />
    </div>
  </section>
);

const HeroDecoration = () => (
  <div className="hero-decoration">
    <div className="decoration-dot dot-1"></div>
    <div className="decoration-dot dot-2"></div>
    <div className="decoration-dot dot-3"></div>
  </div>
);

// ============================================================================
// CONTACT INFO SECTION
// ============================================================================

const ContactInfoSection = () => (
  <div className="contact-info-section">
    <ContactInfoCard />
  </div>
);

const ContactInfoCard = () => (
  <div className="contact-info-wrapper">
    <section className="contact-section card">
      <SectionHeader 
        icon="💬" 
        title="Contact Information" 
      />
      
      <ContactMethodsGrid />
      <BusinessHours />
      <SocialLinks />
    </section>
  </div>
);

const ContactMethodsGrid = () => (
  <div className="contact-methods-grid">
    <ContactMethod 
      title="Call Us Directly"
      hours="Mon-Sat: 8am-9pm"
      details={CONTACT_CONFIG.phoneNumbers}
      icon="📞"
      color="call"
    />
    <ContactMethod 
      title="WhatsApp Chat"
      hours="24/7 Chat Support"
      details={[CONTACT_CONFIG.whatsappNumber]}
      icon="💬"
      linkText="Start Chat"
      link={`https://wa.me/${CONTACT_CONFIG.whatsappNumber.replace(/\D/g, '')}`}
      color="whatsapp"
    />
    <ContactMethod 
      title="Email Support"
      hours="Response within 24 hours"
      details={[CONTACT_CONFIG.email]}
      icon="📧"
      linkText="Send Email"
      link={`mailto:${CONTACT_CONFIG.email}`}
      color="email"
    />
  </div>
);

const ContactMethod = ({ title, hours, details, icon, linkText, link, color }) => (
  <div className={`contact-method ${color || ''}`}>
    <MethodIcon icon={icon} />
    <div className="method-content">
      <h4>{title}</h4>
      {hours && <p className="method-hours">{hours}</p>}
      {details.map((detail, index) => (
        <p key={index} className="method-detail">{detail}</p>
      ))}
      {link && linkText && <MethodLink href={link} text={linkText} />}
    </div>
  </div>
);

const MethodIcon = ({ icon }) => (
  <div className="method-icon-wrapper">
    <div className="method-icon">{icon}</div>
    <div className="icon-pulse"></div>
  </div>
);

const MethodLink = ({ href, text }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="method-link">
    {text} <span className="link-arrow">→</span>
  </a>
);

const BusinessHours = () => (
  <div className="business-hours card">
    <div className="hours-header">
      <h3>Business Hours</h3>
      <LiveIndicator />
    </div>
    <div className="hours-grid">
      {CONTACT_CONFIG.businessHours.map((schedule, index) => (
        <HoursRow key={index} schedule={schedule} />
      ))}
    </div>
  </div>
);

const LiveIndicator = () => (
  <div className="live-indicator">
    <span className="live-dot"></span>
    Open Now
  </div>
);

const HoursRow = ({ schedule }) => (
  <div className="hours-row">
    <div className="hours-day">
      <span className="day-dot"></span>
      {schedule.day}
    </div>
    <div className="hours-time">{schedule.time}</div>
  </div>
);

const SocialLinks = () => (
  <div className="social-links">
    <h4>Follow Us</h4>
    <div className="social-icons">
      {CONTACT_CONFIG.socialLinks.map((social, index) => (
        <SocialIcon key={index} social={social} index={index} />
      ))}
    </div>
  </div>
);

const SocialIcon = ({ social, index }) => (
  <a 
    href={social.link}
    className="social-icon"
    aria-label={social.name}
    style={{'--i': index}}
  >
    <span className="social-emoji">{social.icon}</span>
    <span className="social-tooltip">{social.name}</span>
  </a>
);

// ============================================================================
// CONTACT FORM SECTION
// ============================================================================

const ContactFormSection = ({ formData, isSubmitting, submitSuccess, onChange, onSubmit }) => (
  <div className="contact-form-section">
    <div className="contact-form-wrapper">
      <section className="form-section card" id="contact-form">
        <FormHeader />
        
        <form onSubmit={onSubmit} className="contact-form">
          <div className="form-row">
            <FormInput
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              required
            />
            <FormInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              required
            />
          </div>

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            required
          />

          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
          />

          <SubjectSelect 
            value={formData.subject} 
            onChange={onChange} 
          />

          <MessageTextarea 
            value={formData.message} 
            onChange={onChange} 
          />

          <FormFooter 
            isSubmitting={isSubmitting}
            submitSuccess={submitSuccess}
          />
        </form>
      </section>
    </div>
  </div>
);

const FormHeader = () => (
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
);

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

const SubjectSelect = ({ value, onChange }) => (
  <div className="form-group select-group">
    <label htmlFor="subject">Subject *</label>
    <div className="select-wrapper">
      <select
        id="subject"
        name="subject"
        value={value}
        onChange={onChange}
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
);

const MessageTextarea = ({ value, onChange }) => (
  <div className="form-group textarea-group">
    <label htmlFor="message">Your Message *</label>
    <div className="textarea-wrapper">
      <textarea
        id="message"
        name="message"
        value={value}
        onChange={onChange}
        required
        placeholder="Tell us how we can help you..."
        rows={6}
        className="form-textarea"
      />
      <div className="textarea-counter">{value.length}/500</div>
    </div>
  </div>
);

const FormFooter = ({ isSubmitting, submitSuccess }) => (
  <div className="form-footer">
    <SubmitButton 
      isSubmitting={isSubmitting}
      submitSuccess={submitSuccess}
    />
    
    <FormFeatures />
    
    <p className="form-note">
      By submitting, you agree to our Privacy Policy. 
      We promise not to spam you!
    </p>
  </div>
);

const SubmitButton = ({ isSubmitting, submitSuccess }) => (
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
);

const FormFeatures = () => {
  const features = [
    { icon: '🔒', text: 'Secure & Encrypted' },
    { icon: '⚡', text: 'Fast Response' },
    { icon: '👥', text: '24/7 Support' }
  ];

  return (
    <div className="form-features">
      {features.map((feature, index) => (
        <div key={index} className="feature-item">
          <span className="feature-icon">{feature.icon}</span>
          <span className="feature-text">{feature.text}</span>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// MAP SECTION
// ============================================================================

const MapSection = () => (
  <section className="map-section card">
    <div className="map-container">
      <MapHeader />
      
      <div className="map-content">
        <GoogleMap />
        <MapInfo />
      </div>
    </div>
  </section>
);

const MapHeader = () => (
  <div className="map-header">
    <h2>Our Location</h2>
    <p className="map-subtitle">Visit us at {CONTACT_CONFIG.mapConfig.address}</p>
  </div>
);

const GoogleMap = () => (
  <div className="google-map">
    <iframe
      title="KaribbeanDealz Location"
      src={CONTACT_CONFIG.mapConfig.embedUrl}
      width="100%"
      height="450"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
);

const MapInfo = () => (
  <div className="map-info">
    <div className="map-address">
      <h3>Address Details</h3>
      <div className="address-details">
        <AddressItem 
          icon="⏰"
          title="Store Hours"
          text="Mon-Sat: 8:00 AM - 9:00 PM<br/>Sun: 10:00 AM - 4:00 PM"
        />
      </div>
    </div>
    
    <MapActions />
  </div>
);

const AddressItem = ({ icon, title, text }) => (
  <div className="address-item">
    <span className="address-icon">{icon}</span>
    <div className="address-text">
      <strong>{title}</strong>
      <p dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  </div>
);

const MapActions = () => (
  <div className="map-actions">
    <MapActionButton 
      type="primary"
      icon="🗺️"
      text="Open in Google Maps"
      href={CONTACT_CONFIG.mapConfig.directionsUrl}
      showArrow
    />
    <MapActionButton 
      type="secondary"
      icon="🚗"
      text="Get Directions"
      href={`${CONTACT_CONFIG.mapConfig.directionsUrl}?dirflg=d`}
    />
  </div>
);

const MapActionButton = ({ type, icon, text, href, showArrow }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`map-action-btn ${type}`}
  >
    <span className="action-icon">{icon}</span>
    <span className="action-text">{text}</span>
    {showArrow && <span className="action-arrow">→</span>}
  </a>
);

// ============================================================================
// FAQ SECTION
// ============================================================================

const FAQSection = ({ faqItems, activeFAQ, onToggleFAQ }) => (
  <section className="faq-section-horizontal card">
    <FAQHeader />
    
    <div className="faq-horizontal-grid">
      {faqItems.map((item, index) => (
        <FAQItem 
          key={item.id}
          item={item}
          index={index}
          isActive={activeFAQ === item.id}
          onToggle={onToggleFAQ}
        />
      ))}
    </div>
    
    <FAQFooter />
  </section>
);

const FAQHeader = () => (
  <div className="faq-horizontal-header">
    <h2>Frequently Asked Questions</h2>
    <p className="faq-horizontal-subtitle">
      Quick answers to common questions about KaribbeanDealz
    </p>
  </div>
);

const FAQItem = ({ item, index, isActive, onToggle }) => (
  <div 
    className={`faq-horizontal-item ${isActive ? 'active' : ''}`}
    style={{'--delay': index * 0.1 + 's'}}
  >
    <FAQQuestion 
      item={item} 
      isActive={isActive} 
      onToggle={() => onToggle(item.id)} 
    />
    <FAQAnswer item={item} isActive={isActive} />
  </div>
);

const FAQQuestion = ({ item, isActive, onToggle }) => (
  <div className="faq-horizontal-question" onClick={onToggle}>
    <div className="faq-horizontal-number">0{item.id}</div>
    <div className="faq-horizontal-content">
      <h4>{item.question}</h4>
      <FAQIcon isActive={isActive} />
    </div>
  </div>
);

const FAQIcon = ({ isActive }) => (
  <div className="faq-horizontal-icon">
    <div className={`faq-horizontal-plus ${isActive ? 'active' : ''}`}>
      <span className="faq-horizontal-line"></span>
    </div>
  </div>
);

const FAQAnswer = ({ item, isActive }) => (
  <div className={`faq-horizontal-answer ${isActive ? 'expanded' : ''}`}>
    <div className="faq-horizontal-answer-content">
      <p>{item.answer}</p>
      {item.id === 6 && <FAQContactCTA />}
    </div>
  </div>
);

const FAQContactCTA = () => (
  <a href="#contact-form" className="faq-contact-cta">
    Contact Sales Team →
  </a>
);

const FAQFooter = () => (
  <div className="faq-footer">
    <p>Still have questions?</p>
    <a href="#contact-form" className="faq-contact-link">
      Send us a message directly →
    </a>
  </div>
);

// ============================================================================
// SECTION HEADER COMPONENT
// ============================================================================

const SectionHeader = ({ icon, title }) => (
  <div className="section-header">
    <h2 className="section-title">
      <span className="title-icon">{icon}</span>
      {title}
    </h2>
  </div>
);

export default ContactPage;