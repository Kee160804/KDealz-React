import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryList from '../components/CategoryList';



const HomePage = ({ addToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      id: 1,
      title: "EOS Products",
      description: "EOS (Evolution of Smooth) is a beauty and skincare brand known for its brightly colored",
      price: 89.99,
      image: "https://evolutionofsmooth.com/cdn/shop/articles/Adobe_Express_-_file_-_2025-10-29T163614.508_0d060217-931e-4d27-9d0a-7d0269bc7825.jpg?crop=center&height=1000&v=1765212602&width=1000",
      category: "beauty-bodycare"
    },
    {
      id: 2,
      title: "Dove Products",
      description: "Dove products offer gentle, nourishing care for skin and hair",
      price: 89.99,
      image: "https://assets.unileversolutions.com/v1/143126630.jpg",
      category: "beauty-bodycare"
    },
    {
      id: 3,
      title: "Silk Touch Lotion",
      description: "Hydrating Body Cream - $34.99",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "skincare"
    },
    {
      id: 4,
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
    alert(`✓ Added ${slide.title} to cart!`);
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [currentSlide, isAnimating]);

  return (
    <div className="pb-10">
      {/* Hero Section with Slideshow */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%232c3e50' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}
        />

        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="animate-fadeInUp">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
                Discover Your
                <span className="block bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent relative">
                  Signature Scent
                  <span className="absolute bottom-[-5px] left-0 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl leading-relaxed text-gray-600 mb-8 max-w-lg">
                Explore our exclusive collection of premium perfumes and luxurious body care products. 
                Each item is crafted to elevate your daily routine with elegance and sophistication.
              </p>
              
              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  to="/products" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold text-lg flex items-center justify-center gap-3 min-w-[200px] shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 border-2 border-transparent"
                >
                  <i className="fas fa-star"></i>
                  Shop Collection
                </Link>
                <button className="px-8 py-4 border-2 border-blue-500 text-blue-500 rounded-full font-semibold text-lg flex items-center justify-center gap-3 min-w-[200px] bg-transparent hover:bg-blue-500 hover:text-white hover:-translate-y-1 transition-all duration-300">
                  <i className="fas fa-play-circle"></i>
                  Our Story
                </button>
              </div>
              
              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-8 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-purple-600 mb-2">500+</div>
                  <div className="text-sm font-medium text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-purple-600 mb-2">72+</div>
                  <div className="text-sm font-medium text-gray-600">Premium Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-purple-600 mb-2">24/7</div>
                  <div className="text-sm font-medium text-gray-600">Support</div>
                </div>
              </div>
            </div>
            
            {/* Slideshow Section */}
            <div className="relative perspective-1000">
              <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-white">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat flex items-end transition-transform duration-500 ease-in-out ${
                      index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      transform: `translateX(${(index - currentSlide) * 100}%)`,
                      transition: isAnimating ? 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out' : 'none'
                    }}
                  >
                    <div className="bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 sm:p-8 w-full">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white drop-shadow-md">
                        {slide.title}
                      </h3>
                      <p className="text-white/90 text-sm sm:text-base mb-4">
                        {slide.description}
                      </p>
                      <button 
                        className="bg-white text-blue-600 border-none px-6 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all duration-300 shadow-lg hover:bg-gray-100 hover:-translate-y-1 hover:shadow-xl"
                        onClick={() => handleAddToCart(slide)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Navigation Arrows */}
                <button 
                  className="absolute top-1/2 left-5 -translate-y-1/2 bg-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-20 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-110 text-blue-600"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  className="absolute top-1/2 right-5 -translate-y-1/2 bg-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-20 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-110 text-blue-600"
                  onClick={nextSlide}
                  aria-label="Next slide"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
                
                {/* Slide Dots Indicator */}
                <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-3 z-20">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full border-none cursor-pointer p-0 transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
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
      <section className="my-16">
        <CategoryList />
      </section>

      {/* Featured Products */}
      <section className="my-16 py-10 bg-gradient-to-b from-gray-50 to-white rounded-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
          Featured Products
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 text-center mb-12">
          Curated selection of our best sellers
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative">
            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold z-10">
              🔥 Hot Deal
            </span>
            <div 
              className="h-48 bg-cover bg-center relative"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Noise-Cancelling Headphones</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">Over-ear headphones with premium sound quality</p>
              <span className="block text-2xl font-bold text-blue-600 mb-4">$199.99</span>
              <Link to="/products" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
                Shop Now
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative">
            <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold z-10">
              ✨ New
            </span>
            <div 
              className="h-48 bg-cover bg-center relative"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Signature Perfume</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">Luxury floral fragrance with long-lasting scent</p>
              <span className="block text-2xl font-bold text-blue-600 mb-4">$129.99</span>
              <Link to="/products" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
                Shop Now
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative">
            <span className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold z-10">
              💎 Premium
            </span>
            <div 
              className="h-48 bg-cover bg-center relative"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Watch Series</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">Fitness tracker with ECG and GPS</p>
              <span className="block text-2xl font-bold text-blue-600 mb-4">$249.99</span>
              <Link to="/products" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="my-16 py-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
          Why Shop With Us
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          <div className="bg-white p-8 rounded-xl text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <div className="text-4xl mb-5 text-purple-600 h-20 w-20 leading-[80px] bg-gradient-to-br from-gray-50 to-white rounded-full mx-auto">
              🚚
            </div>
            <h3 className="text-xl font-bold text-blue-600 mb-4">Free Shipping</h3>
            <p className="text-gray-600 leading-relaxed text-sm">Free delivery on orders over $75. Fast shipping nationwide.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <div className="text-4xl mb-5 text-purple-600 h-20 w-20 leading-[80px] bg-gradient-to-br from-gray-50 to-white rounded-full mx-auto">
              💳
            </div>
            <h3 className="text-xl font-bold text-blue-600 mb-4">Easy Payment</h3>
            <p className="text-gray-600 leading-relaxed text-sm">Multiple payment options via WhatsApp confirmation.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <div className="text-4xl mb-5 text-purple-600 h-20 w-20 leading-[80px] bg-gradient-to-br from-gray-50 to-white rounded-full mx-auto">
              🔄
            </div>
            <h3 className="text-xl font-bold text-blue-600 mb-4">30-Day Returns</h3>
            <p className="text-gray-600 leading-relaxed text-sm">Hassle-free returns within 30 days of purchase.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
            <div className="text-4xl mb-5 text-purple-600 h-20 w-20 leading-[80px] bg-gradient-to-br from-gray-50 to-white rounded-full mx-auto">
              🛡️
            </div>
            <h3 className="text-xl font-bold text-blue-600 mb-4">Quality Guaranteed</h3>
            <p className="text-gray-600 leading-relaxed text-sm">Premium quality products with 100% satisfaction.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="my-16 px-5 py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 drop-shadow-md">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 opacity-90 leading-relaxed">
            Join thousands of satisfied customers shopping with StyleHub
          </p>
          <Link 
            to="/products" 
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-full text-lg font-bold hover:bg-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            Start Shopping Now →
          </Link>
        </div>
      </section>
      
      {/* Add custom animation keyframes to your global CSS or use a Tailwind plugin */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;