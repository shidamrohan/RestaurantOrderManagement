'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  ClipboardList,
  Clock,
  Bike,
  Store,
  Banknote,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  PackageCheck,
  Calendar,
} from 'lucide-react';

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.orders.getMyOrders();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="orders-page-container">
        <div className="orders-loading">Loading order history...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="orders-page-container">
        <div className="orders-auth-gate">
          <ClipboardList size={54} color="#f97316" />
          <h1>View Your Orders</h1>
          <p>Please log in with your customer account to view your past orders and track active deliveries.</p>
          <div className="auth-gate-actions">
            <Link href="/login" className="btn-primary-sm">
              Log In
            </Link>
            <Link href="/register" className="btn-secondary-sm">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Helper for Order Status Stepper
  const getStepProgress = (status: OrderStatus, fulfillment: string) => {
    const isDelivery = fulfillment === 'delivery';
    const steps = isDelivery
      ? ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered']
      : ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered'];

    if (status === 'Cancelled') return { steps, currentIndex: -1, isCancelled: true };
    const currentIndex = steps.indexOf(status);
    return { steps, currentIndex, isCancelled: false };
  };

  return (
    <div className="orders-page-container">
      {/* Header */}
      <div className="orders-header">
        <div>
          <h1 className="orders-title">Your Order History & Tracking</h1>
          <p className="orders-subtitle">
            Track kitchen preparation, delivery progress, and view past receipts
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="btn-refresh-orders"
        >
          <RotateCcw size={16} className={loading ? 'icon-spin' : ''} />
          <span>Refresh Status</span>
        </button>
      </div>

      {error && (
        <div className="orders-alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="orders-skeleton-list">
          {[1, 2].map((n) => (
            <div key={n} className="order-skeleton-card">
              <div className="skeleton-line title"></div>
              <div className="skeleton-line timeline"></div>
              <div className="skeleton-line body"></div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty-state">
          <div className="empty-state-icon">
            <ClipboardList size={48} color="#64748b" />
          </div>
          <h2>No orders placed yet</h2>
          <p>You haven't ordered any food yet. Browse our menu to make your first order!</p>
          <Link href="/menu" className="btn-primary-sm">
            Browse Menu Now
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const { steps, currentIndex, isCancelled } = getStepProgress(
              order.orderStatus,
              order.fulfillmentType
            );

            return (
              <div key={order._id} className="order-card">
                {/* Order Top Bar */}
                <div className="order-card-header">
                  <div className="order-id-group">
                    <span className="order-number-tag">{order.orderNumber}</span>
                    <span className="order-date-time">
                      <Calendar size={13} />
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                    </span>
                  </div>

                  <div className="order-status-pill-wrap">
                    <span className={`status-pill ${order.orderStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Real-time Order Progress Stepper */}
                {!isCancelled && (
                  <div className="order-timeline-stepper">
                    <div className="stepper-track">
                      {steps.map((step, idx) => {
                        const isDone = idx <= currentIndex;
                        const isCurrent = idx === currentIndex;

                        return (
                          <div
                            key={step}
                            className={`stepper-step ${isDone ? 'done' : ''} ${
                              isCurrent ? 'current' : ''
                            }`}
                          >
                            <div className="stepper-dot">
                              {isDone ? (
                                <CheckCircle2 size={16} />
                              ) : (
                                <span className="dot-number">{idx + 1}</span>
                              )}
                            </div>
                            <span className="stepper-label">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className="order-cancelled-notice">
                    <AlertCircle size={16} />
                    <span>This order has been cancelled.</span>
                  </div>
                )}

                {/* Items & Payment Summary */}
                <div className="order-details-body">
                  <div className="order-items-column">
                    <h4 className="column-subheading">Items Ordered</h4>
                    <ul className="ordered-items-list">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="ordered-item-row">
                          <span className="item-qty-badge">{item.quantity}x</span>
                          <span className="item-name">{item.name}</span>
                          <span className="item-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="order-meta-column">
                    <h4 className="column-subheading">Fulfillment & Payment</h4>

                    <div className="order-meta-info-box">
                      <div className="meta-row">
                        <span className="meta-label">Fulfillment:</span>
                        <span className="meta-value">
                          {order.fulfillmentType === 'delivery' ? (
                            <span className="fulfillment-badge delivery">
                              <Bike size={14} /> Doorstep Delivery
                            </span>
                          ) : (
                            <span className="fulfillment-badge pickup">
                              <Store size={14} /> Takeaway Pickup
                            </span>
                          )}
                        </span>
                      </div>

                      {order.fulfillmentType === 'delivery' && order.deliveryAddress && (
                        <div className="meta-row">
                          <span className="meta-label">Address:</span>
                          <span className="meta-value address">
                            {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                            {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                          </span>
                        </div>
                      )}

                      <div className="meta-row">
                        <span className="meta-label">Payment Method:</span>
                        <span className="meta-value payment">
                          <Banknote size={14} color="#10b981" />
                          <span>{order.paymentMethod}</span>
                          <span className={`payment-status-tag ${order.paymentStatus.toLowerCase()}`}>
                            ({order.paymentStatus})
                          </span>
                        </span>
                      </div>

                      <div className="meta-row total">
                        <span className="meta-label">Total Amount:</span>
                        <span className="meta-value total-price">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
