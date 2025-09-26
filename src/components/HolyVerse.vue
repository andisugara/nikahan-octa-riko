<template>
  <div class="py-16 px-4 md:px-8 bg-linear-to-br from-black to-red-900">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-white text-3xl md:text-4xl font-bold mb-12">Ayat Suci</h2>
      <div class="bg-black/50 rounded-lg p-8 md:p-12 border border-gray-700">
        <p
          class="text-white/90 text-lg md:text-xl leading-relaxed mb-6 font-light italic"
        >
          {{ weddingInfo?.holyVerse }}
        </p>
        <p class="text-red-600 font-bold text-lg">
          {{ weddingInfo?.holyVerseRef }}
        </p>
        <p
          class="text-white/90 text-lg md:text-xl leading-relaxed mb-6 font-light italic"
        >
          QS. Ar-Rum: 21
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useWeddingStore } from "@/store/wedding";

const store = useWeddingStore();
const weddingInfo = store.weddingDetails;
</script>
