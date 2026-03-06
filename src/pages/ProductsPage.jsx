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

  //  URL SEARCH PARAMS: Read category from URL on page load
  // This useEffect runs when the component mounts or when the URL changes
  useEffect(() => {
    //  Get the current URL's search parameters
    const params = new URLSearchParams(window.location.search);
    
    //  Read the 'category' parameter from URL (e.g., ?category=mens-clothing)
    const categoryFromUrl = params.get('category');
    
    //  If category parameter exists in URL, set it as the selected category
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      console.log('📍 Category loaded from URL:', categoryFromUrl); // Debug log to trace the parameter
    }
  }, []); // Empty dependency array means this runs only once on mount

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