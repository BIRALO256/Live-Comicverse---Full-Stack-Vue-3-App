<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="font-heading text-5xl text-comic-dark mb-4 transform -rotate-1">Comic Gallery</h1>
        <p class="text-xl text-gray-600 font-comic">Discover amazing comics created by our community</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search comics..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-primary font-comic"
            />
          </div>
          
          <div class="flex gap-4">
            <select
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-primary font-comic"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="author">Author A-Z</option>
            </select>
            
            <select
              v-model="filterBy"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-primary font-comic"
            >
              <option value="all">All Comics</option>
              <option value="recent">Recent (Last 7 days)</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Comics Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 9" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200"></div>
          <div class="p-6">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded mb-4"></div>
            <div class="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredComics.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-comic font-bold text-gray-900 mb-2">No comics found</h3>
        <p class="text-gray-600 font-comic mb-6">
          {{ searchQuery ? 'Try adjusting your search terms' : 'No public comics available yet' }}
        </p>
        <router-link
          v-if="authStore.isAuthenticated"
          to="/create"
          class="bg-comic-primary text-white px-6 py-3 rounded-full font-comic font-bold hover:bg-comic-primary/90 transition-colors"
        >
          Create the First Comic
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="comic in filteredComics"
          :key="comic.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group transform hover:scale-105"
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

            <!-- Overlay on hover -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <router-link
                :to="`/comic/${comic.id}`"
                class="opacity-0 group-hover:opacity-100 bg-white text-comic-primary px-4 py-2 rounded-full font-comic font-bold transform scale-90 group-hover:scale-100 transition-all duration-300"
              >
                Read Comic
              </router-link>
            </div>
          </div>

          <!-- Comic Info -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-comic font-bold text-lg text-gray-900 group-hover:text-comic-primary transition-colors line-clamp-1">
                {{ comic.title }}
              </h3>
              <div class="flex items-center space-x-1">
                <span
                  v-if="comic.collaborators.length > 0"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  Collab
                </span>
              </div>
            </div>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-2 font-comic">{{ comic.description }}</p>
            
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span class="font-comic">by {{ comic.authorName }}</span>
              <span class="font-comic">{{ comic.panels.length }} panel{{ comic.panels.length !== 1 ? 's' : '' }}</span>
            </div>

            <div class="flex items-center justify-between text-xs text-gray-400">
              <span>{{ formatDate(comic.createdAt) }}</span>
              <div class="flex items-center space-x-2">
                <button
                  @click="shareComic(comic)"
                  class="text-comic-secondary hover:text-comic-secondary/80 transition-colors"
                  title="Share"
                >
                  <ShareIcon class="w-4 h-4" />
                </button>
                <button
                  @click="likeComic(comic)"
                  class="text-red-400 hover:text-red-500 transition-colors"
                  title="Like"
                >
                  <HeartIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="filteredComics.length > 0 && filteredComics.length >= 9" class="text-center mt-12">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="bg-comic-primary text-white px-8 py-3 rounded-full font-comic font-bold hover:bg-comic-primary/90 disabled:opacity-50 transition-colors"
        >
          {{ loadingMore ? 'Loading...' : 'Load More Comics' }}
        </button>
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
import { ShareIcon, HeartIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useComicStore } from '@/stores/comic'
import { comicService } from '@/services/comic'
import { format, isAfter, subDays } from 'date-fns'
import type { Comic } from '@/types'

const authStore = useAuthStore()
const comicStore = useComicStore()

const searchQuery = ref('')
const sortBy = ref('newest')
const filterBy = ref('all')
const loadingMore = ref(false)
const shareModalOpen = ref(false)
const shareUrl = ref('')
const shareUrlInput = ref<HTMLInputElement>()

const comics = computed(() => comicStore.comics)
const loading = computed(() => comicStore.loading)

const filteredComics = computed(() => {
  let filtered = [...comics.value]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(comic =>
      comic.title.toLowerCase().includes(query) ||
      comic.description.toLowerCase().includes(query) ||
      comic.authorName.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (filterBy.value === 'recent') {
    const weekAgo = subDays(new Date(), 7)
    filtered = filtered.filter(comic => isAfter(new Date(comic.createdAt), weekAgo))
  } else if (filterBy.value === 'popular') {
    // For now, just show all comics. In a real app, you'd sort by likes/views
    filtered = filtered
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'author':
        return a.authorName.localeCompare(b.authorName)
      default:
        return 0
    }
  })

  return filtered
})

onMounted(async () => {
  await comicStore.loadPublicComics()
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

const likeComic = (comic: Comic) => {
  // This would be implemented with a likes system in Firebase
  console.log('Like comic:', comic.id)
}

const loadMore = async () => {
  loadingMore.value = true
  // In a real app, you'd implement pagination here
  setTimeout(() => {
    loadingMore.value = false
  }, 1000)
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>