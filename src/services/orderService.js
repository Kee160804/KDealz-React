// services/orderService.js
import { supabase } from "../lib/supabase/client";

/**
 * Generate a unique order number
 * Format: ORD-YYYYMMDD-XXXXX (e.g., ORD-20260304-12345)
 */
const generateOrderNumber = () => {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
  const randomNum = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `ORD-${dateStr}-${randomNum}`;
};

/**
 * Calculate order totals (subtotal, tax, shipping)
 * For future extensibility with different tax rates and shipping methods
 */
const calculateOrderTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = 0; // Can be configured based on location/rules
  const shipping = 0; // Will be confirmed later via WhatsApp
  const total = subtotal + tax + shipping;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

/**
 * Transform order data from database
 * Handles parsing JSON fields and formatting dates
 */
const transformOrder = (rawOrder) => {
  return {
    ...rawOrder,
    created_at: new Date(rawOrder.created_at),
    updated_at: new Date(rawOrder.updated_at),
    total_amount: parseFloat(rawOrder.total_amount),
    subtotal_amount: parseFloat(rawOrder.subtotal_amount),
    shipping_cost: parseFloat(rawOrder.shipping_cost),
    tax_amount: parseFloat(rawOrder.tax_amount),
  };
};

/**
 * Create a new order in the database with order items
 *
 * @param {Object} orderData - Order information from checkout form
 * @param {Array} cartItems - Array of cart items with product details
 * @returns {Promise<Object>} - Created order with all details
 * @throws {Error} - If order creation fails
 */
export const createOrder = async (orderData, cartItems) => {
  try {
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty. Cannot create order.");
    }

    // Validate required fields
    if (
      !orderData.name ||
      !orderData.email ||
      !orderData.phone ||
      !orderData.address ||
      !orderData.city ||
      !orderData.zipCode
    ) {
      throw new Error("Missing required customer information.");
    }

    // Calculate totals
    const items = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: parseFloat(item.price),
    }));

    const totals = calculateOrderTotals(items);

    // Prepare order data for database
    const orderPayload = {
      order_number: generateOrderNumber(),
      customer_name: orderData.name.trim(),
      customer_email: orderData.email.trim().toLowerCase(),
      customer_phone: orderData.phone.trim(),
      shipping_address: orderData.address.trim(),
      shipping_city: orderData.city.trim(),
      shipping_zip_code: orderData.zipCode.trim(),
      shipping_country: orderData.country || "Belize",
      subtotal_amount: totals.subtotal,
      tax_amount: totals.tax,
      shipping_cost: totals.shipping,
      total_amount: totals.total,
      payment_method: orderData.paymentMethod || "cod",
      payment_status: "pending",
      order_status: "pending_confirmation",
      notes: orderData.notes ? orderData.notes.trim() : null,
      whatsapp_sent: false,
      whatsapp_conversation_id: null,
    };

    // Insert order
    const { data: orderRecord, error: orderError } = await supabase
      .from("orders")
      .insert([orderPayload])
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    if (!orderRecord) {
      throw new Error("Order was created but no data was returned.");
    }

    // Prepare order items for insertion
    const orderItems = cartItems.map((item) => ({
      order_id: orderRecord.id,
      product_id: item.id,
      quantity: item.quantity,
      price: parseFloat(item.price),
      subtotal: parseFloat((item.price * item.quantity).toFixed(2)),
      size: item.selectedSize || null, // Store size if available
    }));

    // Insert order items
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_item")
      .insert(orderItems)
      .select();

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
      // Note: Order was created but items failed. This is logged but order proceeds
      console.warn("Warning: Order created but items could not be inserted.");
    }

    /* NEW CODE - Reduce stock for each ordered product
    When an order is successfully placed, we need to update the inventory
    by reducing the stock quantity for each product that was ordered.
    
    This is critical for accurate inventory management - it ensures the database
    reflects the actual available stock after orders are placed.
    
    We loop through each order item and reduce the product's stock by the quantity ordered.
    We use the available_Sizes object if the product has sizes, otherwise just reduce
    the main stock_quantity.
    */
    try {
      for (const item of cartItems) {
        const productId = item.id;
        const quantityOrdered = item.quantity;
        const selectedSize = item.selectedSize;

        // Fetch current product to get its stock info
        const { data: currentProduct, error: fetchError } = await supabase
          .from("products")
          .select("stock_quantity, available_Sizes, sizes")
          .eq("id", productId)
          .single();

        if (fetchError) {
          console.warn(`⚠️ Could not fetch product ${productId} for stock update:`, fetchError);
          continue;
        }

        let updatedStock = {};

        if (selectedSize && currentProduct.available_Sizes) {
          // Product has sizes - update the specific size's stock
          try {
            const availableSizes = typeof currentProduct.available_Sizes === 'string' 
              ? JSON.parse(currentProduct.available_Sizes) 
              : currentProduct.available_Sizes;
            
            const currentSizeStock = availableSizes[selectedSize] || 0;
            const newSizeStock = Math.max(0, currentSizeStock - quantityOrdered);
            
            updatedStock = {
              ...availableSizes,
              [selectedSize]: newSizeStock,
            };
          } catch (parseError) {
            console.warn(`⚠️ Error parsing available_Sizes for product ${productId}:`, parseError);
            updatedStock = currentProduct.available_Sizes;
          }
        }

        // Update the product stock in the database
        const updatePayload = selectedSize && Object.keys(updatedStock).length > 0
          ? {
              available_Sizes: JSON.stringify(updatedStock),
              stock_quantity: Math.max(0, (currentProduct.stock_quantity || 0) - quantityOrdered),
            }
          : {
              stock_quantity: Math.max(0, (currentProduct.stock_quantity || 0) - quantityOrdered),
            };

        const { error: updateError } = await supabase
          .from("products")
          .update(updatePayload)
          .eq("id", productId);

        if (updateError) {
          console.warn(`⚠️ Failed to update stock for product ${productId}:`, updateError);
        } else {
          console.log(`✅ Stock reduced for product ${productId}: ${quantityOrdered} units removed`);
        }
      }
    } catch (stockError) {
      console.error("Error reducing stock after order creation:", stockError);
      // Don't throw here - order was successfully created, just log the warning
      console.warn("Order created successfully but stock reduction encountered an error");
    }

    // Return complete order with items
    return {
      ...transformOrder(orderRecord),
      items: itemsData || orderItems,
    };
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
};

/**
 * Get all orders for admin dashboard
 * @returns {Promise<Array>} - Array of all orders with items and product details
 */
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch all order items
    const orders = data || [];
    console.log(`📦 Fetched ${orders.length} orders from database`);
    
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_item")
          .select("*")
          .eq("order_id", order.id);

        if (itemsError) {
          console.warn(`⚠️ Error fetching items for order ${order.id}:`, itemsError);
        }
        
        console.log(`📋 Order ${order.id}: Found ${itemsData?.length || 0} items`);

        // Fetch product details for each item to display name, size, etc.
        const enrichedItems = await Promise.all(
          (itemsData || []).map(async (item) => {
            try {
              const { data: product, error: productError } = await supabase
                .from("products")
                .select("name, price, sizes, available_Sizes")
                .eq("id", item.product_id)
                .single();

              if (productError) {
                console.warn(`⚠️ Product ${item.product_id} not found:`, productError);
              } else {
                console.log(`✅ Found product: ${product?.name} (ID: ${item.product_id})`);
              }

              return {
                productId: item.product_id,
                name: product?.name || "Unknown Product",
                quantity: item.quantity,
                price: item.price ? parseFloat(item.price) : 0,
                subtotal: item.subtotal ? parseFloat(item.subtotal) : 0,
                size: item.size || null, // If size was stored in order_item
                sizes: product?.sizes || null,
                available_Sizes: product?.available_Sizes || null,
              };
            } catch (err) {
              console.error(`❌ Error enriching item ${item.product_id}:`, err);
              return {
                productId: item.product_id,
                name: "Unknown Product",
                quantity: item.quantity,
                price: item.price ? parseFloat(item.price) : 0,
                subtotal: item.subtotal ? parseFloat(item.subtotal) : 0,
                size: item.size || null,
              };
            }
          }),
        );

        // Ensure items is always an array
        const itemsArray = Array.isArray(enrichedItems) ? enrichedItems : [];
        
        const enrichedOrder = {
          ...transformOrder(order),
          items: itemsArray,
          // Add compatibility fields for AdminDashboard
          id: order.id,
          customer: order.customer_name,
          email: order.customer_email,
          date: order.created_at,
          total: parseFloat(order.total_amount),
          status: order.order_status,
          paymentMethod:
            order.payment_method === "cod"
              ? "Cash on Delivery"
              : order.payment_method,
          shippingAddress: `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_zip_code}`,
        };
        
        console.log(`✅ Order ${order.id} enriched with ${itemsArray.length} items`, { items: itemsArray, order: enrichedOrder });
        return enrichedOrder;
      }),
    );

    console.log(`✅ All orders enriched. Total: ${enrichedOrders.length} orders`);
    return enrichedOrders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

/**
 * Get order by ID with its items
 * @param {number} orderId - The order ID
 * @returns {Promise<Object>} - Order with all items
 */
export const getOrderById = async (orderId) => {
  try {
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) throw orderError;
    if (!orderData) return null;

    const { data: itemsData, error: itemsError } = await supabase
      .from("order_item")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError) console.warn("Error fetching order items:", itemsError);

    return {
      ...transformOrder(orderData),
      items: itemsData || [],
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

/**
 * Update order status
 * Statuses: pending_confirmation, confirmed, processing, shipped, completed, cancelled
 *
 * @param {number} orderId - The order ID
 * @param {string} newStatus - New order status
 * @returns {Promise<Object>} - Updated order
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const validStatuses = [
      "pending_confirmation",
      "confirmed",
      "processing",
      "shipped",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        order_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return transformOrder(data);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

/**
 * Update payment status
 * Statuses: pending, completed, failed, refunded
 *
 * @param {number} orderId - The order ID
 * @param {string} paymentStatus - New payment status
 * @returns {Promise<Object>} - Updated order
 */
export const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const validStatuses = ["pending_confirmation", "completed", "failed", "refunded"];

    if (!validStatuses.includes(paymentStatus)) {
      throw new Error(
        `Invalid payment status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return transformOrder(data);
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

/**
 * Mark order as WhatsApp message sent
 * @param {number} orderId - The order ID
 * @param {string} conversationId - WhatsApp conversation ID (optional)
 * @returns {Promise<Object>} - Updated order
 */
export const markWhatsAppSent = async (orderId, conversationId = null) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        whatsapp_sent: true,
        whatsapp_conversation_id: conversationId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return transformOrder(data);
  } catch (error) {
    console.error("Error marking WhatsApp sent:", error);
    throw error;
  }
};

/**
 * Subscribe to order changes (real-time updates)
 * @param {Function} callback - Callback function when orders change
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToOrders = (callback) => {
  // Fetch initial data
  getAllOrders().then(callback).catch(console.error);

  // Set up real-time subscription
  const subscription = supabase
    .channel("orders-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      async () => {
        try {
          const orders = await getAllOrders();
          callback(orders);
        } catch (error) {
          console.error("Error fetching updated orders:", error);
        }
      },
    )
    .subscribe();

  return () => supabase.removeChannel(subscription);
};

/**
 * Get orders by customer email
 * @param {string} email - Customer email
 * @returns {Promise<Array>} - Array of orders for customer
 */
export const getOrdersByCustomerEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", email.toLowerCase())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(transformOrder);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw error;
  }
};

/**
 * Delete an order and all its associated items
 * @param {number} orderId - The order ID to delete
 * @returns {Promise<void>}
 */
export const deleteOrder = async (orderId) => {
  try {
    console.log(`🗑️ Deleting order ${orderId}...`);

    // First delete all order items
    const { error: itemsError } = await supabase
      .from("order_item")
      .delete()
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Error deleting order items:", itemsError);
      throw new Error(`Failed to delete order items: ${itemsError.message}`);
    }

    // Then delete the order itself
    const { error: orderError } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (orderError) {
      console.error("Error deleting order:", orderError);
      throw new Error(`Failed to delete order: ${orderError.message}`);
    }

    console.log(`✅ Order ${orderId} and all its items deleted successfully`);
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    throw error;
  }
};
