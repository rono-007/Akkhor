import React, { useState, useEffect } from 'react';
import { Layers, Sliders, Eye, Sparkles } from 'lucide-react';
import { FEATURED_FONTS, PANGRAMS, ensureFontFaceLoaded } from '../data/fontsData';
import { isAnsiFont, unicodeToBijoy } from '../utils/banglaConverter';

export default function WaterfallView({ onOpenSpecimen, onOpenPlayground }) {
  const [testSentence, setTestSentence] = useState('শব্দশিল্পের গভীরতা ও অক্ষরের মহিমা');
  const [baseSize, setBaseSize] = useState(36);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFonts = selectedCategory === 'All' 
    ? FEATURED_FONTS 
    : FEATURED_FONTS.filter(f => f.category === selectedCategory);

  useEffect(() => {
    filteredFonts.forEach((f) => {
      const isVariable = f.tags?.includes('Variable') || f.name.toLowerCase().includes('variable');
      if (f.styles && f.styles.length > 0) {
        f.styles.forEach((s) => {
          if (s.file) ensureFontFaceLoaded(f.name, s.file, s.weight || '400', s.style || 'normal', isVariable);
        });
      } else if (f.file) {
        ensureFontFaceLoaded(f.name, f.file, '400', 'normal', isVariable);
      }
    });
  }, [filteredFonts]);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="hero-pill" style={{ marginBottom: '0.75rem' }}>
          <Layers size={14} />
          <span>SPECIMEN CASCADE ANALYZER</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          Multi-Typeface Specimen Waterfall
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', marginTop: '0.5rem' }}>
          Compare optical weight, x-height, baseline proportion, and character rhythm across multiple typefaces with a synchronized sentence.
        </p>
      </div>

      {/* Control Strip */}
      <div className="store-toolbar-row1" style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-hairline)', marginBottom: '2rem' }}>
        <div style={{ flex: 2, minWidth: '300px' }}>
          <input
            type="text"
            className="preview-input"
            value={testSentence}
            onChange={(e) => setTestSentence(e.target.value)}
            placeholder="Type universal preview sentence..."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {PANGRAMS.slice(0, 4).map((p) => (
            <button
              key={p.id}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              onClick={() => setTestSentence(p.text)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="size-scrubber-wrap">
          <span className="size-label">{baseSize}px</span>
          <input
            type="range"
            min="20"
            max="72"
            value={baseSize}
            onChange={(e) => setBaseSize(parseInt(e.target.value))}
            className="size-slider"
          />
        </div>
      </div>

      {/* Waterfall Rows */}
      <div className="waterfall-list">
        {filteredFonts.map((font) => (
          <div key={font.id} className="waterfall-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {font.name}
                </span>
                {font.banglaName && (
                  <span style={{ color: 'var(--accent-vermilion)', marginLeft: '0.5rem', fontWeight: 600 }}>
                    ({font.banglaName})
                  </span>
                )}
                <span className="card-category-pill" style={{ marginLeft: '0.75rem' }}>
                  {font.category}
                </span>
                <span className={`badge-encoding ${isAnsiFont(font) ? 'badge-ansi' : 'badge-unicode'}`} style={{ marginLeft: '0.5rem' }}>
                  {isAnsiFont(font) ? 'Bijoy ANSI' : 'Unicode'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-secondary" onClick={() => onOpenSpecimen(font)}>
                  <Eye size={14} />
                  <span>Specimen</span>
                </button>
                <button className="btn-secondary" onClick={() => onOpenPlayground(font)}>
                  <Sparkles size={14} />
                  <span>Playground</span>
                </button>
              </div>
            </div>

            <div className="waterfall-cascade">
              {(() => {
                const textToDisplay = isAnsiFont(font) ? unicodeToBijoy(testSentence) : testSentence;
                return [baseSize * 1.5, baseSize, baseSize * 0.75].map((sz, idx) => (
                  <div key={idx} className="waterfall-row">
                    <span className="waterfall-size-indicator">{Math.round(sz)}px</span>
                    <div
                      className="waterfall-text"
                      style={{
                        fontFamily: `'${font.name}', sans-serif`,
                        fontSize: `${sz}px`
                      }}
                    >
                      {textToDisplay}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
