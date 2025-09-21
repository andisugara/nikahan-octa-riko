<template>
  <Transition name="modal-fade">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      @click="handleBackdropClick"
    >
      <!-- Modal Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm"></div>

      <!-- Modal Content -->
      <div
        class="relative z-10 max-w-lg w-full mx-4 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div
          class="border-b border-gray-800 px-6 py-4 flex justify-between items-center"
        >
          <h3 class="text-xl font-bold text-white">
            RSVP Konfirmasi Kehadiran
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-white transition-colors focus:outline-none"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">
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

            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-300 mb-1"
                >Email</label
              >
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="alamat@email.com"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Phone -->
            <div>
              <label
                for="phone"
                class="block text-sm font-medium text-gray-300 mb-1"
                >No. Telepon</label
              >
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="081234567890"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Attendance -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1"
                >Kehadiran</label
              >
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="form.attendance = 'hadir'"
                  :class="[
                    'py-3 rounded-lg border text-center font-semibold transition-all',
                    form.attendance === 'hadir'
                      ? 'border-red-600 bg-red-600 text-white'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-red-600',
                  ]"
                  :disabled="isSubmitting"
                >
                  Hadir
                </button>
                <button
                  type="button"
                  @click="form.attendance = 'tidak hadir'"
                  :class="[
                    'py-3 rounded-lg border text-center font-semibold transition-all',
                    form.attendance === 'tidak hadir'
                      ? 'border-red-600 bg-red-600 text-white'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-red-600',
                  ]"
                  :disabled="isSubmitting"
                >
                  Tidak Hadir
                </button>
              </div>
            </div>

            <!-- Number of Guests -->
            <div v-if="form.attendance === 'hadir'">
              <label
                for="guests"
                class="block text-sm font-medium text-gray-300 mb-1"
                >Jumlah Tamu</label
              >
              <select
                id="guests"
                v-model="form.guests"
                class="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                :disabled="isSubmitting"
              >
                <option value="1">1 orang</option>
                <option value="2">2 orang</option>
                <option value="3">3 orang</option>
                <option value="4">4 orang</option>
                <option value="5">5+ orang</option>
              </select>
            </div>

            <!-- Message -->
            <div>
              <label
                for="message"
                class="block text-sm font-medium text-gray-300 mb-1"
                >Pesan (opsional)</label
              >
              <textarea
                id="message"
                v-model="form.message"
                rows="3"
                class="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Tulis pesan atau catatan tambahan di sini"
                :disabled="isSubmitting"
              ></textarea>
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
              Terima kasih! RSVP Anda telah berhasil dikirim.
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
                <span v-else>Kirim RSVP</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineProps, defineEmits } from "vue";
import { useWeddingStore } from "@/store/wedding";
import type { RSVPData } from "@/store/wedding";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "submitted"): void;
}>();

const store = useWeddingStore();
const guest = computed(() => store.guest);

// Form state
const form = ref({
  name: guest.value?.name || "",
  email: "",
  phone: "",
  attendance: "",
  guests: "1",
  message: "",
  guest_uuid: guest.value?.code || "",
});

const isSubmitting = ref(false);
const success = ref(false);
const error = ref("");

// Reset form when opened
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      // Reset form
      form.value = {
        name: guest.value?.name || "",
        email: "",
        phone: "",
        attendance: "",
        guests: "1",
        message: "",
        guest_uuid: guest.value?.code || "",
      };
      success.value = false;
      error.value = "";
    }
  }
);

// Computed properties
const isSubmitDisabled = computed(() => {
  return (
    isSubmitting.value ||
    !form.value.name ||
    !form.value.email ||
    !form.value.phone ||
    !form.value.attendance
  );
});

// Methods
const closeModal = () => {
  emit("update:open", false);
};

const handleBackdropClick = (e: Event) => {
  // Only close if clicking on backdrop
  if (e.target === e.currentTarget) {
    closeModal();
  }
};

const handleSubmit = async () => {
  // Validate form
  if (
    !form.value.name ||
    !form.value.email ||
    !form.value.phone ||
    !form.value.attendance
  ) {
    error.value = "Mohon lengkapi semua field yang diperlukan.";
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    error.value = "Format email tidak valid.";
    return;
  }

  // Validate phone number
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(form.value.phone.replace(/\D/g, ""))) {
    error.value = "Format nomor telepon tidak valid.";
    return;
  }

  // Reset error
  error.value = "";
  isSubmitting.value = true;

  try {
    const rsvpData: Omit<RSVPData, "id" | "created_at"> = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      attendance: form.value.attendance,
      guests: form.value.guests,
      message: form.value.message,
      guest_uuid: form.value.guest_uuid,
    };

    const submitSuccess = await store.submitRSVP(rsvpData);
    if (form.value.message) {
      const messageData = {
        name: form.value.name,
        message: form.value.message,
        guest_uuid: form.value.guest_uuid || "",
      };
      await store.postMessage(messageData);
    }

    if (submitSuccess) {
      // Show success message
      success.value = true;

      // Close modal after delay
      setTimeout(() => {
        closeModal();
        emit("submitted");
      }, 3000);
    } else {
      error.value = "Gagal mengirim RSVP. Silakan coba lagi.";
    }
  } catch (err: any) {
    console.error("Error submitting RSVP:", err);
    error.value = "Terjadi kesalahan saat mengirim RSVP Anda.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

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
