// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { supabase } from '../lib/supabase/client'; // Import supabase client here



// // to go ahead and fetch categories from supabase instead of hardcoding them, we need to:
// const CategoryList = () => {
//   const [categories, setCategories] = useState([]); 
//   const [loading, setLoading] = useState(true);     
//   const [error, setError] = useState(null);          


//   /**
//   //  * Category configuration data
//   //  * @type {Array<{name: string, label: string, icon: string, description: string}>}
//   //  */
  
 
  
//   // Fetch categories from Supabase
//   useEffect(() => {
//       const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       // query Supabase for categories
//       const { data, error } = await supabase
//         .from('categories')
//         .select('*')
//         .order('name');  
//       if (error) throw error;
      
//       // Map Supabase data to component format with icons
//       const formattedCategories = data.map(cat => ({
//         id: cat.id,
//         name: cat.name.toLowerCase().replace(/\s+/g, '-'), 
//         label: cat.name,
//         // icon: getCategoryIcon(cat.name), 
//         description: cat.description || 'Browse our collection'
//       }));
      
//       setCategories(formattedCategories);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//     fetchCategories();
//   }, []);
  

//   const iconMap = {
//         'Beauty & Body Care': '💄',
//         'Bathroom Essentials': '🧴',
//         'Footwear': '👟',
//         'Home & Living': '🏠',
//         'Electronics': '📱',
//         'Apparel': '👕',
//         'All Products': '🛍️'
//       };


// // Loading state UI
//   if (loading) {
//     return (
//       <section className="category-list" aria-labelledby="categories-title">
//         <div className="category-header">
//           <h2 id="categories-title" className="section-title">Shop by Category</h2>
//           <p className="section-subtitle">Loading categories...</p>
//         </div>
//         <div className="categories-grid">
//           {[1,2,3,4,5,6].map(n => (
//             <div key={n} className="category-card skeleton">
//               <div className="category-icon loading"></div>
//               <div className="category-content">
//                 <div className="loading-text"></div>
//                 <div className="loading-text short"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     );
//   }


//   //Error state UI
//   if (error) {
//     return (
//       <section className="category-list" aria-labelledby="categories-title">
//         <div className="category-header">
//           <h2 id="categories-title" className="section-title">Shop by Category</h2>
//           <p className="section-subtitle error-message">
//             Failed to load categories: {error}
//           </p>
//           <button onClick={fetchCategories} className="retry-button">
//             Try Again
//           </button>
//         </div>
//       </section>
//     );
//   }
 

//   //Data Rendering

//   return (
//     <section className="category-list" aria-labelledby="categories-title">
//       <div className="category-header">
//         <h2 id="categories-title" className="section-title">Shop by Category</h2>
//         <p className="section-subtitle">Browse our wide range of products</p>
//       </div>
      
//       <div className="categories-grid">
//         {categories.map(({ id, name, label, icon, description }) => (
//           <CategoryCard 
//             key={id}                   
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
import { supabase } from '../lib/supabase/client';
import '../styles/CategoryList.css'; // Import CSS for styling

// Automatically choose an emoji based on keywords in the category name
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();

  // Keyword-based mapping – add more as needed
  if (name.includes('beauty') || name.includes('body') || name.includes('cosmetic')) return '💄';
  if (name.includes('bath') || name.includes('shower') || name.includes('toilet')) return '🧴';
  if (name.includes('foot') || name.includes('shoe') || name.includes('sneaker')) return '👟';
  if (name.includes('home') || name.includes('living') || name.includes('furniture')) return '🏠';
  if (name.includes('electron') || name.includes('gadget') || name.includes('tech')) return '📱';
  if (name.includes('apparel') || name.includes('cloth') || name.includes('fashion')) return '👕';
  if (name.includes('all') || name.includes('every')) return '🛍️';
  if (name.includes('book') || name.includes('read')) return '📚';
  if (name.includes('toy') || name.includes('game')) return '🎲';
  if (name.includes('sport') || name.includes('fitness')) return '⚽';
  if (name.includes('food') || name.includes('grocery')) return '🍎';
  if (name.includes('pet') || name.includes('animal')) return '🐶';

  // If no keyword matches, return the first letter (uppercase)
  // This guarantees a visual, no box!
  return categoryName.charAt(0).toUpperCase();
};

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;

      // Format categories – use the same logic as before, but icon is dynamic
      const formattedCategories = data.map(cat => ({
        id: cat.id,
        name: cat.name.toLowerCase().replace(/\s+/g, '-'), // slug for URL
        label: cat.name,                                   // original name for display
        icon: getCategoryIcon(cat.name),                   // automatic icon
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

  useEffect(() => {
    fetchCategories();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="category-list" aria-labelledby="categories-title">
        <div className="category-header">
          <h2 id="categories-title" className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Loading categories...</p>
        </div>
        <div className="categories-grid">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="category-card-link skeleton">
              <article className="category-card">
                <div className="category-icon-wrapper"></div>
                <div className="category-content">
                  <div className="category-title"></div>
                  <div className="category-description"></div>
                  <div className="category-cta"></div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
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

  // Success – render categories
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

/**
 * Category Card Component
 *  UPDATED: Uses URL search parameters to pass category to Products page
 * When user clicks "Browse Products", the URL will include ?category={categoryName}
 */
const CategoryCard = ({ name, label, icon, description }) => {
  //  URL SEARCH PARAMS IMPLEMENTATION
  // Create a new URLSearchParams object to build the query string
  const params = new URLSearchParams();
  // Add the category parameter to the URL
  params.set('category', name);
  
  return (
    <Link
      //  URL SEARCH PARAMS: Navigating with query string (?category=mens-clothing)
      to={`/products?${params.toString()}`}
      className="category-card-link"
      aria-label={`Browse ${label} products`}
    >
      <article className="category-card">
        <div className="category-icon-wrapper" aria-hidden="true">
          <span className="category-icon">{icon}</span>
        </div>
        <div className="category-content">
          <h3 className="category-title">{label}</h3>
          <p className="category-description">{description}</p>
          <span className="category-cta">
            Browse Products <span aria-hidden="true">→</span>
          </span>
        </div>
      </article>
    </Link>
  );
};

export default CategoryList;