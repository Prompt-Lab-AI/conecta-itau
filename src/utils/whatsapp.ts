/**
 * WhatsApp Deeplink Generator (100% Gratuito via wa.me)
 */

export function cleanPhoneNumber(phone: string): string {
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');
  
  // If no country code, add Brazil (55)
  if (digits.length === 10 || digits.length === 11) {
    digits = `55${digits}`;
  }
  
  return digits;
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function openWhatsAppChat(phone: string, message: string) {
  const url = generateWhatsAppUrl(phone, message);
  window.open(url, '_blank', 'noopener,noreferrer');
}
