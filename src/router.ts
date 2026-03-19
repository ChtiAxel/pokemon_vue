import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import SignInPage from './pages/SignInPage.vue'
import SignUpPage from './pages/SignUpPage.vue'

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  {
    path: ROUTES.SIGN_IN,
    component: SignInPage,
    meta: { requiresGuest: true },
  },
  {
    path: ROUTES.SIGN_UP,
    component: SignUpPage,
    meta: { requiresGuest: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
