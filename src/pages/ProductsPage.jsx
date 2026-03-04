// // pages/ProductsPage.jsx
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import ProductCard from "../components/ProductCard";
// import {
//   getAllProducts,
//   subscribeToProducts,
// } from "../services/productService";
// import "../styles/ProductCard.css";

// import { supabase } from "../lib/supabase/client";

// /**
//  * ProductsPage Component
//  * Displays all products with filtering, sorting, and search capabilities
//  * Includes real-time stock updates via subscription
//  */
// const ProductsPage = ({  addToCart }) => {
 
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedSubCategories, setSelectedSubCategories] = useState([]);
//   const [sortBy, setSortBy] = useState("name");
//   const [searchTerm, setSearchTerm] = useState("");

//   const [categories, setCategories] = useState([]); 
//   const [loading, setLoading] = useState(true);     
//   const [error, setError] = useState(null);          
//      const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         // query Supabase for categories
//         const { data, error } = await supabase
//           .from('categories')
//           .select('*')
//           .order('name');  
//         if (error) throw error;
        
//         // Map Supabase data to component format with icons
//         const formattedCategories = data.map(cat => ({
//           id: cat?.id,
//           name: cat?.name.toLowerCase().replace(/\s+/g, '-'), 
//           label: cat?.name,
//           // icon: getCategoryIcon(cat?.name), 
//           description: cat?.description || 'Browse our collection'
//         }));
        
//         setCategories(formattedCategories);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching categories:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     useEffect(() => {
//       fetchCategories();
//     }, []);
  
//   // ─── Constants ───────────────────────────────────────────────────────
//   const CATEGORIES = [
//     "all",
//     "beauty-bodycare",
//     "bathroom-essentials",
//     "footwear",
//     "home-living",
//     "electronics",
//     "apparel",
//   ];

//   const CATEGORY_DISPLAY_NAMES = {
//     all: "All Products",
//     "beauty-bodycare": "Beauty & Body Care",
//     "bathroom-essentials": "Bathroom Essentials",
//     footwear: "Footwear",
//     "home-living": "Home & Living",
//     electronics: "Electronics",
//     apparel: "Apparel",
//   };

//   const SORT_OPTIONS = [
//     { value: "name", label: "Name (A-Z)" },
//     { value: "price-low", label: "Price: Low to High" },
//     { value: "price-high", label: "Price: High to Low" },
//     { value: "stock", label: "Most in Stock" },
//   ];

//   // ─── Effects ─────────────────────────────────────────────────────────

//   useEffect(() => {
//     const loadProducts = async () => {
//       const { data, error } = await supabase
//         .from("products")
//         .select("*");

//       if (error) {
//         console.error("Error loading products:", error);
//       } else {
//         setProducts(data || []);
//       }

//       // setLoading(false);
//     };

//     loadProducts();
//   }, []);

//   // Reset sub-categories when category changes
//   useEffect(() => {
//     setSelectedSubCategories([]);
//   }, [selectedCategory]);

//   // ─── Derived Values ──────────────────────────────────────────────────
//   const subCategories = useMemo(() => {
//     if (selectedCategory === "all") return [];

//     return products
//       .filter((product) => product.category === selectedCategory)
//       .map((product) => product.subCategory)
//       .filter((value, index, self) => value && self.indexOf(value) === index);
//   }, [products, selectedCategory]);

//   const filteredProducts = useMemo(() => {
//     return products
//       .filter((product) => {
//         const matchesCategory =
//           selectedCategory === "all" || product.category === selectedCategory;
//         const matchesSubCategory =
//           selectedSubCategories.length === 0 ||
//           (product.subCategory &&
//             selectedSubCategories.includes(product.subCategory));
//         const matchesSearch =
//           searchTerm === "" ||
//           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           product.description
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           (product.tags &&
//             product.tags.some((tag) =>
//               tag.toLowerCase().includes(searchTerm.toLowerCase()),
//             ));

//         return matchesCategory && matchesSubCategory && matchesSearch;
//       })
//       .sort((a, b) => {
//         switch (sortBy) {
//           case "price-low":
//             return a.price - b.price;
//           case "price-high":
//             return b.price - a.price;
//           case "name":
//             return a.name.localeCompare(b.name);
//           case "stock":
//             return b.stock - a.stock;
//           default:
//             return 0;
//         }
//       });
//   }, [products, selectedCategory, selectedSubCategories, searchTerm, sortBy]);

//   // ─── Handlers ────────────────────────────────────────────────────────
//   const handleSubCategoryToggle = useCallback((subCategory) => {
//     setSelectedSubCategories((prev) =>
//       prev.includes(subCategory)
//         ? prev.filter((sc) => sc !== subCategory)
//         : [...prev, subCategory],
//     );
//   }, []);

//   const clearSearch = useCallback(() => {
//     setSearchTerm("");
//   }, []);

//   const clearAllFilters = useCallback(() => {
//     setSelectedCategory("all");
//     setSelectedSubCategories([]);
//     setSearchTerm("");
//   }, []);

//   /**
//    * Handle adding product to cart with stock validation
//    * Updates local product stock and calls parent addToCart
//    */
//   const handleAddToCart = useCallback(
//     (product, quantity = 1, selectedSize = null) => {
//     //   console.log("ProductsPage - Adding to cart:", {
//     //     product: product.name,
//     //     quantity,
//     //     selectedSize,
//     //   }
//     // );

//       // Validate size selection for footwear/apparel
//       const requiresSizeSelection =
//         (product.category === "footwear" || product.category === "apparel") &&
//         product.sizes?.length > 0;

//       if (requiresSizeSelection) {
//         if (!selectedSize) {
//           alert(`Please select a size for ${product.name}`);
//           return;
//         }

//         if (product.availableSizes?.[selectedSize] < quantity) {
//           alert(
//             `Only ${product.availableSizes[selectedSize]} available in size ${selectedSize}`,
//           );
//           return;
//         }
//       } else if (product.stock < quantity) {
//         alert(`Only ${product.stock} items available in stock`);
//         return;
//       }

//       // Update local product stock
//       setProducts((prevProducts) =>
//         prevProducts.map((p) => {
//           if (p.id === product.id) {
//             if (requiresSizeSelection && selectedSize && p.availableSizes) {
//               return {
//                 ...p,
//                 availableSizes: {
//                   ...p.availableSizes,
//                   [selectedSize]: Math.max(
//                     0,
//                     p.availableSizes[selectedSize] - quantity,
//                   ),
//                 },
//                 stock: Math.max(0, p.stock - quantity),
//               };
//             }
//             return { ...p, stock: Math.max(0, p.stock - quantity) };
//           }
//           return p;
//         }),
//       );

//       // Add to cart with all necessary info
//       addToCart({
//         ...product,
//         selectedSize: selectedSize || product.selectedSize,
//         quantity,
//         stock: Math.max(0, product.stock - quantity),
//         availableSizes:
//           product.availableSizes && selectedSize
//             ? {
//                 ...product.availableSizes,
//                 [selectedSize]: Math.max(
//                   0,
//                   (product.availableSizes[selectedSize] || 0) - quantity,
//                 ),
//               }
//             : product.availableSizes,
//       });
//     },
//     [addToCart],
//   );

//   // ─── Render ──────────────────────────────────────────────────────────
//   return (
//     <>
//       {/* Sticky Header - Full Width Outside Main Container */}
//       <StickyHeaderCard>
//         <div className="header-content">
//           <PageHeader />

//           <SearchSortRow
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onClearSearch={clearSearch}
//             sortBy={sortBy}
//             onSortChange={setSortBy}
//             sortOptions={SORT_OPTIONS}
//           />

//           <CategoryStrip
//             categories={categories}
//             selectedCategory={selectedCategory}
//             onCategoryChange={setSelectedCategory}
//             categoryDisplayNames={CATEGORY_DISPLAY_NAMES}
//           />

//           {/* Sub-Category Filters - Now in Sticky Header */}
//           {selectedCategory !== "all" && subCategories.length > 0 && (
//             <SubCategoryFiltersSticky
//               subCategories={subCategories}
//               selectedSubCategories={selectedSubCategories}
//               onSubCategoryToggle={handleSubCategoryToggle}
//             />
//           )}
//         </div>
//       </StickyHeaderCard>

//       {/* Main Content Container */}
//       <div className="products-page">
//         <div className="products-scrollable-content">
//           <ProductGrid
//             products={filteredProducts}
//             onAddToCart={handleAddToCart}
//           />

//           {filteredProducts.length === 0 && (
//             <EmptyState onClearFilters={clearAllFilters} />
//           )}

//           <ProductsInfo
//             filteredCount={filteredProducts.length}
//             totalCount={products.length}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// // ============================================================================
// // STICKY HEADER CARD COMPONENT (Full Width - No Gaps)
// // ============================================================================

// const StickyHeaderCard = ({ children }) => (
//   <div className="products-sticky-header-card">{children}</div>
// );

// // ============================================================================
// // PAGE HEADER COMPONENT
// // ============================================================================

// const PageHeader = () => (
//   <div className="page-header">
//     <h1 className="section-title">Karibbean Dealz Products</h1>
//     <p className="section-subtitle">
//       Discover premium beauty, home, and lifestyle products
//     </p>
//   </div>
// );

// // ============================================================================
// // SEARCH AND SORT ROW (Side by Side)
// // ============================================================================

// const SearchSortRow = ({
//   searchTerm,
//   onSearchChange,
//   onClearSearch,
//   sortBy,
//   onSortChange,
//   sortOptions,
// }) => (
//   <div className="search-sort-row">
//     <SearchSection
//       searchTerm={searchTerm}
//       onSearchChange={onSearchChange}
//       onClearSearch={onClearSearch}
//     />

//     <SortSection
//       sortBy={sortBy}
//       onSortChange={onSortChange}
//       sortOptions={sortOptions}
//     />
//   </div>
// );

// // ============================================================================
// // SEARCH SECTION
// // ============================================================================

// const SearchSection = ({ searchTerm, onSearchChange, onClearSearch }) => (
//   <div className="search-section">
//     <div className="search-container">
//       <span className="search-icon">🔍</span>
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={searchTerm}
//         onChange={(e) => onSearchChange(e.target.value)}
//         className="search-input"
//       />
//       {searchTerm && <ClearSearchButton onClick={onClearSearch} />}
//     </div>
//   </div>
// );

// const ClearSearchButton = ({ onClick }) => (
//   <button
//     className="clear-search-btn"
//     onClick={onClick}
//     aria-label="Clear search"
//   >
//     ✕
//   </button>
// );

// // ============================================================================
// // SORT SECTION
// // ============================================================================

// const SortSection = ({ sortBy, onSortChange, sortOptions }) => (
//   <div className="sort-section">
//     <label htmlFor="sort-select">Sort by:</label>
//     <select
//       id="sort-select"
//       value={sortBy}
//       onChange={(e) => onSortChange(e.target.value)}
//       className="sort-select"
//     >
//       {sortOptions.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// // ============================================================================
// // CATEGORY STRIP (Horizontal scroll on mobile)
// // ============================================================================

// const CategoryStrip = ({
//   categories,
//   selectedCategory,
//   onCategoryChange,
//   categoryDisplayNames,
// }) => (
//   <div className="category-strip">
//     <div className="category-strip-header">
//       <h3>SHOP BY CATEGORY</h3>
//     </div>
//     <div className="category-strip-items">
//       {categories.map((category) => (
//         <CategoryStripButton
//           key={category?.id}
//           category={category?.name}
//           isActive={selectedCategory === category?.name}
//           displayName={categoryDisplayNames[category?.name]}
//           onClick={onCategoryChange}
//         />
//       ))}
//     </div>
//   </div>
// );

// const CategoryStripButton = ({ category, isActive, displayName, onClick }) => (
//   <button
//     className={`category-strip-btn ${isActive ? "active" : ""}`}
//     onClick={() => onClick(category)}
//     title={displayName}
//   >
//     {displayName}
//   </button>
// );

// // ============================================================================
// // SUB-CATEGORY FILTERS - STICKY VERSION
// // ============================================================================

// const SubCategoryFiltersSticky = ({
//   subCategories,
//   selectedSubCategories,
//   onSubCategoryToggle,
// }) => (
//   <div className="subcategory-filters-sticky">
//     <h4>FILTER BY TYPE:</h4>
//     <div className="subcategory-checkboxes-sticky">
//       {subCategories.map((subCategory) => (
//         <SubCategoryCheckboxSticky
//           key={subCategory}
//           subCategory={subCategory}
//           isChecked={selectedSubCategories.includes(subCategory)}
//           onToggle={onSubCategoryToggle}
//         />
//       ))}
//     </div>
//   </div>
// );

// const SubCategoryCheckboxSticky = ({ subCategory, isChecked, onToggle }) => (
//   <label className="subcategory-checkbox-sticky">
//     <input
//       type="checkbox"
//       checked={isChecked}
//       onChange={() => onToggle(subCategory)}
//     />
//     <span className="checkbox-label">{subCategory.replace("-", " ")}</span>
//   </label>
// );

// // ============================================================================
// // PRODUCT GRID
// // ============================================================================

// const ProductGrid = ({ products, onAddToCart }) => (
//   <div className="products-grid">
//     {products.map((product) => (
//       <ProductCard
//         key={product.id}
//         product={product}
//         addToCart={(product, quantity, selectedSize) =>
//           onAddToCart(product, quantity, selectedSize)
//         }
//       />
//     ))}
//   </div>
// );

// // ============================================================================
// // EMPTY STATE
// // ============================================================================

// const EmptyState = ({ onClearFilters }) => (
//   <div className="no-products">
//     <div className="no-products-icon">🔍</div>
//     <h2>No products found</h2>
//     <p>Try adjusting your search or filter criteria</p>
//     <button className="btn btn-primary" onClick={onClearFilters}>
//       Clear Filters
//     </button>
//   </div>
// );

// // ============================================================================
// // PRODUCTS INFO
// // ============================================================================

// const ProductsInfo = ({ filteredCount, totalCount }) => (
//   <div className="products-info">
//     <p>
//       Showing {filteredCount} of {totalCount} products
//     </p>
//     <p className="products-tip">
//       💡 Tip: Stock indicators show available quantity. Items automatically
//       update when added to cart.
//     </p>
//   </div>
// );

// export default ProductsPage;

























// // pages/ProductsPage.jsx
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import ProductCard from "../components/ProductCard";
// import {
//   getAllProducts,
//   subscribeToProducts,
// } from "../services/productService";
// import "../styles/ProductCard.css";

// import { supabase } from "../lib/supabase/client";

// /**
//  * ProductsPage Component
//  * Displays all products with filtering, sorting, and search capabilities
//  * Includes real-time stock updates via subscription
//  */
// const ProductsPage = ({ addToCart }) => {
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedSubCategories, setSelectedSubCategories] = useState([]);
//   const [sortBy, setSortBy] = useState("name");
//   const [searchTerm, setSearchTerm] = useState("");

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);


//   // Create category display names from fetched categories
//   const categoryDisplayNames = useMemo(() => {
//     const displayNames = { all: "All Products" };
//     categories.forEach(cat => {
//       displayNames[cat?.name] = cat?.label;
//     });
//     return displayNames;
//   }, [categories]);

//   const SORT_OPTIONS = [
//     { value: "name", label: "Name (A-Z)" },
//     { value: "price-low", label: "Price: Low to High" },
//     { value: "price-high", label: "Price: High to Low" },
//     { value: "stock", label: "Most in Stock" },
//   ];

//   // ─── Fetch Categories ─────────────────────────────────────────────────
//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       // query Supabase for categories
//       const { data, error } = await supabase
//         .from('categories')
//         .select('*')
//         .order('name');

//       if (error) throw error;

//       // Map Supabase data to component format
//       const formattedCategories = data.map(cat => ({
//         id: cat?.id,
//         name: cat?.name.toLowerCase().replace(/\s+/g, '-'),
//         label: cat?.name,
//         description: cat?.description || 'Browse our collection'
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

//   // ─── Effects ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const loadProducts = async () => {
//       const { data, error } = await supabase
//         .from("products")
//         .select("*");

//       if (error) {
//         console.error("Error loading products:", error);
//       } else {
//         setProducts(data || []);
//       }
//     };

//     loadProducts();
//   }, []);

//   // Reset sub-categories when category changes
//   useEffect(() => {
//     setSelectedSubCategories([]);
//   }, [selectedCategory]);

//   // ─── Derived Values ──────────────────────────────────────────────────
//   const subCategories = useMemo(() => {
//     if (selectedCategory === "all") return [];

//     return products
//       .filter((product) => product.category === selectedCategory)
//       .map((product) => product.subCategory)
//       .filter((value, index, self) => value && self.indexOf(value) === index);
//   }, [products, selectedCategory]);


//   const filteredProducts = useMemo(() => {
//     return products
//       .filter((product) => {
//         const matchesCategory =
//           selectedCategory === "all" || product.category === selectedCategory;
//         const matchesSubCategory =
//           selectedSubCategories.length === 0 ||
//           (product.subCategory &&
//             selectedSubCategories.includes(product.subCategory));
//         const matchesSearch =
//           searchTerm === "" ||
//           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           product.description
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           (product.tags &&
//             product.tags.some((tag) =>
//               tag.toLowerCase().includes(searchTerm.toLowerCase()),
//             ));

//         return matchesCategory && matchesSubCategory && matchesSearch;
//       })
//       .sort((a, b) => {
//         switch (sortBy) {
//           case "price-low":
//             return a.price - b.price;
//           case "price-high":
//             return b.price - a.price;
//           case "name":
//             return a.name.localeCompare(b.name);
//           case "stock":
//             return b.stock - a.stock;
//           default:
//             return 0;
//         }
//       });
//   }, [products, selectedCategory, selectedSubCategories, searchTerm, sortBy]);

//   // ─── Handlers ────────────────────────────────────────────────────────
//   const handleSubCategoryToggle = useCallback((subCategory) => {
//     setSelectedSubCategories((prev) =>
//       prev.includes(subCategory)
//         ? prev.filter((sc) => sc !== subCategory)
//         : [...prev, subCategory],
//     );
//   }, []);

//   const clearSearch = useCallback(() => {
//     setSearchTerm("");
//   }, []);

//   const clearAllFilters = useCallback(() => {
//     setSelectedCategory("all");
//     setSelectedSubCategories([]);
//     setSearchTerm("");
//   }, []);

//   /**
//    * Handle adding product to cart with stock validation
//    * Updates local product stock and calls parent addToCart
//    */
//   const handleAddToCart = useCallback(
//     (product, quantity = 1, selectedSize = null) => {
//       // Validate size selection for footwear/apparel
//       const requiresSizeSelection =
//         (product.category === "footwear" || product.category === "apparel") &&
//         product.sizes?.length > 0;

//       if (requiresSizeSelection) {
//         if (!selectedSize) {
//           alert(`Please select a size for ${product.name}`);
//           return;
//         }

//         if (product.availableSizes?.[selectedSize] < quantity) {
//           alert(
//             `Only ${product.availableSizes[selectedSize]} available in size ${selectedSize}`,
//           );
//           return;
//         }
//       } else if (product.stock < quantity) {
//         alert(`Only ${product.stock} items available in stock`);
//         return;
//       }

//       // Update local product stock
//       setProducts((prevProducts) =>
//         prevProducts.map((p) => {
//           if (p.id === product.id) {
//             if (requiresSizeSelection && selectedSize && p.availableSizes) {
//               return {
//                 ...p,
//                 availableSizes: {
//                   ...p.availableSizes,
//                   [selectedSize]: Math.max(
//                     0,
//                     p.availableSizes[selectedSize] - quantity,
//                   ),
//                 },
//                 stock: Math.max(0, p.stock - quantity),
//               };
//             }
//             return { ...p, stock: Math.max(0, p.stock - quantity) };
//           }
//           return p;
//         }),
//       );

//       // Add to cart with all necessary info
//       addToCart({
//         ...product,
//         selectedSize: selectedSize || product.selectedSize,
//         quantity,
//         stock: Math.max(0, product.stock - quantity),
//         availableSizes:
//           product.availableSizes && selectedSize
//             ? {
//                 ...product.availableSizes,
//                 [selectedSize]: Math.max(
//                   0,
//                   (product.availableSizes[selectedSize] || 0) - quantity,
//                 ),
//               }
//             : product.availableSizes,
//       });
//     },
//     [addToCart],
//   );

//   // Show loading state
//   if (loading) {
//     return <div className="loading">Loading categories...</div>;
//   }

//   if (error) {
//     return <div className="error">Error loading categories: {error}</div>;
//   }

//   // ─── Render ──────────────────────────────────────────────────────────
//   return (
//     <>
//       {/* Sticky Header - Full Width Outside Main Container */}
//       <StickyHeaderCard>
//         <div className="header-content">
//           <PageHeader />

//           <SearchSortRow
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onClearSearch={clearSearch}
//             sortBy={sortBy}
//             onSortChange={setSortBy}
//             sortOptions={SORT_OPTIONS}
//           />

//           <CategoryStrip
//             categories={[{ id: 'all', name: 'all', label: 'All Products' }, ...categories]}
//             selectedCategory={selectedCategory}
//             onCategoryChange={setSelectedCategory}
//             categoryDisplayNames={categoryDisplayNames}
//           />

//           {/* Sub-Category Filters - Now in Sticky Header */}
//           {selectedCategory !== "all" && subCategories.length > 0 && (
//             <SubCategoryFiltersSticky
//               subCategories={subCategories}
//               selectedSubCategories={selectedSubCategories}
//               onSubCategoryToggle={handleSubCategoryToggle}
//             />
//           )}
//         </div>
//       </StickyHeaderCard>

//       {/* Main Content Container */}
//       <div className="products-page">
//         <div className="products-scrollable-content">
//           <ProductGrid
//             products={filteredProducts}
//             onAddToCart={handleAddToCart}
//           />

//           {filteredProducts.length === 0 && (
//             <EmptyState onClearFilters={clearAllFilters} />
//           )}

//           <ProductsInfo
//             filteredCount={filteredProducts.length}
//             totalCount={products.length}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// // ============================================================================
// // STICKY HEADER CARD COMPONENT (Full Width - No Gaps)
// // ============================================================================

// const StickyHeaderCard = ({ children }) => (
//   <div className="products-sticky-header-card">{children}</div>
// );

// // ============================================================================
// // PAGE HEADER COMPONENT
// // ============================================================================

// const PageHeader = () => (
//   <div className="page-header">
//     <h1 className="section-title">Karibbean Dealz Products</h1>
//     <p className="section-subtitle">
//       Discover premium beauty, home, and lifestyle products
//     </p>
//   </div>
// );

// // ============================================================================
// // SEARCH AND SORT ROW (Side by Side)
// // ============================================================================

// const SearchSortRow = ({
//   searchTerm,
//   onSearchChange,
//   onClearSearch,
//   sortBy,
//   onSortChange,
//   sortOptions,
// }) => (
//   <div className="search-sort-row">
//     <SearchSection
//       searchTerm={searchTerm}
//       onSearchChange={onSearchChange}
//       onClearSearch={onClearSearch}
//     />

//     <SortSection
//       sortBy={sortBy}
//       onSortChange={onSortChange}
//       sortOptions={sortOptions}
//     />
//   </div>
// );

// // ============================================================================
// // SEARCH SECTION
// // ============================================================================

// const SearchSection = ({ searchTerm, onSearchChange, onClearSearch }) => (
//   <div className="search-section">
//     <div className="search-container">
//       <span className="search-icon">🔍</span>
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={searchTerm}
//         onChange={(e) => onSearchChange(e.target.value)}
//         className="search-input"
//       />
//       {searchTerm && <ClearSearchButton onClick={onClearSearch} />}
//     </div>
//   </div>
// );

// const ClearSearchButton = ({ onClick }) => (
//   <button
//     className="clear-search-btn"
//     onClick={onClick}
//     aria-label="Clear search"
//   >
//     ✕
//   </button>
// );

// // ============================================================================
// // SORT SECTION
// // ============================================================================

// const SortSection = ({ sortBy, onSortChange, sortOptions }) => (
//   <div className="sort-section">
//     <label htmlFor="sort-select">Sort by:</label>
//     <select
//       id="sort-select"
//       value={sortBy}
//       onChange={(e) => onSortChange(e.target.value)}
//       className="sort-select"
//     >
//       {sortOptions.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// // ============================================================================
// // CATEGORY STRIP (Horizontal scroll on mobile)
// // ============================================================================

// const CategoryStrip = ({
//   categories,
//   selectedCategory,
//   onCategoryChange,
//   categoryDisplayNames,
// }) => (
//   <div className="category-strip">
//     <div className="category-strip-header">
//       <h3>SHOP BY CATEGORY</h3>
//     </div>
//     <div className="category-strip-items">
//       {categories.map((category) => (
//         <CategoryStripButton
//           key={category.id}
//           category={category.name}
//           isActive={selectedCategory === category.name}
//           displayName={categoryDisplayNames[category.name]}
//           onClick={onCategoryChange}
//         />
//       ))}
//     </div>
//   </div>
// );

// const CategoryStripButton = ({ category, isActive, displayName, onClick }) => (
//   <button
//     className={`category-strip-btn ${isActive ? "active" : ""}`}
//     onClick={() => onClick(category)}
//     title={displayName}
//   >
//     {displayName}
//   </button>
// );

// // ============================================================================
// // SUB-CATEGORY FILTERS - STICKY VERSION
// // ============================================================================

// const SubCategoryFiltersSticky = ({
//   subCategories,
//   selectedSubCategories,
//   onSubCategoryToggle,
// }) => (
//   <div className="subcategory-filters-sticky">
//     <h4>FILTER BY TYPE:</h4>
//     <div className="subcategory-checkboxes-sticky">
//       {subCategories.map((subCategory) => (
//         <SubCategoryCheckboxSticky
//           key={subCategory}
//           subCategory={subCategory}
//           isChecked={selectedSubCategories.includes(subCategory)}
//           onToggle={onSubCategoryToggle}
//         />
//       ))}
//     </div>
//   </div>
// );

// const SubCategoryCheckboxSticky = ({ subCategory, isChecked, onToggle }) => (
//   <label className="subcategory-checkbox-sticky">
//     <input
//       type="checkbox"
//       checked={isChecked}
//       onChange={() => onToggle(subCategory)}
//     />
//     <span className="checkbox-label">{subCategory.replace("-", " ")}</span>
//   </label>
// );

// // ============================================================================
// // PRODUCT GRID
// // ============================================================================

// const ProductGrid = ({ products, onAddToCart }) => (
//   <div className="products-grid">
//     {products.map((product) => (
//       <ProductCard
//         key={product.id}
//         product={product}
//         addToCart={(product, quantity, selectedSize) =>
//           onAddToCart(product, quantity, selectedSize)
//         }
//       />
//     ))}
//   </div>
// );

// // ============================================================================
// // EMPTY STATE
// // ============================================================================

// const EmptyState = ({ onClearFilters }) => (
//   <div className="no-products">
//     <div className="no-products-icon">🔍</div>
//     <h2>No products found</h2>
//     <p>Try adjusting your search or filter criteria</p>
//     <button className="btn btn-primary" onClick={onClearFilters}>
//       Clear Filters
//     </button>
//   </div>
// );

// // ============================================================================
// // PRODUCTS INFO
// // ============================================================================

// const ProductsInfo = ({ filteredCount, totalCount }) => (
//   <div className="products-info">
//     <p>
//       Showing {filteredCount} of {totalCount} products
//     </p>
//     <p className="products-tip">
//       💡 Tip: Stock indicators show available quantity. Items automatically
//       update when added to cart.
//     </p>
//   </div>
// );

// export default ProductsPage;











// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////












// // pages/ProductsPage.jsx
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import ProductCard from "../components/ProductCard";
// import { supabase } from "../lib/supabase/client";
// import "../styles/ProductCard.css";

// const ProductsPage = ({ addToCart }) => {
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedSubCategories, setSelectedSubCategories] = useState([]);
//   const [sortBy, setSortBy] = useState("name");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState({
//     products: true,
//     categories: true
//   });
//   const [error, setError] = useState(null);

//   const SORT_OPTIONS = [
//     { value: "name", label: "Name (A-Z)" },
//     { value: "price-low", label: "Price: Low to High" },
//     { value: "price-high", label: "Price: High to Low" },
//     { value: "stock", label: "Most in Stock" },
//   ];

//   // ─── Fetch Categories ─────────────────────────────────────────────────

// const fetchCategories = async () => {
//   try {
//     setLoading(prev => ({ ...prev, categories: true }));
    
//     // Fetch categories with their subcategories
//     const { data, error } = await supabase
//       .from('categories')
//       .select(`
//         *,
//         subcategories (*)
//       `)
//       .order('name');

//     if (error) throw error;

//     // Format categories for the UI
//     const formattedCategories = [
//       { 
//         id: 'all', 
//         name: 'all', 
//         label: 'All Products'
//       },
//       ...data.map(cat => ({
//         id: cat?.id,                    // Use the actual database ID
//         name: cat?.name.toLowerCase().replace(/\s+/g, '-'), // URL-friendly version
//         label: cat?.name,                // Display name
//         description: cat?.description,
//         subcategories: cat?.subcategories || [] // Include subcategories
//       }))
//     ];

//     setCategories(formattedCategories);
//     setError(null);
//   } catch (err) {
//     console.error('Error fetching categories:', err);
//     setError(err.message);
//   } finally {
//     setLoading(prev => ({ ...prev, categories: false }));
//   }
// };

//   // const fetchCategories = async () => {
//   //   try {
//   //     setLoading(prev => ({ ...prev, categories: true }));
//   //     const { data, error } = await supabase
//   //       .from('categories')
//   //       .select('*')
//   //       .order('name');

//   //     if (error) throw error;

//   //     // Format categories and include the ORIGINAL name for filtering
//   //     const formattedCategories = [
//   //       { id: 'all', name: 'all', label: 'All Products', original_name: 'all' },
//   //       ...data.map(cat => ({
//   //         id: cat?.id,
//   //         name: cat?.name.toLowerCase().replace(/\s+/g, '-'), // URL-friendly version
//   //         original_name: cat?.name, // Keep original for filtering
//   //         label: cat?.name,
//   //         description: cat?.description || 'Browse our collection'
//   //       }))
//   //     ];

//   //     setCategories(formattedCategories);
//   //     setError(null);
//   //   } catch (err) {
//   //     console.error('Error fetching categories:', err);
//   //     setError(err.message);
//   //   } finally {
//   //     setLoading(prev => ({ ...prev, categories: false }));
//   //   }
//   // };

//   // ─── Fetch Products ─────────────────────────────────────────────────
//   // const fetchProducts = async () => {
//   //   try {
//   //     setLoading(prev => ({ ...prev, products: true }));

//   //     let query = supabase.from("products").select("*,categories(*)");

//   //     // If a specific category is selected (not "all"), filter products
//   //     if (selectedCategory !== "all") {
//   //       // Find the selected category object
//   //       const categoryObj = categories.find(c => c.name === selectedCategory);
//   //       if (categoryObj && categoryObj?.category_id) {
//   //         // Filter by the original category name from database
//   //         query = query.eq('categories', categoryObj?.category_id);
//   //       }
//   //     }
      
//   //     const { data, error } = await query;

//   //     if (error) throw error;
//   //     setProducts(data || []);
//   //     setError(null);
//   //   } catch (err) {
//   //     console.error("Error loading products:", err);
//   //     setError(err.message);
//   //   } finally {
//   //     setLoading(prev => ({ ...prev, products: false }));
//   //   }
//   // };

// const fetchProducts = async () => {
//   try {
//     setLoading(prev => ({ ...prev, products: true }));

//     // Build the query with proper joins
//     let query = supabase
//       .from("products")
//       .select(`
//         *,
//         category:category_id (*),
//         subcategory:subcategory_id (*)
//       `);

//     // If a specific category is selected (not "all"), filter by category_id
//     if (selectedCategory !== "all") {
//       // Find the selected category object by its URL-friendly name
//       const categoryObj = categories.find(c => c.name === selectedCategory);
//       if (categoryObj && categoryObj?.id !== 'all') {
//         // Filter using the actual category_id from the database
//         query = query.eq('category_id', categoryObj?.id);
//       }
//     }
    
//     const { data, error } = await query;

//     if (error) throw error;
//     setProducts(data || []);
//     setError(null);
//   } catch (err) {
//     console.error("Error loading products:", err);
//     setError(err.message);
//   } finally {
//     setLoading(prev => ({ ...prev, products: false }));
//   }
// };



//   // ─── Effects ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Fetch products when categories are loaded or selected category changes
//   useEffect(() => {
//     if (categories.length > 0) {
//       fetchProducts();
//     }
//   }, [selectedCategory, categories.length]);

//   // Reset sub-categories when category changes
//   useEffect(() => {
//     setSelectedSubCategories([]);
//   }, [selectedCategory]);

//   // ─── Derived Values ──────────────────────────────────────────────────
//   // const subCategories = useMemo(() => {
//   //   if (selectedCategory === "all") return [];

//   //   return products
//   //     .filter((product) => {
//   //       const categoryObj = categories.find(c => c.name === selectedCategory);
//   //       return categoryObj && product.category === categoryObj?.original_name;
//   //     })
//   //     .map((product) => product.subCategory)
//   //     .filter((value, index, self) => value && self.indexOf(value) === index);
//   // }, [products, selectedCategory, categories]);


// // Update the subCategories derivation
// const subCategories = useMemo(() => {
//   if (selectedCategory === "all") return [];

//   // Find the selected category
//   const selectedCat = categories.find(c => c.name === selectedCategory);
//   if (!selectedCat) return [];

//   // Get unique subcategories from products in this category
//   const uniqueSubIds = [...new Set(
//     products
//       .filter(p => p.category_id === selectedCat.id)
//       .map(p => p.subcategory_id)
//       .filter(id => id != null)
//   )];

//   // Return subcategory objects with id and name
//   return uniqueSubIds.map(subId => {
//     // Try to get from the category's subcategories first
//     const subFromCategory = selectedCat.subcategories?.find(s => s.id === subId);
//     if (subFromCategory) {
//       return { id: subFromCategory.id, name: subFromCategory.name };
//     }
//     // Fallback to checking product's subcategory object
//     const product = products.find(p => p.subcategory_id === subId);
//     if (product?.subcategory) {
//       return { id: product.subcategory.id, name: product.subcategory.name };
//     }
//     return { id: subId, name: `Subcategory ${subId}` };
//   });
// }, [products, selectedCategory, categories]);

// // Update subcategory toggle handler
// const handleSubCategoryToggle = useCallback((subCategory) => {
//   setSelectedSubCategories((prev) => {
//     // Check if subCategory is an object with id or just an id
//     const subId = typeof subCategory === 'object' ? subCategory.id : subCategory;
    
//     return prev.some(sc => {
//       const scId = typeof sc === 'object' ? sc.id : sc;
//       return scId === subId;
//     })
//       ? prev.filter((sc) => {
//           const scId = typeof sc === 'object' ? sc.id : sc;
//           return scId !== subId;
//         })
//       : [...prev, subCategory];
//   });
// }, []);











//   // const filteredProducts = useMemo(() => {
//   //   return products
//   //     .filter((product) => {
//   //       const matchesCategory = selectedCategory === "all" || 
//   //         (() => {
//   //           const categoryObj = categories.find(c => c.name === selectedCategory);
//   //           return categoryObj && product.category === categoryObj?.original_name;
//   //         })();
          
//   //       const matchesSubCategory =
//   //         selectedSubCategories.length === 0 ||
//   //         (product.subCategory &&
//   //           selectedSubCategories.includes(product.subCategory));
            
//   //       const matchesSearch =
//   //         searchTerm === "" ||
//   //         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //         (product.description && product.description
//   //           .toLowerCase()
//   //           .includes(searchTerm.toLowerCase())) ||
//   //         (product.tags &&
//   //           product.tags.some((tag) =>
//   //             tag.toLowerCase().includes(searchTerm.toLowerCase()),
//   //           ));

//   //       return matchesCategory && matchesSubCategory && matchesSearch;
//   //     })
//   //     .sort((a, b) => {
//   //       switch (sortBy) {
//   //         case "price-low":
//   //           return a.price - b.price;
//   //         case "price-high":
//   //           return b.price - a.price;
//   //         case "name":
//   //           return a.name.localeCompare(b.name);
//   //         case "stock":
//   //           return b.stock - a.stock;
//   //         default:
//   //           return 0;
//   //       }
//   //     });
//   // }, [products, selectedCategory, selectedSubCategories, searchTerm, sortBy, categories]);

//   // Create display names for categories
  
  
  
// const filteredProducts = useMemo(() => {
//   return products
//     .filter((product) => {
//       // Category filtering - using category_id
//       const matchesCategory = selectedCategory === "all" || 
//         (() => {
//           // Find the selected category object
//           const categoryObj = categories.find(c => c.name === selectedCategory);
//           // Compare using category_id (not category name)
//           return categoryObj && product.category_id === categoryObj?.id;
//         })();
      
//       // Subcategory filtering - using subcategory_id
//       const matchesSubCategory =
//         selectedSubCategories.length === 0 ||
//         (product.subcategory_id &&
//           selectedSubCategories.some(sc => 
//             sc.id === product.subcategory_id || sc === product.subcategory_id
//           ));
        
//       // Search filtering
//       const matchesSearch =
//         searchTerm === "" ||
//         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (product.description && product.description
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())) ||
//         (product.category?.name && product.category.name
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())) ||
//         (product.subcategory?.name && product.subcategory.name
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()));

//       return matchesCategory && matchesSubCategory && matchesSearch;
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case "price-low":
//           return a.price - b.price;
//         case "price-high":
//           return b.price - a.price;
//         case "name":
//           return a.name.localeCompare(b.name);
//         case "stock":
//           return b.stock_quantity - a.stock_quantity; // Fixed: stock_quantity not stock
//         default:
//           return 0;
//       }
//     });
// }, [products, selectedCategory, selectedSubCategories, searchTerm, sortBy, categories]);





















  
  
//   const categoryDisplayNames = useMemo(() => {
//     const displayNames = { all: "All Products" };
//     categories.forEach(cat => {
//       if (cat?.name !== 'all') {
//         displayNames[cat?.name] = cat?.label;
//       }
//     });
//     return displayNames;
//   }, [categories]);

//   // Handle category change
//   const handleCategoryChange = useCallback((categoryName) => {
//     setSelectedCategory(categoryName);
//   }, []);

//   const handleSubCategoryToggle1 = useCallback((subCategory) => {
//     setSelectedSubCategories((prev) =>
//       prev.includes(subCategory)
//         ? prev.filter((sc) => sc !== subCategory)
//         : [...prev, subCategory],
//     );
//   }, []);

//   const clearSearch = useCallback(() => {
//     setSearchTerm("");
//   }, []);

//   const clearAllFilters = useCallback(() => {
//     setSelectedCategory("all");
//     setSelectedSubCategories([]);
//     setSearchTerm("");
//   }, []);

//   const handleAddToCart = useCallback(
//     (product, quantity = 1, selectedSize = null) => {
//       // ... (keep your existing add to cart logic)
//     },
//     [addToCart],
//   );

//   // Show loading state
//   if (loading.categories || loading.products) {
//     return (
//       <div className="products-page-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="products-page-error">
//         <h3>Error Loading Products</h3>
//         <p>{error}</p>
//         <button onClick={() => window.location.reload()} className="btn btn-primary">
//           Try Again
//         </button>
//       </div>
//     );
//   }

// return<>
// proucts{
//   JSON.stringify(products)
// }</>

//   // ─── Render ──────────────────────────────────────────────────────────
//   return (
//     <>
//       <StickyHeaderCard>
//         <div className="header-content">
//           <PageHeader />

//           <SearchSortRow
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onClearSearch={clearSearch}
//             sortBy={sortBy}
//             onSortChange={setSortBy}
//             sortOptions={SORT_OPTIONS}
//           />

//           <CategoryStrip
//             categories={categories}
//             selectedCategory={selectedCategory}
//             onCategoryChange={handleCategoryChange}
//             categoryDisplayNames={categoryDisplayNames}
//           />

//           {selectedCategory !== "all" && subCategories.length > 0 && (
//             <SubCategoryFiltersSticky
//               subCategories={subCategories}
//               selectedSubCategories={selectedSubCategories}
//               onSubCategoryToggle={handleSubCategoryToggle}
//             />
//           )}
//         </div>
//       </StickyHeaderCard>

//       <div className="products-page">
//         <div className="products-scrollable-content">
//           <ProductGrid
//             products={filteredProducts}
//             onAddToCart={handleAddToCart}
//           />

//           {filteredProducts.length === 0 && (
//             <EmptyState onClearFilters={clearAllFilters} />
//           )}

//           <ProductsInfo
//             filteredCount={filteredProducts.length}
//             totalCount={products.length}
//           />
//         </div>
//       </div>
//     </>
//   );
// };




// // ============================================================================
// // STICKY HEADER CARD COMPONENT (Full Width - No Gaps)
// // ============================================================================

// const StickyHeaderCard = ({ children }) => (
//   <div className="products-sticky-header-card">{children}</div>
// );

// // ============================================================================
// // PAGE HEADER COMPONENT
// // ============================================================================

// const PageHeader = () => (
//   <div className="page-header">
//     <h1 className="section-title">Karibbean Dealz Products</h1>
//     <p className="section-subtitle">
//       Discover premium beauty, home, and lifestyle products
//     </p>
//   </div>
// );

// // ============================================================================
// // SEARCH AND SORT ROW (Side by Side)
// // ============================================================================

// const SearchSortRow = ({
//   searchTerm,
//   onSearchChange,
//   onClearSearch,
//   sortBy,
//   onSortChange,
//   sortOptions,
// }) => (
//   <div className="search-sort-row">
//     <SearchSection
//       searchTerm={searchTerm}
//       onSearchChange={onSearchChange}
//       onClearSearch={onClearSearch}
//     />

//     <SortSection
//       sortBy={sortBy}
//       onSortChange={onSortChange}
//       sortOptions={sortOptions}
//     />
//   </div>
// );

// // ============================================================================
// // SEARCH SECTION
// // ============================================================================

// const SearchSection = ({ searchTerm, onSearchChange, onClearSearch }) => (
//   <div className="search-section">
//     <div className="search-container">
//       <span className="search-icon">🔍</span>
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={searchTerm}
//         onChange={(e) => onSearchChange(e.target.value)}
//         className="search-input"
//       />
//       {searchTerm && <ClearSearchButton onClick={onClearSearch} />}
//     </div>
//   </div>
// );

// const ClearSearchButton = ({ onClick }) => (
//   <button
//     className="clear-search-btn"
//     onClick={onClick}
//     aria-label="Clear search"
//   >
//     ✕
//   </button>
// );

// // ============================================================================
// // SORT SECTION
// // ============================================================================

// const SortSection = ({ sortBy, onSortChange, sortOptions }) => (
//   <div className="sort-section">
//     <label htmlFor="sort-select">Sort by:</label>
//     <select
//       id="sort-select"
//       value={sortBy}
//       onChange={(e) => onSortChange(e.target.value)}
//       className="sort-select"
//     >
//       {sortOptions.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// // ============================================================================
// // CATEGORY STRIP (Horizontal scroll on mobile)
// // ============================================================================

// const CategoryStrip = ({
//   categories,
//   selectedCategory,
//   onCategoryChange,
//   categoryDisplayNames,
// }) => (
//   <div className="category-strip">
//     <div className="category-strip-header">
//       <h3>SHOP BY CATEGORY</h3>
//     </div>
//     <div className="category-strip-items">
//       {categories.map((category) => (
//         <CategoryStripButton
//           key={category.id}
//           category={category.name}
//           isActive={selectedCategory === category.name}
//           displayName={categoryDisplayNames[category.name]}
//           onClick={onCategoryChange}
//         />
//       ))}
//     </div>
//   </div>
// );

// const CategoryStripButton = ({ category, isActive, displayName, onClick }) => (
//   <button
//     className={`category-strip-btn ${isActive ? "active" : ""}`}
//     onClick={() => onClick(category)}
//     title={displayName}
//   >
//     {displayName}
//   </button>
// );

// // ============================================================================
// // SUB-CATEGORY FILTERS - STICKY VERSION
// // ============================================================================

// const SubCategoryFiltersSticky = ({
//   subCategories,
//   selectedSubCategories,
//   onSubCategoryToggle,
// }) => (
//   <div className="subcategory-filters-sticky">
//     <h4>FILTER BY TYPE:</h4>
//     <div className="subcategory-checkboxes-sticky">
//       {subCategories.map((subCategory) => (
//         <SubCategoryCheckboxSticky
//           key={subCategory}
//           subCategory={subCategory}
//           isChecked={selectedSubCategories.includes(subCategory)}
//           onToggle={onSubCategoryToggle}
//         />
//       ))}
//     </div>
//   </div>
// );

// const SubCategoryCheckboxSticky = ({ subCategory, isChecked, onToggle }) => (
//   <label className="subcategory-checkbox-sticky">
//     <input
//       type="checkbox"
//       checked={isChecked}
//       onChange={() => onToggle(subCategory)}
//     />
//     <span className="checkbox-label">{subCategory.replace("-", " ")}</span>
//   </label>
// );

// // ============================================================================
// // PRODUCT GRID
// // ============================================================================

// const ProductGrid = ({ products, onAddToCart }) => (
//   <div className="products-grid">
//     {products.map((product) => (
//       <ProductCard
//         key={product.id}
//         product={product}
//         addToCart={(product, quantity, selectedSize) =>
//           onAddToCart(product, quantity, selectedSize)
//         }
//       />
//     ))}
//   </div>
// );

// // ============================================================================
// // EMPTY STATE
// // ============================================================================

// const EmptyState = ({ onClearFilters }) => (
//   <div className="no-products">
//     <div className="no-products-icon">🔍</div>
//     <h2>No products found</h2>
//     <p>Try adjusting your search or filter criteria</p>
//     <button className="btn btn-primary" onClick={onClearFilters}>
//       Clear Filters
//     </button>
//   </div>
// );

// // ============================================================================
// // PRODUCTS INFO
// // ============================================================================

// const ProductsInfo = ({ filteredCount, totalCount }) => (
//   <div className="products-info">
//     <p>
//       Showing {filteredCount} of {totalCount} products
//     </p>
//     <p className="products-tip">
//       💡 Tip: Stock indicators show available quantity. Items automatically
//       update when added to cart.
//     </p>
//   </div>
// );

// export default ProductsPage;

































// // pages/ProductsPage.jsx
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import ProductCard from "../components/ProductCard";
// import { supabase } from "../lib/supabase/client";
// import "../styles/ProductCard.css";

// const ProductsPage = ({ addToCart }) => {
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedSubCategories, setSelectedSubCategories] = useState([]);
//   const [sortBy, setSortBy] = useState("name");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState({
//     products: true,
//     categories: true
//   });
//   const [error, setError] = useState(null);

//   const SORT_OPTIONS = [
//     { value: "name", label: "Name (A-Z)" },
//     { value: "price-low", label: "Price: Low to High" },
//     { value: "price-high", label: "Price: High to Low" },
//     { value: "stock", label: "Most in Stock" },
//   ];

//   // --- Safe JSON parser (prevents crashes) ---
//   const safeJsonParse = (value, defaultValue) => {
//     if (!value) return defaultValue;               // null/undefined/empty -> default
//     if (typeof value !== 'string') return value;   // already an object/array -> use as is
//     try {
//       return JSON.parse(value);
//     } catch (e) {
//       console.warn('Failed to parse JSON:', value, e);
//       return defaultValue;
//     }
//   };

//   // --- Fetch Categories ---
//   const fetchCategories = async () => {
//     try {
//       setLoading(prev => ({ ...prev, categories: true }));
      
//       const { data, error } = await supabase
//         .from('categories')
//         .select(`
//           *,
//           subcategories (*)
//         `)
//         .order('name');

//       if (error) throw error;

//       const formattedCategories = [
//         { id: 'all', name: 'all', label: 'All Products' },
//         ...data.map(cat => ({
//           id: cat?.id,
//           name: cat?.name.toLowerCase().replace(/\s+/g, '-'),
//           label: cat?.name,
//           description: cat?.description,
//           subcategories: cat?.subcategories || []
//         }))
//       ];

//       setCategories(formattedCategories);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//       setError(err.message);
//     } finally {
//       setLoading(prev => ({ ...prev, categories: false }));
//     }
//   };

//   // --- Fetch Products (with safe JSON parsing) ---
//   const fetchProducts = async () => {
//     try {
//       setLoading(prev => ({ ...prev, products: true }));

//       let query = supabase
//         .from("products")
//         .select(`
//           *,
//           category:category_id (*),
//           subcategory:subcategory_id (*)
//         `);

//       if (selectedCategory !== "all") {
//         const categoryObj = categories.find(c => c.name === selectedCategory);
//         if (categoryObj && categoryObj?.id !== 'all') {
//           query = query.eq('category_id', categoryObj?.id);
//         }
//       }
      
//       const { data, error } = await query;

//       if (error) throw error;

//       // Transform each product
//       const transformedProducts = (data || []).map(product => ({
//         ...product,
//         stock: product.stock_quantity,                 // flatten for ProductCard
//         sizes: safeJsonParse(product.sizes, []),       // ensure array
//         availableSizes: safeJsonParse(product.available_Sizes, {}), // ensure object
//         tags: []                                        // placeholder if needed
//       }));

//       setProducts(transformedProducts);
//       setError(null);
//     } catch (err) {
//       console.error("Error loading products:", err);
//       setError(err.message);
//     } finally {
//       setLoading(prev => ({ ...prev, products: false }));
//     }
//   };

//   // --- Effects ---
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (categories.length > 0) {
//       fetchProducts();
//     }
//   }, [selectedCategory, categories.length]);

//   useEffect(() => {
//     setSelectedSubCategories([]);
//   }, [selectedCategory]);

//   // --- Derived Values ---
//   const subCategories = useMemo(() => {
//     if (selectedCategory === "all") return [];

//     const selectedCat = categories.find(c => c.name === selectedCategory);
//     if (!selectedCat) return [];

//     const uniqueSubIds = [...new Set(
//       products
//         .filter(p => p.category_id === selectedCat.id)
//         .map(p => p.subcategory_id)
//         .filter(id => id != null)
//     )];

//     return uniqueSubIds.map(subId => {
//       const subFromCategory = selectedCat.subcategories?.find(s => s.id === subId);
//       if (subFromCategory) {
//         return { id: subFromCategory.id, name: subFromCategory.name };
//       }
//       const product = products.find(p => p.subcategory_id === subId);
//       if (product?.subcategory) {
//         return { id: product.subcategory.id, name: product.subcategory.name };
//       }
//       return { id: subId, name: `Subcategory ${subId}` };
//     });
//   }, [products, selectedCategory, categories]);

//   const handleSubCategoryToggle = useCallback((subCategory) => {
//     setSelectedSubCategories((prev) => {
//       const subId = subCategory.id;
//       return prev.some(sc => sc.id === subId)
//         ? prev.filter(sc => sc.id !== subId)
//         : [...prev, subCategory];
//     });
//   }, []);

//   const filteredProducts = useMemo(() => {
//     return products
//       .filter((product) => {
//         const matchesCategory = selectedCategory === "all" || 
//           (() => {
//             const categoryObj = categories.find(c => c.name === selectedCategory);
//             return categoryObj && product.category_id === categoryObj?.id;
//           })();
        
//         const matchesSubCategory =
//           selectedSubCategories.length === 0 ||
//           (product.subcategory_id &&
//             selectedSubCategories.some(sc => sc.id === product.subcategory_id));
          
//         const matchesSearch =
//           searchTerm === "" ||
//           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (product.description && product.description
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//           (product.category?.name && product.category.name
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//           (product.subcategory?.name && product.subcategory.name
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()));

//         return matchesCategory && matchesSubCategory && matchesSearch;
//       })
//       .sort((a, b) => {
//         switch (sortBy) {
//           case "price-low":
//             return a.price - b.price;
//           case "price-high":
//             return b.price - a.price;
//           case "name":
//             return a.name.localeCompare(b.name);
//           case "stock":
//             return b.stock_quantity - a.stock_quantity; // use actual column
//           default:
//             return 0;
//         }
//       });
//   }, [products, selectedCategory, selectedSubCategories, searchTerm, sortBy, categories]);

//   const categoryDisplayNames = useMemo(() => {
//     const displayNames = { all: "All Products" };
//     categories.forEach(cat => {
//       if (cat?.name !== 'all') {
//         displayNames[cat?.name] = cat?.label;
//       }
//     });
//     return displayNames;
//   }, [categories]);

//   const handleCategoryChange = useCallback((categoryName) => {
//     setSelectedCategory(categoryName);
//   }, []);

//   const clearSearch = useCallback(() => {
//     setSearchTerm("");
//   }, []);

//   const clearAllFilters = useCallback(() => {
//     setSelectedCategory("all");
//     setSelectedSubCategories([]);
//     setSearchTerm("");
//   }, []);

//   const handleAddToCart = useCallback(
//     (product, quantity = 1, selectedSize = null) => {
//       addToCart(product, quantity, selectedSize);
//     },
//     [addToCart]
//   );

//   // --- Loading & Error States ---
//   if (loading.categories || loading.products) {
//     return (
//       <div className="products-page-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="products-page-error">
//         <h3>Error Loading Products</h3>
//         <p>{error}</p>
//         <button 
//           onClick={() => {
//             setError(null);
//             fetchCategories();
//             fetchProducts();
//           }} 
//           className="btn btn-primary"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // --- Render ---
//   return (
//     <>
//       <StickyHeaderCard>
//         <div className="header-content">
//           <PageHeader />
//           <SearchSortRow
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onClearSearch={clearSearch}
//             sortBy={sortBy}
//             onSortChange={setSortBy}
//             sortOptions={SORT_OPTIONS}
//           />
//           <CategoryStrip
//             categories={categories}
//             selectedCategory={selectedCategory}
//             onCategoryChange={handleCategoryChange}
//             categoryDisplayNames={categoryDisplayNames}
//           />
//           {selectedCategory !== "all" && subCategories.length > 0 && (
//             <SubCategoryFiltersSticky
//               subCategories={subCategories}
//               selectedSubCategories={selectedSubCategories}
//               onSubCategoryToggle={handleSubCategoryToggle}
//             />
//           )}
//         </div>
//       </StickyHeaderCard>

//       <div className="products-page">
//         <div className="products-scrollable-content">
//           <ProductGrid
//             products={filteredProducts}
//             onAddToCart={handleAddToCart}
//           />
//           {filteredProducts.length === 0 && (
//             <EmptyState onClearFilters={clearAllFilters} />
//           )}
//           <ProductsInfo
//             filteredCount={filteredProducts.length}
//             totalCount={products.length}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// // ============================================================================
// // STICKY HEADER CARD
// // ============================================================================
// const StickyHeaderCard = ({ children }) => (
//   <div className="products-sticky-header-card">{children}</div>
// );

// // ============================================================================
// // PAGE HEADER
// // ============================================================================
// const PageHeader = () => (
//   <div className="page-header">
//     <h1 className="section-title">Karibbean Dealz Products</h1>
//     <p className="section-subtitle">
//       Discover premium beauty, home, and lifestyle products
//     </p>
//   </div>
// );

// // ============================================================================
// // SEARCH AND SORT ROW
// // ============================================================================
// const SearchSortRow = ({
//   searchTerm,
//   onSearchChange,
//   onClearSearch,
//   sortBy,
//   onSortChange,
//   sortOptions,
// }) => (
//   <div className="search-sort-row">
//     <SearchSection
//       searchTerm={searchTerm}
//       onSearchChange={onSearchChange}
//       onClearSearch={onClearSearch}
//     />
//     <SortSection
//       sortBy={sortBy}
//       onSortChange={onSortChange}
//       sortOptions={sortOptions}
//     />
//   </div>
// );

// // ============================================================================
// // SEARCH SECTION
// // ============================================================================
// const SearchSection = ({ searchTerm, onSearchChange, onClearSearch }) => (
//   <div className="search-section">
//     <div className="search-container">
//       <span className="search-icon">🔍</span>
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={searchTerm}
//         onChange={(e) => onSearchChange(e.target.value)}
//         className="search-input"
//       />
//       {searchTerm && <ClearSearchButton onClick={onClearSearch} />}
//     </div>
//   </div>
// );

// const ClearSearchButton = ({ onClick }) => (
//   <button
//     className="clear-search-btn"
//     onClick={onClick}
//     aria-label="Clear search"
//   >
//     ✕
//   </button>
// );

// // ============================================================================
// // SORT SECTION
// // ============================================================================
// const SortSection = ({ sortBy, onSortChange, sortOptions }) => (
//   <div className="sort-section">
//     <label htmlFor="sort-select">Sort by:</label>
//     <select
//       id="sort-select"
//       value={sortBy}
//       onChange={(e) => onSortChange(e.target.value)}
//       className="sort-select"
//     >
//       {sortOptions.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// // ============================================================================
// // CATEGORY STRIP
// // ============================================================================
// const CategoryStrip = ({
//   categories,
//   selectedCategory,
//   onCategoryChange,
//   categoryDisplayNames,
// }) => (
//   <div className="category-strip">
//     <div className="category-strip-header">
//       <h3>SHOP BY CATEGORY</h3>
//     </div>
//     <div className="category-strip-items">
//       {categories.map((category) => (
//         <CategoryStripButton
//           key={category.id}
//           category={category.name}
//           isActive={selectedCategory === category.name}
//           displayName={categoryDisplayNames[category.name]}
//           onClick={onCategoryChange}
//         />
//       ))}
//     </div>
//   </div>
// );

// const CategoryStripButton = ({ category, isActive, displayName, onClick }) => (
//   <button
//     className={`category-strip-btn ${isActive ? "active" : ""}`}
//     onClick={() => onClick(category)}
//     title={displayName}
//   >
//     {displayName}
//   </button>
// );

// // ============================================================================
// // SUB-CATEGORY FILTERS - STICKY VERSION
// // ============================================================================
// const SubCategoryFiltersSticky = ({
//   subCategories,
//   selectedSubCategories,
//   onSubCategoryToggle,
// }) => (
//   <div className="subcategory-filters-sticky">
//     <h4>FILTER BY TYPE:</h4>
//     <div className="subcategory-checkboxes-sticky">
//       {subCategories.map((subCategory) => (
//         <SubCategoryCheckboxSticky
//           key={subCategory.id}
//           subCategory={subCategory}
//           isChecked={selectedSubCategories.some(sc => sc.id === subCategory.id)}
//           onToggle={onSubCategoryToggle}
//         />
//       ))}
//     </div>
//   </div>
// );

// const SubCategoryCheckboxSticky = ({ subCategory, isChecked, onToggle }) => (
//   <label className="subcategory-checkbox-sticky">
//     <input
//       type="checkbox"
//       checked={isChecked}
//       onChange={() => onToggle(subCategory)}
//     />
//     <span className="checkbox-label">{subCategory.name}</span>
//   </label>
// );

// // ============================================================================
// // PRODUCT GRID
// // ============================================================================
// const ProductGrid = ({ products, onAddToCart }) => (
//   <div className="products-grid">
//     {products.map((product) => (
//       <ProductCard
//         key={product.id}
//         product={product}
//         addToCart={onAddToCart}
//       />
//     ))}
//   </div>
// );

// // ============================================================================
// // EMPTY STATE
// // ============================================================================
// const EmptyState = ({ onClearFilters }) => (
//   <div className="no-products">
//     <div className="no-products-icon">🔍</div>
//     <h2>No products found</h2>
//     <p>Try adjusting your search or filter criteria</p>
//     <button className="btn btn-primary" onClick={onClearFilters}>
//       Clear Filters
//     </button>
//   </div>
// );

// // ============================================================================
// // PRODUCTS INFO
// // ============================================================================
// const ProductsInfo = ({ filteredCount, totalCount }) => (
//   <div className="products-info">
//     <p>
//       Showing {filteredCount} of {totalCount} products
//     </p>
//     <p className="products-tip">
//       💡 Tip: Stock indicators show available quantity. Items automatically
//       update when added to cart.
//     </p>
//   </div>
// );

// export default ProductsPage;


































// // pages/ProductsPage.jsx
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import ProductCard from "../components/ProductCard";
// import { supabase } from "../lib/supabase/client";
// import { subscribeToProducts } from "../services/productService";   //  added
// import "../styles/ProductCard.css";

// const ProductsPage = ({ addToCart }) => {
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedSubCategories, setSelectedSubCategories] = useState([]);
//   const [sortBy, setSortBy] = useState("name");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState({
//     products: true,
//     categories: true
//   });
//   const [error, setError] = useState(null);

//   const SORT_OPTIONS = [
//     { value: "name", label: "Name (A-Z)" },
//     { value: "price-low", label: "Price: Low to High" },
//     { value: "price-high", label: "Price: High to Low" },
//     { value: "stock", label: "Most in Stock" },
//   ];

//   // --- Helper: transform raw product data (parse sizes, flatten stock) ---
//   const transformProduct = useCallback((rawProduct) => {
//     let sizes = [];
//     if (rawProduct.sizes) {
//       if (typeof rawProduct.sizes === 'string') {
//         try {
//           sizes = JSON.parse(rawProduct.sizes);
//         } catch {
//           // fallback for comma‑separated values (old data)
//           sizes = rawProduct.sizes.split(',').map(s => s.trim());
//         }
//       } else if (Array.isArray(rawProduct.sizes)) {
//         sizes = rawProduct.sizes;
//       }
//     }

//     let availableSizes = {};
//     if (rawProduct.available_Sizes) {
//       if (typeof rawProduct.available_Sizes === 'string') {
//         try {
//           availableSizes = JSON.parse(rawProduct.available_Sizes);
//         } catch (e) {
//           console.warn('Failed to parse available_Sizes for product', rawProduct.id, e);
//         }
//       } else if (typeof rawProduct.available_Sizes === 'object') {
//         availableSizes = rawProduct.available_Sizes;
//       }
//     }

//     return {
//       ...rawProduct,
//       stock: rawProduct.stock_quantity,          // flattened for ProductCard
//       sizes,
//       availableSizes,
//       tags: []                                    // placeholder if needed
//     };
//   }, []);

//   const transformProducts = useCallback((rawProducts) => {
//     return (rawProducts || []).map(transformProduct);
//   }, [transformProduct]);

//   // --- Fetch Categories ---
//   const fetchCategories = async () => {
//     try {
//       setLoading(prev => ({ ...prev, categories: true }));
      
//       const { data, error } = await supabase
//         .from('categories')
//         .select(`
//           *,
//           subcategories (*)
//         `)
//         .order('name');

//       if (error) throw error;

//       const formattedCategories = [
//         { id: 'all', name: 'all', label: 'All Products' },
//         ...data.map(cat => ({
//           id: cat?.id,
//           name: cat?.name.toLowerCase().replace(/\s+/g, '-'),
//           label: cat?.name,
//           description: cat?.description,
//           subcategories: cat?.subcategories || []
//         }))
//       ];

//       setCategories(formattedCategories);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//       setError(err.message);
//     } finally {
//       setLoading(prev => ({ ...prev, categories: false }));
//     }
//   };

//   // --- Fetch Products (initial load and category change) ---
//   const fetchProducts = async () => {
//     try {
//       setLoading(prev => ({ ...prev, products: true }));

//       let query = supabase
//         .from("products")
//         .select(`
//           *,
//           category:category_id (*),
//           subcategory:subcategory_id (*)
//         `);

//       if (selectedCategory !== "all") {
//         const categoryObj = categories.find(c => c.name === selectedCategory);
//         if (categoryObj && categoryObj?.id !== 'all') {
//           query = query.eq('category_id', categoryObj?.id);
//         }
//       }
      
//       const { data, error } = await query;

//       if (error) throw error;

//       const transformed = transformProducts(data);
//       setProducts(transformed);
//       setError(null);
//     } catch (err) {
//       console.error("Error loading products:", err);
//       setError(err.message);
//     } finally {
//       setLoading(prev => ({ ...prev, products: false }));
//     }
//   };

//   // --- Effects ---
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Fetch products when categories are loaded or selected category changes
//   useEffect(() => {
//     if (categories.length > 0) {
//       fetchProducts();
//     }
//   }, [selectedCategory, categories.length]);

//   // Reset sub-categories when category changes
//   useEffect(() => {
//     setSelectedSubCategories([]);
//   }, [selectedCategory]);

//   // ---  NEW: Subscribe to real‑time product updates ---
//   useEffect(() => {
//     const unsubscribe = subscribeToProducts((updatedProducts) => {
//       // Transform and update state – the product list will refresh immediately
//       const transformed = transformProducts(updatedProducts);
//       setProducts(transformed);
//     });

//     return () => unsubscribe();
//   }, [transformProducts]); // transformProducts is stable due to useCallback

//   // --- Derived Values ---
//   const subCategories = useMemo(() => {
//     if (selectedCategory === "all") return [];

//     const selectedCat = categories.find(c => c.name === selectedCategory);
//     if (!selectedCat) return [];

//     const uniqueSubIds = [...new Set(
//       products
//         .filter(p => p.category_id === selectedCat.id)
//         .map(p => p.subcategory_id)
//         .filter(id => id != null)
//     )];

//     return uniqueSubIds.map(subId => {
//       const subFromCategory = selectedCat.subcategories?.find(s => s.id === subId);
//       if (subFromCategory) {
//         return { id: subFromCategory.id, name: subFromCategory.name };
//       }
//       const product = products.find(p => p.subcategory_id === subId);
//       if (product?.subcategory) {
//         return { id: product.subcategory.id, name: product.subcategory.name };
//       }
//       return { id: subId, name: `Subcategory ${subId}` };
//     });
//   }, [products, selectedCategory, categories]);

//   const handleSubCategoryToggle = useCallback((subCategory) => {
//     setSelectedSubCategories((prev) => {
//       const subId = subCategory.id;
//       return prev.some(sc => sc.id === subId)
//         ? prev.filter(sc => sc.id !== subId)
//         : [...prev, subCategory];
//     });
//   }, []);

//   const filteredProducts = useMemo(() => {
//     return products
//       .filter((product) => {
//         const matchesCategory = selectedCategory === "all" || 
//           (() => {
//             const categoryObj = categories.find(c => c.name === selectedCategory);
//             return categoryObj && product.category_id === categoryObj?.id;
//           })();
        
//         const matchesSubCategory =
//           selectedSubCategories.length === 0 ||
//           (product.subcategory_id &&
//             selectedSubCategories.some(sc => sc.id === product.subcategory_id));
          
//         const matchesSearch =
//           searchTerm === "" ||
//           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (product.description && product.description
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//           (product.category?.name && product.category.name
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//           (product.subcategory?.name && product.subcategory.name
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()));

//         return matchesCategory && matchesSubCategory && matchesSearch;
//       })
//       .sort((a, b) => {
//         switch (sortBy) {
//           case "price-low":
//             return a.price - b.price;
//           case "price-high":
//             return b.price - a.price;
//           case "name":
//             return a.name.localeCompare(b.name);
//           case "stock":
//             return b.stock_quantity - a.stock_quantity;
//           default:
//             return 0;
//         }
//       });
//   }, [products, selectedCategory, selectedSubCategories, searchTerm, sortBy, categories]);

//   const categoryDisplayNames = useMemo(() => {
//     const displayNames = { all: "All Products" };
//     categories.forEach(cat => {
//       if (cat?.name !== 'all') {
//         displayNames[cat?.name] = cat?.label;
//       }
//     });
//     return displayNames;
//   }, [categories]);

//   const handleCategoryChange = useCallback((categoryName) => {
//     setSelectedCategory(categoryName);
//   }, []);

//   const clearSearch = useCallback(() => {
//     setSearchTerm("");
//   }, []);

//   const clearAllFilters = useCallback(() => {
//     setSelectedCategory("all");
//     setSelectedSubCategories([]);
//     setSearchTerm("");
//   }, []);

//   const handleAddToCart = useCallback(
//     (product, quantity = 1, selectedSize = null) => {
//       addToCart(product, quantity, selectedSize);
//     },
//     [addToCart]
//   );

//   // Loading & Error States
//   if (loading.categories || loading.products) {
//     return (
//       <div className="products-page-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="products-page-error">
//         <h3>Error Loading Products</h3>
//         <p>{error}</p>
//         <button 
//           onClick={() => {
//             setError(null);
//             fetchCategories();
//             fetchProducts();
//           }} 
//           className="btn btn-primary"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // --- Render ---
//   return (
//     <>
//       <StickyHeaderCard>
//         <div className="header-content">
//           <PageHeader />
//           <SearchSortRow
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onClearSearch={clearSearch}
//             sortBy={sortBy}
//             onSortChange={setSortBy}
//             sortOptions={SORT_OPTIONS}
//           />
//           <CategoryStrip
//             categories={categories}
//             selectedCategory={selectedCategory}
//             onCategoryChange={handleCategoryChange}
//             categoryDisplayNames={categoryDisplayNames}
//           />
//           {selectedCategory !== "all" && subCategories.length > 0 && (
//             <SubCategoryFiltersSticky
//               subCategories={subCategories}
//               selectedSubCategories={selectedSubCategories}
//               onSubCategoryToggle={handleSubCategoryToggle}
//             />
//           )}
//         </div>
//       </StickyHeaderCard>

//       <div className="products-page">
//         <div className="products-scrollable-content">
//           <ProductGrid
//             products={filteredProducts}
//             onAddToCart={handleAddToCart}
//           />
//           {filteredProducts.length === 0 && (
//             <EmptyState onClearFilters={clearAllFilters} />
//           )}
//           <ProductsInfo
//             filteredCount={filteredProducts.length}
//             totalCount={products.length}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// // STICKY HEADER CARD
// const StickyHeaderCard = ({ children }) => (
//   <div className="products-sticky-header-card">{children}</div>
// );

// // PAGE HEADER
// const PageHeader = () => (
//   <div className="page-header">
//     <h1 className="section-title">Karibbean Dealz Products</h1>
//     <p className="section-subtitle">
//       Discover premium beauty, home, and lifestyle products
//     </p>
//   </div>
// );

// // SEARCH AND SORT ROW
// const SearchSortRow = ({
//   searchTerm,
//   onSearchChange,
//   onClearSearch,
//   sortBy,
//   onSortChange,
//   sortOptions,
// }) => (
//   <div className="search-sort-row">
//     <SearchSection
//       searchTerm={searchTerm}
//       onSearchChange={onSearchChange}
//       onClearSearch={onClearSearch}
//     />
//     <SortSection
//       sortBy={sortBy}
//       onSortChange={onSortChange}
//       sortOptions={sortOptions}
//     />
//   </div>
// );

// // SEARCH SECTION
// const SearchSection = ({ searchTerm, onSearchChange, onClearSearch }) => (
//   <div className="search-section">
//     <div className="search-container">
//       <span className="search-icon">🔍</span>
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={searchTerm}
//         onChange={(e) => onSearchChange(e.target.value)}
//         className="search-input"
//       />
//       {searchTerm && <ClearSearchButton onClick={onClearSearch} />}
//     </div>
//   </div>
// );

// const ClearSearchButton = ({ onClick }) => (
//   <button
//     className="clear-search-btn"
//     onClick={onClick}
//     aria-label="Clear search"
//   >
//     ✕
//   </button>
// );

// // SORT SECTION
// const SortSection = ({ sortBy, onSortChange, sortOptions }) => (
//   <div className="sort-section">
//     <label htmlFor="sort-select">Sort by:</label>
//     <select
//       id="sort-select"
//       value={sortBy}
//       onChange={(e) => onSortChange(e.target.value)}
//       className="sort-select"
//     >
//       {sortOptions.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// // CATEGORY STRIP
// const CategoryStrip = ({
//   categories,
//   selectedCategory,
//   onCategoryChange,
//   categoryDisplayNames,
// }) => (
//   <div className="category-strip">
//     <div className="category-strip-header">
//       <h3>SHOP BY CATEGORY</h3>
//     </div>
//     <div className="category-strip-items">
//       {categories.map((category) => (
//         <CategoryStripButton
//           key={category.id}
//           category={category.name}
//           isActive={selectedCategory === category.name}
//           displayName={categoryDisplayNames[category.name]}
//           onClick={onCategoryChange}
//         />
//       ))}
//     </div>
//   </div>
// );

// const CategoryStripButton = ({ category, isActive, displayName, onClick }) => (
//   <button
//     className={`category-strip-btn ${isActive ? "active" : ""}`}
//     onClick={() => onClick(category)}
//     title={displayName}
//   >
//     {displayName}
//   </button>
// );

// // SUB-CATEGORY FILTERS - STICKY VERSION
// const SubCategoryFiltersSticky = ({
//   subCategories,
//   selectedSubCategories,
//   onSubCategoryToggle,
// }) => (
//   <div className="subcategory-filters-sticky">
//     <h4>FILTER BY TYPE:</h4>
//     <div className="subcategory-checkboxes-sticky">
//       {subCategories.map((subCategory) => (
//         <SubCategoryCheckboxSticky
//           key={subCategory.id}
//           subCategory={subCategory}
//           isChecked={selectedSubCategories.some(sc => sc.id === subCategory.id)}
//           onToggle={onSubCategoryToggle}
//         />
//       ))}
//     </div>
//   </div>
// );

// const SubCategoryCheckboxSticky = ({ subCategory, isChecked, onToggle }) => (
//   <label className="subcategory-checkbox-sticky">
//     <input
//       type="checkbox"
//       checked={isChecked}
//       onChange={() => onToggle(subCategory)}
//     />
//     <span className="checkbox-label">{subCategory.name}</span>
//   </label>
// );

// // PRODUCT GRID
// const ProductGrid = ({ products, onAddToCart }) => (
//   <div className="products-grid">
//     {products.map((product) => (
//       <ProductCard
//         key={product.id}
//         product={product}
//         addToCart={onAddToCart}
//       />
//     ))}
//   </div>
// );

// // EMPTY STATE
// const EmptyState = ({ onClearFilters }) => (
//   <div className="no-products">
//     <div className="no-products-icon">🔍</div>
//     <h2>No products found</h2>
//     <p>Try adjusting your search or filter criteria</p>
//     <button className="btn btn-primary" onClick={onClearFilters}>
//       Clear Filters
//     </button>
//   </div>
// );

// // PRODUCTS INFO
// const ProductsInfo = ({ filteredCount, totalCount }) => (
//   <div className="products-info">
//     <p>
//       Showing {filteredCount} of {totalCount} products
//     </p>
//     <p className="products-tip">
//       💡 Tip: Stock indicators show available quantity. Items automatically
//       update when added to cart.
//     </p>
//   </div>
// );

// export default ProductsPage;

















// // pages/ProductsPage.jsx
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import ProductCard from "../components/ProductCard";
// import { supabase } from "../lib/supabase/client";
// import { subscribeToProducts } from "../services/productService";
// import "../styles/ProductCard.css";

// const ProductsPage = ({ addToCart }) => {
//   // ─── State ─────────────────────────────────────────────────────────
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedSubCategories, setSelectedSubCategories] = useState([]);
//   const [sortBy, setSortBy] = useState("name");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState({
//     products: true,
//     categories: true
//   });
//   const [error, setError] = useState(null);

//   const SORT_OPTIONS = [
//     { value: "name", label: "Name (A-Z)" },
//     { value: "price-low", label: "Price: Low to High" },
//     { value: "price-high", label: "Price: High to Low" },
//     { value: "stock", label: "Most in Stock" },
//   ];

//   // ─── Helper: transform a single product ────────────────────────────
//   const transformProduct = useCallback((rawProduct) => {
//     // Parse sizes – can be JSON array or comma‑separated string (legacy)
//     let sizes = [];
//     if (rawProduct.sizes) {
//       if (typeof rawProduct.sizes === 'string') {
//         try {
//           sizes = JSON.parse(rawProduct.sizes);
//         } catch {
//           sizes = rawProduct.sizes.split(',').map(s => s.trim());
//         }
//       } else if (Array.isArray(rawProduct.sizes)) {
//         sizes = rawProduct.sizes;
//       }
//     }

//     // Parse available_Sizes – should be a JSON object
//     let availableSizes = {};
//     if (rawProduct.available_Sizes) {
//       if (typeof rawProduct.available_Sizes === 'string') {
//         try {
//           availableSizes = JSON.parse(rawProduct.available_Sizes);
//         } catch (e) {
//           console.warn('Failed to parse available_Sizes for product', rawProduct.id, e);
//         }
//       } else if (typeof rawProduct.available_Sizes === 'object') {
//         availableSizes = rawProduct.available_Sizes;
//       }
//     }

//     return {
//       ...rawProduct,
//       stock: rawProduct.stock_quantity,
//       sizes,
//       availableSizes,
//       tags: []
//     };
//   }, []);

//   const transformProducts = useCallback((rawProducts) => {
//     return (rawProducts || []).map(transformProduct);
//   }, [transformProduct]);

//   // ─── Fetch categories ──────────────────────────────────────────────
//   const fetchCategories = async () => {
//     try {
//       setLoading(prev => ({ ...prev, categories: true }));

//       const { data, error } = await supabase
//         .from('categories')
//         .select(`
//           *,
//           subcategories (*)
//         `)
//         .order('name');

//       if (error) throw error;

//       const formattedCategories = [
//         { id: 'all', name: 'all', label: 'All Products' },
//         ...data.map(cat => ({
//           id: cat.id,
//           name: cat.name.toLowerCase().replace(/\s+/g, '-'),
//           label: cat.name,
//           description: cat.description,
//           subcategories: cat.subcategories || []
//         }))
//       ];

//       setCategories(formattedCategories);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//       setError(err.message);
//     } finally {
//       setLoading(prev => ({ ...prev, categories: false }));
//     }
//   };

//   // ─── Fetch products (initial load & category change) ──────────────
//   const fetchProducts = async () => {
//     try {
//       setLoading(prev => ({ ...prev, products: true }));

//       let query = supabase
//         .from("products")
//         .select(`
//           *,
//           category:category_id (*),
//           subcategory:subcategory_id (*)
//         `);

//       if (selectedCategory !== "all") {
//         const categoryObj = categories.find(c => c.name === selectedCategory);
//         if (categoryObj && categoryObj.id !== 'all') {
//           query = query.eq('category_id', categoryObj.id);
//         }
//       }

//       const { data, error } = await query;

//       if (error) throw error;

//       const transformed = transformProducts(data);
//       setProducts(transformed);
//       setError(null);
//     } catch (err) {
//       console.error("Error loading products:", err);
//       setError(err.message);
//     } finally {
//       setLoading(prev => ({ ...prev, products: false }));
//     }
//   };

//   // ─── Effects ───────────────────────────────────────────────────────
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (categories.length > 0) {
//       fetchProducts();
//     }
//   }, [selectedCategory, categories.length]);

//   useEffect(() => {
//     setSelectedSubCategories([]);
//   }, [selectedCategory]);

//   // ─── 🔥 Real‑time subscription to product changes ──────────────────
//   useEffect(() => {
//     const unsubscribe = subscribeToProducts((updatedProducts) => {
//       const transformed = transformProducts(updatedProducts);
//       setProducts(transformed);
//     });

//     return () => unsubscribe();
//   }, [transformProducts]);

//   // ─── Derived values ────────────────────────────────────────────────
//   const subCategories = useMemo(() => {
//     if (selectedCategory === "all") return [];

//     const selectedCat = categories.find(c => c.name === selectedCategory);
//     if (!selectedCat) return [];

//     const uniqueSubIds = [...new Set(
//       products
//         .filter(p => p.category_id === selectedCat.id)
//         .map(p => p.subcategory_id)
//         .filter(id => id != null)
//     )];

//     return uniqueSubIds.map(subId => {
//       const subFromCategory = selectedCat.subcategories?.find(s => s.id === subId);
//       if (subFromCategory) {
//         return { id: subFromCategory.id, name: subFromCategory.name };
//       }
//       const product = products.find(p => p.subcategory_id === subId);
//       if (product?.subcategory) {
//         return { id: product.subcategory.id, name: product.subcategory.name };
//       }
//       return { id: subId, name: `Subcategory ${subId}` };
//     });
//   }, [products, selectedCategory, categories]);

//   const handleSubCategoryToggle = useCallback((subCategory) => {
//     setSelectedSubCategories((prev) => {
//       const subId = subCategory.id;
//       return prev.some(sc => sc.id === subId)
//         ? prev.filter(sc => sc.id !== subId)
//         : [...prev, subCategory];
//     });
//   }, []);

//   const filteredProducts = useMemo(() => {
//     return products
//       .filter((product) => {
//         const matchesCategory = selectedCategory === "all" || 
//           (() => {
//             const categoryObj = categories.find(c => c.name === selectedCategory);
//             return categoryObj && product.category_id === categoryObj.id;
//           })();

//         const matchesSubCategory =
//           selectedSubCategories.length === 0 ||
//           (product.subcategory_id &&
//             selectedSubCategories.some(sc => sc.id === product.subcategory_id));

//         const matchesSearch =
//           searchTerm === "" ||
//           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (product.description && product.description
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//           (product.category?.name && product.category.name
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//           (product.subcategory?.name && product.subcategory.name
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()));

//         return matchesCategory && matchesSubCategory && matchesSearch;
//       })
//       .sort((a, b) => {
//         switch (sortBy) {
//           case "price-low":
//             return a.price - b.price;
//           case "price-high":
//             return b.price - a.price;
//           case "name":
//             return a.name.localeCompare(b.name);
//           case "stock":
//             return b.stock_quantity - a.stock_quantity;
//           default:
//             return 0;
//         }
//       });
//   }, [products, selectedCategory, selectedSubCategories, searchTerm, sortBy, categories]);

//   const categoryDisplayNames = useMemo(() => {
//     const displayNames = { all: "All Products" };
//     categories.forEach(cat => {
//       if (cat.name !== 'all') {
//         displayNames[cat.name] = cat.label;
//       }
//     });
//     return displayNames;
//   }, [categories]);

//   const handleCategoryChange = useCallback((categoryName) => {
//     setSelectedCategory(categoryName);
//   }, []);

//   const clearSearch = useCallback(() => {
//     setSearchTerm("");
//   }, []);

//   const clearAllFilters = useCallback(() => {
//     setSelectedCategory("all");
//     setSelectedSubCategories([]);
//     setSearchTerm("");
//   }, []);

//   const handleAddToCart = useCallback(
//     (product, quantity = 1, selectedSize = null) => {
//       addToCart(product, quantity, selectedSize);
//     },
//     [addToCart]
//   );

//   // ─── Loading & Error UI ────────────────────────────────────────────
//   if (loading.categories || loading.products) {
//     return (
//       <div className="products-page-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="products-page-error">
//         <h3>Error Loading Products</h3>
//         <p>{error}</p>
//         <button 
//           onClick={() => {
//             setError(null);
//             fetchCategories();
//             fetchProducts();
//           }} 
//           className="btn btn-primary"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // ─── Render ────────────────────────────────────────────────────────
//   return (
//     <>
//       <StickyHeaderCard>
//         <div className="header-content">
//           <PageHeader />
//           <SearchSortRow
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onClearSearch={clearSearch}
//             sortBy={sortBy}
//             onSortChange={setSortBy}
//             sortOptions={SORT_OPTIONS}
//           />
//           <CategoryStrip
//             categories={categories}
//             selectedCategory={selectedCategory}
//             onCategoryChange={handleCategoryChange}
//             categoryDisplayNames={categoryDisplayNames}
//           />
//           {selectedCategory !== "all" && subCategories.length > 0 && (
//             <SubCategoryFiltersSticky
//               subCategories={subCategories}
//               selectedSubCategories={selectedSubCategories}
//               onSubCategoryToggle={handleSubCategoryToggle}
//             />
//           )}
//         </div>
//       </StickyHeaderCard>

//       <div className="products-page">
//         <div className="products-scrollable-content">
//           <ProductGrid
//             products={filteredProducts}
//             onAddToCart={handleAddToCart}
//           />
//           {filteredProducts.length === 0 && (
//             <EmptyState onClearFilters={clearAllFilters} />
//           )}
//           <ProductsInfo
//             filteredCount={filteredProducts.length}
//             totalCount={products.length}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// // ============================================================================
// // Subcomponents (unchanged)
// // ============================================================================

// const StickyHeaderCard = ({ children }) => (
//   <div className="products-sticky-header-card">{children}</div>
// );

// const PageHeader = () => (
//   <div className="page-header">
//     <h1 className="section-title">Karibbean Dealz Products</h1>
//     <p className="section-subtitle">
//       Discover premium beauty, home, and lifestyle products
//     </p>
//   </div>
// );

// const SearchSortRow = ({
//   searchTerm,
//   onSearchChange,
//   onClearSearch,
//   sortBy,
//   onSortChange,
//   sortOptions,
// }) => (
//   <div className="search-sort-row">
//     <SearchSection
//       searchTerm={searchTerm}
//       onSearchChange={onSearchChange}
//       onClearSearch={onClearSearch}
//     />
//     <SortSection
//       sortBy={sortBy}
//       onSortChange={onSortChange}
//       sortOptions={sortOptions}
//     />
//   </div>
// );

// const SearchSection = ({ searchTerm, onSearchChange, onClearSearch }) => (
//   <div className="search-section">
//     <div className="search-container">
//       <span className="search-icon">🔍</span>
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={searchTerm}
//         onChange={(e) => onSearchChange(e.target.value)}
//         className="search-input"
//       />
//       {searchTerm && <ClearSearchButton onClick={onClearSearch} />}
//     </div>
//   </div>
// );

// const ClearSearchButton = ({ onClick }) => (
//   <button
//     className="clear-search-btn"
//     onClick={onClick}
//     aria-label="Clear search"
//   >
//     ✕
//   </button>
// );

// const SortSection = ({ sortBy, onSortChange, sortOptions }) => (
//   <div className="sort-section">
//     <label htmlFor="sort-select">Sort by:</label>
//     <select
//       id="sort-select"
//       value={sortBy}
//       onChange={(e) => onSortChange(e.target.value)}
//       className="sort-select"
//     >
//       {sortOptions.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const CategoryStrip = ({
//   categories,
//   selectedCategory,
//   onCategoryChange,
//   categoryDisplayNames,
// }) => (
//   <div className="category-strip">
//     <div className="category-strip-header">
//       <h3>SHOP BY CATEGORY</h3>
//     </div>
//     <div className="category-strip-items">
//       {categories.map((category) => (
//         <CategoryStripButton
//           key={category.id}
//           category={category.name}
//           isActive={selectedCategory === category.name}
//           displayName={categoryDisplayNames[category.name]}
//           onClick={onCategoryChange}
//         />
//       ))}
//     </div>
//   </div>
// );

// const CategoryStripButton = ({ category, isActive, displayName, onClick }) => (
//   <button
//     className={`category-strip-btn ${isActive ? "active" : ""}`}
//     onClick={() => onClick(category)}
//     title={displayName}
//   >
//     {displayName}
//   </button>
// );

// const SubCategoryFiltersSticky = ({
//   subCategories,
//   selectedSubCategories,
//   onSubCategoryToggle,
// }) => (
//   <div className="subcategory-filters-sticky">
//     <h4>FILTER BY TYPE:</h4>
//     <div className="subcategory-checkboxes-sticky">
//       {subCategories.map((subCategory) => (
//         <SubCategoryCheckboxSticky
//           key={subCategory.id}
//           subCategory={subCategory}
//           isChecked={selectedSubCategories.some(sc => sc.id === subCategory.id)}
//           onToggle={onSubCategoryToggle}
//         />
//       ))}
//     </div>
//   </div>
// );

// const SubCategoryCheckboxSticky = ({ subCategory, isChecked, onToggle }) => (
//   <label className="subcategory-checkbox-sticky">
//     <input
//       type="checkbox"
//       checked={isChecked}
//       onChange={() => onToggle(subCategory)}
//     />
//     <span className="checkbox-label">{subCategory.name}</span>
//   </label>
// );

// const ProductGrid = ({ products, onAddToCart }) => (
//   <div className="products-grid">
//     {products.map((product) => (
//       <ProductCard
//         key={product.id}
//         product={product}
//         addToCart={onAddToCart}
//       />
//     ))}
//   </div>
// );

// const EmptyState = ({ onClearFilters }) => (
//   <div className="no-products">
//     <div className="no-products-icon">🔍</div>
//     <h2>No products found</h2>
//     <p>Try adjusting your search or filter criteria</p>
//     <button className="btn btn-primary" onClick={onClearFilters}>
//       Clear Filters
//     </button>
//   </div>
// );

// const ProductsInfo = ({ filteredCount, totalCount }) => (
//   <div className="products-info">
//     <p>
//       Showing {filteredCount} of {totalCount} products
//     </p>
//     <p className="products-tip">
//       💡 Tip: Stock indicators show available quantity. Items automatically
//       update when added to cart.
//     </p>
//   </div>
// );

// export default ProductsPage;















// // pages/ProductsPage.jsx
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import ProductCard from "../components/ProductCard";
// import { supabase } from "../lib/supabase/client";
// import "../styles/ProductCard.css";

// const ProductsPage = ({ addToCart }) => {
//   const queryClient = useQueryClient();

//   // ─── State (filters) ─────────────────────────────────────────────────
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedSubCategories, setSelectedSubCategories] = useState([]);
//   const [sortBy, setSortBy] = useState("name");
//   const [searchTerm, setSearchTerm] = useState("");

//   const SORT_OPTIONS = [
//     { value: "name", label: "Name (A-Z)" },
//     { value: "price-low", label: "Price: Low to High" },
//     { value: "price-high", label: "Price: High to Low" },
//     { value: "stock_quantity", label: "Most in Stock" },
//   ];

//   // ─── Helper: transform a single product ─────────────────────────────
//   const transformProduct = useCallback((rawProduct) => {
//     let sizes = [];
//     if (rawProduct.sizes) {
//       if (typeof rawProduct.sizes === 'string') {
//         try {
//           sizes = JSON.parse(rawProduct.sizes);
//         } catch {
//           sizes = rawProduct.sizes.split(',').map(s => s.trim());
//         }
//       } else if (Array.isArray(rawProduct.sizes)) {
//         sizes = rawProduct.sizes;
//       }
//     }

//     let availableSizes = {};
//     if (rawProduct.available_Sizes) {
//       if (typeof rawProduct.available_Sizes === 'string') {
//         try {
//           availableSizes = JSON.parse(rawProduct.available_Sizes);
//         } catch (e) {
//           console.warn('Failed to parse available_Sizes', rawProduct.id, e);
//         }
//       } else if (typeof rawProduct.available_Sizes === 'object') {
//         availableSizes = rawProduct.available_Sizes;
//       }
//     }

//     return {
//       ...rawProduct,
//       stock_quantity: rawProduct.stock_quantity,
//       sizes,
//       availableSizes,
//       tags: []
//     };
//   }, []);

//   const transformProducts = useCallback((rawProducts) => {
//     return (rawProducts || []).map(transformProduct);
//   }, [transformProduct]);

//   // ─── Fetch Categories with React Query ──────────────────────────────
//   const { data: categories = [], isLoading: categoriesLoading } = useQuery({
//     queryKey: ['categories'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('categories')
//         .select(`
//           *,
//           subcategories (*)
//         `)
//         .order('name');

//       if (error) throw error;

//       return [
//         { id: 'all', name: 'all', label: 'All Products' },
//         ...data.map(cat => ({
//           id: cat.id,
//           name: cat.name.toLowerCase().replace(/\s+/g, '-'),
//           label: cat.name,
//           description: cat.description,
//           subcategories: cat.subcategories || []
//         }))
//       ];
//     }
//   });

//   // ─── Fetch Products with React Query (depends on selectedCategory) ──
//   const {
//     data: products = [],
//     isLoading: productsLoading,
//     error: productsError,
//   } = useQuery({
//     queryKey: ['products', selectedCategory],
//     queryFn: async () => {
//       let query = supabase
//         .from("products")
//         .select(`
//           *,
//           category:category_id (*),
//           subcategory:subcategory_id (*)
//         `);

//       if (selectedCategory !== "all") {
//         const categoryObj = categories.find(c => c.name === selectedCategory);
//         if (categoryObj && categoryObj.id !== 'all') {
//           query = query.eq('category_id', categoryObj.id);
//         }
//       }

//       const { data, error } = await query;
//       if (error) throw error;
//       return transformProducts(data);
//     },
//     enabled: categories.length > 0, // wait until categories are loaded
//   });

//   // ─── Real‑time subscription – invalidate products query on any change ──
//   useEffect(() => {
//     const subscription = supabase
//       .channel('products-changes')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'products' },
//         () => {
//           queryClient.invalidateQueries({ queryKey: ['products'] });
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [queryClient]);

//   // Reset sub‑categories when main category changes
//   useEffect(() => {
//     setSelectedSubCategories([]);
//   }, [selectedCategory]);

//   // ─── Derived values (filtering, sorting) ─────────────────────────────
//   const subCategories = useMemo(() => {
//     if (selectedCategory === "all") return [];

//     const selectedCat = categories.find(c => c.name === selectedCategory);
//     if (!selectedCat) return [];

//     const uniqueSubIds = [...new Set(
//       products
//         .filter(p => p.category_id === selectedCat.id)
//         .map(p => p.subcategory_id)
//         .filter(id => id != null)
//     )];

//     return uniqueSubIds.map(subId => {
//       const subFromCategory = selectedCat.subcategories?.find(s => s.id === subId);
//       if (subFromCategory) {
//         return { id: subFromCategory.id, name: subFromCategory.name };
//       }
//       const product = products.find(p => p.subcategory_id === subId);
//       if (product?.subcategory) {
//         return { id: product.subcategory.id, name: product.subcategory.name };
//       }
//       return { id: subId, name: `Subcategory ${subId}` };
//     });
//   }, [products, selectedCategory, categories]);

//   const handleSubCategoryToggle = useCallback((subCategory) => {
//     setSelectedSubCategories((prev) => {
//       const subId = subCategory.id;
//       return prev.some(sc => sc.id === subId)
//         ? prev.filter(sc => sc.id !== subId)
//         : [...prev, subCategory];
//     });
//   }, []);

//   const filteredProducts = useMemo(() => {
//     return products
//       .filter((product) => {
//         const matchesCategory = selectedCategory === "all" || 
//           (() => {
//             const categoryObj = categories.find(c => c.name === selectedCategory);
//             return categoryObj && product.category_id === categoryObj.id;
//           })();

//         const matchesSubCategory =
//           selectedSubCategories.length === 0 ||
//           (product.subcategory_id &&
//             selectedSubCategories.some(sc => sc.id === product.subcategory_id));

//         const matchesSearch =
//           searchTerm === "" ||
//           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (product.description && product.description
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//           (product.category?.name && product.category.name
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//           (product.subcategory?.name && product.subcategory.name
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()));

//         return matchesCategory && matchesSubCategory && matchesSearch;
//       })
//       .sort((a, b) => {
//         switch (sortBy) {
//           case "price-low": return a.price - b.price;
//           case "price-high": return b.price - a.price;
//           case "name": return a.name.localeCompare(b.name);
//           case "stock_quantity": return b.stock_quantity - a.stock_quantity;
//           default: return 0;
//         }
//       });
//   }, [products, selectedCategory, selectedSubCategories, searchTerm, sortBy, categories]);

//   const categoryDisplayNames = useMemo(() => {
//     const displayNames = { all: "All Products" };
//     categories.forEach(cat => {
//       if (cat.name !== 'all') {
//         displayNames[cat.name] = cat.label;
//       }
//     });
//     return displayNames;
//   }, [categories]);

//   // ─── Handlers ────────────────────────────────────────────────────────
//   const handleCategoryChange = useCallback((categoryName) => {
//     setSelectedCategory(categoryName);
//   }, []);

//   const clearSearch = useCallback(() => {
//     setSearchTerm("");
//   }, []);

//   const clearAllFilters = useCallback(() => {
//     setSelectedCategory("all");
//     setSelectedSubCategories([]);
//     setSearchTerm("");
//   }, []);

//   const handleAddToCart = useCallback(
//     (product, quantity = 1, selectedSize = null) => {
//       addToCart(product, quantity, selectedSize);
//     },
//     [addToCart]
//   );

//   // ─── Loading & Error UI ──────────────────────────────────────────────
//   if (categoriesLoading || productsLoading) {
//     return (
//       <div className="products-page-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (productsError) {
//     return (
//       <div className="products-page-error">
//         <h3>Error Loading Products</h3>
//         <p>{productsError.message}</p>
//         <button onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })} className="btn btn-primary">
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // ─── Render ──────────────────────────────────────────────────────────
//   return (
//     <>
//       <StickyHeaderCard>
//         <div className="header-content">
//           <PageHeader />
//           <SearchSortRow
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onClearSearch={clearSearch}
//             sortBy={sortBy}
//             onSortChange={setSortBy}
//             sortOptions={SORT_OPTIONS}
//           />
//           <CategoryStrip
//             categories={categories}
//             selectedCategory={selectedCategory}
//             onCategoryChange={handleCategoryChange}
//             categoryDisplayNames={categoryDisplayNames}
//           />
//           {selectedCategory !== "all" && subCategories.length > 0 && (
//             <SubCategoryFiltersSticky
//               subCategories={subCategories}
//               selectedSubCategories={selectedSubCategories}
//               onSubCategoryToggle={handleSubCategoryToggle}
//             />
//           )}
//         </div>
//       </StickyHeaderCard>

//       <div className="products-page">
//         <div className="products-scrollable-content">
//           <ProductGrid
//             products={filteredProducts}
//             onAddToCart={handleAddToCart}
//           />
//           {filteredProducts.length === 0 && (
//             <EmptyState onClearFilters={clearAllFilters} />
//           )}
//           <ProductsInfo
//             filteredCount={filteredProducts.length}
//             totalCount={products.length}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// // ============================================================================
// // Subcomponents (must be defined)
// // ============================================================================

// const StickyHeaderCard = ({ children }) => (
//   <div className="products-sticky-header-card">{children}</div>
// );

// const PageHeader = () => (
//   <div className="page-header">
//     <h1 className="section-title">Karibbean Dealz Products</h1>
//     <p className="section-subtitle">
//       Discover premium beauty, home, and lifestyle products
//     </p>
//   </div>
// );

// const SearchSortRow = ({
//   searchTerm,
//   onSearchChange,
//   onClearSearch,
//   sortBy,
//   onSortChange,
//   sortOptions,
// }) => (
//   <div className="search-sort-row">
//     <SearchSection
//       searchTerm={searchTerm}
//       onSearchChange={onSearchChange}
//       onClearSearch={onClearSearch}
//     />
//     <SortSection
//       sortBy={sortBy}
//       onSortChange={onSortChange}
//       sortOptions={sortOptions}
//     />
//   </div>
// );

// const SearchSection = ({ searchTerm, onSearchChange, onClearSearch }) => (
//   <div className="search-section">
//     <div className="search-container">
//       <span className="search-icon">🔍</span>
//       <input
//         type="text"
//         placeholder="Search products..."
//         value={searchTerm}
//         onChange={(e) => onSearchChange(e.target.value)}
//         className="search-input"
//       />
//       {searchTerm && <ClearSearchButton onClick={onClearSearch} />}
//     </div>
//   </div>
// );

// const ClearSearchButton = ({ onClick }) => (
//   <button
//     className="clear-search-btn"
//     onClick={onClick}
//     aria-label="Clear search"
//   >
//     ✕
//   </button>
// );

// const SortSection = ({ sortBy, onSortChange, sortOptions }) => (
//   <div className="sort-section">
//     <label htmlFor="sort-select">Sort by:</label>
//     <select
//       id="sort-select"
//       value={sortBy}
//       onChange={(e) => onSortChange(e.target.value)}
//       className="sort-select"
//     >
//       {sortOptions.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const CategoryStrip = ({
//   categories,
//   selectedCategory,
//   onCategoryChange,
//   categoryDisplayNames,
// }) => (
//   <div className="category-strip">
//     <div className="category-strip-header">
//       <h3>SHOP BY CATEGORY</h3>
//     </div>
//     <div className="category-strip-items">
//       {categories.map((category) => (
//         <CategoryStripButton
//           key={category.id}
//           category={category.name}
//           isActive={selectedCategory === category.name}
//           displayName={categoryDisplayNames[category.name]}
//           onClick={onCategoryChange}
//         />
//       ))}
//     </div>
//   </div>
// );

// const CategoryStripButton = ({ category, isActive, displayName, onClick }) => (
//   <button
//     className={`category-strip-btn ${isActive ? "active" : ""}`}
//     onClick={() => onClick(category)}
//     title={displayName}
//   >
//     {displayName}
//   </button>
// );

// const SubCategoryFiltersSticky = ({
//   subCategories,
//   selectedSubCategories,
//   onSubCategoryToggle,
// }) => (
//   <div className="subcategory-filters-sticky">
//     <h4>FILTER BY TYPE:</h4>
//     <div className="subcategory-checkboxes-sticky">
//       {subCategories.map((subCategory) => (
//         <SubCategoryCheckboxSticky
//           key={subCategory.id}
//           subCategory={subCategory}
//           isChecked={selectedSubCategories.some(sc => sc.id === subCategory.id)}
//           onToggle={onSubCategoryToggle}
//         />
//       ))}
//     </div>
//   </div>
// );

// const SubCategoryCheckboxSticky = ({ subCategory, isChecked, onToggle }) => (
//   <label className="subcategory-checkbox-sticky">
//     <input
//       type="checkbox"
//       checked={isChecked}
//       onChange={() => onToggle(subCategory)}
//     />
//     <span className="checkbox-label">{subCategory.name}</span>
//   </label>
// );

// const ProductGrid = ({ products, onAddToCart }) => (
//   <div className="products-grid">
//     {products.map((product) => (
//       <ProductCard
//         key={product.id}
//         product={product}
//         addToCart={onAddToCart}
//       />
//     ))}
//   </div>
// );

// const EmptyState = ({ onClearFilters }) => (
//   <div className="no-products">
//     <div className="no-products-icon">🔍</div>
//     <h2>No products found</h2>
//     <p>Try adjusting your search or filter criteria</p>
//     <button className="btn btn-primary" onClick={onClearFilters}>
//       Clear Filters
//     </button>
//   </div>
// );

// const ProductsInfo = ({ filteredCount, totalCount }) => (
//   <div className="products-info">
//     <p>
//       Showing {filteredCount} of {totalCount} products
//     </p>
//     <p className="products-tip">
//       💡 Tip: Stock indicators show available quantity. Items automatically
//       update when added to cart.
//     </p>
//   </div>
// );

// export default ProductsPage;





































































// pages/ProductsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase/client";
import "../styles/ProductCard.css";

const ProductsPage = ({ addToCart }) => {
  const queryClient = useQueryClient();

  // ─── State (filters) ─────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const SORT_OPTIONS = [
    { value: "name", label: "Name (A-Z)" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "stock_quantity", label: "Most in Stock" },
  ];

  // ─── Helper: transform a single product ─────────────────────────────
  const transformProduct = useCallback((rawProduct) => {
    // Parse sizes array (stored as JSON string or comma‑separated)
    let sizes = [];
    if (rawProduct.sizes) {
      if (typeof rawProduct.sizes === 'string') {
        try {
          sizes = JSON.parse(rawProduct.sizes);
        } catch {
          sizes = rawProduct.sizes.split(',').map(s => s.trim());
        }
      } else if (Array.isArray(rawProduct.sizes)) {
        sizes = rawProduct.sizes;
      }
    }

    // Parse available_sizes object (stored as JSON string)
    let availableSizes = {};
    // First try the correct lowercase column name
    const availableSizesRaw = rawProduct.available_sizes !== undefined 
      ? rawProduct.available_sizes 
      : rawProduct.available_Sizes; // fallback for legacy capital S
    if (availableSizesRaw) {
      if (typeof availableSizesRaw === 'string') {
        try {
          availableSizes = JSON.parse(availableSizesRaw);
        } catch (e) {
          console.warn('Failed to parse available_sizes for product', rawProduct.id, e);
        }
      } else if (typeof availableSizesRaw === 'object') {
        availableSizes = availableSizesRaw;
      }
    }

    return {
      ...rawProduct,
      stock_quantity: rawProduct.stock_quantity,
      sizes,
      availableSizes, // object for quick lookup by size
    };
  }, []);

  const transformProducts = useCallback((rawProducts) => {
    return (rawProducts || []).map(transformProduct);
  }, [transformProduct]);

  // ─── Fetch Categories with React Query ──────────────────────────────
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          subcategories (*)
        `)
        .order('name');

      if (error) throw error;

      return [
        { id: 'all', name: 'all', label: 'All Products' },
        ...data.map(cat => ({
          id: cat.id,
          name: cat.name.toLowerCase().replace(/\s+/g, '-'),
          label: cat.name,
          description: cat.description,
          subcategories: cat.subcategories || []
        }))
      ];
    }
  });

  // ─── Fetch Products with React Query (depends on selectedCategory) ──
  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          category:category_id (*),
          subcategory:subcategory_id (*)
        `);

      if (selectedCategory !== "all") {
        const categoryObj = categories.find(c => c.name === selectedCategory);
        if (categoryObj && categoryObj.id !== 'all') {
          query = query.eq('category_id', categoryObj.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return transformProducts(data);
    },
    enabled: categories.length > 0, // wait until categories are loaded
  });

  // ─── Real‑time subscription – invalidate products query on any change ──
  useEffect(() => {
    const subscription = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);

  // Reset sub‑categories when main category changes
  useEffect(() => {
    setSelectedSubCategories([]);
  }, [selectedCategory]);

  // ─── Derived values (filtering, sorting) ─────────────────────────────
  const subCategories = useMemo(() => {
    if (selectedCategory === "all") return [];

    const selectedCat = categories.find(c => c.name === selectedCategory);
    if (!selectedCat) return [];

    const uniqueSubIds = [...new Set(
      products
        .filter(p => p.category_id === selectedCat.id)
        .map(p => p.subcategory_id)
        .filter(id => id != null)
    )];

    return uniqueSubIds.map(subId => {
      const subFromCategory = selectedCat.subcategories?.find(s => s.id === subId);
      if (subFromCategory) {
        return { id: subFromCategory.id, name: subFromCategory.name };
      }
      const product = products.find(p => p.subcategory_id === subId);
      if (product?.subcategory) {
        return { id: product.subcategory.id, name: product.subcategory.name };
      }
      return { id: subId, name: `Subcategory ${subId}` };
    });
  }, [products, selectedCategory, categories]);

  const handleSubCategoryToggle = useCallback((subCategory) => {
    setSelectedSubCategories((prev) => {
      const subId = subCategory.id;
      return prev.some(sc => sc.id === subId)
        ? prev.filter(sc => sc.id !== subId)
        : [...prev, subCategory];
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory = selectedCategory === "all" || 
          (() => {
            const categoryObj = categories.find(c => c.name === selectedCategory);
            return categoryObj && product.category_id === categoryObj.id;
          })();

        const matchesSubCategory =
          selectedSubCategories.length === 0 ||
          (product.subcategory_id &&
            selectedSubCategories.some(sc => sc.id === product.subcategory_id));

        const matchesSearch =
          searchTerm === "" ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description && product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
          (product.category?.name && product.category.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
          (product.subcategory?.name && product.subcategory.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

        return matchesCategory && matchesSubCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low": return a.price - b.price;
          case "price-high": return b.price - a.price;
          case "name": return a.name.localeCompare(b.name);
          case "stock_quantity": return b.stock_quantity - a.stock_quantity;
          default: return 0;
        }
      });
  }, [products, selectedCategory, selectedSubCategories, searchTerm, sortBy, categories]);

  const categoryDisplayNames = useMemo(() => {
    const displayNames = { all: "All Products" };
    categories.forEach(cat => {
      if (cat.name !== 'all') {
        displayNames[cat.name] = cat.label;
      }
    });
    return displayNames;
  }, [categories]);

  // ─── Handlers ────────────────────────────────────────────────────────
  const handleCategoryChange = useCallback((categoryName) => {
    setSelectedCategory(categoryName);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCategory("all");
    setSelectedSubCategories([]);
    setSearchTerm("");
  }, []);

  const handleAddToCart = useCallback(
    (product, quantity = 1, selectedSize = null) => {
      addToCart(product, quantity, selectedSize);
    },
    [addToCart]
  );

  // ─── Loading & Error UI ──────────────────────────────────────────────
  if (categoriesLoading || productsLoading) {
    return (
      <div className="products-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="products-page-error">
        <h3>Error Loading Products</h3>
        <p>{productsError.message}</p>
        <button onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────
  return (
    <>
      <StickyHeaderCard>
        <div className="header-content">
          <PageHeader />
          <SearchSortRow
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClearSearch={clearSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={SORT_OPTIONS}
          />
          <CategoryStrip
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categoryDisplayNames={categoryDisplayNames}
          />
          {selectedCategory !== "all" && subCategories.length > 0 && (
            <SubCategoryFiltersSticky
              subCategories={subCategories}
              selectedSubCategories={selectedSubCategories}
              onSubCategoryToggle={handleSubCategoryToggle}
            />
          )}
        </div>
      </StickyHeaderCard>

      <div className="products-page">
        <div className="products-scrollable-content">
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
          />
          {filteredProducts.length === 0 && (
            <EmptyState onClearFilters={clearAllFilters} />
          )}
          <ProductsInfo
            filteredCount={filteredProducts.length}
            totalCount={products.length}
          />
        </div>
      </div>
    </>
  );
};

// ============================================================================
// Subcomponents (must be defined)
// ============================================================================

const StickyHeaderCard = ({ children }) => (
  <div className="products-sticky-header-card">{children}</div>
);

const PageHeader = () => (
  <div className="page-header">
    <h1 className="section-title">Karibbean Dealz Products</h1>
    <p className="section-subtitle">
      Discover premium beauty, home, and lifestyle products
    </p>
  </div>
);

const SearchSortRow = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  sortBy,
  onSortChange,
  sortOptions,
}) => (
  <div className="search-sort-row">
    <SearchSection
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      onClearSearch={onClearSearch}
    />
    <SortSection
      sortBy={sortBy}
      onSortChange={onSortChange}
      sortOptions={sortOptions}
    />
  </div>
);

const SearchSection = ({ searchTerm, onSearchChange, onClearSearch }) => (
  <div className="search-section">
    <div className="search-container">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      {searchTerm && <ClearSearchButton onClick={onClearSearch} />}
    </div>
  </div>
);

const ClearSearchButton = ({ onClick }) => (
  <button
    className="clear-search-btn"
    onClick={onClick}
    aria-label="Clear search"
  >
    ✕
  </button>
);

const SortSection = ({ sortBy, onSortChange, sortOptions }) => (
  <div className="sort-section">
    <label htmlFor="sort-select">Sort by:</label>
    <select
      id="sort-select"
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value)}
      className="sort-select"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const CategoryStrip = ({
  categories,
  selectedCategory,
  onCategoryChange,
  categoryDisplayNames,
}) => (
  <div className="category-strip">
    <div className="category-strip-header">
      <h3>SHOP BY CATEGORY</h3>
    </div>
    <div className="category-strip-items">
      {categories.map((category) => (
        <CategoryStripButton
          key={category.id}
          category={category.name}
          isActive={selectedCategory === category.name}
          displayName={categoryDisplayNames[category.name]}
          onClick={onCategoryChange}
        />
      ))}
    </div>
  </div>
);

const CategoryStripButton = ({ category, isActive, displayName, onClick }) => (
  <button
    className={`category-strip-btn ${isActive ? "active" : ""}`}
    onClick={() => onClick(category)}
    title={displayName}
  >
    {displayName}
  </button>
);

const SubCategoryFiltersSticky = ({
  subCategories,
  selectedSubCategories,
  onSubCategoryToggle,
}) => (
  <div className="subcategory-filters-sticky">
    <h4>FILTER BY TYPE:</h4>
    <div className="subcategory-checkboxes-sticky">
      {subCategories.map((subCategory) => (
        <SubCategoryCheckboxSticky
          key={subCategory.id}
          subCategory={subCategory}
          isChecked={selectedSubCategories.some(sc => sc.id === subCategory.id)}
          onToggle={onSubCategoryToggle}
        />
      ))}
    </div>
  </div>
);

const SubCategoryCheckboxSticky = ({ subCategory, isChecked, onToggle }) => (
  <label className="subcategory-checkbox-sticky">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={() => onToggle(subCategory)}
    />
    <span className="checkbox-label">{subCategory.name}</span>
  </label>
);

const ProductGrid = ({ products, onAddToCart }) => (
  <div className="products-grid">
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        addToCart={onAddToCart}
      />
    ))}
  </div>
);

const EmptyState = ({ onClearFilters }) => (
  <div className="no-products">
    <div className="no-products-icon">🔍</div>
    <h2>No products found</h2>
    <p>Try adjusting your search or filter criteria</p>
    <button className="btn btn-primary" onClick={onClearFilters}>
      Clear Filters
    </button>
  </div>
);

const ProductsInfo = ({ filteredCount, totalCount }) => (
  <div className="products-info">
    <p>
      Showing {filteredCount} of {totalCount} products
    </p>
    <p className="products-tip">
      💡 Tip: Stock indicators show available quantity. Items automatically
      update when added to cart.
    </p>
  </div>
);

export default ProductsPage;