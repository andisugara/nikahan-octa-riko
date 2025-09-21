<template>
  <div>
    <div v-if="isLoading">
      <Loading />
    </div>
    <router-view v-else />

    <!-- Global RSVP Modal -->
    <ModalRsvp v-model:open="modalRsvpOpen" @submitted="handleRsvpSubmitted" />
  </div>
</template>

<script lang="ts" setup>
import Loading from "./components/Loading.vue";
import ModalRsvp from "./components/ModalRsvp.vue";
import { useWeddingStore } from "./store/wedding";
import { onMounted, computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

// Initialize store and route
const weddingStore = useWeddingStore();
const route = useRoute();

// Track loading state at app level
const isInitialized = ref(false);

// Get guest code from route params
const guestCode = computed(() => route.params.guestCode as string);

const isLoading = computed(() => {
  return (
    !isInitialized.value ||
    weddingStore.loading.weddingDetails ||
    weddingStore.loading.loveStoryItems ||
    weddingStore.loading.messages ||
    weddingStore.loading.galleryItems ||
    weddingStore.loading.bankAccounts ||
    (guestCode.value && weddingStore.loading.guest)
  );
});

// Modal RSVP
const modalRsvpOpen = computed({
  get: () => weddingStore.openModalRSVP,
  set: (value) => (weddingStore.openModalRSVP = value),
});

// Handle RSVP submission
const handleRsvpSubmitted = () => {
  console.log("RSVP submitted successfully");
};

// Initialize all data once at app start
onMounted(async () => {
  try {
    // Fetch core data
    await Promise.all([
      weddingStore.fetchWeddingDetails(),
      weddingStore.fetchLoveStoryItems(),
      weddingStore.fetchMessages(),
      weddingStore.fetchGalleryItems(),
      weddingStore.fetchBankAccounts(),
    ]);

    // Fetch guest data if guest code is available in URL
    if (guestCode.value) {
      await weddingStore.fetchGuest(guestCode.value);
    }

    // Set initialized flag
    isInitialized.value = true;
  } catch (error) {
    console.error("Error initializing app data:", error);
  }
});

// Watch for changes in route params to load guest data when navigating
watch(guestCode, async (newGuestCode) => {
  if (newGuestCode && isInitialized.value) {
    await weddingStore.fetchGuest(newGuestCode);
  }
});
</script>
