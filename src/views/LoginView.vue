<template>
  <div class="min-h-screen bg-gradient-to-br from-comic-primary/10 via-white to-comic-secondary/10 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-comic-primary rounded-lg flex items-center justify-center mx-auto mb-4">
          <span class="text-white font-bold text-3xl">LC</span>
        </div>
        <h1 class="font-heading text-3xl text-comic-dark mb-2">Welcome Back!</h1>
        <p class="text-gray-600 font-comic">Sign in to start creating amazing comics</p>
      </div>

      <!-- Auth Form -->
      <div class="bg-white rounded-lg shadow-lg p-8 border-4 border-comic-outline transform rotate-1 hover:rotate-0 transition-transform duration-300">
        <!-- Social Sign In -->
        <div class="space-y-4 mb-6">
          <button
            @click="signInWithGoogle"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-comic font-semibold disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            @click="signInWithFacebook"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-comic font-semibold disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500 font-comic">Or sign in with email</span>
          </div>
        </div>

        <!-- Email Form -->
        <form @submit.prevent="handleEmailAuth" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 font-comic mb-1">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-primary focus:border-transparent font-comic"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 font-comic mb-1">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-primary focus:border-transparent font-comic"
              placeholder="Your password"
            />
          </div>

          <div v-if="isSignUp">
            <label for="displayName" class="block text-sm font-medium text-gray-700 font-comic mb-1">Display Name</label>
            <input
              id="displayName"
              v-model="displayName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-primary focus:border-transparent font-comic"
              placeholder="Your name"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-comic-primary text-white py-3 rounded-lg font-comic font-bold hover:bg-comic-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In') }}
          </button>
        </form>

        <!-- Toggle Sign Up/Sign In -->
        <div class="mt-6 text-center">
          <button
            @click="isSignUp = !isSignUp"
            class="text-comic-primary hover:text-comic-primary/80 font-comic font-semibold"
          >
            {{ isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg font-comic text-sm">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const displayName = ref('')
const isSignUp = ref(false)
const loading = ref(false)
const error = ref('')

const handleEmailAuth = async () => {
  loading.value = true
  error.value = ''

  try {
    if (isSignUp.value) {
      await authStore.signUp(email.value, password.value, displayName.value)
    } else {
      await authStore.signIn(email.value, password.value)
    }
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Authentication failed'
  } finally {
    loading.value = false
  }
}

const signInWithGoogle = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.signInWithGoogle()
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Google sign in failed'
  } finally {
    loading.value = false
  }
}

const signInWithFacebook = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.signInWithFacebook()
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Facebook sign in failed'
  } finally {
    loading.value = false
  }
}
</script>