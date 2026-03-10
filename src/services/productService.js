// services/productService.js
import { supabase } from "../lib/supabase/client";

const enhanceProduct = (product) => {
  return {
    ...product,
    cost:
      product.cost !== undefined
        ? product.cost
        : parseFloat((product.price * 0.6).toFixed(2)),
    sku:
      product.sku ||
      `${product.category?.substring(0, 3).toUpperCase() || "PRD"}-${String(product.id).padStart(3, "0")}`,
    tags: product.tags || [],
  };
};

const transformProduct = (rawProduct) => {
  // Parse sizes array
  let sizes = [];
  if (rawProduct.sizes) {
    if (typeof rawProduct.sizes === "string") {
      try {
        sizes = JSON.parse(rawProduct.sizes);
      } catch {
        sizes = rawProduct.sizes.split(",").map((s) => s.trim());
      }
    } else if (Array.isArray(rawProduct.sizes)) {
      sizes = rawProduct.sizes;
    }
  }

  // Parse available_Sizes – use the actual column name (capital S) first
  let availableSizes = {};
  const availableSizesRaw =
    rawProduct.available_Sizes !== undefined
      ? rawProduct.available_Sizes
      : rawProduct.available_sizes; // fallback for any accidentally lowercase data

  if (availableSizesRaw) {
    if (typeof availableSizesRaw === "string") {
      try {
        availableSizes = JSON.parse(availableSizesRaw);
      } catch (e) {
        console.warn(
          "Failed to parse available_Sizes for product",
          rawProduct.id,
          e,
        );
      }
    } else if (typeof availableSizesRaw === "object") {
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
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return (data || []).map(transformProduct);
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ? transformProduct(data) : null;
};

export const addProduct = async (product) => {
  // Remove computed fields that should not be stored, but KEEP cost
  const { sku, tags, stock, availableSizes, ...dbFields } = product;

  const payload = {
    ...dbFields,
    cost: product.cost !== undefined ? product.cost : null, // Ensure cost is included
    sizes:
      typeof dbFields.sizes === "string"
        ? dbFields.sizes
        : Array.isArray(dbFields.sizes)
          ? JSON.stringify(dbFields.sizes)
          : null,
    available_Sizes:
      typeof dbFields.available_Sizes === "string"
        ? dbFields.available_Sizes
        : dbFields.available_Sizes &&
            typeof dbFields.available_Sizes === "object" &&
            !Array.isArray(dbFields.available_Sizes)
          ? JSON.stringify(dbFields.available_Sizes)
          : null,
    /* NEW CODE - Added automatic timestamp tracking
    When a new product is created, we need to record the creation timestamp.
    This helps admins track when products were added to the system for auditing purposes.
    The created_at field is automatically set to the current UTC timestamp.
    */
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  delete payload.id; // let Supabase generate it

  const { data, error } = await supabase
    .from("products")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0] ? transformProduct(data[0]) : null;
};

export const updateProduct = async (id, updates) => {
  const { sku, tags, stock, availableSizes, ...dbUpdates } = updates;

  const payload = {
    ...dbUpdates,
    cost: updates.cost !== undefined ? updates.cost : dbUpdates.cost, // Ensure cost is included
    sizes:
      typeof dbUpdates.sizes === "string"
        ? dbUpdates.sizes
        : Array.isArray(dbUpdates.sizes)
          ? JSON.stringify(dbUpdates.sizes)
          : null,
    available_Sizes:
      typeof dbUpdates.available_Sizes === "string"
        ? dbUpdates.available_Sizes
        : dbUpdates.available_Sizes &&
            typeof dbUpdates.available_Sizes === "object" &&
            !Array.isArray(dbUpdates.available_Sizes)
          ? JSON.stringify(dbUpdates.available_Sizes)
          : null,
    /* NEW CODE - Update the updated_at timestamp whenever a product is modified
    This tracks when the product information was last changed, useful for auditing
    and understanding which products were recently modified.
    */
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0] ? transformProduct(data[0]) : null;
};

export const deleteProduct = async (id) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return id;
};

export const updateStock = async (id, newStock) => {
  const { data, error } = await supabase
    .from("products")
    .update({ stock_quantity: newStock })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0] ? transformProduct(data[0]) : null;
};

export const subscribeToProducts = (callback) => {
  getAllProducts().then(callback).catch(console.error);

  const subscription = supabase
    .channel("products-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      async () => {
        const { data, error } = await supabase.from("products").select("*");
        if (!error && data) callback(data.map(transformProduct));
      },
    )
    .subscribe();

  return () => supabase.removeChannel(subscription);
};

/* NEW CODE - Subscribe to real-time stock changes for a specific product
This function sets up a real-time listener that watches for any changes
to a specific product's stock_quantity or available_Sizes.

When stock is reduced due to orders, the UI will update immediately
without requiring a page refresh. This is critical for preventing overselling
when multiple customers are shopping simultaneously.

@param {number} productId - The ID of the product to watch
@param {Function} callback - Function called with updated product data
@returns {Function} - Unsubscribe function to stop listening
*/
export const subscribeToProductStock = (productId, callback) => {
  try {
    // First, fetch the current product data
    getProductById(productId).then(callback).catch(console.error);

    // Set up real-time subscription for this specific product
    const subscription = supabase
      .channel(`product-stock-${productId}`)
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", // Only listen to updates (not inserts/deletes)
          schema: "public", 
          table: "products",
          filter: `id=eq.${productId}` // Only for this specific product
        },
        async (payload) => {
          // When stock changes, fetch and pass the updated product
          const updatedProduct = await getProductById(productId);
          if (updatedProduct) {
            callback(updatedProduct);
            console.log(`📊 Real-time stock update for product ${productId}:`, updatedProduct.stock_quantity);
          }
        },
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(subscription);
      console.log(`Unsubscribed from stock updates for product ${productId}`);
    };
  } catch (error) {
    console.error("Error setting up product stock subscription:", error);
    return () => {}; // Return dummy unsubscribe function
  }
};

