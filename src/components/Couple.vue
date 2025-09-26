<template>
  <div class="relative py-16 px-4 md:px-8">
    <div class="absolute inset-0">
      <div class="absolute inset-0 z-10"></div>
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{
          backgroundImage: `url(${weddingInfo?.background})`,
          filter: 'brightness(0.3)',
        }"
      ></div>
    </div>
    <div class="max-w-6xl mx-auto relative z-20">
      <h2 class="text-white text-3xl md:text-4xl font-bold text-center mb-12">
        Profil Calon Pengantin
      </h2>
      <div class="grid md:grid-cols-2 gap-8 md:gap-12">

        <div class="text-center">
          <div
            class="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 border-red-600"
          >
            <img
              v-lazy="weddingInfo?.photoBride"
              alt="Bride"
              class="w-full h-full object-cover"
            />
          </div>
          <h3 class="text-white text-2xl md:text-3xl font-bold">
            {{ weddingInfo?.bride }}
          </h3>
          <p class="text-white/80 text-lg mb-4">
            Putri dari {{ weddingInfo?.brideParents }}
          </p>
          <div class="text-white/60 text-sm">
            {{ weddingInfo?.descriptionBride }}
          </div>
        </div>

         <div class="text-center">
          <div
            class="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 border-red-600"
          >
            <img
              v-lazy="weddingInfo?.photoGroom"
              alt="Groom"
              class="w-full h-full object-cover"
            />
          </div>
          <h3 class="text-white text-2xl md:text-3xl font-bold">
            {{ weddingInfo?.groom }}
          </h3>
          <p class="text-white/80 text-lg mb-4">
            Putra dari {{ weddingInfo?.groomParents }}
          </p>
          <div class="text-white/60 text-sm">
            {{ weddingInfo?.descriptionGroom }}
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWeddingStore } from "@/store/wedding";
const store = useWeddingStore();
const weddingInfo = store.weddingDetails;
</script>
