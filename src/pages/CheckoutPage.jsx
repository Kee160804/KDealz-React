import React, { useState, useCallback, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/CheckOut.css';

/**
 * CheckoutPage Component
 * Handles order processing with form validation, WhatsApp integration, and order confirmation
 * Features multi-step checkout, payment method selection, and comprehensive order summary
 */
const CheckoutPage = ({ cart, getCartTotal, clearCart }) => {
  // ─── State Management ────────────────────────────────────────────────
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: '',
    paymentMethod: 'cod'
  });

  // ─── Constants ───────────────────────────────────────────────────────
  const WHATSAPP_NUMBER = '6111904';
  const EMAIL_CONFIG = {
    serviceID: 'YOUR_SERVICE_ID',
    templateID: 'YOUR_TEMPLATE_ID',
    userID: 'YOUR_PUBLIC_KEY'
  };

  const PAYMENT_OPTIONS = [
    { 
      id: 'cod', 
      label: 'Cash on Delivery', 
      description: 'Pay when you receive your order', 
      icon: '💰',
      notice: 'Cash payment will be collected upon delivery. Exact change is appreciated.'
    },
    { 
      id: 'bank', 
      label: 'Bank Transfer', 
      description: 'Transfer funds to our bank account', 
      icon: '🏦',
      notice: 'Bank transfer details will be sent via WhatsApp after order confirmation.'
    }
  ];

  // ─── Derived Values ──────────────────────────────────────────────────
  const total = useMemo(() => getCartTotal(), [getCartTotal]);
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const currentPaymentOption = useMemo(() => 
    PAYMENT_OPTIONS.find(opt => opt.id === formData.paymentMethod), 
    [formData.paymentMethod]
  );

  // ─── Form Validation ─────────────────────────────────────────────────
  const validateForm = useCallback(() => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ─── Event Handlers ──────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const generateOrderId = useCallback(() => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `KD-${timestamp}-${random}`;
  }, []);

  const formatItemList = useCallback(() => {
    return cart.map(item => 
      `• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
  }, [cart]);

  const createOrderDetails = useCallback((orderId, itemList) => ({
    orderId,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
    paymentMethod: formData.paymentMethod,
    total: total,
    items: `${itemCount} items`,
    itemList,
    notes: formData.notes || 'No additional notes'
  }), [formData, total, itemCount]);

  // ─── Communication Methods ───────────────────────────────────────────
  const sendEmail = useCallback(async (orderDetails) => {
    try {
      const emailParams = {
        to_name: 'Karibbean Dealz',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: orderDetails.address,
        order_id: orderDetails.orderId,
        order_total: `$${orderDetails.total.toFixed(2)}`,
        order_items: orderDetails.itemList,
        order_date: new Date().toLocaleDateString(),
        order_time: new Date().toLocaleTimeString(),
        payment_method: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
        customer_notes: formData.notes || 'No additional notes'
      };

      await emailjs.send(
        EMAIL_CONFIG.serviceID, 
        EMAIL_CONFIG.templateID, 
        emailParams, 
        EMAIL_CONFIG.userID
      );
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }, [formData, EMAIL_CONFIG]);

  const sendWhatsAppMessage = useCallback((orderDetails) => {
    const paymentMethodText = formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer';
    
    const message = `
🛍️ *Karibbean Dealz ORDER CONFIRMATION* 🛍️

📋 *Order ID:* ${orderDetails.orderId}
📅 *Date:* ${new Date().toLocaleDateString()}
⏰ *Time:* ${new Date().toLocaleTimeString()}
💳 *Payment Method:* ${paymentMethodText}

👤 *Customer Information*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Address: ${orderDetails.address}

🛒 *Order Details*
${orderDetails.itemList}

💰 *Order Summary*
• Subtotal: $${orderDetails.total.toFixed(2)}
• Shipping: To be confirmed
• **Total: $${orderDetails.total.toFixed(2)}**

📝 *Customer Notes:*
${formData.notes || 'No special instructions'}

---

🔄 *Next Steps:*
1. Please contact customer to confirm payment method
2. Process order once payment is confirmed
3. Update customer with shipping details

📞 *Contact Customer:* ${formData.phone}
📧 *Email:* ${formData.email}`.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  }, [formData, WHATSAPP_NUMBER]);

  // ─── Order Submission ────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const itemList = formatItemList();
      const orderDetails = createOrderDetails(orderId, itemList);

      // Send communications
      const emailSent = await sendEmail(orderDetails);
      sendWhatsAppMessage(orderDetails);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show appropriate message
      if (emailSent) {
        alert('🎉 Order placed successfully! Confirmation email sent.');
      } else {
        alert('🎉 Order placed! (Note: Email notification failed)');
      }

      // Update state and clear cart
      setOrderDetails(orderDetails);
      setOrderPlaced(true);
      clearCart();
      
    } catch (error) {
      console.error('Order processing error:', error);
      alert('There was an error processing your order. Please try again or contact us directly.');
      setIsSubmitting(false);
    }
  }, [validateForm, generateOrderId, formatItemList, createOrderDetails, sendEmail, sendWhatsAppMessage, clearCart]);

  // ─── Navigation Handlers ─────────────────────────────────────────────
  const navigateHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  const printOrder = useCallback(() => {
    window.print();
  }, []);

  // ─── Render Helpers ──────────────────────────────────────────────────
  if (orderPlaced) {
    return <OrderConfirmation 
      orderDetails={orderDetails} 
      onContinue={navigateHome}
      onPrint={printOrder}
    />;
  }

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <CheckoutHeader />
        <CheckoutProgress currentStep={1} />
        
        <form className="checkout-content" onSubmit={handleSubmit}>
          <LeftColumn 
            cart={cart}
            total={total}
            itemCount={itemCount}
            paymentOptions={PAYMENT_OPTIONS}
            selectedPayment={formData.paymentMethod}
            onPaymentChange={handleChange}
            currentPaymentOption={currentPaymentOption}
          />
          
          <RightColumn 
            formData={formData}
            errors={errors}
            total={total}
            isSubmitting={isSubmitting}
            onChange={handleChange}
          />
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// ORDER CONFIRMATION COMPONENTS
// ============================================================================

/**
 * Order Confirmation Page
 */
const OrderConfirmation = ({ orderDetails, onContinue, onPrint }) => (
  <div className="order-confirmation-page">
    <div className="confirmation-container">
      <div className="success-animation">🎉</div>
      <h1>Order Confirmed!</h1>
      <p className="confirmation-message">
        Thank you for your order, {orderDetails?.name}! 
        Your Karibbean Dealz order #{orderDetails?.orderId} has been received.
      </p>
      
      <OrderDetailsSummary details={orderDetails} />
      <NextSteps phone={orderDetails?.phone} />
      
      <div className="confirmation-actions">
        <button onClick={onContinue} className="btn btn-primary">
          Continue Shopping
        </button>
        <button onClick={onPrint} className="btn btn-outline">
          Print Order Summary
        </button>
      </div>
    </div>
  </div>
);

/**
 * Order Details Summary
 */
const OrderDetailsSummary = ({ details }) => details && (
  <div className="order-details">
    <h2>📋 Order Details</h2>
    <div className="details-grid">
      <DetailItem label="Order ID" value={details.orderId} />
      <DetailItem label="Total Amount" value={`$${details.total.toFixed(2)}`} />
      <DetailItem label="Items" value={details.items} />
      <DetailItem label="Shipping to" value={details.address} />
    </div>
  </div>
);

/**
 * Next Steps Section
 */
const NextSteps = ({ phone }) => (
  <div className="next-steps">
    <h3>📱 What happens next?</h3>
    <div className="steps-container">
      <StepItem 
        number={1}
        title="Payment Confirmation"
        description={`Our team will contact you via WhatsApp at ${phone} to confirm payment method`}
      />
      <StepItem 
        number={2}
        title="Order Processing"
        description="Once payment is confirmed, we'll prepare your order for shipment"
      />
      <StepItem 
        number={3}
        title="Shipping & Tracking"
        description="You'll receive tracking information via email once your order ships"
      />
    </div>
  </div>
);

/**
 * Step Item
 */
const StepItem = ({ number, title, description }) => (
  <div className="step-item">
    <div className="step-number">{number}</div>
    <div className="step-content">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

/**
 * Detail Item
 */
const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value}</span>
  </div>
);

// ============================================================================
// EMPTY CART COMPONENT
// ============================================================================

const EmptyCart = () => (
  <div className="empty-cart-page">
    <div className="empty-cart-content">
      <div className="empty-cart-icon">🛒</div>
      <h1>Your Shopping Cart is Empty</h1>
      <p>Add some amazing products to your cart before proceeding to checkout.</p>
      <a href="/products" className="btn btn-primary">Browse Products</a>
    </div>
  </div>
);

// ============================================================================
// CHECKOUT HEADER AND PROGRESS
// ============================================================================

const CheckoutHeader = () => (
  <div className="checkout-header">
    <h1>🛍️ Checkout</h1>
    <p>Complete your purchase in a few simple steps</p>
  </div>
);

const CheckoutProgress = ({ currentStep }) => {
  const steps = [
    { title: 'Review Cart', status: 'Current' },
    { title: 'Shipping Info', status: 'Next' },
    { title: 'Place Order', status: 'Final' }
  ];

  return (
    <div className="checkout-progress">
      {steps.map((step, index) => (
        <ProgressStep 
          key={index}
          number={index + 1}
          title={step.title}
          status={step.status}
          isActive={index + 1 === currentStep}
        />
      ))}
    </div>
  );
};

const ProgressStep = ({ number, title, status, isActive }) => (
  <div className={`progress-step ${isActive ? 'active' : ''}`}>
    <div className="step-number">{number}</div>
    <div className="step-info">
      <div className="step-title">{title}</div>
      <div className="step-status">{status}</div>
    </div>
  </div>
);

// ============================================================================
// LEFT COLUMN COMPONENTS
// ============================================================================

const LeftColumn = ({ 
  cart, total, itemCount, paymentOptions, 
  selectedPayment, onPaymentChange, currentPaymentOption 
}) => (
  <div className="left-column">
    <OrderSummaryCard 
      cart={cart}
      total={total}
      itemCount={itemCount}
    />
    
    <PaymentMethodCard 
      paymentOptions={paymentOptions}
      selectedPayment={selectedPayment}
      onPaymentChange={onPaymentChange}
      currentPaymentOption={currentPaymentOption}
    />
    
    <WhatsAppProcessCard />
  </div>
);

const OrderSummaryCard = ({ cart, total, itemCount }) => (
  <div className="order-summary-card">
    <CardHeader icon="📦" title="Order Summary" subtitle={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`} />
    
    <div className="card-content">
      <div className="order-items">
        {cart.map(item => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>
      
      <OrderTotals total={total} />
      
      <div className="order-notice">
        <div className="notice-icon">ℹ️</div>
        <p>Shipping costs will be confirmed via WhatsApp after order placement.</p>
      </div>
    </div>
  </div>
);

const OrderItem = ({ item }) => (
  <div className="order-item">
    <div className="item-image">
      <img src={item.image || '/placeholder-item.jpg'} alt={item.name} />
      <span className="quantity-badge">{item.quantity}</span>
    </div>
    <div className="item-info">
      <h4 className="item-name">{item.name}</h4>
      <p className="item-price">${item.price.toFixed(2)} each</p>
    </div>
    <div className="item-total">
      ${(item.price * item.quantity).toFixed(2)}
    </div>
  </div>
);

const OrderTotals = ({ total }) => (
  <div className="order-totals">
    <TotalRow label="Subtotal" value={`$${total.toFixed(2)}`} />
    <TotalRow label="Shipping" value="Calculated after order" className="shipping-note" />
    <TotalRow label="Tax" value="$0.00" />
    <TotalRow label="Total" value={`$${total.toFixed(2)}`} className="grand-total" valueClass="total-amount" />
  </div>
);

const TotalRow = ({ label, value, className = '', valueClass = '' }) => (
  <div className={`total-row ${className}`}>
    <span>{label}</span>
    <span className={valueClass}>{value}</span>
  </div>
);

const PaymentMethodCard = ({ paymentOptions, selectedPayment, onPaymentChange, currentPaymentOption }) => (
  <div className="payment-method-card">
    <CardHeader icon="💳" title="Payment Method" subtitle="Select how you'd like to pay" />
    
    <div className="card-content">
      <div className="payment-options">
        {paymentOptions.map(option => (
          <PaymentOption 
            key={option.id}
            option={option}
            isSelected={selectedPayment === option.id}
            onChange={onPaymentChange}
          />
        ))}
      </div>
      
      {currentPaymentOption && (
        <div className="payment-notice">
          <div className="notice-icon">ℹ️</div>
          <p>{currentPaymentOption.notice}</p>
        </div>
      )}
    </div>
  </div>
);

const PaymentOption = ({ option, isSelected, onChange }) => (
  <label className={`payment-option ${isSelected ? 'selected' : ''}`}>
    <input
      type="radio"
      name="paymentMethod"
      value={option.id}
      checked={isSelected}
      onChange={onChange}
      className="payment-radio"
    />
    <div className="payment-content">
      <div className="payment-icon">{option.icon}</div>
      <div className="payment-info">
        <div className="payment-title">{option.label}</div>
        <div className="payment-description">{option.description}</div>
      </div>
    </div>
  </label>
);

const WhatsAppProcessCard = () => (
  <div className="whatsapp-card">
    <CardHeader icon="📱" title="WhatsApp Process" subtitle="How your order will be confirmed" />
    
    <div className="card-content">
      <div className="process-steps">
        <ProcessStep number={1} title="Complete Form" description="Fill in all shipping details" />
        <ProcessStep number={2} title="Select Payment" description="Choose payment method" />
        <ProcessStep number={3} title="Place Order" description="Submit and open WhatsApp" />
        <ProcessStep number={4} title="Get Confirmation" description="Team contacts you via WhatsApp" />
      </div>
      
      <div className="whatsapp-notice">
        <div className="notice-icon">💡</div>
        <p><strong>Keep WhatsApp open</strong> for real-time updates and faster processing.</p>
      </div>
    </div>
  </div>
);

const ProcessStep = ({ number, title, description }) => (
  <div className="process-step">
    <div className="step-number">{number}</div>
    <div className="step-info">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

// ============================================================================
// RIGHT COLUMN COMPONENTS
// ============================================================================

const RightColumn = ({ formData, errors, total, isSubmitting, onChange }) => (
  <div className="right-column">
    <div className="shipping-card">
      <CardHeader icon="🚚" title="Shipping Information" subtitle="Please provide your details for order processing" />
      
      <div className="card-content">
        <ShippingForm formData={formData} errors={errors} onChange={onChange} />
        <OrderSubmitSection total={total} isSubmitting={isSubmitting} />
      </div>
    </div>
  </div>
);

const ShippingForm = ({ formData, errors, onChange }) => (
  <div className="shipping-form">
    <div className="form-row">
      <FormField
        id="name"
        label="Full Name"
        value={formData.name}
        error={errors.name}
        onChange={onChange}
        placeholder="John Doe"
        required
      />
      
      <FormField
        id="email"
        label="Email Address"
        type="email"
        value={formData.email}
        error={errors.email}
        onChange={onChange}
        placeholder="john@example.com"
        required
      />
    </div>

    <FormField
      id="phone"
      label="Phone Number"
      type="tel"
      value={formData.phone}
      error={errors.phone}
      onChange={onChange}
      placeholder="+501 661-1904"
      required
    />

    <FormField
      id="address"
      label="Shipping Address"
      type="textarea"
      value={formData.address}
      error={errors.address}
      onChange={onChange}
      placeholder="123 Main Street, Building Name, Apt/Unit #"
      rows="3"
      required
    />

    <div className="form-row">
      <FormField
        id="city"
        label="City"
        value={formData.city}
        error={errors.city}
        onChange={onChange}
        placeholder="Belize City"
        required
      />
      
      <FormField
        id="zipCode"
        label="ZIP Code"
        value={formData.zipCode}
        error={errors.zipCode}
        onChange={onChange}
        placeholder="12345"
        required
      />
    </div>

    <FormField
      id="notes"
      label="Order Notes (Optional)"
      type="textarea"
      value={formData.notes}
      onChange={onChange}
      placeholder="Special delivery instructions, gift wrapping requests, size preferences, etc."
      rows="3"
      helperText="Any special instructions for your order"
    />
  </div>
);

const FormField = ({ 
  id, label, type = 'text', value, error, 
  onChange, placeholder, rows, required, helperText 
}) => (
  <div className="form-group">
    <label htmlFor={id}>
      {label} {required && '*'}
      {error && <span className="error-indicator">!</span>}
    </label>
    
    {type === 'textarea' ? (
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
        placeholder={placeholder}
        required={required}
      />
    )}
    
    {error && <span className="error-message">{error}</span>}
    {helperText && !error && <small className="helper-text">{helperText}</small>}
  </div>
);

const OrderSubmitSection = ({ total, isSubmitting }) => (
  <div className="order-total-section">
    <div className="total-display">
      <div className="total-label">Order Total</div>
      <div className="total-amount">${total.toFixed(2)}</div>
    </div>
    
    <SubmitButton isSubmitting={isSubmitting} />
    
    <SecurityNotice />
  </div>
);

const SubmitButton = ({ isSubmitting }) => (
  <button type="submit" className="submit-order-btn" disabled={isSubmitting}>
    {isSubmitting ? (
      <>
        <span className="spinner"></span>
        Processing Order...
      </>
    ) : (
      <>
        <span className="btn-icon">📱</span>
        Place Order & Open WhatsApp
        <span className="btn-arrow">→</span>
      </>
    )}
  </button>
);

const SecurityNotice = () => (
  <div className="security-notice">
    <div className="security-icon">🔒</div>
    <p>Your information is secure. No payment is processed on this site.</p>
  </div>
);

// ============================================================================
// COMMON COMPONENTS
// ============================================================================

const CardHeader = ({ icon, title, subtitle }) => (
  <div className="card-header">
    <div className="card-icon">{icon}</div>
    <div>
      <h3>{title}</h3>
      <p className="card-subtitle">{subtitle}</p>
    </div>
  </div>
);

export default CheckoutPage;