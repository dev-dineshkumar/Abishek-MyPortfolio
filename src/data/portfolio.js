// Single source of truth for Abishek S's portfolio.
// Content comes only from the supplied AMDV Solutions brand material (portrait, logo, emblem, flyer):
// nothing here is invented. Add more details (email, address, social links...) to `profile` when available.

export const profile = {
  name: 'ABISHEK S',
  shortName: 'ABISHEK',
  logoFirst: 'A',
  logoRest: 'BISHEK .S',
  role: 'Founder & CEO',
  company: 'AMDV Solutions',
  kicker: 'Founder & CEO • AMDV Solutions',
  roles: ['AMDV Solutions', 'Innovate · Build · Grow'],
  tagline: 'We build digital solutions for every need — Innovate. Develop. Deliver.',
  motto: 'Innovate. Develop. Deliver.',
  photo: '/abishek.webp',
  logo: '/amdv-logo.webp',
  emblem: '/amdv-emblem.webp',
  phone: '9626360949',
  phoneDisplay: '+91 96263 60949',
  phoneHref: 'tel:+919626360949',
  website: 'www.amdvsolutions.com',
  websiteHref: 'https://www.amdvsolutions.com',
  email: '', // not in the supplied material — when set, Contact shows the email card and message form
  loaderWords: ['INNOVATE', 'DEVELOP', 'DELIVER', 'AMDV', 'SOLUTIONS'],
}

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'projects', label: 'Solution' },
  { id: 'promise', label: 'Why AMDV' },
  { id: 'contact', label: 'Contact' },
]

export const stats = [
  { value: 5, suffix: '', label: 'Solution Types' },
  { value: 4, suffix: '', label: 'Core Values' },
  { value: 3, suffix: '', label: 'Step Workflow' },
]

// Cards that ride the 3D rail in the "Work" section: AMDV Solutions' five offerings + four promises.
export const projectCards = [
  { kind: 'globe', cat: 'Web Solution', title: 'Business Website', sub: 'Built by AMDV Solutions', hue: 172 },
  { kind: 'user', cat: 'Web Solution', title: 'Personal Website', sub: 'Built by AMDV Solutions', hue: 262 },
  { kind: 'cart', cat: 'Web Application', title: 'E-commerce Web Application', sub: 'Built by AMDV Solutions', hue: 166 },
  { kind: 'gear', cat: 'Web Application', title: 'CRM & ERP Application', sub: 'Built by AMDV Solutions', hue: 252 },
  { kind: 'brief', cat: 'Web Solution', title: 'Portfolio Website', sub: 'Built by AMDV Solutions', hue: 176 },
  { kind: 'api', cat: 'Our Promise', title: 'Fast & Reliable', sub: 'The AMDV Solutions promise', hue: 270 },
  { kind: 'auth', cat: 'Our Promise', title: 'Secure & Scalable', sub: 'The AMDV Solutions promise', hue: 285 },
  { kind: 'support', cat: 'Our Promise', title: 'Dedicated Support', sub: 'The AMDV Solutions promise', hue: 258 },
  { kind: 'billing', cat: 'Our Promise', title: 'Affordable Solutions', sub: 'The AMDV Solutions promise', hue: 180 },
]

export const about = {
  eyebrow: 'Leading AMDV Solutions',
  paragraph:
    'Abishek S is the Founder & CEO of AMDV Solutions, a company that builds digital solutions for every need — business websites, personal websites, e-commerce web applications, CRM & ERP applications and portfolio websites. AMDV Solutions works to one motto: Innovate. Develop. Deliver. — and one promise: Innovate, Build and Grow Together.',
  kitTitle: 'What AMDV Solutions Builds',
  pills: [
    'Business Website',
    'Personal Website',
    'E-commerce Web Application',
    'CRM & ERP Application',
    'Portfolio Website',
  ],
}

// The AMDV Solutions workflow (emblem: Innovate · Develop · Deliver). Points only restate flyer content.
export const workflow = [
  {
    role: 'Innovate',
    company: 'AMDV Solutions',
    tag: 'Step 1',
    tech: ['Every Need', 'Grow Together'],
    points: [
      'Digital solutions shaped around every need.',
      'Innovate, Build and Grow Together.',
    ],
  },
  {
    role: 'Develop',
    company: 'AMDV Solutions',
    tag: 'Step 2',
    tech: ['Websites', 'Web Applications', 'CRM & ERP'],
    points: [
      'Business, personal and portfolio websites.',
      'E-commerce web applications.',
      'CRM & ERP applications.',
    ],
  },
  {
    role: 'Deliver',
    company: 'AMDV Solutions',
    tag: 'Step 3',
    tech: ['Fast & Reliable', 'Secure & Scalable', 'Dedicated Support', 'Affordable'],
    points: [
      'Fast and reliable solutions.',
      'Secure and scalable solutions.',
      'Dedicated support.',
      'Affordable solutions.',
    ],
  },
]

// Value pillars from the flyer's feature strip. `w` is a decorative meter (all full — no rating is claimed).
export const promises = [
  { title: 'Fast & Reliable', small: 'AMDV Solutions', chip: 'Core Value', w: 100 },
  { title: 'Secure & Scalable', small: 'AMDV Solutions', chip: 'Core Value', w: 100 },
  { title: 'Dedicated Support', small: 'AMDV Solutions', chip: 'Core Value', w: 100 },
  { title: 'Affordable Solutions', small: 'AMDV Solutions', chip: 'Core Value', w: 100 },
]

export const cta = {
  title: 'Ready to transform your business?',
  text: 'Contact us today for a free consultation!',
}

// Endless ticker under "Work": AMDV Solutions' offerings, promises and workflow words, all taken from the
// brand material. [label, 2-letter badge, badge text colour, badge background]
export const ticker = [
  ['Business Website', 'BW', '#d5fbf3', '#0b3b37'],
  ['Personal Website', 'PW', '#bfdcff', '#0d2a52'],
  ['E-commerce Web Application', 'EC', '#d5fbf3', '#0b3b37'],
  ['CRM & ERP Application', 'CE', '#bfdcff', '#0d2a52'],
  ['Portfolio Website', 'PF', '#d5fbf3', '#0b3b37'],
  ['Fast & Reliable', 'FR', '#0b2a33', '#a78bfa'],
  ['Secure & Scalable', 'SS', '#0b2a33', '#a78bfa'],
  ['Dedicated Support', 'DS', '#0b2a33', '#a78bfa'],
  ['Affordable Solutions', 'AS', '#0b2a33', '#a78bfa'],
  ['Innovate', 'In', '#03201d', '#2dd4bf'],
  ['Develop', 'De', '#03201d', '#2dd4bf'],
  ['Deliver', 'Dl', '#03201d', '#2dd4bf'],
]
