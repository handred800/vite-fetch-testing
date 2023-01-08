import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../pages/Landing.vue';
import Dashboard from '../pages/Dashboard.vue'

let history = createWebHistory()
let routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing, 
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  }
]

export default createRouter({ history, routes })