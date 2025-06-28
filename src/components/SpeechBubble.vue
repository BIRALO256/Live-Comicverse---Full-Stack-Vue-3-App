<template>
  <div
    ref="bubbleRef"
    class="speech-bubble absolute select-none"
    :class="{ 'cursor-move': editable, 'pointer-events-none': !editable }"
    :style="bubbleStyle"
    @mousedown="startDrag"
  >
    <!-- Bubble Shape -->
    <div 
      class="relative bg-comic-bubble border-2 border-comic-outline rounded-lg p-2 shadow-md"
      :class="bubbleClass"
    >
      <!-- Tail/Pointer -->
      <div 
        v-if="bubble.type === 'speech'"
        class="absolute w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-comic-bubble"
        style="bottom: -8px; left: 20px; filter: drop-shadow(0 2px 0 #2C3E50);"
      ></div>

      <!-- Cloud for thought bubble -->
      <div 
        v-if="bubble.type === 'thought'"
        class="absolute flex space-x-1"
        style="bottom: -15px; left: 15px;"
      >
        <div class="w-2 h-2 bg-comic-bubble border border-comic-outline rounded-full"></div>
        <div class="w-1.5 h-1.5 bg-comic-bubble border border-comic-outline rounded-full"></div>
        <div class="w-1 h-1 bg-comic-bubble border border-comic-outline rounded-full"></div>
      </div>

      <!-- Text Content -->
      <div
        v-if="!editable"
        class="text-comic-outline font-comic text-sm leading-tight whitespace-pre-wrap"
        v-html="formattedText"
      ></div>

      <!-- Editable Text -->
      <textarea
        v-else
        v-model="localText"
        @input="updateText"
        @mousedown.stop
        class="w-full h-full resize-none border-none outline-none bg-transparent text-comic-outline font-comic text-sm leading-tight"
        :style="{ minHeight: '40px' }"
      ></textarea>

      <!-- Edit Controls -->
      <div v-if="editable" class="absolute -top-2 -right-2 flex space-x-1">
        <select
          v-model="localType"
          @change="updateType"
          @mousedown.stop
          class="text-xs bg-white border border-gray-300 rounded px-1"
        >
          <option value="speech">Speech</option>
          <option value="thought">Thought</option>
          <option value="narration">Narration</option>
        </select>
        <button
          @click="deleteMe"
          @mousedown.stop
          class="w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
        >
          ×
        </button>
      </div>

      <!-- Resize Handle -->
      <div
        v-if="editable"
        class="absolute -bottom-1 -right-1 w-3 h-3 bg-comic-primary rounded-full cursor-se-resize"
        @mousedown.stop="startResize"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SpeechBubble } from '@/types'

interface Props {
  bubble: SpeechBubble
  editable?: boolean
}

interface Emits {
  (e: 'update', bubble: SpeechBubble): void
  (e: 'delete', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})

const emit = defineEmits<Emits>()

const bubbleRef = ref<HTMLElement>()
const localText = ref(props.bubble.text)
const localType = ref(props.bubble.type)
const isDragging = ref(false)
const isResizing = ref(false)

const bubbleStyle = computed(() => ({
  left: `${props.bubble.x}px`,
  top: `${props.bubble.y}px`,
  width: `${props.bubble.width}px`,
  minHeight: `${props.bubble.height}px`,
  zIndex: 10
}))

const bubbleClass = computed(() => {
  switch (props.bubble.type) {
    case 'thought':
      return 'border-dashed'
    case 'narration':
      return 'bg-yellow-100 border-yellow-400'
    default:
      return ''
  }
})

const formattedText = computed(() => {
  return localText.value.replace(/\n/g, '<br>')
})

watch(() => props.bubble.text, (newText) => {
  localText.value = newText
})

const updateText = () => {
  emit('update', {
    ...props.bubble,
    text: localText.value
  })
}

const updateType = () => {
  emit('update', {
    ...props.bubble,
    type: localType.value as 'speech' | 'thought' | 'narration'
  })
}

const deleteMe = () => {
  emit('delete', props.bubble.id)
}

const startDrag = (event: MouseEvent) => {
  if (!props.editable) return
  
  isDragging.value = true
  const rect = bubbleRef.value?.getBoundingClientRect()
  if (!rect) return

  const offsetX = event.clientX - rect.left
  const offsetY = event.clientY - rect.top

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return

    const parentRect = bubbleRef.value?.parentElement?.getBoundingClientRect()
    if (!parentRect) return

    const newX = e.clientX - parentRect.left - offsetX
    const newY = e.clientY - parentRect.top - offsetY

    emit('update', {
      ...props.bubble,
      x: Math.max(0, Math.min(newX, parentRect.width - props.bubble.width)),
      y: Math.max(0, Math.min(newY, parentRect.height - props.bubble.height))
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

const startResize = (event: MouseEvent) => {
  if (!props.editable) return
  
  event.preventDefault()
  isResizing.value = true

  const startX = event.clientX
  const startY = event.clientY
  const startWidth = props.bubble.width
  const startHeight = props.bubble.height

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.value) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    const newWidth = Math.max(80, startWidth + deltaX)
    const newHeight = Math.max(40, startHeight + deltaY)

    emit('update', {
      ...props.bubble,
      width: newWidth,
      height: newHeight
    })
  }

  const handleMouseUp = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style scoped>
.speech-bubble {
  user-select: none;
}

.speech-bubble textarea {
  font-family: 'Comic Neue', cursive;
}
</style>