<template>
  <div 
    ref="panelRef"
    class="comic-panel relative bg-white border-4 border-comic-outline rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    :class="{ 'animate-pulse': panel.isGenerating }"
  >
    <!-- Panel Image -->
    <div class="relative w-full h-64 bg-gray-100">
      <img 
        v-if="panel.imageUrl && !panel.isGenerating"
        :src="panel.imageUrl" 
        :alt="`Panel ${panel.order + 1}`"
        class="w-full h-full object-cover"
        @load="onImageLoad"
      />
      <div 
        v-else-if="panel.isGenerating"
        class="flex items-center justify-center h-full bg-gradient-to-r from-blue-100 to-purple-100"
      >
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-comic-primary mx-auto mb-4"></div>
          <p class="text-gray-600 font-comic">Generating amazing artwork...</p>
        </div>
      </div>
      <div 
        v-else
        class="flex items-center justify-center h-full bg-gray-200"
      >
        <p class="text-gray-500">No image available</p>
      </div>
    </div>

    <!-- Speech Bubbles -->
    <div class="absolute inset-0 pointer-events-none">
      <SpeechBubble
        v-for="bubble in panel.speechBubbles"
        :key="bubble.id"
        :bubble="bubble"
        :editable="editable"
        @update="updateBubble"
        @delete="deleteBubble"
        class="pointer-events-auto"
      />
    </div>

    <!-- Stickers -->
    <div class="absolute inset-0 pointer-events-none">
      <Sticker
        v-for="sticker in panel.stickers"
        :key="sticker.id"
        :sticker="sticker"
        :editable="editable"
        @update="updateSticker"
        @delete="deleteSticker"
        class="pointer-events-auto"
      />
    </div>

    <!-- Panel Number -->
    <div class="absolute top-2 left-2 bg-comic-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
      {{ panel.order + 1 }}
    </div>

    <!-- Edit Controls -->
    <div v-if="editable" class="absolute top-2 right-2 flex space-x-2">
      <button
        @click="addSpeechBubble"
        class="bg-comic-bubble text-comic-outline p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        title="Add Speech Bubble"
      >
        <ChatBubbleLeftIcon class="w-4 h-4" />
      </button>
      <button
        @click="addSticker"
        class="bg-comic-accent text-comic-outline p-2 rounded-full shadow-md hover:bg-yellow-200 transition-colors"
        title="Add Sticker"
      >
        <FaceSmileIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Choice Buttons -->
    <div v-if="panel.choices && panel.choices.length > 0" class="absolute bottom-4 left-4 right-4">
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="choice in panel.choices"
          :key="choice.id"
          @click="$emit('choice-selected', choice)"
          class="choice-button bg-comic-primary text-white px-4 py-2 rounded-full font-comic font-bold hover:bg-comic-primary/90 transition-colors shadow-lg"
        >
          {{ choice.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChatBubbleLeftIcon, FaceSmileIcon } from '@heroicons/vue/24/outline'
import SpeechBubble from './SpeechBubble.vue'
import Sticker from './Sticker.vue'
import { animationService } from '@/services/animation'
import type { Panel, SpeechBubble as SpeechBubbleType, Sticker as StickerType, Choice } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  panel: Panel
  editable?: boolean
  animationDelay?: number
}

interface Emits {
  (e: 'update', panel: Panel): void
  (e: 'choice-selected', choice: Choice): void
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  animationDelay: 0
})

const emit = defineEmits<Emits>()

const panelRef = ref<HTMLElement>()

onMounted(() => {
  if (panelRef.value) {
    animationService.animatePanelReveal(panelRef.value, props.animationDelay)
  }
})

const onImageLoad = () => {
  if (panelRef.value) {
    const bubbles = panelRef.value.querySelectorAll('.speech-bubble')
    bubbles.forEach((bubble, index) => {
      animationService.animateSpeechBubble(bubble as HTMLElement)
    })
  }
}

const addSpeechBubble = () => {
  const newBubble: SpeechBubbleType = {
    id: uuidv4(),
    text: 'New dialogue',
    x: 100,
    y: 100,
    width: 120,
    height: 60,
    type: 'speech'
  }

  const updatedPanel = {
    ...props.panel,
    speechBubbles: [...props.panel.speechBubbles, newBubble]
  }

  emit('update', updatedPanel)
}

const addSticker = () => {
  const newSticker: StickerType = {
    id: uuidv4(),
    type: '😀',
    x: 150,
    y: 150,
    scale: 1,
    rotation: 0
  }

  const updatedPanel = {
    ...props.panel,
    stickers: [...props.panel.stickers, newSticker]
  }

  emit('update', updatedPanel)
}

const updateBubble = (updatedBubble: SpeechBubbleType) => {
  const updatedPanel = {
    ...props.panel,
    speechBubbles: props.panel.speechBubbles.map(bubble =>
      bubble.id === updatedBubble.id ? updatedBubble : bubble
    )
  }

  emit('update', updatedPanel)
}

const deleteBubble = (bubbleId: string) => {
  const updatedPanel = {
    ...props.panel,
    speechBubbles: props.panel.speechBubbles.filter(bubble => bubble.id !== bubbleId)
  }

  emit('update', updatedPanel)
}

const updateSticker = (updatedSticker: StickerType) => {
  const updatedPanel = {
    ...props.panel,
    stickers: props.panel.stickers.map(sticker =>
      sticker.id === updatedSticker.id ? updatedSticker : sticker
    )
  }

  emit('update', updatedPanel)
}

const deleteSticker = (stickerId: string) => {
  const updatedPanel = {
    ...props.panel,
    stickers: props.panel.stickers.filter(sticker => sticker.id !== stickerId)
  }

  emit('update', updatedPanel)
}
</script>

<style scoped>
.comic-panel {
  aspect-ratio: 4 / 3;
  min-height: 300px;
}

.choice-button {
  transform: translateY(0);
  transition: all 0.2s ease;
}

.choice-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
</style>