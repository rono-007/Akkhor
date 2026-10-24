import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Newspaper, 
  Sparkles, 
  Palette, 
  RotateCcw,
  Check,
  Maximize2
} from 'lucide-react';
import { isAnsiFont, unicodeToBijoy } from '../utils/banglaConverter';

export default function RealWorldMockups({
  font,
  sampleText,
  isCompact = false,
  onOpenFullModal
}) {
  const [mockupType, setMockupType] = useState('book'); // 'book' | 'newspaper' | 'poster'
  const [bookTheme, setBookTheme] = useState('noir'); // 'noir' | 'crimson' | 'indigo' | 'parchment'
  const [posterTheme, setPosterTheme] = useState('vermilion'); // 'vermilion' | 'monochrome' | 'gold'
  
  const isAnsi = useMemo(() => isAnsiFont(font), [font]);

  // Customizable live text states
  const defaultTitle = sampleText || font.sampleHeadline || font.banglaName || font.name || 'অক্ষরশিল্প ও কালজয়ী দৃশ্যকাব্য';
  const [customTitle, setCustomTitle] = useState(defaultTitle);
  const [customAuthor, setCustomAuthor] = useState('রবীন্দ্রনাথ ঠাকুর');
  const [customSubtitle, setCustomSubtitle] = useState('শব্দ ও নান্দনিক বর্ণমালার এক অনুপম আখ্যান');

  // Sync if sampleText changes
  React.useEffect(() => {
    if (sampleText) {
      setCustomTitle(sampleText);
    }
  }, [sampleText]);

  // Convert for Bijoy ANSI if needed
  const displayTitle = isAnsi ? unicodeToBijoy(customTitle) : customTitle;
  const displayAuthor = isAnsi ? unicodeToBijoy(customAuthor) : customAuthor;
  const displaySubtitle = isAnsi ? unicodeToBijoy(customSubtitle) : customSubtitle;

  const fontFamilyStyle = {
    fontFamily: `'${font.name}', 'Noto Serif Bengali', serif`
  };

  return (
    <div className={`real-world-mockup-wrapper ${isCompact ? 'is-compact-mode' : 'is-full-mode'}`}>
      
      {/* Mockup Sub-Navigation Controls */}
      <div className="mockup-controls-nav">
        <div className="mockup-type-pills">
          <button
            className={`mockup-pill-btn ${mockupType === 'book' ? 'active' : ''}`}
            onClick={() => setMockupType('book')}
            title="বইয়ের প্রচ্ছদ নকশা (Book Jacket)"
          >
            <BookOpen size={13} />
            <span>বইয়ের প্রচ্ছদ (Book Cover)</span>
          </button>

          <button
            className={`mockup-pill-btn ${mockupType === 'newspaper' ? 'active' : ''}`}
            onClick={() => setMockupType('newspaper')}
            title="সংবাদপত্রের শিরোনাম নকশা (Newspaper Masthead & Headline)"
          >
            <Newspaper size={13} />
            <span>দৈনিক সংবাদপত্র (Newspaper)</span>
          </button>

          <button
            className={`mockup-pill-btn ${mockupType === 'poster' ? 'active' : ''}`}
            onClick={() => setMockupType('poster')}
            title="শিল্প প্রদর্শনী পোস্টার (Art Poster)"
          >
            <Sparkles size={13} />
            <span>প্রদর্শনী পোস্টার (Poster)</span>
          </button>
        </div>

        {/* Color Palette Switchers */}
        <div className="mockup-palette-selector">
          {mockupType === 'book' && (
            <div className="palette-color-group">
              <span className="palette-label">রং:</span>
              {[
                { id: 'noir', label: 'Noir Gold', color: '#141416' },
                { id: 'crimson', label: 'Heritage Crimson', color: '#7a1c1c' },
                { id: 'indigo', label: 'Midnight Indigo', color: '#1a2744' },
                { id: 'parchment', label: 'Vintage Parchment', color: '#ede7dc' }
              ].map(theme => (
                <button
                  key={theme.id}
                  className={`palette-dot-btn ${bookTheme === theme.id ? 'active' : ''}`}
                  style={{ background: theme.color }}
                  onClick={() => setBookTheme(theme.id)}
                  title={theme.label}
                />
              ))}
            </div>
          )}

          {mockupType === 'poster' && (
            <div className="palette-color-group">
              <span className="palette-label">থিম:</span>
              {[
                { id: 'vermilion', label: 'Heritage Vermilion', color: '#a02a1e' },
                { id: 'monochrome', label: 'Monochrome Noir', color: '#111111' },
                { id: 'gold', label: 'Imperial Gold', color: '#8c6b2d' }
              ].map(theme => (
                <button
                  key={theme.id}
                  className={`palette-dot-btn ${posterTheme === theme.id ? 'active' : ''}`}
                  style={{ background: theme.color }}
                  onClick={() => setPosterTheme(theme.id)}
                  title={theme.label}
                />
              ))}
            </div>
          )}

          {isCompact && onOpenFullModal && (
            <button
              className="mockup-expand-modal-btn"
              onClick={onOpenFullModal}
              title="পূর্ণাকারে বড় করে দেখুন"
            >
              <Maximize2 size={13} />
              <span>পূর্ণাঙ্গ রূপ</span>
            </button>
          )}
        </div>
      </div>

      {/* Stage: Interactive Rendered Mockup Canvas */}
      <div className="mockup-stage-viewport">

        {/* MOCKUP 1: LITERARY BOOK COVER */}
        {mockupType === 'book' && (
          <div className={`book-cover-mockup-frame theme-${bookTheme}`}>
            {/* Spine Fold Gradient Shadow */}
            <div className="book-spine-crease-shadow" />
            <div className="book-spine-gold-line" />

            <div className="book-cover-content-layout">
              {/* Top Eyebrow Ribbon */}
              <div className="book-top-eyebrow">
                <span className="book-publisher-series">ঐতিহাসিক সাহিত্যসম্ভার • প্রথম সংস্করণ</span>
                <span className="book-gold-ornament">❖ ❖ ❖</span>
              </div>

              {/* Center Monumental Title Area */}
              <div className="book-title-block">
                <h2
                  className="book-main-title"
                  style={fontFamilyStyle}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setCustomTitle(e.currentTarget.textContent)}
                  title="ক্লিক করে শিরোনাম পরিবর্তন করুন"
                >
                  {displayTitle}
                </h2>

                <p 
                  className="book-sub-title"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setCustomSubtitle(e.currentTarget.textContent)}
                  title="ক্লিক করে উপশিরোনাম পরিবর্তন করুন"
                >
                  {displaySubtitle}
                </p>
              </div>

              {/* Bottom Author & Publisher Area */}
              <div className="book-bottom-author-block">
                <div className="book-author-separator-line" />
                
                <h4
                  className="book-author-name"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setCustomAuthor(e.currentTarget.textContent)}
                  title="ক্লিক করে লেখকের নাম পরিবর্তন করুন"
                >
                  {displayAuthor}
                </h4>

                <div className="book-publisher-seal-row">
                  <div className="book-seal-stamp">
                    <span>অক্ষর</span>
                  </div>
                  <span className="book-publisher-name">আনন্দ প্রকাশনা সংস্থা • ঢাকা ও কলকাতা</span>
                </div>
              </div>
            </div>

            {/* Subtle paper grain overlay */}
            <div className="book-cloth-texture-overlay" />
          </div>
        )}

        {/* MOCKUP 2: BROADSHEET NEWSPAPER HEADLINE */}
        {mockupType === 'newspaper' && (
          <div className="newspaper-mockup-frame">
            {/* Top Masthead Header Strip */}
            <div className="newspaper-top-masthead">
              <div className="newspaper-meta-left">
                <span>বর্ষ ৪৫ • সংখ্যা ৩১২</span>
                <span>ঢাকা, শনিবার, ২৪ কার্তিক, ১৪৩১</span>
              </div>

              {/* Main Newspaper Name */}
              <div className="newspaper-brand-center">
                <h1 className="newspaper-brand-title">দৈনিক বার্তা</h1>
                <span className="newspaper-brand-subtitle">THE DAILY CHRONICLE • সত্য ও সাহসের প্রতীক</span>
              </div>

              <div className="newspaper-meta-right">
                <span>আজকের আবহাওয়া: রৌদ্রোজ্জ্বল ২৮° সে.</span>
                <span>মূল্য: ৫.০০ টাকা</span>
              </div>
            </div>

            <div className="newspaper-divider-double" />

            {/* Main Lead Headline Area */}
            <div className="newspaper-lead-section">
              <span className="newspaper-kicker">বিশেষ প্রতিবেদন — বাংলা টাইপোগ্রাফি ও মুদ্রণ সংস্কৃতির নবজাগরণ</span>
              
              <h2
                className="newspaper-lead-headline"
                style={fontFamilyStyle}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setCustomTitle(e.currentTarget.textContent)}
                title="ক্লিক করে প্রধান শিরোনাম পরিবর্তন করুন"
              >
                {displayTitle}
              </h2>

              <p className="newspaper-sub-deck">
                ডিজিটাল বিপ্লবের যুগে ঐতিহ্যবাহী অক্ষরের নান্দনিক ছন্দ ও আধুনিক স্ক্রিন প্রযুক্তির মেলবন্ধনে উন্মোচিত হলো নতুন দিগন্ত।
              </p>
            </div>

            {/* Columns Body Layout */}
            <div className="newspaper-columns-grid">
              
              <div className="newspaper-col-text">
                <p>
                  <span className="newspaper-drop-cap" style={fontFamilyStyle}>বাং</span>
                  লা লিপি সহস্রাব্দের প্রাচীন ইতিহাসের সাক্ষী। প্রাচীন ব্রাহ্মী ও কুটিল লিপি থেকে বিবর্তিত হয়ে আজকের এই আধুনিক রূপ পরিগ্রহ করেছে। প্রতিটি অক্ষরের বাঁক, মাত্রা ও যুক্তবর্ণের সুষম অনুপাত বাংলা টাইপোগ্রাফিকে এনে দিয়েছে এক অনন্য গৌরব ও আন্তর্জাতিক সমাদর।
                </p>
                <p>
                  চার্লস উইলকিন্স ও পঞ্চানন কর্মকারের হাত ধরে বাংলা মুদ্রণ হরফের যে ঐতিহাসিক যাত্রা শুরু হয়েছিল, তা আজ কম্পিউটার ও ডিজিটাল ফন্টের যুগে এসে এক বিশাল মহীরুহে পরিণত হয়েছে।
                </p>
              </div>

              <div className="newspaper-col-text">
                <div className="newspaper-photo-box">
                  <div className="newspaper-halftone-mock">
                    <span className="halftone-seal-brand" style={fontFamilyStyle}>অক্ষর</span>
                  </div>
                  <span className="newspaper-caption">মুদ্রণ শিল্পের প্রাচীন রূপ থেকে সমকালীন ডিজিটাল বিন্যাস</span>
                </div>
                <p>
                  সুষম কার্নিং, নিখুঁত ওপেনটাইপ ফিচার এবং সঠিক লিগেচারের প্রয়োগে বাংলা ফন্ট আজ আন্তর্জাতিক মানের সাথে নিখুঁতভাবে সঙ্গতিপূর্ণ হচ্ছে।
                </p>
              </div>

              {!isCompact && (
                <div className="newspaper-col-text">
                  <div className="newspaper-quote-box" style={fontFamilyStyle}>
                    “অক্ষর কেবল প্রকাশের মাধ্যম নয়—তা একটি জাতির সংস্কৃতির আত্মপ্রকাশ।”
                  </div>
                  <p>
                    নতুন প্রজন্মের ডিজাইনাররা ঐতিহ্যকে শ্রদ্ধা জানিয়ে আধুনিক সফটওয়্যার ও মোবাইল অ্যাপে সহজে ব্যবহারযোগ্য পরিশীলিত ফন্ট তৈরি করছেন।
                  </p>
                </div>
              )}

            </div>

            {/* Old Newspaper Paper Texture Grain */}
            <div className="newspaper-paper-texture" />
          </div>
        )}

        {/* MOCKUP 3: ART EXHIBITION POSTER */}
        {mockupType === 'poster' && (
          <div className={`poster-mockup-frame poster-theme-${posterTheme}`}>
            {/* Monumental Sculptural Background Glyph */}
            <div className="poster-background-glyph" style={fontFamilyStyle}>
              {font.banglaName ? font.banglaName.charAt(0) : 'অ'}
            </div>

            {/* Poster Header */}
            <div className="poster-top-bar">
              <span className="poster-serial">EXHIBITION CATALOGUE • NO. 2026</span>
              <span className="poster-circle-badge">বাংলা লিপি</span>
            </div>

            {/* Dramatic Typography Stage */}
            <div className="poster-main-typography-stage">
              <span className="poster-eyebrow-accent">আন্তর্জাতিক অক্ষর ও মুদ্রণকলা প্রদর্শনী</span>
              
              <h2
                className="poster-dynamic-title"
                style={fontFamilyStyle}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setCustomTitle(e.currentTarget.textContent)}
                title="ক্লিক করে পোস্টারের লেখা পরিবর্তন করুন"
              >
                {displayTitle}
              </h2>

              <p className="poster-curator-statement">
                শব্দশিল্প, নান্দনিক হরফ বিন্যাস ও ঐতিহ্যের নবদিগন্ত
              </p>
            </div>

            {/* Poster Footer Metadata & Seal */}
            <div className="poster-bottom-metadata">
              <div className="poster-venue-info">
                <strong>স্থান:</strong> বাংলাদেশ শিল্পকলা একাডেমি ও রবীন্দ্র সদন<br />
                <strong>তারিখ:</strong> ১৫—২১শে ফেব্রুয়ারি ২০২৬ • প্রতিদিন সকাল ১০টা—রাত ৮টা
              </div>

              {/* Authentic Red Stamp Watermark */}
              <div className="poster-red-seal-stamp">
                <svg viewBox="0 0 80 80" className="poster-seal-svg">
                  <circle cx="40" cy="40" r="37" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <text x="40" y="38" textAnchor="middle" className="seal-text-bangla">অক্ষর</text>
                  <text x="40" y="50" textAnchor="middle" className="seal-text-year">EST. 2026</text>
                </svg>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Interactive Helper Hint */}
      <div className="mockup-interaction-hint">
        <Sparkles size={12} color="var(--accent-vermilion)" />
        <span>শিরোনাম, লেখক বা বিবরণীর উপর ক্লিক করে নিজের পছন্দমতো শব্দ লিখে সরাসরি পরখ করুন</span>
      </div>

    </div>
  );
}
