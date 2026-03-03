// import React from 'react';
// import { Link } from 'react-router-dom';

// /**
//  * CategoryList Component
//  * Displays a grid of product categories with icons and descriptions
//  * Each card links to the products page with optional category filtering
//  */
// const CategoryList = () => {
//   /**
//    * Category configuration data
//    * @type {Array<{name: string, label: string, icon: string, description: string}>}
//    */
//   const categories = [
//     { 
//       name: 'mens-clothing', 
//       label: "Men's Fashion", 
//       icon: '👔', 
//       description: 'Shirts, Pants & More' 
//     },
//     { 
//       name: 'womens-clothing', 
//       label: "Women's Fashion", 
//       icon: '👗', 
//       description: 'Dresses, Tops & More' 
//     },
//     { 
//       name: 'electronics', 
//       label: 'Electronics', 
//       icon: '📱', 
//       description: 'Gadgets & Tech' 
//     },
//     { 
//       name: 'beauty', 
//       label: 'Beauty', 
//       icon: '💄', 
//       description: 'Perfume & Skincare' 
//     },
//     { 
//       name: 'footwear', 
//       label: 'Footwear', 
//       icon: '👟', 
//       description: 'Shoes & Sneakers' 
//     },
//     { 
//       name: 'accessories', 
//       label: 'Accessories', 
//       icon: '👜', 
//       description: 'Bags & More' 
//     }
//   ];

//   return (
//     <section className="category-list" aria-labelledby="categories-title">
//       <div className="category-header">
//         <h2 id="categories-title" className="section-title">Shop by Category</h2>
//         <p className="section-subtitle">Browse our wide range of products</p>
//       </div>
      
//       <div className="categories-grid">
//         {categories.map(({ name, label, icon, description }) => (
//           <CategoryCard 
//             key={name}
//             name={name}
//             label={label}
//             icon={icon}
//             description={description}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// /**
//  * Individual Category Card Subcomponent
//  * Displays a single category with icon and link
//  */
// const CategoryCard = ({ name, label, icon, description }) => (
//   <article className="category-card">
//     <div className="category-icon" aria-hidden="true">{icon}</div>
//     <div className="category-content">
//       <h3>{label}</h3>
//       <p>{description}</p>
//       <Link 
//         to={`/products?category=${name}`} 
//         className="category-link"
//         aria-label={`Browse ${label} products`}
//       >
//         Browse Products →
//       </Link>
//     </div>
//   </article>
// );

// export default CategoryList;










import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase/client'; // Import supabase client here



// to go ahead and fetch categories from supabase instead of hardcoding them, we need to:
const CategoryList = () => {
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);     
  const [error, setError] = useState(null);          


  /**
  //  * Category configuration data
  //  * @type {Array<{name: string, label: string, icon: string, description: string}>}
  //  */
  
 
  
  // Fetch categories from Supabase
  useEffect(() => {
      const fetchCategories = async () => {
    try {
      setLoading(true);
      // query Supabase for categories
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');  
      if (error) throw error;
      
      // Map Supabase data to component format with icons
      const formattedCategories = data.map(cat => ({
        id: cat.id,
        name: cat.name.toLowerCase().replace(/\s+/g, '-'), 
        label: cat.name,
        // icon: getCategoryIcon(cat.name), 
        description: cat.description || 'Browse our collection'
      }));
      
      setCategories(formattedCategories);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
    fetchCategories();
  }, []);
  


//  return (
//     <div> test
//       {JSON.stringify(categories)}
//       {categories.map((category) => (
//         <div key={product.id}>
//           <h2>{category.name}</h2>
//         </div>
//       ))}
//     </div>
//   );




  // Helper function to assign icons based on category name
  // const getCategoryIcon = (categoryName) => {
  //   const iconMap = {
  //     'Mens Fashion': '👔',
  //     'Women\'s Fashion': '👗',
  //     'Electronics': '📱',
  //     'Beauty': '💄',
  //     'Footwear': '👟',
  //     'Accessories': '👜',
  //     // Add more mappings as needed
  //   };
  //   return iconMap[categoryName] || '🛍️'; // Default icon
  // };


  const iconMap = {
        'Beauty & Body Care': '💄',
        'Bathroom Essentials': '🧴',
        'Footwear': '👟',
        'Home & Living': '🏠',
        'Electronics': '📱',
        'Apparel': '👕',
        'All Products': '🛍️'
      };


// Loading state UI
  if (loading) {
    return (
      <section className="category-list" aria-labelledby="categories-title">
        <div className="category-header">
          <h2 id="categories-title" className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Loading categories...</p>
        </div>
        <div className="categories-grid">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="category-card skeleton">
              <div className="category-icon loading"></div>
              <div className="category-content">
                <div className="loading-text"></div>
                <div className="loading-text short"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }


  //Error state UI
  if (error) {
    return (
      <section className="category-list" aria-labelledby="categories-title">
        <div className="category-header">
          <h2 id="categories-title" className="section-title">Shop by Category</h2>
          <p className="section-subtitle error-message">
            Failed to load categories: {error}
          </p>
          <button onClick={fetchCategories} className="retry-button">
            Try Again
          </button>
        </div>
      </section>
    );
  }
 

  //Data Rendering

  return (
    <section className="category-list" aria-labelledby="categories-title">
      <div className="category-header">
        <h2 id="categories-title" className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Browse our wide range of products</p>
      </div>
      
      <div className="categories-grid">
        {categories.map(({ id, name, label, icon, description }) => (
          <CategoryCard 
            key={id}                   
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



//  return (
//     <div>
//       {JSON.stringify(products)}
//       {products.map((product) => (
//         <div key={product.id}>
//           <h2>{product.name}</h2>
//         </div>
//       ))}
//     </div>
//   );

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






