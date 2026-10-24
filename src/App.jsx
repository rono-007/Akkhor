import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FontCard from './components/FontCard';
import FontDetailModal from './components/FontDetailModal';
import TypographyPlayground from './components/TypographyPlayground';
import WaterfallView from './components/WaterfallView';
import GlyphMatrixView from './components/GlyphMatrixView';
import ComparisonDrawer from './components/ComparisonDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import AllFontsView from './components/AllFontsView';

import {
  FEATURED_FONTS,
  EXTENDED_FONTS,
  loadArchiveFonts,
  PANGRAMS,
  preloadAllFeaturedFonts
} from './data/fontsData';
import { isAnsiFont } from './utils/banglaConverter';

import {
  Sparkles,
  Search,
  List,
  Grid
} from 'lucide-react';

export default function App() {
  // Navigation & Theme
  const [activeTab, setActiveTab] = useState('store');
  const [theme, setTheme] = useState('dark');

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEncoding, setSelectedEncoding] = useState('all'); // 'all' | 'unicode' | 'ansi'
  const [selectedPangramId, setSelectedPangramId] = useState('bn-aesthetic');
  const [previewText, setPreviewText] = useState(
    PANGRAMS.find(p => p.id === 'bn-aesthetic')?.text || 'শব্দশিল্প ও নান্দনিক বর্ণমালার মেলবন্ধন'
  );
  const [fontSize, setFontSize] = useState(38);
  const [sortBy, setSortBy] = useState('popularity');
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'compact' | 'poster'
  const [archiveFilter, setArchiveFilter] = useState('featured'); // 'featured' | 'all-700'
  const [allArchiveFonts, setAllArchiveFonts] = useState(EXTENDED_FONTS);

  // Drawers & Modals
  const [activeSpecimenFont, setActiveSpecimenFont] = useState(null);
  const [playgroundInitialFont, setPlaygroundInitialFont] = useState(FEATURED_FONTS[0]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist, Compare, Cart states (with localStorage persistence)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('akshar_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [compareList, setCompareList] = useState([]);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('akshar_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast message
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist Wishlist & Cart
  useEffect(() => {
    try {
      localStorage.setItem('akshar_wishlist', JSON.stringify(wishlist));
    } catch { }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('akshar_cart', JSON.stringify(cart));
    } catch { }
  }, [cart]);

  // Preload all featured fonts into CSS and browser cache
  useEffect(() => {
    preloadAllFeaturedFonts();
  }, []);

  // Fetch full font catalog from Cloudflare Worker API (fallback to bundled catalog)
  useEffect(() => {
    let isMounted = true;
    loadArchiveFonts().then((fonts) => {
      if (isMounted && fonts && fonts.length > 0) {
        setAllArchiveFonts(fonts);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Update preview text when pangram dropdown changes
  const handlePangramChange = (pangramId) => {
    setSelectedPangramId(pangramId);
    const found = PANGRAMS.find(p => p.id === pangramId);
    if (found) setPreviewText(found.text);
  };

  // Toggle favorite
  const handleToggleFavorite = (font) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === font.id);
      if (exists) {
        showToast(`Removed "${font.name}" from Wishlist`);
        return prev.filter(item => item.id !== font.id);
      } else {
        showToast(`Saved "${font.name}" to Wishlist!`);
        return [...prev, font];
      }
    });
  };

  // Toggle comparison
  const handleToggleCompare = (font) => {
    setCompareList(prev => {
      const exists = prev.some(item => item.id === font.id);
      if (exists) {
        return prev.filter(item => item.id !== font.id);
      } else {
        if (prev.length >= 3) {
          showToast('Comparison limit reached (max 3 fonts)');
          return prev;
        }
        showToast(`Added "${font.name}" to comparison`);
        return [...prev, font];
      }
    });
  };

  // Add to cart
  const handleAddToCart = (font) => {
    setCart(prev => {
      const exists = prev.some(item => item.id === font.id);
      if (!exists) {
        showToast(`Added "${font.name}" to cart!`);
        return [...prev, { ...font, selectedLicenseTier: font.selectedLicenseTier || 'commercial' }];
      }
      return prev;
    });
  };

  const handleRemoveFromCart = (fontId) => {
    setCart(prev => prev.filter(item => item.id !== fontId));
  };

  const handleUpdateCartItemLicense = (fontId, tierId) => {
    setCart(prev => prev.map(item => item.id === fontId ? { ...item, selectedLicenseTier: tierId } : item));
  };

  // Filter & Search Logic
  const filteredFonts = useMemo(() => {
    let list = archiveFilter === 'all-700' ? allArchiveFonts : FEATURED_FONTS;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(f =>
        f.name.toLowerCase().includes(q) ||
        (f.banglaName && f.banglaName.toLowerCase().includes(q)) ||
        (f.designer && f.designer.toLowerCase().includes(q)) ||
        (f.category && f.category.toLowerCase().includes(q)) ||
        (f.tags && f.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Free Only') {
        list = list.filter(f => f.isFree);
      } else if (selectedCategory === 'Variable') {
        list = list.filter(f =>
          (f.tags && f.tags.some(t => {
            const low = t.toLowerCase();
            return low.includes('variable') || low.includes('multi-weight') || low.includes('multiple') || low.includes('heavy') || low.includes('condensed');
          })) ||
          (f.styles && f.styles.length > 1) ||
          f.name.toLowerCase().includes('bold') ||
          f.name.toLowerCase().includes('italic') ||
          f.name.toLowerCase().includes('variable')
        );
      } else {
        list = list.filter(f => f.category === selectedCategory);
      }
    }

    // Encoding filter (Unicode vs Bijoy ANSI)
    if (selectedEncoding !== 'all') {
      if (selectedEncoding === 'unicode') {
        list = list.filter(f => !isAnsiFont(f));
      } else if (selectedEncoding === 'ansi') {
        list = list.filter(f => isAnsiFont(f));
      }
    }

    // Sorting (pricing removed)
    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'styles') return (b.styles?.length || 1) - (a.styles?.length || 1);
      if (sortBy === 'year') return (b.year || 2020) - (a.year || 2020);
      return (b.downloads || 1000) - (a.downloads || 1000);
    });
  }, [searchQuery, selectedCategory, selectedEncoding, sortBy, archiveFilter, allArchiveFonts]);

  // Open playground with specific font
  const handleOpenPlaygroundWithFont = (font) => {
    setPlaygroundInitialFont(font);
    setActiveTab('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open font store for a specific category from Hero curated cards or links
  const handleSelectCategoryFromHero = (catId, toastName) => {
    setSelectedCategory(catId);
    setActiveTab('fonts');
    setArchiveFilter('all-700');
    setSearchQuery('');
    if (toastName) {
      showToast(toastName);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <Sparkles size={16} color="var(--accent-vermilion)" />
          <span>{toastMessage}</span>
        </div>
      )}


      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        compareCount={compareList.length}
        openCompareDrawer={() => setIsCompareOpen(true)}
        wishlistCount={wishlist.length}
        openWishlistDrawer={() => setIsWishlistOpen(true)}
        cartCount={cart.length}
        openCartDrawer={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExploreFonts={() => handleSelectCategoryFromHero('All', 'সম্পূর্ণ ফন্টসম্ভার (All 700+ Fonts)')}
      />

      {/* Primary Tab Switching */}
      <main className="main-content">
        {activeTab === 'store' && (
          <>
            {/* Exactly Replicated Reference Hero Section & 5 Featured Cards */}
            <HeroSection
              onExploreFonts={() => handleSelectCategoryFromHero('All', 'সম্পূর্ণ ফন্টসম্ভার (All 700+ Fonts)')}
              onOpenPlayground={() => {
                setActiveTab('playground');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenSpecimen={(f) => setActiveSpecimenFont(f)}
              onSelectCategory={handleSelectCategoryFromHero}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {/* Specimen Catalog Anchor */}
            <div id="specimen-catalog-stream" />

            {/* Sticky Specimen Tester Console (Senior Designer Control Center) */}
            <div className="specimen-console-sticky">
              <div className="container">
                
                {/* Row 1: Universal Live Text Tester, Pangrams, Size Scrubber, Font Search, Layout Mode */}
                <div className="console-row-primary">
                  
                  {/* Universal Live Input */}
                  <div className="console-input-cell">
                    <input
                      type="text"
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      placeholder="Type custom text across all fonts..."
                      className="console-live-input"
                    />
                    {previewText && (
                      <button 
                        className="console-clear-btn" 
                        onClick={() => setPreviewText('')}
                        title="Reset preview text"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Pangram Dropdown */}
                  <div className="console-dropdown-cell">
                    <select
                      className="console-select"
                      value={selectedPangramId}
                      onChange={(e) => handlePangramChange(e.target.value)}
                      title="Select pangram or preset phrase"
                    >
                      <optgroup label="Bengali Phrases">
                        {PANGRAMS.filter(p => p.lang === 'bn').map(p => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Latin Pangrams">
                        {PANGRAMS.filter(p => p.lang === 'en').map(p => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Font Size Scrubber with Quick Sizes */}
                  <div className="console-size-cell">
                    <span className="console-size-readout">{fontSize}px</span>
                    <input
                      type="range"
                      min="18"
                      max="96"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="console-slider"
                      title={`Size: ${fontSize}px`}
                    />
                    <div className="console-size-quick">
                      {[24, 36, 48, 64, 80].map(pt => (
                        <button
                          key={pt}
                          className={`size-dot-btn ${fontSize === pt ? 'active' : ''}`}
                          onClick={() => setFontSize(pt)}
                        >
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Name / Metadata Search Bar */}
                  <div className="console-search-cell">
                    <Search size={14} className="console-search-icon" />
                    <input
                      type="text"
                      placeholder="Search 700+ fonts by name, designer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="console-search-input"
                    />
                    {searchQuery && (
                      <button 
                        className="console-clear-btn" 
                        onClick={() => setSearchQuery('')}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Layout View Mode Switcher (List vs Grid) */}
                  <div className="console-layout-switcher">
                    <button
                      className={`layout-mode-btn ${layoutMode === 'list' ? 'active' : ''}`}
                      onClick={() => setLayoutMode('list')}
                      title="Waterfall / Row View"
                      aria-label="List View"
                    >
                      <List size={15} />
                    </button>
                    <button
                      className={`layout-mode-btn ${layoutMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setLayoutMode('grid')}
                      title="Bento Grid Card View"
                      aria-label="Grid View"
                    >
                      <Grid size={15} />
                    </button>
                  </div>

                </div>

                {/* Row 2: Taxonomy, Encodings, Scope & Sorting */}
                <div className="console-row-secondary">
                  
                  {/* Category Classifications */}
                  <div className="console-filter-links">
                    <span className="filter-group-label">Class:</span>
                    {[
                      { id: 'All', label: 'All' },
                      { id: 'Sans Serif', label: 'Sans' },
                      { id: 'Serif', label: 'Serif' },
                      { id: 'Display', label: 'Display' },
                      { id: 'Script', label: 'Script' },
                      { id: 'Variable', label: 'Variable' },
                      { id: 'Bengali', label: 'Classic' },
                      { id: 'Free Only', label: 'Free OFL' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        className={`filter-text-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        {cat.label}
                      </button>
                    ))}

                    <span className="console-sep" />

                    {/* Encoding Standards */}
                    <span className="filter-group-label">Standard:</span>
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'unicode', label: 'Unicode' },
                      { id: 'ansi', label: 'Bijoy ANSI' }
                    ].map(enc => (
                      <button
                        key={enc.id}
                        className={`filter-text-btn ${selectedEncoding === enc.id ? 'active' : ''}`}
                        onClick={() => setSelectedEncoding(enc.id)}
                      >
                        {enc.label}
                      </button>
                    ))}

                    <span className="console-sep" />

                    {/* Archive Scope Filter */}
                    <span className="filter-group-label">Archive:</span>
                    <button
                      className={`filter-text-btn ${archiveFilter === 'featured' ? 'active' : ''}`}
                      onClick={() => setArchiveFilter('featured')}
                      title="Curated 28 master font families"
                    >
                      28 Featured
                    </button>
                    <button
                      className={`filter-text-btn ${archiveFilter === 'all-700' ? 'active' : ''}`}
                      onClick={() => setArchiveFilter('all-700')}
                      title="Complete 719 font archive"
                    >
                      719 All Archive
                    </button>
                  </div>

                  {/* Right Tools: Result Counter, Sort Dropdown & Reset */}
                  <div className="console-tools-right">
                    <span className="console-results-count">
                      {filteredFonts.length} {filteredFonts.length === 1 ? 'Font' : 'Fonts'}
                    </span>

                    {(searchQuery || selectedCategory !== 'All' || selectedEncoding !== 'all' || archiveFilter !== 'featured') && (
                      <button
                        className="console-reset-filters-btn"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('All');
                          setSelectedEncoding('all');
                          setArchiveFilter('featured');
                        }}
                        title="Reset all active filters"
                      >
                        Reset ✕
                      </button>
                    )}

                    <div className="console-sort-block">
                      <span className="sort-hint-text">Sort:</span>
                      <select
                        className="console-sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="popularity">Popularity &amp; Curation</option>
                        <option value="name">Name (A–Z)</option>
                        <option value="styles">Styles Count</option>
                        <option value="year">Newest First</option>
                      </select>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Catalog Section with Proper Cards */}
            <section className="catalog-section">
              <div className="container">
                {filteredFonts.length === 0 ? (
                  <div className="catalog-empty-state">
                    <Search size={44} className="empty-state-icon" />
                    <h3 className="empty-state-title">
                      No matching typefaces found
                    </h3>
                    <p className="empty-state-desc">
                      No fonts matched "{searchQuery}". Try searching for another name or reset filters.
                    </p>
                    <button
                      className="btn-clear-filters"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setSelectedEncoding('all');
                        setArchiveFilter('featured');
                      }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className={`fonts-catalog-layout ${layoutMode === 'grid' ? 'is-grid-layout' : 'is-list-layout'}`}>
                    {filteredFonts.map((font) => (
                      <FontCard
                        key={font.id}
                        font={font}
                        previewText={previewText}
                        currentPangram={PANGRAMS.find(p => p.id === selectedPangramId)}
                        fontSize={fontSize}
                        layoutMode={layoutMode}
                        onOpenSpecimen={(f) => setActiveSpecimenFont(f)}
                        onOpenPlayground={(f) => handleOpenPlaygroundWithFont(f)}
                        isFavorite={wishlist.some(w => w.id === font.id)}
                        onToggleFavorite={handleToggleFavorite}
                        isComparing={compareList.some(c => c.id === font.id)}
                        onToggleCompare={handleToggleCompare}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* Tab 2: Dedicated All 719 Fonts Archive ("ফন্টসম্ভার") */}
        {activeTab === 'fonts' && (
          <AllFontsView
            allFonts={allArchiveFonts}
            initialCategory={selectedCategory}
            onOpenSpecimen={(f) => setActiveSpecimenFont(f)}
            onOpenPlayground={(f) => handleOpenPlaygroundWithFont(f)}
            wishlist={wishlist}
            onToggleFavorite={handleToggleFavorite}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            previewText={previewText}
            setPreviewText={setPreviewText}
            fontSize={fontSize}
            setFontSize={setFontSize}
            layoutMode={layoutMode}
            setLayoutMode={setLayoutMode}
            showToast={showToast}
          />
        )}

        {/* Tab 2: Typography Playground */}
        {activeTab === 'playground' && (
          <TypographyPlayground
            initialFont={playgroundInitialFont}
            allFonts={archiveFilter === 'all-700' ? allArchiveFonts : FEATURED_FONTS}
          />
        )}

        {/* Tab 3: Specimen Waterfall */}
        {activeTab === 'waterfall' && (
          <WaterfallView
            onOpenSpecimen={(f) => setActiveSpecimenFont(f)}
            onOpenPlayground={(f) => handleOpenPlaygroundWithFont(f)}
          />
        )}

        {/* Tab 4: Glyph Matrix */}
        {activeTab === 'glyphs' && (
          <GlyphMatrixView />
        )}
      </main>

      {/* Font Specimen Modal */}
      {activeSpecimenFont && (
        <FontDetailModal
          font={activeSpecimenFont}
          onClose={() => setActiveSpecimenFont(null)}
          onAddToCart={handleAddToCart}
          isInCart={cart.some(c => c.id === activeSpecimenFont.id)}
          isFavorite={wishlist.some(w => w.id === activeSpecimenFont.id)}
          onToggleFavorite={handleToggleFavorite}
          onOpenPlayground={(f) => {
            setActiveSpecimenFont(null);
            handleOpenPlaygroundWithFont(f);
          }}
        />
      )}

      {/* Comparison Drawer */}
      <ComparisonDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareList={compareList}
        onRemoveFromCompare={(id) => setCompareList(prev => prev.filter(f => f.id !== id))}
        onClearCompare={() => setCompareList([])}
        onOpenSpecimen={(f) => {
          setIsCompareOpen(false);
          setActiveSpecimenFont(f);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(id) => setWishlist(prev => prev.filter(f => f.id !== id))}
        onAddToCart={handleAddToCart}
        onOpenSpecimen={(f) => {
          setIsWishlistOpen(false);
          setActiveSpecimenFont(f);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        onUpdateCartItemLicense={handleUpdateCartItemLicense}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
