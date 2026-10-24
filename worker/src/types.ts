export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  ALLOWED_ORIGINS: string;
  S3_ENDPOINT: string;
  S3_ACCESS_KEY_ID: string;
  S3_SECRET_ACCESS_KEY: string;
  S3_REGION: string;
  S3_BUCKET: string;
}

// Database row types
export interface FontRow {
  id: string;
  name: string;
  file_name: string;
  r2_key: string;
  category: string;
  size_kb: number;
  is_free: number; // SQLite boolean (0/1)
  price: number;
  encoding: string;
  is_ansi: number;
  designer: string | null;
  foundry: string | null;
  year: number | null;
  license: string | null;
  description: string | null;
  script: string | null;
  rating: number | null;
  downloads: number | null;
  glyph_count: number | null;
  contrast: string | null;
  width: string | null;
  x_height: string | null;
  tags: string | null; // JSON array string
  sample_headline: string | null;
  sample_paragraph: string | null;
  suggested_pairing: string | null;
  created_at: string;
  updated_at: string;
}

export interface FontStyleRow {
  id: number;
  font_id: string;
  name: string;
  weight: string;
  style: string;
  file_name: string;
  r2_key: string;
  size_kb: number;
}

// API response types
export interface FontResponse {
  id: string;
  name: string;
  fileName: string;
  file: string; // Preview URL via API
  category: string;
  sizeKb: number;
  isFree: boolean;
  price: number;
  encoding: string;
  isAnsi: boolean;
  designer?: string;
  foundry?: string;
  year?: number;
  license?: string;
  description?: string;
  script?: string;
  rating?: number;
  downloads?: number;
  glyphCount?: number;
  contrast?: string;
  width?: string;
  xHeight?: string;
  tags?: string[];
  sampleHeadline?: string;
  sampleParagraph?: string;
  suggestedPairing?: string;
  styles?: FontStyleResponse[];
}

export interface FontStyleResponse {
  name: string;
  weight: string;
  style: string;
  file: string; // Preview URL via API
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}
