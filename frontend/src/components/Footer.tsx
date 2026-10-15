import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, Clock, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Brand info */}
        <div className="footer-brand-column">
          <div className="footer-logo">
            <div className="logo-icon-sm">
              <UtensilsCrossed size={18} color="#ffffff" />
            </div>
            <span className="footer-title">AURA BISTRO</span>
          </div>
          <p className="footer-desc">
            Artisanal dining meets seamless modern order management. Crafted with
            culinary passion and designed for real-time restaurant efficiency.
          </p>
          <div className="footer-meta-badge">
            <ShieldCheck size={14} color="#10b981" />
            <span>Secure Cash on Delivery & Pay at Restaurant Support</span>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="footer-column">
          <h4 className="footer-heading">Kitchen Hours</h4>
          <ul className="footer-list">
            <li className="footer-item">
              <Clock size={14} className="icon-muted" />
              <span>Mon - Fri: 11:00 AM - 10:30 PM</span>
            </li>
            <li className="footer-item">
              <Clock size={14} className="icon-muted" />
              <span>Sat - Sun: 10:00 AM - 11:30 PM</span>
            </li>
            <li className="footer-item status-open">
              <span className="dot-live"></span>
              <span>Kitchen is Currently Accepting Orders</span>
            </li>
          </ul>
        </div>

        {/* Location & Contact */}
        <div className="footer-column">
          <h4 className="footer-heading">Contact & Pickup</h4>
          <ul className="footer-list">
            <li className="footer-item">
              <MapPin size={14} className="icon-muted" />
              <span>450 Grand Culinary Ave, Suite 100</span>
            </li>
            <li className="footer-item">
              <Phone size={14} className="icon-muted" />
              <span>+1 (555) 789-FOOD (3663)</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li>
              <Link href="/menu" className="footer-link">
                Full Food Menu
              </Link>
            </li>
            <li>
              <Link href="/orders" className="footer-link">
                Track My Order
              </Link>
            </li>
            <li>
              <Link href="/admin" className="footer-link">
                Staff / Admin Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Aura Bistro. All rights reserved.</p>
        <p className="footer-tagline">
          Powered by Next.js, Express & MongoDB Atlas
        </p>
      </div>
    </footer>
  );
};
