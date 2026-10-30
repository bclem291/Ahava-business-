export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export type BusinessStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type AdvertStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface Business {
  id: string;
  user_id: string;
  user_name?: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  logo_url: string;
  images: string[];
  state: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  website?: string;
  opening_hours?: string;
  products_services?: string[];
  is_verified: boolean;
  is_featured: boolean;
  package_tier: 'free' | 'standard' | 'premium';
  status: BusinessStatus;
  rejection_reason?: string;
  views: number;
  whatsapp_clicks: number;
  created_at: string;
  expires_at?: string;
}

export interface Advert {
  id: string;
  user_id: string;
  user_name?: string;
  business_id?: string;
  business_name?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price: number; // in Naira (₦), 0 if negotiable/call for price
  is_negotiable?: boolean;
  images: string[];
  state: string;
  city: string;
  whatsapp: string;
  external_url?: string;
  package_tier: 'standard' | 'featured' | 'premium';
  is_featured: boolean;
  status: AdvertStatus;
  rejection_reason?: string;
  duration_days: number;
  views: number;
  whatsapp_clicks: number;
  created_at: string;
  expires_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  description: string;
  count?: number;
}

export interface PricingPackage {
  id: string;
  name: string;
  type: 'listing' | 'advert' | 'banner';
  price: number; // in NGN (₦)
  duration_days: number;
  duration_label: string;
  features: string[];
  badge?: string;
  popular?: boolean;
  active: boolean;
}

export interface BannerAd {
  id: string;
  title: string;
  image_url: string;
  destination_url: string;
  slot: 'homepage_top' | 'homepage_middle' | 'sidebar';
  start_date: string;
  end_date: string;
  is_active: boolean;
  advertiser_name: string;
  advertiser_email: string;
  views: number;
  clicks: number;
  created_at: string;
}

export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface PaymentRecord {
  id: string;
  reference: string;
  user_id: string;
  user_email: string;
  user_name: string;
  amount: number; // in NGN (₦)
  currency: string;
  package_id: string;
  package_name: string;
  item_type: 'listing' | 'advert' | 'banner';
  item_id: string;
  item_title: string;
  status: PaymentStatus;
  channel?: string;
  paid_at?: string;
  created_at: string;
}

export interface AdvertReport {
  id: string;
  advert_id: string;
  advert_title: string;
  reporter_email: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  office_address: string;
  announcement_text?: string;
  show_announcement: boolean;
  allow_user_registration: boolean;
  require_business_approval: boolean;
  require_advert_approval: boolean;
}
