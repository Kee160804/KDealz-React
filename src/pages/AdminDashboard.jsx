// AdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import "../styles/AdminDashboard.css";

// Import services
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from "../services/productService";
import { getAllOrders, updateOrderStatus } from "../services/orderService";
import { getAllUsers } from "../services/userService";
import { getAllExpenses, addExpense } from "../services/expenseService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showFinancialModal, setShowFinancialModal] = useState(false);

  // Product filtering states
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [parentModal, setParentModal] = useState(null);

  // Order filtering states
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [orderFilterStatus, setOrderFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modal refs for focus management
  const modalRefs = {
    product: useRef(null),
    order: useRef(null),
    user: useRef(null),
    revenue: useRef(null),
    profit: useRef(null),
    inventory: useRef(null),
    pending: useRef(null),
    sales: useRef(null),
    productDetail: useRef(null),
    orderDetail: useRef(null),
    inventoryDetail: useRef(null),
    addProduct: useRef(null),
    restock: useRef(null),
    editProduct: useRef(null),
    financial: useRef(null),
  };

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalEarned: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalProfit: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    todaySales: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // --- Transform a raw product from Supabase into the shape used by the admin ---
  const transformProduct = (rawProduct) => {
    let sizes = [];
    if (rawProduct.sizes) {
      if (typeof rawProduct.sizes === 'string') {
        try {
          sizes = JSON.parse(rawProduct.sizes);
        } catch {
          // Fallback: comma‑separated string
          sizes = rawProduct.sizes.split(',').map(s => s.trim());
        }
      } else if (Array.isArray(rawProduct.sizes)) {
        sizes = rawProduct.sizes;
      }
    }

    let availableSizes = {};
    if (rawProduct.available_Sizes) {
      if (typeof rawProduct.available_Sizes === 'string') {
        try {
          availableSizes = JSON.parse(rawProduct.available_Sizes);
        } catch (e) {
          console.warn('Failed to parse available_Sizes for product', rawProduct.id, e);
        }
      } else if (typeof rawProduct.available_Sizes === 'object') {
        availableSizes = rawProduct.available_Sizes;
      }
    }

    return {
      ...rawProduct,
      stock: rawProduct.stock_quantity,          // alias for ProductCard compatibility
      sizes,
      availableSizes,
    };
  };

  // Helper to parse stored sizes into entries for the edit form
  const parseSizesToEntries = (product) => {
    const entries = [];
    let sizesArray = [];
    let availableObj = {};

    if (product.sizes) {
      if (Array.isArray(product.sizes)) {
        sizesArray = product.sizes;
      } else if (typeof product.sizes === 'string') {
        try {
          sizesArray = JSON.parse(product.sizes);
        } catch {
          sizesArray = product.sizes.split(',').map(s => s.trim());
        }
      }
    }

    if (product.available_Sizes) {
      if (typeof product.available_Sizes === 'object' && !Array.isArray(product.available_Sizes)) {
        availableObj = product.available_Sizes;
      } else if (typeof product.available_Sizes === 'string') {
        try {
          availableObj = JSON.parse(product.available_Sizes);
        } catch {
          availableObj = {};
        }
      }
    }

    if (sizesArray.length > 0) {
      sizesArray.forEach(size => {
        entries.push({
          size: size,
          stock: availableObj[size] || 0
        });
      });
    }
    return entries;
  };

  const [newProduct, setNewProduct] = useState({
    name: "",
    category_id: "",
    price: "",
    cost: "",
    stock_quantity: "",
    SKU: "",
    description: "",
    image: "",
    tagsInput: "",
    tags: [],
    sizes: []
  });

  const [editProduct, setEditProduct] = useState({
    name: "",
    category_id: "",
    price: "",
    cost: "",
    stock_quantity: "",
    SKU: "",
    description: "",
    image: "",
    subcategory_id: "",
    sizes: []
  });

  const [restockAmount, setRestockAmount] = useState({});

  // --- TanStack Query Mutations ---
  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, newStock }) => updateStock(id, newStock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Check if any modal is open
  const anyModalOpen =
    showProductModal ||
    showOrderModal ||
    showUserModal ||
    showRevenueModal ||
    showProfitModal ||
    showInventoryModal ||
    showPendingModal ||
    showSalesModal ||
    showProductDetailModal ||
    showOrderDetailModal ||
    showInventoryDetailModal ||
    showAddProductModal ||
    showRestockModal ||
    showEditProductModal ||
    showFinancialModal;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (anyModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0";
    };
  }, [anyModalOpen]);

  // Handle escape key - close only the topmost modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && anyModalOpen) {
        if (
          showProductDetailModal ||
          showOrderDetailModal ||
          showInventoryDetailModal ||
          showAddProductModal ||
          showRestockModal ||
          showEditProductModal
        ) {
          closeTopModal();
        } else {
          closeAllModals();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [
    anyModalOpen,
    showProductDetailModal,
    showOrderDetailModal,
    showInventoryDetailModal,
    showAddProductModal,
    showRestockModal,
    showEditProductModal,
  ]);

  // Focus trap for modals
  useEffect(() => {
    if (anyModalOpen) {
      const topModal = getTopmostModal();
      if (topModal && modalRefs[topModal]?.current) {
        modalRefs[topModal].current.focus();
      }
    }
  }, [
    anyModalOpen,
    showProductModal,
    showOrderModal,
    showUserModal,
    showRevenueModal,
    showProfitModal,
    showInventoryModal,
    showPendingModal,
    showSalesModal,
    showProductDetailModal,
    showOrderDetailModal,
    showInventoryDetailModal,
    showAddProductModal,
    showRestockModal,
    showEditProductModal,
    showFinancialModal,
  ]);

  // --- NEW: Load initial dashboard data on mount ---
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Helper to get the topmost open modal
  const getTopmostModal = () => {
    if (showProductDetailModal) return "productDetail";
    if (showOrderDetailModal) return "orderDetail";
    if (showInventoryDetailModal) return "inventoryDetail";
    if (showAddProductModal) return "addProduct";
    if (showRestockModal) return "restock";
    if (showEditProductModal) return "editProduct";
    if (showProductModal) return "product";
    if (showOrderModal) return "order";
    if (showUserModal) return "user";
    if (showRevenueModal) return "revenue";
    if (showProfitModal) return "profit";
    if (showInventoryModal) return "inventory";
    if (showPendingModal) return "pending";
    if (showSalesModal) return "sales";
    if (showFinancialModal) return "financial";
    return null;
  };

  // Close only the topmost modal
  const closeTopModal = () => {
    if (showProductDetailModal) {
      setShowProductDetailModal(false);
    } else if (showOrderDetailModal) {
      setShowOrderDetailModal(false);
    } else if (showInventoryDetailModal) {
      setShowInventoryDetailModal(false);
    } else if (showAddProductModal) {
      setShowAddProductModal(false);
    } else if (showRestockModal) {
      setShowRestockModal(false);
    } else if (showEditProductModal) {
      setShowEditProductModal(false);
    } else {
      closeAllModals();
    }
  };

  // --- Load dashboard data (async, with transformations) ---
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const loadedProductsRaw = await getAllProducts();
      const loadedUsers = await getAllUsers();
      const loadedExpenses = await getAllExpenses();
      const loadedOrders = await getAllOrders();

      // Transform products to have parsed sizes/availableSizes and stock alias
      const loadedProducts = loadedProductsRaw.map(transformProduct);

      setProducts(loadedProducts);
      setOrders(loadedOrders);
      setUsers(loadedUsers);
      setExpenses(loadedExpenses);

      calculateStats(loadedProducts, loadedOrders, loadedUsers, loadedExpenses);
      processChartData(loadedOrders, loadedProducts);
      findLowStockAlerts(loadedProducts);
      getTopProducts(loadedOrders, loadedProducts);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Stats functions (unchanged)
  const calculateStats = (products, orders, users, expensesList) => {
    const totalEarned = orders.reduce((sum, o) => sum + o.total, 0);

    const cogs = orders.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce((itemSum, item) => {
          const product = products.find((p) => p.id === item.productId);
          const cost = product?.cost || item.price * 0.6;
          return itemSum + cost * item.quantity;
        }, 0)
      );
    }, 0);

    const totalExpenses = (expensesList || []).reduce(
      (sum, e) => sum + e.amount,
      0,
    );
    const grossProfit = totalEarned - cogs;
    const netProfit = totalEarned - totalExpenses;

    const today = new Date().toDateString();
    const todaySales = orders
      .filter((o) => new Date(o.date).toDateString() === today)
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const lowStockItems = products.filter((p) => p.stock < 10).length;

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue: totalEarned,
      totalEarned,
      totalExpenses,
      netProfit,
      totalProfit: grossProfit,
      lowStockItems,
      pendingOrders,
      todaySales,
    });

    setRecentOrders(orders.slice(-5).reverse());
  };

  const processChartData = (orders, products) => {
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      })
      .reverse();

    const salesByDay = last7Days.map((date) => {
      const dayOrders = orders.filter((o) => o.date.startsWith(date));
      const sales = dayOrders.reduce((sum, o) => sum + o.total, 0);
      const profit = dayOrders.reduce((sum, o) => {
        return (
          sum +
          o.items.reduce((s, item) => {
            const product = products.find((p) => p.id === item.productId);
            const cost = product?.cost || item.price * 0.6;
            return s + (item.price - cost) * item.quantity;
          }, 0)
        );
      }, 0);
      return {
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        sales,
        profit,
        orders: dayOrders.length,
      };
    });
    setSalesData(salesByDay);

    const categories = {};
    products.forEach((product) => {
      const cat = product.category || "Uncategorized";
      if (!categories[cat])
        categories[cat] = { name: cat, value: 0, revenue: 0, stock: 0 };
      categories[cat].value += 1;
      categories[cat].stock += product.stock;
      const rev = orders.reduce((sum, order) => {
        const item = order.items.find((i) => i.productId === product.id);
        return sum + (item ? item.price * item.quantity : 0);
      }, 0);
      categories[cat].revenue += rev;
    });
    setCategoryData(Object.values(categories));
  };

  const findLowStockAlerts = (products) => {
    const alerts = products
      .filter((p) => p.stock < 20)
      .map((p) => ({
        ...p,
        alertLevel:
          p.stock < 5 ? "critical" : p.stock < 10 ? "warning" : "notice",
      }))
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
    setInventoryAlerts(alerts);
  };

  const getTopProducts = (orders, products) => {
    const productSales = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            id: item.productId,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });
    const top = Object.entries(productSales)
      .map(([id, sales]) => {
        const product = products.find((p) => p.id === parseInt(id)) || {
          name: "Unknown",
        };
        return {
          id,
          name: product.name,
          quantity: sales.quantity,
          revenue: sales.revenue,
          stock: product.stock || 0,
          price: product.price || 0,
          category: product.category || "Unknown",
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    setTopProducts(top);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      productSearchTerm === "" ||
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase());
    const matchesCategory =
      productCategoryFilter === "all" || product.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Modal helpers
  const openModal = (modalName, item = null) => {
    setSelectedItem(item);
    setIsMobileMenuOpen(false);
    switch (modalName) {
      case "products":
        setShowProductModal(true);
        break;
      case "orders":
        setShowOrderModal(true);
        break;
      case "users":
        setShowUserModal(true);
        break;
      case "revenue":
        setShowRevenueModal(true);
        break;
      case "profit":
        setShowProfitModal(true);
        break;
      case "inventory":
        setShowInventoryModal(true);
        break;
      case "pending":
        setShowPendingModal(true);
        break;
      case "sales":
        setShowSalesModal(true);
        break;
      case "productDetail":
        setShowProductDetailModal(true);
        break;
      case "orderDetail":
        setShowOrderDetailModal(true);
        break;
      case "inventoryDetail":
        setShowInventoryDetailModal(true);
        break;
      case "financial":
        setShowFinancialModal(true);
        break;
      default:
        break;
    }
  };

  const openDetailModal = (modalName, item, parent) => {
    setSelectedItem(item);
    setParentModal(parent);

    switch (modalName) {
      case "productDetail":
        setShowProductDetailModal(true);
        break;
      case "orderDetail":
        setShowOrderDetailModal(true);
        break;
      case "inventoryDetail":
        setShowInventoryDetailModal(true);
        break;
      case "addProduct":
        setShowAddProductModal(true);
        break;
      case "restock":
        setShowRestockModal(true);
        break;
      case "editProduct":
        setShowEditProductModal(true);
        break;
      default:
        break;
    }
  };

  // openEditModal with safe conversion
  const openEditModal = (product, parent) => {
    setSelectedItem(product);
    setParentModal(parent);
    const sizes = parseSizesToEntries(product);
    setEditProduct({
      name: product.name || "",
      category_id: product.category || "",
      price: product.price?.toString() || "",
      cost: (product.cost || product.price * 0.6)?.toString() || "",
      stock_quantity: product.stock?.toString() || "",
      SKU: product.SKU || `SKU-${product.id}`,
      description: product.description || "",
      image: product.image || "",
      subcategory_id: product.subCategory || "",
      sizes,
    });
    setShowEditProductModal(true);
  };

  const closeDetailModal = () => {
    setShowProductDetailModal(false);
    setShowOrderDetailModal(false);
    setShowInventoryDetailModal(false);
    setShowAddProductModal(false);
    setShowRestockModal(false);
    setShowEditProductModal(false);
    setSelectedItem(null);
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
    setShowEditProductModal(false);
    setShowFinancialModal(false);
    setSelectedItem(null);
    setParentModal(null);
    setNewProduct({
      name: "",
      category_id: "",
      price: "",
      cost: "",
      stock_quantity: "",
      SKU: "",
      description: "",
      image: "",
      tagsInput: "",
      tags: [],
      sizes: [],
    });
    setEditProduct({
      name: "",
      category_id: "",
      price: "",
      cost: "",
      stock_quantity: "",
      SKU: "",
      description: "",
      image: "",
      subcategory_id: "",
      sizes: [],
    });
  };

  // Handlers with mutations (unchanged)
  const handleAddProduct = async () => {
    try {
      const id = Date.now();

      const sizesArray = newProduct.sizes
        .map(entry => entry.size.trim())
        .filter(size => size !== '');
      const availableSizesObj = {};
      newProduct.sizes.forEach(entry => {
        if (entry.size.trim() !== '') {
          availableSizesObj[entry.size.trim()] = entry.stock;
        }
      });

      const productToAdd = {
        ...newProduct,
        id,
        price: parseFloat(newProduct.price),
        cost: parseFloat(newProduct.cost),
        stock: parseInt(newProduct.stock),
        sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
        available_Sizes: sizesArray.length > 0 ? JSON.stringify(availableSizesObj) : null,
        image: newProduct.image || "https://via.placeholder.com/500",
        tags: newProduct.tags || [],
      };

      const addedProduct = await addProductMutation.mutateAsync(productToAdd);
      const updatedProducts = [...products, addedProduct];

      const expenseEntry = {
        type: "product_purchase",
        description: `Added product: ${newProduct.name} (${newProduct.stock} units × $${newProduct.cost})`,
        amount: parseFloat(newProduct.cost) * parseInt(newProduct.stock),
        productId: id,
      };
      const addedExpense = addExpense(expenseEntry);
      const updatedExpenses = [...expenses, addedExpense];

      setProducts(updatedProducts);
      setExpenses(updatedExpenses);

      calculateStats(updatedProducts, orders, users, updatedExpenses);
      findLowStockAlerts(updatedProducts);
      processChartData(orders, updatedProducts);

      closeAllModals();
      alert(`✅ Product "${newProduct.name}" added!`);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleEditProduct = async () => {
    try {
      const sizesArray = editProduct.sizes
        .map(entry => entry.size.trim())
        .filter(size => size !== '');
      const availableSizesObj = {};
      editProduct.sizes.forEach(entry => {
        if (entry.size.trim() !== '') {
          availableSizesObj[entry.size.trim()] = entry.stock;
        }
      });

      const updatedData = {
        ...editProduct,
        price: parseFloat(editProduct.price),
        cost: parseFloat(editProduct.cost),
        stock_quantity: parseInt(editProduct.stock),
        sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
        available_Sizes: sizesArray.length > 0 ? JSON.stringify(availableSizesObj) : null,
      };

      const updatedProduct = await updateProductMutation.mutateAsync({ id: selectedItem.id, data: updatedData });
      const updatedProducts = products.map((p) =>
        p.id === selectedItem.id ? updatedProduct : p
      );

      setProducts(updatedProducts);
      calculateStats(updatedProducts, orders, users, expenses);
      findLowStockAlerts(updatedProducts);

      closeDetailModal();
      alert("✅ Product updated successfully!");
    } catch (error) {
      // console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This cannot be undone.",
      )
    )
      return;

    try {
      await deleteProductMutation.mutateAsync(productId);
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      calculateStats(updatedProducts, orders, users, expenses);
      findLowStockAlerts(updatedProducts);
      processChartData(orders, updatedProducts);
      getTopProducts(orders, updatedProducts);
      closeDetailModal();
      alert("🗑️ Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleRestock = async (productId, amount) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product || amount < 1) return;

      const updatedProduct = await updateStockMutation.mutateAsync({ id: productId, newStock: product.stock + amount });
      const updatedProducts = products.map((p) =>
        p.id === productId ? updatedProduct : p,
      );

      const expenseEntry = {
        type: "restock",
        description: `Restocked: ${product.name} (+${amount} units × $${product.cost || product.price * 0.6})`,
        amount: (product.cost || product.price * 0.6) * amount,
        productId,
      };
      const addedExpense = addExpense(expenseEntry);
      const updatedExpenses = [...expenses, addedExpense];

      setProducts(updatedProducts);
      setExpenses(updatedExpenses);

      calculateStats(updatedProducts, orders, users, updatedExpenses);
      findLowStockAlerts(updatedProducts);

      closeDetailModal();
      alert(`✅ Restocked ${amount} units.`);
    } catch (error) {
      console.error("Error restocking product:", error);
      alert("Failed to restock. Please try again.");
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    try {
      const updatedOrders = updateOrderStatus(orderId, newStatus);

      if (selectedItem && selectedItem.id === orderId) {
        setSelectedItem((prev) => ({ ...prev, status: newStatus }));
      }

      setOrders(updatedOrders);
      calculateStats(products, updatedOrders, users, expenses);
      setRecentOrders(updatedOrders.slice(-5).reverse());
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);

  const COLORS = [
    "#3498db",
    "#2ecc71",
    "#e74c3c",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
  ];

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  const isNetPositive = stats.netProfit >= 0;
  return (
    <div className="admin-dashboard">
         <div className="admin-dashboard">
      {/* Mobile Header with Menu Toggle */}
      <div className="mobile-dashboard-header">
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <h2>Admin Dashboard</h2>
        <div className="mobile-header-actions">
          <button
            className="mobile-add-btn"
            onClick={() => setShowAddProductModal(true)}
          >
            ➕
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <button
          className="mobile-nav-close"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          ×
        </button>
        <div className="mobile-nav-items">
          <button
            onClick={() => {
              openModal("products");
              setIsMobileMenuOpen(false);
            }}
          >
            📦 Products
          </button>
          <button
            onClick={() => {
              openModal("orders");
              setIsMobileMenuOpen(false);
            }}
          >
            🛒 Orders
          </button>
          <button
            onClick={() => {
              openModal("users");
              setIsMobileMenuOpen(false);
            }}
          >
            👥 Users
          </button>
          <button
            onClick={() => {
              openModal("revenue");
              setIsMobileMenuOpen(false);
            }}
          >
            💵 Revenue
          </button>
          <button
            onClick={() => {
              openModal("financial");
              setIsMobileMenuOpen(false);
            }}
          >
            💸 Expenses
          </button>
          <button
            onClick={() => {
              openModal("profit");
              setIsMobileMenuOpen(false);
            }}
          >
            📈 Profit/Loss
          </button>
          <button
            onClick={() => {
              openModal("inventory");
              setIsMobileMenuOpen(false);
            }}
          >
            ⚠️ Inventory
          </button>
          <button
            onClick={() => {
              openModal("pending");
              setIsMobileMenuOpen(false);
            }}
          >
            ⏳ Pending
          </button>
          <button
            onClick={() => {
              openModal("sales");
              setIsMobileMenuOpen(false);
            }}
          >
            📊 Sales
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="dashboard-header desktop-only">
        <div className="header-title">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => setShowAddProductModal(true)}
          >
            ➕ Add New Product
          </button>
          <button className="btn-secondary" onClick={loadDashboardData}>
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => openModal("products")}>
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
            <span className="stat-link">
              View <span className="arrow">→</span>
            </span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal("orders")}>
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
            <span className="stat-link">
              View <span className="arrow">→</span>
            </span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal("users")}>
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <span className="stat-link">
              View <span className="arrow">→</span>
            </span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal("revenue")}>
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <h3>Total Earned</h3>
            <p className="stat-value">{formatCurrency(stats.totalEarned)}</p>
            <span className="stat-link">
              View <span className="arrow">→</span>
            </span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal("financial")}>
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Total Expenses</h3>
            <p className="stat-value expense">
              {formatCurrency(stats.totalExpenses)}
            </p>
            <span className="stat-link">
              View <span className="arrow">→</span>
            </span>
          </div>
        </div>

        <div
          className={`stat-card ${isNetPositive ? "profit" : "loss"}`}
          onClick={() => openModal("profit")}
        >
          <div className="stat-icon">{isNetPositive ? "📈" : "📉"}</div>
          <div className="stat-content">
            <h3>Net {isNetPositive ? "Profit" : "Loss"}</h3>
            <p className={`stat-value ${isNetPositive ? "profit" : "loss"}`}>
              {isNetPositive ? "" : "-"}
              {formatCurrency(Math.abs(stats.netProfit))}
            </p>
            <span className="stat-link">
              View <span className="arrow">→</span>
            </span>
          </div>
        </div>

        <div
          className="stat-card warning"
          onClick={() => openModal("inventory")}
        >
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Low Stock</h3>
            <p className="stat-value warning">{stats.lowStockItems}</p>
            <span className="stat-link">
              View <span className="arrow">→</span>
            </span>
          </div>
        </div>

        <div className="stat-card pending" onClick={() => openModal("pending")}>
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <p className="stat-value pending">{stats.pendingOrders}</p>
            <span className="stat-link">
              View <span className="arrow">→</span>
            </span>
          </div>
        </div>

        <div className="stat-card" onClick={() => openModal("sales")}>
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Today's Sales</h3>
            <p className="stat-value">{formatCurrency(stats.todaySales)}</p>
            <span className="stat-link">
              View <span className="arrow">→</span>
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div
          className="chart-card clickable"
          onClick={() => openModal("sales")}
        >
          <div className="chart-header">
            <h3>Revenue & Profit — Last 7 Days</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3498db"
                fill="#3498db"
                fillOpacity={0.3}
                name="Sales"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#2ecc71"
                fill="#2ecc71"
                fillOpacity={0.3}
                name="Gross Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="chart-footer">Click for detailed analysis →</div>
        </div>

        <div
          className="chart-card clickable"
          onClick={() => openModal("products")}
        >
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
                dataKey="value"
                label={({ name }) => name}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-footer">Click to manage categories →</div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {inventoryAlerts.length > 0 && (
        <div className="alerts-section">
          <h3>🚨 Inventory Alerts — Low Stock Warning</h3>
          <div className="alerts-grid">
            {inventoryAlerts.map((product) => (
              <div
                key={product.id}
                className={`alert-card ${product.alertLevel}`}
                onClick={() =>
                  openDetailModal("inventoryDetail", product, "inventory")
                }
              >
                <div className="alert-header">
                  <h4>{product.name}</h4>
                  <span className="alert-badge">{product.alertLevel}</span>
                </div>
                <p>SKU: {product.SKU || `SKU-${product.id}`}</p>
                <div className="stock-bar">
                  <div
                    className="stock-fill"
                    style={{
                      width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                      backgroundColor:
                        product.alertLevel === "critical"
                          ? "#e74c3c"
                          : product.alertLevel === "warning"
                            ? "#f39c12"
                            : "#3498db",
                    }}
                  />
                </div>
                <p className="stock-count">
                  Current Stock: <strong>{product.stock} units</strong>
                </p>
                <button
                  className="restock-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetailModal("restock", product, "inventory");
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
          <button
            className="action-btn"
            onClick={() => setShowAddProductModal(true)}
          >
            <span className="action-icon">➕</span>
            <span className="action-text">Add Product</span>
          </button>
          <button className="action-btn" onClick={() => openModal("inventory")}>
            <span className="action-icon">📦</span>
            <span className="action-text">Update Stock</span>
          </button>
          <button className="action-btn" onClick={() => openModal("pending")}>
            <span className="action-icon">✅</span>
            <span className="action-text">Process Orders</span>
          </button>
          <button className="action-btn" onClick={() => openModal("financial")}>
            <span className="action-icon">💰</span>
            <span className="action-text">Financial Report</span>
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="recent-orders-section">
        <div className="section-header">
          <h3>📋 Recent Orders</h3>
          <button className="view-all-btn" onClick={() => openModal("orders")}>
            View All →
          </button>
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
              {recentOrders.map((order) => (
                <tr key={order.id}>
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
                        openDetailModal("orderDetail", order, "orders");
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

      {/* ═══════════════════ MODALS ═══════════════════ */}

      {/* All Products Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div
            className="modal-content large"
            ref={modalRefs.product}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="All Products"
          >
            <div className="modal-header">
              <h2>📦 All Products</h2>
              <button
                className="modal-close"
                onClick={closeAllModals}
                aria-label="Close modal"
              >
                ×
              </button>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>
                          {formatCurrency(product.cost || product.price * 0.6)}
                        </td>
                        <td className={product.stock < 10 ? "stock-low" : ""}>
                          {product.stock}
                        </td>
                        <td>{product.SKU || `SKU-${product.id}`}</td>
                        <td className="action-cell">
                          <button
                            className="action-small view"
                            onClick={() =>
                              openDetailModal(
                                "productDetail",
                                product,
                                "product",
                              )
                            }
                          >
                            View
                          </button>
                          <button
                            className="action-small edit"
                            onClick={() => openEditModal(product, "product")}
                          >
                            Edit
                          </button>
                          <button
                            className="action-small delete"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No products found. Click "Add New Product" to create
                        one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => {
                  closeAllModals();
                  setShowAddProductModal(true);
                }}
              >
                ➕ Add New Product
              </button>
              <button className="btn-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Orders Modal */}
      {showOrderModal && (
        <div className="modal-overlay">
          <div
            className="modal-content large"
            ref={modalRefs.order}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="All Orders"
          >
            <div className="modal-header">
              <h2>🛒 All Orders</h2>
              <button className="modal-close" onClick={closeAllModals}>
                ×
              </button>
            </div>

            <div className="order-filters">
              <div className="filters-container">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by name, email, or order ID..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {orderSearchTerm && (
                    <button
                      className="clear-search"
                      onClick={() => setOrderSearchTerm("")}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="filter-dropdown">
                  <select
                    value={orderFilterStatus}
                    onChange={(e) => setOrderFilterStatus(e.target.value)}
                    className="category-select"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="processing">⚙️ Processing</option>
                    <option value="shipped">🚚 Shipped</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>

                <button
                  className="date-filter-btn"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <span>📅</span>
                  {startDate || endDate
                    ? "Date Filter Active"
                    : "Filter by Date"}
                </button>

                {(orderSearchTerm ||
                  orderFilterStatus !== "all" ||
                  startDate ||
                  endDate) && (
                  <button
                    className="clear-filters-btn"
                    onClick={() => {
                      setOrderSearchTerm("");
                      setOrderFilterStatus("all");
                      setStartDate("");
                      setEndDate("");
                      setShowDatePicker(false);
                    }}
                  >
                    ✕ Clear Filters
                  </button>
                )}
              </div>

              {showDatePicker && (
                <div className="date-picker-container">
                  <div>
                    <label>From:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>To:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-body">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders && orders.length > 0 ? (
                    orders
                      .filter((order) => {
                        const searchLower = orderSearchTerm.toLowerCase();
                        const matchesSearch =
                          orderSearchTerm === "" ||
                          order.customer.toLowerCase().includes(searchLower) ||
                          order.email.toLowerCase().includes(searchLower) ||
                          order.id.toLowerCase().includes(searchLower);

                        const matchesStatus =
                          orderFilterStatus === "all" ||
                          order.status === orderFilterStatus;

                        let matchesDate = true;
                        if (startDate || endDate) {
                          const orderDate = new Date(order.date);
                          orderDate.setHours(0, 0, 0, 0);

                          if (startDate) {
                            const start = new Date(startDate);
                            start.setHours(0, 0, 0, 0);
                            matchesDate = matchesDate && orderDate >= start;
                          }

                          if (endDate) {
                            const end = new Date(endDate);
                            end.setHours(23, 59, 59, 999);
                            matchesDate = matchesDate && orderDate <= end;
                          }
                        }

                        return matchesSearch && matchesStatus && matchesDate;
                      })
                      .map((order) => (
                        <tr key={order.id}>
                          <td className="order-id">{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.email}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>{order.items.length}</td>
                          <td className="order-total">
                            {formatCurrency(order.total)}
                          </td>
                          <td>
                            <span className={`status-badge ${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="action-small view"
                              onClick={() =>
                                openDetailModal("orderDetail", order, "order")
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-results">
                        <div className="empty-state">
                          <span className="empty-icon">🔍</span>
                          <p>No orders found</p>
                          <span className="empty-subtext">
                            Try adjusting your filters
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Modal */}
      {showUserModal && (
        <div className="modal-overlay">
          <div
            className="modal-content large"
            ref={modalRefs.user}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="All Users"
          >
            <div className="modal-header">
              <h2>👥 All Users</h2>
              <button className="modal-close" onClick={closeAllModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`status-badge ${user.role === "admin" ? "processing" : "completed"}`}
                        >
                          {user.role || "customer"}
                        </span>
                      </td>
                      <td>{user.orders}</td>
                      <td>{formatCurrency(user.totalSpent)}</td>
                      <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Modal */}
      {showRevenueModal && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            ref={modalRefs.revenue}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Revenue Details"
          >
            <div className="modal-header">
              <h2>💵 Revenue Details</h2>
              <button className="modal-close" onClick={closeAllModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="stats-detail">
                <div className="detail-item">
                  <label>Total Earned</label>
                  <span className="value">
                    {formatCurrency(stats.totalEarned)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Today's Sales</label>
                  <span className="value">
                    {formatCurrency(stats.todaySales)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Avg. Order Value</label>
                  <span className="value">
                    {formatCurrency(
                      stats.totalOrders
                        ? stats.totalRevenue / stats.totalOrders
                        : 0,
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Total Orders</label>
                  <span className="value">{stats.totalOrders}</span>
                </div>
              </div>
              <h4>Revenue by Day (Last 7 Days)</h4>
              <div className="mini-chart">
                {salesData.map((day, i) => (
                  <div key={i} className="chart-bar-container">
                    <div className="chart-bar-label">{day.date}</div>
                    <div className="chart-bar-wrapper">
                      <div
                        className="chart-bar"
                        style={{
                          width: `${salesData.some((d) => d.sales > 0) ? (day.sales / Math.max(...salesData.map((d) => d.sales))) * 100 : 0}%`,
                          backgroundColor: "#3498db",
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
              <button className="btn-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profit / Loss Modal */}
      {showProfitModal && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            ref={modalRefs.profit}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Profit & Loss Analysis"
          >
            <div className="modal-header">
              <h2>📈 Profit & Loss</h2>
              <button className="modal-close" onClick={closeAllModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="stats-detail">
                <div className="detail-item">
                  <label>Total Earned</label>
                  <span className="value">
                    {formatCurrency(stats.totalEarned)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Total Expenses</label>
                  <span className="value loss">
                    {formatCurrency(stats.totalExpenses)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Net {isNetPositive ? "Profit" : "Loss"}</label>
                  <span
                    className={`value ${isNetPositive ? "profit" : "loss"}`}
                  >
                    {isNetPositive ? "+" : "-"}
                    {formatCurrency(Math.abs(stats.netProfit))}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Profit Margin</label>
                  <span className="value">
                    {stats.totalEarned > 0
                      ? ((stats.netProfit / stats.totalEarned) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>

              <div className="pnl-summary">
                <div className="pnl-row earned">
                  <span>💵 Money Earned</span>
                  <span>{formatCurrency(stats.totalEarned)}</span>
                </div>
                <div className="pnl-row loss">
                  <span>💸 Money Spent</span>
                  <span>- {formatCurrency(stats.totalExpenses)}</span>
                </div>
                <div
                  className={`pnl-row ${isNetPositive ? "net-profit" : "net-loss"}`}
                >
                  <span>
                    <strong>= Net {isNetPositive ? "Profit" : "Loss"}</strong>
                  </span>
                  <span>
                    <strong>
                      {isNetPositive ? "+" : "-"}
                      {formatCurrency(Math.abs(stats.netProfit))}
                    </strong>
                  </span>
                </div>
              </div>

              <h4>Most Profitable Products</h4>
              <div className="profitable-products">
                {topProducts.map((product, i) => {
                  const prod = products.find(
                    (p) => p.id === parseInt(product.id),
                  );
                  const profit = prod
                    ? (prod.price - (prod.cost || prod.price * 0.6)) *
                      product.quantity
                    : product.revenue * 0.4;
                  return (
                    <div key={product.id} className="profit-item">
                      <span className="rank">{i + 1}</span>
                      <span className="name">{product.name}</span>
                      <span className="profit-amount">
                        {formatCurrency(profit)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Financial / Expense Ledger Modal */}
      {showFinancialModal && (
        <div className="modal-overlay">
          <div
            className="modal-content large"
            ref={modalRefs.financial}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Financial Report"
          >
            <div className="modal-header">
              <h2>💰 Financial Report</h2>
              <button className="modal-close" onClick={closeAllModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="financial-summary">
                <div className="fin-card earned">
                  <div className="fin-icon">💵</div>
                  <div>
                    <p className="fin-label">Total Earned</p>
                    <p className="fin-value">
                      {formatCurrency(stats.totalEarned)}
                    </p>
                    <p className="fin-sub">{stats.totalOrders} orders</p>
                  </div>
                </div>
                <div className="fin-card expenses">
                  <div className="fin-icon">💸</div>
                  <div>
                    <p className="fin-label">Total Expenses</p>
                    <p className="fin-value">
                      {formatCurrency(stats.totalExpenses)}
                    </p>
                    <p className="fin-sub">Product costs</p>
                  </div>
                </div>
                <div
                  className={`fin-card ${isNetPositive ? "profit" : "loss"}`}
                >
                  <div className="fin-icon">{isNetPositive ? "📈" : "📉"}</div>
                  <div>
                    <p className="fin-label">
                      Net {isNetPositive ? "Profit" : "Loss"}
                    </p>
                    <p className="fin-value">
                      {isNetPositive ? "+" : "-"}
                      {formatCurrency(Math.abs(stats.netProfit))}
                    </p>
                    <p className="fin-sub">
                      {isNetPositive ? "Profitable ✅" : "Loss ⚠️"}
                    </p>
                  </div>
                </div>
              </div>

              <h4>📋 Expense Ledger</h4>
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="no-data">
                        No expenses recorded yet.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr key={exp.id}>
                        <td>{new Date(exp.date).toLocaleDateString()}</td>
                        <td>
                          <span className="status-badge pending">
                            {exp.type === "restock" ? "Restock" : "Purchase"}
                          </span>
                        </td>
                        <td>{exp.description}</td>
                        <td className="loss-text">
                          {formatCurrency(exp.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan="3"
                      style={{ textAlign: "right", fontWeight: "bold" }}
                    >
                      Total:
                    </td>
                    <td className="loss-text">
                      <strong>{formatCurrency(stats.totalExpenses)}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {showInventoryModal && (
        <div className="modal-overlay">
          <div
            className="modal-content large"
            ref={modalRefs.inventory}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Inventory Management"
          >
            <div className="modal-header">
              <h2>📦 Inventory</h2>
              <button className="modal-close" onClick={closeAllModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.SKU || `SKU-${product.id}`}</td>
                      <td className={product.stock < 10 ? "stock-low" : ""}>
                        {product.stock}
                      </td>
                      <td>
                        {product.stock < 5
                          ? "🔴 Critical"
                          : product.stock < 10
                            ? "🟡 Warning"
                            : "🟢 Good"}
                      </td>
                      <td className="action-cell">
                        <button
                          className="action-small view"
                          onClick={() =>
                            openDetailModal(
                              "inventoryDetail",
                              product,
                              "inventory",
                            )
                          }
                        >
                          View
                        </button>
                        <button
                          className="action-small"
                          onClick={() =>
                            openDetailModal("restock", product, "inventory")
                          }
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
              <button className="btn-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Orders Modal */}
      {showPendingModal && (
        <div className="modal-overlay">
          <div
            className="modal-content large"
            ref={modalRefs.pending}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Pending Orders"
          >
            <div className="modal-header">
              <h2>⏳ Pending Orders</h2>
              <button className="modal-close" onClick={closeAllModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {orders.filter((o) => o.status === "pending").length === 0 ? (
                <p className="no-data">No pending orders! 🎉</p>
              ) : (
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Update Status</th>
                      <th>Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter((o) => o.status === "pending")
                      .map((order) => (
                        <tr key={order.id}>
                          <td className="order-id">{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.email}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>{formatCurrency(order.total)}</td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => {
                                handleUpdateOrderStatus(
                                  order.id,
                                  e.target.value,
                                );
                                setOrders((prevOrders) =>
                                  prevOrders.map((o) =>
                                    o.id === order.id
                                      ? { ...o, status: e.target.value }
                                      : o,
                                  ),
                                );
                              }}
                              className="status-select"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td>
                            <button
                              className="action-small view"
                              onClick={() =>
                                openDetailModal("orderDetail", order, "pending")
                              }
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sales Analysis Modal */}
      {showSalesModal && (
        <div className="modal-overlay">
          <div
            className="modal-content large"
            ref={modalRefs.sales}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Sales Analysis"
          >
            <div className="modal-header">
              <h2>📊 Sales Analysis</h2>
              <button className="modal-close" onClick={closeAllModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="stats-detail">
                <div className="detail-item">
                  <label>Today's Sales</label>
                  <span className="value">
                    {formatCurrency(stats.todaySales)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>7-Day Total</label>
                  <span className="value">
                    {formatCurrency(salesData.reduce((s, d) => s + d.sales, 0))}
                  </span>
                </div>
                <div className="detail-item">
                  <label>7-Day Profit</label>
                  <span className="value profit">
                    {formatCurrency(
                      salesData.reduce((s, d) => s + d.profit, 0),
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <label>7-Day Orders</label>
                  <span className="value">
                    {salesData.reduce((s, d) => s + d.orders, 0)}
                  </span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="sales" fill="#3498db" name="Sales" />
                  <Bar dataKey="profit" fill="#2ecc71" name="Profit" />
                </BarChart>
              </ResponsiveContainer>

              <h4>Daily Breakdown</h4>
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Orders</th>
                    <th>Sales</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((day, i) => (
                    <tr key={i}>
                      <td>{day.date}</td>
                      <td>{day.orders}</td>
                      <td>{formatCurrency(day.sales)}</td>
                      <td
                        className={
                          day.profit >= 0 ? "profit-text" : "loss-text"
                        }
                      >
                        {formatCurrency(day.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeAllModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODALS */}

      {/* Product Detail Modal */}
      {showProductDetailModal && selectedItem && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            ref={modalRefs.productDetail}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Product Details"
          >
            <div className="modal-header">
              <h2>📦 Product Details</h2>
              <button className="modal-close" onClick={closeDetailModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-view">
                <div className="detail-row">
                  <label>Name:</label>
                  <span>{selectedItem.name || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <label>Category:</label>
                  <span>{selectedItem.category || "N/A"}</span>
                </div>
                <div className="detail-row">
                  <label>Price:</label>
                  <span className="price">
                    {formatCurrency(selectedItem.price)}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Cost:</label>
                  <span>
                    {formatCurrency(
                      selectedItem.cost || selectedItem.price * 0.6,
                    )}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Profit/Unit:</label>
                  <span className="profit">
                    {formatCurrency(
                      selectedItem.price -
                        (selectedItem.cost || selectedItem.price * 0.6),
                    )}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Current Stock:</label>
                  <span className={selectedItem.stock < 10 ? "stock-low" : ""}>
                    {selectedItem.stock} units
                  </span>
                </div>
                <div className="detail-row">
                  <label>SKU:</label>
                  <span>{selectedItem.SKU || `SKU-${selectedItem.id}`}</span>
                </div>
                <div className="detail-row">
                  <label>Description:</label>
                  <span>
                    {selectedItem.description || "No description available"}
                  </span>
                </div>
                {selectedItem.image && (
                  <div className="detail-row">
                    <label>Image:</label>
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/200?text=No+Image";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => {
                  closeDetailModal();
                  openEditModal(selectedItem, parentModal);
                }}
              >
                ✏️ Edit
              </button>
              <button
                className="btn-warning"
                onClick={() => {
                  closeDetailModal();
                  openDetailModal("restock", selectedItem, parentModal);
                }}
              >
                📦 Restock
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDeleteProduct(selectedItem.id)}
              >
                🗑️ Delete
              </button>
              <button className="btn-secondary" onClick={closeDetailModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetailModal && selectedItem && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            ref={modalRefs.orderDetail}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Order Details"
          >
            <div className="modal-header">
              <h2>🛒 Order Details</h2>
              <button className="modal-close" onClick={closeDetailModal}>
                ×
              </button>
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
                  <span>
                    {new Date(selectedItem.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedItem.status}`}>
                    {selectedItem.status}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Payment:</label>
                  <span>{selectedItem.paymentMethod}</span>
                </div>
                <div className="detail-row">
                  <label>Shipping:</label>
                  <span>{selectedItem.shippingAddress}</span>
                </div>
              </div>

              <h4>Items Ordered:</h4>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItem.items && selectedItem.items.length > 0 ? (
                    selectedItem.items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan="3"
                      style={{ textAlign: "right", fontWeight: "bold" }}
                    >
                      Total:
                    </td>
                    <td style={{ fontWeight: "bold", color: "#2ecc71" }}>
                      {formatCurrency(selectedItem.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="status-update">
                <label>Update Status:</label>
                <select
                  value={selectedItem.status}
                  onChange={(e) => {
                    handleUpdateOrderStatus(selectedItem.id, e.target.value);
                    setSelectedItem({
                      ...selectedItem,
                      status: e.target.value,
                    });
                  }}
                  className="status-select"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="processing">⚙️ Processing</option>
                  <option value="shipped">🚚 Shipped</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeDetailModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Detail Modal */}
      {showInventoryDetailModal && selectedItem && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            ref={modalRefs.inventoryDetail}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Inventory Detail"
          >
            <div className="modal-header">
              <h2>📦 Inventory Detail</h2>
              <button className="modal-close" onClick={closeDetailModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div
                className={`inventory-alert-banner ${selectedItem.alertLevel}`}
              >
                {selectedItem.alertLevel === "critical"
                  ? "🔴 CRITICAL"
                  : selectedItem.alertLevel === "warning"
                    ? "🟡 WARNING"
                    : "🔵 NOTICE"}
              </div>
              <div className="detail-view">
                <div className="detail-row">
                  <label>Product:</label>
                  <span>{selectedItem.name}</span>
                </div>
                <div className="detail-row">
                  <label>SKU:</label>
                  <span>{selectedItem.SKU || `SKU-${selectedItem.id}`}</span>
                </div>
                <div className="detail-row">
                  <label>Category:</label>
                  <span>{selectedItem.category}</span>
                </div>
                <div className="detail-row">
                  <label>Current Stock:</label>
                  <span className="stock-low">{selectedItem.stock} units</span>
                </div>
                <div className="detail-row">
                  <label>Sell Price:</label>
                  <span className="price">
                    {formatCurrency(selectedItem.price)}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Cost Price:</label>
                  <span>
                    {formatCurrency(
                      selectedItem.cost || selectedItem.price * 0.6,
                    )}
                  </span>
                </div>
              </div>
              <div className="stock-bar large-bar">
                <div
                  className="stock-fill"
                  style={{
                    width: `${Math.min((selectedItem.stock / 50) * 100, 100)}%`,
                    backgroundColor:
                      selectedItem.alertLevel === "critical"
                        ? "#e74c3c"
                        : selectedItem.alertLevel === "warning"
                          ? "#f39c12"
                          : "#3498db",
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => {
                  closeDetailModal();
                  openDetailModal("restock", selectedItem, parentModal);
                }}
              >
                📦 Restock Now
              </button>
              <button className="btn-secondary" onClick={closeDetailModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            ref={modalRefs.addProduct}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Add New Product"
          >
            <div className="modal-header">
              <h2>➕ Add New Product</h2>
              <button className="modal-close" onClick={closeAllModals}>×</button>
            </div>
            <div className="modal-body">
              <div className="expense-notice">
                💸 <strong>Note:</strong> Adding a product records a business expense.
              </div>
              <form className="product-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g., EOS Vanilla Lotion"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="beauty-bodycare">Beauty & Body Care</option>
                    <option value="bathroom-essentials">Bathroom Essentials</option>
                    <option value="footwear">Footwear</option>
                    <option value="home-living">Home & Living</option>
                    <option value="electronics">Electronics</option>
                    <option value="apparel">Apparel</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Sub-Category</label>
                    <input
                      type="text"
                      value={newProduct.subCategory || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                      placeholder="e.g., lotion"
                    />
                  </div>
                  <div className="form-group">
                    <label>SKU *</label>
                    <input
                      type="text"
                      value={newProduct.SKU}
                      onChange={(e) => setNewProduct({ ...newProduct, SKU: e.target.value })}
                      placeholder="EOS-LOT-001"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Sell Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="12.99"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Cost Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.cost}
                      onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                      placeholder="7.50"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Initial Stock *</label>
                    <input
                      type="number"
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={newProduct.image || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows="3"
                    placeholder="Product description..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newProduct.tagsInput || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        tagsInput: e.target.value,
                        tags: e.target.value.split(",").map((tag) => tag.trim()).filter((tag) => tag),
                      })
                    }
                    placeholder="eos, lotion, vanilla"
                  />
                </div>

                {/* NEW: Size Management Section */}
                <div className="form-group sizes-section">
                  <label>📏 Sizes & Stock (optional)</label>
                  <p className="sizes-help">
                    Add sizes if this product comes in multiple sizes (e.g., S, M, L, XL).
                    Leave empty for products without size variants.
                  </p>
                  {newProduct.sizes.map((entry, index) => (
                    <div key={index} className="size-row">
                      <input
                        type="text"
                        placeholder="Size (e.g., S, M, L)"
                        value={entry.size}
                        onChange={(e) => {
                          const updated = [...newProduct.sizes];
                          updated[index].size = e.target.value;
                          setNewProduct({ ...newProduct, sizes: updated });
                        }}
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Stock"
                        value={entry.stock}
                        onChange={(e) => {
                          const updated = [...newProduct.sizes];
                          updated[index].stock = parseInt(e.target.value) || 0;
                          setNewProduct({ ...newProduct, sizes: updated });
                        }}
                      />
                      <button
                        type="button"
                        className="remove-size-btn"
                        onClick={() => {
                          const updated = newProduct.sizes.filter((_, i) => i !== index);
                          setNewProduct({ ...newProduct, sizes: updated });
                        }}
                        aria-label="Remove size"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-size-btn"
                    onClick={() => {
                      setNewProduct({
                        ...newProduct,
                        sizes: [...newProduct.sizes, { size: "", stock: 0 }]
                      });
                    }}
                  >
                    + Add Size
                  </button>
                </div>

                {newProduct.cost && newProduct.stock && (
                  <div className="expense-preview">
                    <strong>📊 Investment Summary:</strong>
                    <div>
                      Total Cost: {formatCurrency(
                        parseFloat(newProduct.cost || 0) * parseInt(newProduct.stock || 0)
                      )}
                    </div>
                    <div>
                      Expected Revenue: {formatCurrency(
                        parseFloat(newProduct.price || 0) * parseInt(newProduct.stock || 0)
                      )}
                    </div>
                    <div>
                      Potential Profit: {formatCurrency(
                        (parseFloat(newProduct.price || 0) - parseFloat(newProduct.cost || 0)) *
                          parseInt(newProduct.stock || 0)
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={handleAddProduct}
                disabled={
                  !newProduct.name ||
                  !newProduct.category ||
                  !newProduct.price ||
                  !newProduct.cost ||
                  !newProduct.stock ||
                  !newProduct.SKU ||
                  !newProduct.description
                }
              >
                Add Product
              </button>
              <button className="btn-secondary" onClick={closeAllModals}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && selectedItem && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            ref={modalRefs.editProduct}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Edit Product"
          >
            <div className="modal-header">
              <h2>✏️ Edit Product</h2>
              <button className="modal-close" onClick={closeDetailModal}>×</button>
            </div>
            <div className="modal-body">
              <form className="product-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={editProduct.name}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={editProduct.category_id}
                    onChange={(e) => setEditProduct({ ...editProduct, category_id: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="beauty-bodycare">Beauty & Body Care</option>
                    <option value="bathroom-essentials">Bathroom Essentials</option>
                    <option value="footwear">Footwear</option>
                    <option value="home-living">Home & Living</option>
                    <option value="electronics">Electronics</option>
                    <option value="apparel">Apparel</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Sub-Category</label>
                    <input
                      type="text"
                      value={editProduct.subcategory_id || ""}
                      onChange={(e) => setEditProduct({ ...editProduct, subcategory_id: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>SKU *</label>
                    <input
                      type="text"
                      value={editProduct.SKU}
                      onChange={(e) => setEditProduct({ ...editProduct, SKU: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Sell Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Cost Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editProduct.cost}
                      onChange={(e) => setEditProduct({ ...editProduct, cost: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      min="0"
                      value={editProduct.stock_quantity}
                      onChange={(e) => setEditProduct({ ...editProduct, stock_quantity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={editProduct.image || ""}
                      onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={editProduct.description}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    rows="3"
                    required
                  />
                </div>

                {/* Size Management Section (Edit) */}
                <div className="form-group sizes-section">
                  <label>📏 Sizes & Stock</label>
                  <p className="sizes-help">
                    Modify sizes and their available stock.
                  </p>
                  {editProduct.sizes.map((entry, index) => (
                    <div key={index} className="size-row">
                      <input
                        type="text"
                        placeholder="Size (e.g., S, M, L)"
                        value={entry.size}
                        onChange={(e) => {
                          const updated = [...editProduct.sizes];
                          updated[index].size = e.target.value;
                          setEditProduct({ ...editProduct, sizes: updated });
                        }}
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Stock"
                        value={entry.stock}
                        onChange={(e) => {
                          const updated = [...editProduct.sizes];
                          updated[index].stock = parseInt(e.target.value) || 0;
                          setEditProduct({ ...editProduct, sizes: updated });
                        }}
                      />
                      <button
                        type="button"
                        className="remove-size-btn"
                        onClick={() => {
                          const updated = editProduct.sizes.filter((_, i) => i !== index);
                          setEditProduct({ ...editProduct, sizes: updated });
                        }}
                        aria-label="Remove size"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-size-btn"
                    onClick={() => {
                      setEditProduct({
                        ...editProduct,
                        sizes: [...editProduct.sizes, { sizes: "", stock_quantity: 0 }]
                      });
                    }}
                  >
                    + Add Size
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={handleEditProduct}>
                Save Changes
              </button>
              <button className="btn-secondary" onClick={closeDetailModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && selectedItem && (
        <div className="modal-overlay">
          <div
            className="modal-content small"
            ref={modalRefs.restock}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-label="Restock Product"
          >
            <div className="modal-header">
              <h2>📦 Restock Product</h2>
              <button className="modal-close" onClick={closeDetailModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Product:</strong> {selectedItem.name}
              </p>
              <p>
                <strong>Current Stock:</strong> {selectedItem.stock} units
              </p>
              <p>
                <strong>Cost per unit:</strong>{" "}
                {formatCurrency(selectedItem.cost || selectedItem.price * 0.6)}
              </p>
              <div className="form-group">
                <label>Quantity to Add:</label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount[selectedItem.id] || ""}
                  onChange={(e) =>
                    setRestockAmount({
                      ...restockAmount,
                      [selectedItem.id]: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter quantity"
                />
              </div>
              {restockAmount[selectedItem.id] > 0 && (
                <div className="expense-preview">
                  💸 Restock expense:{" "}
                  <strong>
                    {formatCurrency(
                      (selectedItem.cost || selectedItem.price * 0.6) *
                        restockAmount[selectedItem.id],
                    )}
                  </strong>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() =>
                  handleRestock(
                    selectedItem.id,
                    restockAmount[selectedItem.id] || 0,
                  )
                }
                disabled={
                  !restockAmount[selectedItem.id] ||
                  restockAmount[selectedItem.id] < 1
                }
              >
                Confirm Restock
              </button>
              <button className="btn-secondary" onClick={closeDetailModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminDashboard;