<template>
  <div class="min-h-screen bg-gradient-to-br from-comic-accent/10 via-white to-comic-primary/10">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="font-heading text-5xl text-comic-dark mb-4 transform -rotate-1">Create Your Comic</h1>
        <p class="text-xl text-gray-600 font-comic">Describe your story and watch AI bring it to life!</p>
      </div>

      <!-- Creation Form -->
      <div class="bg-white rounded-lg shadow-lg p-8 border-4 border-comic-outline transform rotate-1 hover:rotate-0 transition-transform duration-300">
        <form @submit.prevent="generateComic" class="space-y-6">
          <!-- Story Prompt -->
          <div>
            <label for="prompt" class="block text-lg font-comic font-bold text-gray-700 mb-2">
              What's your story about? 📖
            </label>
            <textarea
              id="prompt"
              v-model="prompt"
              required
              rows="6"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-primary focus:border-transparent font-comic text-lg"
              placeholder="Tell me about your comic! For example: 'A cat discovers they can talk and goes on adventures in their neighborhood, meeting other magical animals and solving mysteries together.'"
            ></textarea>
            <p class="text-sm text-gray-500 mt-2 font-comic">
              Be as detailed as you like! The more context you provide, the better your comic will be.
            </p>
          </div>

          <!-- Generation Options -->
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-comic font-bold text-gray-700 mb-2">Art Style</label>
              <select
                v-model="artStyle"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-primary font-comic"
              >
                <option value="cartoon">Cartoon Style</option>
                <option value="anime">Anime Style</option>
                <option value="realistic">Realistic Style</option>
                <option value="sketch">Hand-drawn Sketch</option>
                <option value="watercolor">Watercolor</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-comic font-bold text-gray-700 mb-2">Panel Count</label>
              <select
                v-model="panelCount"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-primary font-comic"
              >
                <option value="4">4 Panels</option>
                <option value="5">5 Panels</option>
                <option value="6">6 Panels</option>
              </select>
            </div>
          </div>

          <!-- Advanced Options -->
          <div class="border-t pt-6">
            <button
              type="button"
              @click="showAdvanced = !showAdvanced"
              class="flex items-center text-comic-primary hover:text-comic-primary/80 font-comic font-bold mb-4"
            >
              <ChevronDownIcon 
                class="w-5 h-5 mr-2 transition-transform duration-200"
                :class="{ 'rotate-180': showAdvanced }"
              />
              Advanced Options
            </button>

            <div v-if="showAdvanced" class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="includeChoices"
                      type="checkbox"
                      class="rounded border-gray-300 text-comic-primary focus:ring-comic-primary"
                    />
                    <span class="ml-2 font-comic">Include branching choices</span>
                  </label>
                </div>
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="makePublic"
                      type="checkbox"
                      class="rounded border-gray-300 text-comic-primary focus:ring-comic-primary"
                    />
                    <span class="ml-2 font-comic">Make public after creation</span>
                  </label>
                </div>
              </div>

              <div>
                <label for="collaborators" class="block text-sm font-comic font-bold text-gray-700 mb-2">
                  Collaborators (email addresses)
                </label>
                <input
                  id="collaborators"
                  v-model="collaborators"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-primary font-comic"
                  placeholder="friend@example.com, another@example.com"
                />
                <p class="text-sm text-gray-500 mt-1 font-comic">
                  Separate multiple emails with commas
                </p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="text-center">
            <button
              type="submit"
              :disabled="loading || !prompt.trim()"
              class="bg-comic-primary text-white px-8 py-4 rounded-full font-comic font-bold text-lg hover:bg-comic-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <span v-if="loading" class="flex items-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Creating your comic...
              </span>
              <span v-else>🎨 Generate Comic</span>
            </button>
          </div>
        </form>

        <!-- Progress Indicator -->
        <div v-if="loading" class="mt-8">
          <div class="text-center mb-4">
            <h3 class="font-comic font-bold text-lg text-gray-700 mb-2">{{ progressMessage }}</h3>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                class="bg-gradient-to-r from-comic-primary to-comic-secondary h-3 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
            <p class="text-sm text-gray-500 mt-2 font-comic">{{ progress }}% complete</p>
          </div>
          
          <!-- Fun loading messages -->
          <div class="text-center space-y-2">
            <div class="flex justify-center space-x-4 text-2xl">
              <span class="animate-bounce" style="animation-delay: 0s;">🎨</span>
              <span class="animate-bounce" style="animation-delay: 0.2s;">✨</span>
              <span class="animate-bounce" style="animation-delay: 0.4s;">🤖</span>
              <span class="animate-bounce" style="animation-delay: 0.6s;">📚</span>
            </div>
            <p class="text-gray-600 font-comic italic">{{ loadingTip }}</p>
          </div>
        </div>
      </div>

      <!-- Example Prompts -->
      <div class="mt-12">
        <h2 class="font-comic font-bold text-2xl text-center mb-6 text-gray-700">Need inspiration? Try these prompts:</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="example in examplePrompts"
            :key="example.title"
            @click="useExamplePrompt(example.prompt)"
            class="text-left p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-comic-primary hover:bg-comic-primary/5 transition-colors"
          >
            <h3 class="font-comic font-bold text-sm text-comic-primary mb-1">{{ example.title }}</h3>
            <p class="text-xs text-gray-600 font-comic">{{ example.prompt.substring(0, 100) }}...</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useComicStore } from '@/stores/comic'

const router = useRouter()
const authStore = useAuthStore()
const comicStore = useComicStore()

const prompt = ref('')
const artStyle = ref('cartoon')
const panelCount = ref('4')
const includeChoices = ref(false)
const makePublic = ref(false)
const collaborators = ref('')
const showAdvanced = ref(false)
const loading = ref(false)
const progress = ref(0)

const progressMessage = ref('Preparing your comic...')
const loadingTip = ref('')

const loadingMessages = [
  { progress: 10, message: 'Analyzing your story...', tip: 'AI is reading your prompt and understanding the narrative' },
  { progress: 25, message: 'Creating comic script...', tip: 'Claude is writing dialogue and scene descriptions' },
  { progress: 40, message: 'Generating artwork...', tip: 'DALL-E is creating beautiful illustrations for each panel' },
  { progress: 60, message: 'Adding speech bubbles...', tip: 'Placing dialogue and thought bubbles in perfect positions' },
  { progress: 80, message: 'Applying final touches...', tip: 'Adding stickers, effects, and polishing the layout' },
  { progress: 100, message: 'Comic ready!', tip: 'Your masterpiece is complete!' }
]

const examplePrompts = [
  {
    title: "Space Adventure",
    prompt: "A young astronaut discovers a friendly alien who needs help fixing their spaceship. Together they explore colorful planets and meet interesting creatures while learning about friendship and cooperation."
  },
  {
    title: "Magical School",
    prompt: "A student at a magical school accidentally turns their homework into a living creature. The homework creature causes chaos around the school until the student learns a valuable lesson about responsibility."
  },
  {
    title: "Time Travel Mix-up",
    prompt: "A teenager finds an old watch that can travel through time, but it only works for 5 minutes at a time. They use it to fix small problems but end up creating bigger ones in hilarious ways."
  },
  {
    title: "Robot Butler",
    prompt: "A family gets a new robot butler that's supposed to make life easier, but its literal interpretation of commands leads to funny misunderstandings and unexpected solutions."
  },
  {
    title: "Superhero Day Off",
    prompt: "A superhero tries to have a normal day off but keeps accidentally saving people while doing mundane tasks like grocery shopping and walking their dog."
  },
  {
    title: "Talking Pet Mystery",
    prompt: "A detective's cat suddenly gains the ability to talk and becomes their partner in solving a neighborhood mystery involving missing garden gnomes and suspicious squirrels."
  }
]

const generateComic = async () => {
  if (!authStore.user) return

  loading.value = true
  progress.value = 0

  // Simulate progress updates
  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 10
      const currentStep = loadingMessages.find(step => progress.value >= step.progress)
      if (currentStep) {
        progressMessage.value = currentStep.message
        loadingTip.value = currentStep.tip
      }
    }
  }, 1000)

  try {
    const finalPrompt = `${prompt.value} (Art style: ${artStyle.value}, ${panelCount.value} panels${includeChoices.value ? ', include branching choices' : ''})`
    
    const comicId = await comicStore.generateComic(
      finalPrompt,
      authStore.user.uid,
      authStore.user.displayName || 'Anonymous'
    )

    // Complete progress
    clearInterval(progressInterval)
    progress.value = 100
    progressMessage.value = 'Comic ready!'
    loadingTip.value = 'Your masterpiece is complete!'

    // Small delay to show completion
    setTimeout(() => {
      router.push(`/editor/${comicId}`)
    }, 1000)

  } catch (error) {
    clearInterval(progressInterval)
    console.error('Failed to generate comic:', error)
    loading.value = false
    progress.value = 0
  }
}

const useExamplePrompt = (examplePrompt: string) => {
  prompt.value = examplePrompt
}
</script>