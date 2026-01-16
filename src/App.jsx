import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CheckoutPage from './pages/CheckoutPage';
import CategoryPage from './components/CategoryPage';
import ContactPage from './pages/ContactPage';
import './App.css';

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Router>
      <div className="app">
        <Header 
          cart={cart}
          getCartTotal={getCartTotal}
          getCartCount={getCartCount}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} />} />
            <Route path="/products" element={
              <ProductsPage addToCart={addToCart} />
            } />
            <Route path="/checkout" element={
              <CheckoutPage
                cart={cart}
                getCartTotal={getCartTotal}
                clearCart={clearCart}
              />
            } />
            <Route path="/category/:categoryName" element={
              <CategoryPage addToCart={addToCart} />
            } />
            <Route path="/contact" element={
              <ContactPage addToCart={addToCart}/>} /> {/* Added Contact Page */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;