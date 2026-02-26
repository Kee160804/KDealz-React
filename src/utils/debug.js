// utils/debug.js
import { getAllProducts } from '../services/productService';
import { mockProducts } from '../data/MockData';

export const debugProducts = () => {
  console.log("=== PRODUCT DEBUGGING ===");
  console.log("Mock data products:", mockProducts);
  console.log("Mock data count:", mockProducts.length);
  
  const stored = localStorage.getItem('products');
  console.log("Raw localStorage products:", stored);
  
  const products = getAllProducts();
  console.log("Products from service:", products);
  console.log("Products count:", products.length);
  
  return products;
};

// Call this from browser console to debug
window.debugProducts = debugProducts;