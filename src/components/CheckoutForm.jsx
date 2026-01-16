import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/CheckoutForm.css';

const CheckoutForm = ({ cart, total, onOrderPlaced }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    return 'STYLE-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  };

  const sendEmail = async (orderDetails) => {
    try {
      // EmailJS Configuration
      const serviceID = 'YOUR_SERVICE_ID';
      const templateID = 'YOUR_TEMPLATE_ID';
      const userID = 'YOUR_PUBLIC_KEY';
      
      const emailParams = {
        to_name: 'StyleHub Team',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        order_id: orderDetails.orderId,
        order_total: `$${total.toFixed(2)}`,
        order_items: orderDetails.itemList,
        order_date: new Date().toLocaleDateString(),
        order_time: new Date().toLocaleTimeString(),
        customer_notes: formData.notes || 'No additional notes'
      };

      await emailjs.send(serviceID, templateID, emailParams, userID);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  };

  const sendWhatsAppMessage = (orderDetails) => {
    // Replace with your WhatsApp business number
    const whatsappNumber = '1234567890';
    
    const message = `🛍️ *STYLEHUB ORDER CONFIRMATION* 🛍️

📋 *Order ID:* ${orderDetails.orderId}
📅 *Date:* ${new Date().toLocaleDateString()}
⏰ *Time:* ${new Date().toLocaleTimeString()}

👤 *Customer Information*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Address: ${formData.address}, ${formData.city}, ${formData.zipCode}

🛒 *Order Details*
${orderDetails.itemList}

💰 *Order Summary*
• Subtotal: $${total.toFixed(2)}
• Shipping: To be confirmed
• **Total: $${total.toFixed(2)}**

📝 *Customer Notes:*
${formData.notes || 'No special instructions'}

---

🔄 *Next Steps:*
1. Please contact customer to confirm payment method
2. Process order once payment is confirmed
3. Update customer with shipping details

📞 *Contact Customer:* ${formData.phone}
📧 *Email:* ${formData.email}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const itemList = cart.map(item => 
        `• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');
      
      const orderDetails = {
        orderId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        total: total,
        items: `${cart.reduce((sum, item) => sum + item.quantity, 0)} items`,
        itemList: itemList,
        notes: formData.notes
      };

      // Send email
      const emailSent = await sendEmail(orderDetails);
      
      // Send WhatsApp message
      sendWhatsAppMessage(orderDetails);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (emailSent) {
        alert('🎉 Order placed successfully! Confirmation email sent.');
      } else {
        alert('🎉 Order placed! (Note: Email notification failed)');
      }

      onOrderPlaced(orderDetails);
      
    } catch (error) {
      console.error('Order processing error:', error);
      alert('There was an error processing your order. Please try again or contact us directly.');
      setIsSubmitting(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>Shipping Information</h2>
      <p className="form-subtitle">Please provide your details for order processing</p>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="John Doe"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="john@example.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? 'error' : ''}
          placeholder="+1 (234) 567-8900"
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="address">Shipping Address *</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={errors.address ? 'error' : ''}
          placeholder="123 Main Street, Apt 4B"
          rows="3"
        />
        {errors.address && <span className="error-message">{errors.address}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={errors.city ? 'error' : ''}
            placeholder="New York"
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code *</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className={errors.zipCode ? 'error' : ''}
            placeholder="10001"
          />
          {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Order Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Gift wrapping, delivery instructions, size preferences, etc."
          rows="3"
        />
        <small className="helper-text">Add any special instructions for your order</small>
      </div>

      <div className="form-notice">
        <p><strong>📱 WhatsApp Order Process:</strong></p>
        <ol>
          <li>Fill in your shipping information above</li>
          <li>Click "Place Order & Open WhatsApp" button</li>
          <li>WhatsApp will open with your order details pre-filled</li>
          <li>Our team will contact you for payment confirmation</li>
          <li>Once payment is confirmed, we'll process your order</li>
        </ol>
        <p className="notice-tip">💡 <strong>Tip:</strong> Keep WhatsApp open to receive order updates</p>
      </div>

      <button 
        type="submit" 
        className="place-order-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner"></span>
            Processing Order...
          </>
        ) : (
          <>
            📱 Place Order & Open WhatsApp
          </>
        )}
      </button>
      
      <div className="payment-notice">
        <p>💳 <strong>Payment Methods:</strong> Cash on Delivery • Bank Transfer • Mobile Payment</p>
        <p>🚚 <strong>Delivery:</strong> 3-5 business days • Free shipping on orders over $75</p>
      </div>
    </form>
  );
};

export default CheckoutForm;