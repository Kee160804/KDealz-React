// import React, { useState } from 'react';
// import CheckoutForm from '../components/CheckoutForm';
// import '../styles/CheckOut.css';

// const CheckoutPage = ({ cart, getCartTotal, clearCart }) => {
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [orderDetails, setOrderDetails] = useState(null);

//   const handleOrderPlaced = (details) => {
//     setOrderDetails(details);
//     setOrderPlaced(true);
//     clearCart();
//   };

//   if (orderPlaced) {
//     return (
//       <div className="order-confirmation-page">
//         <div className="confirmation-container">
//           <div className="success-animation">🎉</div>
//           <h1>Order Confirmed!</h1>
//           <p className="confirmation-message">
//             Thank you for your order, {orderDetails.name}! Your StyleHub order #{orderDetails.orderId} has been received.
//           </p>
          
//           <div className="order-details">
//             <h2>📋 Order Details</h2>
//             <div className="details-grid">
//               <div className="detail-item">
//                 <span className="detail-label">Order ID:</span>
//                 <span className="detail-value">{orderDetails.orderId}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Total Amount:</span>
//                 <span className="detail-value">${orderDetails.total.toFixed(2)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Items:</span>
//                 <span className="detail-value">{orderDetails.items}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Shipping to:</span>
//                 <span className="detail-value">{orderDetails.address}</span>
//               </div>
//             </div>
//           </div>

//           <div className="next-steps">
//             <h3>📱 What happens next?</h3>
//             <div className="steps-container">
//               <div className="step-item">
//                 <div className="step-number">1</div>
//                 <div className="step-content">
//                   <h4>Payment Confirmation</h4>
//                   <p>Our team will contact you via WhatsApp at <strong>{orderDetails.phone}</strong> to confirm payment method</p>
//                 </div>
//               </div>
//               <div className="step-item">
//                 <div className="step-number">2</div>
//                 <div className="step-content">
//                   <h4>Order Processing</h4>
//                   <p>Once payment is confirmed, we'll prepare your order for shipment</p>
//                 </div>
//               </div>
//               <div className="step-item">
//                 <div className="step-number">3</div>
//                 <div className="step-content">
//                   <h4>Shipping & Tracking</h4>
//                   <p>You'll receive tracking information via email once your order ships</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="confirmation-actions">
//             <button 
//               onClick={() => window.location.href = '/'}
//               className="btn btn-primary"
//             >
//               Continue Shopping
//             </button>
//             <button 
//               onClick={() => window.print()}
//               className="btn btn-outline"
//             >
//               Print Order Summary
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (cart.length === 0) {
//     return (
//       <div className="empty-cart-page">
//         <div className="empty-cart-content">
//           <div className="empty-cart-icon">🛒</div>
//           <h1>Your Shopping Cart is Empty</h1>
//           <p>Add some amazing products to your cart before proceeding to checkout.</p>
//           <a href="/products" className="btn btn-primary">Browse Products</a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-page">
//       <div className="checkout-container">
//         <div className="checkout-header">
//           <h1>🛍️ Checkout</h1>
//           <p>Complete your purchase in a few simple steps</p>
//         </div>

//         <div className="checkout-progress">
//           <div className="progress-step active">
//             <div className="step-number">1</div>
//             <div className="step-info">
//               <div className="step-title">Review Cart</div>
//               <div className="step-status">Current</div>
//             </div>
//           </div>
//           <div className="progress-step">
//             <div className="step-number">2</div>
//             <div className="step-info">
//               <div className="step-title">Shipping Info</div>
//               <div className="step-status">Next</div>
//             </div>
//           </div>
//           <div className="progress-step">
//             <div className="step-number">3</div>
//             <div className="step-info">
//               <div className="step-title">Place Order</div>
//               <div className="step-status">Final</div>
//             </div>
//           </div>
//         </div>

//         <div className="checkout-content">
//           <div className="order-summary">
//             <h2>📦 Order Summary</h2>
//             <div className="order-items">
//               {cart.map(item => (
//                 <div key={item.id} className="order-item">
//                   <div className="item-image">
//                     <img src={item.image} alt={item.name} />
//                   </div>
//                   <div className="item-info">
//                     <h4>{item.name}</h4>
//                     <div className="item-details">
//                       <span>Quantity: {item.quantity}</span>
//                       <span>Price: ${item.price.toFixed(2)} each</span>
//                     </div>
//                   </div>
//                   <div className="item-total">
//                     ${(item.price * item.quantity).toFixed(2)}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="order-totals">
//               <div className="total-row">
//                 <span>Subtotal:</span>
//                 <span>${getCartTotal().toFixed(2)}</span>
//               </div>
//               <div className="total-row">
//                 <span>Shipping:</span>
//                 <span className="shipping-note">Calculated after order</span>
//               </div>
//               <div className="total-row grand-total">
//                 <span>Total:</span>
//                 <span className="total-amount">${getCartTotal().toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           <div className="checkout-form-section">
//             <CheckoutForm 
//               cart={cart}
//               total={getCartTotal()}
//               onOrderPlaced={handleOrderPlaced}
//             />
            
//             {/* <div className="payment-info">
//               <h3>💳 Payment Information</h3>
//               <div className="info-box">
//                 <p><strong>Important Notice:</strong> No payment is processed directly on this website.</p>
//                 <div className="payment-methods">
//                   <div className="payment-method">
//                     <div className="method-icon">💵</div>
//                     <div className="method-info">
//                       <h4>Cash on Delivery</h4>
//                       <p>Pay when you receive your order</p>
//                     </div>
//                   </div>
//                   <div className="payment-method">
//                     <div className="method-icon">🏦</div>
//                     <div className="method-info">
//                       <h4>Bank Transfer</h4>
//                       <p>Direct bank transfer details will be provided</p>
//                     </div>
//                   </div>
//                   <div className="payment-method">
//                     <div className="method-icon">📱</div>
//                     <div className="method-info">
//                       <h4>Mobile Payment</h4>
//                       <p>Pay via mobile money or digital wallets</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;




// import React, { useState } from 'react';
// import CheckoutForm from '../components/CheckoutForm';
// import '../styles/CheckOut.css';

// const CheckoutPage = ({ cart, getCartTotal, clearCart }) => {
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [orderDetails, setOrderDetails] = useState(null);

//   const handleOrderPlaced = (details) => {
//     setOrderDetails(details);
//     setOrderPlaced(true);
//     clearCart();
//   };

//   if (orderPlaced) {
//     return (
//       <div className="order-confirmation-page">
//         <div className="confirmation-container">
//           <div className="success-animation">
//             <div className="checkmark">✓</div>
//           </div>
//           <h1>Order Confirmed!</h1>
//           <p className="confirmation-message">
//             Thank you for your order, {orderDetails.name}! Your Karibbean Dealz order #{orderDetails.orderId} has been received.
//           </p>
          
//           <div className="order-details-card">
//             <h2>📋 Order Details</h2>
//             <div className="details-grid">
//               <div className="detail-item">
//                 <div className="detail-label">Order ID</div>
//                 <div className="detail-value">{orderDetails.orderId}</div>
//               </div>
//               <div className="detail-item">
//                 <div className="detail-label">Total Amount</div>
//                 <div className="detail-value">${orderDetails.total.toFixed(2)}</div>
//               </div>
//               <div className="detail-item">
//                 <div className="detail-label">Items</div>
//                 <div className="detail-value">{orderDetails.items}</div>
//               </div>
//               <div className="detail-item">
//                 <div className="detail-label">Payment Method</div>
//                 <div className="detail-value">
//                   {orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
//                 </div>
//               </div>
//               <div className="detail-item full-width">
//                 <div className="detail-label">Shipping Address</div>
//                 <div className="detail-value">{orderDetails.address}</div>
//               </div>
//             </div>
//           </div>

//           <div className="next-steps-card">
//             <h3>📱 What happens next?</h3>
//             <div className="steps-container">
//               <div className="step-item">
//                 <div className="step-icon">1️⃣</div>
//                 <div className="step-content">
//                   <h4>WhatsApp Confirmation</h4>
//                   <p>Keep WhatsApp open! Our team will message you to confirm payment details.</p>
//                 </div>
//               </div>
//               <div className="step-item">
//                 <div className="step-icon">2️⃣</div>
//                 <div className="step-content">
//                   <h4>Payment Processing</h4>
//                   <p>Once payment is confirmed, we'll prepare your order for shipment.</p>
//                 </div>
//               </div>
//               <div className="step-item">
//                 <div className="step-icon">3️⃣</div>
//                 <div className="step-content">
//                   <h4>Shipping & Tracking</h4>
//                   <p>You'll receive tracking information via email once your order ships.</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="whatsapp-notice">
//               <div className="whatsapp-icon">💬</div>
//               <div className="notice-content">
//                 <strong>Important:</strong> Please keep WhatsApp open to receive order updates and respond to our team.
//               </div>
//             </div>
//           </div>

//           <div className="confirmation-actions">
//             <button 
//               onClick={() => window.location.href = '/'}
//               className="btn btn-primary"
//             >
//               Continue Shopping
//             </button>
//             <button 
//               onClick={() => window.print()}
//               className="btn btn-outline"
//             >
//               Print Order Summary
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (cart.length === 0) {
//     return (
//       <div className="empty-cart-page">
//         <div className="empty-cart-container">
//           <div className="empty-cart-icon">🛒</div>
//           <h1>Your Shopping Cart is Empty</h1>
//           <p>Add some amazing products to your cart before proceeding to checkout.</p>
//           <div className="empty-cart-actions">
//             <a href="/products" className="btn btn-primary">Browse Products</a>
//             <a href="/" className="btn btn-outline">Return to Home</a>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const total = getCartTotal();
//   const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

//   return (
//     <div className="checkout-page">
//       <div className="checkout-container">
//         <div className="checkout-header">
//           <h1>🛍️ Checkout</h1>
//           <p className="checkout-subtitle">Complete your purchase in a few simple steps</p>
//         </div>

//         <div className="checkout-progress">
//           <div className="progress-step active">
//             <div className="step-indicator">
//               <div className="step-number">1</div>
//               <div className="step-line"></div>
//             </div>
//             <div className="step-info">
//               <div className="step-title">Cart Review</div>
//               <div className="step-description">{itemCount} items</div>
//             </div>
//           </div>
//           <div className="progress-step">
//             <div className="step-indicator">
//               <div className="step-number">2</div>
//               <div className="step-line"></div>
//             </div>
//             <div className="step-info">
//               <div className="step-title">Shipping Info</div>
//               <div className="step-description">Delivery details</div>
//             </div>
//           </div>
//           <div className="progress-step">
//             <div className="step-indicator">
//               <div className="step-number">3</div>
//             </div>
//             <div className="step-info">
//               <div className="step-title">Place Order</div>
//               <div className="step-description">Confirm & pay</div>
//             </div>
//           </div>
//         </div>

//         <div className="checkout-content">
//           <div className="order-summary-card">
//             <div className="card-header">
//               <h2>📦 Order Summary</h2>
//               <span className="item-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
//             </div>
            
//             <div className="order-items">
//               {cart.map(item => (
//                 <div key={item.id} className="order-item">
//                   <div className="item-image">
//                     <img src={item.image || '/placeholder-item.jpg'} alt={item.name} />
//                     <span className="quantity-badge">{item.quantity}</span>
//                   </div>
//                   <div className="item-info">
//                     <h4 className="item-name">{item.name}</h4>
//                     <p className="item-price">${item.price.toFixed(2)} each</p>
//                   </div>
//                   <div className="item-total">
//                     ${(item.price * item.quantity).toFixed(2)}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="order-totals">
//               <div className="total-row">
//                 <span>Subtotal</span>
//                 <span>${total.toFixed(2)}</span>
//               </div>
//               <div className="total-row">
//                 <span>Shipping</span>
//                 <span className="shipping-note">Calculated after order</span>
//               </div>
//               <div className="total-row">
//                 <span>Tax</span>
//                 <span>$0.00</span>
//               </div>
//               <div className="total-row grand-total">
//                 <span>Total</span>
//                 <span className="total-amount">${total.toFixed(2)}</span>
//               </div>
//             </div>
            
//             <div className="order-notice">
//               <div className="notice-icon">ℹ️</div>
//               <p>Shipping costs will be confirmed via WhatsApp after order placement.</p>
//             </div>
//           </div>

//           <div className="checkout-form-container">
//             <CheckoutForm 
//               cart={cart}
//               total={total}
//               onOrderPlaced={handleOrderPlaced}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage; 







// import React, { useState } from 'react';
// import CheckoutForm from '../components/CheckoutForm';
// import '../styles/CheckOut.css';

// const CheckoutPage = ({ cart, getCartTotal, clearCart }) => {
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [orderDetails, setOrderDetails] = useState(null);

//   const handleOrderPlaced = (details) => {
//     setOrderDetails(details);
//     setOrderPlaced(true);
//     clearCart();
//   };

//   if (orderPlaced) {
//     return (
//       <div className="order-confirmation-page">
//         <div className="confirmation-container">
//           <div className="success-animation">
//             <div className="checkmark">✓</div>
//           </div>
//           <h1>Order Confirmed!</h1>
//           <p className="confirmation-message">
//             Thank you for your order, {orderDetails.name}! Your Karibbean Dealz order #{orderDetails.orderId} has been received.
//           </p>
          
//           <div className="order-details-card">
//             <h2>📋 Order Details</h2>
//             <div className="details-grid">
//               <div className="detail-item">
//                 <div className="detail-label">Order ID</div>
//                 <div className="detail-value">{orderDetails.orderId}</div>
//               </div>
//               <div className="detail-item">
//                 <div className="detail-label">Total Amount</div>
//                 <div className="detail-value">${orderDetails.total.toFixed(2)}</div>
//               </div>
//               <div className="detail-item">
//                 <div className="detail-label">Items</div>
//                 <div className="detail-value">{orderDetails.items}</div>
//               </div>
//               <div className="detail-item">
//                 <div className="detail-label">Payment Method</div>
//                 <div className="detail-value">
//                   {orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
//                 </div>
//               </div>
//               <div className="detail-item full-width">
//                 <div className="detail-label">Shipping Address</div>
//                 <div className="detail-value">{orderDetails.address}</div>
//               </div>
//             </div>
//           </div>

//           <div className="next-steps-card">
//             <h3>📱 What happens next?</h3>
//             <div className="steps-container">
//               <div className="step-item">
//                 <div className="step-icon">1️⃣</div>
//                 <div className="step-content">
//                   <h4>WhatsApp Confirmation</h4>
//                   <p>Keep WhatsApp open! Our team will message you to confirm payment details.</p>
//                 </div>
//               </div>
//               <div className="step-item">
//                 <div className="step-icon">2️⃣</div>
//                 <div className="step-content">
//                   <h4>Payment Processing</h4>
//                   <p>Once payment is confirmed, we'll prepare your order for shipment.</p>
//                 </div>
//               </div>
//               <div className="step-item">
//                 <div className="step-icon">3️⃣</div>
//                 <div className="step-content">
//                   <h4>Shipping & Tracking</h4>
//                   <p>You'll receive tracking information via email once your order ships.</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="whatsapp-notice">
//               <div className="whatsapp-icon">💬</div>
//               <div className="notice-content">
//                 <strong>Important:</strong> Please keep WhatsApp open to receive order updates and respond to our team.
//               </div>
//             </div>
//           </div>

//           <div className="confirmation-actions">
//             <button 
//               onClick={() => window.location.href = '/'}
//               className="btn btn-primary"
//             >
//               Continue Shopping
//             </button>
//             <button 
//               onClick={() => window.print()}
//               className="btn btn-outline"
//             >
//               Print Order Summary
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (cart.length === 0) {
//     return (
//       <div className="empty-cart-page">
//         <div className="empty-cart-container">
//           <div className="empty-cart-icon">🛒</div>
//           <h1>Your Shopping Cart is Empty</h1>
//           <p>Add some amazing products to your cart before proceeding to checkout.</p>
//           <div className="empty-cart-actions">
//             <a href="/products" className="btn btn-primary">Browse Products</a>
//             <a href="/" className="btn btn-outline">Return to Home</a>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const total = getCartTotal();
//   const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

//   return (
//     <div className="checkout-page">
//       <div className="checkout-container">
//         <div className="checkout-header">
//           <h1>🛍️ Checkout</h1>
//           <p className="checkout-subtitle">Complete your purchase in a few simple steps</p>
//         </div>

//         <div className="checkout-progress">
//           <div className="progress-step active">
//             <div className="step-indicator">
//               <div className="step-number">1</div>
//               <div className="step-line"></div>
//             </div>
//             <div className="step-info">
//               <div className="step-title">Cart Review</div>
//               <div className="step-description">{itemCount} items</div>
//             </div>
//           </div>
//           <div className="progress-step">
//             <div className="step-indicator">
//               <div className="step-number">2</div>
//               <div className="step-line"></div>
//             </div>
//             <div className="step-info">
//               <div className="step-title">Shipping Info</div>
//               <div className="step-description">Delivery details</div>
//             </div>
//           </div>
//           <div className="progress-step">
//             <div className="step-indicator">
//               <div className="step-number">3</div>
//             </div>
//             <div className="step-info">
//               <div className="step-title">Place Order</div>
//               <div className="step-description">Confirm & pay</div>
//             </div>
//           </div>
//         </div>

//         <div className="checkout-content">
//           {/* Left Column - Order Summary & Payment/WhatsApp Cards */}
//           <div className="left-column">
//             {/* Order Summary Card */}
//             <div className="order-summary-card">
//               <div className="card-header">
//                 <div className="card-icon">📦</div>
//                 <div>
//                   <h3>Order Summary</h3>
//                   <p className="card-subtitle">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
//                 </div>
//               </div>
              
//               <div className="card-content">
//                 <div className="order-items">
//                   {cart.map(item => (
//                     <div key={item.id} className="order-item">
//                       <div className="item-image">
//                         <img src={item.image || '/placeholder-item.jpg'} alt={item.name} />
//                         <span className="quantity-badge">{item.quantity}</span>
//                       </div>
//                       <div className="item-info">
//                         <h4 className="item-name">{item.name}</h4>
//                         <p className="item-price">${item.price.toFixed(2)} each</p>
//                       </div>
//                       <div className="item-total">
//                         ${(item.price * item.quantity).toFixed(2)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="order-totals">
//                   <div className="total-row">
//                     <span>Subtotal</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                   <div className="total-row">
//                     <span>Shipping</span>
//                     <span className="shipping-note">Calculated after order</span>
//                   </div>
//                   <div className="total-row">
//                     <span>Tax</span>
//                     <span>$0.00</span>
//                   </div>
//                   <div className="total-row grand-total">
//                     <span>Total</span>
//                     <span className="total-amount">${total.toFixed(2)}</span>
//                   </div>
//                 </div>
                
//                 <div className="order-notice">
//                   <div className="notice-icon">ℹ️</div>
//                   <p>Shipping costs will be confirmed via WhatsApp after order placement.</p>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Method Card */}
//             <div className="payment-method-card">
//               <div className="card-header">
//                 <div className="card-icon">💳</div>
//                 <div>
//                   <h3>Payment Method</h3>
//                   <p className="card-subtitle">Select how you'd like to pay</p>
//                 </div>
//               </div>
              
//               <div className="card-content">
//                 <div className="payment-options">
//                   <label className="payment-option">
//                     <input type="radio" name="payment" value="cod" defaultChecked />
//                     <div className="payment-content">
//                       <div className="payment-icon">💰</div>
//                       <div className="payment-info">
//                         <div className="payment-title">Cash on Delivery</div>
//                         <div className="payment-description">Pay when you receive your order</div>
//                       </div>
//                     </div>
//                   </label>
                  
//                   <label className="payment-option">
//                     <input type="radio" name="payment" value="bank" />
//                     <div className="payment-content">
//                       <div className="payment-icon">🏦</div>
//                       <div className="payment-info">
//                         <div className="payment-title">Bank Transfer</div>
//                         <div className="payment-description">Transfer funds to our bank account</div>
//                       </div>
//                     </div>
//                   </label>
//                 </div>
                
//                 <div className="payment-notice">
//                   <div className="notice-icon">ℹ️</div>
//                   <p>Payment details will be confirmed via WhatsApp after order placement.</p>
//                 </div>
//               </div>
//             </div>

//             {/* WhatsApp Process Card */}
//             <div className="whatsapp-card">
//               <div className="card-header">
//                 <div className="card-icon">📱</div>
//                 <div>
//                   <h3>WhatsApp Process</h3>
//                   <p className="card-subtitle">How your order will be confirmed</p>
//                 </div>
//               </div>
              
//               <div className="card-content">
//                 <div className="process-steps">
//                   <div className="process-step">
//                     <div className="step-number">1</div>
//                     <div className="step-info">
//                       <h4>Complete Form</h4>
//                       <p>Fill in all your shipping details</p>
//                     </div>
//                   </div>
//                   <div className="process-step">
//                     <div className="step-number">2</div>
//                     <div className="step-info">
//                       <h4>Select Payment</h4>
//                       <p>Choose your preferred payment method</p>
//                     </div>
//                   </div>
//                   <div className="process-step">
//                     <div className="step-number">3</div>
//                     <div className="step-info">
//                       <h4>Place Order</h4>
//                       <p>Submit and WhatsApp will open automatically</p>
//                     </div>
//                   </div>
//                   <div className="process-step">
//                     <div className="step-number">4</div>
//                     <div className="step-info">
//                       <h4>Get Confirmation</h4>
//                       <p>Our team contacts you via WhatsApp</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="whatsapp-notice">
//                   <div className="notice-icon">💡</div>
//                   <p><strong>Important Tip:</strong> Keep WhatsApp open to receive real-time updates and respond quickly to our team.</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Shipping Information */}
//           <div className="right-column">
//             <div className="shipping-card">
//               <div className="card-header">
//                 <div className="card-icon">🚚</div>
//                 <div>
//                   <h3>Shipping Information</h3>
//                   <p className="card-subtitle">Please provide your details for order processing</p>
//                 </div>
//               </div>
              
//               <div className="card-content">
//                 <CheckoutForm 
//                   cart={cart}
//                   total={total}
//                   onOrderPlaced={handleOrderPlaced}
//                 />
//               </div>
              
//               {/* Order Total & Submit Button */}
//               <div className="order-total-section">
//                 <div className="total-display">
//                   <div className="total-label">Order Total</div>
//                   <div className="total-amount">${total.toFixed(2)}</div>
//                 </div>
                
//                 <button 
//                   type="submit" 
//                   className="submit-order-btn"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     // This will be handled by the CheckoutForm
//                     document.querySelector('.checkout-form')?.dispatchEvent(
//                       new Event('submit', { bubbles: true })
//                     );
//                   }}
//                 >
//                   <span className="btn-icon">📱</span>
//                   Place Order & Open WhatsApp
//                   <span className="btn-arrow">→</span>
//                 </button>
                
//                 <div className="security-notice">
//                   <div className="security-icon">🔒</div>
//                   <p>Your information is secure. No payment is processed on this site.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;




import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/CheckOut.css';

const CheckoutPage = ({ cart, getCartTotal, clearCart }) => {
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
      const serviceID = 'YOUR_SERVICE_ID';
      const templateID = 'YOUR_TEMPLATE_ID';
      const userID = 'YOUR_PUBLIC_KEY';
      
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
        payment_method: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
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
    const whatsappNumber = '6111904';
    const paymentMethodText = formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer';
    const itemList = cart.map(item => 
      `• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `🛍️ *Karibbean Dealz ORDER CONFIRMATION* 🛍️

📋 *Order ID:* ${orderDetails.orderId}
📅 *Date:* ${new Date().toLocaleDateString()}
⏰ *Time:* ${new Date().toLocaleTimeString()}
💳 *Payment Method:* ${paymentMethodText}

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

🔄 *Next Steps:*
1. Please contact customer to confirm payment method
2. Process order once payment is confirmed
3. Update customer with shipping details

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
        total: getCartTotal(),
        items: `${cart.reduce((sum, item) => sum + item.quantity, 0)} items`,
        itemList: itemList,
        notes: formData.notes
      };

      const emailSent = await sendEmail(orderDetails);
      sendWhatsAppMessage(orderDetails);

      await new Promise(resolve => setTimeout(resolve, 1500));

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
    { id: 'bank', label: 'Bank Transfer', description: 'Transfer funds to our bank account', icon: '🏦' }
  ];

  // Order placed confirmation page
  if (orderPlaced) {
    return (
      <div className="order-confirmation-page">
        <div className="confirmation-container">
          <div className="success-animation">🎉</div>
          <h1>Order Confirmed!</h1>
          <p className="confirmation-message">
            Thank you for your order, {orderDetails.name}! Your Karibbean Dealz order #{orderDetails.orderId} has been received.
          </p>
          
          <div className="order-details">
            <h2>📋 Order Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Order ID:</span>
                <span className="detail-value">{orderDetails.orderId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Amount:</span>
                <span className="detail-value">${orderDetails.total.toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Items:</span>
                <span className="detail-value">{orderDetails.items}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Shipping to:</span>
                <span className="detail-value">{orderDetails.address}</span>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>📱 What happens next?</h3>
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Payment Confirmation</h4>
                  <p>Our team will contact you via WhatsApp at <strong>{orderDetails.phone}</strong> to confirm payment method</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Order Processing</h4>
                  <p>Once payment is confirmed, we'll prepare your order for shipment</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Shipping & Tracking</h4>
                  <p>You'll receive tracking information via email once your order ships</p>
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button 
              onClick={() => window.location.href = '/'}
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => window.print()}
              className="btn btn-outline"
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
      <div className="empty-cart-page">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h1>Your Shopping Cart is Empty</h1>
          <p>Add some amazing products to your cart before proceeding to checkout.</p>
          <a href="/products" className="btn btn-primary">Browse Products</a>
        </div>
      </div>
    );
  }

  const total = getCartTotal();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>🛍️ Checkout</h1>
          <p>Complete your purchase in a few simple steps</p>
        </div>

        <div className="checkout-progress">
          <div className="progress-step active">
            <div className="step-number">1</div>
            <div className="step-info">
              <div className="step-title">Review Cart</div>
              <div className="step-status">Current</div>
            </div>
          </div>
          <div className="progress-step">
            <div className="step-number">2</div>
            <div className="step-info">
              <div className="step-title">Shipping Info</div>
              <div className="step-status">Next</div>
            </div>
          </div>
          <div className="progress-step">
            <div className="step-number">3</div>
            <div className="step-info">
              <div className="step-title">Place Order</div>
              <div className="step-status">Final</div>
            </div>
          </div>
        </div>

        <form className="checkout-content" onSubmit={handleSubmit}>
          {/* Left Column */}
          <div className="left-column">
            {/* Order Summary Card */}
            <div className="order-summary-card">
              <div className="card-header">
                <div className="card-icon">📦</div>
                <div>
                  <h3>Order Summary</h3>
                  <p className="card-subtitle">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              
              <div className="card-content">
                <div className="order-items">
                  {cart.map(item => (
                    <div key={item.id} className="order-item">
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
                  ))}
                </div>
                
                <div className="order-totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping</span>
                    <span className="shipping-note">Calculated after order</span>
                  </div>
                  <div className="total-row">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total</span>
                    <span className="total-amount">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="order-notice">
                  <div className="notice-icon">ℹ️</div>
                  <p>Shipping costs will be confirmed via WhatsApp after order placement.</p>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="payment-method-card">
              <div className="card-header">
                <div className="card-icon">💳</div>
                <div>
                  <h3>Payment Method</h3>
                  <p className="card-subtitle">Select how you'd like to pay</p>
                </div>
              </div>
              
              <div className="card-content">
                <div className="payment-options">
                  {paymentOptions.map(option => (
                    <label 
                      key={option.id}
                      className={`payment-option ${formData.paymentMethod === option.id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.id}
                        checked={formData.paymentMethod === option.id}
                        onChange={handleChange}
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
                  ))}
                </div>
                
                <div className="payment-notice">
                  <div className="notice-icon">ℹ️</div>
                  <p>
                    {formData.paymentMethod === 'cod' 
                      ? 'Cash payment will be collected upon delivery. Exact change is appreciated.' 
                      : 'Bank transfer details will be sent via WhatsApp after order confirmation.'}
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Process Card */}
            <div className="whatsapp-card">
              <div className="card-header">
                <div className="card-icon">📱</div>
                <div>
                  <h3>WhatsApp Process</h3>
                  <p className="card-subtitle">How your order will be confirmed</p>
                </div>
              </div>
              
              <div className="card-content">
                <div className="process-steps">
                  <div className="process-step">
                    <div className="step-number">1</div>
                    <div className="step-info">
                      <h4>Complete Form</h4>
                      <p>Fill in all shipping details</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">2</div>
                    <div className="step-info">
                      <h4>Select Payment</h4>
                      <p>Choose payment method</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">3</div>
                    <div className="step-info">
                      <h4>Place Order</h4>
                      <p>Submit and open WhatsApp</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">4</div>
                    <div className="step-info">
                      <h4>Get Confirmation</h4>
                      <p>Team contacts you via WhatsApp</p>
                    </div>
                  </div>
                </div>
                
                <div className="whatsapp-notice">
                  <div className="notice-icon">💡</div>
                  <p><strong>Keep WhatsApp open</strong> for real-time updates and faster processing.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Shipping Information */}
          <div className="right-column">
            <div className="shipping-card">
              <div className="card-header">
                <div className="card-icon">🚚</div>
                <div>
                  <h3>Shipping Information</h3>
                  <p className="card-subtitle">Please provide your details for order processing</p>
                </div>
              </div>
              
              <div className="card-content">
                {/* Shipping Form */}
                <div className="shipping-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">
                        Full Name *
                        {errors.name && <span className="error-indicator">!</span>}
                      </label>
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
                      <label htmlFor="email">
                        Email Address *
                        {errors.email && <span className="error-indicator">!</span>}
                      </label>
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
                    <label htmlFor="phone">
                      Phone Number *
                      {errors.phone && <span className="error-indicator">!</span>}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="+501 661-1904"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">
                      Shipping Address *
                      {errors.address && <span className="error-indicator">!</span>}
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={errors.address ? 'error' : ''}
                      placeholder="123 Main Street, Building Name, Apt/Unit #"
                      rows="3"
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">
                        City *
                        {errors.city && <span className="error-indicator">!</span>}
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={errors.city ? 'error' : ''}
                        placeholder="Belize City"
                      />
                      {errors.city && <span className="error-message">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="zipCode">
                        ZIP Code *
                        {errors.zipCode && <span className="error-indicator">!</span>}
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={errors.zipCode ? 'error' : ''}
                        placeholder="12345"
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
                      placeholder="Special delivery instructions, gift wrapping requests, size preferences, etc."
                      rows="3"
                    />
                    <small className="helper-text">Any special instructions for your order</small>
                  </div>
                </div>
                
                {/* Order Total & Submit Button */}
                <div className="order-total-section">
                  <div className="total-display">
                    <div className="total-label">Order Total</div>
                    <div className="total-amount">${total.toFixed(2)}</div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-order-btn"
                    disabled={isSubmitting}
                  >
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
                  
                  <div className="security-notice">
                    <div className="security-icon">🔒</div>
                    <p>Your information is secure. No payment is processed on this site.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;