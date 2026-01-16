import React, { useState } from 'react';
import CheckoutForm from '../components/CheckoutForm';
import '../styles/CheckOut.css';

const CheckoutPage = ({ cart, getCartTotal, clearCart }) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleOrderPlaced = (details) => {
    setOrderDetails(details);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="order-confirmation-page">
        <div className="confirmation-container">
          <div className="success-animation">🎉</div>
          <h1>Order Confirmed!</h1>
          <p className="confirmation-message">
            Thank you for your order, {orderDetails.name}! Your StyleHub order #{orderDetails.orderId} has been received.
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

        <div className="checkout-content">
          <div className="order-summary">
            <h2>📦 Order Summary</h2>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <div className="item-details">
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price.toFixed(2)} each</span>
                    </div>
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span className="shipping-note">Calculated after order</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span className="total-amount">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="checkout-form-section">
            <CheckoutForm 
              cart={cart}
              total={getCartTotal()}
              onOrderPlaced={handleOrderPlaced}
            />
            
            <div className="payment-info">
              <h3>💳 Payment Information</h3>
              <div className="info-box">
                <p><strong>Important Notice:</strong> No payment is processed directly on this website.</p>
                <div className="payment-methods">
                  <div className="payment-method">
                    <div className="method-icon">💵</div>
                    <div className="method-info">
                      <h4>Cash on Delivery</h4>
                      <p>Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="payment-method">
                    <div className="method-icon">🏦</div>
                    <div className="method-info">
                      <h4>Bank Transfer</h4>
                      <p>Direct bank transfer details will be provided</p>
                    </div>
                  </div>
                  <div className="payment-method">
                    <div className="method-icon">📱</div>
                    <div className="method-info">
                      <h4>Mobile Payment</h4>
                      <p>Pay via mobile money or digital wallets</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;