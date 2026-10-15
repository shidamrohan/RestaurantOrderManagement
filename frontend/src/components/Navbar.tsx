'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  User as UserIcon,
  LogOut,
  UtensilsCrossed,
  ShieldCheck,
  ClipboardList,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand / Logo */}
        <Link href="/" className="navbar-brand">
          <div className="logo-icon">
            <UtensilsCrossed size={22} color="#ffffff" />
          </div>
          <div className="brand-text">
            <span className="brand-title">AURA BISTRO</span>
            <span className="brand-subtitle">Order & Table Management</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/menu" className="nav-link">
            Menu
          </Link>
          {isAuthenticated && (
            <Link href="/orders" className="nav-link">
              <ClipboardList size={16} />
              <span>My Orders</span>
            </Link>
          )}
          {isStaff && (
            <Link href="/admin" className="nav-link staff-badge-link">
              <ShieldCheck size={16} />
              <span>Staff Portal</span>
            </Link>
          )}
        </nav>

        {/* Right Actions: Cart & Auth */}
        <div className="navbar-actions">
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="cart-trigger-btn"
            aria-label="View Cart"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>

          {/* User Status / Login */}
          {isAuthenticated && user ? (
            <div className="user-profile-menu">
              <div className="user-info-pill">
                <UserIcon size={16} className="user-avatar-icon" />
                <span className="user-name-display">{user.name.split(' ')[0]}</span>
                <span className="user-role-tag">{user.role}</span>
              </div>
              <button
                onClick={() => logout()}
                className="logout-action-btn"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link href="/login" className="btn-secondary-sm">
                Log In
              </Link>
              <Link href="/register" className="btn-primary-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger-btn"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-link"
          >
            Home
          </Link>
          <Link
            href="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-link"
          >
            Explore Menu
          </Link>
          {isAuthenticated && (
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-link"
            >
              My Orders
            </Link>
          )}
          {isStaff && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-link"
            >
              Staff & Admin Portal
            </Link>
          )}
          {!isAuthenticated ? (
            <div className="mobile-auth-actions">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-secondary-full"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary-full"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="btn-danger-outline"
            >
              Log Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};
