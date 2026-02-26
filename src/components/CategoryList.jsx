import React from 'react';
import { Link } from 'react-router-dom';

/**
 * CategoryList Component
 * Displays a grid of product categories with icons and descriptions
 * Each card links to the products page with optional category filtering
 */
const CategoryList = () => {
  /**
   * Category configuration data
   * @type {Array<{name: string, label: string, icon: string, description: string}>}
   */
  const categories = [
    { 
      name: 'mens-clothing', 
      label: "Men's Fashion", 
      icon: '👔', 
      description: 'Shirts, Pants & More' 
    },
    { 
      name: 'womens-clothing', 
      label: "Women's Fashion", 
      icon: '👗', 
      description: 'Dresses, Tops & More' 
    },
    { 
      name: 'electronics', 
      label: 'Electronics', 
      icon: '📱', 
      description: 'Gadgets & Tech' 
    },
    { 
      name: 'beauty', 
      label: 'Beauty', 
      icon: '💄', 
      description: 'Perfume & Skincare' 
    },
    { 
      name: 'footwear', 
      label: 'Footwear', 
      icon: '👟', 
      description: 'Shoes & Sneakers' 
    },
    { 
      name: 'accessories', 
      label: 'Accessories', 
      icon: '👜', 
      description: 'Bags & More' 
    }
  ];

  return (
    <section className="category-list" aria-labelledby="categories-title">
      <div className="category-header">
        <h2 id="categories-title" className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Browse our wide range of products</p>
      </div>
      
      <div className="categories-grid">
        {categories.map(({ name, label, icon, description }) => (
          <CategoryCard 
            key={name}
            name={name}
            label={label}
            icon={icon}
            description={description}
          />
        ))}
      </div>
    </section>
  );
};

/**
 * Individual Category Card Subcomponent
 * Displays a single category with icon and link
 */
const CategoryCard = ({ name, label, icon, description }) => (
  <article className="category-card">
    <div className="category-icon" aria-hidden="true">{icon}</div>
    <div className="category-content">
      <h3>{label}</h3>
      <p>{description}</p>
      <Link 
        to={`/products?category=${name}`} 
        className="category-link"
        aria-label={`Browse ${label} products`}
      >
        Browse Products →
      </Link>
    </div>
  </article>
);

export default CategoryList;