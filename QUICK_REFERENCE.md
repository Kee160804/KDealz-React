# 🎯 QUICK REFERENCE CARD

## File Locations

| File                             | Purpose                  | Lines    |
| -------------------------------- | ------------------------ | -------- |
| `src/services/orderService.js`   | Order backend service    | 290      |
| `src/pages/CheckoutPage.jsx`     | Enhanced checkout form   | 836      |
| `src/pages/OrderDetailsPage.jsx` | Order viewing/admin page | 385      |
| `src/styles/OrderDetails.css`    | Order details styling    | 650      |
| `src/App.jsx`                    | Updated with order route | Modified |

---

## Import Examples

### In React Components

```javascript
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
} from "../services/orderService";
import OrderDetailsPage from "../pages/OrderDetailsPage";
```

### Service Functions

```javascript
// Create order
const order = await createOrder(formData, cartItems);

// Get order
const order = await getOrderById(orderId);

// Update status
const updated = await updateOrderStatus(orderId, "confirmed");

// Get all orders (admin)
const orders = await getAllOrders();
```

---

## URL Routes

| Route             | Component        | Purpose           |
| ----------------- | ---------------- | ----------------- |
| `/checkout`       | CheckoutPage     | Checkout form     |
| `/order/:orderId` | OrderDetailsPage | View/manage order |

---

## Database Queries

### Get Orders by Status

```sql
SELECT * FROM orders
WHERE order_status = 'pending_confirmation'
ORDER BY created_at DESC;
```

### Get Customer's Orders

```sql
SELECT * FROM orders
WHERE customer_email = 'customer@example.com'
ORDER BY created_at DESC;
```

### Get Orders with Items

```sql
SELECT o.*, oi.* FROM orders o
LEFT JOIN order_item oi ON o.id = oi.order_id
WHERE o.id = 1;
```

---

## Order Status Values

| Status                 | Meaning            | Next       |
| ---------------------- | ------------------ | ---------- |
| `pending_confirmation` | Initial (default)  | confirmed  |
| `confirmed`            | Customer confirmed | processing |
| `processing`           | Being prepared     | shipped    |
| `shipped`              | Dispatched         | completed  |
| `completed`            | Delivered          | (end)      |
| `cancelled`            | Cancelled          | (end)      |

---

## Payment Status Values

| Status      | Meaning                    |
| ----------- | -------------------------- |
| `pending`   | Awaiting payment (default) |
| `completed` | Payment received           |
| `failed`    | Payment declined           |
| `refunded`  | Refund issued              |

---

## Form Validation Rules

| Field    | Required | Rules              |
| -------- | -------- | ------------------ |
| Name     | Yes      | Min 2 chars        |
| Email    | Yes      | Valid email format |
| Phone    | Yes      | Valid phone format |
| Address  | Yes      | Min 5 chars        |
| City     | Yes      | Any value          |
| ZIP Code | Yes      | Any value          |
| Notes    | No       | Optional           |

---

## WhatsApp Integration

### WhatsApp Number

```javascript
const WHATSAPP_NUMBER = "6111904"; // In CheckoutPage.jsx
```

### WhatsApp URL Format

```
https://wa.me/PHONENUMBER?text=MESSAGE
```

### Message Contents

- Order number
- Date & time
- Customer name & email & phone
- Complete order items with prices
- Order total
- Next steps
- Contact info

---

## Error Messages

| Error                     | Solution                      |
| ------------------------- | ----------------------------- |
| "Cart is empty"           | Add products before checkout  |
| "Missing required fields" | Fill all required form fields |
| "Invalid email"           | Use format: user@domain.com   |
| "Invalid phone"           | Use only numbers and symbols  |
| "Network error"           | Check internet connection     |
| "Order creation failed"   | Check database connection     |

---

## Common Functions

### Create Order

```javascript
try {
  const order = await createOrder(
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "+501 601-1234",
      address: "123 Main St",
      city: "Belize City",
      zipCode: "12345",
      paymentMethod: "cod",
      notes: "Optional note",
    },
    cartItems,
  );

  console.log("Order created:", order.order_number);
} catch (error) {
  console.error("Failed:", error.message);
}
```

### Get Order

```javascript
try {
  const order = await getOrderById(1);
  console.log("Customer:", order.customer_name);
  console.log("Status:", order.order_status);
  console.log("Items:", order.items.length);
} catch (error) {
  console.error("Failed:", error.message);
}
```

### Update Status

```javascript
try {
  const updated = await updateOrderStatus(1, "confirmed");
  console.log("New status:", updated.order_status);
} catch (error) {
  console.error("Failed:", error.message);
}
```

---

## Component Props

### CheckoutPage

```jsx
<CheckoutPage
  cart={cartArray}
  getCartTotal={function}
  clearCart={function}
/>
```

### OrderDetailsPage

```jsx
// Uses URL param: /order/:orderId
// No props needed
<OrderDetailsPage />
```

---

## Key Data Structures

### Order Object

```javascript
{
  id: 1,
  order_number: "ORD-20260304-12345",
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+501 601-1234",
  shipping_address: "123 Main St",
  shipping_city: "Belize City",
  shipping_zip_code: "12345",
  subtotal_amount: 99.99,
  tax_amount: 0,
  shipping_cost: 0,
  total_amount: 99.99,
  payment_method: "cod",
  payment_status: "pending",
  order_status: "pending_confirmation",
  notes: "Delivery note",
  whatsapp_sent: true,
  created_at: "2026-03-04T15:30:00Z",
  updated_at: "2026-03-04T15:30:00Z",
  items: [/* order_item records */]
}
```

### Cart Item Object

```javascript
{
  id: 5,
  name: "Product Name",
  price: 49.99,
  quantity: 2,
  image: "image-url",
  selectedSize: "M" // optional
}
```

---

## Styling Classes

### Error Alert

```html
<div class="error-alert">
  <span class="error-icon">❌</span>
  <p>Error message</p>
</div>
```

### Status Badge

```html
<span class="status-badge" style="color: #667eea"> ✅ Confirmed </span>
```

### Order Card

```html
<div class="info-card">
  <h2>📦 Order Items</h2>
  <!-- Content -->
</div>
```

---

## Troubleshooting Quick Fixes

### Orders not saving

1. Check Supabase connection
2. Verify table names (case-sensitive)
3. Check RLS policies
4. View error in browser console

### WhatsApp not opening

1. Verify WhatsApp number is correct
2. Try different browser
3. Check pop-up blocker
4. Test URL: `https://wa.me/6111904`

### Order details not loading

1. Check order ID in URL
2. Verify order exists in database
3. Check network tab for API errors
4. Check Supabase connection

### Form validation not working

1. Open browser console
2. Check error messages
3. Verify field names match
4. Clear browser cache

---

## CSS Customization

### Main Colors

```css
Primary: #667eea (purple)
Secondary: #764ba2 (dark purple)
Success: #4CAF50 (green)
Warning: #FFA500 (orange)
Error: #F44336 (red)
```

### Breakpoints

```css
Mobile: max-width: 768px
Tablet: 768px - 1024px
Desktop: 1024px+
```

### Key Classes

```css
.order-details-page     /* Main container */
.order-container        /* Inner wrapper */
.info-card              /* Content cards */
.status-badge           /* Status indicators */
.error-alert            /* Error messages */
.admin-section          /* Admin controls */
```

---

## Environment Setup

### Required Supabase Tables

- `orders`
- `order_item`
- `products` (existing)

### Optional Configuration

- WhatsApp number in CheckoutPage.jsx
- Email service (if adding notifications)
- Payment gateway credentials (future)

### No API Keys Needed

- Service uses existing Supabase client
- Reuses your existing `lib/supabase/client.ts`

---

## Performance Tips

1. **Lazy load order details** - Already implemented
2. **Optimize images** - Already handled
3. **Cache orders** - Can add if needed
4. **Paginate order lists** - Recommended for admin
5. **Index database fields** - See DATABASE_SCHEMA.md

---

## Security Notes

✅ **Implemented:**

- Form validation
- Error messages don't expose DB details
- No hardcoded secrets
- Proper error handling

📋 **Recommended:**

- Add auth for admin page
- Implement rate limiting
- Add CSRF protection
- Regular security audits

---

## Next Actions

1. **Test** - Use QUICK_START.md testing guide
2. **Configure** - Update WhatsApp number
3. **Deploy** - Push to production
4. **Monitor** - Check order logs
5. **Iterate** - Add features as needed

---

## Need Help?

1. Check **QUICK_START.md** - Testing guide
2. See **DATABASE_SCHEMA.md** - DB reference
3. Read **CHECKOUT_IMPLEMENTATION.md** - Technical docs
4. Review **code comments** - Inline documentation
5. Check **browser console** - Error details

---

**Everything you need is documented and ready to go!** 🚀
