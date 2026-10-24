import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Sliders
} from 'lucide-react';
import { FEATURED_FONTS } from '../data/fontsData';

export default function HeroSection({
  onExploreFonts,
  onOpenPlayground,
  onOpenSpecimen,
  onSelectCategory,
  searchQuery = '',
  setSearchQuery
}) {
  // 5 Featured Font Showcase Slides for the Right Card
  const featuredSlides = [
    {
      id: 'siyam-rupali',
      slideNum: '01',
      badge: 'ফিচারড ফন্ট',
      banglaName: 'শিয়াম রূপালী',
      latinName: 'SIYAM RUPALI',
      tagline: 'ঐতিহ্য ও আধুনিকতার সেতুবন্ধন',
      description: 'পাঠযোগ্যতা, নান্দনিকতা এবং সমকালীন ব্যবহারের জন্য বিশেষভাবে ডিজাইন করা একটি আধুনিক বাংলা ফন্ট।',
      sampleLetter: 'অ',
      fontFamily: "'Siyam Rupali', 'Noto Sans Bengali', sans-serif",
      fontFile: '/fonts/Siyam Rupali.ttf'
    },
    {
      id: 'boshonto',
      slideNum: '02',
      badge: 'ফিচারড ফন্ট',
      banglaName: 'বসন্ত',
      latinName: 'BOSHONTO',
      tagline: 'কাব্যিক ও রোমান্টিক সেরিফ ধারা',
      description: 'বসন্তের বাতাসে দোলা লাগা পল্লবের মতোই চঞ্চল এই ফন্টের প্রতিটি রেখা। কবিতাগুচ্ছ ও সাহিত্য পত্রিকার জন্য এক অনন্য উপাদান।',
      sampleLetter: 'ব',
      fontFamily: "'Boshonto', 'Noto Serif Bengali', serif",
      fontFile: '/fonts/Boshonto.ttf'
    },
    {
      id: 'ekushey-aloucik',
      slideNum: '03',
      badge: 'ফিচারড ফন্ট',
      banglaName: 'একুশে অলৌকিক',
      latinName: 'EKUSHEY ALOUCIK',
      tagline: 'শৈল্পিক ও অলৌকিক বর্ণমালা',
      description: 'শব্দশিল্প ও নান্দনিক বর্ণমালার মেলবন্ধনে রচিত হয় এক কালজয়ী দৃশ্যকাব্য। রূপকথা ও অতিপ্রাকৃত গল্পের প্রচ্ছদের আদর্শ রূপ।',
      sampleLetter: 'ঐ',
      fontFamily: "'Ekushey Aloucik', 'Noto Sans Bengali', sans-serif",
      fontFile: '/fonts/ekushey/Ekushey Aloucik.ttf'
    },
    {
      id: 'kalpurush',
      slideNum: '04',
      badge: 'ফিচারড ফন্ট',
      banglaName: 'কালপুরুষ',
      latinName: 'KALPURUSH',
      tagline: 'বহুল ব্যবহৃত ক্লাসিক সাহিত্যিক ফন্ট',
      description: 'বাংলা প্রকাশনা জগতের সবচেয়ে জনপ্রিয় ও নির্ভরযোগ্য সেরিফ ফন্ট, যা দীর্ঘ পঠনে চোখকে আরাম ও তৃপ্তি দেয়।',
      sampleLetter: 'ক',
      fontFamily: "'Kalpurush', 'Noto Serif Bengali', serif",
      fontFile: '/fonts/Kalpurush.ttf'
    },
    {
      id: 'solaiman-lipi',
      slideNum: '05',
      badge: 'ফিচারড ফন্ট',
      banglaName: 'সোলাইমান লিপি',
      latinName: 'SOLAIMAN LIPI',
      tagline: 'ওয়েব ও ডিজিটাল মাধ্যমে নির্ভরযোগ্য',
      description: 'কম্পিউটার স্ক্রিন ও মোবাইল ডিভাইসে মসৃণ ও স্পষ্ট প্রদর্শনের জন্য নির্মিত এক অগ্রদূত টাইপফেস।',
      sampleLetter: 'স',
      fontFamily: "'SolaimanLipi', 'Noto Sans Bengali', sans-serif",
      fontFile: '/fonts/Solaiman Lipi.ttf'
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const activeSlide = featuredSlides[currentSlideIndex];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? featuredSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === featuredSlides.length - 1 ? 0 : prev + 1));
  };

  // 5 Category Cards with respective category fonts
  const categoryCards = [
    {
      id: 'cat-serif',
      tag: 'SERIF',
      title: 'ঐতিহ্যবাহী',
      count: '১২৪টি ফন্ট',
      themeClass: 'theme-serif-card',
      fontFamily: "'Kalpurush', 'Boshonto', 'Noto Serif Bengali', serif",
      categoryId: 'Serif',
      toastName: 'ঐতিহ্যবাহী সেরিফ ফন্টসম্ভার (Serif Collection)'
    },
    {
      id: 'cat-sans',
      tag: 'SANS SERIF',
      title: 'আধুনিক',
      count: '৯৬টি ফন্ট',
      themeClass: 'theme-sans-card',
      fontFamily: "'Hind Siliguri', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif",
      categoryId: 'Sans Serif',
      toastName: 'আধুনিক সান্স সেরিফ ফন্টসম্ভার (Sans Serif Collection)'
    },
    {
      id: 'cat-display',
      tag: 'DISPLAY',
      title: 'শৈল্পিক',
      count: '১৯৪টি ফন্ট',
      themeClass: 'theme-display-card',
      fontFamily: "'Charukola', 'Ekushey Aloucik', 'Noto Serif Bengali', serif",
      categoryId: 'Display',
      toastName: 'শৈল্পিক ডিসপ্লে ফন্টসম্ভার (Display Collection)'
    },
    {
      id: 'cat-handwritten',
      tag: 'HANDWRITTEN',
      title: 'হস্তলিখিত',
      count: '৭৬টি ফন্ট',
      themeClass: 'theme-handwritten-card',
      fontFamily: "'Atma', 'Siyam Rupali', cursive",
      categoryId: 'Script',
      toastName: 'হস্তলিখিত ফন্টসম্ভার (Handwritten / Script Collection)'
    },
    {
      id: 'cat-variable',
      tag: 'VARIABLE',
      title: 'পরিবর্তনশীল',
      count: '৪২টি ফন্ট',
      themeClass: 'theme-variable-card',
      fontFamily: "'Akhand Bengali', 'Noto Sans Bengali', sans-serif",
      categoryId: 'Variable',
      toastName: 'পরিবর্তনশীল ফন্টসম্ভার (Variable Font Collection)'
    }
  ];

  const handleCategoryClick = (card) => {
    if (onSelectCategory) {
      onSelectCategory(card.categoryId, card.toastName);
    } else if (onExploreFonts) {
      onExploreFonts();
    }
  };

  const handleInspectSlideFont = () => {
    const found = FEATURED_FONTS.find(f => f.id === activeSlide.id || f.name.toLowerCase().includes(activeSlide.latinName.toLowerCase()));
    if (found && onOpenSpecimen) {
      onOpenSpecimen(found);
    } else if (onExploreFonts) {
      onExploreFonts();
    }
  };

  return (
    <section className="exact-hero-section">
      <div className="container">
        
        {/* Main 2-Column Hero Stage */}
        <div className="hero-main-grid">
          
          {/* Left Column: Monumental Headline, Subtitle, Search, Stats */}
          <div className="hero-left-column">
            
            {/* Eyebrow Accent Line */}
            <div className="hero-eyebrow-line">
              <span className="hero-eyebrow-text">৭০০+ বাংলা ফন্টের একটি উন্মুক্ত সংগ্রহশালা</span>
              <span className="hero-eyebrow-dash">──</span>
            </div>

            {/* Monumental Headline: Rendered with 'Boshonto' font per user specification */}
            <h1 className="hero-monumental-headline">
              <span className="headline-dark">বাংলা অক্ষরের</span>
              <span className="headline-crimson">নতুন ঠিকানা</span>
            </h1>

            {/* Subtitle / Intro: Rendered with 'Ekushey Aloucik' font per user specification */}
            <p className="hero-intro-paragraph">
              ঐতিহ্য, আধুনিকতা এবং সৃজনশীলতার সংযোগে সাজানো বাংলা টাইপফেসের এক কিউরেটেড আর্কাইভ — বাংলার মানুষের জন্য, বাংলার মানুষের দ্বারা।
            </p>

            {/* Pill Search Input with Filter Button */}
            <div className="hero-search-pill-container">
              <Search size={18} className="hero-search-pill-icon" />
              <input
                type="text"
                placeholder="ফন্ট, স্টাইল বা ডিজাইনার খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="hero-search-pill-input"
              />
              <button 
                className="hero-search-filter-button"
                onClick={() => {
                  if (onExploreFonts) onExploreFonts();
                }}
                title="ফিল্টার অপশন দেখুন"
              >
                <SlidersHorizontal size={15} />
                <span>ফিল্টার</span>
              </button>
            </div>

            {/* Statistics Bar: 4 columns with vertical hairline dividers */}
            <div className="hero-statistics-bar">
              <div className="hero-stat-item">
                <span className="hero-stat-number">719</span>
                <span className="hero-stat-label">ফন্টসম্ভার</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-number">28</span>
                <span className="hero-stat-label">ডিজাইনার পরিবার</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-number">2</span>
                <span className="hero-stat-label">স্ট্যান্ডার্ড (Unicode &amp; ANSI)</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-number">100%</span>
                <span className="hero-stat-label">উন্মুক্ত ও লাইসেন্সপ্রাপ্ত</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Featured Font Card */}
          <div className="hero-right-column">
            <div className="hero-featured-card-frame">
              
              {/* Card Top: Slide Indicator & Navigation Arrows */}
              <div className="featured-card-top-nav">
                <span className="featured-card-slide-counter">
                  {activeSlide.slideNum} <span className="counter-sep">/</span> 05
                </span>
                <div className="featured-card-nav-buttons">
                  <button 
                    className="card-nav-arrow-btn"
                    onClick={handlePrevSlide}
                    aria-label="Previous Featured Font"
                    title="পূর্ববর্তী ফন্ট"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    className="card-nav-arrow-btn"
                    onClick={handleNextSlide}
                    aria-label="Next Featured Font"
                    title="পরবর্তী ফন্ট"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Card Body: Split into Left Typographic Specs & Right Glyphic Art */}
              <div className="featured-card-body">
                
                {/* Left Specs */}
                <div className="featured-card-left-info">
                  <div className="featured-badge-pill">
                    <span>{activeSlide.badge}</span>
                  </div>

                  <h3 
                    className="featured-font-display-title"
                    style={{ fontFamily: activeSlide.fontFamily }}
                  >
                    {activeSlide.banglaName}
                  </h3>

                  <p className="featured-font-tagline">
                    {activeSlide.tagline}
                  </p>

                  <p className="featured-font-description">
                    {activeSlide.description}
                  </p>

                  <div className="featured-card-actions">
                    <button 
                      className="featured-card-cta-btn"
                      onClick={handleInspectSlideFont}
                      title={`Inspect ${activeSlide.banglaName}`}
                    >
                      <span>এখনই দেখুন</span>
                      <ArrowRight size={15} />
                    </button>

                    <button 
                      className="featured-card-link-btn"
                      onClick={handleInspectSlideFont}
                    >
                      <span>ফন্ট সম্পর্কে জানুন</span>
                    </button>
                  </div>
                </div>

                {/* Right Glyphic Art Stage */}
                <div className="featured-card-right-art">
                  
                  {/* Vertical Fine Editorial Red Line with Rotated Font Name */}
                  <div className="art-vertical-guideline">
                    <span className="art-rotated-latin-name">
                      {activeSlide.latinName}
                    </span>
                  </div>

                  {/* Monumental Sculptural Bengali Character */}
                  <div 
                    className="art-monumental-glyph"
                    style={{ fontFamily: activeSlide.fontFamily }}
                  >
                    {activeSlide.sampleLetter}
                  </div>

                  {/* Red Authentic Foundry Seal Stamp */}
                  <div className="art-foundry-seal-watermark" title="অক্ষর মুদ্রণ সীলমোহর">
                    <svg viewBox="0 0 100 100" className="hero-seal-svg">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
                      <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="0.9" />
                      <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.6" />
                      <path id="heroSealPath" d="M 50 15 A 35 35 0 1 1 49.9 15" fill="none" />
                      <text className="hero-seal-text-path">
                        <textPath href="#heroSealPath" startOffset="50%" textAnchor="middle">
                          • BENGALI TYPE FOUNDRY •
                        </textPath>
                      </text>
                      <text x="50" y="47" textAnchor="middle" className="hero-seal-center-brand">অক্ষর</text>
                      <text x="50" y="59" textAnchor="middle" className="hero-seal-center-year">EST. 2026</text>
                    </svg>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Curated Collection Section ("নির্বাচিত সংগ্রহ") Underneath Hero */}
        <div className="hero-curated-showcase-section">
          
          {/* Header Bar */}
          <div className="curated-section-header-bar">
            <div className="curated-header-left-title">
              <h2 className="curated-main-title">নির্বাচিত সংগ্রহ</h2>
              <span className="curated-title-sep">──</span>
              <p className="curated-sub-caption">বিভিন্ন ধারা ও ব্যবহারের জন্য বাছাইকৃত কিছু ফন্ট</p>
            </div>

            <div className="curated-header-right-controls">
              <button 
                className="curated-circle-nav-btn"
                onClick={() => {
                  const container = document.querySelector('.curated-cards-row-container');
                  if (container) container.scrollBy({ left: -260, behavior: 'smooth' });
                }}
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="curated-circle-nav-btn"
                onClick={() => {
                  const container = document.querySelector('.curated-cards-row-container');
                  if (container) container.scrollBy({ left: 260, behavior: 'smooth' });
                }}
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
              <button 
                className="curated-view-all-pill-btn"
                onClick={() => handleCategoryClick({ categoryId: 'All', toastName: 'সম্পূর্ণ ফন্টসম্ভার (All 700+ Fonts)' })}
                title="সম্পূর্ণ ফন্টসম্ভার দেখুন"
              >
                <span>সব ফন্ট দেখুন</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 5 Cards Row Container */}
          <div className="curated-cards-row-container">
            {categoryCards.map((card) => (
              <div 
                key={card.id}
                className={`curated-collection-card ${card.themeClass}`}
                onClick={() => handleCategoryClick(card)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCategoryClick(card);
                  }
                }}
                role="button"
                tabIndex={0}
                title={`${card.title} (${card.tag}) ফন্টসম্ভার খুলুন`}
              >
                <div className="card-top-tag">
                  <span>{card.tag}</span>
                </div>

                <div className="card-center-bengali-title">
                  <h3 style={{ fontFamily: card.fontFamily }}>{card.title}</h3>
                </div>

                <div className="card-bottom-count-row">
                  <span className="card-count-text">{card.count}</span>
                  <div className="card-arrow-circle-icon">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
