// AKSHAR / অক্ষর — Bengali Typography Unicode & Bijoy (ANSI) Conversion Engine
// Allows legacy DTP fonts (Sutonny MJ, 3D Sonar Bangla, Anandapatra MJ, Chandrabati, etc.)
// to preview authentic Bengali glyphs in modern web browsers alongside Unicode fonts.

// Complete Unicode to Bijoy conjunct & character mapping dictionary
const UNICODE_TO_BIJOY_MAP = {
  // Triple & Quadruple Conjuncts
  'ক্ষ্ম': '¶¥',
  'ক্ষ্ণ': '¶è',
  'ক্ষ্য': '¶¨',
  'ঙ্ক্য': '¼¨',
  'ঙ্গ্য': '½¨',
  'চ্ছ্ব': '”Q',
  'জ্জ্ব': '¾¡',
  'ন্ত্ব': 'šÍ¡',
  'ন্ত্য': 'šÍ¨',
  'ত্ত্ব': 'Ë¡',
  'ন্দ্ব': '›Ø',
  'ন্দ্র': '›`ª',
  'ন্ধ্র': 'Üª',
  'ম্ভ্র': '¤£',
  'ম্প্র': '¤cÖ',
  'ন্ধ্য': 'Ü¨',
  'স্ট্র': '÷ª',
  'স্প্র': '¯úÖ',
  'স্ত্ব': '¯Í¡',

  // Double Conjuncts
  'ক্ক': '°',
  'ক্ট': '±',
  'ক্ত': '³',
  'ক্ষ': '¶',
  'ক্স': '·',
  'খ্য': 'L¨',
  'গ্ধ': '»',
  'গ্ন': 'Mœ',
  'গ্য': 'M¨',
  'গ্র': 'MÖ',
  'ঘ্ন': 'Nœ',
  'ঘ্য': 'N¨',
  'ঙ্ক': '¼',
  'ঙ্গ': '½',
  'জ্ঞ': 'Á',
  'চ্চ': '”P',
  'চ্ছ': '”Q',
  'চ্ছ্র': '”Qª',
  'চ্য': 'P¨',
  'জ্জ': '¾',
  'জ্ঝ': 'À',
  'জ্য': 'R¨',
  'ঞ্চ': 'Â',
  'ঞ্ছ': 'Ã',
  'ঞ্জ': 'Ä',
  'ট্য': 'U¨',
  'ট্র': 'Uª',
  'ট্ট': 'Æ',
  'ট্ব': 'U¡',
  'ঠ্য': 'V¨',
  'ড্ড': 'Ç',
  'ড্য': 'W¨',
  'ড্র': 'Wª',
  'ণ্ট': 'È',
  'ণ্ঠ': 'É',
  'ণ্ড': 'Ê',
  'ণ্য': 'Y¨',
  'ত্ত': 'Ë',
  'ত্থ': 'Ì',
  'ত্ন': 'Zœ',
  'ত্ম': 'Z¥',
  'ত্য': 'Z¨',
  'ত্র': 'Î',
  'ত্ব': 'Z¡',
  'থ্য': '_¨',
  'দ্দ': '”`',
  'দ্ম': 'Ù',
  'দ্ব': 'Ø',
  'দ্ধ': '×',
  'দ্ভ': '™¢',
  'দ্র': '`ª',
  'ধ্বন': 'aŸb',
  'ধ্ব': 'aŸ',
  'ধ্ন': 'aœ',
  'ধ্য': 'a¨',
  'ধ্র': 'aª',
  'ন্ত': 'šÍ',
  'ন্থ': 'š’',
  'ন্দ': '›`',
  'ন্ধ': 'Ü',
  'ন্ন': 'bœ',
  'ন্ম': 'b¥',
  'ন্য': 'b¨',
  'প্ত': 'ß',
  'প্ট': 'Þ',
  'প্ন': 'cœ',
  'প্য': 'c¨',
  'প্র': 'cÖ',
  'প্ল': 'cø',
  'প্স': 'á',
  'ব্জ': 'â',
  'ব্দ': 'ã',
  'ব্ধ': 'ä',
  'ব্ব': 'eŸ',
  'ব্য': 'e¨',
  'ব্র': 'eÖ',
  'ব্ল': 'eø',
  'ভ্য': 'f¨',
  'ভ্র': 'fÖ',
  'ম্ন': 'gœ',
  'ম্প': '¤c',
  'ম্ফ': '¤d',
  'ম্ব': '¤^',
  'ম্ভ': '¤¢',
  'ম্ম': '¤§',
  'ম্য': 'g¨',
  'ম্র': 'gÖ',
  'ম্ল': 'gø',
  'ল্ক': 'é',
  'ল্গ': 'ê',
  'ল্ট': 'ë',
  'ল্ড': 'ì',
  'ল্প': 'í',
  'ল্ফ': 'î',
  'ল্ব': 'ë',
  'ল্ম': 'ìm',
  'ল্ল': 'jø',
  'শ্চ': 'ð',
  'শ্ছ': 'ñ',
  'শ্ন': 'kœ',
  'শ্ম': 'k¥',
  'শ্য': 'k¨',
  'শ্র': 'kÖ',
  'শ্ল': 'kø',
  'ষ্ক': '®‹',
  'ষ্ট': 'ó',
  'ষ্ঠ': 'ô',
  'ষ্ণ': 'ò',
  'ষ্প': '®ú',
  'ষ্ফ': '®Ö',
  'ষ্ম': '®§',
  'ষ্য': 'l¨',
  'স্ক': '¯‹',
  'স্ট': '÷',
  'স্ত': '¯Í',
  'স্তু': '¯‘',
  'স্থ': '¯’',
  'স্ন': 'mœ',
  'স্প': '¯ú',
  'স্ফ': 'ù',
  'স্ব': '¯^',
  'স্ম': '¯§',
  'স্য': 'm¨',
  'স্র': 'mÖ',
  'স্ল': 'mø',
  'হ্ণ': 'ý',
  'হ্ন': 'ý',
  'হ্ম': 'ÿ',
  'হ্য': 'n¨',
  'হ্র': 'nÖ',
  'হ্ল': 'nø',
  'হ্ব': 'nŸ',
  'হৃ': 'ü',
  'র‍্য': 'i¨',

  // Vowels (Independent)
  'অ': 'A',
  'আ': 'Av',
  'ই': 'B',
  'ঈ': 'C',
  'উ': 'D',
  'ঊ': 'E',
  'ঋ': 'F',
  'এ': 'G',
  'ঐ': 'H',
  'ও': 'I',
  'ঔ': 'J',

  // Consonants
  'ক': 'K', // Fixed: SutonnyMJ/Bijoy uppercase K is ক, lowercase k is শ
  'খ': 'L',
  'গ': 'M',
  'ঘ': 'N',
  'ঙ': 'O',
  'চ': 'P',
  'ছ': 'Q',
  'জ': 'R',
  'ঝ': 'S',
  'ঞ': 'T',
  'ট': 'U',
  'ঠ': 'V',
  'ড': 'W',
  'ঢ': 'X',
  'ণ': 'Y',
  'ত': 'Z',
  'থ': '_',
  'দ': '`',
  'ধ': 'a',
  'ন': 'b',
  'প': 'c',
  'ফ': 'd',
  'ব': 'e',
  'ভ': 'f',
  'ম': 'g',
  'য': 'h',
  'র': 'i',
  'ল': 'j',
  'শ': 'k',
  'ষ': 'l',
  'স': 'm',
  'হ': 'n',
  'ড়': 'o',
  'ঢ়': 'p',
  'য়': 'q',
  'ৎ': 'r',

  // Modifiers & Punctuation
  'ং': 's',
  'ঃ': 't',
  'ঁ': 'u',
  '।': '|',

  // Numerals
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9'
};

// Known ANSI / Bijoy font patterns (used across 386 archive fonts & Bijoy licenses)
const ANSI_NAME_PATTERNS = [
  /\bMJ\b/i,
  /\bOMJ\b/i,
  /\bANSI\b/i,
  /\bSutonny\b/i,
  /\bBijoy\b/i,
  /\b3D Sonar Bangla\b/i,
  /\bAnandapatra\b/i,
  /\bAbirvab\b/i,
  /\bAdor Baksho\b/i,
  /\bDhakar Chithi\b/i,
  /\bAmader Shomoy\b/i,
  /\bChaturanga\b/i,
  /\bChandrabati\b/i,
  /\bBorak\b/i,
  /\bChitra\b/i,
  /\bDhanshirhi\b/i,
  /\bDholeshwari\b/i,
  /\bDhorola\b/i,
  /\bGoomti\b/i,
  /\bGorai\b/i,
  /\bHalda\b/i,
  /\bHoogly\b/i,
  /\bIchamoti\b/i,
  /\bJai Jai Din\b/i,
  /\bJomuna\b/i,
  /\bJugantor\b/i,
  /\bKalindi\b/i,
  /\bKarnaphuli\b/i,
  /\bKaveri\b/i,
  /\bKeertankhula\b/i,
  /\bKirtinasha\b/i,
  /\bKongsho\b/i,
  /\bKopotaksha\b/i,
  /\bKorotoa\b/i,
  /\bKumarkhali\b/i,
  /\bKushiara\b/i,
  /\bMeghna\b/i,
  /\bModhumati\b/i,
  /\bMogrha\b/i,
  /\bMohanonda\b/i,
  /\bMonoo\b/i,
  /\bNobogonga\b/i,
  /\bNorsunda\b/i,
  /\bPadma\b/i,
  /\bPandulipi\b/i,
  /\bParash\b/i,
  /\bPinkiy\b/i,
  /\bRatool\b/i,
  /\bRinkiy\b/i,
  /\bRuposhree\b/i,
  /\bRupsha\b/i,
  /\bSabrena Tonny\b/i,
  /\bSamakal\b/i,
  /\bShalda\b/i,
  /\bSugondha\b/i,
  /\bSunanda\b/i,
  /\bSushree\b/i,
  /\bTeesta\b/i,
  /\bTonny\b/i,
  /\bTurag\b/i,
  /\bUrmee\b/i
];

/**
 * Checks whether a font (or a specific selected style variant) is ANSI / Bijoy encoded.
 * Checks selectedStyle metadata first (e.g. Charukola Ansi vs Charukola Unicode cuts),
 * falling back to family-level encoding properties.
 */
export function isAnsiFont(font, selectedStyle) {
  if (!font) return false;

  // 1. Check selected style variant first if provided
  if (selectedStyle && typeof selectedStyle === 'object') {
    if (selectedStyle.encoding === 'ansi' || selectedStyle.isAnsi === true) return true;
    if (selectedStyle.encoding === 'unicode' || selectedStyle.isAnsi === false) return false;

    const styleName = selectedStyle.name || selectedStyle.fileName || '';
    const styleFile = selectedStyle.file || '';
    if (/ansi/i.test(styleName) || /ansi/i.test(styleFile)) return true;
    if (/unicode/i.test(styleName) || /unicode/i.test(styleFile)) return false;
  }

  // 2. Family-level encoding properties
  if (font.encoding === 'ansi' || font.isAnsi === true) return true;
  if (font.encoding === 'unicode') return false;

  const name = font.name || font.fileName || '';
  const file = font.file || font.styles?.[0]?.file || '';
  const license = font.license || '';

  if (/bijoy/i.test(license) || /ansi/i.test(name) || /ansi/i.test(file)) {
    return true;
  }

  return ANSI_NAME_PATTERNS.some(p => p.test(name) || p.test(file));
}

/**
 * Converts Bengali Unicode text to Bijoy (SutonnyMJ / ANSI) encoded text.
 * Accurately handles decomposed nukta forms, pre-kar repositioning (ি, ে, ৈ),
 * composite vowels (ো, ৌ), reph, ya-phola, ra-phola, chandrabindu, and conjuncts.
 */
export function unicodeToBijoy(text) {
  if (!text || typeof text !== 'string') return '';

  // Return as-is if string doesn't contain Bengali unicode characters
  if (!/[\u0980-\u09FF]/.test(text)) return text;

  let str = text;

  // 0. Normalize decomposed characters (Nukta combinations)
  str = str.replace(/য\u09BC/g, 'য়');
  str = str.replace(/ড\u09BC/g, 'ড়');
  str = str.replace(/ঢ\u09BC/g, 'ঢ়');

  // Reorder chandrabindu after kar to before kar for proper Bijoy rendering (e.g. বাঁ -> ব + ঁ + া)
  str = str.replace(/([াীুূেৈোৌ])ঁ/g, 'ঁ$1');

  // 1. Reph reordering: র + ্ + C -> C + Reph (©)
  str = str.replace(/র\u09CD([\u0995-\u09B9](?:\u09CD[\u0995-\u09B9])*)/g, '$1©');

  // 2. Pre-kars repositioning:
  // In Bengali Unicode, pre-kars (ি, ে, ৈ) follow consonant cluster.
  // In Bijoy, pre-kar is typed BEFORE the consonant cluster.
  const clusterRegex = /((?:[\u0995-\u09B9]\u09CD)*[\u0995-\u09B9]©?(?:[\u09CD]?[রযব])?)([িেৈ])/g;
  str = str.replace(clusterRegex, '$2$1');

  // 3. Multi-character vowel signs (ো, ৌ)
  // ো = ে + া -> †...v
  str = str.replace(/((?:[\u0995-\u09B9]\u09CD)*[\u0995-\u09B9]©?(?:[\u09CD]?[রযব])?)ো/g, '†$1v');
  // ৌ = ে + ৗ -> †...Š
  str = str.replace(/((?:[\u0995-\u09B9]\u09CD)*[\u0995-\u09B9]©?(?:[\u09CD]?[রযব])?)ৌ/g, '†$1Š');

  // 4. Translate pre-kars & other vowel kars
  str = str.replace(/ি/g, 'w');
  str = str.replace(/ে/g, '†');
  str = str.replace(/ৈ/g, '‰');
  str = str.replace(/া/g, 'v');
  str = str.replace(/ী/g, 'x');
  str = str.replace(/ু/g, 'y');
  str = str.replace(/ূ/g, 'z');
  str = str.replace(/ৃ/g, '„');

  // 5. Replace known multi-character conjuncts (longest first)
  const sortedKeys = Object.keys(UNICODE_TO_BIJOY_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (str.includes(key)) {
      str = str.split(key).join(UNICODE_TO_BIJOY_MAP[key]);
    }
  }

  // 6. Generic Ra-phola & Ya-phola fallbacks for any remaining unmapped clusters
  str = str.replace(/\u09CDর/g, 'ª');
  str = str.replace(/\u09CDয/g, '¨');

  // 7. Cleanup lone hasanta
  str = str.replace(/\u09CD/g, '&');

  return str;
}

/**
 * Returns the proper text to display for a font, converting to Bijoy if font is ANSI.
 */
export function getFontPreviewText(font, text, currentPangram) {
  if (!font) return text || '';
  const ansi = isAnsiFont(font);
  if (!ansi) return text || '';

  // If using a curated pangram with a verified pre-rendered Bijoy string, use it
  if (currentPangram && currentPangram.bijoyText && text === currentPangram.text) {
    return currentPangram.bijoyText;
  }

  // Fallback to real-time algorithmic conversion for custom input
  return unicodeToBijoy(text);
}
