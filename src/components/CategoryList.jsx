import React from 'react';
import { Link } from 'react-router-dom';

const CategoryList = () => {
  const categories = [
    { name: 'mens-clothing', label: "Men's Fashion", icon: '👔', description: 'Shirts, Pants & More' },
    { name: 'womens-clothing', label: "Women's Fashion", icon: '👗', description: 'Dresses, Tops & More' },
    { name: 'electronics', label: 'Electronics', icon: '📱', description: 'Gadgets & Tech' },
    { name: 'beauty', label: 'Beauty', icon: '💄', description: 'Perfume & Skincare' },
    { name: 'footwear', label: 'Footwear', icon: '👟', description: 'Shoes & Sneakers' },
    { name: 'accessories', label: 'Accessories', icon: '👜', description: 'Bags & More' }
  ];

  return (
    <div className="category-list">
      <h2 className="section-title">Shop by Category</h2>
      <p className="section-subtitle">Browse our wide range of products</p>
      
      <div className="categories-grid">
        {categories.map(category => (
          <Link 
            key={category.name}
            to={`/category/${category.name}`}
            className="category-card"
          >
            <div className="category-icon">{category.icon}</div>
            <div className="category-content">
              <h3>{category.label}</h3>
              <p>{category.description}</p>
              <span className="category-link">Browse Products →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;