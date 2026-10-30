import React, { useState } from 'react';
import { Business, Advert, PricingPackage, PaymentRecord, User } from '../../types';
import { storageService } from '../../services/storageService';
import { NIGERIAN_STATES } from '../../data/defaultData';
import { formatNaira, formatDate, getDaysRemaining } from '../../utils/formatters';
import {
  Building2,
  Megaphone,
  CreditCard,
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  MessageCircle,
  Eye,
  Award,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onUpgradePackage: (pkg: PricingPackage, itemId: string, itemType: 'listing' | 'advert', title: string) => void;
  onViewBusiness: (biz: Business) => void;
  onViewAdvert: (adv: Advert) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onUpgradePackage,
  onViewBusiness,
  onViewAdvert
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'businesses' | 'adverts' | 'payments' | 'upgrade'>('overview');
  const [editingBusiness, setEditingBusiness] = useState<Partial<Business> | null>(null);
  const [editingAdvert, setEditingAdvert] = useState<Partial<Advert> | null>(null);
  const [formSuccess, setFormSuccess] = useState('');

  const allBusinesses = storageService.getBusinesses();
  const allAdverts = storageService.getAdverts();
  const categories = storageService.getCategories();
  const packages = storageService.getPackages();
  const payments = storageService.getPayments().filter((p) => p.user_id === user.id || p.user_email === user.email);

  // Filter items owned by this user (or if admin, show items)
  const myBusinesses = allBusinesses.filter((b) => b.user_id === user.id || b.user_name === user.full_name);
  const myAdverts = allAdverts.filter((a) => a.user_id === user.id || a.user_name === user.full_name);

  // Compute aggregate statistics
  const totalListingViews = myBusinesses.reduce((acc, b) => acc + (b.views || 0), 0);
  const totalListingClicks = myBusinesses.reduce((acc, b) => acc + (b.whatsapp_clicks || 0), 0);
  const totalAdvertViews = myAdverts.reduce((acc, a) => acc + (a.views || 0), 0);
  const totalAdvertClicks = myAdverts.reduce((acc, a) => acc + (a.whatsapp_clicks || 0), 0);

  // --- BUSINESS FORM HANDLERS ---
  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness?.name || !editingBusiness?.category || !editingBusiness?.state || !editingBusiness?.whatsapp) {
      alert('Please fill all required business fields.');
      return;
    }

    if (editingBusiness.id) {
      storageService.updateBusiness(editingBusiness.id, editingBusiness);
      setFormSuccess('Business listing updated successfully!');
    } else {
      storageService.createBusiness({
        user_id: user.id,
        user_name: user.full_name,
        name: editingBusiness.name,
        slug: editingBusiness.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: editingBusiness.category,
        description: editingBusiness.description || '',
        logo_url: editingBusiness.logo_url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80',
        images: editingBusiness.images?.length ? editingBusiness.images : ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'],
        state: editingBusiness.state,
        city: editingBusiness.city || 'Central',
        address: editingBusiness.address || '',
        phone: editingBusiness.phone || user.phone,
        whatsapp: editingBusiness.whatsapp || user.phone,
        website: editingBusiness.website || '',
        opening_hours: editingBusiness.opening_hours || 'Mon - Sat: 8:00 AM - 6:00 PM',
        products_services: editingBusiness.products_services || [],
        is_verified: false,
        is_featured: false,
        package_tier: 'free',
        status: 'pending' // Submitted for admin approval
      });
      setFormSuccess('Business listing submitted! It will appear on the directory once reviewed by moderators.');
    }

    setEditingBusiness(null);
    setTimeout(() => setFormSuccess(''), 4000);
  };

  // --- ADVERT FORM HANDLERS ---
  const handleSaveAdvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdvert?.title || !editingAdvert?.category || !editingAdvert?.whatsapp) {
      alert('Please fill all required advert fields.');
      return;
    }

    if (editingAdvert.id) {
      storageService.updateAdvert(editingAdvert.id, editingAdvert);
      setFormSuccess('Advert updated successfully!');
    } else {
      const parentBiz = myBusinesses[0];
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);

      storageService.createAdvert({
        user_id: user.id,
        user_name: user.full_name,
        business_id: parentBiz?.id,
        business_name: parentBiz?.name || user.full_name,
        title: editingAdvert.title,
        slug: editingAdvert.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: editingAdvert.category,
        description: editingAdvert.description || '',
        price: Number(editingAdvert.price) || 0,
        is_negotiable: Boolean(editingAdvert.is_negotiable),
        images: editingAdvert.images?.length ? editingAdvert.images : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'],
        state: editingAdvert.state || myBusinesses[0]?.state || 'Lagos',
        city: editingAdvert.city || myBusinesses[0]?.city || 'Ikeja',
        whatsapp: editingAdvert.whatsapp || user.phone,
        external_url: editingAdvert.external_url || '',
        package_tier: 'standard',
        is_featured: false,
        status: 'pending',
        duration_days: 30,
        expires_at: expiry.toISOString()
      });
      setFormSuccess('Product / Service Advert submitted for approval!');
    }

    setEditingAdvert(null);
    setTimeout(() => setFormSuccess(''), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black">
            <CheckCircle className="w-3.5 h-3.5" />
            Approved & Live
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black">
            <Clock className="w-3.5 h-3.5" />
            Under Moderation
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-900 border border-red-300 text-xs font-black">
            <XCircle className="w-3.5 h-3.5" />
            Needs Amendment
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 border border-slate-300 text-xs font-black">
            <AlertCircle className="w-3.5 h-3.5" />
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Greeting Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold mb-2">
            Business Owner Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Welcome, {user.full_name}</h1>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 font-medium">
            Registered Email: {user.email} • WhatsApp: {user.phone}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setEditingBusiness({
                name: '',
                category: categories[0]?.name || 'Fashion and Beauty',
                state: 'Lagos',
                city: 'Ikeja',
                whatsapp: user.phone,
                phone: user.phone,
                products_services: []
              });
              setActiveTab('businesses');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-100 text-blue-950 font-black text-xs shadow-md hover:bg-sky-200 transition-all active:scale-95 border border-sky-300"
          >
            <Plus className="w-4 h-4" />
            <span>Add Business Listing</span>
          </button>

          <button
            onClick={() => {
              setEditingAdvert({
                title: '',
                category: categories[0]?.name || 'Fashion and Beauty',
                whatsapp: user.phone,
                price: 0
              });
              setActiveTab('adverts');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
          >
            <Megaphone className="w-4 h-4" />
            <span>Post New Advert</span>
          </button>
        </div>
      </div>

      {formSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-black flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-sky-300 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 font-black text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'overview' ? 'border-blue-950 text-blue-950 bg-sky-100/60' : 'border-transparent text-slate-700 hover:text-blue-950'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview & Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('businesses')}
          className={`flex items-center gap-2 px-5 py-3 font-black text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'businesses' ? 'border-blue-950 text-blue-950 bg-sky-100/60' : 'border-transparent text-slate-700 hover:text-blue-950'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>My Businesses ({myBusinesses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('adverts')}
          className={`flex items-center gap-2 px-5 py-3 font-black text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'adverts' ? 'border-blue-950 text-blue-950 bg-sky-100/60' : 'border-transparent text-slate-700 hover:text-blue-950'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>My Adverts ({myAdverts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-5 py-3 font-black text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'payments' ? 'border-blue-950 text-blue-950 bg-sky-100/60' : 'border-transparent text-slate-700 hover:text-blue-950'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment History ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upgrade')}
          className={`flex items-center gap-2 px-5 py-3 font-black text-xs sm:text-sm whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'upgrade' ? 'border-blue-950 text-blue-950 bg-sky-100/60' : 'border-transparent text-slate-700 hover:text-blue-950'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-blue-900" />
          <span>Promote & Packages</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider block mb-1">
                Active Listings
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">
                {myBusinesses.length}
              </div>
              <span className="text-[11px] text-sky-800 font-bold mt-1 block">
                Directory profiles
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider block mb-1">
                Active Adverts
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">
                {myAdverts.length}
              </div>
              <span className="text-[11px] text-sky-800 font-bold mt-1 block">
                Products & Services
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider block mb-1">
                Total Views
              </span>
              <div className="text-2xl sm:text-3xl font-black text-blue-950">
                {totalListingViews + totalAdvertViews}
              </div>
              <span className="text-[11px] text-slate-700 font-bold mt-1 block">
                Customer impressions
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider block mb-1">
                WhatsApp Inquiries
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800">
                {totalListingClicks + totalAdvertClicks}
              </div>
              <span className="text-[11px] text-emerald-800 font-bold mt-1 block">
                Direct buyer contacts
              </span>
            </div>
          </div>

          {/* Quick Guidance Card */}
          <div className="p-6 rounded-3xl bg-sky-100/90 border border-sky-300 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-950 text-base">
                How to get 5x more customer inquiries on Ahava Business Hub:
              </h3>
              <ul className="text-xs text-slate-800 font-medium mt-2 space-y-1 list-disc list-inside">
                <li>Upload high-quality, authentic photos of your products and shop location.</li>
                <li>Upgrade to a <strong className="font-black text-blue-950">Premium Listing</strong> or <strong className="font-black text-blue-950">Featured Advert</strong> for priority ranking.</li>
                <li>Keep your WhatsApp number active and respond quickly to prospective buyers.</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('upgrade')}
              className="px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-xs whitespace-nowrap shadow-md"
            >
              Explore Growth Packages
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MY BUSINESSES */}
      {activeTab === 'businesses' && (
        <div className="space-y-6">
          {editingBusiness ? (
            /* Business Edit Form */
            <div className="bg-sky-50 p-6 sm:p-8 rounded-3xl border border-sky-300 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-sky-200 mb-6">
                <h3 className="text-lg font-black text-slate-950">
                  {editingBusiness.id ? 'Edit Business Information' : 'Add New Business Profile'}
                </h3>
                <button
                  onClick={() => setEditingBusiness(null)}
                  className="text-xs font-black text-slate-700 hover:text-blue-950"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveBusiness} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Clean Energy & Solar"
                      value={editingBusiness.name || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, name: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Category *</label>
                    <select
                      value={editingBusiness.category || categories[0]?.name}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, category: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 focus:outline-none focus:border-sky-500 bg-sky-100/70 text-slate-950 font-bold"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">State (Nigeria) *</label>
                    <select
                      value={editingBusiness.state || 'Lagos'}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, state: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 focus:outline-none focus:border-sky-500 bg-sky-100/70 text-slate-950 font-bold"
                    >
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s.state} value={s.state}>
                          {s.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">City or Town *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ikeja, Lekki, Wuse 2"
                      value={editingBusiness.city || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, city: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Address / Street</label>
                    <input
                      type="text"
                      placeholder="e.g. 14 Commercial Avenue"
                      value={editingBusiness.address || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, address: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08035551234 or +234..."
                      value={editingBusiness.whatsapp || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, whatsapp: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 08035551234"
                      value={editingBusiness.phone || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, phone: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-blue-950 block mb-1">Business Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what your business does, key values, experience..."
                    value={editingBusiness.description || ''}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, description: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Logo Image URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editingBusiness.logo_url || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, logo_url: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-blue-950 block mb-1">Official Website (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://mybusiness.ng"
                      value={editingBusiness.website || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, website: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-200">
                  <button
                    type="button"
                    onClick={() => setEditingBusiness(null)}
                    className="px-4 py-2.5 rounded-xl border border-sky-300 text-xs font-black text-slate-800 hover:bg-sky-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-xs shadow-md"
                  >
                    Save Business Listing
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {myBusinesses.length === 0 ? (
                <div className="p-8 text-center bg-sky-50 rounded-3xl border border-sky-300">
                  <Building2 className="w-12 h-12 text-sky-400 mx-auto mb-3" />
                  <h3 className="font-black text-slate-950 text-base">You have not listed any business yet.</h3>
                  <p className="text-xs text-slate-800 font-medium max-w-md mx-auto mt-1 mb-4">
                    List your business now to get verified, receive WhatsApp inquiries, and build trust with customers across Nigeria.
                  </p>
                  <button
                    onClick={() =>
                      setEditingBusiness({
                        name: '',
                        category: categories[0]?.name || 'Fashion and Beauty',
                        state: 'Lagos',
                        city: 'Ikeja',
                        whatsapp: user.phone
                      })
                    }
                    className="px-5 py-2.5 rounded-xl bg-blue-950 text-white font-black text-xs"
                  >
                    Create Business Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBusinesses.map((biz) => {
                    const { days, isExpired } = getDaysRemaining(biz.expires_at);
                    const premiumPkg = packages.find((p) => p.id === 'pkg-premium-listing') || packages[2];

                    return (
                      <div
                        key={biz.id}
                        className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={biz.logo_url || biz.images?.[0]}
                            alt={biz.name}
                            className="w-16 h-16 rounded-xl object-cover border border-sky-300"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-slate-950 text-base">{biz.name}</h4>
                              {biz.is_featured && (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-400 text-[10px] font-black flex items-center gap-1">
                                  <Award className="w-3 h-3 fill-current" />
                                  Featured
                                </span>
                              )}
                              {getStatusBadge(biz.status)}
                            </div>
                            <p className="text-xs text-slate-800 font-semibold mt-1">
                              {biz.category} • {biz.city}, {biz.state} • WhatsApp: {biz.whatsapp}
                            </p>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-700 mt-1">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-sky-700" /> {biz.views || 0} views
                              </span>
                              <span className="flex items-center gap-1 text-emerald-800">
                                <MessageCircle className="w-3.5 h-3.5" /> {biz.whatsapp_clicks || 0} chats
                              </span>
                              {biz.package_tier !== 'free' && (
                                <span className="text-slate-600 font-medium">
                                  {isExpired ? 'Listing Expired' : `${days} days left`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                          <button
                            onClick={() => onViewBusiness(biz)}
                            className="px-3 py-1.5 rounded-lg border border-sky-300 bg-sky-100 hover:bg-sky-200 text-xs font-black text-slate-950 flex items-center gap-1"
                          >
                            <span>Preview</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => setEditingBusiness(biz)}
                            className="px-3 py-1.5 rounded-lg border border-sky-300 bg-sky-100 hover:bg-sky-200 text-xs font-black text-slate-950 flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          {!biz.is_featured && (
                            <button
                              onClick={() => onUpgradePackage(premiumPkg, biz.id, 'listing', biz.name)}
                              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm border border-amber-500"
                            >
                              <Award className="w-3 h-3 fill-current" />
                              <span>Promote to Featured</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 3: MY ADVERTS */}
      {activeTab === 'adverts' && (
        <div className="space-y-6">
          {editingAdvert ? (
            /* Advert Submission Form */
            <div className="bg-sky-50 p-6 sm:p-8 rounded-3xl border border-sky-300 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-sky-200 mb-6">
                <h3 className="text-lg font-black text-slate-950">
                  {editingAdvert.id ? 'Edit Advertisement' : 'Post New Product or Service Advert'}
                </h3>
                <button
                  onClick={() => setEditingAdvert(null)}
                  className="text-xs font-bold text-slate-700 hover:text-slate-950"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveAdvert} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-extrabold text-blue-950 block mb-1">Advert Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Brand New 4-Bedroom Duplex in Lekki Phase 1"
                      value={editingAdvert.title || ''}
                      onChange={(e) => setEditingAdvert({ ...editingAdvert, title: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-blue-950 block mb-1">Category *</label>
                    <select
                      value={editingAdvert.category || categories[0]?.name}
                      onChange={(e) => setEditingAdvert({ ...editingAdvert, category: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 text-slate-950 font-bold focus:outline-none focus:border-sky-600"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-blue-950 block mb-1">Price (₦ Naira)</label>
                    <input
                      type="number"
                      placeholder="e.g. 250000"
                      value={editingAdvert.price || ''}
                      onChange={(e) => setEditingAdvert({ ...editingAdvert, price: Number(e.target.value) })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_negotiable"
                      checked={Boolean(editingAdvert.is_negotiable)}
                      onChange={(e) => setEditingAdvert({ ...editingAdvert, is_negotiable: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-950"
                    />
                    <label htmlFor="is_negotiable" className="text-xs font-bold text-slate-900 cursor-pointer">
                      Price is Negotiable
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-blue-950 block mb-1">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08035551234"
                      value={editingAdvert.whatsapp || user.phone}
                      onChange={(e) => setEditingAdvert({ ...editingAdvert, whatsapp: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-blue-950 block mb-1">Product / Offer Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe condition, specifications, warranty, delivery terms, and details..."
                    value={editingAdvert.description || ''}
                    onChange={(e) => setEditingAdvert({ ...editingAdvert, description: e.target.value })}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-blue-950 block mb-1">Product Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={editingAdvert.images?.[0] || ''}
                      onChange={(e) => setEditingAdvert({ ...editingAdvert, images: [e.target.value] })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-blue-950 block mb-1">External Link / Website (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://myshop.com/product"
                      value={editingAdvert.external_url || ''}
                      onChange={(e) => setEditingAdvert({ ...editingAdvert, external_url: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/70 text-slate-950 font-bold placeholder:text-slate-500 focus:outline-none focus:border-sky-600 focus:bg-sky-50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-200">
                  <button
                    type="button"
                    onClick={() => setEditingAdvert(null)}
                    className="px-4 py-2.5 rounded-xl border border-sky-300 text-xs font-bold text-slate-800 bg-sky-100/70 hover:bg-sky-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md"
                  >
                    Submit Advert for Review
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {myAdverts.length === 0 ? (
                <div className="p-8 text-center bg-sky-50 rounded-3xl border border-sky-300 shadow-sm">
                  <Megaphone className="w-12 h-12 text-blue-950/40 mx-auto mb-3" />
                  <h3 className="font-black text-slate-950 text-base">You haven't posted any adverts yet.</h3>
                  <p className="text-xs text-slate-800 font-medium max-w-md mx-auto mt-1 mb-4">
                    Promote your individual products or special services to thousands of buyers browsing the marketplace.
                  </p>
                  <button
                    onClick={() =>
                      setEditingAdvert({
                        title: '',
                        category: categories[0]?.name || 'Fashion and Beauty',
                        whatsapp: user.phone
                      })
                    }
                    className="px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md"
                  >
                    Post an Advert
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAdverts.map((adv) => {
                    const { days, isExpired } = getDaysRemaining(adv.expires_at);
                    const featAdvertPkg = packages.find((p) => p.id === 'pkg-featured-advert') || packages[3];

                    return (
                      <div
                        key={adv.id}
                        className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={adv.images?.[0]}
                            alt={adv.title}
                            className="w-16 h-16 rounded-xl object-cover border border-sky-300 bg-sky-100"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-slate-950 text-base">{adv.title}</h4>
                              {adv.is_featured && (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-black flex items-center gap-1 shadow-xs">
                                  <Award className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
                                  Promoted
                                </span>
                              )}
                              {getStatusBadge(adv.status)}
                            </div>
                            <p className="text-xs font-black text-blue-950 mt-1">
                              {formatNaira(adv.price)} • {adv.category} • {adv.city}, {adv.state}
                            </p>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-800 mt-1">
                              <span className="flex items-center gap-1 text-slate-800">
                                <Eye className="w-3.5 h-3.5 text-blue-950" /> {adv.views || 0} views
                              </span>
                              <span className="flex items-center gap-1 text-emerald-800 font-extrabold">
                                <MessageCircle className="w-3.5 h-3.5" /> {adv.whatsapp_clicks || 0} chats
                              </span>
                              <span className="text-slate-700 font-bold">
                                {isExpired ? 'Campaign Expired' : `${days} days left`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                          <button
                            onClick={() => onViewAdvert(adv)}
                            className="px-3 py-1.5 rounded-lg border border-sky-300 bg-sky-100/70 hover:bg-sky-200 text-xs font-bold text-slate-900 flex items-center gap-1"
                          >
                            <span>Preview</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => setEditingAdvert(adv)}
                            className="px-3 py-1.5 rounded-lg border border-sky-300 bg-sky-100/70 hover:bg-sky-200 text-xs font-bold text-slate-900 flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          {(!adv.is_featured || isExpired) && (
                            <button
                              onClick={() => onUpgradePackage(featAdvertPkg, adv.id, 'advert', adv.title)}
                              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm"
                            >
                              <Award className="w-3.5 h-3.5 fill-current" />
                              <span>{isExpired ? 'Renew Campaign' : 'Promote to Featured'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 4: PAYMENT HISTORY */}
      {activeTab === 'payments' && (
        <div className="bg-sky-50 rounded-3xl border border-sky-300 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-sky-200">
            <h3 className="font-black text-slate-950 text-base">Paystack Transaction Receipts</h3>
            <p className="text-xs text-slate-800 font-medium">Official record of all subscription and advertising payments</p>
          </div>

          {payments.length === 0 ? (
            <div className="p-8 text-center text-slate-700 font-bold text-xs">
              No payment transactions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-100 text-blue-950 font-black border-b border-sky-300">
                  <tr>
                    <th className="p-4">Paystack Reference</th>
                    <th className="p-4">Package</th>
                    <th className="p-4">Target Item</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-200">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-sky-100/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-950">{p.reference}</td>
                      <td className="p-4 font-extrabold text-slate-950">{p.package_name}</td>
                      <td className="p-4 text-slate-800 font-medium truncate max-w-xs">{p.item_title}</td>
                      <td className="p-4 font-black text-blue-950">{formatNaira(p.amount)}</td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 font-black">
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700 font-bold">{formatDate(p.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: UPGRADE / PACKAGES */}
      {activeTab === 'upgrade' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-slate-950">Grow Your Business on Ahava Hub</h2>
            <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1">
              Select a package to upgrade your business profile or boost your individual product adverts with Paystack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-6 rounded-3xl bg-sky-50 border flex flex-col justify-between transition-all ${
                  pkg.popular ? 'border-sky-500 shadow-xl ring-2 ring-sky-500/40' : 'border-sky-300 shadow-sm'
                }`}
              >
                <div>
                  {pkg.badge && (
                    <span className="inline-block px-3 py-1 rounded-full bg-sky-200 border border-sky-300 text-blue-950 text-[10px] font-black uppercase tracking-wider mb-3">
                      {pkg.badge}
                    </span>
                  )}
                  <h3 className="font-black text-slate-950 text-lg">{pkg.name}</h3>
                  <div className="my-4">
                    <span className="text-3xl font-black text-blue-950">{formatNaira(pkg.price)}</span>
                    <span className="text-xs text-slate-700 font-bold ml-1.5">{pkg.duration_label}</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-800 font-bold my-6">
                    {pkg.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    const targetItem = pkg.type === 'listing' ? myBusinesses[0] : myAdverts[0];
                    if (!targetItem && pkg.price > 0) {
                      alert(`Please first add a ${pkg.type} in the dashboard before upgrading.`);
                      return;
                    }
                    if (targetItem) {
                      onUpgradePackage(
                        pkg,
                        targetItem.id,
                        pkg.type as 'listing' | 'advert',
                        'name' in targetItem ? targetItem.name : targetItem.title
                      );
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-black text-xs shadow-md transition-all ${
                    pkg.popular
                      ? 'bg-blue-950 hover:bg-blue-900 text-white'
                      : 'bg-sky-200 hover:bg-sky-300 text-slate-950 border border-sky-300'
                  }`}
                >
                  {pkg.price === 0 ? 'Current Default' : `Choose ${pkg.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
