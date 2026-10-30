import React from 'react';
import { SiteSettings } from '../types';
import { getWhatsAppInquiryUrl } from '../utils/formatters';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (tab: string) => void;
  onOpenPolicy: (type: 'terms' | 'privacy' | 'refund') => void;
  onOpenContact: () => void;
  onOpenAuth: (mode?: 'login' | 'register' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenPolicy,
  onOpenContact,
  onOpenAuth
}) => {
  const handleWhatsApp = () => {
    const url = getWhatsAppInquiryUrl(settings.contact_whatsapp, 'AHAVA DIGITAL HUB Support Desk');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-slate-950 text-slate-200 pt-16 pb-12 border-t border-sky-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Bio with Uploaded Logo Image */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/IMG_20261028_235227_fcd2bf8e.png"
                alt="AHAVA DIGITAL HUB"
                className="h-14 w-auto object-contain bg-sky-50 p-1.5 rounded-2xl shadow-md"
              />
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-white">
                  AHAVA DIGITAL HUB
                </span>
                <span className="text-xs text-sky-400 font-bold">
                  Connecting Businesses to More Customers
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Connecting Businesses to More Customers. Nigeria's premier digital business directory and advertising marketplace, designed to scale locally and globally.
            </p>

            <div className="pt-2">
              <button
                onClick={handleWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all active:scale-95"
              >
                WhatsApp Customer Desk
              </button>
            </div>
          </div>

          {/* Column 2: Discover & Marketplace */}
          <div className="space-y-3">
            <h4 className="font-black text-white text-xs uppercase tracking-wider">Explore Hub</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li>
                <button onClick={() => onNavigate('businesses')} className="hover:text-sky-300 transition-colors">
                  Find Nigerian Businesses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('adverts')} className="hover:text-sky-300 transition-colors">
                  Browse Product Adverts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-sky-300 transition-colors">
                  All 16 Industry Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-sky-300 transition-colors">
                  Pricing & Promotion Packages
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: For Business Owners */}
          <div className="space-y-3">
            <h4 className="font-black text-white text-xs uppercase tracking-wider">Business Owners</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li>
                <button onClick={() => onOpenAuth('register')} className="hover:text-sky-300 transition-colors">
                  List Your Business (Free)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-sky-300 transition-colors">
                  Advertise Products & Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-sky-300 transition-colors">
                  Homepage Banner Placement
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('login')} className="hover:text-sky-300 transition-colors">
                  Business Owner Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-sky-400 hover:text-white transition-colors font-extrabold"
                >
                  Administrator Portal (/admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="font-black text-white text-xs uppercase tracking-wider">Support & Policies</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-300">
              <li>
                <button onClick={onOpenContact} className="hover:text-sky-300 transition-colors">
                  Contact Us / Help Center
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('terms')} className="hover:text-sky-300 transition-colors">
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-sky-300 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('refund')} className="hover:text-sky-300 transition-colors">
                  Refund & Cancellation Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
          <div>
            © 2026 AHAVA DIGITAL HUB. All rights reserved. Connecting Nigerian Businesses to More Customers.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span>Coverage: Lagos • Abuja FCT • Port Harcourt • Ibadan • Kano • Enugu • Nationwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
