import React from 'react';
import { X, ShieldCheck, FileText, RefreshCw } from 'lucide-react';

interface PolicyModalProps {
  type: 'terms' | 'privacy' | 'refund' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-sky-50 rounded-3xl shadow-2xl overflow-hidden border border-sky-300 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
              {type === 'terms' && <FileText className="w-6 h-6" />}
              {type === 'privacy' && <ShieldCheck className="w-6 h-6" />}
              {type === 'refund' && <RefreshCw className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-black text-lg">
                {type === 'terms' && 'Terms and Conditions'}
                {type === 'privacy' && 'Privacy Policy'}
                {type === 'refund' && 'Refund and Cancellation Policy'}
              </h3>
              <p className="text-xs text-sky-300">Ahava Business Hub Legal Information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-slate-800 text-sm leading-relaxed">
          {type === 'terms' && (
            <>
              <h4 className="font-black text-slate-950 text-base">1. Acceptance of Terms</h4>
              <p className="font-medium text-slate-800">
                By accessing or registering on Ahava Business Hub ("Platform"), you agree to abide by these terms. Ahava Business Hub operates as an online business directory and advertising marketplace connecting Nigerian businesses to potential customers.
              </p>
              <h4 className="font-black text-slate-950 text-base">2. Merchant Responsibility</h4>
              <p className="font-medium text-slate-800">
                Business owners and advertisers are strictly responsible for the accuracy of their products, services, contact details, and prices. Prohibited items (counterfeits, stolen goods, weapons, illegal substances, fraudulent financial schemes) are strictly forbidden and will result in immediate permanent suspension.
              </p>
              <h4 className="font-black text-slate-950 text-base">3. Buyer Disclaimer</h4>
              <p className="font-medium text-slate-800">
                Ahava Business Hub does not process customer product orders, hold buyer funds in escrow, or ship physical merchandise directly. Customers contact advertisers directly via WhatsApp or phone. Buyers should exercise diligence before releasing funds.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <h4 className="font-black text-slate-950 text-base">1. Information We Collect</h4>
              <p className="font-medium text-slate-800">
                We collect information provided when registering a business profile, submitting adverts, or initiating contact, including business name, email, phone number, location, and photos.
              </p>
              <h4 className="font-black text-slate-950 text-base">2. WhatsApp Click-to-Chat</h4>
              <p className="font-medium text-slate-800">
                When a visitor clicks the WhatsApp contact button, standard metadata (time of interaction, item title) is aggregated for business analytics. No private WhatsApp message contents are stored on our servers.
              </p>
              <h4 className="font-black text-slate-950 text-base">3. Data Security & Payment Cards</h4>
              <p className="font-medium text-slate-800">
                Ahava Business Hub never stores full credit/debit card numbers or CVV codes. All payments are processed through PCI-DSS certified payment processors like Paystack.
              </p>
            </>
          )}

          {type === 'refund' && (
            <>
              <h4 className="font-black text-slate-950 text-base">1. Listing and Advert Fees</h4>
              <p className="font-medium text-slate-800">
                Fees paid for standard, featured, or premium business listings, individual product adverts, or homepage banner placements cover immediate digital publication, priority indexing, and advertising server bandwidth.
              </p>
              <h4 className="font-black text-slate-950 text-base">2. Rejected Submissions</h4>
              <p className="font-medium text-slate-800">
                If a paid advertisement or listing is rejected by our moderation team for non-compliance, the advertiser is granted an opportunity to amend the submission. If the issue cannot be resolved, a full refund or platform credit is issued within 5-7 business days.
              </p>
            </>
          )}

          <div className="pt-4 border-t border-sky-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
