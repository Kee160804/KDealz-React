import React, { useState, useCallback, useMemo } from "react";
import "../styles/ProductCard.css";
import { supabase } from "../lib/supabase/client";

/**
 * ProductCard Component
 * Displays individual product with image, details, size selection, quantity controls, and add to cart
 * Supports size variants for footwear and apparel categories
 */
const ProductCard = ({ product, addToCart }) => {
  console.log(product);
  // Local state
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Category color mapping for visual differentiation
   */
  const CATEGORY_COLORS = {
    "beauty-bodycare": "#f1c40f",
    "bathroom-essentials": "#3498db",
    footwear: "#e67e22",
    "home-living": "#9b59b6",
    electronics: "#34495e",
    apparel: "#e74c3c",
    "mens-clothing": "#3498db",
    "womens-clothing": "#e74c3c",
    accessories: "#1abc9c",
  };

  /**
   * Determine if product requires size selection
   * Only footwear and apparel with sizes array need size picker
   */
  const requiresSizeSelection = useMemo(
    () =>
      (product.category === "footwear" || product.category === "apparel") &&
      product.sizes?.length > 0,
    [product.category, product.sizes],
  );

  /**
   * Get available stock considering size selection
   */
  const getAvailableStock = useCallback(() => {
    if (requiresSizeSelection && selectedSize && product.availableSizes) {
      return product.availableSizes[selectedSize] || 0;
    }
    return product.stock || 0;
  }, [
    requiresSizeSelection,
    selectedSize,
    product.availableSizes,
    product.stock,
  ]);

  /**
   * Validate if product can be added to cart
   * @returns {Object} { isValid: boolean, message: string }
   */
  const validateAddToCart = useCallback(() => {
    if (quantity < 1) {
      return { isValid: false, message: "Please select at least 1 item" };
    }

    const availableStock = getAvailableStock();
    if (quantity > availableStock) {
      const message =
        requiresSizeSelection && selectedSize
          ? `Only ${availableStock} available in size ${selectedSize}`
          : `Only ${availableStock} items available in stock`;
      return { isValid: false, message };
    }

    if (requiresSizeSelection && !selectedSize) {
      return {
        isValid: false,
        message: `Please select a size for ${product.name}`,
      };
    }

    return { isValid: true };
  }, [
    quantity,
    selectedSize,
    product.name,
    requiresSizeSelection,
    getAvailableStock,
  ]);

  /**
   * Handle add to cart action with validation
   */
  const handleAddToCart = useCallback(() => {
    const validation = validateAddToCart();

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    addToCart(product, quantity, selectedSize);

    // Show success feedback
    setShowSuccess(true);
    setQuantity(1);
    setSelectedSize("");

    // Auto-hide success message
    setTimeout(() => setShowSuccess(false), 3000);
  }, [product, quantity, selectedSize, addToCart, validateAddToCart]);

  /**
   * Handle quantity input change
   */
  const handleQuantityChange = useCallback(
    (e) => {
      const value = parseInt(e.target.value);
      const maxStock = getAvailableStock();

      if (!isNaN(value) && value >= 1 && value <= maxStock) {
        setQuantity(value);
      }
    },
    [getAvailableStock],
  );

  /**
   * Increment quantity by 1
   */
  const incrementQuantity = useCallback(() => {
    setQuantity((prev) => Math.min(prev + 1, getAvailableStock()));
  }, [getAvailableStock]);

  /**
   * Decrement quantity by 1
   */
  const decrementQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }, []);

  /**
   * Get category color with fallback
   */
  const getCategoryColor = useCallback(
    () => CATEGORY_COLORS[product.category] || "#2c3e50",
    [product.category],
  );

  /**
   * Handle image load error - fallback to placeholder
   */
  const handleImageError = useCallback(
    (e) => {
      e.target.onerror = null;
      e.target.src = `https://via.placeholder.com/300x300/${getCategoryColor().replace("#", "")}/ffffff?text=${encodeURIComponent(product.name)}`;
    },
    [product.name, getCategoryColor],
  );

  const availableStock = getAvailableStock();
  const isOutOfStock =
    product.stock === 0 ||
    (requiresSizeSelection && selectedSize && availableStock === 0);
  const categoryColor = getCategoryColor();

  return (
    <article className="product-card" aria-label={`Product: ${product.name}`}>
      <ProductImage
        product={product}
        categoryColor={categoryColor}
        onImageError={handleImageError}
        isOutOfStock={isOutOfStock}
      />

      <div className="product-info">
        <ProductHeader product={product} categoryColor={categoryColor} />

        <ProductMeta product={product} />

        {/* Size Selector for Footwear and Apparel */}
        {requiresSizeSelection && (
          <SizeSelector
            sizes={product.sizes}
            availableSizes={product.availableSizes}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />
        )}

        <QuantityControls
          quantity={quantity}
          maxStock={availableStock}
          onIncrement={incrementQuantity}
          onDecrement={decrementQuantity}
          onChange={handleQuantityChange}
          isOutOfStock={isOutOfStock}
        />

        <AddToCartButton
          onClick={handleAddToCart}
          isOutOfStock={isOutOfStock}
          requiresSizeSelection={requiresSizeSelection}
          hasSelectedSize={!!selectedSize}
        />

        {showSuccess && (
          <SuccessMessage
            quantity={quantity}
            productName={product.name}
            selectedSize={selectedSize}
          />
        )}
      </div>
    </article>
  );
};

/**
 * Product Image Subcomponent
 */
const ProductImage = ({
  product,
  categoryColor,
  onImageError,
  isOutOfStock,
}) => (
  <div className="product-image-container">
    <img
      src={product.image}
      alt={product.name}
      className="product-image"
      onError={onImageError}
      loading="lazy"
    />
    <CategoryTag category={product.category} color={categoryColor} />
    <StockBadge stock={product.stock} isOutOfStock={isOutOfStock} />
  </div>
);

/**
 * Category Tag Subcomponent
 */
const CategoryTag = ({ category, color }) => (
  <span className="category-tag" style={{ backgroundColor: color }}>
    {category?.replace("-", " ")}
  </span>
);

/**
 * Stock Badge Subcomponent
 */
const StockBadge = ({ stock, isOutOfStock }) => {
  if (stock === 0 || isOutOfStock) {
    return <span className="stock-badge out-of-stock">Out of Stock</span>;
  }
  return <span className="stock-badge in-stock">{stock} in stock</span>;
};

/**
 * Product Header Subcomponent
 */
const ProductHeader = ({ product }) => (
  <>
    <h3 className="product-name">{product.name}</h3>
    <p className="product-description">{product.description}</p>
  </>
);

/**
 * Product Meta Subcomponent (price and tags)
 */
const ProductMeta = ({ product }) => (
  <div className="product-meta">
    <span className="product-price">${product.price.toFixed(2)}</span>
    {product.tags?.length > 0 && (
      <div className="tags">
        {product.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

/**
 * Size Selector Subcomponent
 */
const SizeSelector = ({
  sizes,
  availableSizes,
  selectedSize,
  onSizeSelect,
}) => (
  <div className="size-selector">
    <label className="size-label">Select Size:</label>
    <div className="size-options" role="group" aria-label="Size options">
      {sizes.map((size) => {
        const stockCount = availableSizes?.[size] || 0;
        const isAvailable = stockCount > 0;
        const isSelected = selectedSize === size;

        return (
          <SizeOption
            key={size}
            size={size}
            isAvailable={isAvailable}
            isSelected={isSelected}
            stockCount={stockCount}
            onSelect={() => isAvailable && onSizeSelect(size)}
          />
        );
      })}
    </div>
    {selectedSize && availableSizes && (
      <SizeStockInfo
        size={selectedSize}
        stockCount={availableSizes[selectedSize]}
      />
    )}
  </div>
);

/**
 * Individual Size Option Button
 */
const SizeOption = ({
  size,
  isAvailable,
  isSelected,
  stockCount,
  onSelect,
}) => (
  <button
    type="button"
    className={`size-option ${isSelected ? "selected" : ""} ${!isAvailable ? "out-of-stock" : ""}`}
    onClick={onSelect}
    disabled={!isAvailable}
    title={
      isAvailable ? `Size ${size} - ${stockCount} available` : "Out of stock"
    }
    aria-label={`Size ${size}${isAvailable ? `, ${stockCount} available` : ", out of stock"}`}
    aria-pressed={isSelected}
  >
    {size}
    {!isAvailable && (
      <span className="size-stock-badge" aria-hidden="true">
        X
      </span>
    )}
  </button>
);

/**
 * Size Stock Info Display
 */
const SizeStockInfo = ({ size, stockCount }) => (
  <div className="size-stock-info">
    {stockCount} available in size {size}
  </div>
);

/**
 * Quantity Controls Subcomponent
 */
const QuantityControls = ({
  quantity,
  maxStock,
  onIncrement,
  onDecrement,
  onChange,
  isOutOfStock,
}) => (
  <div className="quantity-selector">
    <div className="quantity-control">
      <QuantityButton
        onClick={onDecrement}
        disabled={quantity <= 1 || isOutOfStock}
        label="Decrease quantity"
        symbol="−"
      />
      <input
        type="number"
        min="1"
        max={maxStock}
        value={quantity}
        onChange={onChange}
        className="quantity-input"
        disabled={isOutOfStock}
        aria-label="Quantity"
      />
      <QuantityButton
        onClick={onIncrement}
        disabled={quantity >= maxStock || isOutOfStock}
        label="Increase quantity"
        symbol="+"
      />
    </div>
  </div>
);

/**
 * Quantity Button Subcomponent
 */
const QuantityButton = ({ onClick, disabled, label, symbol }) => (
  <button
    className="quantity-btn"
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
  >
    {symbol}
  </button>
);

/**
 * Add to Cart Button Subcomponent
 */
const AddToCartButton = ({
  onClick,
  isOutOfStock,
  requiresSizeSelection,
  hasSelectedSize,
}) => {
  const getButtonState = () => {
    if (isOutOfStock) {
      return {
        text: "Out of Stock",
        disabled: true,
        className: "out-of-stock",
      };
    }
    if (requiresSizeSelection && !hasSelectedSize) {
      return {
        text: "Select Size",
        disabled: true,
        className: "disabled",
      };
    }
    return {
      text: "Add to Cart",
      disabled: false,
      className: "",
    };
  };

  const { text, disabled, className } = getButtonState();

  return (
    <button
      className={`add-to-cart-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={text}
    >
      {text}
    </button>
  );
};

/**
 * Success Message Subcomponent
 */
const SuccessMessage = ({ quantity, productName, selectedSize }) => (
  <div className="success-message" role="status" aria-live="polite">
    ✓ Added {quantity} {productName}
    {selectedSize && ` (Size: ${selectedSize})`} to cart!
  </div>
);

export default ProductCard;
