<template>
  <div class="bg-amber-800 min-h-screen">
    <div class="bg-amber-900 px-6 text-white font-display text-center py-8">
      <h1 class="text-xs font-bold"><a href="https://nationalcowboymuseum.org" target="_blank">National Cowboy & Western Heritage Museum</a></h1>
      <p class="mt-4 text-5xl text-base uppercase">Now that's a good lookin' saddle!</p>
    </div>
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto bg-amber-900 rounded-lg shadow-lg p-6">
        
        <!-- Image Container -->
        <div class="mb-6">
          <img v-if="!imageLoadFailed" :src="imageUrl" alt="A custom saddle design created at the National Cowboy & Western Heritage Museum" class="w-full rounded-lg shadow-md" @error="imageLoadFailed = true" />
          <div v-if="imageLoadFailed" class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            Something went wrong loading the image. Please try again later.
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="nativeShare"
            :disabled="!isShareSupported" 
            class="flex-1 bg-sky-900 text-white font-display shadow-lg px-4 rounded-full py-6 text-2xl transition-colors"
            :class="{
              'hover:bg-sky-800': isShareSupported,
              'opacity-50 cursor-not-allowed': !isShareSupported
            }"
          >
            Share
          </button>
          <button
            @click="downloadImage"
            class="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-display shadow-lg px-4 rounded-full py-6 text-2xl transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
    <div class="bg-amber-900 text-white text-center py-4">
      <p class="text-sm">Made at the <a class="underline" href="https://nationalcowboymuseum.org" target="_blank">National Cowboy & Western Heritage Museum</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useHead, useRuntimeConfig } from '#imports'
// import { ref, onMounted } from 'vue'

const route = useRoute()
const timestamp = route.params.timestamp as string
const imageUrl = `https://ncm-boot-images.s3.us-east-1.amazonaws.com/saddle-${timestamp}.jpeg`
const imageLoadFailed = ref(false)
const isShareSupported = ref(false)

onMounted(() => {
  if (typeof navigator.share !== 'undefined') {
    isShareSupported.value = true
  } else {
    console.log('Web Share API not supported in this browser.');
  }
})

async function nativeShare() {
  if (typeof navigator.share === 'undefined') {
    console.error('Web Share API not supported.');
    return;
  }

  try {
    await navigator.share({
      title: 'I built a saddle at The Cowboy!',
      text: 'Check out my custom saddle design!',
      url: window.location.href
    });
  } catch (err) {
    console.error('Error sharing:', err);
  }
}

async function downloadImage() {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `saddle-design-${timestamp}.jpeg`; 
    link.setAttribute('type', 'image/jpeg');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const runtimeConfig = useRuntimeConfig()
const siteUrl = (runtimeConfig.public?.siteUrl as string) ?? ''

const canonicalUrl = siteUrl.endsWith('/')
  ? `${siteUrl}${route.fullPath.slice(1)}`
  : `${siteUrl}${route.fullPath}`

useHead(() => {
  const title = "I built a saddle at The Cowboy!"
  const description = 'Check out my custom saddle design.'

  return {
    title,
    link: [{ rel: 'canonical', href: canonicalUrl }],
    meta: [
      { hid: 'description', name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
    ],
  }
})
</script>
