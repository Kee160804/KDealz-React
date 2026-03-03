import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import CategoryList from '../components/CategoryList';
import { homeSlides, featuredProducts, featureCards, heroStats } from '../data/MockData';
import '../styles/HomePage.css';

/**
 * HomePage Component
 * Main landing page with hero slideshow, categories, featured products, and features
 */
const HomePage = ({ addToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideIntervalRef = useRef(null);

  // ─── Slide Navigation ─────────────────────────────────────────────────
  const goToSlide = useCallback((index) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isAnimating, currentSlide]);

  const nextSlide = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % homeSlides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + homeSlides.length) % homeSlides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isAnimating]);

  // Auto slide every 5 seconds
  useEffect(() => {
    slideIntervalRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(slideIntervalRef.current);
  }, [nextSlide]);

  // ─── Handlers ────────────────────────────────────────────────────────
  const handleAddToCart = useCallback((slide) => {
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
    alert(`✓ Added ${slide.title} to cart!`);
  }, [addToCart]);

  // ─── Memoized Values ─────────────────────────────────────────────────
  const slideElements = useMemo(() => 
    homeSlides.map((slide, index) => (
      <Slide 
        key={slide.id}
        slide={slide}
        index={index}
        currentSlide={currentSlide}
        isAnimating={isAnimating}
        onAddToCart={handleAddToCart}
      />
    )), [currentSlide, isAnimating, handleAddToCart]
  );

  const dotButtons = useMemo(() => 
    homeSlides.map((_, index) => (
      <DotButton 
        key={index}
        index={index}
        isActive={index === currentSlide}
        onClick={goToSlide}
      />
    )), [currentSlide, goToSlide]
  );

  return (
    <div className="home-page">
      <HeroSection 
        nextSlide={nextSlide}
        prevSlide={prevSlide}
        slideElements={slideElements}
        dotButtons={dotButtons}
      />
      
      <CategoriesSection />
      <FeaturedProductsSection featuredProducts={featuredProducts} />
      <FeaturesSection featureCards={featureCards} />
      <CTASection />
    </div>
  );
};

// ============================================================================
// HERO SECTION
// ============================================================================

const HeroSection = ({ nextSlide, prevSlide, slideElements, dotButtons }) => (
  <section className="hero-slideshow-section">
    <div className="hero-container">
      <div className="hero-grid">
        <HeroContent />
        <Slideshow 
          nextSlide={nextSlide}
          prevSlide={prevSlide}
          slideElements={slideElements}
          dotButtons={dotButtons}
        />
      </div>
    </div>
  </section>
);

const HeroContent = () => (
  <div className="hero-content">
    <h1 className="hero-title">
      Discover Your
      <span className="hero-gradient">Signature Scent</span>
    </h1>
    <p className="hero-description">
      Explore our exclusive collection of premium perfumes and luxurious body care products. 
      Each item is crafted to elevate your daily routine with elegance and sophistication.
    </p>
    
    <HeroButtons />
    <HeroStats />
  </div>
);

const HeroButtons = () => (
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
);

const HeroStats = () => (
  <div className="hero-stats">
    {heroStats.map((stat, index) => (
      <StatItem key={index} stat={stat} />
    ))}
  </div>
);

const StatItem = ({ stat }) => (
  <div className="stat-item">
    <div className="stat-number">{stat.number}</div>
    <div className="stat-label">{stat.label}</div>
  </div>
);

// ============================================================================
// SLIDESHOW COMPONENTS
// ============================================================================

const Slideshow = ({ nextSlide, prevSlide, slideElements, dotButtons }) => (
  <div className="slideshow-wrapper">
    <div className="slideshow-container">
      {slideElements}
      
      <NavButton direction="prev" onClick={prevSlide} />
      <NavButton direction="next" onClick={nextSlide} />
      
      <div className="slideshow-controls">
        {dotButtons}
      </div>
    </div>
  </div>
);

const NavButton = ({ direction, onClick }) => (
  <button 
    className={`slideshow-nav ${direction}`}
    onClick={onClick}
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
  >
    <i className={`fas fa-chevron-${direction === 'prev' ? 'left' : 'right'}`}></i>
  </button>
);

const Slide = ({ slide, index, currentSlide, isAnimating, onAddToCart }) => (
  <div
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
      <SlideAddButton slide={slide} onAddToCart={onAddToCart} />
    </div>
  </div>
);

const SlideAddButton = ({ slide, onAddToCart }) => (
  <button 
    className="slide-add-to-cart"
    onClick={() => onAddToCart(slide)}
  >
    Add to Cart
  </button>
);

const DotButton = ({ index, isActive, onClick }) => (
  <button
    className={`slide-dot ${isActive ? 'active' : ''}`}
    onClick={() => onClick(index)}
    aria-label={`Go to slide ${index + 1}`}
  />
);

// ============================================================================
// CATEGORIES SECTION
// ============================================================================

const CategoriesSection = () => (
  <section className="categories-section">
    test
    <CategoryList />
  </section>
);

// ============================================================================
// FEATURED PRODUCTS SECTION
// ============================================================================

const FeaturedProductsSection = ({ featuredProducts }) => (
  <section className="featured-section">
    <SectionHeader 
      title="Featured Products" 
      subtitle="Curated selection of our best sellers" 
    />
    <div className="featured-grid">
      {featuredProducts.map((product) => (
        <FeaturedCard key={product.id} product={product} />
      ))}
    </div>
  </section>
);

const FeaturedCard = ({ product }) => (
  <div className="featured-card">
    <div className="featured-badge">{product.badge}</div>
    <FeaturedImage image={product.image} />
    <div className="featured-info">
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <span className="featured-price">${product.price.toFixed(2)}</span>
      <Link to="/products" className="btn btn-small">Shop Now</Link>
    </div>
  </div>
);

const FeaturedImage = ({ image }) => (
  <div 
    className="featured-image"
    style={{ backgroundImage: `url('${image}')` }}
  />
);

// ============================================================================
// FEATURES SECTION
// ============================================================================

const FeaturesSection = ({ featureCards }) => (
  <section className="features-section">
    <SectionHeader title="Why Shop With Us" />
    <div className="features-grid">
      {featureCards.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}
    </div>
  </section>
);

const FeatureCard = ({ feature }) => (
  <div className="feature-card">
    <div className="feature-icon">{feature.icon}</div>
    <h3>{feature.title}</h3>
    <p>{feature.description}</p>
  </div>
);

// ============================================================================
// CTA SECTION
// ============================================================================

const CTASection = () => (
  <section className="cta-section">
    <div className="cta-content">
      <h2>Ready to Elevate Your Style?</h2>
      <p>Join thousands of satisfied customers shopping with StyleHub</p>
      <CTALink />
    </div>
  </section>
);

const CTALink = () => (
  <Link to="/products" className="btn btn-secondary btn-large">
    Start Shopping Now →
  </Link>
);

// ============================================================================
// COMMON COMPONENTS
// ============================================================================

const SectionHeader = ({ title, subtitle }) => (
  <>
    <h2 className="section-title">{title}</h2>
    {subtitle && <p className="section-subtitle">{subtitle}</p>}
  </>
);

export default HomePage;