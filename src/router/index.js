import Vue from 'vue'
import VueRouter from 'vue-router'

import Viewer from '../views/Viewer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'scene',
    component: Viewer
  }
]

const router = new VueRouter({
  routes
})

export default router
