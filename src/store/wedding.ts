import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { supabase } from "../lib/supabase";

export interface WeddingDetails {
  id?: number;
  created_at?: string;
  groom: string;
  bride: string;
  groomFull: string;
  brideFull: string;
  groomParents: string;
  brideParents: string;
  weddingDate: string;
  akadDate: string;
  akadTime: string;
  receptionDate: string;
  receptionTime: string;
  venue: string;
  address: string;
  holyVerse: string;
  holyVerseRef: string;
  audioGroom?: string;
  audioBride?: string;
  photoGroom?: string;
  photoBride?: string;
  background?: string;
  audioTitleGroom?: string;
  audioTitleBride?: string;
  youtubeLink?: string;
  descriptionGroom?: string;
  descriptionBride?: string;
}

export interface LoveStoryItem {
  id?: number;
  created_at?: string;
  title: string;
  date: string;
  story: string;
  image: string;
}

export interface Guest {
  id?: number;
  code?: string;
  name: string;
  from: string;
  created_at?: string;
  avatar?: string;
  isMain?: boolean;
}

export interface Message {
  id?: number;
  name: string;
  message: string;
  created_at?: string;
  guest_uuid?: string;
  time?: string; // Untuk backward compatibility
}

export interface RSVPData {
  id?: number;
  created_at?: string;
  name: string;
  email: string;
  phone: string;
  attendance: string;
  guests: number | string;
  message: string;
  guest_uuid?: string;
}

export interface Gallery {
  id?: number;
  created_at?: string;
  image: string;
}

export interface Bank {
  id?: number;
  name: string;
  value: string;
  isGroom: boolean;
}

export interface GuestBook {
  id?: number;
  name: string;
  address: string;
  created_at?: string;
}

export const useWeddingStore = defineStore("wedding", () => {
  // State
  const weddingDetails = ref<WeddingDetails | null>(null);
  const loveStoryItems = ref<LoveStoryItem[]>([]);
  const galleryItems = ref<Gallery[]>([]);
  const guest = ref<Guest | null>(null);
  const messages = ref<Message[]>([]);
  const layoutSection = ref<string>("guest");
  const soundActive = ref<string>("groom");
  const bankAccounts = ref<Bank[]>([]);
  const openModalRSVP = ref<boolean>(false);

  const guestBookEntries = ref<GuestBook[]>([]);

  const loading = reactive({
    weddingDetails: false,
    loveStoryItems: false,
    galleryItems: false,
    guest: false,
    messages: false,
    bankAccounts: false,
  });

  const error = reactive({
    weddingDetails: null as string | null,
    loveStoryItems: null as string | null,
    guest: null as string | null,
    messages: null as string | null,
    rsvp: null as string | null,
    message: null as string | null,
    galleryItems: null as string | null,
    bankAccounts: null as string | null,
    guestBook: null as string | null,
  });

  // Actions
  async function fetchWeddingDetails() {
    loading.weddingDetails = true;
    error.weddingDetails = null;

    try {
      // Only fetch one record
      const { data, error: supabaseError } = await supabase
        .from("wedding_details")
        .select("*")
        .limit(1)
        .single();

      if (supabaseError) throw supabaseError;

      weddingDetails.value = data;
    } catch (err: any) {
      console.error("Error fetching wedding details:", err);
      error.weddingDetails = err.message;
    } finally {
      loading.weddingDetails = false;
    }
  }

  async function fetchLoveStoryItems() {
    loading.loveStoryItems = true;
    error.loveStoryItems = null;

    try {
      // Fetch all love story items
      const { data, error: supabaseError } = await supabase
        .from("love_story_item")
        .select("*")
        .order("date", { ascending: true });

      if (supabaseError) throw supabaseError;

      loveStoryItems.value = data || [];
    } catch (err: any) {
      console.error("Error fetching love story items:", err);
      error.loveStoryItems = err.message;
    } finally {
      loading.loveStoryItems = false;
    }
  }

  async function fetchGuest(guestCode: string) {
    loading.guest = true;
    error.guest = null;

    try {
      // Fetch guest by code
      const { data, error: supabaseError } = await supabase
        .from("guest")
        .select("*")
        .eq("code", guestCode)
        .single();

      if (supabaseError) throw supabaseError;

      guest.value = {
        ...data,
        avatar: data.avatar || "", // Set default if missing
        isMain: true, // Default value
      };
    } catch (err: any) {
      console.error("Error fetching guest:", err);
      error.guest = err.message;
    } finally {
      loading.guest = false;
    }
  }

  async function fetchMessages() {
    loading.messages = true;
    error.messages = null;

    try {
      // Fetch all messages
      const { data, error: supabaseError } = await supabase
        .from("message")
        .select("*")
        .order("created_at", { ascending: true });

      if (supabaseError) throw supabaseError;

      messages.value = (data || []).map((msg) => ({
        ...msg,
        time: msg.created_at
          ? new Date(msg.created_at).toLocaleTimeString()
          : "",
      }));
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      error.messages = err.message;
    } finally {
      loading.messages = false;
    }
  }

  async function fetchGalleryItems() {
    loading.galleryItems = true;
    error.galleryItems = null;

    try {
      // Fetch all gallery items
      const { data, error: supabaseError } = await supabase
        .from("gallery")
        .select("*")
        .order("id", { ascending: true });

      if (supabaseError) throw supabaseError;

      galleryItems.value = data || [];
    } catch (err: any) {
      console.error("Error fetching gallery items:", err);
      error.galleryItems = err.message;
    } finally {
      loading.galleryItems = false;
    }
  }

  async function postMessage(
    messageData: Omit<Message, "id" | "created_at" | "time">
  ) {
    error.message = null;

    try {
      const { data, error: supabaseError } = await supabase
        .from("message")
        .insert([messageData])
        .select();

      if (supabaseError) throw supabaseError;

      // Add the new message to the list
      if (data && data.length > 0) {
        const newMessage = {
          ...data[0],
          time: new Date(data[0].created_at).toLocaleTimeString(),
        };
        messages.value = [...messages.value, newMessage];
      }

      return true;
    } catch (err: any) {
      console.error("Error posting message:", err);
      error.message = err.message;
      return false;
    }
  }

  async function submitRSVP(rsvpData: Omit<RSVPData, "id" | "created_at">) {
    error.rsvp = null;

    try {
      // Ensure guests is a number
      const formattedData = {
        ...rsvpData,
        guests:
          typeof rsvpData.guests === "string"
            ? parseInt(rsvpData.guests, 10)
            : rsvpData.guests,
      };

      const { error: supabaseError } = await supabase
        .from("rsvp")
        .insert([formattedData]);

      if (supabaseError) throw supabaseError;

      return true;
    } catch (err: any) {
      console.error("Error submitting RSVP:", err);
      error.rsvp = err.message;
      return false;
    }
  }

  async function fetchBankAccounts() {
    loading.bankAccounts = true;
    error.bankAccounts = null;

    try {
      // Fetch all bank accounts
      const { data, error: supabaseError } = await supabase
        .from("banks")
        .select("*")
        .order("isGroom", { ascending: false });

      if (supabaseError) throw supabaseError;

      bankAccounts.value = data || [];
    } catch (err: any) {
      console.error("Error fetching bank accounts:", err);
      error.bankAccounts = err.message;
    } finally {
      loading.bankAccounts = false;
    }
  }

  async function fetchGuestBookEntries() {
    try {
      const { data, error: supabaseError } = await supabase
        .from("guest_books")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      guestBookEntries.value = data || [];
    } catch (err: any) {
      console.error("Error fetching guest book entries:", err);
    }
  }

  async function postGuestBookEntry(
    entryData: Omit<GuestBook, "id" | "created_at">
  ) {
    try {
      const { data, error: supabaseError } = await supabase
        .from("guest_books")
        .insert([entryData])
        .select();

      if (supabaseError) throw supabaseError;

      // Add the new entry to the list
      if (data && data.length > 0) {
        guestBookEntries.value = [data[0], ...guestBookEntries.value];
      }

      return true;
    } catch (err: any) {
      console.error("Error posting guest book entry:", err);
      return false;
    }
  }

  return {
    // State
    weddingDetails,
    loveStoryItems,
    guest,
    messages,
    loading,
    error,
    galleryItems,
    layoutSection,
    soundActive,
    bankAccounts,
    openModalRSVP,
    guestBookEntries,

    // Actions
    fetchWeddingDetails,
    fetchLoveStoryItems,
    fetchGuest,
    fetchMessages,
    postMessage,
    submitRSVP,
    fetchGalleryItems,
    fetchBankAccounts,
    fetchGuestBookEntries,
    postGuestBookEntry,
  };
});
