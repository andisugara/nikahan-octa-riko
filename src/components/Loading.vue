<template>
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex flex-col items-center justify-center px-4">
      <img
        :src="NikahFix"
        alt="NikahFix Logo"
        className="w-32 md:w-64 h-auto mb-8"
      />
      <div
        className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"
      ></div>
      <p className="text-white text-xl mt-8 text-center">
        Menyiapkan undangan spesial untuk Anda...
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import NikahFix from "@/assets/images/nikahfix.png";
import SoundLoading from "@/assets/sounds/loading.mp3";
import { onMounted } from "vue";

const props = defineProps({
  // Define any props if needed in the future
  withSound: {
    type: Boolean,
    default: false,
  },
});

// Play loading sound on component mount only if withSound is true
onMounted(() => {
  if (props.withSound) {
    const audio = new Audio(SoundLoading);
    audio.volume = 0.5;
    audio.preload = "auto";

    audio
      .play()
      .then(() => {
        console.log("Loading sound berhasil diputar");
      })
      .catch((error) => {
        console.error(
          "Error playing loading sound:",
          error.name,
          error.message
        );

        // Fallback: jika masih gagal karena browser policy
        // Audio akan diputar setelah ada user interaction berikutnya
        if (error.name === "NotAllowedError") {
          console.log(
            "Audio diblokir browser policy, akan diputar setelah user interaction"
          );
        }
      });
  }
});
</script>
