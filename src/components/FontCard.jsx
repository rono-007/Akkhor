import React, { useEffect, useState, useMemo } from 'react';
import { 
  Heart, 
  Columns, 
  Download, 
  Check, 
  ArrowUpRight,
  Copy,
  PenTool,
  Layers,
  Sparkles
} from 'lucide-react';
import { ensureFontFaceLoaded } from '../data/fontsData';
import { getFontDownloadUrl } from '../api/client';
import { isAnsiFont, getFontPreviewText, unicodeToBijoy } from '../utils/banglaConverter';
import RealWorldMockups from './RealWorldMockups';

const SAMPLE_ALPHABET = 'অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ — ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম য র ল শ ষ স হ ড় ঢ় য়';
const SAMPLE_NUMBERS = '০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ • 0 1 2 3 4 5 6 7 8 9';
const SAMPLE_LATIN = 'Sphinx of black quartz, judge my vow. ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890';

export default function FontCard({
  font,
  previewText,
  currentPangram,
  fontSize,
  layoutMode = 'list', // 'list' | 'grid'
  onOpenSpecimen,
  onOpenPlayground,
  isFavorite,
  onToggleFavorite,
  isComparing,
  onToggleCompare
}) {
  const [cardText, setCardText] = useState(previewText);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState('custom'); // 'custom', 'alphabet', 'numbers', 'latin'
  const [copiedCss, setCopiedCss] = useState(false);

  const isAnsi = useMemo(() => isAnsiFont(font), [font]);

  const activeStyle = font.styles?.[selectedStyleIndex] || font.styles?.[0] || {
    name: 'Regular',
    weight: '400',
    style: 'normal',
    file: font.file
  };

  // Ensure font face is loaded into document head
  useEffect(() => {
    if (activeStyle?.file) {
      const isVariable = font.tags?.includes('Variable') || font.name.toLowerCase().includes('variable');
      ensureFontFaceLoaded(
        font.name,
        activeStyle.file,
        activeStyle.weight || '400',
        activeStyle.style || 'normal',
        isVariable
      );
    }
  }, [font.name, activeStyle?.file, activeStyle?.weight, activeStyle?.style, font.tags]);

  // Sync card text when previewText updates
  useEffect(() => {
    setCardText(previewText);
  }, [previewText]);

  // Compute preview string according to ANSI / Unicode rules and preview mode
  const renderedText = useMemo(() => {
    let raw = '';
    if (previewMode === 'alphabet') {
      raw = SAMPLE_ALPHABET;
    } else if (previewMode === 'numbers') {
      raw = SAMPLE_NUMBERS;
    } else if (previewMode === 'latin') {
      return SAMPLE_LATIN;
    } else {
      raw = cardText || font.sampleHeadline || 'শব্দশিল্পের নান্দনিক রূপান্তর ও নবদিগন্ত';
    }

    if (isAnsi) {
      if (previewMode === 'alphabet' || previewMode === 'numbers') {
        return unicodeToBijoy(raw);
      }
      return getFontPreviewText(font, raw, currentPangram);
    }
    return raw;
  }, [font, cardText, isAnsi, currentPangram, previewMode]);

  const handleCopyCss = (e) => {
    e.stopPropagation();
    const cssString = `font-family: '${font.name}', sans-serif;`;
    navigator.clipboard.writeText(cssString);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 1800);
  };

  // File download target (prefers Worker API download endpoint, falls back to direct static file)
  const downloadUrl = (font.id && (font.id.startsWith('font-') || font.id.includes('-')))
    ? getFontDownloadUrl(font.id, activeStyle.name !== 'Regular' ? activeStyle.name : undefined)
    : (activeStyle.file || font.file);

  return (
    <article className={`font-card-container ${layoutMode === 'grid' ? 'is-grid-card' : 'is-list-card'} ${isComparing ? 'is-comparing' : ''}`}>
      
      {/* 1. Card Top Meta Header */}
      <div className="font-card-header">
        
        {/* Left: Identity, Badges, Provenance */}
        <div className="card-identity-block">
          <button 
            className="card-title-btn"
            onClick={() => onOpenSpecimen(font)}
            title="Inspect full specimen details"
          >
            <span className="font-title-en">{font.name}</span>
            {font.banglaName && (
              <span className="font-title-bn">{font.banglaName}</span>
            )}
          </button>

          <div className="card-meta-chips">
            <span className="card-chip chip-category">{font.category}</span>
            
            <span className={`card-chip chip-encoding ${isAnsi ? 'is-ansi' : 'is-unicode'}`}>
              {isAnsi ? 'Bijoy ANSI' : 'Unicode'}
            </span>

            <span className="card-chip chip-styles-count">
              {font.styles?.length || 1} {(font.styles?.length || 1) === 1 ? 'Style' : 'Styles'}
            </span>

            <span className="card-designer-by">
              by <strong className="designer-name">{font.designer || 'Open Archive'}</strong>
            </span>
          </div>
        </div>

        {/* Right: Interactive Weights Switcher & Action Tools */}
        <div className="card-header-actions">
          
          {/* Direct Weight/Style Switcher Pills */}
          {font.styles && font.styles.length > 1 && (
            <div className="card-weight-selector" aria-label="Available font weights">
              {font.styles.map((s, idx) => (
                <button
                  key={s.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStyleIndex(idx);
                  }}
                  className={`card-weight-btn ${selectedStyleIndex === idx ? 'active' : ''}`}
                  title={`Switch to ${s.name} style`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {/* Quick Copy CSS snippet */}
          <button
            className={`card-tool-btn ${copiedCss ? 'is-copied' : ''}`}
            onClick={handleCopyCss}
            title="Copy CSS font-family code"
          >
            {copiedCss ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedCss ? 'Copied' : 'CSS'}</span>
          </button>

          {/* Compare Toggle */}
          <button
            className={`card-icon-tool ${isComparing ? 'is-active' : ''}`}
            onClick={() => onToggleCompare(font)}
            title={isComparing ? 'Remove from comparison' : 'Compare with other fonts'}
            aria-label="Compare font"
          >
            <Columns size={14} />
          </button>

          {/* Wishlist / Favorite */}
          <button
            className={`card-icon-tool ${isFavorite ? 'is-favorited' : ''}`}
            onClick={() => onToggleFavorite(font)}
            title={isFavorite ? 'Saved in Wishlist' : 'Save font'}
            aria-label="Save font"
          >
            <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* Specimen Sheet Drawer */}
          <button
            className="card-tool-btn card-specimen-trigger"
            onClick={() => onOpenSpecimen(font)}
            title="Open comprehensive specimen sheet"
          >
            <span>Specimen</span>
            <ArrowUpRight size={13} />
          </button>

          {/* Download Font File Directly (NO PRICING TAGS) */}
          {downloadUrl ? (
            <a
              href={downloadUrl}
              download={`${font.name}.ttf`}
              className="card-download-btn"
              title="Download font file (Free OFL / Open Source)"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={13} />
              <span>Download</span>
            </a>
          ) : (
            <button
              className="card-download-btn"
              onClick={() => onOpenSpecimen(font)}
              title="View download details"
            >
              <Download size={13} />
              <span>Download</span>
            </button>
          )}

        </div>
      </div>

      {/* 2. Main Editable Typography Canvas or Live Real-World Mockup */}
      <div 
        className={`font-card-canvas ${previewMode === 'mockup' ? 'is-mockup-mode' : ''}`}
        onClick={(e) => {
          if (previewMode !== 'mockup') {
            const el = e.currentTarget.querySelector('.card-live-editable-text');
            if (el) el.focus();
          }
        }}
      >
        {previewMode === 'mockup' ? (
          <div className="card-mockup-inner-stage">
            <RealWorldMockups
              font={font}
              sampleText={cardText}
              isCompact={true}
              onOpenFullModal={() => onOpenSpecimen(font)}
            />
          </div>
        ) : (
          <div
            className="card-live-editable-text"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const text = e.currentTarget.textContent;
              if (text !== renderedText && previewMode === 'custom') {
                setCardText(text);
              }
            }}
            style={{
              fontFamily: `'${font.name}', sans-serif`,
              fontSize: `${layoutMode === 'grid' ? Math.min(fontSize, 42) : fontSize}px`,
              fontWeight: activeStyle.weight || '400',
              fontStyle: activeStyle.style || 'normal',
              lineHeight: 1.3
            }}
            title="Click to type and test custom phrase directly in this font"
          >
            {renderedText}
          </div>
        )}
      </div>

      {/* 3. Card Bottom Utility Strip */}
      <div className="font-card-footer">
        
        {/* Sample Modes Selector */}
        <div className="card-sample-modes">
          <button
            className={`sample-mode-pill ${previewMode === 'custom' ? 'active' : ''}`}
            onClick={() => setPreviewMode('custom')}
          >
            Sample Text
          </button>
          
          <button
            className={`sample-mode-pill ${previewMode === 'alphabet' ? 'active' : ''}`}
            onClick={() => setPreviewMode('alphabet')}
          >
            Glyphs (অ আ ক খ)
          </button>
          
          <button
            className={`sample-mode-pill ${previewMode === 'numbers' ? 'active' : ''}`}
            onClick={() => setPreviewMode('numbers')}
          >
            Numerals (০–৯)
          </button>
          
          <button
            className={`sample-mode-pill ${previewMode === 'latin' ? 'active' : ''}`}
            onClick={() => setPreviewMode('latin')}
          >
            Latin (Aa–Zz)
          </button>

          <button
            className={`sample-mode-pill ${previewMode === 'mockup' ? 'active' : ''}`}
            onClick={() => setPreviewMode('mockup')}
            title="বাস্তব বইয়ের প্রচ্ছদ ও সংবাদপত্রের নকশায় দেখুন"
          >
            <Sparkles size={11} color="var(--accent-vermilion)" />
            <span>নকশা (Mockup)</span>
          </button>
        </div>

        {/* Right Studio Shortcut */}
        <div className="card-footer-right">
          <button
            className="card-studio-link"
            onClick={() => onOpenPlayground(font)}
            title="Create a typographic poster with this font in Poster Studio"
          >
            <PenTool size={12} className="link-icon" />
            <span>Open in Poster Studio →</span>
          </button>
        </div>

      </div>

    </article>
  );
}
