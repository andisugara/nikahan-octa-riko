<template>
  <div
    class="py-16 px-4 md:px-8"
    :style="{
      backgroundImage: `url(${weddingInfo?.background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <div class="max-w-6xl mx-auto">
      <h2 class="text-white text-3xl md:text-4xl font-bold text-center mb-12">
        Akad & Resepsi
      </h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-black/90 rounded-lg p-8 border border-gray-700">
          <div class="flex items-center mb-6">
            <Calendar class="text-red-600 mr-4" :size="32" />
            <h3 class="text-white text-2xl font-bold">Akad Nikah</h3>
          </div>
          <div class="space-y-4 text-white/90">
            <div>
              <p class="font-bold text-lg">{{ weddingInfo?.akadDate }}</p>
              <p class="text-red-600 font-semibold">
                {{ weddingInfo?.akadTime }}
              </p>
            </div>
            <div class="flex items-start">
              <MapPin class="text-red-600 mr-3 mt-1 flex-shrink-0" :size="20" />
              <div>
                <p class="font-bold">{{ weddingInfo?.venue }}</p>
                <p class="text-white/70">{{ weddingInfo?.address }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-black/90 rounded-lg p-8 border border-gray-700">
          <div class="flex items-center mb-6">
            <Heart class="text-red-600 mr-4" :size="32" />
            <h3 class="text-white text-2xl font-bold">Resepsi</h3>
          </div>
          <div class="space-y-4 text-white/90">
            <div>
              <p class="font-bold text-lg">{{ weddingInfo?.receptionDate }}</p>
              <p class="text-red-600 font-semibold">
                {{ weddingInfo?.receptionTime }}
              </p>
            </div>
            <div class="flex items-start">
              <MapPin class="text-red-600 mr-3 mt-1 flex-shrink-0" :size="20" />
              <div>
                <p class="font-bold">{{ weddingInfo?.venue }}</p>
                <p class="text-white/70">{{ weddingInfo?.address }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RSVP Button -->
      <div class="mt-12 text-center">
        <button
          @click="openRsvpModal"
          class="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center"
        >
          <CalendarPlus class="mr-2" :size="20" />
          Konfirmasi Kehadiran
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useWeddingStore } from "@/store/wedding";
import { Calendar, Heart, MapPin, CalendarPlus } from "lucide-vue-next";

const store = useWeddingStore();
const weddingInfo = store.weddingDetails;

// Function to open RSVP modal
const openRsvpModal = () => {
  store.openModalRSVP = true;
};
</script>
