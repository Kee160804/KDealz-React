import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';

/**
 * Shopping Cart Component
 * Displays cart items with quantity controls and checkout options
 * Supports size variants for products
 */
const Cart = ({ cart, getCartTotal, removeFromCart, updateQuantity, onClose }) => {
  // Debug: Log current cart items for troubleshooting
  console.log('Cart - Current cart items:', cart.map(item => ({
    id: item.id,
    name: item.name,
    selectedSize: item.selectedSize,
    quantity: item.quantity,
    price: item.price
  })));

  /**
   * Calculate available stock for an item considering size variants
   * @param {Object} item - Cart item
   * @returns {number} Available stock count
   */
  const getAvailableStock = (item) => {
    if (item.selectedSize && item.availableSizes) {
      return item.availableSizes[item.selectedSize] || 0;
    }
    return item.stock || 0;
  };

  /**
   * Handle quantity increase with stock validation
   */
  const handleIncreaseQuantity = (item) => {
    console.log('Increasing quantity for:', {
      id: item.id,
      name: item.name,
      selectedSize: item.selectedSize,
      currentQuantity: item.quantity
    });

    const availableStock = getAvailableStock(item);

    if (item.quantity >= availableStock) {
      const message = item.selectedSize 
        ? `Only ${availableStock} available in size ${item.selectedSize}`
        : `Only ${availableStock} items available in stock`;
      alert(message);
      return;
    }

    updateQuantity(item.id, item.quantity + 1, item.selectedSize);
  };

  /**
   * Handle quantity decrease - removes item if quantity becomes 0
   */
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

  /**
   * Remove item from cart
   */
  const handleRemoveItem = (item) => {
    console.log('Removing item:', {
      id: item.id,
      name: item.name,
      selectedSize: item.selectedSize
    });
    removeFromCart(item.id, item.selectedSize);
  };

  /**
   * Group cart items by product name and size for unique display
   */
  const groupedCartItems = cart.reduce((acc, item) => {
    const itemKey = `${item.name}-${item.selectedSize || 'no-size'}`;
    if (!acc[itemKey]) {
      acc[itemKey] = {
        ...item,
        displayName: item.selectedSize 
          ? `${item.name} (Size: ${item.selectedSize})`
          : item.name
      };
    }
    return acc;
  }, {});

  const groupedItemsList = Object.values(groupedCartItems);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-modal" onClick={e => e.stopPropagation()}>
          <CartHeader 
            itemCount={0} 
            onClose={onClose} 
          />
          <EmptyCartView onClose={onClose} />
        </div>
      </div>
    );
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <CartHeader 
          itemCount={totalItems} 
          onClose={onClose} 
        />
        
        <div className="cart-items">
          {groupedItemsList.map((item, index) => (
            <CartItem 
              key={`${item.id}-${item.selectedSize || 'nosize'}-${index}`}
              item={item}
              availableStock={getAvailableStock(item)}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
              onRemove={handleRemoveItem}
              formatPrice={(price) => `$${price.toFixed(2)}`}
            />
          ))}
        </div>
        
        <CartSummary 
          totalItems={totalItems}
          uniqueItemsCount={groupedItemsList.length}
          cartTotal={getCartTotal()}
          onClose={onClose}
          formatPrice={(price) => `$${price.toFixed(2)}`}
        />
      </div>
    </div>
  );
};

/**
 * Cart Header Subcomponent
 */
const CartHeader = ({ itemCount, onClose }) => (
  <div className="cart-header">
    <h3>🛒 Shopping Cart {itemCount > 0 && `(${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}</h3>
    <button className="close-btn" onClick={onClose}>×</button>
  </div>
);

/**
 * Empty Cart View Subcomponent
 */
const EmptyCartView = ({ onClose }) => (
  <div className="empty-cart">
    <div className="empty-cart-icon">🛍️</div>
    <p>Your cart is empty</p>
    <Link to="/products" className="btn btn-primary" onClick={onClose}>
      Browse Products
    </Link>
  </div>
);

/**
 * Individual Cart Item Subcomponent
 */
const CartItem = ({ item, availableStock, onIncrease, onDecrease, onRemove, formatPrice }) => (
  <div className="cart-item">
    <div className="cart-item-image">
      <img src={item.image} alt={item.name} />
    </div>
    
    <div className="cart-item-details">
      <h4>{item.name}</h4>
      
      {item.selectedSize && (
        <div className="item-size-display">
          <span className="size-label">Size:</span>
          <span className="size-value">{item.selectedSize}</span>
        </div>
      )}
      
      <p className="item-price">{formatPrice(item.price)} each</p>
      
      <QuantityControl 
        quantity={item.quantity}
        maxStock={availableStock}
        onIncrease={() => onIncrease(item)}
        onDecrease={() => onDecrease(item)}
        showMaxWarning={item.quantity === availableStock && availableStock > 0}
      />
    </div>
    
    <div className="cart-item-actions">
      <ItemTotal 
        price={item.price}
        quantity={item.quantity}
        size={item.selectedSize}
        formatPrice={formatPrice}
      />
      <button 
        className="remove-item"
        onClick={() => onRemove(item)}
      >
        Remove
      </button>
    </div>
  </div>
);

/**
 * Quantity Control Subcomponent
 */
const QuantityControl = ({ quantity, maxStock, onIncrease, onDecrease, showMaxWarning }) => (
  <>
    <div className="quantity-control">
      <button 
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="qty-btn"
      >
        −
      </button>
      <span className="qty-display">{quantity}</span>
      <button 
        onClick={onIncrease}
        className="qty-btn"
        disabled={quantity >= maxStock}
        title={quantity >= maxStock ? `Only ${maxStock} available` : 'Increase quantity'}
      >
        +
      </button>
    </div>
    
    {showMaxWarning && (
      <p className="max-quantity-message">⚠ Maximum quantity reached</p>
    )}
  </>
);

/**
 * Item Total Display Subcomponent
 */
const ItemTotal = ({ price, quantity, size, formatPrice }) => (
  <div className="item-total-section">
    <span className="item-total">{formatPrice(price * quantity)}</span>
    <span className="item-quantity-info">{quantity} × {formatPrice(price)}</span>
    <span className="item-size-info">Size: {size || "One Size"}</span>
  </div>
);

/**
 * Cart Summary Subcomponent
 */
const CartSummary = ({ totalItems, uniqueItemsCount, cartTotal, onClose, formatPrice }) => (
  <div className="cart-summary">
    <div className="summary-row">
      <span>Items ({totalItems}):</span>
      <span>{formatPrice(cartTotal)}</span>
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
      <span className="total-amount">{formatPrice(cartTotal)}</span>
    </div>
    
    <div className="cart-buttons">
      <button className="btn btn-outline" onClick={onClose}>
        Continue Shopping
      </button>
      <Link to="/checkout" className="btn btn-primary" onClick={onClose}>
        Proceed to Checkout
      </Link>
    </div>
    
    <div className="cart-info">
      <p className="cart-tip">
        💡 You have {uniqueItemsCount} unique {uniqueItemsCount === 1 ? 'item' : 'items'} in your cart
      </p>
    </div>
  </div>
);

export default Cart;