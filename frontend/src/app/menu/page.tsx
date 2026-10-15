'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../services/api';
import { Category, MenuItem } from '../../types';
import { FoodCard } from '../../components/FoodCard';
import {
  Search,
  Filter,
  UtensilsCrossed,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export default function MenuPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories & items on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catsRes, itemsRes] = await Promise.all([
          api.categories.getAll(),
          api.menuItems.getAll(),
        ]);

        if (catsRes.success) setCategories(catsRes.data);
        if (itemsRes.success) setMenuItems(itemsRes.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load menu data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Update selectedCategory if URL search param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Client-side filtering & sorting
  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all') {
          const catSlug = typeof item.category === 'object' ? item.category.slug : '';
          const catId = typeof item.category === 'object' ? item.category._id : item.category;
          if (catSlug !== selectedCategory && catId !== selectedCategory) {
            return false;
          }
        }

        // Tag filter
        if (selectedTag !== 'all') {
          if (!item.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTag) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        // Default: featured first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [menuItems, selectedCategory, selectedTag, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="menu-page-container">
      {/* Menu Header Banner */}
      <div className="menu-header-banner">
        <div className="menu-header-content">
          <div className="section-tag">
            <UtensilsCrossed size={14} color="#f97316" />
            <span>Culinary Selection</span>
          </div>
          <h1 className="menu-page-title">Explore Our Menu</h1>
          <p className="menu-page-subtitle">
            Hand-crafted appetizers, artisan mains, stone-baked pizzas, and refreshing drinks
          </p>
        </div>
      </div>

      <div className="menu-content-wrap">
        {/* Search & Sort Controls Bar */}
        <div className="menu-controls-bar">
          {/* Search Input */}
          <div className="menu-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search dishes, ingredients, or tags (e.g. Truffle, Spicy, Salmon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="menu-sort-box">
            <ArrowUpDown size={16} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="menu-sort-select"
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs-container">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`category-tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            All Courses
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`category-tab-btn ${
                selectedCategory === cat.slug ? 'active' : ''
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Quick Dietary Tags Pill Filters */}
        <div className="dietary-tags-row">
          <span className="tags-label">Quick Filters:</span>
          {['all', 'Vegetarian', 'Spicy', 'Chef Special', 'Italian', 'Gluten-Free'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`tag-filter-pill ${selectedTag === tag ? 'active' : ''}`}
            >
              {tag === 'all' ? 'All Tags' : tag}
            </button>
          ))}
        </div>

        {/* Results Info Bar */}
        <div className="menu-results-info">
          <span className="results-count">
            Showing <strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? 'dish' : 'dishes'}
          </span>
          {(selectedCategory !== 'all' || selectedTag !== 'all' || searchQuery) && (
            <button onClick={resetFilters} className="btn-reset-filters">
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <div className="food-cards-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
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
            <p>{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="menu-empty-state">
            <div className="empty-state-icon">
              <UtensilsCrossed size={42} color="#64748b" />
            </div>
            <h3>No dishes found</h3>
            <p>We couldn't find any dishes matching your current search or filter criteria.</p>
            <button onClick={resetFilters} className="btn-primary-sm">
              View All Menu Dishes
            </button>
          </div>
        ) : (
          <div className="food-cards-grid">
            {filteredItems.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
