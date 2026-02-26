import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from './ProductCard';

/**
 * CategoryPage Component
 * Displays products filtered by category with category-specific header
 * Uses URL parameter to determine which category to display
 */
const CategoryPage = ({ addToCart, products = [] }) => {
  const { categoryName } = useParams();
  
  // Filter products by current category
  const categoryProducts = products.filter(
    product => product.category === categoryName
  );

  /**
   * Category metadata configuration
   * Combined labels and descriptions into a single object
   */
  const categoryMetadata = {
    'mens-clothing': {
      label: "Men's Clothing & Fashion",
      description: 'Discover stylish clothing for men including shirts, pants, jackets, and more.'
    },
    'womens-clothing': {
      label: "Women's Clothing & Fashion",
      description: 'Explore fashionable clothing for women including dresses, tops, and skirts.'
    },
    'electronics': {
      label: 'Electronics & Gadgets',
      description: 'Shop the latest electronics including headphones, smart watches, and gaming gear.'
    },
    'beauty': {
      label: 'Beauty & Fragrance',
      description: 'Browse premium beauty products including perfumes, lotions, and skincare.'
    },
    'footwear': {
      label: 'Footwear & Shoes',
      description: 'Find comfortable and stylish footwear for every occasion.'
    },
    'accessories': {
      label: 'Accessories & Bags',
      description: 'Complete your look with our selection of accessories and bags.'
    }
  };

  // Get current category metadata or use defaults
  const currentCategory = categoryMetadata[categoryName] || {
    label: categoryName?.replace('-', ' ') || 'Category',
    description: `Browse our ${categoryName?.replace('-', ' ') || ''} collection`
  };

  // Format category name for display (e.g., "mens-clothing" -> "Men's Clothing")
  const formattedCategoryName = categoryName
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="category-page">
      <CategoryHeader 
        label={currentCategory.label}
        description={currentCategory.description}
        productCount={categoryProducts.length}
        formattedName={formattedCategoryName}
      />

      {categoryProducts.length > 0 ? (
        <ProductGrid 
          products={categoryProducts}
          addToCart={addToCart}
        />
      ) : (
        <EmptyCategoryState categoryName={formattedCategoryName} />
      )}
    </main>
  );
};

/**
 * Category Header Subcomponent
 * Displays category title, description, and stats
 */
const CategoryHeader = ({ label, description, productCount }) => (
  <div className="category-header">
    <h1 className="section-title">{label}</h1>
    <p className="section-subtitle">{description}</p>
    
    <div className="category-stats" aria-label="Category statistics">
      <span className="stat-item">
        <span className="stat-value">{productCount}</span> Products
      </span>
      <span className="stat-item">✓ In Stock</span>
      <span className="stat-item">🚚 Free Shipping Available</span>
    </div>
  </div>
);

/**
 * Product Grid Subcomponent
 * Renders grid of product cards
 */
const ProductGrid = ({ products, addToCart }) => (
  <div className="products-grid" aria-label="Products in this category">
    {products.map(product => (
      <ProductCard
        key={product.id}
        product={product}
        addToCart={addToCart}
      />
    ))}
  </div>
);

/**
 * Empty Category State Subcomponent
 * Shown when no products exist in the selected category
 */
const EmptyCategoryState = ({ categoryName }) => (
  <div className="no-products" role="alert" aria-labelledby="no-products-title">
    <div className="no-products-icon" aria-hidden="true">🛍️</div>
    <h2 id="no-products-title">No products found {categoryName ? `in ${categoryName}` : ''}</h2>
    <p>Check back soon for new arrivals or browse other categories</p>
    
    <div className="no-products-actions">
      <Link to="/products" className="btn btn-primary">
        View All Products
      </Link>
      <Link to="/" className="btn btn-outline">
        Return Home
      </Link>
    </div>
  </div>
);

export default CategoryPage;