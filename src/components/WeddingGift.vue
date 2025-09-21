<template>
  <div class="bg-black py-16 px-4 md:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-white text-3xl md:text-4xl font-bold mb-8">
        Wedding Gift
      </h2>
      <div class="bg-gray-900 rounded-lg p-8 border border-gray-700">
        <div class="flex justify-center mb-6">
          <Gift class="text-red-600" :size="48" />
        </div>
        <p class="text-white/90 text-lg mb-6">
          Kehadiran dan doa Anda adalah hadiah terbaik untuk kami. Namun jika
          Anda ingin memberikan sesuatu, kami akan sangat berterima kasih untuk
          kontribusi melalui:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-gray-800 p-6 rounded-lg">
            <h3 class="text-white text-xl font-bold mb-4">
              {{ weddingInfo?.groom }}
            </h3>
            <div class="text-left space-y-3">
              <div v-for="(bank, index) in bankAccounts" :key="index">
                <template v-if="bank.isGroom">
                  <p class="text-white/70 text-sm">{{ bank.name }}</p>
                  <div class="flex justify-between items-center">
                    <p class="text-white font-medium">{{ bank.value }}</p>
                    <button
                      @click="
                        copyToClipboard(bank.value, bank.name.toLowerCase())
                      "
                      class="text-red-600 hover:text-red-400"
                    >
                      <component
                        :is="copied === bank.name.toLowerCase() ? Check : Copy"
                        :size="16"
                      />
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="bg-gray-800 p-6 rounded-lg">
            <h3 class="text-white text-xl font-bold mb-4">
              {{ weddingInfo?.bride }}
            </h3>
            <div class="text-left space-y-3">
              <div v-for="(bank, index) in bankAccounts" :key="index">
                <template v-if="!bank.isGroom">
                  <p class="text-white/70 text-sm">{{ bank.name }}</p>
                  <div class="flex justify-between items-center">
                    <p class="text-white font-medium">{{ bank.value }}</p>
                    <button
                      @click="
                        copyToClipboard(bank.value, bank.name.toLowerCase())
                      "
                      class="text-red-600 hover:text-red-400"
                    >
                      <component
                        :is="copied === bank.name.toLowerCase() ? Check : Copy"
                        :size="16"
                      />
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useWeddingStore } from "@/store/wedding";
import { Check, Copy } from "lucide-vue-next";
import { ref } from "vue";
const store = useWeddingStore();
const weddingInfo = store.weddingDetails;
const bankAccounts = store.bankAccounts;

const copied = ref<string | null>(null);
const copyToClipboard = (text: string, type: string) => {
  navigator.clipboard.writeText(text).then(
    () => {
      copied.value = type;
      setTimeout(() => {
        copied.value = null;
      }, 2000);
    },
    () => {
      alert("Gagal menyalin ke clipboard");
    }
  );
};
</script>
