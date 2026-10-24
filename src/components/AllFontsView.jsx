import React, { useState, useMemo, useEffect } from 'react';
import FontCard from './FontCard';
import { PANGRAMS } from '../data/fontsData';
import { isAnsiFont } from '../utils/banglaConverter';
import { 
  Search, 
  Grid, 
  List, 
  X, 
  SlidersHorizontal, 
  Sparkles, 
  Archive, 
  Layers, 
  Globe, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter
} from 'lucide-react';

const ITEMS_PER_PAGE_OPTIONS = [24, 48, 96];

export default function AllFontsView({
  allFonts = [],
  initialCategory = 'All',
  onOpenSpecimen,
  onOpenPlayground,
  wishlist = [],
  onToggleFavorite,
  compareList = [],
  onToggleCompare,
  previewText,
  setPreviewText,
  fontSize,
  setFontSize,
  layoutMode,
  setLayoutMode,
  showToast
}) {
  // Local filter & search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedEncoding, setSelectedEncoding] = useState('all'); // 'all' | 'unicode' | 'ansi'
  const [selectedPangramId, setSelectedPangramId] = useState('bn-aesthetic');
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity' | 'name' | 'styles' | 'year'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // Sync initial category if changed from parent (e.g. from Hero card click)
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setCurrentPage(1);
    }
  }, [initialCategory]);

  // Pangram selection handler
  const handlePangramChange = (pangramId) => {
    setSelectedPangramId(pangramId);
    const found = PANGRAMS.find(p => p.id === pangramId);
    if (found && setPreviewText) {
      setPreviewText(found.text);
    }
  };

  // Category counts calculation for badges
  const categoryStats = useMemo(() => {
    const stats = {
      All: allFonts.length,
      Bengali: 0,
      Display: 0,
      Serif: 0,
      'Sans Serif': 0,
      Script: 0,
      Variable: 0,
      Free: 0
    };

    allFonts.forEach(f => {
      if (f.category === 'Bengali') stats.Bengali++;
      if (f.category === 'Display') stats.Display++;
      if (f.category === 'Serif') stats.Serif++;
      if (f.category === 'Sans Serif') stats['Sans Serif']++;
      if (f.category === 'Script') stats.Script++;
      if (f.isFree) stats.Free++;

      const isVar = (f.tags && f.tags.some(t => {
        const low = t.toLowerCase();
        return low.includes('variable') || low.includes('multi-weight') || low.includes('multiple') || low.includes('heavy');
      })) || (f.styles && f.styles.length > 1) || f.name.toLowerCase().includes('bold') || f.name.toLowerCase().includes('variable');
      
      if (isVar) stats.Variable++;
    });

    return stats;
  }, [allFonts]);

  // Filtered fonts logic
  const filteredFonts = useMemo(() => {
    let list = allFonts;

    // Search query filter
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
            return low.includes('variable') || low.includes('multi-weight') || low.includes('multiple') || low.includes('heavy');
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

    // Encoding filter
    if (selectedEncoding !== 'all') {
      if (selectedEncoding === 'unicode') {
        list = list.filter(f => !isAnsiFont(f));
      } else if (selectedEncoding === 'ansi') {
        list = list.filter(f => isAnsiFont(f));
      }
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'styles') return (b.styles?.length || 1) - (a.styles?.length || 1);
      if (sortBy === 'year') return (b.year || 2020) - (a.year || 2020);
      return (b.downloads || 1000) - (a.downloads || 1000);
    });
  }, [allFonts, searchQuery, selectedCategory, selectedEncoding, sortBy]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedEncoding, sortBy, itemsPerPage]);

  // Pagination calculation
  const totalItems = filteredFonts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentFonts = useMemo(() => {
    return filteredFonts.slice(startIndex, endIndex);
  }, [filteredFonts, startIndex, endIndex]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const anchor = document.getElementById('archive-catalog-anchor');
      if (anchor) {
        const yOffset = -70;
        const y = anchor.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  };

  const handleCategorySelect = (catId, catLabel) => {
    setSelectedCategory(catId);
    if (showToast) {
      showToast(`${catLabel} ফন্টসম্ভার ফিল্টার করা হয়েছে (${catId === 'All' ? allFonts.length : categoryStats[catId] || ''}টি ফন্ট)`);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedEncoding('all');
    setSortBy('popularity');
    setCurrentPage(1);
    if (showToast) {
      showToast('সব ফিল্টার রিসেট করা হয়েছে');
    }
  };

  return (
    <div className="all-fonts-archive-page">
      {/* Editorial Archive Header */}
      <section className="archive-hero-header">
        <div className="container">
          
          <div className="archive-header-badge">
            <span className="badge-dot" />
            <span>সম্পূর্ণ ডিজিটাল ক্যাটালগ • {allFonts.length}টি ফন্ট আর্কাইভ</span>
          </div>

          <h1 className="archive-hero-title">
            ফন্টসম্ভার <span className="archive-title-latin">— THE COMPLETE ARCHIVE</span>
          </h1>

          <p className="archive-hero-lead">
            মুদ্রণ ঐতিহ্যের ক্লাসিক সীসা হরফ থেকে আধুনিক ডিজিটাল স্ক্রিন—ইউনিকোড ও বিজয়ের সমন্বয়ে গঠিত ৭১৯টি সমৃদ্ধ বাংলা টাইপফেসের উন্মুক্ত সংগ্রহশালা। অনুসন্ধান করুন, সরাসরি টাইপ করে পরখ করুন এবং সংগ্রহে যুক্ত করুন।
          </p>

          {/* Category Quick Statistics Ribbon */}
          <div className="archive-stats-ribbon">
            {[
              { id: 'All', label: 'মোট ফন্ট', count: categoryStats.All },
              { id: 'Bengali', label: 'ক্লাসিক / সনাতন', count: categoryStats.Bengali },
              { id: 'Display', label: 'শৈল্পিক ডিসপ্লে', count: categoryStats.Display },
              { id: 'Serif', label: 'ঐতিহ্যবাহী সেরিফ', count: categoryStats.Serif },
              { id: 'Sans Serif', label: 'আধুনিক সান্স', count: categoryStats['Sans Serif'] },
              { id: 'Script', label: 'হস্তলিখিত', count: categoryStats.Script },
              { id: 'Variable', label: 'পরিবর্তনশীল', count: categoryStats.Variable }
            ].map(stat => (
              <button
                key={stat.id}
                className={`archive-stat-card ${selectedCategory === stat.id ? 'is-selected' : ''}`}
                onClick={() => handleCategorySelect(stat.id, stat.label)}
                title={`ফিল্টার করুন: ${stat.label}`}
              >
                <span className="stat-count-num">{stat.count}</span>
                <span className="stat-label-text">{stat.label}</span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Catalog Anchor */}
      <div id="archive-catalog-anchor" />

      {/* Senior Specimen Console (Live Tester & Taxonomy Engine) */}
      <div className="specimen-console-sticky archive-console-sticky">
        <div className="container">
          
          {/* Row 1: Universal Live Text Tester, Pangrams, Size Scrubber, Search, Layout Mode */}
          <div className="console-row-primary">
            
            {/* Live Text Input */}
            <div className="console-input-cell">
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="এখানে লিখে সব ফন্টে পরখ করুন..."
                className="console-live-input"
              />
              {previewText && (
                <button 
                  className="console-clear-btn" 
                  onClick={() => setPreviewText('')}
                  title="লেখা রিসেট করুন"
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
                title="প্যানগ্রাম অথবা নির্বাচিত পঙক্তি নির্বাচন করুন"
              >
                <optgroup label="বাংলা বাণীবদ্ধ পাঠ (Bengali Phrases)">
                  {PANGRAMS.filter(p => p.lang === 'bn').map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </optgroup>
                <optgroup label="ইংরেজি প্যানগ্রাম (Latin Pangrams)">
                  {PANGRAMS.filter(p => p.lang === 'en').map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Font Size Scrubber */}
            <div className="console-size-cell">
              <span className="console-size-readout">{fontSize}px</span>
              <input
                type="range"
                min="18"
                max="96"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="console-slider"
                title={`আকার: ${fontSize}px`}
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

            {/* Instant Search Input */}
            <div className="console-search-cell">
              <Search size={15} className="console-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ফন্ট বা শিল্পীর নাম খুঁজুন..."
                className="console-search-input"
              />
              {searchQuery && (
                <button 
                  className="console-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="অনুসন্ধান মুছুন"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Layout Toggle: Grid vs List */}
            <div className="console-layout-cell">
              <button
                className={`layout-icon-btn ${layoutMode === 'list' ? 'active' : ''}`}
                onClick={() => setLayoutMode('list')}
                title="লিস্ট ভিউ (অনুভূমিক পূর্ণ নমুনা)"
                aria-label="List View"
              >
                <List size={15} />
              </button>
              <button
                className={`layout-icon-btn ${layoutMode === 'grid' ? 'active' : ''}`}
                onClick={() => setLayoutMode('grid')}
                title="গ্রিড ভিউ (পাশাপাশি প্রদর্শন)"
                aria-label="Grid View"
              >
                <Grid size={15} />
              </button>
            </div>

          </div>

          {/* Row 2: Taxonomy Categories, Encodings, Sort & Counters */}
          <div className="console-row-secondary">
            
            {/* Category Classifications */}
            <div className="console-filter-links">
              <span className="filter-group-label">ধারা:</span>
              {[
                { id: 'All', label: 'সব ফন্ট' },
                { id: 'Bengali', label: 'ক্লাসিক' },
                { id: 'Serif', label: 'সেরিফ' },
                { id: 'Sans Serif', label: 'সান্স' },
                { id: 'Display', label: 'ডিসপ্লে' },
                { id: 'Script', label: 'হস্তলিখিত' },
                { id: 'Variable', label: 'ভেরিয়েবল' },
                { id: 'Free Only', label: 'উন্মুক্ত (Free)' }
              ].map(cat => (
                <button
                  key={cat.id}
                  className={`filter-text-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat.id, cat.label)}
                >
                  {cat.label}
                </button>
              ))}

              <span className="console-sep" />

              {/* Encoding Standards */}
              <span className="filter-group-label">মানক:</span>
              {[
                { id: 'all', label: 'সব' },
                { id: 'unicode', label: 'ইউনিকোড' },
                { id: 'ansi', label: 'বিজয় ANSI' }
              ].map(enc => (
                <button
                  key={enc.id}
                  className={`filter-text-btn ${selectedEncoding === enc.id ? 'active' : ''}`}
                  onClick={() => setSelectedEncoding(enc.id)}
                >
                  {enc.label}
                </button>
              ))}
            </div>

            {/* Right Tools: Result Counter, Sort Dropdown & Reset */}
            <div className="console-tools-right">
              <span className="results-counter-pill">
                <strong>{totalItems}</strong> ফন্ট পাওয়া গেছে
              </span>

              <div className="console-sort-wrap">
                <ArrowUpDown size={13} className="sort-indicator-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="console-sort-select"
                  title="ক্রমানুসার নির্বাচন"
                >
                  <option value="popularity">জনপ্রিয়তা অনুযায়ী</option>
                  <option value="name">নামের বর্ণানুক্রমে (A-Z)</option>
                  <option value="styles">শৈলী / স্টাইল সংখ্যা</option>
                  <option value="year">প্রকাশের বছর</option>
                </select>
              </div>

              {(searchQuery || selectedCategory !== 'All' || selectedEncoding !== 'all' || sortBy !== 'popularity') && (
                <button
                  className="console-reset-filters-btn"
                  onClick={handleResetFilters}
                  title="সকল ফিল্টার রিসেট করুন"
                >
                  <X size={12} />
                  <span>রিসেট</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Main Specimen Stream / Grid */}
      <div className="container archive-stream-container">
        
        {/* Pagination & Status Header Bar */}
        <div className="archive-pagination-header-bar">
          <div className="archive-paging-info">
            {totalItems > 0 ? (
              <span>
                প্রদর্শিত হচ্ছে <strong>{startIndex + 1}</strong> থেকে <strong>{endIndex}</strong> (মোট <strong>{totalItems}</strong>টি ফন্ট)
              </span>
            ) : (
              <span>কোনো ফন্ট পাওয়া যায়নি</span>
            )}
          </div>

          <div className="archive-items-per-page-selector">
            <span>প্রতি পৃষ্ঠায়:</span>
            {ITEMS_PER_PAGE_OPTIONS.map(num => (
              <button
                key={num}
                className={`page-size-btn ${itemsPerPage === num ? 'active' : ''}`}
                onClick={() => setItemsPerPage(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredFonts.length === 0 ? (
          <div className="catalog-empty-state">
            <Search size={44} className="empty-state-icon" />
            <h3 className="empty-state-title">
              অনুসন্ধানের সাথে মেলে এমন কোনো ফন্ট পাওয়া যায়নি
            </h3>
            <p className="empty-state-desc">
              "{searchQuery}" এর জন্য কোনো ফলাফল নেই। অন্য কোনো ফন্ট বা ধারার নাম লিখে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।
            </p>
            <button
              className="btn-clear-filters"
              onClick={handleResetFilters}
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className={`fonts-catalog-layout ${layoutMode === 'grid' ? 'is-grid-layout' : 'is-list-layout'}`}>
            {currentFonts.map((font) => (
              <FontCard
                key={font.id}
                font={font}
                previewText={previewText}
                currentPangram={PANGRAMS.find(p => p.id === selectedPangramId)}
                fontSize={fontSize}
                layoutMode={layoutMode}
                onOpenSpecimen={onOpenSpecimen}
                onOpenPlayground={onOpenPlayground}
                isFavorite={wishlist.some(w => w.id === font.id)}
                onToggleFavorite={onToggleFavorite}
                isComparing={compareList.some(c => c.id === font.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls Footer */}
        {totalPages > 1 && (
          <div className="archive-pagination-nav">
            
            <button
              className="pagination-nav-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              title="প্রথম পৃষ্ঠা"
            >
              <ChevronsLeft size={16} />
            </button>

            <button
              className="pagination-nav-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="পূর্ববর্তী পৃষ্ঠা"
            >
              <ChevronLeft size={16} />
              <span>পূর্ববর্তী</span>
            </button>

            {/* Dynamic Page Buttons */}
            <div className="pagination-pages-list">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => {
                  return (
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 2
                  );
                })
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) {
                    acc.push('ellipsis-' + p);
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item) => {
                  if (typeof item === 'string') {
                    return <span key={item} className="pagination-ellipsis">…</span>;
                  }
                  return (
                    <button
                      key={item}
                      className={`pagination-page-num ${currentPage === item ? 'active' : ''}`}
                      onClick={() => handlePageChange(item)}
                    >
                      {item}
                    </button>
                  );
                })}
            </div>

            <button
              className="pagination-nav-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="পরবর্তী পৃষ্ঠা"
            >
              <span>পরবর্তী</span>
              <ChevronRight size={16} />
            </button>

            <button
              className="pagination-nav-btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="শেষ পৃষ্ঠা"
            >
              <ChevronsRight size={16} />
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
