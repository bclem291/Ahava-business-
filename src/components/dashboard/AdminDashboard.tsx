import React, { useState } from 'react';
import {
  Business,
  Advert,
  Category,
  PricingPackage,
  BannerAd,
  PaymentRecord,
  AdvertReport,
  SiteSettings,
  User
} from '../../types';
import { storageService } from '../../services/storageService';
import { formatNaira, formatDate } from '../../utils/formatters';
import {
  ShieldCheck,
  Building2,
  Megaphone,
  FolderTree,
  Tag,
  CreditCard,
  Flag,
  Settings,
  Users,
  Image,
  CheckCircle,
  XCircle,
  Award,
  BadgeCheck,
  Trash2,
  Plus,
  Edit,
  Save,
  Eye,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  onViewBusiness: (biz: Business) => void;
  onViewAdvert: (adv: Advert) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onViewBusiness,
  onViewAdvert
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'businesses' | 'adverts' | 'categories' | 'packages' | 'banners' | 'payments' | 'reports' | 'settings' | 'users'
  >('overview');

  const [businesses, setBusinesses] = useState<Business[]>(storageService.getBusinesses());
  const [adverts, setAdverts] = useState<Advert[]>(storageService.getAdverts());
  const [categories, setCategories] = useState<Category[]>(storageService.getCategories());
  const [packages, setPackages] = useState<PricingPackage[]>(storageService.getPackages());
  const [banners, setBanners] = useState<BannerAd[]>(storageService.getBanners());
  const [payments, setPayments] = useState<PaymentRecord[]>(storageService.getPayments());
  const [reports, setReports] = useState<AdvertReport[]>(storageService.getReports());
  const [users, setUsers] = useState<User[]>(storageService.getRegisteredUsers());
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSiteSettings());

  // Category Edit / Add State
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // Banner Add State
  const [newBanner, setNewBanner] = useState<Partial<BannerAd> | null>(null);

  // Package Price Editing State
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageEditPrice, setPackageEditPrice] = useState<number>(0);

  // Refresh all state from storage
  const reloadData = () => {
    setBusinesses(storageService.getBusinesses());
    setAdverts(storageService.getAdverts());
    setCategories(storageService.getCategories());
    setPackages(storageService.getPackages());
    setBanners(storageService.getBanners());
    setPayments(storageService.getPayments());
    setReports(storageService.getReports());
    setUsers(storageService.getRegisteredUsers());
    setSettings(storageService.getSiteSettings());
  };

  // --- BUSINESS ACTIONS ---
  const handleApproveBusiness = (id: string) => {
    storageService.updateBusinessStatus(id, 'approved');
    reloadData();
  };

  const handleRejectBusiness = (id: string) => {
    const reason = prompt('Please enter the reason for rejection (will be shown to owner):', 'Incomplete address or missing business documentation');
    if (reason !== null) {
      storageService.updateBusinessStatus(id, 'rejected', reason);
      reloadData();
    }
  };

  const handleToggleVerified = (id: string, current: boolean) => {
    storageService.updateBusiness(id, { is_verified: !current });
    reloadData();
  };

  const handleToggleFeatured = (id: string, current: boolean) => {
    storageService.updateBusiness(id, { is_featured: !current });
    reloadData();
  };

  const handleDeleteBusiness = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this business?')) {
      storageService.deleteBusiness(id);
      reloadData();
    }
  };

  // --- ADVERT ACTIONS ---
  const handleApproveAdvert = (id: string) => {
    storageService.updateAdvertStatus(id, 'approved');
    reloadData();
  };

  const handleRejectAdvert = (id: string) => {
    const reason = prompt('Please enter the reason for rejecting this advert:', 'Misleading price or policy non-compliance');
    if (reason !== null) {
      storageService.updateAdvertStatus(id, 'rejected', reason);
      reloadData();
    }
  };

  const handleToggleFeaturedAdvert = (id: string, current: boolean) => {
    storageService.updateAdvert(id, { is_featured: !current });
    reloadData();
  };

  const handleDeleteAdvert = (id: string) => {
    if (confirm('Are you sure you want to delete this advert?')) {
      storageService.deleteAdvert(id);
      reloadData();
    }
  };

  // --- CATEGORY ACTIONS ---
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    if (editingCategory.id) {
      storageService.updateCategory(editingCategory.id, editingCategory);
    } else {
      storageService.addCategory({
        name: editingCategory.name,
        slug: editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon_name: editingCategory.icon_name || 'Folder',
        description: editingCategory.description || ''
      });
    }
    setEditingCategory(null);
    reloadData();
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      storageService.deleteCategory(id);
      reloadData();
    }
  };

  // --- PACKAGE PRICE CHANGE ---
  const handleSavePackagePrice = (pkgId: string) => {
    storageService.updatePackage(pkgId, { price: packageEditPrice });
    setEditingPackageId(null);
    reloadData();
  };

  // --- BANNER ACTIONS ---
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner?.title || !newBanner?.image_url) return;

    storageService.addBanner({
      title: newBanner.title,
      image_url: newBanner.image_url,
      destination_url: newBanner.destination_url || 'https://ahavabusinesshub.com',
      slot: newBanner.slot || 'homepage_top',
      start_date: newBanner.start_date || new Date().toISOString().split('T')[0],
      end_date: newBanner.end_date || '2026-12-31',
      is_active: true,
      advertiser_name: newBanner.advertiser_name || 'Advertiser',
      advertiser_email: newBanner.advertiser_email || 'ad@business.ng'
    });
    setNewBanner(null);
    reloadData();
  };

  const handleToggleBannerActive = (id: string, current: boolean) => {
    storageService.updateBanner(id, { is_active: !current });
    reloadData();
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('Delete this banner?')) {
      storageService.deleteBanner(id);
      reloadData();
    }
  };

  // --- REPORT ACTIONS ---
  const handleResolveReport = (id: string) => {
    storageService.updateReportStatus(id, 'resolved');
    reloadData();
  };

  const handleDismissReport = (id: string) => {
    storageService.updateReportStatus(id, 'dismissed');
    reloadData();
  };

  // --- SETTINGS ACTIONS ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateSiteSettings(settings);
    alert('Platform settings saved successfully!');
    reloadData();
  };

  // Stats
  const totalRevenue = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingBusinessesCount = businesses.filter((b) => b.status === 'pending').length;
  const pendingAdvertsCount = adverts.filter((a) => a.status === 'pending').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-black flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              Super Administrator Access
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Ahava Hub Master Control Panel</h1>
          <p className="text-xs sm:text-sm text-sky-200 font-medium mt-1">
            Moderate listings, configure Paystack packages, manage homepage banners, and audit revenue.
          </p>
        </div>

        <button
          onClick={reloadData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition-all border border-white/20 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Admin Top Navigation Tabs */}
      <div className="flex border-b border-sky-300 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-4 py-3 font-black text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'overview' ? 'border-blue-950 text-blue-950 bg-sky-100/50 rounded-t-xl' : 'border-transparent text-slate-800 hover:text-slate-950'
          }`}
        >
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('businesses')}
          className={`flex items-center gap-1.5 px-4 py-3 font-black text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'businesses' ? 'border-blue-950 text-blue-950 bg-sky-100/50 rounded-t-xl' : 'border-transparent text-slate-800 hover:text-slate-950'
          }`}
        >
          <span>Businesses ({businesses.length})</span>
          {pendingBusinessesCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-black">
              {pendingBusinessesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('adverts')}
          className={`flex items-center gap-1.5 px-4 py-3 font-black text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'adverts' ? 'border-blue-950 text-blue-950 bg-sky-100/50 rounded-t-xl' : 'border-transparent text-slate-800 hover:text-slate-950'
          }`}
        >
          <span>Adverts ({adverts.length})</span>
          {pendingAdvertsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-black">
              {pendingAdvertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-1.5 px-4 py-3 font-black text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'categories' ? 'border-blue-950 text-blue-950 bg-sky-100/50 rounded-t-xl' : 'border-transparent text-slate-800 hover:text-slate-950'
          }`}
        >
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-1.5 px-4 py-3 font-black text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'packages' ? 'border-blue-950 text-blue-950 bg-sky-100/50 rounded-t-xl' : 'border-transparent text-slate-800 hover:text-slate-950'
          }`}
        >
          <span>Pricing & Packages</span>
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-1.5 px-4 py-3 font-black text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'banners' ? 'border-blue-950 text-blue-950 bg-sky-100/50 rounded-t-xl' : 'border-transparent text-slate-800 hover:text-slate-950'
          }`}
        >
          <span>Banners ({banners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-1.5 px-4 py-3 font-black text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'payments' ? 'border-blue-950 text-blue-950 bg-sky-100/50 rounded-t-xl' : 'border-transparent text-slate-800 hover:text-slate-950'
          }`}
        >
          <span>Transactions ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-1.5 px-4 py-3 font-black text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'reports' ? 'border-blue-950 text-blue-950 bg-sky-100/50 rounded-t-xl' : 'border-transparent text-slate-800 hover:text-slate-950'
          }`}
        >
          <span>Flagged Reports ({reports.length})</span>
          {pendingReportsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-black">
              {pendingReportsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-4 py-3 font-black text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'settings' ? 'border-blue-950 text-blue-950 bg-sky-100/50 rounded-t-xl' : 'border-transparent text-slate-800 hover:text-slate-950'
          }`}
        >
          <span>Website Settings</span>
        </button>
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider block mb-1">
                Total Users
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">{users.length}</div>
              <span className="text-[11px] text-slate-800 font-bold mt-1 block">Registered</span>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider block mb-1">
                Businesses
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">{businesses.length}</div>
              <span className="text-[11px] text-amber-800 font-black mt-1 block">
                {pendingBusinessesCount} pending review
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider block mb-1">
                Adverts
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">{adverts.length}</div>
              <span className="text-[11px] text-amber-800 font-black mt-1 block">
                {pendingAdvertsCount} pending review
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider block mb-1">
                Active Banners
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">
                {banners.filter((b) => b.is_active).length}
              </div>
              <span className="text-[11px] text-emerald-800 font-black mt-1 block">Displaying</span>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm col-span-2 lg:col-span-1">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider block mb-1">
                Gross Revenue
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                {formatNaira(totalRevenue)}
              </div>
              <span className="text-[11px] text-slate-800 font-bold mt-1 block">Paystack Verified</span>
            </div>
          </div>

          {/* Pending Moderation Attention Box */}
          {(pendingBusinessesCount > 0 || pendingAdvertsCount > 0 || pendingReportsCount > 0) && (
            <div className="p-6 rounded-3xl bg-amber-100/80 border border-amber-300 space-y-3">
              <h3 className="font-black text-amber-950 text-base flex items-center gap-2">
                <Award className="w-4 h-4 fill-amber-500 text-amber-700" />
                <span>Pending Items Requiring Administrator Moderation:</span>
              </h3>
              <div className="flex flex-wrap gap-4 text-xs font-bold">
                {pendingBusinessesCount > 0 && (
                  <button
                    onClick={() => setActiveTab('businesses')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-200 text-amber-950 hover:bg-amber-300 border border-amber-400 shadow-xs"
                  >
                    {pendingBusinessesCount} Business Listing(s) Pending Approval →
                  </button>
                )}
                {pendingAdvertsCount > 0 && (
                  <button
                    onClick={() => setActiveTab('adverts')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-200 text-amber-950 hover:bg-amber-300 border border-amber-400 shadow-xs"
                  >
                    {pendingAdvertsCount} Marketplace Advert(s) Pending Review →
                  </button>
                )}
                {pendingReportsCount > 0 && (
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="px-3.5 py-1.5 rounded-xl bg-red-200 text-red-950 hover:bg-red-300 border border-red-400 shadow-xs"
                  >
                    {pendingReportsCount} User Advert Flag(s) to Resolve →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: BUSINESSES */}
      {activeTab === 'businesses' && (
        <div className="bg-sky-50 rounded-3xl border border-sky-300 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-sky-200 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-950 text-base">Directory Business Listings</h3>
              <p className="text-xs text-slate-800 font-medium">Approve, verify, feature, or remove business profiles</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sky-100 text-blue-950 font-black border-b border-sky-300">
                <tr>
                  <th className="p-4">Business</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Tier</th>
                  <th className="p-4 text-right">Moderation Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-200">
                {businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-sky-100/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.logo_url || b.images?.[0]}
                          alt={b.name}
                          className="w-10 h-10 rounded-lg object-cover border border-sky-300 bg-sky-100"
                        />
                        <div>
                          <span className="font-black text-slate-950 text-sm block">{b.name}</span>
                          <span className="text-[11px] text-slate-700 font-bold">Owner: {b.user_name || 'Merchant'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-900 font-bold">{b.category}</td>
                    <td className="p-4 text-slate-800 font-semibold">{b.city}, {b.state}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-black ${
                          b.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                            : b.status === 'pending'
                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                            : 'bg-red-100 text-red-950 border border-red-300'
                        }`}
                      >
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-sky-200 border border-sky-300 text-blue-950 font-black capitalize">
                        {b.package_tier}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewBusiness(b)}
                          title="View Profile"
                          className="p-1.5 rounded-lg border border-sky-300 text-slate-900 bg-sky-100 hover:bg-sky-200 font-bold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleVerified(b.id, b.is_verified)}
                          title={b.is_verified ? 'Remove Verified Badge' : 'Award Verified Badge'}
                          className={`p-1.5 rounded-lg border text-xs font-black ${
                            b.is_verified ? 'bg-sky-200 border-sky-400 text-blue-950' : 'border-sky-300 text-slate-600 hover:text-sky-800 bg-sky-100/50'
                          }`}
                        >
                          <BadgeCheck className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleFeatured(b.id, b.is_featured)}
                          title={b.is_featured ? 'Remove Featured Placement' : 'Make Featured'}
                          className={`p-1.5 rounded-lg border text-xs font-black ${
                            b.is_featured ? 'bg-amber-200 border-amber-400 text-amber-950' : 'border-sky-300 text-slate-600 hover:text-amber-700 bg-sky-100/50'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>

                        {b.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveBusiness(b.id)}
                            title="Approve Listing"
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {b.status !== 'rejected' && (
                          <button
                            onClick={() => handleRejectBusiness(b.id)}
                            title="Reject Listing"
                            className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteBusiness(b.id)}
                          title="Delete Business"
                          className="p-1.5 rounded-lg border border-red-300 text-red-700 bg-red-100 hover:bg-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: ADVERTS */}
      {activeTab === 'adverts' && (
        <div className="bg-sky-50 rounded-3xl border border-sky-300 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-sky-200 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-950 text-base">Marketplace Product & Service Adverts</h3>
              <p className="text-xs text-slate-800 font-medium">Review submitted advertisements before and after publishing</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sky-100 text-blue-950 font-black border-b border-sky-300">
                <tr>
                  <th className="p-4">Advert</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-200">
                {adverts.map((a) => (
                  <tr key={a.id} className="hover:bg-sky-100/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={a.images?.[0]}
                          alt={a.title}
                          className="w-10 h-10 rounded-lg object-cover border border-sky-300 bg-sky-100"
                        />
                        <div>
                          <span className="font-black text-slate-950 text-sm block truncate max-w-sm">{a.title}</span>
                          <span className="text-[11px] text-slate-700 font-bold">Seller: {a.business_name || a.user_name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-black text-blue-950">{formatNaira(a.price)}</td>
                    <td className="p-4 text-slate-900 font-bold">{a.category}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-black ${
                          a.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                            : a.status === 'pending'
                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                            : 'bg-red-100 text-red-950 border border-red-300'
                        }`}
                      >
                        {a.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewAdvert(a)}
                          title="View Advert"
                          className="p-1.5 rounded-lg border border-sky-300 text-slate-900 bg-sky-100 hover:bg-sky-200 font-bold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleFeaturedAdvert(a.id, a.is_featured)}
                          title={a.is_featured ? 'Remove Featured Placement' : 'Make Featured'}
                          className={`p-1.5 rounded-lg border text-xs font-black ${
                            a.is_featured ? 'bg-amber-200 border-amber-400 text-amber-950' : 'border-sky-300 text-slate-600 hover:text-amber-700 bg-sky-100/50'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>

                        {a.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveAdvert(a.id)}
                            title="Approve Advert"
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {a.status !== 'rejected' && (
                          <button
                            onClick={() => handleRejectAdvert(a.id)}
                            title="Reject Advert"
                            className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteAdvert(a.id)}
                          title="Delete Advert"
                          className="p-1.5 rounded-lg border border-red-300 text-red-700 bg-red-100 hover:bg-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-sky-50 p-6 rounded-3xl border border-sky-300 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-950 text-base">Category Management</h3>
              <p className="text-xs text-slate-800 font-medium">Add, edit, or delete directory & marketplace categories</p>
            </div>
            <button
              onClick={() => setEditingCategory({ name: '', icon_name: 'Folder', description: '' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-black shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>

          {editingCategory && (
            <div className="p-6 rounded-3xl bg-sky-100/90 border border-sky-300 shadow-md animate-in fade-in">
              <h4 className="font-black text-slate-950 text-sm mb-4">
                {editingCategory.id ? 'Edit Category' : 'Create New Category'}
              </h4>
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Category Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Solar & Renewable Energy"
                      value={editingCategory.name || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-sky-300 bg-sky-50 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Lucide Icon Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Scissors, Smartphone, Hammer"
                      value={editingCategory.icon_name || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, icon_name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-sky-300 bg-sky-50 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-blue-950 block mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Short description of items in this category"
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-sky-300 bg-sky-50 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-3 py-1.5 rounded-lg border border-sky-300 text-xs font-bold text-slate-800 bg-sky-50 hover:bg-sky-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-black text-xs shadow-md"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-slate-950 text-sm mb-1">{c.name}</h4>
                  <p className="text-[11px] text-slate-800 font-medium line-clamp-2">{c.description}</p>
                </div>
                <div className="pt-3 border-t border-sky-200 mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-bold">{c.count || 0} listings</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingCategory(c)}
                      className="p-1 text-slate-800 hover:text-blue-950 font-bold"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1 text-red-600 hover:text-red-800 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PRICING & PACKAGES */}
      {activeTab === 'packages' && (
        <div className="bg-sky-50 rounded-3xl border border-sky-300 shadow-sm overflow-hidden p-6 space-y-6">
          <div>
            <h3 className="font-black text-slate-950 text-base">Advertising Packages & Dynamic Price Editor</h3>
            <p className="text-xs text-slate-800 font-medium">
              As requested: You can modify subscription fees and advert prices here instantly without touching code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-6 rounded-2xl border border-sky-300 bg-sky-100/70 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">{pkg.type}</span>
                    {pkg.popular && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-200 border border-sky-300 text-blue-950 text-[10px] font-black">
                        Popular
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-slate-950 text-base">{pkg.name}</h4>

                  {/* Price display or edit box */}
                  <div className="my-3">
                    {editingPackageId === pkg.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-950">₦</span>
                        <input
                          type="number"
                          value={packageEditPrice}
                          onChange={(e) => setPackageEditPrice(Number(e.target.value))}
                          className="w-28 p-1.5 text-sm font-black border border-sky-400 rounded-lg bg-sky-50 text-slate-950"
                        />
                        <button
                          onClick={() => handleSavePackagePrice(pkg.id)}
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-black text-blue-950">
                          {formatNaira(pkg.price)}
                        </div>
                        <button
                          onClick={() => {
                            setEditingPackageId(pkg.id);
                            setPackageEditPrice(pkg.price);
                          }}
                          className="text-xs font-black text-sky-800 hover:text-blue-950 underline"
                        >
                          Change Price
                        </button>
                      </div>
                    )}
                    <span className="text-xs text-slate-700 font-bold">{pkg.duration_label}</span>
                  </div>

                  <ul className="text-xs text-slate-800 font-bold space-y-1.5 my-4">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-sky-700 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: BANNERS */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="bg-sky-50 p-6 rounded-3xl border border-sky-300 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-950 text-base">Homepage Banner Advertisements</h3>
              <p className="text-xs text-slate-800 font-medium">Manage high-impact display advertisements on the homepage</p>
            </div>
            <button
              onClick={() =>
                setNewBanner({
                  title: '',
                  image_url: '',
                  destination_url: '',
                  slot: 'homepage_top',
                  advertiser_name: ''
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-black shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Banner</span>
            </button>
          </div>

          {newBanner && (
            <div className="p-6 rounded-3xl bg-sky-100/90 border border-sky-300 shadow-md animate-in fade-in">
              <h4 className="font-black text-slate-950 text-sm mb-4">Add Homepage Banner Ad</h4>
              <form onSubmit={handleSaveBanner} className="space-y-3">
                <div>
                  <label className="text-xs font-black text-blue-950 block mb-1">Banner Headline Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special 20% Discount for Small Businesses"
                    value={newBanner.title || ''}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-sky-300 bg-sky-50 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Banner Image URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={newBanner.image_url || ''}
                      onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-sky-300 bg-sky-50 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Clickable Destination URL</label>
                    <input
                      type="url"
                      placeholder="https://clientwebsite.com or WhatsApp link"
                      value={newBanner.destination_url || ''}
                      onChange={(e) => setNewBanner({ ...newBanner, destination_url: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-sky-300 bg-sky-50 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Slot Position</label>
                    <select
                      value={newBanner.slot || 'homepage_top'}
                      onChange={(e) =>
                        setNewBanner({ ...newBanner, slot: e.target.value as 'homepage_top' | 'homepage_middle' })
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-sky-300 bg-sky-50 text-slate-950 font-bold focus:outline-none focus:border-sky-600"
                    >
                      <option value="homepage_top">Homepage Top</option>
                      <option value="homepage_middle">Homepage Middle</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Advertiser Name</label>
                    <input
                      type="text"
                      placeholder="Brand or Merchant Name"
                      value={newBanner.advertiser_name || ''}
                      onChange={(e) => setNewBanner({ ...newBanner, advertiser_name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-sky-300 bg-sky-50 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Advertiser Email</label>
                    <input
                      type="email"
                      placeholder="advertiser@email.com"
                      value={newBanner.advertiser_email || ''}
                      onChange={(e) => setNewBanner({ ...newBanner, advertiser_email: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-sky-300 bg-sky-50 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setNewBanner(null)}
                    className="px-3 py-1.5 rounded-lg border border-sky-300 text-xs font-bold text-slate-800 bg-sky-50 hover:bg-sky-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-black text-xs shadow-md"
                  >
                    Publish Banner
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((ban) => (
              <div key={ban.id} className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm space-y-3">
                <div className="h-32 rounded-xl overflow-hidden bg-slate-900 relative">
                  <img src={ban.image_url} alt={ban.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                    {ban.slot}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-slate-950 text-sm">{ban.title}</h4>
                  <p className="text-xs text-slate-800 font-medium mt-0.5 truncate">Link: {ban.destination_url}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-800 font-bold mt-2">
                    <span>Views: {ban.views}</span>
                    <span>Clicks: {ban.clicks}</span>
                    <span className={ban.is_active ? 'text-emerald-800 font-black' : 'text-slate-600 font-bold'}>
                      {ban.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-sky-200">
                  <button
                    onClick={() => handleToggleBannerActive(ban.id, ban.is_active)}
                    className="px-3 py-1 rounded-lg border border-sky-300 bg-sky-100 hover:bg-sky-200 text-xs font-bold text-slate-900"
                  >
                    {ban.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(ban.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 border border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-sky-50 rounded-3xl border border-sky-300 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-sky-200 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-950 text-base">Paystack Payment Audit Trail</h3>
              <p className="text-xs text-slate-800 font-medium">Every successful and recorded subscription transaction</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-700 font-black uppercase tracking-wider block">Total Recorded</span>
              <span className="text-lg font-black text-emerald-800">{formatNaira(totalRevenue)}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sky-100 text-blue-950 font-black border-b border-sky-300">
                <tr>
                  <th className="p-4">Paystack Ref</th>
                  <th className="p-4">Payer / Business</th>
                  <th className="p-4">Package Item</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-200">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-sky-100/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-950">{p.reference}</td>
                    <td className="p-4">
                      <span className="font-black text-slate-950 block">{p.user_name}</span>
                      <span className="text-[11px] text-slate-700 font-semibold">{p.user_email}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-950 block">{p.package_name}</span>
                      <span className="text-[11px] text-slate-800 font-medium truncate max-w-xs block">{p.item_title}</span>
                    </td>
                    <td className="p-4 font-black text-blue-950">{formatNaira(p.amount)}</td>
                    <td className="p-4 capitalize text-slate-800 font-bold">{p.channel || 'Paystack'}</td>
                    <td className="p-4 text-slate-700 font-bold">{formatDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-sky-50 rounded-3xl border border-sky-300 shadow-sm overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="font-black text-slate-950 text-base">Flagged Advert Reports</h3>
            <p className="text-xs text-slate-800 font-medium">Respond to reported spam, counterfeit, or misleading adverts</p>
          </div>

          {reports.length === 0 ? (
            <div className="p-8 text-center text-slate-700 font-bold text-xs">
              No reported adverts currently on file. Clean directory!
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl border border-sky-300 bg-sky-100/70 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-red-700 block">{r.reason}</span>
                    <h4 className="font-black text-slate-950 text-sm mt-0.5">{r.advert_title}</h4>
                    <p className="text-xs text-slate-700 font-semibold">Reported by {r.reporter_email} • {formatDate(r.created_at)}</p>
                    {r.details && <p className="text-xs text-slate-900 font-medium mt-1 italic">"{r.details}"</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolveReport(r.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleDismissReport(r.id)}
                      className="px-3 py-1.5 rounded-lg border border-sky-300 bg-sky-50 text-slate-900 font-bold text-xs hover:bg-sky-200"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-sky-50 rounded-3xl border border-sky-300 shadow-sm p-6 sm:p-8">
          <h3 className="font-black text-slate-950 text-lg mb-1">Website Content & Settings</h3>
          <p className="text-xs text-slate-800 font-medium mb-6">
            Configure contact information, header announcements, and platform moderation preferences.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
            <div>
              <label className="text-xs font-black text-blue-950 block mb-1">Homepage Announcement Bar</label>
              <input
                type="text"
                value={settings.announcement_text || ''}
                onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 text-slate-950 font-bold focus:outline-none focus:border-sky-600 focus:bg-sky-50"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show_announcement"
                checked={settings.show_announcement}
                onChange={(e) => setSettings({ ...settings, show_announcement: e.target.checked })}
                className="w-4 h-4 rounded text-blue-950"
              />
              <label htmlFor="show_announcement" className="text-xs font-bold text-slate-950 cursor-pointer">
                Display Announcement Banner on Top of Website
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-black text-blue-950 block mb-1">Official WhatsApp Desk</label>
                <input
                  type="text"
                  value={settings.contact_whatsapp}
                  onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 text-slate-950 font-bold focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                />
              </div>

              <div>
                <label className="text-xs font-black text-blue-950 block mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 text-slate-950 font-bold focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-blue-950 block mb-1">Office Address</label>
              <input
                type="text"
                value={settings.office_address}
                onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 text-slate-950 font-bold focus:outline-none focus:border-sky-600 focus:bg-sky-50"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-xs shadow-md"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
