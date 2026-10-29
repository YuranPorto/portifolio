// Centralized contact configuration
export const CONTACT_CONFIG = {
  // Replace with your real WhatsApp number (format: country code + area code + number, e.g. 5511999999999)
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '5512982096857',
  
  // Destination email address for forms
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'yuranporto@gmail.com',

  // Optional Web3Forms public access key (if preferred over FormSubmit)
  web3FormsKey: import.meta.env.VITE_WEB3FORMS_KEY || '',
}

