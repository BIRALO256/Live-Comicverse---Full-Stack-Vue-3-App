import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth'
import type { User } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)

  const initialize = () => {
    authService.onAuthStateChanged((firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  }

  const signIn = async (email: string, password: string) => {
    try {
      const firebaseUser = await authService.signInWithEmail(email, password)
      user.value = firebaseUser
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const firebaseUser = await authService.signUpWithEmail(email, password, displayName)
      user.value = firebaseUser
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const firebaseUser = await authService.signInWithGoogle()
      user.value = firebaseUser
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  const signInWithFacebook = async () => {
    try {
      const firebaseUser = await authService.signInWithFacebook()
      user.value = firebaseUser
    } catch (error) {
      console.error('Facebook sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      user.value = null
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    initialize,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signOut
  }
})