import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryList from '../components/CategoryList';
import '../styles/HomePage.css';

const HomePage = ({ addToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [

    {
      id: 49,
      title: "Running Shoes Pro",
      description: "Lightweight running shoes - $119.99",
      price: 119.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "footwear"
    },

        {
      id: 1,
      title: "Eternal Essence",
      description: "Luxury Eau de Parfum - $89.99",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "perfume"
    },
    {
      id: 2,
      title: "Silk Touch Lotion",
      description: "Hydrating Body Cream - $34.99",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "skincare"
    },
    {
      id: 3,
      title: "Velvet Rose",
      description: "Floral Perfume Collection - $79.99",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "perfume"
    }

    
  ];

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const goToSlide = (index) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleAddToCart = (slide) => {
    const product = {
      id: slide.id,
      name: slide.title,
      price: slide.price,
      image: slide.image,
      stock: 50,
      category: slide.category,
      description: slide.description
    };
    addToCart(product, 1);
    
    // Show success notification
    alert(`✓ Added ${slide.title} to cart!`);
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [currentSlide, isAnimating]);

  return (
    <div className="home-page">
      {/* Hero Section with Slideshow */}
      <section className="hero-slideshow-section">
        <div className="hero-container">
          <div className="hero-grid">
            {/* Hero Content */}
            <div className="hero-content">
              <h1 className="hero-title">
                Discover Your
                <span className="hero-gradient">Signature Scent</span>
              </h1>
              <p className="hero-description">
                Explore our exclusive collection of premium perfumes and luxurious body care products. 
                Each item is crafted to elevate your daily routine with elegance and sophistication.
              </p>
              
              {/* Call-to-Action Buttons */}
              <div className="hero-buttons">
                <Link to="/products" className="btn btn-primary">
                  <i className="fas fa-star"></i>
                  Shop Collection
                </Link>
                <button className="btn btn-outline">
                  <i className="fas fa-play-circle"></i>
                  Our Story
                </button>
              </div>
              
              {/* Stats Section */}
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Happy Customers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">72+</div>
                  <div className="stat-label">Premium Products</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support</div>
                </div>
              </div>
            </div>
            
            {/* Slideshow Section */}
            <div className="slideshow-wrapper">
              <div className="slideshow-container">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`slide ${index === currentSlide ? 'active' : ''} slide-${index + 1}`}
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      transform: `translateX(${(index - currentSlide) * 100}%)`,
                      transition: isAnimating ? 'transform 0.5s ease-in-out' : 'none'
                    }}
                  >
                    <div className="slide-content">
                      <h3 className="slide-title">{slide.title}</h3>
                      <p className="slide-description">{slide.description}</p>
                      <button 
                        className="slide-add-to-cart"
                        onClick={() => handleAddToCart(slide)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Navigation Arrows */}
                <button 
                  className="slideshow-nav prev"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  className="slideshow-nav next"
                  onClick={nextSlide}
                  aria-label="Next slide"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
                
                {/* Slide Dots Indicator */}
                <div className="slideshow-controls">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <CategoryList />
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        <p className="section-subtitle">Curated selection of our best sellers</p>
        <div className="featured-grid">
          <div className="featured-card">
            <div className="featured-badge">🔥 Hot Deal</div>
            <div 
              className="featured-image"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
              }}
            ></div>
            <div className="featured-info">
              <h3>Noise-Cancelling Headphones</h3>
              <p>Over-ear headphones with premium sound quality</p>
              <span className="featured-price">$199.99</span>
              <Link to="/products" className="btn btn-small">Shop Now</Link>
            </div>
          </div>
          
          <div className="featured-card">
            <div className="featured-badge">✨ New</div>
            <div 
              className="featured-image"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
              }}
            ></div>
            <div className="featured-info">
              <h3>Signature Perfume</h3>
              <p>Luxury floral fragrance with long-lasting scent</p>
              <span className="featured-price">$129.99</span>
              <Link to="/products" className="btn btn-small">Shop Now</Link>
            </div>
          </div>
          
          <div className="featured-card">
            <div className="featured-badge">💎 Premium</div>
            <div 
              className="featured-image"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
              }}
            ></div>
            <div className="featured-info">
              <h3>Smart Watch Series</h3>
              <p>Fitness tracker with ECG and GPS</p>
              <span className="featured-price">$249.99</span>
              <Link to="/products" className="btn btn-small">Shop Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Shop With Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>Free delivery on orders over $75. Fast shipping nationwide.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Easy Payment</h3>
            <p>Multiple payment options via WhatsApp confirmation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>30-Day Returns</h3>
            <p>Hassle-free returns within 30 days of purchase.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Quality Guaranteed</h3>
            <p>Premium quality products with 100% satisfaction.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Elevate Your Style?</h2>
          <p>Join thousands of satisfied customers shopping with StyleHub</p>
          <Link to="/products" className="btn btn-secondary btn-large">
            Start Shopping Now →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;