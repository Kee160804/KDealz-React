import React from 'react';
import { useParams } from 'react-router-dom';

import ProductCard from './ProductCard';

const CategoryPage = ({ addToCart }) => {
  const { categoryName } = useParams();
  
  const categoryProducts = products.filter(
    product => product.category === categoryName
  );

  const categoryLabels = {
    'mens-clothing': "Men's Clothing & Fashion",
    'womens-clothing': "Women's Clothing & Fashion",
    'electronics': 'Electronics & Gadgets',
    'beauty': 'Beauty & Fragrance',
    'footwear': 'Footwear & Shoes',
    'accessories': 'Accessories & Bags'
  };

  const categoryDescriptions = {
    'mens-clothing': 'Discover stylish clothing for men including shirts, pants, jackets, and more.',
    'womens-clothing': 'Explore fashionable clothing for women including dresses, tops, and skirts.',
    'electronics': 'Shop the latest electronics including headphones, smart watches, and gaming gear.',
    'beauty': 'Browse premium beauty products including perfumes, lotions, and skincare.',
    'footwear': 'Find comfortable and stylish footwear for every occasion.',
    'accessories': 'Complete your look with our selection of accessories and bags.'
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h1 className="section-title">{categoryLabels[categoryName] || 'Category'}</h1>
        <p className="section-subtitle">
          {categoryDescriptions[categoryName] || `Browse our ${categoryName.replace('-', ' ')} collection`}
        </p>
        <div className="category-stats">
          <span className="stat-item">{categoryProducts.length} Products</span>
          <span className="stat-item">✓ In Stock</span>
          <span className="stat-item">🚚 Free Shipping Available</span>
        </div>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="products-grid">
          {categoryProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <div className="no-products-icon">🛍️</div>
          <h2>No products found in this category</h2>
          <p>Check back soon for new arrivals or browse other categories</p>
          <div className="no-products-actions">
            <a href="/products" className="btn btn-primary">
              View All Products
            </a>
            <a href="/" className="btn btn-outline">
              Return Home
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;