import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Business,
  Advert,
  Category,
  PricingPackage,
  BannerAd,
  PaymentRecord,
  AdvertReport,
  SiteSettings,
  User,
  BusinessStatus,
  AdvertStatus
} from '../types';
import {
  DEFAULT_BUSINESSES,
  DEFAULT_ADVERTS,
  DEFAULT_CATEGORIES,
  DEFAULT_PACKAGES,
  DEFAULT_BANNERS,
  DEFAULT_PAYMENTS,
  DEFAULT_SITE_SETTINGS
} from '../data/defaultData';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// LocalStorage Keys
const KEYS = {
  BUSINESSES: 'ahava_businesses_v2',
  ADVERTS: 'ahava_adverts_v2',
  CATEGORIES: 'ahava_categories_v2',
  PACKAGES: 'ahava_packages_v2',
  BANNERS: 'ahava_banners_v2',
  PAYMENTS: 'ahava_payments_v2',
  REPORTS: 'ahava_reports_v2',
  SETTINGS: 'ahava_settings_v2',
  CURRENT_USER: 'ahava_current_user_v2',
  REGISTERED_USERS: 'ahava_registered_users_v2'
};

class StorageService {
  private initDefaultData() {
    // Clear old sample listings if present from v1
    localStorage.removeItem('ahava_businesses_v1');
    localStorage.removeItem('ahava_adverts_v1');
    localStorage.removeItem('ahava_payments_v1');
    localStorage.removeItem('ahava_banners_v1');
    localStorage.removeItem('ahava_categories_v1');

    if (!localStorage.getItem(KEYS.BUSINESSES)) {
      localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(DEFAULT_BUSINESSES));
    }
    if (!localStorage.getItem(KEYS.ADVERTS)) {
      localStorage.setItem(KEYS.ADVERTS, JSON.stringify(DEFAULT_ADVERTS));
    }
    if (!localStorage.getItem(KEYS.CATEGORIES)) {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(KEYS.PACKAGES)) {
      localStorage.setItem(KEYS.PACKAGES, JSON.stringify(DEFAULT_PACKAGES));
    }
    if (!localStorage.getItem(KEYS.BANNERS)) {
      localStorage.setItem(KEYS.BANNERS, JSON.stringify(DEFAULT_BANNERS));
    }
    if (!localStorage.getItem(KEYS.PAYMENTS)) {
      localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(DEFAULT_PAYMENTS));
    }
    if (!localStorage.getItem(KEYS.REPORTS)) {
      localStorage.setItem(KEYS.REPORTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
    }
    if (!localStorage.getItem(KEYS.REGISTERED_USERS)) {
      const defaultUsers: User[] = [
        {
          id: 'admin-master',
          email: 'admin@ahavadigitalhub.com',
          full_name: 'AHAVA Administrator',
          phone: '+2348002428248',
          role: 'admin',
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(defaultUsers));
    }
  }

  constructor() {
    this.initDefaultData();
  }

  // --- BUSINESSES ---
  getBusinesses(): Business[] {
    try {
      const raw = localStorage.getItem(KEYS.BUSINESSES);
      return raw ? JSON.parse(raw) : DEFAULT_BUSINESSES;
    } catch {
      return DEFAULT_BUSINESSES;
    }
  }

  getApprovedBusinesses(): Business[] {
    return this.getBusinesses().filter((b) => b.status === 'approved');
  }

  getBusinessById(id: string): Business | undefined {
    return this.getBusinesses().find((b) => b.id === id);
  }

  createBusiness(business: Omit<Business, 'id' | 'views' | 'whatsapp_clicks' | 'created_at'>): Business {
    const businesses = this.getBusinesses();
    const newBiz: Business = {
      ...business,
      id: `biz-${Date.now()}`,
      views: 0,
      whatsapp_clicks: 0,
      created_at: new Date().toISOString()
    };
    businesses.unshift(newBiz);
    localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(businesses));
    this.updateCategoryCounts();
    return newBiz;
  }

  updateBusiness(id: string, updates: Partial<Business>): Business | null {
    const businesses = this.getBusinesses();
    const index = businesses.findIndex((b) => b.id === id);
    if (index === -1) return null;
    const updated = { ...businesses[index], ...updates };
    businesses[index] = updated;
    localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(businesses));
    this.updateCategoryCounts();
    return updated;
  }

  deleteBusiness(id: string): boolean {
    const businesses = this.getBusinesses();
    const filtered = businesses.filter((b) => b.id !== id);
    if (filtered.length !== businesses.length) {
      localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(filtered));
      this.updateCategoryCounts();
      return true;
    }
    return false;
  }

  updateBusinessStatus(id: string, status: BusinessStatus, reason?: string): Business | null {
    return this.updateBusiness(id, {
      status,
      rejection_reason: reason || ''
    });
  }

  // --- ADVERTS ---
  getAdverts(): Advert[] {
    try {
      const raw = localStorage.getItem(KEYS.ADVERTS);
      return raw ? JSON.parse(raw) : DEFAULT_ADVERTS;
    } catch {
      return DEFAULT_ADVERTS;
    }
  }

  getApprovedAdverts(): Advert[] {
    return this.getAdverts().filter((a) => a.status === 'approved');
  }

  getAdvertById(id: string): Advert | undefined {
    return this.getAdverts().find((a) => a.id === id);
  }

  createAdvert(advert: Omit<Advert, 'id' | 'views' | 'whatsapp_clicks' | 'created_at'>): Advert {
    const adverts = this.getAdverts();
    const newAdvert: Advert = {
      ...advert,
      id: `adv-${Date.now()}`,
      views: 0,
      whatsapp_clicks: 0,
      created_at: new Date().toISOString()
    };
    adverts.unshift(newAdvert);
    localStorage.setItem(KEYS.ADVERTS, JSON.stringify(adverts));
    return newAdvert;
  }

  updateAdvert(id: string, updates: Partial<Advert>): Advert | null {
    const adverts = this.getAdverts();
    const index = adverts.findIndex((a) => a.id === id);
    if (index === -1) return null;
    const updated = { ...adverts[index], ...updates };
    adverts[index] = updated;
    localStorage.setItem(KEYS.ADVERTS, JSON.stringify(adverts));
    return updated;
  }

  deleteAdvert(id: string): boolean {
    const adverts = this.getAdverts();
    const filtered = adverts.filter((a) => a.id !== id);
    if (filtered.length !== adverts.length) {
      localStorage.setItem(KEYS.ADVERTS, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  updateAdvertStatus(id: string, status: AdvertStatus, reason?: string): Advert | null {
    return this.updateAdvert(id, {
      status,
      rejection_reason: reason || ''
    });
  }

  // --- CATEGORIES ---
  getCategories(): Category[] {
    try {
      const raw = localStorage.getItem(KEYS.CATEGORIES);
      return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  addCategory(category: Omit<Category, 'id' | 'count'>): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      count: 0
    };
    categories.push(newCat);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    return categories[index];
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length !== categories.length) {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  private updateCategoryCounts() {
    const categories = this.getCategories();
    const businesses = this.getApprovedBusinesses();
    const updated = categories.map((cat) => {
      const count = businesses.filter((b) => b.category === cat.name).length;
      return { ...cat, count };
    });
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(updated));
  }

  // --- PRICING PACKAGES ---
  getPackages(): PricingPackage[] {
    try {
      const raw = localStorage.getItem(KEYS.PACKAGES);
      return raw ? JSON.parse(raw) : DEFAULT_PACKAGES;
    } catch {
      return DEFAULT_PACKAGES;
    }
  }

  updatePackage(id: string, updates: Partial<PricingPackage>): PricingPackage | null {
    const packages = this.getPackages();
    const idx = packages.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    packages[idx] = { ...packages[idx], ...updates };
    localStorage.setItem(KEYS.PACKAGES, JSON.stringify(packages));
    return packages[idx];
  }

  // --- BANNERS ---
  getBanners(): BannerAd[] {
    try {
      const raw = localStorage.getItem(KEYS.BANNERS);
      return raw ? JSON.parse(raw) : DEFAULT_BANNERS;
    } catch {
      return DEFAULT_BANNERS;
    }
  }

  getActiveBanners(): BannerAd[] {
    return this.getBanners().filter((b) => b.is_active);
  }

  addBanner(banner: Omit<BannerAd, 'id' | 'views' | 'clicks' | 'created_at'>): BannerAd {
    const banners = this.getBanners();
    const newBanner: BannerAd = {
      ...banner,
      id: `ban-${Date.now()}`,
      views: 0,
      clicks: 0,
      created_at: new Date().toISOString()
    };
    banners.unshift(newBanner);
    localStorage.setItem(KEYS.BANNERS, JSON.stringify(banners));
    return newBanner;
  }

  updateBanner(id: string, updates: Partial<BannerAd>): BannerAd | null {
    const banners = this.getBanners();
    const idx = banners.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    banners[idx] = { ...banners[idx], ...updates };
    localStorage.setItem(KEYS.BANNERS, JSON.stringify(banners));
    return banners[idx];
  }

  deleteBanner(id: string): boolean {
    const banners = this.getBanners();
    const filtered = banners.filter((b) => b.id !== id);
    if (filtered.length !== banners.length) {
      localStorage.setItem(KEYS.BANNERS, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  // --- PAYMENTS & ACTIVATION ---
  getPayments(): PaymentRecord[] {
    try {
      const raw = localStorage.getItem(KEYS.PAYMENTS);
      return raw ? JSON.parse(raw) : DEFAULT_PAYMENTS;
    } catch {
      return DEFAULT_PAYMENTS;
    }
  }

  recordPayment(payment: Omit<PaymentRecord, 'id' | 'created_at'>): PaymentRecord {
    const payments = this.getPayments();
    const newRecord: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    payments.unshift(newRecord);
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));

    // If payment was successful, activate the package perks!
    if (newRecord.status === 'success') {
      this.activatePaidPackage(newRecord);
    }

    return newRecord;
  }

  private activatePaidPackage(record: PaymentRecord) {
    const expiryDate = new Date();
    // Default 30 days, or 7 days for featured advert
    if (record.package_id === 'pkg-featured-advert') {
      expiryDate.setDate(expiryDate.getDate() + 7);
    } else {
      expiryDate.setDate(expiryDate.getDate() + 30);
    }
    const expiryString = expiryDate.toISOString();

    if (record.item_type === 'listing') {
      const isPremium = record.package_id === 'pkg-premium-listing';
      this.updateBusiness(record.item_id, {
        package_tier: isPremium ? 'premium' : 'standard',
        is_featured: isPremium,
        status: 'approved',
        expires_at: expiryString
      });
    } else if (record.item_type === 'advert') {
      const isPremium = record.package_id === 'pkg-premium-advert';
      this.updateAdvert(record.item_id, {
        package_tier: isPremium ? 'premium' : 'featured',
        is_featured: true,
        status: 'approved',
        expires_at: expiryString
      });
    } else if (record.item_type === 'banner') {
      this.updateBanner(record.item_id, {
        is_active: true,
        end_date: expiryString.split('T')[0]
      });
    }
  }

  // --- REPORTS ---
  getReports(): AdvertReport[] {
    try {
      const raw = localStorage.getItem(KEYS.REPORTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  submitReport(report: Omit<AdvertReport, 'id' | 'status' | 'created_at'>): AdvertReport {
    const reports = this.getReports();
    const newReport: AdvertReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    reports.unshift(newReport);
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
    return newReport;
  }

  updateReportStatus(id: string, status: 'pending' | 'resolved' | 'dismissed'): boolean {
    const reports = this.getReports();
    const idx = reports.findIndex((r) => r.id === id);
    if (idx === -1) return null as unknown as boolean;
    reports[idx].status = status;
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
    return true;
  }

  // --- SITE SETTINGS ---
  getSiteSettings(): SiteSettings {
    try {
      const raw = localStorage.getItem(KEYS.SETTINGS);
      return raw ? JSON.parse(raw) : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  }

  updateSiteSettings(updates: Partial<SiteSettings>): SiteSettings {
    const current = this.getSiteSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // --- CLICK & VIEW TRACKING ---
  trackWhatsAppClick(type: 'business' | 'advert', id: string) {
    if (type === 'business') {
      const biz = this.getBusinessById(id);
      if (biz) {
        this.updateBusiness(id, { whatsapp_clicks: (biz.whatsapp_clicks || 0) + 1 });
      }
    } else {
      const adv = this.getAdvertById(id);
      if (adv) {
        this.updateAdvert(id, { whatsapp_clicks: (adv.whatsapp_clicks || 0) + 1 });
      }
    }
  }

  trackView(type: 'business' | 'advert' | 'banner', id: string) {
    if (type === 'business') {
      const biz = this.getBusinessById(id);
      if (biz) {
        this.updateBusiness(id, { views: (biz.views || 0) + 1 });
      }
    } else if (type === 'advert') {
      const adv = this.getAdvertById(id);
      if (adv) {
        this.updateAdvert(id, { views: (adv.views || 0) + 1 });
      }
    } else if (type === 'banner') {
      const banner = this.getBanners().find((b) => b.id === id);
      if (banner) {
        this.updateBanner(id, { views: (banner.views || 0) + 1 });
      }
    }
  }

  trackBannerClick(id: string) {
    const banner = this.getBanners().find((b) => b.id === id);
    if (banner) {
      this.updateBanner(id, { clicks: (banner.clicks || 0) + 1 });
    }
  }

  // --- AUTHENTICATION & USERS ---
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(KEYS.CURRENT_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  getRegisteredUsers(): User[] {
    try {
      const raw = localStorage.getItem(KEYS.REGISTERED_USERS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  login(email: string, password?: string): { success: boolean; user?: User; error?: string } {
    // If admin password is provided or admin email
    if (password === 'Chukwuyem291@' || (email.toLowerCase().includes('admin') && password === 'Chukwuyem291@')) {
      const adminUser: User = {
        id: 'admin-master',
        email: 'admin@ahavadigitalhub.com',
        full_name: 'AHAVA Administrator',
        phone: '+2348002428248',
        role: 'admin',
        created_at: new Date().toISOString()
      };
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }

    const users = this.getRegisteredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return { success: true, user };
    }
    // For convenience of testing: if new email, auto-create a user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      full_name: email.split('@')[0].toUpperCase(),
      phone: '+2348000000000',
      role: 'user',
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));
    return { success: true, user: newUser };
  }

  register(data: { email: string; full_name: string; phone: string; password?: string }): {
    success: boolean;
    user?: User;
    error?: string;
  } {
    const users = this.getRegisteredUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'A user with this email address already exists. Please log in.' };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      role: 'user',
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));
    return { success: true, user: newUser };
  }

  logout() {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }

  claimAdmin(secretKey: string): { success: boolean; error?: string } {
    const expectedSecret = 'Chukwuyem291@';
    if (secretKey.trim() !== expectedSecret) {
      return { success: false, error: 'Invalid Administrator password.' };
    }
    const adminUser: User = {
      id: 'admin-master',
      email: 'admin@ahavadigitalhub.com',
      full_name: 'AHAVA Administrator',
      phone: '+2348002428248',
      role: 'admin',
      created_at: new Date().toISOString()
    };
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(adminUser));
    return { success: true };
  }

  resetAllDemoData() {
    localStorage.removeItem(KEYS.BUSINESSES);
    localStorage.removeItem(KEYS.ADVERTS);
    localStorage.removeItem(KEYS.CATEGORIES);
    localStorage.removeItem(KEYS.PACKAGES);
    localStorage.removeItem(KEYS.BANNERS);
    localStorage.removeItem(KEYS.PAYMENTS);
    localStorage.removeItem(KEYS.REPORTS);
    localStorage.removeItem(KEYS.SETTINGS);
    this.initDefaultData();
  }
}

export const storageService = new StorageService();
