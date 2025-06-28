<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 class="font-heading text-4xl text-comic-dark mb-2">My Comics</h1>
          <p class="text-gray-600 font-comic">Create, edit, and manage your comic collection</p>
        </div>
        <router-link
          to="/create"
          class="bg-comic-primary text-white px-6 py-3 rounded-full font-comic font-bold hover:bg-comic-primary/90 transition-colors shadow-lg mt-4 sm:mt-0"
        >
          + New Comic
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-comic-primary">
          <div class="flex items-center">
            <div class="text-3xl mr-4">📚</div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ comics.length }}</p>
              <p class="text-gray-600 font-comic">Total Comics</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-comic-secondary">
          <div class="flex items-center">
            <div class="text-3xl mr-4">👁️</div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ publicComicsCount }}</p>
              <p class="text-gray-600 font-comic">Public Comics</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-comic-accent">
          <div class="flex items-center">
            <div class="text-3xl mr-4">👥</div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ collaborativeComicsCount }}</p>
              <p class="text-gray-600 font-comic">Collaborative</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Comics Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200"></div>
          <div class="p-6">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded mb-4"></div>
            <div class="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="comics.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🎨</div>
        <h3 class="text-xl font-comic font-bold text-gray-900 mb-2">No comics yet</h3>
        <p class="text-gray-600 font-comic mb-6">Start creating your first comic strip!</p>
        <router-link
          to="/create"
          class="bg-comic-primary text-white px-6 py-3 rounded-full font-comic font-bold hover:bg-comic-primary/90 transition-colors"
        >
          Create Your First Comic
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="comic in comics"
          :key="comic.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
        >
          <!-- Comic Preview -->
          <div class="h-48 bg-gradient-to-r from-comic-primary/20 to-comic-secondary/20 relative overflow-hidden">
            <div v-if="comic.panels.length > 0" class="absolute inset-0 grid grid-cols-2 gap-1 p-2">
              <div
                v-for="(panel, index) in comic.panels.slice(0, 4)"
                :key="panel.id"
                class="bg-white rounded border-2 border-comic-outline overflow-hidden"
              >
                <img
                  v-if="panel.imageUrl"
                  :src="panel.imageUrl"
                  :alt="`Panel ${index + 1}`"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div class="text-xs text-gray-500">Panel {{ index + 1 }}</div>
                </div>
              </div>
            </div>
            <div v-else class="flex items-center justify-center h-full">
              <div class="text-center">
                <div class="text-4xl mb-2">📝</div>
                <p class="text-gray-600 font-comic text-sm">No panels yet</p>
              </div>
            </div>
          </div>

          <!-- Comic Info -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-comic font-bold text-lg text-gray-900 group-hover:text-comic-primary transition-colors">
                {{ comic.title }}
              </h3>
              <div class="flex items-center space-x-1">
                <span
                  v-if="comic.isPublic"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Public
                </span>
                <span
                  v-if="comic.collaborators.length > 0"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ comic.collaborators.length }} collaborator{{ comic.collaborators.length > 1 ? 's' : '' }}
                </span>
              </div>
            </div>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-2 font-comic">{{ comic.description }}</p>
            
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{{ comic.panels.length }} panel{{ comic.panels.length !== 1 ? 's' : '' }}</span>
              <span>{{ formatDate(comic.updatedAt) }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2">
              <router-link
                :to="`/editor/${comic.id}`"
                class="flex-1 bg-comic-primary text-white py-2 px-4 rounded-lg text-center font-comic font-bold hover:bg-comic-primary/90 transition-colors"
              >
                Edit
              </router-link>
              <router-link
                :to="`/comic/${comic.id}`"
                class="flex-1 border border-comic-primary text-comic-primary py-2 px-4 rounded-lg text-center font-comic font-bold hover:bg-comic-primary hover:text-white transition-colors"
              >
                View
              </router-link>
              <button
                @click="shareComic(comic)"
                class="bg-comic-secondary text-white p-2 rounded-lg hover:bg-comic-secondary/90 transition-colors"
                title="Share"
              >
                <ShareIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
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
          <div class="flex justify-end space-x-3">
            <button
              @click="shareModalOpen = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 font-comic"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ShareIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useComicStore } from '@/stores/comic'
import { comicService } from '@/services/comic'
import { format } from 'date-fns'
import type { Comic } from '@/types'

const authStore = useAuthStore()
const comicStore = useComicStore()

const shareModalOpen = ref(false)
const shareUrl = ref('')
const shareUrlInput = ref<HTMLInputElement>()

const comics = computed(() => comicStore.comics)
const loading = computed(() => comicStore.loading)

const publicComicsCount = computed(() => 
  comics.value.filter(comic => comic.isPublic).length
)

const collaborativeComicsCount = computed(() => 
  comics.value.filter(comic => comic.collaborators.length > 0).length
)

onMounted(async () => {
  if (authStore.user) {
    await comicStore.loadUserComics(authStore.user.uid)
  }
})

const formatDate = (date: Date) => {
  return format(new Date(date), 'MMM d, yyyy')
}

const shareComic = (comic: Comic) => {
  shareUrl.value = comicService.generateShareUrl(comic.id)
  shareModalOpen.value = true
}

const copyShareUrl = async () => {
  if (shareUrlInput.value) {
    shareUrlInput.value.select()
    await navigator.clipboard.writeText(shareUrl.value)
    // Could add a toast notification here
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>