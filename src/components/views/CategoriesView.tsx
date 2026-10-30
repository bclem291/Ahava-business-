import React from 'react';
import { Category } from '../../types';
import { getCategoryIcon } from '../../utils/iconMap';
import { ArrowRight, Building2, Megaphone, Folder } from 'lucide-react';

interface CategoriesViewProps {
  categories: Category[];
  onSelectCategory: (categoryName: string) => void;
  onNavigateToAdverts: (categoryName: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onSelectCategory,
  onNavigateToAdverts
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-1">
          Explore by Sector
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">All 16 Industry Categories</h1>
        <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-2xl">
          From fashion and food to real estate, tech services, and agriculture—explore Nigerian commercial hubs and vetted merchants.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="group p-6 rounded-3xl bg-sky-50 border border-sky-300/80 hover:border-sky-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 group-hover:bg-blue-950 text-blue-950 group-hover:text-white flex items-center justify-center transition-colors border border-sky-200">
                  {getCategoryIcon(cat.icon_name, 'w-6 h-6')}
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-sky-200 text-blue-950 border border-sky-300">
                  #{idx + 1}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-950 text-base group-hover:text-blue-900 transition-colors mb-2">
                {cat.name}
              </h3>

              <p className="text-xs text-slate-800 font-medium leading-relaxed mb-4">
                {cat.description}
              </p>
            </div>

            <div className="pt-4 border-t border-sky-200 space-y-2 mt-auto">
              <button
                onClick={() => onSelectCategory(cat.name)}
                className="w-full py-2.5 px-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-blue-950 font-extrabold text-xs flex items-center justify-between transition-colors border border-sky-300"
              >
                <span>Find Businesses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigateToAdverts(cat.name)}
                className="w-full py-2.5 px-3 rounded-xl border border-sky-300 hover:bg-sky-100 text-slate-900 font-bold text-xs flex items-center justify-between transition-colors bg-sky-50"
              >
                <span>Browse Adverts</span>
                <Megaphone className="w-3.5 h-3.5 text-sky-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
