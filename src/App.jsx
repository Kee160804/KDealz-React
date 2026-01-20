// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import HomePage from './pages/HomePage';
// import ProductsPage from './pages/ProductsPage';
// import CheckoutPage from './pages/CheckoutPage';
// import CategoryPage from './components/CategoryPage';
// import ContactPage from './pages/ContactPage';
// import './App.css';

// function App() {
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem('cart');
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   // Save cart to localStorage
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (product, quantity = 1) => {
//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.id === product.id);
      
//       if (existingItem) {
//         return prevCart.map(item =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         return [...prevCart, { ...product, quantity }];
//       }
//     });
//   };

//   const removeFromCart = (id) => {
//     setCart(prevCart => prevCart.filter(item => item.id !== id));
//   };

//   const updateQuantity = (id, quantity) => {
//     if (quantity < 1) {
//       removeFromCart(id);
//       return;
//     }

//     setCart(prevCart =>
//       prevCart.map(item =>
//         item.id === id ? { ...item, quantity } : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const getCartCount = () => {
//     return cart.reduce((total, item) => total + item.quantity, 0);
//   };

//   return (
//     <Router>
//       <div className="app">
//         <Header 
//           cart={cart}
//           getCartTotal={getCartTotal}
//           getCartCount={getCartCount}
//           removeFromCart={removeFromCart}
//           updateQuantity={updateQuantity}
//         />
//         <main className="main-content">
//           <Routes>
//             <Route path="/" element={<HomePage addToCart={addToCart} />} />
//             <Route path="/products" element={
//               <ProductsPage addToCart={addToCart} />
//             } />
//             <Route path="/checkout" element={
//               <CheckoutPage
//                 cart={cart}
//                 getCartTotal={getCartTotal}
//                 clearCart={clearCart}
//               />
//             } />
//             <Route path="/category/:categoryName" element={
//               <CategoryPage addToCart={addToCart} />
//             } />
//             <Route path="/contact" element={
//               <ContactPage addToCart={addToCart}/>} /> {/* Added Contact Page */}
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;



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

  // FIXED: addToCart function that properly handles sizes and quantities
  const addToCart = (product, quantity = 1) => {
    console.log('App - Adding to cart:', {
      name: product.name,
      id: product.id,
      quantity: product.quantity || quantity,
      selectedSize: product.selectedSize,
      hasSize: product.selectedSize ? true : false
    });

    const actualQuantity = product.quantity || quantity;
    
    setCart(prevCart => {
      // For items with sizes, we need to check both id AND size
      if (product.selectedSize) {
        // Check if we already have this exact product with this exact size
        const existingItemIndex = prevCart.findIndex(item => 
          item.id === product.id && item.selectedSize === product.selectedSize
        );

        if (existingItemIndex !== -1) {
          // Item with same size exists - update quantity
          return prevCart.map((item, index) => {
            if (index === existingItemIndex) {
              console.log(`Merging size item: ${item.name} size ${item.selectedSize}, Old: ${item.quantity}, Adding: ${actualQuantity}, New: ${item.quantity + actualQuantity}`);
              return {
                ...item,
                quantity: item.quantity + actualQuantity
              };
            }
            return item;
          });
        } else {
          // New item with this size
          console.log(`New size item: ${product.name} size ${product.selectedSize} with quantity: ${actualQuantity}`);
          return [...prevCart, { 
            ...product, 
            quantity: actualQuantity 
          }];
        }
      } else {
        // For items without sizes, just check by id
        const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
          // Item exists - update quantity
          return prevCart.map((item, index) => {
            if (index === existingItemIndex) {
              console.log(`Merging regular item: ${item.name}, Old: ${item.quantity}, Adding: ${actualQuantity}, New: ${item.quantity + actualQuantity}`);
              return {
                ...item,
                quantity: item.quantity + actualQuantity
              };
            }
            return item;
          });
        } else {
          // New item
          console.log(`New regular item: ${product.name} with quantity: ${actualQuantity}`);
          return [...prevCart, { 
            ...product, 
            quantity: actualQuantity 
          }];
        }
      }
    });
  };

  // FIXED: removeFromCart function that handles items with sizes
  const removeFromCart = (id, selectedSize = null) => {
    setCart(prevCart => {
      if (selectedSize) {
        // Remove specific item with this id AND size
        return prevCart.filter(item => 
          !(item.id === id && item.selectedSize === selectedSize)
        );
      } else {
        // Remove all items with this id (regardless of size)
        return prevCart.filter(item => item.id !== id);
      }
    });
  };

  // FIXED: updateQuantity function that handles items with sizes
  const updateQuantity = (id, quantity, selectedSize = null) => {
    if (quantity < 1) {
      removeFromCart(id, selectedSize);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => {
        // Check if this is the right item
        if (selectedSize) {
          // For items with sizes, match both id AND size
          if (item.id === id && item.selectedSize === selectedSize) {
            return { ...item, quantity };
          }
        } else {
          // For items without sizes, match by id only
          if (item.id === id) {
            return { ...item, quantity };
          }
        }
        return item;
      })
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
              <ContactPage addToCart={addToCart}/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;