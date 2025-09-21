<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-white text-3xl md:text-5xl font-light mb-12">
        Who's watching?
      </h1>
      <div class="flex flex-wrap justify-center gap-8 max-w-4xl">
        <div
          key="xxx"
          class="text-center group cursor-pointer flex flex-col items-center"
          @click="() => changeLayoutSection('sound')"
        >
          <div
            class="w-32 h-32 mb-4 rounded-lg bg-gray-800 flex items-center justify-center text-6xl group-hover:ring-4 group-hover:ring-white"
          >
            <img
              :src="Profile"
              alt="Profile"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
          <p class="text-gray-400 text-lg group-hover:text-white">
            {{ guest?.name || "Guest" }}
          </p>
          <small class="text-gray-500">
            Wedding of {{ weddingInfo?.bride || "Octa" }} &amp;
            {{ weddingInfo?.groom || "Riko" }}
          </small>
        </div>
      </div>
      <div class="flex flex-col md:flex-row justify-center gap-4">
        <button
          class="mt-16 text-gray-400 hover:text-white border border-gray-400 hover:border-white px-6 py-3 text-sm md:text-lg"
        >
          Undangan dari {{ guest?.from || "Riko Nusa" }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useWeddingStore } from "@/store/wedding";
import Profile from "@images/profile.jpg";

const store = useWeddingStore();
const guest = store.guest;
const weddingInfo = store.weddingDetails;

const changeLayoutSection = (section: string) => {
  store.layoutSection = section;
  console.log("Layout section changed to:", section);
};
</script>
