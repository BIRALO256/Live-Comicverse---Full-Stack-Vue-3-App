<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar />
    
    <main>
      <router-view />
    </main>
    
    <!-- Global Loading Overlay -->
    <div v-if="authStore.loading" class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-comic-primary mx-auto mb-4"></div>
        <p class="text-gray-600 font-comic">Loading Live Comicverse...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initialize()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Bungee&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Comic Neue', cursive;
  line-height: 1.6;
  color: #2C3E50;
}

#app {
  min-height: 100vh;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #FF6B35;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #e55a2b;
}

/* Smooth transitions for route changes */
.router-link-active {
  color: #FF6B35 !important;
}

/* Custom animations */
@keyframes panelReveal {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes bubblePop {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Utility classes */
.comic-shadow {
  box-shadow: 4px 4px 0px #2C3E50;
}

.comic-border {
  border: 3px solid #2C3E50;
}

/* Focus styles for accessibility */
button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #FF6B35;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
</style>