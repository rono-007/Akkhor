import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  Type, 
  BookOpen, 
  Sliders, 
  ShoppingBag, 
  Download, 
  Heart, 
  Columns, 
  Check, 
  Copy,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';
import { GLYPH_SETS, LICENSE_TIERS, ensureFontFaceLoaded, FEATURED_FONTS } from '../data/fontsData';
import { isAnsiFont, unicodeToBijoy } from '../utils/banglaConverter';
import RealWorldMockups from './RealWorldMockups';

export default function FontDetailModal({
  font,
  onClose,
  onAddToCart,
  isInCart,
  isFavorite,
  onToggleFavorite,
  onOpenPlayground
}) {
  const [activeTab, setActiveTab] = useState('waterfall');
  const [specimenText, setSpecimenText] = useState(
    font.sampleHeadline || 'শব্দশিল্প ও নান্দনিক বর্ণমালার মেলবন্ধন'
  );
  const [fontSize, setFontSize] = useState(48);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.3);
  const [textAlign, setTextAlign] = useState('left');
  const [selectedWeight, setSelectedWeight] = useState(
    font.styles?.[0]?.weight || '400'
  );
  const [selectedLicenseTier, setSelectedLicenseTier] = useState('commercial');
  const [copiedGlyph, setCopiedGlyph] = useState(null);

  const isAnsi = isAnsiFont(font);
  const renderedSpecimen = isAnsi ? unicodeToBijoy(specimenText) : specimenText;

  // Suggested paired font
  const pairedFont = FEATURED_FONTS.find((f) => f.id === font.suggestedPairing) || FEATURED_FONTS[0];

  // Load all styles of this font and paired font
  useEffect(() => {
    const isVariable = font.tags?.includes('Variable') || font.name?.toLowerCase().includes('variable');
    if (font.styles) {
      font.styles.forEach((s) => {
        if (s.file) {
          ensureFontFaceLoaded(font.name, s.file, s.weight || '400', s.style || 'normal', isVariable);
        }
      });
    } else if (font.file) {
      ensureFontFaceLoaded(font.name, font.file, '400', 'normal', isVariable);
    }

    if (pairedFont) {
      const pIsVar = pairedFont.tags?.includes('Variable') || pairedFont.name?.toLowerCase().includes('variable');
      if (pairedFont.styles) {
        pairedFont.styles.forEach((s) => {
          if (s.file) {
            ensureFontFaceLoaded(pairedFont.name, s.file, s.weight || '400', s.style || 'normal', pIsVar);
          }
        });
      } else if (pairedFont.file) {
        ensureFontFaceLoaded(pairedFont.name, pairedFont.file, '400', 'normal', pIsVar);
      }
    }
  }, [font, pairedFont]);

  // Waterfall sizes
  const waterfallSizes = [14, 20, 28, 38, 52, 72, 96];

  const handleCopyGlyph = (char) => {
    navigator.clipboard.writeText(char);
    setCopiedGlyph(char);
    setTimeout(() => setCopiedGlyph(null), 1500);
  };



  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="specimen-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div>
              <h2 className="modal-font-title">
                {font.name}
                {font.banglaName && <span className="modal-font-bangla"> ({font.banglaName})</span>}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span className="card-category-pill">{font.category}</span>
                <span>•</span>
                <span>{font.foundry || 'Independent'}</span>
                <span>•</span>
                <span>{font.year || '2024'}</span>
                <span>•</span>
                <span style={{ color: font.isFree ? 'var(--accent-emerald)' : 'var(--accent-vermilion)', fontWeight: 600 }}>
                  {font.license || (font.isFree ? 'SIL Open Font' : 'Commercial')}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="btn-secondary"
              onClick={() => onOpenPlayground(font)}
              title="Open in Poster Playground"
            >
              <Sparkles size={16} />
              <span>Poster Studio</span>
            </button>

            <button
              className={`mini-icon-btn ${isFavorite ? 'is-fav' : ''}`}
              onClick={() => onToggleFavorite(font)}
              title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            <button
              className="mini-icon-btn"
              onClick={onClose}
              title="Close Specimen Sheet"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="modal-tabs-nav">
          <button
            className={`modal-tab-btn ${activeTab === 'waterfall' ? 'active' : ''}`}
            onClick={() => setActiveTab('waterfall')}
          >
            <Layers size={16} />
            <span>Waterfall Specimen</span>
          </button>

          <button
            className={`modal-tab-btn ${activeTab === 'mockup' ? 'active' : ''}`}
            onClick={() => setActiveTab('mockup')}
          >
            <Sparkles size={16} color="var(--accent-vermilion)" />
            <span>বাস্তব প্রয়োগ নকশা (Live Mockups)</span>
          </button>

          <button
            className={`modal-tab-btn ${activeTab === 'glyphs' ? 'active' : ''}`}
            onClick={() => setActiveTab('glyphs')}
          >
            <Type size={16} />
            <span>Alphabet & Glyphs</span>
          </button>

          <button
            className={`modal-tab-btn ${activeTab === 'editorial' ? 'active' : ''}`}
            onClick={() => setActiveTab('editorial')}
          >
            <BookOpen size={16} />
            <span>Editorial Layout</span>
          </button>

          <button
            className={`modal-tab-btn ${activeTab === 'styles' ? 'active' : ''}`}
            onClick={() => setActiveTab('styles')}
          >
            <Sliders size={16} />
            <span>Weights & Styles ({font.styles?.length || 1})</span>
          </button>

          <button
            className={`modal-tab-btn ${activeTab === 'pairing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pairing')}
          >
            <Columns size={16} />
            <span>Type Pairing</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-scroll-body">
          {/* TAB 1: WATERFALL SPECIMEN */}
          {activeTab === 'waterfall' && (
            <div>
              {/* Interactive Controls Bar */}
              <div className="specimen-controls-bar">
                <div className="control-item" style={{ flex: 1.5 }}>
                  <span className="control-label">Live Preview Text</span>
                  <input
                    type="text"
                    value={specimenText}
                    onChange={(e) => setSpecimenText(e.target.value)}
                    className="preview-input"
                    placeholder="Type custom specimen sentence..."
                  />
                </div>

                <div className="control-item">
                  <span className="control-label">Font Weight</span>
                  <select
                    className="sort-select"
                    value={selectedWeight}
                    onChange={(e) => setSelectedWeight(e.target.value)}
                  >
                    <option value="200">200 - Extra Light</option>
                    <option value="300">300 - Light</option>
                    <option value="400">400 - Regular</option>
                    <option value="600">600 - SemiBold</option>
                    <option value="700">700 - Bold</option>
                    <option value="800">800 - Extra Bold</option>
                    <option value="900">900 - Black</option>
                  </select>
                </div>

                <div className="control-item">
                  <span className="control-label">Letter Spacing: {letterSpacing}px</span>
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    step="0.5"
                    value={letterSpacing}
                    onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                    className="size-slider"
                  />
                </div>

                <div className="control-item">
                  <span className="control-label">Line Height: {lineHeight}</span>
                  <input
                    type="range"
                    min="0.9"
                    max="2.2"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                    className="size-slider"
                  />
                </div>

                <div className="control-item">
                  <span className="control-label">Align</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['left', 'center', 'right'].map((al) => (
                      <button
                        key={al}
                        onClick={() => setTextAlign(al)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: textAlign === al ? 'var(--accent-vermilion)' : 'var(--bg-surface-elevated)',
                          color: textAlign === al ? '#fff' : 'var(--text-secondary)',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.75rem',
                          textTransform: 'capitalize'
                        }}
                      >
                        {al}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Waterfall Cascade Card */}
              <div className="specimen-waterfall-card" style={{ marginTop: '1.5rem' }}>
                {waterfallSizes.map((sz) => (
                  <div key={sz} className="specimen-waterfall-item">
                    <span className="waterfall-pt-badge">{sz}px</span>
                    <div
                      style={{
                        fontFamily: `'${font.name}', sans-serif`,
                        fontSize: `${sz}px`,
                        fontWeight: selectedWeight,
                        letterSpacing: `${letterSpacing}px`,
                        lineHeight: lineHeight,
                        textAlign: textAlign,
                        color: 'var(--text-primary)',
                        flex: 1,
                        wordBreak: 'break-word'
                      }}
                    >
                      {renderedSpecimen}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ALPHABET & GLYPH MAP */}
          {activeTab === 'glyphs' && (
            <div>
              {copiedGlyph && (
                <div style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--accent-vermilion-subtle)',
                  border: '1px solid var(--accent-vermilion)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1rem',
                  color: 'var(--accent-vermilion)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem'
                }}>
                  Copied glyph "{copiedGlyph}" (Unicode: U+{copiedGlyph.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}) to clipboard!
                </div>
              )}

              {Object.entries(GLYPH_SETS).map(([key, group]) => (
                <div key={key} className="glyph-section-block">
                  <div className="glyph-section-title">
                    <span>{group.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ({group.chars.length} glyphs • click to copy)
                    </span>
                  </div>

                  <div className="glyph-grid">
                    {group.chars.map((char, cIdx) => {
                      const displayChar = (key === 'latinUpper' || key === 'latinLower')
                        ? char
                        : (isAnsi ? unicodeToBijoy(char) : char);
                      return (
                        <div
                          key={cIdx}
                          className="glyph-tile"
                          style={{ fontFamily: `'${font.name}', sans-serif` }}
                          onClick={() => handleCopyGlyph(char)}
                          title={`Click to copy: ${char}`}
                        >
                          {displayChar}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: EDITORIAL & SAMPLE PARAGRAPHS */}
          {activeTab === 'editorial' && (
            <div className="editorial-layout-sample">
              <div className="editorial-col">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-vermilion)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  EDITORIAL JOURNAL • VOL. 28
                </span>

                <h3 style={{ fontFamily: `'${font.name}', sans-serif`, marginTop: '0.5rem' }}>
                  {isAnsi
                    ? unicodeToBijoy(font.sampleHeadline || 'বর্ণমালার মহাকাব্য ও ডিজিটাল অক্ষরের পুনরুজ্জীবন')
                    : (font.sampleHeadline || 'বর্ণমালার মহাকাব্য ও ডিজিটাল অক্ষরের পুনরুজ্জীবন')}
                </h3>

                <div className="quote-highlight" style={{ fontFamily: `'${font.name}', sans-serif` }}>
                  {isAnsi
                    ? unicodeToBijoy('“অক্ষর শুধু ভাব প্রকাশের মাধ্যম নয়, তা একটি জাতির ইতিহাস, সংস্কৃতি ও চেতনার শিল্পরূপ।”')
                    : '“অক্ষর শুধু ভাব প্রকাশের মাধ্যম নয়, তা একটি জাতির ইতিহাস, সংস্কৃতি ও চেতনার শিল্পরূপ।”'}
                </div>

                <p style={{ fontFamily: `'${font.name}', sans-serif` }}>
                  {isAnsi
                    ? unicodeToBijoy(font.sampleParagraph || 'বাংলা লিপি সহস্রাব্দের প্রাচীন ইতিহাসের সাক্ষী। প্রাচীন ব্রাহ্মী ও কুটিল লিপি থেকে বিবর্তিত হয়ে আজকের এই আধুনিক রূপ পরিগ্রহ করেছে। প্রতিটি অক্ষরের বাঁক, মাত্রা ও যুক্তবর্ণের সুষম অনুপাত বাংলা টাইপোগ্রাফিকে এনে দিয়েছে এক অনন্য গৌরব।')
                    : (font.sampleParagraph || 'বাংলা লিপি সহস্রাব্দের প্রাচীন ইতিহাসের সাক্ষী। প্রাচীন ব্রাহ্মী ও কুটিল লিপি থেকে বিবর্তিত হয়ে আজকের এই আধুনিক রূপ পরিগ্রহ করেছে। প্রতিটি অক্ষরের বাঁক, মাত্রা ও যুক্তবর্ণের সুষম অনুপাত বাংলা টাইপোগ্রাফিকে এনে দিয়েছে এক অনন্য গৌরব।')}
                </p>
              </div>

              <div className="editorial-col" style={{ background: 'var(--bg-canvas)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  NEWSPAPER / PRINT PROOF SPECIMEN
                </span>

                <h4 style={{ fontFamily: `'${font.name}', sans-serif`, fontSize: '1.35rem', margin: '0.75rem 0', color: 'var(--text-primary)' }}>
                  {isAnsi
                    ? unicodeToBijoy('মুদ্রণ শিল্পের বিকাশ ও টাইপোগ্রাফির অগ্রগতি')
                    : 'মুদ্রণ শিল্পের বিকাশ ও টাইপোগ্রাফির অগ্রগতি'}
                </h4>

                <p style={{ fontFamily: `'${font.name}', sans-serif`, fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                  {isAnsi
                    ? unicodeToBijoy('চার্লস উইলকিন্স ও পঞ্চানন কর্মকারের হাত ধরে বাংলা মুদ্রণ হরফের যে ঐতিহাসিক যাত্রা শুরু হয়েছিল, তা আজ কম্পিউটার ও ডিজিটাল ফন্টের যুগে এসে এক বিশাল মহীরুহে পরিণত হয়েছে। সুষম কার্নিং, ওপেনটাইপ ফিচার এবং সঠিক লিগেচারের প্রয়োগে বাংলা ফন্ট আজ আন্তর্জাতিক মানের সাথে পাল্লা দিচ্ছে।')
                    : 'চার্লস উইলকিন্স ও পঞ্চানন কর্মকারের হাত ধরে বাংলা মুদ্রণ হরফের যে ঐতিহাসিক যাত্রা শুরু হয়েছিল, তা আজ কম্পিউটার ও ডিজিটাল ফন্টের যুগে এসে এক বিশাল মহীরুহে পরিণত হয়েছে। সুষম কার্নিং, ওপেনটাইপ ফিচার এবং সঠিক লিগেচারের প্রয়োগে বাংলা ফন্ট আজ আন্তর্জাতিক মানের সাথে পাল্লা দিচ্ছে।'}
                </p>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-xs)', borderLeft: '3px solid var(--accent-vermilion)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ENGLISH METRIC HARMONY:
                  </div>
                  <div style={{ fontFamily: `'${font.name}', sans-serif`, fontSize: '1.1rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                    {font.latinSample || 'Typography is two-dimensional architecture for human thought.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REAL-WORLD MOCKUPS (BOOK, NEWSPAPER, POSTER) */}
          {activeTab === 'mockup' && (
            <div className="modal-mockup-tab-content">
              <RealWorldMockups
                font={font}
                sampleText={specimenText}
                isCompact={false}
              />
            </div>
          )}

          {/* TAB 4: AVAILABLE STYLES & WEIGHTS */}
          {activeTab === 'styles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                This typeface family includes {font.styles?.length || 1} available cut(s). All styles support Unicode Bengali and essential Latin metrics.
              </p>

              {font.styles?.map((s) => (
                <div
                  key={s.name}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-hairline)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        {s.name}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-surface-elevated)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-xs)' }}>
                        Weight {s.weight || '400'}
                      </span>
                    </div>

                    <div
                      style={{
                        fontFamily: `'${font.name}', sans-serif`,
                        fontSize: '1.8rem',
                        fontWeight: s.weight || '400',
                        fontStyle: s.style || 'normal',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {renderedSpecimen}
                    </div>
                  </div>

                  <a
                    href={s.file}
                    download={`${font.name}_${s.name}.ttf`}
                    className="btn-secondary"
                    title="Download this single weight file"
                  >
                    <Download size={14} />
                    <span>Download Cut</span>
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: TYPE PAIRING */}
          {activeTab === 'pairing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-vermilion)', textTransform: 'uppercase' }}>
                  CURATED FOUNDRY PAIRING RECOMMENDATION
                </span>
                <h4 style={{ fontSize: '1.2rem', marginTop: '0.35rem', color: 'var(--text-primary)' }}>
                  Headline in <strong>{font.name}</strong> paired with Body in <strong>{pairedFont.name}</strong>
                </h4>
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2.5rem' }}>
                <div style={{ fontFamily: `'${font.name}', sans-serif`, fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                  {isAnsi
                    ? unicodeToBijoy(font.sampleHeadline || 'নান্দনিক শব্দশিল্প ও সাহিত্যের আধুনিক রূপকল্প')
                    : (font.sampleHeadline || 'নান্দনিক শব্দশিল্প ও সাহিত্যের আধুনিক রূপকল্প')}
                </div>

                <div style={{ fontFamily: `'${pairedFont.name}', sans-serif`, fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                  {isAnsiFont(pairedFont)
                    ? unicodeToBijoy(pairedFont.sampleParagraph || 'ভাষার প্রতিটি অক্ষরে মিশে থাকে মানুষের আবেগ, অনুভূতি ও শৈল্পিক দৃষ্টি। হেডলাইনের বলিষ্ঠ উপস্থাপনের সাথে বডি টেক্সটের স্নিগ্ধ পাঠযোগ্যতা মিলে গড়ে তোলে নিখুঁত টাইপোগ্রাফিক মেলবন্ধন।')
                    : (pairedFont.sampleParagraph || 'ভাষার প্রতিটি অক্ষরে মিশে থাকে মানুষের আবেগ, অনুভূতি ও শৈল্পিক দৃষ্টি। হেডলাইনের বলিষ্ঠ উপস্থাপনের সাথে বডি টেক্সটের স্নিগ্ধ পাঠযোগ্যতা মিলে গড়ে তোলে নিখুঁত টাইপোগ্রাফিক মেলবন্ধন।')}
                </div>
              </div>
            </div>
          )}

          {/* TECHNICAL METRICS & LICENSE CARD (PRICING REMOVED) */}
          <div className="specimen-purchase-card">
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                FOUNDRY LICENSE &amp; PERMITTED USAGE
              </span>
              <div className="license-options-grid" style={{ marginTop: '0.75rem' }}>
                <div className="license-radio-card active">
                  <div className="license-tier-title">Open Font License (OFL)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700, marginTop: '0.2rem' }}>
                    100% Free &amp; Open Source
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Free for personal, editorial, commercial, and embedded web projects worldwide.
                  </div>
                </div>

                <div className="license-radio-card">
                  <div className="license-tier-title">Format &amp; Encoding</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '0.2rem' }}>
                    {isAnsi ? 'Bijoy ANSI Encoding' : 'Unicode 15.0 Standard'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    TrueType (.ttf) format with comprehensive Bengali conjuncts &amp; ligatures.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '240px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ARCHIVE ACCESS
                </span>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  Free Access
                </div>
              </div>

              <a
                href={font.styles?.[0]?.file || font.file}
                download={`${font.name}.ttf`}
                className="btn-primary"
                style={{ justifyContent: 'center', padding: '0.75rem 1.25rem', gap: '0.5rem', background: '#171412', color: '#fff', borderRadius: 'var(--radius-full)' }}
              >
                <Download size={18} />
                <span>Download Font Package</span>
              </a>

              <button
                className="btn-secondary"
                style={{ justifyContent: 'center', padding: '0.65rem 1rem', fontSize: '0.82rem', gap: '0.4rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)' }}
                onClick={() => {
                  onClose();
                  onOpenPlayground(font);
                }}
              >
                <span>Open in Poster Studio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
