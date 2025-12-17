import { createRouter, createWebHistory } from 'vue-router'
import Users from '../views/Users.vue'
import Nodes from '../views/Nodes.vue'
import PreAuthKeys from '../views/PreAuthKeys.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/nodes'
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/nodes',
      name: 'Nodes',
      component: Nodes
    },
    {
      path: '/keys',
      name: 'PreAuthKeys',
      component: PreAuthKeys
    }
  ],
})

export default router
