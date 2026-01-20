import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';

const Cart = ({ cart, getCartTotal, removeFromCart, updateQuantity, onClose }) => {
  // Debug log to see what's in the cart
  console.log('Cart - Current cart items:', cart.map(item => ({
    id: item.id,
    name: item.name,
    selectedSize: item.selectedSize,
    quantity: item.quantity,
    price: item.price
  })));

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

  const handleIncreaseQuantity = (item) => {
    console.log('Increasing quantity for:', {
      id: item.id,
      name: item.name,
      selectedSize: item.selectedSize,
      currentQuantity: item.quantity
    });

    // Calculate available stock for this item
    const availableStock = item.selectedSize && item.availableSizes
      ? item.availableSizes[item.selectedSize] || 0
      : item.stock || 0;

    // Check stock before increasing
    if (item.quantity >= availableStock) {
      if (item.selectedSize) {
        alert(`Only ${availableStock} available in size ${item.selectedSize}`);
      } else {
        alert(`Only ${availableStock} items available in stock`);
      }
      return;
    }

    updateQuantity(item.id, item.quantity + 1, item.selectedSize);
  };

  const handleDecreaseQuantity = (item) => {
    console.log('Decreasing quantity for:', {
      id: item.id,
      name: item.name,
      selectedSize: item.selectedSize,
      currentQuantity: item.quantity
    });

    if (item.quantity <= 1) {
      removeFromCart(item.id, item.selectedSize);
    } else {
      updateQuantity(item.id, item.quantity - 1, item.selectedSize);
    }
  };

  const handleRemoveItem = (item) => {
    console.log('Removing item:', {
      id: item.id,
      name: item.name,
      selectedSize: item.selectedSize
    });
    removeFromCart(item.id, item.selectedSize);
  };

  // Group items by product name and size for display
  const cartItemsBySize = cart.reduce((acc, item) => {
    const key = `${item.name}-${item.selectedSize || 'no-size'}`;
    if (!acc[key]) {
      acc[key] = {
        ...item,
        displayName: item.selectedSize 
          ? `${item.name} (Size: ${item.selectedSize})`
          : item.name
      };
    }
    return acc;
  }, {});

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h3>🛒 Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-items">
          {Object.values(cartItemsBySize).map((item, index) => {
            // Create a unique key that includes size
            const itemKey = item.selectedSize 
              ? `${item.id}-${item.selectedSize}-${index}`
              : `${item.id}-${index}`;
            
            // Calculate available stock (for internal use only)
            const availableStock = item.selectedSize && item.availableSizes
              ? item.availableSizes[item.selectedSize] || 0
              : item.stock || 0;
            
            return (
              <div key={itemKey} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  
                  {/* Display size prominently */}
                  {item.selectedSize && (
                    <div className="item-size-display">
                      <span className="size-label">Size:</span>
                      <span className="size-value">{item.selectedSize}</span>
                    </div>
                  )}
                  
                  <p className="item-price">${item.price.toFixed(2)} each</p>
                  
                  <div className="quantity-control">
                    <button 
                      onClick={() => handleDecreaseQuantity(item)}
                      disabled={item.quantity <= 1}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button 
                      onClick={() => handleIncreaseQuantity(item)}
                      className="qty-btn"
                      disabled={item.quantity >= availableStock}
                      title={item.quantity >= availableStock ? `Only ${availableStock} available` : 'Increase quantity'}
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Show if cart quantity equals available stock */}
                  {item.quantity === availableStock && availableStock > 0 && (
                    <p className="max-quantity-message">
                      ⚠ Maximum quantity reached
                    </p>
                  )}
                </div>
                
                <div className="cart-item-actions">
                  <div className="item-total-section">
                    <span className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="item-quantity-info">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </span>
                    <span className="item-size-info">
                      Size: {item.selectedSize || "One Size"}
                    </span>
                  </div>
                  <button 
                    className="remove-item"
                    onClick={() => handleRemoveItem(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="cart-summary">
          <div className="summary-row">
            <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)}):</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span className="shipping-note">Calculated at checkout</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span className="tax-note">Calculated at checkout</span>
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
          
          {/* Cart summary info */}
          <div className="cart-info">
            <p className="cart-tip">
              💡 You have {Object.keys(cartItemsBySize).length} unique {Object.keys(cartItemsBySize).length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;