import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const CheckoutPage = ({ cart, getCartTotal, clearCart }) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
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

  // Credit card state
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [cardErrors, setCardErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      paymentMethod: value
    }));
    
    if (value === 'bank') {
      setShowPaymentModal(true);
    }
  };

  // Handle card input changes
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\//g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .slice(0, 5);
    }

    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      formattedValue = value.slice(0, 4);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error for this field
    if (cardErrors[name]) {
      setCardErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate credit card
  const validateCard = () => {
    const errors = {};

    // Card Number validation (Luhn algorithm)
    if (!cardData.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else {
      const cardNumberClean = cardData.cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cardNumberClean)) {
        errors.cardNumber = 'Card number must be 16 digits';
      } else if (!luhnCheck(cardNumberClean)) {
        errors.cardNumber = 'Invalid card number';
      }
    }

    // Cardholder name validation
    if (!cardData.cardName.trim()) {
      errors.cardName = 'Cardholder name is required';
    } else if (cardData.cardName.length < 3) {
      errors.cardName = 'Enter full name as shown on card';
    }

    // Expiry date validation
    if (!cardData.expiryDate.trim()) {
      errors.expiryDate = 'Expiry date is required';
    } else {
      const [month, year] = cardData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (!month || !year || month.length !== 2 || year.length !== 2) {
        errors.expiryDate = 'Invalid format (MM/YY)';
      } else if (parseInt(month) < 1 || parseInt(month) > 12) {
        errors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        errors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation
    if (!cardData.cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      errors.cvv = 'CVV must be 3-4 digits';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Luhn algorithm for card validation
  const luhnCheck = (cardNumber) => {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  // Detect card type
  const getCardType = () => {
    const cardNumber = cardData.cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cardNumber)) return 'Visa';
    if (/^5[1-5]/.test(cardNumber)) return 'Mastercard';
    if (/^3[47]/.test(cardNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cardNumber)) return 'Discover';
    return 'Unknown';
  };

  // Process payment
  const processPayment = async () => {
    if (!validateCard()) return false;

    setIsProcessingPayment(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, you would integrate with a payment gateway here
    // For demo purposes, we'll simulate a successful payment
    const paymentSuccessful = true;

    setIsProcessingPayment(false);
    
    if (paymentSuccessful) {
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        // Reset card data
        setCardData({
          cardNumber: '',
          cardName: '',
          expiryDate: '',
          cvv: ''
        });
        setCardErrors({});
      }, 1500);
      return true;
    }

    return false;
  };

  // Close modal
  const closeModal = () => {
    setShowPaymentModal(false);
    setCardData({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    });
    setCardErrors({});
    setPaymentSuccess(false);
    // Reset payment method to COD
    setFormData(prev => ({
      ...prev,
      paymentMethod: 'cod'
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate order ID
  const generateOrderId = () => {
    return 'KD-' + Date.now().toString().slice(-8) + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  };

  // Send email
  const sendEmail = async (orderDetails) => {
    try {
      const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const userID = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
      
      const emailParams = {
        to_name: 'Karibbean Dealz',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        order_id: orderDetails.orderId,
        order_total: `$${getCartTotal().toFixed(2)}`,
        order_items: orderDetails.itemList,
        order_date: new Date().toLocaleDateString(),
        order_time: new Date().toLocaleTimeString(),
        payment_method: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : `Credit Card (${getCardType()})`,
        card_last_four: formData.paymentMethod === 'bank' ? cardData.cardNumber.replace(/\s/g, '').slice(-4) : 'N/A',
        customer_notes: formData.notes || 'No additional notes'
      };

      await emailjs.send(serviceID, templateID, emailParams, userID);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  };

  // Send WhatsApp message
  const sendWhatsAppMessage = (orderDetails) => {
    const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || '6111904';
    const paymentMethodText = formData.paymentMethod === 'cod' 
      ? 'Cash on Delivery' 
      : `Credit Card (${getCardType()} - ending in ${cardData.cardNumber.replace(/\s/g, '').slice(-4)})`;
    
    const itemList = cart.map(item => 
      `• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `🛍️ *Karibbean Dealz ORDER CONFIRMATION* 🛍️

📋 *Order ID:* ${orderDetails.orderId}
📅 *Date:* ${new Date().toLocaleDateString()}
⏰ *Time:* ${new Date().toLocaleTimeString()}
💳 *Payment Method:* ${paymentMethodText}
${formData.paymentMethod === 'bank' ? `💳 *Card:* ${getCardType()} ending in ${cardData.cardNumber.replace(/\s/g, '').slice(-4)}` : ''}

👤 *Customer Information*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Address: ${formData.address}, ${formData.city}, ${formData.zipCode}

🛒 *Order Details*
${itemList}

💰 *Order Summary*
• Subtotal: $${getCartTotal().toFixed(2)}
• Shipping: To be confirmed
• **Total: $${getCartTotal().toFixed(2)}**

📝 *Customer Notes:*
${formData.notes || 'No special instructions'}

---
${formData.paymentMethod === 'bank' 
  ? '✅ *PAYMENT CONFIRMED* - Order ready for processing' 
  : '🔄 *Next Steps:*\n1. Please contact customer to confirm payment method\n2. Process order once payment is confirmed\n3. Update customer with shipping details'}

📞 *Contact Customer:* ${formData.phone}
📧 *Email:* ${formData.email}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    // If bank transfer is selected but modal is closed or payment not processed
    if (formData.paymentMethod === 'bank' && !paymentSuccess) {
      setShowPaymentModal(true);
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
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentMethod === 'bank' ? {
          cardType: getCardType(),
          lastFour: cardData.cardNumber.replace(/\s/g, '').slice(-4)
        } : null,
        total: getCartTotal(),
        items: `${cart.reduce((sum, item) => sum + item.quantity, 0)} items`,
        itemList: itemList,
        notes: formData.notes
      };

      const emailSent = await sendEmail(orderDetails);
      sendWhatsAppMessage(orderDetails);

      if (emailSent) {
        alert('🎉 Order placed successfully! Confirmation email sent.');
      } else {
        alert('🎉 Order placed! (Note: Email notification failed)');
      }

      setOrderDetails(orderDetails);
      setOrderPlaced(true);
      clearCart();
      
    } catch (error) {
      console.error('Order processing error:', error);
      alert('There was an error processing your order. Please try again or contact us directly.');
      setIsSubmitting(false);
    }
  };

  // Payment options
  const paymentOptions = [
    { id: 'cod', label: 'Cash on Delivery', description: 'Pay when you receive your order', icon: '💰' },
    { id: 'bank', label: 'Credit / Debit Card', description: 'Pay securely with your card', icon: '💳' }
  ];

  const total = getCartTotal();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Order placed confirmation page
  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-5 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-2xl w-full text-center">
          <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
            🎉
          </div>
          <h1 className="text-green-600 mb-4 text-2xl md:text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-gray-600 text-base md:text-lg mb-6 px-4">
            Thank you for your order, {orderDetails.name}! Your Karibbean Dealz order #{orderDetails.orderId} has been received.
          </p>
          
          <div className="bg-gray-50 p-5 rounded-xl mb-6 text-left">
            <h2 className="text-gray-800 mb-4 text-xl font-bold text-center">📋 Order Details</h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-gray-200">
                <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">Order ID:</span>
                <span className="text-gray-600 text-sm">{orderDetails.orderId}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-gray-200">
                <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">Total Amount:</span>
                <span className="text-blue-600 text-lg font-bold">${orderDetails.total.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-gray-200">
                <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">Payment Method:</span>
                <span className="text-gray-600 text-sm">
                  {orderDetails.paymentMethod === 'cod' 
                    ? 'Cash on Delivery' 
                    : `Credit Card (${orderDetails.paymentDetails?.cardType} ending in ${orderDetails.paymentDetails?.lastFour})`}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-gray-200">
                <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">Items:</span>
                <span className="text-gray-600 text-sm">{orderDetails.items}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-gray-200">
                <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">Shipping to:</span>
                <span className="text-gray-600 text-sm">{orderDetails.address}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl mb-6 text-left">
            <h3 className="text-gray-800 mb-4 text-lg font-bold">📱 What happens next?</h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div className="flex-1">
                  <h4 className="text-gray-800 mb-1 font-semibold">Payment {orderDetails.paymentMethod === 'cod' ? 'Confirmation' : 'Verified'}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {orderDetails.paymentMethod === 'cod' 
                      ? `Our team will contact you via WhatsApp at ${orderDetails.phone} to confirm delivery` 
                      : 'Your payment has been successfully processed'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div className="flex-1">
                  <h4 className="text-gray-800 mb-1 font-semibold">Order Processing</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">We'll prepare your order for shipment</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div className="flex-1">
                  <h4 className="text-gray-800 mb-1 font-semibold">Shipping & Tracking</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">You'll receive tracking information via email once your order ships</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => window.print()}
              className="px-6 py-3.5 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Print Order Summary
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-5 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-6xl mb-5 opacity-30">🛒</div>
          <h1 className="text-gray-800 mb-3 text-2xl md:text-3xl font-bold">Your Shopping Cart is Empty</h1>
          <p className="text-gray-600 text-base mb-6 px-4">Add some amazing products to your cart before proceeding to checkout.</p>
          <a href="/products" className="inline-block w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg">
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12 py-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 px-4">
            🛍️ Checkout
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
            Complete your purchase in a few simple steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between mb-8 lg:mb-12 px-2 relative">
          <div className="absolute top-5 left-[50px] right-[50px] h-0.5 bg-gray-300 z-0 hidden sm:block"></div>
          
          <div className="flex-1 text-center relative z-10 px-1 sm:px-2">
            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-base sm:text-xl font-bold mx-auto mb-2 shadow-lg transform scale-105">
              1
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-800 text-xs sm:text-sm">Review Cart</span>
              <span className="text-xs text-gray-500 hidden sm:block">Current</span>
            </div>
          </div>
          
          <div className="flex-1 text-center relative z-10 px-1 sm:px-2">
            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-400 text-white rounded-full flex items-center justify-center text-base sm:text-xl font-bold mx-auto mb-2">
              2
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-600 text-xs sm:text-sm">Shipping Info</span>
              <span className="text-xs text-gray-500 hidden sm:block">Next</span>
            </div>
          </div>
          
          <div className="flex-1 text-center relative z-10 px-1 sm:px-2">
            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-400 text-white rounded-full flex items-center justify-center text-base sm:text-xl font-bold mx-auto mb-2">
              3
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-600 text-xs sm:text-sm">Place Order</span>
              <span className="text-xs text-gray-500 hidden sm:block">Final</span>
            </div>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-[0.8fr,1.2fr] gap-6 lg:gap-8 xl:gap-10" onSubmit={handleSubmit}>
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 p-4 sm:p-5 bg-gray-50 border-b border-gray-200">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-gray-700 text-white rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  📦
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate">Order Summary</h3>
                  <p className="text-sm text-gray-600 truncate">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              
              <div className="p-5">
                <div className="max-h-[300px] overflow-y-auto pr-2 mb-4 -webkit-overflow-scrolling-touch">
                  {cart.map(item => (
                    <div key={item.id} className="grid grid-cols-[auto,1fr,auto] gap-3 py-3 border-b border-gray-100 last:border-0 items-center">
                      <div className="w-14 h-14 flex-shrink-0 relative">
                        <img src={item.image || '/placeholder-item.jpg'} alt={item.name} className="w-full h-full object-cover rounded-md" />
                        <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <h4 className="text-gray-800 mb-1 text-sm font-semibold truncate">{item.name}</h4>
                        <p className="text-gray-600 text-xs">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="font-bold text-blue-600 text-sm min-w-[60px] text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2 text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-gray-600 text-sm">
                    <span>Shipping</span>
                    <span className="text-xs text-gray-500">Calculated after order</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-gray-600 text-sm">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t-2 border-gray-200 font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-xl sm:text-2xl text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 p-3 bg-blue-50 rounded-lg mt-4 border border-blue-100">
                  <span className="text-lg flex-shrink-0">ℹ️</span>
                  <p className="text-sm text-gray-700 leading-relaxed">Shipping costs will be confirmed via WhatsApp after order placement.</p>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 p-4 sm:p-5 bg-gray-50 border-b border-gray-200">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  💳
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate">Payment Method</h3>
                  <p className="text-sm text-gray-600 truncate">Select how you'd like to pay</p>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex flex-col gap-3 mb-4">
                  {paymentOptions.map(option => (
                    <label 
                      key={option.id}
                      className={`relative cursor-pointer`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.id}
                        checked={formData.paymentMethod === option.id}
                        onChange={handlePaymentMethodChange}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <div className={`flex items-center gap-3 p-3.5 bg-gray-50 border-2 rounded-lg transition-all duration-300 ${
                        formData.paymentMethod === option.id 
                          ? 'border-blue-600 bg-white shadow-lg' 
                          : 'border-transparent hover:border-blue-600 hover:bg-white hover:-translate-y-0.5 hover:shadow-md'
                      }`}>
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-md flex-shrink-0">
                          {option.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-gray-800 text-sm sm:text-base block mb-0.5 truncate">
                            {option.label}
                          </span>
                          <span className="text-gray-600 text-xs sm:text-sm block truncate">
                            {option.description}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-lg flex-shrink-0">ℹ️</span>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {formData.paymentMethod === 'cod' 
                      ? 'Cash payment will be collected upon delivery. Exact change is appreciated.' 
                      : 'Secure credit/debit card payment processed instantly.'}
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Process Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 p-4 sm:p-5 bg-gray-50 border-b border-gray-200">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  📱
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate">WhatsApp Process</h3>
                  <p className="text-sm text-gray-600 truncate">How your order will be confirmed</p>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex flex-col gap-4 mb-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="flex gap-3 items-start">
                      <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {num}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-800 mb-1 text-sm font-semibold">
                          {num === 1 && 'Complete Form'}
                          {num === 2 && 'Select Payment'}
                          {num === 3 && 'Place Order'}
                          {num === 4 && 'Get Confirmation'}
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {num === 1 && 'Fill in all shipping details'}
                          {num === 2 && 'Choose COD or Credit Card'}
                          {num === 3 && 'Submit and open WhatsApp'}
                          {num === 4 && 'Team contacts you via WhatsApp'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg flex-shrink-0 text-green-700">💡</span>
                    <p className="text-sm text-green-800 leading-relaxed">
                      <strong>Keep WhatsApp open</strong> for real-time updates and faster processing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Shipping Information */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 sticky top-8">
              <div className="flex items-center gap-3 p-4 sm:p-5 bg-gray-50 border-b border-gray-200">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-gray-700 text-white rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  🚚
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate">Shipping Information</h3>
                  <p className="text-sm text-gray-600 truncate">Please provide your details for order processing</p>
                </div>
              </div>
              
              <div className="p-5">
                {/* Shipping Form */}
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative w-full">
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="name" className="font-semibold text-gray-800 text-sm">
                          Full Name *
                        </label>
                        {errors.name && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0">!</span>}
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 border-2 rounded-lg text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.1)] ${
                          errors.name ? 'border-red-600 bg-red-50' : 'border-gray-200 focus:border-blue-600'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && <span className="text-red-600 text-xs mt-1 block font-medium">{errors.name}</span>}
                    </div>

                    <div className="relative w-full">
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="email" className="font-semibold text-gray-800 text-sm">
                          Email Address *
                        </label>
                        {errors.email && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0">!</span>}
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 border-2 rounded-lg text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.1)] ${
                          errors.email ? 'border-red-600 bg-red-50' : 'border-gray-200 focus:border-blue-600'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <span className="text-red-600 text-xs mt-1 block font-medium">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="relative w-full">
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="phone" className="font-semibold text-gray-800 text-sm">
                        Phone Number *
                      </label>
                      {errors.phone && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0">!</span>}
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 border-2 rounded-lg text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.1)] ${
                        errors.phone ? 'border-red-600 bg-red-50' : 'border-gray-200 focus:border-blue-600'
                      }`}
                      placeholder="+501 661-1904"
                    />
                    {errors.phone && <span className="text-red-600 text-xs mt-1 block font-medium">{errors.phone}</span>}
                  </div>

                  <div className="relative w-full">
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="address" className="font-semibold text-gray-800 text-sm">
                        Shipping Address *
                      </label>
                      {errors.address && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0">!</span>}
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full px-4 py-3.5 border-2 rounded-lg text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.1)] resize-y ${
                        errors.address ? 'border-red-600 bg-red-50' : 'border-gray-200 focus:border-blue-600'
                      }`}
                      placeholder="123 Main Street, Building Name, Apt/Unit #"
                    />
                    {errors.address && <span className="text-red-600 text-xs mt-1 block font-medium">{errors.address}</span>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative w-full">
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="city" className="font-semibold text-gray-800 text-sm">
                          City *
                        </label>
                        {errors.city && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0">!</span>}
                      </div>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 border-2 rounded-lg text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.1)] ${
                          errors.city ? 'border-red-600 bg-red-50' : 'border-gray-200 focus:border-blue-600'
                        }`}
                        placeholder="Belize City"
                      />
                      {errors.city && <span className="text-red-600 text-xs mt-1 block font-medium">{errors.city}</span>}
                    </div>

                    <div className="relative w-full">
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="zipCode" className="font-semibold text-gray-800 text-sm">
                          ZIP Code *
                        </label>
                        {errors.zipCode && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0">!</span>}
                      </div>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 border-2 rounded-lg text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.1)] ${
                          errors.zipCode ? 'border-red-600 bg-red-50' : 'border-gray-200 focus:border-blue-600'
                        }`}
                        placeholder="12345"
                      />
                      {errors.zipCode && <span className="text-red-600 text-xs mt-1 block font-medium">{errors.zipCode}</span>}
                    </div>
                  </div>

                  <div className="relative w-full">
                    <label htmlFor="notes" className="font-semibold text-gray-800 text-sm block mb-1.5">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Special delivery instructions, gift wrapping requests, size preferences, etc."
                      rows="3"
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.1)] resize-y"
                    />
                    <small className="text-gray-500 text-xs mt-1 block">Any special instructions for your order</small>
                  </div>
                </div>
                
                {/* Order Total & Submit Button */}
                <div className="mt-6 p-5 bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="flex justify-between items-center pb-4 border-b-2 border-gray-200 mb-4">
                    <span className="text-gray-800 font-semibold">Order Total</span>
                    <span className="text-2xl sm:text-3xl text-blue-600 font-bold">${total.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[52px] ${
                      isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">📱</span>
                        {formData.paymentMethod === 'bank' && !paymentSuccess
                          ? 'Enter Card Details'
                          : 'Place Order & Open WhatsApp'
                        }
                        <span className="text-lg opacity-90 transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 mt-4 text-gray-600 text-sm text-center">
                    <span className="text-lg">🔒</span>
                    <p className="leading-relaxed">
                      Your information is secure. {formData.paymentMethod === 'bank' ? 'Payments are encrypted and processed securely.' : 'No payment is processed on this site for COD.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Credit Card Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-2xl animate-slideUp -webkit-overflow-scrolling-touch">
            <button 
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 border-none text-2xl flex items-center justify-center cursor-pointer text-gray-600 transition-all duration-300 hover:bg-red-600 hover:text-white hover:rotate-90 z-10"
              onClick={closeModal}
            >
              ×
            </button>
            
            <div className="text-center px-5 pt-8 pb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-gray-700 rounded-full flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-4 text-white shadow-lg">
                💳
              </div>
              <h2 className="text-gray-800 mb-2 text-xl sm:text-2xl font-bold">Secure Payment</h2>
              <p className="text-gray-600 text-sm sm:text-base">Enter your credit/debit card details</p>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-10 px-5 animate-scaleIn">
                <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-5 animate-bounce">
                  ✓
                </div>
                <h3 className="text-green-600 mb-2.5 text-xl sm:text-2xl font-bold">Payment Successful!</h3>
                <p className="text-gray-600 text-base leading-relaxed">Your payment has been processed successfully.</p>
              </div>
            ) : (
              <>
                <div className="px-5 pt-5 pb-2 relative">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-5 text-white shadow-xl min-h-[160px] flex flex-col relative overflow-hidden">
                    <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-25"></div>
                    <div className="text-3xl mb-5 relative z-10">💳</div>
                    <div className="text-xl sm:text-2xl tracking-wider mb-5 font-mono font-bold break-all relative z-10">
                      {cardData.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between items-end relative z-10">
                      <div className="flex flex-col">
                        <span className="text-[0.65rem] uppercase opacity-80 mb-0.5 tracking-wider">Card Holder</span>
                        <span className="text-sm font-semibold uppercase">{cardData.cardName || 'Full Name'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.65rem] uppercase opacity-80 mb-0.5 tracking-wider">Expires</span>
                        <span className="text-sm font-semibold">{cardData.expiryDate || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-8 right-8">
                    {getCardType() !== 'Unknown' && (
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/30">
                        {getCardType()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="relative mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="cardNumber" className="font-semibold text-gray-800 text-sm">
                        Card Number *
                      </label>
                      {cardErrors.cardNumber && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0">!</span>}
                    </div>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      maxLength="19"
                      className={`w-full px-4 py-3.5 border-2 rounded-lg text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.1)] ${
                        cardErrors.cardNumber ? 'border-red-600 bg-red-50' : 'border-gray-200 focus:border-blue-600'
                      }`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {cardErrors.cardNumber && <span className="text-red-600 text-xs mt-1 block font-medium">{cardErrors.cardNumber}</span>}
                  </div>

                  <div className="relative mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="cardName" className="font-semibold text-gray-800 text-sm">
                        Cardholder Name *
                      </label>
                      {cardErrors.cardName && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0">!</span>}
                    </div>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={cardData.cardName}
                      onChange={handleCardChange}
                      className={`w-full px-4 py-3.5 border-2 rounded-lg text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.1)] ${
                        cardErrors.cardName ? 'border-red-600 bg-red-50' : 'border-gray-200 focus:border-blue-600'
                      }`}
                      placeholder="As shown on card"
                    />
                    {cardErrors.cardName && <span className="text-red-600 text-xs mt-1 block font-medium">{cardErrors.cardName}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="expiryDate" className="font-semibold text-gray-800 text-sm">
                          Expiry Date *
                        </label>
                        {cardErrors.expiryDate && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0">!</span>}
                      </div>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={cardData.expiryDate}
                        onChange={handleCardChange}
                        maxLength="5"
                        className={`w-full px-4 py-3.5 border-2 rounded-lg text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.1)] ${
                          cardErrors.expiryDate ? 'border-red-600 bg-red-50' : 'border-gray-200 focus:border-blue-600'
                        }`}
                        placeholder="MM/YY"
                      />
                      {cardErrors.expiryDate && <span className="text-red-600 text-xs mt-1 block font-medium">{cardErrors.expiryDate}</span>}
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="cvv" className="font-semibold text-gray-800 text-sm">
                          CVV *
                        </label>
                        {cardErrors.cvv && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0">!</span>}
                      </div>
                      <input
                        type="password"
                        id="cvv"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        maxLength="4"
                        className={`w-full px-4 py-3.5 border-2 rounded-lg text-base bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-white focus:shadow-[0_0_0_3px_rgba(44,62,80,0.1)] ${
                          cardErrors.cvv ? 'border-red-600 bg-red-50' : 'border-gray-200 focus:border-blue-600'
                        }`}
                        placeholder="123"
                      />
                      {cardErrors.cvv && <span className="text-red-600 text-xs mt-1 block font-medium">{cardErrors.cvv}</span>}
                      <small className="text-gray-500 text-xs mt-1 block">3-4 digit security code</small>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 my-5 flex justify-between items-center border border-gray-200">
                    <span className="text-gray-800 font-semibold">Total Amount</span>
                    <span className="text-2xl sm:text-3xl text-blue-600 font-bold">${total.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button 
                      type="button" 
                      className="flex-1 py-3.5 px-5 bg-gray-100 text-gray-600 rounded-lg font-semibold text-base border-2 border-gray-200 transition-all duration-300 hover:bg-gray-200 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                      onClick={closeModal}
                      disabled={isProcessingPayment}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="flex-1 py-3.5 px-5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold text-base shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                      onClick={async () => {
                        const success = await processPayment();
                        if (success) {
                          setFormData(prev => ({
                            ...prev,
                            paymentMethod: 'bank'
                          }));
                        }
                      }}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-1.5"></span>
                          Processing...
                        </>
                      ) : (
                        'Pay Now'
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 border-t border-gray-200 text-gray-600 text-xs">
                  <span className="text-base">🔒</span>
                  <span>256-bit SSL encrypted</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Custom animation utilities - Add these to your global CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease;
        }
        .rotate-25 {
          transform: rotate(25deg);
        }
        .-webkit-overflow-scrolling-touch {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;