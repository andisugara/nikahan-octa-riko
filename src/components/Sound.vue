<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="text-center">
      <img
        :src="NikahFix"
        alt="NikahFix Logo"
        class="w-64 md:w-64 h-auto mb-8 mx-auto"
      />
      <h1 class="text-white text-3xl md:text-5xl font-light mb-12 mt-24">
        Mau dengerin lagu dari siapa?
      </h1>
      <div class="flex flex-wrap justify-center gap-8 max-w-4xl">
        <div
          key="xxx"
          class="text-center group cursor-pointer flex flex-col items-center"
          @click="() => setSoundActive('groom')"
        >
          <div
            class="w-32 h-32 mb-4 rounded-lg bg-gray-800 flex items-center justify-center text-6xl group-hover:ring-4 group-hover:ring-white"
          >
            <img
              :src="SoundGroom"
              alt="Sound Groom"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
          <p class="text-gray-400 text-lg group-hover:text-white">
            {{ weddingInfo?.groom }}
          </p>
          <small class="text-gray-500">
            {{ weddingInfo?.audioTitleGroom }}
          </small>
        </div>
        <div
          key="xxx"
          class="text-center group cursor-pointer flex flex-col items-center"
          @click="() => setSoundActive('bride')"
        >
          <div
            class="w-32 h-32 mb-4 rounded-lg bg-gray-800 flex items-center justify-center text-6xl group-hover:ring-4 group-hover:ring-red-600"
          >
            <img
              :src="SoundBride"
              alt="Sound Bride"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
          <p class="text-gray-400 text-lg group-hover:text-white">
            {{ weddingInfo?.bride }}
          </p>
          <small class="text-gray-500">
            {{ weddingInfo?.audioTitleBride }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import SoundGroom from "@images/sound-groom.png";
import SoundBride from "@images/sound-bride.png";
import NikahFix from "@/assets/images/nikahfix.png";
import { useWeddingStore } from "@/store/wedding";

const store = useWeddingStore();
const weddingInfo = store.weddingDetails;

const setSoundActive = (who: string) => {
  store.soundActive = who;
  store.layoutSection = "main";
};
</script>
