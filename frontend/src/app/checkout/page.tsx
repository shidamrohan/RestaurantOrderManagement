'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Bike,
  Store,
  Banknote,
  MapPin,
  Phone,
  FileText,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const {
    items,
    fulfillmentType,
    setFulfillmentType,
    paymentMethod,
    subtotal,
    deliveryFee,
    tax,
    total,
    clearCart,
  } = useCart();

  // Form states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [zipCode, setZipCode] = useState('10001');
  const [phone, setPhone] = useState(user?.phone || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [pickupTime, setPickupTime] = useState('Within 20-30 mins');
  const [customerNotes, setCustomerNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  // If cart is empty and not ordered
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="checkout-empty-container">
        <div className="checkout-empty-card">
          <ShoppingBag size={56} color="#64748b" />
          <h2>Your Cart is Empty</h2>
          <p>Please select some delicious dishes from our menu before proceeding to checkout.</p>
          <Link href="/menu" className="btn-primary-sm">
            Explore Food Menu
          </Link>
        </div>
      </div>
    );
  }

  // If Order Successfully Placed
  if (orderSuccess) {
    return (
      <div className="order-success-container">
        <div className="order-success-card">
          <div className="success-badge-icon">
            <CheckCircle2 size={42} color="#10b981" />
          </div>
          <span className="success-subtitle">Order Placed Successfully!</span>
          <h1 className="success-order-number">{orderSuccess.orderNumber}</h1>

          <div className="success-details-box">
            <div className="success-row">
              <span>Fulfillment Type:</span>
              <strong style={{ textTransform: 'capitalize' }}>
                {orderSuccess.fulfillmentType}
              </strong>
            </div>
            <div className="success-row">
              <span>Payment Due:</span>
              <strong style={{ color: '#f97316' }}>
                ${orderSuccess.totalAmount.toFixed(2)} ({orderSuccess.paymentMethod})
              </strong>
            </div>
            <div className="success-row">
              <span>Current Status:</span>
              <span className="status-pill pending">Pending Kitchen Confirmation</span>
            </div>
          </div>

          <p className="success-note">
            The restaurant kitchen has received your order and will begin preparing it shortly.
          </p>

          <div className="success-actions">
            <Link href="/orders" className="btn-primary-sm">
              Track Order Progress
            </Link>
            <Link href="/menu" className="btn-secondary-sm">
              Return to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError('You must be logged in to place an order. Please log in or register first.');
      return;
    }

    if (fulfillmentType === 'delivery') {
      if (!street || !phone) {
        setError('Please provide street address and contact phone number for delivery.');
        return;
      }
    } else {
      if (!phone) {
        setError('Please provide a contact phone number for pickup verification.');
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        items: items.map((i) => ({
          menuItemId: i.item._id,
          quantity: i.quantity,
        })),
        fulfillmentType,
        deliveryAddress:
          fulfillmentType === 'delivery'
            ? {
                street,
                city,
                state,
                zipCode,
                phone,
                instructions: deliveryInstructions,
              }
            : undefined,
        pickupDetails:
          fulfillmentType === 'pickup'
            ? {
                contactPhone: phone,
                estimatedTime: pickupTime,
              }
            : undefined,
        paymentMethod,
        customerNotes,
      };

      const res = await api.orders.create(payload);

      if (res.success) {
        setOrderSuccess(res.data);
        clearCart();
      } else {
        setError(res.message || 'Could not place order');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page-container">
      <div className="checkout-header">
        <h1 className="checkout-title">Checkout & Order Confirmation</h1>
        <p className="checkout-subtitle">
          Review your order, specify delivery or pickup details, and confirm offline payment
        </p>
      </div>

      {error && (
        <div className="checkout-alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
          {!isAuthenticated && (
            <Link href="/login" className="alert-login-link">
              Log In Now
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="checkout-grid-layout">
        {/* Left Column: Fulfillment Details & Payment */}
        <div className="checkout-form-column">
          {/* 1. Fulfillment Selector */}
          <div className="checkout-card">
            <h2 className="card-section-title">1. Select Fulfillment Type</h2>
            <div className="fulfillment-grid">
              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`fulfillment-choice-card ${
                  fulfillmentType === 'delivery' ? 'selected' : ''
                }`}
              >
                <div className="choice-icon">
                  <Bike size={24} />
                </div>
                <div className="choice-info">
                  <span className="choice-name">Doorstep Delivery</span>
                  <span className="choice-fee">$5.00 Flat Delivery Fee</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`fulfillment-choice-card ${
                  fulfillmentType === 'pickup' ? 'selected' : ''
                }`}
              >
                <div className="choice-icon">
                  <Store size={24} />
                </div>
                <div className="choice-info">
                  <span className="choice-name">Counter Pickup</span>
                  <span className="choice-fee">Free - Collect at Restaurant</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Address / Contact Details */}
          <div className="checkout-card">
            <h2 className="card-section-title">
              2. {fulfillmentType === 'delivery' ? 'Delivery Address' : 'Pickup Contact Details'}
            </h2>

            {fulfillmentType === 'delivery' ? (
              <div className="form-fields-grid">
                <div className="form-group full-width">
                  <label className="form-label">Street Address *</label>
                  <div className="input-with-icon">
                    <MapPin size={18} className="input-icon" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State & Zip Code *</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      required
                      style={{ width: '40%' }}
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="text"
                      required
                      style={{ width: '60%' }}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Contact Phone Number (For Courier) *</label>
                  <div className="input-with-icon">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Delivery Notes / Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. Leave with doorman or ring bell #12"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            ) : (
              <div className="form-fields-grid">
                <div className="form-group full-width">
                  <label className="form-label">Contact Phone Number *</label>
                  <div className="input-with-icon">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Estimated Pickup Window</label>
                  <div className="input-with-icon">
                    <Clock size={18} className="input-icon" />
                    <input
                      type="text"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      placeholder="e.g. 20-30 mins"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="pickup-location-note full-width">
                  <MapPin size={16} color="#f97316" />
                  <span>
                    Pickup Location: <strong>450 Grand Culinary Ave, Suite 100</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Payment Method */}
          <div className="checkout-card">
            <h2 className="card-section-title">3. Payment Method (Offline)</h2>

            <div className="offline-payment-box">
              <div className="payment-icon-wrap">
                <Banknote size={24} color="#10b981" />
              </div>
              <div className="payment-details">
                <h3 className="payment-name">
                  {fulfillmentType === 'delivery'
                    ? 'Cash on Delivery (COD)'
                    : 'Pay at Restaurant Counter'}
                </h3>
                <p className="payment-sub">
                  {fulfillmentType === 'delivery'
                    ? 'Hand cash directly to our delivery courier when your warm food arrives at your door.'
                    : 'Pay by cash or card directly at our pickup counter when collecting your meal.'}
                </p>
                <div className="gateway-notice">
                  <ShieldCheck size={14} color="#10b981" />
                  <span>No upfront online card payments required for this order.</span>
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">Special Cooking Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Extra spicy, no onions, gluten allergy, etc."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="form-input textarea"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-summary-column">
          <div className="order-summary-card">
            <h2 className="card-section-title">Order Summary</h2>

            {/* Items List */}
            <div className="summary-items-list">
              {items.map(({ item, quantity }) => (
                <div key={item._id} className="summary-item-row">
                  <div className="summary-item-details">
                    <span className="summary-item-qty">{quantity}x</span>
                    <span className="summary-item-name">{item.name}</span>
                  </div>
                  <span className="summary-item-price">
                    ${(item.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="summary-breakdown">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="breakdown-row">
                <span>
                  {fulfillmentType === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}
                </span>
                <span>
                  {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'FREE'}
                </span>
              </div>
              <div className="breakdown-row">
                <span>Estimated Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="breakdown-row total">
                <span>Total Amount</span>
                <span className="total-highlight">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Authentication Notice if not logged in */}
            {!isAuthenticated ? (
              <div className="auth-required-box">
                <p>You must be signed in to place your order.</p>
                <Link href="/login" className="btn-primary-sm" style={{ textAlign: 'center' }}>
                  Log In or Register to Proceed
                </Link>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-place-order"
              >
                {loading ? 'Processing Order...' : 'Confirm & Place Order'}
                {!loading && <ArrowRight size={18} />}
              </button>
            )}

            <p className="order-terms-note">
              By confirming, you agree to pay the total amount upon food delivery or pickup.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
