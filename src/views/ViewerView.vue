<template>
  <div class="min-h-screen bg-gradient-to-br from-comic-light via-white to-comic-accent/20">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-comic-primary mx-auto mb-4"></div>
        <p class="text-gray-600 font-comic">Loading comic...</p>
      </div>
    </div>

    <div v-else-if="!comic" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="text-6xl mb-4">😕</div>
        <h3 class="text-xl font-comic font-bold text-gray-900 mb-2">Comic not found</h3>
        <p class="text-gray-600 font-comic mb-6">The comic you're looking for doesn't exist.</p>
        <router-link
          to="/gallery"
          class="bg-comic-primary text-white px-6 py-3 rounded-full font-comic font-bold hover:bg-comic-primary/90 transition-colors"
        >
          Browse Gallery
        </router-link>
      </div>
    </div>

    <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="font-heading text-4xl md:text-6xl text-comic-dark mb-4 transform -rotate-1">
          {{ comic.title }}
        </h1>
        <p class="text-xl text-gray-600 font-comic mb-6">{{ comic.description }}</p>
        
        <div class="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500 font-comic">
          <span>by {{ comic.authorName }}</span>
          <span>•</span>
          <span>{{ comic.panels.length }} panel{{ comic.panels.length !== 1 ? 's' : '' }}</span>
          <span>•</span>
          <span>{{ formatDate(comic.createdAt) }}</span>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap justify-center gap-4 mt-6">
          <button
            @click="shareComic"
            class="bg-comic-secondary text-white px-6 py-3 rounded-full font-comic font-bold hover:bg-comic-secondary/90 transition-colors flex items-center"
          >
            <ShareIcon class="w-5 h-5 mr-2" />
            Share
          </button>
          <button
            @click="exportAsGIF"
            class="bg-comic-accent text-white px-6 py-3 rounded-full font-comic font-bold hover:bg-comic-accent/90 transition-colors flex items-center"
          >
            <ArrowDownTrayIcon class="w-5 h-5 mr-2" />
            Save as GIF
          </button>
          <router-link
            v-if="canEdit"
            :to="`/editor/${comic.id}`"
            class="border border-comic-primary text-comic-primary px-6 py-3 rounded-full font-comic font-bold hover:bg-comic-primary hover:text-white transition-colors"
          >
            Edit Comic
          </router-link>
        </div>
      </div>

      <!-- Comic Panels -->
      <div v-if="sortedPanels.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-xl font-comic font-bold text-gray-900 mb-2">No panels yet</h3>
        <p class="text-gray-600 font-comic">This comic is still being created.</p>
      </div>

      <div v-else ref="comicContainer" class="space-y-8">
        <!-- Reading Mode Toggle -->
        <div class="text-center mb-8">
          <div class="inline-flex bg-white rounded-lg p-1 shadow-md border-2 border-comic-outline">
            <button
              :class="[
                'px-4 py-2 rounded-md font-comic font-bold transition-colors',
                readingMode === 'grid' ? 'bg-comic-primary text-white' : 'text-gray-600 hover:text-gray-800'
              ]"
              @click="setReadingMode('grid')"
            >
              Grid View
            </button>
            <button
              :class="[
                'px-4 py-2 rounded-md font-comic font-bold transition-colors',
                readingMode === 'scroll' ? 'bg-comic-primary text-white' : 'text-gray-600 hover:text-gray-800'
              ]"
              @click="setReadingMode('scroll')"
            >
              Scroll View
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div v-if="readingMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComicPanel
            v-for="(panel, index) in sortedPanels"
            :key="panel.id"
            :panel="panel"
            :editable="false"
            :animation-delay="index * 0.1"
            @choice-selected="handleChoiceSelected"
          />
        </div>

        <!-- Scroll View -->
        <div v-else class="max-w-2xl mx-auto space-y-8">
          <div
            v-for="(panel, index) in sortedPanels"
            :key="panel.id"
            class="scroll-panel"
          >
            <ComicPanel
              :panel="panel"
              :editable="false"
              :animation-delay="0"
              @choice-selected="handleChoiceSelected"
            />
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div v-if="sortedPanels.length > 0" class="text-center mt-12">
        <div class="flex justify-center space-x-4">
          <router-link
            to="/gallery"
            class="bg-white text-comic-primary border-2 border-comic-primary px-6 py-3 rounded-full font-comic font-bold hover:bg-comic-primary hover:text-white transition-colors"
          >
            ← More Comics
          </router-link>
          <button
            @click="scrollToTop"
            class="bg-comic-primary text-white px-6 py-3 rounded-full font-comic font-bold hover:bg-comic-primary/90 transition-colors"
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="shareModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="font-comic font-bold text-xl mb-4">Share Comic</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Share URL</label>
            <div class="flex">
              <input
                ref="shareUrlInput"
                :value="shareUrl"
                readonly
                class="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 font-mono text-sm"
              />
              <button
                @click="copyShareUrl"
                class="bg-comic-primary text-white px-4 py-2 rounded-r-lg hover:bg-comic-primary/90 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          
          <!-- Social Share Buttons -->
          <div class="space-y-2">
            <p class="text-sm font-medium text-gray-700">Share on social media:</p>
            <div class="flex space-x-2">
              <button
                @click="shareOnTwitter"
                class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-comic text-sm"
              >
                Twitter
              </button>
              <button
                @click="shareOnFacebook"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-comic text-sm"
              >
                Facebook
              </button>
              <button
                @click="shareOnReddit"
                class="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-comic text-sm"
              >
                Reddit
              </button>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="shareModalOpen = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 font-comic"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { ShareIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useComicStore } from '@/stores/comic'
import { comicService } from '@/services/comic'
import { animationService } from '@/services/animation'
import ComicPanel from '@/components/ComicPanel.vue'
import { format } from 'date-fns'
import type { Choice } from '@/types'

const route = useRoute()
const authStore = useAuthStore()
const comicStore = useComicStore()

const comicContainer = ref<HTMLElement>()
const readingMode = ref<'grid' | 'scroll'>('grid')
const shareModalOpen = ref(false)
const shareUrl = ref('')
const shareUrlInput = ref<HTMLInputElement>()

const comic = computed(() => comicStore.currentComic)
const loading = computed(() => comicStore.loading)
const sortedPanels = computed(() => comicStore.sortedPanels)

const canEdit = computed(() => {
  if (!comic.value || !authStore.user) return false
  return comic.value.authorId === authStore.user.uid || 
         comic.value.collaborators.includes(authStore.user.uid)
})

onMounted(async () => {
  const comicId = route.params.id as string
  await comicStore.loadComic(comicId)
  
  // Set up animations after panels load
  if (comicContainer.value) {
    setTimeout(() => {
      if (readingMode.value === 'scroll') {
        animationService.setupParallaxScroll(comicContainer.value!)
      }
    }, 1000)
  }
})

onUnmounted(() => {
  animationService.cleanup()
})

const setReadingMode = (mode: 'grid' | 'scroll') => {
  readingMode.value = mode
  
  // Re-setup animations for scroll mode
  if (mode === 'scroll' && comicContainer.value) {
    setTimeout(() => {
      animationService.setupParallaxScroll(comicContainer.value!)
    }, 100)
  } else {
    animationService.cleanup()
  }
}

const handleChoiceSelected = async (choice: Choice) => {
  if (!comic.value) return
  
  try {
    const context = `Current comic: ${comic.value.title}. ${comic.value.description}`
    await comicStore.generateChoicePanels(comic.value.id, choice.text, context)
  } catch (error) {
    console.error('Failed to generate choice panels:', error)
  }
}

const formatDate = (date: Date) => {
  return format(new Date(date), 'MMMM d, yyyy')
}

const shareComic = () => {
  if (!comic.value) return
  
  shareUrl.value = comicService.generateShareUrl(comic.value.id)
  shareModalOpen.value = true
}

const copyShareUrl = async () => {
  if (shareUrlInput.value) {
    shareUrlInput.value.select()
    await navigator.clipboard.writeText(shareUrl.value)
    // Could add a toast notification here
  }
}

const shareOnTwitter = () => {
  const text = `Check out this amazing comic: "${comic.value?.title}" on Live Comicverse!`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank')
}

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank')
}

const shareOnReddit = () => {
  const title = `Check out this comic: "${comic.value?.title}"`
  const url = `https://reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank')
}

const exportAsGIF = async () => {
  // This would be implemented with libraries like gif.js and html2canvas
  alert('GIF export functionality would be implemented here')
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.scroll-panel {
  scroll-margin-top: 2rem;
}
</style>