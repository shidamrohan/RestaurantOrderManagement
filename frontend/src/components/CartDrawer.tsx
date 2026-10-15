'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Bike,
  Store,
  ArrowRight,
  Banknote,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    fulfillmentType,
    setFulfillmentType,
    paymentMethod,
    subtotal,
    deliveryFee,
    tax,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-overlay">
      {/* Backdrop */}
      <div
        className="cart-drawer-backdrop"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-out Drawer Panel */}
      <div className="cart-drawer-panel">
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} color="#f97316" />
            <h2>Your Food Order</h2>
            <span className="cart-items-tag">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="cart-close-btn"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Fulfillment Type Toggle */}
        <div className="cart-fulfillment-selector">
          <button
            type="button"
            onClick={() => setFulfillmentType('delivery')}
            className={`fulfillment-option-btn ${
              fulfillmentType === 'delivery' ? 'active' : ''
            }`}
          >
            <Bike size={18} />
            <div className="option-text">
              <span className="option-title">Delivery</span>
              <span className="option-sub">$5.00 flat fee</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFulfillmentType('pickup')}
            className={`fulfillment-option-btn ${
              fulfillmentType === 'pickup' ? 'active' : ''
            }`}
          >
            <Store size={18} />
            <div className="option-text">
              <span className="option-title">Takeaway Pickup</span>
              <span className="option-sub">Free at counter</span>
            </div>
          </button>
        </div>

        {/* Payment Policy Notice */}
        <div className="cart-payment-badge">
          <Banknote size={15} color="#10b981" />
          <span>
            Payment Method:{' '}
            <strong>
              {paymentMethod === 'COD'
                ? 'Cash on Delivery (Pay at Door)'
                : 'Pay at Restaurant (On Pickup)'}
            </strong>
          </span>
        </div>

        {/* Items List */}
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <div className="cart-empty-view">
              <div className="cart-empty-icon">
                <ShoppingBag size={48} color="#64748b" />
              </div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any appetizing dishes yet.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-primary-sm"
              >
                Browse Our Menu
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map(({ item, quantity }) => (
                <div key={item._id} className="cart-item-row">
                  {/* Thumbnail */}
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120'}
                    alt={item.name}
                    className="cart-item-thumb"
                  />

                  {/* Details */}
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-unit-price">
                      ${item.price.toFixed(2)} each
                    </span>

                    {/* Quantity controls */}
                    <div className="cart-item-qty-row">
                      <div className="cart-quantity-selector small">
                        <button
                          onClick={() => updateQuantity(item._id, quantity - 1)}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-count">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, quantity + 1)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="cart-item-total">
                        ${(item.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeItem(item._id)}
                    className="cart-item-delete"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-calculations">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>
                  {fulfillmentType === 'delivery'
                    ? 'Delivery Fee'
                    : 'Pickup Fee'}
                </span>
                <span>
                  {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'FREE'}
                </span>
              </div>
              <div className="summary-row">
                <span>Estimated Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span className="total-value">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-footer-actions">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="btn-checkout"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </Link>

              <button onClick={() => clearCart()} className="btn-clear-cart">
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
