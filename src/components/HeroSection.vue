<template>
  <div class="relative h-screen">
    <template v-if="!isPlayVideo">
      <div class="absolute inset-0">
        <div
          class="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10"
        ></div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10"
        ></div>
        <div
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url(${weddingInfo?.background})` }"
        ></div>
      </div>

      <div class="relative z-20 flex items-center h-full px-4 md:px-8">
        <div class="max-w-2xl">
          <div class="mb-4">
            <span
              class="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-sm"
            >
              N
            </span>
            <span class="text-white/80 ml-3 text-sm font-light tracking-wider">
              WEDDING SERIES
            </span>
          </div>

          <h1
            class="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            {{ weddingInfo?.groomFull }} <br />
            <span class="text-red-600">&</span> {{ weddingInfo?.brideFull }}
          </h1>

          <div class="flex items-center space-x-4 mb-6 text-sm">
            <span class="text-green-400 font-bold">99% Match</span>
            <span class="text-white/80">2025</span>
            <span
              class="border border-white/50 text-white/80 px-2 py-1 text-xs rounded"
            >
              HD
            </span>
            <span class="text-white/80">Wedding Special</span>
          </div>

          <p
            class="text-white/90 text-lg mb-8 max-w-lg leading-relaxed font-light"
          >
            Dimulai dari sebuah pertemuan sederhana, cinta mereka tumbuh
            perlahan, melintasi musim dan waktu. Kini, mereka berdiri di ambang
            janji suci, siap melangkah ke panggung kehidupan bersama.
          </p>

          <div
            class="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <button
              @click="playVideo(true)"
              class="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded flex items-center space-x-2 transition-all duration-300 font-bold text-lg cursor-pointer"
            >
              <Play :size="20" />
              <span>Play</span>
            </button>
          </div>
        </div>

        <div class="absolute bottom-24 right-4 md:right-8">
          <button
            @click="isMuted = !isMuted"
            class="w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/20 cursor-pointer"
          >
            <VolumeX v-if="isMuted" :size="20" />
            <Volume2 v-else :size="20" />
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="absolute inset-0 bg-black flex items-center justify-center">
        <iframe
          :src="getYouTubeEmbedUrl()"
          class="w-full h-full"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <button
          @click="playVideo(false)"
          class="absolute bottom-12 right-4 w-12 h-12 bg-red-800 p-2 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/20 cursor-pointer z-30"
        >
          <X :size="24" />
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useWeddingStore } from "@/store/wedding";
import { Info, Play, Volume2, VolumeX, X } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";

const store = useWeddingStore();
const weddingInfo = store.weddingDetails;
const isMuted = ref(false);
const isPlayVideo = ref(false);

// Audio instance
let audio: HTMLAudioElement;

onMounted(() => {
  const audioActive = store.soundActive || "groom";
  audio = new Audio(
    audioActive === "groom"
      ? weddingInfo?.audioGroom || ""
      : weddingInfo?.audioBride || ""
  );
  audio.loop = true;
  audio.muted = isMuted.value;
  audio.play().catch((error) => {
    console.warn("Audio tidak dapat diputar secara otomatis:", error);
  });

  watch(isMuted, (newVal) => {
    if (audio) audio.muted = newVal;
  });
});

const playVideo = (play: boolean) => {
  if (play) {
    audio.pause();
  } else {
    audio.play().catch((error) => {
      console.warn("Audio tidak dapat diputar kembali:", error);
    });
  }
  isPlayVideo.value = play;
};

// Fungsi untuk memformat URL YouTube dengan benar
const getYouTubeEmbedUrl = () => {
  if (!weddingInfo?.youtubeLink) return "";

  // Cek apakah URL sudah dalam format embed
  if (weddingInfo.youtubeLink.includes("youtube.com/embed/")) {
    return `${weddingInfo.youtubeLink}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`;
  }

  // Jika URL adalah link normal YouTube, konversi ke format embed
  let videoId = "";

  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  if (weddingInfo.youtubeLink.includes("youtube.com/watch")) {
    const url = new URL(weddingInfo.youtubeLink);
    videoId = url.searchParams.get("v") || "";
  }
  // Format: https://youtu.be/VIDEO_ID
  else if (weddingInfo.youtubeLink.includes("youtu.be/")) {
    videoId = weddingInfo.youtubeLink.split("youtu.be/")[1];
    // Hapus parameter tambahan jika ada
    videoId = videoId.split("?")[0];
  }

  return videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`
    : "";
};
</script>
