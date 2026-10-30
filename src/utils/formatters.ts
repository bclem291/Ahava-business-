/**
 * Formatting and WhatsApp Helper Utilities
 */

/**
 * Format currency in Nigerian Naira (₦)
 */
export function formatNaira(amount: number | null | undefined): string {
  if (amount === undefined || amount === null) return '₦0';
  if (amount === 0) return '₦0';
  return '₦' + Number(amount).toLocaleString('en-NG');
}

/**
 * Clean and format Nigerian phone number into standard international format for WhatsApp (e.g. 2348035551234)
 */
export function cleanWhatsAppNumber(phone: string): string {
  if (!phone) return '2348000000000';
  // Strip all spaces, dashes, parentheses, plus signs
  let cleaned = phone.replace(/[^0-9]/g, '');
  
  // If starts with 0 (e.g. 0803...), replace leading 0 with 234
  if (cleaned.startsWith('0') && cleaned.length >= 10) {
    cleaned = '234' + cleaned.substring(1);
  }
  
  // If doesn't start with 234 and is 10 digits
  if (!cleaned.startsWith('234') && cleaned.length === 10) {
    cleaned = '234' + cleaned;
  }
  
  return cleaned;
}

/**
 * Generate official WhatsApp click-to-chat URL with prefilled inquiry message
 */
export function getWhatsAppInquiryUrl(phone: string, businessOrAdvertTitle: string, isAdvert: boolean = false): string {
  const normalizedNumber = cleanWhatsAppNumber(phone);
  let message = '';
  
  if (isAdvert) {
    message = `Hello, I saw your advert "${businessOrAdvertTitle}" on Ahava Business Hub and would like to inquire about purchasing / booking it.`;
  } else {
    message = `Hello, I found your business "${businessOrAdvertTitle}" on Ahava Business Hub and would like to know more about your products and services.`;
  }
  
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Format date string into human friendly format
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculate days remaining before expiry
 */
export function getDaysRemaining(expiryDateString?: string): { days: number; isExpired: boolean } {
  if (!expiryDateString) return { days: 999, isExpired: false };
  const now = new Date().getTime();
  const expiry = new Date(expiryDateString).getTime();
  const diff = expiry - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return {
    days: Math.max(0, days),
    isExpired: diff <= 0
  };
}
