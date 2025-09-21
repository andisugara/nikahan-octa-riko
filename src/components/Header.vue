<template>
  <header
    class="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800"
  >
    <div class="flex items-center justify-between px-4 md:px-8 py-4">
      <div class="flex items-center space-x-8">
        <div class="text-red-600 text-2xl md:text-3xl font-bold tracking-wide">
          <img
            :src="NikahFix"
            alt="NikahFix Logo"
            class="w-32 md:w-32 h-auto"
          />
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <button
          @click="openRsvpModal"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium rounded transition-colors cursor-pointer"
        >
          RSVP
        </button>
        <div
          @click="backToGuest"
          class="w-8 h-8 bg-red-600 rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-white transition-all"
        >
          <img :src="Profile" alt="Guest" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    <!-- Modal RSVP -->
    <ModalRsvp v-model:open="modalOpen" @submitted="handleRsvpSubmitted" />
  </header>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import NikahFix from "@/assets/images/nikahfix.png";
import Profile from "@/assets/images/profile.jpg";
import ModalRsvp from "@/components/ModalRsvp.vue";
import { useWeddingStore } from "@/store/wedding";

const store = useWeddingStore();

// Modal open state from store
const modalOpen = computed({
  get: () => store.openModalRSVP,
  set: (value) => (store.openModalRSVP = value),
});

// Function to open modal
const openRsvpModal = () => {
  store.openModalRSVP = true;
};

// Handle submission
const handleRsvpSubmitted = () => {
  console.log("RSVP submitted successfully");
  // Additional actions after submission if needed
};
const backToGuest = () => {
  store.layoutSection = "guest";
  //   remove audio if any
  window.location.reload();
};
</script>
