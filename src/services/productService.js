// // services/productService.js
// import { products as mockProducts } from '../data/MockData';

// // Add default cost and SKU to products that don't have them
// const enhanceProductsWithDefaults = (products) => {
//   return products.map(product => ({
//     ...product,
//     // Add cost field (default to 60% of price if not present)
//     cost: product.cost !== undefined ? product.cost : parseFloat((product.price * 0.6).toFixed(2)),
//     // Add SKU field (generate from name and id if not present)
//     sku: product.sku || `${product.category?.substring(0, 3).toUpperCase() || 'PRD'}-${String(product.id).padStart(3, '0')}`,
//     // Ensure tags is always an array
//     tags: product.tags || []
//   }));
// };

// // Initialize localStorage with mock data if empty
// const initializeProducts = () => {
//   const storedProducts = localStorage.getItem('products');
  
//   // If no products exist in localStorage, use mock data
//   if (!storedProducts) {
//     console.log("Loading products from mock data...");
//     const enhancedProducts = enhanceProductsWithDefaults(mockProducts);
//     localStorage.setItem('products', JSON.stringify(enhancedProducts));
//     return enhancedProducts;
//   }
  
//   // Otherwise return whatever is in localStorage
//   try {
//     return JSON.parse(storedProducts);
//   } catch (e) {
//     console.error("Error parsing products, reloading from mock data:", e);
//     const enhancedProducts = enhanceProductsWithDefaults(mockProducts);
//     localStorage.setItem('products', JSON.stringify(enhancedProducts));
//     return enhancedProducts;
//   }
// };

// // Get all products
// export const getAllProducts = () => {
//   return initializeProducts();
// };

// // Get product by ID
// export const getProductById = (id) => {
//   const products = getAllProducts();
//   return products.find(p => p.id === id);
// };

// // Add new product
// export const addProduct = (product) => {
//   const products = getAllProducts();
//   const newProduct = {
//     ...product,
//     id: Date.now(),
//     cost: product.cost || parseFloat((product.price * 0.6).toFixed(2)),
//     sku: product.sku || `NEW-${Date.now().toString().slice(-4)}`,
//   };
//   const updatedProducts = [...products, newProduct];
//   localStorage.setItem('products', JSON.stringify(updatedProducts));
  
//   // Trigger storage event for real-time updates
//   window.dispatchEvent(new Event('storage'));
  
//   return newProduct;
// };

// // Update product
// export const updateProduct = (id, updatedData) => {
//   const products = getAllProducts();
//   const updatedProducts = products.map(p => 
//     p.id === id ? { ...p, ...updatedData } : p
//   );
//   localStorage.setItem('products', JSON.stringify(updatedProducts));
  
//   window.dispatchEvent(new Event('storage'));
  
//   return updatedProducts.find(p => p.id === id);
// };

// // Delete product
// export const deleteProduct = (id) => {
//   const products = getAllProducts();
//   const updatedProducts = products.filter(p => p.id !== id);
//   localStorage.setItem('products', JSON.stringify(updatedProducts));
  
//   window.dispatchEvent(new Event('storage'));
  
//   return updatedProducts;
// };

// // Update stock
// export const updateStock = (id, newStock) => {
//   const products = getAllProducts();
//   const updatedProducts = products.map(p => 
//     p.id === id ? { ...p, stock: newStock } : p
//   );
//   localStorage.setItem('products', JSON.stringify(updatedProducts));
  
//   window.dispatchEvent(new Event('storage'));
  
//   return updatedProducts.find(p => p.id === id);
// };

// // Subscribe to product changes
// export const subscribeToProducts = (callback) => {
//   const handleStorageChange = (e) => {
//     if (e.key === 'products') {
//       callback(JSON.parse(e.newValue));
//     }
//   };
  
//   const handleCustomEvent = () => {
//     callback(getAllProducts());
//   };
  
//   window.addEventListener('storage', handleStorageChange);
//   window.addEventListener('products-updated', handleCustomEvent);
  
//   return () => {
//     window.removeEventListener('storage', handleStorageChange);
//     window.removeEventListener('products-updated', handleCustomEvent);
//   };
// };

// // Manually trigger update event
// export const triggerProductsUpdate = () => {
//   window.dispatchEvent(new Event('products-updated'));
// };


















// // services/productService.js
// import { supabase } from '../lib/supabase/client';

// const enhanceProduct = (product) => {
//   return {
//     ...product,
//     // Add cost field (default to 60% of price if not present)
//     cost: product.cost !== undefined ? product.cost : parseFloat((product.price * 0.6).toFixed(2)),
//     // Add SKU field (generate from name and id if not present)
//     sku: product.sku || `${product.category?.substring(0, 3).toUpperCase() || 'PRD'}-${String(product.id).padStart(3, '0')}`,
//     // Ensure tags is always an array
//     tags: product.tags || []
//   };
// };

// // Helper to transform raw Supabase product (parses JSON fields and adds defaults)
// const transformProduct = (rawProduct) => {
//   let sizes = [];
//   if (rawProduct.sizes) {
//     if (typeof rawProduct.sizes === 'string') {
//       try {
//         sizes = JSON.parse(rawProduct.sizes);
//       } catch {
//         sizes = rawProduct.sizes.split(',').map(s => s.trim());
//       }
//     } else if (Array.isArray(rawProduct.sizes)) {
//       sizes = rawProduct.sizes;
//     }
//   }

//   let availableSizes = {};
//   if (rawProduct.available_Sizes) {
//     if (typeof rawProduct.available_Sizes === 'string') {
//       try {
//         availableSizes = JSON.parse(rawProduct.available_Sizes);
//       } catch (e) {
//         console.warn('Failed to parse available_Sizes for product', rawProduct.id, e);
//       }
//     } else if (typeof rawProduct.available_Sizes === 'object') {
//       availableSizes = rawProduct.available_Sizes;
//     }
//   }

//   // Build the product object with flattened fields
//   const product = {
//     ...rawProduct,
//     stock: rawProduct.stock_quantity,
//     sizes,
//     availableSizes,
//   };

//   // Add default cost, SKU, tags (these may not be in DB, so we compute)
//   return enhanceProduct(product);
// };

// // Get all products
// export const getAllProducts = async () => {
//   const { data, error } = await supabase
//     .from('products')
//     .select('*');
//   if (error) throw error;
//   return (data || []).map(transformProduct);
// };

// // Get product by ID
// export const getProductById = async (id) => {
//   const { data, error } = await supabase
//     .from('products')
//     .select('*')
//     .eq('id', id)
//     .single();
//   if (error) throw error;
//   return data ? transformProduct(data) : null;
// };

// // Add new product
// export const addProduct = async (product) => {
//   // Ensure required fields are present
//   const newProduct = {
//     ...product,
//     id: undefined, // let Supabase generate ID (or keep if you want to set manually)
//     // cost and sku are already set in product (from admin form)
//     // sizes and available_Sizes should already be JSON strings or null
//   };

//   const { data, error } = await supabase
//     .from('products')
//     .insert([newProduct])
//     .select();
//   if (error) throw error;
//   return data[0] ? transformProduct(data[0]) : null;
// };

// // Update product
// export const updateProduct = async (id, updates) => {
//   const { data, error } = await supabase
//     .from('products')
//     .update(updates)
//     .eq('id', id)
//     .select();
//   if (error) throw error;
//   return data[0] ? transformProduct(data[0]) : null;
// };

// // Delete product
// export const deleteProduct = async (id) => {
//   const { error } = await supabase
//     .from('products')
//     .delete()
//     .eq('id', id);
//   if (error) throw error;
//   return id;
// };

// // Update stock (convenience function)
// export const updateStock = async (id, newStock) => {
//   const { data, error } = await supabase
//     .from('products')
//     .update({ stock_quantity: newStock })
//     .eq('id', id)
//     .select();
//   if (error) throw error;
//   return data[0] ? transformProduct(data[0]) : null;
// };

// // Calls the callback whenever products change (insert, update, delete)
// export const subscribeToProducts = (callback) => {
//   // 1. Fetch initial data and call callback
//   getAllProducts().then(callback).catch(console.error);

//   // 2. Set up real‑time subscription
//   const subscription = supabase
//     .channel('products-changes')
//     .on(
//       'postgres_changes',
//       { event: '*', schema: 'public', table: 'products' },
//       async (payload) => {
//         // When any change occurs, fetch the full updated list
//         const { data, error } = await supabase.from('products').select('*');
//         if (!error && data) {
//           callback(data.map(transformProduct));
//         } else {
//           console.error('Error fetching products after change:', error);
//         }
//       }
//     )
//     .subscribe();

//   // Return unsubscribe function
//   return () => {
//     supabase.removeChannel(subscription);
//   };
// };

// // (Optional) If you need to manually trigger an update, you can use the channel
// // but not necessary because the subscription already listens to changes.
















// services/productService.js
import { supabase } from '../lib/supabase/client';

const enhanceProduct = (product) => {
  return {
    ...product,
    cost: product.cost !== undefined ? product.cost : parseFloat((product.price * 0.6).toFixed(2)),
    sku: product.sku || `${product.category?.substring(0, 3).toUpperCase() || 'PRD'}-${String(product.id).padStart(3, '0')}`,
    tags: product.tags || []
  };
};

const transformProduct = (rawProduct) => {
  // Parse sizes array
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

  // Parse available_Sizes – use the actual column name (capital S) first
  let availableSizes = {};
  const availableSizesRaw = rawProduct.available_Sizes !== undefined
    ? rawProduct.available_Sizes
    : rawProduct.available_sizes; // fallback for any accidentally lowercase data

  if (availableSizesRaw) {
    if (typeof availableSizesRaw === 'string') {
      try {
        availableSizes = JSON.parse(availableSizesRaw);
      } catch (e) {
        console.warn('Failed to parse available_Sizes for product', rawProduct.id, e);
      }
    } else if (typeof availableSizesRaw === 'object') {
      availableSizes = availableSizesRaw;
    }
  }

  const product = {
    ...rawProduct,
    stock: rawProduct.stock_quantity,
    sizes,
    availableSizes,
  };
  return enhanceProduct(product);
};

export const getAllProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return (data || []).map(transformProduct);
};

export const getProductById = async (id) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw error;
  return data ? transformProduct(data) : null;
};

export const addProduct = async (product) => {
  // Remove computed fields that should not be stored
  const { cost, sku, tags, stock, availableSizes, ...dbFields } = product;

  const payload = {
    ...dbFields,
    sizes: dbFields.sizes && Array.isArray(dbFields.sizes)
      ? JSON.stringify(dbFields.sizes)
      : null,
    available_Sizes: dbFields.available_Sizes && typeof dbFields.available_Sizes === 'object'
      ? JSON.stringify(dbFields.available_Sizes)
      : null,
  };
  delete payload.id; // let Supabase generate it

  const { data, error } = await supabase.from('products').insert([payload]).select();
  if (error) throw error;
  return data[0] ? transformProduct(data[0]) : null;
};

export const updateProduct = async (id, updates) => {
  const { cost, sku, tags, stock, availableSizes, ...dbUpdates } = updates;

  const payload = {
    ...dbUpdates,
    sizes: dbUpdates.sizes && Array.isArray(dbUpdates.sizes)
      ? JSON.stringify(dbUpdates.sizes)
      : null,
    available_Sizes: dbUpdates.available_Sizes && typeof dbUpdates.available_Sizes === 'object'
      ? JSON.stringify(dbUpdates.available_Sizes)
      : null,
  };

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0] ? transformProduct(data[0]) : null;
};

export const deleteProduct = async (id) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return id;
};

export const updateStock = async (id, newStock) => {
  const { data, error } = await supabase
    .from('products')
    .update({ stock_quantity: newStock })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0] ? transformProduct(data[0]) : null;
};

export const subscribeToProducts = (callback) => {
  getAllProducts().then(callback).catch(console.error);

  const subscription = supabase
    .channel('products-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) callback(data.map(transformProduct));
    })
    .subscribe();

  return () => supabase.removeChannel(subscription);
};












































