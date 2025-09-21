<template>
  <div className="bg-black py-16 px-4 md:px-8">
    <div className="max-w-6xl mx-auto">
      <h2
        className="text-white text-3xl md:text-4xl font-bold text-center mb-12"
      >
        Galeri
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <template v-for="(image, index) in images" :key="index">
          <div
            class="aspect-square overflow-hidden rounded-lg group cursor-pointer"
          >
            <img
              v-lazy="image.image"
              :alt="`Gallery ${index + 1}`"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWeddingStore } from "@/store/wedding";

const store = useWeddingStore();
const images = store.galleryItems;
</script>
