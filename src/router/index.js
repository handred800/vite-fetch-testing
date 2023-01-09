import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../pages/Landing.vue';
import Page from '../pages/Page.vue';
import Dashboard from '../pages/Dashboard.vue';
import Articles from '../pages/Articles.vue';
import Playground from '../pages/Playground.vue';

const history = createWebHistory()
const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing,
    meta: { idRequired: false },
  },
  {
    path: '/',
    component: Page,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { idRequired: true },
      },
      {
        path: '/articles',
        name: 'articles',
        component: Articles,
        meta: { idRequired: true },
      },
      {
        path: '/playground',
        name: 'playground',
        component: Playground,
        meta: { idRequired: true },
      },
    ]
  },
]

const router = createRouter({ history, routes });

export default router;