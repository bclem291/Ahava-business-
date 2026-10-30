import React, { useState } from 'react';
import { PricingPackage, PaymentRecord } from '../types';
import { formatNaira } from '../utils/formatters';
import { paystackService } from '../services/paystackService';
import { storageService } from '../services/storageService';
import {
  X,
  ShieldCheck,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle,
  Loader2,
  Info
} from 'lucide-react';

interface PaystackPaymentModalProps {
  packageItem: PricingPackage | null;
  itemId: string;
  itemType: 'listing' | 'advert' | 'banner';
  itemTitle: string;
  onClose: () => void;
  onSuccess: (record: PaymentRecord) => void;
}

export const PaystackPaymentModal: React.FC<PaystackPaymentModalProps> = ({
  packageItem,
  itemId,
  itemType,
  itemTitle,
  onClose,
  onSuccess
}) => {
  const currentUser = storageService.getCurrentUser();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [selectedChannel, setSelectedChannel] = useState<'card' | 'bank_transfer' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedRecord, setCompletedRecord] = useState<PaymentRecord | null>(null);

  if (!packageItem) return null;

  const isLive = paystackService.isLiveConfigured;

  const handleProcessPayment = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address to receive payment receipt.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    try {
      const reference = paystackService.generateReference();

      // If Live Paystack key is set, we could invoke standard Paystack popup or API
      // In either mode, we call our verified server verification endpoint
      const result = await paystackService.verifyPayment(reference, {
        email,
        amount: packageItem.price,
        package: packageItem,
        itemId,
        itemType,
        itemTitle,
        userName: fullName || email.split('@')[0]
      });

      if (result.success && result.record) {
        setCompletedRecord(result.record);
        onSuccess(result.record);
      } else {
        setErrorMessage(result.message || 'Payment could not be processed.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during payment processing.';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-sky-50 rounded-3xl shadow-2xl overflow-hidden my-auto border border-sky-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">Paystack Secure Checkout</h3>
              <p className="text-xs text-sky-300">Fast, encrypted Naira transactions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completed State */}
        {completedRecord ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner border border-emerald-300">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-950">Payment Successful!</h2>
            <p className="text-slate-800 font-medium text-sm">
              Your payment for <span className="font-black text-blue-950">{packageItem.name}</span> has been confirmed. Your {itemType} "{itemTitle}" is now active with all premium benefits!
            </p>

            <div className="p-4 rounded-2xl bg-sky-100/70 border border-sky-300 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-700 font-semibold">Transaction Ref:</span>
                <span className="font-mono font-black text-slate-950">{completedRecord.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-semibold">Amount Paid:</span>
                <span className="font-black text-emerald-800">{formatNaira(completedRecord.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 font-semibold">Receipt Sent To:</span>
                <span className="font-bold text-slate-950">{completedRecord.user_email}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black text-sm shadow-md transition-all"
            >
              Back to Directory & Dashboard
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div className="p-5 sm:p-6 space-y-5">
            {/* Package Summary Box */}
            <div className="p-4 rounded-2xl bg-sky-100/80 border border-sky-300 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black text-blue-950 uppercase tracking-wider block">Selected Package</span>
                <h4 className="font-black text-slate-950 text-sm">{packageItem.name}</h4>
                <p className="text-xs text-slate-800 font-medium truncate max-w-xs">{itemTitle}</p>
              </div>
              <div className="text-right">
                <span className="text-lg sm:text-xl font-black text-blue-950 block">
                  {formatNaira(packageItem.price)}
                </span>
                <span className="text-[11px] text-slate-700 font-bold">{packageItem.duration_label}</span>
              </div>
            </div>

            {/* Test Mode vs Live Notification */}
            <div className="p-3 rounded-xl bg-amber-100/80 border border-amber-300 flex items-start gap-2.5 text-xs text-amber-950">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black">{isLive ? 'Live Paystack Gateway Active' : 'Paystack Sandbox Test Mode Active'}</span>
                <p className="text-amber-900 font-medium text-[11px] mt-0.5">
                  {isLive
                    ? 'Official live card/bank gateway enabled. Safe 256-bit SSL encryption.'
                    : 'Simulated Nigerian test environment. You can click "Complete Payment" to safely simulate Paystack card, bank, or USSD confirmation.'}
                </p>
              </div>
            </div>

            {/* User Input */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-blue-950 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Babatunde Alabi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/60 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-black text-blue-950 block mb-1">Email Address for Receipt</label>
                <input
                  type="email"
                  required
                  placeholder="name@business.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sky-300 bg-sky-100/60 focus:outline-none focus:border-sky-500 text-slate-950 font-bold placeholder-slate-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-black text-blue-950 block mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedChannel('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    selectedChannel === 'card'
                      ? 'border-blue-950 bg-blue-950 text-white font-black shadow-md'
                      : 'border-sky-300 bg-sky-100/50 text-slate-900 font-bold hover:bg-sky-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[11px]">Card (Verve/Visa)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('bank_transfer')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    selectedChannel === 'bank_transfer'
                      ? 'border-blue-950 bg-blue-950 text-white font-black shadow-md'
                      : 'border-sky-300 bg-sky-100/50 text-slate-900 font-bold hover:bg-sky-200'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span className="text-[11px]">Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('ussd')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    selectedChannel === 'ussd'
                      ? 'border-blue-950 bg-blue-950 text-white font-black shadow-md'
                      : 'border-sky-300 bg-sky-100/50 text-slate-900 font-bold hover:bg-sky-200'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-[11px]">USSD Code</span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-700 font-bold bg-red-100 p-3 rounded-xl border border-red-300">
                {errorMessage}
              </p>
            )}

            {/* Pay Button */}
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 disabled:opacity-50 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Transaction with Paystack...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay {formatNaira(packageItem.price)} via Paystack</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-700 font-semibold">
              Secured by Paystack • Instant activation upon verification
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
