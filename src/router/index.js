import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/login.vue'
import Register from '../views/register.vue'
import { getToken } from '@/utils/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
     meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      public: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      public: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = getToken()

  if (to.meta?.public) {
    if (token && (to.path === '/login' || to.path === '/register')) {
      next('/')
      return
    }
    next()
    return
  }

  if (to.meta?.requiresAuth && !token) {
    next('/login')
    return
  }

  next()
})

export default router