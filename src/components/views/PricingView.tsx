import React, { useState } from 'react';
import { PricingPackage } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface PricingViewProps {
  packages: PricingPackage[];
  onSelectPackage: (pkg: PricingPackage) => void;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const PricingView: React.FC<PricingViewProps> = ({ packages, onSelectPackage }) => {
  const listingPackages = packages.filter((p) => p.type === 'listing');
  const advertPackages = packages.filter((p) => p.type === 'advert');
  const bannerPackages = packages.filter((p) => p.type === 'banner');

  // FAQ state: answers are hidden by default, clicked question pops up/toggles answer
  const [activeFaqPopup, setActiveFaqPopup] = useState<FAQItem | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'Can I really list my business for free?',
      answer: 'Yes! The Free Business Listing costs ₦0. You can submit your business name, address, phone number, logo, and WhatsApp link. Once reviewed by our moderation team, it is visible to thousands of potential customers across Nigeria.'
    },
    {
      id: 2,
      question: 'How do customers contact me?',
      answer: 'Every business profile and individual product advert features a direct WhatsApp contact button and phone number. When visitors click it, it opens WhatsApp with your prefilled product title so they can chat directly with you—zero middlemen.'
    },
    {
      id: 3,
      question: 'How are payments processed?',
      answer: 'All payments on AHAVA DIGITAL HUB are securely processed through Paystack. You can pay with Nigerian debit cards (Mastercard, Visa, Verve), Bank Transfer, or USSD code. Transactions are immediately verified and your package is activated.'
    },
    {
      id: 4,
      question: 'What happens when my package expires?',
      answer: 'You will receive an expiration notice on your dashboard. You can renew your campaign in one click with Paystack, or choose to remain on the standard free tier without losing your business directory profile.'
    },
    {
      id: 5,
      question: 'Can I advertise individual products without a physical store?',
      answer: 'Yes! Any merchant, online seller, or service provider can post individual product and service advertisements on the AHAVA DIGITAL HUB marketplace and promote them directly to buyers.'
    },
    {
      id: 6,
      question: 'How do I access the administrator controls?',
      answer: 'The administrative portal is accessible at /admin with the master credentials. The administrator can approve submissions, edit categories, manage banners, and view financial transaction reports.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-sky-200 text-blue-950 text-xs font-black uppercase tracking-wider border border-sky-300">
          Affordable, High-ROI Advertising
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
          Transparent Nigerian Pricing. <br className="hidden sm:inline" />
          <span className="text-blue-950">Zero Hidden Charges.</span>
        </h1>
        <p className="text-xs sm:text-base text-slate-800 font-semibold leading-relaxed">
          Put your business in front of thousands of potential buyers across Nigeria on AHAVA DIGITAL HUB. Securely processed in Naira via Paystack.
        </p>
      </div>

      {/* SECTION 1: BUSINESS DIRECTORY LISTING PACKAGES */}
      <section className="space-y-6">
        <div className="border-b border-sky-300 pb-3">
          <h2 className="text-xl font-black text-slate-950">1. Business Directory Listings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listingPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 sm:p-8 rounded-3xl bg-sky-50 border flex flex-col justify-between transition-all ${
                pkg.popular
                  ? 'border-sky-500 shadow-xl ring-2 ring-sky-500/20 relative'
                  : 'border-sky-300 shadow-sm hover:shadow-md'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-950 text-sky-200 font-black text-[11px] uppercase tracking-wider shadow-md border border-sky-400">
                  Most Popular Choice
                </div>
              )}

              <div>
                <h3 className="font-black text-slate-950 text-xl">{pkg.name}</h3>
                <div className="my-5">
                  <div className="text-3xl sm:text-4xl font-black text-blue-950">
                    {formatNaira(pkg.price)}
                  </div>
                  <span className="text-xs text-slate-700 font-black">{pkg.duration_label}</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-800 font-bold my-6">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-black">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPackage(pkg)}
                className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 ${
                  pkg.popular
                    ? 'bg-blue-950 hover:bg-blue-900 text-white'
                    : 'bg-sky-200 hover:bg-sky-300 text-slate-950 border border-sky-300'
                }`}
              >
                {pkg.price === 0 ? 'Get Started (Free)' : `Choose ${pkg.name}`}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: PRODUCT & SERVICE ADVERTISEMENT PACKAGES */}
      <section className="space-y-6">
        <div className="border-b border-sky-300 pb-3">
          <h2 className="text-xl font-black text-slate-950">2. Marketplace Product & Service Adverts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advertPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 sm:p-8 rounded-3xl bg-sky-50 border flex flex-col justify-between transition-all ${
                pkg.popular
                  ? 'border-sky-500 shadow-xl ring-2 ring-sky-500/20 relative'
                  : 'border-sky-300 shadow-sm hover:shadow-md'
              }`}
            >
              {pkg.badge && (
                <span className="inline-block px-3 py-1 rounded-full bg-amber-200 text-amber-950 text-[10px] font-black uppercase tracking-wider mb-2 self-start border border-amber-300">
                  {pkg.badge}
                </span>
              )}

              <div>
                <h3 className="font-black text-slate-950 text-xl">{pkg.name}</h3>
                <div className="my-4">
                  <div className="text-3xl sm:text-4xl font-black text-blue-950">
                    {formatNaira(pkg.price)}
                  </div>
                  <span className="text-xs text-slate-700 font-black">{pkg.duration_label}</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-800 font-bold my-6">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-black">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPackage(pkg)}
                className="w-full py-3.5 rounded-2xl bg-blue-950 hover:bg-blue-900 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Promote Advert for {formatNaira(pkg.price)}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: HOMEPAGE BANNER ADVERTISEMENT */}
      <section className="space-y-6">
        <div className="border-b border-sky-300 pb-3">
          <h2 className="text-xl font-black text-slate-950">3. High-Impact Homepage Banner Adverts</h2>
        </div>

        {bannerPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="p-6 sm:p-10 rounded-3xl bg-blue-950 text-white border border-sky-800/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-3 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-black uppercase tracking-wider">
                Maximum Brand Exposure
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{pkg.name}</h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                Position your brand at the very top of AHAVA DIGITAL HUB where tens of thousands of Nigerian consumers and corporate buyers land every single day.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-sky-200 pt-2 font-bold">
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-sky-400 font-black">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-left md:text-right flex flex-col items-start md:items-end justify-between space-y-4">
              <div>
                <span className="text-xs text-sky-300 block font-black">Campaign Fee</span>
                <div className="text-3xl sm:text-4xl font-black text-sky-400">{formatNaira(pkg.price)}</div>
                <span className="text-xs text-slate-300 font-bold">{pkg.duration_label}</span>
              </div>

              <button
                onClick={() => onSelectPackage(pkg)}
                className="px-8 py-3.5 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all active:scale-95"
              >
                Book Banner Advert
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* FREQUENTLY ASKED QUESTIONS - Answers hidden by default, pops up on click */}
      <section className="bg-sky-50 p-6 sm:p-10 rounded-3xl border border-sky-300 space-y-6">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="px-3 py-1 rounded-full bg-sky-200 text-blue-950 font-black text-xs uppercase tracking-wider border border-sky-300 inline-block mb-2">
            Click Any Question Below
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950">Frequently Asked Questions</h3>
          <p className="text-xs sm:text-sm text-slate-800 font-semibold mt-1">
            Click on any question to pop up the detailed answer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq) => (
            <button
              key={faq.id}
              onClick={() => setActiveFaqPopup(faq)}
              className="text-left p-5 rounded-2xl bg-sky-100/90 hover:bg-sky-200 border border-sky-300 transition-all flex items-center justify-between gap-3 shadow-xs hover:shadow-md active:scale-98"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-950 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                  {faq.id}
                </span>
                <span className="font-extrabold text-slate-950 text-xs sm:text-sm">
                  {faq.question}
                </span>
              </div>
              <span className="px-2 py-1 rounded-lg bg-sky-200 text-blue-950 text-[11px] font-black uppercase whitespace-nowrap">
                Click to Read
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* FAQ POPUP MODAL */}
      {activeFaqPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-sky-50 rounded-3xl shadow-2xl overflow-hidden border-2 border-sky-400 p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-sky-200">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-blue-950 text-white text-xs font-black">
                  FAQ #{activeFaqPopup.id}
                </span>
                <span className="text-xs font-black text-blue-950 uppercase tracking-wider">
                  AHAVA DIGITAL HUB Help
                </span>
              </div>
              <button
                onClick={() => setActiveFaqPopup(null)}
                className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-xs transition-colors"
              >
                Close
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-950 leading-snug">
              {activeFaqPopup.question}
            </h3>

            <div className="p-4 rounded-2xl bg-sky-100 border border-sky-300 text-slate-900 text-xs sm:text-sm font-semibold leading-relaxed">
              {activeFaqPopup.answer}
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setActiveFaqPopup(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-xs shadow-md transition-all active:scale-95"
              >
                Got It, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
