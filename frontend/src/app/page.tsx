'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../services/api';
import { Category, MenuItem } from '../types';
import { FoodCard } from '../components/FoodCard';
import {
  Utensils,
  Bike,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Banknote,
} from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [catRes, itemsRes] = await Promise.all([
          api.categories.getAll(),
          api.menuItems.getAll({ featured: true }),
        ]);

        if (catRes.success) setCategories(catRes.data);
        if (itemsRes.success) setFeaturedItems(itemsRes.data);
      } catch (err: any) {
        setError(err.message || 'Failed to connect to backend server');
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <main className="home-container">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} color="#f97316" />
            <span>Welcome to Aura Bistro & Bar</span>
          </div>

          <h1 className="hero-title">
            Artisanal Dining Meets <br />
            <span className="hero-highlight">Instant Order Management</span>
          </h1>

          <p className="hero-description">
            Savor chef-crafted specialties made with farm-fresh ingredients.
            Order online with hassle-free <strong>Cash on Delivery (COD)</strong>{' '}
            or <strong>Takeaway Pickup</strong> with live kitchen status updates.
          </p>

          <div className="hero-actions">
            <Link href="/menu" className="btn-hero-primary">
              <Utensils size={18} />
              <span>Explore Full Menu</span>
            </Link>

            <Link href="/orders" className="btn-hero-secondary">
              <span>Track Your Order</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Quick value badges */}
          <div className="hero-badges-row">
            <div className="hero-badge-item">
              <Banknote size={16} color="#10b981" />
              <span>Cash on Delivery (COD)</span>
            </div>
            <div className="hero-badge-item">
              <Bike size={16} color="#f97316" />
              <span>Fast 30-min Delivery</span>
            </div>
            <div className="hero-badge-item">
              <Clock size={16} color="#38bdf8" />
              <span>Express Counter Pickup</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Carousel / Grid */}
      <section className="home-categories-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle">
              Carefully curated courses designed for culinary satisfaction
            </p>
          </div>
          <Link href="/menu" className="view-all-link">
            <span>View All Categories</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/menu?category=${cat.slug}`}
              className="category-card"
            >
              <div className="category-img-box">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="cat-img" />
                ) : (
                  <div className="cat-img-fallback">🍽️</div>
                )}
                <div className="cat-overlay"></div>
              </div>
              <div className="category-card-info">
                <h3 className="category-card-name">{cat.name}</h3>
                <p className="category-card-desc">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Dishes Section */}
      <section className="home-featured-section">
        <div className="section-header">
          <div>
            <div className="section-tag">
              <Sparkles size={14} color="#f97316" />
              <span>Chef's Choice</span>
            </div>
            <h2 className="section-title">Signature Dishes</h2>
            <p className="section-subtitle">
              Our most celebrated creations, freshly prepared to order
            </p>
          </div>
          <Link href="/menu" className="view-all-link">
            <span>See Full Menu ({featuredItems.length} items)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="food-skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-line title"></div>
                <div className="skeleton-line desc"></div>
                <div className="skeleton-line btn"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-banner">
            <p>Could not load menu items: {error}</p>
            <p className="error-hint">
              Make sure the backend is running on http://localhost:5000
            </p>
          </div>
        ) : (
          <div className="food-cards-grid">
            {featuredItems.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* 4. How the Ordering Workflow Works */}
      <section className="home-workflow-section">
        <div className="workflow-header">
          <h2 className="section-title">How Your Order Works</h2>
          <p className="section-subtitle">
            Seamless food ordering with transparent, real-time kitchen tracking
          </p>
        </div>

        <div className="workflow-steps-grid">
          <div className="workflow-step-card">
            <div className="step-number">01</div>
            <h3 className="step-title">Select Your Dishes</h3>
            <p className="step-desc">
              Browse our digital menu, customize your order, and add favorite
              appetizers, mains, and mocktails to your cart.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number">02</div>
            <h3 className="step-title">Delivery or Pickup</h3>
            <p className="step-desc">
              Choose doorstep delivery with flat $5 fee, or select counter
              pickup to grab your order fresh from the kitchen.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number">03</div>
            <h3 className="step-title">Pay When You Receive</h3>
            <p className="step-desc">
              No online card gateway required. Pay with <strong>Cash on Delivery (COD)</strong>{' '}
              or <strong>Pay at Restaurant counter</strong> upon pickup.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number">04</div>
            <h3 className="step-title">Live Status Updates</h3>
            <p className="step-desc">
              Watch your order progress from Pending ➔ Preparing ➔ Ready ➔
              Delivered in real-time on your customer order dashboard.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
