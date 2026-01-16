import React, { useState } from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    if (quantity < 1) {
      alert('Please select at least 1 item');
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    addToCart(product, quantity);
    setShowSuccess(true);
    setQuantity(1);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'mens-clothing': '#3498db',
      'womens-clothing': '#e74c3c',
      'electronics': '#9b59b6',
      'beauty': '#f1c40f',
      'footwear': '#e67e22',
      'accessories': '#1abc9c'
    };
    return colors[category] || '#2c3e50'; // Use hex color instead of CSS variable
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/300x300/${getCategoryColor(product.category).replace('#', '')}/ffffff?text=${encodeURIComponent(product.name)}`;
          }}
        />
        <span 
          className="category-tag"
          style={{ backgroundColor: getCategoryColor(product.category) }}
        >
          {product.category.replace('-', ' ')}
        </span>
        {product.stock < 10 && product.stock > 0 && (
          <span className="stock-badge low-stock">
            Only {product.stock} left!
          </span>
        )}
        {product.stock === 0 && (
          <span className="stock-badge out-of-stock">
            Out of Stock
          </span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-meta">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <div className="tags">
            {product.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="quantity-selector">
          <div className="quantity-control">
            <button 
              className="quantity-btn"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || product.stock === 0}
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-input"
              disabled={product.stock === 0}
            />
            <button 
              className="quantity-btn"
              onClick={incrementQuantity}
              disabled={quantity >= product.stock || product.stock === 0}
            >
              +
            </button>
          </div>

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        {showSuccess && (
          <div className="success-message">
            ✓ Added {quantity} {product.name} to cart!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;