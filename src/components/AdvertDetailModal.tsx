import React, { useState, useEffect } from 'react';
import { Advert } from '../types';
import {
  X,
  MapPin,
  Tag,
  Award,
  ExternalLink,
  Flag,
  Share2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { formatNaira, formatDate, getDaysRemaining } from '../utils/formatters';
import { WhatsAppButton } from './WhatsAppButton';
import { storageService } from '../services/storageService';

interface AdvertDetailModalProps {
  advert: Advert | null;
  onClose: () => void;
  onSelectAdvert?: (advert: Advert) => void;
}

export const AdvertDetailModal: React.FC<AdvertDetailModalProps> = ({
  advert,
  onClose,
  onSelectAdvert
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('Fraudulent / Scam');
  const [reportEmail, setReportEmail] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    if (advert) {
      storageService.trackView('advert', advert.id);
      setActiveImageIndex(0);
      setIsReporting(false);
      setReportSubmitted(false);
    }
  }, [advert]);

  if (!advert) return null;

  const images = advert.images && advert.images.length > 0
    ? advert.images
    : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80'];

  const { days, isExpired } = getDaysRemaining(advert.expires_at);

  const relatedAdverts = storageService
    .getApprovedAdverts()
    .filter((a) => a.id !== advert.id && a.category === advert.category)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.submitReport({
      advert_id: advert.id,
      advert_title: advert.title,
      reporter_email: reportEmail || 'visitor@ahavahub.com',
      reason: reportReason,
      details: reportDetails
    });
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReporting(false);
    }, 2500);
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

        {/* Gallery / Picture display */}
        <div className="relative bg-slate-950">
          <div className="relative h-64 sm:h-80 md:h-96 w-full flex items-center justify-center overflow-hidden">
            <img
              src={images[activeImageIndex]}
              alt={advert.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          </div>

          {/* Multiple image thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 overflow-x-auto pb-1 z-10">
              {images.map((img, idx) => (
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

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
            {advert.is_featured && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md border border-amber-500">
                <Award className="w-3.5 h-3.5 fill-current" />
                Featured Advert
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-blue-950/90 text-sky-200 font-bold text-xs backdrop-blur-md border border-blue-800">
              {advert.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Header Row: Title, Price, Location */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-sky-200">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                {advert.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-700 font-bold">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-sky-700" />
                  {advert.city}, {advert.state} State
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-sky-700" />
                  Listed on {formatDate(advert.created_at)}
                </span>
                {advert.views > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-sky-700" />
                      {advert.views} views
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Prominent Price Card */}
            <div className="flex flex-col items-start md:items-end">
              <span className="text-xs text-blue-950 font-black uppercase tracking-wider">Price</span>
              <div className="text-2xl sm:text-3xl font-black text-blue-950">
                {advert.price > 0 ? formatNaira(advert.price) : 'Contact for Price'}
              </div>
              {advert.is_negotiable && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  Price Negotiable
                </span>
              )}
            </div>
          </div>

          {/* Seller / Advertiser Contact Box */}
          <div className="p-5 rounded-2xl bg-sky-100/80 border border-sky-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-950">Advertiser</span>
              <h3 className="font-black text-slate-950 text-base sm:text-lg">
                {advert.business_name || advert.user_name || 'Verified Merchant'}
              </h3>
              <p className="text-xs text-slate-800 font-medium mt-0.5">
                Click to contact this seller directly on WhatsApp with the advert details attached.
              </p>
            </div>

            <div className="w-full sm:w-auto flex flex-col gap-2">
              <WhatsAppButton
                phone={advert.whatsapp}
                title={advert.title}
                isAdvert={true}
                type="advert"
                entityId={advert.id}
                variant="large"
                label="Contact Seller on WhatsApp"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-950 mb-2">
              Item or Service Description
            </h2>
            <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {advert.description}
            </p>
          </div>

          {/* External website link if provided */}
          {advert.external_url && (
            <div className="p-4 rounded-xl bg-sky-100/70 border border-sky-300 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-blue-950 uppercase tracking-wider block">Seller Website or Catalog</span>
                <span className="text-xs sm:text-sm font-bold text-slate-950 truncate block">
                  {advert.external_url}
                </span>
              </div>
              <a
                href={advert.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs"
              >
                <span>Visit Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Safety / Anti-Scam Notice */}
          <div className="p-4 rounded-2xl bg-amber-100/90 border border-amber-300 flex items-start gap-3 text-amber-950 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-amber-950">Safety Tips for Buyers on Ahava Business Hub:</p>
              <p className="text-amber-900 font-medium mt-0.5">
                Never send upfront payments or bank transfers before inspecting the goods or verifying the service provider in person or via trusted escrow. Report suspicious listings immediately.
              </p>
            </div>
          </div>

          {/* Actions Bar: Share & Report */}
          <div className="pt-4 border-t border-sky-200 flex items-center justify-between gap-4">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-950 hover:text-sky-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Link Copied to Clipboard!' : 'Share Advert'}</span>
            </button>

            <button
              onClick={() => setIsReporting(!isReporting)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <Flag className="w-4 h-4" />
              <span>Report Advert</span>
            </button>
          </div>

          {/* Report Form Drawer if open */}
          {isReporting && (
            <div className="p-5 rounded-2xl bg-red-50 border border-red-300 animate-in fade-in">
              {reportSubmitted ? (
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Thank you. Your report has been submitted to the Ahava Hub moderation team.</span>
                </div>
              ) : (
                <form onSubmit={handleSendReport} className="space-y-3">
                  <h4 className="font-extrabold text-red-950 text-sm flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Report This Advert to Ahava Moderators</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">Reason</label>
                      <select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-red-300 bg-sky-50 text-slate-950 font-bold"
                      >
                        <option value="Fraudulent / Scam">Fraudulent / Scam</option>
                        <option value="Fake or Inaccurate Price">Fake or Inaccurate Price</option>
                        <option value="Inappropriate or Prohibited Content">Inappropriate or Prohibited Content</option>
                        <option value="Duplicate Listing">Duplicate Listing</option>
                        <option value="Wrong Contact Number">Wrong Contact Number</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={reportEmail}
                        onChange={(e) => setReportEmail(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-red-300 bg-sky-50 text-slate-950 font-bold placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">Additional Details (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Please explain why you are reporting this advert..."
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-red-300 bg-sky-50 text-slate-950 font-bold placeholder:text-slate-500"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReporting(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-sm"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Related Adverts */}
          {relatedAdverts.length > 0 && (
            <div className="pt-6 border-t border-sky-200">
              <h3 className="text-base font-black text-slate-950 mb-3">
                Similar Adverts in {advert.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedAdverts.map((ra) => (
                  <div
                    key={ra.id}
                    onClick={() => {
                      if (onSelectAdvert) onSelectAdvert(ra);
                    }}
                    className="p-3 rounded-xl border border-sky-300 hover:border-sky-500 bg-sky-100/70 hover:bg-sky-200/80 cursor-pointer transition-all flex items-center gap-3 shadow-xs"
                  >
                    <img
                      src={ra.images?.[0]}
                      alt={ra.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-950 truncate">{ra.title}</h4>
                      <p className="text-[11px] font-black text-blue-950">{formatNaira(ra.price)}</p>
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
