import { supabase, Event, Guest, EventStatus, Message } from './supabase';

/**
 * API Client for Event Management
 * Replaces base44Client with real Supabase operations
 * Matches the Python backend database structure
 */

// ==================== EVENTS ====================

export const events = {
  /**
   * Get all events for the current user
   */
  async list(options?: { sort?: Record<string, number> }) {
    try {
      let query = supabase
        .from('events')
        .select('*');

      // Apply sorting if provided
      if (options?.sort) {
        const [field, order] = Object.entries(options.sort)[0];
        query = query.order(field, { ascending: order === 1 });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Event[];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  /**
   * Get a single event by ID
   */
  async get(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_id', eventId)
        .single();

      if (error) throw error;
      return data as Event;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  /**
   * Create a new event
   */
  async create(eventData: Partial<Event>) {
    try {
      // Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Must be authenticated to create event');
      }

      // Add user_id to event data for RLS
      const eventWithUser = {
        ...eventData,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('events')
        .insert([eventWithUser])
        .select()
        .single();

      if (error) throw error;
      return data as Event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  /**
   * Update an existing event
   */
  async update(eventId: string, updates: Partial<Event>) {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('event_id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data as Event;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  /**
   * Delete an event
   */
  async delete(eventId: string) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('event_id', eventId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};

// ==================== GUESTS ====================

export const guests = {
  /**
   * Get all guests for an event
   */
  async list(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      return data as Guest[];
    } catch (error) {
      console.error('Error fetching guests:', error);
      throw error;
    }
  },

  /**
   * Get a single guest by ID
   */
  async get(guestId: string) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('guest_id', guestId)
        .single();

      if (error) throw error;
      return data as Guest;
    } catch (error) {
      console.error('Error fetching guest:', error);
      throw error;
    }
  },

  /**
   * Create a new guest
   */
  async create(guestData: Partial<Guest>) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert([guestData])
        .select()
        .single();

      if (error) throw error;
      return data as Guest;
    } catch (error) {
      console.error('Error creating guest:', error);
      throw error;
    }
  },

  /**
   * Bulk create guests (for CSV upload)
   */
  async bulkCreate(guestsData: Partial<Guest>[]) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert(guestsData)
        .select();

      if (error) throw error;
      return data as Guest[];
    } catch (error) {
      console.error('Error bulk creating guests:', error);
      throw error;
    }
  },

  /**
   * Update an existing guest
   */
  async update(guestId: string, updates: Partial<Guest>) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update(updates)
        .eq('guest_id', guestId)
        .select()
        .single();

      if (error) throw error;
      return data as Guest;
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  },

  /**
   * Delete a guest
   */
  async delete(guestId: string) {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('guest_id', guestId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting guest:', error);
      throw error;
    }
  },

  /**
   * Update RSVP status (matches Python backend function)
   */
  async updateRsvpStatus(phoneNumber: string, newStatus: Guest['rsvp_status']) {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update({ rsvp_status: newStatus })
        .eq('phone_number', phoneNumber)
        .select();

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error('Error updating RSVP status:', error);
      throw error;
    }
  }
};

// ==================== EVENT STATUS ====================

export const eventStatus = {
  /**
   * Get status for an event
   */
  async get(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('event_status')
        .select('*')
        .eq('event_id', eventId)
        .single();

      if (error) throw error;
      return data as EventStatus;
    } catch (error) {
      console.error('Error fetching event status:', error);
      throw error;
    }
  },

  /**
   * Create or update event status
   */
  async upsert(statusData: Partial<EventStatus>) {
    try {
      const { data, error } = await supabase
        .from('event_status')
        .upsert([statusData])
        .select()
        .single();

      if (error) throw error;
      return data as EventStatus;
    } catch (error) {
      console.error('Error upserting event status:', error);
      throw error;
    }
  }
};

// ==================== MESSAGES ====================

export interface MessageWithGuest extends Message {
  guest_name?: string;
  guest_phone?: string;
}

export const messages = {
  /**
   * Get all messages for a guest
   */
  async list(guestId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('guest_id', guestId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  /**
   * Get all messages for an event (uses event_id column on messages table)
   */
  async listForEvent(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    } catch (error) {
      console.error('Error fetching event messages:', error);
      throw error;
    }
  },

  /**
   * Get messages needing human followup (all events)
   */
  async getFollowupNeeded() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('needs_human_followup', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    } catch (error) {
      console.error('Error fetching followup messages:', error);
      throw error;
    }
  },

  /**
   * Get messages needing human followup for a specific event
   * Joins with guests table to include guest name and phone
   */
  async getFollowupNeededForEvent(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          guests(name, phone_number)
        `)
        .eq('event_id', eventId)
        .eq('needs_human_followup', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the nested guest data to flat properties
      return data.map((msg: any) => ({
        ...msg,
        guest_name: msg.guests?.name,
        guest_phone: msg.guests?.phone_number
      })) as Message[];
    } catch (error) {
      console.error('Error fetching event followup messages:', error);
      throw error;
    }
  },

  /**
   * Mark a message as resolved (no longer needs human followup)
   */
  async resolveMessage(messageId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ needs_human_followup: false })
        .eq('message_id', messageId)
        .select()
        .single();

      if (error) throw error;
      return data as Message;
    } catch (error) {
      console.error('Error resolving message:', error);
      throw error;
    }
  },

  /**
   * Insert a new message (matches Python backend function)
   */
  async create(messageData: Partial<Message>) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;
      return data as Message;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  /**
   * Get message statistics for an event
   */
  async getStatsForEvent(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('needs_human_followup')
        .eq('event_id', eventId);

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        needingAttention: data?.filter(m => m.needs_human_followup).length || 0,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw error;
    }
  }
};

// ==================== COMBINED API EXPORT ====================

export const api = {
  events,
  guests,
  eventStatus,
  messages
};

export default api;
