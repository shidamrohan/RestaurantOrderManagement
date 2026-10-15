'use client';

import React from 'react';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Clock, Sparkles } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { items, addItem, updateQuantity } = useCart();

  const cartEntry = items.find((ci) => ci.item._id === item._id);
  const quantityInCart = cartEntry ? cartEntry.quantity : 0;

  return (
    <div className={`food-card ${!item.isAvailable ? 'food-card-unavailable' : ''}`}>
      {/* Image Container */}
      <div className="food-image-container">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="food-card-image"
            loading="lazy"
          />
        ) : (
          <div className="food-image-fallback">
            <span>🍽️ Delicious Dish</span>
          </div>
        )}

        {/* Featured Badge */}
        {item.isFeatured && (
          <div className="food-badge-featured">
            <Sparkles size={12} />
            <span>Chef's Choice</span>
          </div>
        )}

        {/* Availability Badge if Sold Out */}
        {!item.isAvailable && (
          <div className="food-badge-soldout">
            <span>Sold Out</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="food-card-body">
        <div className="food-card-header">
          <h3 className="food-card-title">{item.name}</h3>
          <span className="food-card-price">${item.price.toFixed(2)}</span>
        </div>

        <p className="food-card-desc">{item.description}</p>

        {/* Tags & Prep Time */}
        <div className="food-card-meta">
          <div className="food-prep-time">
            <Clock size={13} />
            <span>{item.preparationTime} mins</span>
          </div>

          <div className="food-tags-list">
            {item.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="food-tag-pill">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Add to Cart Actions */}
        <div className="food-card-footer">
          {item.isAvailable ? (
            quantityInCart > 0 ? (
              <div className="cart-quantity-selector">
                <button
                  onClick={() => updateQuantity(item._id, quantityInCart - 1)}
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-count">{quantityInCart}</span>
                <button
                  onClick={() => updateQuantity(item._id, quantityInCart + 1)}
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addItem(item, 1)}
                className="btn-add-to-cart"
              >
                <Plus size={16} />
                <span>Add to Cart</span>
              </button>
            )
          ) : (
            <button disabled className="btn-add-to-cart btn-disabled">
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
