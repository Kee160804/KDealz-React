import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../services/orderService";
import "../styles/OrderDetails.css";

/**
 * OrderDetailsPage Component
 * Displays complete order information with items and status tracking
 * Admin-accessible order management functionality
 */
const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!orderId) {
          throw new Error("No order ID provided");
        }

        const orderData = await getOrderById(parseInt(orderId));

        if (!orderData) {
          throw new Error("Order not found");
        }

        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const updatedOrder = await updateOrderStatus(
        parseInt(orderId),
        newStatus,
      );
      setOrder(updatedOrder);
      alert(`✅ Order status updated to "${newStatus}"`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert(`❌ Failed to update order status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    // Confirm before cancelling
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to cancel this order? Stock will be restored automatically.",
    );

    if (!confirmed) return;

    try {
      setUpdating(true);
      const updatedOrder = await cancelOrder(parseInt(orderId));
      setOrder(updatedOrder);
      alert(
        "✅ Order cancelled successfully! Stock has been restored for all items.",
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert(`❌ Failed to cancel order: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate(-1);
  };

  // ─── Render States ──────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-page">
        <div className="order-container">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h2>Unable to Load Order</h2>
            <p>{error}</p>
            <button onClick={handleBack} className="btn btn-primary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="order-container">
          <div className="error-container">
            <div className="error-icon">📋</div>
            <h2>Order Not Found</h2>
            <p>
              The order you're looking for doesn't exist or has been deleted.
            </p>
            <button onClick={handleBack} className="btn btn-primary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="order-container">
        {/* Header */}
        <div className="order-header">
          <button onClick={handleBack} className="back-button">
            ← Back
          </button>
          <h1>Order Details</h1>
          <button onClick={handlePrint} className="print-button">
            🖨️ Print
          </button>
        </div>

        {/* Order Summary Card */}
        <div className="order-summary">
          <div className="summary-left">
            <div className="summary-item">
              <span className="label">Order Number</span>
              <span className="value">{order.order_number}</span>
            </div>
            <div className="summary-item">
              <span className="label">Order Date</span>
              <span className="value">
                {new Date(order.created_at).toLocaleDateString()} at{" "}
                {new Date(order.created_at).toLocaleTimeString()}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Order Status</span>
              <OrderStatusBadge status={order.order_status} />
            </div>
          </div>

          <div className="summary-right">
            <div className="summary-item">
              <span className="label">Payment Status</span>
              <PaymentStatusBadge status={order.payment_status} />
            </div>
            <div className="summary-item">
              <span className="label">Payment Method</span>
              <span className="value">
                {formatPaymentMethod(order.payment_method)}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">WhatsApp Notified</span>
              <span className="value">
                {order.whatsapp_sent ? "✅ Yes" : "❌ No"}
              </span>
            </div>
          </div>
        </div>

        <div className="order-content">
          {/* Customer Information */}
          <div className="info-card">
            <h2>👤 Customer Information</h2>
            <div className="info-grid">
              <InfoItem label="Name" value={order.customer_name} />
              <InfoItem label="Email" value={order.customer_email} />
              <InfoItem label="Phone" value={order.customer_phone} />
              <InfoItem label="Country" value={order.shipping_country} />
            </div>
            <div className="info-full-width">
              <InfoItem
                label="Shipping Address"
                value={`${order.shipping_address}, ${order.shipping_city}, ${order.shipping_zip_code}`}
              />
            </div>
            {order.notes && (
              <div className="info-full-width">
                <InfoItem label="Customer Notes" value={order.notes} />
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="info-card">
            <h2>📦 Order Items</h2>
            <div className="items-table">
              <div className="table-header">
                <div className="col-product">Product</div>
                <div className="col-quantity">Quantity</div>
                <div className="col-price">Price</div>
                <div className="col-subtotal">Subtotal</div>
              </div>
              <div className="table-body">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="table-row">
                      <div className="col-product">
                        {/* OLD CODE - Previously showed only Product ID
                        <span>Product ID: {item.product_id}</span>
                        */}
                        {/* NEW CODE - Now displays product name from the enriched items data
                        This shows the actual product name that was fetched from the database
                        which provides better UX for customers viewing their orders */}
                        <span>
                          {item.name || `Product ID: ${item.product_id}`}
                        </span>
                        {/* If a size was selected, display it under the product name */}
                        {item.size && (
                          <div
                            style={{
                              fontSize: "0.85em",
                              color: "#666",
                              marginTop: "4px",
                            }}
                          >
                            Size: {item.size}
                          </div>
                        )}
                      </div>
                      <div className="col-quantity">{item.quantity}</div>
                      <div className="col-price">
                        ${parseFloat(item.price).toFixed(2)}
                      </div>
                      <div className="col-subtotal">
                        ${parseFloat(item.subtotal).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="table-row">
                    <div className="col-product">No items found</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Totals */}
          <div className="info-card">
            <h2>💰 Order Summary</h2>
            <div className="totals-section">
              <div className="total-row">
                <span className="label">Subtotal</span>
                <span className="value">
                  ${parseFloat(order.subtotal_amount).toFixed(2)}
                </span>
              </div>
              <div className="total-row">
                <span className="label">Tax</span>
                <span className="value">
                  ${parseFloat(order.tax_amount).toFixed(2)}
                </span>
              </div>
              <div className="total-row">
                <span className="label">Shipping</span>
                <span className="value">
                  ${parseFloat(order.shipping_cost).toFixed(2)}
                </span>
              </div>
              <div className="total-row grand-total">
                <span className="label">Total Amount</span>
                <span className="value">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="order-actions">
          <button onClick={handleBack} className="btn btn-secondary">
            ← Back
          </button>
          <button onClick={handlePrint} className="btn btn-primary">
            🖨️ Print Order
          </button>
          {order.order_status !== "cancelled" && (
            <button
              onClick={handleCancel}
              className="btn btn-danger"
              disabled={updating}
            >
              ❌ Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * Order Status Badge
 */
const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending_confirmation: {
      color: "#FFA500",
      label: "Pending Confirmation",
      emoji: "⏳",
    },
    confirmed: { color: "#4CAF50", label: "Confirmed", emoji: "✅" },
    processing: { color: "#2196F3", label: "Processing", emoji: "⚙️" },
    shipped: { color: "#9C27B0", label: "Shipped", emoji: "📦" },
    completed: { color: "#4CAF50", label: "Completed", emoji: "🎉" },
    cancelled: { color: "#F44336", label: "Cancelled", emoji: "❌" },
  };

  const config = statusConfig[status] || {
    color: "#999",
    label: status,
    emoji: "❓",
  };

  return (
    <span
      className="status-badge"
      style={{ borderColor: config.color, color: config.color }}
    >
      {config.emoji} {config.label}
    </span>
  );
};

/**
 * Payment Status Badge
 */
const PaymentStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "#FFA500", label: "Pending Payment", emoji: "⏳" },
    completed: { color: "#4CAF50", label: "Paid", emoji: "✅" },
    failed: { color: "#F44336", label: "Failed", emoji: "❌" },
    refunded: { color: "#FF9800", label: "Refunded", emoji: "💰" },
  };

  const config = statusConfig[status] || {
    color: "#999",
    label: status,
    emoji: "❓",
  };

  return (
    <span
      className="status-badge"
      style={{ borderColor: config.color, color: config.color }}
    >
      {config.emoji} {config.label}
    </span>
  );
};

/**
 * Info Item Component
 */
const InfoItem = ({ label, value }) => (
  <div className="info-item">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

/**
 * Format payment method for display
 */
const formatPaymentMethod = (method) => {
  const methods = {
    cod: "Cash on Delivery",
    bank: "Bank Transfer",
    card: "Credit Card",
    paypal: "PayPal",
  };
  return methods[method] || method;
};

/**
 * Format status label
 */
const formatStatusLabel = (status) => {
  const labels = {
    pending_confirmation: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    completed: "Complete",
    cancelled: "Cancel",
  };
  return labels[status] || status;
};

export default OrderDetailsPage;
