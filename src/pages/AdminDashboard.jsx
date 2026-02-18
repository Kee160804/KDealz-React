import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [showInventoryDetailModal, setShowInventoryDetailModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalProfit: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    todaySales: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Form states for modals
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    cost: '',
    stock: '',
    sku: '',
    description: ''
  });
  
  const [restockAmount, setRestockAmount] = useState({});

  // Load data from localStorage or initialize with demo data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showProductModal || showOrderModal || showUserModal || showRevenueModal || 
        showProfitModal || showInventoryModal || showPendingModal || showSalesModal ||
        showProductDetailModal || showOrderDetailModal || showInventoryDetailModal ||
        showAddProductModal || showRestockModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [
    showProductModal, showOrderModal, showUserModal, showRevenueModal,
    showProfitModal, showInventoryModal, showPendingModal, showSalesModal,
    showProductDetailModal, showOrderDetailModal, showInventoryDetailModal,
    showAddProductModal, showRestockModal
  ]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeAllModals();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    
    // Get products from localStorage
    const loadedProducts = JSON.parse(localStorage.getItem('products')) || generateDemoProducts();
    const loadedOrders = JSON.parse(localStorage.getItem('orders')) || generateDemoOrders(loadedProducts);
    const loadedUsers = JSON.parse(localStorage.getItem('users')) || generateDemoUsers();
    
    // Save demo data if not exists
    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify(loadedProducts));
    }
    if (!localStorage.getItem('orders')) {
      localStorage.setItem('orders', JSON.stringify(loadedOrders));
    }
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(loadedUsers));
    }

    setProducts(loadedProducts);
    setOrders(loadedOrders);
    setUsers(loadedUsers);

    // Calculate statistics
    calculateStats(loadedProducts, loadedOrders, loadedUsers);
    processChartData(loadedOrders, loadedProducts);
    findLowStockAlerts(loadedProducts);
    getTopProducts(loadedOrders, loadedProducts);
    
    setLoading(false);
  };

  const calculateStats = (products, orders, users) => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalProfit = orders.reduce((sum, order) => {
      const orderProfit = order.items.reduce((itemSum, item) => {
        const product = products.find(p => p.id === item.productId);
        const cost = product?.cost || item.price * 0.6;
        return itemSum + ((item.price - cost) * item.quantity);
      }, 0);
      return sum + orderProfit;
    }, 0);

    const today = new Date().toDateString();
    const todaySales = orders
      .filter(order => new Date(order.date).toDateString() === today)
      .reduce((sum, order) => sum + order.total, 0);

    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const lowStockItems = products.filter(p => p.stock < 10).length;

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue,
      totalProfit,
      lowStockItems,
      pendingOrders,
      todaySales
    });

    setRecentOrders(orders.slice(-5).reverse());
  };

  const processChartData = (orders, products) => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const salesByDay = last7Days.map(date => {
      const dayOrders = orders.filter(o => o.date.startsWith(date));
      const sales = dayOrders.reduce((sum, o) => sum + o.total, 0);
      const profit = dayOrders.reduce((sum, o) => {
        const orderProfit = o.items.reduce((itemSum, item) => {
          const product = products.find(p => p.id === item.productId);
          const cost = product?.cost || item.price * 0.6;
          return itemSum + ((item.price - cost) * item.quantity);
        }, 0);
        return sum + orderProfit;
      }, 0);
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        sales,
        profit,
        orders: dayOrders.length
      };
    });

    setSalesData(salesByDay);

    const categories = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = {
          name: category,
          value: 0,
          revenue: 0,
          stock: 0
        };
      }
      categories[category].value += 1;
      categories[category].stock += product.stock;
      
      const productSales = orders.reduce((sum, order) => {
        const item = order.items.find(i => i.productId === product.id);
        return sum + (item ? item.price * item.quantity : 0);
      }, 0);
      categories[category].revenue += productSales;
    });

    setCategoryData(Object.values(categories));
  };

  const findLowStockAlerts = (products) => {
    const alerts = products
      .filter(p => p.stock < 20)
      .map(p => ({
        ...p,
        alertLevel: p.stock < 5 ? 'critical' : p.stock < 10 ? 'warning' : 'notice'
      }))
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
    
    setInventoryAlerts(alerts);
  };

  const getTopProducts = (orders, products) => {
    const productSales = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            id: item.productId,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    const top = Object.entries(productSales)
      .map(([id, sales]) => {
        const product = products.find(p => p.id === id) || { name: 'Unknown Product' };
        return {
          id,
          name: product.name,
          quantity: sales.quantity,
          revenue: sales.revenue,
          stock: product.stock || 0,
          price: product.price || 0,
          category: product.category || 'Unknown'
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setTopProducts(top);
  };

  // Modal Handlers - Only open/close via buttons and X
  const openModal = (modalName, item = null) => {
    setSelectedItem(item);
    switch(modalName) {
      case 'products':
        setShowProductModal(true);
        break;
      case 'orders':
        setShowOrderModal(true);
        break;
      case 'users':
        setShowUserModal(true);
        break;
      case 'revenue':
        setShowRevenueModal(true);
        break;
      case 'profit':
        setShowProfitModal(true);
        break;
      case 'inventory':
        setShowInventoryModal(true);
        break;
      case 'pending':
        setShowPendingModal(true);
        break;
      case 'sales':
        setShowSalesModal(true);
        break;
      case 'productDetail':
        setShowProductDetailModal(true);
        break;
      case 'orderDetail':
        setShowOrderDetailModal(true);
        break;
      case 'inventoryDetail':
        setShowInventoryDetailModal(true);
        break;
      default:
        break;
    }
  };

  const closeAllModals = () => {
    setShowProductModal(false);
    setShowOrderModal(false);
    setShowUserModal(false);
    setShowRevenueModal(false);
    setShowProfitModal(false);
    setShowInventoryModal(false);
    setShowPendingModal(false);
    setShowSalesModal(false);
    setShowProductDetailModal(false);
    setShowOrderDetailModal(false);
    setShowInventoryDetailModal(false);
    setShowAddProductModal(false);
    setShowRestockModal(false);
    setSelectedItem(null);
    setNewProduct({
      name: '', category: '', price: '', cost: '', stock: '', sku: '', description: ''
    });
  };

  // Action Handlers
  const handleAddProduct = () => {
    const newId = (products.length + 1).toString();
    const productToAdd = {
      ...newProduct,
      id: newId,
      price: parseFloat(newProduct.price),
      cost: parseFloat(newProduct.cost),
      stock: parseInt(newProduct.stock)
    };
    
    const updatedProducts = [...products, productToAdd];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Refresh stats
    calculateStats(updatedProducts, orders, users);
    findLowStockAlerts(updatedProducts);
    
    closeAllModals();
    alert('Product added successfully!');
  };

  const handleRestock = (productId, amount) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return { ...p, stock: p.stock + amount };
      }
      return p;
    });
    
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Refresh stats
    calculateStats(updatedProducts, orders, users);
    findLowStockAlerts(updatedProducts);
    
    setShowRestockModal(false);
    alert(`Restocked ${amount} units successfully!`);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Refresh stats
    calculateStats(products, updatedOrders, users);
    
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  // Demo data generators
  const generateDemoProducts = () => {
    return [
      { id: '1', name: 'Caribbean Rum Cake', category: 'Food', price: 25.99, cost: 15.50, stock: 45, sku: 'FD-001', description: 'Delicious rum cake from the Caribbean' },
      { id: '2', name: 'Jerk Seasoning', category: 'Food', price: 12.99, cost: 7.20, stock: 78, sku: 'FD-002', description: 'Authentic Jamaican jerk seasoning' },
      { id: '3', name: 'Handmade Beach Bag', category: 'Accessories', price: 34.99, cost: 18.50, stock: 23, sku: 'AC-001', description: 'Handwoven beach bag' },
      { id: '4', name: 'Coconut Shell Bracelet', category: 'Accessories', price: 15.99, cost: 8.00, stock: 8, sku: 'AC-002', description: 'Handmade coconut bracelet' },
      { id: '5', name: 'Reggae CD Collection', category: 'Music', price: 19.99, cost: 10.50, stock: 12, sku: 'MU-001', description: 'Best of reggae music collection' },
      { id: '6', name: 'Caribbean Cookbook', category: 'Books', price: 29.99, cost: 16.00, stock: 4, sku: 'BK-001', description: 'Traditional Caribbean recipes' },
      { id: '7', name: 'Beach Sun Hat', category: 'Clothing', price: 22.99, cost: 12.50, stock: 17, sku: 'CL-001', description: 'Stylish beach sun hat' },
      { id: '8', name: 'Island T-Shirt', category: 'Clothing', price: 24.99, cost: 13.00, stock: 3, sku: 'CL-002', description: 'Comfortable island style t-shirt' }
    ];
  };

  const generateDemoOrders = (products) => {
    const statuses = ['completed', 'pending', 'processing', 'shipped'];
    const orders = [];
    
    for (let i = 1; i <= 25; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
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
      
      orders.push({
        id: `ORD-${String(i).padStart(3, '0')}`,
        customer: `Customer ${i}`,
        email: `customer${i}@example.com`,
        date: date.toISOString().split('T')[0],
        items,
        total,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentMethod: ['Credit Card', 'PayPal', 'Cash'][Math.floor(Math.random() * 3)],
        shippingAddress: `123 Main St, City, ST 12345`
      });
    }
    
    return orders;
  };

  const generateDemoUsers = () => {
    return [
      { id: '1', name: 'John Doe', email: 'john@example.com', orders: 5, totalSpent: 245.95, joinDate: '2024-01-15' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', orders: 3, totalSpent: 129.97, joinDate: '2024-02-20' },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', orders: 2, totalSpent: 87.98, joinDate: '2024-03-10' },
      { id: '4', name: 'Admin User', email: 'admin@karibbean.com', role: 'admin', orders: 0, totalSpent: 0, joinDate: '2024-01-01' }
    ];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAddProductModal(true)}>
            ➕ Add New Product
          </button>
          <button className="btn-secondary" onClick={loadDashboardData}>
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards - ALL CLICKABLE */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => openModal('products')}>
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
            <span className="stat-trend positive">View all products →</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal('orders')}>
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
            <span className="stat-trend positive">View all orders →</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal('users')}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <span className="stat-trend positive">View all users →</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal('revenue')}>
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
            <span className="stat-trend positive">View details →</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal('profit')}>
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>Total Profit</h3>
            <p className="stat-value">{formatCurrency(stats.totalProfit)}</p>
            <span className="stat-trend positive">View details →</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal('inventory')}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Low Stock Items</h3>
            <p className="stat-value">{stats.lowStockItems}</p>
            <span className="stat-trend negative">View inventory alerts →</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal('pending')}>
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending Orders</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
            <span className="stat-trend warning">Process now →</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal('sales')}>
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Today's Sales</h3>
            <p className="stat-value">{formatCurrency(stats.todaySales)}</p>
            <span className="stat-trend">View today's data →</span>
          </div>
        </div>
      </div>

      {/* Charts Section - CLICKABLE CARDS */}
      <div className="charts-grid">
        <div className="chart-card" onClick={() => openModal('sales')}>
          <div className="chart-header">
            <h3>Revenue & Profit Overview</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Area type="monotone" dataKey="sales" stroke="#3498db" fill="#3498db" fillOpacity={0.3} />
              <Area type="monotone" dataKey="profit" stroke="#2ecc71" fill="#2ecc71" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="chart-footer">Click for detailed analysis →</div>
        </div>

        <div className="chart-card" onClick={() => openModal('products')}>
          <div className="chart-header">
            <h3>Products by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-footer">Click to manage categories →</div>
        </div>
      </div>

      {/* Inventory Alerts - CLICKABLE */}
      {inventoryAlerts.length > 0 && (
        <div className="alerts-section">
          <h3>🚨 Inventory Alerts</h3>
          <div className="alerts-grid">
            {inventoryAlerts.map(product => (
              <div 
                key={product.id} 
                className={`alert-card ${product.alertLevel}`} 
                onClick={() => {
                  setSelectedItem(product);
                  openModal('inventoryDetail');
                }}
              >
                <div className="alert-header">
                  <h4>{product.name}</h4>
                  <span className="alert-badge">{product.alertLevel}</span>
                </div>
                <p>SKU: {product.sku}</p>
                <div className="stock-bar">
                  <div 
                    className="stock-fill" 
                    style={{ 
                      width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                      backgroundColor: product.alertLevel === 'critical' ? '#e74c3c' : 
                                    product.alertLevel === 'warning' ? '#f39c12' : '#3498db'
                    }}
                  ></div>
                </div>
                <p className="stock-count">Current Stock: {product.stock} units</p>
                <button 
                  className="restock-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(product);
                    setShowRestockModal(true);
                  }}
                >
                  Restock Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3>⚡ Quick Actions</h3>
        <div className="action-buttons-grid">
          <button className="action-btn" onClick={() => setShowAddProductModal(true)}>
            <span className="action-icon">➕</span>
            <span className="action-text">Add Product</span>
          </button>
          <button className="action-btn" onClick={() => openModal('inventory')}>
            <span className="action-icon">📦</span>
            <span className="action-text">Update Stock</span>
          </button>
          <button className="action-btn" onClick={() => openModal('pending')}>
            <span className="action-icon">✅</span>
            <span className="action-text">Process Orders</span>
          </button>
          <button className="action-btn" onClick={() => openModal('revenue')}>
            <span className="action-icon">📊</span>
            <span className="action-text">View Reports</span>
          </button>
        </div>
      </div>

      {/* Recent Orders - CLICKABLE ROWS */}
      <div className="recent-orders-section">
        <div className="section-header">
          <h3>📋 Recent Orders</h3>
        </div>
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} onClick={() => {
                  setSelectedItem(order);
                  openModal('orderDetail');
                }}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td className="order-total">{formatCurrency(order.total)}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="table-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(order);
                        openModal('orderDetail');
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== MODALS ========== */}

      {/* Products Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>📦 All Products</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Cost</th>
                    <th>Stock</th>
                    <th>SKU</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} onClick={() => {
                      setSelectedItem(product);
                      openModal('productDetail');
                    }}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{formatCurrency(product.cost)}</td>
                      <td className={product.stock < 10 ? 'stock-low' : ''}>{product.stock}</td>
                      <td>{product.sku}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => {
                closeAllModals();
                setShowAddProductModal(true);
              }}>
                Add New Product
              </button>
              <button className="btn-secondary" onClick={closeAllModals}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {showOrderModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>🛒 All Orders</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} onClick={() => {
                      setSelectedItem(order);
                      openModal('orderDetail');
                    }}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>{order.items.length}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Users Modal */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>👥 All Users</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.orders}</td>
                      <td>{formatCurrency(user.totalSpent)}</td>
                      <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Modal */}
      {showRevenueModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>💰 Revenue Details</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="stats-detail">
                <div className="detail-item">
                  <label>Total Revenue:</label>
                  <span className="value">{formatCurrency(stats.totalRevenue)}</span>
                </div>
                <div className="detail-item">
                  <label>Today's Sales:</label>
                  <span className="value">{formatCurrency(stats.todaySales)}</span>
                </div>
                <div className="detail-item">
                  <label>Average Order Value:</label>
                  <span className="value">{formatCurrency(stats.totalRevenue / stats.totalOrders)}</span>
                </div>
                <div className="detail-item">
                  <label>Total Orders:</label>
                  <span className="value">{stats.totalOrders}</span>
                </div>
              </div>
              
              <h4>Revenue by Day</h4>
              <div className="mini-chart">
                {salesData.map((day, index) => (
                  <div key={index} className="chart-bar-container">
                    <div className="chart-bar-label">{day.date}</div>
                    <div className="chart-bar-wrapper">
                      <div 
                        className="chart-bar" 
                        style={{ 
                          width: `${(day.sales / Math.max(...salesData.map(d => d.sales))) * 100}%`,
                          backgroundColor: '#3498db'
                        }}
                      >
                        {formatCurrency(day.sales)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Profit Modal */}
      {showProfitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>📈 Profit Analysis</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="stats-detail">
                <div className="detail-item">
                  <label>Total Profit:</label>
                  <span className="value profit">{formatCurrency(stats.totalProfit)}</span>
                </div>
                <div className="detail-item">
                  <label>Profit Margin:</label>
                  <span className="value">{(stats.totalProfit / stats.totalRevenue * 100).toFixed(1)}%</span>
                </div>
                <div className="detail-item">
                  <label>Revenue:</label>
                  <span className="value">{formatCurrency(stats.totalRevenue)}</span>
                </div>
                <div className="detail-item">
                  <label>Cost of Goods:</label>
                  <span className="value">{formatCurrency(stats.totalRevenue - stats.totalProfit)}</span>
                </div>
              </div>

              <h4>Most Profitable Products</h4>
              <div className="profitable-products">
                {topProducts.map((product, index) => {
                  const profit = product.revenue - (product.revenue * 0.6);
                  return (
                    <div key={product.id} className="profit-item">
                      <span className="rank">{index + 1}</span>
                      <span className="name">{product.name}</span>
                      <span className="profit-amount">{formatCurrency(profit)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {showInventoryModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>📦 Inventory Management</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td className={product.stock < 10 ? 'stock-low' : ''}>{product.stock}</td>
                      <td>
                        {product.stock < 5 ? '🔴 Critical' : 
                         product.stock < 10 ? '🟡 Warning' : '🟢 Good'}
                      </td>
                      <td>
                        <button 
                          className="action-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(product);
                            setShowRestockModal(true);
                          }}
                        >
                          Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Orders Modal */}
      {showPendingModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>⏳ Pending Orders</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              {orders.filter(o => o.status === 'pending').length === 0 ? (
                <p className="no-data">No pending orders! 🎉</p>
              ) : (
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => o.status === 'pending').map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                        <td>{formatCurrency(order.total)}</td>
                        <td>
                          <select 
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            value={order.status}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductDetailModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>📦 Product Details</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-view">
                <div className="detail-row">
                  <label>Name:</label>
                  <span>{selectedItem.name}</span>
                </div>
                <div className="detail-row">
                  <label>Category:</label>
                  <span>{selectedItem.category}</span>
                </div>
                <div className="detail-row">
                  <label>Price:</label>
                  <span className="price">{formatCurrency(selectedItem.price)}</span>
                </div>
                <div className="detail-row">
                  <label>Cost:</label>
                  <span>{formatCurrency(selectedItem.cost)}</span>
                </div>
                <div className="detail-row">
                  <label>Profit per unit:</label>
                  <span className="profit">{formatCurrency(selectedItem.price - selectedItem.cost)}</span>
                </div>
                <div className="detail-row">
                  <label>Current Stock:</label>
                  <span className={selectedItem.stock < 10 ? 'stock-low' : ''}>{selectedItem.stock}</span>
                </div>
                <div className="detail-row">
                  <label>SKU:</label>
                  <span>{selectedItem.sku}</span>
                </div>
                <div className="detail-row">
                  <label>Description:</label>
                  <p>{selectedItem.description}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-primary"
                onClick={() => {
                  setShowRestockModal(true);
                }}
              >
                Restock
              </button>
              <button className="btn-secondary" onClick={closeAllModals}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetailModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>🛒 Order Details - {selectedItem.id}</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-view">
                <div className="detail-row">
                  <label>Customer:</label>
                  <span>{selectedItem.customer}</span>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{selectedItem.email}</span>
                </div>
                <div className="detail-row">
                  <label>Date:</label>
                  <span>{new Date(selectedItem.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedItem.status}`}>{selectedItem.status}</span>
                </div>
                <div className="detail-row">
                  <label>Payment Method:</label>
                  <span>{selectedItem.paymentMethod}</span>
                </div>
                <div className="detail-row">
                  <label>Shipping Address:</label>
                  <span>{selectedItem.shippingAddress}</span>
                </div>
                
                <h4>Items Ordered:</h4>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'right' }}><strong>Total:</strong></td>
                      <td><strong>{formatCurrency(selectedItem.total)}</strong></td>
                    </tr>
                  </tfoot>
                </table>

                <div className="status-update">
                  <label>Update Status:</label>
                  <select 
                    onChange={(e) => handleUpdateOrderStatus(selectedItem.id, e.target.value)}
                    value={selectedItem.status}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>➕ Add New Product</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <form className="product-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                    placeholder="e.g., Caribbean Rum Cake"
                  />
                </div>
                
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Food">Food</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Music">Music</option>
                    <option value="Books">Books</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      required
                      placeholder="25.99"
                    />
                  </div>

                  <div className="form-group">
                    <label>Cost ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.cost}
                      onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                      required
                      placeholder="15.50"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Initial Stock *</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      required
                      placeholder="50"
                    />
                  </div>

                  <div className="form-group">
                    <label>SKU *</label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      required
                      placeholder="FD-001"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Product description..."
                    rows="3"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-primary"
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.cost || !newProduct.stock || !newProduct.sku}
              >
                Add Product
              </button>
              <button className="btn-secondary" onClick={closeAllModals}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <div className="modal-header">
              <h2>📦 Restock Product</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Product:</strong> {selectedItem.name}</p>
              <p><strong>Current Stock:</strong> {selectedItem.stock}</p>
              
              <div className="form-group">
                <label>Quantity to Add:</label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount[selectedItem.id] || ''}
                  onChange={(e) => setRestockAmount({
                    ...restockAmount, 
                    [selectedItem.id]: parseInt(e.target.value) || 0
                  })}
                  placeholder="Enter quantity"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-primary"
                onClick={() => handleRestock(selectedItem.id, restockAmount[selectedItem.id] || 0)}
                disabled={!restockAmount[selectedItem.id] || restockAmount[selectedItem.id] < 1}
              >
                Confirm Restock
              </button>
              <button className="btn-secondary" onClick={closeAllModals}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;