import React from 'react';
import { getWhatsAppInquiryUrl } from '../utils/formatters';
import { storageService } from '../services/storageService';

interface WhatsAppButtonProps {
  phone: string;
  title: string;
  isAdvert?: boolean;
  type?: 'business' | 'advert';
  entityId?: string;
  variant?: 'primary' | 'outline' | 'compact' | 'large';
  className?: string;
  label?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone,
  title,
  isAdvert = false,
  type,
  entityId,
  variant = 'primary',
  className = '',
  label
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type && entityId) {
      storageService.trackWhatsAppClick(type, entityId);
    }
    const url = getWhatsAppInquiryUrl(phone, title, isAdvert);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        title="Chat on WhatsApp"
        className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-sm active:scale-95 ${className}`}
      >
        <span>WhatsApp</span>
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-100/70 font-extrabold text-xs sm:text-sm transition-all active:scale-95 ${className}`}
      >
        <span>{label || 'WhatsApp'}</span>
      </button>
    );
  }

  if (variant === 'large') {
    return (
      <button
        onClick={handleClick}
        className={`w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-98 ${className}`}
      >
        <span>{label || 'Chat on WhatsApp'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-sm transition-all active:scale-95 ${className}`}
    >
      <span>{label || 'WhatsApp'}</span>
    </button>
  );
};
