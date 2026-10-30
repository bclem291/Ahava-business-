import React, { useEffect } from 'react';
import { BannerAd } from '../types';
import { storageService } from '../services/storageService';
import { ExternalLink, Megaphone } from 'lucide-react';

interface BannerAdSlotProps {
  slot: 'homepage_top' | 'homepage_middle' | 'sidebar';
  className?: string;
}

export const BannerAdSlot: React.FC<BannerAdSlotProps> = ({ slot, className = '' }) => {
  const activeBanners = storageService.getActiveBanners().filter((b) => b.slot === slot);
  const banner = activeBanners[0];

  useEffect(() => {
    if (banner) {
      storageService.trackView('banner', banner.id);
    }
  }, [banner]);

  if (!banner) {
    return (
      <div className={`p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-sky-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-sky-800/40 shadow-sm ${className}`}>
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-300">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base">Place Your Banner Advert Here</h4>
            <p className="text-xs text-sky-200">Connect with thousands of active buyers across Nigeria daily.</p>
          </div>
        </div>
        <a
          href="#pricing"
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          Book Banner
        </a>
      </div>
    );
  }

  const handleBannerClick = () => {
    storageService.trackBannerClick(banner.id);
    if (banner.destination_url) {
      window.open(banner.destination_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleBannerClick}
      className={`relative group rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all border border-slate-200 ${className}`}
    >
      <div className="relative h-28 sm:h-36 md:h-44 w-full bg-slate-900">
        <img
          src={banner.image_url}
          alt={banner.title}
          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent flex items-center p-4 sm:p-6">
          <div className="max-w-xl text-white">
            <span className="inline-block px-2 py-0.5 rounded bg-sky-500/30 text-sky-300 text-[10px] font-bold uppercase tracking-wider mb-1.5 backdrop-blur-sm">
              Sponsored Banner
            </span>
            <h3 className="font-extrabold text-sm sm:text-lg md:text-xl leading-tight mb-2 drop-shadow-md">
              {banner.title}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300 group-hover:text-white transition-colors">
              <span>Learn More</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
