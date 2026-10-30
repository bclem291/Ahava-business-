import { Business, Advert, Category, PricingPackage, BannerAd, PaymentRecord, SiteSettings } from '../types';

export const NIGERIAN_STATES: { state: string; cities: string[] }[] = [
  {
    state: 'Lagos',
    cities: ['Ikeja', 'Lekki', 'Victoria Island', 'Yaba', 'Surulere', 'Ikoyi', 'Maryland', 'Alaba', 'Ajah', 'Ikorodu']
  },
  {
    state: 'Abuja FCT',
    cities: ['Wuse 2', 'Garki', 'Maitama', 'Asokoro', 'Gwarinpa', 'Jabi', 'Utako', 'Lugbe']
  },
  {
    state: 'Rivers',
    cities: ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Bonny']
  },
  {
    state: 'Oyo',
    cities: ['Ibadan', 'Ogbomosho', 'Oyo Town', 'Iseyin']
  },
  {
    state: 'Kano',
    cities: ['Kano Municipal', 'Fagge', 'Nassarawa', 'Gwale']
  },
  {
    state: 'Enugu',
    cities: ['Enugu Urban', 'Nsukka', 'Independence Layout', 'New Haven']
  },
  {
    state: 'Ogun',
    cities: ['Abeokuta', 'Ota', 'Sagamu', 'Ijebu Ode', 'Mowe-Ibafo']
  },
  {
    state: 'Delta',
    cities: ['Warri', 'Asaba', 'Ughelli', 'Sapele']
  },
  {
    state: 'Anambra',
    cities: ['Onitsha', 'Awka', 'Nnewi', 'Ekwulobia']
  },
  {
    state: 'Edo',
    cities: ['Benin City', 'Auchi', 'Ekpoma', 'Uromi']
  },
  {
    state: 'Kaduna',
    cities: ['Kaduna Central', 'Zaria', 'Kafanchan']
  },
  {
    state: 'Akwa Ibom',
    cities: ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron']
  },
  {
    state: 'Plateau',
    cities: ['Jos North', 'Jos South', 'Bukuru']
  },
  {
    state: 'Imo',
    cities: ['Owerri', 'Orlu', 'Okigwe']
  },
  {
    state: 'Kwara',
    cities: ['Ilorin', 'Offa', 'Omu-Aran']
  }
];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Fashion and Beauty',
    slug: 'fashion-and-beauty',
    icon_name: 'Scissors',
    description: 'Bespoke tailoring, traditional wear, hair salons, cosmetics, perfumes, and fashion accessories.',
    count: 0
  },
  {
    id: 'cat-2',
    name: 'Food and Restaurants',
    slug: 'food-and-restaurants',
    icon_name: 'UtensilsCrossed',
    description: 'Authentic Nigerian cuisines, eateries, bakery, outdoor catering, chops, and healthy drinks.',
    count: 0
  },
  {
    id: 'cat-3',
    name: 'Real Estate and Property',
    slug: 'real-estate-and-property',
    icon_name: 'Building2',
    description: 'Residential apartments, commercial spaces, lands for sale, short lets, and property development.',
    count: 0
  },
  {
    id: 'cat-4',
    name: 'Cars and Automobile Services',
    slug: 'cars-and-automobile-services',
    icon_name: 'Car',
    description: 'Car dealerships, auto mechanics, spare parts, car wash, spray painting, and diagnostic services.',
    count: 0
  },
  {
    id: 'cat-5',
    name: 'Electronics and Gadgets',
    slug: 'electronics-and-gadgets',
    icon_name: 'Smartphone',
    description: 'Smartphones, laptops, home theaters, solar inverters, smart home gadgets, and tech repairs.',
    count: 0
  },
  {
    id: 'cat-6',
    name: 'Education and Training',
    slug: 'education-and-training',
    icon_name: 'GraduationCap',
    description: 'Vocational institutes, IT bootcamps, language schools, tutorial centers, and exam prep.',
    count: 0
  },
  {
    id: 'cat-7',
    name: 'Digital Services and Technology',
    slug: 'digital-services-and-technology',
    icon_name: 'Monitor',
    description: 'Website design, mobile app development, digital marketing, SEO, graphics, and branding.',
    count: 0
  },
  {
    id: 'cat-8',
    name: 'Health and Wellness',
    slug: 'health-and-wellness',
    icon_name: 'HeartPulse',
    description: 'Pharmacies, medical clinics, dental care, fitness gyms, physiotherapy, and herbal wellness.',
    count: 0
  },
  {
    id: 'cat-9',
    name: 'Hotels and Hospitality',
    slug: 'hotels-and-hospitality',
    icon_name: 'Hotel',
    description: 'Luxury hotels, boutique suites, event centers, resorts, and vacation guest houses.',
    count: 0
  },
  {
    id: 'cat-10',
    name: 'Building and Construction',
    slug: 'building-and-construction',
    icon_name: 'Hammer',
    description: 'Architectural drawings, civil engineering, plumbing, tiling, roofing, and building materials.',
    count: 0
  },
  {
    id: 'cat-11',
    name: 'Professional Services',
    slug: 'professional-services',
    icon_name: 'Briefcase',
    description: 'Legal counsel, accounting, business registration (CAC), audit, consulting, and tax services.',
    count: 0
  },
  {
    id: 'cat-12',
    name: 'Shopping and Retail',
    slug: 'shopping-and-retail',
    icon_name: 'ShoppingBag',
    description: 'Supermarkets, gift stores, baby goods, household items, provisions, and wholesale trade.',
    count: 0
  },
  {
    id: 'cat-13',
    name: 'Churches and Religious Organisations',
    slug: 'churches-and-religious-organisations',
    icon_name: 'Church',
    description: 'Worship centers, ministries, faith-based charities, counseling, and community outreach.',
    count: 0
  },
  {
    id: 'cat-14',
    name: 'Schools and Educational Institutions',
    slug: 'schools-and-educational-institutions',
    icon_name: 'School',
    description: 'Nursery and primary schools, secondary colleges, polytechnics, and specialized colleges.',
    count: 0
  },
  {
    id: 'cat-15',
    name: 'Home and Repair Services',
    slug: 'home-and-repair-services',
    icon_name: 'Wrench',
    description: 'Air conditioning repairs, electricians, carpentry, deep cleaning, fumigation, and interior decor.',
    count: 0
  },
  {
    id: 'cat-16',
    name: 'Agriculture and Farming',
    slug: 'agriculture-and-farming',
    icon_name: 'Sprout',
    description: 'Poultry, catfish farming, farm produce supply, agro-allied processing, and fertilizer distribution.',
    count: 0
  }
];

// Clean slate: No demo or pre-filled listings
export const DEFAULT_BUSINESSES: Business[] = [];

// Clean slate: No demo or pre-filled adverts
export const DEFAULT_ADVERTS: Advert[] = [];

export const DEFAULT_PACKAGES: PricingPackage[] = [
  {
    id: 'pkg-free-listing',
    name: 'Free Business Listing',
    type: 'listing',
    price: 0,
    duration_days: 365,
    duration_label: 'Standard',
    features: [
      'One business profile',
      'Basic business information',
      'One business logo',
      'Standard directory placement',
      'Direct WhatsApp chat button',
      'Subject to administrator review'
    ],
    active: true
  },
  {
    id: 'pkg-standard-listing',
    name: 'Standard Business Listing',
    type: 'listing',
    price: 2000,
    duration_days: 30,
    duration_label: 'per 30 days',
    features: [
      'Full business profile',
      'Multiple business gallery pictures',
      'Direct WhatsApp contact button',
      'Standard search & filter placement',
      'Opening hours & address map',
      'List up to 5 products or services'
    ],
    active: true
  },
  {
    id: 'pkg-premium-listing',
    name: 'Premium Business Listing',
    type: 'listing',
    price: 5000,
    duration_days: 30,
    duration_label: 'per 30 days',
    badge: 'Most Popular',
    popular: true,
    features: [
      'All Standard Listing features',
      'Official "Featured" badge & priority placement',
      'Appears on Homepage Featured Businesses',
      'Unlimited business pictures in gallery',
      'Detailed listing views & WhatsApp click analytics',
      'Priority administrator verification'
    ],
    active: true
  },
  {
    id: 'pkg-featured-advert',
    name: 'Featured Product / Service Advert',
    type: 'advert',
    price: 2000,
    duration_days: 7,
    duration_label: 'per 7 days',
    features: [
      'One individual product or service advert',
      'Up to 3 high-resolution product pictures',
      'Product description & price display',
      'Direct WhatsApp inquiry button with prefilled title',
      'Featured placement in Marketplace for 7 days'
    ],
    active: true
  },
  {
    id: 'pkg-premium-advert',
    name: 'Premium 30-Day Advert',
    type: 'advert',
    price: 5000,
    duration_days: 30,
    duration_label: 'per 30 days',
    badge: 'Best Value for Sales',
    popular: true,
    features: [
      'All Featured Advert benefits for 30 full days',
      'Prominent placement on Homepage Popular Adverts',
      'Up to 6 product images',
      'Direct link to your website / catalogue',
      'Detailed advert views & WhatsApp click metrics',
      'Social media amplification consideration'
    ],
    active: true
  },
  {
    id: 'pkg-banner-advert',
    name: 'Homepage Banner Advertisement',
    type: 'banner',
    price: 10000,
    duration_days: 30,
    duration_label: 'per 30 days',
    features: [
      'High-impact banner on AHAVA DIGITAL HUB Homepage',
      'Visible to thousands of daily visitors',
      'Custom clickable destination link to your website or WhatsApp',
      'Banner performance metrics (impressions & clicks)',
      'Dedicated support for creative sizing'
    ],
    active: true
  }
];

export const DEFAULT_BANNERS: BannerAd[] = [];

export const DEFAULT_PAYMENTS: PaymentRecord[] = [];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: 'AHAVA DIGITAL HUB',
  tagline: 'Connecting Businesses to More Customers.',
  contact_email: 'contact@ahavadigitalhub.com',
  contact_phone: '+234 800 242 8248',
  contact_whatsapp: '2348035551234',
  office_address: '12 Commercial Avenue, Ikeja, Lagos State, Nigeria',
  announcement_text: 'Welcome to AHAVA DIGITAL HUB! Advertise your business today & connect with thousands of active buyers across Nigeria.',
  show_announcement: true,
  allow_user_registration: true,
  require_business_approval: true,
  require_advert_approval: true
};
