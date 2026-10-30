import React, { useState } from 'react';
import { Business, Advert, Category } from '../../types';
import { NIGERIAN_STATES } from '../../data/defaultData';
import { BusinessCard } from '../BusinessCard';
import { AdvertCard } from '../AdvertCard';
import { BannerAdSlot } from '../BannerAdSlot';

interface HomeViewProps {
  categories: Category[];
  businesses: Business[];
  adverts: Advert[];
  onSelectBusiness: (business: Business) => void;
  onSelectAdvert: (advert: Advert) => void;
  onSelectCategory: (categoryName: string) => void;
  onNavigate: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register' | 'admin') => void;
  onSearch: (params: { keyword: string; category: string; state: string }) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  categories,
  businesses,
  adverts,
  onSelectBusiness,
  onSelectAdvert,
  onSelectCategory,
  onNavigate,
  onOpenAuth,
  onSearch
}) => {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const featuredBusinesses = businesses.filter((b) => b.is_featured).slice(0, 6);
  const popularAdverts = adverts.filter((a) => a.is_featured || a.views > 200).slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      keyword,
      category: selectedCategory,
      state: selectedState
    });
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Top Banner Advertisement Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BannerAdSlot slot="homepage_top" />
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-16 sm:py-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-black tracking-wide">
            AHAVA DIGITAL HUB • Nigeria's Premier Directory & Advertising Marketplace
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white drop-shadow-sm">
            Get Your Business in Front of <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-200">More Customers.</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-semibold">
            Discover businesses, promote your products, and connect with customers across Nigeria—all in one place.
          </p>

          {/* Multi-parameter Search Bar (No icons, clean inputs) */}
          <div className="pt-4 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-sky-50 p-3 sm:p-4 rounded-3xl shadow-2xl border-2 border-sky-300 grid grid-cols-1 sm:grid-cols-12 gap-2 text-slate-950 text-left"
            >
              {/* Keyword input */}
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Business name, product or service..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-none focus:outline-none text-xs sm:text-sm font-bold text-slate-950 placeholder-slate-600 bg-sky-100/70"
                />
              </div>

              {/* Category dropdown */}
              <div className="sm:col-span-3 border-t sm:border-t-0 sm:border-l border-sky-200 pt-2 sm:pt-0 sm:pl-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2.5 px-2 rounded-xl border-none focus:outline-none text-xs sm:text-sm font-black text-slate-950 bg-sky-100/70"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State dropdown */}
              <div className="sm:col-span-2 border-t sm:border-t-0 sm:border-l border-sky-200 pt-2 sm:pt-0 sm:pl-2">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full py-2.5 px-2 rounded-xl border-none focus:outline-none text-xs sm:text-sm font-black text-slate-950 bg-sky-100/70"
                >
                  <option value="">All States</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search submit button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full py-2.5 px-4 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-black">
            <button
              onClick={() => onNavigate('businesses')}
              className="px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Find a Business
            </button>

            <button
              onClick={() => onNavigate('pricing')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg transition-all active:scale-95"
            >
              Advertise Your Business
            </button>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-md">
            <span className="text-[11px] font-black text-blue-950 uppercase tracking-wider block mb-1">
              Guaranteed Standard
            </span>
            <h4 className="font-black text-slate-950 text-base">Verified Nigerian Businesses</h4>
            <p className="text-xs text-slate-800 font-semibold mt-1">Physical addresses and official phone lines checked by AHAVA moderators.</p>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-md">
            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block mb-1">
              Direct Access
            </span>
            <h4 className="font-black text-slate-950 text-base">Direct WhatsApp Connections</h4>
            <p className="text-xs text-slate-800 font-semibold mt-1">Chat instantly with sellers. No intermediary delays or third-party holding fees.</p>
          </div>

          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-300 shadow-md">
            <span className="text-[11px] font-black text-blue-950 uppercase tracking-wider block mb-1">
              High ROI
            </span>
            <h4 className="font-black text-slate-950 text-base">High-Visibility Marketplace</h4>
            <p className="text-xs text-slate-800 font-semibold mt-1">Affordable promo packages starting at just ₦2,000 processed in Naira via Paystack.</p>
          </div>
        </div>
      </section>

      {/* BUSINESS CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-sky-800 block mb-1">
              Explore by Industry
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Browse All 16 Business Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs sm:text-sm font-black text-blue-950 hover:text-sky-700 transition-colors"
          >
            View All Categories →
          </button>
        </div>

        {/* Categories Grid (No icons, clean category badge pills & numbers) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="group p-4 sm:p-5 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-300 hover:border-sky-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-1 rounded-lg bg-sky-200 group-hover:bg-blue-950 text-blue-950 group-hover:text-white text-xs font-black transition-colors mb-3">
                  #{idx + 1}
                </span>
                <h3 className="font-black text-slate-950 text-xs sm:text-sm group-hover:text-blue-950 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-800 font-semibold mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-sky-200 flex items-center justify-between text-[11px] text-slate-700 font-bold">
                <span>{cat.count || 0} listings</span>
                <span className="font-black text-sky-800 group-hover:translate-x-1 transition-transform">Browse →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED BUSINESSES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[11px] font-black uppercase tracking-wider inline-block mb-1 border border-amber-300">
              Featured Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Featured Verified Businesses
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 font-semibold mt-1">
              Trusted merchants and service providers with active featured placement on AHAVA DIGITAL HUB.
            </p>
          </div>
          <button
            onClick={() => onNavigate('businesses')}
            className="text-xs sm:text-sm font-black text-blue-950 hover:text-sky-700 transition-colors"
          >
            See All Businesses ({businesses.length}) →
          </button>
        </div>

        {featuredBusinesses.length === 0 ? (
          <div className="bg-sky-50 p-8 sm:p-12 rounded-3xl border border-sky-300 text-center space-y-4 shadow-sm">
            <h3 className="font-black text-slate-950 text-lg sm:text-xl">
              No businesses listed yet.
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 font-semibold max-w-md mx-auto leading-relaxed">
              Be the first business owner to list your brand on AHAVA DIGITAL HUB and connect with thousands of buyers across Nigeria!
            </p>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              List Your Business Free
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} onView={onSelectBusiness} />
            ))}
          </div>
        )}
      </section>

      {/* Middle Banner Advertisement Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BannerAdSlot slot="homepage_middle" />
      </div>

      {/* POPULAR ADVERTISEMENTS MARKETPLACE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-sky-800 block mb-1">
              Active Offers & Products
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              Popular Product & Service Adverts
            </h2>
            <p className="text-xs sm:text-sm text-slate-800 font-semibold mt-1">
              Browse products, properties, and special services on promotion right now.
            </p>
          </div>
          <button
            onClick={() => onNavigate('adverts')}
            className="text-xs sm:text-sm font-black text-blue-950 hover:text-sky-700 transition-colors"
          >
            Browse All Adverts ({adverts.length}) →
          </button>
        </div>

        {popularAdverts.length === 0 ? (
          <div className="bg-sky-50 p-8 sm:p-12 rounded-3xl border border-sky-300 text-center space-y-4 shadow-sm">
            <h3 className="font-black text-slate-950 text-lg sm:text-xl">
              No active advertisements yet.
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 font-semibold max-w-md mx-auto leading-relaxed">
              Post individual products, special offers, or professional services to put your inventory in front of active customers.
            </p>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              Post an Advert
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularAdverts.map((adv) => (
              <AdvertCard key={adv.id} advert={adv} onView={onSelectAdvert} />
            ))}
          </div>
        )}
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-blue-950 text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="relative max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-sky-500/30 text-sky-300 text-xs font-black uppercase tracking-wider">
              Expand Your Reach
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Ready to Grow Your Business?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-semibold">
              Join AHAVA DIGITAL HUB and put your business in front of potential customers across Nigeria. List for free or promote individual products with Paystack.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-3.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-blue-950 font-black text-xs sm:text-sm shadow-lg border border-sky-300 transition-all active:scale-95"
              >
                List Your Business
              </button>

              <button
                onClick={() => onNavigate('pricing')}
                className="px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all active:scale-95"
              >
                Promote Your Products
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
