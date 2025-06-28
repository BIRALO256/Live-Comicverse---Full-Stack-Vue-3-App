<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 class="font-heading text-3xl text-comic-dark mb-2">{{ comic?.title || 'Untitled Comic' }}</h1>
          <p class="text-gray-600 font-comic">{{ comic?.description }}</p>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <button
            @click="shareComic"
            class="bg-comic-secondary text-white px-4 py-2 rounded-lg font-comic font-bold hover:bg-comic-secondary/90 transition-colors flex items-center"
          >
            <ShareIcon class="w-5 h-5 mr-2" />
            Share
          </button>
          <button
            @click="exportAsGIF"
            class="bg-comic-accent text-white px-4 py-2 rounded-lg font-comic font-bold hover:bg-comic-accent/90 transition-colors flex items-center"
          >
            <ArrowDownTrayIcon class="w-5 h-5 mr-2" />
            Export GIF
          </button>
          <router-link
            :to="`/comic/${$route.params.id}`"
            class="border border-comic-primary text-comic-primary px-4 py-2 rounded-lg font-comic font-bold hover:bg-comic-primary hover:text-white transition-colors"
          >
            Preview
          </router-link>
        </div>
      </div>

      <!-- Editor Tools -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-comic font-bold text-gray-700">Tools:</span>
            <button
              :class="[
                'px-3 py-2 rounded-lg font-comic text-sm transition-colors',
                activeTool === 'select' ? 'bg-comic-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
              @click="setActiveTool('select')"
            >
              Select
            </button>
            <button
              :class="[
                'px-3 py-2 rounded-lg font-comic text-sm transition-colors',
                activeTool === 'speech' ? 'bg-comic-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
              @click="setActiveTool('speech')"
            >
              Speech Bubble
            </button>
            <button
              :class="[
                'px-3 py-2 rounded-lg font-comic text-sm transition-colors',
                activeTool === 'sticker' ? 'bg-comic-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
              @click="setActiveTool('sticker')"
            >
              Stickers
            </button>
          </div>
          
          <div class="flex items-center space-x-2">
            <span class="text-sm font-comic font-bold text-gray-700">Collaborators:</span>
            <div class="flex items-center space-x-1">
              <div
                v-for="collaborator in activeCollaborators"
                :key="collaborator.id"
                class="w-8 h-8 rounded-full bg-comic-secondary flex items-center justify-center text-white text-xs font-bold"
                :title="collaborator.name"
              >
                {{ collaborator.name[0].toUpperCase() }}
              </div>
              <span v-if="activeCollaborators.length === 0" class="text-gray-500 text-sm font-comic">
                Just you
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Comic Panels -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-comic-primary mx-auto mb-4"></div>
          <p class="text-gray-600 font-comic">Loading comic...</p>
        </div>
      </div>

      <div v-else-if="!comic" class="text-center py-12">
        <div class="text-6xl mb-4">😕</div>
        <h3 class="text-xl font-comic font-bold text-gray-900 mb-2">Comic not found</h3>
        <p class="text-gray-600 font-comic mb-6">The comic you're looking for doesn't exist or you don't have access to it.</p>
        <router-link
          to="/dashboard"
          class="bg-comic-primary text-white px-6 py-3 rounded-full font-comic font-bold hover:bg-comic-primary/90 transition-colors"
        >
          Back to Dashboard
        </router-link>
      </div>

      <div v-else-if="sortedPanels.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-xl font-comic font-bold text-gray-900 mb-2">No panels yet</h3>
        <p class="text-gray-600 font-comic mb-6">This comic doesn't have any panels yet.</p>
      </div>

      <div v-else ref="comicContainer" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComicPanel
          v-for="(panel, index) in sortedPanels"
          :key="panel.id"
          :panel="panel"
          :editable="true"
          :animation-delay="index * 0.1"
          @update="updatePanel"
          @choice-selected="handleChoiceSelected"
        />
      </div>

      <!-- Add Panel Button -->
      <div v-if="comic" class="text-center mt-8">
        <button
          @click="addNewPanel"
          :disabled="generating"
          class="bg-comic-primary text-white px-6 py-3 rounded-full font-comic font-bold hover:bg-comic-primary/90 disabled:opacity-50 transition-colors"
        >
          <span v-if="generating">Generating panel...</span>
          <span v-else">+ Add Panel</span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { ShareIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useComicStore } from '@/stores/comic'
import { comicService } from '@/services/comic'
import { animationService } from '@/services/animation'
import ComicPanel from '@/components/ComicPanel.vue'
import type { Panel, Choice } from '@/types'

const route = useRoute()
const authStore = useAuthStore()
const comicStore = useComicStore()

const comicContainer = ref<HTMLElement>()
const activeTool = ref('select')
const generating = ref(false)
const shareModalOpen = ref(false)
const shareUrl = ref('')
const shareUrlInput = ref<HTMLInputElement>()

// Mock active collaborators - in real app this would come from Firebase
const activeCollaborators = ref<Array<{ id: string; name: string }>>([])

const comic = computed(() => comicStore.currentComic)
const loading = computed(() => comicStore.loading)
const sortedPanels = computed(() => comicStore.sortedPanels)

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  const comicId = route.params.id as string
  
  // Load the comic
  await comicStore.loadComic(comicId)
  
  // Subscribe to real-time updates
  unsubscribe = comicStore.subscribeToComic(comicId)
  
  // Set up parallax animations after panels load
  if (comicContainer.value) {
    setTimeout(() => {
      animationService.setupParallaxScroll(comicContainer.value!)
    }, 1000)
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
  animationService.cleanup()
})

const setActiveTool = (tool: string) => {
  activeTool.value = tool
}

const updatePanel = async (panel: Panel) => {
  if (!comic.value) return
  
  try {
    await comicStore.updatePanel(comic.value.id, panel)
  } catch (error) {
    console.error('Failed to update panel:', error)
  }
}

const addNewPanel = async () => {
  if (!comic.value || !authStore.user) return
  
  generating.value = true
  
  try {
    // For now, create a basic panel
    // In a real app, you might ask the user for a prompt or use AI to continue the story
    const newPanel: Omit<Panel, 'id'> = {
      order: comic.value.panels.length,
      imageUrl: '',
      prompt: 'Continue the story...',
      speechBubbles: [],
      stickers: [],
      isGenerating: true
    }
    
    await comicService.addPanelRealtime(comic.value.id, newPanel)
  } catch (error) {
    console.error('Failed to add panel:', error)
  } finally {
    generating.value = false
  }
}

const handleChoiceSelected = async (choice: Choice) => {
  if (!comic.value) return
  
  generating.value = true
  
  try {
    const context = `Current comic: ${comic.value.title}. ${comic.value.description}`
    await comicStore.generateChoicePanels(comic.value.id, choice.text, context)
  } catch (error) {
    console.error('Failed to generate choice panels:', error)
  } finally {
    generating.value = false
  }
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

const exportAsGIF = async () => {
  // This would be implemented with a library like gif.js
  // For now, just show an alert
  alert('GIF export functionality would be implemented here using libraries like gif.js and html2canvas')
}
</script>