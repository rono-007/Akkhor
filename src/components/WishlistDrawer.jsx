import React, { useEffect } from 'react';
import { X, Heart, Trash2, ShoppingBag, Eye, Download } from 'lucide-react';
import { isAnsiFont, unicodeToBijoy } from '../utils/banglaConverter';
import { ensureFontFaceLoaded } from '../data/fontsData';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onOpenSpecimen
}) {
  // Ensure all fonts in wishlist are loaded
  useEffect(() => {
    wishlist.forEach((font) => {
      const isVariable = font.tags?.includes('Variable') || font.name?.toLowerCase().includes('variable');
      if (font.styles && font.styles.length > 0) {
        font.styles.forEach((s) => {
          if (s.file) ensureFontFaceLoaded(font.name, s.file, s.weight || '400', s.style || 'normal', isVariable);
        });
      } else if (font.file) {
        ensureFontFaceLoaded(font.name, font.file, '400', 'normal', isVariable);
      }
    });
  }, [wishlist]);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel">
        <div className="drawer-header">
          <div className="drawer-title">
            <Heart size={18} color="#ff3366" fill="#ff3366" />
            <span>Saved Favorites ({wishlist.length})</span>
          </div>
          <button className="mini-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content">
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Heart size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>Your wishlist is currently empty.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Click the heart icon on any font to save it for your next typography project.
              </p>
            </div>
          ) : (
            wishlist.map((font) => {
              const isAnsi = isAnsiFont(font);
              const previewSample = font.sampleHeadline || 'নান্দনিক বর্ণমালা';
              const displaySample = isAnsi ? unicodeToBijoy(previewSample) : previewSample;

              return (
                <div key={font.id} className="cart-item-card">
                  <div className="cart-item-row">
                    <div>
                      <h4 className="cart-item-name">{font.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {font.category} • {font.isFree ? 'Free' : `$${font.price}`}
                        </span>
                        <span className={`badge-encoding ${isAnsi ? 'badge-ansi' : 'badge-unicode'}`}>
                          {isAnsi ? 'Bijoy ANSI' : 'Unicode'}
                        </span>
                      </div>
                    </div>

                    <button
                      className="mini-icon-btn"
                      onClick={() => onRemoveFromWishlist(font.id)}
                      title="Remove from favorites"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div
                    style={{
                      fontFamily: `'${font.name}', sans-serif`,
                      fontSize: '1.4rem',
                      color: 'var(--text-primary)',
                      margin: '0.5rem 0',
                      lineHeight: 1.2
                    }}
                  >
                    {displaySample}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button
                      className="btn-secondary"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => {
                        onOpenSpecimen(font);
                        onClose();
                      }}
                    >
                      <Eye size={14} />
                      <span>Specimen</span>
                    </button>

                    <button
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => onAddToCart(font)}
                    >
                      <ShoppingBag size={14} />
                      <span>{font.isFree ? 'Free Claim' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
