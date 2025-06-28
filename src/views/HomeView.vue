<template>
  <div class="min-h-screen bg-gradient-to-br from-comic-light via-white to-comic-accent/20">
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <!-- Main Title -->
        <h1 class="font-heading text-6xl md:text-8xl text-comic-dark mb-6 transform -rotate-1">
          Live Comicverse
        </h1>
        
        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-comic">
          Create amazing comic strips with AI, collaborate in real-time, and share your stories with the world!
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <router-link
            to="/create"
            v-if="authStore.isAuthenticated"
            class="bg-comic-primary text-white px-8 py-4 rounded-full font-comic font-bold text-lg hover:bg-comic-primary/90 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Start Creating
          </router-link>
          <router-link
            to="/login"
            v-else
            class="bg-comic-primary text-white px-8 py-4 rounded-full font-comic font-bold text-lg hover:bg-comic-primary/90 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Get Started
          </router-link>
          <router-link
            to="/gallery"
            class="border-2 border-comic-primary text-comic-primary px-8 py-4 rounded-full font-comic font-bold text-lg hover:bg-comic-primary hover:text-white transition-all duration-200"
          >
            Explore Gallery
          </router-link>
        </div>

        <!-- Feature Preview -->
        <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="bg-white p-6 rounded-lg shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div class="text-4xl mb-4">🤖</div>
            <h3 class="font-comic font-bold text-xl mb-2 text-comic-dark">AI-Powered</h3>
            <p class="text-gray-600">Claude AI generates engaging comic scripts and DALL-E creates stunning artwork</p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div class="text-4xl mb-4">👥</div>
            <h3 class="font-comic font-bold text-xl mb-2 text-comic-dark">Collaborate</h3>
            <p class="text-gray-600">Edit comics together in real-time with friends and fellow creators</p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div class="text-4xl mb-4">✨</div>
            <h3 class="font-comic font-bold text-xl mb-2 text-comic-dark">Interactive</h3>
            <p class="text-gray-600">Create branching stories with choices and smooth animations</p>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">💥</div>
      <div class="absolute top-20 right-20 text-4xl opacity-20 animate-pulse">⭐</div>
      <div class="absolute bottom-10 left-20 text-5xl opacity-20 animate-bounce" style="animation-delay: 1s;">💫</div>
      <div class="absolute bottom-20 right-10 text-3xl opacity-20 animate-pulse" style="animation-delay: 2s;">💨</div>
    </section>

    <!-- Featured Comics Section -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <h2 class="font-heading text-4xl text-center mb-12 text-comic-dark transform -rotate-1">
          Featured Comics
        </h2>
        
        <div v-if="featuredComics.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="comic in featuredComics"
            :key="comic.id"
            class="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
          >
            <div class="h-48 bg-gradient-to-r from-comic-primary to-comic-secondary"></div>
            <div class="p-6">
              <h3 class="font-comic font-bold text-xl mb-2 text-comic-dark">{{ comic.title }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">{{ comic.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">by {{ comic.authorName }}</span>
                <router-link
                  :to="`/comic/${comic.id}`"
                  class="bg-comic-primary text-white px-4 py-2 rounded-full text-sm font-comic font-bold hover:bg-comic-primary/90 transition-colors"
                >
                  Read
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500 font-comic text-lg">No comics available yet. Be the first to create one!</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 px-4 bg-gradient-to-r from-comic-secondary/10 to-comic-accent/10">
      <div class="max-w-6xl mx-auto">
        <h2 class="font-heading text-4xl text-center mb-12 text-comic-dark transform rotate-1">
          How It Works
        </h2>
        
        <div class="grid md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-comic-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">1</div>
            <h3 class="font-comic font-bold text-lg mb-2">Write Your Prompt</h3>
            <p class="text-gray-600">Describe your comic idea and let AI create the script</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-comic-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">2</div>
            <h3 class="font-comic font-bold text-lg mb-2">AI Generates Art</h3>
            <p class="text-gray-600">Watch as beautiful comic panels are created automatically</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-comic-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">3</div>
            <h3 class="font-comic font-bold text-lg mb-2">Edit & Collaborate</h3>
            <p class="text-gray-600">Fine-tune your comic with friends in real-time</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">4</div>
            <h3 class="font-comic font-bold text-lg mb-2">Share Your Story</h3>
            <p class="text-gray-600">Publish and share your comic with the world</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useComicStore } from '@/stores/comic'

const authStore = useAuthStore()
const comicStore = useComicStore()

const featuredComics = ref<any[]>([])

onMounted(async () => {
  try {
    await comicStore.loadPublicComics()
    featuredComics.value = comicStore.comics.slice(0, 6)
  } catch (error) {
    console.error('Failed to load featured comics:', error)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>