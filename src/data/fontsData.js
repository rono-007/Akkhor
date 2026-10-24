// AKSHAR / অক্ষর — Curated Typography Foundry & Font Database
import extendedFontsRaw from './extendedIndex.json';
import { fetchAllFonts } from '../api/client';

export const PANGRAMS = [
  {
    id: 'bn-sonarbangla',
    label: 'আমার সোনার বাংলা',
    lang: 'bn',
    text: 'আমার সোনার বাংলা, আমি তোমায় ভালোবাসি। চিরদিন তোমার আকাশ, তোমার বাতাস, আমার প্রাণে বাজায় বাঁশি।',
    bijoyText: 'Avgvi †mvbvi evsjv, Avwg †Zvgvq fv‡jvevwm| wPiw`b †Zvgvi AvKvk, †Zvgvi evZvm, Avgvi cÖv‡Y evRvq euvwk|'
  },
  {
    id: 'bn-aesthetic',
    label: 'শব্দশিল্পের নান্দনিকতা',
    lang: 'bn',
    text: 'শব্দশিল্প ও নান্দনিক বর্ণমালার মেলবন্ধনে রচিত হয় এক কালজয়ী দৃশ্যকাব্য।',
    bijoyText: 'kãwkí I bv›`wbK eY©gvjvi †gjeÜ†b iwPZ nq GK KvjRqx `„k¨Kve¨|'
  },
  {
    id: 'bn-mukti',
    label: 'মুক্তির গান',
    lang: 'bn',
    text: 'মুক্তির মন্দির সোপানতলে কত প্রাণ হলো বলিদান, লেখা আছে অশ্রুজলে।',
    bijoyText: 'gyw³i gw›`i †mvcvbZ‡j KZ cÖvY n‡jv ewj`vb, †jLv Av‡Q AkÖyR‡j|'
  },
  {
    id: 'bn-short',
    label: 'নান্দনিক অক্ষরমালা',
    lang: 'bn',
    text: 'নান্দনিক অক্ষরমালা সাহিত্যের চিরন্তন ঐতিহ্য বহন করে।',
    bijoyText: 'bv›`wbK A¶igvjv mvwn‡Z¨i wPišÍb HwZn¨ enb †Ki|'
  },
  {
    id: 'en-quickbrown',
    label: 'The Quick Brown Fox',
    lang: 'en',
    text: 'The quick brown fox jumps over the lazy dog.',
    bijoyText: 'The quick brown fox jumps over the lazy dog.'
  },
  {
    id: 'en-sphinx',
    label: 'Sphinx of Black Quartz',
    lang: 'en',
    text: 'Sphinx of black quartz, judge my vow.',
    bijoyText: 'Sphinx of black quartz, judge my vow.'
  },
  {
    id: 'en-craft',
    label: 'Architecture of Letters',
    lang: 'en',
    text: 'Typography is two-dimensional architecture, sculpted in ink and light.',
    bijoyText: 'Typography is two-dimensional architecture, sculpted in ink and light.'
  },
  {
    id: 'num-bengali',
    label: 'সংখ্যা ও চিহ্ন',
    lang: 'bn',
    text: '০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ • ক খ গ ঘ ঙ • A B C D E 1 2 3 4 5',
    bijoyText: '0 1 2 3 4 5 6 7 8 9 • K L M N O • A B C D E 1 2 3 4 5'
  }
];

export const GLYPH_SETS = {
  vowels: {
    title: 'স্বরবর্ণ (Vowels)',
    chars: ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ']
  },
  consonants: {
    title: 'ব্যঞ্জনবর্ণ (Consonants)',
    chars: [
      'ক', 'খ', 'গ', 'ঘ', 'ঙ',
      'চ', 'ছ', 'জ', 'ঝ', 'ঞ',
      'ট', 'ঠ', 'ড', 'ঢ', 'ণ',
      'ত', 'থ', 'দ', 'ধ', 'ন',
      'প', 'ফ', 'ব', 'ভ', 'ম',
      'য', 'র', 'ল', 'শ', 'ষ',
      'স', 'হ', 'ড়', 'ঢ়', 'য়',
      'ৎ', 'ং', 'ঃ', 'ঁ'
    ]
  },
  conjuncts: {
    title: 'যুক্তাক্ষর (Conjuncts & Ligatures)',
    chars: [
      'ক্ষ', 'জ্ঞ', 'ঙ্গ', 'ঙ্ক', 'ঞ্চ', 'ঞ্ছ', 'ঞ্জ',
      'ণ্ঠ', 'ণ্ড', 'ত্থ', 'ত্র', 'দ্ব', 'দ্ধ', 'ধ্ব',
      'ন্ত', 'ন্দ', 'ম্প', 'ম্ব', 'ল্ক', 'ষ্ট', 'ষ্ঠ',
      'স্ন', 'স্প', 'স্র', 'হ্ন', 'হ্ম', 'ব্দ', 'প্ত'
    ]
  },
  banglaNumerals: {
    title: 'বাংলা সংখ্যা (Bengali Numerals)',
    chars: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  },
  latinUpper: {
    title: 'Latin Uppercase (A–Z)',
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  },
  latinLower: {
    title: 'Latin Lowercase (a–z)',
    chars: 'abcdefghijklmnopqrstuvwxyz'.split('')
  },
  latinNumerals: {
    title: 'Latin Numerals (0–9)',
    chars: '0123456789'.split('')
  },
  symbols: {
    title: 'বিরামচিহ্ন ও প্রতীক (Punctuation & Symbols)',
    chars: ['।', '!', '?', ',', '.', ';', ':', '‘', '’', '“', '”', '(', ')', '[', ']', '{', '}', '/', '&', '@', '#', '%', '+', '-', '—']
  }
};

export const LICENSE_TIERS = [
  {
    id: 'personal',
    name: 'Personal / Editorial',
    multiplier: 1.0,
    desc: 'For non-commercial, personal, portfolio and student design projects.',
    features: ['1 User / Device', 'Unlimited Personal Projects', 'OTF & TTF formats', 'Non-commercial only']
  },
  {
    id: 'commercial',
    name: 'Commercial Studio',
    multiplier: 1.8,
    desc: 'For client projects, startups, digital products, and commercial branding.',
    features: ['Up to 5 Users / Workstations', 'Commercial client work', 'Webfont embedding (50k views/mo)', 'Broadcast & Social Media ads', 'Lifetime commercial rights']
  },
  {
    id: 'enterprise',
    name: 'Enterprise / Unlimited',
    multiplier: 4.5,
    desc: 'Full corporate license for global brands, mobile apps, and broadcast.',
    features: ['Unlimited seats', 'Unlimited App & Web embedding', 'Global advertising campaigns', 'Custom modification rights', 'Dedicated priority support']
  }
];

export const FEATURED_FONTS = [
  {
    id: 'noto-sans-bengali',
    name: 'Noto Sans Bengali',
    banglaName: 'নোটো সান্স বেঙ্গলি',
    category: 'Sans Serif',
    script: 'Bengali / Latin',
    designer: 'Google Fonts & Monotype',
    foundry: 'Google Fonts',
    year: 2018,
    price: 0,
    isFree: true,
    license: 'SIL Open Font License',
    description: 'An exceptionally versatile, unmodulated sans-serif typeface designed for high legibility across digital screens and complex Bengali conjuncts. Features pixel-perfect glyph shaping and broad unicode coverage.',
    tags: ['Variable', 'Editorial', 'Web & UI', 'Modern', 'Open Source'],
    rating: 4.9,
    downloads: 142000,
    glyphCount: 780,
    contrast: 'Low Contrast',
    width: 'Normal',
    xHeight: 'Tall',
    suggestedPairing: 'noto-serif-bengali',
    sampleHeadline: 'ভাষার রূপান্তর ও শব্দশিল্পের আধুনিক প্রকাশ',
    sampleParagraph: 'বাংলা বর্ণমালার সুপ্রাচীন ইতিহাস রয়েছে। লিপির ধারাবাহিক বিবর্তনের মধ্য দিয়ে আজ ডিজিটাল মাধ্যমে তা নতুন এক মাত্রা লাভ করেছে। নোটো সান্স জটিল যুক্তবর্ণসমূহকে অত্যন্ত সুস্পষ্টভাবে ফুটিয়ে তোলে।',
    styles: [
      { name: 'Variable (Light to Black)', weight: '400', style: 'normal', file: '/fonts/Noto_Sans_Bengali/NotoSansBengali-VariableFont_wdth,wght.ttf' }
    ]
  },
  {
    id: 'noto-serif-bengali',
    name: 'Noto Serif Bengali',
    banglaName: 'নোটো সেরিফ বেঙ্গলি',
    category: 'Serif',
    script: 'Bengali / Latin',
    designer: 'Google Fonts & Monotype',
    foundry: 'Google Fonts',
    year: 2018,
    price: 0,
    isFree: true,
    license: 'SIL Open Font License',
    description: 'A distinguished serif typeface with traditional modulated strokes, refined terminals, and magnificent editorial dignity. Engineered for print publications, literature, and sophisticated web editorial.',
    tags: ['Variable', 'Book & Print', 'Editorial', 'Classic', 'Open Source'],
    rating: 4.9,
    downloads: 98000,
    glyphCount: 765,
    contrast: 'High Modulated',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'noto-sans-bengali',
    sampleHeadline: 'নান্দনিক বর্ণমালা সাহিত্যের চিরন্তন ঐতিহ্য বহন করে',
    sampleParagraph: 'কালজয়ী সাহিত্য রচনায় সেরিফ ফন্টের গুরুত্ব অপরিসীম। সুবিন্যস্ত মাত্রা এবং অক্ষরের ভারসাম্য চোখের ক্লান্তি দূর করে এবং পাঠযোগ্যতা বাড়িয়ে তোলে।',
    styles: [
      { name: 'Variable (Regular to Bold)', weight: '400', style: 'normal', file: '/fonts/Noto_Serif_Bengali/NotoSerifBengali-VariableFont_wdth,wght.ttf' }
    ]
  },
  {
    id: 'kalpurush',
    name: 'Kalpurush',
    banglaName: 'কালপুরুষ',
    category: 'Serif',
    script: 'Bengali',
    designer: 'Syed Tanveer Ahammad',
    foundry: 'Ekushey Typographics',
    year: 2004,
    price: 24,
    isFree: false,
    license: 'Commercial & Studio License',
    description: 'The golden benchmark of modern Bengali typography. Famous for its balanced counterspaces, natural baseline alignment, and effortless readability across newspapers and literary journals.',
    tags: ['Bestseller', 'Heritage', 'Editorial', 'Newspaper'],
    rating: 5.0,
    downloads: 230000,
    glyphCount: 650,
    contrast: 'Medium Serif',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'solaiman-lipi',
    sampleHeadline: 'আমার সোনার বাংলা, আমি তোমায় ভালোবাসি',
    sampleParagraph: 'কালপুরুষ ফন্টটি বাংলা কম্পিউটিংয়ের জগতে এক যুগান্তকারী সংযোজন। দীর্ঘ দুই দশক ধরে সরকারি দলিল, মুদ্রিত বই এবং ডিজিটাল ওয়েবসাইটে সর্বাধিক ব্যবহৃত হয়ে আসছে।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/kalpurush.ttf' },
      { name: 'ANSI Version', weight: '400', style: 'normal', file: '/fonts/Kalpurush ANSI.ttf' }
    ]
  },
  {
    id: 'solaiman-lipi',
    name: 'SolaimanLipi',
    banglaName: 'সোলায়মান লিপি',
    category: 'Sans Serif',
    script: 'Bengali',
    designer: 'Solaiman Karim',
    foundry: 'Solaiman Type Foundry',
    year: 2006,
    price: 32,
    isFree: false,
    license: 'Commercial License',
    description: 'A timeless staple of digital Bangla typography. Known for ultra-clean rendering on digital screens, friendly geometric curves, and sharp legibility even at micro sizes.',
    tags: ['Bestseller', 'Clean', 'Modern', 'Publishing'],
    rating: 4.8,
    downloads: 185000,
    glyphCount: 620,
    contrast: 'Low Contrast',
    width: 'Normal',
    xHeight: 'Tall',
    suggestedPairing: 'kalpurush',
    sampleHeadline: 'মুক্তির গান ও বিজয়ের চিরভাস্বর সুর',
    sampleParagraph: 'সোলায়মান লিপি বাংলা ওয়েব ডিজাইনের ক্ষেত্রে নতুন দিগন্ত উন্মোচন করেছে। এর মসৃণ প্রান্ত এবং আধুনিক ডিজাইন প্রতিটি প্যারাগ্রাফকে দেয় স্নিগ্ধ ও পরিচ্ছন্ন রূপ।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/Solaiman Lipi.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/Solaiman Lipi Bold.ttf' }
    ]
  },
  {
    id: 'siyam-rupali',
    name: 'Siyam Rupali',
    banglaName: 'সিয়াম রূপালী',
    category: 'Display',
    script: 'Bengali',
    designer: 'Tanbin Islam Siyam',
    foundry: 'Siyam Design Studio',
    year: 2007,
    price: 29,
    isFree: false,
    license: 'Commercial Studio License',
    description: 'Elegant and graceful display typeface characterized by curved terminals, harmonious proportions, and expressive titles. Perfect for magazines and artistic book covers.',
    tags: ['Trending', 'Editorial', 'Headlines', 'Graceful'],
    rating: 4.7,
    downloads: 110000,
    glyphCount: 590,
    contrast: 'High Contrast',
    width: 'Expanded',
    xHeight: 'Medium',
    suggestedPairing: 'noto-sans-bengali',
    sampleHeadline: 'বসন্ত বাতাসে ভেসে আসে কোকিলের কুহুতান',
    sampleParagraph: 'সৌন্দর্য ও নান্দনিকতার এক অপূর্ব মিশ্রণ সিয়াম রূপালী। কবি ও সাহিত্যিকদের কাছে বিশেষ সমাদৃত এই টাইপফেসটি শিরোনামে নিয়ে আসে এক জাদুকরী আবেদন।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/Siyam Rupali.ttf' },
      { name: 'ANSI', weight: '400', style: 'normal', file: '/fonts/Siyam Rupali ANSI.ttf' }
    ]
  },
  {
    id: 'akhand-bengali',
    name: 'Akhand Bengali',
    banglaName: 'অখণ্ড বেঙ্গলি',
    category: 'Sans Serif',
    script: 'Bengali / Latin',
    designer: 'Indian Type Foundry',
    foundry: 'ITF',
    year: 2016,
    price: 49,
    isFree: false,
    license: 'Commercial License',
    description: 'A compact, geometric headline powerhouse with maximum visual punch. Packed across five distinct weights from Light to Black, making it an indispensable weapon for brutalist and commercial posters.',
    tags: ['Heavy', 'Brutalist', 'Poster', 'Multi-weight'],
    rating: 4.9,
    downloads: 87000,
    glyphCount: 810,
    contrast: 'Monolinear',
    width: 'Condensed',
    xHeight: 'Very Tall',
    suggestedPairing: 'boshonto',
    sampleHeadline: 'অখণ্ড শক্তির নির্ভীক পদচিহ্ন দিকে দিকে',
    sampleParagraph: 'বিজ্ঞাপন ও পোস্টারের জগতে অক্ষরের তীব্র উপস্থিতি অত্যন্ত জরুরি। অখণ্ড বেঙ্গলি তার ঘন সন্নিবেশ ও সুদৃঢ় জ্যামিতিক কাঠামোর মাধ্যমে যেকোনো বার্তাকে করে তোলে অকাট্য।',
    styles: [
      { name: 'Light', weight: '300', style: 'normal', file: '/fonts/akhand_bengali/Akhand Bengali Light.ttf' },
      { name: 'Extra Light', weight: '200', style: 'normal', file: '/fonts/akhand_bengali/Akhand Bengali Extra Light.ttf' },
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/akhand_bengali/Akhand Bengali.ttf' },
      { name: 'Extra Bold', weight: '800', style: 'normal', file: '/fonts/akhand_bengali/Akhand Bengali Extra Bold.ttf' },
      { name: 'Black', weight: '900', style: 'normal', file: '/fonts/akhand_bengali/Akhand Bengali Black.ttf' }
    ]
  },
  {
    id: 'charukola',
    name: 'Charukola',
    banglaName: 'চারুকলা',
    category: 'Display',
    script: 'Bengali',
    designer: 'Dhaka Fine Arts Guild',
    foundry: 'Charukola Typeworks',
    year: 2012,
    price: 38,
    isFree: false,
    license: 'Commercial License',
    description: 'Inspired by the vibrant cultural heritage of the Fine Arts Institute of Dhaka University. Features striking contrast, bold loops, and folk-poster flair that commands immediate affection.',
    tags: ['Artistic', 'Poster', 'Culture', 'Featured'],
    rating: 4.8,
    downloads: 76000,
    glyphCount: 540,
    contrast: 'Dramatic Contrast',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'solaiman-lipi',
    sampleHeadline: 'চারুকলার আঙিনায় রঙের মহোৎসব ও শিল্পগাথা',
    sampleParagraph: 'বাংলার লোকশিল্প ও আধুনিক দৃশ্যকলার মেলবন্ধনে চারুকলা ফন্টটির আত্মপ্রকাশ। এর বৈচিত্র্যময় অক্ষরশৈলী যেকোনো উৎসবমুখর আয়োজনকে করে তোলে আনন্দময়।',
    styles: [
      { name: 'Ultra Light', weight: '200', style: 'normal', file: '/fonts/charukola/Charukola Unicode-Ultra Light.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/charukola/Charukola Unicode-Bold.ttf' }
    ]
  },
  {
    id: 'charu-chandan',
    name: 'Charu Chandan 3D',
    banglaName: 'চারু চন্দন থ্রি-ডি',
    category: 'Display',
    script: 'Bengali',
    designer: 'Chandan Kumar',
    foundry: 'Chandan Arts Foundry',
    year: 2014,
    price: 45,
    isFree: false,
    license: 'Commercial License',
    description: 'An ornate artistic typeface with 3D extrusions, intricate shadow cuts, and ceremonial decorative grandeur. Designed for title cards, festive invitations, and cinematic typography.',
    tags: ['3D', 'Decorative', 'Festive', 'Unique'],
    rating: 4.7,
    downloads: 62000,
    glyphCount: 480,
    contrast: '3D Extrusion',
    width: 'Wide',
    xHeight: 'Tall',
    suggestedPairing: 'noto-sans-bengali',
    sampleHeadline: 'চন্দনের সুবাসে ভরে ওঠে প্রভাতী সকাল',
    sampleParagraph: 'ত্রিমাত্রিক শৈলী বাংলা লিপিতে এক অনন্য মাত্রা যোগ করে। চারু চন্দন ফন্টে ছায়া ও আলোর খেলা অক্ষরের প্রতিটি ভাঁজে স্পষ্ট হয়ে ওঠে।',
    styles: [
      { name: 'Unicode Regular', weight: '400', style: 'normal', file: '/fonts/charu_chandan/Charu Chandan 3D Unicode-Regular.ttf' },
      { name: 'Hard Regular', weight: '600', style: 'normal', file: '/fonts/charu_chandan/CharuChandan HardStroke Unicode-Regular.ttf' }
    ]
  },
  {
    id: 'bensen-handwriting',
    name: 'BenSen Handwriting',
    banglaName: 'বেনসেন হ্যান্ডরাইটিং',
    category: 'Script',
    script: 'Bengali',
    designer: 'BenSen Typography',
    foundry: 'BenSen Studio',
    year: 2010,
    price: 19,
    isFree: false,
    license: 'Commercial License',
    description: 'Authentic organic handwriting font that recreates natural ink pen strokes on paper with casual poise, lively character connections, and handwritten emotion.',
    tags: ['Handwriting', 'Script', 'Casual', 'Organic'],
    rating: 4.8,
    downloads: 94000,
    glyphCount: 520,
    contrast: 'Natural Monoline',
    width: 'Variable',
    xHeight: 'Casual',
    suggestedPairing: 'kalpurush',
    sampleHeadline: 'চিঠির পাতায় জমে থাকা ভালোবাসার কথামালা',
    sampleParagraph: 'ডিজিটাল যুগে মানুষের হাতের লেখার স্পর্শ যেন ক্রমশ হারিয়ে যাচ্ছে। বেনসেন হ্যান্ডরাইটিং সেই আন্তরিক অনুভূতিকে পুনরায় ফিরিয়ে আনে প্রতিটি শব্দে।',
    styles: [
      { name: 'Handwriting', weight: '400', style: 'normal', file: '/fonts/Bensen Handwriting.ttf' },
      { name: 'Standard', weight: '400', style: 'normal', file: '/fonts/Bensen.ttf' }
    ]
  },
  {
    id: 'abirvab',
    name: 'Abirvab',
    banglaName: 'আবির্ভাব',
    category: 'Serif',
    script: 'Bengali',
    designer: 'Abirvab Type Collective',
    foundry: 'Bangla Lipi Sanshad',
    year: 2015,
    price: 35,
    isFree: false,
    license: 'Commercial License',
    description: 'A contemporary serif family of multiple distinct weights: Regular, Italic, Light, and Bold. Built with classical proportions suited for long-form literary fiction and editorial treatises.',
    tags: ['Multi-weight', 'Editorial', 'Newspaper', 'Refined'],
    rating: 4.6,
    downloads: 48000,
    glyphCount: 590,
    contrast: 'Modulated Serif',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'ador-noakhali',
    sampleHeadline: 'নতুন প্রভাতে সত্যের আবির্ভাব ও বিজয়ানন্দ',
    sampleParagraph: 'আবির্ভাব ফন্টের মসৃণ সেরিফ সংযোগ এবং সুস্পষ্ট মাত্রা পাঠকদের এক গভীর ও নিরবচ্ছিন্ন পাঠানুভূতির সুযোগ দেয়।',
    styles: [
      { name: 'Light', weight: '300', style: 'normal', file: '/fonts/abirvab/Abirvab Light.ttf' },
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/abirvab/Abirvab.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/abirvab/Abirvab Bold.ttf' },
      { name: 'Italic', weight: '400', style: 'italic', file: '/fonts/abirvab/Abirvab Italic.ttf' }
    ]
  },
  {
    id: 'ador-baksho',
    name: 'Ador Baksho',
    banglaName: 'আদর বাক্স',
    category: 'Display',
    script: 'Bengali',
    designer: 'Ador Studio',
    foundry: 'Ador Works',
    year: 2018,
    price: 25,
    isFree: false,
    license: 'Commercial License',
    description: 'Charming display family with experimental outline variations, rounded strokes, and cozy warmth. Ideal for kids books, animated graphics, and playful branding.',
    tags: ['Outline', 'Playful', 'Children Book', 'Display'],
    rating: 4.7,
    downloads: 41000,
    glyphCount: 470,
    contrast: 'Rounded Outline',
    width: 'Normal',
    xHeight: 'Tall',
    suggestedPairing: 'noto-sans-bengali',
    sampleHeadline: 'ছোট্ট পাখির মিষ্টি গান শোনো মন দিয়ে',
    sampleParagraph: 'আদর বাক্স ফন্টটি শিশুদের মনের আনন্দের মতোই নিষ্পাপ ও চঞ্চল। এর কোমল রেখা ও সুস্পষ্ট গঠন মন জুড়িয়ে দেয়।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/ador_baksho/Ador Baksho Bangla.ttf' },
      { name: 'Outline', weight: '400', style: 'normal', file: '/fonts/ador_baksho/Ador Baksho Bangla Outline.ttf' }
    ]
  },
  {
    id: 'ador-noakhali',
    name: 'Ador Noakhali',
    banglaName: 'আদর নোয়াখালী',
    category: 'Sans Serif',
    script: 'Bengali',
    designer: 'Ador Type Collective',
    foundry: 'Ador Works',
    year: 2019,
    price: 20,
    isFree: false,
    license: 'Commercial License',
    description: 'Contemporary sans serif with crisp low-contrast geometry, tight metrics, and spirited coastal character.',
    tags: ['Clean', 'Modern', 'Branding', 'Bold'],
    rating: 4.6,
    downloads: 36000,
    glyphCount: 490,
    contrast: 'Low Contrast',
    width: 'Normal',
    xHeight: 'Tall',
    suggestedPairing: 'kalpurush',
    sampleHeadline: 'মেঘনা নদীর তীরে সবুজের সমারোহ',
    sampleParagraph: 'আদর নোয়াখালী ফন্টের সতেজ ছন্দ এবং আধুনিক গঠন শহরের বিলবোর্ড থেকে শুরু করে মোবাইল অ্যাপ পর্যন্ত সবখানেই মানানসই।',
    styles: [
      { name: 'Light', weight: '300', style: 'normal', file: '/fonts/ador_noakhali/Ador Noakhali Light.ttf' },
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/ador_noakhali/Ador Noakhali.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/ador_noakhali/Ador Noakhali Bold.ttf' }
    ]
  },
  {
    id: 'dhakar-chithi',
    name: 'Dhakar Chithi',
    banglaName: 'ঢাকার চিঠি',
    category: 'Script',
    script: 'Bengali',
    designer: 'Purana Paltan Press',
    foundry: 'Dhaka Heritage Fonts',
    year: 2011,
    price: 28,
    isFree: false,
    license: 'Commercial License',
    description: 'Nostalgic epistolary script inspired by vintage handwritten postcards and love letters written across Old Dhaka streets.',
    tags: ['Vintage', 'Lettering', 'Calligraphy', 'Heritage'],
    rating: 4.8,
    downloads: 51000,
    glyphCount: 480,
    contrast: 'Calligraphic',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'solaiman-lipi',
    sampleHeadline: 'স্মৃতির বারান্দায় পুরোনো ঢাকার সান্ধ্য আড্ডা',
    sampleParagraph: 'হলুদ হয়ে যাওয়া চিঠির কাগজের বুকে কালির গন্ধ এখনো সজীব। ঢাকার চিঠি ফন্টটি আমাদের ফিরিয়ে নিয়ে যায় চিঠিপত্রের সেই স্নিগ্ধ সোনালী সময়ে।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/dhakar_chithi/Dhakar Chithi MJ.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/dhakar_chithi/Dhakar Chithi MJ Bold.ttf' }
    ]
  },
  {
    id: 'boshonto',
    name: 'Boshonto',
    banglaName: 'বসন্ত',
    category: 'Serif',
    script: 'Bengali',
    designer: 'Rituraj Typeworks',
    foundry: 'Bengal Press',
    year: 2013,
    price: 30,
    isFree: false,
    license: 'Commercial License',
    description: 'Celebrates the romanticism of the spring season with flowing serif matras and delicate character arches.',
    tags: ['Seasonal', 'Poetry', 'Romantic', 'Serif'],
    rating: 4.7,
    downloads: 55000,
    glyphCount: 560,
    contrast: 'Medium Serif',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'akhand-bengali',
    sampleHeadline: 'পলাশ শিমুলের ডালে রাঙা বসন্তের সুর',
    sampleParagraph: 'বসন্তের বাতাসে দোলা লাগা পল্লবের মতোই চঞ্চল এই ফন্টের প্রতিটি রেখা। কবিতাগুচ্ছ ও সাহিত্য পত্রিকার জন্য এটি এক অনন্য উপাদান।',
    styles: [
      { name: 'Light', weight: '300', style: 'normal', file: '/fonts/Boshonto Light.ttf' },
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/Boshonto.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/Boshonto Bold.ttf' }
    ]
  },
  {
    id: 'hind-siliguri',
    name: 'Hind Siliguri',
    banglaName: 'হিন্দ শিলিগুড়ি',
    category: 'Sans Serif',
    script: 'Bengali / Latin',
    designer: 'Indian Type Foundry',
    foundry: 'Google Fonts & ITF',
    year: 2015,
    price: 0,
    isFree: true,
    license: 'SIL Open Font License',
    description: 'An open-source humanist sans-serif family designed specifically for UI and signage with high clarity and breathability.',
    tags: ['Free', 'Open Source', 'UI & Apps', 'Clean'],
    rating: 4.8,
    downloads: 125000,
    glyphCount: 710,
    contrast: 'Monolinear',
    width: 'Normal',
    xHeight: 'Tall',
    suggestedPairing: 'noto-serif-bengali',
    sampleHeadline: 'সহজ সরল প্রকাশে গভীর চিন্তার দ্যুতি',
    sampleParagraph: 'ডিজিটাল ডিসপ্লেতে দীর্ঘ সময় পড়ার জন্য হিন্দ শিলিগুড়ি এক অনন্য সমাধান। এর মুক্ত পরিসর চোখের ওপর বাড়তি চাপ পড়তে দেয় না।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/Hind Siliguri.ttf' },
      { name: 'Medium', weight: '500', style: 'normal', file: '/fonts/Hind Siliguri Medium.ttf' }
    ]
  },
  {
    id: 'atma',
    name: 'Atma',
    banglaName: 'আত্মা',
    category: 'Script',
    script: 'Bengali / Latin',
    designer: 'Greg Lindy',
    foundry: 'LuxTypo',
    year: 2016,
    price: 0,
    isFree: true,
    license: 'SIL Open Font License',
    description: 'Playful strokes mimicking lively brush marker calligraphy with quirky angles, warm charm, and expressive soul.',
    tags: ['Free', 'Brush', 'Casual', 'Open Source'],
    rating: 4.6,
    downloads: 68000,
    glyphCount: 680,
    contrast: 'Brush Modulated',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'solaiman-lipi',
    sampleHeadline: 'মুক্ত পাখির গান ডানা মেলে আকাশ পানে',
    sampleParagraph: 'আত্মা ফন্টটি রঙতুলির সাবলীল আচড়ে তৈরি। কমিক স্ট্রিপ, শিশুতোষ গল্প এবং ব্যানার ডিজাইনে এটি আনে এক জীবন্ত উচ্ছলতা।',
    styles: [
      { name: 'Light', weight: '300', style: 'normal', file: '/fonts/Atma Light.ttf' },
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/Atma.ttf' },
      { name: 'Semibold', weight: '600', style: 'normal', file: '/fonts/Atma Semibold.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/Atma Bold.ttf' }
    ]
  },
  {
    id: 'baloo-da',
    name: 'Baloo Da',
    banglaName: 'বালু দা',
    category: 'Display',
    script: 'Bengali / Latin',
    designer: 'Ek Type',
    foundry: 'Ek Type Foundry',
    year: 2016,
    price: 0,
    isFree: true,
    license: 'SIL Open Font License',
    description: 'Thick, bouncy, rounded display typeface packed with friendliness, optimism, and punchy packaging presence.',
    tags: ['Free', 'Heavy', 'Rounded', 'Friendly', 'Open Source'],
    rating: 4.9,
    downloads: 140000,
    glyphCount: 740,
    contrast: 'Heavy Rounded',
    width: 'Condensed',
    xHeight: 'Very Tall',
    suggestedPairing: 'noto-sans-bengali',
    sampleHeadline: 'মিষ্টি হাসির ছোঁয়ায় রঙিন হয়ে ওঠে দিন',
    sampleParagraph: 'বালু দা যেকোনো পোস্টারে এক নজরকাড়া প্রাণবন্ত আবেদন সৃষ্টি করে। গোলগাল গঠন এবং ভারি মাত্রায় এটি অত্যন্ত প্রীতিভাজন।',
    styles: [
      { name: 'Regular', weight: '700', style: 'normal', file: '/fonts/Baloo Da.ttf' }
    ]
  },
  {
    id: 'shonar-bangla',
    name: 'Shonar Bangla',
    banglaName: 'সোনার বাংলা',
    category: 'Serif',
    script: 'Bengali',
    designer: 'Microsoft & Anandamela',
    foundry: 'Microsoft Typography',
    year: 2008,
    price: 36,
    isFree: false,
    license: 'Commercial License',
    description: 'Classic book serif built for long-form narrative prose and academic publications with graceful baseline anchoring.',
    tags: ['Classic', 'Book', 'Literary', 'Refined'],
    rating: 4.7,
    downloads: 82000,
    glyphCount: 610,
    contrast: 'Refined Serif',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'solaiman-lipi',
    sampleHeadline: 'সবার উপরে মানুষ সত্য তাহার উপরে নাই',
    sampleParagraph: 'সোনার বাংলা ফন্টটি বিশ্বস্ততা ও ঐতিহ্যের প্রতীক। এর সংযত রূপরেখা পাঠকদের পড়ার মনোযোগ দীর্ঘ সময় ধরে রাখতে সাহায্য করে।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/Shonar Bangla.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/Shonar Bangla Bold.ttf' }
    ]
  },
  {
    id: 'sonarp-3d',
    name: '3D Sonar Bangla',
    banglaName: 'থ্রি-ডি সোনার বাংলা',
    category: 'Display',
    script: 'Bengali',
    designer: 'Sonar Bangla Studio',
    foundry: 'Artistic Bangla Works',
    year: 2014,
    price: 26,
    isFree: false,
    license: 'Commercial License',
    description: 'Dramatic three-dimensional extruded display letters that jump off banners and poster headlines with cinematic bravado.',
    tags: ['3D', 'Poster', 'Extruded', 'Decorative'],
    rating: 4.5,
    downloads: 39000,
    glyphCount: 420,
    contrast: 'Extruded 3D',
    width: 'Expanded',
    xHeight: 'Tall',
    suggestedPairing: 'noto-sans-bengali',
    sampleHeadline: 'মহাকালের বুকে অক্ষরের অনির্বাণ জ্যোতি',
    sampleParagraph: 'ত্রিমাত্রিক গভীরতাযুক্ত এই ফন্টটি পোস্টার ও বিলবোর্ডে এক তীব্র চাক্ষুষ প্রভাব সৃষ্টি করে।',
    styles: [
      { name: '3D Display', weight: '700', style: 'normal', file: '/fonts/3D Sonar Bangla.ttf' }
    ]
  },
  {
    id: 'nikosh',
    name: 'Nikosh',
    banglaName: 'নিকোশ',
    category: 'Serif',
    script: 'Bengali',
    designer: 'Election Commission ICT & BBS',
    foundry: 'Government Digital Typographics',
    year: 2009,
    price: 0,
    isFree: true,
    license: 'Open Government License / Free',
    description: 'The official digital printing typeface of Bangladesh government documentation, gazettes, and national archives.',
    tags: ['Official', 'Free', 'Clean', 'Government'],
    rating: 4.7,
    downloads: 95000,
    glyphCount: 590,
    contrast: 'Clean Serif',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'solaiman-lipi',
    sampleHeadline: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের গৌরবগাথা',
    sampleParagraph: 'নিকোশ ফন্টটি সরকারি গেজেট ও আইন সংক্রান্ত নথিপত্রে বহুলভাবে ব্যবহৃত হয়। এর পরিপাটি সজ্জা প্রাতিষ্ঠানিক মর্যাদার প্রতীক।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/nikosh/Nikosh.ttf' },
      { name: 'BAN Regular', weight: '400', style: 'normal', file: '/fonts/nikosh/NikoshBAN.ttf' }
    ]
  },
  {
    id: 'sutonny-mj',
    name: 'Sutonny MJ',
    banglaName: 'সুতোন্বী এমজে',
    category: 'Serif',
    script: 'Bengali',
    designer: 'Mustafa Jabbar',
    foundry: 'Ananda Computers',
    year: 1988,
    price: 40,
    isFree: false,
    license: 'Commercial Bijoy License',
    description: 'The historic pioneer of desktop publishing in Bangladesh. Present across virtually every newspaper and press house for more than three decades.',
    tags: ['Historic', 'Print', 'Newspaper', 'Bijoy'],
    rating: 4.9,
    downloads: 310000,
    glyphCount: 580,
    contrast: 'Traditional Serif',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'noto-sans-bengali',
    sampleHeadline: 'সংবাদপত্রের শিরোনামে জীবন্ত সময়ের পদধ্বনি',
    sampleParagraph: 'সুতোন্বী এমজে শুধু একটি ফন্ট নয়, বাংলাদেশের মুদ্রণ শিল্পের ইতিহাসের সাথে ওতপ্রোতভাবে জড়িত এক বিপ্লব।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/Sutonny MJ.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/Sutonny MJ Bold.ttf' }
    ]
  },
  {
    id: 'mukti',
    name: 'Mukti',
    banglaName: 'মুক্তি',
    category: 'Sans Serif',
    script: 'Bengali',
    designer: 'Mukti Liberation Group',
    foundry: 'Open Source Bangla',
    year: 2003,
    price: 0,
    isFree: true,
    license: 'GNU GPL / Free',
    description: 'One of the earliest free Unicode Bengali typefaces, championing open digital access for the Bengali language online.',
    tags: ['Open Source', 'Free', 'Heritage', 'Condensed'],
    rating: 4.6,
    downloads: 72000,
    glyphCount: 510,
    contrast: 'Monolinear',
    width: 'Compact',
    xHeight: 'Tall',
    suggestedPairing: 'noto-serif-bengali',
    sampleHeadline: 'মুক্তির মন্দির সোপানতলে কত প্রাণ হলো বলিদান',
    sampleParagraph: 'মুক্ত সফ্টওয়্যার আন্দোলনের ফসল হিসেবে মুক্তি ফন্টটি বিশ্বজুড়ে ছড়িয়ে থাকা বাংলাভাষীদের উন্মুক্তভাবে ভাষা প্রকাশের অধিকার এনে দেয়।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/Mukti.ttf' },
      { name: 'Narrow', weight: '400', style: 'normal', file: '/fonts/Mukti Narrow.ttf' }
    ]
  },
  {
    id: 'mitra',
    name: 'Mitra',
    banglaName: 'মিত্র',
    category: 'Sans Serif',
    script: 'Bengali',
    designer: 'Mitra Types',
    foundry: 'Mitra Foundry',
    year: 2005,
    price: 22,
    isFree: false,
    license: 'Commercial License',
    description: 'Compact geometric sans serif font ideal for labels, subheadings, and data-dense user interfaces.',
    tags: ['Compact', 'Sans', 'Signage'],
    rating: 4.5,
    downloads: 32000,
    glyphCount: 460,
    contrast: 'Geometric Sans',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'kalpurush',
    sampleHeadline: 'সুহৃদ বন্ধুত্বের চিরন্তন বন্ধন অমর হোক',
    sampleParagraph: 'মিত্র ফন্টের নিখুঁত রেখা ও পরিমিত আকার চার্ট, ডেটা টেবিল ও আধুনিক ইন্টারফেসে তথ্যকে পরিষ্কারভাবে ফুটিয়ে তুলতে সাহায্য করে।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/mitra.ttf' }
    ]
  },
  {
    id: 'ekushey-aloucik',
    name: 'Ekushey Aloucik',
    banglaName: 'একুশে অলৌকিক',
    category: 'Display',
    script: 'Bengali',
    designer: 'Ekushey Typographics',
    foundry: 'Ekushey Open Project',
    year: 2007,
    price: 0,
    isFree: true,
    license: 'SIL Open Font License',
    description: 'Enchanting display letters with whimsical serifs and mystic flourishes suited for fantasy, folklore, and mythic titles.',
    tags: ['Free', 'Fantasy', 'Mystic', 'Display'],
    rating: 4.7,
    downloads: 58000,
    glyphCount: 500,
    contrast: 'Fantasy Serif',
    width: 'Normal',
    xHeight: 'Tall',
    suggestedPairing: 'noto-sans-bengali',
    sampleHeadline: 'রূপকথার রহস্যময় রাজকন্যার মায়াবী দেশ',
    sampleParagraph: 'ছোটদের রূপকথা ও অতিপ্রাকৃত গল্পের বইয়ের প্রচ্ছদে এই ফন্টটি যেন এক মায়াবী জাদুর পরশ বুলিয়ে দেয়।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/ekushey/Ekushey Aloucik.ttf' }
    ]
  },
  {
    id: 'niladri-nobanno',
    name: 'Niladri Nobanno',
    banglaName: 'নীলাদ্রি নবান্ন',
    category: 'Display',
    script: 'Bengali',
    designer: 'Niladri Arts',
    foundry: 'Niladri Studio',
    year: 2017,
    price: 34,
    isFree: false,
    license: 'Commercial License',
    description: 'Celebrates the traditional harvest festival Nobanno with crisp folk-art flair and striking geometric cuts.',
    tags: ['Folk', 'Harvest', 'Geometric', 'Featured'],
    rating: 4.8,
    downloads: 44000,
    glyphCount: 480,
    contrast: 'Geometric Folk',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'solaiman-lipi',
    sampleHeadline: 'নবান্নের নতুন ধানের পিঠাপুলির সুবাসিত মেলা',
    sampleParagraph: 'ফসলের ঘ্রাণ ও উৎসবের আনন্দকে ধারণ করে তৈরি নীলাদ্রি নবান্ন। এর জ্যামিতিক ভাঁজগুলোতে রয়েছে আবহমান বাংলার মেঠো সুর।',
    styles: [
      { name: 'Nobanno', weight: '500', style: 'normal', file: '/fonts/niladri/Niladri Nobanno.ttf' },
      { name: 'Moitree', weight: '400', style: 'normal', file: '/fonts/niladri/Niladri Moitree.ttf' }
    ]
  },
  {
    id: 'amader-shomoy',
    name: 'Amader Shomoy',
    banglaName: 'আমাদের সময়',
    category: 'Serif',
    script: 'Bengali',
    designer: 'Amader Shomoy Media',
    foundry: 'Daily News Typeworks',
    year: 2011,
    price: 30,
    isFree: false,
    license: 'Editorial Commercial License',
    description: 'Designed specifically for rapid newspaper printing with high ink-trap resilience and punchy contrast.',
    tags: ['Newspaper', 'Editorial', 'Ink-traps', 'Multi-weight'],
    rating: 4.6,
    downloads: 63000,
    glyphCount: 520,
    contrast: 'High Contrast Ink-trap',
    width: 'Slightly Condensed',
    xHeight: 'Tall',
    suggestedPairing: 'akhand-bengali',
    sampleHeadline: 'সময়ের বুকে সত্যের নির্ভীক উচ্চারণ প্রতিদিন',
    sampleParagraph: 'সংবাদপত্রের তীব্র প্রতিদ্বন্দ্বিতাপূর্ণ জগতে পত্রিকার প্রথম পাতার শিরোনামে দৃষ্টি আকর্ষণের জন্য এটি তৈরি করা হয়েছে।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/amader_shomoy/Amader Shomoy.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/amader_shomoy/Amader Shomoy Bold.ttf' }
    ]
  },
  {
    id: 'chaturanga',
    name: 'Chaturanga',
    banglaName: 'চতুরঙ্গ',
    category: 'Display',
    script: 'Bengali',
    designer: 'Rabindra Sangha Typographers',
    foundry: 'Bengal Literary Press',
    year: 2010,
    price: 27,
    isFree: false,
    license: 'Commercial License',
    description: 'Classical literary display font with four-tier aesthetic balance inspired by Rabindranath Tagore’s iconic novel.',
    tags: ['Literary', 'Classic', 'Noble'],
    rating: 4.7,
    downloads: 41000,
    glyphCount: 510,
    contrast: 'Classical Display',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'noto-sans-bengali',
    sampleHeadline: 'চার রঙের খেলা ঘুরে ফিরে আসে জীবনের পাতায়',
    sampleParagraph: 'রবীন্দ্রনাথ ঠাকুরের চতুরঙ্গ উপন্যাসের দার্শনিক দ্যোতনাকে অক্ষরের অবয়বে ধারণ করেছে এই অনন্য ফন্ট।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/chaturanga/Chaturanga MJ.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/chaturanga/Chaturanga MJ Bold.ttf' }
    ]
  },
  {
    id: 'chandrabati',
    name: 'Chandrabati',
    banglaName: 'চন্দ্রাবতী',
    category: 'Serif',
    script: 'Bengali',
    designer: 'Mymensingh Geetika Guild',
    foundry: 'Heritage Type Studio',
    year: 2013,
    price: 32,
    isFree: false,
    license: 'Commercial License',
    description: 'Dedicated to the first female poet of Bengali literature. Graceful, poetic curves with serene rhythm and poignant balance.',
    tags: ['Poetic', 'Heritage', 'Serif', 'Graceful'],
    rating: 4.8,
    downloads: 52000,
    glyphCount: 550,
    contrast: 'Poetic Serif',
    width: 'Normal',
    xHeight: 'Medium',
    suggestedPairing: 'solaiman-lipi',
    sampleHeadline: 'চন্দ্রাবতীর কাব্যগাথায় অমর প্রেম ও অশ্রুমালা',
    sampleParagraph: 'ময়মনসিংহ গীতিকার অমর রচয়িতা চন্দ্রাবতীর প্রতি শ্রদ্ধা নিবেদনে নির্মিত এই টাইপফেসটিতে ফুটে উঠেছে এক শান্ত বিষাদ ও অপরূপ লাবণ্য।',
    styles: [
      { name: 'Regular', weight: '400', style: 'normal', file: '/fonts/chandrabati/Chandrabati MJ.ttf' },
      { name: 'Bold', weight: '700', style: 'normal', file: '/fonts/chandrabati/Chandrabati MJ Bold.ttf' }
    ]
  }
];

export const EXTENDED_FONTS = extendedFontsRaw;

/**
 * Asynchronously load all archive fonts from the Cloudflare Worker API.
 * Falls back to the bundled EXTENDED_FONTS if the API is offline or unreachable.
 */
export async function loadArchiveFonts() {
  try {
    const apiFonts = await fetchAllFonts();
    if (apiFonts && Array.isArray(apiFonts) && apiFonts.length > 0) {
      return apiFonts;
    }
  } catch (err) {
    console.warn('[akshar] Fallback to bundled font catalog:', err);
  }
  return EXTENDED_FONTS;
}

// Helper to inject @font-face dynamically in the document head
const loadedFontsMap = new Set();

export function ensureFontFaceLoaded(fontFamily, fontUrl, weight = '400', style = 'normal', isVariable = false) {
  if (!fontFamily || !fontUrl) return;
  const safeWeight = isVariable ? '100 900' : (weight || '400');
  const safeStyle = style || 'normal';
  const key = `${fontFamily}_${fontUrl}_${safeWeight}_${safeStyle}`;
  if (loadedFontsMap.has(key)) return;
  loadedFontsMap.add(key);

  const normalizedUrl = fontUrl.startsWith('/') || fontUrl.startsWith('http') ? fontUrl : '/' + fontUrl;
  const cleanUrl = encodeURI(normalizedUrl);
  const fontFormat = fontUrl.toLowerCase().endsWith('.otf') ? 'opentype' : 'truetype';

  // 1. Native browser FontFace API (most reliable, immediately loaded and decoded)
  if (typeof FontFace !== 'undefined') {
    try {
      const face = new FontFace(fontFamily, `url("${cleanUrl}")`, {
        weight: safeWeight,
        style: safeStyle
      });
      face.load().then((loaded) => {
        document.fonts.add(loaded);
      }).catch((e) => {
        // Fallback to CSS @font-face rule
      });
    } catch (e) {}
  }

  // 2. CSS @font-face rule in dedicated style element for cascading styles
  let styleElem = document.getElementById('akshar-font-faces');
  if (!styleElem) {
    styleElem = document.createElement('style');
    styleElem.id = 'akshar-font-faces';
    document.head.appendChild(styleElem);
  }

  const cssRule = `
    @font-face {
      font-family: '${fontFamily.replace(/'/g, "\\'")}';
      src: url("${cleanUrl}") format('${fontFormat}');
      font-weight: ${safeWeight};
      font-style: ${safeStyle};
      font-display: swap;
    }
  `;
  styleElem.appendChild(document.createTextNode(cssRule));
}

// Preload all featured fonts on boot
export function preloadAllFeaturedFonts() {
  FEATURED_FONTS.forEach((f) => {
    const isVariable = f.tags?.includes('Variable') || f.name.toLowerCase().includes('variable');
    if (f.styles && f.styles.length > 0) {
      f.styles.forEach((s) => {
        if (s.file) ensureFontFaceLoaded(f.name, s.file, s.weight || '400', s.style || 'normal', isVariable);
      });
    } else if (f.file) {
      ensureFontFaceLoaded(f.name, f.file, '400', 'normal', isVariable);
    }
  });
}

