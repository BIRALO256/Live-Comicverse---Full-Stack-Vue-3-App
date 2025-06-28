<template>
  <nav class="bg-white shadow-lg border-b-4 border-comic-primary">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Title -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-comic-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">LC</span>
            </div>
            <span class="font-heading text-2xl text-comic-dark">Live Comicverse</span>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/gallery"
            class="text-comic-dark hover:text-comic-primary font-comic font-semibold transition-colors"
          >
            Gallery
          </router-link>
          <template v-if="authStore.isAuthenticated">
            <router-link
              to="/dashboard"
              class="text-comic-dark hover:text-comic-primary font-comic font-semibold transition-colors"
            >
              Dashboard
            </router-link>
            <router-link
              to="/create"
              class="bg-comic-primary text-white px-4 py-2 rounded-full font-comic font-bold hover:bg-comic-primary/90 transition-colors"
            >
              Create Comic
            </router-link>
            <div class="relative" ref="userMenuRef">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-comic-dark hover:text-comic-primary transition-colors"
              >
                <img
                  v-if="authStore.user?.photoURL"
                  :src="authStore.user.photoURL"
                  :alt="authStore.user.displayName || 'User'"
                  class="w-8 h-8 rounded-full"
                />
                <div v-else class="w-8 h-8 bg-comic-secondary rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-sm">
                    {{ (authStore.user?.displayName || 'U')[0].toUpperCase() }}
                  </span>
                </div>
                <ChevronDownIcon class="w-4 h-4" />
              </button>

              <!-- User Dropdown -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              >
                <div class="px-4 py-2 text-sm text-gray-700 border-b">
                  {{ authStore.user?.displayName }}
                  <div class="text-xs text-gray-500">{{ authStore.user?.email }}</div>
                </div>
                <button
                  @click="handleSignOut"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="text-comic-dark hover:text-comic-primary font-comic font-semibold transition-colors"
            >
              Sign In
            </router-link>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="text-comic-dark hover:text-comic-primary p-2"
          >
            <Bars3Icon v-if="!showMobileMenu" class="w-6 h-6" />
            <XMarkIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
        <div class="flex flex-col space-y-4">
          <router-link
            to="/gallery"
            class="text-comic-dark hover:text-comic-primary font-comic font-semibold"
            @click="showMobileMenu = false"
          >
            Gallery
          </router-link>
          <template v-if="authStore.isAuthenticated">
            <router-link
              to="/dashboard"
              class="text-comic-dark hover:text-comic-primary font-comic font-semibold"
              @click="showMobileMenu = false"
            >
              Dashboard
            </router-link>
            <router-link
              to="/create"
              class="bg-comic-primary text-white px-4 py-2 rounded-full font-comic font-bold text-center"
              @click="showMobileMenu = false"
            >
              Create Comic
            </router-link>
            <button
              @click="handleSignOut"
              class="text-left text-comic-dark hover:text-comic-primary font-comic font-semibold"
            >
              Sign Out
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="text-comic-dark hover:text-comic-primary font-comic font-semibold"
              @click="showMobileMenu = false"
            >
              Sign In
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const userMenuRef = ref<HTMLElement>()

const handleSignOut = async () => {
  try {
    await authStore.signOut()
    showUserMenu.value = false
    showMobileMenu.value = false
    router.push('/')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>