import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '../components/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'pet-form',
    component: () => import('../components/pet/form/ThePetForm.vue'),
    meta: { title: 'Register your pet' },
  },
  {
    path: '/vuetify-pet-form',
    name: 'vuetify-pet-form',
    component: () => import('../components/VuetifyPetForm.vue'),
    meta: { title: 'Register your pet (Vuetify)' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { title: 'Page not found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = `${to.meta.title} · Pet Registry`
})

export default router
