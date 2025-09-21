<template>
  <div class="bg-black py-16 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-white text-3xl md:text-4xl font-bold text-center mb-12">
        Our Love Story
      </h2>
      <div class="space-y-8">
        <template v-for="(story, index) in loveStory" :key="index">
          <div
            :class="[
              'flex flex-col md:flex-row items-center gap-8',
              index % 2 === 1 ? 'md:flex-row-reverse' : '',
            ]"
          >
            <div class="w-full md:w-1/2">
              <img
                v-lazy="story.image"
                :alt="story.title"
                class="w-full h-64 md:h-80 object-cover rounded-lg"
              />
            </div>
            <div class="w-full md:w-1/2 text-left md:text-left">
              <h3 class="text-white text-2xl md:text-3xl font-bold">
                {{ story.title }}
              </h3>
              <p class="text-red-600 text-lg font-semibold mb-4">
                {{ story.date }}
              </p>
              <p class="text-white/80 text-lg leading-relaxed">
                {{ story.story }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useWeddingStore } from "@/store/wedding";

const store = useWeddingStore();
const loveStory = store.loveStoryItems;
</script>
