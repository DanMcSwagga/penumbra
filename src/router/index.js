import Vue from 'vue'
import VueRouter from 'vue-router'

import Viewer from '../views/Viewer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'viewer',
    component: Viewer
  },
  {
    path: '/info',
    name: 'model-info',
    component: () => import('../views/ModelInfo.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
