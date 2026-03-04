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
 * @returns {Promise<Array>} - Array of all orders with items
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
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const { data: itemsData } = await supabase
          .from("order_item")
          .select("*")
          .eq("order_id", order.id);

        return {
          ...transformOrder(order),
          items: (itemsData || []).map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: parseFloat(item.price),
            subtotal: parseFloat(item.subtotal),
          })),
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
      }),
    );

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
    const validStatuses = ["pending", "completed", "failed", "refunded"];

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
