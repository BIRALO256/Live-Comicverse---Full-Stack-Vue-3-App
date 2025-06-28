<template>
  <div
    ref="stickerRef"
    class="sticker absolute select-none"
    :class="{ 'cursor-move': editable }"
    :style="stickerStyle"
    @mousedown="startDrag"
  >
    <div class="relative">
      <!-- Sticker Content -->
      <div
        class="text-4xl transition-transform duration-200 hover:scale-110"
        :style="{ transform: `scale(${sticker.scale}) rotate(${sticker.rotation}deg)` }"
      >
        {{ sticker.type }}
      </div>

      <!-- Edit Controls -->
      <div v-if="editable" class="absolute -top-2 -right-2 flex space-x-1">
        <select
          v-model="localType"
          @change="updateType"
          @mousedown.stop
          class="text-xs bg-white border border-gray-300 rounded px-1"
        >
          <option value="😀">😀</option>
          <option value="😂">😂</option>
          <option value="😍">😍</option>
          <option value="😮">😮</option>
          <option value="😢">😢</option>
          <option value="😡">😡</option>
          <option value="💥">💥</option>
          <option value="⭐">⭐</option>
          <option value="💫">💫</option>
          <option value="❤️">❤️</option>
          <option value="💨">💨</option>
          <option value="💤">💤</option>
        </select>
        <button
          @click="deleteMe"
          @mousedown.stop
          class="w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
        >
          ×
        </button>
      </div>

      <!-- Scale/Rotate Controls -->
      <div v-if="editable" class="absolute -bottom-6 left-0 flex space-x-2">
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          :value="sticker.scale"
          @input="updateScale"
          @mousedown.stop
          class="w-16 h-2"
        />
        <input
          type="range"
          min="-180"
          max="180"
          step="15"
          :value="sticker.rotation"
          @input="updateRotation"
          @mousedown.stop
          class="w-16 h-2"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Sticker } from '@/types'

interface Props {
  sticker: Sticker
  editable?: boolean
}

interface Emits {
  (e: 'update', sticker: Sticker): void
  (e: 'delete', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})

const emit = defineEmits<Emits>()

const stickerRef = ref<HTMLElement>()
const localType = ref(props.sticker.type)
const isDragging = ref(false)

const stickerStyle = computed(() => ({
  left: `${props.sticker.x}px`,
  top: `${props.sticker.y}px`,
  zIndex: 20
}))

const updateType = () => {
  emit('update', {
    ...props.sticker,
    type: localType.value
  })
}

const updateScale = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update', {
    ...props.sticker,
    scale: parseFloat(target.value)
  })
}

const updateRotation = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update', {
    ...props.sticker,
    rotation: parseInt(target.value)
  })
}

const deleteMe = () => {
  emit('delete', props.sticker.id)
}

const startDrag = (event: MouseEvent) => {
  if (!props.editable) return
  
  isDragging.value = true
  const rect = stickerRef.value?.getBoundingClientRect()
  if (!rect) return

  const offsetX = event.clientX - rect.left
  const offsetY = event.clientY - rect.top

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return

    const parentRect = stickerRef.value?.parentElement?.getBoundingClientRect()
    if (!parentRect) return

    const newX = e.clientX - parentRect.left - offsetX
    const newY = e.clientY - parentRect.top - offsetY

    emit('update', {
      ...props.sticker,
      x: Math.max(0, Math.min(newX, parentRect.width - 50)),
      y: Math.max(0, Math.min(newY, parentRect.height - 50))
    })
  }

  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style scoped>
.sticker {
  user-select: none;
}
</style>