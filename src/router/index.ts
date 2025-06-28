import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/create',
      name: 'Create',
      component: () => import('@/views/CreateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/editor/:id',
      name: 'Editor',
      component: () => import('@/views/EditorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/comic/:id',
      name: 'Viewer',
      component: () => import('@/views/ViewerView.vue')
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: () => import('@/views/GalleryView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router