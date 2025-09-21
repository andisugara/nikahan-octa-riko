<template>
  <div class="min-h-screen bg-black text-white pt-20 pb-16">
    <div class="max-w-4xl mx-auto px-4 md:px-8">
      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Buku Tamu</h1>
        <p class="text-gray-400 max-w-2xl mx-auto">
          Terima kasih telah menghadiri pernikahan kami. Silakan tinggalkan tanda tangan Anda sebagai kenang-kenangan di buku tamu kami.
        </p>
      </header>

      <!-- Form Section -->
      <div class="bg-gray-900 rounded-lg border border-gray-800 p-6 md:p-8 mb-10">
        <h2 class="text-xl font-bold mb-6 text-red-500">Isi Buku Tamu</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nama -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-1">Nama</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Masukkan nama lengkap Anda"
              :disabled="isSubmitting"
            />
          </div>
          
          <!-- Alamat -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-300 mb-1">Alamat</label>
            <input
              id="address"
              v-model="form.address"
              type="text"
              class="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Kota atau alamat Anda"
              :disabled="isSubmitting"
            />
          </div>
          
          <!-- Error -->
          <div v-if="error" class="px-4 py-3 rounded-lg bg-red-900/40 border border-red-800 text-red-200 text-sm">
            {{ error }}
          </div>
          
          <!-- Success -->
          <div v-if="success" class="px-4 py-3 rounded-lg bg-green-900/40 border border-green-800 text-green-200 text-sm">
            Terima kasih! Tanda tangan Anda telah disimpan dalam buku tamu.
          </div>
          
          <!-- Submit Button -->
          <div class="flex justify-end pt-2">
            <button
              type="submit"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitDisabled"
            >
              <span v-if="isSubmitting">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </span>
              <span v-else>Tanda Tangan</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Guest Book Entries -->
      <div>
        <h2 class="text-xl font-bold mb-6 flex items-center">
          <span class="text-red-500">Daftar Tamu</span>
          <span class="ml-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full">{{ guestBookEntries.length }}</span>
        </h2>

        <div v-if="loadingEntries" class="text-center py-12">
          <div class="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-400">Memuat data tamu...</p>
        </div>

        <div v-else-if="guestBookEntries.length === 0" class="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
          <p class="text-gray-400">Belum ada tanda tangan di buku tamu</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="entry in guestBookEntries" 
            :key="entry.id"
            class="bg-gray-900 rounded-lg border border-gray-800 p-5 flex items-center"
          >
            <div class="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg mr-4">
              {{ entry.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h3 class="font-bold">{{ entry.name }}</h3>
              <p class="text-gray-400 text-sm">{{ entry.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useWeddingStore } from '@/store/wedding';
import type { GuestBook } from '@/store/wedding';

const store = useWeddingStore();

// Form state
const form = ref({
  name: '',
  address: '',
});

const isSubmitting = ref(false);
const success = ref(false);
const error = ref('');
const loadingEntries = ref(true);

// Computed properties
const isSubmitDisabled = computed(() => {
  return isSubmitting.value || !form.value.name || !form.value.address;
});

const guestBookEntries = computed(() => store.guestBookEntries);

// Methods
const handleSubmit = async () => {
  // Validate form
  if (!form.value.name || !form.value.address) {
    error.value = 'Mohon lengkapi semua field yang diperlukan.';
    return;
  }
  
  // Reset error
  error.value = '';
  isSubmitting.value = true;
  
  try {
    const entryData: Omit<GuestBook, 'id' | 'created_at'> = {
      name: form.value.name,
      address: form.value.address,
    };
    
    const submitSuccess = await store.postGuestBookEntry(entryData);
    
    if (submitSuccess) {
      // Show success message
      success.value = true;
      
      // Reset form
      form.value = {
        name: '',
        address: '',
      };
      
      // Hide success message after delay
      setTimeout(() => {
        success.value = false;
      }, 5000);
    } else {
      error.value = 'Gagal menyimpan data. Silakan coba lagi.';
    }
  } catch (err: any) {
    console.error('Error submitting guest book entry:', err);
    error.value = 'Terjadi kesalahan saat menyimpan data Anda.';
  } finally {
    isSubmitting.value = false;
  }
};

// Load guest book entries on component mount
onMounted(async () => {
  try {
    loadingEntries.value = true;
    await store.fetchGuestBookEntries();
  } catch (error) {
    console.error('Error fetching guest book entries:', error);
  } finally {
    loadingEntries.value = false;
  }
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
