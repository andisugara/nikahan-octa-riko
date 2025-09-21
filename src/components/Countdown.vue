<template>
  <div class="bg-black py-16 px-4 md:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-white text-3xl md:text-4xl font-bold mb-12">
        Countdown to Our Big Day
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-white">
        <div
          v-for="(value, unit) in timeLeft"
          :key="unit"
          class="bg-red-600 rounded-lg p-6 md:p-8"
        >
          <div class="text-white text-3xl md:text-4xl font-bold">
            {{ value || 0 }}
          </div>
          <div class="text-white/80 text-sm md:text-base font-light capitalize">
            {{ unit }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useWeddingStore } from "@/store/wedding";
import { ref, onMounted, onUnmounted } from "vue";

const store = useWeddingStore();
const weddingInfo = store.weddingDetails;

// Reactive state untuk countdown
const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

// Menghitung waktu yang tersisa
const calculateTimeLeft = () => {
  if (!weddingInfo?.weddingDate) return;

  const difference = +new Date(weddingInfo?.weddingDate) - +new Date();

  if (difference > 0) {
    timeLeft.value = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  } else {
    // Jika tanggal sudah lewat, tampilkan 0
    timeLeft.value = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }
};

// Variabel untuk menyimpan interval timer
let timer: number | undefined;

// Setup timer saat komponen dimount
onMounted(() => {
  // Hitung pertama kali
  calculateTimeLeft();

  // Set interval untuk update setiap detik
  timer = window.setInterval(calculateTimeLeft, 1000);
});

// Bersihkan timer saat komponen dihancurkan
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.bg-red-600 {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.bg-red-600:hover {
  transform: translateY(-5px);
}

.bg-red-600::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bg-red-600:hover::after {
  opacity: 1;
}

/* Animation for seconds changing */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.text-3xl {
  transition: color 0.3s ease;
}

.bg-red-600:hover .text-3xl {
  color: #ffffff;
}
</style>
