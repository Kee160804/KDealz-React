import React, { useState, useEffect } from 'react';

// Reusable Contact Method Component with hover effects
const ContactMethod = ({ title, hours, details, icon, linkText, link, color }) => {
  const colorClasses = {
    call: 'bg-gradient-to-br from-blue-50 to-purple-50',
    whatsapp: 'bg-gradient-to-br from-green-50 to-lime-50',
    email: 'bg-gradient-to-br from-orange-50 to-yellow-50',
    visit: 'bg-gradient-to-br from-purple-50 to-indigo-50'
  };

  return (
    <div className={`flex items-start gap-6 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden hover:shadow-xl ${colorClasses[color] || ''}`}>
      <div className="relative flex-shrink-0">
        <div className="w-[60px] h-[60px] flex items-center justify-center bg-white rounded-full shadow-md relative z-10 text-3xl">
          {icon}
        </div>
        <div className="absolute top-0 left-0 w-[60px] h-[60px] bg-inherit rounded-full animate-ping opacity-20"></div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-xl font-semibold text-gray-800 mb-1">{title}</h4>
        {hours && <p className="text-blue-600 font-semibold text-sm mb-1">{hours}</p>}
        {details.map((detail, index) => (
          <p key={index} className="text-gray-600 my-1.5 text-base leading-relaxed break-words">
            {detail}
          </p>
        ))}
        {link && linkText && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 mt-4 text-blue-600 font-semibold text-base bg-blue-50 px-4 py-2 rounded-lg hover:gap-3 hover:bg-blue-100 hover:-translate-y-1 transition-all duration-300 group"
          >
            {linkText}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        )}
      </div>
    </div>
  );
};

// Reusable Form Input Component with floating labels
const FormInput = ({ label, type = "text", name, value, onChange, required }) => (
  <div className="relative mb-8 group">
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full pt-5 pb-2 px-0 border-0 border-b-2 border-gray-200 bg-transparent text-base transition-all duration-300 focus:border-blue-600 focus:outline-none"
      placeholder=" "
    />
    <label 
      htmlFor={name} 
      className={`absolute left-0 pointer-events-none transition-all duration-300 text-gray-400 text-base origin-left-top
        ${value ? '-translate-y-5 scale-85 text-blue-600' : 'top-5'}`}
    >
      {label}
    </label>
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 scale-x-0 transition-transform duration-300 group-focus-within:scale-x-100"></div>
  </div>
);

// Animated FAQ Item Component
const FAQItem = ({ item, isActive, onClick, index }) => {
  return (
    <div 
      className={`bg-gray-50 rounded-2xl overflow-hidden transition-all duration-300 border-2 animate-fadeInUp ${
        isActive ? 'border-blue-600 bg-white shadow-xl' : 'border-transparent hover:border-blue-600 hover:-translate-y-1 hover:shadow-xl'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="p-6 cursor-pointer flex gap-6 items-start group" onClick={onClick}>
        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          0{item.id}
        </div>
        <div className="flex-1 flex justify-between items-center gap-4">
          <h4 className="text-lg font-semibold text-gray-800 m-0 flex-1">{item.question}</h4>
          <div className={`w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isActive ? 'bg-blue-600 rotate-45' : ''
          }`}>
            <div className="relative w-4 h-4">
              <span className={`absolute w-full h-0.5 top-1/2 left-0 -translate-y-1/2 transition-all duration-300 ${
                isActive ? 'bg-white' : 'bg-blue-600'
              }`}></span>
              <span className={`absolute w-0.5 h-full top-0 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                isActive ? 'bg-white opacity-0' : 'bg-blue-600'
              }`}></span>
            </div>
          </div>
        </div>
      </div>
      <div className={`transition-all duration-500 overflow-hidden ${
        isActive ? 'max-h-[300px]' : 'max-h-0'
      }`}>
        <div className="pt-0 pb-6 pl-[88px] pr-6 text-gray-600 leading-relaxed">
          <p>{item.answer}</p>
          {item.id === 6 && (
            <a href="#contact-form" className="inline-flex items-center gap-2 mt-4 text-blue-600 font-semibold hover:gap-4 transition-all">
              Contact Sales Team →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Social Links Component
const SocialLinks = () => (
  <div className="mt-8 pt-8 border-t-2 border-gray-100">
    <h4 className="text-center text-gray-800 text-xl mb-6">Follow Us</h4>
    <div className="flex justify-center gap-4">
      {[
        { icon: '📱', name: 'Instagram', link: '#' },
        { icon: '📘', name: 'Facebook', link: '#' },
        { icon: '🐦', name: 'Twitter', link: '#' },
        { icon: '📹', name: 'TikTok', link: '#' },
      ].map((social, index) => (
        <a 
          key={index}
          href={social.link}
          className="relative w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 group animate-fadeInUp"
          style={{ animationDelay: `${index * 0.1}s` }}
          aria-label={social.name}
        >
          <span className="transition-transform duration-300 group-hover:scale-125">
            {social.icon}
          </span>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-md text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:-bottom-7 transition-all duration-300">
            {social.name}
          </span>
        </a>
      ))}
    </div>
  </div>
);

// Contact Info Card Component
const ContactInfoCard = () => (
  <div className="bg-white rounded-2xl p-8 shadow-lg border border-white/20 backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
    <div className="mb-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <span className="text-4xl">💬</span>
        Contact Information
      </h2>
    </div>

    {/* Contact Methods with Color Coding */}
    <div className="grid gap-6 my-8">
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
    <div className="bg-white rounded-xl p-6 shadow-md mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Business Hours</h3>
        <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
          <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
          Open Now
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {[
          { day: "Monday - Friday", time: "8:00 AM - 9:00 PM" },
          { day: "Saturday", time: "9:00 AM - 6:00 PM" },
          { day: "Sunday", time: "10:00 AM - 4:00 PM" }
        ].map((schedule, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3 text-gray-600">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              {schedule.day}
            </div>
            <div className="text-gray-800 font-medium">{schedule.time}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Social Links */}
    <SocialLinks />
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
    document.body.classList.add('animate-fadeIn');
    return () => {
      document.body.classList.remove('animate-fadeIn');
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
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Contact form submitted:', formData);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 overflow-x-hidden animate-fadeIn">
      
      {/* Animated Background Elements */}
      <div className="fixed w-full h-full pointer-events-none z-0">
        <div className="absolute w-[300px] h-[300px] top-[10%] left-[5%] rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-[40px] animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bottom-[10%] right-[10%] rounded-full bg-gradient-to-br from-blue-200/20 to-indigo-200/20 blur-[40px] animate-pulse animation-delay-1000"></div>
        <div className="absolute w-[200px] h-[200px] top-[50%] left-[80%] rounded-full bg-gradient-to-br from-green-200/20 to-teal-200/20 blur-[40px] animate-pulse animation-delay-2000"></div>
      </div>

      <main className="relative z-10">
        {/* Hero Section with Animation */}
        <section className="pt-16 pb-8 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fadeInUp">
              <span className="block text-gray-800">Get in Touch</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                With KaribbeanDealz
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed animate-fadeInUp animation-delay-200">
              Your questions, feedback, and inquiries are important to us. 
              Let's connect and create something beautiful together!
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse animation-delay-400"></div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Contact Info */}
          <div className="animate-fadeInUp">
            <ContactInfoCard />
          </div>

          {/* Right Column - Contact Form */}
          <div className="animate-fadeInUp animation-delay-200">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-white/20 backdrop-blur-sm sticky top-8">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  Send Your Message
                  <span className="block text-base font-normal text-gray-600 mt-2">
                    We'll respond within 24 hours
                  </span>
                </h3>
                <div className="flex gap-4 mt-6">
                  <div className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all">
                    1. Fill Form
                  </div>
                  <div className="flex-1 text-center py-2 bg-gray-100 text-gray-400 rounded-lg text-sm">
                    2. Review
                  </div>
                  <div className="flex-1 text-center py-2 bg-gray-100 text-gray-400 rounded-lg text-sm">
                    3. Send
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

                <div className="relative mb-8">
                  <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">
                    Subject *
                  </label>
                  <div className="relative group">
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-700 text-base appearance-none cursor-pointer transition-colors duration-300 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="shipping">Shipping Questions</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="product">Product Information</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 border-r-2 border-b-2 border-gray-400 rotate-45 pointer-events-none transition-transform duration-300 group-focus-within:-rotate-135"></div>
                  </div>
                </div>

                <div className="relative mb-8">
                  <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                    Your Message *
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base resize-y transition-colors duration-300 focus:border-blue-600 focus:outline-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {formData.message.length}/500
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-4 px-8 rounded-xl text-lg font-semibold text-white flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden
                      ${isSubmitting ? 'bg-gradient-to-r from-gray-400 to-gray-300' : 
                        submitSuccess ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                        'bg-gradient-to-r from-blue-600 to-purple-600 hover:-translate-y-1 hover:shadow-xl'}
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Sending...
                      </>
                    ) : submitSuccess ? (
                      <>
                        <span className="text-2xl animate-bounce">✓</span>
                        Message Sent!
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                  
                  <div className="flex justify-center gap-6 mt-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🔒</span>
                      <span className="text-sm text-gray-600">Secure & Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      <span className="text-sm text-gray-600">Fast Response</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👥</span>
                      <span className="text-sm text-gray-600">24/7 Support</span>
                    </div>
                  </div>
                  
                  <p className="text-center mt-6 text-gray-400 text-sm leading-relaxed">
                    By submitting, you agree to our Privacy Policy. 
                    We promise not to spam you!
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeInUp animation-delay-400">
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Our Location
              </h2>
              <p className="text-gray-600 text-lg">Visit us at Mckay Boulevard, Belize City</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Google Maps Embed */}
              <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1">
                <iframe
                  title="KaribbeanDealz Location"
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3443.4229028221234!2d-88.2060930753705!3d17.50244449948148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDMwJzE1LjgiTiA4OMKwMTInMjkuOCJX!5e1!3m2!1sen!2sbz!4v1769018436225!5m2!1sen!2sbz"
                  width="100%"
                  height="400"
                  className="border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    Address Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-5 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl border-l-4 border-blue-600 transition-all duration-300 hover:translate-x-1 hover:shadow-lg">
                      <span className="text-2xl w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md flex-shrink-0">
                        ⏰
                      </span>
                      <div className="flex-1">
                        <strong className="block text-gray-800 text-lg mb-1">Store Hours</strong>
                        <p className="text-gray-600 leading-relaxed">
                          Mon-Sat: 8:00 AM - 9:00 PM<br/>
                          Sun: 10:00 AM - 4:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 mt-auto">
                  <a 
                    href="https://maps.app.goo.gl/NXMLY7G3h9Xjhsg1A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">🗺️</span>
                      <span>Open in Google Maps</span>
                    </span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                  <a 
                    href="https://maps.app.goo.gl/NXMLY7G3h9Xjhsg1A?dirflg=d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-5 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-blue-50"
                  >
                    <span className="text-2xl">🚗</span>
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal FAQ Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Quick answers to common questions about KaribbeanDealz
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {faqItems.map((item, index) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isActive={activeFAQ === item.id}
                  onClick={() => toggleFAQ(item.id)}
                  index={index}
                />
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center">
              <p className="text-gray-600 mb-3">Still have questions?</p>
              <a href="#contact-form" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-4 transition-all">
                Send us a message directly →
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Add these custom animation utility classes to your global CSS file */}
      {/* 
        .scale-85 { transform: scale(0.85); }
        .-rotate-135 { transform: rotate(-135deg); }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .group-focus-within:-rotate-135:focus-within { transform: rotate(-135deg); }
      */}
    </div>
  );
};

export default ContactPage;