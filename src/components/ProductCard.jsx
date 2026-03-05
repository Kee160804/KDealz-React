// components/ProductCard.jsx
import React, { useState, useCallback, useMemo } from "react";
import "../styles/ProductCard.css";

const ProductCard = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Category color mapping (keys are category names)
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

  // Extract category name safely (product.category is the joined object)
  const categoryName = product.category?.name || '';

  // Determine if size selection is needed (footwear or apparel with sizes)
  const requiresSizeSelection = useMemo(
    () =>
      (categoryName === "footwear" || categoryName === "apparel") &&
      product.sizes?.length > 0,
    [categoryName, product.sizes]
  );

  // Get available stock based on size selection
  const getAvailableStock = useCallback(() => {
    if (requiresSizeSelection && selectedSize && product.availableSizes) {
      return product.availableSizes[selectedSize] || 0;
    }
    return product.stock_quantity || 0;  // use stock_quantity
  }, [requiresSizeSelection, selectedSize, product.availableSizes, product.stock_quantity]);

  // Validate before adding to cart
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
  }, [quantity, selectedSize, product.name, requiresSizeSelection, getAvailableStock]);

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    const validation = validateAddToCart();

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    addToCart(product, quantity, selectedSize);

    setShowSuccess(true);
    setQuantity(1);
    setSelectedSize("");

    setTimeout(() => setShowSuccess(false), 3000);
  }, [product, quantity, selectedSize, addToCart, validateAddToCart]);

  // Quantity handlers
  const handleQuantityChange = useCallback(
    (e) => {
      const value = parseInt(e.target.value);
      const maxStock = getAvailableStock();

      if (!isNaN(value) && value >= 1 && value <= maxStock) {
        setQuantity(value);
      }
    },
    [getAvailableStock]
  );

  const incrementQuantity = useCallback(() => {
    setQuantity((prev) => Math.min(prev + 1, getAvailableStock()));
  }, [getAvailableStock]);

  const decrementQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }, []);

  // Get category color for styling
  const getCategoryColor = useCallback(
    () => CATEGORY_COLORS[categoryName] || "#2c3e50",
    [categoryName]
  );

  // Handle image load error (fallback to placeholder)
  const handleImageError = useCallback(
    (e) => {
      e.target.onerror = null;
      e.target.src = `https://via.placeholder.com/300x300/${getCategoryColor().replace("#", "")}/ffffff?text=${encodeURIComponent(product.name)}`;
    },
    [product.name, getCategoryColor]
  );

  const availableStock = getAvailableStock();
  const isOutOfStock =
    product.stock_quantity === 0 ||
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
        <ProductHeader product={product} />

        <ProductMeta product={product} />

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

// --- Subcomponents ---

const CategoryTag = ({ categoryName, color }) => (
  <span className="category-tag" style={{ backgroundColor: color }}>
    {categoryName?.replace("-", " ") || "Uncategorized"}
  </span>
);

const ProductImage = ({ product, categoryColor, onImageError, isOutOfStock }) => (
  <div className="product-image-container">
    <img
      src={product.image}
      alt={product.name}
      className="product-image"
      onError={onImageError}
      loading="lazy"
    />
    <CategoryTag categoryName={product.category?.name} color={categoryColor} />
    <StockBadge stockQuantity={product.stock_quantity} isOutOfStock={isOutOfStock} />
  </div>
);

const StockBadge = ({ stockQuantity, isOutOfStock }) => {
  if (stockQuantity === 0 || isOutOfStock) {
    return <span className="stock-badge out-of-stock">Out of Stock</span>;
  }
  return <span className="stock-badge in-stock">{stockQuantity} in stock</span>;
};

const ProductHeader = ({ product }) => (
  <>
    <h3 className="product-name">{product.name}</h3>
    <p className="product-description">{product.description}</p>
  </>
);

const ProductMeta = ({ product }) => (
  <div className="product-meta">
    <span className="product-price">${product.price?.toFixed(2)}</span>
    {/* Tags removed because database does not have a tags column */}
  </div>
);

const SizeSelector = ({ sizes, availableSizes, selectedSize, onSizeSelect }) => (
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

const SizeOption = ({ size, isAvailable, isSelected, stockCount, onSelect }) => (
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

const SizeStockInfo = ({ size, stockCount }) => (
  <div className="size-stock-info">
    {stockCount} available in size {size}
  </div>
);

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

const SuccessMessage = ({ quantity, productName, selectedSize }) => (
  <div className="success-message" role="status" aria-live="polite">
    ✓ Added {quantity} {productName}
    {selectedSize && ` (Size: ${selectedSize})`} to cart!
  </div>
);

export default ProductCard;





