import React, { useState } from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    if (quantity < 1) {
      alert('Please select at least 1 item');
      return;
    }

    // Check overall stock for ALL products
    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    // For footwear OR apparel, require size selection if they have sizes
    const requiresSizeSelection = 
      (product.category === "footwear" || product.category === "apparel") && 
      product.sizes && product.sizes.length > 0;
    
    if (requiresSizeSelection && !selectedSize) {
      alert(`Please select a size for ${product.name}`);
      return;
    }
    
    // For footwear/apparel, check size availability
    if (requiresSizeSelection && selectedSize && product.availableSizes) {
      if (product.availableSizes[selectedSize] < quantity) {
        alert(`Only ${product.availableSizes[selectedSize]} available in size ${selectedSize}`);
        return;
      }
    }

    addToCart(product, quantity, selectedSize);
    setShowSuccess(true);
    setQuantity(1);
    setSelectedSize('');
    
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
      'beauty-bodycare': '#f1c40f',
      'bathroom-essentials': '#3498db',
      'footwear': '#e67e22',
      'home-living': '#9b59b6',
      'electronics': '#34495e',
      'apparel': '#e74c3c',
      'mens-clothing': '#3498db',
      'womens-clothing': '#e74c3c',
      'accessories': '#1abc9c'
    };
    return colors[category] || '#2c3e50';
  };

  // Check if product requires size selection
  const requiresSizeSelection = 
    (product.category === "footwear" || product.category === "apparel") && 
    product.sizes && product.sizes.length > 0;

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
        
        {/* Stock badge for ALL products */}
        {product.stock > 0 && (
          <span className="stock-badge in-stock">
            {product.stock} in stock
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
            {product.tags && product.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Stock information for ALL products */}
        {/* <div className="stock-info">
          <div className="stock-status">
            <span className="stock-label">Available:</span>
            <span className={`stock-count ${product.stock > 10 ? 'high-stock' : product.stock > 0 ? 'low-stock' : 'no-stock'}`}>
              {product.stock} items
            </span>
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <p className="low-stock-warning">⏳ Low stock - order soon!</p>
          )}
        </div> */}

        {/* Size Selector for Footwear AND Apparel */}
        {requiresSizeSelection && (
          <div className="size-selector">
            <label className="size-label">Select Size:</label>
            <div className="size-options">
              {product.sizes.map(size => {
                const isAvailable = product.availableSizes && 
                                   product.availableSizes[size] > 0;
                const isSelected = selectedSize === size;
                
                return (
                  <button
                    key={size}
                    type="button"
                    className={`size-option ${isSelected ? 'selected' : ''} ${!isAvailable ? 'out-of-stock' : ''}`}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    disabled={!isAvailable}
                    title={isAvailable ? `Size ${size} - ${product.availableSizes[size]} available` : 'Out of stock'}
                    data-size={size}
                  >
                    {size}
                    {!isAvailable && <span className="size-stock-badge">X</span>}
                  </button>
                );
              })}
            </div>
            {selectedSize && product.availableSizes && (
              <div className="size-stock-info">
                {product.availableSizes[selectedSize]} available in size {selectedSize}
              </div>
            )}
          </div>
        )}

        <div className="quantity-selector">
          <div className="quantity-control">
            <button 
              className="quantity-btn"
              onClick={decrementQuantity}
              disabled={quantity <= 1 || product.stock === 0}
              title="Decrease quantity"
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
              aria-label="Quantity"
            />
            <button 
              className="quantity-btn"
              onClick={incrementQuantity}
              disabled={quantity >= product.stock || product.stock === 0}
              title="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            className={`add-to-cart-btn ${product.stock === 0 ? 'out-of-stock' : ''} ${
              requiresSizeSelection && !selectedSize ? 'disabled' : ''
            }`}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || (requiresSizeSelection && !selectedSize)}
            title={
              product.stock === 0 ? 'Out of stock' : 
              requiresSizeSelection && !selectedSize ? 'Select a size first' : 
              'Add to cart'
            }
          >
            {product.stock === 0 ? 'Out of Stock' : 
             requiresSizeSelection && !selectedSize ? 'Select Size' : 
             'Add to Cart'}
          </button>
        </div>

        {showSuccess && (
          <div className="success-message">
            ✓ Added {quantity} {product.name} 
            {selectedSize && ` (Size: ${selectedSize})`} to cart!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;