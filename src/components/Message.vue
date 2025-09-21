<template>
  <div class="bg-gray-900 py-16 px-4 md:px-8">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-white text-3xl md:text-4xl font-bold text-center mb-12">
        Ucapan & Doa
      </h2>

      <div class="bg-black/50 rounded-lg p-8 border border-gray-700 mb-8">
        <h3 class="text-white text-xl font-bold mb-6">Kirim Ucapan</h3>
        <div class="space-y-4">
          <input
            type="text"
            placeholder="Nama Anda"
            v-model="newMessage.name"
            class="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <textarea
            placeholder="Tulis ucapan dan doa untuk kami..."
            v-model="newMessage.message"
            rows="4"
            class="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
          ></textarea>
          <div class="flex justify-end">
            <button
              @click="handleAddMessage"
              :disabled="isSubmitDisabled"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitButtonText }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="messageError" class="text-red-500 mb-4 text-center">
        {{ messageError }}
      </div>

      <div
        ref="messageListRef"
        class="space-y-2 max-h-[540px] overflow-y-auto"
        id="message-list"
      >
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="bg-black/50 rounded-lg p-6 border border-gray-700 flex items-start"
        >
          <div class="w-12 h-12 rounded overflow-hidden mr-4">
            <img
              v-lazy="profileImage"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-start mb-1">
              <h4 class="text-white font-bold">{{ msg.name }}</h4>
              <span class="text-white/60 text-sm">{{ msg.time }}</span>
            </div>
            <p class="text-white/90 line-clamp-2">{{ msg.message }}</p>
          </div>
        </div>

        <div v-if="isLoading" class="text-center py-8">
          <div
            class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"
          ></div>
          <p class="text-white/60">Memuat pesan...</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useWeddingStore } from "@/store/wedding";
import type { Message as MessageType } from "@/store/wedding";
import ProfileImg from "@/assets/images/profile.jpg";

const messageListRef = ref<HTMLElement | null>(null);

// Store dan route
const store = useWeddingStore();
const guest = store.guest;

// Data dari store
const messages = computed(() => store.messages);

// Lazy-loaded profile image
const profileImage = ProfileImg;

// State untuk form dan loading
const isLoading = ref(false);
const isSubmitting = ref(false);
const hasSubmitted = ref(false);
const messageError = ref("");
const newMessage = ref({
  name: guest?.name || "",
  message: "",
  guest_uuid: guest?.code || "",
});

// Computed property untuk disable button
const isSubmitDisabled = computed(() => {
  return (
    isSubmitting.value ||
    hasSubmitted.value ||
    !newMessage.value.name ||
    !newMessage.value.message
  );
});

// Computed property untuk text tombol
const submitButtonText = computed(() => {
  if (isSubmitting.value) return "Mengirim...";
  if (hasSubmitted.value) return "Terima Kasih";
  return "Kirim Ucapan";
});

// Fungsi untuk mengirim pesan
async function handleAddMessage() {
  if (!newMessage.value.name || !newMessage.value.message) {
    messageError.value = "Silakan isi nama dan pesan Anda";
    return;
  }

  isSubmitting.value = true;
  messageError.value = "";

  try {
    const success = await store.postMessage({
      name: newMessage.value.name,
      message: newMessage.value.message,
      guest_uuid: newMessage.value.guest_uuid,
    } as Omit<MessageType, "id" | "created_at" | "time">);

    if (success) {
      // Reset form
      newMessage.value = {
        name: guest?.name || "",
        message: "",
        guest_uuid: guest?.code || "",
      };

      // Show success state
      hasSubmitted.value = true;

      // Reset hasSubmitted after 3 seconds
      setTimeout(() => {
        hasSubmitted.value = false;
      }, 3000);

      // Reload messages (optional since store.postMessage already updates the messages array)
      //   await store.fetchMessages();
    } else {
      messageError.value = "Gagal mengirim ucapan. Silakan coba lagi.";
    }
  } catch (error: any) {
    console.error("Error submitting message:", error);
    messageError.value = "Terjadi kesalahan saat mengirim ucapan Anda.";
  } finally {
    isSubmitting.value = false;
    scrollToBottom();
  }
}

const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTo({
      top: messageListRef.value.scrollHeight,
      behavior: "smooth",
    });
  }
};

onMounted(() => {
  scrollToBottom();
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
