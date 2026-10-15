'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Lock, Mail, UtensilsCrossed, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/menu');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role: 'customer' | 'staff' | 'admin') => {
    if (role === 'customer') {
      setEmail('customer@restaurant.com');
      setPassword('customerPassword123!');
    } else if (role === 'staff') {
      setEmail('staff@restaurant.com');
      setPassword('staffPassword123!');
    } else {
      setEmail('admin@restaurant.com');
      setPassword('adminPassword123!');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <UtensilsCrossed size={24} color="#ffffff" />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Log in to manage orders, track delivery, and explore the menu
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-auth-submit"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Quick Demo Logins Bar */}
        <div className="demo-accounts-box">
          <span className="demo-accounts-title">Quick Demo Logins:</span>
          <div className="demo-buttons-row">
            <button
              type="button"
              onClick={() => fillDemoAccount('customer')}
              className="btn-demo-pill"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('staff')}
              className="btn-demo-pill"
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="btn-demo-pill"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link href="/register" className="auth-switch-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
