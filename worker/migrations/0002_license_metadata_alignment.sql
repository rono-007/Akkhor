-- AKSHAR (অক্ষর) — Cloudflare D1 Versioned Migration 0002
-- Non-destructive alignment of verified licensing metadata and alias synchronization
-- Ensures aliases and canonical assets share identical entitlement and price policies

-- 1. Verified Public Open Source Fonts (SIL Open Font License)
UPDATE fonts 
SET is_free = 1, price = 0, license = 'SIL Open Font License'
WHERE id IN ('noto-sans-bengali', 'font-479') 
   OR file_name = 'NotoSansBengali-VariableFont_wdth,wght.ttf';

UPDATE fonts 
SET is_free = 1, price = 0, license = 'SIL Open Font License'
WHERE id IN ('hind-siliguri', 'font-298') 
   OR file_name = 'Hind Siliguri.ttf';

-- 2. Commercial / Proprietary Fonts (Ananda Computers & Custom Foundry Releases)
UPDATE fonts 
SET is_free = 0, price = 40, license = 'Commercial Bijoy License'
WHERE id IN ('sutonny-mj', 'font-660') 
   OR file_name = 'Sutonny MJ.ttf';

UPDATE fonts 
SET is_free = 0, price = 32, license = 'Commercial License'
WHERE id IN ('chandrabati', 'font-123') 
   OR file_name = 'Chandrabati MJ.ttf';

UPDATE fonts 
SET is_free = 0, price = 27, license = 'Commercial License'
WHERE id IN ('chaturanga', 'font-180') 
   OR file_name = 'Chaturanga MJ.ttf';

UPDATE fonts 
SET is_free = 0, price = 26, license = 'Commercial License'
WHERE id IN ('sonarp-3d', 'font-0') 
   OR file_name = '3D Sonar Bangla.ttf';

UPDATE fonts 
SET is_free = 0, price = 30, license = 'Commercial License'
WHERE id IN ('boshonto', 'font-111') 
   OR file_name = 'Boshonto Light.ttf';

UPDATE fonts 
SET is_free = 0, price = 34, license = 'Commercial License'
WHERE id IN ('niladri-nobanno', 'font-459') 
   OR file_name = 'Niladri Nobanno.ttf';

UPDATE fonts 
SET is_free = 0, price = 35, license = 'Commercial License'
WHERE id IN ('abirvab', 'font-6') 
   OR file_name = 'Abirvab.ttf';

UPDATE fonts 
SET is_free = 0, price = 20, license = 'Commercial License'
WHERE id IN ('ador-noakhali', 'font-18') 
   OR file_name = 'Ador Noakhali.ttf';
