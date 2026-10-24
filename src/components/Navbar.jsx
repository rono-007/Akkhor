import React from 'react';
import { 
  Search,
  Heart, 
  ShoppingBag, 
  Sun, 
  Moon
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  compareCount,
  openCompareDrawer,
  wishlistCount,
  openWishlistDrawer,
  cartCount,
  openCartDrawer,
  searchQuery,
  setSearchQuery,
  onExploreFonts
}) {
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('akshar_theme', nextTheme);
    } catch {}
  };

  const navItems = [
    { id: 'store', label: 'হোম' },
    { id: 'fonts', label: 'ফন্টসম্ভার' },
    { id: 'playground', label: 'পোস্টার স্টুডিও' },
    { id: 'waterfall', label: 'সংগ্রহশালা' },
    { id: 'about', label: 'আমাদের কথা' }
  ];

  const handleNavClick = (id) => {
    if (id === 'about') {
      const footerEl = document.querySelector('.foundry-footer');
      if (footerEl) {
        footerEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="ref-site-header">
      <div className="container">
        <div className="ref-header-inner">
          {/* Brand Logo & Name with exact vertical separator */}
          <div 
            className="ref-brand-group" 
            onClick={() => handleNavClick('store')} 
            role="button" 
            tabIndex={0}
            title="AKSHAR — Bengali Type Foundry & Specimen Archive"
          >
            <div className="brand-logo-mark">
              <span className="ref-brand-bengali">অক্ষর</span>
              <span className="brand-dot-red">.</span>
            </div>
            <div className="brand-vertical-sep" />
            <div className="brand-meta-group">
              <span className="brand-sub-latin-top">BENGALI</span>
              <span className="brand-sub-latin-bottom">TYPE FOUNDRY</span>
            </div>
          </div>

          {/* Center Navigation Links matching the screenshot */}
          <nav className="ref-nav-links" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = (item.id === 'store' && activeTab === 'store') || (item.id === activeTab);
              return (
                <button
                  key={item.id}
                  className={`ref-nav-item ${isActive ? 'active-pill' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="ref-nav-text">{item.label}</span>
                  {isActive && <span className="ref-nav-active-dot" />}
                </button>
              );
            })}
          </nav>

          {/* Right Header Tools: Circular Search, Sun/Moon Capsule, Login Pill Button */}
          <div className="ref-header-tools">
            {/* Circular Search Button */}
            <button
              className="ref-circle-tool-btn"
              onClick={() => {
                const searchEl = document.querySelector('.hero-search-input-field') || document.querySelector('.console-search-input');
                if (searchEl) {
                  searchEl.focus();
                  searchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              title="Search Fonts"
              aria-label="Search Fonts"
            >
              <Search size={16} />
            </button>

            {/* Pill Theme Switch (Sun & Moon Capsule) */}
            <button
              className="ref-theme-capsule"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle Theme"
            >
              <span className={`theme-capsule-icon ${theme !== 'dark' ? 'is-active' : ''}`}>
                <Sun size={14} />
              </span>
              <span className={`theme-capsule-icon ${theme === 'dark' ? 'is-active' : ''}`}>
                <Moon size={14} />
              </span>
            </button>

            {/* Login / প্রবেশ করুন Pill Button */}
            <button 
              className="ref-login-pill-btn"
              onClick={() => {
                const el = document.getElementById('specimen-catalog-stream');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              title="প্রবেশ করুন"
            >
              <span>প্রবেশ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
