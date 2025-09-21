<template>
  <div>
    <ProfileSection v-if="layoutSection === 'guest'" />
    <Sound v-else-if="layoutSection === 'sound'" />
    <Home v-else-if="layoutSection === 'main'" />
    <NotFound v-else />
  </div>
</template>
<script lang="ts" setup>
import ProfileSection from "@/components/ProfileSection.vue";
import Sound from "@/components/Sound.vue";
import Home from "@/components/Home.vue";
import { useWeddingStore } from "@/store/wedding";
import NotFound from "./NotFound.vue";
import { computed } from "vue";

const store = useWeddingStore();
const layoutSection = computed(() => store.layoutSection);
</script>
