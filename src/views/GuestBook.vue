<template>
  <div class="min-h-screen bg-black text-white pt-20 pb-16">
    <div class="max-w-4xl mx-auto px-4 md:px-8">
      <!-- Navigation -->
      <div class="mb-8 flex justify-between items-center">
        <router-link
          to="/guest-book/list"
          class="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          Lihat Daftar Tamu
        </router-link>
      </div>

      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Buku Tamu</h1>
        <p class="text-gray-400 max-w-2xl mx-auto">
          Terima kasih telah menghadiri pernikahan kami. Silakan tinggalkan
          tanda tangan Anda sebagai kenang-kenangan di buku tamu kami.
        </p>
      </header>

      <!-- Form Section -->
      <div
        class="bg-gray-900 rounded-lg border border-gray-800 p-6 md:p-8 mb-10"
      >
        <h2 class="text-xl font-bold mb-6 text-red-500">Isi Buku Tamu</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nama -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-300 mb-1"
              >Nama</label
            >
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
            <label
              for="address"
              class="block text-sm font-medium text-gray-300 mb-1"
              >Alamat</label
            >
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
          <div
            v-if="error"
            class="px-4 py-3 rounded-lg bg-red-900/40 border border-red-800 text-red-200 text-sm"
          >
            {{ error }}
          </div>

          <!-- Success -->
          <div
            v-if="success"
            class="px-4 py-3 rounded-lg bg-green-900/40 border border-green-800 text-green-200 text-sm"
          >
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
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Mengirim...
              </span>
              <span v-else>Tanda Tangan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useWeddingStore } from "@/store/wedding";
import type { GuestBook } from "@/store/wedding";

const store = useWeddingStore();

// Form state
const form = ref({
  name: "",
  address: "",
});

const isSubmitting = ref(false);
const success = ref(false);
const error = ref("");
const loadingEntries = ref(true);

// Computed properties
const isSubmitDisabled = computed(() => {
  return isSubmitting.value || !form.value.name || !form.value.address;
});

// Methods
const handleSubmit = async () => {
  // Validate form
  if (!form.value.name || !form.value.address) {
    error.value = "Mohon lengkapi semua field yang diperlukan.";
    return;
  }

  // Reset error
  error.value = "";
  isSubmitting.value = true;

  try {
    const entryData: Omit<GuestBook, "id" | "created_at"> = {
      name: form.value.name,
      address: form.value.address,
    };

    const submitSuccess = await store.postGuestBookEntry(entryData);

    if (submitSuccess) {
      // Show success message
      success.value = true;

      // Reset form
      form.value = {
        name: "",
        address: "",
      };

      // Hide success message after delay
      setTimeout(() => {
        success.value = false;
      }, 5000);
    } else {
      error.value = "Gagal menyimpan data. Silakan coba lagi.";
    }
  } catch (err: any) {
    console.error("Error submitting guest book entry:", err);
    error.value = "Terjadi kesalahan saat menyimpan data Anda.";
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
    console.error("Error fetching guest book entries:", error);
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
