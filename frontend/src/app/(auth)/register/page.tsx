'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Lock, Mail, User, Phone, UtensilsCrossed, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password, phone);
      router.push('/menu');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
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
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">
            Join Aura Bistro for seamless online ordering and live order tracking
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Shidam"
                className="form-input"
              />
            </div>
          </div>

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
            <label className="form-label">Phone Number (Optional)</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 012-3456"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-auth-submit"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="auth-switch-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
