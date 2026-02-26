// services/productService.js
import { products as mockProducts } from '../data/MockData';

// Add default cost and SKU to products that don't have them
const enhanceProductsWithDefaults = (products) => {
  return products.map(product => ({
    ...product,
    // Add cost field (default to 60% of price if not present)
    cost: product.cost !== undefined ? product.cost : parseFloat((product.price * 0.6).toFixed(2)),
    // Add SKU field (generate from name and id if not present)
    sku: product.sku || `${product.category?.substring(0, 3).toUpperCase() || 'PRD'}-${String(product.id).padStart(3, '0')}`,
    // Ensure tags is always an array
    tags: product.tags || []
  }));
};

// Initialize localStorage with mock data if empty
const initializeProducts = () => {
  const storedProducts = localStorage.getItem('products');
  
  // If no products exist in localStorage, use mock data
  if (!storedProducts) {
    console.log("Loading products from mock data...");
    const enhancedProducts = enhanceProductsWithDefaults(mockProducts);
    localStorage.setItem('products', JSON.stringify(enhancedProducts));
    return enhancedProducts;
  }
  
  // Otherwise return whatever is in localStorage
  try {
    return JSON.parse(storedProducts);
  } catch (e) {
    console.error("Error parsing products, reloading from mock data:", e);
    const enhancedProducts = enhanceProductsWithDefaults(mockProducts);
    localStorage.setItem('products', JSON.stringify(enhancedProducts));
    return enhancedProducts;
  }
};

// Get all products
export const getAllProducts = () => {
  return initializeProducts();
};

// Get product by ID
export const getProductById = (id) => {
  const products = getAllProducts();
  return products.find(p => p.id === id);
};

// Add new product
export const addProduct = (product) => {
  const products = getAllProducts();
  const newProduct = {
    ...product,
    id: Date.now(),
    cost: product.cost || parseFloat((product.price * 0.6).toFixed(2)),
    sku: product.sku || `NEW-${Date.now().toString().slice(-4)}`,
  };
  const updatedProducts = [...products, newProduct];
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  
  // Trigger storage event for real-time updates
  window.dispatchEvent(new Event('storage'));
  
  return newProduct;
};

// Update product
export const updateProduct = (id, updatedData) => {
  const products = getAllProducts();
  const updatedProducts = products.map(p => 
    p.id === id ? { ...p, ...updatedData } : p
  );
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  
  window.dispatchEvent(new Event('storage'));
  
  return updatedProducts.find(p => p.id === id);
};

// Delete product
export const deleteProduct = (id) => {
  const products = getAllProducts();
  const updatedProducts = products.filter(p => p.id !== id);
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  
  window.dispatchEvent(new Event('storage'));
  
  return updatedProducts;
};

// Update stock
export const updateStock = (id, newStock) => {
  const products = getAllProducts();
  const updatedProducts = products.map(p => 
    p.id === id ? { ...p, stock: newStock } : p
  );
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  
  window.dispatchEvent(new Event('storage'));
  
  return updatedProducts.find(p => p.id === id);
};

// Subscribe to product changes
export const subscribeToProducts = (callback) => {
  const handleStorageChange = (e) => {
    if (e.key === 'products') {
      callback(JSON.parse(e.newValue));
    }
  };
  
  const handleCustomEvent = () => {
    callback(getAllProducts());
  };
  
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('products-updated', handleCustomEvent);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('products-updated', handleCustomEvent);
  };
};

// Manually trigger update event
export const triggerProductsUpdate = () => {
  window.dispatchEvent(new Event('products-updated'));
};