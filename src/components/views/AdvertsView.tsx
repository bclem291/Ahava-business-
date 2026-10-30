import React, { useState, useMemo } from 'react';
import { Advert, Category } from '../../types';
import { NIGERIAN_STATES } from '../../data/defaultData';
import { AdvertCard } from '../AdvertCard';
import { Search, RotateCcw, Megaphone, Award, Tag, SlidersHorizontal } from 'lucide-react';

interface AdvertsViewProps {
  adverts: Advert[];
  categories: Category[];
  initialCategory?: string;
  initialKeyword?: string;
  onSelectAdvert: (advert: Advert) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const AdvertsView: React.FC<AdvertsViewProps> = ({
  adverts,
  categories,
  initialCategory = '',
  initialKeyword = '',
  onSelectAdvert,
  onOpenAuth
}) => {
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Filter adverts
  const filteredAdverts = useMemo(() => {
    return adverts.filter((a) => {
      // Must be approved
      if (a.status !== 'approved') return false;

      // Search keyword
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchDesc = a.description.toLowerCase().includes(q);
        const matchCat = a.category.toLowerCase().includes(q);
        const matchBiz = (a.business_name || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat && !matchBiz) return false;
      }

      // Category
      if (selectedCategory && a.category !== selectedCategory) return false;

      // State
      if (selectedState && a.state !== selectedState) return false;

      // Featured only
      if (featuredOnly && !a.is_featured) return false;

      // Price ranges
      if (priceRange === 'under_50k' && a.price > 50000) return false;
      if (priceRange === '50k_500k' && (a.price < 50000 || a.price > 500000)) return false;
      if (priceRange === '500k_5m' && (a.price < 500000 || a.price > 5000000)) return false;
      if (priceRange === 'above_5m' && a.price < 5000000) return false;

      return true;
    });
  }, [adverts, searchTerm, selectedCategory, selectedState, priceRange, featuredOnly]);

  const displayedAdverts = filteredAdverts.slice(0, visibleCount);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedState('');
    setPriceRange('all');
    setFeaturedOnly(false);
    setVisibleCount(9);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-sky-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-1">
            Online Advertising Marketplace
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Browse Products & Services</h1>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-xl">
            Discover special offers, inventory items, and expert services promoted by merchants nationwide. Contact sellers directly via WhatsApp.
          </p>
        </div>

        <button
          onClick={() => onOpenAuth('register')}
          className="px-5 py-3 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          Post an Advert Today
        </button>
      </div>

      {/* Search and Filter Panel */}
      <div className="bg-sky-50 p-5 rounded-3xl border border-sky-300 shadow-sm space-y-4">
        {/* Top search */}
        <div className="relative">
          <Search className="w-5 h-5 text-sky-700 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search products, cars, property, services, electronics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sky-200 bg-sky-100/70 focus:outline-none focus:border-sky-500 text-xs sm:text-sm text-slate-950 font-medium placeholder-slate-500"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Category */}
          <div>
            <label className="text-[11px] font-extrabold text-blue-950 uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-sky-200 bg-sky-100/70 text-slate-950 font-semibold focus:outline-none focus:border-sky-500"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="text-[11px] font-extrabold text-blue-950 uppercase tracking-wider block mb-1">
              Location (State)
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-sky-200 bg-sky-100/70 text-slate-950 font-semibold focus:outline-none focus:border-sky-500"
            >
              <option value="">All States</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-[11px] font-extrabold text-blue-950 uppercase tracking-wider block mb-1">
              Price Range
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-sky-200 bg-sky-100/70 text-slate-950 font-semibold focus:outline-none focus:border-sky-500"
            >
              <option value="all">Any Price</option>
              <option value="under_50k">Under ₦50,000</option>
              <option value="50k_500k">₦50,000 - ₦500,000</option>
              <option value="500k_5m">₦500,000 - ₦5,000,000</option>
              <option value="above_5m">Above ₦5,000,000</option>
            </select>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-end pb-1">
            <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-900 p-2.5 rounded-xl border border-sky-200 bg-sky-100/70 w-full">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-900"
              />
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Featured Adverts Only
              </span>
            </label>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="pt-2 border-t border-sky-200 flex justify-end">
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 text-blue-950 hover:text-sky-700 font-extrabold text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-800 font-bold">
        <span>Showing {displayedAdverts.length} of {filteredAdverts.length} adverts</span>
      </div>

      {/* Adverts Grid */}
      {displayedAdverts.length === 0 ? (
        <div className="bg-sky-50 p-12 rounded-3xl border border-sky-300 text-center space-y-4">
          <Megaphone className="w-14 h-14 text-sky-400 mx-auto" />
          <h3 className="font-extrabold text-slate-950 text-lg sm:text-xl">
            {adverts.length === 0
              ? 'No advertisements posted yet.'
              : 'No adverts match your criteria.'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-md mx-auto leading-relaxed">
            {adverts.length === 0
              ? 'Post individual products, special promotions, or professional services to start connecting with customers across Nigeria.'
              : 'Try adjusting price ranges, search terms, or checking other categories.'}
          </p>
          {adverts.length === 0 ? (
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              Post an Advert
            </button>
          ) : (
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-blue-950 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedAdverts.map((adv) => (
            <AdvertCard key={adv.id} advert={adv} onView={onSelectAdvert} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredAdverts.length && (
        <div className="text-center pt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-8 py-3 rounded-2xl bg-sky-50 border border-sky-300 hover:border-sky-500 font-extrabold text-xs sm:text-sm text-slate-950 shadow-sm transition-all active:scale-95"
          >
            Load More Adverts ({filteredAdverts.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
