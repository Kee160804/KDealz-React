// pages/ProductsPage.jsx - COMPLETE UPDATED VERSION
import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/ProductCard.css'; // This file contains both page and card styles

const ProductsPage = ({ addToCart }) => {
  // All 72 products from data.js moved inline
  const [products] = useState([
    {
      id: 1,
      name: "Classic Oxford Shirt",
      description: "Premium 100% cotton Oxford shirt with button-down collar",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 45,
      category: "mens-clothing",
      tags: ["shirt", "formal", "cotton", "business"]
    },
    {
      id: 2,
      name: "Slim Fit Chinos",
      description: "Stretch cotton chinos with modern slim fit",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 38,
      category: "mens-clothing",
      tags: ["pants", "casual", "chinos", "comfort"]
    },
    {
      id: 3,
      name: "Denim Jacket",
      description: "Vintage wash denim jacket with metal buttons",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 25,
      category: "mens-clothing",
      tags: ["jacket", "denim", "casual", "vintage"]
    },
    {
      id: 4,
      name: "Premium Wool Sweater",
      description: "100% merino wool crew neck sweater for winter",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 32,
      category: "mens-clothing",
      tags: ["sweater", "wool", "winter", "warm"]
    },
    {
      id: 5,
      name: "Performance Polo Shirt",
      description: "Moisture-wicking polo with UV protection",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 50,
      category: "mens-clothing",
      tags: ["polo", "sports", "activewear", "performance"]
    },
    {
      id: 6,
      name: "Tailored Blazer",
      description: "Italian wool blend blazer for formal occasions",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1594938374180-1f0f6a1d5a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 18,
      category: "mens-clothing",
      tags: ["blazer", "formal", "wool", "tailored"]
    },
    {
      id: 7,
      name: "Cargo Shorts",
      description: "Utility shorts with multiple pockets",
      price: 44.99,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 40,
      category: "mens-clothing",
      tags: ["shorts", "cargo", "summer", "utility"]
    },
    {
      id: 8,
      name: "Cashmere Scarf",
      description: "Luxury cashmere scarf in solid colors",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 35,
      category: "mens-clothing",
      tags: ["scarf", "cashmere", "accessory", "winter"]
    },
    {
      id: 9,
      name: "Performance Hoodie",
      description: "Breathable hoodie with moisture management",
      price: 54.99,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 42,
      category: "mens-clothing",
      tags: ["hoodie", "activewear", "casual", "comfort"]
    },
    {
      id: 10,
      name: "Linen Button-Down",
      description: "Breathable linen shirt for summer days",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 30,
      category: "mens-clothing",
      tags: ["shirt", "linen", "summer", "breathable"]
    },
    {
      id: 11,
      name: "Leather Biker Jacket",
      description: "Genuine leather jacket with zipper details",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 15,
      category: "mens-clothing",
      tags: ["jacket", "leather", "biker", "premium"]
    },
    {
      id: 12,
      name: "Performance T-Shirts (Pack of 3)",
      description: "Pack of 3 moisture-wicking athletic t-shirts",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 60,
      category: "mens-clothing",
      tags: ["t-shirt", "pack", "athletic", "value"]
    },
    {
      id: 13,
      name: "Floral Maxi Dress",
      description: "Elegant floral print maxi dress for summer",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 28,
      category: "womens-clothing",
      tags: ["dress", "floral", "summer", "elegant"]
    },
    {
      id: 14,
      name: "Silk Blouse",
      description: "Pure silk blouse with delicate embroidery",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1585487000160-6eb9ce6b5aae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 22,
      category: "womens-clothing",
      tags: ["blouse", "silk", "luxury", "formal"]
    },
    {
      id: 15,
      name: "High-Waist Jeans",
      description: "Stretch denim jeans with high-waist fit",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 35,
      category: "womens-clothing",
      tags: ["jeans", "denim", "casual", "comfort"]
    },
    {
      id: 16,
      name: "Cashmere Turtleneck",
      description: "Luxury cashmere sweater for cold weather",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 20,
      category: "womens-clothing",
      tags: ["sweater", "cashmere", "winter", "luxury"]
    },
    {
      id: 17,
      name: "Wrap Dress",
      description: "Flattering wrap dress with belt detail",
      price: 64.99,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 32,
      category: "womens-clothing",
      tags: ["dress", "wrap", "flattering", "versatile"]
    },
    {
      id: 18,
      name: "Linen Jumpsuit",
      description: "Breathable linen jumpsuit for summer",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 25,
      category: "womens-clothing",
      tags: ["jumpsuit", "linen", "summer", "comfort"]
    },
    {
      id: 19,
      name: "Leather Skirt",
      description: "Genuine leather mini skirt",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 18,
      category: "womens-clothing",
      tags: ["skirt", "leather", "mini", "edgy"]
    },
    {
      id: 20,
      name: "Printed Midi Dress",
      description: "Bold print midi dress with puff sleeves",
      price: 74.99,
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 30,
      category: "womens-clothing",
      tags: ["dress", "printed", "midi", "trendy"]
    },
    {
      id: 21,
      name: "Oversized Blazer",
      description: "Modern oversized blazer for layering",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 26,
      category: "womens-clothing",
      tags: ["blazer", "oversized", "trendy", "layering"]
    },
    {
      id: 22,
      name: "Yoga Leggings",
      description: "High-waist yoga leggings with pocket",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1583872152366-7c9c80b4d9e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 45,
      category: "womens-clothing",
      tags: ["leggings", "yoga", "activewear", "comfort"]
    },
    {
      id: 23,
      name: "Embroidered Top",
      description: "Hand-embroidered peasant top",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 33,
      category: "womens-clothing",
      tags: ["top", "embroidered", "bohemian", "unique"]
    },
    {
      id: 24,
      name: "Silk Slip Dress",
      description: "Elegant silk slip dress for evening wear",
      price: 119.99,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 19,
      category: "womens-clothing",
      tags: ["dress", "silk", "evening", "elegant"]
    },
    {
      id: 25,
      name: "Wireless Earbuds Pro",
      description: "Noise-cancelling wireless earbuds with charging case",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 40,
      category: "electronics",
      tags: ["earbuds", "wireless", "audio", "noise-cancelling"]
    },
    {
      id: 26,
      name: "Ultra HD Monitor",
      description: "32-inch 4K monitor with HDR support",
      price: 399.99,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 22,
      category: "electronics",
      tags: ["monitor", "4k", "gaming", "productivity"]
    },
    {
      id: 27,
      name: "Smartphone Pro Max",
      description: "Latest smartphone with triple camera system",
      price: 999.99,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 35,
      category: "electronics",
      tags: ["smartphone", "camera", "premium", "tech"]
    },
    {
      id: 28,
      name: "Gaming Laptop",
      description: "High-performance laptop with RTX graphics",
      price: 1299.99,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 18,
      category: "electronics",
      tags: ["laptop", "gaming", "performance", "portable"]
    },
    {
      id: 29,
      name: "Smart Watch Series",
      description: "Fitness tracker with ECG and GPS",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 42,
      category: "electronics",
      tags: ["smartwatch", "fitness", "health", "wearable"]
    },
    {
      id: 30,
      name: "Bluetooth Speaker",
      description: "Portable waterproof speaker with 20-hour battery",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 55,
      category: "electronics",
      tags: ["speaker", "portable", "bluetooth", "audio"]
    },
    {
      id: 31,
      name: "Tablet Pro",
      description: "12.9-inch tablet with pencil support",
      price: 899.99,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 25,
      category: "electronics",
      tags: ["tablet", "portable", "creative", "productivity"]
    },
    {
      id: 32,
      name: "Noise-Cancelling Headphones",
      description: "Over-ear headphones with premium sound",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 38,
      category: "electronics",
      tags: ["headphones", "audio", "noise-cancelling", "premium"]
    },
    {
      id: 33,
      name: "Gaming Console",
      description: "Next-gen gaming console with 4K gaming",
      price: 499.99,
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 28,
      category: "electronics",
      tags: ["gaming", "console", "entertainment", "4k"]
    },
    {
      id: 34,
      name: "Action Camera",
      description: "Waterproof camera for adventure sports",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 32,
      category: "electronics",
      tags: ["camera", "action", "sports", "adventure"]
    },
    {
      id: 35,
      name: "Mechanical Keyboard",
      description: "RGB mechanical keyboard with customizable keys",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 45,
      category: "electronics",
      tags: ["keyboard", "gaming", "mechanical", "rgb"]
    },
    {
      id: 36,
      name: "Portable SSD",
      description: "2TB portable SSD with USB-C connectivity",
      price: 189.99,
      image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 50,
      category: "electronics",
      tags: ["storage", "portable", "fast", "tech"]
    },
    {
      id: 37,
      name: "Signature Perfume",
      description: "Luxury floral fragrance with long-lasting scent",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 35,
      category: "beauty",
      tags: ["perfume", "fragrance", "luxury", "signature"]
    },
    {
      id: 38,
      name: "Hydrating Serum",
      description: "Vitamin C serum for bright, hydrated skin",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 60,
      category: "beauty",
      tags: ["serum", "skincare", "vitamin-c", "hydration"]
    },
    {
      id: 39,
      name: "Men's Cologne Set",
      description: "Set of 3 masculine fragrances for everyday wear",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1590736969954-71e6d13f2e6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 42,
      category: "beauty",
      tags: ["cologne", "mens", "fragrance", "set"]
    },
    {
      id: 40,
      name: "Luxury Lipstick Set",
      description: "Set of 5 premium matte lipsticks",
      price: 64.99,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 38,
      category: "beauty",
      tags: ["lipstick", "makeup", "set", "premium"]
    },
    {
      id: 41,
      name: "Moisturizing Body Lotion",
      description: "24-hour hydration with shea butter",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 75,
      category: "beauty",
      tags: ["lotion", "bodycare", "moisturizer", "shea"]
    },
    {
      id: 42,
      name: "Aromatherapy Diffuser",
      description: "Ultrasonic essential oil diffuser with LED lights",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1602756359281-1b8dde1e9e30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 48,
      category: "beauty",
      tags: ["diffuser", "aromatherapy", "essential-oils", "relaxation"]
    },
    {
      id: 43,
      name: "Anti-Aging Cream",
      description: "Night cream with retinol for skin renewal",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 52,
      category: "beauty",
      tags: ["cream", "anti-aging", "retinol", "nightcare"]
    },
    {
      id: 44,
      name: "Sunscreen SPF 50",
      description: "Broad spectrum sunscreen for daily protection",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 80,
      category: "beauty",
      tags: ["sunscreen", "protection", "skincare", "spf"]
    },
    {
      id: 45,
      name: "Makeup Brush Set",
      description: "Professional 12-piece brush set",
      price: 54.99,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 44,
      category: "beauty",
      tags: ["brushes", "makeup", "tools", "professional"]
    },
    {
      id: 46,
      name: "Hair Care Kit",
      description: "Complete hair care set for all hair types",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 36,
      category: "beauty",
      tags: ["haircare", "kit", "shampoo", "conditioner"]
    },
    {
      id: 47,
      name: "Facial Cleansing Device",
      description: "Sonic facial cleanser for deep pore cleansing",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 29,
      category: "beauty",
      tags: ["cleanser", "device", "skincare", "sonic"]
    },
    {
      id: 48,
      name: "Essential Oils Collection",
      description: "Set of 6 therapeutic grade essential oils",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 58,
      category: "beauty",
      tags: ["essential-oils", "natural", "aromatherapy", "set"]
    },
    {
      id: 49,
      name: "Running Shoes Pro",
      description: "Lightweight running shoes with cushion technology",
      price: 119.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 42,
      category: "footwear",
      tags: ["running", "shoes", "sports", "performance"]
    },
    {
      id: 50,
      name: "Leather Loafers",
      description: "Genuine leather loafers for men",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 35,
      category: "footwear",
      tags: ["loafers", "leather", "formal", "mens"]
    },
    {
      id: 51,
      name: "High Heels",
      description: "Elegant stiletto heels for evening wear",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 28,
      category: "footwear",
      tags: ["heels", "evening", "formal", "womens"]
    },
    {
      id: 52,
      name: "Hiking Boots",
      description: "Waterproof hiking boots with ankle support",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 32,
      category: "footwear",
      tags: ["boots", "hiking", "outdoor", "waterproof"]
    },
    {
      id: 53,
      name: "Casual Sneakers",
      description: "Everyday comfortable sneakers",
      price: 64.99,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 55,
      category: "footwear",
      tags: ["sneakers", "casual", "comfort", "everyday"]
    },
    {
      id: 54,
      name: "Ballet Flats",
      description: "Soft leather ballet flats for women",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 40,
      category: "footwear",
      tags: ["flats", "ballet", "comfort", "womens"]
    },
    {
      id: 55,
      name: "Dress Oxfords",
      description: "Classic oxford shoes for formal occasions",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 30,
      category: "footwear",
      tags: ["oxfords", "formal", "dress", "mens"]
    },
    {
      id: 56,
      name: "Sandals",
      description: "Leather sandals for summer",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 48,
      category: "footwear",
      tags: ["sandals", "summer", "leather", "casual"]
    },
    {
      id: 57,
      name: "Basketball Shoes",
      description: "High-top basketball shoes with ankle support",
      price: 139.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 26,
      category: "footwear",
      tags: ["basketball", "sports", "high-top", "performance"]
    },
    {
      id: 58,
      name: "Slip-On Shoes",
      description: "Easy slip-on shoes for casual wear",
      price: 54.99,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 44,
      category: "footwear",
      tags: ["slip-on", "casual", "easy", "comfort"]
    },
    {
      id: 59,
      name: "Winter Boots",
      description: "Insulated boots for cold weather",
      price: 109.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 33,
      category: "footwear",
      tags: ["boots", "winter", "insulated", "cold-weather"]
    },
    {
      id: 60,
      name: "Workout Shoes",
      description: "Cross-training shoes for gym workouts",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 37,
      category: "footwear",
      tags: ["workout", "training", "gym", "fitness"]
    },
    {
      id: 61,
      name: "Designer Sunglasses",
      description: "UV protection polarized sunglasses",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 40,
      category: "accessories",
      tags: ["sunglasses", "designer", "uv", "fashion"]
    },
    {
      id: 62,
      name: "Leather Handbag",
      description: "Genuine leather handbag with gold hardware",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 25,
      category: "accessories",
      tags: ["handbag", "leather", "luxury", "womens"]
    },
    {
      id: 63,
      name: "Smartphone Case",
      description: "Protective case with MagSafe compatibility",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1586950012036-b957f2c7cbf3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 80,
      category: "accessories",
      tags: ["case", "phone", "protection", "magsafe"]
    },
    {
      id: 64,
      name: "Diamond Necklace",
      description: "18k gold necklace with diamond pendant",
      price: 499.99,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 15,
      category: "accessories",
      tags: ["necklace", "diamond", "jewelry", "luxury"]
    },
    {
      id: 65,
      name: "Leather Wallet",
      description: "Minimalist leather wallet for men",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 55,
      category: "accessories",
      tags: ["wallet", "leather", "mens", "minimalist"]
    },
    {
      id: 66,
      name: "Silk Scarf",
      description: "Printed silk scarf for all seasons",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 45,
      category: "accessories",
      tags: ["scarf", "silk", "fashion", "versatile"]
    },
    {
      id: 67,
      name: "Laptop Backpack",
      description: "Water-resistant backpack with laptop compartment",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 38,
      category: "accessories",
      tags: ["backpack", "laptop", "travel", "water-resistant"]
    },
    {
      id: 68,
      name: "Leather Belt",
      description: "Genuine leather belt with metal buckle",
      price: 44.99,
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 60,
      category: "accessories",
      tags: ["belt", "leather", "mens", "accessory"]
    },
    {
      id: 69,
      name: "Pearl Earrings",
      description: "Classic pearl stud earrings",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 32,
      category: "accessories",
      tags: ["earrings", "pearl", "jewelry", "classic"]
    },
    {
      id: 70,
      name: "Smartwatch Band",
      description: "Collection of interchangeable watch bands",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 65,
      category: "accessories",
      tags: ["watchband", "smartwatch", "accessory", "interchangeable"]
    },
    {
      id: 71,
      name: "Travel Pillow",
      description: "Memory foam travel pillow for long flights",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 50,
      category: "accessories",
      tags: ["pillow", "travel", "comfort", "airplane"]
    },
    {
      id: 72,
      name: "Woven Basket Bag",
      description: "Hand-woven natural fiber basket bag",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stock: 28,
      category: "accessories",
      tags: ["bag", "woven", "natural", "bohemian"]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'all',
    'mens-clothing',
    'womens-clothing',
    'electronics',
    'beauty',
    'footwear',
    'accessories'
  ];

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="section-title">All Products</h1>
        <p className="section-subtitle">Browse our complete collection of premium products</p>
      </div>

      <div className="products-controls">
        
<div className="search-section">
  <div className="search-container">
    {/* Search Icon */}
    <span className="search-icon">🔍</span>
    
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-input"
    />
    
    {/* Clear Button - Only shows when there's text */}
    {searchTerm && (
      <button 
        className="clear-search-btn"
        onClick={() => setSearchTerm('')}
        aria-label="Clear search"
      >
        ✕
      </button>
    )}
  </div>
</div>

        <div className="filter-section">
          <h3>Filter by Category</h3>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Products' : category.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="sort-section">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock">Stock Available</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <div className="no-products-icon">🔍</div>
          <h2>No products found</h2>
          <p>Try adjusting your search or filter criteria</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="products-info">
        <p>Showing {filteredProducts.length} of {products.length} products</p>
      </div>
    </div>
  );
};

export default ProductsPage;