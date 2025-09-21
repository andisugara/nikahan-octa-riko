<template>
  <Loading v-if="loading" :withSound="true" />
  <div v-else>
    <Header></Header>
    <HeroSection />
    <HolyVerse />
    <Countdown />
    <Couple />
    <LoveStory />
    <Event />
    <Gallery />
    <Message />
    <WeddingGift />
    <ClosingStatement />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Loading from "@/components/Loading.vue";
import Header from "./Header.vue";
import HeroSection from "./HeroSection.vue";
import HolyVerse from "./HolyVerse.vue";
import Countdown from "./Countdown.vue";
import Couple from "./Couple.vue";
import LoveStory from "./LoveStory.vue";
import Event from "./Event.vue";
import Gallery from "./Gallery.vue";
import Message from "./Message.vue";
import WeddingGift from "./WeddingGift.vue";
import ClosingStatement from "./ClosingStatement.vue";

const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 3000); // Simulate a 3-second loading time
});
</script>
