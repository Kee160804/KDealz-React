// data/MockData.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  subCategory?: string;
  tags: string[];
  sizes?: string[];
  availableSizes?: Record<string, number>;
  // Admin-specific fields
  cost?: number;  // Cost price for profit calculation
  sku?: string;   // SKU for inventory tracking
}

// // Your existing products array with enhanced fields for admin
// Home Page Slides
export const homeSlides = [
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

// Featured Products (for the featured section on home page)
export const featuredProducts = [
  {
    id: 57,
    title: "Noise-Cancelling Headphones",
    description: "Over-ear headphones with premium sound quality",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "🔥 Hot Deal",
    category: "electronics"
  },
  {
    id: 27,
    title: "Signature Perfume",
    description: "Luxury floral fragrance with long-lasting scent",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "✨ New",
    category: "home-living"
  },
  {
    id: 55,
    title: "Smart Watch Series",
    description: "Fitness tracker with ECG and GPS",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    badge: "💎 Premium",
    category: "electronics"
  }
];

// Feature cards data
export const featureCards = [
  {
    icon: "🚚",
    title: "Free Shipping",
    description: "Free delivery on orders over $75. Fast shipping nationwide."
  },
  {
    icon: "💳",
    title: "Easy Payment",
    description: "Multiple payment options via WhatsApp confirmation."
  },
  {
    icon: "🔄",
    title: "30-Day Returns",
    description: "Hassle-free returns within 30 days of purchase."
  },
  {
    icon: "🛡️",
    title: "Quality Guaranteed",
    description: "Premium quality products with 100% satisfaction."
  }
];

// Hero stats data
export const heroStats = [
  { number: "500+", label: "Happy Customers" },
  { number: "72+", label: "Premium Products" },
  { number: "24/7", label: "Support" }
];