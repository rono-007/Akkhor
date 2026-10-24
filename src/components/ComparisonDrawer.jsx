import React, { useState, useEffect } from 'react';
import { X, Trash2, Columns, Sparkles, Eye } from 'lucide-react';
import { ensureFontFaceLoaded } from '../data/fontsData';
import { isAnsiFont, unicodeToBijoy } from '../utils/banglaConverter';

export default function ComparisonDrawer({
  isOpen,
  onClose,
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onOpenSpecimen
}) {
  const [compareText, setCompareText] = useState('মুক্তির গান ও বিজয়ের চিরভাস্বর সুর');
  const [compareSize, setCompareSize] = useState(42);

  // Preload fonts in comparison list
  useEffect(() => {
    compareList.forEach((f) => {
      const isVariable = f.tags?.includes('Variable') || f.name.toLowerCase().includes('variable');
      if (f.styles && f.styles.length > 0) {
        f.styles.forEach((s) => {
          if (s.file) ensureFontFaceLoaded(f.name, s.file, s.weight || '400', s.style || 'normal', isVariable);
        });
      } else if (f.file) {
        ensureFontFaceLoaded(f.name, f.file, '400', 'normal', isVariable);
      }
    });
  }, [compareList]);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel" style={{ maxWidth: '640px' }}>
        <div className="drawer-header">
          <div className="drawer-title">
            <Columns size={18} color="var(--accent-vermilion)" />
            <span>Typeface Comparison ({compareList.length}/3)</span>
          </div>
          <button className="mini-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content">
          {compareList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Columns size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>No typefaces selected for comparison yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Click the comparison icon on any font card to inspect them side-by-side.
              </p>
            </div>
          ) : (
            <>
              {/* Synchronized input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  SYNCHRONIZED COMPARISON TEXT:
                </span>
                <input
                  type="text"
                  className="preview-input"
                  value={compareText}
                  onChange={(e) => setCompareText(e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    SIZE: {compareSize}px
                  </span>
                  <input
                    type="range"
                    min="20"
                    max="72"
                    value={compareSize}
                    onChange={(e) => setCompareSize(parseInt(e.target.value))}
                    className="size-slider"
                  />
                </div>
              </div>

              {/* Compared items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {compareList.map((font) => (
                  <div
                    key={font.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-hairline)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.5rem' }}>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          {font.name}
                        </span>
                        <span className="card-category-pill" style={{ marginLeft: '0.5rem' }}>
                          {font.category}
                        </span>
                        <span className={`badge-encoding ${isAnsiFont(font) ? 'badge-ansi' : 'badge-unicode'}`} style={{ marginLeft: '0.4rem' }}>
                          {isAnsiFont(font) ? 'Bijoy ANSI' : 'Unicode'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          className="mini-icon-btn"
                          onClick={() => onOpenSpecimen(font)}
                          title="Open Specimen"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="mini-icon-btn"
                          onClick={() => onRemoveFromCompare(font.id)}
                          title="Remove from comparison"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        fontFamily: `'${font.name}', sans-serif`,
                        fontSize: `${compareSize}px`,
                        color: 'var(--text-primary)',
                        lineHeight: 1.25,
                        wordBreak: 'break-word'
                      }}
                    >
                      {isAnsiFont(font) ? unicodeToBijoy(compareText) : compareText}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {compareList.length > 0 && (
          <div className="drawer-footer">
            <button
              className="btn-secondary"
              style={{ justifyContent: 'center' }}
              onClick={onClearCompare}
            >
              <Trash2 size={15} />
              <span>Clear Comparison List</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
