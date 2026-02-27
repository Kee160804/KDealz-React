// pages/ProductsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import {
  getAllProducts,
  subscribeToProducts,
} from "../services/productService";
import "../styles/ProductCard.css";

import { supabase } from "../lib/supabase/client";

/**
 * ProductsPage Component
 * Displays all products with filtering, sorting, and search capabilities
 * Includes real-time stock updates via subscription
 */
const ProductsPage = ({ addToCart }) => {
  // ─── State Management ────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  // ─── Constants ───────────────────────────────────────────────────────
  const CATEGORIES = [
    "all",
    "beauty-bodycare",
    "bathroom-essentials",
    "footwear",
    "home-living",
    "electronics",
    "apparel",
  ];

  const CATEGORY_DISPLAY_NAMES = {
    all: "All Products",
    "beauty-bodycare": "Beauty & Body Care",
    "bathroom-essentials": "Bathroom Essentials",
    footwear: "Footwear",
    "home-living": "Home & Living",
    electronics: "Electronics",
    apparel: "Apparel",
  };

  const SORT_OPTIONS = [
    { value: "name", label: "Name (A-Z)" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "stock", label: "Most in Stock" },
  ];





  // ─── Effects ─────────────────────────────────────────────────────────

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("Error loading products:", error);
      } else {
        setProducts(data || []);
      }

      // setLoading(false);
    };

    loadProducts();
  }, []);





  
  // Reset sub-categories when category changes
  useEffect(() => {
    setSelectedSubCategories([]);
  }, [selectedCategory]);

  // ─── Derived Values ──────────────────────────────────────────────────
  const subCategories = useMemo(() => {
    if (selectedCategory === "all") return [];

    return products
      .filter((product) => product.category === selectedCategory)
      .map((product) => product.subCategory)
      .filter((value, index, self) => value && self.indexOf(value) === index);
  }, [products, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "all" || product.category === selectedCategory;
        const matchesSubCategory =
          selectedSubCategories.length === 0 ||
          (product.subCategory &&
            selectedSubCategories.includes(product.subCategory));
        const matchesSearch =
          searchTerm === "" ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (product.tags &&
            product.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase()),
            ));

        return matchesCategory && matchesSubCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "name":
            return a.name.localeCompare(b.name);
          case "stock":
            return b.stock - a.stock;
          default:
            return 0;
        }
      });
  }, [products, selectedCategory, selectedSubCategories, searchTerm, sortBy]);

  // ─── Handlers ────────────────────────────────────────────────────────
  const handleSubCategoryToggle = useCallback((subCategory) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategory)
        ? prev.filter((sc) => sc !== subCategory)
        : [...prev, subCategory],
    );
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCategory("all");
    setSelectedSubCategories([]);
    setSearchTerm("");
  }, []);

  /**
   * Handle adding product to cart with stock validation
   * Updates local product stock and calls parent addToCart
   */
  const handleAddToCart = useCallback(
    (product, quantity = 1, selectedSize = null) => {
      console.log("ProductsPage - Adding to cart:", {
        product: product.name,
        quantity,
        selectedSize,
      });

      // Validate size selection for footwear/apparel
      const requiresSizeSelection =
        (product.category === "footwear" || product.category === "apparel") &&
        product.sizes?.length > 0;

      if (requiresSizeSelection) {
        if (!selectedSize) {
          alert(`Please select a size for ${product.name}`);
          return;
        }

        if (product.availableSizes?.[selectedSize] < quantity) {
          alert(
            `Only ${product.availableSizes[selectedSize]} available in size ${selectedSize}`,
          );
          return;
        }
      } else if (product.stock < quantity) {
        alert(`Only ${product.stock} items available in stock`);
        return;
      }

      // Update local product stock
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          if (p.id === product.id) {
            if (requiresSizeSelection && selectedSize && p.availableSizes) {
              return {
                ...p,
                availableSizes: {
                  ...p.availableSizes,
                  [selectedSize]: Math.max(
                    0,
                    p.availableSizes[selectedSize] - quantity,
                  ),
                },
                stock: Math.max(0, p.stock - quantity),
              };
            }
            return { ...p, stock: Math.max(0, p.stock - quantity) };
          }
          return p;
        }),
      );

      // Add to cart with all necessary info
      addToCart({
        ...product,
        selectedSize: selectedSize || product.selectedSize,
        quantity,
        stock: Math.max(0, product.stock - quantity),
        availableSizes:
          product.availableSizes && selectedSize
            ? {
                ...product.availableSizes,
                [selectedSize]: Math.max(
                  0,
                  (product.availableSizes[selectedSize] || 0) - quantity,
                ),
              }
            : product.availableSizes,
      });
    },
    [addToCart],
  );

  // ─── Render ──────────────────────────────────────────────────────────
  return (
    <>
      {/* Sticky Header - Full Width Outside Main Container */}
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
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categoryDisplayNames={CATEGORY_DISPLAY_NAMES}
          />

          {/* Sub-Category Filters - Now in Sticky Header */}
          {selectedCategory !== "all" && subCategories.length > 0 && (
            <SubCategoryFiltersSticky
              subCategories={subCategories}
              selectedSubCategories={selectedSubCategories}
              onSubCategoryToggle={handleSubCategoryToggle}
            />
          )}
        </div>
      </StickyHeaderCard>

      {/* Main Content Container */}
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
// STICKY HEADER CARD COMPONENT (Full Width - No Gaps)
// ============================================================================

const StickyHeaderCard = ({ children }) => (
  <div className="products-sticky-header-card">{children}</div>
);

// ============================================================================
// PAGE HEADER COMPONENT
// ============================================================================

const PageHeader = () => (
  <div className="page-header">
    <h1 className="section-title">Karibbean Dealz Products</h1>
    <p className="section-subtitle">
      Discover premium beauty, home, and lifestyle products
    </p>
  </div>
);

// ============================================================================
// SEARCH AND SORT ROW (Side by Side)
// ============================================================================

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

// ============================================================================
// SEARCH SECTION
// ============================================================================

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

// ============================================================================
// SORT SECTION
// ============================================================================

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

// ============================================================================
// CATEGORY STRIP (Horizontal scroll on mobile)
// ============================================================================

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
          key={category}
          category={category}
          isActive={selectedCategory === category}
          displayName={categoryDisplayNames[category]}
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

// ============================================================================
// SUB-CATEGORY FILTERS - STICKY VERSION
// ============================================================================

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
          key={subCategory}
          subCategory={subCategory}
          isChecked={selectedSubCategories.includes(subCategory)}
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
    <span className="checkbox-label">{subCategory.replace("-", " ")}</span>
  </label>
);

// ============================================================================
// PRODUCT GRID
// ============================================================================

const ProductGrid = ({ products, onAddToCart }) => (
  <div className="products-grid">
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        addToCart={(product, quantity, selectedSize) =>
          onAddToCart(product, quantity, selectedSize)
        }
      />
    ))}
  </div>
);

// ============================================================================
// EMPTY STATE
// ============================================================================

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

// ============================================================================
// PRODUCTS INFO
// ============================================================================

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
