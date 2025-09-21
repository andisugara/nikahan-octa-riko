<template>
  <div
    className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-4"
  >
    <img
      :src="NikahFix"
      alt="NikahFix Logo"
      className="w-64 md:w-64 h-auto mb-8"
    />
    <h1 className="text-3xl md:text-4xl font-bold mb-6 mt-12">
      Undangan Tidak Ditemukan
    </h1>
    <p className="text-lg mb-8">
      Maaf, undangan dengan kode tersebut tidak ditemukan.
    </p>
  </div>
</template>
<script lang="ts" setup>
import NikahFix from "@/assets/images/nikahfix.png";
</script>
