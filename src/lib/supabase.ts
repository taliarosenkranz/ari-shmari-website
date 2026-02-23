import { createClient } from '@supabase/supabase-js';

// Supabase configuration - matches Python backend setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zadluwuwmvlylfnxdmvf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// TypeScript types matching your database schema
export interface Event {
  event_id: number;  // Primary key (integer)
  name: string;
  date: string;
  venue: string;
  start_time?: string;
  end_time?: string;
  chuppah_start_time?: string;
  dress_code?: string;
  location_map?: string;
  special_notes?: string;
  invitation_message?: string;
  invitation_image_url?: string;
  created_at?: string;
  user_id?: string;
}

export interface Guest {
  guest_id: number;
  event_id: number;
  name: string;
  phone_number: string;
  rsvp_status: 'pending' | 'confirmed' | 'declined';
  messaging_preference: 'whatsapp' | 'sms';
  invitation_received?: boolean;
}

export interface EventStatus {
  event_id: number;
  event_name: string;
  // Scheduling
  invitation_send_date?: string;
  client_confirmation_received?: boolean;
  invitations_sent_out?: boolean;
  guest_list_received?: boolean;
  // RSVP Reminders
  rsvp_reminder_count?: number;
  rsvp_reminder_date_1?: string;
  rsvp_reminder_date_2?: string;
  rsvp_reminder_date_3?: string;
  rsvp_reminder_stage?: string;
  // RSVP Messages
  rsvp_same_message_for_all?: boolean;
  rsvp_reminder_message_default?: string;
  rsvp_reminder_message_1?: string;
  rsvp_reminder_message_2?: string;
  rsvp_reminder_message_3?: string;
  // Stats
  total_guests?: number;
  total_confirmed?: number;
  total_pending?: number;
  total_declined?: number;
}

export interface Message {
  message_id: string;
  guest_id: string;
  message: string;
  response?: string;
  needs_human_followup: boolean;
  created_at?: string;
  // Optional: guest details when joined
  guest_name?: string;
  guest_phone?: string;
}

// Auth helper functions
export const authHelpers = {
  async signInWithGoogle() {
    // Use VITE_APP_URL if available, otherwise construct from window.location
    const appUrl = import.meta.env.VITE_APP_URL || `${window.location.origin}${import.meta.env.BASE_URL}`;
    const redirectUrl = `${appUrl}/events`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
    
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return session;
  }
};

export default supabase;
