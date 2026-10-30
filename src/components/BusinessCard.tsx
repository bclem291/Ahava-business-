import React from 'react';
import { Business } from '../types';
import { WhatsAppButton } from './WhatsAppButton';

interface BusinessCardProps {
  business: Business;
  onView: (business: Business) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, onView }) => {
  return (
    <div
      onClick={() => onView(business)}
      className="group relative bg-sky-50 rounded-2xl border border-sky-300 hover:border-sky-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Featured Banner Accent */}
      {business.is_featured && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-amber-300 text-slate-950 font-black text-xs shadow-md border border-amber-400">
          Featured
        </div>
      )}

      {/* Cover / Image Area */}
      <div className="relative h-44 w-full bg-sky-100 overflow-hidden">
        <img
          src={business.images?.[0] || business.logo_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Small Logo overlay */}
        <div className="absolute -bottom-4 right-4 w-14 h-14 rounded-xl border-2 border-sky-300 bg-sky-100 shadow-md overflow-hidden p-0.5">
          <img
            src={business.logo_url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80'}
            alt={`${business.name} logo`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-950/90 backdrop-blur-sm text-sky-200 text-xs font-black border border-blue-800">
            {business.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 pt-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Business Name & Verification */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-black text-slate-950 text-lg leading-snug group-hover:text-blue-900 transition-colors line-clamp-1">
              {business.name}
            </h3>
            {business.is_verified && (
              <span className="px-2 py-0.5 rounded-full bg-sky-200 border border-sky-400 text-blue-950 text-[10px] font-black uppercase flex-shrink-0">
                Verified
              </span>
            )}
          </div>

          {/* Location */}
          <div className="text-xs font-bold text-slate-700 mb-2.5">
            <span className="text-blue-950 font-black mr-1">Location:</span>
            <span className="line-clamp-1">{business.city}, {business.state}</span>
          </div>

          {/* Short Description */}
          <p className="text-slate-800 text-xs font-semibold leading-relaxed line-clamp-2 mb-4">
            {business.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-sky-200 flex items-center justify-between gap-2 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(business);
            }}
            className="text-xs font-black text-blue-950 hover:text-sky-700 transition-colors"
          >
            View Profile →
          </button>

          <WhatsAppButton
            phone={business.whatsapp}
            title={business.name}
            isAdvert={false}
            type="business"
            entityId={business.id}
            variant="compact"
          />
        </div>
      </div>
    </div>
  );
};
