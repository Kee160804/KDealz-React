
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';

const Cart = ({ cart, getCartTotal, removeFromCart, updateQuantity, onClose }) => {
  if (cart.length === 0) {
    return (
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-modal" onClick={e => e.stopPropagation()}>
          <div className="cart-header">
            <h3>🛒 Shopping Cart</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛍️</div>
            <p>Your cart is empty</p>
            <Link to="/products" className="btn btn-primary" onClick={onClose}>
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h3>🛒 Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p className="item-price">${item.price.toFixed(2)} each</p>
                
                <div className="quantity-control">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="cart-item-actions">
                <span className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button 
                  className="remove-item"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span className="shipping-note">Calculated at checkout</span>
          </div>
          <div className="cart-total">
            <span>Total:</span>
            <span className="total-amount">${getCartTotal().toFixed(2)}</span>
          </div>
          
          <div className="cart-buttons">
            <button className="btn btn-outline" onClick={onClose}>
              Continue Shopping
            </button>
            <Link to="/checkout" className="btn btn-primary" onClick={onClose}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;