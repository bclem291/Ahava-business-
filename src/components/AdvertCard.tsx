import React from 'react';
import { Advert } from '../types';
import { MapPin, Award, Eye } from 'lucide-react';
import { formatNaira, getDaysRemaining } from '../utils/formatters';
import { WhatsAppButton } from './WhatsAppButton';

interface AdvertCardProps {
  advert: Advert;
  onView: (advert: Advert) => void;
}

export const AdvertCard: React.FC<AdvertCardProps> = ({ advert, onView }) => {
  const { days, isExpired } = getDaysRemaining(advert.expires_at);

  return (
    <div
      onClick={() => onView(advert)}
      className="group relative bg-sky-50 rounded-2xl border border-sky-300/80 hover:border-sky-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Featured Badge */}
      {advert.is_featured && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md border border-amber-500">
          <Award className="w-3.5 h-3.5 fill-current" />
          <span>Promoted</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 w-full bg-sky-100 overflow-hidden">
        <img
          src={advert.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80'}
          alt={advert.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Category Tag */}
        <div className="absolute top-3 right-3">
          <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-950/90 backdrop-blur-sm text-sky-200 text-xs font-bold border border-blue-800">
            {advert.category}
          </span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="px-3 py-1.5 rounded-xl bg-blue-950/90 backdrop-blur-md text-white font-extrabold text-sm sm:text-base shadow-lg border border-blue-800">
            {advert.price > 0 ? formatNaira(advert.price) : 'Contact for Price'}
          </div>
          {advert.is_negotiable && (
            <span className="text-[11px] font-bold text-sky-100 bg-blue-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-blue-800">
              Negotiable
            </span>
          )}
        </div>
      </div>

      {/* Advert Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-extrabold text-slate-950 text-base leading-snug group-hover:text-blue-900 transition-colors line-clamp-2 mb-2">
            {advert.title}
          </h3>

          {/* Business / Seller Name */}
          {advert.business_name && (
            <p className="text-xs font-bold text-sky-900 line-clamp-1 mb-2">
              {advert.business_name}
            </p>
          )}

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-3">
            <MapPin className="w-3.5 h-3.5 text-sky-700 flex-shrink-0" />
            <span className="line-clamp-1">{advert.city}, {advert.state}</span>
          </div>

          {/* Excerpt */}
          <p className="text-xs font-medium text-slate-800 line-clamp-2 mb-4 leading-relaxed">
            {advert.description}
          </p>
        </div>

        {/* Footer Meta & WhatsApp Button */}
        <div className="pt-3 border-t border-sky-200 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col text-[11px] text-slate-700 font-semibold">
            <span>{isExpired ? 'Campaign Expired' : `${days} days left`}</span>
            {advert.views > 0 && (
              <span className="flex items-center gap-1 text-slate-600">
                <Eye className="w-3 h-3" /> {advert.views} views
              </span>
            )}
          </div>

          <WhatsAppButton
            phone={advert.whatsapp}
            title={advert.title}
            isAdvert={true}
            type="advert"
            entityId={advert.id}
            label="Inquire"
          />
        </div>
      </div>
    </div>
  );
};
