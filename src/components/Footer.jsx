import React from 'react';
import { Type, Sparkles, Heart } from 'lucide-react';

export default function Footer({ onSelectCategory, onNavigateTab }) {
  return (
    <footer className="foundry-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-glyph">অ</div>
              <div>
                <span className="brand-title">
                  AKSHAR <span className="brand-title-bn">অক্ষর</span>
                </span>
                <span className="brand-sub" style={{ display: 'block' }}>
                  TYPE FOUNDRY & DIGITAL ARCHIVE
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '380px' }}>
              Preserving, elevating, and reimagining the art of Bengali and multilingual type design. Offering precision specimens, open-source fonts, and commercial studio licenses for modern creatives worldwide.
            </p>
          </div>

          {/* Navigation Col */}
          <div className="footer-col">
            <h4>EXPLORE</h4>
            <ul className="footer-links">
              <li>
                <a href="#fonts" onClick={(e) => { e.preventDefault(); onNavigateTab('fonts'); }}>
                  Typeface Catalog (৭১৯ ফন্ট)
                </a>
              </li>
              <li>
                <a href="#playground" onClick={(e) => { e.preventDefault(); onNavigateTab('playground'); }}>
                  Poster Playground
                </a>
              </li>
              <li>
                <a href="#waterfall" onClick={(e) => { e.preventDefault(); onNavigateTab('waterfall'); }}>
                  Specimen Waterfall
                </a>
              </li>
              <li>
                <a href="#glyphs" onClick={(e) => { e.preventDefault(); onNavigateTab('glyphs'); }}>
                  Glyph Matrix Inspector
                </a>
              </li>
            </ul>
          </div>

          {/* Classifications Col */}
          <div className="footer-col">
            <h4>CLASSIFICATIONS</h4>
            <ul className="footer-links">
              <li>
                <a href="#serif" onClick={(e) => { e.preventDefault(); onSelectCategory('Serif'); onNavigateTab('fonts'); }}>
                  Editorial Serif (ঐতিহ্যবাহী)
                </a>
              </li>
              <li>
                <a href="#sans" onClick={(e) => { e.preventDefault(); onSelectCategory('Sans Serif'); onNavigateTab('fonts'); }}>
                  Clean Sans Serif (আধুনিক)
                </a>
              </li>
              <li>
                <a href="#display" onClick={(e) => { e.preventDefault(); onSelectCategory('Display'); onNavigateTab('fonts'); }}>
                  Expressive Display (শৈল্পিক)
                </a>
              </li>
              <li>
                <a href="#script" onClick={(e) => { e.preventDefault(); onSelectCategory('Script'); onNavigateTab('fonts'); }}>
                  Handwriting &amp; Script (হস্তলিখিত)
                </a>
              </li>
            </ul>
          </div>

          {/* Licenses & Foundry Col */}
          <div className="footer-col">
            <h4>LICENSING</h4>
            <ul className="footer-links">
              <li>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  SIL Open Font License
                </span>
              </li>
              <li>
                <span>Commercial Studio Grant</span>
              </li>
              <li>
                <span>Enterprise Broadcast License</span>
              </li>
              <li>
                <span>Custom Foundry Commission</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © 2026 AKSHAR TYPE FOUNDRY. ALL ARCHIVE REPOSITORIES EXTRACTED & CATALOGED.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Crafted with</span>
            <Heart size={14} color="var(--accent-vermilion)" fill="var(--accent-vermilion)" />
            <span>for Bengali Typography & Design Heritage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
