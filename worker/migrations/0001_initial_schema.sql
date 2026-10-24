-- AKSHAR (অক্ষর) — Cloudflare D1 Versioned Migration 0001
-- Non-destructive baseline schema creation
-- Safe for execution on fresh or existing databases

CREATE TABLE IF NOT EXISTS fonts (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  file_name       TEXT NOT NULL,
  r2_key          TEXT NOT NULL,
  category        TEXT NOT NULL DEFAULT 'Bengali',
  size_kb         INTEGER NOT NULL DEFAULT 0,
  is_free         INTEGER NOT NULL DEFAULT 1,
  price           REAL NOT NULL DEFAULT 0,
  encoding        TEXT NOT NULL DEFAULT 'unicode',
  is_ansi         INTEGER NOT NULL DEFAULT 0,

  -- Extended metadata (populated for featured/curated fonts)
  designer        TEXT,
  foundry         TEXT,
  year            INTEGER,
  license         TEXT,
  description     TEXT,
  script          TEXT DEFAULT 'Bengali',
  rating          REAL,
  downloads       INTEGER DEFAULT 0,
  glyph_count     INTEGER,
  contrast        TEXT,
  width           TEXT,
  x_height        TEXT,
  tags            TEXT,               -- JSON array, e.g. '["Serif","Heritage"]'
  sample_headline TEXT,
  sample_paragraph TEXT,
  suggested_pairing TEXT,

  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS font_styles (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  font_id         TEXT NOT NULL REFERENCES fonts(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  weight          TEXT DEFAULT '400',
  style           TEXT DEFAULT 'normal',
  file_name       TEXT NOT NULL,
  r2_key          TEXT NOT NULL,
  size_kb         INTEGER DEFAULT 0
);

-- Performance indexes (idempotent creation)
CREATE INDEX IF NOT EXISTS idx_fonts_category ON fonts(category);
CREATE INDEX IF NOT EXISTS idx_fonts_encoding ON fonts(encoding);
CREATE INDEX IF NOT EXISTS idx_fonts_is_free ON fonts(is_free);
CREATE INDEX IF NOT EXISTS idx_fonts_name ON fonts(name);
CREATE INDEX IF NOT EXISTS idx_fonts_downloads ON fonts(downloads);
CREATE INDEX IF NOT EXISTS idx_font_styles_font_id ON font_styles(font_id);
