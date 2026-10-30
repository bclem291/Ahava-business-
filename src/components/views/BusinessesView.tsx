import React, { useState, useMemo } from 'react';
import { Business, Category } from '../../types';
import { NIGERIAN_STATES } from '../../data/defaultData';
import { BusinessCard } from '../BusinessCard';
import { Search, Filter, RotateCcw, Building2, MapPin, Award } from 'lucide-react';

interface BusinessesViewProps {
  businesses: Business[];
  categories: Category[];
  initialCategory?: string;
  initialKeyword?: string;
  initialState?: string;
  onSelectBusiness: (business: Business) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const BusinessesView: React.FC<BusinessesViewProps> = ({
  businesses,
  categories,
  initialCategory = '',
  initialKeyword = '',
  initialState = '',
  onSelectBusiness,
  onOpenAuth
}) => {
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity, setSelectedCity] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('newest');
  const [visibleCount, setVisibleCount] = useState(9);

  // Available cities for currently selected state
  const citiesForState = useMemo(() => {
    if (!selectedState) return [];
    const found = NIGERIAN_STATES.find((s) => s.state === selectedState);
    return found ? found.cities : [];
  }, [selectedState]);

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((b) => {
        // Must be approved
        if (b.status !== 'approved') return false;

        // Search Keyword
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = b.name.toLowerCase().includes(q);
          const matchDesc = b.description.toLowerCase().includes(q);
          const matchCat = b.category.toLowerCase().includes(q);
          const matchCity = b.city.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat && !matchCity) return false;
        }

        // Category filter
        if (selectedCategory && b.category !== selectedCategory) return false;

        // State filter
        if (selectedState && b.state !== selectedState) return false;

        // City filter
        if (selectedCity && b.city.toLowerCase() !== selectedCity.toLowerCase()) return false;

        // Featured only
        if (featuredOnly && !b.is_featured) return false;

        // Verified only
        if (verifiedOnly && !b.is_verified) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'popular') {
          return (b.views || 0) - (a.views || 0);
        }
        return a.name.localeCompare(b.name);
      });
  }, [
    businesses,
    searchTerm,
    selectedCategory,
    selectedState,
    selectedCity,
    featuredOnly,
    verifiedOnly,
    sortBy
  ]);

  const displayedBusinesses = filteredBusinesses.slice(0, visibleCount);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedState('');
    setSelectedCity('');
    setFeaturedOnly(false);
    setVerifiedOnly(false);
    setSortBy('newest');
    setVisibleCount(9);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-1">
            Verified Nigerian Directory
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Find Verified Businesses</h1>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-xl">
            Browse companies, artisans, professionals, and service centers across all states in Nigeria.
          </p>
        </div>

        <button
          onClick={() => onOpenAuth('register')}
          className="px-5 py-3 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 whitespace-nowrap"
        >
          List Your Business Free
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-sky-50 p-5 rounded-3xl border border-sky-300 shadow-sm space-y-4">
        {/* Top Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-sky-700 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by business name, keyword, or service..."
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
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('');
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-sky-200 bg-sky-100/70 text-slate-950 font-semibold focus:outline-none focus:border-sky-500"
            >
              <option value="">All Nigerian States</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="text-[11px] font-extrabold text-blue-950 uppercase tracking-wider block mb-1">
              City / Town
            </label>
            <select
              disabled={!selectedState}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-sky-200 bg-sky-100/70 text-slate-950 font-semibold focus:outline-none focus:border-sky-500 disabled:opacity-50"
            >
              <option value="">{selectedState ? 'All Cities' : 'Select State First'}</option>
              {citiesForState.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[11px] font-extrabold text-blue-950 uppercase tracking-wider block mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'name')}
              className="w-full text-xs p-2.5 rounded-xl border border-sky-200 bg-sky-100/70 text-slate-950 font-semibold focus:outline-none focus:border-sky-500"
            >
              <option value="newest">Newest Listings</option>
              <option value="popular">Most Viewed & Active</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Toggles & Reset Row */}
        <div className="pt-2 border-t border-sky-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-1.5 cursor-pointer font-bold text-slate-900">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-900"
              />
              <span>Featured Only</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer font-bold text-slate-900">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-900"
              />
              <span>Verified Only</span>
            </label>
          </div>

          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 text-blue-950 hover:text-sky-700 font-extrabold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-800 font-bold">
        <span>Showing {displayedBusinesses.length} of {filteredBusinesses.length} businesses</span>
        {selectedCategory && (
          <span className="font-extrabold text-blue-950">Category: {selectedCategory}</span>
        )}
      </div>

      {/* Businesses Grid */}
      {displayedBusinesses.length === 0 ? (
        <div className="bg-sky-50 p-12 rounded-3xl border border-sky-300 text-center space-y-4">
          <Building2 className="w-14 h-14 text-sky-400 mx-auto" />
          <h3 className="font-extrabold text-slate-950 text-lg sm:text-xl">
            {businesses.length === 0
              ? 'No businesses listed yet.'
              : 'No businesses match your current filters.'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-md mx-auto leading-relaxed">
            {businesses.length === 0
              ? 'Be the first Nigerian business owner to list your business profile on Ahava Business Hub!'
              : 'Try adjusting your search keywords, clearing state filters, or browsing other categories.'}
          </p>
          {businesses.length === 0 ? (
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              List Your Business Free
            </button>
          ) : (
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-blue-950 text-white font-bold text-xs"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBusinesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} onView={onSelectBusiness} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredBusinesses.length && (
        <div className="text-center pt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-8 py-3 rounded-2xl bg-sky-50 border border-sky-300 hover:border-sky-500 font-extrabold text-xs sm:text-sm text-slate-950 shadow-sm transition-all active:scale-95"
          >
            Load More Businesses ({filteredBusinesses.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
