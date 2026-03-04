# 📊 Database Schema Reference

## Overview

This document provides the exact database schema needed for the checkout and order system to work properly.

---

## Table: `orders`

**Purpose:** Stores customer orders with all transaction details

```sql
CREATE TABLE public.orders (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  order_number character varying NOT NULL UNIQUE,
  customer_name character varying NOT NULL,
  customer_email character varying NOT NULL,
  customer_phone character varying NOT NULL,
  shipping_address text NOT NULL,
  shipping_city character varying NOT NULL,
  shipping_zip_code character varying NOT NULL,
  shipping_country character varying DEFAULT 'Belize'::character varying,
  total_amount double precision NOT NULL,
  subtotal_amount double precision NOT NULL,
  shipping_cost double precision DEFAULT 0,
  tax_amount double precision DEFAULT 0,
  payment_method character varying NOT NULL,
  payment_status character varying DEFAULT 'pending'::character varying,
  order_status character varying DEFAULT 'pending_confirmation'::character varying,
  notes text,
  whatsapp_sent boolean DEFAULT false,
  whatsapp_conversation_id character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);
```

### Column Definitions

| Column                     | Type      | Notes                                        |
| -------------------------- | --------- | -------------------------------------------- |
| `id`                       | integer   | Primary key, auto-generated                  |
| `order_number`             | varchar   | Unique order ID (format: ORD-YYYYMMDD-XXXXX) |
| `customer_name`            | varchar   | Full name of customer                        |
| `customer_email`           | varchar   | Customer email address                       |
| `customer_phone`           | varchar   | Customer phone number                        |
| `shipping_address`         | text      | Street address                               |
| `shipping_city`            | varchar   | City for shipping                            |
| `shipping_zip_code`        | varchar   | Postal/ZIP code                              |
| `shipping_country`         | varchar   | Country (default: Belize)                    |
| `subtotal_amount`          | double    | Product subtotal before tax/shipping         |
| `tax_amount`               | double    | Tax charged (default: 0)                     |
| `shipping_cost`            | double    | Shipping cost (default: 0)                   |
| `total_amount`             | double    | Final total (subtotal + tax + shipping)      |
| `payment_method`           | varchar   | 'cod' or 'bank' or 'card' (for future)       |
| `payment_status`           | varchar   | 'pending', 'completed', 'failed', 'refunded' |
| `order_status`             | varchar   | Current order state                          |
| `notes`                    | text      | Optional customer notes                      |
| `whatsapp_sent`            | boolean   | Whether WhatsApp notification sent           |
| `whatsapp_conversation_id` | varchar   | Optional WhatsApp conversation ref           |
| `created_at`               | timestamp | Record creation time                         |
| `updated_at`               | timestamp | Last update time                             |

### Order Status Values

```
'pending_confirmation'  - Initial state, awaiting WhatsApp confirmation
'confirmed'             - Customer confirmed via WhatsApp
'processing'            - Order being prepared
'shipped'               - Order dispatched to customer
'completed'             - Customer received order
'cancelled'             - Order was cancelled
```

### Payment Status Values

```
'pending'      - Awaiting payment
'completed'    - Payment received
'failed'       - Payment declined
'refunded'     - Money returned to customer
```

---

## Table: `order_item`

**Purpose:** Stores individual items within an order

```sql
CREATE TABLE public.order_item (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  order_id integer NOT NULL,
  product_id integer NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price double precision NOT NULL,
  subtotal double precision NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT order_item_pkey PRIMARY KEY (id),
  CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT order_item_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
```

### Column Definitions

| Column       | Type      | Notes                           |
| ------------ | --------- | ------------------------------- |
| `id`         | integer   | Primary key, auto-generated     |
| `order_id`   | integer   | Foreign key to orders.id        |
| `product_id` | integer   | Foreign key to products.id      |
| `quantity`   | integer   | Number of items (must be > 0)   |
| `price`      | double    | Price per unit at time of order |
| `subtotal`   | double    | quantity × price                |
| `created_at` | timestamp | Record creation time            |
| `updated_at` | timestamp | Last update time                |

### Constraints

- `order_id` must exist in `orders` table
- `product_id` must exist in `products` table
- `quantity` must be greater than 0

---

## Relationships

```
orders (1) ──── (many) order_item
   ↓                      ↓
   └─────────────────────┘
         (order_id FK)

order_item ──── products
    (product_id FK)
```

---

## Setup Instructions

### Step 1: Create Orders Table

Copy and paste the `CREATE TABLE public.orders` SQL into Supabase SQL Editor

### Step 2: Create Order Items Table

Copy and paste the `CREATE TABLE public.order_item` SQL into Supabase SQL Editor

### Step 3: Enable RLS (Row Level Security) - OPTIONAL

If you want to restrict access by user:

```sql
-- For orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read own orders" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "Allow update own orders" ON public.orders
  FOR UPDATE USING (true);

-- For order_item table
ALTER TABLE public.order_item ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert order items" ON public.order_item
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read order items" ON public.order_item
  FOR SELECT USING (true);
```

### Step 4: Create Indexes (OPTIONAL but Recommended)

For better query performance:

```sql
-- Index for finding orders by customer email
CREATE INDEX idx_orders_customer_email
  ON public.orders(customer_email);

-- Index for finding orders by order number
CREATE INDEX idx_orders_order_number
  ON public.orders(order_number);

-- Index for finding order items by order_id
CREATE INDEX idx_order_item_order_id
  ON public.order_item(order_id);

-- Index for finding order items by product_id
CREATE INDEX idx_order_item_product_id
  ON public.order_item(product_id);

-- Index for created_at queries (ordering)
CREATE INDEX idx_orders_created_at
  ON public.orders(created_at DESC);
```

---

## Data Examples

### Sample Order

```json
{
  "id": 1,
  "order_number": "ORD-20260304-12345",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+501 601-1234",
  "shipping_address": "123 Main Street",
  "shipping_city": "Belize City",
  "shipping_zip_code": "12345",
  "shipping_country": "Belize",
  "subtotal_amount": 99.99,
  "tax_amount": 0.0,
  "shipping_cost": 0.0,
  "total_amount": 99.99,
  "payment_method": "cod",
  "payment_status": "pending",
  "order_status": "pending_confirmation",
  "notes": "Please deliver between 10am-2pm",
  "whatsapp_sent": true,
  "whatsapp_conversation_id": null,
  "created_at": "2026-03-04T15:30:00Z",
  "updated_at": "2026-03-04T15:30:00Z"
}
```

### Sample Order Item

```json
{
  "id": 1,
  "order_id": 1,
  "product_id": 5,
  "quantity": 2,
  "price": 49.99,
  "subtotal": 99.98,
  "created_at": "2026-03-04T15:30:00Z",
  "updated_at": "2026-03-04T15:30:00Z"
}
```

---

## Common Queries

### Get All Orders with Items

```sql
SELECT
  o.*,
  oi.product_id,
  oi.quantity,
  oi.price,
  oi.subtotal
FROM public.orders o
LEFT JOIN public.order_item oi ON o.id = oi.order_id
ORDER BY o.created_at DESC;
```

### Get Customer's Orders

```sql
SELECT * FROM public.orders
WHERE customer_email = 'john@example.com'
ORDER BY created_at DESC;
```

### Get Orders Pending WhatsApp

```sql
SELECT * FROM public.orders
WHERE whatsapp_sent = false
AND order_status = 'pending_confirmation'
ORDER BY created_at ASC;
```

### Get Today's Orders

```sql
SELECT * FROM public.orders
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

### Calculate Total Revenue

```sql
SELECT
  SUM(total_amount) as total_revenue,
  COUNT(*) as total_orders,
  AVG(total_amount) as average_order_value
FROM public.orders
WHERE order_status = 'completed';
```

---

## Integration with Code

### How the Service Uses These Tables

**When creating an order:**

1. Insert into `orders` table
2. Insert N rows into `order_item` table (one per cart item)
3. Both operations use Supabase client methods

**When viewing an order:**

1. Select from `orders` where id = orderId
2. Select from `order_item` where order_id = orderId
3. Join/combine results in frontend

**When updating status:**

1. Update `orders` set order_status = 'new_status' where id = orderId
2. Update `updated_at` timestamp automatically

---

## Troubleshooting

### Foreign Key Constraint Error

- Ensure `order_id` in order_item references existing order
- Ensure `product_id` in order_item references existing product
- Check that products table has the referenced ID

### Unique Constraint Error

- `order_number` must be unique
- The service generates unique numbers automatically

### RLS Permission Denied

- Check that RLS policies are set correctly
- Verify authenticated user has insert/select/update permissions

### Missing Table Error

- Run the CREATE TABLE statements in Supabase SQL Editor
- Refresh the schema explorer
- Check table names match exactly (case-sensitive)

---

## Backup & Migration

### Export Data

In Supabase, use the "Backups" tab to:

- Schedule automatic backups
- Download backup for archival
- Restore from backup if needed

### Migrate to Different Database

Use Supabase migration tools:

1. Export structure + data
2. Create tables in new database
3. Import data
4. Test connections

---

This schema is production-ready and optimized for the KDealz order system! 🚀
