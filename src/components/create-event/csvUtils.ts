/**
 * CSV Parsing Utilities for Guest List Upload
 */

export interface ParsedGuest {
  name: string;
  phone_number: string;
  email?: string;
  messaging_preference?: 'whatsapp' | 'sms';
  plus_one_allowed?: boolean;
  dietary_restrictions?: string;
}

/**
 * Parse CSV file content into guest objects
 */
export function parseCSV(csvContent: string): ParsedGuest[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file must contain headers and at least one row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const guests: ParsedGuest[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const guest: ParsedGuest = {
      name: '',
      phone_number: '',
    };

    headers.forEach((header, index) => {
      const value = values[index];
      
      switch (header) {
        case 'name':
          guest.name = value;
          break;
        case 'phone':
        case 'phone_number':
        case 'phone number':
          guest.phone_number = value;
          break;
        case 'email':
          guest.email = value;
          break;
        case 'messaging_preference':
        case 'messaging preference':
        case 'preference':
        case 'contact_preference':
        case 'contact preference':
          // Default to 'sms' if not specified or invalid
          if (value?.toLowerCase() === 'whatsapp') {
            guest.messaging_preference = 'whatsapp';
          } else {
            guest.messaging_preference = 'sms';
          }
          break;
        case 'plus_one':
        case 'plus_one_allowed':
          guest.plus_one_allowed = value?.toLowerCase() === 'true' || value === '1';
          break;
        case 'dietary_restrictions':
        case 'dietary':
          guest.dietary_restrictions = value;
          break;
      }
    });

    if (guest.name && guest.phone_number) {
      guests.push(guest);
    }
  }

  return guests;
}

/**
 * Validate phone number format
 * Accepts various international formats
 */
export function validatePhone(phone: string): boolean {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check if it's a valid format
  // Should be at least 10 digits, can start with + for international
  const phoneRegex = /^\+?\d{10,15}$/;
  
  return phoneRegex.test(cleaned);
}

/**
 * Format phone number to E.164 format (international standard)
 * Example: +1234567890
 */
export function formatPhoneE164(phone: string, countryCode: string = '+1'): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If already has country code, return as is
  if (phone.startsWith('+')) {
    return '+' + digits;
  }
  
  // Add country code if missing
  return countryCode + digits;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate CSV template for guest list
 */
export function generateCSVTemplate(): string {
  const headers = ['name', 'phone_number', 'email', 'messaging_preference', 'plus_one_allowed', 'dietary_restrictions'];
  const exampleRow = ['John Doe', '+1234567890', 'john@example.com', 'sms', 'true', 'Vegetarian'];
  
  return [headers.join(','), exampleRow.join(',')].join('\n');
}

/**
 * Download CSV template as a file
 */
export function downloadCSVTemplate(): void {
  const csv = generateCSVTemplate();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'guest_list_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
