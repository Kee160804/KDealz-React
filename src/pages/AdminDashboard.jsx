// AdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../services/orderService";
/* OLD CODE (COMMENTED OUT): No longer needed - users will not be stored/managed
import { getAllUsers } from "../services/userService";
*/
/* OLD CODE (COMMENTED OUT): Login modal moved to Header component
// The Header component now handles admin authentication with Supabase
// The login modal is in Header.jsx and uses signInAdmin() from userService
// This AdminDashboard now only checks if user is authenticated before rendering
import {
  signInAdmin,
  signOutAdmin,
  isCurrentUserAdmin,
  getCurrentSupabaseUser,
  onAuthStateChange,
} from "../services/userService";
*/
import { getAllExpenses, addExpense } from "../services/expenseService";
import {
  getAllCategories,
  getAllSubcategories,
  getSubcategoriesByCategoryId,
  /* NEW CODE - Import the addCategory function to enable category creation
  This allows admins to dynamically add new product categories without 
  needing to manually add them to the database.
  */
  addCategory,
  /* NEW CODE - Import the deleteCategory function to enable category deletion
  This allows admins to remove categories that are no longer needed.
  */
  deleteCategory,
} from "../services/categoryService";

// NEW CODE: Receive user prop from parent component (App.jsx)
// This is needed to check if user is authenticated before showing dashboard
const AdminDashboard = ({ user }) => {
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
  const [showInventoryDetailModal, setShowInventoryDetailModal] =
    useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showFinancialModal, setShowFinancialModal] = useState(false);

  /* NEW CODE - Add state for the category management modal and new category name input
  This allows admins to add new categories through a user interface.
  */
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  /* OLD CODE (COMMENTED OUT): Authentication states and login modal moved to Header component
  The Header component now handles admin login with real Supabase authentication
  This dashboard now relies on the parent App component to pass the authenticated user
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  */

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

  // Chart time filter states
  const [revenueFilter, setRevenueFilter] = useState("all"); // "today", "7days", "30days", "all"
  const [profitFilter, setProfitFilter] = useState("all"); // "today", "7days", "30days", "all"
  const [salesChartFilter, setSalesChartFilter] = useState("7days"); // "today", "7days", "30days", "custom"
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

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
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // --- Transform a raw product from Supabase into the shape used by the admin ---

  const transformProduct = (rawProduct) => {
    // Parse sizes (could be JSON array or comma‑separated string)
    let sizes = [];
    if (rawProduct.sizes) {
      if (typeof rawProduct.sizes === "string") {
        try {
          sizes = JSON.parse(rawProduct.sizes);
        } catch {
          // Fallback: treat as comma‑separated list
          sizes = rawProduct.sizes.split(",").map((s) => s.trim());
        }
      } else if (Array.isArray(rawProduct.sizes)) {
        sizes = rawProduct.sizes;
      }
    }

    // Parse available_Sizes – first check the actual column name (capital S)
    let availableSizes = {};
    // Use the correct column name (capital S) first, fallback to lowercase
    const availableSizesRaw =
      rawProduct.available_Sizes !== undefined
        ? rawProduct.available_Sizes
        : rawProduct.available_sizes; // fallback (if any lowercase data exists)

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

    return {
      ...rawProduct,
      stock_quantity: rawProduct.stock_quantity,
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
      } else if (typeof product.sizes === "string") {
        try {
          sizesArray = JSON.parse(product.sizes);
        } catch {
          sizesArray = product.sizes.split(",").map((s) => s.trim());
        }
      }
    }

    if (product.availableSizes) {
      availableObj = product.availableSizes;
    } else if (product.available_sizes) {
      if (typeof product.available_sizes === "object") {
        availableObj = product.available_sizes;
      } else if (typeof product.available_sizes === "string") {
        try {
          availableObj = JSON.parse(product.available_sizes);
        } catch {
          availableObj = {};
        }
      }
    } else if (product.available_Sizes) {
      // fallback for capital S
      if (typeof product.available_Sizes === "object") {
        availableObj = product.available_Sizes;
      } else if (typeof product.available_Sizes === "string") {
        try {
          availableObj = JSON.parse(product.available_Sizes);
        } catch {
          availableObj = {};
        }
      }
    }

    if (sizesArray.length > 0) {
      sizesArray.forEach((size) => {
        entries.push({
          size: size,
          stock_quantity: availableObj[size] || 0,
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
    subcategory_id: "",
    sizes: [],
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
    sizes: [],
  });

  const [restockAmount, setRestockAmount] = useState({});

  // --- TanStack Query Mutations ---
  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, newStock }) => updateStock(id, newStock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
    showFinancialModal ||
    /* NEW CODE - Include the add category modal in the anyModalOpen check
    This ensures proper scroll locking and focus management when the modal is open
    */
    showAddCategoryModal;

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

  // Load initial dashboard data on mount
  useEffect(() => {
    // NEW CODE: Simple auth check - if no user or user isn't admin, redirect
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  // Load categories and subcategories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categories = await getAllCategories();
      const subcategories = await getAllSubcategories();
      setCategoryList(categories || []);
      setSubcategoryList(subcategories || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Reprocess chart data when categoryList changes
  useEffect(() => {
    if (products.length > 0 && categoryList.length > 0) {
      processChartData(orders, products);
    }
  }, [categoryList, products, orders ]);

  // Load order items when order detail modal opens
  useEffect(() => {
    if (showOrderDetailModal && selectedItem?.id) {
      const loadOrderItems = async () => {
        try {
          console.log(`📦 Loading items for order ${selectedItem.id}...`);
          const allOrders = await getAllOrders();
          const updatedOrder = allOrders.find((o) => o.id === selectedItem.id);

          if (updatedOrder) {
            console.log(
              `✅ Found order with ${updatedOrder.items?.length || 0} items`,
            );
            setSelectedItem(updatedOrder);
          }
        } catch (error) {
          console.error("Error loading order items:", error);
        }
      };

      loadOrderItems();
    }
  }, [showOrderDetailModal, selectedItem?.id]);

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
    if (showPendingModal) return "pending_confirmation";
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
      /* OLD CODE (COMMENTED OUT): No longer needed - no users to load
      const loadedUsers = await getAllUsers();
      */
      const loadedExpenses = await getAllExpenses();
      const loadedOrders = await getAllOrders();

      const loadedProducts = loadedProductsRaw.map(transformProduct);

      setProducts(loadedProducts);
      setOrders(loadedOrders);
      /* OLD CODE (COMMENTED OUT): No longer needed - no users to set
      setUsers(loadedUsers);
      */
      setExpenses(loadedExpenses);

      /* NEW CODE: Update calculateStats to not use users parameter */
      calculateStats(loadedProducts, loadedOrders, loadedExpenses);
      processChartData(loadedOrders, loadedProducts);
      findLowStockAlerts(loadedProducts);
      getTopProducts(loadedOrders, loadedProducts);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      alert("Failed to load dashboard data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  // Stats functions (unchanged logic, but using correct fields)
  /* OLD CODE (COMMENTED OUT): Removed users parameter since we don't have user accounts
  const calculateStats = (products, orders, users, expensesList) => {
  */
  // NEW CODE: Updated to not require users parameter
  const calculateStats = (products, orders, expensesList) => {
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

    const pendingOrders = orders.filter(
      (o) => o.status === "pending_confirmation",
    ).length;
    const lowStockItems = products.filter((p) => p.stock_quantity < 10).length;

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      /* OLD CODE (COMMENTED OUT): No longer needed - no users in the system
      totalUsers: users.length,
      */
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

    /* OLD CODE - This was showing orders in reverse, but since getAllOrders already returns 
    data sorted by created_at descending (latest first), the slice(-5).reverse() was undoing that
    and showing the oldest 5 orders first, which defeats the purpose of "Recent Orders"
    
    NEW CODE - Now we simply take the first 5 orders from the already-sorted list, which gives us
    the 5 most recent orders in descending order (newest first).
    This is the correct behavior for a "Recent Orders" section.
    */
    // CORRECTED: Simply slice the first 5 from the already-sorted orders (newest first)
    setRecentOrders(orders.slice(0, 5));
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

    /* OLD CODE - Previously used category_id (number) as the key
    const categories = {};
    products.forEach((product) => {
      const cat = product.category_id || "Uncategorized";
      if (!categories[cat])
        categories[cat] = { name: cat, value: 0, revenue: 0, stock: 0 };
    });
    
    NEW CODE - Now uses actual category NAME from the category object
    This allows the pie chart to display readable category names like "Apparel" 
    instead of category IDs like "1" or "2"
    
    We get the category name from either:
    1. product.category.name (if category data is joined in the query)
    2. OR we look up the category name from categoryList state
    */
    const categories = {};
    products.forEach((product) => {
      // Get category name from the product's category object
      let categoryName = "Uncategorized";

      if (product.category && product.category.name) {
        // If category name is already in product object, use it
        categoryName = product.category.name;
      } else if (product.category_id) {
        // Otherwise, look up category name from categoryList
        const foundCategory = categoryList.find(
          (cat) => cat.id === product.category_id,
        );
        if (foundCategory) {
          categoryName = foundCategory.name;
        }
      }

      if (!categories[categoryName])
        categories[categoryName] = {
          name: categoryName,
          value: 0,
          revenue: 0,
          stock: 0,
        };
      categories[categoryName].value += 1;
      categories[categoryName].stock_quantity += product.stock_quantity;
      const rev = orders.reduce((sum, order) => {
        const item = order.items.find((i) => i.productId === product.id);
        return sum + (item ? item.price * item.quantity : 0);
      }, 0);
      categories[categoryName].revenue += rev;
    });
    setCategoryData(Object.values(categories));
  };

  const findLowStockAlerts = (products) => {
    const alerts = products
      .filter((p) => p.stock_quantity < 20)
      .map((p) => ({
        ...p,
        alertLevel:
          p.stock_quantity < 5
            ? "critical"
            : p.stock_quantity < 10
              ? "warning"
              : "notice",
      }))
      .sort((a, b) => a.stock_quantity - b.stock_quantity)
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
          stock_quantity: product.stock_quantity || 0,
          price: product.price || 0,
          category_id: product.category_id || "Unknown",
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
      productCategoryFilter === "all" ||
      product.category_id === productCategoryFilter;
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
      case "pending_confirmation":
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

  const openEditModal = (product, parent) => {
    setSelectedItem(product);
    setParentModal(parent);
    const sizes = parseSizesToEntries(product);
    setEditProduct({
      name: product.name || "",
      category_id: product.category_id || "",
      price: product.price?.toString() || "",
      cost: (product.cost || product.price * 0.6)?.toString() || "",
      stock_quantity: product.stock_quantity?.toString() || "",
      SKU: product.SKU || `SKU-${product.id}`,
      description: product.description || "",
      image: product.image || "",
      subcategory_id: product.subcategory_id || "",
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
      subcategory_id: "",
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

  // Handlers with mutations
  const handleAddProduct = async () => {
    try {
      const sizesArray = newProduct.sizes
        .map((entry) => entry.size.trim())
        .filter((size) => size !== "");
      const availableSizesObj = {};
      newProduct.sizes.forEach((entry) => {
        if (entry.size.trim() !== "") {
          availableSizesObj[entry.size.trim()] = entry.stock_quantity;
        }
      });

      const productToAdd = {
        name: newProduct.name,
        category_id: parseInt(newProduct.category_id) || null,
        subcategory_id: newProduct.subcategory_id
          ? parseInt(newProduct.subcategory_id)
          : null,
        price: parseFloat(newProduct.price),
        cost: parseFloat(newProduct.cost),
        stock_quantity: parseInt(newProduct.stock_quantity),
        SKU: newProduct.SKU,
        description: newProduct.description,
        image: newProduct.image || "https://via.placeholder.com/500",
        sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
        available_Sizes:
          sizesArray.length > 0 ? JSON.stringify(availableSizesObj) : null, // ✅ capital S
      };

      // const productToAdd = {
      //   name: newProduct.name,
      //   category_id: parseInt(newProduct.category_id) || null,
      //   subcategory_id: newProduct.subcategory_id ? parseInt(newProduct.subcategory_id) : null,
      //   price: parseFloat(newProduct.price),
      //   cost: parseFloat(newProduct.cost),
      //   stock_quantity: parseInt(newProduct.stock_quantity),
      //   SKU: newProduct.SKU,
      //   description: newProduct.description,
      //   image: newProduct.image || "https://via.placeholder.com/500",
      //   sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
      //   available_sizes: sizesArray.length > 0 ? JSON.stringify(availableSizesObj) : null, // always use lowercase in payload
      // };

      console.log("Adding product with payload:", productToAdd);

      const addedProduct = await addProductMutation.mutateAsync(productToAdd);

      const expenseEntry = {
        type: "product_purchase",
        description: `Added product: ${newProduct.name} (${newProduct.stock_quantity} units × $${newProduct.cost})`,
        amount:
          parseFloat(newProduct.cost) * parseInt(newProduct.stock_quantity),
        productId: addedProduct.id,
      };
      await addExpense(expenseEntry);

      await loadDashboardData();
      closeAllModals();
      alert(`✅ Product "${newProduct.name}" added!`);
    } catch (error) {
      console.error("Error adding product:", error);
      alert(`Failed to add product: ${error.message}`);
    }
  };

  const handleEditProduct = async () => {
    try {
      const sizesArray = editProduct.sizes
        .map((entry) => entry.size.trim())
        .filter((size) => size !== "");
      const availableSizesObj = {};
      editProduct.sizes.forEach((entry) => {
        if (entry.size.trim() !== "") {
          availableSizesObj[entry.size.trim()] = entry.stock_quantity;
        }
      });

      const updatedData = {
        name: editProduct.name,
        category_id: parseInt(editProduct.category_id) || null,
        subcategory_id: editProduct.subcategory_id
          ? parseInt(editProduct.subcategory_id)
          : null,
        price: parseFloat(editProduct.price),
        cost: parseFloat(editProduct.cost),
        stock_quantity: parseInt(editProduct.stock_quantity),
        SKU: editProduct.SKU,
        description: editProduct.description,
        image: editProduct.image,
        sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
        available_Sizes:
          sizesArray.length > 0 ? JSON.stringify(availableSizesObj) : null, // ✅ capital S
      };

      // const updatedData = {
      //   name: editProduct.name,
      //   category_id: parseInt(editProduct.category_id) || null,
      //   subcategory_id: editProduct.subcategory_id ? parseInt(editProduct.subcategory_id) : null,
      //   price: parseFloat(editProduct.price),
      //   cost: parseFloat(editProduct.cost),
      //   stock_quantity: parseInt(editProduct.stock_quantity),
      //   SKU: editProduct.SKU,
      //   description: editProduct.description,
      //   image: editProduct.image,
      //   sizes: sizesArray.length > 0 ? JSON.stringify(sizesArray) : null,
      //   available_sizes: sizesArray.length > 0 ? JSON.stringify(availableSizesObj) : null, // always lowercase
      // };

      console.log(
        "Updating product ID",
        selectedItem.id,
        "with payload:",
        updatedData,
      );

      await updateProductMutation.mutateAsync({
        id: selectedItem.id,
        data: updatedData,
      });

      await loadDashboardData();
      closeDetailModal();
      alert("✅ Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert(`Failed to update product: ${error.message}`);
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
      await loadDashboardData();
      closeDetailModal();
      alert("🗑️ Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(`Failed to delete product: ${error.message}`);
    }
  };

  const handleRestock = async (productId, amount) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product || amount < 1) return;

      const newStock = product.stock_quantity + amount;
      await updateStockMutation.mutateAsync({ id: productId, newStock });

      const expenseEntry = {
        type: "restock",
        description: `Restocked: ${product.name} (+${amount} units × $${product.cost || product.price * 0.6})`,
        amount: (product.cost || product.price * 0.6) * amount,
        productId,
      };
      await addExpense(expenseEntry);

      await loadDashboardData();
      closeDetailModal();
      alert(`✅ Restocked ${amount} units.`);
    } catch (error) {
      console.error("Error restocking product:", error);
      alert(`Failed to restock: ${error.message}`);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadDashboardData();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(`Failed to update order status: ${error.message}`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (
      !window.confirm(
        "⚠️ Are you sure you want to DELETE this order? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      console.log(`🗑️ Deleting order ${orderId}...`);
      await deleteOrder(orderId);
      alert("✅ Order deleted successfully!");
      closeDetailModal();
      await loadDashboardData();
    } catch (error) {
      console.error("Error deleting order:", error);
      alert(`❌ Failed to delete order: ${error.message}`);
    }
  };

  /* NEW CODE - Handler for adding a new category
  This function takes the category name from the input field, validates it,
  and sends it to the database via the addCategory service function.
  After successful creation, it:
  1. Clears the input field
  2. Reloads the dashboard data to reflect the new category
  3. Closes the modal
  4. Displays a success message
  */
  const handleAddCategory = async () => {
    try {
      // Validate that category name is not empty
      if (!newCategoryName.trim()) {
        alert("Please enter a category name");
        return;
      }

      setAddingCategory(true);

      // Call the addCategory service function from categoryService.js
      const createdCategory = await addCategory(newCategoryName.trim());

      alert(`✅ Category "${createdCategory.name}" added successfully!`);

      // Reload category data
      loadCategories();

      // Clear the input field
      setNewCategoryName("");

      // Close the modal
      setShowAddCategoryModal(false);

      // Reload the dashboard data to include the new category
      await loadDashboardData();
    } catch (error) {
      console.error("Error adding category:", error);
      alert(`❌ Failed to add category: ${error.message}`);
    } finally {
      setAddingCategory(false);
    }
  };

  /* NEW CODE - Handler for deleting a category
  This function allows admins to delete categories that are no longer needed.
  When a category is deleted:
  1. User confirms the action with a warning dialog
  2. Category is removed from database
  3. Dashboard data is refreshed to reflect changes
  4. Category dropdowns are updated automatically
  */
  const handleDeleteCategory = async (categoryId, categoryName) => {
    try {
      // Confirm before deleting
      if (
        !window.confirm(
          `⚠️ Are you sure you want to DELETE the category "${categoryName}"? This action cannot be undone.`,
        )
      ) {
        return; // User cancelled
      }

      // Call the deleteCategory service function
      await deleteCategory(categoryId);

      alert(`✅ Category "${categoryName}" deleted successfully!`);

      // Reload the dashboard data to reflect the deletion
      await loadDashboardData();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(`❌ Failed to delete category: ${error.message}`);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);

  // Helper function to filter sales data by time period
  const filterSalesDataByPeriod = (data, filterType) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return data.filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      const daysAgo = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));

      if (filterType === "today") return daysAgo === 0;
      if (filterType === "7days") return daysAgo >= 0 && daysAgo < 7;
      if (filterType === "30days") return daysAgo >= 0 && daysAgo < 30;
      return true; // "all"
    });
  };

  // Helper function to filter sales data by custom date range
  const getFilteredSalesData = () => {
    if (salesChartFilter === "custom" && customStartDate && customEndDate) {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      endDate.setHours(23, 59, 59, 999);

      return salesData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    return filterSalesDataByPeriod(salesData, salesChartFilter);
  };

  // Helper function to get orders from last 30 days
  const getLast30DaysOrders = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    return orders.filter((order) => {
      const orderDate = new Date(order.date || order.created_at);
      return orderDate >= thirtyDaysAgo;
    });
  };

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
              openModal("_pending_confirmation");
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
          {/* OLD CODE (COMMENTED OUT): Logout button and email display moved to Header component
          The Header now shows the user's email and has the logout button
          {currentAdmin && (
            <p className="admin-email-display">
              Logged in as: <strong>{currentAdmin.email}</strong>
            </p>
          )}
          */}
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
          {/* OLD CODE (COMMENTED OUT): Logout button moved to Header component
          <button
            className="btn-logout"
            onClick={handleAdminLogout}
            disabled={loginLoading}
            title="Sign out of admin dashboard"
          >
            🚪 Logout
          </button>
          */}
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
        {/* OLD CODE (COMMENTED OUT): Users stat card removed - no user accounts in open ordering system
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
        */}
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
        <div
          className="stat-card pending_confirmation"
          onClick={() => openModal("pending_confirmation")}
        >
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <p className="stat-value pending_confirmation">
              {stats.pendingOrders}
            </p>
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
                label={({ name, value }) => {
                  /* OLD CODE - Previously displayed: "Apparel - 10 products (15%)"
                  const total = categoryData.reduce(
                    (sum, item) => sum + item.value,
                    0,
                  );
                  const percent = ((value / total) * 100).toFixed(1);
                  return `${name} - ${value} product${value > 1 ? "s" : ""} (${percent}%)`;
                  
                  NEW CODE - FIXED: Now displays EXACTLY what user wants: "Apparel 25%"
                  This is cleaner, simpler, and more professional looking on the pie chart.
                  Formula: Calculate percentage = (value / total) * 100, then round to 1 decimal
                  Example output: "Apparel 25%" or "Electronics 15.5%"
                  */
                  const total = categoryData.reduce(
                    (sum, item) => sum + item.value,
                    0,
                  );
                  const percent = ((value / total) * 100).toFixed(0); // Round to whole number
                  // Format: "Category Name Percentage%"
                  return `${name} ${percent}%`;
                }}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  const total = categoryData.reduce(
                    (sum, item) => sum + item.value,
                    0,
                  );
                  const percent = ((value / total) * 100).toFixed(1);
                  return [
                    `${value} products (${percent}%)`,
                    props.payload.name,
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* NEW CODE - Add button for category management in the pie chart footer
          This provides easy access to add new categories from the dashboard overview.
          The button triggers the add category modal.
          */}
          <div className="chart-footer">
            <span>Click to manage categories →</span>
            <button
              className="action-btn"
              onClick={() => setShowAddCategoryModal(true)}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                fontSize: "0.9em",
              }}
              title="Add a new product category"
            >
              ➕ Add Category
            </button>
          </div>
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
                      width: `${Math.min((product.stock_quantity / 20) * 100, 100)}%`,
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
                  Current Stock: <strong>{product.stock_quantity} units</strong>
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
          <button
            className="action-btn"
            onClick={() => openModal("pending_confirmation")}
          >
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
              <button className="modal-close" onClick={closeAllModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {/* NEW CODE - Add search and filter functionality to products modal
              Similar to the orders modal, this allows admins to:
              1. Search products by name (real-time search)
              2. Filter products by category to narrow down the view
              3. Clear filters to reset the view
              
              This makes it much easier to find specific products in a large inventory.
              */}
              <div className="order-filters" style={{ marginBottom: "20px" }}>
                <div className="filters-container">
                  <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search products by name or SKU..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    {productSearchTerm && (
                      <button
                        className="clear-search"
                        onClick={() => setProductSearchTerm("")}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="filter-dropdown">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="category-select"
                    >
                      <option value="all">All Categories</option>
                      {categoryList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(productSearchTerm || productCategoryFilter !== "all") && (
                    <button
                      className="clear-filters-btn"
                      onClick={() => {
                        setProductSearchTerm("");
                        setProductCategoryFilter("all");
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category ID</th>
                    <th>Price</th>
                    <th>Cost</th>
                    <th>Stock</th>
                    <th>SKU</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    /* Filter products based on search term and category filter
                    Search works on product name and SKU (case-insensitive)
                    Category filter checks if product's category_id matches the selected filter
                    */
                    .filter((product) => {
                      const matchesSearch =
                        product.name
                          .toLowerCase()
                          .includes(productSearchTerm.toLowerCase()) ||
                        (product.SKU || `SKU-${product.id}`)
                          .toLowerCase()
                          .includes(productSearchTerm.toLowerCase());

                      const matchesCategory =
                        productCategoryFilter === "all" ||
                        product.category_id === parseInt(productCategoryFilter);

                      return matchesSearch && matchesCategory;
                    })
                    .map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.category_id}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>
                          {formatCurrency(product.cost || product.price * 0.6)}
                        </td>
                        <td
                          className={
                            product.stock_quantity < 10 ? "stock-low" : ""
                          }
                        >
                          {product.stock_quantity}
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
                    ))}
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
                    <option value="cancelled">❌ Cancelled</option>
                    <option value="pending_confirmation">
                      ⏳ Pending Confirmation
                    </option>
                    <option value="processing">⚙️ Processing</option>
                    <option value="shipped">🚚 Shipped</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>
                <button
                  className="date-filter-btn"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <span>📅</span>{" "}
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
                    <th>Sizes</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((order) => {
                      const searchLower = orderSearchTerm.toLowerCase();
                      const matchesSearch =
                        orderSearchTerm === "" ||
                        order.customer?.toLowerCase().includes(searchLower) ||
                        order.email?.toLowerCase().includes(searchLower) ||
                        order.id?.toString().includes(searchLower);
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
                    .map((order) => {
                      // Get sizes from items
                      const sizes =
                        order.items
                          ?.map((item) => item.size || "-")
                          .filter((s) => s !== "-")
                          .join(", ") || "-";
                      return (
                        <tr key={order.id}>
                          <td className="order-id">{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.email}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>{order.items?.length || 0}</td>
                          <td>{sizes}</td>
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
                      );
                    })}
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
              {/* Time Filter Buttons */}
              <div
                className="filter-buttons"
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => setRevenueFilter("today")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      revenueFilter === "today" ? "#3498db" : "#ecf0f1",
                    color: revenueFilter === "today" ? "white" : "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: revenueFilter === "today" ? "bold" : "normal",
                  }}
                >
                  Today
                </button>
                <button
                  onClick={() => setRevenueFilter("7days")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      revenueFilter === "7days" ? "#3498db" : "#ecf0f1",
                    color: revenueFilter === "7days" ? "white" : "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: revenueFilter === "7days" ? "bold" : "normal",
                  }}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setRevenueFilter("30days")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      revenueFilter === "30days" ? "#3498db" : "#ecf0f1",
                    color: revenueFilter === "30days" ? "white" : "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: revenueFilter === "30days" ? "bold" : "normal",
                  }}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => setRevenueFilter("all")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      revenueFilter === "all" ? "#3498db" : "#ecf0f1",
                    color: revenueFilter === "all" ? "white" : "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: revenueFilter === "all" ? "bold" : "normal",
                  }}
                >
                  All Time
                </button>
              </div>

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
              <h4>Revenue by Day</h4>
              <div className="mini-chart">
                {filterSalesDataByPeriod(salesData, revenueFilter).map(
                  (day, i) => (
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
                  ),
                )}
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
              {/* Time Filter Buttons */}
              <div
                className="filter-buttons"
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => setProfitFilter("today")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      profitFilter === "today" ? "#3498db" : "#ecf0f1",
                    color: profitFilter === "today" ? "white" : "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: profitFilter === "today" ? "bold" : "normal",
                  }}
                >
                  Today
                </button>
                <button
                  onClick={() => setProfitFilter("7days")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      profitFilter === "7days" ? "#3498db" : "#ecf0f1",
                    color: profitFilter === "7days" ? "white" : "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: profitFilter === "7days" ? "bold" : "normal",
                  }}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setProfitFilter("30days")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      profitFilter === "30days" ? "#3498db" : "#ecf0f1",
                    color: profitFilter === "30days" ? "white" : "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: profitFilter === "30days" ? "bold" : "normal",
                  }}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => setProfitFilter("all")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      profitFilter === "all" ? "#3498db" : "#ecf0f1",
                    color: profitFilter === "all" ? "white" : "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: profitFilter === "all" ? "bold" : "normal",
                  }}
                >
                  All Time
                </button>
              </div>

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
                          <span className="status-badge pending_confirmation">
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
                      <td
                        className={
                          product.stock_quantity < 10 ? "stock-low" : ""
                        }
                      >
                        {product.stock_quantity}
                      </td>
                      <td>
                        {product.stock_quantity < 5
                          ? "🔴 Critical"
                          : product.stock_quantity < 10
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
            ref={modalRefs.pending_confirmation}
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
              {orders.filter((o) => o.status === "pending_confirmation")
                .length === 0 ? (
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
                      .filter((o) => o.status === "pending_confirmation")
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
                              }}
                              className="status-select"
                            >
                              <option value="cancelled">Cancelled</option>
                              <option value="pending_confirmation">
                                Pending Confirmation
                              </option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td>
                            <button
                              className="action-small view"
                              onClick={() =>
                                openDetailModal(
                                  "orderDetail",
                                  order,
                                  "pending_confirmation",
                                )
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
              {/* Date Range Filter */}
              <div
                className="filter-buttons"
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => setSalesChartFilter("7days")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      salesChartFilter === "7days" ? "#3498db" : "#ecf0f1",
                    color: salesChartFilter === "7days" ? "white" : "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight:
                      salesChartFilter === "7days" ? "bold" : "normal",
                  }}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setSalesChartFilter("30days")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      salesChartFilter === "30days" ? "#3498db" : "#ecf0f1",
                    color: salesChartFilter === "30days" ? "white" : "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight:
                      salesChartFilter === "30days" ? "bold" : "normal",
                  }}
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => setSalesChartFilter("custom")}
                  style={{
                    padding: "8px 12px",
                    backgroundColor:
                      salesChartFilter === "custom" ? "#3498db" : "#ecf0f1",
                    color: salesChartFilter === "custom" ? "white" : "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight:
                      salesChartFilter === "custom" ? "bold" : "normal",
                  }}
                >
                  Custom Range
                </button>
                {salesChartFilter === "custom" && (
                  <>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                    <span style={{ color: "#666" }}>to</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </>
                )}
              </div>

              <div className="stats-detail">
                <div className="detail-item">
                  <label>Today's Sales</label>
                  <span className="value">
                    {formatCurrency(stats.todaySales)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Selected Period Total</label>
                  <span className="value">
                    {formatCurrency(
                      getFilteredSalesData().reduce((s, d) => s + d.sales, 0),
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Selected Period Profit</label>
                  <span className="value profit">
                    {formatCurrency(
                      getFilteredSalesData().reduce((s, d) => s + d.profit, 0),
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Selected Period Orders</label>
                  <span className="value">
                    {getFilteredSalesData().reduce((s, d) => s + d.orders, 0)}
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getFilteredSalesData()}>
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
                  {getFilteredSalesData().map((day, i) => (
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
                  <span>{selectedItem.name}</span>
                </div>
                <div className="detail-row">
                  <label>Category ID:</label>
                  <span>{selectedItem.category_id}</span>
                </div>
                <div className="detail-row">
                  <label>Price:</label>
                  <span>{formatCurrency(selectedItem.price)}</span>
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
                  <span
                    className={
                      selectedItem.stock_quantity < 10 ? "stock-low" : ""
                    }
                  >
                    {selectedItem.stock_quantity} units
                  </span>
                </div>
                <div className="detail-row">
                  <label>SKU:</label>
                  <span>{selectedItem.SKU || `SKU-${selectedItem.id}`}</span>
                </div>
                <div className="detail-row">
                  <label>Description:</label>
                  <span>{selectedItem.description || "No description"}</span>
                </div>
                {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                  <div className="detail-row">
                    <label>Sizes:</label>
                    <ul>
                      {selectedItem.sizes.map((size, idx) => (
                        <li key={idx}>
                          {size}: {selectedItem.availableSizes?.[size] || 0} in
                          stock
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                    <th>Size</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItem?.items &&
                  Array.isArray(selectedItem.items) &&
                  selectedItem.items.length > 0 ? (
                    selectedItem.items.map((item, i) => (
                      <tr key={i}>
                        <td>
                          {item.name || item.productId || "Unknown Product"}
                        </td>
                        <td>{item.size || "-"}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {formatCurrency(
                            (item.price || 0) * (item.quantity || 0),
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          textAlign: "center",
                          color: "#666",
                          padding: "15px",
                        }}
                      >
                        {loading
                          ? "Loading items..."
                          : "No items in this order"}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan="4"
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
                  <option value="cancelled">❌ Cancelled</option>
                  <option value="pending_confirmation">
                    ⏳ Pending Confirmation
                  </option>
                  <option value="processing">⚙️ Processing</option>
                  <option value="shipped">🚚 Shipped</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  // Filter and show orders from last 30 days
                  const last30Orders = getLast30DaysOrders();
                  console.log(
                    `Showing ${last30Orders.length} orders from last 30 days`,
                  );
                  // You can add additional UI to show these orders if needed
                }}
              >
                📅 Last 30 Days Orders ({getLast30DaysOrders().length})
              </button>
              {selectedItem.status === "completed" && (
                <button
                  className="btn-danger"
                  onClick={() => handleDeleteOrder(selectedItem.id)}
                  style={{ backgroundColor: "#e74c3c", color: "white" }}
                >
                  🗑️ Delete Order
                </button>
              )}
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
                  <span>{selectedItem.category_id}</span>
                </div>
                <div className="detail-row">
                  <label>Current Stock:</label>
                  <span className="stock-low">
                    {selectedItem.stock_quantity} units
                  </span>
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
                    width: `${Math.min((selectedItem.stock_quantity / 50) * 100, 100)}%`,
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
              {/* NEW CODE - Display timestamp when product is being created
              This shows the admin the exact date and time the product is being added to the system.
              This helps track when products are created for auditing and inventory management purposes.
              */}
              <div
                style={{ fontSize: "0.9em", color: "#666", marginLeft: "auto" }}
              >
                📅 {new Date().toLocaleString()}
              </div>
              <button className="modal-close" onClick={closeAllModals}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="expense-notice">
                💸 <strong>Note:</strong> Adding a product records a business
                expense.
              </div>
              <form
                className="product-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newProduct.category_id}
                    onChange={(e) => {
                      setNewProduct({
                        ...newProduct,
                        category_id: e.target.value,
                        subcategory_id: "",
                      });
                      // Filter subcategories based on selected category
                      if (e.target.value) {
                        const filtered = subcategoryList.filter(
                          (sub) => sub.category_id === parseInt(e.target.value),
                        );
                        setFilteredSubcategories(filtered);
                      } else {
                        setFilteredSubcategories([]);
                      }
                    }}
                    required
                  >
                    <option value="">Select a category</option>
                    {categoryList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subcategory</label>
                  <select
                    value={newProduct.subcategory_id}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        subcategory_id: e.target.value,
                      })
                    }
                    disabled={!newProduct.category_id}
                  >
                    <option value="">Select a subcategory</option>
                    {filteredSubcategories.map((subcat) => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>SKU *</label>
                  <input
                    type="text"
                    value={newProduct.SKU}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, SKU: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Sell Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
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
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, cost: e.target.value })
                      }
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
                      value={newProduct.stock_quantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stock_quantity: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={newProduct.image}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group sizes-section">
                  <label>📏 Sizes & Stock (optional)</label>
                  <p className="sizes-help">
                    Add sizes if this product comes in multiple sizes. Leave
                    empty for products without variants.
                  </p>
                  {/* NEW CODE - Size and Stock Validation
                  When admin adds sizes, the total stock across all sizes should match
                  the Initial Stock value entered above. This ensures inventory consistency.
                  
                  For example:
                  - If Initial Stock = 100 and sizes are added
                  - Then Size S stock + Size M stock + Size L stock should = 100
                  
                  This validation message helps the admin ensure they're distributing
                  the inventory correctly across sizes.
                  */}
                  {newProduct.sizes.length > 0 && (
                    <div className="size-stock-info">
                      {(() => {
                        const totalSizeStock = newProduct.sizes.reduce(
                          (sum, entry) => sum + (entry.stock_quantity || 0),
                          0,
                        );
                        const initialStock =
                          parseInt(newProduct.stock_quantity) || 0;
                        const isMatching = totalSizeStock === initialStock;

                        return (
                          <div
                            style={{
                              padding: "10px",
                              marginBottom: "10px",
                              borderRadius: "4px",
                              backgroundColor: isMatching
                                ? "#e8f5e9"
                                : "#fff3cd",
                              borderLeft: `4px solid ${isMatching ? "#4caf50" : "#ff9800"}`,
                              color: isMatching ? "#2e7d32" : "#856404",
                            }}
                          >
                            <strong>
                              Size Stock Total: {totalSizeStock} / Initial
                              Stock: {initialStock}
                            </strong>
                            <br />
                            {isMatching ? (
                              <span>
                                ✅ Perfect! Size stocks match initial stock.
                              </span>
                            ) : (
                              <span>
                                ⚠️ Size stocks don't match initial stock. Total
                                should equal {initialStock}.
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
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
                        value={entry.stock_quantity}
                        onChange={(e) => {
                          const updated = [...newProduct.sizes];
                          updated[index].stock_quantity =
                            parseInt(e.target.value) || 0;
                          setNewProduct({ ...newProduct, sizes: updated });
                        }}
                      />
                      <button
                        type="button"
                        className="remove-size-btn"
                        onClick={() => {
                          const updated = newProduct.sizes.filter(
                            (_, i) => i !== index,
                          );
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
                        sizes: [
                          ...newProduct.sizes,
                          { size: "", stock_quantity: 0 },
                        ],
                      });
                    }}
                  >
                    + Add Size
                  </button>
                </div>
                {newProduct.cost && newProduct.stock_quantity && (
                  <div className="expense-preview">
                    <strong>📊 Investment Summary:</strong>
                    <div>
                      Total Cost:{" "}
                      {formatCurrency(
                        parseFloat(newProduct.cost || 0) *
                          parseInt(newProduct.stock_quantity || 0),
                      )}
                    </div>
                    <div>
                      Expected Revenue:{" "}
                      {formatCurrency(
                        parseFloat(newProduct.price || 0) *
                          parseInt(newProduct.stock_quantity || 0),
                      )}
                    </div>
                    <div>
                      Potential Profit:{" "}
                      {formatCurrency(
                        (parseFloat(newProduct.price || 0) -
                          parseFloat(newProduct.cost || 0)) *
                          parseInt(newProduct.stock_quantity || 0),
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
                  !newProduct.category_id ||
                  !newProduct.price ||
                  !newProduct.cost ||
                  !newProduct.stock_quantity ||
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
              <button className="modal-close" onClick={closeDetailModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <form
                className="product-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={editProduct.category_id}
                    onChange={(e) => {
                      setEditProduct({
                        ...editProduct,
                        category_id: e.target.value,
                        subcategory_id: "",
                      });
                      // Filter subcategories based on selected category
                      if (e.target.value) {
                        const filtered = subcategoryList.filter(
                          (sub) => sub.category_id === parseInt(e.target.value),
                        );
                        setFilteredSubcategories(filtered);
                      } else {
                        setFilteredSubcategories([]);
                      }
                    }}
                    required
                  >
                    <option value="">Select a category</option>
                    {categoryList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subcategory</label>
                  <select
                    value={editProduct.subcategory_id || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        subcategory_id: e.target.value,
                      })
                    }
                    disabled={!editProduct.category_id}
                  >
                    <option value="">Select a subcategory</option>
                    {filteredSubcategories.map((subcat) => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>SKU *</label>
                  <input
                    type="text"
                    value={editProduct.SKU}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, SKU: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Sell Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editProduct.price}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          price: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setEditProduct({ ...editProduct, cost: e.target.value })
                      }
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
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          stock_quantity: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={editProduct.image || ""}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          image: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={editProduct.description}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    required
                  />
                </div>
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
                        value={entry.stock_quantity}
                        onChange={(e) => {
                          const updated = [...editProduct.sizes];
                          updated[index].stock_quantity =
                            parseInt(e.target.value) || 0;
                          setEditProduct({ ...editProduct, sizes: updated });
                        }}
                      />
                      <button
                        type="button"
                        className="remove-size-btn"
                        onClick={() => {
                          const updated = editProduct.sizes.filter(
                            (_, i) => i !== index,
                          );
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
                        sizes: [
                          ...editProduct.sizes,
                          { size: "", stock_quantity: 0 },
                        ],
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
                <strong>Current Stock:</strong> {selectedItem.stock_quantity}{" "}
                units
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

      {/* NEW CODE - Add Category Modal
      This modal appears when the admin clicks "Add Category" button.
      It allows the admin to input a new category name and save it to the database.
      */}
      {showAddCategoryModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddCategoryModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px" }}
          >
            <div className="modal-header">
              <h2>➕ Add New Category</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddCategoryModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddCategory();
                }}
              >
                <div className="form-group">
                  <label htmlFor="categoryName">Category Name *</label>
                  <input
                    id="categoryName"
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Apparel, Electronics, Home & Garden"
                    required
                    disabled={addingCategory}
                    autoFocus
                  />
                  <small style={{ color: "#666", marginTop: "5px" }}>
                    Enter the name of the new product category
                  </small>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={handleAddCategory}
                disabled={addingCategory || !newCategoryName.trim()}
              >
                {addingCategory ? "Adding..." : "Add Category"}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowAddCategoryModal(false)}
                disabled={addingCategory}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
