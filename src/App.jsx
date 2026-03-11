import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import CategoryPage from "./components/CategoryPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

import { supabase } from "./lib/supabase/client";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        setError(error.message);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    loadProducts();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const addToCart = (product, quantity = 1) => {
    const actualQuantity = product.quantity || quantity;

    setCart((prevCart) => {
      if (product.selectedSize) {
        const existingItemIndex = prevCart.findIndex(
          (item) =>
            item.id === product.id &&
            item.selectedSize === product.selectedSize,
        );

        if (existingItemIndex !== -1) {
          return prevCart.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + actualQuantity }
              : item,
          );
        } else {
          return [...prevCart, { ...product, quantity: actualQuantity }];
        }
      } else {
        const existingItemIndex = prevCart.findIndex(
          (item) => item.id === product.id,
        );

        if (existingItemIndex !== -1) {
          return prevCart.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + actualQuantity }
              : item,
          );
        } else {
          return [...prevCart, { ...product, quantity: actualQuantity }];
        }
      }
    });
  };

  const removeFromCart = (id, selectedSize = null) => {
    setCart((prevCart) => {
      if (selectedSize) {
        return prevCart.filter(
          (item) => !(item.id === id && item.selectedSize === selectedSize),
        );
      } else {
        return prevCart.filter((item) => item.id !== id);
      }
    });
  };

  const updateQuantity = (id, quantity, selectedSize = null) => {
    if (quantity < 1) {
      removeFromCart(id, selectedSize);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (selectedSize) {
          if (item.id === id && item.selectedSize === selectedSize) {
            return { ...item, quantity };
          }
        } else {
          if (item.id === id) {
            return { ...item, quantity };
          }
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // return (
  //   <div>
  //     {JSON.stringify(products)}
  //     {products.map((product) => (
  //       <div key={product.id}>
  //         <h2>{product.name}</h2>
  //       </div>
  //     ))}
  //   </div>
  // );

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Router>
      <div className="app">
        <Header
          cart={cart}
          getCartTotal={getCartTotal}
          getCartCount={getCartCount}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<HomePage products={products} addToCart={addToCart} />}
            />
            <Route
              path="/products"
              element={
                <ProductsPage products={products} addToCart={addToCart} />
              }
            />
            <Route
              path="/checkout"
              element={
                <CheckoutPage
                  cart={cart}
                  getCartTotal={getCartTotal}
                  clearCart={clearCart}
                />
              }
            />
            <Route path="/order/:orderId" element={<OrderDetailsPage />} />
            <Route
              path="/category/:categoryName"
              element={
                <CategoryPage products={products} addToCart={addToCart} />
              }
            />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/admin"
              element={
                user?.role === "admin" ? (
                  <AdminDashboard user={user} />
                ) : (
                  <div className="unauthorized">
                    <h2>Access Denied</h2>
                    <p>Please log in as an admin to access this page.</p>
                  </div>
                )
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
