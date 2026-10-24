import React, { useState, useEffect } from 'react';
import { Type, Copy, Check, Search } from 'lucide-react';
import { GLYPH_SETS, FEATURED_FONTS, ensureFontFaceLoaded } from '../data/fontsData';
import { isAnsiFont, unicodeToBijoy } from '../utils/banglaConverter';

export default function GlyphMatrixView() {
  const [selectedFont, setSelectedFont] = useState(FEATURED_FONTS[0]);
  const [copiedChar, setCopiedChar] = useState(null);
  const [activeGlyphGroup, setActiveGlyphGroup] = useState('all');
  const [hoveredGlyph, setHoveredGlyph] = useState(null);

  const isAnsi = isAnsiFont(selectedFont);

  // Ensure font face is loaded
  useEffect(() => {
    if (selectedFont) {
      const isVariable = selectedFont.tags?.includes('Variable') || selectedFont.name?.toLowerCase().includes('variable');
      if (selectedFont.styles && selectedFont.styles.length > 0) {
        selectedFont.styles.forEach((s) => {
          if (s.file) {
            ensureFontFaceLoaded(selectedFont.name, s.file, s.weight || '400', s.style || 'normal', isVariable);
          }
        });
      } else if (selectedFont.file) {
        ensureFontFaceLoaded(selectedFont.name, selectedFont.file, '400', 'normal', isVariable);
      }
    }
  }, [selectedFont]);

  const handleCopy = (char) => {
    navigator.clipboard.writeText(char);
    setCopiedChar(char);
    setTimeout(() => setCopiedChar(null), 1500);
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-pill" style={{ marginBottom: '0.75rem' }}>
          <Type size={14} />
          <span>UNICODE CHARACTER MATRIX</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          Glyph Matrix & Character Inspector
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', marginTop: '0.5rem' }}>
          Inspect comprehensive glyph coverage for Bengali vowels, consonants, complex conjuncts, numerals, and punctuation. Click any character to copy it and inspect its Unicode hex encoding.
        </p>
      </div>

      {/* Top Selector Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'var(--bg-surface)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-hairline)', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            CURRENT TYPEFACE:
          </span>
          <select
            className="sort-select"
            value={selectedFont.id}
            onChange={(e) => {
              const f = FEATURED_FONTS.find(x => x.id === e.target.value);
              if (f) setSelectedFont(f);
            }}
          >
            {FEATURED_FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.banglaName || f.category})
              </option>
            ))}
          </select>
          <span className={`badge-encoding ${isAnsi ? 'badge-ansi' : 'badge-unicode'}`}>
            {isAnsi ? 'Bijoy ANSI' : 'Unicode'}
          </span>
        </div>

        {/* Quick Filter Group Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            className={`category-pill-btn ${activeGlyphGroup === 'all' ? 'active' : ''}`}
            onClick={() => setActiveGlyphGroup('all')}
          >
            All Sets
          </button>
          <button
            className={`category-pill-btn ${activeGlyphGroup === 'vowels' ? 'active' : ''}`}
            onClick={() => setActiveGlyphGroup('vowels')}
          >
            স্বরবর্ণ (Vowels)
          </button>
          <button
            className={`category-pill-btn ${activeGlyphGroup === 'consonants' ? 'active' : ''}`}
            onClick={() => setActiveGlyphGroup('consonants')}
          >
            ব্যঞ্জনবর্ণ (Consonants)
          </button>
          <button
            className={`category-pill-btn ${activeGlyphGroup === 'conjuncts' ? 'active' : ''}`}
            onClick={() => setActiveGlyphGroup('conjuncts')}
          >
            যুক্তাক্ষর (Conjuncts)
          </button>
          <button
            className={`category-pill-btn ${activeGlyphGroup === 'banglaNumerals' ? 'active' : ''}`}
            onClick={() => setActiveGlyphGroup('banglaNumerals')}
          >
            সংখ্যা (Numerals)
          </button>
          <button
            className={`category-pill-btn ${activeGlyphGroup === 'latinUpper' ? 'active' : ''}`}
            onClick={() => setActiveGlyphGroup('latinUpper')}
          >
            Latin
          </button>
        </div>
      </div>

      {/* Copy Notification Toast */}
      {copiedChar && (
        <div className="toast-notice">
          <Check size={16} color="var(--accent-emerald)" />
          <span>Copied glyph "<strong>{copiedChar}</strong>" (U+{copiedChar.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}) to clipboard!</span>
        </div>
      )}

      {/* Glyph Inspector HUD */}
      {hoveredGlyph && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.5rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          zIndex: 100
        }}>
          <div style={{ fontFamily: `'${selectedFont.name}', sans-serif`, fontSize: '3rem', lineHeight: 1, color: 'var(--accent-vermilion)' }}>
            {isAnsi && !/^[A-Za-z0-9]/.test(hoveredGlyph) ? unicodeToBijoy(hoveredGlyph) : hoveredGlyph}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              Character: "{hoveredGlyph}" • Unicode: U+{hoveredGlyph.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              HTML Entity: &amp;#{hoveredGlyph.charCodeAt(0)};
              {isAnsi && !/^[A-Za-z0-9]/.test(hoveredGlyph) && (
                <span style={{ marginLeft: '0.5rem', color: 'var(--accent-vermilion)' }}>
                  • Bijoy Keystroke: "{unicodeToBijoy(hoveredGlyph)}"
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Glyph Groups Display */}
      {Object.entries(GLYPH_SETS).map(([key, group]) => {
        if (activeGlyphGroup !== 'all' && activeGlyphGroup !== key) return null;
        return (
          <div key={key} className="glyph-section-block">
            <div className="glyph-section-title">
              <span>{group.title}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ({group.chars.length} glyphs)
              </span>
            </div>

            <div className="glyph-grid">
              {group.chars.map((char, idx) => {
                const displayChar = (key === 'latinUpper' || key === 'latinLower')
                  ? char
                  : (isAnsi ? unicodeToBijoy(char) : char);

                return (
                  <div
                    key={idx}
                    className="glyph-tile"
                    style={{ fontFamily: `'${selectedFont.name}', sans-serif` }}
                    onClick={() => handleCopy(char)}
                    onMouseEnter={() => setHoveredGlyph(char)}
                    onMouseLeave={() => setHoveredGlyph(null)}
                    title={`Click to copy: ${char}${isAnsi ? ` (Bijoy: ${displayChar})` : ''}`}
                  >
                    {displayChar}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
