// import React, { useState } from 'react';
// import emailjs from '@emailjs/browser';
// import '../styles/CheckoutForm.css';

// const CheckoutForm = ({ cart, total, onOrderPlaced }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     notes: '',
//     paymentMethod: 'cod' // Default to Cash on Delivery
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//     }
//     if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
//     if (!formData.address.trim()) newErrors.address = 'Address is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const generateOrderId = () => {
//     return 'KD-' + Date.now().toString().slice(-8) + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//   };

//   const sendEmail = async (orderDetails) => {
//     try {
//       const serviceID = 'YOUR_SERVICE_ID';
//       const templateID = 'YOUR_TEMPLATE_ID';
//       const userID = 'YOUR_PUBLIC_KEY';
      
//       const emailParams = {
//         to_name: 'Karibbean Dealz',
//         customer_name: formData.name,
//         customer_email: formData.email,
//         customer_phone: formData.phone,
//         customer_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
//         order_id: orderDetails.orderId,
//         order_total: `$${total.toFixed(2)}`,
//         order_items: orderDetails.itemList,
//         order_date: new Date().toLocaleDateString(),
//         order_time: new Date().toLocaleTimeString(),
//         payment_method: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
//         customer_notes: formData.notes || 'No additional notes'
//       };

//       await emailjs.send(serviceID, templateID, emailParams, userID);
//       return true;
//     } catch (error) {
//       console.error('Failed to send email:', error);
//       return false;
//     }
//   };

//   const sendWhatsAppMessage = (orderDetails) => {
//     const whatsappNumber = '6111904';
    
//     const paymentMethodText = formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer';
    
//     const message = `🛍️ *Karibbean Dealz ORDER CONFIRMATION* 🛍️

// 📋 *Order ID:* ${orderDetails.orderId}
// 📅 *Date:* ${new Date().toLocaleDateString()}
// ⏰ *Time:* ${new Date().toLocaleTimeString()}
// 💳 *Payment Method:* ${paymentMethodText}

// 👤 *Customer Information*
// • Name: ${formData.name}
// • Email: ${formData.email}
// • Phone: ${formData.phone}
// • Address: ${formData.address}, ${formData.city}, ${formData.zipCode}

// 🛒 *Order Details*
// ${orderDetails.itemList}

// 💰 *Order Summary*
// • Subtotal: $${total.toFixed(2)}
// • Shipping: To be confirmed
// • **Total: $${total.toFixed(2)}**

// 📝 *Customer Notes:*
// ${formData.notes || 'No special instructions'}

// ---

// 🔄 *Next Steps:*
// 1. Please contact customer to confirm payment method
// 2. Process order once payment is confirmed
// 3. Update customer with shipping details

// 📞 *Contact Customer:* ${formData.phone}
// 📧 *Email:* ${formData.email}`;

//     const encodedMessage = encodeURIComponent(message);
//     const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
//     window.open(whatsappURL, '_blank');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       alert('Please fix the errors in the form before submitting.');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const orderId = generateOrderId();
//       const itemList = cart.map(item => 
//         `• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
//       ).join('\n');
      
//       const orderDetails = {
//         orderId,
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
//         paymentMethod: formData.paymentMethod,
//         total: total,
//         items: `${cart.reduce((sum, item) => sum + item.quantity, 0)} items`,
//         itemList: itemList,
//         notes: formData.notes
//       };

//       const emailSent = await sendEmail(orderDetails);
//       sendWhatsAppMessage(orderDetails);

//       await new Promise(resolve => setTimeout(resolve, 1500));

//       if (emailSent) {
//         alert('🎉 Order placed successfully! Confirmation email sent.');
//       } else {
//         alert('🎉 Order placed! (Note: Email notification failed)');
//       }

//       onOrderPlaced(orderDetails);
      
//     } catch (error) {
//       console.error('Order processing error:', error);
//       alert('There was an error processing your order. Please try again or contact us directly.');
//       setIsSubmitting(false);
//     }
//   };

//   const paymentOptions = [
//     { id: 'cod', label: 'Cash on Delivery', description: 'Pay when you receive your order' },
//     { id: 'bank', label: 'Bank Transfer', description: 'Transfer funds directly to our bank account' }
//   ];

//   return (
//     <form className="checkout-form" onSubmit={handleSubmit}>
//       <h2>Shipping Information</h2>
//       <p className="form-subtitle">Please provide your details for order processing</p>
      
//       <div className="form-row">
//         <div className="form-group">
//           <label htmlFor="name">Full Name *</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className={errors.name ? 'error' : ''}
//             placeholder="John Doe"
//           />
//           {errors.name && <span className="error-message">{errors.name}</span>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="email">Email Address *</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className={errors.email ? 'error' : ''}
//             placeholder="john@example.com"
//           />
//           {errors.email && <span className="error-message">{errors.email}</span>}
//         </div>
//       </div>

//       <div className="form-group">
//         <label htmlFor="phone">Phone Number *</label>
//         <input
//           type="tel"
//           id="phone"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           className={errors.phone ? 'error' : ''}
//           placeholder="+501 661-1904"
//         />
//         {errors.phone && <span className="error-message">{errors.phone}</span>}
//       </div>

//       <div className="form-group">
//         <label htmlFor="address">Shipping Address *</label>
//         <textarea
//           id="address"
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           className={errors.address ? 'error' : ''}
//           placeholder="123 Main Street, Apt 4B"
//           rows="3"
//         />
//         {errors.address && <span className="error-message">{errors.address}</span>}
//       </div>

//       <div className="form-row">
//         <div className="form-group">
//           <label htmlFor="city">City *</label>
//           <input
//             type="text"
//             id="city"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             className={errors.city ? 'error' : ''}
//             placeholder="Belize City"
//           />
//           {errors.city && <span className="error-message">{errors.city}</span>}
//         </div>
//       </div>

//       {/* Payment Method Dropdown */}
//       <div className="form-group">
//         <label htmlFor="paymentMethod">Payment Method *</label>
//         <select
//           id="paymentMethod"
//           name="paymentMethod"
//           value={formData.paymentMethod}
//           onChange={handleChange}
//           className="payment-dropdown"
//         >
//           {paymentOptions.map(option => (
//             <option key={option.id} value={option.id}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//         <small className="helper-text">
//           {paymentOptions.find(opt => opt.id === formData.paymentMethod)?.description}
//         </small>
//       </div>

//       <div className="form-group">
//         <label htmlFor="notes">Order Notes (Optional)</label>
//         <textarea
//           id="notes"
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           placeholder="Gift wrapping, delivery instructions, size preferences, etc."
//           rows="3"
//         />
//         <small className="helper-text">Add any special instructions for your order</small>
//       </div>

//       <div className="form-notice">
//         <p><strong>📱 WhatsApp Order Process:</strong></p>
//         <ol>
//           <li>Fill in your shipping information above</li>
//           <li>Select your preferred payment method</li>
//           <li>Click "Place Order & Open WhatsApp" button</li>
//           <li>WhatsApp will open with your order details pre-filled</li>
//           <li>Our team will contact you for payment confirmation</li>
//           <li>Once payment is confirmed, we'll process your order</li>
//         </ol>
//         <p className="notice-tip">💡 <strong>Tip:</strong> Keep WhatsApp open to receive order updates</p>
//       </div>

//       <button 
//         type="submit" 
//         className="place-order-btn"
//         disabled={isSubmitting}
//       >
//         {isSubmitting ? (
//           <>
//             <span className="spinner"></span>
//             Processing Order...
//           </>
//         ) : (
//           <>
//             📱 Place Order & Open WhatsApp
//           </>
//         )}
//       </button>
//     </form>
//   );
// };

// export default CheckoutForm;





// import React, { useState } from 'react';
// import emailjs from '@emailjs/browser';
// import '../styles/CheckoutForm.css';

// const CheckoutForm = ({ cart, total, onOrderPlaced }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     zipCode: '',
//     notes: '',
//     paymentMethod: 'cod'
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
//     if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
//     if (!formData.address.trim()) newErrors.address = 'Address is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const generateOrderId = () => {
//     return 'KD-' + Date.now().toString().slice(-8) + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//   };

//   const sendEmail = async (orderDetails) => {
//     try {
//       const serviceID = 'YOUR_SERVICE_ID';
//       const templateID = 'YOUR_TEMPLATE_ID';
//       const userID = 'YOUR_PUBLIC_KEY';
      
//       const emailParams = {
//         to_name: 'Karibbean Dealz',
//         customer_name: formData.name,
//         customer_email: formData.email,
//         customer_phone: formData.phone,
//         customer_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
//         order_id: orderDetails.orderId,
//         order_total: `$${total.toFixed(2)}`,
//         order_items: orderDetails.itemList,
//         order_date: new Date().toLocaleDateString(),
//         order_time: new Date().toLocaleTimeString(),
//         payment_method: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
//         customer_notes: formData.notes || 'No additional notes'
//       };

//       await emailjs.send(serviceID, templateID, emailParams, userID);
//       return true;
//     } catch (error) {
//       console.error('Failed to send email:', error);
//       return false;
//     }
//   };

//   const sendWhatsAppMessage = (orderDetails) => {
//     const whatsappNumber = '6111904';
    
//     const paymentMethodText = formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer';
    
//     const message = `🛍️ *Karibbean Dealz ORDER CONFIRMATION* 🛍️

// 📋 *Order ID:* ${orderDetails.orderId}
// 📅 *Date:* ${new Date().toLocaleDateString()}
// ⏰ *Time:* ${new Date().toLocaleTimeString()}
// 💳 *Payment Method:* ${paymentMethodText}

// 👤 *Customer Information*
// • Name: ${formData.name}
// • Email: ${formData.email}
// • Phone: ${formData.phone}
// • Address: ${formData.address}, ${formData.city}, ${formData.zipCode}

// 🛒 *Order Details*
// ${orderDetails.itemList}

// 💰 *Order Summary*
// • Subtotal: $${total.toFixed(2)}
// • Shipping: To be confirmed
// • **Total: $${total.toFixed(2)}**

// 📝 *Customer Notes:*
// ${formData.notes || 'No special instructions'}

// ---

// 🔄 *Next Steps:*
// 1. Please contact customer to confirm payment method
// 2. Process order once payment is confirmed
// 3. Update customer with shipping details

// 📞 *Contact Customer:* ${formData.phone}
// 📧 *Email:* ${formData.email}`;

//     const encodedMessage = encodeURIComponent(message);
//     const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
//     window.open(whatsappURL, '_blank');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       alert('Please fix the errors in the form before submitting.');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const orderId = generateOrderId();
//       const itemList = cart.map(item => 
//         `• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
//       ).join('\n');
      
//       const orderDetails = {
//         orderId,
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
//         paymentMethod: formData.paymentMethod,
//         total: total,
//         items: `${cart.reduce((sum, item) => sum + item.quantity, 0)} items`,
//         itemList: itemList,
//         notes: formData.notes
//       };

//       const emailSent = await sendEmail(orderDetails);
//       sendWhatsAppMessage(orderDetails);

//       await new Promise(resolve => setTimeout(resolve, 1500));

//       if (emailSent) {
//         alert('🎉 Order placed successfully! Confirmation email sent.');
//       } else {
//         alert('🎉 Order placed! (Note: Email notification failed)');
//       }

//       onOrderPlaced(orderDetails);
      
//     } catch (error) {
//       console.error('Order processing error:', error);
//       alert('There was an error processing your order. Please try again or contact us directly.');
//       setIsSubmitting(false);
//     }
//   };

//   const paymentOptions = [
//     { id: 'cod', label: 'Cash on Delivery', description: 'Pay when you receive your order', icon: '💰' },
//     { id: 'bank', label: 'Bank Transfer', description: 'Transfer funds directly to our bank', icon: '🏦' }
//   ];

//   return (
//     <form className="checkout-form" onSubmit={handleSubmit}>
//       <div className="form-section">
//         <div className="section-header">
//           <div className="section-icon">🚚</div>
//           <h2>Shipping Information</h2>
//         </div>
//         <p className="section-description">Please provide your details for order processing and delivery</p>
        
//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="name" className="form-label">Full Name *</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className={`form-input ${errors.name ? 'error' : ''}`}
//               placeholder="John Doe"
//             />
//             {errors.name && <span className="error-message">{errors.name}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="email" className="form-label">Email Address *</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`form-input ${errors.email ? 'error' : ''}`}
//               placeholder="john@example.com"
//             />
//             {errors.email && <span className="error-message">{errors.email}</span>}
//           </div>
//         </div>

//         <div className="form-group">
//           <label htmlFor="phone" className="form-label">Phone Number *</label>
//           <input
//             type="tel"
//             id="phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className={`form-input ${errors.phone ? 'error' : ''}`}
//             placeholder="+501 661-1904"
//           />
//           {errors.phone && <span className="error-message">{errors.phone}</span>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="address" className="form-label">Shipping Address *</label>
//           <textarea
//             id="address"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             className={`form-textarea ${errors.address ? 'error' : ''}`}
//             placeholder="123 Main Street, Building Name, Apt/Unit #"
//             rows="3"
//           />
//           {errors.address && <span className="error-message">{errors.address}</span>}
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="city" className="form-label">City *</label>
//             <input
//               type="text"
//               id="city"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               className={`form-input ${errors.city ? 'error' : ''}`}
//               placeholder="Belize City"
//             />
//             {errors.city && <span className="error-message">{errors.city}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="zipCode" className="form-label">ZIP Code *</label>
//             <input
//               type="text"
//               id="zipCode"
//               name="zipCode"
//               value={formData.zipCode}
//               onChange={handleChange}
//               className={`form-input ${errors.zipCode ? 'error' : ''}`}
//               placeholder="12345"
//             />
//             {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
//           </div>
//         </div>

//         <div className="form-group">
//           <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
//           <textarea
//             id="notes"
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             className="form-textarea"
//             placeholder="Gift wrapping, delivery instructions, size preferences, etc."
//             rows="3"
//           />
//           <small className="helper-text">Add any special instructions for your order</small>
//         </div>
//       </div>

//       <div className="info-cards-container">
//         <div className="info-card">
//           <div className="card-header">
//             <div className="card-icon">💳</div>
//             <h3>Payment Method</h3>
//           </div>
          
//           <div className="payment-options">
//             {paymentOptions.map(option => (
//               <label 
//                 key={option.id}
//                 className={`payment-option ${formData.paymentMethod === option.id ? 'selected' : ''}`}
//               >
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value={option.id}
//                   checked={formData.paymentMethod === option.id}
//                   onChange={handleChange}
//                   className="payment-radio"
//                 />
//                 <div className="payment-option-content">
//                   <div className="payment-icon">{option.icon}</div>
//                   <div className="payment-info">
//                     <div className="payment-title">{option.label}</div>
//                     <div className="payment-description">{option.description}</div>
//                   </div>
//                 </div>
//               </label>
//             ))}
//           </div>
          
//           <div className="payment-notice">
//             <div className="notice-icon">ℹ️</div>
//             <div className="notice-content">
//               {formData.paymentMethod === 'cod' 
//                 ? 'Cash payment will be collected upon delivery. Exact change is appreciated.' 
//                 : 'Bank transfer details will be sent via WhatsApp after order confirmation.'}
//             </div>
//           </div>
//         </div>

//         <div className="info-card whatsapp-card">
//           <div className="card-header">
//             <div className="card-icon">📱</div>
//             <h3>WhatsApp Order Process</h3>
//           </div>
          
//           <div className="process-steps">
//             <div className="process-step">
//               <div className="step-number">1</div>
//               <div className="step-content">
//                 <h4>Fill Information</h4>
//                 <p>Complete all shipping details above</p>
//               </div>
//             </div>
//             <div className="process-step">
//               <div className="step-number">2</div>
//               <div className="step-content">
//                 <h4>Select Payment</h4>
//                 <p>Choose your preferred payment method</p>
//               </div>
//             </div>
//             <div className="process-step">
//               <div className="step-number">3</div>
//               <div className="step-content">
//                 <h4>Place Order</h4>
//                 <p>Click the button below to submit</p>
//               </div>
//             </div>
//             <div className="process-step">
//               <div className="step-number">4</div>
//               <div className="step-content">
//                 <h4>WhatsApp Opens</h4>
//                 <p>Order details auto-filled for you</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="whatsapp-notice">
//             <div className="notice-icon">💡</div>
//             <div className="notice-content">
//               <strong>Keep WhatsApp open</strong> to receive order updates and respond to our team for faster processing.
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="form-footer">
//         <div className="order-total-display">
//           <div className="total-label">Order Total</div>
//           <div className="total-amount">${total.toFixed(2)}</div>
//         </div>
        
//         <button 
//           type="submit" 
//           className="submit-button"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <>
//               <span className="spinner"></span>
//               Processing Order...
//             </>
//           ) : (
//             <>
//               <span className="button-icon">📱</span>
//               Place Order & Open WhatsApp
//               <span className="button-arrow">→</span>
//             </>
//           )}
//         </button>
        
//         <div className="security-notice">
//           <div className="security-icon">🔒</div>
//           <p>Your information is secure. No payment is processed on this site.</p>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default CheckoutForm;








// import React, { useState } from 'react';
// import emailjs from '@emailjs/browser';
// import '../styles/CheckoutForm.css';

// const CheckoutForm = ({ cart, total, onOrderPlaced }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     zipCode: '',
//     notes: '',
//     paymentMethod: 'cod'
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
//     if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
//     if (!formData.address.trim()) newErrors.address = 'Address is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const generateOrderId = () => {
//     return 'KD-' + Date.now().toString().slice(-8) + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//   };

//   const sendEmail = async (orderDetails) => {
//     try {
//       const serviceID = 'YOUR_SERVICE_ID';
//       const templateID = 'YOUR_TEMPLATE_ID';
//       const userID = 'YOUR_PUBLIC_KEY';
      
//       const emailParams = {
//         to_name: 'Karibbean Dealz',
//         customer_name: formData.name,
//         customer_email: formData.email,
//         customer_phone: formData.phone,
//         customer_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
//         order_id: orderDetails.orderId,
//         order_total: `$${total.toFixed(2)}`,
//         order_items: orderDetails.itemList,
//         order_date: new Date().toLocaleDateString(),
//         order_time: new Date().toLocaleTimeString(),
//         payment_method: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
//         customer_notes: formData.notes || 'No additional notes'
//       };

//       await emailjs.send(serviceID, templateID, emailParams, userID);
//       return true;
//     } catch (error) {
//       console.error('Failed to send email:', error);
//       return false;
//     }
//   };

//   const sendWhatsAppMessage = (orderDetails) => {
//     const whatsappNumber = '6111904';
    
//     const paymentMethodText = formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer';
    
//     const message = `🛍️ *Karibbean Dealz ORDER CONFIRMATION* 🛍️

// 📋 *Order ID:* ${orderDetails.orderId}
// 📅 *Date:* ${new Date().toLocaleDateString()}
// ⏰ *Time:* ${new Date().toLocaleTimeString()}
// 💳 *Payment Method:* ${paymentMethodText}

// 👤 *Customer Information*
// • Name: ${formData.name}
// • Email: ${formData.email}
// • Phone: ${formData.phone}
// • Address: ${formData.address}, ${formData.city}, ${formData.zipCode}

// 🛒 *Order Details*
// ${orderDetails.itemList}

// 💰 *Order Summary*
// • Subtotal: $${total.toFixed(2)}
// • Shipping: To be confirmed
// • **Total: $${total.toFixed(2)}**

// 📝 *Customer Notes:*
// ${formData.notes || 'No special instructions'}

// ---

// 🔄 *Next Steps:*
// 1. Please contact customer to confirm payment method
// 2. Process order once payment is confirmed
// 3. Update customer with shipping details

// 📞 *Contact Customer:* ${formData.phone}
// 📧 *Email:* ${formData.email}`;

//     const encodedMessage = encodeURIComponent(message);
//     const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
//     window.open(whatsappURL, '_blank');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       alert('Please fix the errors in the form before submitting.');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const orderId = generateOrderId();
//       const itemList = cart.map(item => 
//         `• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
//       ).join('\n');
      
//       const orderDetails = {
//         orderId,
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
//         paymentMethod: formData.paymentMethod,
//         total: total,
//         items: `${cart.reduce((sum, item) => sum + item.quantity, 0)} items`,
//         itemList: itemList,
//         notes: formData.notes
//       };

//       const emailSent = await sendEmail(orderDetails);
//       sendWhatsAppMessage(orderDetails);

//       await new Promise(resolve => setTimeout(resolve, 1500));

//       if (emailSent) {
//         alert('🎉 Order placed successfully! Confirmation email sent.');
//       } else {
//         alert('🎉 Order placed! (Note: Email notification failed)');
//       }

//       onOrderPlaced(orderDetails);
      
//     } catch (error) {
//       console.error('Order processing error:', error);
//       alert('There was an error processing your order. Please try again or contact us directly.');
//       setIsSubmitting(false);
//     }
//   };

//   const paymentOptions = [
//     { id: 'cod', label: 'Cash on Delivery', description: 'Pay when you receive your order', icon: '💰' },
//     { id: 'bank', label: 'Bank Transfer', description: 'Transfer funds to our bank account', icon: '🏦' }
//   ];

//   return (
//     <form className="checkout-form" onSubmit={handleSubmit}>
//       <div className="form-section">
//         <div className="section-header">
//           <h2>Shipping Information</h2>
//           <p className="section-subtitle">Fill in your details for order processing and delivery</p>
//         </div>
        
//         <div className="form-grid">
//           <div className="form-group">
//             <label htmlFor="name" className="form-label">
//               Full Name *
//               {errors.name && <span className="error-indicator">!</span>}
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className={`form-input ${errors.name ? 'error' : ''}`}
//               placeholder="John Doe"
//             />
//             {errors.name && <span className="error-message">{errors.name}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="email" className="form-label">
//               Email Address *
//               {errors.email && <span className="error-indicator">!</span>}
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`form-input ${errors.email ? 'error' : ''}`}
//               placeholder="john@example.com"
//             />
//             {errors.email && <span className="error-message">{errors.email}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="phone" className="form-label">
//               Phone Number *
//               {errors.phone && <span className="error-indicator">!</span>}
//             </label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className={`form-input ${errors.phone ? 'error' : ''}`}
//               placeholder="+501 661-1904"
//             />
//             {errors.phone && <span className="error-message">{errors.phone}</span>}
//           </div>

//           <div className="form-group full-width">
//             <label htmlFor="address" className="form-label">
//               Shipping Address *
//               {errors.address && <span className="error-indicator">!</span>}
//             </label>
//             <textarea
//               id="address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               className={`form-textarea ${errors.address ? 'error' : ''}`}
//               placeholder="123 Main Street, Building Name, Apartment/Unit #"
//               rows="3"
//             />
//             {errors.address && <span className="error-message">{errors.address}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="city" className="form-label">
//               City *
//               {errors.city && <span className="error-indicator">!</span>}
//             </label>
//             <input
//               type="text"
//               id="city"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               className={`form-input ${errors.city ? 'error' : ''}`}
//               placeholder="Belize City"
//             />
//             {errors.city && <span className="error-message">{errors.city}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="zipCode" className="form-label">
//               ZIP Code *
//               {errors.zipCode && <span className="error-indicator">!</span>}
//             </label>
//             <input
//               type="text"
//               id="zipCode"
//               name="zipCode"
//               value={formData.zipCode}
//               onChange={handleChange}
//               className={`form-input ${errors.zipCode ? 'error' : ''}`}
//               placeholder="12345"
//             />
//             {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
//           </div>

//           <div className="form-group full-width">
//             <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
//             <textarea
//               id="notes"
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               className="form-textarea"
//               placeholder="Special delivery instructions, gift wrapping requests, size preferences, etc."
//               rows="3"
//             />
//             <small className="helper-text">Any special instructions for your order</small>
//           </div>
//         </div>
//       </div>
//       {/* Submit Section */}
//       {/* <div className="submit-section">
//         <div className="order-total-display">
//           <div className="total-label">Order Total</div>
//           <div className="total-amount">${total.toFixed(2)}</div>
//         </div>
        
//         <div className="submit-button-container">
//           <button 
//             type="submit" 
//             className="submit-button"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <span className="spinner"></span>
//                 Processing Your Order...
//               </>
//             ) : (
//               <>
//                 <span className="button-icon">📱</span>
//                 Place Order & Open WhatsApp
//                 <span className="button-arrow">→</span>
//               </>
//             )}
//           </button>
          
//           <div className="security-notice">
//             <div className="security-icon">🔒</div>
//             <p>Your information is secure. No payment is processed on this site.</p>
//           </div>
//         </div>
//       </div> */}
//     </form>
//   );
// };

// export default CheckoutForm;