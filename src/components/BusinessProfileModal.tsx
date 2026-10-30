import React, { useState, useEffect } from 'react';
import { Business } from '../types';
import {
  X,
  BadgeCheck,
  Award,
  MapPin,
  Clock,
  Phone,
  Globe,
  Share2,
  CheckCircle2,
  Building,
  ArrowRight
} from 'lucide-react';
import { WhatsAppButton } from './WhatsAppButton';
import { storageService } from '../services/storageService';

interface BusinessProfileModalProps {
  business: Business | null;
  onClose: () => void;
  onSelectBusiness?: (business: Business) => void;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({
  business,
  onClose,
  onSelectBusiness
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (business) {
      storageService.trackView('business', business.id);
      setActiveImageIndex(0);
    }
  }, [business]);

  if (!business) return null;

  const allImages = business.images && business.images.length > 0
    ? business.images
    : [business.logo_url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'];

  const relatedBusinesses = storageService
    .getApprovedBusinesses()
    .filter((b) => b.id !== business.id && b.category === business.category)
    .slice(0, 3);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-sky-50 rounded-3xl shadow-2xl overflow-hidden my-auto border border-sky-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Hero Section */}
        <div className="relative bg-slate-950">
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <img
              src={allImages[activeImageIndex]}
              alt={business.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          </div>

          {/* Thumbnail Bar if multiple images */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 overflow-x-auto pb-1 z-10">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx ? 'border-sky-400 scale-105 shadow-md' : 'border-white/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Badges Over Hero */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
            {business.is_featured && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md border border-amber-500">
                <Award className="w-3.5 h-3.5 fill-current" />
                Featured Business
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-blue-950/90 text-sky-200 font-bold text-xs backdrop-blur-md border border-blue-800">
              {business.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 space-y-8">
          {/* Header Row: Logo, Name, Verification, Share */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-sky-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-sky-300 bg-sky-100 shadow-md overflow-hidden flex-shrink-0 p-1">
                <img
                  src={business.logo_url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80'}
                  alt={business.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                    {business.name}
                  </h1>
                  {business.is_verified && (
                    <span title="Administrator Verified Business">
                      <BadgeCheck className="w-6 h-6 fill-sky-200 text-sky-700" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 font-bold mt-1">
                  <MapPin className="w-4 h-4 text-sky-700 flex-shrink-0" />
                  <span>{business.address}, {business.city}, {business.state} State</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Share + Call) */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-sky-300 bg-sky-100 hover:bg-sky-200 text-slate-950 font-bold text-xs sm:text-sm transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>

              <a
                href={`tel:${business.phone}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-950 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Phone</span>
              </a>
            </div>
          </div>

          {/* Primary WhatsApp Action Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sky-100/80 border border-sky-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-blue-950 text-sm sm:text-base">
                Ready to do business with {business.name}?
              </h3>
              <p className="text-xs text-slate-800 font-medium">
                Click below to open direct WhatsApp chat with the business owner.
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <WhatsAppButton
                phone={business.whatsapp}
                title={business.name}
                isAdvert={false}
                type="business"
                entityId={business.id}
                variant="large"
                label="Message on WhatsApp"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-blue-950 mb-2">
              About This Business
            </h2>
            <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {business.description}
            </p>
          </div>

          {/* Products & Services */}
          {business.products_services && business.products_services.length > 0 && (
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-blue-950 mb-3">
                Products & Services Offered
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {business.products_services.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-sky-100/70 border border-sky-200 text-slate-950 text-xs sm:text-sm font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sky-700 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details & Opening Hours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-sky-200">
            <div className="p-4 rounded-xl bg-sky-100/70 border border-sky-200">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4 text-sky-700" />
                <span>Opening Hours</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-950">
                {business.opening_hours || 'Mon - Sat: 8:00 AM - 6:00 PM'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-sky-100/70 border border-sky-200">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 uppercase tracking-wider mb-1">
                <Phone className="w-4 h-4 text-sky-700" />
                <span>Phone / WhatsApp</span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-950">
                {business.phone}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-sky-100/70 border border-sky-200">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 uppercase tracking-wider mb-1">
                <Globe className="w-4 h-4 text-sky-700" />
                <span>Official Website</span>
              </div>
              {business.website ? (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-bold text-blue-950 hover:text-sky-700 truncate block underline"
                >
                  {business.website.replace(/^https?:\/\//, '')}
                </a>
              ) : (
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Available on WhatsApp</p>
              )}
            </div>
          </div>

          {/* Related Businesses in Same Category */}
          {relatedBusinesses.length > 0 && (
            <div className="pt-6 border-t border-sky-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-slate-950">
                  More in {business.category}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedBusinesses.map((rb) => (
                  <div
                    key={rb.id}
                    onClick={() => {
                      if (onSelectBusiness) onSelectBusiness(rb);
                    }}
                    className="p-3 rounded-xl border border-sky-300 hover:border-sky-500 bg-sky-100/70 hover:bg-sky-200/80 cursor-pointer transition-all flex items-center gap-3 shadow-xs"
                  >
                    <img
                      src={rb.logo_url || rb.images?.[0]}
                      alt={rb.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-950 truncate">{rb.name}</h4>
                      <p className="text-[11px] text-slate-700 font-semibold">{rb.city}, {rb.state}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
