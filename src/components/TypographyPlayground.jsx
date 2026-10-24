import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  Upload, 
  Palette, 
  Type, 
  Sliders, 
  RefreshCw, 
  Check, 
  Layers,
  Crop
} from 'lucide-react';
import { FEATURED_FONTS, ensureFontFaceLoaded } from '../data/fontsData';
import { isAnsiFont, unicodeToBijoy } from '../utils/banglaConverter';

export default function TypographyPlayground({ initialFont, allFonts }) {
  const [headlineFont, setHeadlineFont] = useState(initialFont?.name || 'Noto Sans Bengali');
  const [bodyFont, setBodyFont] = useState('Kalpurush');
  
  // Custom font uploaded by the user
  const [customFontName, setCustomFontName] = useState(null);

  // Poster Content
  const [headlineText, setHeadlineText] = useState('অক্ষরশিল্প ও দৃশ্যকাব্য');
  const [subtitleText, setSubtitleText] = useState('AKSHAR TYPE ARCHIVE • BENGALI TYPOGRAPHY SALON');
  const [bodyText, setBodyText] = useState(
    'নান্দনিক বর্ণমালার সুষম বিন্যাস চিন্তার স্বাধীনতা প্রকাশ করে। প্রতিটি রেখায় রচিত হয় নতুন কালের পদধ্বনি।'
  );
  const [dateText, setDateText] = useState('DHAKA • BERLIN • TOKYO — 2026');

  // Styling controls
  const [headlineSize, setHeadlineSize] = useState(64);
  const [headlineWeight, setHeadlineWeight] = useState('800');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.05);
  const [textAlign, setTextAlign] = useState('left');
  const [posterTheme, setPosterTheme] = useState('obsidian'); // obsidian, paper, vermilion, night, ochre
  const [aspectRatio, setAspectRatio] = useState('poster'); // poster (3:4), square (1:1), story (9:16)
  const [showWatermark, setShowWatermark] = useState(true);

  const canvasRef = useRef(null);
  const posterDomRef = useRef(null);

  const fontPool = (allFonts && allFonts.length > 0) ? allFonts : FEATURED_FONTS;

  const headlineFontObj = fontPool.find(f => f.name === headlineFont) || { name: headlineFont };
  const bodyFontObj = fontPool.find(f => f.name === bodyFont) || { name: bodyFont };

  const isHeadlineAnsi = isAnsiFont(headlineFontObj);
  const isBodyAnsi = isAnsiFont(bodyFontObj);
  const displayHeadline = isHeadlineAnsi ? unicodeToBijoy(headlineText) : headlineText;
  const displayBody = isBodyAnsi ? unicodeToBijoy(bodyText) : bodyText;

  // Load headline & body fonts
  useEffect(() => {
    const f1 = fontPool.find(f => f.name === headlineFont);
    if (f1) {
      const isVariable = f1.tags?.includes('Variable') || f1.name?.toLowerCase().includes('variable');
      if (f1.styles && f1.styles.length > 0) {
        f1.styles.forEach(s => {
          if (s.file) ensureFontFaceLoaded(f1.name, s.file, s.weight || '400', s.style || 'normal', isVariable);
        });
      } else if (f1.file) {
        ensureFontFaceLoaded(f1.name, f1.file, '400', 'normal', isVariable);
      }
    }

    const f2 = fontPool.find(f => f.name === bodyFont);
    if (f2) {
      const isVariable = f2.tags?.includes('Variable') || f2.name?.toLowerCase().includes('variable');
      if (f2.styles && f2.styles.length > 0) {
        f2.styles.forEach(s => {
          if (s.file) ensureFontFaceLoaded(f2.name, s.file, s.weight || '400', s.style || 'normal', isVariable);
        });
      } else if (f2.file) {
        ensureFontFaceLoaded(f2.name, f2.file, '400', 'normal', isVariable);
      }
    }
  }, [headlineFont, bodyFont, fontPool]);

  // Handle Custom Font Upload
  const handleFontUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fontName = file.name.replace(/\.[^/.]+$/, '').trim();
    const reader = new FileReader();
    reader.onload = (event) => {
      const fontData = event.target?.result;
      const font = new FontFace(fontName, fontData);
      font.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
        setCustomFontName(fontName);
        setHeadlineFont(fontName);
      }).catch(err => {
        console.error('Failed to load uploaded font face:', err);
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // Presets
  const applyPreset = (preset) => {
    if (preset === 'brutalist') {
      setHeadlineFont('Akhand Bengali');
      setHeadlineText('অখণ্ড শক্তি');
      setSubtitleText('AVANT-GARDE POSTER SERIES NO. 01');
      setBodyText('শব্দ যখন বিস্ফোরিত হয়, তখন টাইপোগ্রাফি হয়ে ওঠে এক বিপ্লবের দলিল।');
      setHeadlineSize(86);
      setHeadlineWeight('900');
      setLetterSpacing(-2);
      setLineHeight(0.95);
      setTextAlign('left');
      setPosterTheme('vermilion');
    } else if (preset === 'poetry') {
      setHeadlineFont('Chandrabati');
      setHeadlineText('আমার সোনার বাংলা');
      setSubtitleText('রবীন্দ্রনাথ ঠাকুর • গীতিমাল্য ১৯১৩');
      setBodyText('চিরদিন তোমার আকাশ, তোমার বাতাস, আমার প্রাণে বাজায় বাঁশি। ও মা, ফাগুনে তোর আমের বনে ঘ্রাণে পাগল করে।');
      setHeadlineSize(58);
      setHeadlineWeight('400');
      setLetterSpacing(2);
      setLineHeight(1.2);
      setTextAlign('center');
      setPosterTheme('paper');
    } else if (preset === 'swiss') {
      setHeadlineFont('Noto Sans Bengali');
      setHeadlineText('বিশুদ্ধ গঠন ও শৃঙ্খলা');
      setSubtitleText('SWISS GRID DISCIPLINE IN BENGALI SCRIPT');
      setBodyText('ন্যূনতম উপাদান দিয়ে সর্বোচ্চ অর্থ প্রকাশ করাই আধুনিক নকশার প্রধান অঙ্গীকার।');
      setHeadlineSize(62);
      setHeadlineWeight('700');
      setLetterSpacing(0);
      setLineHeight(1.1);
      setTextAlign('left');
      setPosterTheme('obsidian');
    } else if (preset === 'handwritten') {
      setHeadlineFont('BenSen Handwriting');
      setHeadlineText('চিঠির পাতায় ভালোবাসা');
      setSubtitleText('MEMORIES IN INK • PERSONAL LETTERS');
      setBodyText('কাগজের গন্ধের সাথে জড়িয়ে থাকে মানুষের চোখের জল আর হৃদয়ের না-বলা কথা।');
      setHeadlineSize(68);
      setHeadlineWeight('400');
      setLetterSpacing(1);
      setLineHeight(1.2);
      setTextAlign('left');
      setPosterTheme('ochre');
    }
  };

  // Export as PNG
  const exportPosterAsImage = () => {
    const poster = posterDomRef.current;
    if (!poster) return;

    // Use HTML5 canvas to draw high-res poster
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = aspectRatio === 'square' ? 1200 : aspectRatio === 'story' ? 2133 : 1600;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background color based on theme
    let bg = '#0b0c0f';
    let textColor = '#f5f4ef';
    let accentColor = '#ff4d00';

    if (posterTheme === 'paper') {
      bg = '#f7f5ed';
      textColor = '#121316';
      accentColor = '#ff4d00';
    } else if (posterTheme === 'vermilion') {
      bg = '#ff4d00';
      textColor = '#ffffff';
      accentColor = '#000000';
    } else if (posterTheme === 'night') {
      bg = '#0d1b2a';
      textColor = '#e0e1dd';
      accentColor = '#00e5ff';
    } else if (posterTheme === 'ochre') {
      bg = '#d4a373';
      textColor = '#1a1a1a';
      accentColor = '#ff4d00';
    }

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Grid border
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    // Top Tagline
    ctx.fillStyle = textColor;
    ctx.font = '22px "JetBrains Mono", monospace';
    ctx.fillText('AKSHAR TYPE ARCHIVE // SALON 2026', 100, 130);
    ctx.textAlign = 'right';
    ctx.fillText(subtitleText.slice(0, 40), width - 100, 130);
    ctx.textAlign = 'left';

    // Top horizontal divider
    ctx.beginPath();
    ctx.moveTo(100, 160);
    ctx.lineTo(width - 100, 160);
    ctx.stroke();

    // Large Headline
    ctx.font = `bold ${headlineSize * 2}px "${headlineFont}", sans-serif`;
    ctx.fillStyle = textColor;
    const words = displayHeadline.split(' ');
    let line = '';
    let startY = 320;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width - 200 && n > 0) {
        ctx.fillText(line, 100, startY);
        line = words[n] + ' ';
        startY += headlineSize * 2 * 1.1;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 100, startY);

    // Body text
    startY += 80;
    ctx.font = `34px "${bodyFont}", sans-serif`;
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.85;

    const bodyWords = displayBody.split(' ');
    let bLine = '';
    for (let b = 0; b < bodyWords.length; b++) {
      const bTest = bLine + bodyWords[b] + ' ';
      if (ctx.measureText(bTest).width > width - 220 && b > 0) {
        ctx.fillText(bLine, 100, startY);
        bLine = bodyWords[b] + ' ';
        startY += 55;
      } else {
        bLine = bTest;
      }
    }
    ctx.fillText(bLine, 100, startY);
    ctx.globalAlpha = 1.0;

    // Footer divider
    ctx.beginPath();
    ctx.moveTo(100, height - 160);
    ctx.lineTo(width - 100, height - 160);
    ctx.stroke();

    // Footer info
    ctx.font = '24px "JetBrains Mono", monospace';
    ctx.fillText(dateText, 100, height - 110);
    ctx.textAlign = 'right';
    ctx.fillText(`HEADLINE: ${headlineFont.toUpperCase()}`, width - 100, height - 110);

    // Download PNG
    const link = document.createElement('a');
    link.download = `akshar-poster-${headlineFont.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="playground-container">
      <div className="container">
        {/* Playground Intro */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="hero-pill" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>POSTER LAB & TYPOGRAPHIC SANDBOX</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            Typography Playground & Poster Studio
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', marginTop: '0.5rem' }}>
            Experiment with headline and body pairings, customize dimensions, test extreme typographic scale, and export high-resolution posters as PNG. You can even upload your own font files!
          </p>
        </div>

        {/* Quick Style Presets Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            CURATED PRESETS:
          </span>
          <button className="btn-secondary" onClick={() => applyPreset('brutalist')}>
            🔥 Red Brutalist
          </button>
          <button className="btn-secondary" onClick={() => applyPreset('poetry')}>
            📜 Classical Paper Poetry
          </button>
          <button className="btn-secondary" onClick={() => applyPreset('swiss')}>
            📐 Swiss Disciplined Grid
          </button>
          <button className="btn-secondary" onClick={() => applyPreset('handwritten')}>
            ✍️ Organic Handwritten
          </button>
        </div>

        <div className="playground-grid">
          {/* Controls Sidebar */}
          <div className="playground-controls-sidebar">
            <div className="sidebar-title">
              <Sliders size={18} color="var(--accent-vermilion)" />
              <span>Studio Controls</span>
            </div>

            {/* Upload Custom Font Button */}
            <div className="control-group">
              <span className="control-group-title">UPLOAD YOUR OWN FONT</span>
              <label
                className="btn-secondary"
                style={{ cursor: 'pointer', justifyContent: 'center', borderColor: customFontName ? 'var(--accent-vermilion)' : 'var(--border-hairline)' }}
              >
                <Upload size={16} />
                <span>{customFontName ? `Loaded: ${customFontName}` : 'Upload .ttf / .otf / .woff2'}</span>
                <input
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  style={{ display: 'none' }}
                  onChange={handleFontUpload}
                />
              </label>
              {customFontName && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-vermilion)' }}>
                  ✓ Custom font active in studio!
                </span>
              )}
            </div>

            {/* Headline Font Selector */}
            <div className="control-group">
              <span className="control-group-title">HEADLINE TYPEFACE</span>
              <select
                className="preview-input"
                value={headlineFont}
                onChange={(e) => setHeadlineFont(e.target.value)}
              >
                {customFontName && <option value={customFontName}>🌟 {customFontName} (Uploaded)</option>}
                <optgroup label="Showcase Families">
                  {FEATURED_FONTS.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name} ({f.category})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Extended Collection">
                  {(allFonts || []).slice(0, 80).map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Body Font Selector */}
            <div className="control-group">
              <span className="control-group-title">BODY PAIRING TYPEFACE</span>
              <select
                className="preview-input"
                value={bodyFont}
                onChange={(e) => setBodyFont(e.target.value)}
              >
                {FEATURED_FONTS.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name} ({f.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Text Contents */}
            <div className="control-group">
              <span className="control-group-title">HEADLINE TEXT</span>
              <input
                type="text"
                className="preview-input"
                value={headlineText}
                onChange={(e) => setHeadlineText(e.target.value)}
              />
            </div>

            <div className="control-group">
              <span className="control-group-title">SUBTITLE / TAGLINE</span>
              <input
                type="text"
                className="preview-input"
                value={subtitleText}
                onChange={(e) => setSubtitleText(e.target.value)}
              />
            </div>

            <div className="control-group">
              <span className="control-group-title">BODY PARAGRAPH</span>
              <textarea
                className="preview-input"
                style={{ height: '70px', padding: '0.65rem' }}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
              />
            </div>

            {/* Sliders: Headline Size, Weight, Spacing */}
            <div className="control-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>HEADLINE SIZE</span>
                <span>{headlineSize}px</span>
              </div>
              <input
                type="range"
                min="32"
                max="120"
                value={headlineSize}
                onChange={(e) => setHeadlineSize(parseInt(e.target.value))}
                className="size-slider"
                style={{ width: '100%' }}
              />
            </div>

            <div className="control-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>LETTER SPACING</span>
                <span>{letterSpacing}px</span>
              </div>
              <input
                type="range"
                min="-4"
                max="16"
                step="0.5"
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                className="size-slider"
                style={{ width: '100%' }}
              />
            </div>

            {/* Poster Theme Selector */}
            <div className="control-group">
              <span className="control-group-title">CANVAS THEME</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {[
                  { id: 'obsidian', bg: '#0b0c0f', title: 'Obsidian' },
                  { id: 'paper', bg: '#f7f5ed', title: 'Paper' },
                  { id: 'vermilion', bg: '#ff4d00', title: 'Vermilion' },
                  { id: 'night', bg: '#0d1b2a', title: 'Navy' },
                  { id: 'ochre', bg: '#d4a373', title: 'Ochre' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPosterTheme(t.id)}
                    style={{
                      height: '36px',
                      backgroundColor: t.bg,
                      borderRadius: 'var(--radius-xs)',
                      border: '2px solid',
                      borderColor: posterTheme === t.id ? 'var(--text-primary)' : 'transparent',
                      cursor: 'pointer'
                    }}
                    title={t.title}
                  />
                ))}
              </div>
            </div>

            {/* Export Button */}
            <button
              className="btn-primary"
              style={{ padding: '0.85rem', justifyContent: 'center', marginTop: '0.5rem' }}
              onClick={exportPosterAsImage}
            >
              <Download size={18} />
              <span>Export Poster as PNG</span>
            </button>
          </div>

          {/* Interactive Poster Canvas Area */}
          <div className="playground-canvas-wrap">
            <div
              ref={posterDomRef}
              className={`poster-canvas poster-theme-${posterTheme}`}
              style={{
                aspectRatio: aspectRatio === 'square' ? '1 / 1' : aspectRatio === 'story' ? '9 / 16' : '3 / 4'
              }}
            >
              {/* Top Tagline / Header border */}
              <div className="poster-header-tag">
                <span>AKSHAR TYPE FOUNDRY</span>
                <span>{subtitleText}</span>
              </div>

              {/* Main Headline */}
              <div
                className="poster-main-title"
                style={{
                  fontFamily: `'${headlineFont}', sans-serif`,
                  fontSize: `${headlineSize}px`,
                  fontWeight: headlineWeight,
                  letterSpacing: `${letterSpacing}px`,
                  lineHeight: lineHeight,
                  textAlign: textAlign
                }}
              >
                {displayHeadline}
              </div>

              {/* Body Text */}
              <div
                className="poster-body-text"
                style={{
                  fontFamily: `'${bodyFont}', sans-serif`,
                  textAlign: textAlign
                }}
              >
                {displayBody}
              </div>

              {/* Poster Footer Info */}
              <div className="poster-footer">
                <span>{dateText}</span>
                <span style={{ textTransform: 'uppercase' }}>
                  HEADLINE: {headlineFont} / BODY: {bodyFont}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
