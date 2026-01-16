
import React, { useState } from 'react';
import '../styles/ContactPage.css'; // ADD THIS LINE



// Reusable Contact Method Component
const ContactMethod = ({ title, hours, details, icon, linkText, link }) => (
  <div className="contact-method">
    <div className="method-icon">{icon}</div>
    <div className="method-content">
      <h4>{title}</h4>
      {hours && <p className="method-hours">{hours}</p>}
      {details.map((detail, index) => (
        <p key={index} className="method-detail">{detail}</p>
      ))}
      {link && linkText && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="method-link">
          {linkText}
        </a>
      )}
    </div>
  </div>
);

// Reusable Form Input Component
const FormInput = ({ label, type = "text", name, value, onChange, required }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="form-input"
    />
  </div>
);

// FAQ Item Component
const FAQItem = ({ item, isActive, onClick }) => (
  <div className={`faq-item ${isActive ? 'active' : ''}`}>
    <div className="faq-question" onClick={onClick}>
      <span>{item.question}</span>
      <span className="faq-arrow">{isActive ? '▲' : '▼'}</span>
    </div>
    {isActive && (
      <div className="faq-answer">
        <p>{item.answer}</p>
      </div>
    )}
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const faqItems = [
    {
      id: 1,
      question: "What are your shipping options and delivery times?",
      answer: "We offer standard shipping (5-7 business days), express shipping (2-3 business days), and same-day delivery for Kingston metro area (orders placed before 2pm)."
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
    }
  ];

  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  return (
    <div className="contact-page">
      <main className="contact-main">
        {/* Hero Section */}
        <section className="contact-hero">
          <h1>Contact Us</h1>
          <p className="hero-subtitle">Get in touch with our friendly team</p>
        </section>

        <div className="contact-content">
          {/* Left Column - Contact Info */}
          <div className="contact-info-section">
            <section className="contact-section">
              <h2>Get in Touch</h2>
              <p className="section-description">
                We'd love to hear from you! Whether you have questions about our products, 
                need assistance with an order, or just want to share your experience, 
                our team is here to help.
              </p>

              {/* Contact Methods */}
              <div className="contact-methods">
                <ContactMethod 
                  title="Call Us"
                  hours="Mon-Sat: 8am-9pm"
                  details={["614-1502", "611-1904"]}
                  icon="📞"
                />

                <ContactMethod 
                  title="WhatsApp"
                  hours="24/7 Chat Support"
                  details={["+1 (800) 123-4567"]}
                  icon="💬"
                  linkText="Chat Now"
                  link="https://wa.me/18001234567"
                />

                <ContactMethod 
                  title="Email"
                  hours="Response within 24 hours"
                  details={["support@KaribbeanDealz.com"]}
                  icon="📧"
                  linkText="Send Email"
                  link="mailto:support@KaribbeanDealz.com"
                />

                <ContactMethod 
                  title="Visit Us"
                  details={["123 Beauty Street", "Kingston, Jamaica"]}
                  icon="📍"
                  linkText="Get Directions"
                  link="https://maps.google.com/?q=123+Beauty+Street+Kingston+Jamaica"
                />
              </div>

              {/* Business Hours */}
              <div className="business-hours">
                <h3>Business Hours</h3>
                <div className="hours-grid">
                  <div className="hours-day">Monday - Friday</div>
                  <div className="hours-time">8:00 AM - 9:00 PM</div>
                  
                  <div className="hours-day">Saturday</div>
                  <div className="hours-time">9:00 AM - 6:00 PM</div>
                  
                  <div className="hours-day">Sunday</div>
                  <div className="hours-time">10:00 AM - 4:00 PM</div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
              <h3>Frequently Asked Questions</h3>
              <p className="faq-subtitle">Quick answers to common questions</p>
              
              <div className="faq-list">
                {faqItems.map(item => (
                  <FAQItem
                    key={item.id}
                    item={item}
                    isActive={activeFAQ === item.id}
                    onClick={() => toggleFAQ(item.id)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact-form-section">
            <section className="form-section">
              <h3>Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <FormInput
                    label="First Name *"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Last Name *"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <FormInput
                  label="Email Address *"
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

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
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
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;