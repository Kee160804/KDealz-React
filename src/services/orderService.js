// // services/orderService.js
// import { getAllProducts } from './productService';

// // Generate demo orders based on products
// export const generateDemoOrders = (products) => {
//   if (!products || products.length === 0) return [];
  
//   const statuses = ['completed', 'pending', 'processing', 'shipped'];
//   const customers = [
//     { name: 'John Smith', email: 'john.smith@email.com' },
//     { name: 'Maria Garcia', email: 'maria.g@email.com' },
//     { name: 'David Lee', email: 'david.lee@email.com' },
//     { name: 'Sarah Johnson', email: 'sarah.j@email.com' },
//     { name: 'Michael Brown', email: 'michael.b@email.com' }
//   ];
  
//   return Array.from({ length: 25 }, (_, i) => {
//     const date = new Date();
//     date.setDate(date.getDate() - Math.floor(Math.random() * 30));
//     const customer = customers[Math.floor(Math.random() * customers.length)];
//     const numItems = Math.floor(Math.random() * 3) + 1;
//     const items = [];
//     let total = 0;
    
//     // Make sure we have products to select from
//     if (products.length > 0) {
//       for (let j = 0; j < numItems; j++) {
//         const product = products[Math.floor(Math.random() * products.length)];
//         const quantity = Math.floor(Math.random() * 3) + 1;
//         items.push({ 
//           productId: product.id, 
//           name: product.name, 
//           price: product.price, 
//           quantity 
//         });
//         total += product.price * quantity;
//       }
//     }
    
//     return {
//       id: `ORD-${String(i + 1).padStart(3, '0')}`,
//       customer: customer.name,
//       email: customer.email,
//       date: date.toISOString().split('T')[0],
//       items, 
//       total,
//       status: statuses[Math.floor(Math.random() * statuses.length)],
//       paymentMethod: ['Credit Card', 'PayPal', 'Cash on Delivery'][Math.floor(Math.random() * 3)],
//       shippingAddress: `${Math.floor(Math.random() * 999) + 1} Main St, City, ST ${Math.floor(Math.random() * 90000) + 10000}`
//     };
//   });
// };

// // Initialize orders
// export const initializeOrders = () => {
//   const storedOrders = localStorage.getItem('orders');
//   const products = getAllProducts();
  
//   if (!storedOrders || storedOrders === '[]' || storedOrders === 'null') {
//     const orders = generateDemoOrders(products);
//     localStorage.setItem('orders', JSON.stringify(orders));
//     return orders;
//   }
  
//   try {
//     return JSON.parse(storedOrders);
//   } catch (e) {
//     const orders = generateDemoOrders(products);
//     localStorage.setItem('orders', JSON.stringify(orders));
//     return orders;
//   }
// };

// // Get all orders
// export const getAllOrders = () => {
//   return initializeOrders();
// };

// // Get order by ID
// export const getOrderById = (id) => {
//   const orders = getAllOrders();
//   return orders.find(o => o.id === id);
// };

// // Update order status
// export const updateOrderStatus = (orderId, newStatus) => {
//   const orders = JSON.parse(localStorage.getItem('orders')) || [];
//   const updatedOrders = orders.map(o => 
//     o.id === orderId ? { ...o, status: newStatus } : o
//   );
//   localStorage.setItem('orders', JSON.stringify(updatedOrders));
  
//   // Trigger update event
//   window.dispatchEvent(new Event('storage'));
  
//   return updatedOrders;
// };

// // Get pending orders count
// export const getPendingOrdersCount = () => {
//   const orders = getAllOrders();
//   return orders.filter(o => o.status === 'pending').length;
// };

// // Get today's orders
// export const getTodaysOrders = () => {
//   const orders = getAllOrders();
//   const today = new Date().toISOString().split('T')[0];
//   return orders.filter(o => o.date === today);
// };














// services/orderService.js
import { getAllProducts } from './productService';

// Generate demo orders based on products
export const generateDemoOrders = (products) => {
  if (!products || products.length === 0) return [];
  
  const statuses = ['completed', 'pending', 'processing', 'shipped'];
  const customers = [
    { name: 'John Smith', email: 'john.smith@email.com' },
    { name: 'Maria Garcia', email: 'maria.g@email.com' },
    { name: 'David Lee', email: 'david.lee@email.com' },
    { name: 'Sarah Johnson', email: 'sarah.j@email.com' },
    { name: 'Michael Brown', email: 'michael.b@email.com' }
  ];
  
  return Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;
    
    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      items.push({ 
        productId: product.id, 
        name: product.name, 
        price: product.price, 
        quantity 
      });
      total += product.price * quantity;
    }
    
    return {
      id: `ORD-${String(i + 1).padStart(3, '0')}`,
      customer: customer.name,
      email: customer.email,
      date: date.toISOString().split('T')[0],
      items, 
      total,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: ['Credit Card', 'PayPal', 'Cash on Delivery'][Math.floor(Math.random() * 3)],
      shippingAddress: `${Math.floor(Math.random() * 999) + 1} Main St, City, ST ${Math.floor(Math.random() * 90000) + 10000}`
    };
  });
};

// Initialize orders
export const initializeOrders = () => {
  const storedOrders = localStorage.getItem('orders');
  const products = getAllProducts();
  
  if (!storedOrders) {
    const orders = generateDemoOrders(products);
    localStorage.setItem('orders', JSON.stringify(orders));
    return orders;
  }
  
  try {
    return JSON.parse(storedOrders);
  } catch (e) {
    const orders = generateDemoOrders(products);
    localStorage.setItem('orders', JSON.stringify(orders));
    return orders;
  }
};

// Get all orders
export const getAllOrders = () => {
  return initializeOrders();
};

// Get order by ID
export const getOrderById = (id) => {
  const orders = getAllOrders();
  return orders.find(o => o.id === id);
};

// Update order status
export const updateOrderStatus = (orderId, newStatus) => {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const updatedOrders = orders.map(o => 
    o.id === orderId ? { ...o, status: newStatus } : o
  );
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
  
  window.dispatchEvent(new Event('storage'));
  
  return updatedOrders;
};